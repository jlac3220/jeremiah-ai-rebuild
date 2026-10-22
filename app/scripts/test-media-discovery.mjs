import test from "node:test";
import assert from "node:assert/strict";
import {
  TRUSTED_MEDIA_FEEDS,
  parseYoutubeFeed,
  rankDiscoveryCandidates,
  discoverMediaCandidates,
} from "../server/mediaDiscovery.mjs";

const feedXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/">',
  '<entry><yt:videoId>abcdefghijk</yt:videoId><title>Shema &amp; listening to the LORD</title>',
  '<published>2026-10-22T10:00:00+00:00</published>',
  '<media:group><media:description>Explore hearing and responding to Deuteronomy.</media:description></media:group></entry>',
  '<entry><yt:videoId>12345678901</yt:videoId><title>Unrelated cooking recipe</title>',
  '<published>2026-10-20T10:00:00+00:00</published></entry>',
  '</feed>',
].join("\n");

test("parses a public YouTube Atom feed without downloading videos", () => {
  const entries = parseYoutubeFeed(feedXml, "BibleProject");
  assert.equal(entries.length, 2);
  assert.equal(entries[0].title, "Shema & listening to the LORD");
  assert.equal(entries[0].url, "https://www.youtube.com/watch?v=abcdefghijk");
  assert.equal(entries[0].publishedAt, "2026-10-22T10:00:00+00:00");
  assert.throws(() => parseYoutubeFeed("<html>Not Atom</html>"), /Not a YouTube/);
});

test("ranks standard-specific metadata matches without pretending to validate teaching", () => {
  const ranked = rankDiscoveryCandidates("OG.1.1.18", parseYoutubeFeed(feedXml, "BibleProject"));
  assert.equal(ranked.length, 1);
  assert.match(ranked[0].title, /Shema/);
  assert.ok(ranked[0].matchTerms.includes("shema"));
  assert.equal(ranked[0].status, "discovery_candidate");
  assert.equal(ranked[0].rights, "external-reference");
  assert.equal(ranked[0].review.lessonApproved, false);
});

test("discovers approved-feed candidates alongside existing classroom sources", async () => {
  let count = 0;
  const fetcher = async (url, options) => {
    count++;
    assert.equal(url, TRUSTED_MEDIA_FEEDS[0].feedUrl);
    assert.equal(options.method, "GET");
    return { ok: true, text: async () => feedXml };
  };
  const result = await discoverMediaCandidates({ standardId: "OG.1.1.18", fetcher });
  assert.equal(count, 1);
  assert.equal(result.status, "needs_review");
  assert.ok(result.candidates.some((item) =>
    item.origin === "existing-classroom-resource" && /Shema/i.test(item.title)));
  assert.ok(result.candidates.some((item) =>
    item.origin === "trusted-channel-feed" && /Shema/i.test(item.title)));
  assert.equal(result.warnings.length, 0);
});

test("feed failure does not hide existing curated resources and unapproved feeds are refused", async () => {
  const failing = await discoverMediaCandidates({
    standardId: "OG.1.1.18",
    fetcher: async () => { throw new Error("offline"); },
  });
  assert.equal(failing.warnings.length, 1);
  assert.ok(failing.candidates.some((x) => x.origin === "existing-classroom-resource"));

  let called = false;
  const blocked = await discoverMediaCandidates({
    standardId: "OG.1.1.18",
    feeds: [{ id: "unknown", publisher: "Fake", feedUrl: "https://example.com/feed" }],
    fetcher: async () => { called = true; return { ok: true, text: async () => feedXml }; },
  });
  assert.equal(called, false);
  assert.match(blocked.warnings[0], /allowlist/i);
  await assert.rejects(discoverMediaCandidates({ standardId: "NOT_A_STANDARD", feeds: [] }), /Unknown standard/);
});
