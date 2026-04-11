import { masteryRules } from "./masteryRules";

export function evaluateResponse(responseText, standardId = "OG.1.18") {
  const normalized = responseText.trim().toLowerCase();
  const rule = masteryRules[standardId];

  if (!rule) {
    return {
      status: "weak",
      feedback: "No mastery rule was found for this standard.",
    };
  }

  if (!normalized) {
    return {
      status: "empty",
      feedback: rule.feedback.empty,
    };
  }

  const mentionsPositiveConfession = rule.positiveConfessionPhrases.some(
    (phrase) => normalized.includes(phrase)
  );

  const mentionsExclusion = rule.exclusionPhrases.some((phrase) =>
    normalized.includes(phrase)
  );

  if (mentionsPositiveConfession && mentionsExclusion) {
    return {
      status: "strong",
      feedback: rule.feedback.strong,
    };
  }

  if (mentionsPositiveConfession) {
    return {
      status: "partial",
      feedback: rule.feedback.partial,
    };
  }

  return {
    status: "weak",
    feedback: rule.feedback.weak,
  };
}