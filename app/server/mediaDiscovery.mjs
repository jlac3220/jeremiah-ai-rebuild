import { createHash } from "node:crypto";
import { classroomContentRegistry } from "../src/core/classroom/content/classroomContentRegistry.js";
import { standardMediaBrief } from "./mediaEnrichment.mjs";

// Editorial allowlist. Adding another publisher requires explicitly reviewing its feed first.
export const TRUSTED_MEDIA_FEEDS = Object.freeze([
  {
    id: "bibleproject-youtube",
    publisher: "BibleProject",
    feedUrl: "https://www.youtube.com/feeds/videos.xml?channel_id=UCVfwlh9XpX2Y_tQfjeln9QA",
  },
]);

const IGNORE = new Set([
  "the", "and", "for", "from", "with", "that", "this", "what", "does", "how",
  "who", "why", "are", "was", "were", "has", "have", "about", "into", "there",
  "your", "their", "them", "you", "his", "her", "our", "one", "god", "lord",
  "biblical", "bible", "truth", "teaching", "doctrinal", "foundation",
  "positive", "controlling", "required", "scripture", "reference", "lesson",
  "know", "explain", "understand", "understanding", "another", "beside",
]);

function decodeXml(text) {
  return text.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi, (entity) => {
    const val = entity.slice(1, -1);
    if (val[0] === "#") {
      const hex = val[1]?.toLowerCase() === "x";
      const number = Number.parseInt(val.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(number) && number >= 0 && number <= 0x10ffff
        ? String.fromCodePoint(number) : entity;
    }
    return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[val.toLowerCase()] || entity;
  });
}
function getTag(xml, tag) {
  const match = xml.match(new RegExp("<" + tag.replace(":", "\\:") + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag.replace(":", "\\:") + ">", "i"));
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/<[^>]+>/g, " ").trim()).replace(/\s+/g, " ") : "";
}
function tokens(value) {
  return [...new Set(String(value || "").toLowerCase()
    .replace(/[’']/g, "").match(/[a-z]{4,}/g)?.filter((x) => !IGNORE.has(x)) || [])];
}

export function parseYoutubeFeed(xml, publisher = "Unknown publisher") {
  if (!xml.includes("<feed") || !xml.includes("youtube.com/xml/schemas/2015")) {
    throw new Error("Not a YouTube Atom feed.");
  }
  const seen = new Set();
  const items = [];
  for (const block of xml.match(/<entry\b[^>]*>[\s\S]*?<\/entry>/g) || []) {
    const videoId = getTag(block, "yt:videoId");
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId) || seen.has(videoId)) continue;
    seen.add(videoId);
    items.push({
      id: "youtube-" + videoId,
      title: getTag(block, "title"),
      description: getTag(block, "media:description").slice(0, 750),
      publisher,
      url: "https://www.youtube.com/watch?v=" + videoId,
      publishedAt: getTag(block, "published"),
      origin: "trusted-channel-feed",
    });
  }
  return items.filter((item) => item.title);
}
function curriculumVideos(standardId) {
  const content = classroomContentRegistry[standardId];
  const result = [];
  const collect = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const v of value) collect(v);
      return;
    }
    if (Array.isArray(value.curatedSources)) {
      for (const item of value.curatedSources) {
        if (item.type === "video" && item.url && item.title) {
          result.push({
            id: String(item.id || "curated-video"),
            title: item.title,
            description: String(item.summary || item.hook || ""),
            publisher: String(item.provider || "Unspecified publisher"),
            url: item.url,
            publishedAt: "",
            origin: "existing-classroom-resource",
          });
        }
      }
    }
    // Instructional content is nested under moves, encounters and presentation sections.
    for (const [key, child] of Object.entries(value)) {
      if (key !== "curatedSources" && child && typeof child === "object") collect(child);
    }
  };
  collect(content.instructionalMoves || []);
  return result;
}

export function rankDiscoveryCandidates(standardId, candidates, limit = 12) {
  const brief = standardMediaBrief(standardId);
  const weights = new Map();
  const add = (words, weight) => {
    for (const term of tokens(words)) weights.set(term, Math.max(weight, weights.get(term) || 0));
  };
  add(brief.title, 5);
  add(brief.scope, 2);
  for (const knowledge of brief.requiredKnowledge) {
    add(knowledge.title, 2);
    add(knowledge.description, 1);
  }
  for (const verse of brief.scripture) add(verse.reference, 2);

  const seen = new Set();
  const ranked = [];
  for (const item of candidates) {
    let url;
    try { url = new URL(item.url); } catch { continue; }
    if (url.protocol !== "https:" || seen.has(url.href)) continue;
    seen.add(url.href);
    const inTitle = tokens(item.title);
    const inDescription = tokens(item.description);
    const matches = [...weights.keys()].filter((key) => inTitle.includes(key) || inDescription.includes(key));
    const score = matches.reduce((sum, word) => sum + (weights.get(word) || 0) * (inTitle.includes(word) ? 3 : 1), 0);
    if (!score && item.origin !== "existing-classroom-resource") continue;
    ranked.push({
      ...item,
      matchScore: score,
      matchTerms: matches.slice(0, 8),
      matchReason: item.origin === "existing-classroom-resource"
        ? "Already referenced by the classroom; review status and usefulness still require confirmation."
        : "Potential title/description keyword match only; the content has not been reviewed.",
      standardId,
      status: "discovery_candidate",
      rights: "external-reference",
      review: { sourceIdentity: false, factualClaims: false, doctrinalAlignment: false, reusePermissions: false, lessonApproved: false },
    });
  }
  return ranked.sort((a, b) => b.matchScore - a.matchScore || a.title.localeCompare(b.title)).slice(0, Math.max(1, Math.min(50, limit)));
}

export async function discoverMediaCandidates({
  standardId, limit = 12, fetcher = fetch, feeds = TRUSTED_MEDIA_FEEDS,
} = {}) {
  standardMediaBrief(standardId);
  const candidates = curriculumVideos(standardId);
  const warnings = [];
  for (const feed of feeds) {
    try {
      if (!TRUSTED_MEDIA_FEEDS.some((allowed) => allowed.id === feed.id && allowed.feedUrl === feed.feedUrl)) {
        throw new Error("Feed must be on the editorial allowlist.");
      }
      const response = await fetcher(feed.feedUrl, { method: "GET", signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const xml = await response.text();
      if (xml.length > 1024 * 1024) throw new Error("Feed exceeds size limit.");
      candidates.push(...parseYoutubeFeed(xml, feed.publisher));
    } catch (err) {
      warnings.push(feed.id + ": " + err.message);
    }
  }
  const ranked = rankDiscoveryCandidates(standardId, candidates, limit);
  const fingerprint = createHash("sha256").update(standardId + JSON.stringify(ranked.map((item) => item.url))).digest("hex").slice(0, 12);
  return {
    id: "discovery-" + fingerprint,
    standardId,
    status: "needs_review",
    feedsChecked: feeds.length,
    candidates: ranked,
    warnings,
    note: "Metadata-only suggestions; no videos, captions, or claims verified. Do not publish without human review.",
  };
}
