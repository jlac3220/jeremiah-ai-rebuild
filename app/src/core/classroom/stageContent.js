// title/description are genuinely generic across every standard — the
// specific content comes from buildStagePrompt() below, which reads
// whichever standard is actually active. Each stage's prompt is a real,
// answerable question using a Bloom's-aligned verb for that stage's level
// (recall, explain, ground, apply, defend) — never just the standard's own
// statement pasted back as if it were the question.
export const stageContent = {
  focus: {
    title: "Session focus",
    description:
      "Recall the core claim before deeper instruction begins — identify it, don't explain it yet.",
  },
  truth: {
    title: "Truth emphasis",
    description:
      "Explain what this truth means and what it rules out — in your own words, not a repeated phrase.",
  },
  scripture: {
    title: "Scripture grounding",
    description:
      "Point to the specific wording in the text that grounds this claim — don't just assert it.",
  },
  checkpoint: {
    title: "Guided checkpoint",
    description:
      "Apply the claim: state precisely what it establishes and what it rules out.",
  },
  mastery: {
    title: "Mastery confirmation",
    description:
      "Defend this standard against a real denial, using the text itself — the final, hardest stage.",
  },
};

/** Builds the "Jeremiah AI Prompt" text for the active stage from the active standard. */
export function buildStagePrompt(stageId, standard) {
  if (!standard) return "";

  const firstVerse = standard.anchorScriptures?.[0]?.reference || "the anchor scripture";

  switch (stageId) {
    case "focus":
      return `From memory, identify the core claim of "${standard.title}." What exactly is being confessed here — in a sentence or two, no more?`;
    case "truth":
      return `Explain, in your own words, what this truth means — and just as importantly, what it rules out. What view would be incompatible with it?`;
    case "scripture":
      return `Look at ${firstVerse} and the other anchor scriptures. Which specific word or phrase does the heaviest lifting for this claim — and why that one?`;
    case "checkpoint":
      return `These verses make a doctrinal claim, not just a mention. Precisely, what do they establish about "${standard.title}" — and what do they rule out?`;
    case "mastery":
      return `A thoughtful skeptic denies this. Using specific wording from the anchor scriptures — not just your own reasoning — defend "${standard.title}" against that denial. What in the text makes it untenable?`;
    default:
      return standard.statement;
  }
}
