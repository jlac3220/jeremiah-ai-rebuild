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
