const STORAGE_KEY = "jeremiah-ai-active-classroom-session";

export const CLASSROOM_SESSION_PRESETS = {
  RESUME: "resume",
  REVIEW: "review",
  ADAPTATION: "adaptation",
  DIRECT: "direct",
};

const commonSession = {
  studyId: "OG",
  studyTitle: "The One True God",
  standardId: "OG.1.18",
  standardTitle: "God is One",
  truthStatement: "There is one God.",
};

const directVerses = [
  {
    reference: "Deuteronomy 6:4",
    text: "Hear, O Israel: The LORD our God is one LORD.",
    note: "This verse states the oneness of God directly and serves as a foundational testimony.",
  },
  {
    reference: "Isaiah 44:6",
    text: "I am the first, and I am the last; and beside me there is no God.",
    note: "This verse rules out the existence of another divine being alongside God.",
  },
];

const resumeVerses = [
  {
    reference: "Deuteronomy 6:4",
    text: "Hear, O Israel: The LORD our God is one LORD.",
    note: "This verse pulls the learner back into the active scripture stage by restating the core confession clearly.",
  },
  {
    reference: "Isaiah 44:6",
    text: "I am the first, and I am the last; and beside me there is no God.",
    note: "This verse keeps the resumed lesson from drifting by forcing the learner to face what the doctrine excludes.",
  },
];

const reviewVerses = [
  {
    reference: "Deuteronomy 6:4",
    text: "Hear, O Israel: The LORD our God is one LORD.",
    note: "Review uses this verse to restate the positive doctrinal confession with precision.",
  },
  {
    reference: "Isaiah 44:6",
    text: "I am the first, and I am the last; and beside me there is no God.",
    note: "Review uses this verse to expose and correct any idea of another divine being.",
  },
  {
    reference: "Isaiah 45:5",
    text: "I am the LORD, and there is none else, there is no God beside me.",
    note: "This verse intensifies correction by repeating the exclusion in unmistakable language.",
  },
];

const adaptationVerses = [
  {
    reference: "Deuteronomy 6:4",
    text: "Hear, O Israel: The LORD our God is one LORD.",
    note: "This verse keeps the truth simple and direct so the learner can hold the main claim clearly.",
  },
  {
    reference: "Isaiah 44:6",
    text: "I am the first, and I am the last; and beside me there is no God.",
    note: "This verse helps the learner understand that the Bible does not leave room for another God beside Him.",
  },
];

export const classroomSessionPresets = {
  [CLASSROOM_SESSION_PRESETS.DIRECT]: {
    ...commonSession,
    currentStageId: "focus",
    learnerLevel: "Adult Endpoint Path",
    truthExplanation:
      "This is the direct Classroom session. Jeremiah AI starts at the beginning of the guided lesson path and teaches the oneness of God through a structured doctrinal flow.",
    verses: directVerses,
    checkpoint: {
      title: "What do these verses require you to confess?",
      description:
        "Jeremiah AI is checking whether the learner understands what these passages prove, not just whether they can repeat the words.",
      prompt:
        "These verses do not merely mention God. They make a doctrinal claim. What do they rule out, and what do they require you to confess instead?",
    },
  },

  [CLASSROOM_SESSION_PRESETS.RESUME]: {
    ...commonSession,
    currentStageId: "scripture",
    learnerLevel: "Adult Endpoint Path",
    truthExplanation:
      "This preset resumes an in-progress Classroom path. Jeremiah AI re-enters the learner at the current scripture-grounding stage instead of restarting the lesson from the beginning.",
    verses: resumeVerses,
    checkpoint: {
      title: "How do these verses anchor the confession already in progress?",
      description:
        "Jeremiah AI is treating this as a resumed lesson. The learner must reconnect the live doctrinal claim to the supporting passages.",
      prompt:
        "Return to the verses and show how they anchor the confession already being taught. What do they say, and what do they leave no room for?",
    },
  },

  [CLASSROOM_SESSION_PRESETS.REVIEW]: {
    ...commonSession,
    currentStageId: "checkpoint",
    learnerLevel: "Correction Path",
    truthExplanation:
      "This preset opens a correction-oriented review path. Jeremiah AI revisits the same doctrinal truth, but enters where weak understanding must be tested and repaired directly.",
    verses: reviewVerses,
    checkpoint: {
      title: "Correct the weak understanding directly",
      description:
        "Jeremiah AI is not looking for vague agreement here. This review path exists to repair the exact doctrinal weakness still showing in the learner response.",
      prompt:
        "Use these passages to correct the weak idea directly. What must be confessed, and what false idea do these verses shut down completely?",
    },
  },

  [CLASSROOM_SESSION_PRESETS.ADAPTATION]: {
    ...commonSession,
    currentStageId: "truth",
    learnerLevel: "Profile-Adaptive Path",
    truthExplanation:
      "This preset opens a learner-level path. Jeremiah AI keeps the doctrine fixed but begins at a truth-framing stage that fits profile-based delivery rather than a one-size-fits-all entry.",
    verses: adaptationVerses,
    checkpoint: {
      title: "State the truth clearly at the learner level",
      description:
        "Jeremiah AI is checking whether the learner can state the same doctrine clearly without changing the truth itself.",
      prompt:
        "In learner-level wording, state what these verses teach about God and explain what they do not allow you to believe instead.",
    },
  },
};

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

  const safePreset =
    classroomSessionPresets[presetId] != null
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

export function getCurrentSession() {
  const presetId = getActiveClassroomSessionPreset();
  return (
    classroomSessionPresets[presetId] ||
    classroomSessionPresets[CLASSROOM_SESSION_PRESETS.DIRECT]
  );
}

export const currentSession =
  classroomSessionPresets[CLASSROOM_SESSION_PRESETS.DIRECT];
