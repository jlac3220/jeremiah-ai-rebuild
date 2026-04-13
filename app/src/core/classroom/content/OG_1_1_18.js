const directVerses = [
  {
    reference: "Deuteronomy 6:4",
    text: "Hear, O Israel: The LORD our God is one LORD.",
    note: "This verse establishes the irreducible confession of biblical monotheism and anchors the entire lesson.",
  },
  {
    reference: "Isaiah 44:6",
    text: "I am the first, and I am the last; and beside me there is no God.",
    note: "This verse rules out the existence of another divine being alongside the LORD.",
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
    reference: "Mark 12:29",
    text: "The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord.",
    note: "This verse shows that Jesus reaffirmed the Shema rather than replacing it.",
  },
];

export const OG_1_1_18_CLASSROOM_CONTENT = {
  studyId: "OG",
  studyTitle: "The One True God",
  domainId: "OG.1",
  standardId: "OG.1.1.18",
  standardTitle: "The Shema as Doctrinal Foundation",
  truthStatement: "The LORD our God is one LORD.",
  presets: {
    direct: {
      currentStageId: "focus",
      learnerLevel: "Adult Endpoint Path",
      truthExplanation:
        "This direct Classroom session begins at the doctrinal foundation of biblical monotheism. Jeremiah AI introduces the learner to the Shema as the controlling confession for understanding every later revelation about God.",
      verses: directVerses,
      checkpoint: {
        title: "What does the Shema require you to confess?",
        description:
          "Jeremiah AI is checking whether the learner understands that Deuteronomy 6:4 is not a slogan only, but the doctrinal foundation of biblical monotheism.",
        prompt:
          "What does Deuteronomy 6:4 require you to confess about God, and what does Isaiah 44:6 rule out completely?",
      },
    },

    resume: {
      currentStageId: "scripture",
      learnerLevel: "Adult Endpoint Path",
      truthExplanation:
        "This preset resumes an in-progress Classroom path. Jeremiah AI re-enters the learner at the scripture-grounding stage so the monotheistic confession is re-anchored in the text itself.",
      verses: resumeVerses,
      checkpoint: {
        title: "How do these verses hold the doctrine together?",
        description:
          "Jeremiah AI is treating this as a resumed lesson. The learner must reconnect the doctrinal claim to the supporting passages.",
        prompt:
          "Return to the verses and show how they establish the oneness of God and leave no room for another divine person beside Him.",
      },
    },

    review: {
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
          "Use these passages to correct the idea that God exists as multiple divine persons. What must be confessed instead?",
      },
    },

    adaptation: {
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
  },
};

export default OG_1_1_18_CLASSROOM_CONTENT;
