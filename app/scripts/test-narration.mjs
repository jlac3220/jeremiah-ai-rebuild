import assert from "node:assert/strict";
import { NARRATOR, handleNarrationApi } from "../server/narrationHandler.mjs";

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

assert.equal(NARRATOR.voice, "onyx");
assert.equal(NARRATOR.model, "gpt-4o-mini-tts");
assert.match(NARRATOR.instructions, /American/);
assert.equal((await request("POST", "Hear, O Israel.")).status, 405);
assert.equal((await request("GET", "Unauthorised arbitrary speech input.")).status, 400);
assert.equal((await request("GET", "x".repeat(1500))).status, 400);
assert.equal((await request("GET", "Hear, O Israel: The LORD our God is one LORD.", "unknown")).status, 400);
assert.equal((await request("GET", "Unauthorised arbitrary speech input.", "cedar")).status, 400);
assert.equal((await request("GET", "The LORD our God is one LORD.", "cedar")).status, 400);

console.log("PASS: Jeremiah narrator is fixed and narration accepts only authored lesson text.");
