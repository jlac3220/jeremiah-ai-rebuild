import {
  getStandardByCode,
  getNextUnmasteredStandard,
  DEFAULT_STANDARD_CODE,
} from "../standards/standardsRegistry";
import { getStandardProgress } from "../standards/standardsProgress";
import { profileData } from "../../data/profileData";

/** Stand-in for real auth/login — see profileData.learner.ageBand. */
export function getActiveLearnerAgeBand() {
  return profileData?.learner?.ageBand || "adult";
}

const ACTIVE_STANDARD_KEY = "jeremiah-ai-active-standard";
const LIVE_STAGE_KEY_PREFIX = "jeremiah-ai-live-stage";

function getLiveStageStorageKey(standardCode) {
  return `${LIVE_STAGE_KEY_PREFIX}:${standardCode}`;
}

/** Sets which standard the learner is actively working (e.g. from the Doctrine Map). */
export function setActiveStandardCode(standardCode) {
  if (typeof window === "undefined" || !standardCode) return;
  window.sessionStorage.setItem(ACTIVE_STANDARD_KEY, standardCode);
}

/** The active standard, defaulting to the learner's next-unmastered standard. */
export function getActiveStandardCode() {
  if (typeof window === "undefined") return DEFAULT_STANDARD_CODE;

  const stored = window.sessionStorage.getItem(ACTIVE_STANDARD_KEY);
  if (stored && getStandardByCode(stored)) return stored;

  const next = getNextUnmasteredStandard(getStandardProgress());
  return next?.code || DEFAULT_STANDARD_CODE;
}

export function clearActiveStandardCode() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACTIVE_STANDARD_KEY);
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

/**
 * The live classroom session — always built from the active standard (the
 * Brain), never from hand-authored per-standard preset content. Any of the
 * standards in standardsRegistry.js works through this the same way.
 */
export function getCurrentSession() {
  const standardCode = getActiveStandardCode();
  const standard = getStandardByCode(standardCode) || getStandardByCode(DEFAULT_STANDARD_CODE);

  const entryStageId = "focus";
  const liveStageId = getSavedLiveStageForStandard(standard.code) || entryStageId;

  return {
    standardId: standard.code,
    standardTitle: standard.title,
    studyId: standard.subjectCode,
    studyTitle: standard.subjectTitle,
    domainId: standard.domainCode,
    domainTitle: standard.domainTitle,
    truthStatement: standard.statement,
    truthExplanation: standard.statement,
    verses: (standard.anchorScriptures || []).map((verse) => ({
      ...verse,
      note: `Anchor scripture for ${standard.code} — ${standard.title}.`,
    })),
    vocabulary: standard.vocabulary || [],
    evidenceOfLearning: standard.evidenceOfLearning || [],
    presetEntryStageId: entryStageId,
    currentStageId: liveStageId,
    sessionType: standardCode,
  };
}
