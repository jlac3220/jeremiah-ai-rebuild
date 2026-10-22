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
  assert.equal(proposal.summary, "This example focuses on attentive listening.");
  assert.equal(proposal.assessment, "review-proposal");
  assert.equal(proposal.evidenceReview.rejectedClaims, 1);
  assert.equal(proposal.evidenceReview.rejectedActivities, 1);
  assert.equal(proposal.claims.length, 1);
  assert.deepEqual(proposal.claims[0].knowledgeIds, ["one-lord"]);
  assert.deepEqual(proposal.activities[0].knowledgeIds, ["one-lord"]);
  assert.equal(proposal.activities.length, 1);
  assert.equal(proposal.activities[0].timestamp, "00:00:01.000");
  assert.deepEqual(proposal.claims[0].sourceLocation, {
    kind: "timed-captions", sourceUrl: "https://example.org/test",
    start: "00:00:01.000", end: "00:00:05.000",
    cueStart: 1, cueEnd: 1, ambiguous: false,
  });
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
  assert.equal(proposal.modelRelevance, "strong");
  assert.equal(proposal.summary, "A reading prompt.");
  assert.equal(proposal.assessment, "insufficient-source-evidence");
  assert.equal(proposal.evidenceReview.rejectedActivities, 1);
  assert.ok(proposal.concerns.some((item) => item.includes("No usable transcript-grounded enrichment")));
});


test("derives playback times from captions, including evidence crossing cue boundaries", async () => {
  const transcript = parseTranscript(
    "WEBVTT\n\n00:00:10.000 --> 00:00:12.000\nPay attention.\n\n00:00:12.000 --> 00:00:15.000\nThen respond to what you hear.\n",
    ".vtt"
  );
  const result = {
    relevance: "strong", summary: "Listen and respond.",
    claims: [{
      claim: "Hearing should produce a response.",
      evidence: "Pay attention. Then respond",
      timestamp: "99:99:99.999", knowledgeIds: ["one-lord"],
      verificationNeeded: "Verify interpretation.", doctrinalConcern: "",
    }],
    activities: [{
      kind: "listen", idea: "Identify attention and response in the lesson.",
      sourceEvidence: "Pay attention. Then respond", timestamp: "untrusted",
      addedValue: "An example of listening in action.", knowledgeIds: ["one-lord"],
    }],
    concerns: [],
  };
  const fetcher = async () => ({
    ok: true, json: async () => ({
      output: [{ type: "message", content: [{
        type: "output_text", text: JSON.stringify(result),
      }] }],
    }),
  });
  const proposal = await proposeMediaEnrichment({
    standardId: "OG.1.1.18", transcript, apiKey: "test-only", fetcher,
    source: { title: "Timed source", url: "https://example.org/timed", rights: "external-reference" },
  });
  for (const item of [...proposal.claims, ...proposal.activities]) {
    assert.equal(item.timestamp, "00:00:10.000");
    assert.equal(item.sourceLocation.start, "00:00:10.000");
    assert.equal(item.sourceLocation.end, "00:00:15.000");
    assert.equal(item.sourceLocation.cueStart, 1);
    assert.equal(item.sourceLocation.cueEnd, 2);
    assert.equal(item.sourceLocation.sourceUrl, "https://example.org/timed");
    assert.equal(item.sourceLocation.ambiguous, false);
  }
});

test("untimed publisher text has source references but never invented playback times", async () => {
  const result = {
    relevance: "possible", summary: "The source includes a word study.",
    claims: [{
      claim: "The script describes listening.", evidence: "Hear carefully",
      timestamp: "01:23", knowledgeIds: ["one-lord"],
      verificationNeeded: "Check meaning.", doctrinalConcern: "",
    }],
    activities: [], concerns: [],
  };
  const fetcher = async () => ({
    ok: true, json: async () => ({
      output: [{ type: "message", content: [{
        type: "output_text", text: JSON.stringify(result),
      }] }],
    }),
  });
  const proposal = await proposeMediaEnrichment({
    standardId: "OG.1.1.18",
    transcript: parseTranscript("Hear carefully before answering.", ".txt"),
    apiKey: "test-only", fetcher,
    source: { title: "Publisher PDF extract", url: "https://example.org/source", rights: "external-reference" },
  });
  assert.equal(proposal.claims.length, 1);
  assert.equal(proposal.claims[0].timestamp, "");
  assert.deepEqual(proposal.claims[0].sourceLocation, {
    kind: "untimed-transcript", sourceUrl: "https://example.org/source",
    start: "", end: "", cueStart: null, cueEnd: null, ambiguous: false,
  });
});


test("accepts source-exact words across PDF punctuation and line wrapping, not paraphrases", async () => {
  const modelResult = {
    relevance: "possible", summary: "The author discusses the name LORD.",
    claims: [
      { claim: "LORD is used in the translation.", evidence: "The name LORD through translation appears in the text",
        timestamp: "01:45", knowledgeIds: ["one-lord"], verificationNeeded: "Review the language claim.",
        doctrinalConcern: "Context, not doctrine." },
      { claim: "Invented paraphrase.", evidence: "The biblical manuscripts teach the Trinity",
        timestamp: "", knowledgeIds: ["one-lord"], verificationNeeded: "", doctrinalConcern: "" },
    ],
    activities: [], concerns: [],
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
    transcript: parseTranscript("The name\nLORD—through translation—appears in the text.", ".txt"),
    apiKey: "test-only", fetcher,
    source: { title: "PDF source", url: "https://example.org/pdf", rights: "external-reference" },
  });
  assert.equal(proposal.summary, modelResult.summary);
  assert.equal(proposal.claims.length, 1);
  assert.equal(proposal.claims[0].timestamp, "");
  assert.equal(proposal.assessment, "review-proposal");
  assert.equal(proposal.evidenceReview.rejectedClaims, 1);
  assert.equal(proposal.review.doctrinalAlignment, false);
});

test("reports model interest separately when every suggested quote fails verification", async () => {
  const result = {
    relevance: "strong", summary: "The PDF might explain God's name.",
    claims: [{ claim: "A claim", evidence: "words not present in the source", timestamp: "",
      knowledgeIds: ["one-lord"], verificationNeeded: "", doctrinalConcern: "" }],
    activities: [], concerns: [],
  };
  const fetcher = async () => ({
    ok: true, json: async () => ({
      output: [{ type: "message", content: [{
        type: "output_text", text: JSON.stringify(result),
      }] }],
    }),
  });
  const proposal = await proposeMediaEnrichment({
    standardId: "OG.1.1.18", transcript: "LORD appears in the printed text.",
    apiKey: "test-only", fetcher,
    source: { title: "Script references", url: "https://example.org/pdf", rights: "external-reference" },
  });
  assert.equal(proposal.relevance, "none");
  assert.equal(proposal.modelRelevance, "strong");
  assert.equal(proposal.assessment, "insufficient-source-evidence");
  assert.equal(proposal.summary, result.summary);
  assert.equal(proposal.evidenceReview.proposedClaims, 1);
  assert.equal(proposal.evidenceReview.rejectedClaims, 1);
});
