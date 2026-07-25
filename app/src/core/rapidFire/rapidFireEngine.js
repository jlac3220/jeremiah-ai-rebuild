import { getAllStandards, isSubjectUnlocked } from "../standards/standardsRegistry";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Every anchor scripture, but only from standards whose SUBJECT is actually
// unlocked for this learner (NB stays out of the pool entirely until OG is
// mastered, matching the Map's own gating) — and tagged with whether the
// learner has personally engaged that standard, so review can be weighted
// toward what they've actually studied. This is meant to feel like one
// continuation of the same Doctrine Map journey, not a disconnected trivia
// generator over content the learner hasn't reached yet.
function buildVersePool(progress) {
  const pool = [];
  getAllStandards().forEach((standard) => {
    if (!isSubjectUnlocked(standard.subjectCode, progress)) return;
    const level = progress[standard.code] || 0;
    (standard.anchorScriptures || []).forEach((verse) => {
      pool.push({
        reference: verse.reference,
        text: verse.text,
        subjectCode: standard.subjectCode,
        standardCode: standard.code,
        standardTitle: standard.title,
        hasStudied: level > 0,
      });
    });
  });
  return pool;
}

/**
 * Builds a Rapid Fire round grounded in the learner's actual position in
 * the curriculum: verses from standards they've started or mastered come
 * first (real review), filled out with unstarted-but-unlocked material only
 * if there isn't enough studied material yet — never with locked-subject
 * content. Distractor choices are drawn from the same unlocked pool, so a
 * fresh learner is never shown an NB reference as an answer option before
 * NB unlocks.
 */
export function buildRapidFireRound(progress, count = 10) {
  const pool = buildVersePool(progress || {});
  const uniqueByReference = Array.from(new Map(pool.map((v) => [v.reference, v])).values());

  const studied = shuffle(uniqueByReference.filter((v) => v.hasStudied));
  const unstudied = shuffle(uniqueByReference.filter((v) => !v.hasStudied));
  const ordered = [...studied, ...unstudied];

  const roundSize = Math.min(count, ordered.length);
  const chosen = ordered.slice(0, roundSize);

  return chosen.map((verse) => {
    const distractors = shuffle(uniqueByReference.filter((v) => v.reference !== verse.reference)).slice(0, 3);
    const choices = shuffle([verse.reference, ...distractors.map((d) => d.reference)]);
    return {
      text: verse.text,
      correctReference: verse.reference,
      subjectCode: verse.subjectCode,
      standardCode: verse.standardCode,
      standardTitle: verse.standardTitle,
      wasStudied: verse.hasStudied,
      choices,
    };
  });
}
