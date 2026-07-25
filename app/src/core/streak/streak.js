// Daily engagement streak — loss-aversion + habit-loop mechanic.
//
// Deliberately only increments on a genuine graded action (a Classroom
// grading result, or a completed Defend the Faith round) — never on merely
// opening the app or visiting a page. Duolingo's own documented failure
// mode is users speed-running trivial actions purely to protect the streak
// instead of actually learning; gating on real engagement avoids that.
const STORAGE_KEY = "jeremiah-ai-streak";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD, local-ish via ISO
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
}

export function getStreak() {
  if (typeof window === "undefined") return { count: 0, lastActiveDate: null };
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") || { count: 0, lastActiveDate: null };
  } catch {
    return { count: 0, lastActiveDate: null };
  }
}

function saveStreak(streak) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(streak));
}

/** Call only after a real graded interaction completes. */
export function recordEngagement() {
  if (typeof window === "undefined") return;
  const streak = getStreak();
  const today = todayKey();

  if (streak.lastActiveDate === today) return; // already counted today

  const gap = streak.lastActiveDate ? daysBetween(streak.lastActiveDate, today) : null;
  const nextCount = gap === 1 ? streak.count + 1 : 1;

  saveStreak({ count: nextCount, lastActiveDate: today });
}

/** Whether today's engagement has already been recorded (streak is safe today). */
export function hasEngagedToday() {
  return getStreak().lastActiveDate === todayKey();
}
