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
    title: "Pick up exactly where the lesson paused",
    text:
      "Home sent you back into Classroom to continue the live doctrinal session from the current stage, not to start a disconnected activity.",
    emphasisLabel: "What matters now",
    emphasisText:
      "Stay with the active stage, answer clearly, and let Jeremiah AI move you forward only when the response shows real understanding.",
    actionLabel: "What Jeremiah AI will do",
    actionText:
      "Continue the guided lesson path, keep the learner anchored to the current verses, and move toward stronger doctrinal confession.",
  },
  [CLASSROOM_ENTRY_INTENTS.REVIEW]: {
    eyebrow: "Review Path",
    title: "Return to the places that still need correction",
    text:
      "Progress sent you into Classroom to reinforce weak areas, revisit the supporting verses, and strengthen places where mastery is not yet stable.",
    emphasisLabel: "What matters now",
    emphasisText:
      "This entry path is for correction, not just continuation. The goal is to tighten weak understanding and make the doctrinal claim clearer.",
    actionLabel: "What Jeremiah AI will do",
    actionText:
      "Revisit the teaching flow, test the learner against the current truth, and press toward stronger precision where understanding is still incomplete.",
  },
  [CLASSROOM_ENTRY_INTENTS.ADAPTATION]: {
    eyebrow: "Learner Adaptation",
    title: "Continue the same truth at the right learner level",
    text:
      "Profile sent you into Classroom with the learner path in view so Jeremiah AI can teach the same doctrine with the right wording, pacing, and mastery expectation.",
    emphasisLabel: "What matters now",
    emphasisText:
      "The truth does not change. What changes is how Jeremiah AI presents the content so the learner can actually grasp and retain it.",
    actionLabel: "What Jeremiah AI will do",
    actionText:
      "Keep the doctrinal target fixed while shaping delivery around learner-level needs, helping the user grow without lowering the truth itself.",
  },
  [CLASSROOM_ENTRY_INTENTS.DIRECT]: {
    eyebrow: "Classroom Session",
    title: "Continue the guided doctrinal session",
    text:
      "You are in the active Classroom flow where Jeremiah AI teaches through scripture, checks understanding, corrects weak answers, and advances toward mastery.",
    emphasisLabel: "What matters now",
    emphasisText:
      "Stay inside the active learning path and respond to the current stage rather than treating the lesson like static reading.",
    actionLabel: "What Jeremiah AI will do",
    actionText:
      "Teach through scripture, evaluate the response, and advance the learner only when the answer shows real doctrinal understanding.",
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
