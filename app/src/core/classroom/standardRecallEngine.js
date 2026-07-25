import { getAllStandards } from "../standards/standardsRegistry";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueVerses(standards) {
  const map = new Map();
  standards.forEach((standard) => {
    (standard.anchorScriptures || []).forEach((verse) => map.set(verse.reference, verse));
  });
  return Array.from(map.values());
}

/**
 * A short recall check scoped to exactly what was just learned: this
 * standard's own verses, with wrong-answer choices drawn only from sibling
 * standards in the same domain (falling back to the same subject only if
 * the domain doesn't have enough verses to fill the choices) — never from
 * the wider Brain. This runs the moment a standard is mastered, inside the
 * same Classroom session, instead of sending the learner somewhere else to
 * drill on material they haven't necessarily studied yet.
 */
export function buildStandardRecallRound(standard) {
  if (!standard) return [];
  const ownVerses = standard.anchorScriptures || [];
  if (ownVerses.length === 0) return [];

  const allStandards = getAllStandards();
  const domainSiblings = allStandards.filter(
    (s) => s.domainCode === standard.domainCode && s.code !== standard.code
  );
  const subjectSiblings = allStandards.filter(
    (s) => s.subjectCode === standard.subjectCode && s.code !== standard.code
  );

  const domainVerses = uniqueVerses(domainSiblings);
  const subjectVerses = uniqueVerses(subjectSiblings);
  const distractorPool = domainVerses.length >= 3 ? domainVerses : subjectVerses;

  return shuffle(ownVerses).map((verse) => {
    const distractors = shuffle(
      distractorPool.filter((candidate) => candidate.reference !== verse.reference)
    ).slice(0, 3);
    const choices = shuffle([verse.reference, ...distractors.map((d) => d.reference)]);
    return {
      text: verse.text,
      correctReference: verse.reference,
      choices,
    };
  });
}
