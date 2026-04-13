import {
  DEFAULT_CLASSROOM_STANDARD_ID,
  classroomContentRegistry,
  getClassroomContentByStandardId,
} from "./content/classroomContentRegistry";

const STORAGE_KEY = "jeremiah-ai-active-classroom-session";
const LIVE_STAGE_KEY_PREFIX = "jeremiah-ai-live-stage";

export const CLASSROOM_SESSION_PRESETS = {
  RESUME: "resume",
  REVIEW: "review",
  ADAPTATION: "adaptation",
  DIRECT: "direct",
};

function getFallbackClassroomContent() {
  return (
    getClassroomContentByStandardId(DEFAULT_CLASSROOM_STANDARD_ID) ||
    Object.values(classroomContentRegistry)[0] || {
      studyId: "",
      studyTitle: "",
      domainId: "",
      standardId: DEFAULT_CLASSROOM_STANDARD_ID,
      standardTitle: "",
      truthStatement: "",
      presets: {},
    }
  );
}

function getSessionBase(content) {
  return {
    studyId: content.studyId,
    studyTitle: content.studyTitle,
    domainId: content.domainId || "",
    standardId: content.standardId,
    standardTitle: content.standardTitle,
    truthStatement: content.truthStatement,
  };
}

function buildPresetSession(content, presetId) {
  return {
    ...getSessionBase(content),
    ...(content.presets?.[presetId] || {}),
  };
}

export function getClassroomSessionPresets(
  standardId = DEFAULT_CLASSROOM_STANDARD_ID
) {
  const content =
    getClassroomContentByStandardId(standardId) || getFallbackClassroomContent();

  return {
    [CLASSROOM_SESSION_PRESETS.DIRECT]: buildPresetSession(
      content,
      CLASSROOM_SESSION_PRESETS.DIRECT
    ),
    [CLASSROOM_SESSION_PRESETS.RESUME]: buildPresetSession(
      content,
      CLASSROOM_SESSION_PRESETS.RESUME
    ),
    [CLASSROOM_SESSION_PRESETS.REVIEW]: buildPresetSession(
      content,
      CLASSROOM_SESSION_PRESETS.REVIEW
    ),
    [CLASSROOM_SESSION_PRESETS.ADAPTATION]: buildPresetSession(
      content,
      CLASSROOM_SESSION_PRESETS.ADAPTATION
    ),
  };
}

export const classroomSessionPresets = getClassroomSessionPresets();

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === "object") return Object.values(value);
  return [];
}

function countLike(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object") return Object.keys(value).length;
  return 0;
}

function firstNonEmpty(values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

function getLiveStageStorageKey(presetId) {
  return `${LIVE_STAGE_KEY_PREFIX}:${presetId}`;
}

export function selectHomeSessionPreset(homeData = {}) {
  const stageId = firstNonEmpty([
    homeData?.continueCard?.currentStageId,
    homeData?.continueCard?.stageId,
    homeData?.continueCard?.stage,
    homeData?.activeSession?.currentStageId,
    homeData?.activeSession?.stageId,
    homeData?.activeSession?.stage,
  ])
    .trim()
    .toLowerCase();

  if (["scripture", "checkpoint", "mastery"].includes(stageId)) {
    return CLASSROOM_SESSION_PRESETS.RESUME;
  }

  if (["focus", "truth"].includes(stageId)) {
    return CLASSROOM_SESSION_PRESETS.DIRECT;
  }

  return CLASSROOM_SESSION_PRESETS.RESUME;
}

export function selectProgressSessionPreset(progressData = {}) {
  const reviewSignals = [
    countLike(progressData?.reviewNeeded),
    countLike(progressData?.reviewQueue),
    countLike(progressData?.weakAreas),
    countLike(progressData?.itemsNeedingReview),
    countLike(progressData?.reviewItems),
  ];

  if (reviewSignals.some((count) => count > 0)) {
    return CLASSROOM_SESSION_PRESETS.REVIEW;
  }

  const activeLearningSignals = [
    progressData?.activeLearning,
    progressData?.activePath,
    progressData?.currentTrack,
    progressData?.nextStep,
    ...toArray(progressData?.masterySummary),
  ];

  if (activeLearningSignals.some(Boolean)) {
    return CLASSROOM_SESSION_PRESETS.RESUME;
  }

  return CLASSROOM_SESSION_PRESETS.DIRECT;
}

export function selectProfileSessionPreset(profileData = {}) {
  const learnerSignals = [
    profileData?.learnerLevel,
    profileData?.level,
    profileData?.profileLevel,
    profileData?.ageBand,
    profileData?.learnerPath,
  ];

  const adaptationSignals = [
    countLike(profileData?.adaptation),
    countLike(profileData?.adaptationInfo),
    countLike(profileData?.supportNeeds),
    countLike(profileData?.learningProfile),
  ];

  if (firstNonEmpty(learnerSignals) || adaptationSignals.some((count) => count > 0)) {
    return CLASSROOM_SESSION_PRESETS.ADAPTATION;
  }

  return CLASSROOM_SESSION_PRESETS.DIRECT;
}

export function setActiveClassroomSessionPreset(presetId) {
  if (typeof window === "undefined") return;

  const availablePresets = getClassroomSessionPresets();

  const safePreset =
    availablePresets[presetId] != null
      ? presetId
      : CLASSROOM_SESSION_PRESETS.DIRECT;

  window.sessionStorage.setItem(STORAGE_KEY, safePreset);
}

export function getActiveClassroomSessionPreset() {
  if (typeof window === "undefined") {
    return CLASSROOM_SESSION_PRESETS.DIRECT;
  }

  return (
    window.sessionStorage.getItem(STORAGE_KEY) ||
    CLASSROOM_SESSION_PRESETS.DIRECT
  );
}

export function clearActiveClassroomSessionPreset() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function setSavedLiveStageForPreset(presetId, stageId) {
  if (typeof window === "undefined" || !presetId || !stageId) return;
  window.sessionStorage.setItem(getLiveStageStorageKey(presetId), stageId);
}

export function getSavedLiveStageForPreset(presetId) {
  if (typeof window === "undefined" || !presetId) return "";

  return window.sessionStorage.getItem(getLiveStageStorageKey(presetId)) || "";
}

export function clearSavedLiveStageForPreset(presetId) {
  if (typeof window === "undefined" || !presetId) return;
  window.sessionStorage.removeItem(getLiveStageStorageKey(presetId));
}

export function getCurrentSession() {
  const content = getFallbackClassroomContent();
  const presets = getClassroomSessionPresets(content.standardId);
  const presetId = getActiveClassroomSessionPreset();
  const preset =
    presets[presetId] || presets[CLASSROOM_SESSION_PRESETS.DIRECT];

  const savedLiveStageId =
    getSavedLiveStageForPreset(presetId) || preset.currentStageId;

  return {
    ...preset,
    presetId,
    sessionType: presetId,
    presetEntryStageId: preset.currentStageId,
    currentStageId: savedLiveStageId,
  };
}

export const currentSession = {
  ...getClassroomSessionPresets()[CLASSROOM_SESSION_PRESETS.DIRECT],
  presetId: CLASSROOM_SESSION_PRESETS.DIRECT,
  sessionType: CLASSROOM_SESSION_PRESETS.DIRECT,
  presetEntryStageId:
    getClassroomSessionPresets()[CLASSROOM_SESSION_PRESETS.DIRECT].currentStageId,
};
