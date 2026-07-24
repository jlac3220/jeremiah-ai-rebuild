// grade-response — The Mouthpiece
//
// This is the ONLY place a learner response gets graded or answered in
// Jeremiah's voice. It never decides doctrine on its own: every judgment is
// made against the exact standard object the client sends (sourced from
// app/src/core/standards/standardsRegistry.js, the Brain), never from the
// model's own general knowledge of the topic.
//
// Deploy: supabase functions deploy grade-response
// Secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// (Both steps require your own Supabase CLI login — I can't run them for you.)

import { getAgeBandGuidance } from "../_shared/ageBandGuidance.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const CLAUDE_MODEL = "claude-sonnet-5";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VALID_STATUSES = ["empty", "weak", "partial", "strong"];

function buildSystemPrompt({ standard, stageLabel, stageDescription, ageBand }) {
  const ageGuidance = getAgeBandGuidance(ageBand);
  const scriptureBlock = (standard.anchorScriptures || [])
    .map((verse) => `- ${verse.reference}: "${verse.text}"`)
    .join("\n");
  const evidenceBlock = (standard.evidenceOfLearning || [])
    .map((level) => `- ${level.level}: ${level.expectation}`)
    .join("\n");

  return `You are Jeremiah — the mouthpiece for a doctrinal teaching standard, not an independent voice. You never introduce doctrine, argument, or claims of your own. Every judgment you make must come strictly from the standard below.

STANDARD: ${standard.code} — ${standard.title}
DOCTRINAL STATEMENT: ${standard.statement}
${standard.scope ? `SCOPE & CLARIFICATIONS: ${standard.scope}\n` : ""}KEY VOCABULARY: ${(standard.vocabulary || []).join(", ")}
ANCHOR SCRIPTURES:
${scriptureBlock}
EVIDENCE-OF-LEARNING LEVELS (what graduated mastery of this standard looks like):
${evidenceBlock}

CURRENT STAGE: ${stageLabel}${stageDescription ? " — " + stageDescription : ""}

${ageGuidance}

Grade the learner's response against this standard and stage only. Respond with STRICT JSON and nothing else, no markdown fences, no commentary outside the JSON:
{"status": "empty" | "weak" | "partial" | "strong", "feedback": "..."}

Rules for status:
- "empty": no real response was given.
- "weak": response doesn't yet engage the doctrinal claim for this stage.
- "partial": response shows some real understanding but is incomplete for this stage's expectation.
- "strong": response meets this stage's expectation clearly, in the learner's own words (exact phrase-matching is NOT required — judge understanding, not memorized wording).

"feedback" must read like a real teacher reacting to what THIS learner actually wrote — reference specifics from their response when possible. Never use a generic canned phrase. Keep it to 1-3 sentences.`;
}

function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY secret is not configured on this function." }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { standard, stageLabel, stageDescription, learnerResponse, ageBand } = body || {};

  if (!standard || !standard.code || !standard.statement) {
    return new Response(
      JSON.stringify({ error: "Missing or incomplete `standard` in request body" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const normalizedResponse = (learnerResponse || "").trim();
  if (!normalizedResponse) {
    return new Response(
      JSON.stringify({ status: "empty", feedback: "Enter a response before Jeremiah can evaluate your understanding." }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = buildSystemPrompt({ standard, stageLabel, stageDescription, ageBand });

  let anthropicResponse;
  try {
    anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: "user", content: normalizedResponse }],
      }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach the grading model", detail: String(err) }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  if (!anthropicResponse.ok) {
    const detail = await anthropicResponse.text();
    return new Response(
      JSON.stringify({ error: `Grading model returned ${anthropicResponse.status}`, detail }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const data = await anthropicResponse.json();
  const textBlock = (data.content || []).find((block) => block.type === "text");
  const parsed = textBlock ? extractJson(textBlock.text) : null;

  if (!parsed || !VALID_STATUSES.includes(parsed.status) || typeof parsed.feedback !== "string") {
    return new Response(
      JSON.stringify({ error: "Grading model returned an unparseable response" }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(parsed), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
