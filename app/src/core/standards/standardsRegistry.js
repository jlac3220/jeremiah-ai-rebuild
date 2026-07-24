/**
 * standardsRegistry.js — The Brain
 *
 * The single source of doctrinal truth. Every standard here is the only
 * place "correct" gets decided — the classroom UI and the grading mouthpiece
 * both read from this, never the other way around.
 *
 * Schema (ported from the original app's curriculum.js, which had the right
 * shape but was never wired to anything):
 *   subject:  { code, title, color, domains: [domain] }
 *   domain:   { domainCode, domainTitle, anchorScripture, purpose, standards: [standard] }
 *   standard: { code, title, statement, vocabulary, anchorScriptures, evidenceOfLearning }
 *
 * evidenceOfLearning is four graduated levels, in order:
 *   1. Recognition — recall and identify
 *   2. Explanation — explain meaning, contrast views
 *   3. Application — apply to real life, connect to other scriptures
 *   4. Defense     — defend against opposing positions using Scripture
 *
 * To add a standard: append a standard object to the right domain below
 * (or a new domain/subject). Nothing else needs to change — the classroom,
 * the map, and the grading mouthpiece all generalize off this shape.
 */

export const standardsRegistry = {
  OG: {
    code: "OG",
    title: "The One True God",
    color: "#003DA5",
    domains: [
      {
        domainCode: "OG.1",
        domainTitle: "Absolute Divine Identity and Scriptural Monotheism",
        anchorScripture: {
          reference: "Deuteronomy 6:4",
          text: "Hear, O Israel: The LORD our God is one LORD.",
        },
        purpose:
          "Establish the singular, exclusive identity of God as the foundation of all biblical understanding.",
        standards: [
          {
            code: "OG.1.1",
            title: "The Shema as Foundation",
            statement:
              "Recite and explain Deuteronomy 6:4 as the core confession of biblical monotheism.",
            vocabulary: ["Shema", "Echad", "Monotheism", "YHWH"],
            anchorScriptures: [
              {
                reference: "Deuteronomy 6:4",
                text: "Hear, O Israel: The LORD our God is one LORD.",
              },
              {
                reference: "Mark 12:29",
                text: "The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord.",
              },
              {
                reference: "Isaiah 43:10",
                text: "Ye are my witnesses, saith the LORD, and my servant whom I have chosen: that ye may know and believe me, and understand that I am he: before me there was no God formed, neither shall there be after me.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "Recites Deuteronomy 6:4 and states its basic meaning as the foundational confession of Israel's faith.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains the Hebrew word 'echad' (one) and why it points to an absolute, singular unity rather than a compound unity.",
              },
              {
                level: "Application",
                expectation:
                  "Demonstrates how Jesus and the apostles upheld and reaffirmed the Shema in the New Testament, showing continuity of monotheism.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends the absolute oneness of God against trinitarian claims using the Shema and supporting scriptures.",
              },
            ],
          },
          {
            code: "OG.1.2",
            title: "Divine Names and Titles",
            statement:
              "Identify and explain the significance of the primary biblical names and titles of God: YHWH, Elohim, and the I AM.",
            vocabulary: [
              "YHWH",
              "Elohim",
              "Adonai",
              "El Shaddai",
              "Tetragrammaton",
              "I AM",
            ],
            anchorScriptures: [
              {
                reference: "Exodus 3:14",
                text: "And God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you.",
              },
              {
                reference: "Isaiah 43:11",
                text: "I, even I, am the LORD; and beside me there is no saviour.",
              },
              {
                reference: "John 8:58",
                text: "Jesus said unto them, Verily, verily, I say unto you, Before Abraham was, I am.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "Lists the primary names and titles of God in Scripture (YHWH, Elohim, El Shaddai, I AM) and their basic meanings.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains how YHWH (I AM) reveals God's self-existence, eternity, and absolute sovereignty.",
              },
              {
                level: "Application",
                expectation:
                  "Connects Jesus's 'I AM' statements in the Gospel of John to the YHWH revelation in Exodus, showing fulfillment.",
              },
              {
                level: "Defense",
                expectation:
                  "Uses the biblical names and titles of God to argue for strict monotheism and to refute the notion of three distinct persons.",
              },
            ],
          },
          {
            code: "OG.1.3",
            title: "The Invisibility and Spirit Nature of God",
            statement:
              "Explain that God is Spirit and invisible in His divine nature, and reconcile this with the incarnation.",
            vocabulary: ["Spirit", "Incarnation", "Omnipresent", "Transcendent"],
            anchorScriptures: [
              {
                reference: "John 4:24",
                text: "God is a Spirit: and they that worship him must worship him in spirit and in truth.",
              },
              {
                reference: "Colossians 2:9",
                text: "For in him dwelleth all the fulness of the Godhead bodily.",
              },
              {
                reference: "1 Timothy 1:17",
                text: "Now unto the King eternal, immortal, invisible, the only wise God, be honour and glory for ever and ever. Amen.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "States that God is Spirit and invisible (John 4:24; 1 Tim. 1:17) and identifies key scriptures that affirm this.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains how the incarnation (Jesus as the body of God) reconciles the invisible God becoming visible in the flesh.",
              },
              {
                level: "Application",
                expectation:
                  "Demonstrates from Colossians 2:9 and John 14:9 that seeing Jesus is seeing the fullness of the Godhead.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends the Apostolic view of the Godhead against the objection that Jesus and the Father must be separate persons because one is visible and one is not.",
              },
            ],
          },
        ],
      },
      {
        domainCode: "OG.2",
        domainTitle: "The Absolute Deity of Jesus Christ",
        anchorScripture: {
          reference: "Colossians 2:9",
          text: "For in him dwelleth all the fulness of the Godhead bodily.",
        },
        purpose:
          "Establish that Jesus Christ is not a second person of the Trinity but the fullness of the Godhead incarnate.",
        standards: [
          {
            code: "OG.2.1",
            title: "Fullness of the Godhead in Jesus",
            statement:
              "Demonstrate from Scripture that Jesus Christ embodies the full, complete Godhead — not one-third of a Trinity.",
            vocabulary: ["Godhead", "Deity", "Incarnation", "Fullness", "Emmanuel"],
            anchorScriptures: [
              {
                reference: "Colossians 2:9",
                text: "For in him dwelleth all the fulness of the Godhead bodily.",
              },
              {
                reference: "John 14:9",
                text: "He that hath seen me hath seen the Father; and how sayest thou then, Shew us the Father?",
              },
              {
                reference: "Isaiah 9:6",
                text: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "Identifies Colossians 2:9 and states that all the fullness of the Godhead dwells bodily in Jesus.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains what 'fullness of the Godhead bodily' means and why it rules out Jesus being only one-third of God.",
              },
              {
                level: "Application",
                expectation:
                  "Uses Isaiah 9:6, John 14:9, and Colossians 2:9 together to show that Jesus is the complete embodiment of the Godhead.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends the Apostolic Oneness position against trinitarian theology using these scriptures and theological reasoning.",
              },
            ],
          },
          {
            code: "OG.2.2",
            title: "Jesus as LORD and Savior",
            statement:
              "Explain why 'Jesus' is the saving name of God, fulfilling the Old Testament revelation of YHWH as Savior.",
            vocabulary: ["Savior", "Salvation", "YHWH", "Yeshua", "Redemption"],
            anchorScriptures: [
              {
                reference: "Acts 4:12",
                text: "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved.",
              },
              {
                reference: "Isaiah 43:11",
                text: "I, even I, am the LORD; and beside me there is no saviour.",
              },
              {
                reference: "Matthew 1:21",
                text: "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "Recites Acts 4:12 and states that Jesus is the only name given for salvation.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains how the name 'Jesus' (Yeshua = YHWH saves) connects the New Testament Savior to the Old Testament YHWH.",
              },
              {
                level: "Application",
                expectation:
                  "Uses Isaiah 43:11 and Acts 4:12 together to show the continuity of salvation through one God/one name.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends the uniqueness and sufficiency of the name of Jesus for salvation against pluralistic or multi-name salvation views.",
              },
            ],
          },
        ],
      },
      {
        domainCode: "OG.3",
        domainTitle:
          "The Father, Son, and Holy Spirit — One God in Three Manifestations",
        anchorScripture: {
          reference: "Matthew 28:19",
          text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.",
        },
        purpose:
          "Clarify the biblical meaning of Father, Son, and Holy Spirit as three roles/manifestations of one God, not three distinct persons.",
        standards: [
          {
            code: "OG.3.1",
            title: "The Great Commission and Baptismal Formula",
            statement:
              "Explain why Matthew 28:19 ('in the name') is fulfilled by baptism in Jesus's name, not by three titles.",
            vocabulary: [
              "Baptism",
              "Name",
              "Title",
              "Manifestation",
              "Role",
              "Person",
            ],
            anchorScriptures: [
              {
                reference: "Matthew 28:19",
                text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.",
              },
              {
                reference: "Acts 2:38",
                text: "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins.",
              },
              {
                reference: "Acts 8:16",
                text: "For as yet he was fallen upon none of them: only they were baptized in the name of the Lord Jesus.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "States Matthew 28:19 and identifies that Father, Son, and Holy Ghost are titles, not individual names.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains that 'the name' (singular) in Matthew 28:19 points to one name that encompasses all three titles — fulfilled in Jesus.",
              },
              {
                level: "Application",
                expectation:
                  "Demonstrates from Acts 2:38, 8:16, and 10:48 that the early church consistently baptized in Jesus's name as the fulfillment of Matthew 28:19.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends Jesus-name baptism against trinitarianism using the pattern of the book of Acts and the singular 'name' of Matthew 28:19.",
              },
            ],
          },
        ],
      },
    ],
  },

  NB: {
    code: "NB",
    title: "The New Birth",
    color: "#dc2626",
    // Locked in the UI until every OG standard is mastered — see isSubjectUnlocked().
    requiresSubjectMastered: "OG",
    domains: [
      {
        domainCode: "NB.1",
        domainTitle: "The Apostolic Plan of Salvation",
        anchorScripture: {
          reference: "Acts 2:38",
          text: "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.",
        },
        purpose:
          "Establish the apostolic plan of salvation — repentance, water baptism in Jesus's name, and Holy Ghost baptism — as the biblical New Birth.",
        standards: [
          {
            code: "NB.1.1",
            title: "Acts 2:38 as the Gospel Pattern",
            statement:
              "Explain Acts 2:38 as the foundational response to the gospel: repentance, baptism in Jesus's name, and receiving the Holy Ghost.",
            vocabulary: [
              "Repentance",
              "Baptism",
              "Holy Ghost",
              "Remission",
              "New Birth",
              "Salvation",
            ],
            anchorScriptures: [
              {
                reference: "Acts 2:38",
                text: "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.",
              },
              {
                reference: "John 3:5",
                text: "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "Recites Acts 2:38 and identifies its three elements: repent, be baptized in Jesus's name, receive the Holy Ghost.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains why each element of Acts 2:38 is necessary for the New Birth and what each one accomplishes.",
              },
              {
                level: "Application",
                expectation:
                  "Connects Acts 2:38 to John 3:5 ('born of water and Spirit') and shows how they describe the same New Birth experience.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends Acts 2:38 as the complete gospel pattern against sinner's-prayer-only or faith-alone salvation doctrines.",
              },
            ],
          },
          {
            code: "NB.1.2",
            title: "True Repentance",
            statement:
              "Define biblical repentance as a genuine change of mind and direction, leading to transformed living, not merely sorrow.",
            vocabulary: [
              "Repentance",
              "Metanoia",
              "Contrition",
              "Transformation",
              "Godly sorrow",
            ],
            anchorScriptures: [
              {
                reference: "Acts 3:19",
                text: "Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord.",
              },
              {
                reference: "2 Corinthians 7:10",
                text: "For godly sorrow worketh repentance to salvation not to be repented of: but the sorrow of the world worketh death.",
              },
              {
                reference: "Luke 13:3",
                text: "I tell you, Nay: but, except ye repent, ye shall all likewise perish.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "Defines repentance using Acts 3:19 and states that it involves turning from sin and turning toward God.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains the difference between godly sorrow (leads to repentance) and worldly sorrow (leads to death) using 2 Corinthians 7:10.",
              },
              {
                level: "Application",
                expectation:
                  "Applies the concept of repentance to real-world decisions: what does genuine repentance look like in daily life?",
              },
              {
                level: "Defense",
                expectation:
                  "Defends the necessity of repentance as an active prerequisite for salvation against 'easy believism' or cheap grace.",
              },
            ],
          },
        ],
      },
      {
        domainCode: "NB.2",
        domainTitle: "Water Baptism in Jesus's Name",
        anchorScripture: {
          reference: "Romans 6:4",
          text: "Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life.",
        },
        purpose:
          "Establish immersion baptism in the name of Jesus Christ as the biblical mode and formula for remission of sins.",
        standards: [
          {
            code: "NB.2.1",
            title: "Baptism as Burial and Resurrection",
            statement:
              "Explain the symbolism and necessity of water baptism as a burial of the old life and resurrection to new life in Christ.",
            vocabulary: [
              "Baptism",
              "Immersion",
              "Burial",
              "Resurrection",
              "Remission",
              "New life",
            ],
            anchorScriptures: [
              {
                reference: "Romans 6:4",
                text: "Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life.",
              },
              {
                reference: "Acts 2:38",
                text: "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins.",
              },
              {
                reference: "Colossians 2:12",
                text: "Buried with him in baptism, wherein also ye are risen with him through the faith of the operation of God, who hath raised him from the dead.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "States from Romans 6:4 that baptism represents burial of the old self and resurrection to new life.",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains why full immersion is the biblical mode of baptism — as it pictures death, burial, and resurrection.",
              },
              {
                level: "Application",
                expectation:
                  "Connects the symbolism of baptism to the death, burial, and resurrection of Jesus as described in 1 Corinthians 15:1-4.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends immersion in Jesus's name as the only scripturally valid baptism against sprinkling or titles-only formulas.",
              },
            ],
          },
        ],
      },
      {
        domainCode: "NB.3",
        domainTitle: "The Baptism of the Holy Ghost",
        anchorScripture: {
          reference: "Acts 2:4",
          text: "And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.",
        },
        purpose:
          "Establish the indwelling Holy Ghost — evidenced initially by speaking in other tongues — as the third essential element of the New Birth.",
        standards: [
          {
            code: "NB.3.1",
            title: "The Holy Ghost as the Spirit of God",
            statement:
              "Identify the Holy Ghost as the Spirit of God dwelling in believers, not a separate divine person.",
            vocabulary: [
              "Holy Ghost",
              "Holy Spirit",
              "Indwelling",
              "Comforter",
              "Paraclete",
            ],
            anchorScriptures: [
              {
                reference: "Acts 2:4",
                text: "And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance.",
              },
              {
                reference: "Romans 8:11",
                text: "But if the Spirit of him that raised up Jesus from the dead dwell in you, he that raised up Christ from the dead shall also quicken your mortal bodies by his Spirit that dwelleth in you.",
              },
              {
                reference: "1 Corinthians 12:13",
                text: "For by one Spirit are we all baptized into one body, whether we be Jews or Gentiles, whether we be bond or free; and have been all made to drink into one Spirit.",
              },
            ],
            evidenceOfLearning: [
              {
                level: "Recognition",
                expectation:
                  "States that the Holy Ghost is the Spirit of God dwelling in believers and names the initial evidence (speaking in tongues).",
              },
              {
                level: "Explanation",
                expectation:
                  "Explains the role of the Holy Ghost as teacher, comforter, guide, and the seal of salvation.",
              },
              {
                level: "Application",
                expectation:
                  "Shows from Acts 2, 8, 10, and 19 that the consistent pattern of Holy Ghost reception in the New Testament includes tongues as evidence.",
              },
              {
                level: "Defense",
                expectation:
                  "Defends speaking in tongues as the biblical initial evidence of the Holy Ghost against those who deny its necessity.",
              },
            ],
          },
        ],
      },
    ],
  },
};

/** Flattens the registry to one array, each standard enriched with its domain/subject context. */
export function getAllStandards() {
  const all = [];
  Object.values(standardsRegistry).forEach((subject) => {
    (subject.domains || []).forEach((domain) => {
      (domain.standards || []).forEach((standard) => {
        all.push({
          ...standard,
          domainCode: domain.domainCode,
          domainTitle: domain.domainTitle,
          domainAnchorScripture: domain.anchorScripture,
          subjectCode: subject.code,
          subjectTitle: subject.title,
          subjectColor: subject.color,
        });
      });
    });
  });
  return all;
}

export function getStandardByCode(code) {
  return getAllStandards().find((standard) => standard.code === code) || null;
}

export function getDomainsForSubject(subjectCode) {
  return standardsRegistry[subjectCode]?.domains || [];
}

export function getSubjects() {
  return Object.values(standardsRegistry);
}

/** progress: { [standardCode]: 0|1|2|3|4 } — see evidenceOfLearning level order. */
export function isSubjectMastered(subjectCode, progress = {}) {
  const subject = standardsRegistry[subjectCode];
  if (!subject) return false;
  return (subject.domains || []).every((domain) =>
    (domain.standards || []).every((standard) => (progress[standard.code] || 0) >= 4)
  );
}

export function isSubjectUnlocked(subjectCode, progress = {}) {
  const subject = standardsRegistry[subjectCode];
  if (!subject) return false;
  if (!subject.requiresSubjectMastered) return true;
  return isSubjectMastered(subject.requiresSubjectMastered, progress);
}

/** Returns the first unmastered standard, OG-then-NB order, respecting subject locks. */
export function getNextUnmasteredStandard(progress = {}) {
  const all = getAllStandards();
  return (
    all.find(
      (standard) =>
        (progress[standard.code] || 0) < 4 &&
        isSubjectUnlocked(standard.subjectCode, progress)
    ) || null
  );
}

export const DEFAULT_STANDARD_CODE = "OG.1.1";
