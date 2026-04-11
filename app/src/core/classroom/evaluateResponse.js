import { masteryRules } from "./masteryRules";

function normalizeResponse(responseText = "") {
  return responseText.trim().toLowerCase();
}

function includesAny(text, phrases = []) {
  return phrases.some((phrase) => text.includes(phrase));
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function evaluateOgOneByStage(normalized, rule, stageId) {
  const mentionsPositiveConfession = includesAny(
    normalized,
    rule.positiveConfessionPhrases
  );

  const mentionsExclusion = includesAny(normalized, rule.exclusionPhrases);

  const mentionsGodLanguage = includesAny(normalized, [
    "god",
    "lord",
    "one",
    "only",
  ]);

  const mentionsScriptureEvidence = includesAny(normalized, [
    "deuteronomy 6:4",
    "deut 6:4",
    "hear o israel",
    "the lord our god is one lord",
    "isaiah 45:5",
    "i am the lord",
    "there is none else",
    "there is no god beside me",
    "beside me there is no god",
  ]);

  switch (stageId) {
    case "focus":
      if (mentionsPositiveConfession) {
        return {
          status: "strong",
          feedback:
            "Strong focus response. You identified the target truth: God is one.",
        };
      }

      if (mentionsGodLanguage) {
        return {
          status: "partial",
          feedback:
            "You are near the target, but this stage needs the central claim stated clearly: God is one.",
        };
      }

      return {
        status: "weak",
        feedback:
          "This stage is about identifying the main doctrinal target. State clearly that God is one.",
      };

    case "truth":
      if (mentionsPositiveConfession && wordCount(normalized) >= 4) {
        return {
          status: "strong",
          feedback:
            "Strong truth response. You stated the doctrine directly rather than speaking in vague terms.",
        };
      }

      if (mentionsGodLanguage) {
        return {
          status: "partial",
          feedback:
            "Good start, but this stage requires a direct doctrinal statement. Say plainly that there is only one God.",
        };
      }

      return {
        status: "weak",
        feedback:
          "This response does not yet state the doctrinal truth clearly. Say directly that God is one.",
      };

    case "scripture":
      if (
        mentionsScriptureEvidence &&
        (mentionsPositiveConfession || mentionsExclusion)
      ) {
        return {
          status: "strong",
          feedback:
            "Strong scripture response. You grounded the doctrinal claim in the wording of the passages.",
        };
      }

      if (mentionsScriptureEvidence || mentionsPositiveConfession) {
        return {
          status: "partial",
          feedback:
            "You are partway there. This stage needs the doctrinal claim tied to the actual wording of the verses.",
        };
      }

      return {
        status: "weak",
        feedback:
          "This stage requires scriptural grounding. Use the wording of the passages to show that God is one and no other God exists beside Him.",
      };

    case "checkpoint":
      if (mentionsPositiveConfession && mentionsExclusion) {
        return {
          status: "strong",
          feedback: rule.feedback.strong,
        };
      }

      if (mentionsPositiveConfession || mentionsExclusion) {
        return {
          status: "partial",
          feedback: rule.feedback.partial,
        };
      }

      return {
        status: "weak",
        feedback: rule.feedback.weak,
      };

    case "mastery":
      if (
        mentionsPositiveConfession &&
        mentionsExclusion &&
        wordCount(normalized) >= 8
      ) {
        return {
          status: "strong",
          feedback:
            "Strong mastery response. You gave a clear doctrinal confession and stated what the verses exclude.",
        };
      }

      if (mentionsPositiveConfession && mentionsExclusion) {
        return {
          status: "partial",
          feedback:
            "This is close to mastery, but the confession still needs a little more precision and completeness.",
        };
      }

      if (mentionsPositiveConfession || mentionsExclusion) {
        return {
          status: "partial",
          feedback:
            "This response shows some understanding, but mastery requires both the positive confession and the exclusion.",
        };
      }

      return {
        status: "weak",
        feedback:
          "This does not yet show mastery. State clearly that God is one and that no other God exists beside Him.",
      };

    default:
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
}

export function evaluateResponse(
  responseText,
  standardId = "OG.1.18",
  stageId = "checkpoint"
) {
  const normalized = normalizeResponse(responseText);
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

  if (standardId === "OG.1.18") {
    return evaluateOgOneByStage(normalized, rule, stageId);
  }

  const mentionsPositiveConfession = includesAny(
    normalized,
    rule.positiveConfessionPhrases
  );

  const mentionsExclusion = includesAny(normalized, rule.exclusionPhrases);

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
