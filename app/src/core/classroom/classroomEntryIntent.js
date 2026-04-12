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
    feedbackTone: {
      empty: {
        surfaceLabel: "Jeremiah AI Evaluation",
        label: "Resume requires a real response",
        text:
          "You came back to continue the live stage. Put a real text response in the box so the session can keep moving.",
      },
      weak: {
        surfaceLabel: "Resume Evaluation",
        label: "Continuation needs a clearer answer",
        text:
          "Do not drift away from the live stage. Re-enter the lesson by answering the exact doctrinal demand more clearly.",
      },
      partial: {
        surfaceLabel: "Resume Evaluation",
        label: "Momentum is returning",
        text:
          "You are re-entering the lesson, but the answer still needs more clarity before Jeremiah AI should move you forward.",
      },
      strong: {
        surfaceLabel: "Resume Evaluation",
        label: "The session can move again",
        text:
          "This response shows the lesson momentum is back. Jeremiah AI can keep advancing the live doctrinal path.",
      },
    },
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
    feedbackTone: {
      empty: {
        surfaceLabel: "Review Evaluation",
        label: "Review cannot happen without a response",
        text:
          "This path exists to repair weak understanding. Give Jeremiah AI something to correct and evaluate.",
      },
      weak: {
        surfaceLabel: "Review Evaluation",
        label: "The weak area is still exposed",
        text:
          "The response still leaves the doctrinal weakness in place. Tighten the claim, rule out the wrong idea, and answer the stage more directly.",
      },
      partial: {
        surfaceLabel: "Review Evaluation",
        label: "Correction has started but is not complete",
        text:
          "The learner is moving in the right direction, but the weak area still needs a firmer doctrinal statement before review is complete.",
      },
      strong: {
        surfaceLabel: "Review Evaluation",
        label: "The weak area is being repaired",
        text:
          "This response shows clearer correction. Jeremiah AI can treat this review pass as real progress toward stable mastery.",
      },
    },
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
    feedbackTone: {
      empty: {
        surfaceLabel: "Learner-Level Evaluation",
        label: "Adaptation still needs an answer",
        text:
          "Jeremiah AI can adapt the delivery, but the learner still has to answer. Give a real response at the current learner level.",
      },
      weak: {
        surfaceLabel: "Learner-Level Evaluation",
        label: "The truth still needs clearer expression",
        text:
          "The wording may be learner-aware, but the doctrinal target is still not clear enough. Keep the truth fixed and express it more plainly.",
      },
      partial: {
        surfaceLabel: "Learner-Level Evaluation",
        label: "The learner path is helping, but more clarity is needed",
        text:
          "This shows developing understanding at the current learner level, but Jeremiah AI still needs a more complete doctrinal response.",
      },
      strong: {
        surfaceLabel: "Learner-Level Evaluation",
        label: "The learner-level answer is holding the truth well",
        text:
          "This response keeps the doctrine intact while matching the learner path well enough for Jeremiah AI to treat it as strong progress.",
      },
    },
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
    feedbackTone: {
      empty: {
        surfaceLabel: "Jeremiah AI Evaluation",
        label: "The stage still needs a response",
        text:
          "The learner has to answer the active stage before Jeremiah AI can evaluate understanding or move the session forward.",
      },
      weak: {
        surfaceLabel: "Jeremiah AI Evaluation",
        label: "The stage is not satisfied yet",
        text:
          "The answer does not yet meet the doctrinal demand of the current stage. Respond more directly to what is being asked.",
      },
      partial: {
        surfaceLabel: "Jeremiah AI Evaluation",
        label: "The stage is partway satisfied",
        text:
          "The response shows some understanding, but Jeremiah AI still needs a clearer doctrinal statement before advancing the session.",
      },
      strong: {
        surfaceLabel: "Jeremiah AI Evaluation",
        label: "The stage has been answered well",
        text:
          "The response meets the current doctrinal demand strongly enough for Jeremiah AI to treat it as real learning progress.",
      },
    },
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
