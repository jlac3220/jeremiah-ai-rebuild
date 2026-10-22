import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { rankDiscoveryCandidates } from "./mediaDiscovery.mjs";

const execFileAsync = promisify(execFile);
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export function normalizeChannelUrl(raw) {
  let url;
  try { url = new URL(String(raw || "")); }
  catch { throw new Error("Provide an absolute YouTube channel URL."); }
  if (url.protocol !== "https:" || !["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) {
    throw new Error("The channel must be hosted at https://www.youtube.com.");
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 1 || !(/^@[a-z0-9._-]+$/i.test(parts[0]) || /^channel$/i.test(parts[0]) && /^UC[A-Za-z0-9_-]{22}$/.test(parts[1] || ""))) {
    throw new Error("Use a YouTube /@handle/videos or /channel/UC.../videos URL.");
  }
  if (parts.length > 2 || (parts[1] && parts[1] !== "videos" && parts[0].startsWith("@")) || (parts[0] === "channel" && parts[2] && parts[2] !== "videos") || parts.length > 3) {
    throw new Error("Use the channel's videos page, not a playlist or unrelated URL.");
  }
  return "https://www.youtube.com/" + parts[0] + (parts[0] === "channel" ? "/" + parts[1] : "") + "/videos";
}

export function normalizeVideoUrl(raw) {
  const input = String(raw || "");
  if (VIDEO_ID.test(input)) return "https://www.youtube.com/watch?v=" + input;
  let url;
  try { url = new URL(input); }
  catch { throw new Error("Supply a YouTube watch URL or 11-character video ID."); }
  if (url.protocol !== "https:" || !["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(url.hostname)) {
    throw new Error("Only YouTube video URLs are allowed.");
  }
  const id = url.hostname === "youtu.be" ? url.pathname.slice(1)
    : url.pathname === "/watch" ? url.searchParams.get("v")
    : url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2]
    : "";
  if (!VIDEO_ID.test(id || "")) throw new Error("A valid 11-character video ID is required.");
  return "https://www.youtube.com/watch?v=" + id;
}

export function parseFlatPlaylist(raw, { channelUrl, limit = 80, standardId = "" } = {}) {
  let playlist;
  try { playlist = JSON.parse(raw); }
  catch { throw new Error("The YouTube extractor returned invalid JSON."); }
  if (!playlist || !Array.isArray(playlist.entries)) throw new Error("The extractor did not return a channel videos playlist.");
  const seen = new Set();
  const videos = [];
  for (const item of playlist.entries) {
    if (!item || !VIDEO_ID.test(item.id || "") || !item.title || seen.has(item.id) || item.is_live === true) continue;
    seen.add(item.id);
    videos.push({
      id: "youtube-" + item.id,
      videoId: item.id,
      title: String(item.title),
      publisher: String(item.channel || playlist.channel || playlist.uploader || "Unverified channel"),
      description: String(item.description || "").slice(0, 1000),
      url: "https://www.youtube.com/watch?v=" + item.id,
      durationSeconds: Number.isFinite(item.duration) ? item.duration : null,
      publishedAt: item.upload_date || item.release_timestamp || "",
      origin: "channel-video-catalog",
      rights: "external-reference",
      status: "discovery_candidate",
      review: { sourceIdentity: false, factualClaims: false, doctrinalAlignment: false, reusePermissions: false, lessonApproved: false },
    });
    if (videos.length >= limit) break;
  }
  const matches = standardId ? rankDiscoveryCandidates(standardId, videos, 50) : [];
  return {
    channelUrl,
    channelTitle: String(playlist.channel || playlist.uploader || ""),
    channelId: String(playlist.channel_id || ""),
    status: "needs_review",
    contentReviewed: false,
    captionsReviewed: false,
    queriedCount: playlist.entries.length,
    extractedCount: videos.length,
    standardId,
    videos,
    titleMatchCandidates: matches,
    note: "This is catalog metadata, NOT a doctrinal or teaching-content review. Title matches can miss relevant sermons. Obtain public captions separately; do not automatically publish clips or transcripts.",
  };
}

export async function invokeYtDlp(binary, args, runner = execFileAsync) {
  try {
    const result = await runner(binary, args, {
      maxBuffer: 16 * 1024 * 1024,
      timeout: 180000,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });
    return String(result.stdout || "");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error("yt-dlp is not installed. Install it in a temporary Python virtual environment and pass --binary /tmp/jeremiah-yt/bin/yt-dlp.");
    }
    const detail = (error.stderr || error.message || "").toString().trim().slice(-500);
    throw new Error("YouTube extraction failed: " + detail);
  }
}

export async function extractChannelCatalog({ channelUrl, limit = 80, standardId = "", binary = "yt-dlp", runner } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) throw new Error("--limit must be between 1 and 200.");
  const url = normalizeChannelUrl(channelUrl);
  const stdout = await invokeYtDlp(binary, [
    "--flat-playlist", "--playlist-end", String(limit), "--dump-single-json",
    "--no-warnings", "--no-progress", "--socket-timeout", "20", "--retries", "1", url,
  ], runner);
  return parseFlatPlaylist(stdout, { channelUrl: url, limit, standardId });
}

export async function extractPublicCaptions({ video, outputDir, language = "en", binary = "yt-dlp", runner } = {}) {
  const url = normalizeVideoUrl(video);
  if (!outputDir || !path.isAbsolute(outputDir)) throw new Error("A full absolute caption output directory is required.");
  if (!/^[a-z]{2,3}(?:-[a-zA-Z]{2,8})?$/.test(language)) throw new Error("Caption language must be a simple language code.");
  const videoId = new URL(url).searchParams.get("v");
  await invokeYtDlp(binary, [
    "--skip-download", "--no-playlist", "--write-subs", "--write-auto-subs",
    "--sub-langs", language + ".*," + language, "--sub-format", "vtt",
    "--no-overwrites", "--no-progress", "--socket-timeout", "20", "--retries", "1",
    "--paths", "home:" + outputDir, "--output", "%(id)s.%(ext)s", url,
  ], runner);
  const files = (await readdir(outputDir)).filter((name) =>
    name.startsWith(videoId + ".") && name.endsWith(".vtt") && /^[A-Za-z0-9_.-]+$/.test(name)
  );
  return {
    videoUrl: url,
    captions: files.map((name) => path.join(outputDir, name)),
    status: files.length ? "captions_downloaded_for_review" : "no_public_captions_available",
    note: "Caption availability does not prove completeness or accuracy. These files remain local for review, not republished or automatically inserted into lessons.",
  };
}
