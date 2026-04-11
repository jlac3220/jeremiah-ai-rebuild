export function evaluateResponse(responseText) {
  const normalized = responseText.trim().toLowerCase();

  if (!normalized) {
    return {
      status: "empty",
      feedback:
        "Enter a response before Jeremiah AI can evaluate your understanding.",
    };
  }

  const mentionsOneGod =
    normalized.includes("one god") ||
    normalized.includes("god is one") ||
    normalized.includes("only one god");

  const mentionsRulesOutOthers =
    normalized.includes("no other god") ||
    normalized.includes("beside him there is no god") ||
    normalized.includes("rules out other gods") ||
    normalized.includes("there is no other god") ||
    normalized.includes("not many gods");

  if (mentionsOneGod && mentionsRulesOutOthers) {
    return {
      status: "strong",
      feedback:
        "Strong response. You identified both the positive confession and the exclusion these verses require.",
    };
  }

  if (mentionsOneGod) {
    return {
      status: "partial",
      feedback:
        "Good start. You identified the oneness claim, but you still need to state what these verses rule out.",
    };
  }

  return {
    status: "weak",
    feedback:
      "This response is too weak. The verses require you to confess that God is one and that no other God exists beside Him.",
  };
}