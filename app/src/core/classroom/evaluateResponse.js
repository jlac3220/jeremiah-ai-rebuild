import { getStandardByCode } from "../standards/standardsRegistry";
import { sessionStages } from "./sessionStages";
import { getEdgeFunctionUrl, SUPABASE_ANON_KEY } from "../config/supabaseConfig";

const GRADE_ENDPOINT = getEdgeFunctionUrl("grade-response");

function getStage(stageId) {
  return sessionStages.find((stage) => stage.id === stageId) || null;
}

/**
 * The only place a learner response gets graded. Always asks the mouthpiece
 * (the grade-response Edge Function) to judge against the real standard from
 * the Brain (standardsRegistry.js) — never guesses locally. If the
 * mouthpiece can't be reached, this returns an honest "can't grade right
 * now" result instead of fabricating a verdict.
 */
export async function evaluateResponse(responseText, standardCode, stageId, ageBand = "adult") {
  const normalized = (responseText || "").trim();

  if (!normalized) {
    return {
      status: "empty",
      feedback: "Enter a response before Jeremiah can evaluate your understanding.",
    };
  }

  const standard = getStandardByCode(standardCode);
  if (!standard) {
    return {
      status: "weak",
      feedback: `No standard was found for "${standardCode}". This response could not be graded.`,
    };
  }

  const stage = getStage(stageId);

  try {
    const response = await fetch(GRADE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        standard,
        stageLabel: stage?.label || stageId,
        stageDescription: stage?.description || "",
        learnerResponse: normalized,
        ageBand,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grading request failed with ${response.status}`);
    }

    const result = await response.json();
    if (!result?.status || !result?.feedback) {
      throw new Error("Grading response was missing status/feedback");
    }

    return result;
  } catch {
    return {
      status: "weak",
      feedback:
        "Jeremiah can't grade this response right now (connection issue). Check your connection and submit again — this is not a judgment on your answer.",
      gradingUnavailable: true,
    };
  }
}
