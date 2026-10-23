import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { mkdtemp, mkdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { transcribeLocalMedia } from "./mediaEnrichment.mjs";

const runProgram = promisify(execFile);
const CHUNK_SECONDS = 600;
const MAX_SEGMENT_BYTES = 24 * 1024 * 1024;
const SUPPORTED_EXTENSIONS = new Set([".mp3", ".mp4", ".m4a", ".wav", ".webm", ".ogg", ".flac", ".mpeg", ".mpga", ".mov"]);
const ALLOWED_RIGHTS = new Set(["owned", "licensed", "permission", "public-domain"]);

export function planSermonChunks(durationSeconds, maxMinutes = 90) {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error("Recording duration was not available.");
  }
  if (!Number.isInteger(maxMinutes) || maxMinutes < 1 || maxMinutes > 240) {
    throw new Error("--max-minutes must be between 1 and 240.");
  }
  if (durationSeconds > maxMinutes * 60) {
    throw new Error("Recording is longer than --max-minutes; explicitly increase the limit to authorize additional transcription costs.");
  }
  const chunks = [];
  for (let start = 0; start < durationSeconds; start += CHUNK_SECONDS) {
    chunks.push({ start, duration: Math.min(CHUNK_SECONDS, durationSeconds - start) });
  }
  return chunks;
}

export function formatVttTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new Error("Caption timestamp must be nonnegative.");
  const total = Math.round(seconds * 1000);
  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor(total / 60000) % 60;
  const secs = Math.floor(total / 1000) % 60;
  const millis = total % 1000;
  return [hours, minutes, secs].map((x) => String(x).padStart(2, "0")).join(":")
    + "." + String(millis).padStart(3, "0");
}

export function assembleTimedVtt(transcriptionChunks) {
  const lines = ["WEBVTT", ""];
  let count = 0;
  for (const chunk of transcriptionChunks) {
    if (!chunk.cues?.length) {
      throw new Error("The transcription API did not supply timed segments. Stop rather than invent playback times.");
    }
    for (const cue of chunk.cues) {
      const start = Number.parseFloat(cue.timestamp);
      const end = Number.parseFloat(cue.endTimestamp);
      const transcriptText = String(cue.text || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start ||
          start > chunk.duration + 2 || end > chunk.duration + 2 || !transcriptText) {
        throw new Error("Malformed or out-of-range timed transcription cue; stop rather than invent timings.");
      }
      lines.push(
        formatVttTime(chunk.start + start) + " --> " + formatVttTime(chunk.start + end),
        transcriptText,
        ""
      );
      count++;
    }
  }
  if (!count) throw new Error("No caption segments to save.");
  return { vtt: lines.join("\n") + "\n", cueCount: count };
}

async function probeDuration(file, runner) {
  let output;
  try {
    output = await runner("ffprobe", [
      "-v", "error", "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1", file,
    ], { timeout: 30000 });
  } catch (error) {
    if (error.code === "ENOENT") throw new Error("ffmpeg/ffprobe is required. Install ffmpeg in Codespaces.");
    throw new Error("Cannot read recording duration: " + String(error.stderr || error.message || "").slice(-350));
  }
  const duration = Number.parseFloat(String(output.stdout || "").trim());
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("Recording duration could not be read.");
  return duration;
}

export async function ingestAuthorizedSermon({
  media, title, publisher, url, rights, rightsEvidence, apiKey,
  outputDir, maxMinutes = 90, transcriber = transcribeLocalMedia, runner = runProgram,
} = {}) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is required.");
  if (!title?.trim() || !publisher?.trim() || !url?.trim()) {
    throw new Error("A source title, publisher, and original source URL are required.");
  }
  if (!ALLOWED_RIGHTS.has(rights) || !rightsEvidence?.trim()) {
    throw new Error("Provide --rights owned|licensed|permission|public-domain and --rights-evidence with a valid authorization record.");
  }
  const ext = path.extname(media || "").toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) throw new Error("Unsupported original recording format: " + ext);
  if (!outputDir || !path.isAbsolute(outputDir) || !outputDir.split(path.sep).includes(".jeremiah-research")) {
    throw new Error("Output must remain in a local .jeremiah-research directory.");
  }
  const fileInfo = await stat(media);
  if (!fileInfo.isFile() || fileInfo.size === 0) throw new Error("The source recording is empty or not a file.");
  const totalSeconds = await probeDuration(media, runner);
  const plan = planSermonChunks(totalSeconds, maxMinutes);
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "jeremiah-authorized-media-"));
  const chunks = [];
  try {
    for (let index = 0; index < plan.length; index++) {
      const { start, duration } = plan[index];
      const audioFile = path.join(tempDir, "part-" + String(index + 1).padStart(3, "0") + ".mp3");
      try {
        await runner("ffmpeg", [
          "-nostdin", "-hide_banner", "-loglevel", "error",
          "-ss", String(start), "-t", String(duration), "-i", media,
          "-map", "0:a:0", "-vn", "-ac", "1", "-ar", "16000",
          "-codec:a", "libmp3lame", "-b:a", "48k", "-y", audioFile,
        ], { timeout: 180000 });
      } catch (error) {
        if (error.code === "ENOENT") throw new Error("ffmpeg is required in Codespaces.");
        throw new Error("Audio conversion failed: " + String(error.stderr || error.message || "").slice(-350));
      }
      const info = await stat(audioFile);
      if (info.size === 0 || info.size >= MAX_SEGMENT_BYTES) {
        throw new Error("Converted audio segment exceeds the transcription limit.");
      }
      // Transcription is restricted to recordings the source owner has authorized for processing.
      const transcript = await transcriber(audioFile, apiKey);
      chunks.push({ start, duration, cues: transcript.cues });
    }
    const { vtt, cueCount } = assembleTimedVtt(chunks);
    const id = createHash("sha256").update(url + "\n" + title + "\n" + fileInfo.size).digest("hex").slice(0, 12);
    const destination = path.join(outputDir, "sermon-" + id + ".vtt");
    await mkdir(outputDir, { recursive: true });
    await writeFile(destination, vtt, { flag: "wx" });
    return {
      output: destination, title, publisher, url, rights, rightsEvidenceRecorded: Boolean(rightsEvidence),
      durationSeconds: Math.round(totalSeconds), chunks: chunks.length,
      timedCues: cueCount, status: "transcribed_unverified",
      caveat: "Whisper and segment offsets can be inaccurate. Check exact video/audio alignment and all theological claims before using a segment in a lesson.",
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
