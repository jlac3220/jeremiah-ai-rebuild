import { getAllStandards, isSubjectUnlocked } from "../standards/standardsRegistry";
import { getVocabularyDefinition } from "../standards/vocabularyGlossary";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function truncate(text, max) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

const PROMPTS = {
  reference: "Which reference is this verse from?",
  vocabulary: "Which term does this definition describe?",
  truth: "Which standard does this describe?",
};

/**
 * Every possible drill question drawn from one standard's own content,
 * across three skill types (not just verse-reference recall): Scripture,
 * Vocabulary, and Truth. Distractor choices come only from `pool` — the
 * caller controls how wide that pool is (a single domain for a Classroom
 * session, the whole unlocked Brain for the standalone drill).
 */
function buildQuestionsForStandard(standard, pool) {
  const questions = [];

  (standard.anchorScriptures || []).forEach((verse) => {
    // Dedupe by reference — the same verse can legitimately appear in more
    // than one sibling standard's anchorScriptures, and an undeduped pool
    // could draw it twice as a "distractor," producing two identical choices.
    const uniqueVerseDistractors = Array.from(
      new Map(
        pool
          .flatMap((s) => s.anchorScriptures || [])
          .filter((v) => v.reference !== verse.reference)
          .map((v) => [v.reference, v])
      ).values()
    );
    const distractors = shuffle(uniqueVerseDistractors).slice(0, 3);
    if (distractors.length < 3) return;
    questions.push({
      type: "reference",
      prompt: PROMPTS.reference,
      text: verse.text,
      correctLabel: verse.reference,
      choices: shuffle([verse.reference, ...distractors.map((d) => d.reference)]),
      subjectCode: standard.subjectCode,
      standardCode: standard.code,
      standardTitle: standard.title,
      hasStudied: standard.hasStudied,
    });
  });

  (standard.vocabulary || []).forEach((term) => {
    const definition = getVocabularyDefinition(term);
    if (!definition) return;
    // Same dedupe concern — a term like "Echad" can appear in several
    // sibling standards' vocabulary lists.
    const uniqueTermDistractors = Array.from(
      new Set(
        pool
          .flatMap((s) => s.vocabulary || [])
          .filter((t) => t !== term && getVocabularyDefinition(t))
      )
    );
    const distractorTerms = shuffle(uniqueTermDistractors).slice(0, 3);
    if (distractorTerms.length < 3) return;
    questions.push({
      type: "vocabulary",
      prompt: PROMPTS.vocabulary,
      text: definition,
      correctLabel: term,
      choices: shuffle([term, ...distractorTerms]),
      subjectCode: standard.subjectCode,
      standardCode: standard.code,
      standardTitle: standard.title,
      hasStudied: standard.hasStudied,
    });
  });

  if (standard.statement && standard.title) {
    const uniqueTitleDistractors = Array.from(
      new Set(pool.filter((s) => s.code !== standard.code).map((s) => s.title))
    );
    const distractorTitles = shuffle(uniqueTitleDistractors).slice(0, 3);
    if (distractorTitles.length >= 3) {
      questions.push({
        type: "truth",
        prompt: PROMPTS.truth,
        text: truncate(standard.statement, 220),
        correctLabel: standard.title,
        choices: shuffle([standard.title, ...distractorTitles]),
        subjectCode: standard.subjectCode,
        standardCode: standard.code,
        standardTitle: standard.title,
        hasStudied: standard.hasStudied,
      });
    }
  }

  return questions;
}

function buildRoundFromPool(sourceStandards, poolStandards, count) {
  const allQuestions = sourceStandards.flatMap((s) => buildQuestionsForStandard(s, poolStandards));
  const studied = shuffle(allQuestions.filter((q) => q.hasStudied));
  const unstudied = shuffle(allQuestions.filter((q) => !q.hasStudied));
  const ordered = [...studied, ...unstudied];
  return ordered.slice(0, Math.min(count, ordered.length));
}

/**
 * The standalone drill (Home/Progress "Quick Drill"): pulls from every
 * unlocked standard, studied material first, mixing all three skill types —
 * not just scripture reference — so review actually varies question to
 * question instead of drilling one narrow skill over and over.
 */
export function buildDrillRound(progress, count = 10) {
  const unlocked = getAllStandards().filter((s) => isSubjectUnlocked(s.subjectCode, progress));
  const withFlag = unlocked.map((s) => ({ ...s, hasStudied: (progress[s.code] || 0) > 0 }));
  return buildRoundFromPool(withFlag, withFlag, count);
}

/**
 * The Classroom Recall phase: every drillable question from THIS standard
 * alone (all its verses, vocabulary, and its own truth question), with
 * distractors drawn only from its own domain (falling back to its subject
 * if the domain is too small) — never the wider Brain.
 */
export function buildStandardDrillRound(standard, count = 6) {
  if (!standard) return [];
  const all = getAllStandards();
  const domainSiblings = all.filter((s) => s.domainCode === standard.domainCode);
  const subjectSiblings = all.filter((s) => s.subjectCode === standard.subjectCode);
  const pool = domainSiblings.length >= 4 ? domainSiblings : subjectSiblings;
  const source = [{ ...standard, hasStudied: true }];
  return buildRoundFromPool(source, pool, count);
}

/**
 * Real counts for surfacing on Home/Progress instead of a generic blurb —
 * "47 verses, 12 terms, 9 truths ready to drill" is concrete in a way
 * "quiz yourself" never is.
 */
export function getDrillPoolStats(progress) {
  const unlocked = getAllStandards().filter(
    (s) => isSubjectUnlocked(s.subjectCode, progress) && (progress[s.code] || 0) > 0
  );
  let referenceCount = 0;
  let vocabularyCount = 0;
  let truthCount = 0;
  unlocked.forEach((standard) => {
    referenceCount += (standard.anchorScriptures || []).length;
    vocabularyCount += (standard.vocabulary || []).filter((term) => getVocabularyDefinition(term)).length;
    if (standard.statement) truthCount += 1;
  });
  return {
    referenceCount,
    vocabularyCount,
    truthCount,
    total: referenceCount + vocabularyCount + truthCount,
  };
}
