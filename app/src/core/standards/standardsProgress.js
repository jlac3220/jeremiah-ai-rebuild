// Tracks mastery per standard as 0-4, matching the evidenceOfLearning level
// order in standardsRegistry.js (1=Recognition, 2=Explanation, 3=Application,
// 4=Defense). Persisted in localStorage so it survives across visits, unlike
// the session-scoped live-stage/entry-intent state.
const STORAGE_KEY = "jeremiah-ai-standard-progress";

export function getStandardProgress() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStandardProgress(progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/** Only ever raises a standard's level — never regresses it. */
export function raiseStandardProgressLevel(standardCode, level) {
  if (typeof window === "undefined" || !standardCode) return;
  const progress = getStandardProgress();
  const current = progress[standardCode] || 0;
  if (level > current) {
    progress[standardCode] = Math.min(level, 4);
    saveStandardProgress(progress);
  }
}

export function getStandardProgressLevel(standardCode) {
  return getStandardProgress()[standardCode] || 0;
}

export function isStandardMastered(standardCode) {
  return getStandardProgressLevel(standardCode) >= 4;
}

// Spaced-repetition review scheduling — kept as a separate store from the
// plain level map above so existing level-based consumers (Map lock logic,
// isSubjectMastered, etc.) are untouched. SM-2-lite: success grows the
// interval, failure resets it short. See "Defend the Faith" — reviewing a
// mastered standard means Jeremiah re-argues its Defense-level objection.
const REVIEW_STORAGE_KEY = "jeremiah-ai-review-schedule";
const SPACED_INTERVALS_DAYS = [1, 3, 7, 21, 60];
const DAY_MS = 24 * 60 * 60 * 1000;

function getReviewSchedule() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(REVIEW_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveReviewSchedule(schedule) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(schedule));
}

/** Call once a standard first reaches mastery, and again after every Defend the Faith round. */
export function scheduleNextReview(standardCode, wasSuccessful) {
  if (typeof window === "undefined" || !standardCode) return;
  const schedule = getReviewSchedule();
  const current = schedule[standardCode] || { reviewCount: 0, nextReviewAt: 0 };

  const reviewCount = wasSuccessful ? current.reviewCount + 1 : 0;
  const intervalDays = wasSuccessful
    ? SPACED_INTERVALS_DAYS[Math.min(reviewCount - 1, SPACED_INTERVALS_DAYS.length - 1)]
    : 1;

  schedule[standardCode] = {
    reviewCount,
    nextReviewAt: Date.now() + intervalDays * DAY_MS,
  };
  saveReviewSchedule(schedule);
}

export function getReviewInfo(standardCode) {
  return getReviewSchedule()[standardCode] || null;
}

/** Mastered standards (level >= 4) whose review is due — or never scheduled yet. */
export function getDueForReview(progress) {
  const schedule = getReviewSchedule();
  const now = Date.now();
  return Object.keys(progress || {}).filter((code) => {
    if ((progress[code] || 0) < 4) return false;
    const entry = schedule[code];
    return !entry || entry.nextReviewAt <= now;
  });
}
