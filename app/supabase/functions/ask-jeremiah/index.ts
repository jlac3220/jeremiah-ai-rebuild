// ask-jeremiah — The Mouthpiece's open-conversation surface.
//
// Unlike grade-response (which judges one answer against one standard/stage),
// this is free-form Q&A — but still constrained by the Brain: it may only
// teach from the standards it's given, must cite standard codes when it
// answers from one, and must say plainly when a question falls outside the
// current standards rather than inventing doctrine.
//
// Deploy: supabase functions deploy ask-jeremiah
// Uses the same ANTHROPIC_API_KEY secret as grade-response.

import { getAgeBandGuidance } from "../_shared/ageBandGuidance.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const CLAUDE_MODEL = "claude-sonnet-5";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function buildSystemPrompt({ standards, ageBand }) {
  const ageGuidance = getAgeBandGuidance(ageBand);

  const standardsBlock = (standards || [])
    .map((standard) => {
      const scriptures = (standard.anchorScriptures || [])
        .map((verse) => `${verse.reference}: "${verse.text}"`)
        .join("; ");
      return `[${standard.code}] ${standard.title} — ${standard.statement} (Scriptures: ${scriptures})`;
    })
    .join("\n");

  return `You are Jeremiah — a doctrinal teacher, not a general-purpose chatbot. You are the mouthpiece for the standards below, not an independent voice: your authority to teach doctrine comes entirely from this list, never from your own general knowledge.

STANDARDS YOU MAY TEACH FROM:
${standardsBlock}

${ageGuidance}

Rules:
- When a question is answered by one of the standards above, answer it clearly and cite the standard code (e.g. "OG.1.1") so the learner can go study it directly.
- When a question falls genuinely outside these standards, say so plainly ("That's not one of the standards currently in this app") rather than inventing an answer from general theological knowledge. You may still be warm and conversational, but never freelance doctrine.
- You are still Jeremiah — speak with warmth and directness, not like a search engine reading out results.
- Keep responses focused: 2-5 sentences unless the question genuinely needs more.`;
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

  const { standards, conversationHistory, question, ageBand } = body || {};

  if (!Array.isArray(standards) || standards.length === 0) {
    return new Response(JSON.stringify({ error: "Missing `standards` array in request body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const trimmedQuestion = (question || "").trim();
  if (!trimmedQuestion) {
    return new Response(
      JSON.stringify({ answer: "Ask Jeremiah something first — the box is empty." }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = buildSystemPrompt({ standards, ageBand });

  const messages = [
    ...(Array.isArray(conversationHistory) ? conversationHistory : []).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: String(msg.content || ""),
    })),
    { role: "user", content: trimmedQuestion },
  ];

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
      JSON.stringify({ error: "Failed to reach Jeremiah", detail: String(err) }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  if (!anthropicResponse.ok) {
    const detail = await anthropicResponse.text();
    return new Response(
      JSON.stringify({ error: `Jeremiah returned ${anthropicResponse.status}`, detail }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const data = await anthropicResponse.json();
  const textBlock = (data.content || []).find((block) => block.type === "text");
  const answer = textBlock?.text?.trim();

  if (!answer) {
    return new Response(JSON.stringify({ error: "Jeremiah returned an empty response" }), {
      status: 502,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ answer }), {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
