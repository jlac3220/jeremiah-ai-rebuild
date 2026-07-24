// title/description are genuinely generic across every standard. The prompt
// text used to be hardcoded to one doctrine (monotheism) here — that's what
// made adding a second standard require new code. buildStagePrompt() below
// generates the prompt from whichever standard is actually active instead.
export const stageContent = {
  focus: {
    title: "Session focus",
    description:
      "Orient the learner to the doctrinal target before deeper instruction begins.",
  },
  truth: {
    title: "Truth emphasis",
    description:
      "State the doctrinal truth clearly before asking the learner to reason from scripture.",
  },
  scripture: {
    title: "Scripture grounding",
    description:
      "Anchor the learner in the passages that prove the doctrinal claim.",
  },
  checkpoint: {
    title: "Guided checkpoint",
    description:
      "Require the learner to respond to the doctrinal claim made by the passages.",
  },
  mastery: {
    title: "Mastery confirmation",
    description:
      "Confirm whether the learner can now express the truth with sufficient clarity and precision.",
  },
};

/** Builds the "Jeremiah AI Prompt" text for the active stage from the active standard. */
export function buildStagePrompt(stageId, standard) {
  if (!standard) return "";

  const firstVerse = standard.anchorScriptures?.[0]?.reference || "the anchor scripture";

  switch (stageId) {
    case "focus":
      return `In this session, you are focusing on what the scriptures require you to confess about: ${standard.title}.`;
    case "truth":
      return `The truth being taught here is: ${standard.statement}`;
    case "scripture":
      return `Read the verses carefully, starting with ${firstVerse}, and identify the wording that establishes: ${standard.statement}`;
    case "checkpoint":
      return `These verses make a doctrinal claim, not just a mention. What do they establish, and what do they rule out, regarding "${standard.title}"?`;
    case "mastery":
      return `State clearly, in your own words, what these verses require you to confess: ${standard.statement}. Reference specific wording from the anchor scriptures.`;
    default:
      return standard.statement;
  }
}
