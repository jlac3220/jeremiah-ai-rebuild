// defend-the-faith — The Mouthpiece's spaced-repetition review mode.
//
// Every standard's evidenceOfLearning already includes a real Defense-level
// objection (e.g. "Responds to the trinitarian claim that echad permits
// compound unity..."). Instead of a flashcard review, Jeremiah plays that
// exact opposing position and presses the learner to hold the doctrine —
// a live debate grounded entirely in the standard's own content, never
// invented. Round outcome drives the spaced-repetition schedule client-side
// (app/src/core/standards/standardsProgress.js: scheduleNextReview).
//
// Deploy: supabase functions deploy defend-the-faith
// Uses the same ANTHROPIC_API_KEY secret as the other functions.

import { getAgeBandGuidance } from "../_shared/ageBandGuidance.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const CLAUDE_MODEL = "claude-sonnet-5";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VALID_VERDICTS = ["held", "wavered", "conceded"];

function buildSystemPrompt({ standard, ageBand }) {
  const ageGuidance = getAgeBandGuidance(ageBand);
  const defenseLevel = (standard.evidenceOfLearning || []).find((l) => l.level === "Defense");
  const scriptureBlock = (standard.anchorScriptures || [])
    .map((verse) => `- ${verse.reference}: "${verse.text}"`)
    .join("\n");

  return `You are Jeremiah, but in THIS mode you are role-playing the opposing position, not teaching as yourself. This is a spaced-repetition review: the learner already mastered this standard once, and you are testing whether they can still defend it under real pressure.

STANDARD BEING DEFENDED: ${standard.code} — ${standard.title}
DOCTRINAL STATEMENT: ${standard.statement}
THE SPECIFIC OBJECTION YOU MUST RAISE (this is the standard's own Defense-level expectation — do not invent a different objection):
${defenseLevel ? defenseLevel.expectation : "Press the learner on the strongest counter-argument to this standard."}
SCRIPTURES THE LEARNER SHOULD BE ABLE TO USE:
${scriptureBlock}

${ageGuidance}

Rules:
- Stay in character as the opposing voice (e.g. a Trinitarian apologist, a sinner's-prayer-only advocate — whichever position the objection above implies). Be genuinely persuasive and press back on weak answers, the way a real interlocutor would — do not be a pushover, but do not be needlessly hostile either.
- Never concede a point the learner hasn't actually earned with real scriptural reasoning.
- After 2-4 exchanges, bring the round to a close: either the learner has held the line with real doctrinal substance, or they haven't.
- Respond with STRICT JSON only, no markdown fences, no commentary outside the JSON:
{"reply": "<your in-character response — the objection, a follow-up press, or your closing concession/summary>", "verdict": "held" | "wavered" | "conceded" | null, "roundComplete": true | false}
- "verdict" judges the learner's MOST RECENT reply specifically: "held" (solid, scriptural, on-point), "wavered" (partial, vague, or missing key ground), "conceded" (learner agreed with your objection or gave up ground they shouldn't have). Use null only on your opening objection, before the learner has replied.
- Set "roundComplete": true only when you are delivering your final in-character response for this round.`;
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

  const { standard, conversationHistory, learnerReply, ageBand } = body || {};

  if (!standard || !standard.code || !standard.statement) {
    return new Response(
      JSON.stringify({ error: "Missing or incomplete `standard` in request body" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = buildSystemPrompt({ standard, ageBand });

  const messages = [
    ...(Array.isArray(conversationHistory) ? conversationHistory : []).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: String(msg.content || ""),
    })),
  ];
  if (learnerReply && learnerReply.trim()) {
    messages.push({ role: "user", content: learnerReply.trim() });
  } else if (messages.length === 0) {
    // Opening move: nothing from the learner yet, prompt Jeremiah to raise the objection.
    messages.push({ role: "user", content: "(Begin the challenge.)" });
  }

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
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach the debate model", detail: String(err) }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  if (!anthropicResponse.ok) {
    const detail = await anthropicResponse.text();
    return new Response(
      JSON.stringify({ error: `Debate model returned ${anthropicResponse.status}`, detail }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const data = await anthropicResponse.json();
  const textBlock = (data.content || []).find((block) => block.type === "text");
  const parsed = textBlock ? extractJson(textBlock.text) : null;

  if (!parsed || typeof parsed.reply !== "string" || (parsed.verdict !== null && !VALID_VERDICTS.includes(parsed.verdict))) {
    return new Response(
      JSON.stringify({ error: "Debate model returned an unparseable response" }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(parsed), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
