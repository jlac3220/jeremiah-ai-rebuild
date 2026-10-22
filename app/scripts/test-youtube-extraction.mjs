import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeChannelUrl, normalizeVideoUrl, parseFlatPlaylist,
  extractChannelCatalog, extractPublicCaptions,
} from "../server/youtubeChannelImport.mjs";

const channel = "https://www.youtube.com/@Promiseapostolic/videos";
const videoId = "AbcDE123_-0";

test("accepts the intended YouTube handle videos page, never offsite or playlists", () => {
  assert.equal(normalizeChannelUrl(channel), channel);
  assert.equal(normalizeChannelUrl("https://youtube.com/@Promiseapostolic"),
    channel);
  for (const unsafe of [
    "https://evil.example/@Promiseapostolic/videos",
    "http://www.youtube.com/@Promiseapostolic/videos",
    "https://www.youtube.com/@Promiseapostolic/playlists",
    "https://www.youtube.com/playlist?list=PLbad",
  ]) assert.throws(() => normalizeChannelUrl(unsafe));
});

test("accepts a video ID or canonical YouTube video URL", () => {
  const canonical = "https://www.youtube.com/watch?v=" + videoId;
  assert.equal(normalizeVideoUrl(videoId), canonical);
  assert.equal(normalizeVideoUrl("https://youtu.be/" + videoId), canonical);
  assert.equal(normalizeVideoUrl(canonical + "&list=PLabc"), canonical);
  assert.throws(() => normalizeVideoUrl("https://attacker.com/watch?v=" + videoId));
  assert.throws(() => normalizeVideoUrl("video not known"));
});

test("imports metadata and removes invalid or duplicate entries, without authorizing content", () => {
  const raw = JSON.stringify({
    channel: "Promise Church", channel_id: "UCexample",
    entries: [
      { id: videoId, title: "The Shema explained", duration: 480, description: "Deuteronomy 6:4" },
      { id: videoId, title: "Duplicate upload" },
      { id: "invalid", title: "Wrong ID" },
      { id: "CdeFG234_-1", title: "The new birth", duration: 123 },
    ],
  });
  const parsed = parseFlatPlaylist(raw, { channelUrl: channel, standardId: "OG.1.1.18" });
  assert.equal(parsed.extractedCount, 2);
  assert.equal(parsed.videos[0].url, "https://www.youtube.com/watch?v=" + videoId);
  assert.equal(parsed.videos[0].status, "discovery_candidate");
  assert.equal(parsed.videos[0].review.lessonApproved, false);
  assert.equal(parsed.contentReviewed, false);
  assert.ok(parsed.titleMatchCandidates.some((item) => item.title === "The Shema explained"));
  assert.ok(!parsed.titleMatchCandidates.some((item) => item.title === "The new birth"));
  assert.throws(() => parseFlatPlaylist("{}"), /videos playlist/);
});

test("channel extraction uses a bounded flat listing without downloading media", async () => {
  let invoked = false;
  const runner = async (binary, args) => {
    invoked = true;
    assert.equal(binary, "/tmp/jeremiah-yt/bin/yt-dlp");
    assert.deepEqual(args.slice(0, 4),
      ["--flat-playlist", "--playlist-end", "2", "--dump-single-json"]);
    assert.equal(args.at(-1), channel);
    assert.ok(!args.includes("--write-subs"));
    return { stdout: JSON.stringify({ channel: "Promise Church",
      entries: [{ id: videoId, title: "Shema" }] }) };
  };
  const parsed = await extractChannelCatalog({
    channelUrl: channel, limit: 2, binary: "/tmp/jeremiah-yt/bin/yt-dlp", runner,
  });
  assert.equal(invoked, true);
  assert.equal(parsed.extractedCount, 1);
  await assert.rejects(extractChannelCatalog({ channelUrl: channel, limit: 300, runner }), /limit/);
});

test("caption collection requests only subtitle files with no video download", async () => {
  const runner = async (_binary, args) => {
    assert.ok(args.includes("--skip-download"));
    assert.ok(args.includes("--write-subs"));
    assert.ok(args.includes("--write-auto-subs"));
    assert.ok(args.includes("--no-playlist"));
    assert.ok(!args.includes("--write-video"));
    assert.equal(args.at(-1), "https://www.youtube.com/watch?v=" + videoId);
    return { stdout: "Captions unavailable" };
  };
  const outputDir = "/tmp/jeremiah-youtube-empty-captions-test";
  const { mkdir } = await import("node:fs/promises");
  await mkdir(outputDir, { recursive: true });
  const result = await extractPublicCaptions({ video: videoId, outputDir, runner });
  assert.equal(result.status, "no_public_captions_available");
  assert.deepEqual(result.captions, []);
});
