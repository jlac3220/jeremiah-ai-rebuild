"""Bounded, robots-aware public website crawler for Jeremiah's review-only source index.

Python standard library only. This extracts HTML and embedded-media references,
not the contents of third-party videos or audio streams.
"""
from __future__ import annotations

import argparse
from collections import deque
from datetime import datetime, timezone
from hashlib import sha256
from html.parser import HTMLParser
import ipaddress
import json
from pathlib import Path
import re
import socket
import time
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

AGENT = "JeremiahResearchCrawler/0.1 (+research; respects robots.txt)"
MAX_BODY_BYTES = 1_500_000
MAX_TEXT_CHARS = 20_000
IGNORED_TAGS = {"script", "style", "noscript", "svg", "template", "nav",
                "header", "footer", "form", "aside"}
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input",
             "link", "meta", "param", "source", "track", "wbr"}
SKIP_SUFFIXES = (".pdf", ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg",
                 ".mp3", ".mp4", ".m4a", ".zip", ".doc", ".docx", ".mov", ".woff")
MEDIA_DOMAINS = {"youtube.com", "youtu.be", "vimeo.com", "soundcloud.com",
                 "spotify.com", "transistor.fm", "subsplash.com", "podcasts.apple.com"}
BOOKS = (r"(?:[1-3]\s*)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|"
         r"Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|"
         r"Ecclesiastes|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|"
         r"Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|"
         r"Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|"
         r"Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|"
         r"Hebrews|James|Peter|Jude|Revelation|Deut\.?|Isa\.?|Matt\.?|Rom\.?)")
SCRIPTURE_RE = re.compile(r"\b" + BOOKS + r"\s+\d{1,3}(?::\d{1,3}(?:\s*[-–]\s*\d{1,3})?)?\b", re.I)


def host_is_public(hostname: str) -> bool:
    """Deny localhost/private/IP literals and resolved private networks."""
    if not hostname or hostname in {"localhost", "localhost.localdomain"} or hostname.endswith((".local", ".internal", ".localhost")):
        return False
    try:
        addresses = [ipaddress.ip_address(hostname.strip("[]"))]
    except ValueError:
        try:
            addresses = [ipaddress.ip_address(info[4][0])
                         for info in socket.getaddrinfo(hostname, 443, type=socket.SOCK_STREAM)]
        except OSError:
            return False
    return bool(addresses) and all(address.is_global for address in addresses)


def normalize_url(raw: str, hostname: str) -> str | None:
    try:
        u = urlsplit(raw.strip())
        if (u.scheme != "https" or u.hostname != hostname or u.username or u.password
                or u.port not in (None, 443)):
            return None
        if u.path.lower().endswith(SKIP_SUFFIXES):
            return None
        path = u.path or "/"
        # Retain pagination/WordPress post identifiers but ignore analytics and session keys.
        query = urlencode(sorted((k, v) for k, v in parse_qsl(u.query)
                                 if k in {"p", "page", "paged"}))
        return urlunsplit(("https", hostname, path, query, ""))
    except (ValueError, AttributeError):
        return None


def external_media_link(url: str) -> bool:
    try:
        host = (urlsplit(url).hostname or "").lower()
        return host in MEDIA_DOMAINS or any(host.endswith("." + name) for name in MEDIA_DOMAINS)
    except ValueError:
        return False


def unique(items):
    return list(dict.fromkeys(item for item in items if item))


class SiteHTMLParser(HTMLParser):
    def __init__(self, base_url: str):
        super().__init__(convert_charrefs=True)
        self.base_url = base_url
        self.stack = []
        self.title = ""
        self.description = ""
        self.headings = []
        self.links = []
        self.media = []
        self.feeds = []
        self.all_text = []
        self.main_text = []
        self._title_parts = []
        self._heading_tag = None
        self._heading_parts = []

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag not in VOID_TAGS:
            self.stack.append(tag)
        if tag == "meta" and (attrs.get("name", "").lower() == "description" or
                              attrs.get("property", "").lower() == "og:description"):
            self.description = self.description or attrs.get("content", "")
        if tag == "link" and "alternate" in attrs.get("rel", "").lower():
            if any(kind in attrs.get("type", "").lower() for kind in ("rss", "atom", "xml")):
                self.feeds.append(urljoin(self.base_url, attrs.get("href", "")))
        if tag == "a" and attrs.get("href"):
            href = urljoin(self.base_url, attrs["href"])
            if href.startswith("https://"):
                self.links.append(href)
                if external_media_link(href):
                    self.media.append({"type": "media-link", "url": href})
        if tag in {"iframe", "audio", "video", "source", "embed"} and attrs.get("src"):
            self.media.append({"type": tag, "url": urljoin(self.base_url, attrs["src"])})
        if tag == "a" and attrs.get("type", "").lower().startswith("audio/"):
            self.media.append({"type": "audio-link", "url": urljoin(self.base_url, attrs.get("href", ""))})
        if tag in {"h1", "h2", "h3"} and not any(x in IGNORED_TAGS for x in self.stack):
            self._heading_tag, self._heading_parts = tag, []

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_data(self, data):
        if not data.strip():
            return
        if "title" in self.stack:
            self._title_parts.append(data)
        if any(x in IGNORED_TAGS for x in self.stack) or "head" in self.stack:
            return
        chunk = " ".join(data.split())
        if not chunk:
            return
        self.all_text.append(chunk)
        if "main" in self.stack or "article" in self.stack:
            self.main_text.append(chunk)
        if self._heading_tag:
            self._heading_parts.append(chunk)

    def handle_endtag(self, tag):
        if tag == self._heading_tag:
            heading = " ".join(self._heading_parts).strip()
            if heading:
                self.headings.append(heading[:250])
            self._heading_tag, self._heading_parts = None, []
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i] == tag:
                self.stack = self.stack[:i]
                break

    def summarize(self):
        text = " ".join(self.main_text or self.all_text)
        text = re.sub(r"\s+", " ", text).strip()[:MAX_TEXT_CHARS]
        refs = unique(match.group(0) for match in SCRIPTURE_RE.finditer(text))
        seen_media = set()
        media = []
        for item in self.media:
            key = item["url"]
            if key not in seen_media and key.startswith("https://"):
                seen_media.add(key)
                media.append(item)
        return {
            "title": " ".join(self._title_parts).strip()[:300],
            "description": self.description[:1000],
            "headings": unique(self.headings)[:30],
            "text": text,
            "wordCount": len(text.split()),
            "scriptureReferences": refs[:60],
            "media": media[:80],
            "feeds": unique(self.feeds)[:20],
            "links": unique(self.links),
        }


class SameHostRedirect(HTTPRedirectHandler):
    def __init__(self, hostname):
        self.hostname = hostname

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        next_url = urlsplit(newurl)
        if next_url.scheme != "https" or next_url.hostname != self.hostname:
            raise ValueError("Cross-origin redirect blocked during crawling.")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def download(url: str, hostname: str):
    if urlsplit(url).hostname != hostname or not host_is_public(hostname):
        raise ValueError("Refusing a non-public or off-site URL.")
    opener = build_opener(SameHostRedirect(hostname))
    request = Request(url, headers={"User-Agent": AGENT, "Accept": "text/html,application/xml,text/xml,text/plain,*/*;q=0.1"})
    try:
        with opener.open(request, timeout=15) as response:
            raw = response.read(MAX_BODY_BYTES + 1)
            if len(raw) > MAX_BODY_BYTES:
                raise ValueError("Content exceeded the per-page safety limit.")
            content_type = response.headers.get("Content-Type", "").lower()
            charset = response.headers.get_content_charset() or "utf-8"
            return response.status, content_type, raw.decode(charset, errors="replace")
    except HTTPError as error:
        return error.code, "", ""


class WebsiteCrawler:
    def __init__(self, site: str, max_pages: int = 30, depth: int = 4,
                 delay: float = 0.8, fetcher=None):
        u = urlsplit(site)
        if (u.scheme != "https" or not u.hostname or u.username or u.password
                or u.port not in (None, 443)):
            raise ValueError("Supply a public HTTPS website address.")
        if not 1 <= max_pages <= 300:
            raise ValueError("max_pages must be 1–300 per run.")
        if not 0 <= depth <= 10 or not 0 <= delay <= 30:
            raise ValueError("depth must be 0–10 and delay 0–30 seconds.")
        self.hostname = u.hostname.lower()
        self.root = normalize_url(site, self.hostname)
        if not self.root:
            raise ValueError("Invalid website URL.")
        self.max_pages, self.depth, self.delay = max_pages, depth, delay
        self.fetcher = fetcher or (lambda url: download(url, self.hostname))
        self.warnings = []
        self.visited = set()
        self.last_fetch = 0.0
        self.robots = RobotFileParser()
        self.robots.set_url("https://" + self.hostname + "/robots.txt")
        self.robot_status = "unknown"

    def request(self, url):
        if self.last_fetch:
            time.sleep(max(0.0, self.delay - (time.monotonic() - self.last_fetch)))
        try:
            return self.fetcher(url)
        finally:
            self.last_fetch = time.monotonic()

    def load_robots(self):
        url = "https://" + self.hostname + "/robots.txt"
        try:
            code, _, body = self.request(url)
            if code == 404 or code == 410:
                self.robot_status = "not-found"
                self.robots.parse([])
            elif code == 200:
                if len(body) > 500000:
                    raise ValueError("robots.txt too large")
                self.robot_status = "loaded"
                self.robots.parse(body.splitlines())
            else:
                raise ValueError("robots.txt returned HTTP " + str(code))
        except Exception as error:
            self.robot_status = "unavailable"
            raise ValueError("Cannot verify robots.txt; crawl stopped: " + str(error))

    def allowed(self, url):
        return self.robots.can_fetch(AGENT, url)

    def sitemap_urls(self):
        candidates = {"https://" + self.hostname + "/sitemap.xml"}
        # Respect Sitemap directives found in robots.txt. The parser exposes the list.
        candidates.update(url for url in (self.robots.site_maps() or [])
                          if normalize_url(url, self.hostname))
        found = []
        checked = set()
        while candidates and len(checked) < 4 and len(found) < 1000:
            url = candidates.pop()
            if url in checked or not self.allowed(url):
                continue
            checked.add(url)
            try:
                code, _, body = self.request(url)
                if code != 200 or "<loc>" not in body:
                    continue
                root = ET.fromstring(body)
                for node in root.iter():
                    if not node.tag.endswith("loc") or not node.text:
                        continue
                    candidate = normalize_url(node.text, self.hostname)
                    if not candidate:
                        continue
                    if candidate.endswith(".xml"):
                        candidates.add(candidate)
                    elif len(found) < 1000:
                        found.append(candidate)
            except Exception as error:
                self.warnings.append("sitemap " + url + ": " + str(error)[:120])
        return unique(found)

    def crawl(self):
        self.load_robots()
        queue = deque([(self.root, 0)])
        for sitemap_url in self.sitemap_urls():
            if sitemap_url != self.root:
                queue.append((sitemap_url, 1))
        queued = set(url for url, _ in queue)
        pages = []
        blocked = 0
        while queue and len(pages) < self.max_pages:
            url, level = queue.popleft()
            if url in self.visited:
                continue
            self.visited.add(url)
            if not self.allowed(url):
                blocked += 1
                continue
            try:
                status, mime, html = self.request(url)
                if status != 200:
                    self.warnings.append(url + ": HTTP " + str(status))
                    continue
                if "html" not in mime and not (mime == "" and html.lstrip().lower().startswith(("<!doctype html", "<html"))):
                    continue
                parser = SiteHTMLParser(url)
                parser.feed(html)
                data = parser.summarize()
                page_links = data.pop("links")
                page = {
                    "url": url, "crawlDepth": level, "status": "extracted_unreviewed",
                    **data, "textHash": sha256(data["text"].encode()).hexdigest()[:16],
                }
                pages.append(page)
                if level < self.depth:
                    for href in page_links:
                        link = normalize_url(href, self.hostname)
                        if link and link not in queued and link not in self.visited:
                            queue.append((link, level + 1))
                            queued.add(link)
            except Exception as error:
                self.warnings.append(url + ": " + str(error)[:200])
        return {
            "sourceUrl": self.root, "hostname": self.hostname,
            "indexedAt": datetime.now(timezone.utc).isoformat(),
            "robotsStatus": self.robot_status, "pagesExtracted": len(pages),
            "pagesVisited": len(self.visited), "blockedByRobots": blocked,
            "pages": pages, "warnings": self.warnings[:80],
            "review": {"sourceIdentity": False, "accuracy": False,
                       "doctrinalAlignment": False, "reusePermissions": False,
                       "lessonApproved": False},
            "note": "Page text and media URLs only. No video/audio transcription, JS rendering, or cross-site crawling. Review accuracy, doctrine and rights before lesson use.",
        }


def main():
    parser = argparse.ArgumentParser(description="Crawl publicly accessible website pages into Jeremiah's review-only index.")
    parser.add_argument("--site", required=True, help="Public HTTPS website to crawl")
    parser.add_argument("--max-pages", type=int, default=30)
    parser.add_argument("--depth", type=int, default=4)
    parser.add_argument("--delay-ms", type=int, default=800)
    parser.add_argument("--out", help="Local JSON file inside .jeremiah-research/")
    args = parser.parse_args()
    out = Path(args.out or ".jeremiah-research/site-crawl-" +
               sha256(args.site.encode()).hexdigest()[:12] + ".json").resolve()
    if ".jeremiah-research" not in out.parts:
        parser.error("Output must be inside a .jeremiah-research directory.")
    try:
        result = WebsiteCrawler(args.site, args.max_pages, args.depth,
                                args.delay_ms / 1000).crawl()
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    except Exception as error:
        parser.error(str(error))
    print(json.dumps({
        "output": str(out), "sourceUrl": result["sourceUrl"],
        "robotsStatus": result["robotsStatus"], "pagesExtracted": result["pagesExtracted"],
        "pagesVisited": result["pagesVisited"], "blockedByRobots": result["blockedByRobots"],
        "pages": [{"title": p["title"], "url": p["url"],
                   "words": p["wordCount"], "scripture": p["scriptureReferences"][:5],
                   "media": len(p["media"])} for p in result["pages"]],
        "warnings": result["warnings"], "note": result["note"],
    }, indent=2))


if __name__ == "__main__":
    main()
