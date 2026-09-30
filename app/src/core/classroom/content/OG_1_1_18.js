const shema = {
  id: "deut-6-4",
  reference: "Deuteronomy 6:4",
  text: "Hear, O Israel: The LORD our God is one LORD.",
  note: "The Shema establishes the controlling confession of biblical monotheism.",
};

const isaiah44 = {
  id: "isa-44-6",
  reference: "Isaiah 44:6",
  text: "Thus saith the LORD the King of Israel, and his redeemer the LORD of hosts; I am the first, and I am the last; and beside me there is no God.",
  note: "Isaiah sharpens the confession by explicitly excluding another God beside the LORD.",
};

const isaiah45 = {
  id: "isa-45-5",
  reference: "Isaiah 45:5",
  text: "I am the LORD, and there is none else, there is no God beside me.",
  note: "This repetition makes the exclusion unmistakable: there is no God beside the LORD.",
};

const mark12 = {
  id: "mark-12-29",
  reference: "Mark 12:29",
  text: "The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord.",
  note: "Jesus repeats the Shema, showing that the confession remains foundational in New Testament teaching.",
};

export const OG_1_1_18_CLASSROOM_CONTENT = {
  studyId: "OG",
  studyTitle: "The One True God",
  domainId: "OG.1",
  standardId: "OG.1.1.18",
  standardTitle: "The Shema as Doctrinal Foundation",
  truthStatement: "The LORD our God is one LORD.",

  brain: {
    essentialQuestion:
      "What confession about God must control everything else we learn about Him?",
    masteryTarget:
      "The learner can state from Scripture that God is one, explain that Scripture excludes another God beside Him, and use the Shema as the doctrinal foundation for later revelation about God.",
    requiredKnowledge: [
      {
        id: "one-lord",
        title: "The positive confession",
        truth: "Biblical monotheism begins with the confession that the LORD our God is one LORD.",
      },
      {
        id: "no-other",
        title: "The exclusion",
        truth: "The prophets do not merely prefer one God; they explicitly deny the existence of another God beside the LORD.",
      },
      {
        id: "controlling-foundation",
        title: "The controlling foundation",
        truth: "Later biblical language about God must be interpreted without overturning the Bible's repeated confession that God is one.",
      },
    ],
    requiredScripture: [shema, isaiah44, isaiah45, mark12],
    misconceptions: [
      {
        id: "generic-monotheism",
        label: "One God as a vague slogan",
        description:
          "The learner repeats 'one God' without understanding the explicit biblical exclusion of another God beside Him.",
      },
      {
        id: "multiple-divine-persons",
        label: "Multiple divine persons treated as the starting point",
        description:
          "The learner begins with later theological categories instead of allowing the Shema and prophetic declarations to establish the controlling doctrinal foundation.",
      },
      {
        id: "scripture-free-confession",
        label: "Correct words without scriptural grounding",
        description:
          "The learner can say the expected phrase but cannot show how the biblical text itself supports the confession.",
      },
    ],
    evidenceOfUnderstanding: [
      "States positively that God is one.",
      "Explains that Scripture rules out another God beside the LORD.",
      "Uses at least one relevant passage accurately.",
      "Treats the Shema as a doctrinal foundation rather than an isolated slogan.",
    ],
    teacherGuardrails: [
      "Teach only from the doctrinal contract and Scripture supplied by the standard.",
      "Do not change the required truth to accommodate a learner response.",
      "Do not tell the learner that required content can be skipped because they already know it.",
      "Correct misconceptions directly but respectfully.",
      "Teach before testing. Checks should verify understanding, not replace instruction.",
      "Prefer one clear instructional move at a time over long lectures.",
      "Use KJV wording when quoting the supplied verses.",
    ],
  },

  instructionalMoves: [
    {
      id: "arrival",
      stageId: "focus",
      type: "launch",
      eyebrow: "THE ONE TRUE GOD",
      title: "Begin with the confession Scripture gives us",
      body:
        "This lesson will not begin with a theological chart or a test. Jeremiah will walk you through the biblical language first, then ask you to explain what it requires.",
      teacherLine:
        "The goal is simple: let Scripture establish the foundation before we build anything on top of it.",
      ctaLabel: "Begin",
      next: { continue: "hear_the_shema" },
    },
    {
      id: "hear_the_shema",
      stageId: "scripture",
      type: "scripture_teach",
      eyebrow: "READ IT SLOWLY",
      title: "Hear the confession before you explain it",
      scripture: [shema],
      teaching: [
        "Deuteronomy 6:4 is commonly called the Shema from its opening command: “Hear.” It is not a side comment. It is a confession Israel is commanded to receive and carry.",
        "The center of the confession is the identity of God: “The LORD our God is one LORD.” Before Scripture asks us to explain everything about God, it tells us where the explanation must begin.",
      ],
      focusPhrases: ["one LORD"],
      focusNote:
        "This is the positive confession. The biblical starting point is not a collection of divine beings working together. The LORD our God is one LORD.",
      ctaLabel: "Keep building",
      next: { continue: "oneness_first" },
    },
    {
      id: "oneness_first",
      stageId: "truth",
      type: "teach",
      eyebrow: "BUILD THE FOUNDATION",
      title: "Oneness is the starting point, not the leftover conclusion",
      teaching: [
        "A foundation controls what can be built on it. If Scripture begins by confessing that God is one, later language about God cannot be interpreted in a way that destroys that confession.",
        "That does not mean every later passage says the same thing in the same way. It means later revelation must agree with what God has already revealed about Himself.",
      ],
      insights: [
        {
          label: "Start here",
          text: "The LORD our God is one LORD.",
        },
        {
          label: "Carry it forward",
          text: "Later revelation adds truth; it does not overturn God's revealed identity.",
        },
      ],
      ctaLabel: "See how Isaiah sharpens it",
      next: { continue: "isaiah_exclusion" },
    },
    {
      id: "isaiah_exclusion",
      stageId: "scripture",
      type: "scripture_teach",
      eyebrow: "LET THE PROPHETS SPEAK",
      title: "Isaiah does more than repeat “one”",
      scripture: [isaiah44, isaiah45],
      teaching: [
        "The prophets sharpen the confession by stating the opposite possibility and ruling it out. Isaiah does not merely say that the LORD is Israel's preferred God.",
        "He says, “beside me there is no God,” and again, “there is none else.” The biblical claim is both positive and exclusive: God is one, and no other God exists beside Him.",
      ],
      focusPhrases: ["beside me there is no God", "there is none else"],
      focusNote:
        "This is why biblical monotheism cannot remain a vague slogan. Scripture defines the confession by excluding another God beside the LORD.",
      ctaLabel: "Connect the testimony",
      next: { continue: "mark12_bridge" },
    },
    {
      id: "mark12_bridge",
      stageId: "scripture",
      type: "scripture_teach",
      eyebrow: "OLD TESTAMENT → NEW TESTAMENT",
      title: "Jesus does not discard the Shema",
      scripture: [shema, mark12],
      teaching: [
        "When Jesus is asked about the first commandment, He begins by repeating Israel's confession: “Hear, O Israel; The Lord our God is one Lord.”",
        "That matters. The New Testament does not treat the Shema as an obsolete starting point. Jesus carries the confession forward.",
      ],
      focusPhrases: ["The Lord our God is one Lord"],
      focusNote:
        "The foundation remains in place. Whatever else we learn later must be read in harmony with the confession Jesus Himself repeats.",
      ctaLabel: "Put it together",
      next: { continue: "synthesis" },
    },
    {
      id: "synthesis",
      stageId: "truth",
      type: "synthesis",
      eyebrow: "PUT THE TESTIMONY TOGETHER",
      title: "Three ideas now belong together",
      teaching: [
        "At this point, the lesson is not asking you to memorize a sentence. It is asking you to see the structure of the biblical testimony.",
      ],
      insights: [
        {
          label: "1 · Positive confession",
          text: "The LORD our God is one LORD.",
        },
        {
          label: "2 · Explicit exclusion",
          text: "There is no God beside Him; there is none else.",
        },
        {
          label: "3 · Controlling foundation",
          text: "Later revelation must be understood without overturning that confession.",
        },
      ],
      ctaLabel: "Test the foundation",
      next: { continue: "pressure_test" },
    },
    {
      id: "pressure_test",
      stageId: "checkpoint",
      type: "scenario",
      eyebrow: "ONE CHECK",
      title: "Now test the foundation under pressure",
      body:
        "A learner says: “I agree there is one God, but I can define that one God however I want later.”",
      prompt:
        "Which response best protects the role of the Shema as a doctrinal foundation?",
      choices: [
        {
          id: "control-later",
          label:
            "Later revelation must be understood in a way that does not overturn the repeated biblical confession that God is one and none exists beside Him.",
        },
        {
          id: "ignore-shema",
          label:
            "The Shema matters only in the Old Testament, so later language can replace it.",
        },
        {
          id: "definitions-free",
          label:
            "As long as someone says “one God,” the underlying definition does not matter.",
        },
      ],
      expectedChoiceIds: ["control-later"],
      evidenceIds: ["controlling-foundation"],
      next: {
        strong: "teach_it_back",
        partial: "repair_foundation",
        weak: "repair_foundation",
      },
    },
    {
      id: "repair_foundation",
      stageId: "checkpoint",
      type: "teach",
      eyebrow: "RETEACH",
      title: "The issue is not the phrase “one God” by itself",
      teaching: [
        "A person can repeat the words “one God” while giving those words a meaning the passages themselves do not support.",
        "The Shema gives the positive confession. Isaiah gives the exclusion. Jesus carries the confession forward. Those statements place boundaries around later explanations of God.",
      ],
      insights: [
        {
          label: "Ask this",
          text: "Does my later explanation preserve one LORD and no God beside Him?",
        },
      ],
      ctaLabel: "Try the pressure test again",
      next: { continue: "pressure_test" },
    },
    {
      id: "teach_it_back",
      stageId: "checkpoint",
      type: "free_response",
      eyebrow: "TEACH IT BACK",
      title: "Explain the foundation in your own words",
      body:
        "Do not copy Jeremiah's wording. Imagine you are explaining this to someone who has never studied the subject.",
      prompt:
        "What does the Shema require you to confess about God, and what does Isaiah rule out?",
      placeholder:
        "Explain the biblical foundation in your own words...",
      evidenceIds: ["one-lord", "no-other", "controlling-foundation"],
      strategyRoutes: {
        scripture_revisit: "guided_reteach",
        contrast: "guided_reteach",
        guided_question: "guided_reteach",
        clarify: "guided_reteach",
        misconception_correction: "guided_reteach",
        encourage_retry: "guided_reteach",
      },
      next: {
        strong: "mastery",
        partial: "guided_reteach",
        weak: "guided_reteach",
      },
    },
    {
      id: "guided_reteach",
      stageId: "checkpoint",
      type: "synthesis",
      eyebrow: "BUILD IT AGAIN",
      title: "Use the three-part frame, then explain it again",
      teaching: [
        "If your explanation felt incomplete, rebuild it from the actual flow of the passages instead of searching for better-sounding words.",
      ],
      insights: [
        {
          label: "Confess",
          text: "God is one.",
        },
        {
          label: "Ground",
          text: "The LORD our God is one LORD; there is no God beside Him.",
        },
        {
          label: "Carry",
          text: "Later revelation must preserve that biblical foundation.",
        },
      ],
      ctaLabel: "Teach it back again",
      next: { continue: "teach_it_back" },
    },
    {
      id: "mastery",
      stageId: "mastery",
      type: "mastery_response",
      eyebrow: "MASTERY",
      title: "Show that the foundation is stable",
      body:
        "Now bring the lesson together without multiple choice. Jeremiah is looking for clear biblical understanding, not exact wording.",
      prompt:
        "Give a concise doctrinal explanation of the oneness of God using at least one passage from this session. Include both the positive confession and what Scripture excludes.",
      placeholder: "Your final explanation...",
      evidenceIds: ["one-lord", "no-other", "controlling-foundation"],
      strategyRoutes: {
        scripture_revisit: "mastery_rebuild",
        contrast: "mastery_rebuild",
        guided_question: "mastery_rebuild",
        clarify: "mastery_rebuild",
        misconception_correction: "mastery_rebuild",
        encourage_retry: "mastery_rebuild",
      },
      next: {
        strong: "complete",
        partial: "mastery_rebuild",
        weak: "mastery_rebuild",
      },
    },
    {
      id: "mastery_rebuild",
      stageId: "mastery",
      type: "synthesis",
      eyebrow: "REBUILD FOR MASTERY",
      title: "Tighten the explanation around the text",
      teaching: [
        "Mastery needs more than the right conclusion. It needs a conclusion that can be traced back to Scripture.",
        "Build the answer in this order: what God is, what Scripture excludes, and why that confession remains the foundation.",
      ],
      insights: [
        {
          label: "What God is",
          text: "The LORD our God is one LORD.",
        },
        {
          label: "What Scripture excludes",
          text: "There is no God beside Him; there is none else.",
        },
        {
          label: "Why it matters",
          text: "This confession controls how later revelation is understood.",
        },
      ],
      ctaLabel: "Try mastery again",
      next: { continue: "mastery" },
    },
    {
      id: "complete",
      stageId: "mastery",
      type: "complete",
      eyebrow: "STANDARD COMPLETE",
      title: "The foundation is in place",
      body:
        "You read the confession, followed it through Isaiah and Jesus, tested it under pressure, and explained it in your own words.",
      teacherLine:
        "This standard is complete for now. Later retrieval should bring the same truth back without simply replaying the lesson.",
      ctaLabel: "Return home",
    },
  ],

  presets: {
    direct: {
      currentStageId: "focus",
      currentMoveId: "arrival",
      learnerLevel: "Adult Endpoint Path",
      truthExplanation:
        "This session teaches the Shema as the doctrinal foundation of biblical monotheism before asking the learner to demonstrate understanding.",
      verses: [shema, isaiah44],
      checkpoint: {
        title: "What must be confessed?",
        prompt:
          "State what Deuteronomy 6:4 requires you to confess and what Isaiah rules out.",
      },
    },
    resume: {
      currentStageId: "scripture",
      currentMoveId: "isaiah_exclusion",
      learnerLevel: "Adult Endpoint Path",
      truthExplanation:
        "Resume returns the learner to the required scriptural instruction rather than restarting from the beginning.",
      verses: [shema, isaiah44, isaiah45],
      checkpoint: {
        title: "Reconnect the passages",
        prompt:
          "Show how the Shema and Isaiah work together to establish one God and exclude another beside Him.",
      },
    },
    review: {
      currentStageId: "checkpoint",
      currentMoveId: "pressure_test",
      learnerLevel: "Correction Path",
      truthExplanation:
        "Review begins with application, then routes into reteaching if the foundation is weak.",
      verses: [shema, isaiah44, isaiah45, mark12],
      checkpoint: {
        title: "Repair the weak foundation",
        prompt:
          "Use the passages to correct a definition of God that overturns the Bible's repeated confession of one God.",
      },
    },
    adaptation: {
      currentStageId: "truth",
      currentMoveId: "oneness_first",
      learnerLevel: "Profile-Adaptive Path",
      truthExplanation:
        "Adaptation keeps the doctrinal target fixed while changing pacing, scaffolding, and the instructional route.",
      verses: [shema, mark12],
      checkpoint: {
        title: "Keep the truth fixed",
        prompt:
          "State the same biblical confession clearly at the learner's current level without changing its meaning.",
      },
    },
  },
};

export default OG_1_1_18_CLASSROOM_CONTENT;
