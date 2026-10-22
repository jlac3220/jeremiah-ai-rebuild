import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  planSermonChunks, formatVttTime, assembleTimedVtt, ingestAuthorizedSermon,
} from "../server/authorizedSermonTranscription.mjs";
import { parseTranscript } from "../server/mediaEnrichment.mjs";

test("chunks whole sermons into bounded 10-minute segments", () => {
  assert.deepEqual(planSermonChunks(1201, 90), [
    { start: 0, duration: 600 },
    { start: 600, duration: 600 },
    { start: 1200, duration: 1 },
  ]);
  assert.deepEqual(planSermonChunks(600, 90), [{ start: 0, duration: 600 }]);
  assert.throws(() => planSermonChunks(4000, 60), /longer than --max-minutes/);
  assert.throws(() => planSermonChunks(500, 241), /between 1 and 240/);
});

test("converts segment-relative Whisper timestamps into absolute caption times", () => {
  const { vtt, cueCount } = assembleTimedVtt([
    { start: 0, duration: 600, cues: [{ timestamp: "2.5s", endTimestamp: "4.7s", text: "Repent" }] },
    { start: 600, duration: 600, cues: [{ timestamp: "30s", endTimestamp: "32s", text: "Turn to God" }] },
  ]);
  assert.equal(cueCount, 2);
  assert.match(vtt, /00:00:02\.500 --> 00:00:04\.700/);
  assert.match(vtt, /00:10:30\.000 --> 00:10:32\.000/);
  assert.equal(parseTranscript(vtt, ".vtt").cues.length, 2);
  assert.equal(formatVttTime(1200), "00:20:00.000");
  assert.throws(() => assembleTimedVtt([{start:0,duration:100,cues:[]}]), /timed segments/);
  assert.throws(() => assembleTimedVtt([{ start:0,duration:10,cues:[
    {timestamp:"1.0s",endTimestamp:"30.0s",text:"Invalid range"},
  ] }]), /out-of-range/);
});

test("authorized originals can be converted and transcribed without external video access", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "jeremiah-transcription-test-"));
  try {
    const source = path.join(temp, "provided-sermon.mp4");
    const outputDir = path.join(temp, ".jeremiah-research", "captions");
    await mkdir(outputDir, { recursive: true });
    await writeFile(source, "representative test input");
    const runner = async (command, args) => {
      if (command === "ffprobe") return { stdout: "1201\n" };
      assert.equal(command, "ffmpeg");
      assert.ok(args.includes("-vn"), "Never copy video into transcription chunks");
      assert.equal(args[args.indexOf("-b:a") + 1], "48k");
      await writeFile(args.at(-1), "pretend audio");
      return { stdout: "" };
    };
    let count = 0;
    const transcriber = async (_file, key) => {
      assert.equal(key, "test-key");
      count++;
      return { cues: [{ timestamp: "0.0s", endTimestamp: count === 3 ? "0.5s" : "3.0s",
        text: "A spoken sentence on repentance." }] };
    };
    const result = await ingestAuthorizedSermon({
      media: source, title: "Test sermon", publisher: "Test publisher",
      url: "https://www.youtube.com/watch?v=JSFGj1qFbQ0",
      rights: "permission", rightsEvidence: "Owner consent exists",
      apiKey: "test-key", outputDir, runner, transcriber,
    });
    assert.equal(result.chunks, 3);
    assert.equal(result.timedCues, 3);
    assert.equal(result.status, "transcribed_unverified");
    const raw = await readFile(result.output, "utf8");
    assert.match(raw, /00:20:00\.000 --> 00:20:00\.500/);
    assert.equal(parseTranscript(raw, ".vtt").cues.length, 3);
    await assert.rejects(ingestAuthorizedSermon({
      media: source, title: "Test sermon", publisher: "Test publisher",
      url: "https://example.org", rights: "external-reference",
      rightsEvidence: "", apiKey: "test-key", outputDir, runner, transcriber,
    }), /rights-evidence/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
