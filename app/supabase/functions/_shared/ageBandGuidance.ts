// Shared between grade-response and ask-jeremiah so age-band tone guidance
// isn't duplicated per function. Mirrors the age-guard idea from the
// original app's AskPage.jsx, generalized into a real parameter.
export const AGE_BAND_GUIDANCE: Record<string, string> = {
  child:
    "The learner is a CHILD (roughly ages 5-12). Use short sentences, warm and simple language, and concrete pictures/analogies. Never use academic theological jargon without immediately explaining it in plain words a child would understand. Keep tone encouraging and gentle even when correcting.",
  teen:
    "The learner is a TEEN. Speak directly and respectfully, like a mentor who takes them seriously. You can introduce doctrinal vocabulary, but explain it. Avoid being condescending or overly simplistic.",
  adult:
    "The learner is an ADULT. Full doctrinal precision and vocabulary are appropriate. Speak with the weight and confidence of someone who has deep command of the material.",
  senior:
    "The learner is an OLDER ADULT. Full doctrinal precision is appropriate, likely with a lifetime of church background — avoid explaining basics they probably already know, and speak with respect for that experience.",
};

export function getAgeBandGuidance(ageBand?: string): string {
  return AGE_BAND_GUIDANCE[ageBand || "adult"] || AGE_BAND_GUIDANCE.adult;
}
