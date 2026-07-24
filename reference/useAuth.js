// src/components/JeremiahClassroom.jsx
// Deep lesson architecture for Jeremiah Classroom
// Select → Encounter → Storyline → Walkthrough → Synthesis → Pressure → Witness → Mastery

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { theme } from "../theme";

const APP_THEME = theme || {};
const COLORS = APP_THEME.colors || {};
const GRADIENTS = APP_THEME.gradients || {};

const UI = {
  bg: "#f0f2f8",
  bgSoft: "#f8faff",
  card: "#ffffff",
  text: "#111827",
  textSoft: "#6b7280",
  textFaint: "#9ca3af",
  border: "#e5e7eb",
  blue: COLORS.primary || "#003DA5",
  red: "#dc2626",
  green: "#16a34a",
  orange: "#f59e0b",
  purple: "#7c3aed",
  blueGradient:
    GRADIENTS.primary || "linear-gradient(135deg, #1a3fcc, #003DA5)",
  greenGradient: "linear-gradient(135deg, #16a34a, #15803d)",
  orangeGradient: "linear-gradient(135deg, #d97706, #f59e0b)",
  shadow: "0 8px 24px rgba(15,23,42,0.08)",
};

const LESSON_PHASES = [
  { id: "encounter", label: "Encounter", icon: "🌅" },
  { id: "storyline", label: "Storyline", icon: "🧭" },
  { id: "teach", label: "Walkthrough", icon: "📖" },
  { id: "synthesis", label: "Synthesis", icon: "🧠" },
  { id: "pressure", label: "Pressure", icon: "⚔️" },
  { id: "witness", label: "Witness", icon: "🗣️" },
  { id: "mastery", label: "Mastery", icon: "🏆" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function domainCodeFromStd(stdCode) {
  const parts = String(stdCode || "").split(".");
  return `${(parts[0] || "").toUpperCase()}.${parts[1] || ""}`;
}

function getDomainNumber(stdCode) {
  const parts = String(stdCode || "").split(".");
  return Number(parts[1] || 0);
}

function getSubjectFamily(std) {
  const code = String(std?.code || "").toUpperCase();
  const subject = String(std?.subject || "").toUpperCase();

  if (subject === "OG" || code.startsWith("OG.")) return "OG";
  if (subject === "NB" || code.startsWith("NB.")) return "NB";
  return "GENERIC";
}

async function fetchDomainRefs(domainCode) {
  const { data, error } = await supabase
    .from("knowledge_scripture_refs")
    .select("*")
    .eq("domain_code", domainCode)
    .order("verse_start", { ascending: true });

  if (error) return [];
  return data || [];
}

async function fetchStandardContext(standardCode) {
  const { data, error } = await supabase
    .from("knowledge_standards")
    .select("*")
    .eq("standard_code", standardCode)
    .maybeSingle();

  return error ? null : data;
}

function getStandardName(std, stdContext) {
  return (
    stdContext?.standard_title ||
    std?.title ||
    std?.domainTitle ||
    std?.code ||
    "this standard"
  );
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getBandInfo(family, domainNumber) {
  if (family === "OG") {
    if (domainNumber <= 5) {
      return {
        band: "foundation",
        label: "Foundation and divine identity",
        role: "Foundations student",
      };
    }
    if (domainNumber <= 10) {
      return {
        band: "revelation",
        label: "Revelation and Christological clarity",
        role: "Careful interpreter",
      };
    }
    return {
      band: "witness",
      label: "Witness, distortion, and stability",
      role: "Stable witness",
    };
  }

  if (family === "NB") {
    if (domainNumber <= 4) {
      return {
        band: "foundation",
        label: "Need, covenant, gospel, repentance",
        role: "Serious learner",
      };
    }
    if (domainNumber <= 8) {
      return {
        band: "pattern",
        label: "Apostolic pattern and covenant entry",
        role: "Apostolic reader",
      };
    }
    return {
      band: "witness",
      label: "Transformed life and world-facing stability",
      role: "Faithful witness",
    };
  }

  return {
    band: "generic",
    label: "Doctrinal lesson",
    role: "Learner",
  };
}

function buildGenericClusterNotes(family, band) {
  if (family === "OG") {
    if (band === "foundation") {
      return [
        "Start with the plain claim. Let the verse tell you what God is, not what later systems prefer Him to be.",
        "Notice how Scripture tightens exclusivity. The wording is designed to close doors, not leave them open.",
        "Read this verse in continuity with the larger witness. The prophets are not changing the doctrine; they are sharpening it.",
        "Now see how later revelation stands inside the same confession rather than revising it.",
        "The mature move is not merely to quote the verse, but to explain what it rules out.",
      ];
    }

    if (band === "revelation") {
      return [
        "This is where the revelation becomes more demanding. You must read the text without splitting God away from His own self-disclosure in Christ.",
        "Watch how the language of Father, Son, and Spirit must be interpreted inside biblical monotheism, not outside it.",
        "This verse is not asking for slogans. It is asking whether your reading preserves the unity of God's identity while honoring the incarnation.",
        "A deep reading here requires doctrinal proportion: distinguish what belongs to Christ's true humanity from what belongs to God's full revelation in Him.",
        "This is the kind of passage that reveals whether a learner is merely repeating lines or actually reading carefully.",
      ];
    }

    return [
      "At this stage the doctrine is facing the world: history, distortion, alternate formulations, and modern pressure.",
      "Read this verse not as an isolated proof, but as part of apostolic witness under pressure.",
      "The mature learner must be able to say not only what the text teaches, but why later distortions fail to preserve that teaching.",
      "This is where doctrine becomes steadiness. Clarity matters because pressure will eventually demand it.",
      "A formed disciple can answer with firmness, composure, and biblical proportion.",
    ];
  }

  if (family === "NB") {
    if (band === "foundation") {
      return [
        "Before the response makes sense, the problem has to land. This verse belongs to the doctrine of need, guilt, separation, and rescue.",
        "Read slowly enough to feel what is broken. The standards do not treat salvation as preference, but as answer to the human condition.",
        "This is where covenant and gospel logic begin to take shape. New birth is not a formula dropped from the sky.",
        "A deep learner here must understand why salvation is necessary, not merely what steps come later.",
        "If the human problem is softened, the new birth will be reduced into self-improvement.",
      ];
    }

    if (band === "pattern") {
      return [
        "Here the doctrine becomes concrete. The apostles are not inventing a response; they are proclaiming one shaped by the gospel itself.",
        "Watch the structure carefully: death, burial, resurrection — and then repentance, baptism, Spirit reception.",
        "This verse matters because it protects the church from vague salvation language and partial gospel claims.",
        "The deep move is to see why the apostolic pattern is theologically fitting, not merely traditionally familiar.",
        "A mature learner can explain why this response is this specific and not another.",
      ];
    }

    return [
      "These later standards move from entry into mature formation: transformed living, discernment, witness, endurance, and stability.",
      "Read this verse with the world in view. Doctrine must now survive alternate religions, pressure, reduced claims, and counterfeit spiritualities.",
      "The standards are clear: witness is not argument alone. It is clarity joined with warmth and authenticity.",
      "This verse is asking what kind of disciple the doctrine produces, not merely what proposition it states.",
      "A formed learner is stable, clear, pastorally warm, and not easily moved by partial salvation messages.",
    ];
  }

  return [
    "Read for the doctrinal claim.",
    "Then read again for why the claim matters.",
    "Then read again for what it rules out.",
    "Then connect it to the wider witness of Scripture.",
    "Then ask how a mature disciple would carry it into the world.",
  ];
}

function buildCluster(refs, family, bandInfo) {
  const base = (refs || []).filter((r) => r?.verse_text).slice(0, 5);
  const notes = buildGenericClusterNotes(family, bandInfo.band);

  return base.map((r, i) => ({
    ...r,
    teacher_note: r.doctrinal_function || notes[i] || notes[notes.length - 1],
    stage:
      i === 0
        ? "Anchor"
        : i === 1
        ? "Clarify"
        : i === 2
        ? "Extend"
        : i === 3
        ? "Strengthen"
        : "Stabilize",
  }));
}

function buildStoryline(family, bandInfo, standardName) {
  if (family === "OG") {
    if (bandInfo.band === "foundation") {
      return [
        {
          title: "What came before",
          text: "Creation, covenant, and prophetic witness all press one irreducible confession: God is one, and His identity is not negotiable.",
        },
        {
          title: "What this standard is doing",
          text: `${standardName} is helping the learner see that the oneness of God is not peripheral language, but the frame that governs every later passage.`,
        },
        {
          title: "Why it matters",
          text: "If the learner starts with a blurred God, later revelation about Jesus will be bent into categories Scripture itself never created.",
        },
        {
          title: "Where it is headed",
          text: "The goal is not slogan retention, but a disciple who can articulate, defend, and live inside biblical monotheism with clarity.",
        },
      ];
    }

    if (bandInfo.band === "revelation") {
      return [
        {
          title: "What came before",
          text: "The Old Testament has already established the exclusive identity of the one God. That foundation cannot be discarded when Christ is revealed.",
        },
        {
          title: "What this standard is doing",
          text: `${standardName} is training the learner to read revelation, incarnation, and difficult passages without dividing God's identity.`,
        },
        {
          title: "Why it matters",
          text: "These are the passages where shallow readers split what Scripture is joining, or flatten what Scripture is carefully distinguishing.",
        },
        {
          title: "Where it is headed",
          text: "The outcome is mature Christological clarity: full deity, true humanity, and scriptural interpretation that remains inside apostolic monotheism.",
        },
      ];
    }

    return [
      {
        title: "What came before",
        text: "The doctrine has already been established from Scripture and revelation. Now the question is whether it can remain stable under distortion and pressure.",
      },
      {
        title: "What this standard is doing",
        text: `${standardName} moves the learner from internal clarity to public steadiness, historical discernment, and apostolic witness.`,
      },
      {
        title: "Why it matters",
        text: "Adulthood brings alternate readings, inherited systems, philosophical pressure, and religious language that sounds biblical while shifting the doctrine.",
      },
      {
        title: "Where it is headed",
        text: "The goal is a disciple who can answer error without becoming harsh, and who can witness with confidence in a pluralistic world.",
      },
    ];
  }

  if (family === "NB") {
    if (bandInfo.band === "foundation") {
      return [
        {
          title: "What came before",
          text: "The doctrine of the new birth begins with the human condition: sin, fall, guilt, corruption, separation, promise, covenant, and gospel necessity.",
        },
        {
          title: "What this standard is doing",
          text: `${standardName} helps the learner feel why the new birth is not optional improvement, but God's answer to a ruined human condition.`,
        },
        {
          title: "Why it matters",
          text: "If the problem is softened, the gospel sounds excessive and the new birth collapses into moral therapy or vague spirituality.",
        },
        {
          title: "Where it is headed",
          text: "The lesson is preparing the learner to understand why the apostolic response must be proclaimed with seriousness, clarity, and pastoral warmth.",
        },
      ];
    }

    if (bandInfo.band === "pattern") {
      return [
        {
          title: "What came before",
          text: "The earlier domains have already built the need, the promise, the covenant structure, and the gospel as the basis of salvation.",
        },
        {
          title: "What this standard is doing",
          text: `${standardName} is showing how the apostles proclaim a concrete, gospel-shaped response rather than a vague spiritual experience.`,
        },
        {
          title: "Why it matters",
          text: "This is where many reduced salvation messages appear: some keep the gospel event but blur the response, while others keep religious response without gospel grounding.",
        },
        {
          title: "Where it is headed",
          text: "The goal is a learner who can explain why apostolic salvation is this specific pattern and how each element belongs to one coherent whole.",
        },
      ];
    }

    return [
      {
        title: "What came before",
        text: "The doctrine of entry has already been built. Now the learner must show what the new birth produces in life, witness, endurance, and stability.",
      },
      {
        title: "What this standard is doing",
        text: `${standardName} is moving from private understanding to mature world-facing formation.`,
      },
      {
        title: "Why it matters",
        text: "The standards aim at more than church familiarity. The learner must face pressure from reduced salvation claims, alternate religions, false spiritualities, and cultural pressure.",
      },
      {
        title: "Where it is headed",
        text: "The outcome is discernment, defense, witness, and endurance carried with clarity, meekness, and personal authenticity.",
      },
    ];
  }

  return [
    { title: "What came before", text: "Scripture builds doctrine progressively." },
    { title: "What this standard is doing", text: standardName },
    { title: "Why it matters", text: "This doctrine should be understood deeply." },
    { title: "Where it is headed", text: "The lesson should produce clarity, application, and stability." },
  ];
}

function buildEncounterText(family, bandInfo, standardName) {
  if (family === "OG") {
    if (bandInfo.band === "foundation") {
      return {
        backstory:
          "These early One God standards are not trying to make the learner clever. They are laying the floor under every later passage. Before a disciple can read incarnation, Pentecost, or difficult Christological texts rightly, they must first know what kind of God Scripture is talking about and how absolute His oneness really is.",
        importance:
          "This matters because confusion about God rarely arrives wearing a warning label. It usually comes wrapped in familiar Bible language. A learner who cannot feel the force of Scripture's exclusive monotheistic witness will eventually reinterpret later passages through categories the Bible did not create.",
        personal:
          "You do not learn this only to win arguments. You learn it so that when the identity of God is blurred in your hearing, your worship, prayer, and reading of Jesus remain anchored inside the biblical confession rather than drifting into borrowed systems.",
      };
    }

    if (bandInfo.band === "revelation") {
      return {
        backstory:
          "These middle One God standards are where the pressure rises. The learner now has to hold together monotheism, incarnation, Father-Son language, Spirit language, and difficult passages without splitting God's identity or flattening Christ's true humanity.",
        importance:
          "This matters because these are the texts people use when they say the New Testament changed the doctrine of God. A shallow reader either divides God into multiple divine persons or collapses the incarnation into something unreal. Both moves distort the revelation.",
        personal:
          "You need this because Jesus is too central to read carelessly. If you do not learn how Scripture reveals God in Christ with proportion and precision, you will eventually inherit phrases without understanding the revelation they are supposed to protect.",
      };
    }

    return {
      backstory:
        "These later One God standards are aimed at adult steadiness. The learner is no longer only proving the doctrine from Scripture. They are tracing how distortion entered, why alternate formulations developed, and how apostolic witness should face a pluralistic world.",
      importance:
        "This matters because adulthood brings pressure from history, theology, philosophy, and sincere Christians who use different categories. Without stability, people often trade biblical clarity for social comfort or inherited formulas.",
      personal:
        "You need this so your convictions can survive pressure without hardening your spirit. The goal is not a brittle arguer, but a steady witness whose clarity and tone both honor the doctrine.",
    };
  }

  if (family === "NB") {
    if (bandInfo.band === "foundation") {
      return {
        backstory:
          "These early New Birth standards refuse to let salvation float free from the human condition. They begin with sin, fall, separation, covenant promise, and gospel basis because the response of salvation only makes sense when the depth of the problem has landed.",
        importance:
          "This matters because a weak doctrine of sin always produces a weak doctrine of salvation. When guilt, corruption, judgment, and separation are softened, the new birth becomes a spiritual preference rather than necessary rescue.",
        personal:
          "You need this because sincerity alone cannot save you, and morality alone cannot repair the breach. The doctrine has to be deep enough to explain not only what you should do, but why God had to provide this salvation at all.",
      };
    }

    if (bandInfo.band === "pattern") {
      return {
        backstory:
          "These central New Birth standards are where the apostolic pattern comes into focus. The gospel is proclaimed as death, burial, and resurrection, and the response is not invented by tradition but shaped by that gospel accomplishment.",
        importance:
          "This matters because partial salvation language is everywhere. Some presentations preach Christ but stop short of commanded response. Others talk about response without grounding it in the gospel event. The apostolic witness refuses both reductions.",
        personal:
          "You need this so that when you hear reduced salvation claims, you can recognize what is missing without becoming confused. The issue is not denominational preference. It is whether the response actually fits the salvation God revealed.",
      };
    }

    return {
      backstory:
        "These later New Birth standards take the doctrine into adulthood. The question is no longer only whether the learner can state the doctrine, but whether they can carry it into witness, transformed living, discernment, defense, and steady endurance under pressure.",
        importance:
          "This matters because the standards are aiming at world-facing formation. The learner must remain stable when confronted by reduced Christian claims, alternate religions, false spiritualities, and social pressure.",
        personal:
          "You need this because a true witness is more than an arguer. The doctrine must become clear enough, warm enough, and steady enough that you can speak from conviction and personal authenticity in the real world.",
      };
  }

  return {
    backstory: "This lesson is part of a larger doctrinal structure.",
    importance: "The doctrine matters and should be taught with weight.",
    personal: "The goal is formed understanding, not quick recall.",
  };
}

function buildSynthesisPack(family, bandInfo, standardName) {
  if (family === "OG") {
    if (bandInfo.band === "foundation") {
      return [
        {
          key: "claim",
          title: "Checkpoint 1",
          prompt: `Which sentence best states what ${standardName} is trying to secure?`,
          options: [
            "Scripture is pressing the exclusive oneness and identity of God as the foundation for every later revelation.",
            "Scripture leaves room for multiple equal divine persons as long as they act in harmony.",
            "Scripture uses oneness language devotionally, but not doctrinally.",
          ],
          answer: 0,
          explain:
            "That is the foundation move. The doctrine is not peripheral language. It is the frame that governs every later passage.",
        },
        {
          key: "stakes",
          title: "Checkpoint 2",
          prompt: "Why does this matter so much?",
          options: [
            "Because every later revelation about Jesus must be read inside the oneness of God rather than against it.",
            "Because doctrinal accuracy matters only for specialists, not for ordinary believers.",
            "Because the Old Testament and New Testament teach different identities of God.",
          ],
          answer: 0,
          explain:
            "This is why the standards keep pressing continuity. Blur the foundation and later texts get reread through foreign categories.",
        },
        {
          key: "reduction",
          title: "Checkpoint 3",
          prompt: "Which reduction must this lesson reject?",
          options: [
            "That the doctrine is too serious to explain carefully.",
            "That 'one' only means cooperation among multiple divine persons.",
            "That Scripture should be read as one redemptive line.",
          ],
          answer: 1,
          explain:
            "That is the key distortion here. The standards are training the learner to feel the force of biblical exclusivity, not reduce it to cooperation language.",
        },
      ];
    }

    if (bandInfo.band === "revelation") {
      return [
        {
          key: "claim",
          title: "Checkpoint 1",
          prompt: `Which sentence best states the lesson of ${standardName}?`,
          options: [
            "Jesus must be read as the full revelation of the one God without denying His true humanity.",
            "Jesus should be read as a second divine being standing alongside the Father.",
            "Father-Son language automatically means multiple divine persons.",
          ],
          answer: 0,
          explain:
            "This band is about proportion. The learner must hold revelation and incarnation together without dividing God's identity.",
        },
        {
          key: "stakes",
          title: "Checkpoint 2",
          prompt: "Why is this difficult but necessary?",
          options: [
            "Because these passages force the learner to interpret carefully rather than repeat familiar slogans.",
            "Because the New Testament replaces Old Testament monotheism.",
            "Because Christ's humanity makes theology impossible.",
          ],
          answer: 0,
          explain:
            "Exactly. These are not slogan passages. They demand careful doctrinal reading inside the whole witness of Scripture.",
        },
        {
          key: "reduction",
          title: "Checkpoint 3",
          prompt: "Which reduction does this phase train the learner to resist?",
          options: [
            "That difficult passages should never be studied closely.",
            "That incarnation language and relational language automatically create eternal divine persons.",
            "That Jesus can be safely ignored when reading the doctrine of God.",
          ],
          answer: 1,
          explain:
            "That is the pressure point. The learner must distinguish scriptural relational language from later person-based formulations.",
        },
      ];
    }

    return [
      {
        key: "claim",
        title: "Checkpoint 1",
        prompt: `Which sentence best captures the goal of ${standardName}?`,
        options: [
          "Form a disciple who can remain clear, steady, and world-facing under pressure concerning the identity of God.",
          "Produce a private opinion with no historical or world-facing implications.",
          "Keep doctrine safely inside church walls.",
        ],
        answer: 0,
        explain:
          "The later standards are aimed at stability, witness, and discernment under pressure, not private recall.",
      },
      {
        key: "stakes",
        title: "Checkpoint 2",
        prompt: "What is at stake in this phase of the lesson?",
        options: [
          "Whether the doctrine can survive history, distortion, pluralism, and social pressure without capitulation.",
          "Whether the learner can memorize one verse and stop there.",
          "Whether the doctrine can be reduced to tone without content.",
        ],
        answer: 0,
        explain:
          "This is about adult steadiness. The learner must carry the doctrine into real-world pressure.",
      },
      {
        key: "reduction",
        title: "Checkpoint 3",
        prompt: "Which reduction must be refused here?",
        options: [
          "That later historical formulations are automatically identical to apostolic witness.",
          "That Scripture belongs to one redemptive line.",
          "That discernment and witness should remain connected.",
        ],
        answer: 0,
        explain:
          "This phase trains the learner to identify where later systems have departed from apostolic categories while keeping a steady spirit.",
      },
    ];
  }

  if (family === "NB") {
    if (bandInfo.band === "foundation") {
      return [
        {
          key: "claim",
          title: "Checkpoint 1",
          prompt: `Which sentence best states what ${standardName} is trying to establish?`,
          options: [
            "The new birth is necessary because sin, fall, guilt, corruption, and separation are real and cannot be repaired by human effort.",
            "The new birth is mainly a spiritual upgrade for already healthy people.",
            "The main issue in salvation is self-esteem rather than rebellion and separation.",
          ],
          answer: 0,
          explain:
            "That is the foundation move. The doctrine must begin with the depth of the problem or the rescue will be diminished.",
        },
        {
          key: "stakes",
          title: "Checkpoint 2",
          prompt: "Why does this foundation matter so much?",
          options: [
            "Because if the human problem is softened, the new birth becomes self-help instead of rescue.",
            "Because people only need encouragement, not doctrine.",
            "Because salvation should avoid categories like guilt, judgment, and separation.",
          ],
          answer: 0,
          explain:
            "Exactly. The standards are intentionally deep here. They want the learner to feel why salvation is necessary before they discuss response.",
        },
        {
          key: "reduction",
          title: "Checkpoint 3",
          prompt: "Which reduction must this phase reject?",
          options: [
            "That sincere or moral people do not need the apostolic new birth.",
            "That Genesis and Romans can illuminate salvation.",
            "That the doctrine should be taught from Scripture.",
          ],
          answer: 0,
          explain:
            "That is one of the major reductions these early standards are pushing back against.",
        },
      ];
    }

    if (bandInfo.band === "pattern") {
      return [
        {
          key: "claim",
          title: "Checkpoint 1",
          prompt: `Which sentence best states the heart of ${standardName}?`,
          options: [
            "The apostolic new birth is gospel-shaped: the response corresponds to Christ's death, burial, and resurrection.",
            "The apostolic response is a later tradition that can be detached from the gospel event.",
            "Repentance, baptism, and Spirit reception are random practices with no theological relationship.",
          ],
          answer: 0,
          explain:
            "That is the key. The pattern is not arbitrary. It is tied to the gospel accomplishment itself.",
        },
        {
          key: "stakes",
          title: "Checkpoint 2",
          prompt: "Why is this phase so important?",
          options: [
            "Because partial salvation messages often either preach the gospel without entry or entry without gospel grounding.",
            "Because apostolic response should stay vague to be more welcoming.",
            "Because Acts 2 is mainly a historical curiosity.",
          ],
          answer: 0,
          explain:
            "This is where many reduced teachings break down. The standards are trying to secure the coherence of the apostolic response.",
        },
        {
          key: "reduction",
          title: "Checkpoint 3",
          prompt: "Which reduction is being challenged here?",
          options: [
            "That Acts 2:38 and the apostolic pattern are optional add-ons to salvation rather than part of revealed response.",
            "That the gospel has a death, burial, and resurrection structure.",
            "That apostolic proclamation should move toward response.",
          ],
          answer: 0,
          explain:
            "That is the central pressure point. The doctrine is protecting apostolic fullness against partial claims.",
        },
      ];
    }

    return [
      {
        key: "claim",
        title: "Checkpoint 1",
        prompt: `Which sentence best states the mature outcome of ${standardName}?`,
        options: [
          "The new birth should produce discernment, defense, witness, transformed living, and endurance under pressure.",
          "The new birth should stay private and disconnected from witness or stability.",
          "The new birth only matters at the moment of entry.",
        ],
        answer: 0,
        explain:
          "The later standards push the doctrine into the world. Formation is not complete until it becomes stable witness and life.",
      },
      {
        key: "stakes",
        title: "Checkpoint 2",
        prompt: "Why is this world-facing stage necessary?",
        options: [
          "Because mature learners will face reduced salvation claims, alternate religions, false spiritualities, and real social pressure.",
          "Because doctrine is only for private comfort.",
          "Because endurance is less important than first impressions.",
        ],
        answer: 0,
        explain:
          "That is exactly the later-domain burden: clarity under pressure without losing meekness or warmth.",
      },
      {
        key: "reduction",
        title: "Checkpoint 3",
        prompt: "Which reduction must be refused here?",
        options: [
          "That witness is merely argument, with no need for personal authenticity or pastoral warmth.",
          "That witness belongs to mature formation.",
          "That the doctrine should remain stable under pressure.",
        ],
        answer: 0,
        explain:
          "The standards are explicit here. The mature outcome is not cold argument, but clear witness joined with authenticity and endurance.",
      },
    ];
  }

  return [
    {
      key: "claim",
      title: "Checkpoint 1",
      prompt: `Which sentence best states ${standardName}?`,
      options: ["A direct doctrinal claim", "A random thought", "An empty phrase"],
      answer: 0,
      explain: "This lesson is trying to secure a doctrinal claim.",
    },
  ];
}

function buildPressureScenarios(family, bandInfo, standardName) {
  if (family === "OG") {
    if (bandInfo.band === "foundation") {
      return [
        {
          prompt:
            `Someone says "${standardName} only teaches unity of purpose, not actual oneness." Which response is strongest?`,
          options: [
            "The text is pressing exclusive divine identity, not just cooperation language, so the wording has to be read doctrinally.",
            "Any reading is fine as long as it sounds spiritual.",
            "The verse should not be connected to any larger biblical witness.",
          ],
          answer: 0,
          explain:
            "That is the right move. Stay with the wording, then connect it to the larger exclusive witness of Scripture.",
        },
        {
          prompt:
            "Someone says the Old Testament is strict monotheism, but the New Testament quietly changes the doctrine. Which response is strongest?",
          options: [
            "The apostles remain inside the same monotheistic confession and reveal Christ within it, rather than revising it.",
            "The New Testament replaces the old doctrine with a more flexible one.",
            "The two testaments should not be read together.",
          ],
          answer: 0,
          explain:
            "This is the continuity move. The standards explicitly refuse detached proof-text reading and insist on one redemptive line.",
        },
      ];
    }

    if (bandInfo.band === "revelation") {
      return [
        {
          prompt:
            `Someone says "${standardName}" proves Jesus is a separate divine person alongside the Father. Which answer is strongest?`,
          options: [
            "The passage must be read inside biblical monotheism and the incarnation, not through later person-language imposed onto it.",
            "The passage should be ignored because it is difficult.",
            "Any relational language automatically proves multiple divine persons.",
          ],
          answer: 0,
          explain:
            "That is the mature interpretive move: keep the whole witness together, including Christ's true humanity and God's one identity.",
        },
        {
          prompt:
            "Someone presses a difficult passage and says Oneness only survives by avoiding details. Which response is strongest?",
          options: [
            "A strong reading faces the details, distinguishes what belongs to Christ's humanity, and refuses to divide God's identity.",
            "The best response is to stop reading difficult passages.",
            "Precision is less important than keeping the peace.",
          ],
          answer: 0,
          explain:
            "This band is about careful reading, not slogan repetition. The learner must be able to stay in the text.",
        },
      ];
    }

    return [
      {
        prompt:
          "Someone says later trinitarian formulas and apostolic witness are basically the same thing in different words. Which response is strongest?",
        options: [
          "The question is not whether the words sound similar, but whether the categories and doctrinal structure remain apostolic and scriptural.",
          "History never matters for doctrine.",
          "Any later formula is automatically equal to biblical language.",
        ],
        answer: 0,
        explain:
          "This phase trains historical discernment. Similar religious language can still carry a different doctrinal structure.",
        },
        {
          prompt:
            "Someone pressures you to soften the doctrine so it sounds less exclusive. Which response is strongest?",
          options: [
            "A faithful witness stays warm in tone but does not surrender the clarity of Scripture's claims.",
            "Doctrinal clarity should be traded for social comfort.",
            "Exclusivity should always be hidden rather than explained.",
          ],
          answer: 0,
          explain:
            "That is mature steadiness: clear without becoming combative, warm without becoming vague.",
        },
      ];
  }

  if (family === "NB") {
    if (bandInfo.band === "foundation") {
      return [
        {
          prompt:
            `Someone says "${standardName}" sounds too serious because good people are probably fine as they are. Which response is strongest?`,
          options: [
            "The doctrine begins with universal guilt, corruption, and separation, so morality and sincerity do not erase the need for rescue.",
            "Good intentions remove the need for salvation.",
            "The human problem should be reduced to emotional weakness.",
          ],
          answer: 0,
          explain:
            "That is the foundational response. The standards want the learner to explain the need for salvation with clarity and pastoral care.",
        },
        {
          prompt:
            "Someone says sin is mainly social damage, not rebellion against God. Which response is strongest?",
          options: [
            "The doctrine defines sin theologically: rebellion against God that produces guilt, corruption, and separation.",
            "Sin should never be discussed in relation to God.",
            "Separation from God is only a metaphor for low confidence.",
          ],
          answer: 0,
          explain:
            "That response protects the whole doctrine. Soften sin and the new birth is immediately weakened.",
        },
      ];
    }

    if (bandInfo.band === "pattern") {
      return [
        {
          prompt:
            `Someone says "${standardName}" adds human steps to the simple gospel. Which response is strongest?`,
          options: [
            "The apostolic response is not an addition to the gospel but the revealed way people enter the salvation Christ accomplished.",
            "The apostles should have stopped with facts and no response.",
            "Response and gospel should stay separate.",
          ],
          answer: 0,
          explain:
            "That is the crucial move. The standards keep gospel accomplishment and gospel response together.",
        },
        {
          prompt:
            "Someone says Acts 2:38 is only one sermon and should not be treated as normative. Which response is strongest?",
          options: [
            "Acts repeatedly presents the apostolic pattern as meaningful and normative rather than accidental, and later accounts continue the same doctrinal structure.",
            "Pentecost has no continuing doctrinal weight.",
            "The apostles were improvising a one-time response.",
          ],
          answer: 0,
          explain:
            "Exactly. The standards treat Pentecost and the apostolic pattern as structurally significant, not disposable history.",
        },
      ];
    }

    return [
      {
        prompt:
          "Someone says witness should avoid doctrinal clarity so it feels more welcoming. Which response is strongest?",
        options: [
          "Faithful witness joins clarity, warmth, and invitation; removing doctrinal substance does not make witness stronger.",
          "Witness is strongest when doctrine is hidden.",
          "Authenticity matters, but doctrine does not.",
        ],
        answer: 0,
        explain:
          "That is the mature stance. The later standards join witness to doctrinal clarity and personal authenticity.",
        },
        {
          prompt:
            "Someone presents a reduced salvation claim that sounds biblical but omits apostolic fullness. Which response is strongest?",
          options: [
            "The claim must be tested against the full apostolic structure, not only against the parts it happens to quote.",
            "Any message using Bible words should be accepted without testing.",
            "Partial claims are always enough if they are sincere.",
          ],
          answer: 0,
          explain:
            "This phase is about discernment and steadiness under pressure, not only familiarity with church language.",
        },
      ];
  }

  return [
    {
      prompt: "Choose the strongest response.",
      options: ["Stay with the text", "Stay vague", "Avoid the doctrine"],
      answer: 0,
      explain: "The text must govern the response.",
    },
  ];
}

function buildWitnessPack(family, bandInfo, standardName) {
  if (family === "OG") {
    if (bandInfo.band === "foundation") {
      return {
        open: [
          "Scripture starts by securing who God is before it asks us to interpret anything else.",
          "This lesson is really about the confession that governs every later passage about God.",
          "Before we talk about difficult passages, we have to let Scripture tell us what kind of God it is speaking about.",
        ],
        doctrine: [
          "The one true God is not a shared identity among multiple divine persons, but the exclusive God Scripture reveals and later unveils in Christ.",
          "The heart of the doctrine is that God's oneness is absolute enough to govern all later revelation.",
          "This standard protects biblical monotheism from being softened into cooperation language.",
        ],
        invite: [
          "So the right next step is to read every later passage inside that confession rather than against it.",
          "That is why this doctrine matters for worship, prayer, and how we read Jesus.",
          "The question is not whether the language sounds familiar, but whether it stays inside the scriptural confession.",
        ],
      };
    }

    if (bandInfo.band === "revelation") {
      return {
        open: [
          "These passages force us to read carefully instead of living on slogans.",
          "The real challenge here is to honor the incarnation without dividing God's identity.",
          "This is where careless reading creates unnecessary confusion.",
        ],
        doctrine: [
          "Jesus must be read as the full revelation of the one God while His real humanity is also taken seriously.",
          "The doctrine refuses both extremes: dividing God into multiple divine persons or flattening Christ's humanity into unreality.",
          "Biblical revelation gets clearer in Christ, but it never abandons monotheism.",
        ],
        invite: [
          "That means difficult passages have to be read with proportion, not panic.",
          "So the mature task is to keep revelation and incarnation together inside the whole biblical witness.",
          "This is how a learner moves from slogans to doctrinal clarity.",
        ],
      };
    }

    return {
      open: [
        "At this stage the doctrine has to live in the real world, not only inside a lesson.",
        "These standards are training steadiness under pressure, not just internal agreement.",
        "The question now is whether the doctrine can survive history, distortion, and social pressure.",
      ],
      doctrine: [
        "A mature witness can identify where later systems depart from apostolic categories while staying calm, biblical, and clear.",
        "The doctrine is not complete until it can be carried with composure into public pressure and sincere disagreement.",
        "World-facing stability means clarity without hostility and conviction without collapse.",
      ],
      invite: [
        "So the goal is not only to know the doctrine, but to hold it faithfully in public pressure.",
        "That is how historical discernment turns into stable witness.",
        "A strong witness refuses both compromise and harshness.",
      ],
    };
  }

  if (family === "NB") {
    if (bandInfo.band === "foundation") {
      return {
        open: [
          "The doctrine of the new birth starts with the human problem before it talks about the response.",
          "These standards are making sure salvation never floats free from sin, separation, and the need for rescue.",
          "Before the answer can be preached with force, the problem has to be seen with honesty.",
        ],
        doctrine: [
          "The new birth is necessary because human beings are not merely weak but fallen, guilty, separated, and unable to repair themselves.",
          "This standard protects salvation from being reduced into self-help or vague spiritual improvement.",
          "The doctrine of need gives the doctrine of rescue its proper weight.",
        ],
        invite: [
          "That is why the gospel is mercy, not advice.",
          "So when the response comes later, it will be heard as rescue rather than religious preference.",
          "The right next step is to let the seriousness of the problem give proper weight to the salvation God provides.",
        ],
      };
    }

    if (bandInfo.band === "pattern") {
      return {
        open: [
          "The apostles did not preach a vague experience; they proclaimed a concrete gospel and a concrete response.",
          "These standards are protecting the coherence of apostolic salvation.",
          "The key question is why the apostolic response is this specific and not something else.",
        ],
        doctrine: [
          "The apostolic new birth is gospel-shaped: repentance, baptism, and Spirit reception belong to the structure of Christ's accomplished work.",
          "This doctrine keeps gospel accomplishment and gospel response joined together rather than allowing either to float alone.",
          "The response is not a human addition to salvation but the revealed way of entering what Christ accomplished.",
        ],
        invite: [
          "That is why partial salvation messages have to be tested carefully.",
          "So the goal is not only to repeat Acts 2:38, but to understand why it belongs to the gospel itself.",
          "This is how a learner moves from church familiarity to apostolic clarity.",
        ],
      };
    }

    return {
      open: [
        "The later New Birth standards are aiming at more than entry language.",
        "These standards are moving the doctrine into witness, steadiness, endurance, and transformed life.",
        "The question now is what kind of disciple the doctrine actually produces.",
      ],
      doctrine: [
        "Mature new-birth formation joins discernment, defense, witness, and endurance under pressure without losing warmth or personal authenticity.",
        "The doctrine should produce a person who can recognize partial claims, answer clearly, and invite others into the salvation they have received.",
        "This phase proves whether the doctrine has become stable enough to carry into the world.",
      ],
      invite: [
        "That is why witness must be clear, warm, and personally authentic rather than merely argumentative.",
        "So the goal is not only right doctrine, but faithful world-facing witness.",
        "A mature learner now has to carry the doctrine with meekness, steadiness, and clarity.",
      ],
    };
  }

  return {
    open: ["This doctrine matters."],
    doctrine: ["This lesson teaches a real doctrinal claim."],
    invite: ["It should now be carried clearly."],
  };
}

function joinWitness(open, doctrine, invite) {
  return `${open} ${doctrine} ${invite}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI BITS
// ─────────────────────────────────────────────────────────────────────────────

function PhaseTrail({ currentPhase }) {
  const idx = LESSON_PHASES.findIndex((p) => p.id === currentPhase);

  return (
    <div className="jc-trail">
      {LESSON_PHASES.map((phase, i) => {
        const done = i < idx;
        const active = i === idx;

        return (
          <React.Fragment key={phase.id}>
            <div className={`jc-trail-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
              <div className="jc-trail-dot">{done ? "✓" : phase.icon}</div>
              <div className="jc-trail-label">{phase.label}</div>
            </div>
            {i < LESSON_PHASES.length - 1 && (
              <div className={`jc-trail-line ${done ? "done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StatusBoard({ objective, role, win, phaseLabel }) {
  return (
    <div className="jc-board">
      <div className="jc-board-chip">{phaseLabel}</div>
      <div className="jc-board-grid">
        <div className="jc-board-card">
          <div className="jc-board-label">Objective</div>
          <div className="jc-board-value">{objective}</div>
        </div>
        <div className="jc-board-card">
          <div className="jc-board-label">Role</div>
          <div className="jc-board-value">{role}</div>
        </div>
        <div className="jc-board-card">
          <div className="jc-board-label">Win</div>
          <div className="jc-board-value">{win}</div>
        </div>
      </div>
    </div>
  );
}

function StdCell({ std, level, onClick }) {
  const cls = level >= 4 ? "mastered" : level >= 1 ? "progress" : "new";
  const icon = level >= 4 ? "✦" : level >= 1 ? "◐" : "○";

  return (
    <button
      className={`jc-cell jc-cell--${cls}`}
      onClick={() => onClick(std)}
      title={`${std.code} — ${std.domainTitle || ""}`}
    >
      <span className="jc-cell-icon">{icon}</span>
      <span className="jc-cell-code">{std.code.split(".").slice(1).join(".")}</span>
    </button>
  );
}

function ChoiceCard({
  title,
  prompt,
  options,
  selected,
  reveal,
  correctIndex,
  onSelect,
}) {
  return (
    <div className="jc-choice-card">
      <div className="jc-card-kicker">{title}</div>
      <div className="jc-card-title">{prompt}</div>

      <div className="jc-option-list">
        {options.map((opt, i) => {
          let cls = "jc-option";
          if (selected === i) cls += " selected";
          if (reveal && i === correctIndex) cls += " correct";
          if (reveal && selected === i && selected !== correctIndex) cls += " wrong";

          return (
            <button
              key={i}
              className={cls}
              onClick={() => onSelect(i)}
              disabled={reveal}
            >
              <span className="jc-option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="jc-option-text">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Burst() {
  return (
    <div className="jc-burst" aria-hidden="true">
      {[...Array(10)].map((_, i) => (
        <span key={i} className={`jc-burst-dot jc-burst-dot-${i + 1}`} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function JeremiahClassroom({ onBack }) {
  const [phase, setPhase] = useState("select");
  const [curriculum, setCurriculum] = useState({ OG: [], NB: [] });
  const [progress, setProgress] = useState({});
  const [selectedStd, setSelectedStd] = useState(null);
  const [stdContext, setStdContext] = useState(null);
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lesson, setLesson] = useState(null);

  const [encounterPosture, setEncounterPosture] = useState(null);

  const [teachIndex, setTeachIndex] = useState(0);
  const [teachSeen, setTeachSeen] = useState([]);

  const [synthesisIndex, setSynthesisIndex] = useState(0);
  const [synthesisSelections, setSynthesisSelections] = useState({});
  const [synthesisReveal, setSynthesisReveal] = useState({});
  const [synthesisScore, setSynthesisScore] = useState(0);

  const [pressureIndex, setPressureIndex] = useState(0);
  const [pressureSelection, setPressureSelection] = useState(null);
  const [pressureReveal, setPressureReveal] = useState(false);
  const [pressureScore, setPressureScore] = useState(0);

  const [witnessSelection, setWitnessSelection] = useState({
    open: null,
    doctrine: null,
    invite: null,
  });

  useEffect(() => {
    async function load() {
      const [domainsRes, standardsRes] = await Promise.all([
        supabase.from("knowledge_domains").select("*"),
        supabase
          .from("knowledge_standards")
          .select("standard_code,standard_title,domain_id,subject_code"),
      ]);

      const domains = domainsRes.data || [];
      const standards = standardsRes.data || [];
      const domainMap = new Map(domains.map((d) => [d.domain_id, d]));

      const og = [];
      const nb = [];

      for (const std of standards) {
        const domain = domainMap.get(std.domain_id);
        const entry = {
          code: std.standard_code,
          title: std.standard_title,
          domain: domain?.domain_code || "",
          domainTitle: domain?.domain_title || "",
          subject: (std.subject_code || "").toUpperCase(),
        };

        if (entry.subject === "OG") og.push(entry);
        if (entry.subject === "NB") nb.push(entry);
      }

      og.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
      nb.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

      setCurriculum({ OG: og, NB: nb });

      try {
        const saved = JSON.parse(localStorage.getItem("jc_progress") || "{}");
        setProgress(saved);
      } catch {
        setProgress({});
      }
    }

    load();
  }, []);

  function saveProgress(code, level) {
    setProgress((prev) => {
      const next = { ...prev, [code]: level };
      try {
        localStorage.setItem("jc_progress", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  async function selectStandard(std) {
    setLoading(true);
    setSelectedStd(std);
    setPhase("encounter");
    setEncounterPosture(null);

    setTeachIndex(0);
    setTeachSeen([]);

    setSynthesisIndex(0);
    setSynthesisSelections({});
    setSynthesisReveal({});
    setSynthesisScore(0);

    setPressureIndex(0);
    setPressureSelection(null);
    setPressureReveal(false);
    setPressureScore(0);

    setWitnessSelection({ open: null, doctrine: null, invite: null });

    const domainCode = domainCodeFromStd(std.code);
    const [fetchedRefs, context] = await Promise.all([
      fetchDomainRefs(domainCode),
      fetchStandardContext(std.code),
    ]);

    const family = getSubjectFamily(std);
    const domainNumber = getDomainNumber(std.code);
    const bandInfo = getBandInfo(family, domainNumber);
    const standardName = getStandardName(std, context);

    const cluster = buildCluster(fetchedRefs, family, bandInfo);
    const encounter = buildEncounterText(family, bandInfo, standardName);
    const storyline = buildStoryline(family, bandInfo, standardName);
    const synthesis = buildSynthesisPack(family, bandInfo, standardName);
    const pressure = buildPressureScenarios(family, bandInfo, standardName);
    const witness = buildWitnessPack(family, bandInfo, standardName);

    const objective =
      family === "OG"
        ? `Read ${standardName} as part of the continuous biblical revelation of the one true God, and carry it with clarity into pressure.`
        : family === "NB"
        ? `Read ${standardName} as part of the full apostolic doctrine of salvation, and carry it into witness, stability, and life.`
        : `Understand ${standardName} deeply enough to explain, apply, and defend it.`;

    setStdContext(context);
    setRefs(fetchedRefs);
    setLesson({
      family,
      bandInfo,
      standardName,
      objective,
      encounter,
      storyline,
      cluster,
      synthesis,
      pressure,
      witness,
    });
    setLoading(false);
  }

  const masteredCount = useMemo(() => {
    const all = [...curriculum.OG, ...curriculum.NB];
    return all.filter((s) => (progress[s.code] || 0) >= 4).length;
  }, [curriculum, progress]);

  if (phase === "select") {
    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-topbar">
            <button className="jc-topbar-back" onClick={onBack} aria-label="Back">
              ←
            </button>

            <div className="jc-topbar-center">
              <div className="jc-topbar-name">Jeremiah</div>
              <div className="jc-topbar-status">
                <span className="jc-topbar-dot" />
                <span>Deep Classroom Mode</span>
              </div>
            </div>

            <div className="jc-topbar-badge">{masteredCount} mastered</div>
          </div>

          <div className="jc-hero">
            <div className="jc-hero-icon">
              <img src="/ignite-logo-flame.png" alt="" />
            </div>

            <div className="jc-hero-copy">
              <div className="jc-hero-title">Formation, not flash cards</div>
              <div className="jc-hero-sub">
                This classroom is built for longer doctrinal formation: backstory, importance, walkthrough, synthesis, pressure, witness, and mastery.
              </div>
            </div>
          </div>

          <div className="jc-select-body">
            {["OG", "NB"].map((subj) => {
              const stds = curriculum[subj];
              if (!stds.length) return null;

              const domainMap = new Map();
              stds.forEach((s) => {
                if (!domainMap.has(s.domain)) domainMap.set(s.domain, []);
                domainMap.get(s.domain).push(s);
              });

              return (
                <div key={subj} className="jc-subject-block">
                  <div className="jc-subject-header">
                    <span
                      className="jc-subject-pill"
                      style={{ background: subj === "OG" ? UI.blue : UI.red }}
                    >
                      {subj}
                    </span>
                    <span className="jc-subject-name">
                      {subj === "OG" ? "The One True God" : "The New Birth"}
                    </span>
                  </div>

                  {Array.from(domainMap.entries()).map(([domainCode, domStds]) => (
                    <div key={domainCode} className="jc-domain-block">
                      <div className="jc-domain-label">
                        <span className="jc-domain-code">{domainCode}</span>
                        <span className="jc-domain-title">
                          {domStds[0]?.domainTitle || domainCode}
                        </span>
                      </div>

                      <div className="jc-std-grid">
                        {domStds.map((std) => (
                          <StdCell
                            key={std.code}
                            std={std}
                            level={progress[std.code] || 0}
                            onClick={selectStandard}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (loading || !lesson) {
    return (
      <div className="jc-page jc-loading-page">
        <img src="/ignite-logo-flame.png" alt="" className="jc-loader-flame" />
        <div className="jc-loader-text">Preparing your classroom…</div>
        <style>{styles}</style>
      </div>
    );
  }

  const currentTeach = lesson.cluster[teachIndex];
  const currentSynthesis = lesson.synthesis[synthesisIndex];
  const currentPressure = lesson.pressure[pressureIndex];

  if (phase === "encounter") {
    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-phase-header">
            <button className="jc-back-btn" onClick={() => setPhase("select")}>
              ←
            </button>
            <div className="jc-header-center">
              <div className="jc-phase-tag">Encounter</div>
              <div className="jc-std-label">{selectedStd?.code}</div>
            </div>
            <div style={{ width: 36 }} />
          </div>

          <PhaseTrail currentPhase="encounter" />

          <StatusBoard
            objective={lesson.objective}
            role={lesson.bandInfo.role}
            win="Feel the weight, scope, and personal need before the walkthrough begins."
            phaseLabel="Lesson opening"
          />

          <div className="jc-phase-body">
            <div className="jc-big-card">
              <div className="jc-big-card-title">Backstory</div>
              <div className="jc-big-card-text">{lesson.encounter.backstory}</div>
            </div>

            <div className="jc-two-col">
              <div className="jc-note-card">
                <div className="jc-note-title">Why this matters</div>
                <div className="jc-note-text">{lesson.encounter.importance}</div>
              </div>

              <div className="jc-note-card">
                <div className="jc-note-title">Why you need this</div>
                <div className="jc-note-text">{lesson.encounter.personal}</div>
              </div>
            </div>

            <div className="jc-posture-wrap">
              {[
                "Build me from the ground up",
                "Sharpen my understanding",
                "Prepare me to defend this",
              ].map((label) => (
                <button
                  key={label}
                  className={`jc-posture ${encounterPosture === label ? "active" : ""}`}
                  onClick={() => setEncounterPosture(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              className="jc-phase-btn"
              disabled={!encounterPosture}
              onClick={() => setPhase("storyline")}
            >
              Enter the lesson →
            </button>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (phase === "storyline") {
    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-phase-header">
            <button className="jc-back-btn" onClick={() => setPhase("encounter")}>
              ←
            </button>
            <div className="jc-header-center">
              <div className="jc-phase-tag">Storyline</div>
              <div className="jc-std-label">{lesson.bandInfo.label}</div>
            </div>
            <div style={{ width: 36 }} />
          </div>

          <PhaseTrail currentPhase="storyline" />

          <StatusBoard
            objective={lesson.objective}
            role="Big-picture reader"
            win="See where this standard sits in the larger doctrinal structure."
            phaseLabel="Redemptive line"
          />

          <div className="jc-phase-body">
            <div className="jc-story-grid">
              {lesson.storyline.map((item, i) => (
                <div key={i} className="jc-story-card">
                  <div className="jc-story-num">{i + 1}</div>
                  <div className="jc-story-title">{item.title}</div>
                  <div className="jc-story-text">{item.text}</div>
                </div>
              ))}
            </div>

            <button className="jc-phase-btn" onClick={() => setPhase("teach")}>
              Start the walkthrough →
            </button>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (phase === "teach") {
    const allSeen = teachSeen.length >= lesson.cluster.length;

    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-phase-header">
            <button className="jc-back-btn" onClick={() => setPhase("storyline")}>
              ←
            </button>
            <div className="jc-header-center">
              <div className="jc-phase-tag">Walkthrough</div>
              <div className="jc-std-label">
                {teachIndex + 1} / {lesson.cluster.length}
              </div>
            </div>
            <div className="jc-score-badge">{teachSeen.length}/{lesson.cluster.length} read</div>
          </div>

          <PhaseTrail currentPhase="teach" />

          <StatusBoard
            objective={lesson.objective}
            role="Careful reader"
            win="Read the cluster as one lesson, not as detached proof texts."
            phaseLabel="Teacher walkthrough"
          />

          <div className="jc-phase-body">
            <div className="jc-teach-layout">
              <div className="jc-teach-list">
                {lesson.cluster.map((ref, i) => (
                  <button
                    key={`${ref.reference_text}-${i}`}
                    className={`jc-ref-tab ${teachIndex === i ? "active" : ""} ${
                      teachSeen.includes(i) ? "seen" : ""
                    }`}
                    onClick={() => {
                      setTeachIndex(i);
                      setTeachSeen((prev) =>
                        prev.includes(i) ? prev : [...prev, i]
                      );
                    }}
                  >
                    <span className="jc-ref-stage">{ref.stage}</span>
                    <span className="jc-ref-name">{ref.reference_text}</span>
                  </button>
                ))}
              </div>

              <div className="jc-teach-main">
                <div className="jc-verse-card">
                  <div className="jc-verse-ref">{currentTeach?.reference_text}</div>
                  <div className="jc-verse-text">"{currentTeach?.verse_text}"</div>
                </div>

                <div className="jc-note-card">
                  <div className="jc-note-title">What Jeremiah wants you to notice</div>
                  <div className="jc-note-text">{currentTeach?.teacher_note}</div>
                </div>

                <div className="jc-note-card soft">
                  <div className="jc-note-title">How to read this verse in class</div>
                  <div className="jc-note-text">
                    First, ask what the verse is actually claiming. Then ask why that claim matters in the larger doctrinal sequence. Then ask what weaker reading it rules out.
                  </div>
                </div>
              </div>
            </div>

            <div className="jc-step-nav">
              <button
                className="jc-nav-btn"
                onClick={() => setTeachIndex((i) => Math.max(0, i - 1))}
                disabled={teachIndex === 0}
              >
                ← Prev verse
              </button>

              {teachIndex < lesson.cluster.length - 1 ? (
                <button
                  className="jc-phase-btn"
                  onClick={() => {
                    const next = teachIndex + 1;
                    setTeachIndex(next);
                    setTeachSeen((prev) => (prev.includes(next) ? prev : [...prev, next]));
                  }}
                >
                  Next verse →
                </button>
              ) : (
                <button
                  className="jc-phase-btn jc-phase-btn--green"
                  onClick={() => setPhase("synthesis")}
                  disabled={!allSeen}
                >
                  Move into synthesis →
                </button>
              )}
            </div>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (phase === "synthesis") {
    const answeredCurrent = synthesisReveal[currentSynthesis.key];

    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-phase-header">
            <button className="jc-back-btn" onClick={() => setPhase("teach")}>
              ←
            </button>
            <div className="jc-header-center">
              <div className="jc-phase-tag">Synthesis</div>
              <div className="jc-std-label">
                {synthesisIndex + 1} / {lesson.synthesis.length}
              </div>
            </div>
            <div className="jc-score-badge">{synthesisScore}/{lesson.synthesis.length}</div>
          </div>

          <PhaseTrail currentPhase="synthesis" />

          <StatusBoard
            objective={lesson.objective}
            role="Doctrinal synthesizer"
            win="State the claim, name the stakes, and identify the reduction."
            phaseLabel="Guided synthesis"
          />

          <div className="jc-phase-body">
            <ChoiceCard
              title={currentSynthesis.title}
              prompt={currentSynthesis.prompt}
              options={currentSynthesis.options}
              selected={synthesisSelections[currentSynthesis.key]}
              reveal={!!synthesisReveal[currentSynthesis.key]}
              correctIndex={currentSynthesis.answer}
              onSelect={(i) => {
                setSynthesisSelections((prev) => ({ ...prev, [currentSynthesis.key]: i }));
                setSynthesisReveal((prev) => ({ ...prev, [currentSynthesis.key]: true }));
                if (i === currentSynthesis.answer) {
                  setSynthesisScore((s) => s + 1);
                }
              }}
            />

            {answeredCurrent ? (
              <div
                className={`jc-note-card ${
                  synthesisSelections[currentSynthesis.key] === currentSynthesis.answer
                    ? "success"
                    : "warn"
                }`}
              >
                <div className="jc-note-title">
                  {synthesisSelections[currentSynthesis.key] === currentSynthesis.answer
                    ? "That lands"
                    : "Tighten the doctrine"}
                </div>
                <div className="jc-note-text">{currentSynthesis.explain}</div>
              </div>
            ) : null}

            <div className="jc-inline-actions">
              <button
                className="jc-pill"
                onClick={() => alert("Slow down and ask three things: What is the claim? Why does it matter? What weaker reading fails here?")}
              >
                How do I think through this?
              </button>
              <button
                className="jc-pill"
                onClick={() => alert("Jeremiah move: do not reach for a slogan first. State the doctrinal claim in full proportion, then name why that proportion matters.")}
              >
                Show teacher move
              </button>
            </div>

            {answeredCurrent ? (
              <button
                className="jc-phase-btn"
                onClick={() => {
                  if (synthesisIndex + 1 >= lesson.synthesis.length) {
                    setPhase("pressure");
                  } else {
                    setSynthesisIndex((i) => i + 1);
                  }
                }}
              >
                {synthesisIndex + 1 >= lesson.synthesis.length
                  ? "Test it under pressure →"
                  : "Next checkpoint →"}
              </button>
            ) : null}
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (phase === "pressure") {
    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-phase-header">
            <button className="jc-back-btn" onClick={() => setPhase("synthesis")}>
              ←
            </button>
            <div className="jc-header-center">
              <div className="jc-phase-tag jc-phase-tag--red">Pressure</div>
              <div className="jc-std-label">
                {pressureIndex + 1} / {lesson.pressure.length}
              </div>
            </div>
            <div className="jc-rounds-badge">{pressureScore} strong answers</div>
          </div>

          <PhaseTrail currentPhase="pressure" />

          <StatusBoard
            objective={lesson.objective}
            role="Stable responder"
            win="Answer the reduction or pressure point with composure and doctrinal clarity."
            phaseLabel="Pressure test"
          />

          <div className="jc-defend-banner">
            This phase is not about more words. It is about choosing the strongest doctrinal answer under pressure.
          </div>

          <div className="jc-phase-body">
            <ChoiceCard
              title={`Pressure ${pressureIndex + 1}`}
              prompt={currentPressure.prompt}
              options={currentPressure.options}
              selected={pressureSelection}
              reveal={pressureReveal}
              correctIndex={currentPressure.answer}
              onSelect={(i) => {
                setPressureSelection(i);
                setPressureReveal(true);
                if (i === currentPressure.answer) setPressureScore((s) => s + 1);
              }}
            />

            {pressureReveal ? (
              <div
                className={`jc-note-card ${
                  pressureSelection === currentPressure.answer ? "success" : "warn"
                }`}
              >
                <div className="jc-note-title">
                  {pressureSelection === currentPressure.answer
                    ? "That answer holds"
                    : "That answer buckles"}
                </div>
                <div className="jc-note-text">{currentPressure.explain}</div>
              </div>
            ) : null}

            {pressureReveal ? (
              <button
                className="jc-phase-btn"
                onClick={() => {
                  if (pressureIndex + 1 >= lesson.pressure.length) {
                    setPhase("witness");
                  } else {
                    setPressureIndex((i) => i + 1);
                    setPressureSelection(null);
                    setPressureReveal(false);
                  }
                }}
              >
                {pressureIndex + 1 >= lesson.pressure.length
                  ? "Turn doctrine into witness →"
                  : "Next pressure point →"}
              </button>
            ) : null}
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (phase === "witness") {
    const witnessReady =
      witnessSelection.open !== null &&
      witnessSelection.doctrine !== null &&
      witnessSelection.invite !== null;

    const builtWitness = witnessReady
      ? joinWitness(
          lesson.witness.open[witnessSelection.open],
          lesson.witness.doctrine[witnessSelection.doctrine],
          lesson.witness.invite[witnessSelection.invite]
        )
      : "";

    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-phase-header">
            <button className="jc-back-btn" onClick={() => setPhase("pressure")}>
              ←
            </button>
            <div className="jc-header-center">
              <div className="jc-phase-tag">Witness</div>
              <div className="jc-std-label">{lesson.standardName}</div>
            </div>
            <div style={{ width: 36 }} />
          </div>

          <PhaseTrail currentPhase="witness" />

          <StatusBoard
            objective={lesson.objective}
            role="Faithful witness"
            win="Turn the doctrine into clear, warm, world-facing speech."
            phaseLabel="Witness builder"
          />

          <div className="jc-phase-body">
            <ChoiceCard
              title="Build your opening"
              prompt="Choose the strongest opening move."
              options={lesson.witness.open}
              selected={witnessSelection.open}
              reveal={witnessSelection.open !== null}
              correctIndex={witnessSelection.open ?? 0}
              onSelect={(i) => setWitnessSelection((prev) => ({ ...prev, open: i }))}
            />

            <ChoiceCard
              title="State the doctrine"
              prompt="Choose the clearest doctrinal sentence."
              options={lesson.witness.doctrine}
              selected={witnessSelection.doctrine}
              reveal={witnessSelection.doctrine !== null}
              correctIndex={witnessSelection.doctrine ?? 0}
              onSelect={(i) =>
                setWitnessSelection((prev) => ({ ...prev, doctrine: i }))
              }
            />

            <ChoiceCard
              title="Land the witness"
              prompt="Choose the strongest closing move."
              options={lesson.witness.invite}
              selected={witnessSelection.invite}
              reveal={witnessSelection.invite !== null}
              correctIndex={witnessSelection.invite ?? 0}
              onSelect={(i) =>
                setWitnessSelection((prev) => ({ ...prev, invite: i }))
              }
            />

            {witnessReady ? (
              <div className="jc-big-card success">
                <div className="jc-big-card-title">Jeremiah-style witness</div>
                <div className="jc-big-card-text">{builtWitness}</div>
              </div>
            ) : null}

            <button
              className="jc-phase-btn jc-phase-btn--green"
              disabled={!witnessReady}
              onClick={() => {
                saveProgress(selectedStd.code, 4);
                setPhase("mastery");
              }}
            >
              Finish lesson →
            </button>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  if (phase === "mastery") {
    return (
      <div className="jc-page jc-mastery-page">
        <Burst />

        <div className="jc-mastery-content">
          <div className="jc-mastery-icon">🏆</div>
          <div className="jc-mastery-title">Lesson Complete</div>
          <div className="jc-mastery-code">{selectedStd?.code}</div>
          <div className="jc-mastery-name">{lesson.standardName}</div>

          <div className="jc-mastery-score">
            <div className="jc-mastery-stat">
              <div className="jc-mastery-num">{synthesisScore}</div>
              <div className="jc-mastery-lbl">Synthesis wins</div>
            </div>

            <div className="jc-mastery-divider" />

            <div className="jc-mastery-stat">
              <div className="jc-mastery-num">{pressureScore}</div>
              <div className="jc-mastery-lbl">Pressure wins</div>
            </div>
          </div>

          <div className="jc-mastery-verse">
            <div className="jc-mastery-verse-ref">
              {lesson.cluster?.[0]?.reference_text || "Anchor"}
            </div>
            <div className="jc-mastery-verse-text">
              {lesson.cluster?.[0]?.verse_text
                ? `"${lesson.cluster[0].verse_text}"`
                : lesson.standardName}
            </div>
          </div>

          <div className="jc-big-card">
            <div className="jc-big-card-title">What this lesson was building</div>
            <div className="jc-big-card-text">
              This lesson was not aiming at bare recall. It was building proportion: backstory, doctrinal weight, careful reading, structured synthesis, steadiness under pressure, and faithful witness.
            </div>
          </div>

          <div className="jc-mastery-actions">
            <button
              className="jc-mastery-btn jc-mastery-btn--primary"
              onClick={() => setPhase("select")}
            >
              Next standard →
            </button>

            <button
              className="jc-mastery-btn jc-mastery-btn--ghost"
              onClick={() => setPhase("encounter")}
            >
              Run this lesson again
            </button>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = `
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .jc-page {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: ${UI.bg};
    color: ${UI.text};
    font-family: inherit;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    z-index: 9999;
  }

  .jc-shell {
    width: 100%;
    max-width: 1120px;
    min-height: 100%;
    margin: 0 auto;
    padding-bottom: calc(40px + env(safe-area-inset-bottom));
  }

  .jc-loading-page {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .jc-topbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: ${UI.blueGradient};
    box-shadow: 0 4px 16px rgba(26,63,204,0.30);
  }

  .jc-topbar-back {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1.5px solid rgba(255,255,255,0.22);
    background: rgba(255,255,255,0.10);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .jc-topbar-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .jc-topbar-name {
    font-size: 1rem;
    font-weight: 900;
    color: white;
  }

  .jc-topbar-status {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .jc-topbar-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px rgba(74,222,128,0.9);
  }

  .jc-topbar-status span:last-child {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.72);
    font-weight: 700;
  }

  .jc-topbar-badge {
    font-size: 0.72rem;
    font-weight: 800;
    color: white;
    background: rgba(255,255,255,0.12);
    border-radius: 999px;
    padding: 0.28rem 0.7rem;
    white-space: nowrap;
  }

  .jc-hero {
    margin: 1rem 1.25rem 0.85rem;
    background: ${UI.card};
    border-radius: 24px;
    border: 1px solid ${UI.border};
    box-shadow: ${UI.shadow};
    padding: 1.1rem 1.15rem;
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }

  .jc-hero-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .jc-hero-icon img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .jc-hero-title {
    font-size: 1rem;
    font-weight: 900;
    color: ${UI.text};
    margin-bottom: 0.15rem;
  }

  .jc-hero-sub {
    font-size: 0.84rem;
    color: ${UI.textSoft};
    line-height: 1.6;
  }

  .jc-phase-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.95rem 1rem;
    background: ${UI.card};
    border-bottom: 1px solid ${UI.border};
    position: sticky;
    top: 0;
    z-index: 40;
  }

  .jc-back-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1.5px solid ${UI.border};
    background: ${UI.bgSoft};
    color: ${UI.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.05rem;
    flex-shrink: 0;
  }

  .jc-header-center {
    flex: 1;
    text-align: center;
    min-width: 0;
  }

  .jc-phase-tag {
    display: inline-block;
    font-size: 0.58rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    padding: 0.24rem 0.65rem;
    border-radius: 999px;
    background: rgba(0,61,165,0.08);
    color: ${UI.blue};
    border: 1px solid rgba(0,61,165,0.14);
    margin-bottom: 0.16rem;
  }

  .jc-phase-tag--red {
    background: rgba(220,38,38,0.08);
    color: ${UI.red};
    border-color: rgba(220,38,38,0.16);
  }

  .jc-std-label {
    font-size: 0.84rem;
    font-weight: 800;
    color: ${UI.textSoft};
  }

  .jc-score-badge,
  .jc-rounds-badge,
  .jc-skip-btn {
    flex-shrink: 0;
    border-radius: 999px;
    font-weight: 900;
    white-space: nowrap;
  }

  .jc-score-badge {
    font-size: 0.74rem;
    color: ${UI.green};
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    padding: 0.34rem 0.72rem;
  }

  .jc-rounds-badge {
    font-size: 0.68rem;
    color: ${UI.red};
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 0.34rem 0.72rem;
  }

  .jc-skip-btn {
    font-size: 0.74rem;
    color: ${UI.blue};
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    padding: 0.38rem 0.8rem;
    cursor: pointer;
  }

  .jc-trail {
    display: flex;
    align-items: center;
    padding: 0.85rem 1rem 0.7rem;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .jc-trail::-webkit-scrollbar {
    display: none;
  }

  .jc-trail-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    flex-shrink: 0;
  }

  .jc-trail-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: white;
    border: 1.5px solid ${UI.border};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    color: ${UI.textFaint};
  }

  .jc-trail-step.done .jc-trail-dot {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: ${UI.green};
  }

  .jc-trail-step.active .jc-trail-dot {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: ${UI.blue};
    box-shadow: 0 0 0 4px rgba(0,61,165,0.06);
  }

  .jc-trail-label {
    font-size: 0.52rem;
    font-weight: 800;
    color: ${UI.textFaint};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .jc-trail-step.active .jc-trail-label { color: ${UI.blue}; }
  .jc-trail-step.done .jc-trail-label { color: ${UI.green}; }

  .jc-trail-line {
    flex: 1;
    min-width: 24px;
    height: 2px;
    margin: 0 6px 14px;
    background: ${UI.border};
  }

  .jc-trail-line.done {
    background: #bbf7d0;
  }

  .jc-board {
    margin: 0 1.25rem 0.75rem;
    background: ${UI.card};
    border: 1px solid ${UI.border};
    border-radius: 22px;
    box-shadow: ${UI.shadow};
    padding: 0.9rem 1rem 1rem;
  }

  .jc-board-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-size: 0.66rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.28rem 0.65rem;
    color: ${UI.blue};
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    margin-bottom: 0.8rem;
  }

  .jc-board-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .jc-board-card {
    background: ${UI.bgSoft};
    border: 1px solid ${UI.border};
    border-radius: 16px;
    padding: 0.8rem 0.85rem;
  }

  .jc-board-label {
    font-size: 0.64rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${UI.textFaint};
    margin-bottom: 0.35rem;
  }

  .jc-board-value {
    font-size: 0.95rem;
    font-weight: 800;
    color: ${UI.text};
    line-height: 1.45;
  }

  .jc-progress-banner {
    margin: 0 1.25rem 0.5rem;
    padding: 0.82rem 1rem;
    border-radius: 16px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: ${UI.blue};
    font-size: 0.82rem;
    font-weight: 700;
    text-align: center;
  }

  .jc-progress-banner.ready {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: ${UI.green};
  }

  .jc-select-body,
  .jc-phase-body {
    width: 100%;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  .jc-select-body {
    padding-top: 0.25rem;
    padding-bottom: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .jc-phase-body {
    padding-top: 0.4rem;
    padding-bottom: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .jc-subject-block,
  .jc-big-card,
  .jc-note-card,
  .jc-verse-card,
  .jc-choice-card,
  .jc-story-card,
  .jc-mastery-verse {
    background: ${UI.card};
    border: 1px solid ${UI.border};
    box-shadow: ${UI.shadow};
  }

  .jc-subject-block {
    border-radius: 22px;
    overflow: hidden;
  }

  .jc-subject-header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 1rem 1.1rem;
    border-bottom: 1px solid #f3f4f6;
    background: ${UI.bgSoft};
  }

  .jc-subject-pill {
    font-size: 0.64rem;
    font-weight: 900;
    color: white;
    padding: 0.28rem 0.68rem;
    border-radius: 999px;
    letter-spacing: 0.08em;
  }

  .jc-subject-name {
    font-size: 0.92rem;
    font-weight: 800;
    color: ${UI.text};
  }

  .jc-domain-block {
    padding: 1rem 1.1rem;
    border-bottom: 1px solid #f9fafb;
  }

  .jc-domain-block:last-child {
    border-bottom: none;
  }

  .jc-domain-label {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 0.75rem;
  }

  .jc-domain-code {
    font-size: 0.6rem;
    font-weight: 900;
    color: ${UI.blue};
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .jc-domain-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${UI.textSoft};
  }

  .jc-std-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .jc-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.22rem;
    padding: 0.65rem 0.62rem;
    min-width: 56px;
    border-radius: 16px;
    border: 1px solid transparent;
    background: ${UI.bgSoft};
    cursor: pointer;
    font-family: inherit;
    transition: all 0.12s ease;
  }

  .jc-cell:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(15,23,42,0.08);
  }

  .jc-cell--new {
    border-color: ${UI.border};
  }

  .jc-cell--progress {
    background: #fffbeb;
    border-color: #fcd34d;
  }

  .jc-cell--mastered {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .jc-cell-icon {
    font-size: 0.88rem;
    line-height: 1;
    color: ${UI.textSoft};
  }

  .jc-cell--progress .jc-cell-icon { color: #d97706; }
  .jc-cell--mastered .jc-cell-icon { color: ${UI.green}; }

  .jc-cell-code {
    font-size: 0.52rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    text-align: center;
    color: ${UI.textSoft};
  }

  .jc-big-card {
    border-radius: 24px;
    padding: 1.2rem 1.2rem;
  }

  .jc-big-card.success {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .jc-big-card-title {
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${UI.blue};
    margin-bottom: 0.55rem;
  }

  .jc-big-card-text {
    font-size: 0.98rem;
    line-height: 1.8;
    color: ${UI.text};
  }

  .jc-two-col {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .jc-posture-wrap {
    display: flex;
    gap: 0.7rem;
    flex-wrap: wrap;
  }

  .jc-posture {
    border-radius: 999px;
    border: 1px solid ${UI.border};
    background: ${UI.card};
    color: ${UI.textSoft};
    font: inherit;
    font-weight: 800;
    padding: 0.65rem 0.95rem;
    cursor: pointer;
  }

  .jc-posture.active,
  .jc-posture:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: ${UI.blue};
  }

  .jc-story-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .jc-story-card {
    border-radius: 22px;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .jc-story-num {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #eff6ff;
    color: ${UI.blue};
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  }

  .jc-story-title {
    font-size: 0.95rem;
    font-weight: 900;
    color: ${UI.text};
    margin-bottom: 0.45rem;
  }

  .jc-story-text {
    font-size: 0.9rem;
    line-height: 1.65;
    color: ${UI.textSoft};
  }

  .jc-teach-layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 0.9rem;
  }

  .jc-teach-list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .jc-ref-tab {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
    border-radius: 18px;
    border: 1px solid ${UI.border};
    background: ${UI.card};
    padding: 0.85rem 0.95rem;
    font: inherit;
    cursor: pointer;
    text-align: left;
    box-shadow: ${UI.shadow};
  }

  .jc-ref-tab.active {
    border-color: #bfdbfe;
    background: #eff6ff;
  }

  .jc-ref-tab.seen {
    box-shadow: 0 0 0 2px rgba(22,163,74,0.08);
  }

  .jc-ref-stage {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 900;
    color: ${UI.textFaint};
  }

  .jc-ref-name {
    font-size: 0.9rem;
    font-weight: 800;
    color: ${UI.text};
  }

  .jc-teach-main {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .jc-verse-card {
    border-radius: 24px;
    padding: 1.2rem 1.15rem;
    text-align: center;
  }

  .jc-verse-ref {
    font-size: 0.74rem;
    font-weight: 900;
    color: ${UI.blue};
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-bottom: 0.75rem;
  }

  .jc-verse-text {
    font-size: 1.05rem;
    line-height: 1.85;
    color: ${UI.text};
    font-style: italic;
  }

  .jc-note-card {
    border-radius: 18px;
    padding: 0.95rem 1rem;
  }

  .jc-note-card.soft {
    background: ${UI.bgSoft};
  }

  .jc-note-card.success {
    border-color: #bbf7d0;
    background: #f0fdf4;
  }

  .jc-note-card.warn {
    border-color: #fcd34d;
    background: #fffbeb;
  }

  .jc-note-title {
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${UI.textFaint};
    margin-bottom: 0.3rem;
  }

  .jc-note-text {
    font-size: 0.92rem;
    line-height: 1.7;
    color: ${UI.text};
    font-weight: 700;
  }

  .jc-choice-card {
    border-radius: 22px;
    padding: 1.15rem;
  }

  .jc-card-kicker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-size: 0.66rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.28rem 0.65rem;
    color: ${UI.orange};
    background: #fffbeb;
    border: 1px solid #fcd34d;
    margin-bottom: 0.85rem;
  }

  .jc-card-title {
    font-size: 1rem;
    font-weight: 900;
    color: ${UI.text};
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .jc-option-list {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .jc-option {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    text-align: left;
    padding: 0.95rem 1rem;
    border-radius: 16px;
    border: 1px solid ${UI.border};
    background: ${UI.bgSoft};
    color: ${UI.text};
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  .jc-option.selected {
    border-color: #bfdbfe;
    background: #eff6ff;
  }

  .jc-option.correct {
    border-color: #bbf7d0;
    background: #f0fdf4;
    color: #166534;
  }

  .jc-option.wrong {
    border-color: #fecaca;
    background: #fef2f2;
    color: ${UI.red};
  }

  .jc-option-letter {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 1px solid ${UI.border};
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.78rem;
    font-weight: 900;
  }

  .jc-option-text {
    flex: 1;
    line-height: 1.5;
  }

  .jc-inline-actions {
    display: flex;
    gap: 0.55rem;
    flex-wrap: wrap;
  }

  .jc-pill {
    border-radius: 999px;
    border: 1px solid ${UI.border};
    background: ${UI.card};
    color: ${UI.textSoft};
    font: inherit;
    font-weight: 800;
    padding: 0.55rem 0.85rem;
    cursor: pointer;
  }

  .jc-pill:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: ${UI.blue};
  }

  .jc-step-nav {
    display: flex;
    gap: 0.65rem;
    flex-wrap: wrap;
  }

  .jc-nav-btn {
    padding: 0.82rem 1.15rem;
    border-radius: 14px;
    border: 1px solid ${UI.border};
    background: ${UI.card};
    color: ${UI.textSoft};
    font-size: 0.9rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
  }

  .jc-nav-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .jc-phase-btn,
  .jc-mastery-btn--primary {
    border: none;
    color: white;
    cursor: pointer;
    font-family: inherit;
    font-weight: 900;
    background: ${UI.blueGradient};
    box-shadow: 0 8px 22px rgba(26,63,204,0.22);
  }

  .jc-phase-btn {
    width: 100%;
    padding: 1rem 1.25rem;
    border-radius: 18px;
    font-size: 1rem;
  }

  .jc-phase-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .jc-phase-btn--green {
    background: ${UI.greenGradient};
    box-shadow: 0 8px 22px rgba(22,163,74,0.18);
  }

  .jc-defend-banner {
    margin: 0 1.25rem;
    padding: 0.72rem 1rem;
    background: #fffbeb;
    border: 1px solid #fcd34d;
    border-radius: 16px;
    font-size: 0.78rem;
    font-weight: 800;
    color: #92400e;
    text-align: center;
  }

  .jc-mastery-page {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${UI.bg};
  }

  .jc-mastery-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
    padding: 2rem 1.2rem;
    text-align: center;
    max-width: 470px;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .jc-mastery-icon {
    font-size: 4rem;
    line-height: 1;
  }

  .jc-mastery-title {
    font-size: 2.15rem;
    font-weight: 900;
    color: ${UI.text};
    letter-spacing: -0.03em;
  }

  .jc-mastery-code {
    font-size: 0.64rem;
    font-weight: 900;
    color: #166534;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    padding: 0.28rem 0.85rem;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .jc-mastery-name {
    font-size: 0.94rem;
    color: ${UI.textSoft};
    max-width: 320px;
    line-height: 1.55;
  }

  .jc-mastery-score {
    display: flex;
    width: 100%;
    background: ${UI.card};
    border: 1px solid ${UI.border};
    border-radius: 22px;
    padding: 1rem 1.25rem;
    box-shadow: ${UI.shadow};
  }

  .jc-mastery-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.22rem;
  }

  .jc-mastery-divider {
    width: 1px;
    background: ${UI.border};
    flex-shrink: 0;
  }

  .jc-mastery-num {
    font-size: 2.2rem;
    font-weight: 900;
    color: ${UI.green};
    line-height: 1;
  }

  .jc-mastery-lbl {
    font-size: 0.62rem;
    font-weight: 800;
    color: ${UI.textSoft};
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .jc-mastery-verse {
    border-radius: 18px;
    padding: 1rem 1.15rem;
    width: 100%;
  }

  .jc-mastery-verse-ref {
    font-size: 0.64rem;
    font-weight: 900;
    color: ${UI.blue};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.45rem;
  }

  .jc-mastery-verse-text {
    font-size: 0.96rem;
    color: ${UI.text};
    line-height: 1.72;
    font-weight: 800;
  }

  .jc-mastery-actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    width: 100%;
    margin-top: 0.35rem;
  }

  .jc-mastery-btn {
    width: 100%;
    padding: 0.95rem 1rem;
    border-radius: 18px;
    font-size: 0.98rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
  }

  .jc-mastery-btn--ghost {
    background: ${UI.card};
    color: ${UI.textSoft};
    border: 1px solid ${UI.border};
  }

  .jc-loader-flame {
    width: 54px;
    height: 54px;
    animation: jcPulse 1.4s ease-in-out infinite;
  }

  .jc-loader-text {
    font-size: 0.9rem;
    color: ${UI.textSoft};
    font-weight: 700;
  }

  .jc-burst {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .jc-burst-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    opacity: 0.7;
  }

  .jc-burst-dot-1 { top: 18%; left: 22%; background: #60a5fa; }
  .jc-burst-dot-2 { top: 24%; right: 18%; background: #f59e0b; }
  .jc-burst-dot-3 { top: 38%; left: 10%; background: #4ade80; }
  .jc-burst-dot-4 { top: 42%; right: 12%; background: #f87171; }
  .jc-burst-dot-5 { bottom: 26%; left: 18%; background: #a78bfa; }
  .jc-burst-dot-6 { bottom: 22%; right: 24%; background: #34d399; }
  .jc-burst-dot-7 { top: 14%; left: 50%; background: #fb7185; }
  .jc-burst-dot-8 { bottom: 16%; left: 42%; background: #fbbf24; }
  .jc-burst-dot-9 { bottom: 14%; right: 42%; background: #38bdf8; }
  .jc-burst-dot-10 { top: 56%; right: 30%; background: #86efac; }

  @keyframes jcPulse {
    0%,100% { opacity: 0.55; transform: scale(0.94); }
    50%     { opacity: 1; transform: scale(1.06); }
  }

  @media (max-width: 860px) {
    .jc-hero,
    .jc-board,
    .jc-defend-banner {
      margin-left: 0.85rem;
      margin-right: 0.85rem;
    }

    .jc-select-body,
    .jc-phase-body {
      padding-left: 0.85rem;
      padding-right: 0.85rem;
    }

    .jc-board-grid,
    .jc-two-col,
    .jc-story-grid,
    .jc-teach-layout {
      grid-template-columns: 1fr;
    }

    .jc-step-nav {
      flex-direction: column;
    }

    .jc-score-badge,
    .jc-rounds-badge,
    .jc-topbar-badge {
      font-size: 0.66rem;
      padding-left: 0.6rem;
      padding-right: 0.6rem;
    }
  }
`;
