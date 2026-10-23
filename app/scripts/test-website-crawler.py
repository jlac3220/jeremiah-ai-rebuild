import importlib.util
from pathlib import Path
import tempfile
import unittest

module_file = Path(__file__).resolve().parents[1] / "server" / "websiteCrawler.py"
spec = importlib.util.spec_from_file_location("jeremiah_site_crawler", module_file)
crawler = importlib.util.module_from_spec(spec)
spec.loader.exec_module(crawler)


class WebsiteCrawlerTests(unittest.TestCase):
    def test_html_content_scripture_and_embeds(self):
        sample = """
        <!doctype html><html><head><title>New Birth Teaching</title>
        <meta name="description" content="Read and watch a Bible study" />
        <link rel="alternate" type="application/rss+xml" href="/feed/" />
        </head><body><nav>Give online and Donate</nav><main><article>
        <h1>New Birth</h1><p>Jesus teaches about being born again in John 3:5.
        Peter calls us to repent in Acts 2:38.</p>
        <iframe src="https://www.youtube.com/embed/JSFGj1qFbQ0"></iframe>
        <a href="/teaching/second">Next teaching</a>
        </article></main><footer>Address</footer></body></html>
        """
        parser = crawler.SiteHTMLParser("https://example.org/teaching")
        parser.feed(sample)
        out = parser.summarize()
        self.assertEqual(out["title"], "New Birth Teaching")
        self.assertIn("John 3:5", out["scriptureReferences"])
        self.assertIn("Acts 2:38", out["scriptureReferences"])
        self.assertIn("New Birth", out["headings"])
        self.assertNotIn("Donate", out["text"])
        self.assertEqual(out["media"][0]["type"], "iframe")
        self.assertIn("https://example.org/teaching/second", out["links"])
        self.assertEqual(out["feeds"], ["https://example.org/feed/"])

    def test_urls_no_external_crawl(self):
        self.assertEqual(crawler.normalize_url("https://example.org/page/?utm_source=abc&page=2#top",
                                               "example.org"), "https://example.org/page/?page=2")
        for uri in ["http://example.org", "https://attacker.org/",
                    "https://example.org@attacker.org/", "https://example.org/file.mp4",
                    "https://example.org:8080/private"]:
            self.assertIsNone(crawler.normalize_url(uri, "example.org"))
        self.assertFalse(crawler.host_is_public("localhost"))
        self.assertFalse(crawler.host_is_public("127.0.0.1"))
        self.assertFalse(crawler.host_is_public("192.168.0.1"))

    def test_robots_blocks_and_sitemap_is_extracted(self):
        fixtures = {
            "https://example.org/robots.txt": (200, "text/plain", "User-agent: *\nDisallow: /private/\n"),
            "https://example.org/sitemap.xml": (200, "application/xml",
              "<urlset><url><loc>https://example.org/teachings</loc></url>"
              "<url><loc>https://example.org/private/secret</loc></url></urlset>"),
            "https://example.org/": (200, "text/html",
              '<html><main><h1>Home</h1><a href="/more">More</a></main></html>'),
            "https://example.org/teachings": (200, "text/html",
              "<html><main><h1>Teaching</h1><p>Repent and be baptized: Acts 2:38.</p></main></html>"),
            "https://example.org/more": (200, "text/html",
              "<html><main><h1>More</h1><a href='/private/secret'>Private</a></main></html>"),
        }
        requests = []

        def fake_fetch(url):
            requests.append(url)
            return fixtures.get(url, (404, "", ""))

        result = crawler.WebsiteCrawler("https://example.org/", max_pages=10,
                                        depth=4, delay=0, fetcher=fake_fetch).crawl()
        self.assertEqual(result["robotsStatus"], "loaded")
        self.assertEqual(result["pagesExtracted"], 3)
        self.assertEqual(result["blockedByRobots"], 1)
        self.assertNotIn("https://example.org/private/secret", requests)
        teachings = next(p for p in result["pages"] if p["url"].endswith("/teachings"))
        self.assertEqual(teachings["scriptureReferences"], ["Acts 2:38"])
        self.assertFalse(result["review"]["lessonApproved"])

    def test_unavailable_robots_stops_crawl(self):
        def fake_fetch(url):
            if url.endswith("/robots.txt"):
                return (503, "", "")
            raise AssertionError("Should not crawl beyond robots.txt")
        with self.assertRaisesRegex(ValueError, "robots.txt"):
            crawler.WebsiteCrawler("https://example.org",
                                  delay=0, fetcher=fake_fetch).crawl()


if __name__ == "__main__":
    unittest.main()
