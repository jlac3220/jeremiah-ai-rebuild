import { classroomContentRegistry } from "../src/core/classroom/content/classroomContentRegistry.js";

const standards = classroomContentRegistry;

const allowedStrategies = [
  "affirm_and_deepen",
  "clarify",
  "scripture_revisit",
  "contrast",
  "guided_question",
  "misconception_correction",
  "encourage_retry",
];

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "verdict",
    "strategy",
    "teacherMessage",
    "followUpPrompt",
    "misconceptionIds",
    "evidenceObserved",
  ],
  properties: {
    verdict: {
      type: "string",
      enum: ["strong", "partial", "weak"],
    },
    strategy: {
      type: "string",
      enum: allowedStrategies,
    },
    teacherMessage: { type: "string" },
    followUpPrompt: { type: "string" },
    misconceptionIds: {
      type: "array",
      items: { type: "string" },
    },
    evidenceObserved: {
      type: "array",
      items: { type: "string" },
    },
  },
};

function getMove(content, moveId) {
  return content.instructionalMoves?.find((move) => move.id === moveId) || null;
}

function deterministicVerdict(move, learnerResponse) {
  if (move.type === "free_response" || move.type === "mastery_response") {
    const raw = String(learnerResponse?.text || "").trim();
    const text = raw.toLowerCase();
    const words = raw.split(/\s+/).filter(Boolean);
    const positive = [
      "god is one",
      "one god",
      "one lord",
      "only one god",
      "lord our god is one",
    ].some((phrase) => text.includes(phrase));
    const exclusion = [
      "no other god",
      "no god beside",
      "beside him there is no god",
      "none else",
      "no other",
    ].some((phrase) => text.includes(phrase));
    const scripture = [
      "deuteronomy",
      "deut 6",
      "isaiah",
      "shema",
      "mark 12",
    ].some((phrase) => text.includes(phrase));

    if (move.type === "mastery_response") {
      if (positive && exclusion && scripture && words.length >= 12) return "strong";
      if ((positive && exclusion) || (positive && scripture)) return "partial";
      return words.length ? "weak" : "weak";
    }

    if (positive && exclusion && words.length >= 8) return "strong";
    if (positive || exclusion) return "partial";
    return words.length ? "weak" : "weak";
  }

  const selected = learnerResponse?.choiceIds || [];
  const expected = move.expectedChoiceIds || [];
  if (!expected.length) return "strong";
  if (expected.every((id) => selected.includes(id))) return "strong";
  return selected.length ? "weak" : "weak";
}

function fallbackDecision(move, learnerResponse, reason = "") {
  const verdict = deterministicVerdict(move, learnerResponse);

  if (verdict === "strong") {
    return {
      verdict,
      strategy: "affirm_and_deepen",
      teacherMessage:
        "Yes. Stay with that wording—the text itself is doing the doctrinal work. Now carry that truth into the next move.",
      followUpPrompt: "Continue when you are ready.",
      misconceptionIds: [],
      evidenceObserved: move.evidenceIds || [],
      source: "fallback",
      diagnostic: reason,
    };
  }

  return {
    verdict,
    strategy: move.scripture?.length ? "scripture_revisit" : "clarify",
    teacherMessage:
      "Not quite yet. Jeremiah is keeping you inside the required truth instead of moving on too quickly. Look again at the exact claim in front of you and let the wording narrow your answer.",
    followUpPrompt: move.prompt || "Try the move again with the central truth in view.",
    misconceptionIds: [],
    evidenceObserved: [],
    source: "fallback",
    diagnostic: reason,
  };
}

function extractOutputText(responseJson) {
  for (const item of responseJson?.output || []) {
    if (item?.type !== "message") continue;
    for (const part of item?.content || []) {
      if (part?.type === "output_text" && part?.text) return part.text;
    }
  }
  return "";
}

function sanitizeDecision(decision, content) {
  const knownMisconceptions = new Set(
    (content.brain?.misconceptions || []).map((item) => item.id)
  );

  return {
    verdict: ["strong", "partial", "weak"].includes(decision.verdict)
      ? decision.verdict
      : "weak",
    strategy: allowedStrategies.includes(decision.strategy)
      ? decision.strategy
      : "clarify",
    teacherMessage: String(decision.teacherMessage || "").slice(0, 900),
    followUpPrompt: String(decision.followUpPrompt || "").slice(0, 500),
    misconceptionIds: (decision.misconceptionIds || []).filter((id) =>
      knownMisconceptions.has(id)
    ),
    evidenceObserved: (decision.evidenceObserved || []).map(String).slice(0, 8),
    source: "openai",
  };
}

export async function teachWithJeremiah({
  standardId,
  moveId,
  learnerResponse,
  learnerState = {},
}) {
  const content = standards[standardId];
  if (!content) throw new Error("Unknown Jeremiah standard.");

  const move = getMove(content, moveId);
  if (!move) throw new Error("Unknown instructional move.");

  if (move.type === "launch" || move.type === "complete") {
    return {
      verdict: "strong",
      strategy: "affirm_and_deepen",
      teacherMessage: move.teacherLine || move.body || "Continue.",
      followUpPrompt: move.ctaLabel || "Continue",
      misconceptionIds: [],
      evidenceObserved: [],
      source: "engine",
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackDecision(move, learnerResponse, "OPENAI_API_KEY missing");

  const isDeepMove = ["free_response", "mastery_response"].includes(move.type);
  const model = isDeepMove
    ? process.env.JEREMIAH_OPENAI_MODEL_DEEP || "gpt-5.6-sol"
    : process.env.JEREMIAH_OPENAI_MODEL_FAST || "gpt-5.6-luna";

  const developerPrompt = [
    "You are Jeremiah, the adaptive teacher inside Jeremiah.app.",
    "The hard-coded standard is the authority. You may adapt HOW the content is taught, never WHAT must be learned.",
    "Evaluate only the learner response to the current instructional move.",
    "Do not invent doctrine, Scripture, required content, or a new curriculum path.",
    "Use a warm, direct, intelligent teaching voice for adults and young adults. Do not sound like a chatbot or a sermon cliché.",
    "When the answer is wrong or partial, teach one useful thing and point the learner back into the move. Do not simply say incorrect.",
    "When the answer is strong, affirm specifically and deepen the connection in one or two sentences.",
    "If encounter memory is supplied, use it only when it genuinely helps: for example, reconnect a word the learner marked or a source they explored. Do not force a reference to it.",
    "Keep teacherMessage concise (normally under 110 words) and followUpPrompt under 45 words.",
    "Only return misconception IDs that exist in the supplied standard.",
  ].join("\n");

  const modelInput = {
    standard: {
      id: content.standardId,
      title: content.standardTitle,
      essentialQuestion: content.brain?.essentialQuestion,
      masteryTarget: content.brain?.masteryTarget,
      requiredKnowledge: content.brain?.requiredKnowledge,
      misconceptions: content.brain?.misconceptions,
      evidenceOfUnderstanding: content.brain?.evidenceOfUnderstanding,
      teacherGuardrails: content.brain?.teacherGuardrails,
    },
    currentMove: {
      id: move.id,
      type: move.type,
      title: move.title,
      body: move.body || "",
      prompt: move.prompt || "",
      scripture: move.scripture || [],
      choices: move.choices || [],
      expectedChoiceIds: move.expectedChoiceIds || [],
      evidenceIds: move.evidenceIds || [],
    },
    learner: {
      response: learnerResponse,
      completedMoveIds: learnerState.completedMoveIds || [],
      evidenceIds: learnerState.evidenceIds || [],
      priorMisconceptions: learnerState.misconceptions || [],
      attemptsOnCurrentMove:
        learnerState.attemptsByMove?.[move.id] || 0,
      encounterMemory: learnerState.encounterData || null,
    },
  };

  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      store: false,
      max_output_tokens: 900,
      instructions: developerPrompt,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(modelInput),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "jeremiah_teacher_decision",
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!apiResponse.ok) {
    const details = await apiResponse.text();
    return fallbackDecision(
      move,
      learnerResponse,
      `OpenAI ${apiResponse.status}: ${details.slice(0, 240)}`
    );
  }

  const responseJson = await apiResponse.json();
  const outputText = extractOutputText(responseJson);

  try {
    const decision = sanitizeDecision(JSON.parse(outputText), content);
    const hasObjectiveKey = (move.expectedChoiceIds || []).length > 0;
    if (hasObjectiveKey) {
      decision.verdict = deterministicVerdict(move, learnerResponse);
      if (decision.verdict === "strong" && decision.strategy === "misconception_correction") {
        decision.strategy = "affirm_and_deepen";
        decision.misconceptionIds = [];
      }
    }

    return {
      ...decision,
      model,
      responseId: responseJson.id || "",
    };
  } catch {
    return fallbackDecision(move, learnerResponse, "Structured output parse failed");
  }
}
