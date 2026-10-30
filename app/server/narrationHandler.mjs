import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ogLesson from "../src/core/classroom/content/OG_1_LESSON.js";

// One narrator for every phone and computer. Never use the device's TTS voices.
// This Speech API model is a temporary generation backend; generated MP3s are
// cached as stable files so future voice-provider migrations do not change them.
export const NARRATOR = Object.freeze({
  model: "gpt-4o-mini-tts",
  voice: "ash",
  speed: 0.93,
  instructions:
    "You are Jeremiah, a warm, mature American male Bible teacher. " +
    "Use a deep, resonant, unhurried documentary narration with calm authority, " +
    "natural pauses, clear American English and carefully articulated KJV Scripture. " +
    "Avoid theatrical imitation, caricature, dramatic yelling, and any non-American accent.",
  version: "jeremiah-ash-v1",
});

// Keep this endpoint limited to the authored curriculum, not a public
// arbitrary-text TTS generator. Reading passages are derived from OG.1 content.
const AUTHORED_LINES = [
  "Hear, O Israel: The LORD our God is one LORD.",
  "Hear, O Israel. The LORD our God is one LORD. And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.",
  "Before me there was no God formed, neither shall there be after me.",
  "Beside me there is no God.",
  "Neither shall there be after me.",
  "The LORD our God is one LORD.",
  "The Lord our God is one Lord.",
  "There is none other God but one.",
  "Hear, O Israel: The LORD our God is one LORD. In the wilderness Moses gives the confession to Israel.",
  "I am the first, and I am the last; and beside me there is no God. Isaiah chapter forty four, verse six.",
  "Jesus repeats the Shema. The apostles declare, there is none other God but one.",
  "Hear, O Israel.",
  "The Lord our God.",
  "Is one Lord.",
  "And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.",
  "Hear, O Israel: The LORD our God is one LORD. Moses gives the confession to Israel.",
  "I am the first, and I am the last; and beside me there is no God. Isaiah, chapter forty four, verse six.",
  "There is none other God but one. First Corinthians, chapter eight, verse four.",
];

const allowedText = new Set([
  ...AUTHORED_LINES,
  ...ogLesson.instructionalMoves.flatMap(move =>
    (move.scripture || []).map(verse => verse.text).filter(Boolean)
  ),
]);

// Auditions use the very same KJV verse and reading directions for fair comparison.
// The installed voice on the listener's device never affects the result.
const AUDITION_TEXT = "Hear, O Israel: The LORD our God is one LORD.";
const AUDITION_VOICES = new Set(["onyx", "cedar", "echo", "ash", "marin"]);

const cacheDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".cache", "narration");
const pending = new Map();
const maxMemoryEntries = 100;
const memory = new Map();

function replyJson(res, status, error) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify({ error }));
}

async function getAudio(text, voice = NARRATOR.voice) {
  const key = createHash("sha256").update(
    JSON.stringify([NARRATOR.version, NARRATOR.model, voice, NARRATOR.speed, NARRATOR.instructions, text])
  ).digest("hex");
  if (memory.has(key)) return { bytes: memory.get(key), key };

  if (!pending.has(key)) {
    const task = (async () => {
      const filename = path.join(cacheDir, key + ".mp3");
      try {
        const saved = await readFile(filename);
        memory.set(key, saved);
        return saved;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        const error = new Error("Server narration is not configured. Set OPENAI_API_KEY.");
        error.statusCode = 503;
        throw error;
      }

      const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: NARRATOR.model,
          voice,
          input: text,
          instructions: NARRATOR.instructions,
          speed: NARRATOR.speed,
          response_format: "mp3",
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (!upstream.ok) {
        const error = new Error("Voice service unavailable. Check the OpenAI API key and account.");
        error.statusCode = 502;
        throw error;
      }
      const bytes = Buffer.from(await upstream.arrayBuffer());
      if (!bytes.length || bytes.length > 10_000_000) {
        const error = new Error("Voice service returned invalid audio.");
        error.statusCode = 502;
        throw error;
      }
      try {
        await mkdir(cacheDir, { recursive: true });
        await writeFile(filename, bytes);
      } catch {
        // Read-only hosts can use the per-process cache instead.
      }
      memory.set(key, bytes);
      if (memory.size > maxMemoryEntries) memory.delete(memory.keys().next().value);
      return bytes;
    })().finally(() => pending.delete(key));
    pending.set(key, task);
  }
  return { bytes: await pending.get(key), key };
}

export async function handleNarrationApi(req, res) {
  if (req.method !== "GET") {
    replyJson(res, 405, "Method not allowed");
    return;
  }
  const url = new URL(req.url || "/", "http://" + (req.headers.host || "localhost"));
  const text = url.searchParams.get("text") || "";
  const auditionVoice = url.searchParams.get("audition");
  // Protect the voice selection: non-default voices are available ONLY for
  // this single public-domain audition sentence, never arbitrary input.
  if (auditionVoice !== null && (!AUDITION_VOICES.has(auditionVoice) || text !== AUDITION_TEXT)) {
    replyJson(res, 400, "That narration audition is not available.");
    return;
  }
  if (text.length > 1200 || !allowedText.has(text)) {
    replyJson(res, 400, "This audio is not in the authored Jeremiah lesson.");
    return;
  }
  try {
    const { bytes, key } = await getAudio(text, auditionVoice || NARRATOR.voice);
    // A single cached MP3 is sent to every device. Browsers do not synthesize it.
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": bytes.length,
      "Cache-Control": "public, max-age=86400",
      ETag: '"' + key + '"',
      "X-Content-Type-Options": "nosniff",
    });
    res.end(bytes);
  } catch (error) {
    console.error("Jeremiah narration:", error?.message || error);
    replyJson(res, error?.statusCode || 502, error?.message || "Narration unavailable.");
  }
}
