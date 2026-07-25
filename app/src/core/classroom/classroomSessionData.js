import { profileData } from "../../data/profileData";

const LIVE_STAGE_KEY_PREFIX = "jeremiah-ai-live-stage";

function getLiveStageStorageKey(standardCode) {
  return `${LIVE_STAGE_KEY_PREFIX}:${standardCode}`;
}

export function setSavedLiveStageForStandard(standardCode, stageId) {
  if (typeof window === "undefined" || !standardCode || !stageId) return;
  window.sessionStorage.setItem(getLiveStageStorageKey(standardCode), stageId);
}

export function getSavedLiveStageForStandard(standardCode) {
  if (typeof window === "undefined" || !standardCode) return "";
  return window.sessionStorage.getItem(getLiveStageStorageKey(standardCode)) || "";
}

export function clearSavedLiveStageForStandard(standardCode) {
  if (typeof window === "undefined" || !standardCode) return;
  window.sessionStorage.removeItem(getLiveStageStorageKey(standardCode));
}

const INTRO_SEEN_KEY_PREFIX = "jeremiah-ai-intro-seen";

function getIntroSeenStorageKey(standardCode) {
  return `${INTRO_SEEN_KEY_PREFIX}:${standardCode}`;
}

// Tracks whether the learner has clicked past the Introduction stage for a
// standard in this browser session — separate from progress level so a
// first attempt that scores "weak" and hasn't advanced yet doesn't re-show
// the lesson on every retry.
export function getIntroSeenForStandard(standardCode) {
  if (typeof window === "undefined" || !standardCode) return false;
  return window.sessionStorage.getItem(getIntroSeenStorageKey(standardCode)) === "true";
}

export function setIntroSeenForStandard(standardCode) {
  if (typeof window === "undefined" || !standardCode) return;
  window.sessionStorage.setItem(getIntroSeenStorageKey(standardCode), "true");
}

// Stand-in for real auth/login. Persisted in localStorage so a choice on
// the Profile page survives reloads, even though there's no real account
// system yet — falls back to profileData's mock default otherwise.
const AGE_BAND_KEY = "jeremiah-ai-age-band";

export function getActiveLearnerAgeBand() {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(AGE_BAND_KEY);
    if (stored) return stored;
  }
  return profileData?.learner?.ageBand || "adult";
}

export function setActiveLearnerAgeBand(ageBand) {
  if (typeof window === "undefined" || !ageBand) return;
  window.localStorage.setItem(AGE_BAND_KEY, ageBand);
}
