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
      title: "Start with the confession that controls everything else",
      body:
        "Before Jeremiah asks you to explain anything, begin where Scripture begins: hear the words, notice what they claim, and let the text set the terms.",
      teacherLine:
        "We are not starting with a theological diagram. We are starting with Israel's confession of who God is.",
      ctaLabel: "Enter the text",
      next: { continue: "hear_the_shema" },
    },
    {
      id: "hear_the_shema",
      stageId: "scripture",
      type: "scripture_observation",
      eyebrow: "OBSERVE",
      title: "What is the verse actually asking Israel to confess?",
      scripture: [shema],
      prompt:
        "Tap the phrase that carries the central claim about God's identity.",
      choices: [
        { id: "hear", label: "Hear, O Israel" },
        { id: "our-god", label: "our God" },
        { id: "one-lord", label: "one LORD" },
      ],
      expectedChoiceIds: ["one-lord"],
      evidenceIds: ["one-lord"],
      next: {
        strong: "say_it_plainly",
        partial: "shema_contrast",
        weak: "shema_contrast",
      },
    },
    {
      id: "shema_contrast",
      stageId: "truth",
      type: "contrast",
      eyebrow: "LOOK AGAIN",
      title: "One word changes the whole confession",
      body:
        "Jeremiah is narrowing the view. Do not reach for a system yet—stay with the grammar of the confession.",
      prompt: "Which statement stays closest to Deuteronomy 6:4?",
      choices: [
        {
          id: "one-being",
          label: "The LORD our God is one LORD.",
        },
        {
          id: "many-working-one",
          label: "Several divine beings work together as one.",
        },
        {
          id: "unclear-number",
          label: "The verse does not make any claim about God's number.",
        },
      ],
      expectedChoiceIds: ["one-being"],
      evidenceIds: ["one-lord"],
      satisfiesMoveIds: ["hear_the_shema"],
      next: {
        strong: "say_it_plainly",
        partial: "shema_contrast",
        weak: "shema_contrast",
      },
    },
    {
      id: "say_it_plainly",
      stageId: "truth",
      type: "choice",
      eyebrow: "BUILD THE TRUTH",
      title: "Turn the verse into a doctrinal statement",
      prompt:
        "Which statement most faithfully turns the Shema into a clear doctrinal confession?",
      choices: [
        { id: "only-one", label: "There is only one God." },
        {
          id: "one-purpose",
          label: "Different Gods can share one purpose.",
        },
        {
          id: "one-title",
          label: "LORD is simply one title used by several divine persons.",
        },
      ],
      expectedChoiceIds: ["only-one"],
      evidenceIds: ["one-lord"],
      next: {
        strong: "prophetic_echo",
        partial: "shema_contrast",
        weak: "shema_contrast",
      },
    },
    {
      id: "prophetic_echo",
      stageId: "scripture",
      type: "compare",
      eyebrow: "CONNECT",
      title: "Now let the prophets sharpen the confession",
      scripture: [shema, isaiah44, isaiah45],
      prompt:
        "What do Isaiah's statements add to the Shema's positive confession that God is one?",
      choices: [
        {
          id: "exclude-other",
          label: "They explicitly exclude another God beside the LORD.",
        },
        {
          id: "new-gods",
          label: "They introduce additional divine beings beside the LORD.",
        },
        {
          id: "only-israel",
          label: "They limit God's oneness to Israel's national worship only.",
        },
      ],
      expectedChoiceIds: ["exclude-other"],
      evidenceIds: ["one-lord", "no-other"],
      next: {
        strong: "pressure_test",
        partial: "prophetic_reframe",
        weak: "prophetic_reframe",
      },
    },
    {
      id: "prophetic_reframe",
      stageId: "scripture",
      type: "fill",
      eyebrow: "REBUILD",
      title: "Let the wording do the work",
      body:
        "Complete the confession using the language the passages themselves emphasize.",
      prompt: "Choose the pair that completes the idea faithfully.",
      choices: [
        { id: "one-none", label: "one LORD / no God beside Him" },
        { id: "many-one", label: "many divine persons / one purpose" },
        { id: "one-others", label: "one LORD for Israel / other Gods elsewhere" },
      ],
      expectedChoiceIds: ["one-none"],
      evidenceIds: ["one-lord", "no-other"],
      satisfiesMoveIds: ["prophetic_echo"],
      next: {
        strong: "pressure_test",
        partial: "prophetic_reframe",
        weak: "prophetic_reframe",
      },
    },
    {
      id: "pressure_test",
      stageId: "checkpoint",
      type: "scenario",
      eyebrow: "PRESSURE TEST",
      title: "Can the foundation hold when another idea pushes against it?",
      body:
        "A learner says: ‘I agree there is one God, but I can define that one God however I want later.’",
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
            "As long as someone says ‘one God,’ the underlying definition does not matter.",
        },
      ],
      expectedChoiceIds: ["control-later"],
      evidenceIds: ["controlling-foundation"],
      next: {
        strong: "teach_it_back",
        partial: "foundation_reframe",
        weak: "foundation_reframe",
      },
    },
    {
      id: "foundation_reframe",
      stageId: "checkpoint",
      type: "compare",
      eyebrow: "REORIENT",
      title: "Foundation means foundation",
      scripture: [shema, mark12],
      body:
        "Jesus repeats Israel's confession instead of discarding it. That matters for how later revelation is read.",
      prompt: "What is the strongest conclusion from these two passages together?",
      choices: [
        {
          id: "continued-foundation",
          label:
            "The Shema remains a controlling confession when Jesus teaches about God.",
        },
        {
          id: "obsolete",
          label: "Jesus treats the Shema as an obsolete confession.",
        },
        {
          id: "no-doctrine",
          label: "Neither passage is meant to shape doctrine about God.",
        },
      ],
      expectedChoiceIds: ["continued-foundation"],
      evidenceIds: ["controlling-foundation"],
      satisfiesMoveIds: ["pressure_test"],
      next: {
        strong: "teach_it_back",
        partial: "foundation_reframe",
        weak: "foundation_reframe",
      },
    },
    {
      id: "teach_it_back",
      stageId: "checkpoint",
      type: "free_response",
      eyebrow: "TEACH IT BACK",
      title: "Now make the confession your own",
      prompt:
        "In your own words, explain what the Shema requires you to confess about God and what Isaiah rules out. Use Scripture language where it helps.",
      placeholder:
        "Explain it as if you were teaching someone who had never studied this before...",
      evidenceIds: ["one-lord", "no-other"],
      strategyRoutes: {
        scripture_revisit: "prophetic_reframe",
        contrast: "prophetic_reframe",
        guided_question: "guided_build",
        clarify: "guided_build",
        misconception_correction: "foundation_reframe",
        encourage_retry: "guided_build",
      },
      next: {
        strong: "mastery",
        partial: "guided_build",
        weak: "guided_build",
      },
    },
    {
      id: "guided_build",
      stageId: "checkpoint",
      type: "guided_build",
      eyebrow: "BUILD IT TOGETHER",
      title: "Jeremiah is giving you the frame—finish the thought",
      body:
        "The goal is not to memorize Jeremiah's wording. The frame helps expose what still needs to become clear in your own explanation.",
      prompt:
        "Choose the statement that gives you the strongest frame, then you will teach it back again.",
      choices: [
        {
          id: "frame-correct",
          label:
            "God is one; Scripture says there is no God beside Him; therefore later teaching must preserve that confession.",
        },
        {
          id: "frame-vague",
          label:
            "God is one in some sense, but Scripture leaves the meaning completely open.",
        },
        {
          id: "frame-many",
          label:
            "God is one collective made up of multiple separate Gods.",
        },
      ],
      expectedChoiceIds: ["frame-correct"],
      evidenceIds: ["one-lord", "no-other", "controlling-foundation"],
      next: {
        strong: "teach_it_back",
        partial: "guided_build",
        weak: "guided_build",
      },
    },
    {
      id: "mastery",
      stageId: "mastery",
      type: "mastery_response",
      eyebrow: "MASTERY",
      title: "Show that the foundation is stable",
      prompt:
        "Give a concise doctrinal explanation of the oneness of God using at least one passage from this session. Include both the positive confession and what Scripture excludes.",
      placeholder: "Your final explanation...",
      evidenceIds: ["one-lord", "no-other", "controlling-foundation"],
      strategyRoutes: {
        scripture_revisit: "prophetic_reframe",
        contrast: "foundation_reframe",
        guided_question: "guided_build",
        clarify: "guided_build",
        misconception_correction: "foundation_reframe",
        encourage_retry: "guided_build",
      },
      next: {
        strong: "complete",
        partial: "guided_build",
        weak: "guided_build",
      },
    },
    {
      id: "complete",
      stageId: "mastery",
      type: "complete",
      eyebrow: "STANDARD COMPLETE",
      title: "The foundation is in place",
      body:
        "You have encountered the required Scripture, built the central confession, tested it under pressure, and explained it in your own words.",
      teacherLine:
        "This standard is complete, but Jeremiah can bring it back later through retrieval so mastery becomes durable rather than temporary.",
      ctaLabel: "Return home",
    },
  ],

  presets: {
    direct: {
      currentStageId: "focus",
      currentMoveId: "arrival",
      learnerLevel: "Adult Endpoint Path",
      truthExplanation:
        "This session begins with the Shema as the doctrinal foundation of biblical monotheism and lets the learner build the confession from Scripture rather than receive a finished formula first.",
      verses: [shema, isaiah44],
      checkpoint: {
        title: "What must be confessed?",
        prompt:
          "State what Deuteronomy 6:4 requires you to confess and what Isaiah rules out.",
      },
    },
    resume: {
      currentStageId: "scripture",
      currentMoveId: "prophetic_echo",
      learnerLevel: "Adult Endpoint Path",
      truthExplanation:
        "Resume returns the learner to the live scriptural work instead of restarting the standard from the beginning.",
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
        "Review enters where the learner must pressure-test and repair weak understanding rather than replaying every earlier interaction.",
      verses: [shema, isaiah44, isaiah45, mark12],
      checkpoint: {
        title: "Repair the weak foundation",
        prompt:
          "Use the passages to correct a definition of God that overturns the Bible's repeated confession of one God.",
      },
    },
    adaptation: {
      currentStageId: "truth",
      currentMoveId: "say_it_plainly",
      learnerLevel: "Profile-Adaptive Path",
      truthExplanation:
        "Adaptation keeps the doctrinal target fixed while changing pacing, scaffolding, and the kind of instructional move used to reach it.",
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
