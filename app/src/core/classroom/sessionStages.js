// `description` here does double duty: it's shown in the UI under the
// stage title, AND it's sent to grade-response as the grading rubric for
// that stage (see evaluateResponse.js -> stageDescription). It has to be a
// precise statement of what a real answer at THIS stage looks like — not a
// vague label — since the grading model judges the learner's response
// against this text, not against buildStagePrompt()'s question wording.
// Each stage maps onto a genuine escalating skill, matching the Brain's own
// four evidence-of-learning levels (Recognition, Explanation, Application,
// Defense) plus a Grounding step between Explanation and Application.
export const sessionStages = [
  {
    id: "focus",
    label: "Focus",
    description:
      "The learner should recall and identify the standard's core claim from memory — what is being confessed, in plain terms — without yet needing to explain why or defend it.",
  },
  {
    id: "truth",
    label: "Truth",
    description:
      "The learner should explain what this truth means in their own words and identify what it rules out — not merely repeat the statement verbatim.",
  },
  {
    id: "scripture",
    label: "Scripture",
    description:
      "The learner should point to specific wording in the anchor scriptures that grounds the claim, showing they can locate real textual support rather than just asserting the doctrine.",
  },
  {
    id: "checkpoint",
    label: "Checkpoint",
    description:
      "The learner should apply the scriptural claim to state precisely what it establishes and what it rules out — genuine reasoning, not a restatement of the verses.",
  },
  {
    id: "mastery",
    label: "Mastery",
    description:
      "The learner should defend this standard against a real denial or opposing reading, using specific wording from the anchor scriptures — an actual defense, not another restatement of the claim.",
  },
];
