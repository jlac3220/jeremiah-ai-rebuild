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
    lessonLabel: "Resume emphasis",
    lessonText:
      "This lesson block should feel like continuation. Stay on the current stage, answer the exact doctrinal prompt in front of you, and keep momentum without drifting into generic comments.",
    responseHint:
      "Continue the current stage with a clear text-based answer tied to the active doctrinal prompt.",
    responseActionLabel: "Continue this stage",
    responseActionText:
      "Do not restart the lesson in your answer. Continue the exact stage in front of you and respond to the live doctrinal demand as clearly as you can.",
    submitButtonLabel: "Continue Stage",
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
    lessonLabel: "Review emphasis",
    lessonText:
      "This lesson block should feel corrective. Jeremiah AI should push the learner back into the exact truth that still needs to be stated more clearly and defended more precisely.",
    responseHint:
      "Answer by correcting weak understanding and grounding the response in the current doctrinal prompt.",
    responseActionLabel: "Correct this understanding",
    responseActionText:
      "Use this response to repair weak understanding. State the doctrine more clearly, rule out the wrong idea, and tie the answer to what the current stage is proving.",
    submitButtonLabel: "Submit Correction",
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
    lessonLabel: "Adaptation emphasis",
    lessonText:
      "This lesson block should feel learner-aware. The doctrine remains fixed, but the way Jeremiah AI frames the question and expects the answer should fit the current learner path.",
    responseHint:
      "Answer the prompt clearly at the current learner level without changing the doctrinal truth itself.",
    responseActionLabel: "Respond at the learner level",
    responseActionText:
      "Keep the doctrine fixed, but answer in a way that fits the current learner path. The goal is faithful truth with the right level of wording and clarity.",
    submitButtonLabel: "Submit Learner-Level Response",
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
    lessonLabel: "Lesson emphasis",
    lessonText:
      "This lesson block should stay tightly focused on the active stage so the learner is responding to the current doctrinal demand, not wandering into disconnected material.",
    responseHint:
      "Respond directly to the active stage prompt with a clear text-based doctrinal answer.",
    responseActionLabel: "Respond to this stage",
    responseActionText:
      "Answer the active stage directly. Jeremiah AI is looking for a real text-based response to the current doctrinal question, not a generic reflection.",
    submitButtonLabel: "Submit Response",
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
