import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {OG1_SCENE_NARRATION,OG1_AUTHORED_NARRATION_TEXTS} from "../src/core/classroom/og1NarrationManifest.js";
import { NARRATOR, handleNarrationApi, isAllowedNarrationText } from "../server/narrationHandler.mjs";

// This test never calls the paid TTS service. It verifies the fixed voice
// configuration, the GET-only route and the authored-script allowlist.
function responseRecorder() {
  return {
    status: null,
    headers: null,
    body: null,
    writeHead(status, headers) {
      this.status = status;
      this.headers = headers;
    },
    end(body) { this.body = body; },
  };
}
async function request(method, text, audition = null) {
  const res = responseRecorder();
  const url = "/api/jeremiah/narration?text=" + encodeURIComponent(text) + (audition ? "&audition=" + encodeURIComponent(audition) : "");
  await handleNarrationApi({
    method, url,
    headers: { host: "localhost:5173" },
  }, res);
  return res;
}

assert.equal(NARRATOR.voice, "ash");
assert.equal(NARRATOR.model, "gpt-4o-mini-tts");
assert.match(NARRATOR.instructions, /American/);
assert.equal((await request("POST", "Hear, O Israel.")).status, 405);
assert.equal((await request("GET", "Unauthorised arbitrary speech input.")).status, 400);
assert.equal((await request("GET", "x".repeat(1500))).status, 400);
assert.equal((await request("GET", "Hear, O Israel: The LORD our God is one LORD.", "unknown")).status, 400);
assert.equal((await request("GET", "Unauthorised arbitrary speech input.", "cedar")).status, 400);
assert.equal((await request("GET", "The LORD our God is one LORD.", "cedar")).status, 400);


// Accept all authored scenes, including the four that were previously denied,
// without touching the paid speech provider or requiring an API key.
const sceneValues=Object.values(OG1_SCENE_NARRATION).flat();
assert.equal(OG1_AUTHORED_NARRATION_TEXTS.length,new Set(sceneValues).size,'Manifest must deduplicate only exact scripts');
for(const speech of OG1_AUTHORED_NARRATION_TEXTS){
 assert.equal(isAllowedNarrationText(speech),true,'Server must allow every player scene: '+speech);
 assert.ok(speech.length<=1200,'Narration scene must stay within endpoint length limit');
}
assert.equal(isAllowedNarrationText('A user-entered arbitrary narration prompt.'),false);
assert.equal(isAllowedNarrationText(''),false);
const player=readFileSync(new URL('../src/features/classroom/OG1LessonPlayer.jsx',import.meta.url),'utf8');
for(const key of ['opening','isaiahWitness','continuity','witnessCards','identity','comparison','mission','return']){
 assert.ok(player.includes('OG1_SCENE_NARRATION.'+key),'Player must use shared script for '+key);
}
assert.ok(!player.includes("current?.kind==='identity'&&moment===0"),
 'Identity narration should not be suppressed by its actual scene index');
assert.match(player,/current\?\.kind==='identity'&&evidenceIndex===0\s*\? OG1_SCENE_NARRATION\.identity/,
 'Identity narration plays on its first reveal regardless of its scene index, without repeating for each passage pair');

console.log("PASS: Jeremiah narrator is fixed and narration accepts only authored lesson text.");
