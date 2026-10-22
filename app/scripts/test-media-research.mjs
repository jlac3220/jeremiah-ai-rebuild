import test from "node:test";
import assert from "node:assert/strict";
import { standardMediaBrief, parseTranscript, proposeMediaEnrichment } from "../server/mediaEnrichment.mjs";

test("reads actual curriculum objectives rather than guessing standard requirements", () => {
  const brief = standardMediaBrief("OG.1.1.18");
  assert.equal(brief.standardId, "OG.1.1.18");
  assert.match(brief.title, /Shema/i);
  assert.ok(brief.requiredKnowledge.some((item) => item.id === "one-lord"));
  assert.ok(brief.scripture.some((verse) => verse.reference === "Deuteronomy 6:4"));
  assert.throws(() => standardMediaBrief("NOT_A_STANDARD"), /Unknown standard/);
});

test("reads subtitle cues without inventing timestamps", () => {
  const parsed = parseTranscript(
    "WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nListen to the text.\n\n00:00:05.000 --> 00:00:08.000\nThen respond.\n",
    ".vtt"
  );
  assert.equal(parsed.cues.length, 2);
  assert.match(parsed.text, /\[00:00:05.000\] Then respond/);
  assert.throws(() => parseTranscript("empty timing", ".vtt"), /No timed caption/);
});

test("only keeps transcript-grounded evidence; never publishes to lessons", async () => {
  const responseBody = {
    relevance: "strong",
    summary: "This example focuses on attentive listening.",
    claims: [
      { claim: "Listening implies attention.", evidence: "Listen to the text.", timestamp: "00:00:01.000",
        knowledgeIds: ["one-lord", "FAKE_ID"], verificationNeeded: "Confirm Hebrew usage in a lexicon.",
        doctrinalConcern: "" },
      { claim: "Unsupported doctrine.", evidence: "a sentence that was never said", timestamp: "",
        knowledgeIds: ["one-lord"], verificationNeeded: "", doctrinalConcern: "" },
    ],
    activities: [
      { kind: "listen", idea: "Ask learners to identify the central confession.",
        knowledgeIds: ["one-lord", "FAKE_ID"], sourceEvidence: "Listen to the text.",
        timestamp: "00:00:01.000", addedValue: "Connect attentive hearing to a concrete listener activity." },
      { kind: "compare", idea: "Compare passages already in the standard.",
        knowledgeIds: ["one-lord"], sourceEvidence: "This quote is absent.",
        timestamp: "", addedValue: "No additional content" },
    ],
    concerns: [],
  };
  const fetcher = async (url, request) => {
    assert.match(url, /responses$/);
    assert.equal(request.method, "POST");
    const payload = JSON.parse(request.body);
    assert.equal(payload.store, false);
    return { ok: true, json: async () => ({ output: [{
      type: "message", content: [{ type: "output_text", text: JSON.stringify(responseBody) }],
    }] }) };
  };
  const proposal = await proposeMediaEnrichment({
    standardId: "OG.1.1.18",
    transcript: parseTranscript("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nListen to the text.\n", ".vtt"),
    apiKey: "testing-only",
    fetcher,
    source: { title: "Test recording", publisher: "Test publisher",
      url: "https://example.org/test", rights: "external-reference" },
  });
  assert.equal(proposal.status, "needs_review");
  assert.equal(proposal.claims.length, 1);
  assert.deepEqual(proposal.claims[0].knowledgeIds, ["one-lord"]);
  assert.deepEqual(proposal.activities[0].knowledgeIds, ["one-lord"]);
  assert.equal(proposal.activities.length, 1);
  assert.equal(proposal.activities[0].timestamp, "00:00:01.000");
  assert.ok(proposal.concerns.filter((item) => item.includes("Discarded")).length >= 2);
  assert.equal(proposal.review.lessonApproved, false);
  assert.equal(proposal.transcript.hasTimestamps, true);
});

test("requires declared rights and an AI key for analysis", async () => {
  await assert.rejects(proposeMediaEnrichment({
    standardId: "OG.1.1.18", transcript: "Test", source: { title: "Video", url: "https://example.org" },
    apiKey: "x",
  }), /declared rights/);
  await assert.rejects(proposeMediaEnrichment({
    standardId: "OG.1.1.18", transcript: "Test",
    source: { title: "Video", url: "https://example.org", rights: "owned" },
    apiKey: "",
  }), /OPENAI_API_KEY/);
});


test("rejects generic activities invented from the standard without source evidence", async () => {
  const modelResult = {
    relevance: "strong", summary: "A reading prompt.",
    claims: [], activities: [{
      kind: "scripture", idea: "Read the verses already listed by the curriculum.",
      knowledgeIds: ["one-lord"], sourceEvidence: "",
      timestamp: "00:45", addedValue: "The standard already supplies the activity.",
    }],
    concerns: [],
  };
  const fetcher = async () => ({
    ok: true, json: async () => ({
      output: [{ type: "message", content: [{
        type: "output_text", text: JSON.stringify(modelResult),
      }] }],
    }),
  });
  const proposal = await proposeMediaEnrichment({
    standardId: "OG.1.1.18",
    transcript: "This source does not contain relevant explanations.",
    apiKey: "test-only", fetcher,
    source: { title: "Generic example", url: "https://example.org/resource", rights: "external-reference" },
  });
  assert.equal(proposal.activities.length, 0);
  assert.equal(proposal.relevance, "none");
  assert.ok(proposal.concerns.some((item) => item.includes("No usable transcript-grounded enrichment")));
});
