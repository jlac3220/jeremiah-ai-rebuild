const STORAGE_KEY = "jeremiah-ai-classroom-entry-intent";

export const CLASSROOM_ENTRY_INTENTS = {
  RESUME: "resume",
  REVIEW: "review",
  ADAPTATION: "adaptation",
  DIRECT: "direct",
};

export const classroomEntryIntentContent = {
  [CLASSROOM_ENTRY_INTENTS.RESUME]: {
    eyebrow: "Resume Session",
    title: "Continue the active lesson path",
    text:
      "Home sent you back into Classroom to continue the live doctrinal session from the current stage, not to start a disconnected activity.",
  },
  [CLASSROOM_ENTRY_INTENTS.REVIEW]: {
    eyebrow: "Review Path",
    title: "Reinforce what still needs correction",
    text:
      "Progress sent you into Classroom to strengthen weak areas, revisit the supporting verses, and move toward clearer doctrinal mastery.",
  },
  [CLASSROOM_ENTRY_INTENTS.ADAPTATION]: {
    eyebrow: "Learner Adaptation",
    title: "Continue at the learner profile level",
    text:
      "Profile sent you into Classroom with the current learner path in view so Jeremiah AI can teach the same truth with the right level of wording, pacing, and expectation.",
  },
  [CLASSROOM_ENTRY_INTENTS.DIRECT]: {
    eyebrow: "Classroom Session",
    title: "Continue the guided doctrinal session",
    text:
      "You are in the active Classroom flow where Jeremiah AI teaches through scripture, checks understanding, corrects weak answers, and advances toward mastery.",
  },
};

export function setClassroomEntryIntent(intent) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(STORAGE_KEY, intent);
}

export function getClassroomEntryIntent() {
  if (typeof window === "undefined") {
    return CLASSROOM_ENTRY_INTENTS.DIRECT;
  }

  return (
    window.sessionStorage.getItem(STORAGE_KEY) ||
    CLASSROOM_ENTRY_INTENTS.DIRECT
  );
}

export function clearClassroomEntryIntent() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(STORAGE_KEY);
}
