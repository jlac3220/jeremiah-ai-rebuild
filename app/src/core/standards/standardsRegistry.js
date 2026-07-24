/**
 * standardsRegistry.js — The Brain
 *
 * The single source of doctrinal truth. Every standard here is the only
 * place "correct" gets decided — the classroom UI and the grading/ask
 * mouthpiece both read from this, never the other way around.
 *
 * Sourced from two authoritative master documents: "The One True God —
 * Standards Master Document (.18 Readiness Benchmark)" and "The New Birth
 * — Standards Master Document (.18 Readiness Benchmark)", 126 real
 * standards across 31 domains, extracted verbatim.
 *
 * Schema:
 *   subject:  { code, title, color, requiresSubjectMastered?, domains: [domain] }
 *   domain:   { domainCode, domainTitle, anchorScripture, standards: [standard] }
 *   standard: {
 *     code, title, statement,
 *     scope,               // full doctrinal scope & clarifications
 *     instructionalFocus,  // how this should be taught
 *     vocabulary, anchorScriptures, evidenceOfLearning,
 *   }
 *
 * evidenceOfLearning is four graduated levels, in order:
 *   1. Recognition — recall and identify
 *   2. Explanation — explain meaning, contrast views
 *   3. Application — apply to real life, connect to other scriptures
 *   4. Defense     — defend against opposing positions using Scripture
 *
 * To add a standard: append a standard object to the right domain below
 * (or a new domain/subject). Nothing else needs to change — the classroom,
 * the map, and the grading/ask mouthpiece all generalize off this shape.
 */

export const standardsRegistry = {
  "OG": {
    "code": "OG",
    "title": "The One True God",
    "color": "#003DA5",
    "domains": [
      {
        "domainCode": "OG.1",
        "domainTitle": "Absolute Divine Identity and Scriptural Monotheism",
        "anchorScripture": {
          "reference": "Deuteronomy 6:4",
          "text": "The LORD our God is one LORD."
        },
        "standards": [
          {
            "code": "OG.1.1.18",
            "title": "The Shema as Doctrinal Foundation",
            "statement": "The student can recite, translate, and expound Deuteronomy 6:4 as the irreducible confession of biblical monotheism, demonstrating how it functions as the interpretive framework for all subsequent revelation about God.",
            "scope": "This standard is not merely about memorizing a verse. The student must demonstrate that the Shema is not a piece of ancient Israelite religion later superseded — it is the doctrinal foundation that Jesus himself reaffirmed (Mark 12:29) and that the New Testament apostolic writers operated within. The student must be able to show why Deuteronomy 6:4 cannot be reread as compatible with a three-person Godhead without violating the plain meaning of \"echad\" and the absolute exclusivity demanded by the context.",
            "instructionalFocus": "Teach the Shema not as a memorized slogan but as a confessional anchor. Help students feel its weight — this is what Israel was willing to die for, what Jesus called the greatest commandment, what the apostles never revised. Contrast it with both polytheism and trinitarianism. Use the Isaiah parallels to reinforce exclusivity.",
            "vocabulary": [
              "Monotheism",
              "The Shema",
              "Echad",
              "Numerical oneness",
              "Monotheistic exclusivity",
              "Philosophical theism"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 6:4",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "Isaiah 43:10",
                "text": "Before me there was no God formed, neither shall there be after me."
              },
              {
                "reference": "Isaiah 44:6",
                "text": "I am the first, and I am the last; and beside me there is no God."
              },
              {
                "reference": "Isaiah 45:5",
                "text": "I am the LORD, and there is none else, there is no God beside me."
              },
              {
                "reference": "Mark 12:29",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "1 Corinthians 8:4–6",
                "text": "There is none other God but one… one God, the Father."
              },
              {
                "reference": "Ephesians 4:5–6",
                "text": "One Lord, one faith, one baptism, one God and Father of all."
              },
              {
                "reference": "1 Timothy 2:5",
                "text": "For there is one God, and one mediator… the man Christ Jesus."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States the text and basic meaning of the Shema."
              },
              {
                "level": "Explanation",
                "expectation": "Translates \"echad\" correctly, explains why the Shema demands numerical rather than compound unity, and places it in its Israelite covenant context."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates how Jesus's reaffirmation of the Shema in Mark 12:29 forecloses a trinitarian reading; shows how 1 Corinthians 8:4–6 and Ephesians 4:5–6 operate within Shema monotheism."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian claim that \"echad\" permits compound unity (citing Genesis 2:24), showing that grammatical flexibility does not override the theological context of the Shema and the absolute exclusivity of Isaiah's parallel declarations."
              }
            ]
          },
          {
            "code": "OG.1.2.18",
            "title": "Isaiah's Monotheistic Declarations",
            "statement": "The student can identify, quote from memory, and theologically interpret the major monotheistic declarations of Isaiah (43:10, 44:6, 44:8, 45:5–6, 45:21–22, 46:9), demonstrating that God's exclusive identity is asserted with language that admits no plurality of divine persons.",
            "scope": "Isaiah 40–46 constitutes the most concentrated monotheistic argument in the Old Testament. The student must understand that these declarations are not merely poetic — they are theological propositions, made in the context of Israel's temptation toward polytheism, using the most absolute language available. The student must be able to show that \"beside me there is no God\" and \"before me there was no God formed\" close off any interpretation that posits a second or third divine person alongside the Father.",
            "instructionalFocus": "Walk students through Isaiah 40–46 as a sustained argument, not a verse list. Show the courtroom imagery of Isaiah 43 — God calls the nations to produce a witness, and none can. Let the cumulative weight of these declarations land before applying them polemically.",
            "vocabulary": [
              "Monotheism",
              "The Shema",
              "Echad",
              "Numerical oneness",
              "Monotheistic exclusivity",
              "Philosophical theism"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 6:4",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "Isaiah 43:10",
                "text": "Before me there was no God formed, neither shall there be after me."
              },
              {
                "reference": "Isaiah 44:6",
                "text": "I am the first, and I am the last; and beside me there is no God."
              },
              {
                "reference": "Isaiah 45:5",
                "text": "I am the LORD, and there is none else, there is no God beside me."
              },
              {
                "reference": "Mark 12:29",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "1 Corinthians 8:4–6",
                "text": "There is none other God but one… one God, the Father."
              },
              {
                "reference": "Ephesians 4:5–6",
                "text": "One Lord, one faith, one baptism, one God and Father of all."
              },
              {
                "reference": "1 Timothy 2:5",
                "text": "For there is one God, and one mediator… the man Christ Jesus."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Can locate the major passages and state their general claim."
              },
              {
                "level": "Explanation",
                "expectation": "Quotes at least four passages and explains the force of each declaration — no God before, beside, or after."
              },
              {
                "level": "Application",
                "expectation": "Shows how the Isaiah declarations function as the background for New Testament monotheism; applies them to refute the concept of eternal divine persons alongside each other."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian reading that these texts are about God's uniqueness among other gods (not internal structure), demonstrating that the grammatical force of \"beside me there is no God\" cannot be qualified to mean \"no other divine species\" while still permitting multiple co-equal persons of one God."
              }
            ]
          },
          {
            "code": "OG.1.3.18",
            "title": "New Testament Continuity with Old Testament Monotheism",
            "statement": "The student demonstrates that the New Testament apostolic writers operate within, not beyond, Old Testament monotheism — and can show from 1 Corinthians 8:4–6, Ephesians 4:5–6, 1 Timothy 2:5, and James 2:19 that the apostolic confession of God's oneness is identical in kind to the Shema, not a revision of it.",
            "scope": "This standard addresses a common confusion: that the New Testament introduces a more complex Godhead. The student must be able to demonstrate that every apostolic statement about the oneness of God is consistent with — and draws directly from — the Old Testament monotheistic tradition. The phrase \"one God, the Father\" (1 Cor. 8:6) must be interpreted within Jewish monotheism, not read as introducing a distinct person named \"Father\" within a trinity.",
            "instructionalFocus": "Help students see the Bible as a single unfolding monotheistic story. The apostles were Jews who never stopped being monotheists. Their language about Jesus must be interpreted within that framework, not as a departure from it.",
            "vocabulary": [
              "Monotheism",
              "The Shema",
              "Echad",
              "Numerical oneness",
              "Monotheistic exclusivity",
              "Philosophical theism"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 6:4",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "Isaiah 43:10",
                "text": "Before me there was no God formed, neither shall there be after me."
              },
              {
                "reference": "Isaiah 44:6",
                "text": "I am the first, and I am the last; and beside me there is no God."
              },
              {
                "reference": "Isaiah 45:5",
                "text": "I am the LORD, and there is none else, there is no God beside me."
              },
              {
                "reference": "Mark 12:29",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "1 Corinthians 8:4–6",
                "text": "There is none other God but one… one God, the Father."
              },
              {
                "reference": "Ephesians 4:5–6",
                "text": "One Lord, one faith, one baptism, one God and Father of all."
              },
              {
                "reference": "1 Timothy 2:5",
                "text": "For there is one God, and one mediator… the man Christ Jesus."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Identifies the NT monotheistic texts and their basic claim."
              },
              {
                "level": "Explanation",
                "expectation": "Shows how each text depends on Old Testament monotheism rather than revising it; explains why Paul's \"one God, the Father\" is not a trinitarian formula."
              },
              {
                "level": "Application",
                "expectation": "Constructs a brief argument showing OT → NT continuity of monotheistic confession as a throughline from Deuteronomy through Jesus's own words to Paul and James."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that 1 Corinthians 8:6 introduces a binitarian or trinitarian structure, showing that Paul is distinguishing the true God from pagan deities — not introducing internal divine persons."
              }
            ]
          },
          {
            "code": "OG.1.4.18",
            "title": "Oneness vs. Trinitarianism — The Core Distinction",
            "statement": "The student can clearly define the difference between Oneness monotheism and trinitarian theology, identifying the exact point of departure (the question of divine persons) and articulating why the Oneness position holds that the trinitarian formulation is not a refinement of biblical monotheism but a departure from it.",
            "scope": "The student is not expected to deliver a polemical attack on trinitarian Christians. The standard requires theological clarity: what does each position actually claim? Where do they differ? The student must be able to state the trinitarian position accurately (one substance/essence in three co-equal, co-eternal persons) before articulating how the Oneness position differs (one God who is absolutely singular, not composed of persons, who has revealed himself through roles and the incarnation). Polemics without precision fail this standard.",
            "instructionalFocus": "This standard requires that students can name both sides fairly. Drill them on accurately stating the trinitarian position before they refute it. A student who cannot fairly represent the opposing view has not yet earned the right to refute it.",
            "vocabulary": [
              "Monotheism",
              "The Shema",
              "Echad",
              "Numerical oneness",
              "Monotheistic exclusivity",
              "Philosophical theism"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 6:4",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "Isaiah 43:10",
                "text": "Before me there was no God formed, neither shall there be after me."
              },
              {
                "reference": "Isaiah 44:6",
                "text": "I am the first, and I am the last; and beside me there is no God."
              },
              {
                "reference": "Isaiah 45:5",
                "text": "I am the LORD, and there is none else, there is no God beside me."
              },
              {
                "reference": "Mark 12:29",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "1 Corinthians 8:4–6",
                "text": "There is none other God but one… one God, the Father."
              },
              {
                "reference": "Ephesians 4:5–6",
                "text": "One Lord, one faith, one baptism, one God and Father of all."
              },
              {
                "reference": "1 Timothy 2:5",
                "text": "For there is one God, and one mediator… the man Christ Jesus."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Can state that trinitarianism teaches three persons and Oneness teaches one God."
              },
              {
                "level": "Explanation",
                "expectation": "Accurately defines both positions, including the trinitarian terms substance, person, and proceeding; explains the Oneness rejection of eternal person-distinctions."
              },
              {
                "level": "Application",
                "expectation": "Shows exactly where the two positions diverge exegetically (e.g., in the interpretation of Matthew 28:19, John 1:1, and the baptismal accounts in Acts) and why."
              },
              {
                "level": "Defense",
                "expectation": "Engages a trinitarian challenge at a theological level — not just repeating a list of proof texts, but responding to the actual argument (e.g., \"How can Jesus pray to himself?\") with a theologically coherent answer grounded in the incarnation doctrine."
              }
            ]
          },
          {
            "code": "OG.1.5.18",
            "title": "The Unity of God as Ethical and Doxological Foundation",
            "statement": "The student articulates how the confession of God's absolute oneness is not merely intellectual but doxological and ethical — producing exclusive devotion, covenantal faithfulness, and a worldview in which all things are held together by one sovereign Lord.",
            "scope": "Deuteronomy 6:4 is immediately followed by the Shema's application: \"love the LORD thy God with all thine heart\" (v.5). The confession of divine unity produces exclusive devotion because a divided God could permit divided loyalty. This standard asks students to connect doctrine to life — the oneness of God is not a theological curiosity but the foundation of worship, ethics, mission, and identity. A student who can argue monotheism philosophically but does not feel its devotional weight has not fully met this standard.",
            "instructionalFocus": "End this domain by grounding it in worship and love. Students who have been trained in this doctrine since childhood can become argumentatively skilled while remaining personally cold. This standard calls for integration of head and heart.",
            "vocabulary": [
              "Monotheism",
              "The Shema",
              "Echad",
              "Numerical oneness",
              "Monotheistic exclusivity",
              "Philosophical theism"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 6:4",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "Isaiah 43:10",
                "text": "Before me there was no God formed, neither shall there be after me."
              },
              {
                "reference": "Isaiah 44:6",
                "text": "I am the first, and I am the last; and beside me there is no God."
              },
              {
                "reference": "Isaiah 45:5",
                "text": "I am the LORD, and there is none else, there is no God beside me."
              },
              {
                "reference": "Mark 12:29",
                "text": "The LORD our God is one LORD."
              },
              {
                "reference": "1 Corinthians 8:4–6",
                "text": "There is none other God but one… one God, the Father."
              },
              {
                "reference": "Ephesians 4:5–6",
                "text": "One Lord, one faith, one baptism, one God and Father of all."
              },
              {
                "reference": "1 Timothy 2:5",
                "text": "For there is one God, and one mediator… the man Christ Jesus."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the Shema has a commandment attached (love God completely)."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the logical connection between numerical divine unity and the demand for undivided human devotion; can relate this to the First and Second Commandments."
              },
              {
                "level": "Application",
                "expectation": "Articulates how the oneness of God shapes apostolic mission (one gospel, one salvation, one Lord), worship (exclusive devotion to Jesus), and ethics (no divided moral allegiances)."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the charge that Oneness theology is merely an intellectual position by demonstrating its generative power for spiritual life, evangelism, and community — showing that knowing this God changes everything."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.2",
        "domainTitle": "The Nature and Attributes of the One God",
        "anchorScripture": {
          "reference": "John 4:24",
          "text": "God is a Spirit."
        },
        "standards": [
          {
            "code": "OG.2.1.18",
            "title": "God as Spirit — Essential Nature",
            "statement": "The student can define and explain what it means that \"God is a Spirit\" (John 4:24), demonstrating that this essential nature means God is immaterial, unlimited, non-composite, and not bounded by space or form — and can show how this definition controls all other claims about God.",
            "scope": "This is the definitional standard of the domain. \"God is a Spirit\" is not one description among many — it is the controlling ontological claim. The student must understand that a spirit is not a physical being, does not have a body, and is not localized. This has enormous implications: it means the Father does not have a body (refuting some Latter-Day Saint claims), that God cannot be divided into parts (refuting tritheism), and that the incarnation was a genuine assumption of human nature by an immaterial God (not a transformation).",
            "instructionalFocus": "Begin here with the nature of spirit. Many young disciples do not have a clear mental picture of what God actually is — they imagine a large glowing human. Disrupt that image carefully and scripturally. Then show them what the incarnation actually accomplished: God clothed himself in human nature without ceasing to be Spirit.",
            "vocabulary": [
              "Incommunicable attributes",
              "Communicable attributes",
              "Aseity",
              "Immutability",
              "Omnipresence",
              "Holiness"
            ],
            "anchorScriptures": [
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Deuteronomy 4:15–16",
                "text": "Ye saw no manner of similitude… take ye therefore good heed unto yourselves."
              },
              {
                "reference": "Psalm 90:2",
                "text": "From everlasting to everlasting, thou art God."
              },
              {
                "reference": "Malachi 3:6",
                "text": "I am the LORD, I change not."
              },
              {
                "reference": "Isaiah 40:28",
                "text": "His understanding is unsearchable."
              },
              {
                "reference": "Jeremiah 23:24",
                "text": "Do not I fill heaven and earth?"
              },
              {
                "reference": "Revelation 19:6",
                "text": "The Lord God omnipotent reigneth."
              },
              {
                "reference": "Exodus 34:6–7",
                "text": "The LORD, The LORD God, merciful and gracious…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Quotes John 4:24 and states that God has no physical form."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the implications of spirit-nature: immateriality, omnipresence, non-composite being; distinguishes from material or bounded existence."
              },
              {
                "level": "Application",
                "expectation": "Shows how \"God is a Spirit\" controls the interpretation of OT theophanies (visible manifestations) — they were temporary, representational, not God's actual form."
              },
              {
                "level": "Defense",
                "expectation": "Refutes anthropomorphic or divisible-God concepts (including LDS claims about God having a body) using the spirit-nature definition, while explaining why the incarnation does not contradict it."
              }
            ]
          },
          {
            "code": "OG.2.2.18",
            "title": "The Incommunicable Attributes",
            "statement": "The student can name, define, and provide scriptural support for the five primary incommunicable attributes of God (aseity, omniscience, omnipotence, omnipresence, immutability), demonstrating how each attribute belongs exclusively to God and was fully manifest in Jesus Christ.",
            "scope": "The student must not merely list attributes but show scriptural ground for each and connect each to the incarnation. Omniscience: \"In whom are hid all the treasures of wisdom and knowledge\" (Col. 2:3). Omnipotence: \"All things were created by him and for him\" (Col. 1:16). Omnipresence: Jesus is present wherever two or three are gathered (Matt. 18:20). These connections establish that the Oneness position is not merely about monotheism in the abstract — it is about the full deity of Jesus specifically.",
            "instructionalFocus": "Build this systematically — attribute by attribute, verse by verse. Then close with the Colossians summary (1:19; 2:9) and show students that all five attributes are gathered into the one affirmation that all the fullness of the Godhead dwells bodily in Jesus.",
            "vocabulary": [
              "Incommunicable attributes",
              "Communicable attributes",
              "Aseity",
              "Immutability",
              "Omnipresence",
              "Holiness"
            ],
            "anchorScriptures": [
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Deuteronomy 4:15–16",
                "text": "Ye saw no manner of similitude… take ye therefore good heed unto yourselves."
              },
              {
                "reference": "Psalm 90:2",
                "text": "From everlasting to everlasting, thou art God."
              },
              {
                "reference": "Malachi 3:6",
                "text": "I am the LORD, I change not."
              },
              {
                "reference": "Isaiah 40:28",
                "text": "His understanding is unsearchable."
              },
              {
                "reference": "Jeremiah 23:24",
                "text": "Do not I fill heaven and earth?"
              },
              {
                "reference": "Revelation 19:6",
                "text": "The Lord God omnipotent reigneth."
              },
              {
                "reference": "Exodus 34:6–7",
                "text": "The LORD, The LORD God, merciful and gracious…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Names the five attributes and provides one verse for each."
              },
              {
                "level": "Explanation",
                "expectation": "Defines each attribute precisely and distinguishes it from human limitations."
              },
              {
                "level": "Application",
                "expectation": "Shows how each incommunicable attribute is ascribed to Jesus in the NT, demonstrating his full deity rather than derivative or secondary divine status."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that Jesus's human limitations (he grew tired, didn't know the hour) contradict his omniscience/omnipotence — explaining the dual nature principle without creating two persons."
              }
            ]
          },
          {
            "code": "OG.2.3.18",
            "title": "The Moral Attributes — Holiness, Love, Justice, Mercy",
            "statement": "The student can articulate the major moral attributes of God — holiness, love, justice, mercy, and truth — from Scripture, demonstrating how they are not in tension with each other but are unified in the one God, and how the cross of Christ is the supreme revelation of their integration.",
            "scope": "Exodus 34:6–7 is the most complete divine self-declaration of moral character in the Old Testament. The student must be able to expound this passage and show how God's mercy does not cancel his justice, his holiness does not override his love, and his truth does not contradict his forgiveness. The cross is the doctrinal resolution: in the atonement, God's justice is fully satisfied and his mercy is fully expressed — not by a Son paying a Father, but by God himself bearing the full cost of redemption in human flesh.",
            "instructionalFocus": "This standard is deeply pastoral. The moral attributes of God are not abstract — they are what people experience when they encounter God in repentance, forgiveness, discipline, and grace. Help students connect these attributes to their own story.",
            "vocabulary": [
              "Incommunicable attributes",
              "Communicable attributes",
              "Aseity",
              "Immutability",
              "Omnipresence",
              "Holiness"
            ],
            "anchorScriptures": [
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Deuteronomy 4:15–16",
                "text": "Ye saw no manner of similitude… take ye therefore good heed unto yourselves."
              },
              {
                "reference": "Psalm 90:2",
                "text": "From everlasting to everlasting, thou art God."
              },
              {
                "reference": "Malachi 3:6",
                "text": "I am the LORD, I change not."
              },
              {
                "reference": "Isaiah 40:28",
                "text": "His understanding is unsearchable."
              },
              {
                "reference": "Jeremiah 23:24",
                "text": "Do not I fill heaven and earth?"
              },
              {
                "reference": "Revelation 19:6",
                "text": "The Lord God omnipotent reigneth."
              },
              {
                "reference": "Exodus 34:6–7",
                "text": "The LORD, The LORD God, merciful and gracious…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Lists the moral attributes with supporting verses."
              },
              {
                "level": "Explanation",
                "expectation": "Defines each moral attribute and shows why they are not contradictory."
              },
              {
                "level": "Application",
                "expectation": "Expounds Exodus 34:6–7 and shows how each moral attribute there named is fulfilled in the ministry, death, and resurrection of Jesus."
              },
              {
                "level": "Defense",
                "expectation": "Addresses the apparent tension between divine wrath and divine love (often raised by critics of atonement theology) by showing how Oneness theology uniquely resolves it — God himself paid the price, and the wrath and love are both his own."
              }
            ]
          },
          {
            "code": "OG.2.4.18",
            "title": "Divine Sovereignty and Human Responsibility",
            "statement": "The student understands and can articulate the biblical tension between God's absolute sovereignty — his control over all creation, history, and redemption — and genuine human moral responsibility, without collapsing either side into the other.",
            "scope": "This standard addresses one of the perennial tensions in Christian theology. The student does not need to resolve the philosophical problem but must be able to hold both truths scripturally. Acts 2:23 is the paradigm text: Jesus was delivered \"by the determinate counsel and foreknowledge of God,\" yet wicked hands crucified him — both divine sovereignty and human guilt are fully affirmed in the same sentence. This standard guards against fatalism on one side and an Arminian dismissal of sovereignty on the other.",
            "instructionalFocus": "Teach this with Acts 2:23 at the center. Resist the urge to resolve the tension philosophically — let Scripture hold both truths without flinching. Students who understand this will have a more robust prayer life and a more honest evangelism.",
            "vocabulary": [
              "Incommunicable attributes",
              "Communicable attributes",
              "Aseity",
              "Immutability",
              "Omnipresence",
              "Holiness"
            ],
            "anchorScriptures": [
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Deuteronomy 4:15–16",
                "text": "Ye saw no manner of similitude… take ye therefore good heed unto yourselves."
              },
              {
                "reference": "Psalm 90:2",
                "text": "From everlasting to everlasting, thou art God."
              },
              {
                "reference": "Malachi 3:6",
                "text": "I am the LORD, I change not."
              },
              {
                "reference": "Isaiah 40:28",
                "text": "His understanding is unsearchable."
              },
              {
                "reference": "Jeremiah 23:24",
                "text": "Do not I fill heaven and earth?"
              },
              {
                "reference": "Revelation 19:6",
                "text": "The Lord God omnipotent reigneth."
              },
              {
                "reference": "Exodus 34:6–7",
                "text": "The LORD, The LORD God, merciful and gracious…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that God is sovereign and that humans are responsible for their choices."
              },
              {
                "level": "Explanation",
                "expectation": "Shows from Acts 2:23 how both truths are affirmed simultaneously without contradiction; explains what \"foreknowledge\" and \"determinate counsel\" mean."
              },
              {
                "level": "Application",
                "expectation": "Applies the sovereignty/responsibility tension to the doctrine of salvation — God's sovereign grace is the ground of salvation, human response (repentance, faith, obedience) is the required condition."
              },
              {
                "level": "Defense",
                "expectation": "Engages the Calvinist claim that divine election eliminates meaningful human response, and the Arminian claim that human freedom limits divine sovereignty, showing a biblically grounded Apostolic middle that does not surrender either pole."
              }
            ]
          },
          {
            "code": "OG.2.5.18",
            "title": "God's Invisibility and the Purpose of Theophanies",
            "statement": "The student can explain why God is essentially invisible (1 Tim. 1:17; John 1:18; Col. 1:15) and account for Old Testament theophanies (visible appearances of God) without contradiction — demonstrating that theophanies are anticipatory manifestations pointing forward to the definitive, permanent incarnation in Jesus Christ.",
            "scope": "The invisible God appeared visibly to Abraham, Moses, Isaiah, and Ezekiel — yet no one has seen God at any time (John 1:18). The student must resolve this: theophanies are temporary, partial, and representational — God assuming a visible form for a specific purpose without being contained by it. The incarnation is categorically different: God permanently assumed human nature in the person of Jesus Christ. Theophanies point forward to the incarnation as their fulfillment.",
            "instructionalFocus": "Show students the theophany-to-incarnation progression as a story of increasing divine nearness. God appeared in fire, in cloud, in the glory — and finally, permanently, in flesh. That is the trajectory of the whole Bible.",
            "vocabulary": [
              "Incommunicable attributes",
              "Communicable attributes",
              "Aseity",
              "Immutability",
              "Omnipresence",
              "Holiness"
            ],
            "anchorScriptures": [
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Deuteronomy 4:15–16",
                "text": "Ye saw no manner of similitude… take ye therefore good heed unto yourselves."
              },
              {
                "reference": "Psalm 90:2",
                "text": "From everlasting to everlasting, thou art God."
              },
              {
                "reference": "Malachi 3:6",
                "text": "I am the LORD, I change not."
              },
              {
                "reference": "Isaiah 40:28",
                "text": "His understanding is unsearchable."
              },
              {
                "reference": "Jeremiah 23:24",
                "text": "Do not I fill heaven and earth?"
              },
              {
                "reference": "Revelation 19:6",
                "text": "The Lord God omnipotent reigneth."
              },
              {
                "reference": "Exodus 34:6–7",
                "text": "The LORD, The LORD God, merciful and gracious…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that God is invisible but appeared in OT theophanies."
              },
              {
                "level": "Explanation",
                "expectation": "Defines theophany and explains why it is not a contradiction of divine invisibility."
              },
              {
                "level": "Application",
                "expectation": "Traces the theophany-to-incarnation trajectory: the burning bush, the pillar of fire, the glory in the tabernacle, and Ezekiel's vision all anticipate the full, permanent self-disclosure in Jesus."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the OT theophanies prove a pre-existent Son, showing that these appearances were of the eternal God — not of a second divine person — and were fulfilled in the incarnation."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.3",
        "domainTitle": "God Revealed in Creation, Covenant, and Judgment",
        "anchorScripture": {
          "reference": "Genesis 1:1",
          "text": "In the beginning God created the heaven and the earth."
        },
        "standards": [
          {
            "code": "OG.3.1.18",
            "title": "Jesus as Creator — John 1 and Colossians 1",
            "statement": "The student can demonstrate from John 1:1–3 and Colossians 1:16–17 that the Creator of Genesis 1 is identified with Jesus Christ — showing that the one God who created all things is the same God who became incarnate, not a second divine person acting as God's agent in creation.",
            "scope": "This standard directly addresses the Arian and Jehovah's Witness claim that Jesus was the first created being through whom God created everything else. The student must show that John 1:3 (\"all things were made by him; and without him was not any thing made\") closes off any middle category — nothing was created through an intermediary. The Word is not a created instrument of creation; the Word is God (John 1:1), and therefore the Creator of Genesis 1.",
            "instructionalFocus": "This is a crucial standard for evangelistic and apologetic work. Students in Birmingham and across America will encounter Jehovah's Witnesses regularly. This standard gives them biblical ground to stand on.",
            "vocabulary": [
              "Creation ex nihilo",
              "Protoevangelion",
              "Covenant",
              "General revelation",
              "Special revelation",
              "Providence"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:1",
                "text": "In the beginning God created the heaven and the earth."
              },
              {
                "reference": "Genesis 1:26",
                "text": "Let us make man in our image."
              },
              {
                "reference": "John 1:1–3",
                "text": "All things were made by him; and without him was not any thing made."
              },
              {
                "reference": "Colossians 1:16",
                "text": "For by him were all things created… all things were created by him and for him."
              },
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman…"
              },
              {
                "reference": "Genesis 9:12–13",
                "text": "The token of the covenant… a bow in the cloud."
              },
              {
                "reference": "Amos 3:6",
                "text": "Shall there be evil in a city, and the LORD hath not done it?"
              },
              {
                "reference": "Psalm 19:1",
                "text": "The heavens declare the glory of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the Bible teaches Jesus created all things."
              },
              {
                "level": "Explanation",
                "expectation": "Shows from John 1:1–3 and Col. 1:16 that Jesus is the Creator, not a created being acting as agent."
              },
              {
                "level": "Application",
                "expectation": "Constructs the argument: Genesis 1 → John 1:1–3 → Colossians 1:16–17, demonstrating the unbroken identification of the Creator God with Jesus."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the Jehovah's Witness claim that \"the Word was a god\" (NWT) and that Jesus was created before all other things, showing why John 1:1 in the Greek cannot support a secondary divine being."
              }
            ]
          },
          {
            "code": "OG.3.2.18",
            "title": "\"Let Us Make Man\" — The Plural of Genesis 1:26",
            "statement": "The student can explain why Genesis 1:26 (\"Let us make man in our image\") does not prove a trinity — articulating the grammatical, contextual, and theological reasons for reading the plural as a divine plural of deliberation or address to the heavenly court, and showing that verse 27 confirms a single Creator (\"God created man in his own image\").",
            "scope": "This verse is one of the most commonly cited alleged trinitarian proofs in the Old Testament. The student must handle it with exegetical precision. The grammatical options: (1) a royal/majestic plural, (2) God addressing the heavenly council (Job 38:7; Ps. 89:7), or (3) a plural of self-deliberation. What the text cannot support: a pre-Christian trinitarian dialogue between divine persons, because the singular \"his image\" in verse 27 immediately collapses the supposed plurality back to one actor.",
            "instructionalFocus": "This standard requires careful exegesis without ridicule. The trinitarian use of this verse is understandable — the plural is genuinely there. Teach students to honor the text and then give a better explanation, not to dismiss the question.",
            "vocabulary": [
              "Creation ex nihilo",
              "Protoevangelion",
              "Covenant",
              "General revelation",
              "Special revelation",
              "Providence"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:1",
                "text": "In the beginning God created the heaven and the earth."
              },
              {
                "reference": "Genesis 1:26",
                "text": "Let us make man in our image."
              },
              {
                "reference": "John 1:1–3",
                "text": "All things were made by him; and without him was not any thing made."
              },
              {
                "reference": "Colossians 1:16",
                "text": "For by him were all things created… all things were created by him and for him."
              },
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman…"
              },
              {
                "reference": "Genesis 9:12–13",
                "text": "The token of the covenant… a bow in the cloud."
              },
              {
                "reference": "Amos 3:6",
                "text": "Shall there be evil in a city, and the LORD hath not done it?"
              },
              {
                "reference": "Psalm 19:1",
                "text": "The heavens declare the glory of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Acknowledges the plural and states it does not require a trinity."
              },
              {
                "level": "Explanation",
                "expectation": "Explains at least two grammatical options for the plural and notes that v.27 uses singular pronouns."
              },
              {
                "level": "Application",
                "expectation": "Places Gen. 1:26 in the context of OT angelic/heavenly court texts (Ps. 89:7; 1 Kings 22:19; Job 1:6) and shows this is a more natural background than a trinitarian pre-incarnation conversation."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian use of this text by showing that if \"us\" means three persons, the \"image\" would have to be threefold — but Genesis consistently speaks of the singular image of God; also shows that no NT writer ever cites Gen. 1:26 as a trinitarian proof."
              }
            ]
          },
          {
            "code": "OG.3.3.18",
            "title": "Covenant as the Structure of Redemptive History",
            "statement": "The student can define biblical covenant, trace the major covenants of Scripture (Noahic, Abrahamic, Mosaic, Davidic, New), and demonstrate how each covenant progressively narrows and intensifies the promise of redemption that is fulfilled in Jesus Christ and applied through the new birth.",
            "scope": "Covenant is the structural backbone of biblical theology. The student does not need to be a covenant theologian but must understand that God organizes his redemptive relationship with humanity through binding promises — not through impersonal forces or philosophical categories. Each covenant adds specificity to the promise: through a specific family, a specific nation, a specific royal line, and finally a specific person — Jesus — in whom all covenants find their \"yes and amen\" (2 Cor. 1:20).",
            "instructionalFocus": "Use a visual timeline. Students need to see the covenants as a story with accumulating momentum toward Jesus. The new birth is not a departure from the covenant story — it is the moment a person enters the covenant fulfilled in Christ.",
            "vocabulary": [
              "Creation ex nihilo",
              "Protoevangelion",
              "Covenant",
              "General revelation",
              "Special revelation",
              "Providence"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:1",
                "text": "In the beginning God created the heaven and the earth."
              },
              {
                "reference": "Genesis 1:26",
                "text": "Let us make man in our image."
              },
              {
                "reference": "John 1:1–3",
                "text": "All things were made by him; and without him was not any thing made."
              },
              {
                "reference": "Colossians 1:16",
                "text": "For by him were all things created… all things were created by him and for him."
              },
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman…"
              },
              {
                "reference": "Genesis 9:12–13",
                "text": "The token of the covenant… a bow in the cloud."
              },
              {
                "reference": "Amos 3:6",
                "text": "Shall there be evil in a city, and the LORD hath not done it?"
              },
              {
                "reference": "Psalm 19:1",
                "text": "The heavens declare the glory of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Names the major biblical covenants in order."
              },
              {
                "level": "Explanation",
                "expectation": "States the basic promise, sign, and parties of each major covenant."
              },
              {
                "level": "Application",
                "expectation": "Traces the progressive narrowing of the redemptive promise: all nations (Noah) → Abraham's family → Israel → David's line → the new covenant in Jesus."
              },
              {
                "level": "Defense",
                "expectation": "Responds to dispensationalist claims that the covenants are separate tracks for different peoples (Israel and the Church), showing from Galatians 3 and Hebrews 8–10 that the new covenant is the fulfillment and supersession of all prior covenants in Christ."
              }
            ]
          },
          {
            "code": "OG.3.4.18",
            "title": "Divine Judgment as Revelation of Character",
            "statement": "The student understands that God's acts of judgment — the flood, Sodom, the plagues of Egypt, the exile — are not contradictions of his love but revelations of his holiness and the seriousness of his covenant claims, and can articulate this theologically without becoming either apologetic or callous.",
            "scope": "The problem of divine judgment is one of the primary intellectual barriers to faith for postmodern young people. The student must be able to engage this honestly — not by minimizing the severity of divine judgment or explaining it away, but by locating it within God's character as a whole: a God who is holy cannot be indifferent to sin; a God who has made covenant promises must vindicate them; a God who loves humanity must eventually act decisively against what destroys it. The cross is the ultimate divine judgment — and the ultimate act of divine love — simultaneously.",
            "instructionalFocus": "Be honest about the difficulty here. Students who have not wrestled with divine judgment will not be equipped for real conversations. Use the cross as the interpretive key — not to explain away OT judgment but to show where it all ultimately lands.",
            "vocabulary": [
              "Creation ex nihilo",
              "Protoevangelion",
              "Covenant",
              "General revelation",
              "Special revelation",
              "Providence"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:1",
                "text": "In the beginning God created the heaven and the earth."
              },
              {
                "reference": "Genesis 1:26",
                "text": "Let us make man in our image."
              },
              {
                "reference": "John 1:1–3",
                "text": "All things were made by him; and without him was not any thing made."
              },
              {
                "reference": "Colossians 1:16",
                "text": "For by him were all things created… all things were created by him and for him."
              },
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman…"
              },
              {
                "reference": "Genesis 9:12–13",
                "text": "The token of the covenant… a bow in the cloud."
              },
              {
                "reference": "Amos 3:6",
                "text": "Shall there be evil in a city, and the LORD hath not done it?"
              },
              {
                "reference": "Psalm 19:1",
                "text": "The heavens declare the glory of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that God judges sin without contradiction of his love."
              },
              {
                "level": "Explanation",
                "expectation": "Articulates the theological relationship between holiness, covenant, and judgment; explains why a loving God must also be a judging God."
              },
              {
                "level": "Application",
                "expectation": "Expounds at least one major OT judgment event (flood, Sodom, plagues, exile) as a revelation of divine character rather than arbitrary wrath."
              },
              {
                "level": "Defense",
                "expectation": "Engages the \"God of the OT is violent\" objection, showing that the same God who judges is the God who bore the fullest judgment himself on the cross — and that the cross, not the flood, is the definitive revelation of both his justice and his love."
              }
            ]
          },
          {
            "code": "OG.3.5.18",
            "title": "Creation's Testimony and the Limits of General Revelation",
            "statement": "The student can explain what general revelation is, what it accomplishes (establishing human accountability before God), and what it cannot accomplish (providing saving knowledge), and can articulate from Romans 1:18–25 why all humanity is \"without excuse\" even without the written Word — while showing why the gospel is still necessary.",
            "scope": "Romans 1:18–25 is one of the most theologically loaded passages in Paul's letters. The student must understand the argument: (1) God has made himself clearly known through creation; (2) humanity has universally suppressed this knowledge; (3) therefore all are without excuse; (4) therefore the gospel is not optional — it is the power of God unto salvation because general revelation, though real, cannot save. This standard guards against both natural theology overreach (creation tells you everything you need) and natural theology dismissal (creation reveals nothing about God).",
            "instructionalFocus": "This standard has immediate evangelistic implications. Help students feel the weight of Romans 1 — the world is not spiritually neutral, it is in active suppression of known truth. That is why the gospel is power, not suggestion.",
            "vocabulary": [
              "Creation ex nihilo",
              "Protoevangelion",
              "Covenant",
              "General revelation",
              "Special revelation",
              "Providence"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:1",
                "text": "In the beginning God created the heaven and the earth."
              },
              {
                "reference": "Genesis 1:26",
                "text": "Let us make man in our image."
              },
              {
                "reference": "John 1:1–3",
                "text": "All things were made by him; and without him was not any thing made."
              },
              {
                "reference": "Colossians 1:16",
                "text": "For by him were all things created… all things were created by him and for him."
              },
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman…"
              },
              {
                "reference": "Genesis 9:12–13",
                "text": "The token of the covenant… a bow in the cloud."
              },
              {
                "reference": "Amos 3:6",
                "text": "Shall there be evil in a city, and the LORD hath not done it?"
              },
              {
                "reference": "Psalm 19:1",
                "text": "The heavens declare the glory of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that creation reveals God's existence and power."
              },
              {
                "level": "Explanation",
                "expectation": "Explains from Romans 1 what creation reveals (eternal power and divine nature) and what it cannot convey (the way of salvation)."
              },
              {
                "level": "Application",
                "expectation": "Shows how the creation testimony grounds universal accountability and makes evangelism genuinely urgent — people are not ignorant but suppressing known truth."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that sincere people in unreached cultures can be saved through creation's testimony alone, showing from Paul's argument why the proclamation of the gospel is irreplaceable and urgent."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.4",
        "domainTitle": "Sinai, the Tabernacle, and the Presence of God",
        "anchorScripture": {
          "reference": "Exodus 3:14",
          "text": "I AM THAT I AM… I AM hath sent me unto you."
        },
        "standards": [
          {
            "code": "OG.4.1.18",
            "title": "The I AM Declaration and Covenant Identity",
            "statement": "The student can expound Exodus 3:14 (\"I AM THAT I AM\") as God's definitive self-declaration — explaining what \"I AM\" means (eternal, self-existent, dependent on nothing outside himself), how this name grounds all covenant identity, and how Jesus's \"I AM\" declarations in John's Gospel constitute a direct claim to be this same God.",
            "scope": "The divine name YHWH (I AM / He who is) is the most significant name in the Old Testament. The student must understand that this name does not simply mean \"I exist\" in a generic sense — it means God's existence is entirely self-generated and eternal. He has no beginning and needs no cause. The New Testament's identification of Jesus with this name (John 8:58 — \"Before Abraham was, I AM\") is therefore a direct claim to divine identity, not merely to pre-existence. The audience's response (taking up stones) confirms they understood the claim perfectly.",
            "instructionalFocus": "Teach this passage as one of the most electrifying moments in Scripture. When Jesus says \"Before Abraham was, I AM\" — he is not offering a philosophical claim about duration. He is standing in the same burning bush. Help students feel the power of that moment.",
            "vocabulary": [
              "Theophany",
              "Shekinah",
              "Tabernacle",
              "Holy of Holies",
              "Type / Antitype",
              "Indwelling"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 3:14",
                "text": "I AM THAT I AM… I AM hath sent me unto you."
              },
              {
                "reference": "Exodus 19:5–6",
                "text": "A kingdom of priests, an holy nation."
              },
              {
                "reference": "Exodus 25:8",
                "text": "Let them make me a sanctuary; that I may dwell among them."
              },
              {
                "reference": "Exodus 40:34–35",
                "text": "A cloud covered the tent of the congregation, and the glory of the LORD filled the tabernacle."
              },
              {
                "reference": "Leviticus 16:2",
                "text": "The LORD said unto Moses, Speak unto Aaron thy brother, that he come not at all times into the holy place within the vail."
              },
              {
                "reference": "1 Kings 8:10–11",
                "text": "The cloud filled the house of the LORD… the glory of the LORD had filled the house."
              },
              {
                "reference": "Ezekiel 10:18–19",
                "text": "The glory of the LORD departed from off the threshold of the house."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt (tabernacled) among us, and we beheld his glory."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Quotes Exod. 3:14 and states it is God's self-declaration."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the meaning of \"I AM THAT I AM\" — the ground of divine aseity and covenant faithfulness."
              },
              {
                "level": "Application",
                "expectation": "Shows how Jesus's \"I AM\" statements in John (especially 8:58) constitute an explicit claim to be the God of Exodus 3:14; explains why the audience sought to stone him."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the JW claim that John 8:58 means Jesus existed before Abraham but not that he is YHWH, showing from the Greek ego eimi and the OT background that the claim is unambiguously divine self-identification."
              }
            ]
          },
          {
            "code": "OG.4.2.18",
            "title": "The Tabernacle as Type of Divine Indwelling",
            "statement": "The student can interpret the tabernacle as a theological type of God's purpose to dwell with humanity, tracing the antitype fulfillments in the incarnation (John 1:14), the gathered church (1 Cor. 3:16), and the individual believer (1 Cor. 6:19) — demonstrating that the goal of God's presence is not institutional but personal.",
            "scope": "The tabernacle is not merely ancient religious architecture — it is God's structured self-disclosure of his desire to dwell with his people. Exodus 25:8 states the purpose plainly: \"that I may dwell among them.\" The student must trace how this purpose is progressively fulfilled: first in the tabernacle, then in the temple, then supremely in Jesus (the Word tabernacled among us — John 1:14 uses the Greek word for tabernacle), and finally in the indwelt believer. This is the theological backbone of the new birth doctrine.",
            "instructionalFocus": "Help students see their own body as the ultimate fulfillment of the tabernacle. This is not metaphor — the Spirit of God actually resides in the believer. That should be astonishing, worship-producing theology.",
            "vocabulary": [
              "Theophany",
              "Shekinah",
              "Tabernacle",
              "Holy of Holies",
              "Type / Antitype",
              "Indwelling"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 3:14",
                "text": "I AM THAT I AM… I AM hath sent me unto you."
              },
              {
                "reference": "Exodus 19:5–6",
                "text": "A kingdom of priests, an holy nation."
              },
              {
                "reference": "Exodus 25:8",
                "text": "Let them make me a sanctuary; that I may dwell among them."
              },
              {
                "reference": "Exodus 40:34–35",
                "text": "A cloud covered the tent of the congregation, and the glory of the LORD filled the tabernacle."
              },
              {
                "reference": "Leviticus 16:2",
                "text": "The LORD said unto Moses, Speak unto Aaron thy brother, that he come not at all times into the holy place within the vail."
              },
              {
                "reference": "1 Kings 8:10–11",
                "text": "The cloud filled the house of the LORD… the glory of the LORD had filled the house."
              },
              {
                "reference": "Ezekiel 10:18–19",
                "text": "The glory of the LORD departed from off the threshold of the house."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt (tabernacled) among us, and we beheld his glory."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the tabernacle represents God's presence with his people."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the type-antitype relationship: tabernacle → incarnation → church → individual believer."
              },
              {
                "level": "Application",
                "expectation": "Expounds John 1:14 (using the tabernacle background) and 1 Corinthians 3:16 and 6:19 as the NT fulfillments of the tabernacle's theological purpose."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that physical temples are still required for divine presence, showing that the new covenant permanently relocated God's dwelling from buildings to people — and that this is the point of Acts 7:48 and John 4:21–24."
              }
            ]
          },
          {
            "code": "OG.4.3.18",
            "title": "The Departure and Return of God's Glory",
            "statement": "The student can trace the theological narrative of God's glory in the Old Testament — its arrival at the tabernacle and temple, its departure in Ezekiel's vision (Ezek. 8–11), its absence during the intertestamental period, and its return in the person of Jesus Christ — demonstrating the covenantal logic of divine presence and absence.",
            "scope": "Ezekiel 10 is one of the most devastating moments in the Old Testament: the glory of God lifts off the threshold of the temple and departs. This is not just a dramatic scene — it is God withdrawing covenant presence because the covenant has been violated. The student must understand the theological pattern: presence requires covenant faithfulness; violation produces absence; restoration comes through a new covenant. Jesus's coming is therefore the return of the glory (John 1:14; 2:19; Luke 2:32).",
            "instructionalFocus": "Teach this as a story of heartbreak and homecoming. The departure of the glory is tragic. But it makes the arrival of Jesus — the fullness of God in human form — even more magnificent. Help students feel the weight of both.",
            "vocabulary": [
              "Theophany",
              "Shekinah",
              "Tabernacle",
              "Holy of Holies",
              "Type / Antitype",
              "Indwelling"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 3:14",
                "text": "I AM THAT I AM… I AM hath sent me unto you."
              },
              {
                "reference": "Exodus 19:5–6",
                "text": "A kingdom of priests, an holy nation."
              },
              {
                "reference": "Exodus 25:8",
                "text": "Let them make me a sanctuary; that I may dwell among them."
              },
              {
                "reference": "Exodus 40:34–35",
                "text": "A cloud covered the tent of the congregation, and the glory of the LORD filled the tabernacle."
              },
              {
                "reference": "Leviticus 16:2",
                "text": "The LORD said unto Moses, Speak unto Aaron thy brother, that he come not at all times into the holy place within the vail."
              },
              {
                "reference": "1 Kings 8:10–11",
                "text": "The cloud filled the house of the LORD… the glory of the LORD had filled the house."
              },
              {
                "reference": "Ezekiel 10:18–19",
                "text": "The glory of the LORD departed from off the threshold of the house."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt (tabernacled) among us, and we beheld his glory."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that God's glory departed from the temple in Ezekiel."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the covenantal logic of departure — what caused it and what it meant for Israel."
              },
              {
                "level": "Application",
                "expectation": "Traces the narrative: tabernacle glory (Exod. 40) → temple glory (1 Kings 8) → departure (Ezek. 10) → return in Jesus (John 1:14; Luke 2:32; \"the glory of thy people Israel\")."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the intertestamental period proves God had abandoned Israel permanently, showing that the return of glory in Jesus is the covenantal answer to the departure — and that Haggai 2:9 promises \"the glory of this latter house shall be greater than of the former.\""
              }
            ]
          },
          {
            "code": "OG.4.4.18",
            "title": "The High Priestly Typology and Access to God",
            "statement": "The student can expound the high priestly system of Leviticus 16 (the Day of Atonement) as a type of Christ's atoning work, demonstrating how the barriers to God's presence (the veil, the prohibition, the annual sacrifice) are permanently resolved by the cross — and what this means for new covenant access to God.",
            "scope": "The Day of Atonement is the most solemn event in the Israelite religious calendar: once a year, the high priest alone could enter the Holy of Holies, and only with blood. Everything about this structure communicated one truth: sinful humanity cannot approach a holy God without mediation and atonement. The student must understand how Hebrews 9–10 interprets this type — Jesus is the true high priest who entered the true Holy of Holies with his own blood, once for all (Heb. 9:12), and his sacrifice tore the veil (Matt. 27:51), giving every believer direct access to God's presence.",
            "instructionalFocus": "The tearing of the veil at the moment of Jesus's death (Matt. 27:51) is one of the most important events in the entire Bible. God himself ripped the barrier. Teach students to receive the access Christ purchased with appropriate awe and gratitude.",
            "vocabulary": [
              "Theophany",
              "Shekinah",
              "Tabernacle",
              "Holy of Holies",
              "Type / Antitype",
              "Indwelling"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 3:14",
                "text": "I AM THAT I AM… I AM hath sent me unto you."
              },
              {
                "reference": "Exodus 19:5–6",
                "text": "A kingdom of priests, an holy nation."
              },
              {
                "reference": "Exodus 25:8",
                "text": "Let them make me a sanctuary; that I may dwell among them."
              },
              {
                "reference": "Exodus 40:34–35",
                "text": "A cloud covered the tent of the congregation, and the glory of the LORD filled the tabernacle."
              },
              {
                "reference": "Leviticus 16:2",
                "text": "The LORD said unto Moses, Speak unto Aaron thy brother, that he come not at all times into the holy place within the vail."
              },
              {
                "reference": "1 Kings 8:10–11",
                "text": "The cloud filled the house of the LORD… the glory of the LORD had filled the house."
              },
              {
                "reference": "Ezekiel 10:18–19",
                "text": "The glory of the LORD departed from off the threshold of the house."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt (tabernacled) among us, and we beheld his glory."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Knows the basic structure of the Day of Atonement and that it foreshadows Christ."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what the veil represented and what the annual sacrifice communicated about God's holiness and human sinfulness."
              },
              {
                "level": "Application",
                "expectation": "Shows from Hebrews 9–10 how Jesus fulfills the high priestly type — once-for-all atonement, permanent access, no further sacrifice needed."
              },
              {
                "level": "Defense",
                "expectation": "Responds to Roman Catholic claims that the Mass is a repetition of the sacrifice, showing from Hebrews 10:10–14 that the once-for-all nature of Christ's atonement precludes any repetition — and that this is the theological point the writer of Hebrews is making explicitly."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.5",
        "domainTitle": "The Names and Titles of God",
        "anchorScripture": {
          "reference": "Exodus 3:15",
          "text": "The LORD God of your fathers… this is my name for ever."
        },
        "standards": [
          {
            "code": "OG.5.1.18",
            "title": "YHWH — The Covenant Name and Its New Testament Application",
            "statement": "The student can explain the meaning and significance of the divine name YHWH, trace its use throughout the Old Testament as the exclusive personal name of Israel's God, and demonstrate from Philippians 2:9–11, Romans 10:13, and Acts 2:21 that the New Testament applies this name — and the salvation connected to it — directly to Jesus.",
            "scope": "The identification of Jesus with YHWH is one of the most important and frequently overlooked moves in New Testament theology. The student must be able to show that when Paul says Jesus has received \"the name which is above every name\" and \"every tongue shall confess that Jesus Christ is Lord,\" he is quoting Isaiah 45:23 — a YHWH text — and applying it to Jesus. Joel 2:32 (\"call on the name of the LORD\") is applied to Jesus in Acts 2:21 and Romans 10:13. This is not a metaphor; it is an identification.",
            "instructionalFocus": "This is one of the most powerful arguments for the deity of Christ from the OT. Walk students through it slowly. The OT-LXX-NT chain is not coincidence — it is the apostles' intentional identification of Jesus as YHWH in human form.",
            "vocabulary": [
              "YHWH (Yahweh)",
              "Adonai",
              "El / Elohim",
              "El Shaddai",
              "Kyrios",
              "Jesus / Yeshua"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 3:15",
                "text": "The LORD God of your fathers… this is my name for ever."
              },
              {
                "reference": "Isaiah 9:6",
                "text": "His name shall be called Wonderful, Counselor, The mighty God, The everlasting Father, The Prince of Peace."
              },
              {
                "reference": "Joel 2:32",
                "text": "Whosoever shall call on the name of the LORD shall be delivered."
              },
              {
                "reference": "Matthew 1:21",
                "text": "Thou shalt call his name JESUS: for he shall save his people from their sins."
              },
              {
                "reference": "John 17:6",
                "text": "I have manifested thy name unto the men which thou gavest me."
              },
              {
                "reference": "Acts 4:12",
                "text": "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved."
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God also hath highly exalted him, and given him a name which is above every name… that every tongue should confess that Jesus Christ is Lord."
              },
              {
                "reference": "Revelation 19:13",
                "text": "His name is called The Word of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that YHWH is God's personal covenant name and is applied to Jesus."
              },
              {
                "level": "Explanation",
                "expectation": "Shows the YHWH-to-Kyrios-to-Jesus chain: YHWH in the OT → Kyrios in the LXX → Kyrios = Jesus in the NT."
              },
              {
                "level": "Application",
                "expectation": "Expounds Phil. 2:9–11 against its Isa. 45:23 background; shows Joel 2:32 applied to Jesus in Acts 2:21 and Rom. 10:13 as a deliberate YHWH-Jesus identification."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that \"Lord\" applied to Jesus is merely a title of honor (like English \"sir\"), showing from the OT background of the key NT texts that Kyrios carries the full weight of the divine name YHWH."
              }
            ]
          },
          {
            "code": "OG.5.2.18",
            "title": "Isaiah 9:6 — The Names of the Messiah",
            "statement": "The student can expound Isaiah 9:6 and demonstrate that the names given to the Messiah — \"Mighty God\" and \"Everlasting Father\" — are not honorary titles but genuine divine names, and that their application to Jesus confirms the Oneness understanding of Christ's identity rather than suggesting a second and third member of a trinity.",
            "scope": "\"Mighty God\" (El Gibbor) appears in Isaiah 10:21 as a name for YHWH himself — showing that it is not a lesser title. \"Everlasting Father\" (Abi-Ad) means the Father of Eternity — a title that, in the Oneness understanding, applies to Jesus as the one who is the Father incarnate (John 14:9; Revelation 21:6–7). The student must also note that the trinitarian interpretation creates a problem: why would Isaiah name the Messiah \"Everlasting Father\" if the Father is a separate person from the Son?",
            "instructionalFocus": "This is a passage students often know but have not fully exploited. Teach them to use it not just as a proof text but as an argument structure: if Isaiah names the Messiah \"Everlasting Father,\" what does that require us to conclude about who Jesus is?",
            "vocabulary": [
              "YHWH (Yahweh)",
              "Adonai",
              "El / Elohim",
              "El Shaddai",
              "Kyrios",
              "Jesus / Yeshua"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 3:15",
                "text": "The LORD God of your fathers… this is my name for ever."
              },
              {
                "reference": "Isaiah 9:6",
                "text": "His name shall be called Wonderful, Counselor, The mighty God, The everlasting Father, The Prince of Peace."
              },
              {
                "reference": "Joel 2:32",
                "text": "Whosoever shall call on the name of the LORD shall be delivered."
              },
              {
                "reference": "Matthew 1:21",
                "text": "Thou shalt call his name JESUS: for he shall save his people from their sins."
              },
              {
                "reference": "John 17:6",
                "text": "I have manifested thy name unto the men which thou gavest me."
              },
              {
                "reference": "Acts 4:12",
                "text": "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved."
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God also hath highly exalted him, and given him a name which is above every name… that every tongue should confess that Jesus Christ is Lord."
              },
              {
                "reference": "Revelation 19:13",
                "text": "His name is called The Word of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Quotes Isaiah 9:6 and identifies the divine names."
              },
              {
                "level": "Explanation",
                "expectation": "Shows that \"Mighty God\" is used for YHWH in Isa. 10:21 and that \"Everlasting Father\" is not the name of a separate person but describes the Messiah's own eternal paternal character."
              },
              {
                "level": "Application",
                "expectation": "Connects the Isaiah 9:6 titles to NT texts: \"Mighty God\" → Titus 2:13 (the great God); \"Everlasting Father\" → John 14:9 (\"He that hath seen me hath seen the Father\") and Rev. 21:6–7 (Jesus as \"Father\" to overcomers)."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian claim that \"Everlasting Father\" is a title of honor (meaning \"father of eternity\" in a timeless abstract sense), showing why the Oneness reading — Jesus is the Father in incarnation — is more consistent with John 14 and the broader NT revelation."
              }
            ]
          },
          {
            "code": "OG.5.3.18",
            "title": "The Name of Jesus as the Fulfillment of All Divine Names",
            "statement": "The student can articulate why the name \"Jesus\" is theologically the fullest revelation of the divine name — because it encodes the covenant name YHWH (\"YHWH saves\") and the redemptive mission in one — and can show from Matthew 1:21, John 17:6, Acts 4:12, and Philippians 2:9 why this name holds supreme doctrinal and salvific significance in the apostolic covenant.",
            "scope": "The name Jesus (Yeshua in Hebrew, Iesous in Greek) is not a generic personal name — it is a theological statement. \"He shall save his people from their sins\" (Matt. 1:21) interprets the name as both identity and mission. John 17:6 says Jesus manifested the Father's name — the name Jesus is the disclosed, incarnate form of the Father's name. Acts 4:12 makes salvation exclusively dependent on this name. Philippians 2:9 says it is the name above every name. The student must be able to synthesize these texts into a coherent theology of the divine name.",
            "instructionalFocus": "Students need to feel the weight of this name. It is not a word — it is a revelation. Help them understand that when they baptize in the name of Jesus, when they pray in the name of Jesus, they are invoking the fullness of the divine identity that this name discloses.",
            "vocabulary": [
              "YHWH (Yahweh)",
              "Adonai",
              "El / Elohim",
              "El Shaddai",
              "Kyrios",
              "Jesus / Yeshua"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 3:15",
                "text": "The LORD God of your fathers… this is my name for ever."
              },
              {
                "reference": "Isaiah 9:6",
                "text": "His name shall be called Wonderful, Counselor, The mighty God, The everlasting Father, The Prince of Peace."
              },
              {
                "reference": "Joel 2:32",
                "text": "Whosoever shall call on the name of the LORD shall be delivered."
              },
              {
                "reference": "Matthew 1:21",
                "text": "Thou shalt call his name JESUS: for he shall save his people from their sins."
              },
              {
                "reference": "John 17:6",
                "text": "I have manifested thy name unto the men which thou gavest me."
              },
              {
                "reference": "Acts 4:12",
                "text": "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved."
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God also hath highly exalted him, and given him a name which is above every name… that every tongue should confess that Jesus Christ is Lord."
              },
              {
                "reference": "Revelation 19:13",
                "text": "His name is called The Word of God."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the name Jesus means \"YHWH saves\" and is the supreme divine name."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the etymological and theological components: Yeshua = YHWH + saves; shows why this is not coincidence but divine intentionality."
              },
              {
                "level": "Application",
                "expectation": "Synthesizes Matt. 1:21, John 17:6, Acts 4:12, and Phil. 2:9 into a coherent argument: the name Jesus is the new covenant revelation of the divine name, given for salvation, above all others."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that salvation can be obtained through any sincere approach to God without specific invocation of Jesus's name, showing from Acts 4:12 and Acts 2:38 that the apostolic gospel is name-specific — not as magic formula but as covenantal identity claim."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.6",
        "domainTitle": "Progressive Revelation and the Prophetic Line",
        "anchorScripture": {
          "reference": "Hebrews 1:1–2",
          "text": "God… spake in time past unto the fathers by the prophets, hath in these last days spoken unto us by his Son."
        },
        "standards": [
          {
            "code": "OG.6.1.18",
            "title": "The Structure of Progressive Revelation",
            "statement": "The student can explain what progressive revelation means, demonstrate it from Hebrews 1:1–2, and show how it accounts for both the genuine authority of Old Testament revelation and the incompleteness that required a final, definitive word in Jesus Christ.",
            "scope": "Progressive revelation does not mean earlier Scripture is wrong or inferior — it means it is partial and preparatory. The student must be able to explain why God revealed himself incrementally (the redemptive-historical narrative requires it) and why Jesus is the terminus rather than one more installment. Hebrews is the primary text: God spoke \"in many portions and many ways\" (polumeros kai polutropos) — the word for \"portions\" implies that no single prior revelation was complete in itself.",
            "instructionalFocus": "Help students see the Bible as a single unfolding story rather than two disconnected books. The OT is not a foreword to be discarded — it is the necessary context without which Jesus cannot be properly understood.",
            "vocabulary": [
              "Progressive revelation",
              "Typology",
              "Prophetic fulfillment",
              "Inaugurated eschatology",
              "Sensus plenior",
              "Canon"
            ],
            "anchorScriptures": [
              {
                "reference": "Hebrews 1:1–2",
                "text": "God… spake in time past unto the fathers by the prophets, hath in these last days spoken unto us by his Son."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy."
              },
              {
                "reference": "Isaiah 53:1–12",
                "text": "He is despised and rejected of men; a man of sorrows, and acquainted with grief."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant with the house of Israel… I will put my law in their inward parts."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new heart also will I give you, and a new spirit will I put within you."
              },
              {
                "reference": "Micah 5:2",
                "text": "Out of thee shall he come forth… whose goings forth have been from of old, from everlasting."
              },
              {
                "reference": "Malachi 3:1",
                "text": "The Lord, whom ye seek, shall suddenly come to his temple."
              },
              {
                "reference": "2 Corinthians 1:20",
                "text": "All the promises of God in him are yea, and in him Amen."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States the basic meaning of progressive revelation."
              },
              {
                "level": "Explanation",
                "expectation": "Expounds Heb. 1:1–2, explaining the contrast between prophetic revelation and Son-revelation; defines what \"in these last days\" signals."
              },
              {
                "level": "Application",
                "expectation": "Traces two examples of progressive revelation — e.g., the covenant promises (Abraham → Moses → David → Jesus) and the sacrifice system (animal atonement → Christ's once-for-all atonement)."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the Old Testament reveals a different God than the New Testament — showing that the same God is speaking in both, progressively unfolding the same redemptive plan."
              }
            ]
          },
          {
            "code": "OG.6.2.18",
            "title": "Isaiah 53 as Evangelistic Centerpiece",
            "statement": "The student can expound Isaiah 53:1–12 as the fullest OT portrait of the atoning work of the Messiah — showing how the servant's suffering, substitution, and vindication point directly to Jesus — and can use this passage as an evangelistic bridge with Jewish, Muslim, and secular interlocutors.",
            "scope": "Isaiah 53 is the apostolic church's primary OT evangelistic text. Philip used it with the Ethiopian eunuch (Acts 8:32–35); Paul built his resurrection argument on the servant's suffering and vindication. The student must be able to walk through the chapter verse by verse and show: (1) substitutionary atonement — \"he bore our griefs,\" \"he was wounded for our transgressions\"; (2) vicarious suffering — \"the LORD hath laid on him the iniquity of us all\"; (3) silent submission — \"he opened not his mouth\"; (4) death and burial; (5) vindication — \"he shall see his seed, he shall prolong his days.\" This is the full gospel narrative in one OT chapter.",
            "instructionalFocus": "Every disciple should be able to lead someone through Isaiah 53. This is not academic theology — this is evangelism. Help students feel the beauty and power of this chapter so that teaching it becomes a natural part of their witness.",
            "vocabulary": [
              "Progressive revelation",
              "Typology",
              "Prophetic fulfillment",
              "Inaugurated eschatology",
              "Sensus plenior",
              "Canon"
            ],
            "anchorScriptures": [
              {
                "reference": "Hebrews 1:1–2",
                "text": "God… spake in time past unto the fathers by the prophets, hath in these last days spoken unto us by his Son."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy."
              },
              {
                "reference": "Isaiah 53:1–12",
                "text": "He is despised and rejected of men; a man of sorrows, and acquainted with grief."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant with the house of Israel… I will put my law in their inward parts."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new heart also will I give you, and a new spirit will I put within you."
              },
              {
                "reference": "Micah 5:2",
                "text": "Out of thee shall he come forth… whose goings forth have been from of old, from everlasting."
              },
              {
                "reference": "Malachi 3:1",
                "text": "The Lord, whom ye seek, shall suddenly come to his temple."
              },
              {
                "reference": "2 Corinthians 1:20",
                "text": "All the promises of God in him are yea, and in him Amen."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Identifies Isaiah 53 as a prophecy about the suffering Messiah."
              },
              {
                "level": "Explanation",
                "expectation": "Walks through the chapter systematically, identifying the key substitutionary and vicarious elements."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates how to use Isaiah 53 evangelistically — particularly with Jewish interlocutors who are open to OT prophecy, or Muslim interlocutors who respect the Hebrew prophets."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the Jewish objection that Isaiah 53 refers to Israel as a corporate servant — showing from the grammar, the context, and the NT citations why a personal messianic interpretation is superior."
              }
            ]
          },
          {
            "code": "OG.6.3.18",
            "title": "Joel 2:28–29 and the Age of the Spirit",
            "statement": "The student can expound Joel 2:28–29 as the prophecy of a new revelatory and salvific age — inaugurated at Pentecost (Acts 2:16–18) — in which the Spirit is poured out universally, transcending the gender, age, and social barriers of the old covenant's prophetic limitations.",
            "scope": "Peter's citation of Joel 2 in Acts 2:16 is one of the most important interpretive moves in the New Testament: he declares that what is happening at Pentecost is the fulfillment of Joel's promise. The student must understand what this means: the age of the Spirit has arrived; the Spirit is no longer restricted to prophets, priests, and kings but poured out on \"all flesh\" — sons and daughters, young and old, servants and handmaidens. This is the new covenant democratization of the Spirit, the basis for the universal urgency of the new birth message.",
            "instructionalFocus": "This standard is directly connected to the urgency of the new birth message. If Joel's age of the Spirit has arrived and is for \"all flesh,\" then the appeal to receive the Spirit is not a denominational preference — it is a covenantal imperative for every person.",
            "vocabulary": [
              "Progressive revelation",
              "Typology",
              "Prophetic fulfillment",
              "Inaugurated eschatology",
              "Sensus plenior",
              "Canon"
            ],
            "anchorScriptures": [
              {
                "reference": "Hebrews 1:1–2",
                "text": "God… spake in time past unto the fathers by the prophets, hath in these last days spoken unto us by his Son."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy."
              },
              {
                "reference": "Isaiah 53:1–12",
                "text": "He is despised and rejected of men; a man of sorrows, and acquainted with grief."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant with the house of Israel… I will put my law in their inward parts."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new heart also will I give you, and a new spirit will I put within you."
              },
              {
                "reference": "Micah 5:2",
                "text": "Out of thee shall he come forth… whose goings forth have been from of old, from everlasting."
              },
              {
                "reference": "Malachi 3:1",
                "text": "The Lord, whom ye seek, shall suddenly come to his temple."
              },
              {
                "reference": "2 Corinthians 1:20",
                "text": "All the promises of God in him are yea, and in him Amen."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Quotes Joel 2:28–29 and states it is fulfilled at Pentecost."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the contrast between Spirit distribution in the OT (selective, functional) and the new covenant (universal, salvific); shows what \"all flesh\" means in context."
              },
              {
                "level": "Application",
                "expectation": "Expounds Acts 2:16–18 as Peter's interpretive declaration — not an analogy (\"this is like that\") but a fulfillment (\"this is that which was spoken by the prophet Joel\")."
              },
              {
                "level": "Defense",
                "expectation": "Responds to cessationist claims that the Spirit's outpouring described in Joel was limited to the apostolic generation, showing from the text (\"in the last days\") and the ongoing apostolic pattern (Acts 10, 19) that the promise continues until the end of the age."
              }
            ]
          },
          {
            "code": "OG.6.4.18",
            "title": "Jeremiah 31 and Ezekiel 36 — The New Covenant Promise",
            "statement": "The student can expound Jeremiah 31:31–34 and Ezekiel 36:26–27 as the definitive OT promises of the new covenant — identifying its four components (internalized law, universal knowledge of God, complete forgiveness, Spirit indwelling) and demonstrating how Acts 2:38 is the apostolic announcement of its inauguration.",
            "scope": "The new covenant promises of Jeremiah and Ezekiel are the theological foundation of the new birth doctrine. The student must be able to show: (1) Jer. 31 — law written on hearts, not stone (internalization); universal direct knowledge of God (not just through a priestly caste); total forgiveness. (2) Ezek. 36 — a new heart (regeneration); the Spirit placed within (indwelling); empowerment for obedience. These are not vague spiritual aspirations — they are specific promises that Acts 2:38 (repentance, baptism, Spirit reception) announces as now accessible.",
            "instructionalFocus": "Teach this as the OT foundation of the new birth. When students understand that Jeremiah and Ezekiel promised what Acts 2:38 delivers, they will be able to explain the new birth not as a Pentecostal innovation but as the fulfillment of the oldest covenant promises.",
            "vocabulary": [
              "Progressive revelation",
              "Typology",
              "Prophetic fulfillment",
              "Inaugurated eschatology",
              "Sensus plenior",
              "Canon"
            ],
            "anchorScriptures": [
              {
                "reference": "Hebrews 1:1–2",
                "text": "God… spake in time past unto the fathers by the prophets, hath in these last days spoken unto us by his Son."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy."
              },
              {
                "reference": "Isaiah 53:1–12",
                "text": "He is despised and rejected of men; a man of sorrows, and acquainted with grief."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant with the house of Israel… I will put my law in their inward parts."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new heart also will I give you, and a new spirit will I put within you."
              },
              {
                "reference": "Micah 5:2",
                "text": "Out of thee shall he come forth… whose goings forth have been from of old, from everlasting."
              },
              {
                "reference": "Malachi 3:1",
                "text": "The Lord, whom ye seek, shall suddenly come to his temple."
              },
              {
                "reference": "2 Corinthians 1:20",
                "text": "All the promises of God in him are yea, and in him Amen."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Identifies Jer. 31 and Ezek. 36 as new covenant prophecies."
              },
              {
                "level": "Explanation",
                "expectation": "Lists the components of the new covenant promise from each passage; explains what internalized law and Spirit indwelling mean."
              },
              {
                "level": "Application",
                "expectation": "Connects the new covenant components to the new birth: repentance (new heart, turning from sin) → baptism (forgiveness, covenant entry) → Spirit reception (indwelling, Ezek. 36:27) — showing Acts 2:38 as the new covenant application form."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that Jeremiah's new covenant is about Israel's national restoration, not individual salvation — showing from Hebrews 8:6–13 that the writer applies Jeremiah 31 directly to the church and to the believer's individual experience of forgiveness and Spirit-indwelling."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.7",
        "domainTitle": "Jesus Christ as the Full Revelation of God",
        "anchorScripture": {
          "reference": "Colossians 2:9",
          "text": "For in him dwelleth all the fulness of the Godhead bodily."
        },
        "standards": [
          {
            "code": "OG.7.1.18",
            "title": "Colossians 2:9 — All the Fullness of the Godhead Bodily",
            "statement": "The student can expound Colossians 2:9 as the definitive statement of Christ's complete deity — explaining the theological force of \"all,\" \"fullness,\" \"Godhead\" (theotes), and \"bodily\" — and can show how the context of Colossians 1–2 builds to this declaration.",
            "scope": "Colossians 2:9 is the doctrinal summit of the Oneness understanding of Christ's identity. Every word matters: (1) \"all\" — not partial or proportional; (2) \"fullness\" (pleroma) — the complete totality; (3) \"Godhead\" (theotes) — the divine nature itself, not merely divine qualities; (4) \"bodily\" — in the permanent physical form of Jesus, not as a temporary spiritual influence. The context (Col. 1:15–2:10) lists fifteen descriptions of Christ's divine identity before arriving at 2:9 as its culminating statement.",
            "instructionalFocus": "Teach this verse in its context — never rip it out. The fifteen descriptions in Colossians 1–2 are not isolated bullet points; they are a building argument. When students see what Paul is constructing, the force of verse 9 becomes overwhelming.",
            "vocabulary": [
              "Theotes",
              "Bodily (somatikos)",
              "Manifest in the flesh",
              "Full deity",
              "Express image (charakter)",
              "Reconciliation"
            ],
            "anchorScriptures": [
              {
                "reference": "Colossians 2:9",
                "text": "For in him dwelleth all the fulness of the Godhead bodily."
              },
              {
                "reference": "Colossians 1:19",
                "text": "For it pleased the Father that in him should all fulness dwell."
              },
              {
                "reference": "1 Timothy 3:16",
                "text": "God was manifest in the flesh, justified in the Spirit, seen of angels, preached unto the Gentiles."
              },
              {
                "reference": "2 Corinthians 5:19",
                "text": "God was in Christ, reconciling the world unto himself."
              },
              {
                "reference": "John 14:9",
                "text": "He that hath seen me hath seen the Father."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Hebrews 1:3",
                "text": "Who being the brightness of his glory, and the express image of his person."
              },
              {
                "reference": "Isaiah 9:6",
                "text": "His name shall be called… The mighty God, The everlasting Father."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Quotes Col. 2:9 and states Jesus is fully divine."
              },
              {
                "level": "Explanation",
                "expectation": "Defines each key term: all, fullness, theotes, bodily; distinguishes theotes from theiotes (divine quality vs. the Deity itself)."
              },
              {
                "level": "Application",
                "expectation": "Walks through the fifteen descriptions of Christ in Col. 1:15–2:10 leading to 2:9, showing the cumulative argument for full deity."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the Jehovah's Witness and Trinitarian use of this verse — JWs minimize it (\"only a human representation\"), Trinitarians use it for only the Son — showing the Oneness reading (all of God in the one man Jesus) is the most natural and contextually supported."
              }
            ]
          },
          {
            "code": "OG.7.2.18",
            "title": "1 Timothy 3:16 — God Manifest in the Flesh",
            "statement": "The student can expound 1 Timothy 3:16 as Paul's concise statement of the incarnation mystery, demonstrating that \"God was manifest in the flesh\" means God himself — not a divine representative or second person — took on human flesh, and can relate this to the six-line confession that follows.",
            "scope": "1 Timothy 3:16 is structured as an early Christian hymn or confession. The subject is God (the strongest manuscript reading has \"He who\" but the context — \"the mystery of godliness\" in verse 15 which is God — makes God the subject). The six phrases trace the arc of the incarnation: manifest in flesh → justified in Spirit → seen of angels → preached among Gentiles → believed on in the world → received up in glory. Each phrase corresponds to an event in Jesus's life. The student must be able to match the phrases to the events and explain why the subject must be God himself.",
            "instructionalFocus": "This verse is a confession, a creed, a doxology. Teach it that way. Help students feel the weight of confessing \"God was manifest in the flesh\" — this is not theological data to be processed, it is a declaration of worship.",
            "vocabulary": [
              "Theotes",
              "Bodily (somatikos)",
              "Manifest in the flesh",
              "Full deity",
              "Express image (charakter)",
              "Reconciliation"
            ],
            "anchorScriptures": [
              {
                "reference": "Colossians 2:9",
                "text": "For in him dwelleth all the fulness of the Godhead bodily."
              },
              {
                "reference": "Colossians 1:19",
                "text": "For it pleased the Father that in him should all fulness dwell."
              },
              {
                "reference": "1 Timothy 3:16",
                "text": "God was manifest in the flesh, justified in the Spirit, seen of angels, preached unto the Gentiles."
              },
              {
                "reference": "2 Corinthians 5:19",
                "text": "God was in Christ, reconciling the world unto himself."
              },
              {
                "reference": "John 14:9",
                "text": "He that hath seen me hath seen the Father."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Hebrews 1:3",
                "text": "Who being the brightness of his glory, and the express image of his person."
              },
              {
                "reference": "Isaiah 9:6",
                "text": "His name shall be called… The mighty God, The everlasting Father."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Quotes 1 Tim. 3:16 and identifies the subject as God."
              },
              {
                "level": "Explanation",
                "expectation": "Matches each of the six phrases to corresponding events in Jesus's life; explains the textual issue (\"God\" vs. \"He who\") and why the context requires God as subject."
              },
              {
                "level": "Application",
                "expectation": "Shows how \"God was manifest in the flesh\" reinforces Col. 2:9 and John 1:14 — God's personal, direct incarnation without intermediary."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the reading \"He who was manifest in the flesh\" (adopted by many modern versions), showing that even if the textual variant is accepted, the context requires God as the subject — and that the mystery is precisely God's self-incarnation."
              }
            ]
          },
          {
            "code": "OG.7.3.18",
            "title": "John 14:9–11 — \"He That Hath Seen Me Hath Seen the Father\"",
            "statement": "The student can expound John 14:9–11 as Jesus's own definitive response to the request to see the Father — demonstrating that Jesus is not pointing to someone else or offering a secondary representation, but declaring that he himself is the personal disclosure of the Father.",
            "scope": "Philip's request — \"Lord, shew us the Father, and it sufficeth us\" (John 14:8) — is natural and understandable. Jesus's response is one of the most stunning declarations in the Gospels: \"Have I been so long time with you, and yet hast thou not known me, Philip? he that hath seen me hath seen the Father.\" This is not a metaphor. Jesus is not saying \"I look like the Father\" or \"I represent the Father well.\" He is saying that seeing him is the equivalent of seeing the Father — because the Father dwells in him and does the works through him (v.10). The student must be able to articulate this precision.",
            "instructionalFocus": "Help students sit with Philip's frustration for a moment — he wanted to see God, and here was Jesus, a man. Then help them feel the stunning reversal: the man standing in front of Philip was the answer to his request. To see Jesus is to see God. This is worship territory.",
            "vocabulary": [
              "Theotes",
              "Bodily (somatikos)",
              "Manifest in the flesh",
              "Full deity",
              "Express image (charakter)",
              "Reconciliation"
            ],
            "anchorScriptures": [
              {
                "reference": "Colossians 2:9",
                "text": "For in him dwelleth all the fulness of the Godhead bodily."
              },
              {
                "reference": "Colossians 1:19",
                "text": "For it pleased the Father that in him should all fulness dwell."
              },
              {
                "reference": "1 Timothy 3:16",
                "text": "God was manifest in the flesh, justified in the Spirit, seen of angels, preached unto the Gentiles."
              },
              {
                "reference": "2 Corinthians 5:19",
                "text": "God was in Christ, reconciling the world unto himself."
              },
              {
                "reference": "John 14:9",
                "text": "He that hath seen me hath seen the Father."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Hebrews 1:3",
                "text": "Who being the brightness of his glory, and the express image of his person."
              },
              {
                "reference": "Isaiah 9:6",
                "text": "His name shall be called… The mighty God, The everlasting Father."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Quotes John 14:9 and states Jesus identifies himself with the Father."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the context: Philip's request, Jesus's response, the grounding in verse 10 (Father dwelling in Jesus, doing the works)."
              },
              {
                "level": "Application",
                "expectation": "Shows how John 14:9–11 explains why no human has ever seen the Father as a separate divine person — because the Father is seen in and through Jesus, who is the bodily disclosure of the Father."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian reading that Jesus is a different person from the Father who merely represents him well — showing from verse 11 (\"the Father that dwelleth in me, he doeth the works\") that the Father is not a separate being directing Jesus from outside; the Father is the divine nature working through the human vehicle of the incarnation."
              }
            ]
          },
          {
            "code": "OG.7.4.18",
            "title": "The Fifteen Descriptions of Christ in Colossians 1:15–2:10",
            "statement": "The student can walk through the fifteen descriptions of Christ in Colossians 1:15–2:10 as a cumulative argument for full deity, demonstrating that Paul is building a sustained case for the conclusion of Colossians 2:9 — and can use this passage as an integrated theological unit.",
            "scope": "The fifteen descriptions (image of the invisible God; firstborn of all creation; creator of all things; before all things; by him all things consist; head of the church; firstborn from the dead; all fullness dwelling in him; reconciler of all things; all treasures of wisdom in him; head of all principality and power; complete in him, etc.) are not a random list of titles — they are a systematic presentation of Christ's divine identity organized around creation, redemption, and authority. The student who can walk through this passage has one of the most powerful Christological arguments in Scripture at their fingertips.",
            "instructionalFocus": "Teach this as a unit, not a verse list. Consider having students create a visual map of the fifteen descriptions — clustered by theme — so they can see the architecture of Paul's argument before they learn to use it in discussion.",
            "vocabulary": [
              "Theotes",
              "Bodily (somatikos)",
              "Manifest in the flesh",
              "Full deity",
              "Express image (charakter)",
              "Reconciliation"
            ],
            "anchorScriptures": [
              {
                "reference": "Colossians 2:9",
                "text": "For in him dwelleth all the fulness of the Godhead bodily."
              },
              {
                "reference": "Colossians 1:19",
                "text": "For it pleased the Father that in him should all fulness dwell."
              },
              {
                "reference": "1 Timothy 3:16",
                "text": "God was manifest in the flesh, justified in the Spirit, seen of angels, preached unto the Gentiles."
              },
              {
                "reference": "2 Corinthians 5:19",
                "text": "God was in Christ, reconciling the world unto himself."
              },
              {
                "reference": "John 14:9",
                "text": "He that hath seen me hath seen the Father."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Hebrews 1:3",
                "text": "Who being the brightness of his glory, and the express image of his person."
              },
              {
                "reference": "Isaiah 9:6",
                "text": "His name shall be called… The mighty God, The everlasting Father."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Identifies Col. 1:15–2:10 as a sustained Christological argument."
              },
              {
                "level": "Explanation",
                "expectation": "Names at least ten of the fifteen descriptions and explains their theological significance."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates how the fifteen descriptions culminate in Col. 2:9 — all of them are reasons why the fullness of the Godhead dwells bodily in Jesus."
              },
              {
                "level": "Defense",
                "expectation": "Uses the Col. 1:15–2:10 passage as a sustained response to the claim that Jesus is a secondary divine being — showing that every category (creation, redemption, authority, divine indwelling) is filled completely by Jesus alone."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.8",
        "domainTitle": "Incarnation, Sonship, and the True Humanity of Christ",
        "anchorScripture": {
          "reference": "Luke 1:35",
          "text": "The Holy Ghost shall come upon thee… therefore also that holy thing which shall be born of thee shall be called the Son of God."
        },
        "standards": [
          {
            "code": "OG.8.1.18",
            "title": "The Incarnational Origin of the Son",
            "statement": "The student can demonstrate from Luke 1:35, Galatians 4:4, and Hebrews 1:5 that the title \"Son of God\" originates in the incarnation — the miraculous conception by the Holy Spirit in the womb of Mary — and is not an eternal pre-incarnation relationship within the Godhead.",
            "scope": "This standard addresses the most fundamental difference between Oneness and trinitarian Christology regarding the Son. The trinitarian doctrine of eternal generation holds that the Son eternally proceeds from the Father — the Son has always been the Son. Oneness theology holds that \"Son\" is an incarnational title: the Son came into being when God was \"made of a woman\" (Gal. 4:4). Luke 1:35 is the defining text: \"therefore also that holy thing which shall be born of thee shall be called the Son of God\" — the \"therefore\" grounds the title in the virgin birth, not in an eternal divine relationship.",
            "instructionalFocus": "This standard requires patience and clarity. Teach students to distinguish what \"eternal\" refers to — the divine nature of Christ is eternal (the Word has always existed); the sonship is incarnational (the Son came into being in time). These two truths held together resolve most of the apparent tensions in the Gospel of John.",
            "vocabulary": [
              "Incarnation",
              "Son of God (incarnational meaning)",
              "Word (Logos)",
              "Kenosis",
              "Dual nature",
              "Eternal generation"
            ],
            "anchorScriptures": [
              {
                "reference": "Luke 1:35",
                "text": "The Holy Ghost shall come upon thee… therefore also that holy thing which shall be born of thee shall be called the Son of God."
              },
              {
                "reference": "Galatians 4:4",
                "text": "God sent forth his Son, made of a woman, made under the law."
              },
              {
                "reference": "Hebrews 1:5",
                "text": "Thou art my Son, this day have I begotten thee."
              },
              {
                "reference": "Hebrews 2:14",
                "text": "As the children are partakers of flesh and blood, he also himself likewise took part of the same."
              },
              {
                "reference": "Hebrews 2:17",
                "text": "He had to be made like his brothers in every way… to make atonement for the sins of the people."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt among us."
              },
              {
                "reference": "Philippians 2:6–8",
                "text": "Being in the form of God… he made himself of no reputation, and took upon him the form of a servant."
              },
              {
                "reference": "Romans 8:3",
                "text": "God sending his own Son in the likeness of sinful flesh, and for sin, condemned sin in the flesh."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that \"Son of God\" refers to the incarnate Jesus, not an eternal second person."
              },
              {
                "level": "Explanation",
                "expectation": "Expounds Luke 1:35 — the angel explains why Jesus will be called Son of God: because of the virgin conception by the Holy Spirit."
              },
              {
                "level": "Application",
                "expectation": "Shows from Gal. 4:4 (\"made of a woman\") and Heb. 1:5 (\"this day have I begotten thee\") that sonship has a beginning — it is incarnational, not eternal."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian claim that \"only begotten Son\" (John 3:16; 1:18) implies eternal generation, showing that monogenes means \"unique\" or \"one-of-a-kind\" rather than \"eternally generated\" — and that the begetting in Hebrews 1:5 is grounded in Psalm 2:7, a royal coronation text about a specific historical event, not an eternal intra-divine relationship."
              }
            ]
          },
          {
            "code": "OG.8.2.18",
            "title": "The Word and the Son — Two Dimensions of One Person",
            "statement": "The student can articulate the distinction between the eternal Word (John 1:1 — \"in the beginning was the Word\") and the incarnational Son (John 1:14 — \"the Word was made flesh\") as two dimensions of the one person Jesus Christ — showing that this distinction does not imply two persons but explains the dual nature of the incarnate God.",
            "scope": "John 1 provides the clearest framework for Oneness Christology. The Word is eternal and divine — \"in the beginning was the Word, and the Word was with God, and the Word was God.\" The Word becomes flesh — \"the Word was made flesh.\" The flesh is the Son; the Word is the divine Spirit. Jesus is therefore both eternal (as the Word) and incarnational (as the Son). The student must be able to navigate this without creating either two persons (the Word-Son as a separate divine being) or one confusing hybrid (neither fully God nor fully human).",
            "instructionalFocus": "This is one of the most technically demanding standards. Take time to build the framework carefully before testing students' ability to apply it. Use simple diagrams: eternal Word → incarnation → the Son. Then show how this one framework resolves the \"difficult sayings of Jesus.\"",
            "vocabulary": [
              "Incarnation",
              "Son of God (incarnational meaning)",
              "Word (Logos)",
              "Kenosis",
              "Dual nature",
              "Eternal generation"
            ],
            "anchorScriptures": [
              {
                "reference": "Luke 1:35",
                "text": "The Holy Ghost shall come upon thee… therefore also that holy thing which shall be born of thee shall be called the Son of God."
              },
              {
                "reference": "Galatians 4:4",
                "text": "God sent forth his Son, made of a woman, made under the law."
              },
              {
                "reference": "Hebrews 1:5",
                "text": "Thou art my Son, this day have I begotten thee."
              },
              {
                "reference": "Hebrews 2:14",
                "text": "As the children are partakers of flesh and blood, he also himself likewise took part of the same."
              },
              {
                "reference": "Hebrews 2:17",
                "text": "He had to be made like his brothers in every way… to make atonement for the sins of the people."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt among us."
              },
              {
                "reference": "Philippians 2:6–8",
                "text": "Being in the form of God… he made himself of no reputation, and took upon him the form of a servant."
              },
              {
                "reference": "Romans 8:3",
                "text": "God sending his own Son in the likeness of sinful flesh, and for sin, condemned sin in the flesh."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the Word is eternal and the Son is the incarnate form of the Word."
              },
              {
                "level": "Explanation",
                "expectation": "Distinguishes the Word (divine, eternal, John 1:1) from the Son (human, incarnational, John 1:14) while insisting on one person."
              },
              {
                "level": "Application",
                "expectation": "Uses the Word-Son framework to interpret apparently contradictory sayings of Jesus: \"the Father is greater than I\" (human dimension speaking) vs. \"I and my Father are one\" (divine dimension declared)."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian claim that John 1:1–2 (\"the Word was with God\") proves two distinct divine persons — showing that the \"with\" is the eternal self-expression of God in relation to his own being, not a separate person in spatial proximity."
              }
            ]
          },
          {
            "code": "OG.8.3.18",
            "title": "The Necessity of Christ's True Humanity",
            "statement": "The student can demonstrate from Hebrews 2:14–18 and Romans 8:3 that Jesus's genuine humanity — including real flesh, blood, temptation, suffering, and death — was not incidental to redemption but necessary to it, and can articulate why a docetic or partially human Christ cannot save.",
            "scope": "Docetism (the belief that Jesus only appeared to be human) was the first major Christological heresy. The student must understand why it is not merely wrong but soteriologically fatal: if Jesus was not genuinely human, he could not substitute for humanity; if he did not genuinely suffer and die, there was no real atonement; if he was not genuinely resurrected in a real body, there is no bodily resurrection for believers. Hebrews 2:14–18 is the key text: \"As the children are partakers of flesh and blood, he also himself likewise took part of the same\" — the word \"likewise\" insists on genuine participation.",
            "instructionalFocus": "Connect this standard to the pastoral reality of human suffering. Jesus did not observe suffering from a distance — he entered it. His humanity is not an embarrassment to his deity but the basis of his compassion and his ability to intercede effectively.",
            "vocabulary": [
              "Incarnation",
              "Son of God (incarnational meaning)",
              "Word (Logos)",
              "Kenosis",
              "Dual nature",
              "Eternal generation"
            ],
            "anchorScriptures": [
              {
                "reference": "Luke 1:35",
                "text": "The Holy Ghost shall come upon thee… therefore also that holy thing which shall be born of thee shall be called the Son of God."
              },
              {
                "reference": "Galatians 4:4",
                "text": "God sent forth his Son, made of a woman, made under the law."
              },
              {
                "reference": "Hebrews 1:5",
                "text": "Thou art my Son, this day have I begotten thee."
              },
              {
                "reference": "Hebrews 2:14",
                "text": "As the children are partakers of flesh and blood, he also himself likewise took part of the same."
              },
              {
                "reference": "Hebrews 2:17",
                "text": "He had to be made like his brothers in every way… to make atonement for the sins of the people."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt among us."
              },
              {
                "reference": "Philippians 2:6–8",
                "text": "Being in the form of God… he made himself of no reputation, and took upon him the form of a servant."
              },
              {
                "reference": "Romans 8:3",
                "text": "God sending his own Son in the likeness of sinful flesh, and for sin, condemned sin in the flesh."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Jesus was fully human, not merely appearing to be human."
              },
              {
                "level": "Explanation",
                "expectation": "Expounds Heb. 2:14–18 — why genuine humanity was necessary (to destroy death through genuine death; to be a merciful high priest through genuine suffering; to make propitiation for human sin)."
              },
              {
                "level": "Application",
                "expectation": "Shows how the denial of Jesus's humanity (docetism) undermines atonement, resurrection, and intercession — and why 1 John 4:2 makes confessing Christ's coming in the flesh a test of the spirit."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that Jesus had a special, glorified body that did not experience genuine human limitation — showing from Luke 2:52 (grew in wisdom), John 4:6 (tired), Mark 13:32 (did not know the hour), and Heb. 4:15 (tempted in all points) that his human experience was genuine."
              }
            ]
          },
          {
            "code": "OG.8.4.18",
            "title": "The Kenosis — Voluntary Limitation for Redemptive Purpose",
            "statement": "The student can expound Philippians 2:6–8, explaining what Jesus voluntarily set aside in the incarnation (the independent exercise of divine prerogatives), what he retained (the divine nature), and why this self-emptying was redemptively necessary — while guarding against the error of kenotic theology that eliminates divine attributes.",
            "scope": "\"Made himself of no reputation\" (literally: emptied himself) in Philippians 2:7 has produced a wide range of theological interpretations. The student must understand what the kenosis means and what it does not mean. It does not mean: Jesus stopped being omniscient, omnipotent, or omnipresent in his divine nature. It does mean: Jesus voluntarily chose not to independently exercise divine prerogatives — he submitted to human limitations, accepted suffering, and became obedient to death. This is the humility of God, not the diminishment of God.",
            "instructionalFocus": "The kenosis is one of the most beautiful truths in Scripture: the unlimited God chose to be limited for our sake. Help students feel the humility and love embedded in this before they analyze it. Then help them understand it precisely enough to defend it.",
            "vocabulary": [
              "Incarnation",
              "Son of God (incarnational meaning)",
              "Word (Logos)",
              "Kenosis",
              "Dual nature",
              "Eternal generation"
            ],
            "anchorScriptures": [
              {
                "reference": "Luke 1:35",
                "text": "The Holy Ghost shall come upon thee… therefore also that holy thing which shall be born of thee shall be called the Son of God."
              },
              {
                "reference": "Galatians 4:4",
                "text": "God sent forth his Son, made of a woman, made under the law."
              },
              {
                "reference": "Hebrews 1:5",
                "text": "Thou art my Son, this day have I begotten thee."
              },
              {
                "reference": "Hebrews 2:14",
                "text": "As the children are partakers of flesh and blood, he also himself likewise took part of the same."
              },
              {
                "reference": "Hebrews 2:17",
                "text": "He had to be made like his brothers in every way… to make atonement for the sins of the people."
              },
              {
                "reference": "John 1:14",
                "text": "The Word was made flesh, and dwelt among us."
              },
              {
                "reference": "Philippians 2:6–8",
                "text": "Being in the form of God… he made himself of no reputation, and took upon him the form of a servant."
              },
              {
                "reference": "Romans 8:3",
                "text": "God sending his own Son in the likeness of sinful flesh, and for sin, condemned sin in the flesh."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Jesus voluntarily accepted human limitations in the incarnation."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what \"emptied himself\" means in Phil. 2:7 — voluntary submission to limitation, not abandonment of divine nature; shows what was laid aside (independent divine prerogative) and what was retained (divine essence)."
              },
              {
                "level": "Application",
                "expectation": "Uses the kenosis to explain why Jesus grew in wisdom (Luke 2:52), did not know the hour (Mark 13:32), and prayed — without concluding that he was not omniscient or omnipotent in his divine nature."
              },
              {
                "level": "Defense",
                "expectation": "Responds to strong kenotic theology (which says Jesus actually ceased to be omniscient in the incarnation) and to the opposite error (which denies any genuine human limitation) — showing the biblical balance: genuine human limitation in the human nature, undiminished divine nature in the Spirit/Word."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.9",
        "domainTitle": "Father, Son, and Holy Spirit in Scriptural Interpretation",
        "anchorScripture": {
          "reference": "Matthew 28:19",
          "text": "Go ye therefore, and teach all nations, baptizing them in the name [singular] of the Father, and of the Son, and of the Holy Ghost."
        },
        "standards": [
          {
            "code": "OG.9.1.18",
            "title": "Matthew 28:19 — One Name, Three Titles",
            "statement": "The student can demonstrate from Matthew 28:19 that the great commission commands baptism \"in the name\" (singular) of the Father, Son, and Holy Spirit — that one name encompasses all three titles — and can show from the Acts baptismal records that the apostles understood that name to be Jesus.",
            "scope": "Matthew 28:19 is the most frequently cited baptismal proof text for the trinitarian formula \"Father, Son, and Holy Spirit.\" The student must be able to show: (1) \"name\" is singular (onoma), requiring one name — not three; (2) the apostles who received this command baptized in \"the name of Jesus Christ\" (Acts 2:38), \"the Lord Jesus\" (Acts 8:16; 19:5), and \"the Lord Jesus Christ\" (Acts 10:48) — always in the name of Jesus; (3) therefore the apostles understood Jesus's name to be the singular \"name\" of Matt. 28:19. This is not a contradiction between Matthew and Acts — it is Matthew filled in by its apostolic interpretation.",
            "instructionalFocus": "Drill students on all five Acts baptismal accounts until they can cite them from memory. The historical record of apostolic practice is the most powerful single argument. Matthew gives the command; Acts shows what it means.",
            "vocabulary": [
              "Father (as divine designation)",
              "Son (as divine designation)",
              "Holy Spirit (as divine designation)",
              "Comforter (Paraclete)",
              "Economic Trinity",
              "Matthew 28:19 — singular \"name\""
            ],
            "anchorScriptures": [
              {
                "reference": "Matthew 28:19",
                "text": "Go ye therefore, and teach all nations, baptizing them in the name [singular] of the Father, and of the Son, and of the Holy Ghost."
              },
              {
                "reference": "John 14:16–18",
                "text": "I will pray the Father, and he shall give you another Comforter… I will come to you."
              },
              {
                "reference": "Acts 5:3–4",
                "text": "Why hath Satan filled thine heart to lie to the Holy Ghost?… thou hast not lied unto men, but unto God."
              },
              {
                "reference": "2 Corinthians 3:17",
                "text": "The Lord is that Spirit."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Isaiah 63:16",
                "text": "Doubtless thou art our father… thou, O LORD, art our father, our redeemer; thy name is from everlasting."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "One Spirit… one Lord… one God and Father of all."
              },
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that \"name\" is singular in Matt. 28:19 and Jesus's name is used in Acts baptisms."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the grammatical argument (singular \"name\" → one name for three titles) and cites all five Acts baptismal accounts."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates the Matthew-Acts continuity: Jesus gave the command → the apostles carried it out → they used the name of Jesus → therefore Jesus's name is the \"name\" of the command."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the Acts formula is an abbreviation of the Matthew formula — showing from the Acts texts that the apostolic authors consistently use \"in the name of Jesus\" as the complete expression of the baptismal command, never as an abbreviation; and that there is no early historical record of any first-century church using a three-phrase formula."
              }
            ]
          },
          {
            "code": "OG.9.2.18",
            "title": "The Three Meanings of \"Father\" in Scripture",
            "statement": "The student can identify and distinguish the three biblical uses of the title \"Father\" as applied to God — (1) creator/sovereign Father of all; (2) Father of Israel/covenant Father; (3) incarnational Father — the divine Spirit dwelling in the Son — and can explain which usage applies in any given passage.",
            "scope": "Many apparent contradictions in Oneness theology arise from reading the word \"Father\" as always referring to the same thing. The student must be able to navigate all three uses: (1) God as Father of creation (Acts 17:28; \"in him we live and move and have our being\") — applicable to all people; (2) God as covenantal Father of Israel (Isa. 63:16; \"thou art our father\") — applicable to the covenant people; (3) God as the divine Spirit (Father) dwelling in and acting through the human Son (Jesus) — the incarnational use (John 14:10; \"the Father that dwelleth in me, he doeth the works\"). The third use is the one most specifically relevant to the Jesus-Father relationship.",
            "instructionalFocus": "This standard requires careful teaching. The three meanings of Father are not obvious to students accustomed to reading \"Father\" as a name for the first person of the trinity. Build the framework explicitly before testing application.",
            "vocabulary": [
              "Father (as divine designation)",
              "Son (as divine designation)",
              "Holy Spirit (as divine designation)",
              "Comforter (Paraclete)",
              "Economic Trinity",
              "Matthew 28:19 — singular \"name\""
            ],
            "anchorScriptures": [
              {
                "reference": "Matthew 28:19",
                "text": "Go ye therefore, and teach all nations, baptizing them in the name [singular] of the Father, and of the Son, and of the Holy Ghost."
              },
              {
                "reference": "John 14:16–18",
                "text": "I will pray the Father, and he shall give you another Comforter… I will come to you."
              },
              {
                "reference": "Acts 5:3–4",
                "text": "Why hath Satan filled thine heart to lie to the Holy Ghost?… thou hast not lied unto men, but unto God."
              },
              {
                "reference": "2 Corinthians 3:17",
                "text": "The Lord is that Spirit."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Isaiah 63:16",
                "text": "Doubtless thou art our father… thou, O LORD, art our father, our redeemer; thy name is from everlasting."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "One Spirit… one Lord… one God and Father of all."
              },
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that \"Father\" has multiple uses in Scripture."
              },
              {
                "level": "Explanation",
                "expectation": "Defines and provides a scripture for each of the three uses."
              },
              {
                "level": "Application",
                "expectation": "Applies the correct \"Father\" meaning to specific passages — e.g., \"I go to my Father\" (incarnational), \"Our Father in heaven\" (covenantal/relational for believers), \"Father of lights\" (creator sense)."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that Jesus's prayers to the Father prove he is praying to a separate divine person — showing that the incarnational Father is not a second person but the divine nature of Jesus himself operating in its transcendent dimension while Jesus's human consciousness interacts with it."
              }
            ]
          },
          {
            "code": "OG.9.3.18",
            "title": "The Holy Spirit as the Spirit of the One God",
            "statement": "The student can demonstrate from multiple scriptural designations that the Holy Spirit is not a third divine person but the Spirit of God and the Spirit of Christ — one and the same divine Spirit identified variously as the Spirit of the Father, the Spirit of Christ, and the Spirit of Jesus.",
            "scope": "The biblical evidence for the Spirit's identification with the one God is extensive: (1) \"Spirit of God\" (Gen. 1:2; Matt. 3:16); (2) \"Spirit of the Father\" (Matt. 10:20); (3) \"Spirit of Christ\" (Rom. 8:9; Phil. 1:19); (4) \"Spirit of Jesus\" (Acts 16:7); (5) \"Spirit of his Son\" (Gal. 4:6); (6) \"The Lord is that Spirit\" (2 Cor. 3:17). The student must show that these are not three different spirits or three different persons — they are the same divine Spirit described from different angles. Acts 5:3–4 is decisive: lying to the Holy Spirit = lying to God.",
            "instructionalFocus": "The identification of the Spirit with Jesus is one of the most powerful Oneness arguments. 2 Corinthians 3:17 is stunning: \"The Lord is that Spirit.\" Help students see that this is not a theological conclusion — it is Paul's direct statement.",
            "vocabulary": [
              "Father (as divine designation)",
              "Son (as divine designation)",
              "Holy Spirit (as divine designation)",
              "Comforter (Paraclete)",
              "Economic Trinity",
              "Matthew 28:19 — singular \"name\""
            ],
            "anchorScriptures": [
              {
                "reference": "Matthew 28:19",
                "text": "Go ye therefore, and teach all nations, baptizing them in the name [singular] of the Father, and of the Son, and of the Holy Ghost."
              },
              {
                "reference": "John 14:16–18",
                "text": "I will pray the Father, and he shall give you another Comforter… I will come to you."
              },
              {
                "reference": "Acts 5:3–4",
                "text": "Why hath Satan filled thine heart to lie to the Holy Ghost?… thou hast not lied unto men, but unto God."
              },
              {
                "reference": "2 Corinthians 3:17",
                "text": "The Lord is that Spirit."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Isaiah 63:16",
                "text": "Doubtless thou art our father… thou, O LORD, art our father, our redeemer; thy name is from everlasting."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "One Spirit… one Lord… one God and Father of all."
              },
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the Holy Spirit is identified with both God the Father and Jesus."
              },
              {
                "level": "Explanation",
                "expectation": "Cites at least five of the designations (Spirit of God, Spirit of Father, Spirit of Christ, Spirit of Jesus, The Lord is that Spirit) with references."
              },
              {
                "level": "Application",
                "expectation": "Uses Acts 5:3–4 as the pivotal text: lying to the Holy Spirit is lying to God — they are identified, not merely related."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that Acts 5:3–4 merely shows the Spirit represents God (like a human ambassador represents a government) — showing that \"lied unto God\" in verse 4 is an identity claim, not a representational one: the Spirit IS God, not merely represents him."
              }
            ]
          },
          {
            "code": "OG.9.4.18",
            "title": "The Comforter — Jesus Coming in the Spirit",
            "statement": "The student can expound John 14:16–18 and demonstrate that Jesus's promise of \"another Comforter\" is fulfilled in the coming of his own Spirit — showing that verse 18 (\"I will come to you\") identifies Jesus with the Comforter — and that this is confirmed by the events of Acts 2.",
            "scope": "John 14:16–18 contains one of the most important self-referential statements Jesus makes about the Spirit. He promises \"another Comforter\" — and immediately says \"I will come to you\" (v.18). The student must show: (1) \"another\" (allos in Greek) does not necessarily mean \"another separate person\" — it means \"in another form/mode\"; (2) Jesus identifies himself as the Comforter: \"I will not leave you orphans: I will come to you\"; (3) John 14:23 confirms — \"we will come unto him\" — Father and Son together making their abode in the believer = the Spirit coming; (4) this is fulfilled in Acts 2 when the Spirit of Jesus fills the 120.",
            "instructionalFocus": "This standard resolves one of the most common trinitarian proof texts. Help students see that Jesus did not promise to send a third divine being — he promised to come back in Spirit. That is the gift of Acts 2, and it is the gift that keeps on giving.",
            "vocabulary": [
              "Father (as divine designation)",
              "Son (as divine designation)",
              "Holy Spirit (as divine designation)",
              "Comforter (Paraclete)",
              "Economic Trinity",
              "Matthew 28:19 — singular \"name\""
            ],
            "anchorScriptures": [
              {
                "reference": "Matthew 28:19",
                "text": "Go ye therefore, and teach all nations, baptizing them in the name [singular] of the Father, and of the Son, and of the Holy Ghost."
              },
              {
                "reference": "John 14:16–18",
                "text": "I will pray the Father, and he shall give you another Comforter… I will come to you."
              },
              {
                "reference": "Acts 5:3–4",
                "text": "Why hath Satan filled thine heart to lie to the Holy Ghost?… thou hast not lied unto men, but unto God."
              },
              {
                "reference": "2 Corinthians 3:17",
                "text": "The Lord is that Spirit."
              },
              {
                "reference": "John 10:30",
                "text": "I and my Father are one."
              },
              {
                "reference": "Isaiah 63:16",
                "text": "Doubtless thou art our father… thou, O LORD, art our father, our redeemer; thy name is from everlasting."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "One Spirit… one Lord… one God and Father of all."
              },
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Jesus promises a Comforter and then says \"I will come to you.\""
              },
              {
                "level": "Explanation",
                "expectation": "Shows the textual sequence in John 14:16–18 and explains why \"I will come to you\" in verse 18 identifies Jesus with the Comforter."
              },
              {
                "level": "Application",
                "expectation": "Traces the fulfilment in Acts 2 — the Spirit that filled the disciples was the Spirit of Jesus (Acts 16:7; \"Spirit of Jesus\"), confirming the identification."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian reading that \"another Comforter\" proves a distinct third person — showing (a) allos in context can mean \"in another mode,\" (b) Jesus's own identification in verse 18 is decisive, and (c) the Spirit's consistent identification as \"Spirit of Jesus/Christ\" in the NT forecloses a completely separate person."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.10",
        "domainTitle": "The Deity and Humanity of Christ in Difficult Passages",
        "anchorScripture": {
          "reference": "John 5:19",
          "text": "The Son can do nothing of himself, but what he seeth the Father do: for what things soever he doeth, these also doeth the Son likewise."
        },
        "standards": [
          {
            "code": "OG.10.1.18",
            "title": "The Dual Nature Principle as Interpretive Key",
            "statement": "The student can articulate the dual nature principle — that Jesus's statements and actions must be assigned to either his divine nature or his human nature — and can apply it consistently to resolve apparent contradictions in the Gospels without creating two persons.",
            "scope": "The dual nature principle is the fundamental hermeneutical tool for reading the Gospels. Without it, the Jesus of Scripture appears self-contradictory: omniscient yet ignorant, omnipotent yet helpless, eternal yet born, divine yet dying. With it, the apparent contradictions are resolved: when Jesus says \"the Father is greater than I\" — the human nature acknowledges the divine; when Jesus says \"I and my Father are one\" — the divine nature declares its unity. The student must be able to apply this consistently without either collapsing the two natures into one (confusion) or separating them into two persons (division).",
            "instructionalFocus": "Teach this with a two-column exercise: put difficult Jesus-sayings on the board, and have students assign them to divine or human nature with reasons. The exercise builds fluency that enables real-time application in conversation.",
            "vocabulary": [
              "Dual nature principle",
              "Subordination texts",
              "Gethsemane prayer",
              "Exaltation (Acts 2:36)",
              "Eschatological subjection (1 Cor. 15:28)",
              "Kenotic passages"
            ],
            "anchorScriptures": [
              {
                "reference": "John 5:19",
                "text": "The Son can do nothing of himself, but what he seeth the Father do: for what things soever he doeth, these also doeth the Son likewise."
              },
              {
                "reference": "Mark 13:32",
                "text": "Of that day and that hour knoweth no man, no, not the angels which are in heaven, neither the Son, but the Father."
              },
              {
                "reference": "Luke 2:52",
                "text": "Jesus increased in wisdom and stature, and in favour with God and man."
              },
              {
                "reference": "John 17:3",
                "text": "That they might know thee the only true God, and Jesus Christ, whom thou hast sent."
              },
              {
                "reference": "Matthew 26:39",
                "text": "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt."
              },
              {
                "reference": "Hebrews 4:15",
                "text": "In all points tempted like as we are, yet without sin."
              },
              {
                "reference": "Acts 2:36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "1 Corinthians 15:28",
                "text": "Then shall the Son also himself be subject unto him that put all things under him, that God may be all in all."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Jesus is fully divine and fully human and that this resolves apparent contradictions."
              },
              {
                "level": "Explanation",
                "expectation": "Articulates the dual nature principle clearly — which statements are human-nature statements, which are divine-nature statements, and what the criteria for distinction are."
              },
              {
                "level": "Application",
                "expectation": "Applies the dual nature to at least five difficult passages: \"Father is greater than I\" (human); \"I and Father are one\" (divine); \"I thirst\" (human); feeding 5,000 (divine); Gethsemane prayer (human); raising Lazarus (divine)."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian use of subordination texts (\"the Father is greater than I\") to argue for eternal subordination of the Son — showing that (a) the Oneness reading (human nature speaking) is simpler and more consistent; (b) trinitarian \"eternal subordination of the Son\" creates problems within trinitarianism itself (ontological inequality)."
              }
            ]
          },
          {
            "code": "OG.10.2.18",
            "title": "Mark 13:32 — The Son Did Not Know the Hour",
            "statement": "The student can expound Mark 13:32 — Jesus's statement that the Son does not know the day or hour of his return — demonstrating that this refers to the human knowledge of the incarnate Son, not a limitation on divine omniscience, and can articulate why this does not contradict the full deity of Christ.",
            "scope": "Mark 13:32 is one of the most frequently cited challenges to the full deity of Jesus. The student must show: (1) The limitation of knowledge is ascribed to \"the Son\" — the incarnational title; (2) \"the Father\" who does know is the divine nature; (3) the kenosis explains how the omniscient God could genuinely not know something in the human dimension — he voluntarily restricted the access of human consciousness to divine omniscience in this specific area; (4) this is not a contradiction but the mystery of the incarnation — genuinely human, yet genuinely divine.",
            "instructionalFocus": "Use this passage to help students understand the mystery and humility of the incarnation. The fact that the all-knowing God chose not to know the hour — from within the human experience — is itself a profound act of solidarity with humanity.",
            "vocabulary": [
              "Dual nature principle",
              "Subordination texts",
              "Gethsemane prayer",
              "Exaltation (Acts 2:36)",
              "Eschatological subjection (1 Cor. 15:28)",
              "Kenotic passages"
            ],
            "anchorScriptures": [
              {
                "reference": "John 5:19",
                "text": "The Son can do nothing of himself, but what he seeth the Father do: for what things soever he doeth, these also doeth the Son likewise."
              },
              {
                "reference": "Mark 13:32",
                "text": "Of that day and that hour knoweth no man, no, not the angels which are in heaven, neither the Son, but the Father."
              },
              {
                "reference": "Luke 2:52",
                "text": "Jesus increased in wisdom and stature, and in favour with God and man."
              },
              {
                "reference": "John 17:3",
                "text": "That they might know thee the only true God, and Jesus Christ, whom thou hast sent."
              },
              {
                "reference": "Matthew 26:39",
                "text": "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt."
              },
              {
                "reference": "Hebrews 4:15",
                "text": "In all points tempted like as we are, yet without sin."
              },
              {
                "reference": "Acts 2:36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "1 Corinthians 15:28",
                "text": "Then shall the Son also himself be subject unto him that put all things under him, that God may be all in all."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States the text and that \"the Son\" refers to human nature."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the dual nature reading: human nature (Son) did not know; divine nature (Father) did know — applies the kenosis to explain the voluntary restriction of knowledge in the human dimension."
              },
              {
                "level": "Application",
                "expectation": "Connects Mark 13:32 to Luke 2:52 (grew in wisdom) — both describe genuine human development and limitation, both consistent with the incarnation."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian use of this verse to argue for the Son being a permanently lesser divine person than the Father — showing that \"lesser\" applies only to the human nature in the incarnational economy, not to the divine nature; and that the Son's not-knowing is a feature of kenosis, not eternal subordination."
              }
            ]
          },
          {
            "code": "OG.10.3.18",
            "title": "The Gethsemane Prayer — Two Wills, One Person",
            "statement": "The student can expound Matthew 26:39 as the expression of Jesus's genuine human will in its moment of greatest stress — \"not as I will, but as thou wilt\" — demonstrating that this is not a second divine person praying to the first, but the human will of the incarnate God submitting to the divine will within the one person.",
            "scope": "Gethsemane is the most intimate and theologically dense prayer in the Gospels. The student must understand: (1) \"My Father\" — Jesus prays from his human consciousness to the divine Father (the Spirit within him); (2) \"If it be possible, let this cup pass\" — genuine human desire to avoid suffering, not theatrical performance; (3) \"Not as I will, but as thou wilt\" — the human will submitting to the divine will; this is not two persons disagreeing but the dual-nature tension within one person in its most acute expression. The student must be able to hold the genuineness of the human distress without either denying it or making it a second divine person in conflict.",
            "instructionalFocus": "Gethsemane should produce worship, not merely exegetical precision. Help students see the love of God in this moment: God himself, in human flesh, entered the full horror of what awaited him and chose to go through it for us. That is the atonement in its most personal expression.",
            "vocabulary": [
              "Dual nature principle",
              "Subordination texts",
              "Gethsemane prayer",
              "Exaltation (Acts 2:36)",
              "Eschatological subjection (1 Cor. 15:28)",
              "Kenotic passages"
            ],
            "anchorScriptures": [
              {
                "reference": "John 5:19",
                "text": "The Son can do nothing of himself, but what he seeth the Father do: for what things soever he doeth, these also doeth the Son likewise."
              },
              {
                "reference": "Mark 13:32",
                "text": "Of that day and that hour knoweth no man, no, not the angels which are in heaven, neither the Son, but the Father."
              },
              {
                "reference": "Luke 2:52",
                "text": "Jesus increased in wisdom and stature, and in favour with God and man."
              },
              {
                "reference": "John 17:3",
                "text": "That they might know thee the only true God, and Jesus Christ, whom thou hast sent."
              },
              {
                "reference": "Matthew 26:39",
                "text": "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt."
              },
              {
                "reference": "Hebrews 4:15",
                "text": "In all points tempted like as we are, yet without sin."
              },
              {
                "reference": "Acts 2:36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "1 Corinthians 15:28",
                "text": "Then shall the Son also himself be subject unto him that put all things under him, that God may be all in all."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Gethsemane shows Jesus's genuine human will."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the two-will framework — human will (wanting to avoid suffering) and divine will (the redemptive plan) in tension within one person; explains that this is the dual nature at its most acute."
              },
              {
                "level": "Application",
                "expectation": "Shows how the submission \"not my will but thine\" is the highest expression of human obedience, which is the spiritual content of the atonement (the second Adam's obedience reversing the first Adam's disobedience, Rom. 5:19)."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian claim that the two wills prove two persons — showing that one person can have two wills (one human, one divine) without being two persons, just as every believer has a human will and a Spirit-influenced will simultaneously."
              }
            ]
          },
          {
            "code": "OG.10.4.18",
            "title": "1 Corinthians 15:28 — The Son Delivered to God",
            "statement": "The student can expound 1 Corinthians 15:28 — \"the Son also himself be subject unto him… that God may be all in all\" — as the eschatological resolution of the incarnational economy: when the redemptive purpose of the Son is complete, the Father-Son distinction of the incarnation is resolved, and God alone is all in all.",
            "scope": "1 Corinthians 15:28 is one of the most eschatologically profound verses in the NT. The student must understand: (1) \"the Son also himself be subject\" — this is a future event at the end of the age; (2) \"that God may be all in all\" — the purpose is the full resumption of God's unconditioned sovereignty; (3) in the Oneness understanding, this refers to the completion of the incarnational economy — when the mediatorial role of the Son is no longer needed, the Father-Son distinction (which exists only in the incarnational framework) is resolved. God will be \"all in all\" — not Father-Son-Spirit separately, but the one God in full, unconditioned expression.",
            "instructionalFocus": "This is an eschatological standard that grounds students in where history is going. The redemptive story has an end — a consummation where God is fully, openly, unmediatedly \"all in all.\" Help students see that the whole drama of redemption is moving toward that moment.",
            "vocabulary": [
              "Dual nature principle",
              "Subordination texts",
              "Gethsemane prayer",
              "Exaltation (Acts 2:36)",
              "Eschatological subjection (1 Cor. 15:28)",
              "Kenotic passages"
            ],
            "anchorScriptures": [
              {
                "reference": "John 5:19",
                "text": "The Son can do nothing of himself, but what he seeth the Father do: for what things soever he doeth, these also doeth the Son likewise."
              },
              {
                "reference": "Mark 13:32",
                "text": "Of that day and that hour knoweth no man, no, not the angels which are in heaven, neither the Son, but the Father."
              },
              {
                "reference": "Luke 2:52",
                "text": "Jesus increased in wisdom and stature, and in favour with God and man."
              },
              {
                "reference": "John 17:3",
                "text": "That they might know thee the only true God, and Jesus Christ, whom thou hast sent."
              },
              {
                "reference": "Matthew 26:39",
                "text": "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt."
              },
              {
                "reference": "Hebrews 4:15",
                "text": "In all points tempted like as we are, yet without sin."
              },
              {
                "reference": "Acts 2:36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "1 Corinthians 15:28",
                "text": "Then shall the Son also himself be subject unto him that put all things under him, that God may be all in all."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States the verse and that it refers to the eschatological future."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what \"the Son subject to God\" means in the context of the completion of the redemptive mission; explains \"God be all in all\" as the resolution of the incarnational economy."
              },
              {
                "level": "Application",
                "expectation": "Connects 1 Cor. 15:28 to the broader eschatology of Revelation 21–22, where Jesus is the temple, the light, and the Alpha and Omega — the one God fully disclosed, no longer through the mediatorial Son role."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian reading that this verse proves the Son is eternally subordinate to the Father — showing that \"shall be subject\" is future, not eternal, and that the subjection is the completion of an incarnational role, not the permanent state of a lesser divine person."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.11",
        "domainTitle": "The Holy Spirit as the Spirit of the One God",
        "anchorScripture": {
          "reference": "Genesis 1:2",
          "text": "The Spirit of God moved upon the face of the waters."
        },
        "standards": [
          {
            "code": "OG.11.1.18",
            "title": "The Holy Spirit as the Spirit of the One God",
            "statement": "The student can demonstrate from Scripture that the Holy Spirit is the Spirit of the one true God — not a separate divine being alongside the Father, and not an impersonal force — and can explain why Spirit language must be interpreted inside biblical monotheism.",
            "scope": "This standard is identity-centered, not salvation-pattern centered. The student must show that the Spirit is God in living operation: present, speaking, leading, sanctifying, empowering, and indwelling. The student must also reject two opposite errors: depersonalizing the Spirit into vague power, and personalizing the Spirit into another divine individual alongside God. The governing doctrinal claim is that the Spirit is the Spirit of the one God acting as Spirit.",
            "instructionalFocus": "Teach the Spirit through the one-God framework already established in earlier domains. Use Genesis 1:2, Isaiah 63, John 4:24, Romans 8, and II Corinthians 3:17 to show continuity: the Spirit is not a second deity added later, but the one God present and active as Spirit.",
            "vocabulary": [
              "Holy Spirit",
              "Divine operation",
              "Continuity of the Spirit",
              "Personal language",
              "Indwelling",
              "Monotheistic interpretation"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:2",
                "text": "The Spirit of God moved upon the face of the waters."
              },
              {
                "reference": "Isaiah 63:10–14",
                "text": "They rebelled, and vexed his holy Spirit…"
              },
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Romans 8:9–11",
                "text": "If any man have not the Spirit of Christ…"
              },
              {
                "reference": "2 Corinthians 3:17",
                "text": "Now the Lord is that Spirit."
              },
              {
                "reference": "Galatians 4:6",
                "text": "God hath sent forth the Spirit of his Son into your hearts."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "One body, and one Spirit… one God and Father of all."
              },
              {
                "reference": "1 Peter 1:10–12",
                "text": "The Spirit of Christ which was in them did signify."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the Holy Spirit is the Spirit of God and not merely an impersonal force."
              },
              {
                "level": "Explanation",
                "expectation": "Explains from Scripture that the Holy Spirit is the Spirit of the one true God and not another divine being."
              },
              {
                "level": "Application",
                "expectation": "Interprets key Spirit passages in a way that preserves both living divine action and biblical monotheism."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that personal Spirit language proves a separate divine person, using a one-God reading of the relevant texts."
              }
            ]
          },
          {
            "code": "OG.11.2.18",
            "title": "Continuity of the Spirit Across Creation, Prophecy, Christ, and the Church",
            "statement": "The student can trace the continuity of the Holy Spirit across Scripture — from creation and prophetic activity to the ministry of Christ and the indwelling life of the church — demonstrating that the same divine Spirit is at work throughout the biblical message.",
            "scope": "The doctrinal purpose of this standard is continuity of divine identity. The Spirit active in creation, inspiring prophets, overshadowing in the incarnation, empowering Christ, and indwelling believers is the same divine Spirit. The student must be able to explain this continuity without collapsing distinct redemptive moments and without suggesting multiple spirits or multiple divine centers.",
            "instructionalFocus": "Have students trace the Spirit through the Bible as one continuous line of divine action. This prevents fragmentation and keeps the Spirit doctrine anchored in the one continuous revelation of God rather than in isolated experience texts.",
            "vocabulary": [
              "Holy Spirit",
              "Divine operation",
              "Continuity of the Spirit",
              "Personal language",
              "Indwelling",
              "Monotheistic interpretation"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:2",
                "text": "The Spirit of God moved upon the face of the waters."
              },
              {
                "reference": "Isaiah 63:10–14",
                "text": "They rebelled, and vexed his holy Spirit…"
              },
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Romans 8:9–11",
                "text": "If any man have not the Spirit of Christ…"
              },
              {
                "reference": "2 Corinthians 3:17",
                "text": "Now the Lord is that Spirit."
              },
              {
                "reference": "Galatians 4:6",
                "text": "God hath sent forth the Spirit of his Son into your hearts."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "One body, and one Spirit… one God and Father of all."
              },
              {
                "reference": "1 Peter 1:10–12",
                "text": "The Spirit of Christ which was in them did signify."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Names major moments where the Spirit appears across Scripture: creation, prophecy, Christ, and the church."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the same divine Spirit is active across those moments without change of divine identity."
              },
              {
                "level": "Application",
                "expectation": "Traces the continuity of the Spirit through multiple passages and shows why this continuity matters doctrinally."
              },
              {
                "level": "Defense",
                "expectation": "Answers fragmented or era-specific readings of the Spirit by presenting one continuous doctrine of divine Spirit activity."
              }
            ]
          },
          {
            "code": "OG.11.3.18",
            "title": "Personal Language About the Spirit Without Dividing God",
            "statement": "The student can interpret scriptural language about the Spirit speaking, sending, leading, grieving, and interceding in a way that preserves both the personal reality of the Spirit and the absolute unity of God.",
            "scope": "Scripture speaks of the Spirit with living, personal language. The student must preserve that language fully. At the same time, such language must not be used to create a second or third divine person beside God. The interpretive task is to affirm genuine divine personal action while maintaining that the Spirit is the Spirit of the one God. The question is not whether the Spirit acts personally — the question is whether that personal action requires another divine being. Biblical monotheism says no.",
            "instructionalFocus": "Train students to answer the common claim that personal language about the Spirit proves a separate person. The key is to show that the one God is living, personal, and active as Spirit, and that Scripture often uses personal language for divine action without dividing deity.",
            "vocabulary": [
              "Holy Spirit",
              "Divine operation",
              "Continuity of the Spirit",
              "Personal language",
              "Indwelling",
              "Monotheistic interpretation"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 1:2",
                "text": "The Spirit of God moved upon the face of the waters."
              },
              {
                "reference": "Isaiah 63:10–14",
                "text": "They rebelled, and vexed his holy Spirit…"
              },
              {
                "reference": "John 4:24",
                "text": "God is a Spirit."
              },
              {
                "reference": "Romans 8:9–11",
                "text": "If any man have not the Spirit of Christ…"
              },
              {
                "reference": "2 Corinthians 3:17",
                "text": "Now the Lord is that Spirit."
              },
              {
                "reference": "Galatians 4:6",
                "text": "God hath sent forth the Spirit of his Son into your hearts."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "One body, and one Spirit… one God and Father of all."
              },
              {
                "reference": "1 Peter 1:10–12",
                "text": "The Spirit of Christ which was in them did signify."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Recognizes that Scripture uses personal language about the Spirit."
              },
              {
                "level": "Explanation",
                "expectation": "Explains that the Spirit speaks, leads, and acts personally without being a separate deity."
              },
              {
                "level": "Application",
                "expectation": "Interprets Spirit texts with enough care to preserve both personal reality and divine unity."
              },
              {
                "level": "Defense",
                "expectation": "Responds to arguments that Spirit language creates another divine person, using monotheistic and contextual interpretation."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.12",
        "domainTitle": "Pentecost and the Name of Jesus in Apostolic Revelation",
        "anchorScripture": {
          "reference": "Acts 2:16–18",
          "text": "This is that which was spoken by the prophet Joel."
        },
        "standards": [
          {
            "code": "OG.12.1.18",
            "title": "Pentecost as a Revelatory Turning Point",
            "statement": "The student can explain Pentecost as a decisive revelatory turning point in which the identity, exaltation, and lordship of Jesus Christ are publicly proclaimed with Spirit-given clarity.",
            "scope": "In this subject, Pentecost is treated primarily as revelation, not as the full doctrinal treatment of salvation entry. The student must show that Acts 2 is the moment when prior promise, the exaltation of Christ, and apostolic proclamation come together in open declaration. Pentecost reveals who Jesus is and what God has done in Him; Subject 02 then develops the full salvation-response implications of that event.",
            "instructionalFocus": "Teach Pentecost first as revelation before moving to response. Students should hear Peter's sermon as a public declaration of identity: Jesus is Lord and Christ, exalted, vindicated, and openly proclaimed.",
            "vocabulary": [
              "Pentecost",
              "Name of Jesus",
              "Apostolic revelation",
              "Identity-bearing practice",
              "Exaltation",
              "Bridge doctrine"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:16–18",
                "text": "This is that which was spoken by the prophet Joel."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "Acts 2:33",
                "text": "He hath shed forth this, which ye now see and hear."
              },
              {
                "reference": "Acts 3:16",
                "text": "His name through faith in his name hath made this man strong."
              },
              {
                "reference": "Acts 4:10–12",
                "text": "Neither is there salvation in any other…"
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God… given him a name which is above every name."
              },
              {
                "reference": "Colossians 3:17",
                "text": "Whatsoever ye do… do all in the name of the Lord Jesus."
              },
              {
                "reference": "Matthew 28:19",
                "text": "Baptizing them in the name…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Pentecost is a major revelatory moment in apostolic proclamation."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how promise, exaltation, and apostolic preaching converge at Pentecost to disclose Jesus publicly."
              },
              {
                "level": "Application",
                "expectation": "Shows why Pentecost belongs to the doctrine of God in Christ and not only to experience language."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Pentecost is only an experience event by presenting it as a revelatory turning point."
              }
            ]
          },
          {
            "code": "OG.12.2.18",
            "title": "The Name of Jesus as Apostolic Disclosure of Divine Identity",
            "statement": "The student can demonstrate that the name of Jesus functions in apostolic proclamation as the revealed disclosure of who God is in Christ, carrying identity, authority, and covenant significance.",
            "scope": "This standard is not mainly about baptismal practice mechanics. It is about what the apostles believed the name disclosed. The student must connect the name of Jesus to divine self-disclosure, apostolic proclamation, and the confession of Jesus as Lord. The name matters because it reveals the one God in redemptive manifestation and public apostolic witness.",
            "instructionalFocus": "Help students move beyond thinking of the name of Jesus as a formula word. In this subject, the name is first an identity claim: it reveals who Jesus is and why the apostles center everything in Him.",
            "vocabulary": [
              "Pentecost",
              "Name of Jesus",
              "Apostolic revelation",
              "Identity-bearing practice",
              "Exaltation",
              "Bridge doctrine"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:16–18",
                "text": "This is that which was spoken by the prophet Joel."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "Acts 2:33",
                "text": "He hath shed forth this, which ye now see and hear."
              },
              {
                "reference": "Acts 3:16",
                "text": "His name through faith in his name hath made this man strong."
              },
              {
                "reference": "Acts 4:10–12",
                "text": "Neither is there salvation in any other…"
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God… given him a name which is above every name."
              },
              {
                "reference": "Colossians 3:17",
                "text": "Whatsoever ye do… do all in the name of the Lord Jesus."
              },
              {
                "reference": "Matthew 28:19",
                "text": "Baptizing them in the name…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the apostles center proclamation and practice in the name of Jesus."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the name of Jesus functions as apostolic disclosure of identity, authority, and confession."
              },
              {
                "level": "Application",
                "expectation": "Connects the name of Jesus to apostolic witness, lordship, and divine self-disclosure in Christ."
              },
              {
                "level": "Defense",
                "expectation": "Responds to reduced or merely formulaic readings of the name by showing its doctrinal role in revelation."
              }
            ]
          },
          {
            "code": "OG.12.3.18",
            "title": "Apostolic Baptism in Jesus' Name as Identity-Bearing Practice",
            "statement": "The student can explain why apostolic baptism in Jesus' name bears witness to the apostles' understanding of Jesus' identity, even though the full salvation and baptism doctrine is developed in Subject 02.",
            "scope": "This standard keeps baptism in OG only at the bridge point. The student must show that baptism in Jesus' name reveals what the apostles believed about Jesus: His name carries the covenant authority of the revealed Lord. The student does not need, in this subject, to build the full case for mode, urgency, remission application, or the complete Acts-pattern argument. Those belong to the New Birth standards. Here the concern is identity-bearing apostolic practice.",
            "instructionalFocus": "Teach students to answer the question, \"What does apostolic baptism in Jesus' name reveal about the apostles' doctrine of God and Christ?\" That keeps the standard in its proper subject boundary while preserving continuity with NB.",
            "vocabulary": [
              "Pentecost",
              "Name of Jesus",
              "Apostolic revelation",
              "Identity-bearing practice",
              "Exaltation",
              "Bridge doctrine"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:16–18",
                "text": "This is that which was spoken by the prophet Joel."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "Acts 2:33",
                "text": "He hath shed forth this, which ye now see and hear."
              },
              {
                "reference": "Acts 3:16",
                "text": "His name through faith in his name hath made this man strong."
              },
              {
                "reference": "Acts 4:10–12",
                "text": "Neither is there salvation in any other…"
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God… given him a name which is above every name."
              },
              {
                "reference": "Colossians 3:17",
                "text": "Whatsoever ye do… do all in the name of the Lord Jesus."
              },
              {
                "reference": "Matthew 28:19",
                "text": "Baptizing them in the name…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that apostolic baptism in Jesus' name reveals what the apostles believed about Jesus."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why this baptismal practice is identity-bearing apostolic witness and not merely a wording preference."
              },
              {
                "level": "Application",
                "expectation": "Shows how baptism in Jesus' name functions in OG as a bridge theme tied to christological confession."
              },
              {
                "level": "Defense",
                "expectation": "Answers why baptism in Jesus' name belongs in a God doctrine document at all: because it reveals apostolic belief about Jesus' identity."
              }
            ]
          },
          {
            "code": "OG.12.4.18",
            "title": "Synthesis: Pentecost, the Name of Jesus, and Apostolic Practice as One Revelation of God in Christ",
            "statement": "The student can synthesize Pentecost, the name of Jesus, and apostolic practice as one coherent revelation of God in Christ, showing how these themes disclose identity without collapsing into a full salvation-pattern treatment.",
            "scope": "This synthesis keeps the boundary clear. Pentecost reveals. The name discloses. Apostolic practice witnesses. Together they show how the earliest church understood Jesus Christ. The student must be able to articulate this bridge clearly while leaving the fuller doctrine of repentance, baptism, Spirit reception, and covenant entry to Subject 02.",
            "instructionalFocus": "This domain is the hinge between identity and response. Teach it as a hinge. Students should leave knowing why these themes appear in both subjects and why their function is different in each.",
            "vocabulary": [
              "Pentecost",
              "Name of Jesus",
              "Apostolic revelation",
              "Identity-bearing practice",
              "Exaltation",
              "Bridge doctrine"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:16–18",
                "text": "This is that which was spoken by the prophet Joel."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "God hath made that same Jesus… both Lord and Christ."
              },
              {
                "reference": "Acts 2:33",
                "text": "He hath shed forth this, which ye now see and hear."
              },
              {
                "reference": "Acts 3:16",
                "text": "His name through faith in his name hath made this man strong."
              },
              {
                "reference": "Acts 4:10–12",
                "text": "Neither is there salvation in any other…"
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God… given him a name which is above every name."
              },
              {
                "reference": "Colossians 3:17",
                "text": "Whatsoever ye do… do all in the name of the Lord Jesus."
              },
              {
                "reference": "Matthew 28:19",
                "text": "Baptizing them in the name…"
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Names Pentecost, the name of Jesus, and apostolic practice as connected themes."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how these themes work together as revelation of God in Christ."
              },
              {
                "level": "Application",
                "expectation": "Shows why these themes belong in both OG and NB while serving different doctrinal functions."
              },
              {
                "level": "Defense",
                "expectation": "Presents a clear synthesis that preserves continuity with NB without turning OG into a full salvation-pattern document."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.13",
        "domainTitle": "Apostolic Witness to the Identity of Jesus Christ",
        "anchorScripture": {
          "reference": "Acts 2:22–36",
          "text": "This Jesus hath God raised up…"
        },
        "standards": [
          {
            "code": "OG.13.1.18",
            "title": "The Structure of Apostolic Witness to Jesus Christ",
            "statement": "The student can identify the structural elements of apostolic witness from Acts 2:22–36 and show how this pattern publicly declares the identity and lordship of Jesus Christ.",
            "scope": "The student must still know the structure of apostolic proclamation, but in this subject the emphasis falls on identity declaration rather than on the complete salvation-response pattern. Historical Jesus, crucifixion, resurrection, exaltation, and lordship declaration all serve to answer the question: Who is Jesus? The student may note the call to response, but the full response doctrine is developed in Subject 02.",
            "instructionalFocus": "Help students hear the apostolic sermon as a public identity argument. The apostles are not only recounting events; they are declaring what those events prove about Jesus.",
            "vocabulary": [
              "Apostolic witness",
              "Kerygma",
              "Vindication",
              "Exaltation",
              "Lordship declaration",
              "Right-hand language"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:22–36",
                "text": "This Jesus hath God raised up…"
              },
              {
                "reference": "Acts 3:12–16",
                "text": "Why marvel ye at this?"
              },
              {
                "reference": "Acts 10:36–43",
                "text": "He is Lord of all."
              },
              {
                "reference": "Acts 13:27–33",
                "text": "God hath fulfilled… in that he hath raised up Jesus again."
              },
              {
                "reference": "1 Corinthians 15:1–20",
                "text": "If Christ be not raised…"
              },
              {
                "reference": "Psalm 110:1",
                "text": "Sit thou at my right hand."
              },
              {
                "reference": "Acts 2:33–36",
                "text": "By the right hand of God exalted…"
              },
              {
                "reference": "Revelation 1:17–18",
                "text": "I am the first and the last."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Names the major identity-bearing elements in apostolic witness to Jesus."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the apostles move from historical events to identity declaration: Jesus is Lord and Christ."
              },
              {
                "level": "Application",
                "expectation": "Shows how apostolic preaching functions as public witness to who Jesus is, not only to what hearers must do."
              },
              {
                "level": "Defense",
                "expectation": "Presents the structure of apostolic witness as a christological argument grounded in Scripture and resurrection."
              }
            ]
          },
          {
            "code": "OG.13.2.18",
            "title": "The Resurrection as Public Vindication of Jesus' Identity and Lordship",
            "statement": "The student can expound the resurrection as the public vindication of Jesus Christ, showing that the resurrection confirms who He is and not merely that He lived again.",
            "scope": "The resurrection remains central, but in this subject its primary force is christological and theological. God vindicates Jesus openly, overturns the verdict of men, and publicly declares Him Lord and Christ. The student must be able to explain why apostolic preaching uses resurrection as identity-confirming witness and not only as the basis of personal salvation hope.",
            "instructionalFocus": "Teach the resurrection as the open declaration that Jesus is who the apostles say He is. This keeps the emphasis on identity while preserving continuity with NB, where the resurrection also functions in gospel-response structure.",
            "vocabulary": [
              "Apostolic witness",
              "Kerygma",
              "Vindication",
              "Exaltation",
              "Lordship declaration",
              "Right-hand language"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:22–36",
                "text": "This Jesus hath God raised up…"
              },
              {
                "reference": "Acts 3:12–16",
                "text": "Why marvel ye at this?"
              },
              {
                "reference": "Acts 10:36–43",
                "text": "He is Lord of all."
              },
              {
                "reference": "Acts 13:27–33",
                "text": "God hath fulfilled… in that he hath raised up Jesus again."
              },
              {
                "reference": "1 Corinthians 15:1–20",
                "text": "If Christ be not raised…"
              },
              {
                "reference": "Psalm 110:1",
                "text": "Sit thou at my right hand."
              },
              {
                "reference": "Acts 2:33–36",
                "text": "By the right hand of God exalted…"
              },
              {
                "reference": "Revelation 1:17–18",
                "text": "I am the first and the last."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the resurrection publicly vindicates Jesus."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why the resurrection confirms Jesus' identity and lordship in apostolic preaching."
              },
              {
                "level": "Application",
                "expectation": "Uses resurrection texts to show how apostolic witness declares Jesus openly before the world."
              },
              {
                "level": "Defense",
                "expectation": "Responds to reduced readings of resurrection by showing its force as public vindication of Jesus Christ."
              }
            ]
          },
          {
            "code": "OG.13.3.18",
            "title": "\"The Right Hand of God\" as Language of Authority and Exaltation",
            "statement": "The student can explain why \"the right hand of God\" is language of authority, exaltation, and public vindication rather than a spatial description of two divine beings.",
            "scope": "The student must show that right-hand language belongs to biblical authority imagery, not to a diagram of multiple divine persons. This standard remains fully OG-owned because it answers an identity and interpretation question: how should apostolic exaltation language be read without dividing God? The point is the revealed authority of Jesus Christ.",
            "instructionalFocus": "Use Psalm 110, Acts 2, and related passages to show that right-hand language is about enthronement and authority. The goal is to remove one of the most common visual misunderstandings about the Godhead.",
            "vocabulary": [
              "Apostolic witness",
              "Kerygma",
              "Vindication",
              "Exaltation",
              "Lordship declaration",
              "Right-hand language"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:22–36",
                "text": "This Jesus hath God raised up…"
              },
              {
                "reference": "Acts 3:12–16",
                "text": "Why marvel ye at this?"
              },
              {
                "reference": "Acts 10:36–43",
                "text": "He is Lord of all."
              },
              {
                "reference": "Acts 13:27–33",
                "text": "God hath fulfilled… in that he hath raised up Jesus again."
              },
              {
                "reference": "1 Corinthians 15:1–20",
                "text": "If Christ be not raised…"
              },
              {
                "reference": "Psalm 110:1",
                "text": "Sit thou at my right hand."
              },
              {
                "reference": "Acts 2:33–36",
                "text": "By the right hand of God exalted…"
              },
              {
                "reference": "Revelation 1:17–18",
                "text": "I am the first and the last."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that \"right hand\" is authority language, not spatial proof of two divine beings."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the biblical meaning of right-hand language using Psalms and Acts."
              },
              {
                "level": "Application",
                "expectation": "Shows how exaltation language can be interpreted without dividing God."
              },
              {
                "level": "Defense",
                "expectation": "Responds to visual or spatial arguments for multiple divine persons by presenting the authority meaning of right-hand language."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.14",
        "domainTitle": "Historical Distortion and the Rise of Trinitarian Formulation",
        "anchorScripture": {
          "reference": "Galatians 1:8–9",
          "text": "If any man preach any other gospel… let him be accursed."
        },
        "standards": [
          {
            "code": "OG.14.1.18",
            "title": "The Apostolic Oneness Baseline — First-Century Evidence",
            "statement": "The student can demonstrate that the first-century apostolic church baptized in Jesus's name, proclaimed the full deity of Jesus as the one God incarnate, and operated within Hebrew monotheism — and can cite historical evidence that this pattern preceded the later trinitarian development.",
            "scope": "The case for Oneness as apostolic and historical rests on the NT itself and the earliest post-apostolic evidence. The student must be able to show: (1) all NT baptismal records use Jesus's name only; (2) the earliest post-apostolic writers (Clement, Ignatius, Polycarp) describe Jesus as God and Lord without trinitarian person-distinctions; (3) the trinitarian vocabulary (three persons, homoousios) is absent from the NT and the earliest writers. This establishes Oneness theology not as a new revelation but as the original baseline from which later theology departed.",
            "instructionalFocus": "This standard requires students to think historically, not just scripturally. Help them understand that doctrinal development is a real historical phenomenon, and that \"what the church has always believed\" needs to be tested against the earliest evidence, not the later creeds.",
            "vocabulary": [
              "Apostolic Fathers",
              "Greek Apologists",
              "Tertullian",
              "Origen",
              "Council of Nicea (325 AD)",
              "Modalism"
            ],
            "anchorScriptures": [
              {
                "reference": "Galatians 1:8–9",
                "text": "If any man preach any other gospel… let him be accursed."
              },
              {
                "reference": "Acts 20:29–30",
                "text": "Grievous wolves shall enter… speaking perverse things, to draw away disciples after them."
              },
              {
                "reference": "2 Thessalonians 2:3",
                "text": "There shall come a falling away first."
              },
              {
                "reference": "2 Timothy 4:3–4",
                "text": "They shall not endure sound doctrine… and shall be turned unto fables."
              },
              {
                "reference": "1 John 4:1",
                "text": "Believe not every spirit, but try the spirits whether they are of God."
              },
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "Revelation 2:4–5",
                "text": "Thou hast left thy first love… remember therefore from whence thou art fallen, and repent."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Oneness theology is the original apostolic position."
              },
              {
                "level": "Explanation",
                "expectation": "Cites NT evidence (baptismal formula, Christological declarations) and notes the absence of trinitarian technical vocabulary in the NT."
              },
              {
                "level": "Application",
                "expectation": "Shows the timeline: NT → Apostolic Fathers (pre-trinitarian language) → Greek Apologists (Logos theology enters) → Tertullian (trinitas coined) → Nicea (homoousios formulated) — the drift is progressive, not original."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the trinity is taught clearly in the NT, shown by Matthew 28:19 and 2 Corinthians 13:14 — demonstrating that while three names/titles appear in these texts, the technical doctrine of three co-equal co-eternal persons is not stated or implied in the NT itself."
              }
            ]
          },
          {
            "code": "OG.14.2.18",
            "title": "The Greek Philosophical Pressure — Logos Theology and Person-Language",
            "statement": "The student can explain how Greek philosophical categories — particularly the Stoic/Platonic Logos concept and the Latin term persona — entered Christian theology in the 2nd–3rd centuries and how their adoption created conceptual frameworks that eventually produced the trinitarian formulation.",
            "scope": "The Greek Apologists (Justin Martyr in particular) identified the Logos of John 1:1 with the Stoic Logos — the divine rational principle animating the universe. This move was initially apologetically motivated (making Christianity intelligible to educated Greeks) but theologically consequential: it introduced a sub-divine mediating figure (the Logos/Son) between God and creation. Tertullian's use of persona (originally a Latin theater term for a character's mask) to describe Father, Son, and Spirit introduced the \"person\" language — but Tertullian's \"persons\" were more like roles or aspects than the full ontological persons of later orthodoxy. The student must understand how these terminological introductions shaped the subsequent debate.",
            "instructionalFocus": "This is the most historically demanding standard. Approach it carefully — you are not asking students to be church historians, but to understand the mechanism of the drift. Help them see that the shift from apostolic to trinitarian theology was gradual, philosophically motivated, and politically enabled — not a direct divine revelation.",
            "vocabulary": [
              "Apostolic Fathers",
              "Greek Apologists",
              "Tertullian",
              "Origen",
              "Council of Nicea (325 AD)",
              "Modalism"
            ],
            "anchorScriptures": [
              {
                "reference": "Galatians 1:8–9",
                "text": "If any man preach any other gospel… let him be accursed."
              },
              {
                "reference": "Acts 20:29–30",
                "text": "Grievous wolves shall enter… speaking perverse things, to draw away disciples after them."
              },
              {
                "reference": "2 Thessalonians 2:3",
                "text": "There shall come a falling away first."
              },
              {
                "reference": "2 Timothy 4:3–4",
                "text": "They shall not endure sound doctrine… and shall be turned unto fables."
              },
              {
                "reference": "1 John 4:1",
                "text": "Believe not every spirit, but try the spirits whether they are of God."
              },
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "Revelation 2:4–5",
                "text": "Thou hast left thy first love… remember therefore from whence thou art fallen, and repent."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Greek philosophy influenced early Christian theology on the doctrine of God."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the Logos identification (Justin → John's Logos read through Greek Logos concept) and the persona introduction (Tertullian's theatrical term applied to Father, Son, Spirit)."
              },
              {
                "level": "Application",
                "expectation": "Shows how Paul's warning in Colossians 2:8 (\"philosophy and vain deceit, after the tradition of men\") anticipates precisely this kind of philosophical importation into Christian theology."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the Greek philosophical engagement was necessary for the church to think clearly about God — showing that while philosophical engagement is not inherently wrong, allowing philosophical categories to override or reinterpret plain scriptural statements is precisely what Col. 2:8 warns against."
              }
            ]
          },
          {
            "code": "OG.14.3.18",
            "title": "Distinguishing Oneness from Classical Modalism",
            "statement": "The student can articulate the specific differences between Oneness theology and the classical modalism associated with Sabellius — demonstrating that Oneness does not merely teach that God wears different masks, but that the incarnation involved a genuine, permanent assumption of human nature with real historical interactions.",
            "scope": "The charge of modalism is the most common theological accusation against Oneness theology. The student must be able to respond accurately: Sabellius (3rd century) taught that Father, Son, and Holy Spirit are three successive modes of the one God — the Father mode ended when the Son mode began, and so on (sequential modalism). Oneness theology teaches: (1) the Father and Spirit are not separate modes from the Son — the Spirit of God is the Father in Jesus; (2) the Father-Son distinction is real within the incarnation: the divine Spirit (Father) genuinely interacted with the human nature (Son); (3) the distinction is permanent in the sense that Jesus permanently bears human nature in his glorified state; (4) Oneness does not require that God cannot be personally present everywhere simultaneously while also dwelling incarnationally in Jesus.",
            "instructionalFocus": "This standard is crucial for the doctrinal integrity of Oneness theology. Students who cannot distinguish Oneness from modalism will either be vulnerable to the accusation or will inadvertently slide into actual modalism. Build the distinction clearly and return to it often.",
            "vocabulary": [
              "Apostolic Fathers",
              "Greek Apologists",
              "Tertullian",
              "Origen",
              "Council of Nicea (325 AD)",
              "Modalism"
            ],
            "anchorScriptures": [
              {
                "reference": "Galatians 1:8–9",
                "text": "If any man preach any other gospel… let him be accursed."
              },
              {
                "reference": "Acts 20:29–30",
                "text": "Grievous wolves shall enter… speaking perverse things, to draw away disciples after them."
              },
              {
                "reference": "2 Thessalonians 2:3",
                "text": "There shall come a falling away first."
              },
              {
                "reference": "2 Timothy 4:3–4",
                "text": "They shall not endure sound doctrine… and shall be turned unto fables."
              },
              {
                "reference": "1 John 4:1",
                "text": "Believe not every spirit, but try the spirits whether they are of God."
              },
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "Revelation 2:4–5",
                "text": "Thou hast left thy first love… remember therefore from whence thou art fallen, and repent."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Oneness and classical modalism are different positions."
              },
              {
                "level": "Explanation",
                "expectation": "Defines classical modalism (sequential modes, Father mode replaced by Son mode) and contrasts it with Oneness theology (simultaneous Father-Son distinction in the incarnation, genuine human nature permanently assumed)."
              },
              {
                "level": "Application",
                "expectation": "Shows the specific Oneness theological claims that distinguish it from Sabellianism: the Father dwells in the Son (John 14:10 — simultaneous, not sequential); the Son is the genuine human nature, not a mask; the Spirit is poured out to all while also dwelling specifically in Jesus."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the trinitarian accusation that \"Oneness is just Sabellianism\" by showing the specific doctrinal distinctions — and by pointing out that the early modalists themselves were far more biblical than their trinitarian opponents in their insistence on one God, even if their framework was imprecise."
              }
            ]
          },
          {
            "code": "OG.14.4.18",
            "title": "Nicea, Arianism, and the Political Dimension of the Creed",
            "statement": "The student can explain the circumstances of the Council of Nicea (325 AD), the Arian controversy that prompted it, the political role of Emperor Constantine in calling and enforcing its decisions, and why the resulting Nicene Creed — while correctly rejecting Arianism — introduced and enshrined philosophical categories (homoousios) not found in Scripture.",
            "scope": "The Council of Nicea (325 AD) was called by Emperor Constantine to resolve the doctrinal conflict over Arianism (Arius's teaching that the Son was the first created being, not eternally divine). The council correctly rejected Arianism by affirming the Son is of the same substance (homoousios) as the Father. However, the student must understand: (1) homoousios is not a biblical word — it is a Greek philosophical term; (2) Constantine had political motivations for forcing a settlement (imperial unity required religious unity); (3) the enforced creed shut down ongoing theological discussion; (4) the modalist/Oneness position (widespread in the pre-Nicene church) was also excluded, leaving only the developing trinitarian framework as the officially acceptable option. The student does not need to dismiss Nicea entirely but must understand its limits.",
            "instructionalFocus": "Teach this standard with humility and precision. Students need to understand that Nicea did something right (rejecting the most radical Arianism) while doing something theologically problematic (enshrining philosophical vocabulary as binding creed). This is not cynicism — it is historical theology.",
            "vocabulary": [
              "Apostolic Fathers",
              "Greek Apologists",
              "Tertullian",
              "Origen",
              "Council of Nicea (325 AD)",
              "Modalism"
            ],
            "anchorScriptures": [
              {
                "reference": "Galatians 1:8–9",
                "text": "If any man preach any other gospel… let him be accursed."
              },
              {
                "reference": "Acts 20:29–30",
                "text": "Grievous wolves shall enter… speaking perverse things, to draw away disciples after them."
              },
              {
                "reference": "2 Thessalonians 2:3",
                "text": "There shall come a falling away first."
              },
              {
                "reference": "2 Timothy 4:3–4",
                "text": "They shall not endure sound doctrine… and shall be turned unto fables."
              },
              {
                "reference": "1 John 4:1",
                "text": "Believe not every spirit, but try the spirits whether they are of God."
              },
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "Revelation 2:4–5",
                "text": "Thou hast left thy first love… remember therefore from whence thou art fallen, and repent."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States the basic situation: Nicea addressed Arianism and produced the homoousios formula."
              },
              {
                "level": "Explanation",
                "expectation": "Explains Arianism, the Nicene response, the meaning of homoousios, and the non-biblical origin of that term."
              },
              {
                "level": "Application",
                "expectation": "Shows the political dimension: Constantine's role, the enforcement of the creed, and the marginalization of non-trinitarian positions — demonstrating that Nicea was as much a political event as a theological one."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that Nicea simply articulated what the church had always believed — showing that (a) the pre-Nicene church was theologically diverse, with significant Oneness-sympathetic and subordinationist streams; (b) the technical homoousios formula was new; (c) the enforcement was political, not merely theological; and (d) the NT itself never uses the language that Nicea codified."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "OG.15",
        "domainTitle": "Doctrinal Discernment, Defense, and World-Facing Stability",
        "anchorScripture": {
          "reference": "Jude 3",
          "text": "Earnestly contend for the faith which was once delivered unto the saints."
        },
        "standards": [
          {
            "code": "OG.15.1.18",
            "title": "Naming and Distinguishing the Theological Alternatives",
            "statement": "The student can accurately identify and define the major alternative theological positions regarding the identity of God and Christ — trinitarianism, Arianism, Unitarianism, Jehovah's Witnesses, Mormonism, and classical modalism — and can show exactly where each differs from Oneness apostolic theology.",
            "scope": "The ability to accurately represent other theological positions is a prerequisite for meaningful doctrinal engagement. A student who characterizes trinitarianism as \"they believe in three gods\" has not yet met this standard. Each position must be represented at its best: (1) Trinitarianism — one God in three co-equal, co-eternal persons; (2) Arianism/JW — Jesus is the first created being, a secondary divine figure; (3) Unitarianism — God is one person (the Father), Jesus is a great human teacher; (4) Mormonism — three separate divine beings, polytheism; (5) Classical modalism — Father, Son, Spirit are sequential masks, not simultaneous. The student must then show the precise difference between each position and Oneness theology.",
            "instructionalFocus": "Run this as a role-play exercise. Have students represent the theological positions to each other accurately before they argue against them. The goal is not to win arguments but to understand the actual territory of the disagreement — which is a prerequisite for genuine witness.",
            "vocabulary": [
              "Apologetics",
              "Arianism",
              "Classical Trinitarianism",
              "Unitarianism",
              "Oneness Pentecostalism",
              "Discernment"
            ],
            "anchorScriptures": [
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "Be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "2 Timothy 2:15",
                "text": "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
              },
              {
                "reference": "1 John 4:1",
                "text": "Try the spirits whether they are of God: for many false prophets are gone out into the world."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "2 Timothy 3:16–17",
                "text": "All scripture is given by inspiration of God… that the man of God may be perfect, throughly furnished unto all good works."
              },
              {
                "reference": "Matthew 7:15",
                "text": "Beware of false prophets, which come to you in sheep's clothing."
              },
              {
                "reference": "Acts 17:11",
                "text": "They received the word with all readiness of mind, and searched the scriptures daily."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Can name the four main alternative positions."
              },
              {
                "level": "Explanation",
                "expectation": "Accurately defines each position at its strongest, fairest formulation."
              },
              {
                "level": "Application",
                "expectation": "Shows the precise point at which each position departs from Oneness theology — different departure points for each."
              },
              {
                "level": "Defense",
                "expectation": "Engages a specific challenge from each of the four positions using scriptural argument — without caricature, without hostility, with doctrinal precision."
              }
            ]
          },
          {
            "code": "OG.15.2.18",
            "title": "The Pastoral Dimension of Doctrinal Conviction",
            "statement": "The student can articulate how doctrinal conviction and pastoral love are not in tension — demonstrating from the example of Paul, Peter, and Jesus himself that the most passionate doctrinal defense is driven by love for truth and love for persons, never by contempt for those who disagree.",
            "scope": "The temperament of doctrinal engagement is as important as its content. A student who has mastered the arguments but engages with arrogance, contempt, or theatrical controversy has not met this standard. The model is Paul in Acts 17 — he engaged the Athenian philosophers with intellectual respect, used their own poets, and left space for genuine inquiry. The model is also Peter in 1 Peter 3:15 — \"with meekness and fear.\" The goal of doctrinal engagement is not domination but witness. Students must understand that winning an argument with a family member about baptism is not the goal — loving them into the kingdom is.",
            "instructionalFocus": "Close every discussion of doctrinal defense by asking: \"What is the goal?\" The goal is people — specific, precious, loved people who need the truth. Doctrine is not a weapon; it is a gift. Students who understand this will engage differently than students who are merely right.",
            "vocabulary": [
              "Apologetics",
              "Arianism",
              "Classical Trinitarianism",
              "Unitarianism",
              "Oneness Pentecostalism",
              "Discernment"
            ],
            "anchorScriptures": [
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "Be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "2 Timothy 2:15",
                "text": "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
              },
              {
                "reference": "1 John 4:1",
                "text": "Try the spirits whether they are of God: for many false prophets are gone out into the world."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "2 Timothy 3:16–17",
                "text": "All scripture is given by inspiration of God… that the man of God may be perfect, throughly furnished unto all good works."
              },
              {
                "reference": "Matthew 7:15",
                "text": "Beware of false prophets, which come to you in sheep's clothing."
              },
              {
                "reference": "Acts 17:11",
                "text": "They received the word with all readiness of mind, and searched the scriptures daily."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that doctrinal defense should be done with love and humility."
              },
              {
                "level": "Explanation",
                "expectation": "Articulates the biblical basis: 1 Pet. 3:15 (\"meekness and fear\"), Acts 17 (Paul's respectful engagement), 2 Tim. 2:24–25 (\"the servant of the Lord must not strive… in meekness instructing those that oppose themselves\")."
              },
              {
                "level": "Application",
                "expectation": "Describes a real or realistic scenario of doctrinal conversation with a family member or friend, demonstrating how to hold conviction firmly and engage warmly simultaneously — not softening the doctrine but not weaponizing it either."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the charge that Oneness theology is inherently divisive and unkind — showing that the divisiveness is often in the manner, not the matter; and that the most loving thing anyone can do for another person is tell them the truth about God, done with genuine care."
              }
            ]
          },
          {
            "code": "OG.15.3.18",
            "title": "Stability Under Challenge — Doctrinal Maturity in Real Life",
            "statement": "The student demonstrates the capacity to maintain doctrinal stability — not anxiety, not anger, not collapse — when challenged on core Oneness convictions in real or realistic settings, and can articulate why their conviction rests on Scripture, not on social reinforcement or emotional experience alone.",
            "scope": "The .18 benchmark is about readiness — not just theoretical knowledge but dispositional stability. A student who knows the arguments but panics under challenge, or who cannot maintain conviction when family members apply social pressure, or who cannot distinguish between genuine doctrinal challenge and emotional manipulation has not yet reached .18 readiness. This standard asks: when the rubber meets the road — in a college classroom, a family thanksgiving table, a conversation with a trinitarian mentor — does the student hold the ground, engage wisely, and remain in love? This is the integration of all fifteen domains.",
            "instructionalFocus": "This is the capstone standard of the entire document. Everything in Domains 1–14 has been building toward this: a young person who knows who God is, why they know it, and can stand in that knowledge with warmth, clarity, and grace in a world that will challenge it at every turn. That is the .18 benchmark.",
            "vocabulary": [
              "Apologetics",
              "Arianism",
              "Classical Trinitarianism",
              "Unitarianism",
              "Oneness Pentecostalism",
              "Discernment"
            ],
            "anchorScriptures": [
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "Be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "2 Timothy 2:15",
                "text": "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
              },
              {
                "reference": "1 John 4:1",
                "text": "Try the spirits whether they are of God: for many false prophets are gone out into the world."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "2 Timothy 3:16–17",
                "text": "All scripture is given by inspiration of God… that the man of God may be perfect, throughly furnished unto all good works."
              },
              {
                "reference": "Matthew 7:15",
                "text": "Beware of false prophets, which come to you in sheep's clothing."
              },
              {
                "reference": "Acts 17:11",
                "text": "They received the word with all readiness of mind, and searched the scriptures daily."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States the importance of doctrinal stability under pressure."
              },
              {
                "level": "Explanation",
                "expectation": "Articulates why scriptural grounding produces stability: the conviction is not based on feeling good or having a community that agrees, but on what is written."
              },
              {
                "level": "Application",
                "expectation": "Role-plays a realistic challenging scenario (college philosophy professor, trinitarian grandparent, skeptical friend) with doctrinal precision, emotional groundedness, and relational warmth."
              },
              {
                "level": "Defense",
                "expectation": "Demonstrates the capacity to say \"I don't know the answer to that, but I know what I believe and why\" without collapsing into uncertainty — maintaining the distinction between genuine open questions and settled convictions."
              }
            ]
          },
          {
            "code": "OG.15.4.18",
            "title": "World-Facing Stability Under Alternate Religions, Counterfeit Christian Claims, and Social Pressure",
            "statement": "The student can maintain doctrinal clarity and spiritual composure when facing alternate religions, counterfeit Christian claims, academic skepticism, and relational pressure concerning the identity of God.",
            "scope": "This standard extends doctrinal maturity into real adult environments. The student must be ready not only for formal debate, but for the subtler pressures that come from persuasive teachers, admired friends, family tension, college settings, missionary situations, and competing religious systems. The issue is not merely whether the student can repeat arguments, but whether the student can remain stable, charitable, and unshaken while hearing serious alternate claims. A .18-level disciple should be able to enter a world of religious diversity and intellectual pressure without surrendering the apostolic doctrine of God.",
            "instructionalFocus": "Build this standard through realistic scenarios. Students should practice responding to trinitarian claims, Jehovah's Witness argumentation, Unitarian reductionism, Mormon polytheism, secular skepticism, and interreligious pressure with scripture, composure, and unmistakable doctrinal steadiness.",
            "vocabulary": [
              "Apologetics",
              "Arianism",
              "Classical Trinitarianism",
              "Unitarianism",
              "Oneness Pentecostalism",
              "Discernment"
            ],
            "anchorScriptures": [
              {
                "reference": "Jude 3",
                "text": "Earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "Be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "2 Timothy 2:15",
                "text": "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
              },
              {
                "reference": "1 John 4:1",
                "text": "Try the spirits whether they are of God: for many false prophets are gone out into the world."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men."
              },
              {
                "reference": "2 Timothy 3:16–17",
                "text": "All scripture is given by inspiration of God… that the man of God may be perfect, throughly furnished unto all good works."
              },
              {
                "reference": "Matthew 7:15",
                "text": "Beware of false prophets, which come to you in sheep's clothing."
              },
              {
                "reference": "Acts 17:11",
                "text": "They received the word with all readiness of mind, and searched the scriptures daily."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that real-world pressures against apostolic doctrine come from more than one direction."
              },
              {
                "level": "Explanation",
                "expectation": "Identifies several major pressures — alternate Christian systems, other religions, academic skepticism, and relational pressure — and explains why each can unsettle an unformed disciple."
              },
              {
                "level": "Application",
                "expectation": "Responds to realistic scenarios with scriptural clarity, emotional steadiness, and accurate distinction between the apostolic position and its alternatives."
              },
              {
                "level": "Defense",
                "expectation": "Demonstrates mature world-facing stability by holding the apostolic doctrine of God clearly and charitably under sustained religious, intellectual, and social pressure."
              }
            ]
          }
        ]
      }
    ]
  },
  "NB": {
    "code": "NB",
    "title": "The New Birth",
    "color": "#dc2626",
    "domains": [
      {
        "domainCode": "NB.1",
        "domainTitle": "Sin, Human Fall, and the Need for New Birth",
        "anchorScripture": {
          "reference": "Genesis 2:15–17",
          "text": "Of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die."
        },
        "standards": [
          {
            "code": "NB.1.1.18",
            "title": "Sin as Rebellion Against God and the Cause of Human Separation",
            "statement": "The learner demonstrates that sin is rebellion against God and the cause of human guilt, corruption, and separation — and that this definition is essential to understanding why the new birth is necessary.",
            "scope": "This standard establishes that sin must be defined theologically, not socially or emotionally. Sin is not poor choice or cultural limitation only — it is violation of God's will and rebellion against His rule. A weak doctrine of sin produces a weak doctrine of salvation. The learner must understand sin as a relational and moral rupture before God, explaining its consequences: guilt (real accountability), corruption (inward disorder), and separation (broken communion). If sin is softened, the new birth becomes self-help rather than rescue.",
            "instructionalFocus": "Teach sin from Scripture, not from cultural conversation. Begin with Genesis 2–17 and 3:1–24 to show the original command, the act, and the consequence. Move to Psalm 51 for inward conviction. Use Romans 3 and 5 to establish universality. A learner who feels the seriousness of human separation from God will understand the new birth with appropriate weight.",
            "vocabulary": [
              "Sin",
              "The Fall",
              "Corruption",
              "Separation",
              "Judgment",
              "Guilt",
              "Death",
              "Human Condition",
              "Need for Salvation",
              "New Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 2:15–17",
                "text": "Of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die."
              },
              {
                "reference": "Genesis 3:1–24",
                "text": "And the LORD God said, Behold, the man is become as one of us, to know good and evil..."
              },
              {
                "reference": "Genesis 6:5",
                "text": "Every imagination of the thoughts of his heart was only evil continually."
              },
              {
                "reference": "Psalm 51:1–5",
                "text": "Behold, I was shapen in iniquity; and in sin did my mother conceive me."
              },
              {
                "reference": "Isaiah 59:1–2",
                "text": "Your iniquities have separated between you and your God, and your sins have hid his face from you."
              },
              {
                "reference": "Romans 3:10–23",
                "text": "There is none righteous, no, not one... for all have sinned, and come short of the glory of God."
              },
              {
                "reference": "Romans 5:12–19",
                "text": "Wherefore, as by one man sin entered into the world, and death by sin; and so death passed upon all men..."
              },
              {
                "reference": "Romans 6:23",
                "text": "The wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Ephesians 2:1–3",
                "text": "And you hath he quickened, who were dead in trespasses and sins..."
              },
              {
                "reference": "1 John 1:8–10",
                "text": "If we say that we have no sin, we deceive ourselves, and the truth is not in us."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that sin separates people from God and that everyone has sinned; can cite Romans 3:23."
              },
              {
                "level": "Explanation",
                "expectation": "Explains sin as rebellion against God rather than weakness or mistake, and names guilt, corruption, and separation as its consequences; distinguishes sin from limitation."
              },
              {
                "level": "Application",
                "expectation": "Shows how the doctrinal definition of sin makes the new birth necessary — not as improvement but as rescue from rebellion and real separation from God; applies this to gospel teaching."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that sin is merely cultural or psychological, defending the scriptural definition of sin as rebellion and explaining why softening this definition undermines the doctrine of salvation."
              }
            ]
          },
          {
            "code": "NB.1.2.18",
            "title": "The Fall as the Beginning of Man's Ruined Condition",
            "statement": "The learner demonstrates that the fall introduces corruption, alienation, shame, judgment, and death into human life — and that it provides the essential doctrinal background for understanding why salvation is not optional.",
            "scope": "The fall explains the present condition of humanity. Every person born since carries the consequences of what was lost in Genesis 3: broken access to God, corrupted nature, mortality, and alienation from the divine presence. The new birth answers what the fall introduced — cleansing answers corruption, reconciliation answers separation, life answers death. Without this connection, the new birth floats as a spiritual preference rather than a redemptive necessity.",
            "instructionalFocus": "Help learners feel the loss introduced in Genesis 3 before they reach the rescue of the new birth. Walk slowly through the fall narrative: the beauty of the garden, the divine provision, the command, the deception, the act, the rupture, the expulsion. Let them sit with what was broken before offering what is restored.",
            "vocabulary": [
              "Sin",
              "The Fall",
              "Corruption",
              "Separation",
              "Judgment",
              "Guilt",
              "Death",
              "Human Condition",
              "Need for Salvation",
              "New Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 2:15–17",
                "text": "Of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die."
              },
              {
                "reference": "Genesis 3:1–24",
                "text": "And the LORD God said, Behold, the man is become as one of us, to know good and evil..."
              },
              {
                "reference": "Genesis 6:5",
                "text": "Every imagination of the thoughts of his heart was only evil continually."
              },
              {
                "reference": "Psalm 51:1–5",
                "text": "Behold, I was shapen in iniquity; and in sin did my mother conceive me."
              },
              {
                "reference": "Isaiah 59:1–2",
                "text": "Your iniquities have separated between you and your God, and your sins have hid his face from you."
              },
              {
                "reference": "Romans 3:10–23",
                "text": "There is none righteous, no, not one... for all have sinned, and come short of the glory of God."
              },
              {
                "reference": "Romans 5:12–19",
                "text": "Wherefore, as by one man sin entered into the world, and death by sin; and so death passed upon all men..."
              },
              {
                "reference": "Romans 6:23",
                "text": "The wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Ephesians 2:1–3",
                "text": "And you hath he quickened, who were dead in trespasses and sins..."
              },
              {
                "reference": "1 John 1:8–10",
                "text": "If we say that we have no sin, we deceive ourselves, and the truth is not in us."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the fall brought sin and death into human experience and is the background for understanding salvation; can locate Genesis 3."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the fall affects all of human life and names corruption, separation, shame, judgment, and death as its consequences; connects Genesis 3 to Romans 5:12."
              },
              {
                "level": "Application",
                "expectation": "Connects the fall to the necessity of the new birth — showing how each element of new-birth doctrine answers something the fall introduced; demonstrates the theological logic with at least three specific connections."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that the fall is only a myth without doctrinal consequence, showing that Paul's argument in Romans 5 requires a real historical fall as the basis for a real historical redemption."
              }
            ]
          },
          {
            "code": "NB.1.3.18",
            "title": "The Universal Need for Salvation",
            "statement": "The learner demonstrates that all people stand in need of salvation because all are under sin and accountable to God — regardless of moral effort, religious background, or sincerity.",
            "scope": "The need for salvation is universal. No human category stands outside the problem of sin. Religious background, moral effort, or sincerity do not remove the need. A person may be more moral than another and still be equally separated from God without salvation. This universality is the grounds for apostolic mission — because all have sinned and all need the new birth, the gospel goes to all peoples without restriction.",
            "instructionalFocus": "Resist the temptation to make this standard only about the obviously sinful. Use Romans 2–3 to show that both the pagan and the religious person stand under judgment. Help learners develop the ability to speak about universal need without condescension — the goal is to present the need honestly and the rescue with equal force.",
            "vocabulary": [
              "Sin",
              "The Fall",
              "Corruption",
              "Separation",
              "Judgment",
              "Guilt",
              "Death",
              "Human Condition",
              "Need for Salvation",
              "New Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 2:15–17",
                "text": "Of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die."
              },
              {
                "reference": "Genesis 3:1–24",
                "text": "And the LORD God said, Behold, the man is become as one of us, to know good and evil..."
              },
              {
                "reference": "Genesis 6:5",
                "text": "Every imagination of the thoughts of his heart was only evil continually."
              },
              {
                "reference": "Psalm 51:1–5",
                "text": "Behold, I was shapen in iniquity; and in sin did my mother conceive me."
              },
              {
                "reference": "Isaiah 59:1–2",
                "text": "Your iniquities have separated between you and your God, and your sins have hid his face from you."
              },
              {
                "reference": "Romans 3:10–23",
                "text": "There is none righteous, no, not one... for all have sinned, and come short of the glory of God."
              },
              {
                "reference": "Romans 5:12–19",
                "text": "Wherefore, as by one man sin entered into the world, and death by sin; and so death passed upon all men..."
              },
              {
                "reference": "Romans 6:23",
                "text": "The wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Ephesians 2:1–3",
                "text": "And you hath he quickened, who were dead in trespasses and sins..."
              },
              {
                "reference": "1 John 1:8–10",
                "text": "If we say that we have no sin, we deceive ourselves, and the truth is not in us."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that all people need salvation because all have sinned; can cite Romans 3:23."
              },
              {
                "level": "Explanation",
                "expectation": "Explains that moral effort, religious sincerity, and good behavior do not remove the need for salvation — all stand accountable to God because of sin."
              },
              {
                "level": "Application",
                "expectation": "Shows why universal need for salvation is the foundation of apostolic mission — connects the universality of sin to the universality of the apostolic commission."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that good or sincere people do not need the apostolic new birth, showing from Scripture that all require the revealed response to the gospel; does so with clarity and pastoral care."
              }
            ]
          },
          {
            "code": "NB.1.4.18",
            "title": "Synthesis: Sin, Fall, Separation, and Universal Need as the Foundation of the New Birth",
            "statement": "The learner demonstrates doctrinal synthesis by presenting sin, fall, separation, and universal need as the interconnected foundation for the necessity of the new birth.",
            "scope": "The new birth cannot be preached rightly apart from a full doctrine of sin. Sin, fall, guilt, corruption, and separation create the problem that the new birth answers — these are not four separate topics but one interconnected doctrinal foundation. When sin is diminished the cross seems excessive; when the fall is ignored the new birth seems unnecessary; when universality is softened missions loses its urgency.",
            "instructionalFocus": "Ask learners to explain the new birth to someone with no Christian background — and to begin not with the solution but with the problem. A learner who can explain sin, fall, separation, and universal need with clarity and proportion has the doctrinal foundation needed to proclaim the new birth with full apostolic force.",
            "vocabulary": [
              "Sin",
              "The Fall",
              "Corruption",
              "Separation",
              "Judgment",
              "Guilt",
              "Death",
              "Human Condition",
              "Need for Salvation",
              "New Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 2:15–17",
                "text": "Of the tree of the knowledge of good and evil, thou shalt not eat of it: for in the day that thou eatest thereof thou shalt surely die."
              },
              {
                "reference": "Genesis 3:1–24",
                "text": "And the LORD God said, Behold, the man is become as one of us, to know good and evil..."
              },
              {
                "reference": "Genesis 6:5",
                "text": "Every imagination of the thoughts of his heart was only evil continually."
              },
              {
                "reference": "Psalm 51:1–5",
                "text": "Behold, I was shapen in iniquity; and in sin did my mother conceive me."
              },
              {
                "reference": "Isaiah 59:1–2",
                "text": "Your iniquities have separated between you and your God, and your sins have hid his face from you."
              },
              {
                "reference": "Romans 3:10–23",
                "text": "There is none righteous, no, not one... for all have sinned, and come short of the glory of God."
              },
              {
                "reference": "Romans 5:12–19",
                "text": "Wherefore, as by one man sin entered into the world, and death by sin; and so death passed upon all men..."
              },
              {
                "reference": "Romans 6:23",
                "text": "The wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Ephesians 2:1–3",
                "text": "And you hath he quickened, who were dead in trespasses and sins..."
              },
              {
                "reference": "1 John 1:8–10",
                "text": "If we say that we have no sin, we deceive ourselves, and the truth is not in us."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the new birth is necessary because of sin, the fall, and human separation from God; can name the major problem categories."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how sin, fall, and separation work together to create the universal need the new birth addresses; shows the logical sequence: sin → fall → corruption → separation → judgment → need for divine rescue."
              },
              {
                "level": "Application",
                "expectation": "Connects this foundation to the apostolic proclamation of salvation — showing how Peter's sermon at Pentecost and Paul's argument in Romans assume this foundation."
              },
              {
                "level": "Defense",
                "expectation": "Presents sin, fall, separation, and universal need as one coherent doctrinal structure and responds to reduced views that soften any of these categories."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.2",
        "domainTitle": "Promise, Covenant, and the Redemptive Structure of Salvation",
        "anchorScripture": {
          "reference": "Genesis 3:15",
          "text": "I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head..."
        },
        "standards": [
          {
            "code": "NB.2.1.18",
            "title": "Promise and Covenant as the Preparatory Structure for Salvation",
            "statement": "The learner demonstrates that divine promise and covenant form the preparatory biblical structure through which the new birth is later revealed — and that the new birth must be read as covenant fulfillment rather than isolated spiritual experience.",
            "scope": "Salvation doctrine does not begin in the New Testament. Promise and covenant form the redemptive structure that reaches fuller clarity in Christ and the apostolic message. When Peter says \"the promise is unto you\" (Acts 2:39), he is invoking the entire covenant heritage stretching from Genesis onward. The new covenant (Jer. 31) is not a revision but the fullest expression: complete forgiveness, inward transformation, and personal knowledge of God.",
            "instructionalFocus": "Help learners see the Bible as a single redemptive story moving toward the new birth. Begin with Genesis 3:15 and trace the covenant line through the Abrahamic promise, the Exodus redemption, the sacrificial system, and the prophetic new-covenant promises of Jeremiah and Ezekiel. Arrive at Pentecost not as a surprise but as the culmination of everything that came before.",
            "vocabulary": [
              "Promise",
              "Covenant",
              "Sacrifice",
              "Blood",
              "Cleansing",
              "Divine Indwelling",
              "Redemptive Structure",
              "Covenant Fulfillment",
              "Washing",
              "Access to God"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head..."
              },
              {
                "reference": "Genesis 12:1–3",
                "text": "In thee shall all families of the earth be blessed."
              },
              {
                "reference": "Exodus 12:1–14",
                "text": "The blood shall be to you for a token... when I see the blood, I will pass over you."
              },
              {
                "reference": "Exodus 24:3–8",
                "text": "Behold the blood of the covenant, which the LORD hath made with you."
              },
              {
                "reference": "Leviticus 16:1–34",
                "text": "And Aaron shall make an atonement for the holy sanctuary... for all the congregation of Israel."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant... I will put my law in their inward parts, and will be their God."
              },
              {
                "reference": "Ezekiel 36:25–27",
                "text": "Then will I sprinkle clean water upon you... A new spirit will I put within you... I will put my spirit within you."
              },
              {
                "reference": "Hebrews 9:11–15",
                "text": "But Christ being come an high priest... by his own blood he entered in once into the holy place, having obtained eternal redemption."
              },
              {
                "reference": "Hebrews 10:19–22",
                "text": "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus... let us draw near with a true heart in full assurance of faith."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that God makes promises across Scripture pointing toward salvation, and names covenant as a key biblical category; can locate at least two covenant passages."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the sequence of God's covenant-promises and how each builds the category of salvation later fulfilled in Christ and the new birth."
              },
              {
                "level": "Application",
                "expectation": "Shows how the new birth must be interpreted as covenant fulfillment — not isolated experience but the realization of what God had been promising for centuries; can explain why Acts 2:39 draws on this covenant heritage."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Old Testament covenants are irrelevant to New Testament salvation, demonstrating that the apostolic proclamation of the new birth is unintelligible without them."
              }
            ]
          },
          {
            "code": "NB.2.2.18",
            "title": "Sacrifice, Blood, and Cleansing as Preparatory Categories for the New Birth",
            "statement": "The learner demonstrates that sacrifice, blood, and cleansing are essential preparatory biblical categories for understanding the new birth — and can explain how each prepares the logic of salvation.",
            "scope": "The new birth cannot be fully understood apart from the categories of sacrifice and cleansing. Blood and washing are not decorative biblical themes — they carry doctrinal weight. The Day of Atonement establishes the annual need for blood-sacrifice that Hebrews declares is met once for all by Christ. Removing this background flattens the meaning of remission, washing, and the blood of Christ in apostolic proclamation.",
            "instructionalFocus": "Walk learners through the sacrificial system not as religious archaeology but as doctrinal preparation. The categories of blood, atonement, washing, and cleansing are not superseded without trace — they are fulfilled and given their ultimate meaning in Christ.\n\nInstructional Focus Extension: Old Covenant Remembrance and New Covenant Remission\n\nInsert Text: Teach the contrast between Old Covenant remembrance of sins and New Covenant remission. Under the sacrificial system, sin was addressed in a temporary and anticipatory way, but the conscience-cleansing and final remission promised in the new covenant required the death, blood, and mediating work of Jesus Christ. The new birth should therefore be taught not merely as forgiveness language but as covenant application: the saving work of Christ is applied through the apostolic response of repentance, baptism in Jesus' name for remission, and reception of the Spirit.\n\nThis strengthens the learner's ability to connect Hebrews 9–10, Jeremiah 31, Ezekiel 36, Acts 2:38, and Acts 22:16 without treating baptism as a disconnected ritual.",
            "vocabulary": [
              "Promise",
              "Covenant",
              "Sacrifice",
              "Blood",
              "Cleansing",
              "Divine Indwelling",
              "Redemptive Structure",
              "Covenant Fulfillment",
              "Washing",
              "Access to God"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head..."
              },
              {
                "reference": "Genesis 12:1–3",
                "text": "In thee shall all families of the earth be blessed."
              },
              {
                "reference": "Exodus 12:1–14",
                "text": "The blood shall be to you for a token... when I see the blood, I will pass over you."
              },
              {
                "reference": "Exodus 24:3–8",
                "text": "Behold the blood of the covenant, which the LORD hath made with you."
              },
              {
                "reference": "Leviticus 16:1–34",
                "text": "And Aaron shall make an atonement for the holy sanctuary... for all the congregation of Israel."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant... I will put my law in their inward parts, and will be their God."
              },
              {
                "reference": "Ezekiel 36:25–27",
                "text": "Then will I sprinkle clean water upon you... A new spirit will I put within you... I will put my spirit within you."
              },
              {
                "reference": "Hebrews 9:11–15",
                "text": "But Christ being come an high priest... by his own blood he entered in once into the holy place, having obtained eternal redemption."
              },
              {
                "reference": "Hebrews 10:19–22",
                "text": "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus... let us draw near with a true heart in full assurance of faith."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Scripture connects sacrifice and cleansing to the forgiveness of sin; can cite Leviticus 16 and Hebrews 9–10."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how blood and cleansing function in the Old Testament sacrificial system and how these categories prepare the New Testament teaching on remission and washing."
              },
              {
                "level": "Application",
                "expectation": "Shows how the apostolic categories of remission (Acts 2:38), washing (Acts 22:16), and the blood of Christ are intelligible only within the preparatory sacrificial and cleansing categories of the Old Testament."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Old Testament sacrifice is irrelevant to the new birth, showing that the apostolic proclamation of forgiveness and cleansing depends on these categories for its meaning."
              }
            ]
          },
          {
            "code": "NB.2.3.18",
            "title": "Divine Dwelling Promise as Preparatory for Spirit-Born Covenant Life",
            "statement": "The learner demonstrates that the promise of God dwelling with and within His people runs through covenant revelation and prepares the doctrine of Spirit-born new-covenant life.",
            "scope": "Divine indwelling is not a late spiritual idea. The desire of God to dwell with His people runs through the entire Old Testament — from the garden, through the tabernacle and temple, through Ezekiel 36:27 and Joel 2:28–29. God said: \"I will put my spirit within you, and cause you to walk in my statutes.\" The Holy Spirit given in the new birth is the answer to what God promised. The learner must explain Spirit reception as the fulfillment of God's longstanding covenant intention.",
            "instructionalFocus": "Help learners feel the weight of God's desire to dwell with His people. When Christ ascends and pours out the Spirit, He is not doing something new — He is doing what God always intended. A learner who understands the divine-dwelling trajectory will understand why receiving the Spirit is not an optional upgrade but the arrival of what God always promised to provide.",
            "vocabulary": [
              "Promise",
              "Covenant",
              "Sacrifice",
              "Blood",
              "Cleansing",
              "Divine Indwelling",
              "Redemptive Structure",
              "Covenant Fulfillment",
              "Washing",
              "Access to God"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head..."
              },
              {
                "reference": "Genesis 12:1–3",
                "text": "In thee shall all families of the earth be blessed."
              },
              {
                "reference": "Exodus 12:1–14",
                "text": "The blood shall be to you for a token... when I see the blood, I will pass over you."
              },
              {
                "reference": "Exodus 24:3–8",
                "text": "Behold the blood of the covenant, which the LORD hath made with you."
              },
              {
                "reference": "Leviticus 16:1–34",
                "text": "And Aaron shall make an atonement for the holy sanctuary... for all the congregation of Israel."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant... I will put my law in their inward parts, and will be their God."
              },
              {
                "reference": "Ezekiel 36:25–27",
                "text": "Then will I sprinkle clean water upon you... A new spirit will I put within you... I will put my spirit within you."
              },
              {
                "reference": "Hebrews 9:11–15",
                "text": "But Christ being come an high priest... by his own blood he entered in once into the holy place, having obtained eternal redemption."
              },
              {
                "reference": "Hebrews 10:19–22",
                "text": "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus... let us draw near with a true heart in full assurance of faith."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that God promises to dwell with His people in the Old Testament and that this promise is fulfilled in the new birth; can locate Ezekiel 36:26–27 and Joel 2:28–29."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the tabernacle, temple, and prophetic indwelling promises all prepare the category of Spirit reception in new-birth doctrine."
              },
              {
                "level": "Application",
                "expectation": "Shows how Peter's proclamation at Pentecost (Acts 2:38–39) and John 14:16–18 draw on the preparatory promise of divine indwelling — and why receiving the Spirit is the fulfillment of covenant promise, not an optional experience."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that the Holy Spirit in the new birth is optional, showing that Scripture presents Spirit reception as the fulfillment of God's covenant promise to dwell within His people."
              }
            ]
          },
          {
            "code": "NB.2.4.18",
            "title": "Synthesis: Promise, Covenant, Sacrifice, Cleansing, and Divine Dwelling as the Redemptive Structure Preparing the New Birth",
            "statement": "The learner demonstrates mature doctrinal synthesis by presenting promise, covenant, sacrifice, cleansing, and divine dwelling as the interconnected redemptive structure that prepares and makes intelligible the doctrine of the new birth.",
            "scope": "These categories belong together. Promise moves toward covenant, covenant involves sacrifice and cleansing, and divine dwelling reaches fulfillment in Spirit-born life. The new birth is intelligible only when read inside this redemptive structure. The learner who can synthesize these preparatory categories will present the new birth not as a formula but as the climax of God's redemptive story.",
            "instructionalFocus": "Close this domain with a comprehensive overview. Help learners see the entire preparatory structure as one connected biblical argument. The new birth is not invented at Pentecost — it is delivered there. God had been preparing it across the whole of Scripture.",
            "vocabulary": [
              "Promise",
              "Covenant",
              "Sacrifice",
              "Blood",
              "Cleansing",
              "Divine Indwelling",
              "Redemptive Structure",
              "Covenant Fulfillment",
              "Washing",
              "Access to God"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 3:15",
                "text": "I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head..."
              },
              {
                "reference": "Genesis 12:1–3",
                "text": "In thee shall all families of the earth be blessed."
              },
              {
                "reference": "Exodus 12:1–14",
                "text": "The blood shall be to you for a token... when I see the blood, I will pass over you."
              },
              {
                "reference": "Exodus 24:3–8",
                "text": "Behold the blood of the covenant, which the LORD hath made with you."
              },
              {
                "reference": "Leviticus 16:1–34",
                "text": "And Aaron shall make an atonement for the holy sanctuary... for all the congregation of Israel."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant... I will put my law in their inward parts, and will be their God."
              },
              {
                "reference": "Ezekiel 36:25–27",
                "text": "Then will I sprinkle clean water upon you... A new spirit will I put within you... I will put my spirit within you."
              },
              {
                "reference": "Hebrews 9:11–15",
                "text": "But Christ being come an high priest... by his own blood he entered in once into the holy place, having obtained eternal redemption."
              },
              {
                "reference": "Hebrews 10:19–22",
                "text": "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus... let us draw near with a true heart in full assurance of faith."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Names the major preparatory categories for the new birth: promise, covenant, sacrifice, cleansing, and divine dwelling; can give one scripture reference for each."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how these categories relate to one another and how each prepares a dimension of new-birth doctrine; shows the relational logic: promise → covenant → sacrifice → cleansing → divine dwelling → new birth."
              },
              {
                "level": "Application",
                "expectation": "Shows how the apostolic proclamation of the new birth (Acts 2:38–39; Titus 3:5–6) draws on all five preparatory categories together, and explains why the new birth is the fulfillment of a complete biblical structure."
              },
              {
                "level": "Defense",
                "expectation": "Presents promise, covenant, sacrifice, cleansing, and divine dwelling as one coherent redemptive structure — and responds to the claim that the apostolic doctrine of the new birth is a later invention."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.3",
        "domainTitle": "The Gospel as the Basis of New Birth",
        "anchorScripture": {
          "reference": "Isaiah 53:4–12",
          "text": "He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
        },
        "standards": [
          {
            "code": "NB.3.1.18",
            "title": "The Death, Burial, and Resurrection of Christ as the Basis of Salvation",
            "statement": "The learner demonstrates that the death, burial, and resurrection of Christ are the redemptive foundation upon which the doctrine of the new birth stands.",
            "scope": "The gospel is the ground of salvation. When the apostles proclaim salvation, they begin not with instructions but with events: Christ died, was buried, and rose again (1 Cor. 15:1–4). The threefold gospel event must be held together — death, burial, and resurrection form one completed redemptive work. Paul's argument in Romans 6 makes this explicit: baptism is into his death and new life mirrors the resurrection. The new birth is gospel-shaped.",
            "instructionalFocus": "Teach the gospel as event before teaching it as instruction. Help learners feel the weight of what happened in Jerusalem: the death was real, the burial was real, the tomb was empty, the witnesses were many. Then show them how the apostolic response is gospel-shaped.",
            "vocabulary": [
              "Gospel",
              "Redemptive Basis",
              "Atoning Death",
              "Burial",
              "Resurrection",
              "Finished Work",
              "Reconciliation",
              "Gospel Response",
              "Substitutionary Suffering",
              "Victory over Death"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 53:4–12",
                "text": "He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
              },
              {
                "reference": "Matthew 27:45–54",
                "text": "And about the ninth hour Jesus cried with a loud voice... and gave up the ghost."
              },
              {
                "reference": "Matthew 28:5–7",
                "text": "He is not here: for he is risen, as he said."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "Jesus of Nazareth... ye have taken, and by wicked hands have crucified and slain: whom God hath raised up..."
              },
              {
                "reference": "Romans 4:25",
                "text": "Who was delivered for our offences, and was raised again for our justification."
              },
              {
                "reference": "Romans 5:6–11",
                "text": "While we were yet sinners, Christ died for us... we were reconciled to God by the death of his Son."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "1 Corinthians 15:1–8",
                "text": "I declare unto you the gospel... how that Christ died for our sins... And that he was buried, and that he rose again..."
              },
              {
                "reference": "2 Corinthians 5:14–21",
                "text": "He died for all... God was in Christ, reconciling the world unto himself... he hath made him to be sin for us."
              },
              {
                "reference": "1 Peter 2:24",
                "text": "Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the gospel includes Christ's death, burial, and resurrection, and that salvation rests on these events; can cite 1 Corinthians 15:1–4."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what each element of the gospel accomplishes: death deals with sin, burial confirms real death, resurrection vindicates and gives life — and how together they form the redemptive basis of salvation."
              },
              {
                "level": "Application",
                "expectation": "Shows how apostolic proclamation in Acts 2 announces these events and how the gospel response is shaped by the gospel event; traces the movement from Acts 2:22–36 to 2:37–38."
              },
              {
                "level": "Defense",
                "expectation": "Responds to a reduced gospel (death as only moral example, resurrection as only spiritual metaphor) by demonstrating from Scripture that the bodily, historical gospel event is the doctrinal foundation upon which all apostolic new-birth teaching stands."
              }
            ]
          },
          {
            "code": "NB.3.2.18",
            "title": "The Gospel as Redemptive Accomplishment and Not Mere Religious Information",
            "statement": "The learner demonstrates that the gospel is redemptive accomplishment requiring revealed response — not mere religious information to be intellectually acknowledged.",
            "scope": "The gospel is not only a message about Christ — it is the proclamation of what Christ accomplished, demanding the response that God has revealed. Mental agreement with gospel facts is not identical to full saving response. The apostolic pattern consistently moves from proclamation to commanded response: Acts 2 does not end with a moving story but with \"Repent, and be baptized.\" The commands of Acts 2:38 arise directly from the proclamation of Acts 2:36.",
            "instructionalFocus": "Challenge learners to examine the sermons in Acts with fresh attention. In every case, the proclamation moves toward response. Peter does not end Acts 2 with \"wasn't that beautiful?\" He ends with \"Repent and be baptized.\" Help learners see that the gospel is always proclaimed as redemptive accomplishment requiring entry.",
            "vocabulary": [
              "Gospel",
              "Redemptive Basis",
              "Atoning Death",
              "Burial",
              "Resurrection",
              "Finished Work",
              "Reconciliation",
              "Gospel Response",
              "Substitutionary Suffering",
              "Victory over Death"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 53:4–12",
                "text": "He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
              },
              {
                "reference": "Matthew 27:45–54",
                "text": "And about the ninth hour Jesus cried with a loud voice... and gave up the ghost."
              },
              {
                "reference": "Matthew 28:5–7",
                "text": "He is not here: for he is risen, as he said."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "Jesus of Nazareth... ye have taken, and by wicked hands have crucified and slain: whom God hath raised up..."
              },
              {
                "reference": "Romans 4:25",
                "text": "Who was delivered for our offences, and was raised again for our justification."
              },
              {
                "reference": "Romans 5:6–11",
                "text": "While we were yet sinners, Christ died for us... we were reconciled to God by the death of his Son."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "1 Corinthians 15:1–8",
                "text": "I declare unto you the gospel... how that Christ died for our sins... And that he was buried, and that he rose again..."
              },
              {
                "reference": "2 Corinthians 5:14–21",
                "text": "He died for all... God was in Christ, reconciling the world unto himself... he hath made him to be sin for us."
              },
              {
                "reference": "1 Peter 2:24",
                "text": "Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the gospel requires response and is more than information to be acknowledged; can identify Acts 2:38 as commanded response following the proclamation of Acts 2:22–36."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the distinction between hearing the gospel and entering the salvation it provides — and why the apostles always move from proclamation to commanded response."
              },
              {
                "level": "Application",
                "expectation": "Shows why apostolic new-birth doctrine is inseparable from the gospel event — and why any presentation of the gospel that stops short of commanded response is incomplete."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the new-birth response is a human addition to the simple gospel, showing that the apostles always proclaimed the gospel in a way that demanded entry."
              }
            ]
          },
          {
            "code": "NB.3.3.18",
            "title": "The Relationship Between the Gospel Event and the Pattern of New Birth Response",
            "statement": "The learner demonstrates that apostolic new birth response is rooted in and structurally shaped by the gospel event — and that this relationship is not arbitrary but theologically grounded.",
            "scope": "The apostolic response to salvation corresponds structurally to the gospel. Repentance is the response to the conviction that Christ died for sin. Baptism corresponds to the burial of Christ and the washing away of sin. Spirit reception mirrors the resurrection life poured out by the risen Lord (Acts 2:33). The learner must be able to answer: Why is the new birth this specific pattern and not something else? Because this pattern corresponds to the gospel event itself.",
            "instructionalFocus": "Teach this standard by placing the gospel event and the new-birth response side by side: death → repentance; burial → baptism; resurrection → Spirit birth. When learners see this structure clearly, they will understand why the apostolic pattern is not formula but theology.",
            "vocabulary": [
              "Gospel",
              "Redemptive Basis",
              "Atoning Death",
              "Burial",
              "Resurrection",
              "Finished Work",
              "Reconciliation",
              "Gospel Response",
              "Substitutionary Suffering",
              "Victory over Death"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 53:4–12",
                "text": "He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
              },
              {
                "reference": "Matthew 27:45–54",
                "text": "And about the ninth hour Jesus cried with a loud voice... and gave up the ghost."
              },
              {
                "reference": "Matthew 28:5–7",
                "text": "He is not here: for he is risen, as he said."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "Jesus of Nazareth... ye have taken, and by wicked hands have crucified and slain: whom God hath raised up..."
              },
              {
                "reference": "Romans 4:25",
                "text": "Who was delivered for our offences, and was raised again for our justification."
              },
              {
                "reference": "Romans 5:6–11",
                "text": "While we were yet sinners, Christ died for us... we were reconciled to God by the death of his Son."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "1 Corinthians 15:1–8",
                "text": "I declare unto you the gospel... how that Christ died for our sins... And that he was buried, and that he rose again..."
              },
              {
                "reference": "2 Corinthians 5:14–21",
                "text": "He died for all... God was in Christ, reconciling the world unto himself... he hath made him to be sin for us."
              },
              {
                "reference": "1 Peter 2:24",
                "text": "Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the new birth response is tied to the gospel and can name the elements of both."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the structural correspondence: repentance responds to the death of Christ for sin, baptism corresponds to burial, Spirit reception mirrors resurrection life."
              },
              {
                "level": "Application",
                "expectation": "Shows how Romans 6:3–4 and Acts 2:33 together establish this structural relationship — and why it makes the apostolic pattern theologically necessary rather than arbitrary."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that the new-birth pattern is arbitrary human invention, demonstrating from Scripture that each element corresponds to the gospel event."
              }
            ]
          },
          {
            "code": "NB.3.4.18",
            "title": "Synthesis: Gospel Accomplishment and New Birth Doctrine as One Redemptive Structure",
            "statement": "The learner demonstrates mature doctrinal synthesis by presenting gospel accomplishment and new birth doctrine as one unified redemptive structure — inseparable in proclamation, inseparable in response.",
            "scope": "The doctrine of the new birth cannot be detached from the gospel, and the gospel cannot be treated as doctrinally complete if its revealed response is ignored. Both belong together. A gospel preached without a call to new-birth response is incomplete. A new-birth doctrine taught without grounding in the gospel floats free of its redemptive foundation.",
            "instructionalFocus": "A person who hears the gospel beautifully proclaimed but is never told how to enter it has not been fully served. A person who is told to follow the steps without understanding the gospel has not been given a reason to do so. The apostolic pattern holds both together.",
            "vocabulary": [
              "Gospel",
              "Redemptive Basis",
              "Atoning Death",
              "Burial",
              "Resurrection",
              "Finished Work",
              "Reconciliation",
              "Gospel Response",
              "Substitutionary Suffering",
              "Victory over Death"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 53:4–12",
                "text": "He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
              },
              {
                "reference": "Matthew 27:45–54",
                "text": "And about the ninth hour Jesus cried with a loud voice... and gave up the ghost."
              },
              {
                "reference": "Matthew 28:5–7",
                "text": "He is not here: for he is risen, as he said."
              },
              {
                "reference": "Acts 2:22–36",
                "text": "Jesus of Nazareth... ye have taken, and by wicked hands have crucified and slain: whom God hath raised up..."
              },
              {
                "reference": "Romans 4:25",
                "text": "Who was delivered for our offences, and was raised again for our justification."
              },
              {
                "reference": "Romans 5:6–11",
                "text": "While we were yet sinners, Christ died for us... we were reconciled to God by the death of his Son."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "1 Corinthians 15:1–8",
                "text": "I declare unto you the gospel... how that Christ died for our sins... And that he was buried, and that he rose again..."
              },
              {
                "reference": "2 Corinthians 5:14–21",
                "text": "He died for all... God was in Christ, reconciling the world unto himself... he hath made him to be sin for us."
              },
              {
                "reference": "1 Peter 2:24",
                "text": "Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the gospel and the new birth belong together and cannot be separated in apostolic preaching; can identify Acts 2:22–38 as the model."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how gospel accomplishment and new-birth doctrine relate — basis and response, event and entry, redemption accomplished and redemption received."
              },
              {
                "level": "Application",
                "expectation": "Shows how apostolic preaching in Acts consistently moves from gospel event to new-birth response; can trace this pattern through Acts 2, 8, 10, 19."
              },
              {
                "level": "Defense",
                "expectation": "Presents gospel accomplishment and new birth doctrine as one indivisible redemptive structure and responds to both forms of error: the gospel without commanded response, and the new birth without gospel grounding."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.4",
        "domainTitle": "Repentance as Turning, Surrender, and Covenant Response",
        "anchorScripture": {
          "reference": "Isaiah 55:6–7",
          "text": "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD... for he will abundantly pardon."
        },
        "standards": [
          {
            "code": "NB.4.1.18",
            "title": "Repentance as Necessary Turning from Sin to God",
            "statement": "The learner demonstrates that repentance is necessary turning from sin to God — commanded in response to the gospel — and is essential to apostolic salvation response rather than optional moral advice.",
            "scope": "Repentance is not optional. It is a required response to God's call. Grace does not eliminate repentance — it summons it. Christ commanded it (Luke 13:3). Peter commanded it (Acts 2:38). Paul commanded it (Acts 17:30). This standard also clarifies that repentance is directed toward God, not merely away from bad behavior. Moral cleanup without submission to God is not full repentance. Repentance involves yielded response to divine authority.",
            "instructionalFocus": "Teach repentance with pastoral seriousness. It is not a weapon to threaten with but a gift to offer — the divinely provided way to turn from what is destroying the person toward the God who can restore them. Help learners understand both the necessity and the mercy in which it is offered.",
            "vocabulary": [
              "Repentance",
              "Turning",
              "Godly Sorrow",
              "Confession",
              "Renunciation",
              "Surrender",
              "Conviction",
              "Restitution",
              "Covenant Response",
              "Change of Direction"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 55:6–7",
                "text": "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD... for he will abundantly pardon."
              },
              {
                "reference": "Ezekiel 18:30–32",
                "text": "Repent, and turn yourselves from all your transgressions... Make you a new heart and a new spirit."
              },
              {
                "reference": "Matthew 3:7–8",
                "text": "O generation of vipers... Bring forth therefore fruits meet for repentance."
              },
              {
                "reference": "Luke 13:3",
                "text": "Except ye repent, ye shall all likewise perish."
              },
              {
                "reference": "Luke 24:46–47",
                "text": "Repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:37–38",
                "text": "What shall we do? Then Peter said unto them, Repent..."
              },
              {
                "reference": "Acts 3:19",
                "text": "Repent ye therefore, and be converted, that your sins may be blotted out."
              },
              {
                "reference": "Acts 17:30–31",
                "text": "God... now commandeth all men every where to repent: Because he hath appointed a day in which he will judge the world."
              },
              {
                "reference": "2 Corinthians 7:9–11",
                "text": "Godly sorrow worketh repentance to salvation not to be repented of: but the sorrow of the world worketh death."
              },
              {
                "reference": "Acts 26:20",
                "text": "Repent and turn to God, and do works meet for repentance."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that repentance is necessary and is commanded in the apostolic gospel; can cite Acts 2:38 and Luke 13:3."
              },
              {
                "level": "Explanation",
                "expectation": "Explains that repentance means turning from sin to God — not merely stopping bad behavior — and is the beginning of apostolic salvation response; distinguishes repentance from moral reform."
              },
              {
                "level": "Application",
                "expectation": "Shows why repentance is essential to salvation doctrine and cannot be treated as optional — using the pattern of apostolic preaching to demonstrate that commanded turning is inseparable from the gospel."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that repentance is too demanding or is works-righteousness, showing from Scripture that repentance is the divinely commanded response to grace — God commands it precisely because He is offering genuine rescue, not demanding merit."
              }
            ]
          },
          {
            "code": "NB.4.2.18",
            "title": "Repentance as Surrender of Self-Rule Under the Authority of God",
            "statement": "The learner demonstrates that repentance includes surrender of self-rule and submission to the authority of God — and that this dimension is essential to true repentance rather than optional.",
            "scope": "Repentance is not only change of feeling; it is change of rule. The sinner no longer claims rightful self-governance against God. This is why repentance is the appropriate response to sin as rebellion established in Domain 1 — if sin is rebellion, then repentance is yielded return to the authority that was rejected. Without surrender, the language of repentance becomes hollow.",
            "instructionalFocus": "Help learners understand that repentance is not primarily about a list of behaviors stopped but about a relationship changed. The prodigal son did not merely stop wasting money — he arose and went to his father. Surrender is the movement that changes everything.",
            "vocabulary": [
              "Repentance",
              "Turning",
              "Godly Sorrow",
              "Confession",
              "Renunciation",
              "Surrender",
              "Conviction",
              "Restitution",
              "Covenant Response",
              "Change of Direction"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 55:6–7",
                "text": "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD... for he will abundantly pardon."
              },
              {
                "reference": "Ezekiel 18:30–32",
                "text": "Repent, and turn yourselves from all your transgressions... Make you a new heart and a new spirit."
              },
              {
                "reference": "Matthew 3:7–8",
                "text": "O generation of vipers... Bring forth therefore fruits meet for repentance."
              },
              {
                "reference": "Luke 13:3",
                "text": "Except ye repent, ye shall all likewise perish."
              },
              {
                "reference": "Luke 24:46–47",
                "text": "Repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:37–38",
                "text": "What shall we do? Then Peter said unto them, Repent..."
              },
              {
                "reference": "Acts 3:19",
                "text": "Repent ye therefore, and be converted, that your sins may be blotted out."
              },
              {
                "reference": "Acts 17:30–31",
                "text": "God... now commandeth all men every where to repent: Because he hath appointed a day in which he will judge the world."
              },
              {
                "reference": "2 Corinthians 7:9–11",
                "text": "Godly sorrow worketh repentance to salvation not to be repented of: but the sorrow of the world worketh death."
              },
              {
                "reference": "Acts 26:20",
                "text": "Repent and turn to God, and do works meet for repentance."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that repentance involves yielding to God and is more than stopping sinful behavior."
              },
              {
                "level": "Explanation",
                "expectation": "Explains that surrender of self-rule is essential to repentance — not one optional dimension but the relational core of turning to God; distinguishes behavioral repentance from full repentance as surrender of self-governance."
              },
              {
                "level": "Application",
                "expectation": "Shows how the connection between sin-as-rebellion (Domain 1) and repentance-as-surrender creates a theologically consistent doctrine; explains the logic using at least two scriptures."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that repentance is only external behavior change, demonstrating from Scripture that repentance involves the inner yielding of the will — and that external change without submission to God is insufficient."
              }
            ]
          },
          {
            "code": "NB.4.3.18",
            "title": "Godly Sorrow, Confession, and Changed Direction as Fruits of True Repentance",
            "statement": "The learner demonstrates that godly sorrow, confession, and changed direction are fruits of true repentance — and can distinguish genuine fruit from its shallow substitutes.",
            "scope": "Repentance produces recognizable fruit: godly sorrow, honest confession, and changed direction. Yet none of these should be mistaken for repentance itself when isolated from real turning — the fruit is the evidence; the turning is the root. Sorrow can be worldly, confession can be shallow, and outward change can be temporary. The learner must distinguish fruit from foundation, drawing on 2 Corinthians 7:9–11.",
            "instructionalFocus": "Teach this standard by distinguishing the root from the fruit without separating them. Repentance is not identical to godly sorrow — sorrow is what godly repentance feels like. Repentance is not identical to confession — confession is what genuine repentance says. Changed direction is what real turning produces.",
            "vocabulary": [
              "Repentance",
              "Turning",
              "Godly Sorrow",
              "Confession",
              "Renunciation",
              "Surrender",
              "Conviction",
              "Restitution",
              "Covenant Response",
              "Change of Direction"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 55:6–7",
                "text": "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD... for he will abundantly pardon."
              },
              {
                "reference": "Ezekiel 18:30–32",
                "text": "Repent, and turn yourselves from all your transgressions... Make you a new heart and a new spirit."
              },
              {
                "reference": "Matthew 3:7–8",
                "text": "O generation of vipers... Bring forth therefore fruits meet for repentance."
              },
              {
                "reference": "Luke 13:3",
                "text": "Except ye repent, ye shall all likewise perish."
              },
              {
                "reference": "Luke 24:46–47",
                "text": "Repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:37–38",
                "text": "What shall we do? Then Peter said unto them, Repent..."
              },
              {
                "reference": "Acts 3:19",
                "text": "Repent ye therefore, and be converted, that your sins may be blotted out."
              },
              {
                "reference": "Acts 17:30–31",
                "text": "God... now commandeth all men every where to repent: Because he hath appointed a day in which he will judge the world."
              },
              {
                "reference": "2 Corinthians 7:9–11",
                "text": "Godly sorrow worketh repentance to salvation not to be repented of: but the sorrow of the world worketh death."
              },
              {
                "reference": "Acts 26:20",
                "text": "Repent and turn to God, and do works meet for repentance."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that true repentance has visible fruit and names godly sorrow, confession, and changed direction as examples; can cite 2 Corinthians 7:10 and Matthew 3:8."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the role each fruit plays in genuine repentance and distinguishes each from its shallow substitute: godly sorrow from worldly regret, honest confession from empty apology, changed direction from temporary behavior adjustment."
              },
              {
                "level": "Application",
                "expectation": "Shows how to evaluate whether repentance is genuine by examining its fruit — using 2 Corinthians 7:9–11 and Luke 3:7–9 to establish the biblical standard."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that demanding fruit of repentance is legalistic, showing from Scripture that Jesus and the apostles both expected visible evidence of genuine turning."
              }
            ]
          },
          {
            "code": "NB.4.4.18",
            "title": "Synthesis: Repentance as the Necessary Moral and Covenant Response to the Gospel",
            "statement": "The learner demonstrates that repentance is the necessary moral and covenant response to the gospel — the divinely commanded beginning of apostolic salvation response that cannot be reduced, bypassed, or treated as optional.",
            "scope": "Repentance stands at the beginning of the apostolic response to the gospel. It is morally necessary because sin is real — God cannot be approached by a person who has not turned from sin. It is covenantally necessary because entry into new-covenant life requires turning to God. A reduced salvation message often weakens repentance first. The learner must respond to three common reductions: (1) repentance is unnecessary, (2) repentance is optional moral improvement, (3) requiring repentance is works-righteousness.",
            "instructionalFocus": "Help learners develop the ability to speak about repentance with the same confidence and warmth that they speak about grace. Repentance is the good news that a person can actually turn, and that God will receive them when they do. End this domain by establishing that repentance is the gate, not the prison — the beginning of new life, not the punishment for old sin.",
            "vocabulary": [
              "Repentance",
              "Turning",
              "Godly Sorrow",
              "Confession",
              "Renunciation",
              "Surrender",
              "Conviction",
              "Restitution",
              "Covenant Response",
              "Change of Direction"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 55:6–7",
                "text": "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD... for he will abundantly pardon."
              },
              {
                "reference": "Ezekiel 18:30–32",
                "text": "Repent, and turn yourselves from all your transgressions... Make you a new heart and a new spirit."
              },
              {
                "reference": "Matthew 3:7–8",
                "text": "O generation of vipers... Bring forth therefore fruits meet for repentance."
              },
              {
                "reference": "Luke 13:3",
                "text": "Except ye repent, ye shall all likewise perish."
              },
              {
                "reference": "Luke 24:46–47",
                "text": "Repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:37–38",
                "text": "What shall we do? Then Peter said unto them, Repent..."
              },
              {
                "reference": "Acts 3:19",
                "text": "Repent ye therefore, and be converted, that your sins may be blotted out."
              },
              {
                "reference": "Acts 17:30–31",
                "text": "God... now commandeth all men every where to repent: Because he hath appointed a day in which he will judge the world."
              },
              {
                "reference": "2 Corinthians 7:9–11",
                "text": "Godly sorrow worketh repentance to salvation not to be repented of: but the sorrow of the world worketh death."
              },
              {
                "reference": "Acts 26:20",
                "text": "Repent and turn to God, and do works meet for repentance."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that repentance is necessary and belongs to the apostolic response to the gospel; can identify it as the first element of the apostolic salvation pattern and name at least three passages that command it."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why repentance is both morally necessary (sin is real rebellion) and covenantally necessary (new-covenant entry requires turning to God)."
              },
              {
                "level": "Application",
                "expectation": "Shows how repentance functions in the full doctrine of the new birth as the moral beginning of salvation response that opens into baptism and Spirit reception — and why removing it distorts the whole structure."
              },
              {
                "level": "Defense",
                "expectation": "Presents repentance as necessary, substantial, and integrated — and responds to all three common reductions from Scripture."
              }
            ]
          },
          {
            "code": "NB.4.5.18",
            "title": "Repentance as Renunciation of False Allegiance, Occult Practice, and Former Sin Structures",
            "statement": "The learner demonstrates that repentance includes renunciation of false allegiances, occult involvement, false religion, and former sin structures that directly compete with the lordship of Christ.",
            "scope": "Repentance is not merely inward regret. It includes turning from whatever previously claimed loyalty, control, or spiritual trust. The learner must understand that repentance in apostolic doctrine reaches beyond immoral acts into false worship, occult practice, manipulative spiritual systems, and former identities organized around rebellion against God. Where prior allegiances directly contradict covenant loyalty to Christ, repentance includes renunciation. This does not turn repentance into theatrical denunciation, but it does require real break with false spiritual authority and sinful mastery.",
            "instructionalFocus": "Teach repentance as total turning. A person does not merely add Jesus to prior spiritual loyalties. They turn from darkness to light, from the power of Satan unto God, and from former structures of bondage into covenant obedience.",
            "vocabulary": [
              "Repentance",
              "Turning",
              "Godly Sorrow",
              "Confession",
              "Renunciation",
              "Surrender",
              "Conviction",
              "Restitution",
              "Covenant Response",
              "Change of Direction"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 55:6–7",
                "text": "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD... for he will abundantly pardon."
              },
              {
                "reference": "Ezekiel 18:30–32",
                "text": "Repent, and turn yourselves from all your transgressions... Make you a new heart and a new spirit."
              },
              {
                "reference": "Matthew 3:7–8",
                "text": "O generation of vipers... Bring forth therefore fruits meet for repentance."
              },
              {
                "reference": "Luke 13:3",
                "text": "Except ye repent, ye shall all likewise perish."
              },
              {
                "reference": "Luke 24:46–47",
                "text": "Repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:37–38",
                "text": "What shall we do? Then Peter said unto them, Repent..."
              },
              {
                "reference": "Acts 3:19",
                "text": "Repent ye therefore, and be converted, that your sins may be blotted out."
              },
              {
                "reference": "Acts 17:30–31",
                "text": "God... now commandeth all men every where to repent: Because he hath appointed a day in which he will judge the world."
              },
              {
                "reference": "2 Corinthians 7:9–11",
                "text": "Godly sorrow worketh repentance to salvation not to be repented of: but the sorrow of the world worketh death."
              },
              {
                "reference": "Acts 26:20",
                "text": "Repent and turn to God, and do works meet for repentance."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that repentance includes forsaking false allegiances and sinful practices, not only feeling sorry for sin."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why repentance must include renouncing occult practice, false worship, and former sin structures that compete with Christ's lordship."
              },
              {
                "level": "Application",
                "expectation": "Shows how Acts 19, Acts 26:18–20, and general apostolic repentance preaching require a real break with former spiritual darkness and destructive loyalties."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that repentance may leave former spiritual allegiances intact, demonstrating from Scripture that turning to God includes rejecting competing powers, practices, and identities."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.5",
        "domainTitle": "Water Baptism and Apostolic Gospel Response",
        "anchorScripture": {
          "reference": "Ezekiel 36:25",
          "text": "Then will I sprinkle clean water upon you, and ye shall be clean: from all your filthiness... will I cleanse you."
        },
        "standards": [
          {
            "code": "NB.5.1.18",
            "title": "Water Baptism as Part of Apostolic Response to the Gospel",
            "statement": "The learner demonstrates that water baptism is part of apostolic response to the gospel — commanded, connected to remission, and inseparable from the new-birth doctrine the apostles proclaimed.",
            "scope": "Water baptism belongs inside apostolic response. The apostles did not treat baptism as a minor symbolic extra attached after salvation was already settled. It appears as commanded response in the first apostolic proclamation (Acts 2:38), across the Gentile mission (Acts 10:47–48), and in the later accounts (Acts 19:5). Baptism must not be interpreted in isolation — it stands with repentance, the name of Jesus, remission, and Spirit reception in the broader new-birth structure.",
            "instructionalFocus": "Teach baptism by beginning with what the apostles said and did, not with what later theology decided. Acts 2:38 is the starting point: repentance and baptism commanded together, both tied to remission. The pattern repeats in Acts 8, 9, 10, 16, 19, and 22. Help learners see that the apostolic consistency is not coincidental — it is doctrinal.",
            "vocabulary": [
              "Water Baptism",
              "Burial",
              "Remission",
              "Washing",
              "Covenant Entry",
              "Baptismal Obedience",
              "Name Invocation",
              "Apostolic Pattern",
              "Burial with Christ",
              "One Baptism"
            ],
            "anchorScriptures": [
              {
                "reference": "Ezekiel 36:25",
                "text": "Then will I sprinkle clean water upon you, and ye shall be clean: from all your filthiness... will I cleanse you."
              },
              {
                "reference": "Mark 16:16",
                "text": "He that believeth and is baptized shall be saved; but he that believeth not shall be damned."
              },
              {
                "reference": "John 3:5",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              },
              {
                "reference": "Colossians 2:11–12",
                "text": "Buried with him in baptism, wherein also ye are risen with him through the faith of the operation of God..."
              },
              {
                "reference": "1 Peter 3:21",
                "text": "The like figure whereunto even baptism doth also now save us... by the resurrection of Jesus Christ."
              },
              {
                "reference": "Acts 8:12–16",
                "text": "When they believed Philip preaching... they were baptized, both men and women..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the apostles practiced and commanded baptism in response to the gospel; can name at least three conversion accounts in Acts where baptism is commanded or practiced."
              },
              {
                "level": "Explanation",
                "expectation": "Explains that baptism belongs to apostolic response to the gospel — commanded alongside repentance and tied to remission; explains Acts 2:38 as a command, not a suggestion."
              },
              {
                "level": "Application",
                "expectation": "Shows why baptism cannot be reduced to optional ceremony — using the pattern of Acts and the doctrinal explanation of Romans 6 to demonstrate that it carries real doctrinal weight."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that baptism is only symbolic and not part of salvation, demonstrating from Acts 2:38, Acts 22:16, Romans 6:3–4, and 1 Peter 3:21 that apostolic doctrine does not present baptism as optional ceremony."
              }
            ]
          },
          {
            "code": "NB.5.2.18",
            "title": "Baptism in Relation to Burial with Christ",
            "statement": "The learner demonstrates that baptism is doctrinally related to burial with Christ in the gospel structure of salvation — and that this relationship gives baptism its deepest theological meaning.",
            "scope": "Romans 6:3–4 does not say baptism illustrates burial — it says believers are \"baptized into his death\" and \"buried with him by baptism.\" The language is participatory, not merely symbolic. The learner must explain what this participation means without reducing baptism to empty metaphor — and explain why baptism is associated with burial, why this matters for the doctrine of the new birth, and why removing this connection flattens baptism into mere ceremony.",
            "instructionalFocus": "Help learners see that the mode and meaning of baptism are not culturally inherited traditions — they are doctrinally derived from the gospel event. More importantly, help learners understand what it means to be buried with Christ: the old life is placed under the earth; new life rises out of it.",
            "vocabulary": [
              "Water Baptism",
              "Burial",
              "Remission",
              "Washing",
              "Covenant Entry",
              "Baptismal Obedience",
              "Name Invocation",
              "Apostolic Pattern",
              "Burial with Christ",
              "One Baptism"
            ],
            "anchorScriptures": [
              {
                "reference": "Ezekiel 36:25",
                "text": "Then will I sprinkle clean water upon you, and ye shall be clean: from all your filthiness... will I cleanse you."
              },
              {
                "reference": "Mark 16:16",
                "text": "He that believeth and is baptized shall be saved; but he that believeth not shall be damned."
              },
              {
                "reference": "John 3:5",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              },
              {
                "reference": "Colossians 2:11–12",
                "text": "Buried with him in baptism, wherein also ye are risen with him through the faith of the operation of God..."
              },
              {
                "reference": "1 Peter 3:21",
                "text": "The like figure whereunto even baptism doth also now save us... by the resurrection of Jesus Christ."
              },
              {
                "reference": "Acts 8:12–16",
                "text": "When they believed Philip preaching... they were baptized, both men and women..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that baptism is linked to burial language in the New Testament; can cite Romans 6:3–4."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how Romans 6:3–4 presents baptism as participation in Christ's death and burial — and what new life in the resurrection means for the baptized person."
              },
              {
                "level": "Application",
                "expectation": "Shows how the burial-with-Christ language gives baptism its doctrinal weight in the new-birth structure — and why removing this connection flattens baptism into mere ceremony."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that burial language in Romans 6 is only symbolic, showing that the apostolic use of participatory language describes a real doctrinal connection."
              }
            ]
          },
          {
            "code": "NB.5.3.18",
            "title": "Baptism in Relation to Remission, Washing, and Covenant Entry",
            "statement": "The learner demonstrates that baptism is presented in apostolic doctrine in relation to remission, washing, and covenant entry — and can explain each of these connections with scriptural precision.",
            "scope": "Acts 2:38 ties baptism to remission of sins. Acts 22:16 commands \"wash away thy sins\" in the context of baptism. Titus 3:5 speaks of \"washing of regeneration.\" These are three angles on the same apostolic doctrine. The learner must neither inflate water into magical power nor deflate it into meaningless ceremony. Baptism must be read within the larger doctrinal structure as the covenantal form of entry that connects the gospel to the believer's life.",
            "instructionalFocus": "Teach the three remission/washing passages together and let the cumulative force land before moving to theological explanation. Acts 2:38 commands baptism for remission. Acts 22:16 commands washing away sins in the context of baptism. Titus 3:5 describes salvation through the washing of regeneration.",
            "vocabulary": [
              "Water Baptism",
              "Burial",
              "Remission",
              "Washing",
              "Covenant Entry",
              "Baptismal Obedience",
              "Name Invocation",
              "Apostolic Pattern",
              "Burial with Christ",
              "One Baptism"
            ],
            "anchorScriptures": [
              {
                "reference": "Ezekiel 36:25",
                "text": "Then will I sprinkle clean water upon you, and ye shall be clean: from all your filthiness... will I cleanse you."
              },
              {
                "reference": "Mark 16:16",
                "text": "He that believeth and is baptized shall be saved; but he that believeth not shall be damned."
              },
              {
                "reference": "John 3:5",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              },
              {
                "reference": "Colossians 2:11–12",
                "text": "Buried with him in baptism, wherein also ye are risen with him through the faith of the operation of God..."
              },
              {
                "reference": "1 Peter 3:21",
                "text": "The like figure whereunto even baptism doth also now save us... by the resurrection of Jesus Christ."
              },
              {
                "reference": "Acts 8:12–16",
                "text": "When they believed Philip preaching... they were baptized, both men and women..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that baptism is linked to washing and remission language in the New Testament; can cite Acts 2:38 and Acts 22:16."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the doctrinal content of remission and washing in relation to baptism — what is being remitted, what is being washed, and how baptism is the form in which these take place."
              },
              {
                "level": "Application",
                "expectation": "Shows how washing and cleansing connect baptism to the preparatory cleansing structure of Domain 2 — demonstrating that remission and washing in apostolic doctrine are fulfillments of what the Old Testament categories prepared."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that washing language in baptism passages is purely metaphorical, demonstrating that the apostolic texts join the cleansing language directly to the baptismal act and that this is doctrinally significant."
              }
            ]
          },
          {
            "code": "NB.5.4.18",
            "title": "Baptism in Jesus' Name as Apostolic Baptismal Practice",
            "statement": "The learner demonstrates that baptism in Jesus' name belongs to apostolic baptismal practice in salvation response — and can explain why the name of Jesus in baptism is doctrinally significant rather than incidental.",
            "scope": "Every baptismal account in Acts where the formula is mentioned uses the name of Jesus (or the Lord Jesus) — Acts 2:38, 8:16, 10:48, 19:5, and 22:16 all reflect this pattern. The learner must explain this consistency as doctrinally meaningful — not as accidental variation from Matthew 28:19, but as the apostles' understanding that Jesus is the full embodiment of the divine name and that His name carries the authority for remission and covenant entry.",
            "instructionalFocus": "Help learners hold the apostolic consistency together. Every time a baptismal formula is mentioned in Acts, it involves the name of Jesus. This is not accident — it is the apostolic pattern. A learner who sees this pattern will understand why apostolic baptism is in Jesus' name and will be able to explain it with confidence.",
            "vocabulary": [
              "Water Baptism",
              "Burial",
              "Remission",
              "Washing",
              "Covenant Entry",
              "Baptismal Obedience",
              "Name Invocation",
              "Apostolic Pattern",
              "Burial with Christ",
              "One Baptism"
            ],
            "anchorScriptures": [
              {
                "reference": "Ezekiel 36:25",
                "text": "Then will I sprinkle clean water upon you, and ye shall be clean: from all your filthiness... will I cleanse you."
              },
              {
                "reference": "Mark 16:16",
                "text": "He that believeth and is baptized shall be saved; but he that believeth not shall be damned."
              },
              {
                "reference": "John 3:5",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              },
              {
                "reference": "Colossians 2:11–12",
                "text": "Buried with him in baptism, wherein also ye are risen with him through the faith of the operation of God..."
              },
              {
                "reference": "1 Peter 3:21",
                "text": "The like figure whereunto even baptism doth also now save us... by the resurrection of Jesus Christ."
              },
              {
                "reference": "Acts 8:12–16",
                "text": "When they believed Philip preaching... they were baptized, both men and women..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that apostolic baptism is practiced in the name of Jesus; can cite Acts 2:38, 8:16, and 10:48 and state they all use the name of Jesus."
              },
              {
                "level": "Explanation",
                "expectation": "Explains that baptism in Jesus' name is the consistent apostolic pattern and that the name carries authority for remission and covenant entry; can name five Acts accounts."
              },
              {
                "level": "Application",
                "expectation": "Shows how baptism in Jesus' name connects to Domain 10's treatment of the name of Jesus in salvation — and why the apostles invoked that specific name in baptism."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the Acts baptismal accounts using Jesus' name are irrelevant because Matthew 28:19 gives a different formula — explaining how Acts demonstrates how the apostles understood and applied Christ's commission."
              }
            ]
          },
          {
            "code": "NB.5.5.18",
            "title": "Synthesis: Baptism, Burial, Remission, Name, and Apostolic Obedience as One Doctrine",
            "statement": "The learner demonstrates that baptism, burial with Christ, remission, the name of Jesus, and apostolic obedience form one doctrine of baptismal response within the new birth.",
            "scope": "Burial language, washing, remission, the name of Jesus, and apostolic obedience all belong together in one doctrine. Baptism is best understood when read inside the full apostolic response to the gospel — detached treatments weaken doctrinal clarity. The learner must present baptism as a coherent and necessary part of new-birth doctrine, and be equipped to respond to each major reduction: baptism as only symbol, baptism as optional, baptism in any formula.",
            "instructionalFocus": "Baptism is burial with Christ, washing in which remission is received, in Jesus' name as the authority under which new-covenant entry happens, and obedience as the act of faith that submits to apostolic command. These are not four separate baptisms; they are four angles on the same act.",
            "vocabulary": [
              "Water Baptism",
              "Burial",
              "Remission",
              "Washing",
              "Covenant Entry",
              "Baptismal Obedience",
              "Name Invocation",
              "Apostolic Pattern",
              "Burial with Christ",
              "One Baptism"
            ],
            "anchorScriptures": [
              {
                "reference": "Ezekiel 36:25",
                "text": "Then will I sprinkle clean water upon you, and ye shall be clean: from all your filthiness... will I cleanse you."
              },
              {
                "reference": "Mark 16:16",
                "text": "He that believeth and is baptized shall be saved; but he that believeth not shall be damned."
              },
              {
                "reference": "John 3:5",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              },
              {
                "reference": "Colossians 2:11–12",
                "text": "Buried with him in baptism, wherein also ye are risen with him through the faith of the operation of God..."
              },
              {
                "reference": "1 Peter 3:21",
                "text": "The like figure whereunto even baptism doth also now save us... by the resurrection of Jesus Christ."
              },
              {
                "reference": "Acts 8:12–16",
                "text": "When they believed Philip preaching... they were baptized, both men and women..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that baptism includes multiple doctrinal dimensions and names at least three: burial, remission, washing, Jesus' name, obedience."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how burial, remission, the name of Jesus, and apostolic obedience relate to one another in the doctrine of baptism — and why none of them should be isolated."
              },
              {
                "level": "Application",
                "expectation": "Shows how the full baptismal doctrine answers the question \"Why is baptism this specific act, in this name, for this purpose?\" — demonstrating that each element is doctrinally grounded."
              },
              {
                "level": "Defense",
                "expectation": "Presents baptism, burial, remission, name, and obedience as one doctrine — and responds to each major reduction of baptismal teaching (symbolic only, optional, formula-neutral) from the full doctrinal structure."
              }
            ]
          },
          {
            "code": "NB.5.6.18",
            "title": "Urgency, Immersion, and Immediate Baptismal Obedience in Apostolic Practice",
            "statement": "The learner demonstrates that apostolic baptism is marked by urgency, practiced without unnecessary delay, and administered by immersion as the fitting mode of burial with Christ.",
            "scope": "Apostolic baptism is not treated as a distant ceremony for later convenience. Across Acts, baptism follows faith and repentance with urgency. The learner must understand that prompt baptism reflects apostolic seriousness about covenant entry and gospel obedience. This standard also clarifies that immersion best matches the doctrinal logic of burial with Christ, the language of going down into and coming up out of the water, and the baptismal imagery used in apostolic teaching. The point is not ritual exactness detached from doctrine, but doctrinal coherence between gospel meaning and baptismal practice.",
            "instructionalFocus": "Teach learners to see baptism the way the apostles treated it: as immediate covenant obedience flowing from the gospel. Burial language, going down into the water, and coming up out of the water all help clarify why immersion fits the apostolic meaning of baptism.",
            "vocabulary": [
              "Water Baptism",
              "Burial",
              "Remission",
              "Washing",
              "Covenant Entry",
              "Baptismal Obedience",
              "Name Invocation",
              "Apostolic Pattern",
              "Burial with Christ",
              "One Baptism"
            ],
            "anchorScriptures": [
              {
                "reference": "Ezekiel 36:25",
                "text": "Then will I sprinkle clean water upon you, and ye shall be clean: from all your filthiness... will I cleanse you."
              },
              {
                "reference": "Mark 16:16",
                "text": "He that believeth and is baptized shall be saved; but he that believeth not shall be damned."
              },
              {
                "reference": "John 3:5",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Romans 6:3–4",
                "text": "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death?... even so we also should walk in newness of life."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              },
              {
                "reference": "Colossians 2:11–12",
                "text": "Buried with him in baptism, wherein also ye are risen with him through the faith of the operation of God..."
              },
              {
                "reference": "1 Peter 3:21",
                "text": "The like figure whereunto even baptism doth also now save us... by the resurrection of Jesus Christ."
              },
              {
                "reference": "Acts 8:12–16",
                "text": "When they believed Philip preaching... they were baptized, both men and women..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that baptism in Acts is treated with urgency and that immersion fits the burial language of baptism."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why the apostles did not delay baptism unnecessarily and why immersion matches the doctrinal meaning of burial with Christ."
              },
              {
                "level": "Application",
                "expectation": "Shows from Acts 2, 8, 9, 10, 16, 19, and 22 that apostolic baptism was prompt, commanded, and treated as immediate obedience rather than later symbolic ceremony."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that baptism may be indefinitely postponed or detached from immersion without doctrinal loss, demonstrating from Scripture that apostolic urgency and burial language carry real doctrinal force."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.6",
        "domainTitle": "The Holy Spirit and the Necessity of Spiritual Birth",
        "anchorScripture": {
          "reference": "Isaiah 44:3",
          "text": "I will pour water upon him that is thirsty, and floods upon the dry ground: I will pour my spirit upon thy seed..."
        },
        "standards": [
          {
            "code": "NB.6.1.18",
            "title": "The Necessity of Spiritual Birth in the Doctrine of the New Birth",
            "statement": "The learner demonstrates that spiritual birth is necessary to salvation and belongs to the defined doctrine of the new birth — not as optional empowerment but as an essential requirement for entering the kingdom of God.",
            "scope": "Christ's words in John 3:5 are absolute: \"Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.\" This is not a description of a higher-level Christian experience — it is a requirement for kingdom entrance. Peter does not offer the Spirit as an optional follow-up to salvation; he commands repentance and baptism and announces the Spirit as the promised gift (Acts 2:38). Paul declares that those without the Spirit of Christ are none of His (Rom. 8:9).",
            "instructionalFocus": "Begin this domain with Christ's own words in John 3:5. Let the standard stand before moving to explanation. Then move to Romans 8:9. These two texts together establish the necessity of Spirit birth beyond dispute.",
            "vocabulary": [
              "Holy Spirit",
              "Spirit Birth",
              "Indwelling",
              "Regeneration",
              "Gift of the Spirit",
              "Spiritual Birth",
              "Renewal",
              "Promise of the Spirit",
              "New-Covenant Life",
              "Necessary Gift"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 44:3",
                "text": "I will pour water upon him that is thirsty, and floods upon the dry ground: I will pour my spirit upon thy seed..."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "John 3:3–8",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God. That which is born of the flesh is flesh; and that which is born of the Spirit is spirit."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "Acts 2:38–39",
                "text": "...ye shall receive the gift of the Holy Ghost. For the promise is unto you, and to your children, and to all that are afar off."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word..."
              },
              {
                "reference": "Romans 8:9",
                "text": "If any man have not the Spirit of Christ, he is none of his."
              },
              {
                "reference": "Titus 3:5–6",
                "text": "Not by works of righteousness which we have done, but according to his mercy he saved us, by the washing of regeneration, and renewing of the Holy Ghost; Which he shed on us abundantly through Jesus Christ our Saviour."
              },
              {
                "reference": "Ephesians 1:13–14",
                "text": "In whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that spiritual birth is necessary to entering the kingdom of God and can cite Christ's words in John 3:5."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why spiritual birth is a requirement and not an option — using John 3:5, Romans 8:9, and Acts 2:38 to show that apostolic doctrine uniformly treats Spirit reception as essential."
              },
              {
                "level": "Application",
                "expectation": "Shows how the necessity of spiritual birth shapes apostolic proclamation — why Peter announces the Spirit as the promised gift in Acts 2:38 rather than as an optional enhancement."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that the Spirit is a second blessing for already-saved Christians, demonstrating from John 3:5 and Romans 8:9 that Spirit birth is a defining requirement for belonging to Christ."
              }
            ]
          },
          {
            "code": "NB.6.2.18",
            "title": "The Holy Spirit as the Promised Gift of New-Covenant Indwelling Life",
            "statement": "The learner demonstrates that the Holy Spirit is the promised gift of new-covenant indwelling life — the fulfillment of what God had long promised to provide for His people.",
            "scope": "When Peter says \"the promise is unto you\" (Acts 2:39), he is invoking the long covenant promise of divine indwelling — Ezekiel 36:27, Joel 2:28, John 7:37–39, John 14:16–18. The prophetic promise was precisely this: not that God would be near but that He would be within. \"I will put my spirit within you\" (Ezek. 36:27) is the promise; Spirit reception in the new birth is its fulfillment.",
            "instructionalFocus": "Help learners feel the weight of the promise before they encounter its fulfillment. Ezekiel 36:26–27 is God's own declaration of what He intends to do. When the Spirit is poured out at Pentecost, this is not the beginning of something new — it is the arrival of something God had been preparing for centuries.",
            "vocabulary": [
              "Holy Spirit",
              "Spirit Birth",
              "Indwelling",
              "Regeneration",
              "Gift of the Spirit",
              "Spiritual Birth",
              "Renewal",
              "Promise of the Spirit",
              "New-Covenant Life",
              "Necessary Gift"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 44:3",
                "text": "I will pour water upon him that is thirsty, and floods upon the dry ground: I will pour my spirit upon thy seed..."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "John 3:3–8",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God. That which is born of the flesh is flesh; and that which is born of the Spirit is spirit."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "Acts 2:38–39",
                "text": "...ye shall receive the gift of the Holy Ghost. For the promise is unto you, and to your children, and to all that are afar off."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word..."
              },
              {
                "reference": "Romans 8:9",
                "text": "If any man have not the Spirit of Christ, he is none of his."
              },
              {
                "reference": "Titus 3:5–6",
                "text": "Not by works of righteousness which we have done, but according to his mercy he saved us, by the washing of regeneration, and renewing of the Holy Ghost; Which he shed on us abundantly through Jesus Christ our Saviour."
              },
              {
                "reference": "Ephesians 1:13–14",
                "text": "In whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the Holy Spirit is promised and given in the new birth; can connect Ezekiel 36:27 or Joel 2:28 to Acts 2:16–18 or Acts 2:38."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the Spirit's indwelling fulfills the covenant promise of divine dwelling established in Domain 2 — showing that Pentecost is not a surprise but the promised arrival of what God had long prepared."
              },
              {
                "level": "Application",
                "expectation": "Shows how Acts 2:38–39 frames Spirit reception as a gift and a promise — and why the gift-and-promise framing makes the Spirit essential to salvation rather than supplementary."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Spirit reception is a private spiritual experience unrelated to the structure of salvation, demonstrating from Scripture that it is the covenant-promised gift that belongs to new-birth entry."
              }
            ]
          },
          {
            "code": "NB.6.3.18",
            "title": "Regeneration and Renewal as Works of God by the Spirit",
            "statement": "The learner demonstrates that regeneration and renewal are works of God by the Spirit — not products of human effort, emotional experience, or ritual form — and can explain why this protects the doctrine of grace.",
            "scope": "Titus 3:5 says salvation came \"by the washing of regeneration, and renewing of the Holy Ghost; Which he shed on us abundantly through Jesus Christ.\" The Spirit is God's provision, not human achievement. Regeneration is not mere fresh start in attitude but real newness of life through the Spirit — what Paul calls being a \"new creature\" (2 Cor. 5:17). Because new life comes from God, it cannot be earned, manufactured, or substituted.",
            "instructionalFocus": "Teach regeneration by beginning with what it is not: not self-improvement, not emotional experience, not religious enrollment. Then establish what it is: the divine act of making spiritually dead people alive through the Spirit (Eph. 2:1, 5; Titus 3:5).",
            "vocabulary": [
              "Holy Spirit",
              "Spirit Birth",
              "Indwelling",
              "Regeneration",
              "Gift of the Spirit",
              "Spiritual Birth",
              "Renewal",
              "Promise of the Spirit",
              "New-Covenant Life",
              "Necessary Gift"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 44:3",
                "text": "I will pour water upon him that is thirsty, and floods upon the dry ground: I will pour my spirit upon thy seed..."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "John 3:3–8",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God. That which is born of the flesh is flesh; and that which is born of the Spirit is spirit."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "Acts 2:38–39",
                "text": "...ye shall receive the gift of the Holy Ghost. For the promise is unto you, and to your children, and to all that are afar off."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word..."
              },
              {
                "reference": "Romans 8:9",
                "text": "If any man have not the Spirit of Christ, he is none of his."
              },
              {
                "reference": "Titus 3:5–6",
                "text": "Not by works of righteousness which we have done, but according to his mercy he saved us, by the washing of regeneration, and renewing of the Holy Ghost; Which he shed on us abundantly through Jesus Christ our Saviour."
              },
              {
                "reference": "Ephesians 1:13–14",
                "text": "In whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that regeneration is God's work by the Spirit and is not produced by human effort; can cite Titus 3:5."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what regeneration and renewal mean — new life from the Spirit, inward transformation, not merely religious enrollment — and why this is grounded in divine action rather than human contribution."
              },
              {
                "level": "Application",
                "expectation": "Shows how the teaching that regeneration is God's work protects the doctrine of grace — establishing that no one earns or generates Spirit birth, and that it is therefore received by faith in the revealed provision of God."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that teaching Spirit reception as necessary makes it a human achievement — demonstrating that receiving a gift is not earning one."
              }
            ]
          },
          {
            "code": "NB.6.4.18",
            "title": "Synthesis: Necessity, Promise, Indwelling, and Renewal as One Doctrine of Spirit-Born Life",
            "statement": "The learner demonstrates that necessity, promise, indwelling, and renewal form one doctrine of Spirit-born life within the new birth — and can present this doctrine as coherent, apostolic, and essential.",
            "scope": "The Spirit's role in salvation must be presented as one coherent doctrine. The Spirit is necessary (John 3:5; Rom. 8:9), promised (Ezek. 36:27; Acts 2:38–39), indwelling (1 Cor. 3:16; 6:19), renewing (Titus 3:5), and life-giving (John 6:63). A fragmented view weakens the doctrine of the new birth. The learner must present all dimensions together and respond to both major reductions: Spirit as second blessing, and Spirit birth as a feeling or emotional state.",
            "instructionalFocus": "The Spirit is not a feeling they hope to generate. The Spirit is the promised, necessary, indwelling, renewing gift of God given in the new birth to all who respond to the gospel. Help learners become fluent in all four dimensions so that no reduction can gain a foothold.",
            "vocabulary": [
              "Holy Spirit",
              "Spirit Birth",
              "Indwelling",
              "Regeneration",
              "Gift of the Spirit",
              "Spiritual Birth",
              "Renewal",
              "Promise of the Spirit",
              "New-Covenant Life",
              "Necessary Gift"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 44:3",
                "text": "I will pour water upon him that is thirsty, and floods upon the dry ground: I will pour my spirit upon thy seed..."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "John 3:3–8",
                "text": "Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God. That which is born of the flesh is flesh; and that which is born of the Spirit is spirit."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "Acts 2:38–39",
                "text": "...ye shall receive the gift of the Holy Ghost. For the promise is unto you, and to your children, and to all that are afar off."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word..."
              },
              {
                "reference": "Romans 8:9",
                "text": "If any man have not the Spirit of Christ, he is none of his."
              },
              {
                "reference": "Titus 3:5–6",
                "text": "Not by works of righteousness which we have done, but according to his mercy he saved us, by the washing of regeneration, and renewing of the Holy Ghost; Which he shed on us abundantly through Jesus Christ our Saviour."
              },
              {
                "reference": "Ephesians 1:13–14",
                "text": "In whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the Spirit's role in salvation includes multiple connected dimensions; can name necessity, promise, indwelling, and renewal and give one scripture for each."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how necessity, promise, indwelling, and renewal relate to one another — and why each dimension requires the others to complete the doctrine."
              },
              {
                "level": "Application",
                "expectation": "Shows how the full doctrine of Spirit-born life answers the most common questions about the Spirit in salvation: Is it required? When is it received? What does it do?"
              },
              {
                "level": "Defense",
                "expectation": "Presents the full doctrine of Spirit-born life and responds to both major reductions (second-blessing theology and emotional-state reduction) from the full doctrinal structure."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.7",
        "domainTitle": "Pentecost and the Opening of New-Covenant Birth",
        "anchorScripture": {
          "reference": "Joel 2:28–32",
          "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
        },
        "standards": [
          {
            "code": "NB.7.1.18",
            "title": "Pentecost as the Public Opening of New-Covenant Birth",
            "statement": "The learner demonstrates that Pentecost is the public opening of new-covenant birth — not a detached spiritual experience but the fulfillment of prophetic promise and the beginning of apostolic salvation response.",
            "scope": "Pentecost is not a side subject or denominational emphasis but the central event at which promise becomes fulfillment, Spirit outpouring becomes available response, and proclamation becomes commanded entry. The spectacular elements (sound, fire, tongues) are not the doctrinal center — the doctrinal center is what those elements mark: the opening of new-covenant Spirit life to all who respond to the apostolic proclamation.",
            "instructionalFocus": "Teach Pentecost as the arrival of what had been promised, not as the beginning of a new religion. Peter's sermon in Acts 2 is built entirely on Old Testament fulfillment. Then bring the learner to the response: if this is the fulfillment of all that God had promised, what is the appropriate response?",
            "vocabulary": [
              "Pentecost",
              "Spirit Outpouring",
              "Covenant Opening",
              "Fulfillment Event",
              "Apostolic Opening",
              "Church Birth",
              "Public Sign",
              "New-Covenant Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Joel 2:28–32",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "Luke 24:46–49",
                "text": "That repentance and remission of sins should be preached in his name among all nations... I send the promise of my Father upon you..."
              },
              {
                "reference": "Acts 1:4–8",
                "text": "Wait for the promise of the Father... ye shall be baptized with the Holy Ghost not many days hence... ye shall receive power, after that the Holy Ghost is come upon you."
              },
              {
                "reference": "Acts 2:1–18",
                "text": "And they were all filled with the Holy Ghost, and began to speak with other tongues... This is that which was spoken by the prophet Joel..."
              },
              {
                "reference": "Acts 2:22–38",
                "text": "Jesus of Nazareth... Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 2:39",
                "text": "For the promise is unto you, and to your children, and to all that are afar off, even as many as the Lord our God shall call."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning... God gave them the like gift as he did unto us..."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Pentecost marks the fulfillment of the Spirit promise and the beginning of apostolic new-birth proclamation; can cite Acts 2:16–17 and Acts 2:38."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why Pentecost is a salvation-opening event — connecting promise, Spirit outpouring, and apostolic response as one unified event."
              },
              {
                "level": "Application",
                "expectation": "Shows how Pentecost establishes the normative new-birth pattern: Spirit poured out, gospel proclaimed, response commanded — and demonstrates why every subsequent conversion in Acts follows this pattern."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Pentecost is a unique one-time event with no continuing doctrinal implications, demonstrating from Acts 10:44–47 and Acts 11:15–17 that the apostles treated Pentecost as establishing the normative pattern."
              }
            ]
          },
          {
            "code": "NB.7.2.18",
            "title": "Pentecost as Fulfillment of Promise and Christ's Own Teaching",
            "statement": "The learner demonstrates that Pentecost fulfills prophetic promise and the explicit teaching of Christ concerning the coming Spirit — and can show why this fulfillment character establishes Pentecost as doctrinally normative.",
            "scope": "Pentecost fulfills what had been promised in prophecy (Joel 2:28–32; Ezek. 36:26–27) and what Christ explicitly taught before His ascension (John 14:16–18; John 7:37–39; Luke 24:49; Acts 1:4–8). The disciples did not stumble into Pentecost — they waited for it, as Christ commanded. Acts 2:38–39 extends the promise beyond Jerusalem to all who are called, establishing that Pentecost opens an ongoing provision.",
            "instructionalFocus": "Christ spent considerable time preparing His disciples for Pentecost. John 14, 15, and 16 are the Upper Room teaching on the Spirit. Luke 24:49 is the final instruction before ascension. Acts 1:4–8 is the last word before Christ rose. When they received it, they understood it immediately as fulfillment.",
            "vocabulary": [
              "Pentecost",
              "Spirit Outpouring",
              "Covenant Opening",
              "Fulfillment Event",
              "Apostolic Opening",
              "Church Birth",
              "Public Sign",
              "New-Covenant Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Joel 2:28–32",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "Luke 24:46–49",
                "text": "That repentance and remission of sins should be preached in his name among all nations... I send the promise of my Father upon you..."
              },
              {
                "reference": "Acts 1:4–8",
                "text": "Wait for the promise of the Father... ye shall be baptized with the Holy Ghost not many days hence... ye shall receive power, after that the Holy Ghost is come upon you."
              },
              {
                "reference": "Acts 2:1–18",
                "text": "And they were all filled with the Holy Ghost, and began to speak with other tongues... This is that which was spoken by the prophet Joel..."
              },
              {
                "reference": "Acts 2:22–38",
                "text": "Jesus of Nazareth... Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 2:39",
                "text": "For the promise is unto you, and to your children, and to all that are afar off, even as many as the Lord our God shall call."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning... God gave them the like gift as he did unto us..."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Pentecost fulfills prior prophecy and Christ's own promises about the Spirit; can connect Joel 2:28–29 to Acts 2:16–17 and John 14:16–18 to Acts 1:4–8."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how Peter's sermon draws on Joel's prophecy to interpret what is happening — and how Christ's multiple promises all reach fulfillment on that day."
              },
              {
                "level": "Application",
                "expectation": "Shows why the fulfillment character of Pentecost makes it doctrinally normative — if God prepared and promised it, then it belongs to the structure of salvation."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Pentecost is historically unique and therefore not applicable today, showing that Acts 2:39 explicitly extends the promise to all generations."
              }
            ]
          },
          {
            "code": "NB.7.3.18",
            "title": "Pentecost as the Beginning of Apostolic Proclamation and Salvation Response",
            "statement": "The learner demonstrates that Pentecost begins apostolic proclamation and revealed salvation response in open covenant history — and can show why Pentecost is both Spirit event and salvific proclamation.",
            "scope": "Pentecost does not stop at outpouring. Acts 2:14–40 is not a sequel to Acts 2:1–13 — it is its proclamatory dimension. The Spirit falls and the apostles preach. The crowd hears and is convicted. The convicted ask and are commanded to repent and be baptized. Event and proclamation are one. The learner must explain Pentecost as the beginning of apostolic salvation proclamation and response — the model for every new birth that follows.",
            "instructionalFocus": "Read Acts 2 as one continuous event: sound, wind, and fire (1–4) are the opening; Peter's sermon (14–36) is its interpretation; the conviction (37) and commanded response (38) are its application; the three thousand who were added (41) are its harvest.",
            "vocabulary": [
              "Pentecost",
              "Spirit Outpouring",
              "Covenant Opening",
              "Fulfillment Event",
              "Apostolic Opening",
              "Church Birth",
              "Public Sign",
              "New-Covenant Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Joel 2:28–32",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "Luke 24:46–49",
                "text": "That repentance and remission of sins should be preached in his name among all nations... I send the promise of my Father upon you..."
              },
              {
                "reference": "Acts 1:4–8",
                "text": "Wait for the promise of the Father... ye shall be baptized with the Holy Ghost not many days hence... ye shall receive power, after that the Holy Ghost is come upon you."
              },
              {
                "reference": "Acts 2:1–18",
                "text": "And they were all filled with the Holy Ghost, and began to speak with other tongues... This is that which was spoken by the prophet Joel..."
              },
              {
                "reference": "Acts 2:22–38",
                "text": "Jesus of Nazareth... Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 2:39",
                "text": "For the promise is unto you, and to your children, and to all that are afar off, even as many as the Lord our God shall call."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning... God gave them the like gift as he did unto us..."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Pentecost includes apostolic preaching and commanded response — not only the Spirit outpouring; can identify Acts 2:14–40 as the proclamation dimension of the Pentecost event."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how Spirit outpouring and apostolic proclamation are unified in Acts 2 — the Spirit enables the preaching (2:4) and the preaching announces the Spirit (2:38)."
              },
              {
                "level": "Application",
                "expectation": "Shows how Pentecost establishes the model for apostolic evangelism: Spirit-empowered proclamation of Christ's death, resurrection, and lordship, leading to conviction and commanded response."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Pentecost is primarily an experience event with the proclamation as secondary, demonstrating from Acts 2 that the structure of the chapter requires both dimensions to be understood as one event."
              }
            ]
          },
          {
            "code": "NB.7.4.18",
            "title": "Synthesis: Fulfillment, Spirit Outpouring, Proclamation, and Response as One Doctrine of Pentecost",
            "statement": "The learner demonstrates that fulfillment, Spirit outpouring, proclamation, and response form one integrated doctrine of Pentecost — and can present this doctrine with structural clarity.",
            "scope": "Pentecost must be understood as one integrated salvation-opening doctrine. Promise is fulfilled, Spirit is poured out, Christ is proclaimed, and response is commanded — these are not four sequential stages that can be separated but four dimensions of one event. All the preparatory streams of Domain 2 reach their convergence at Pentecost. The gospel of Domain 3 is proclaimed and entered. The repentance of Domain 4, the baptism of Domain 5, and the Spirit of Domain 6 are simultaneously offered.",
            "instructionalFocus": "Fulfillment without outpouring is only theological category. Outpouring without proclamation is only experience. Proclamation without response is only sermon. Response without Spirit outpouring is only religion. Together they are Pentecost — the opening of the new birth for all who will enter.",
            "vocabulary": [
              "Pentecost",
              "Spirit Outpouring",
              "Covenant Opening",
              "Fulfillment Event",
              "Apostolic Opening",
              "Church Birth",
              "Public Sign",
              "New-Covenant Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Joel 2:28–32",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "Luke 24:46–49",
                "text": "That repentance and remission of sins should be preached in his name among all nations... I send the promise of my Father upon you..."
              },
              {
                "reference": "Acts 1:4–8",
                "text": "Wait for the promise of the Father... ye shall be baptized with the Holy Ghost not many days hence... ye shall receive power, after that the Holy Ghost is come upon you."
              },
              {
                "reference": "Acts 2:1–18",
                "text": "And they were all filled with the Holy Ghost, and began to speak with other tongues... This is that which was spoken by the prophet Joel..."
              },
              {
                "reference": "Acts 2:22–38",
                "text": "Jesus of Nazareth... Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 2:39",
                "text": "For the promise is unto you, and to your children, and to all that are afar off, even as many as the Lord our God shall call."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning... God gave them the like gift as he did unto us..."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Names the major elements of Pentecost: fulfillment, Spirit outpouring, apostolic proclamation, and commanded response; can give one scripture reference for each."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how outpouring, proclamation, and response belong together in one event — and why each requires the others to complete the doctrine of Pentecost."
              },
              {
                "level": "Application",
                "expectation": "Shows how Pentecost functions as the doctrinal center of the new-birth pattern — the point at which all preparatory streams converge and from which all subsequent apostolic proclamation flows."
              },
              {
                "level": "Defense",
                "expectation": "Presents Pentecost as one integrated doctrine and responds to both major reductions (experience-only and history-only) from the full doctrinal structure."
              }
            ]
          },
          {
            "code": "NB.7.5.18",
            "title": "Pentecost as the Covenant Turning Point and Ongoing Apostolic Reference Point",
            "statement": "The learner demonstrates that Pentecost is the covenant turning point that opens the new birth publicly and remains the apostolic reference point for understanding Spirit reception and salvation entry thereafter.",
            "scope": "Pentecost does not stand merely at the beginning of Acts as a past event to be admired. It functions as the apostolic reference point by which later Spirit reception and salvation response are interpreted. Peter explicitly compares the Gentile outpouring to \"the beginning,\" and the church reads later Spirit events through that original Pentecostal opening. The learner must therefore understand Pentecost as both inaugural and interpretive: it opens the covenant life of the Spirit and supplies the pattern by which the church recognizes the same gift in later settings.",
            "instructionalFocus": "Teach Pentecost as more than the first outpouring. It is the covenant opening of the Spirit age and the interpretive center the apostles use when later believers receive the same promised gift.",
            "vocabulary": [
              "Pentecost",
              "Spirit Outpouring",
              "Covenant Opening",
              "Fulfillment Event",
              "Apostolic Opening",
              "Church Birth",
              "Public Sign",
              "New-Covenant Birth"
            ],
            "anchorScriptures": [
              {
                "reference": "Joel 2:28–32",
                "text": "I will pour out my spirit upon all flesh; and your sons and your daughters shall prophesy..."
              },
              {
                "reference": "Luke 24:46–49",
                "text": "That repentance and remission of sins should be preached in his name among all nations... I send the promise of my Father upon you..."
              },
              {
                "reference": "Acts 1:4–8",
                "text": "Wait for the promise of the Father... ye shall be baptized with the Holy Ghost not many days hence... ye shall receive power, after that the Holy Ghost is come upon you."
              },
              {
                "reference": "Acts 2:1–18",
                "text": "And they were all filled with the Holy Ghost, and began to speak with other tongues... This is that which was spoken by the prophet Joel..."
              },
              {
                "reference": "Acts 2:22–38",
                "text": "Jesus of Nazareth... Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 2:39",
                "text": "For the promise is unto you, and to your children, and to all that are afar off, even as many as the Lord our God shall call."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning... God gave them the like gift as he did unto us..."
              },
              {
                "reference": "John 7:37–39",
                "text": "He that believeth on me... out of his belly shall flow rivers of living water. (But this spake he of the Spirit...)"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Pentecost is the beginning point for later apostolic understanding of Spirit reception."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why the apostles use Pentecost as the reference point for later outpourings and why this makes Pentecost doctrinally ongoing in significance."
              },
              {
                "level": "Application",
                "expectation": "Shows how Acts 10-11 and Acts 19 are interpreted in light of Pentecost and why this preserves one doctrine of the new birth across multiple settings."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that Pentecost is historically unique but doctrinally non-normative, demonstrating that apostolic interpretation itself treats Pentecost as the continuing reference point for Spirit reception and new-covenant birth."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.8",
        "domainTitle": "The Apostolic Pattern of the New Birth",
        "anchorScripture": {
          "reference": "Acts 2:37–42",
          "text": "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
        },
        "standards": [
          {
            "code": "NB.8.1.18",
            "title": "Acts as the Historical Unfolding of Apostolic Salvation Doctrine",
            "statement": "The learner demonstrates that Acts records the historical unfolding of apostolic salvation doctrine — and that the narrative accounts are doctrinally significant, not merely historically interesting.",
            "scope": "Acts must be read doctrinally as well as historically. Acts is not a collection of anecdotes but the record of doctrine being enacted across different peoples and places. Where Paul's letters explain what baptism means theologically (Romans 6, Colossians 2), Acts shows what the apostles actually commanded and how people actually entered salvation. Narrative and doctrine work together; neither is complete without the other.",
            "instructionalFocus": "Teach learners to read Acts as Luke intended: a theological history. Luke is not merely recording what happened — he is showing what the apostolic church looked like when the gospel was proclaimed and received.",
            "vocabulary": [
              "Apostolic Pattern",
              "Acts Pattern",
              "Normative Practice",
              "Consistent Response",
              "Conversion Narrative",
              "Revealed Pattern",
              "Doctrinal Practice",
              "Entry Response",
              "Apostolic Consistency",
              "Salvation Pattern"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:37–42",
                "text": "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 8:12–17",
                "text": "When they believed Philip preaching... they were baptized, both men and women. ...Then laid they their hands on them, and they received the Holy Ghost."
              },
              {
                "reference": "Acts 9:17–18",
                "text": "And Ananias... said, Brother Saul... hath sent me, that thou mightest... be filled with the Holy Ghost. And immediately... he arose, and was baptized."
              },
              {
                "reference": "Acts 10:44–48",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... he commanded them to be baptized in the name of the Lord."
              },
              {
                "reference": "Acts 16:30–33",
                "text": "What must I do to be saved? And they said, Believe on the Lord Jesus Christ... and was baptized, he and all his, straightway."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "He said unto them, Have ye received the Holy Ghost since ye believed?... the Holy Ghost came on them; and they spake with tongues, and prophesied."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Acts 8:35–39",
                "text": "Philip... preached unto him Jesus. And as they went on their way... the eunuch said, See, here is water; what doth hinder me to be baptized?"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Acts records how people responded to apostolic preaching and that these accounts carry doctrinal weight; can name at least three conversion accounts in Acts."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why Acts is essential to new-birth doctrine — it shows what the apostles actually commanded and how people actually entered salvation, giving doctrinal content to the theological explanations in the Epistles."
              },
              {
                "level": "Application",
                "expectation": "Shows how reading Acts doctrinally changes the understanding of the new birth — demonstrating that the apostolic commands in Acts carry normative force."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Acts is only descriptive history and not normative doctrine — demonstrating that the apostolic pattern is consistent across multiple settings, which is itself a doctrinal argument."
              }
            ]
          },
          {
            "code": "NB.8.2.18",
            "title": "The Recurring Apostolic Response Pattern in Acts",
            "statement": "The learner demonstrates that Acts presents a recurring apostolic response pattern involving repentance, baptism in Jesus' name, and Spirit reception — and can explain why this consistency is doctrinally significant.",
            "scope": "Repentance appears at the beginning of the apostolic response (Acts 2:38, 3:19, 17:30). Baptism in Jesus' name appears consistently across the major accounts (2:38, 8:16, 10:48, 19:5, 22:16). Spirit reception appears throughout (2:38, 8:17, 10:44–48, 19:6). Different accounts may emphasize different moments, but the pattern remains coherent. Variation in narration does not mean contradiction in doctrine.",
            "instructionalFocus": "Create a chart with the major Acts conversion accounts across the top and the three pattern elements down the side. Have learners fill it in together. The visual consistency becomes its own argument.",
            "vocabulary": [
              "Apostolic Pattern",
              "Acts Pattern",
              "Normative Practice",
              "Consistent Response",
              "Conversion Narrative",
              "Revealed Pattern",
              "Doctrinal Practice",
              "Entry Response",
              "Apostolic Consistency",
              "Salvation Pattern"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:37–42",
                "text": "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 8:12–17",
                "text": "When they believed Philip preaching... they were baptized, both men and women. ...Then laid they their hands on them, and they received the Holy Ghost."
              },
              {
                "reference": "Acts 9:17–18",
                "text": "And Ananias... said, Brother Saul... hath sent me, that thou mightest... be filled with the Holy Ghost. And immediately... he arose, and was baptized."
              },
              {
                "reference": "Acts 10:44–48",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... he commanded them to be baptized in the name of the Lord."
              },
              {
                "reference": "Acts 16:30–33",
                "text": "What must I do to be saved? And they said, Believe on the Lord Jesus Christ... and was baptized, he and all his, straightway."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "He said unto them, Have ye received the Holy Ghost since ye believed?... the Holy Ghost came on them; and they spake with tongues, and prophesied."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Acts 8:35–39",
                "text": "Philip... preached unto him Jesus. And as they went on their way... the eunuch said, See, here is water; what doth hinder me to be baptized?"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that repentance, baptism, and Spirit reception appear repeatedly across the major conversion accounts in Acts; can name at least four Acts accounts and identify which elements are present in each."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the recurring pattern and why consistency across multiple accounts establishes doctrinal force rather than coincidence; can articulate why the pattern's repetition across different settings makes it normative."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates the pattern across Acts 2, 8, 9–10, 16, 19, and 22 — showing both the elements that appear consistently and how to read partial accounts within the full doctrinal structure."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the objection that Acts accounts vary too much to establish a normative pattern — demonstrating that the variation is in narration, not in doctrine."
              }
            ]
          },
          {
            "code": "NB.8.3.18",
            "title": "Apostolic Consistency Across Jewish, Samaritan, Gentile, and Later Conversion Settings",
            "statement": "The learner demonstrates that the apostolic doctrine of the new birth remains consistent across multiple conversion settings — and that this cross-cultural consistency is itself a doctrinal argument for the pattern's normative force.",
            "scope": "The new birth is not redefined for different peoples. Jews, Samaritans, Gentiles, and later disciples are all brought into one apostolic salvation pattern. If the pattern were merely Jewish or early-church cultural practice, it would not be demanded of Samaritans, Gentiles, and disciples from completely different backgrounds. Its universality across these groups is evidence of its doctrinal necessity.",
            "instructionalFocus": "Help learners understand why the breadth of Acts is itself a doctrinal argument. Luke chose accounts that demonstrate the apostolic pattern crossing the most significant boundaries of the ancient world: Jewish/Samaritan, Jew/Gentile, disciples of John/disciples of Jesus.\n\nInstructional Focus Extension: Apparent Variation in Acts Does Not Cancel the Pattern\n\nInsert Text: Teach learners to read the Acts conversion accounts as a coherent apostolic pattern rather than as isolated fragments. Variation in sequence or narrative emphasis should not be treated as contradiction or optionality. Instead, the apostles continue pressing toward complete new-birth response whenever an element is missing, misunderstood, or not yet received.\n\nSamaria shows people who believed and were baptized in the name of the Lord Jesus, yet still needed prayer to receive the Holy Ghost. Cornelius shows the Spirit falling before water baptism, yet Peter still commanded baptism. Ephesus shows disciples whose prior baptism was insufficient once the fuller apostolic message was preached. The Ethiopian eunuch shows that preaching Jesus naturally led to water baptism. These accounts should be taught together because the pattern becomes clearer when the accounts are compared rather than flattened.\n\nThe teaching goal is not to force every account into the same order. The goal is to show that the apostles did not treat repentance, baptism in Jesus' name, and Spirit reception as disposable pieces. When one element was missing, they addressed it. When one element appeared first, they did not use it to dismiss the others.",
            "vocabulary": [
              "Apostolic Pattern",
              "Acts Pattern",
              "Normative Practice",
              "Consistent Response",
              "Conversion Narrative",
              "Revealed Pattern",
              "Doctrinal Practice",
              "Entry Response",
              "Apostolic Consistency",
              "Salvation Pattern"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:37–42",
                "text": "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 8:12–17",
                "text": "When they believed Philip preaching... they were baptized, both men and women. ...Then laid they their hands on them, and they received the Holy Ghost."
              },
              {
                "reference": "Acts 9:17–18",
                "text": "And Ananias... said, Brother Saul... hath sent me, that thou mightest... be filled with the Holy Ghost. And immediately... he arose, and was baptized."
              },
              {
                "reference": "Acts 10:44–48",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... he commanded them to be baptized in the name of the Lord."
              },
              {
                "reference": "Acts 16:30–33",
                "text": "What must I do to be saved? And they said, Believe on the Lord Jesus Christ... and was baptized, he and all his, straightway."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "He said unto them, Have ye received the Holy Ghost since ye believed?... the Holy Ghost came on them; and they spake with tongues, and prophesied."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Acts 8:35–39",
                "text": "Philip... preached unto him Jesus. And as they went on their way... the eunuch said, See, here is water; what doth hinder me to be baptized?"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the gospel reached different groups in Acts and that the apostolic salvation pattern remained consistent across them; can name Jews (ch. 2), Samaritans (ch. 8), Gentiles (ch. 10), and later disciples (ch. 19)."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what specifically happened in each group's encounter with the apostolic new birth, and what was consistent across all four settings."
              },
              {
                "level": "Application",
                "expectation": "Shows why the cross-cultural consistency of the apostolic pattern is itself a doctrinal argument — if the pattern were merely cultural, it would not be demanded of peoples from different cultures and backgrounds."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the apostolic new-birth pattern is culturally Jewish or Pentecostal — demonstrating from Acts 10, 16, and 19 that the pattern crosses every cultural and religious background without revision."
              }
            ]
          },
          {
            "code": "NB.8.4.18",
            "title": "Synthesis: Apostolic Preaching, Response, and Historical Practice as One Doctrine of the New Birth Pattern",
            "statement": "The learner demonstrates that apostolic preaching, commanded response, and historical practice form one doctrine of the new birth pattern — and can present this pattern with doctrinal confidence and historical awareness.",
            "scope": "The new birth pattern is not built from narrative alone (what people did) or from command alone (what apostles said) but from the union of apostolic preaching and actual response. What the apostles preached, what they commanded, and what actually happened all align — and this alignment is the doctrinal argument. Acts 2:39 (\"to all that are afar off\") explicitly opens the pattern to all generations.",
            "instructionalFocus": "The apostolic pattern is not a tradition invented by the church — it is a doctrine received from the apostles who received it from Christ. It was preached, commanded, obeyed, and recorded.",
            "vocabulary": [
              "Apostolic Pattern",
              "Acts Pattern",
              "Normative Practice",
              "Consistent Response",
              "Conversion Narrative",
              "Revealed Pattern",
              "Doctrinal Practice",
              "Entry Response",
              "Apostolic Consistency",
              "Salvation Pattern"
            ],
            "anchorScriptures": [
              {
                "reference": "Acts 2:37–42",
                "text": "Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
              },
              {
                "reference": "Acts 8:12–17",
                "text": "When they believed Philip preaching... they were baptized, both men and women. ...Then laid they their hands on them, and they received the Holy Ghost."
              },
              {
                "reference": "Acts 9:17–18",
                "text": "And Ananias... said, Brother Saul... hath sent me, that thou mightest... be filled with the Holy Ghost. And immediately... he arose, and was baptized."
              },
              {
                "reference": "Acts 10:44–48",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... he commanded them to be baptized in the name of the Lord."
              },
              {
                "reference": "Acts 16:30–33",
                "text": "What must I do to be saved? And they said, Believe on the Lord Jesus Christ... and was baptized, he and all his, straightway."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "He said unto them, Have ye received the Holy Ghost since ye believed?... the Holy Ghost came on them; and they spake with tongues, and prophesied."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "Acts 8:35–39",
                "text": "Philip... preached unto him Jesus. And as they went on their way... the eunuch said, See, here is water; what doth hinder me to be baptized?"
              },
              {
                "reference": "1 Corinthians 12:13",
                "text": "For by one Spirit are we all baptized into one body..."
              },
              {
                "reference": "Galatians 3:27",
                "text": "For as many of you as have been baptized into Christ have put on Christ."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that apostolic preaching and response belong together and that the pattern in Acts is doctrinally significant; can state the basic apostolic pattern and name the book of Acts as its primary historical record."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why the apostolic pattern must be drawn from the combination of what was preached, what was commanded, and what actually happened — and why all three must be considered together."
              },
              {
                "level": "Application",
                "expectation": "Shows how the apostolic pattern was received and passed on across the first generation of believers — and why this first-generation character establishes its normative force for all subsequent generations."
              },
              {
                "level": "Defense",
                "expectation": "Presents the apostolic pattern as revealed, practiced, and historically normative — and responds to the objection that it applied only to the early church, demonstrating from Acts 2:39 that the pattern was intended for all generations."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.9",
        "domainTitle": "Faith, Obedience, and Full Saving Response",
        "anchorScripture": {
          "reference": "Genesis 15:6",
          "text": "He believed in the LORD; and he counted it to him for righteousness."
        },
        "standards": [
          {
            "code": "NB.9.1.18",
            "title": "Saving Faith as Obedient Trust in God's Revealed Gospel",
            "statement": "The learner demonstrates that saving faith is obedient trust in God's revealed gospel — not mental assent alone — and can explain why the apostolic definition of faith requires response.",
            "scope": "The faith that James speaks of as dead is not unbelief — it is the faith that knows truth and claims to believe but refuses to act on it (James 2:19–20). Paul's \"obedience to the faith\" (Rom. 1:5) and Hebrews' definition of faith through obedient acts (Heb. 11) both establish that saving faith is the kind that acts on what God reveals. Mental agreement without yielded response is insufficient.",
            "instructionalFocus": "Begin with Hebrews 11 and let its model of faith stand clearly. In every case, the faith that pleased God was the faith that acted: Noah built an ark, Abraham departed, Moses refused Egypt. Apply the same logic to the new-birth response. Repenting is an act of faith. Being baptized is an act of faith. Receiving the Spirit is an act of faith.",
            "vocabulary": [
              "Faith",
              "Saving Faith",
              "Obedience of Faith",
              "Mental Assent",
              "Trust",
              "Living Faith",
              "Dead Faith",
              "Gospel Obedience",
              "Grace",
              "Yielded Belief"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 15:6",
                "text": "He believed in the LORD; and he counted it to him for righteousness."
              },
              {
                "reference": "Habakkuk 2:4",
                "text": "The just shall live by his faith."
              },
              {
                "reference": "John 3:16",
                "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
              },
              {
                "reference": "Acts 2:37–41",
                "text": "Now when they heard this, they were pricked in their heart... Then they that gladly received his word were baptized..."
              },
              {
                "reference": "Romans 1:5",
                "text": "By whom we have received grace and apostleship, for obedience to the faith among all nations..."
              },
              {
                "reference": "Hebrews 5:8–9",
                "text": "Though he were a Son, yet learned he obedience by the things which he suffered; And being made perfect, he became the author of eternal salvation unto all them that obey him."
              },
              {
                "reference": "Hebrews 11:1–8",
                "text": "Now faith is the substance of things hoped for, the evidence of things not seen... By faith Abraham obeyed..."
              },
              {
                "reference": "James 2:14–26",
                "text": "Faith without works is dead... Ye see then how that by works a man is justified, and not by faith only."
              },
              {
                "reference": "1 Peter 1:22",
                "text": "Seeing ye have purified your souls in obeying the truth through the Spirit unto unfeigned love of the brethren..."
              },
              {
                "reference": "John 8:31–32",
                "text": "If ye continue in my word, then are ye my disciples indeed; And ye shall know the truth, and the truth shall make you free."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that saving faith involves trusting God and is more than intellectual agreement with theological facts."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why true faith includes obedient response — using Hebrews 11, Romans 1:5, and James 2 to show that the biblical definition of faith includes action."
              },
              {
                "level": "Application",
                "expectation": "Shows how the apostolic call to repent and be baptized in Acts 2:38 is itself a call of faith — that responding to the apostolic command is not works-righteousness but saving faith in action."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that requiring repentance, baptism, and Spirit reception makes salvation by works — demonstrating from Scripture that these are not human achievements but the form in which obedient faith receives what God freely offers."
              }
            ]
          },
          {
            "code": "NB.9.2.18",
            "title": "Why Obedience Does Not Compete with Grace in the Doctrine of Salvation",
            "statement": "The learner demonstrates that obedient response does not compete with grace but belongs to the way grace is received in apostolic salvation doctrine — and can explain this relationship with theological precision and pastoral clarity.",
            "scope": "God saves by His mercy and initiative, yet He also commands response. Grace provides the salvation; faith and obedience receive it. The commands of Acts 2:38 are not conditions that earn salvation but the forms in which the grace of salvation is entered. Obedience does not earn salvation as human achievement — it is the yielded form of faith under grace.",
            "instructionalFocus": "Teach this standard by addressing both errors it prevents. First, the grace-only error: if grace means no response is required, then what was Peter doing commanding repentance and baptism at Pentecost? Second, the legalism error: if obedience earns salvation, then what was God doing choosing Paul on the Damascus road before he did anything?",
            "vocabulary": [
              "Faith",
              "Saving Faith",
              "Obedience of Faith",
              "Mental Assent",
              "Trust",
              "Living Faith",
              "Dead Faith",
              "Gospel Obedience",
              "Grace",
              "Yielded Belief"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 15:6",
                "text": "He believed in the LORD; and he counted it to him for righteousness."
              },
              {
                "reference": "Habakkuk 2:4",
                "text": "The just shall live by his faith."
              },
              {
                "reference": "John 3:16",
                "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
              },
              {
                "reference": "Acts 2:37–41",
                "text": "Now when they heard this, they were pricked in their heart... Then they that gladly received his word were baptized..."
              },
              {
                "reference": "Romans 1:5",
                "text": "By whom we have received grace and apostleship, for obedience to the faith among all nations..."
              },
              {
                "reference": "Hebrews 5:8–9",
                "text": "Though he were a Son, yet learned he obedience by the things which he suffered; And being made perfect, he became the author of eternal salvation unto all them that obey him."
              },
              {
                "reference": "Hebrews 11:1–8",
                "text": "Now faith is the substance of things hoped for, the evidence of things not seen... By faith Abraham obeyed..."
              },
              {
                "reference": "James 2:14–26",
                "text": "Faith without works is dead... Ye see then how that by works a man is justified, and not by faith only."
              },
              {
                "reference": "1 Peter 1:22",
                "text": "Seeing ye have purified your souls in obeying the truth through the Spirit unto unfeigned love of the brethren..."
              },
              {
                "reference": "John 8:31–32",
                "text": "If ye continue in my word, then are ye my disciples indeed; And ye shall know the truth, and the truth shall make you free."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that both grace and commanded response belong to salvation teaching and that they do not contradict each other."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why obedience does not mean earning salvation — using Titus 3:5–6 alongside Acts 2:38 to show that both belong to the same apostolic doctrine."
              },
              {
                "level": "Application",
                "expectation": "Shows how the grace-obedience relationship plays out in the apostolic new-birth pattern: grace initiates and provides; faith receives; obedience responds; Spirit is given."
              },
              {
                "level": "Defense",
                "expectation": "Responds to both distortions: (1) grace-only with no commanded response, and (2) commanded response treated as human merit — demonstrating from Scripture why both fail."
              }
            ]
          },
          {
            "code": "NB.9.3.18",
            "title": "Answering the Works Objection in Apostolic Salvation Doctrine",
            "statement": "The learner distinguishes self-saving works, legalistic merit, and apostolic obedience, demonstrating that repentance, water baptism in Jesus' name, and Spirit reception are obedient responses of faith to grace, not human achievements that earn salvation.",
            "scope": "This standard addresses a frequent modern objection: \"If baptism is required, does that make salvation a work?\" The learner must distinguish the works Paul rejects from the obedience of faith Paul preached. Scripture rejects self-righteous merit, but it does not reject commanded response to the gospel. Grace provides salvation; faith receives it; obedience is the yielded form that faith takes under apostolic preaching. Repentance, baptism in Jesus' name, and receiving the Holy Ghost are not payment for salvation. They are the revealed response to the gospel. This standard prepares the learner to answer objections from Ephesians 2:8–9 and Romans 10:13 without weakening Acts 2:38, Acts 19:1–6, Acts 22:16, Titus 3:5–6, or the broader Pauline phrase \"obedience to the faith.\"",
            "instructionalFocus": "Teach this standard with two errors in view. First, the reduction error: grace is treated as though it removes all commanded response. Second, the legalism error: obedience is treated as though it earns salvation. Help learners see that the apostles preached grace and commanded response without embarrassment. Paul rejected boasting in human works, but he still asked believers about the Holy Ghost and baptism, still baptized in the name of the Lord Jesus, and still connected calling on the name with baptism and washing away sins.",
            "vocabulary": [
              "Faith",
              "Saving Faith",
              "Obedience of Faith",
              "Mental Assent",
              "Trust",
              "Living Faith",
              "Dead Faith",
              "Gospel Obedience",
              "Grace",
              "Yielded Belief"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 15:6",
                "text": "He believed in the LORD; and he counted it to him for righteousness."
              },
              {
                "reference": "Habakkuk 2:4",
                "text": "The just shall live by his faith."
              },
              {
                "reference": "John 3:16",
                "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
              },
              {
                "reference": "Acts 2:37–41",
                "text": "Now when they heard this, they were pricked in their heart... Then they that gladly received his word were baptized..."
              },
              {
                "reference": "Romans 1:5",
                "text": "By whom we have received grace and apostleship, for obedience to the faith among all nations..."
              },
              {
                "reference": "Hebrews 5:8–9",
                "text": "Though he were a Son, yet learned he obedience by the things which he suffered; And being made perfect, he became the author of eternal salvation unto all them that obey him."
              },
              {
                "reference": "Hebrews 11:1–8",
                "text": "Now faith is the substance of things hoped for, the evidence of things not seen... By faith Abraham obeyed..."
              },
              {
                "reference": "James 2:14–26",
                "text": "Faith without works is dead... Ye see then how that by works a man is justified, and not by faith only."
              },
              {
                "reference": "1 Peter 1:22",
                "text": "Seeing ye have purified your souls in obeying the truth through the Spirit unto unfeigned love of the brethren..."
              },
              {
                "reference": "John 8:31–32",
                "text": "If ye continue in my word, then are ye my disciples indeed; And ye shall know the truth, and the truth shall make you free."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that obedience does not earn salvation and that apostolic baptism is not a self-saving work."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the difference between works of merit and obedience of faith, showing why grace and commanded response do not contradict each other."
              },
              {
                "level": "Application",
                "expectation": "Applies this distinction to common objections, especially the claim that baptism in Jesus' name competes with grace or adds human effort to salvation."
              },
              {
                "level": "Defense",
                "expectation": "Defends the apostolic response from Scripture, using Acts 2, Acts 19, Acts 22:16, Romans 1:5, Titus 3:5–6, Hebrews 5:9, and James 2 with theological precision and pastoral care."
              }
            ]
          },
          {
            "code": "NB.9.4.18",
            "title": "Distinguishing Living Faith from Dead Faith in Relation to the New Birth",
            "statement": "The learner demonstrates the ability to distinguish living faith from dead faith in relation to the doctrine of the new birth — and can explain why living faith is the form of faith that saves.",
            "scope": "Faith must be tested by its relation to revelation and response. Living faith hears, trusts, turns, obeys, and continues. Dead faith claims belief while refusing yielded response. James 2 is not teaching works-righteousness — it is teaching that real faith produces the kind of response that reveals its reality. The demons believe and tremble (James 2:19) — they have intellectual assent but not saving faith.",
            "instructionalFocus": "Use Hebrews 11 and James 2 together. Hebrews 11 gives examples of living faith — faith that acted. James 2 gives the theological explanation — faith without action is dead.",
            "vocabulary": [
              "Faith",
              "Saving Faith",
              "Obedience of Faith",
              "Mental Assent",
              "Trust",
              "Living Faith",
              "Dead Faith",
              "Gospel Obedience",
              "Grace",
              "Yielded Belief"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 15:6",
                "text": "He believed in the LORD; and he counted it to him for righteousness."
              },
              {
                "reference": "Habakkuk 2:4",
                "text": "The just shall live by his faith."
              },
              {
                "reference": "John 3:16",
                "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
              },
              {
                "reference": "Acts 2:37–41",
                "text": "Now when they heard this, they were pricked in their heart... Then they that gladly received his word were baptized..."
              },
              {
                "reference": "Romans 1:5",
                "text": "By whom we have received grace and apostleship, for obedience to the faith among all nations..."
              },
              {
                "reference": "Hebrews 5:8–9",
                "text": "Though he were a Son, yet learned he obedience by the things which he suffered; And being made perfect, he became the author of eternal salvation unto all them that obey him."
              },
              {
                "reference": "Hebrews 11:1–8",
                "text": "Now faith is the substance of things hoped for, the evidence of things not seen... By faith Abraham obeyed..."
              },
              {
                "reference": "James 2:14–26",
                "text": "Faith without works is dead... Ye see then how that by works a man is justified, and not by faith only."
              },
              {
                "reference": "1 Peter 1:22",
                "text": "Seeing ye have purified your souls in obeying the truth through the Spirit unto unfeigned love of the brethren..."
              },
              {
                "reference": "John 8:31–32",
                "text": "If ye continue in my word, then are ye my disciples indeed; And ye shall know the truth, and the truth shall make you free."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that not all belief-language in Scripture describes saving faith; can cite James 2:17–20 and state the distinction between living and dead faith."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the distinguishing characteristics of living faith (response, obedience, continuing trust) versus dead faith (claim without action, assent without surrender)."
              },
              {
                "level": "Application",
                "expectation": "Shows how the distinction between living and dead faith applies to the apostolic new-birth pattern — why the three thousand who responded at Pentecost demonstrated living faith, and why merely agreeing with the sermon without responding would not constitute saving faith."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the charge that distinguishing living from dead faith makes salvation conditional on works — demonstrating that the distinction is between two kinds of faith, not between faith and works."
              }
            ]
          },
          {
            "code": "NB.9.5.18",
            "title": "Synthesis: Faith, Obedience, Grace, and Response as One Doctrine of Saving Faith",
            "statement": "The learner demonstrates that faith, obedience, grace, and response form one doctrine of saving faith within the new birth — and can present this synthesis without collapsing into either legalism or passive assent.",
            "scope": "Saving faith cannot be taught accurately by isolating one term from the others. Faith trusts, grace initiates, obedience responds, and salvation is received under revealed gospel command. None compete; all belong together. The apostolic balance is precise: God saves freely; faith receives obediently.",
            "instructionalFocus": "The person who says \"just believe and you're saved — nothing else is required\" has reduced faith to passive assent. The person who says \"you must do these things to earn salvation\" has reduced response to human merit. The apostolic position: God saves freely through Christ; the faith that receives that salvation is the faith that responds to His revealed commands.",
            "vocabulary": [
              "Faith",
              "Saving Faith",
              "Obedience of Faith",
              "Mental Assent",
              "Trust",
              "Living Faith",
              "Dead Faith",
              "Gospel Obedience",
              "Grace",
              "Yielded Belief"
            ],
            "anchorScriptures": [
              {
                "reference": "Genesis 15:6",
                "text": "He believed in the LORD; and he counted it to him for righteousness."
              },
              {
                "reference": "Habakkuk 2:4",
                "text": "The just shall live by his faith."
              },
              {
                "reference": "John 3:16",
                "text": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
              },
              {
                "reference": "Acts 2:37–41",
                "text": "Now when they heard this, they were pricked in their heart... Then they that gladly received his word were baptized..."
              },
              {
                "reference": "Romans 1:5",
                "text": "By whom we have received grace and apostleship, for obedience to the faith among all nations..."
              },
              {
                "reference": "Hebrews 5:8–9",
                "text": "Though he were a Son, yet learned he obedience by the things which he suffered; And being made perfect, he became the author of eternal salvation unto all them that obey him."
              },
              {
                "reference": "Hebrews 11:1–8",
                "text": "Now faith is the substance of things hoped for, the evidence of things not seen... By faith Abraham obeyed..."
              },
              {
                "reference": "James 2:14–26",
                "text": "Faith without works is dead... Ye see then how that by works a man is justified, and not by faith only."
              },
              {
                "reference": "1 Peter 1:22",
                "text": "Seeing ye have purified your souls in obeying the truth through the Spirit unto unfeigned love of the brethren..."
              },
              {
                "reference": "John 8:31–32",
                "text": "If ye continue in my word, then are ye my disciples indeed; And ye shall know the truth, and the truth shall make you free."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that faith, grace, obedience, and response belong together in salvation doctrine and cannot be properly understood in isolation; can name all four categories."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what each category contributes to the doctrine of saving faith — grace as divine provision, faith as trust, obedience as the form of trust, response as the means of entry."
              },
              {
                "level": "Application",
                "expectation": "Shows how the full doctrine of saving faith is expressed in the apostolic new-birth pattern: grace provides the salvation (Titus 3:5); faith receives it in the form of obedient response (Acts 2:38–41); and the Spirit is given as God's gift (Acts 2:38)."
              },
              {
                "level": "Defense",
                "expectation": "Presents the full doctrine and responds to both major distortions — passive assent that avoids response and legalism that treats response as merit."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.10",
        "domainTitle": "The Name of Jesus in Salvation and Covenant Entry",
        "anchorScripture": {
          "reference": "Isaiah 43:10–11",
          "text": "Ye are my witnesses, saith the LORD... I am the LORD; and beside me there is no saviour."
        },
        "standards": [
          {
            "code": "NB.10.1.18",
            "title": "The Name of Jesus as Central to Apostolic Salvation Proclamation",
            "statement": "The learner demonstrates that the name of Jesus is central to apostolic salvation proclamation and response — not peripheral or optional but the covenantal authority under which the new birth is entered.",
            "scope": "The apostles preach, invoke, and apply the name of Jesus in salvation doctrine at every point. Luke 24:47 establishes that repentance and remission are preached \"in his name.\" Acts 4:12 declares that no other name saves. The name appears in healing (Acts 3:6), baptism (Acts 2:38), proclamation (Luke 24:47), and doctrinal defense (Acts 4:10–12). Its presence across all dimensions of apostolic life establishes that the name is not a linguistic detail but a doctrinal reality.",
            "instructionalFocus": "Teach this standard by showing how the name of Jesus permeates every dimension of apostolic life and doctrine. Healing: Acts 3:6. Baptism: Acts 2:38. Proclamation: Luke 24:47. Defense: Acts 4:12. Lordship: Phil. 2:9–11. The name is not an add-on — it is the doctrinal center.",
            "vocabulary": [
              "Name of Jesus",
              "Saving Name",
              "Authority of the Name",
              "Invocation",
              "Covenant Entry Name",
              "Name Confession",
              "Revealed Authority",
              "Name-Bearing Response"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 43:10–11",
                "text": "Ye are my witnesses, saith the LORD... I am the LORD; and beside me there is no saviour."
              },
              {
                "reference": "Joel 2:32",
                "text": "And it shall come to pass, that whosoever shall call on the name of the LORD shall be delivered."
              },
              {
                "reference": "Matthew 1:21",
                "text": "Thou shalt call his name JESUS: for he shall save his people from their sins."
              },
              {
                "reference": "Luke 24:47",
                "text": "That repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:21",
                "text": "Whosoever shall call on the name of the Lord shall be saved."
              },
              {
                "reference": "Acts 2:38",
                "text": "...be baptized every one of you in the name of Jesus Christ for the remission of sins..."
              },
              {
                "reference": "Acts 4:10–12",
                "text": "By the name of Jesus Christ of Nazareth... neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved."
              },
              {
                "reference": "Acts 10:43",
                "text": "To him give all the prophets witness, that through his name whosoever believeth in him shall receive remission of sins."
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God also hath highly exalted him, and given him a name which is above every name: That at the name of Jesus every knee should bow..."
              },
              {
                "reference": "Colossians 3:17",
                "text": "And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the name of Jesus appears centrally in apostolic salvation preaching; can cite Acts 4:12 and state its implication."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the name of Jesus appears across multiple dimensions of apostolic practice — proclamation, baptism, healing, defense — and why this consistent presence establishes its doctrinal centrality."
              },
              {
                "level": "Application",
                "expectation": "Shows how Acts 4:12 functions as the doctrinal statement that ties together all the apostolic name-uses — and why the exclusive saving significance of Jesus' name makes it non-negotiable in new-birth doctrine."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the claim that the name of Jesus is merely a linguistic custom or that other names are equivalent, demonstrating from Scripture that the saving significance of Jesus' name is based on divine designation and apostolic declaration."
              }
            ]
          },
          {
            "code": "NB.10.2.18",
            "title": "Invocation of the Name of Jesus in Relation to Repentance, Baptism, and Remission",
            "statement": "The learner demonstrates that the invocation of the name of Jesus is tied to apostolic repentance, baptism, and remission teaching — and can explain what the name does in each context.",
            "scope": "Repentance is preached \"in his name\" (Luke 24:47). Baptism is commanded \"in the name of Jesus Christ\" for remission (Acts 2:38). Sins are washed away by calling on the name (Acts 22:16). The name is invoked because of who He is — the risen Lord exalted above every name (Phil. 2:9–11). The consistent invocation of Jesus' name across repentance, baptism, and remission establishes it as the covenantal authority structure of the entire new-birth entry.",
            "instructionalFocus": "Teach the three name-invocation contexts together — proclamation, baptism, remission — and help learners see the pattern. The name is the acknowledgment of who Jesus is and submission to the authority God has given Him.\n\nInstructional Focus Extension: \"Calling on the Name of the Lord\" as Covenant Response\n\nTeach \"calling on the name of the Lord\" as an apostolic covenant-response theme, not as an isolated verbal phrase detached from baptism, remission, and Spirit response. The phrase should be traced through the biblical chain rather than handled as a single proof text: Joel 2:32 announces the promise; Acts 2:21 declares the promise active at Pentecost; Acts 2:38 gives the explicit name-response; Romans 10:13 repeats the promise; and Acts 22:16 connects Paul's own calling on the name with baptism and washing away sins.\n\nThe goal is not to deny confession, prayer, or faith. The goal is to prevent a reduced reading that separates \"calling on the name\" from the apostolic response Scripture itself connects to the name. The learner should be able to show that calling on the name includes submission to the authority of Jesus in the form the apostles preached.",
            "vocabulary": [
              "Name of Jesus",
              "Saving Name",
              "Authority of the Name",
              "Invocation",
              "Covenant Entry Name",
              "Name Confession",
              "Revealed Authority",
              "Name-Bearing Response"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 43:10–11",
                "text": "Ye are my witnesses, saith the LORD... I am the LORD; and beside me there is no saviour."
              },
              {
                "reference": "Joel 2:32",
                "text": "And it shall come to pass, that whosoever shall call on the name of the LORD shall be delivered."
              },
              {
                "reference": "Matthew 1:21",
                "text": "Thou shalt call his name JESUS: for he shall save his people from their sins."
              },
              {
                "reference": "Luke 24:47",
                "text": "That repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:21",
                "text": "Whosoever shall call on the name of the Lord shall be saved."
              },
              {
                "reference": "Acts 2:38",
                "text": "...be baptized every one of you in the name of Jesus Christ for the remission of sins..."
              },
              {
                "reference": "Acts 4:10–12",
                "text": "By the name of Jesus Christ of Nazareth... neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved."
              },
              {
                "reference": "Acts 10:43",
                "text": "To him give all the prophets witness, that through his name whosoever believeth in him shall receive remission of sins."
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God also hath highly exalted him, and given him a name which is above every name: That at the name of Jesus every knee should bow..."
              },
              {
                "reference": "Colossians 3:17",
                "text": "And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the name of Jesus is invoked in apostolic repentance proclamation, baptism, and remission teaching; can cite Luke 24:47, Acts 2:38, and Acts 22:16."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what the name of Jesus does in each context — the authority invoked in repentance proclamation, the covenantal form of baptism, the ground of remission — and why its presence in each is doctrinally significant."
              },
              {
                "level": "Application",
                "expectation": "Shows how the consistent invocation of Jesus' name across repentance, baptism, and remission establishes it as the covenantal authority structure of the entire new-birth entry."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that invoking the name of Jesus in baptism and remission is a later church addition, demonstrating from Luke 24:47, Acts 2:38, and Acts 22:16 that the name-invocation belongs to Christ's own commission from its inception."
              }
            ]
          },
          {
            "code": "NB.10.3.18",
            "title": "Synthesis: The Name of Jesus, Authority, and Covenant Response as One Doctrine of Salvation Entry",
            "statement": "The learner demonstrates that the name of Jesus, His revealed authority, and the covenant response of the new birth form one doctrine of salvation entry — and can present this synthesis clearly and confidently.",
            "scope": "The name of Jesus cannot be isolated from the authority of Christ or from the apostolic pattern of response. The name carries divine authority (Phil. 2:9–11). That authority is the ground of apostolic proclamation, baptism (Acts 2:38), and remission (Acts 4:12). Covenant entry happens under and through that name. This standard also prepares the learner to explain baptism in Jesus' name from the apostolic Acts pattern rather than from later trinitarian formulas.",
            "instructionalFocus": "The name is not a password — it is the declaration that Jesus is LORD and Savior (Acts 2:36). Every apostolic act done in the name of Jesus is an acknowledgment of that lordship and an appeal to that authority. Baptism in Jesus' name is the apostolic form of the baptism Christ commanded, administered under the authority He was given.",
            "vocabulary": [
              "Name of Jesus",
              "Saving Name",
              "Authority of the Name",
              "Invocation",
              "Covenant Entry Name",
              "Name Confession",
              "Revealed Authority",
              "Name-Bearing Response"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 43:10–11",
                "text": "Ye are my witnesses, saith the LORD... I am the LORD; and beside me there is no saviour."
              },
              {
                "reference": "Joel 2:32",
                "text": "And it shall come to pass, that whosoever shall call on the name of the LORD shall be delivered."
              },
              {
                "reference": "Matthew 1:21",
                "text": "Thou shalt call his name JESUS: for he shall save his people from their sins."
              },
              {
                "reference": "Luke 24:47",
                "text": "That repentance and remission of sins should be preached in his name among all nations."
              },
              {
                "reference": "Acts 2:21",
                "text": "Whosoever shall call on the name of the Lord shall be saved."
              },
              {
                "reference": "Acts 2:38",
                "text": "...be baptized every one of you in the name of Jesus Christ for the remission of sins..."
              },
              {
                "reference": "Acts 4:10–12",
                "text": "By the name of Jesus Christ of Nazareth... neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved."
              },
              {
                "reference": "Acts 10:43",
                "text": "To him give all the prophets witness, that through his name whosoever believeth in him shall receive remission of sins."
              },
              {
                "reference": "Philippians 2:9–11",
                "text": "God also hath highly exalted him, and given him a name which is above every name: That at the name of Jesus every knee should bow..."
              },
              {
                "reference": "Colossians 3:17",
                "text": "And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the name of Jesus, His authority, and the covenant response are connected; can cite Phil. 2:9–11 (authority), Acts 2:38 (baptism), and Acts 4:12 (exclusive saving name)."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the name's authority grounds its function in the new-birth response — and why the consistent presence of the name across apostolic proclamation, baptism, and remission is doctrine rather than coincidence."
              },
              {
                "level": "Application",
                "expectation": "Shows how the synthesis explains why apostolic baptism is in Jesus' name — and why this is not a deviation from Matthew 28:19 but the apostolic fulfillment of it."
              },
              {
                "level": "Defense",
                "expectation": "Presents the name of Jesus, authority, and covenant response as one integrated doctrine — and responds to challenges about the baptismal formula, the exclusivity of Jesus' name, and the doctrinal necessity of name-invocation."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.11",
        "domainTitle": "Remission, Cleansing, and Covenant Application",
        "anchorScripture": {
          "reference": "Psalm 51:7–12",
          "text": "Purge me with hyssop, and I shall be clean: wash me, and I shall be whiter than snow... Create in me a clean heart, O God; and renew a right spirit within me."
        },
        "standards": [
          {
            "code": "NB.11.1.18",
            "title": "Remission as Part of Apostolic Salvation Doctrine",
            "statement": "The learner demonstrates that remission of sins is a doctrinal category tied to the revealed gospel response — not generic religious comfort but a specific provision attached to apostolic proclamation.",
            "scope": "Remission is not generic religious comfort but a doctrinal category tied to apostolic preaching. Acts 2:38 attaches remission to baptism in Jesus' name. Acts 10:43 connects remission to the prophetic witness fulfilled in Christ. Matthew 26:28 grounds remission in the blood of the new covenant. The learner must understand that remission is not separated from repentance, baptism, the name of Jesus, and covenant fulfillment in apostolic doctrine.",
            "instructionalFocus": "Teach remission by returning to Christ's own words: \"This is my blood of the new testament, which is shed for many for the remission of sins\" (Matt. 26:28). The blood was shed for remission. Baptism in Jesus' name applies that blood for remission (Acts 2:38). The prophets testified that remission would come through His name (Acts 10:43).",
            "vocabulary": [
              "Remission",
              "Cleansing",
              "Washing",
              "Covenant Application",
              "Forgiveness",
              "Redemptive Application",
              "Purification",
              "Cleansed Conscience"
            ],
            "anchorScriptures": [
              {
                "reference": "Psalm 51:7–12",
                "text": "Purge me with hyssop, and I shall be clean: wash me, and I shall be whiter than snow... Create in me a clean heart, O God; and renew a right spirit within me."
              },
              {
                "reference": "Isaiah 1:16–18",
                "text": "Wash you, make you clean... though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool."
              },
              {
                "reference": "Isaiah 53:11–12",
                "text": "He shall see of the travail of his soul, and shall be satisfied: by his knowledge shall my righteous servant justify many; for he shall bear their iniquities."
              },
              {
                "reference": "Zechariah 13:1",
                "text": "In that day there shall be a fountain opened to the house of David and to the inhabitants of Jerusalem for sin and for uncleanness."
              },
              {
                "reference": "Matthew 26:28",
                "text": "For this is my blood of the new testament, which is shed for many for the remission of sins."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins..."
              },
              {
                "reference": "Acts 10:43",
                "text": "To him give all the prophets witness, that through his name whosoever believeth in him shall receive remission of sins."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "1 Corinthians 6:11",
                "text": "And such were some of you: but ye are washed, but ye are sanctified, but ye are justified in the name of the Lord Jesus, and by the Spirit of our God."
              },
              {
                "reference": "1 John 1:7–9",
                "text": "The blood of Jesus Christ his Son cleanseth us from all sin... If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that remission of sins is part of apostolic preaching; can cite Acts 2:38 and state that remission is connected to baptism in Jesus' name."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how remission is presented in multiple apostolic proclamations and why it belongs to the gospel response rather than being available apart from it."
              },
              {
                "level": "Application",
                "expectation": "Shows how remission functions in the full new-birth doctrine as the application of Christ's atoning blood to the believer through the commanded response."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that remission is a general spiritual experience available regardless of apostolic new-birth response, demonstrating from Scripture that remission is consistently presented in connection with specific revealed elements of the gospel response."
              }
            ]
          },
          {
            "code": "NB.11.2.18",
            "title": "Cleansing and Washing as Covenant Application Categories",
            "statement": "The learner demonstrates that cleansing and washing are covenant application categories in apostolic salvation doctrine — not symbolic decoration but doctrinal descriptions of what the new birth accomplishes.",
            "scope": "Salvation is described not only as forgiveness (remission of guilt) but as washing (cleansing of defilement). First Corinthians 6:11 speaks of being washed, sanctified, and justified; Acts 22:16 commands washing away sins; Titus 3:5 describes salvation through the washing of regeneration. The Old Testament prepared this category (Ps. 51:7; Isa. 1:16–18; Ezek. 36:25; Zech. 13:1). The learner must trace this connection and explain why washing language is not accidental but covenantally prepared and doctrinally substantive.",
            "instructionalFocus": "Help learners feel the force of the washing language before explaining it. Psalm 51: \"Wash me, and I shall be whiter than snow.\" Isaiah 1: \"Though your sins be as scarlet, they shall be as white as snow.\" Zechariah 13: \"A fountain opened for sin and for uncleanness.\" Then bring them to Acts 22:16.",
            "vocabulary": [
              "Remission",
              "Cleansing",
              "Washing",
              "Covenant Application",
              "Forgiveness",
              "Redemptive Application",
              "Purification",
              "Cleansed Conscience"
            ],
            "anchorScriptures": [
              {
                "reference": "Psalm 51:7–12",
                "text": "Purge me with hyssop, and I shall be clean: wash me, and I shall be whiter than snow... Create in me a clean heart, O God; and renew a right spirit within me."
              },
              {
                "reference": "Isaiah 1:16–18",
                "text": "Wash you, make you clean... though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool."
              },
              {
                "reference": "Isaiah 53:11–12",
                "text": "He shall see of the travail of his soul, and shall be satisfied: by his knowledge shall my righteous servant justify many; for he shall bear their iniquities."
              },
              {
                "reference": "Zechariah 13:1",
                "text": "In that day there shall be a fountain opened to the house of David and to the inhabitants of Jerusalem for sin and for uncleanness."
              },
              {
                "reference": "Matthew 26:28",
                "text": "For this is my blood of the new testament, which is shed for many for the remission of sins."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins..."
              },
              {
                "reference": "Acts 10:43",
                "text": "To him give all the prophets witness, that through his name whosoever believeth in him shall receive remission of sins."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "1 Corinthians 6:11",
                "text": "And such were some of you: but ye are washed, but ye are sanctified, but ye are justified in the name of the Lord Jesus, and by the Spirit of our God."
              },
              {
                "reference": "1 John 1:7–9",
                "text": "The blood of Jesus Christ his Son cleanseth us from all sin... If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that salvation is described with cleansing and washing language in apostolic doctrine; can cite Acts 22:16 and 1 Corinthians 6:11."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the cleansing and washing language in apostolic doctrine and shows how it connects to the preparatory cleansing categories of the Old Testament."
              },
              {
                "level": "Application",
                "expectation": "Shows how washing and cleansing belong to the full doctrine of new-birth application alongside remission and justification — as dimensions of what God does for the person who enters the new birth."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that washing language in apostolic texts is purely metaphorical, demonstrating that the apostolic use of washing language in specific salvation contexts is doctrinally significant."
              }
            ]
          },
          {
            "code": "NB.11.3.18",
            "title": "Synthesis: Remission, Cleansing, Washing, and Application as One Doctrine",
            "statement": "The learner demonstrates that remission, cleansing, washing, and covenant application form one doctrine of salvation application within the new birth — and can present this doctrine with coherence and doctrinal precision.",
            "scope": "These themes belong together. Salvation is proclaimed, responded to, and applied. Remission and cleansing are not isolated ideas but coordinated salvation categories. Acts 2:38 gives remission, Acts 22:16 gives washing, 1 Corinthians 6:11 gives all three (washed, sanctified, justified) together. The learner must present these as one integrated doctrine. This synthesis equips the learner to explain what actually happens in the new birth.",
            "instructionalFocus": "The problem of sin produces guilt (remission answers), defilement (cleansing answers), and separation (covenant application answers). All three dimensions of the problem are addressed by all three dimensions of the application doctrine.",
            "vocabulary": [
              "Remission",
              "Cleansing",
              "Washing",
              "Covenant Application",
              "Forgiveness",
              "Redemptive Application",
              "Purification",
              "Cleansed Conscience"
            ],
            "anchorScriptures": [
              {
                "reference": "Psalm 51:7–12",
                "text": "Purge me with hyssop, and I shall be clean: wash me, and I shall be whiter than snow... Create in me a clean heart, O God; and renew a right spirit within me."
              },
              {
                "reference": "Isaiah 1:16–18",
                "text": "Wash you, make you clean... though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool."
              },
              {
                "reference": "Isaiah 53:11–12",
                "text": "He shall see of the travail of his soul, and shall be satisfied: by his knowledge shall my righteous servant justify many; for he shall bear their iniquities."
              },
              {
                "reference": "Zechariah 13:1",
                "text": "In that day there shall be a fountain opened to the house of David and to the inhabitants of Jerusalem for sin and for uncleanness."
              },
              {
                "reference": "Matthew 26:28",
                "text": "For this is my blood of the new testament, which is shed for many for the remission of sins."
              },
              {
                "reference": "Acts 2:38",
                "text": "Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins..."
              },
              {
                "reference": "Acts 10:43",
                "text": "To him give all the prophets witness, that through his name whosoever believeth in him shall receive remission of sins."
              },
              {
                "reference": "Acts 22:16",
                "text": "Arise, and be baptized, and wash away thy sins, calling on the name of the Lord."
              },
              {
                "reference": "1 Corinthians 6:11",
                "text": "And such were some of you: but ye are washed, but ye are sanctified, but ye are justified in the name of the Lord Jesus, and by the Spirit of our God."
              },
              {
                "reference": "1 John 1:7–9",
                "text": "The blood of Jesus Christ his Son cleanseth us from all sin... If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States the major application categories: remission, cleansing, and washing; can give one scripture for each."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how remission, cleansing, and washing relate to one another and to the gospel response — and why they form one integrated doctrine of salvation application."
              },
              {
                "level": "Application",
                "expectation": "Shows how the application doctrine answers the question \"What does the new birth actually do?\" — using the three categories to give a comprehensive, apostolically grounded explanation."
              },
              {
                "level": "Defense",
                "expectation": "Presents remission, cleansing, washing, and covenant application as one integrated doctrine — and responds to any attempt to reduce salvation application to only one category."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.12",
        "domainTitle": "Spirit Reception, Signs, and New-Covenant Identification",
        "anchorScripture": {
          "reference": "Isaiah 28:11–12",
          "text": "With stammering lips and another tongue will he speak to this people... yet they would not hear."
        },
        "standards": [
          {
            "code": "NB.12.1.18",
            "title": "Spirit Reception as a Real and Recognizable Part of Apostolic Salvation Doctrine",
            "statement": "The learner demonstrates that Spirit reception is a real and recognizable part of apostolic salvation doctrine — not a purely theoretical category but an experiential reality the apostles expected, recognized, and proclaimed.",
            "scope": "At Pentecost (Acts 2) the 120 are filled and speak with tongues. At Caesarea (Acts 10) the apostles know the Gentiles have received the Spirit because they hear them speak with tongues. At Ephesus (Acts 19) Spirit reception again produces tongues and prophecy. The apostles expected Spirit reception, recognized it, and reported it.",
            "instructionalFocus": "Teach Spirit reception by keeping the Acts accounts at the center. At Pentecost the 120 were filled and spoke with tongues. At Caesarea the apostles knew the Gentiles had received the Spirit because they heard them speak with tongues. At Ephesus Spirit reception produced tongues and prophecy.",
            "vocabulary": [
              "Spirit Reception",
              "Observable Manifestation",
              "Apostolic Witness",
              "Sign Dimension",
              "New-Covenant Identification",
              "Spirit Evidence",
              "Manifestation",
              "Recognition"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 28:11–12",
                "text": "With stammering lips and another tongue will he speak to this people... yet they would not hear."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "Your sons and your daughters shall prophesy, your old men shall dream dreams, your young men shall see visions: And also upon the servants and upon the handmaids in those days will I pour out my spirit."
              },
              {
                "reference": "Acts 2:1–4",
                "text": "They were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance."
              },
              {
                "reference": "Acts 2:33",
                "text": "Therefore being by the right hand of God exalted, and having received of the Father the promise of the Holy Ghost, he hath shed forth this, which ye now see and hear."
              },
              {
                "reference": "Acts 8:14–20",
                "text": "When Simon saw that through laying on of the apostles' hands the Holy Ghost was given... he offered them money."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... For they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "When Paul had laid his hands upon them, the Holy Ghost came on them; and they spake with tongues, and prophesied."
              },
              {
                "reference": "Galatians 4:6",
                "text": "God hath sent forth the Spirit of his Son into your hearts, crying, Abba, Father."
              },
              {
                "reference": "Ephesians 1:13–14",
                "text": "In whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that people in Acts received the Holy Spirit and that this was recognized and reported by the apostles; can name at least three accounts in Acts where Spirit reception is described and recognized."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how Spirit reception was recognized in apostolic witness — specifically that tongues played a role in the apostolic recognition in Acts 2, 10, and 19."
              },
              {
                "level": "Application",
                "expectation": "Shows how the apostolic expectation of recognizable Spirit reception shapes the practice of the new-birth community — and why dismissing the sign dimension requires dismissing the apostolic evidence."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that Spirit reception is purely invisible and that the tongues in Acts were either non-normative or non-evidential, demonstrating that the apostolic accounts consistently treat tongues as the basis for recognizing and confirming Spirit reception."
              }
            ]
          },
          {
            "code": "NB.12.2.18",
            "title": "The Sign Dimension of Spirit Reception in Relation to Apostolic Witness",
            "statement": "The learner demonstrates that Spirit reception includes a sign dimension in key apostolic texts — specifically tongues as the Spirit gives utterance — and can explain why this sign is doctrinally significant in the apostolic witness.",
            "scope": "Acts 10:46–47 is the interpretive key: Peter and the circumcision believers knew the Gentiles had received the Holy Spirit because they heard them speak with tongues. Tongues is explicitly the basis for apostolic recognition. The sign dimension belongs to apostolic recognition, fulfillment of the Joel promise, and public witness.",
            "instructionalFocus": "Focus on Acts 10:46–47 as the interpretive key. Ask the learner: How did Peter and the circumcision believers know the Gentiles had received the Holy Ghost? The text answers: \"For they heard them speak with tongues, and magnify God.\" Tongues is explicitly the basis for recognition.",
            "vocabulary": [
              "Spirit Reception",
              "Observable Manifestation",
              "Apostolic Witness",
              "Sign Dimension",
              "New-Covenant Identification",
              "Spirit Evidence",
              "Manifestation",
              "Recognition"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 28:11–12",
                "text": "With stammering lips and another tongue will he speak to this people... yet they would not hear."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "Your sons and your daughters shall prophesy, your old men shall dream dreams, your young men shall see visions: And also upon the servants and upon the handmaids in those days will I pour out my spirit."
              },
              {
                "reference": "Acts 2:1–4",
                "text": "They were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance."
              },
              {
                "reference": "Acts 2:33",
                "text": "Therefore being by the right hand of God exalted, and having received of the Father the promise of the Holy Ghost, he hath shed forth this, which ye now see and hear."
              },
              {
                "reference": "Acts 8:14–20",
                "text": "When Simon saw that through laying on of the apostles' hands the Holy Ghost was given... he offered them money."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... For they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "When Paul had laid his hands upon them, the Holy Ghost came on them; and they spake with tongues, and prophesied."
              },
              {
                "reference": "Galatians 4:6",
                "text": "God hath sent forth the Spirit of his Son into your hearts, crying, Abba, Father."
              },
              {
                "reference": "Ephesians 1:13–14",
                "text": "In whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that some Spirit-reception accounts in Acts include observable manifestation (tongues) and that the apostles treated this as evidence of Spirit reception; can cite Acts 10:46–47."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why tongues functions as apostolic evidence of Spirit reception in Acts 2, 10, and 19 — and how Peter's use of the Pentecost experience as a comparison point (Acts 11:15) establishes the pattern."
              },
              {
                "level": "Application",
                "expectation": "Shows how the sign dimension belongs to the apostolic doctrine of initial evidence — and why this doctrine is grounded in the Acts accounts rather than in later theological tradition."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that tongues in Acts was situational and non-normative, demonstrating that the consistent pattern across Acts 2, 10, and 19 — in settings as different as Jerusalem, Caesarea, and Ephesus — establishes the pattern as normative rather than situational."
              }
            ]
          },
          {
            "code": "NB.12.3.18",
            "title": "Synthesis: Spirit Reception, Sign, and New-Covenant Identity as One Doctrine",
            "statement": "The learner demonstrates that Spirit reception, observable sign, and new-covenant identity form one doctrine of Spirit-born identification — and can present this synthesis with apostolic coherence and theological balance.",
            "scope": "The reception of the Spirit publicly identifies believers as participants in new-covenant life. Observable manifestation in key texts supports the apostolic recognition of that reception. New-covenant identity is confirmed both inwardly (the Spirit crying \"Abba, Father\" in the heart, Gal. 4:6) and outwardly (tongues as the apostolic sign of reception). The goal is not the sign — the goal is the Spirit. The sign is the initial evidence of what has been received.",
            "instructionalFocus": "The Spirit is received — that is the doctrinal center. The tongues sign is the apostolic evidence by which that reception is recognized and confirmed. The new-covenant identity that follows is the ongoing reality of life in the Spirit. All three belong together.",
            "vocabulary": [
              "Spirit Reception",
              "Observable Manifestation",
              "Apostolic Witness",
              "Sign Dimension",
              "New-Covenant Identification",
              "Spirit Evidence",
              "Manifestation",
              "Recognition"
            ],
            "anchorScriptures": [
              {
                "reference": "Isaiah 28:11–12",
                "text": "With stammering lips and another tongue will he speak to this people... yet they would not hear."
              },
              {
                "reference": "Joel 2:28–29",
                "text": "Your sons and your daughters shall prophesy, your old men shall dream dreams, your young men shall see visions: And also upon the servants and upon the handmaids in those days will I pour out my spirit."
              },
              {
                "reference": "Acts 2:1–4",
                "text": "They were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance."
              },
              {
                "reference": "Acts 2:33",
                "text": "Therefore being by the right hand of God exalted, and having received of the Father the promise of the Holy Ghost, he hath shed forth this, which ye now see and hear."
              },
              {
                "reference": "Acts 8:14–20",
                "text": "When Simon saw that through laying on of the apostles' hands the Holy Ghost was given... he offered them money."
              },
              {
                "reference": "Acts 10:44–47",
                "text": "While Peter yet spake these words, the Holy Ghost fell on all them which heard the word... For they heard them speak with tongues, and magnify God."
              },
              {
                "reference": "Acts 11:15–17",
                "text": "As I began to speak, the Holy Ghost fell on them, as on us at the beginning."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "When Paul had laid his hands upon them, the Holy Ghost came on them; and they spake with tongues, and prophesied."
              },
              {
                "reference": "Galatians 4:6",
                "text": "God hath sent forth the Spirit of his Son into your hearts, crying, Abba, Father."
              },
              {
                "reference": "Ephesians 1:13–14",
                "text": "In whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that Spirit reception identifies believers with new-covenant life and that the sign dimension is apostolically attested."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how Spirit reception, the tongues sign, and new-covenant identity belong together in apostolic doctrine — and why each requires the others to complete the picture."
              },
              {
                "level": "Application",
                "expectation": "Shows how the full doctrine of Spirit-born identification answers the question \"How do we know someone has received the Spirit?\" — using both the apostolic sign (tongues) and the ongoing identity evidence (Abba, Father; fruit of the Spirit; transformed life)."
              },
              {
                "level": "Defense",
                "expectation": "Presents Spirit reception, sign, and new-covenant identity as one integrated doctrine — and responds to both reductions: (1) dismissing the sign as irrelevant, and (2) treating the sign as the only thing that matters."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.13",
        "domainTitle": "The New Birth and Entry into the Church",
        "anchorScripture": {
          "reference": "Exodus 19:5–6",
          "text": "Ye shall be a peculiar treasure unto me above all people... a kingdom of priests, and an holy nation."
        },
        "standards": [
          {
            "code": "NB.13.1.18",
            "title": "The New Birth as Entrance into Apostolic Covenant Community",
            "statement": "The learner demonstrates that the new birth brings the believer into apostolic covenant community — and that this communal dimension is not optional but belongs to what the new birth creates.",
            "scope": "Those who receive the apostolic new birth are added to the people of God in visible covenant life. Acts 2:41–47 is the model: the three thousand baptized on the day of Pentecost were immediately added to the community and continued in apostolic doctrine, fellowship, breaking of bread, and prayers. New birth and community membership were simultaneous — the new birth did not produce three thousand individual spiritual journeys but one apostolic community.",
            "instructionalFocus": "Help learners see what happened on the day of Pentecost: the Spirit was received, three thousand were baptized, and they were all added to one community that began immediately to live out apostolic doctrine together. The new birth produced one apostolic community.",
            "vocabulary": [
              "Church",
              "Body of Christ",
              "Covenant Community",
              "Apostolic Fellowship",
              "Entry into the Church",
              "Spiritual Union",
              "Visible Community",
              "Doctrinal Community",
              "Church Identity",
              "One Body"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 19:5–6",
                "text": "Ye shall be a peculiar treasure unto me above all people... a kingdom of priests, and an holy nation."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant... I will be their God, and they shall be my people."
              },
              {
                "reference": "Matthew 16:18",
                "text": "I will build my church; and the gates of hell shall not prevail against it."
              },
              {
                "reference": "Acts 2:41–47",
                "text": "They that gladly received his word were baptized: and the same day there were added unto them about three thousand souls. And they continued stedfastly in the apostles' doctrine and fellowship, and in breaking of bread, and in prayers."
              },
              {
                "reference": "1 Corinthians 12:12–13",
                "text": "For as the body is one, and hath many members... For by one Spirit are we all baptized into one body..."
              },
              {
                "reference": "Ephesians 2:19–22",
                "text": "Ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God; And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "There is one body, and one Spirit... one hope of your calling; One Lord, one faith, one baptism, One God and Father of all."
              },
              {
                "reference": "1 Peter 2:9–10",
                "text": "Ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people... which in time past were not a people, but are now the people of God."
              },
              {
                "reference": "Hebrews 10:24–25",
                "text": "And let us consider one another to provoke unto love and to good works: Not forsaking the assembling of ourselves together..."
              },
              {
                "reference": "John 17:20–23",
                "text": "That they all may be one; as thou, Father, art in me, and I in thee, that they also may be one in us..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that those who receive the new birth are added to the church; can cite Acts 2:41–47 and describe what the new community immediately did together."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how Acts 2:41–47 establishes the inseparability of new birth and community membership — and why the church is the covenant community created by the gospel response rather than an optional organizational addition."
              },
              {
                "level": "Application",
                "expectation": "Shows how 1 Corinthians 12:12–13 and Ephesians 2:19–22 provide the theological explanation of what Acts 2 demonstrates historically."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that the new birth is complete as a private spiritual transaction and that church membership is a subsequent personal choice, demonstrating from Scripture that the new birth itself creates community membership."
              }
            ]
          },
          {
            "code": "NB.13.2.18",
            "title": "The Church as the Body Formed by One Gospel, One Spirit, and One Covenant Life",
            "statement": "The learner demonstrates that the church is the body formed by one gospel, one Spirit, and one covenant life — and can explain why the church's doctrinal definition matters for understanding the new birth.",
            "scope": "The church is not formed by preference, ethnicity, social similarity, or organizational invention but by the gospel, the Spirit, and entry into one apostolic life. Ephesians 4:4–6 gives the comprehensive doctrinal definition: one body, one Spirit, one hope, one Lord, one faith, one baptism, one God and Father of all. The same gospel, Spirit, and baptism that define the new birth also define the church the new birth creates.",
            "instructionalFocus": "Teach the seven unities of Ephesians 4:4–6 not as a list to memorize but as a doctrinal argument. One body — because there is one Spirit forming it. One faith — the apostolic doctrine received from the apostles. One baptism — the baptism in Jesus' name for remission.",
            "vocabulary": [
              "Church",
              "Body of Christ",
              "Covenant Community",
              "Apostolic Fellowship",
              "Entry into the Church",
              "Spiritual Union",
              "Visible Community",
              "Doctrinal Community",
              "Church Identity",
              "One Body"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 19:5–6",
                "text": "Ye shall be a peculiar treasure unto me above all people... a kingdom of priests, and an holy nation."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant... I will be their God, and they shall be my people."
              },
              {
                "reference": "Matthew 16:18",
                "text": "I will build my church; and the gates of hell shall not prevail against it."
              },
              {
                "reference": "Acts 2:41–47",
                "text": "They that gladly received his word were baptized: and the same day there were added unto them about three thousand souls. And they continued stedfastly in the apostles' doctrine and fellowship, and in breaking of bread, and in prayers."
              },
              {
                "reference": "1 Corinthians 12:12–13",
                "text": "For as the body is one, and hath many members... For by one Spirit are we all baptized into one body..."
              },
              {
                "reference": "Ephesians 2:19–22",
                "text": "Ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God; And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "There is one body, and one Spirit... one hope of your calling; One Lord, one faith, one baptism, One God and Father of all."
              },
              {
                "reference": "1 Peter 2:9–10",
                "text": "Ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people... which in time past were not a people, but are now the people of God."
              },
              {
                "reference": "Hebrews 10:24–25",
                "text": "And let us consider one another to provoke unto love and to good works: Not forsaking the assembling of ourselves together..."
              },
              {
                "reference": "John 17:20–23",
                "text": "That they all may be one; as thou, Father, art in me, and I in thee, that they also may be one in us..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the church is one body formed by one gospel and one Spirit; can cite Ephesians 4:4–6 and name the seven unities."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the doctrinal unities of Ephesians 4 define the church — and why a church not formed by these unities is not the apostolic community."
              },
              {
                "level": "Application",
                "expectation": "Shows how the doctrinal definition of the church connects to the new-birth doctrine of previous domains — same baptism, same Spirit, same gospel — and why the church is the community created by entering those unities."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that any sincere Christian community constitutes the body of Christ — demonstrating from Ephesians 4:4–6 and Acts 2:42–47 that the apostolic church is defined by specific doctrinal commitments."
              }
            ]
          },
          {
            "code": "NB.13.3.18",
            "title": "Synthesis: New Birth, Covenant Belonging, and Church Identity as One Doctrine of Apostolic Entry",
            "statement": "The learner demonstrates that new birth, covenant belonging, and church identity form one doctrine of apostolic entry into the people of God — inseparable in theology, inseparable in practice.",
            "scope": "The learner must not separate salvation from church identity. The new birth leads into covenant belonging, doctrinal fellowship, worship, prayer, and shared apostolic life. Acts 2:41–47 shows what this looks like: immediate addition to the community, continuation in apostolic doctrine and fellowship, breaking of bread, and prayer. Being added to the church (Acts 2:41) means entering the actual life of the community — not merely enrolling in an organization.",
            "instructionalFocus": "The new birth is not the beginning of a solo spiritual journey — it is the beginning of covenant community life. Acts 2:42–47 shows what that community life actually looks like: teaching, fellowship, breaking of bread, prayer, mutual care, gladness, simplicity of heart. This is covenant family.",
            "vocabulary": [
              "Church",
              "Body of Christ",
              "Covenant Community",
              "Apostolic Fellowship",
              "Entry into the Church",
              "Spiritual Union",
              "Visible Community",
              "Doctrinal Community",
              "Church Identity",
              "One Body"
            ],
            "anchorScriptures": [
              {
                "reference": "Exodus 19:5–6",
                "text": "Ye shall be a peculiar treasure unto me above all people... a kingdom of priests, and an holy nation."
              },
              {
                "reference": "Jeremiah 31:31–34",
                "text": "I will make a new covenant... I will be their God, and they shall be my people."
              },
              {
                "reference": "Matthew 16:18",
                "text": "I will build my church; and the gates of hell shall not prevail against it."
              },
              {
                "reference": "Acts 2:41–47",
                "text": "They that gladly received his word were baptized: and the same day there were added unto them about three thousand souls. And they continued stedfastly in the apostles' doctrine and fellowship, and in breaking of bread, and in prayers."
              },
              {
                "reference": "1 Corinthians 12:12–13",
                "text": "For as the body is one, and hath many members... For by one Spirit are we all baptized into one body..."
              },
              {
                "reference": "Ephesians 2:19–22",
                "text": "Ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God; And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone."
              },
              {
                "reference": "Ephesians 4:4–6",
                "text": "There is one body, and one Spirit... one hope of your calling; One Lord, one faith, one baptism, One God and Father of all."
              },
              {
                "reference": "1 Peter 2:9–10",
                "text": "Ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people... which in time past were not a people, but are now the people of God."
              },
              {
                "reference": "Hebrews 10:24–25",
                "text": "And let us consider one another to provoke unto love and to good works: Not forsaking the assembling of ourselves together..."
              },
              {
                "reference": "John 17:20–23",
                "text": "That they all may be one; as thou, Father, art in me, and I in thee, that they also may be one in us..."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the new birth and church belonging are connected — and that Acts 2:41–47 shows them as simultaneous."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how new birth and covenant belonging are inseparable — and what covenant belonging actually involves (doctrine, fellowship, worship, prayer) rather than mere formal membership."
              },
              {
                "level": "Application",
                "expectation": "Shows how the theological images of Ephesians 2:19–22 and 1 Peter 2:9–10 (citizen, household, priest, holy nation) describe what covenant belonging means in the new-birth context."
              },
              {
                "level": "Defense",
                "expectation": "Presents new birth, covenant belonging, and church identity as one doctrine — and responds to both errors: (1) optional church membership, and (2) equating church membership with salvation."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.14",
        "domainTitle": "The New Birth and Transformed Living",
        "anchorScripture": {
          "reference": "Leviticus 11:44–45",
          "text": "Ye shall be holy: for I am holy."
        },
        "standards": [
          {
            "code": "NB.14.1.18",
            "title": "Transformed Living as the Fruit of the New Birth",
            "statement": "The learner demonstrates that transformed living is the fruit of the new birth and the expected continuation of salvation in covenant life — Spirit-produced, not self-generated, and inseparable from the new birth that produces it.",
            "scope": "The new birth produces change. The new birth is not merely a status claim but brings newness of life (Rom. 6:4), makes a person a new creature (2 Cor. 5:17), and issues in walking in the Spirit (Gal. 5:16). The Spirit is the source of transformed living — not willpower applied to moral categories but the Spirit within producing what Ezekiel promised: \"I will cause you to walk in my statutes\" (Ezek. 36:27).",
            "instructionalFocus": "If a person has truly been born of the Spirit, they have received new life — and new life produces new living. The Spirit that gives life (John 6:63) is the Spirit that produces fruit (Gal. 5:22–23). A learner who understands this will pursue holiness not as a condition of acceptance but as the natural expression of the life they have been given.",
            "vocabulary": [
              "Transformed Living",
              "Holiness",
              "Obedience",
              "Fruit of the Spirit",
              "Sanctified Life",
              "Kingdom Life",
              "Spiritual Formation",
              "Separated Living",
              "Worship Life",
              "Newness of Life"
            ],
            "anchorScriptures": [
              {
                "reference": "Leviticus 11:44–45",
                "text": "Ye shall be holy: for I am holy."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Matthew 5:13–16",
                "text": "Ye are the salt of the earth... Ye are the light of the world... Let your light so shine before men, that they may see your good works."
              },
              {
                "reference": "Romans 6:11–23",
                "text": "Yield yourselves unto God, as those that are alive from the dead... For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Romans 12:1–2",
                "text": "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice... be not conformed to this world: but be ye transformed by the renewing of your mind."
              },
              {
                "reference": "Galatians 5:16–25",
                "text": "Walk in the Spirit, and ye shall not fulfil the lust of the flesh... The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance."
              },
              {
                "reference": "Ephesians 4:17–32",
                "text": "This I say therefore... that ye henceforth walk not as other Gentiles walk... And that ye put on the new man."
              },
              {
                "reference": "Colossians 3:1–17",
                "text": "If ye then be risen with Christ, seek those things which are above... Mortify therefore your members which are upon the earth..."
              },
              {
                "reference": "Titus 2:11–14",
                "text": "For the grace of God that bringeth salvation hath appeared to all men, Teaching us that, denying ungodliness and worldly lusts, we should live soberly, righteously, and godly, in this present world."
              },
              {
                "reference": "1 Peter 1:13–16",
                "text": "Be sober, and hope to the end for the grace... As obedient children, not fashioning yourselves according to the former lusts... Be ye holy; for I am holy."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that salvation changes how a person lives; can cite 2 Corinthians 5:17 and state its implication for new-birth living."
              },
              {
                "level": "Explanation",
                "expectation": "Explains that transformed living is the fruit of the new birth — Spirit-produced, not self-generated — and names key dimensions of that transformation (holiness, obedience, fruit of the Spirit)."
              },
              {
                "level": "Application",
                "expectation": "Shows how Romans 6:11–23 connects the new-birth teaching of burial and resurrection (v.3–4) to the call for transformed living (v.11–23) — making explicit that baptism into Christ's death issues in walking in newness of life."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that lifestyle transformation is unrelated to the doctrine of the new birth — demonstrating from 2 Corinthians 5:17, Romans 6, Galatians 5, and Titus 2:11–14 that transformed living is the necessary fruit of Spirit-born life."
              }
            ]
          },
          {
            "code": "NB.14.2.18",
            "title": "Holiness and Separation as Fitting Responses to New-Covenant Salvation",
            "statement": "The learner demonstrates that holiness and separation are fitting responses to new-covenant salvation and belonging to God — grounded in God's nature and the covenant identity of His people.",
            "scope": "\"Be ye holy; for I am holy\" (1 Pet. 1:16) is addressed to all who have received the new birth. Separation must be read theologically rather than as mere cultural style: it arises from divine holiness, covenant belonging, and transformed identity. The new-birth community is separate from the world not because it rejects culture arbitrarily but because it belongs to God.",
            "instructionalFocus": "Help learners understand that holiness is not the church's attempt to make them uncomfortable — it is the natural expression of belonging to God. Use Titus 2:11–14 as the model: grace teaches us to deny ungodliness. The same grace that saves also trains.",
            "vocabulary": [
              "Transformed Living",
              "Holiness",
              "Obedience",
              "Fruit of the Spirit",
              "Sanctified Life",
              "Kingdom Life",
              "Spiritual Formation",
              "Separated Living",
              "Worship Life",
              "Newness of Life"
            ],
            "anchorScriptures": [
              {
                "reference": "Leviticus 11:44–45",
                "text": "Ye shall be holy: for I am holy."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Matthew 5:13–16",
                "text": "Ye are the salt of the earth... Ye are the light of the world... Let your light so shine before men, that they may see your good works."
              },
              {
                "reference": "Romans 6:11–23",
                "text": "Yield yourselves unto God, as those that are alive from the dead... For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Romans 12:1–2",
                "text": "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice... be not conformed to this world: but be ye transformed by the renewing of your mind."
              },
              {
                "reference": "Galatians 5:16–25",
                "text": "Walk in the Spirit, and ye shall not fulfil the lust of the flesh... The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance."
              },
              {
                "reference": "Ephesians 4:17–32",
                "text": "This I say therefore... that ye henceforth walk not as other Gentiles walk... And that ye put on the new man."
              },
              {
                "reference": "Colossians 3:1–17",
                "text": "If ye then be risen with Christ, seek those things which are above... Mortify therefore your members which are upon the earth..."
              },
              {
                "reference": "Titus 2:11–14",
                "text": "For the grace of God that bringeth salvation hath appeared to all men, Teaching us that, denying ungodliness and worldly lusts, we should live soberly, righteously, and godly, in this present world."
              },
              {
                "reference": "1 Peter 1:13–16",
                "text": "Be sober, and hope to the end for the grace... As obedient children, not fashioning yourselves according to the former lusts... Be ye holy; for I am holy."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that God's people are called to holiness; can cite 1 Peter 1:15–16 and connect it to Leviticus 11:44–45."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why holiness and separation are fitting responses to salvation — grounded in God's nature, covenant belonging, and transformed identity."
              },
              {
                "level": "Application",
                "expectation": "Shows how the apostolic teaching on holiness connects to the new-birth doctrine — using Romans 12:1–2, Colossians 3:1–17, and Titus 2:11–14 to trace the holiness call."
              },
              {
                "level": "Defense",
                "expectation": "Responds to both reductions of holiness — (1) holiness as optional personal style, and (2) holiness as external rule-keeping without inward reality."
              }
            ]
          },
          {
            "code": "NB.14.3.18",
            "title": "Worship, Prayer, and Obedience as Continuing Practices of Spirit-Born Life",
            "statement": "The learner demonstrates that worship, prayer, and obedience are continuing practices of Spirit-born life — the ongoing covenant expressions of those who have entered new-birth salvation.",
            "scope": "Acts 2:42–47 shows this immediately: the new-birth community continues in apostolic doctrine, fellowship, breaking of bread, prayer, and worship with gladness. These practices are not attempts to earn salvation but expressions of life in God — fruits of spiritual birth and means of continuing formation.",
            "instructionalFocus": "Prayer is the Spirit-born person speaking to their Father (Gal. 4:6). Worship is the Spirit within magnifying God (Acts 2:47). Obedience is the ongoing covenant expression of the love awakened at new birth (John 14:15). These are not burdens — they are the natural practices of a relationship with God.",
            "vocabulary": [
              "Transformed Living",
              "Holiness",
              "Obedience",
              "Fruit of the Spirit",
              "Sanctified Life",
              "Kingdom Life",
              "Spiritual Formation",
              "Separated Living",
              "Worship Life",
              "Newness of Life"
            ],
            "anchorScriptures": [
              {
                "reference": "Leviticus 11:44–45",
                "text": "Ye shall be holy: for I am holy."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Matthew 5:13–16",
                "text": "Ye are the salt of the earth... Ye are the light of the world... Let your light so shine before men, that they may see your good works."
              },
              {
                "reference": "Romans 6:11–23",
                "text": "Yield yourselves unto God, as those that are alive from the dead... For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Romans 12:1–2",
                "text": "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice... be not conformed to this world: but be ye transformed by the renewing of your mind."
              },
              {
                "reference": "Galatians 5:16–25",
                "text": "Walk in the Spirit, and ye shall not fulfil the lust of the flesh... The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance."
              },
              {
                "reference": "Ephesians 4:17–32",
                "text": "This I say therefore... that ye henceforth walk not as other Gentiles walk... And that ye put on the new man."
              },
              {
                "reference": "Colossians 3:1–17",
                "text": "If ye then be risen with Christ, seek those things which are above... Mortify therefore your members which are upon the earth..."
              },
              {
                "reference": "Titus 2:11–14",
                "text": "For the grace of God that bringeth salvation hath appeared to all men, Teaching us that, denying ungodliness and worldly lusts, we should live soberly, righteously, and godly, in this present world."
              },
              {
                "reference": "1 Peter 1:13–16",
                "text": "Be sober, and hope to the end for the grace... As obedient children, not fashioning yourselves according to the former lusts... Be ye holy; for I am holy."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that believers continue in prayer, worship, and obedience as expressions of their new life in God; can name these practices from Acts 2:42–47."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why these practices flow from new life in God rather than being conditions laid upon it — and how Acts 2:42–47 shows them as immediate fruits of the new-birth community."
              },
              {
                "level": "Application",
                "expectation": "Shows how John 14:15 (\"If ye love me, keep my commandments\") and Galatians 4:6 (the Spirit crying Abba, Father) connect continuing obedience and prayer to the Spirit-born life rather than to external law."
              },
              {
                "level": "Defense",
                "expectation": "Responds to the view that ongoing spiritual practices are works-righteousness or unnecessary for those already saved — demonstrating from Scripture that worship, prayer, and obedience are the ongoing shape of covenant life, not conditions of salvation."
              }
            ]
          },
          {
            "code": "NB.14.4.18",
            "title": "Synthesis: New Birth, Holiness, Devotion, and Obedience as One Doctrine of Transformed Kingdom Life",
            "statement": "The learner demonstrates that new birth, holiness, devotion, and obedience form one doctrine of transformed kingdom life — and can present this synthesis with theological depth and apostolic coherence.",
            "scope": "New birth leads into holiness. Holiness leads into devotion. Devotion is expressed in obedience and kingdom-minded living. These are not four separate doctrines but the sequential expression of one new-birth life lived under the rule of God. A new birth with no transformation is not the apostolic doctrine. A transformed life without the new birth as its source is not Christian sanctification — it is moral effort without divine ground.",
            "instructionalFocus": "The new birth produces a person being conformed to the image of Christ by the Spirit, living under the rule of God, worshiping with sincerity, praying with faith, and obeying with love. This is kingdom life — the life Christ died to make possible, the Spirit makes real, and the apostolic community embodies.",
            "vocabulary": [
              "Transformed Living",
              "Holiness",
              "Obedience",
              "Fruit of the Spirit",
              "Sanctified Life",
              "Kingdom Life",
              "Spiritual Formation",
              "Separated Living",
              "Worship Life",
              "Newness of Life"
            ],
            "anchorScriptures": [
              {
                "reference": "Leviticus 11:44–45",
                "text": "Ye shall be holy: for I am holy."
              },
              {
                "reference": "Ezekiel 36:26–27",
                "text": "A new spirit will I put within you... I will put my spirit within you, and cause you to walk in my statutes."
              },
              {
                "reference": "Matthew 5:13–16",
                "text": "Ye are the salt of the earth... Ye are the light of the world... Let your light so shine before men, that they may see your good works."
              },
              {
                "reference": "Romans 6:11–23",
                "text": "Yield yourselves unto God, as those that are alive from the dead... For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord."
              },
              {
                "reference": "Romans 12:1–2",
                "text": "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice... be not conformed to this world: but be ye transformed by the renewing of your mind."
              },
              {
                "reference": "Galatians 5:16–25",
                "text": "Walk in the Spirit, and ye shall not fulfil the lust of the flesh... The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance."
              },
              {
                "reference": "Ephesians 4:17–32",
                "text": "This I say therefore... that ye henceforth walk not as other Gentiles walk... And that ye put on the new man."
              },
              {
                "reference": "Colossians 3:1–17",
                "text": "If ye then be risen with Christ, seek those things which are above... Mortify therefore your members which are upon the earth..."
              },
              {
                "reference": "Titus 2:11–14",
                "text": "For the grace of God that bringeth salvation hath appeared to all men, Teaching us that, denying ungodliness and worldly lusts, we should live soberly, righteously, and godly, in this present world."
              },
              {
                "reference": "1 Peter 1:13–16",
                "text": "Be sober, and hope to the end for the grace... As obedient children, not fashioning yourselves according to the former lusts... Be ye holy; for I am holy."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the new birth leads into kingdom life and names holiness, devotion, and obedience as its expressions; can name all four categories and give one scripture for each."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how new birth, holiness, devotion, and obedience form one connected doctrine — and why separating any of them weakens the whole."
              },
              {
                "level": "Application",
                "expectation": "Shows how the Acts 2:42–47 community immediately expresses all four dimensions of transformed kingdom life — and why this first community is the model for the new-birth community in every generation."
              },
              {
                "level": "Defense",
                "expectation": "Presents new birth, holiness, devotion, and obedience as one integrated doctrine — and responds to any attempt to separate transformation from the new birth itself."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.15",
        "domainTitle": "Historical Reduction, Doctrinal Distortion, and Partial Salvation Claims",
        "anchorScripture": {
          "reference": "Deuteronomy 4:2",
          "text": "Ye shall not add unto the word which I command you, neither shall ye diminish ought from it."
        },
        "standards": [
          {
            "code": "NB.15.1.18",
            "title": "Identifying Partial Salvation Claims That Reduce Apostolic New-Birth Doctrine",
            "statement": "The learner demonstrates the ability to identify partial salvation claims that reduce apostolic new-birth doctrine — and can explain why each reduction is insufficient.",
            "scope": "Reduced salvation teaching often appears sincere and biblical on the surface. Reduction may occur by isolating belief from response (\"just believe and you're saved\"), by treating baptism as irrelevant (\"baptism is only symbolic\"), by minimizing Spirit birth (\"Spirit baptism is a second blessing for some, not required for all\"), or by replacing apostolic pattern with private preference. Identifying reduction is not the same as condemning sincere people — the goal is doctrinal discernment, not personal judgment.",
            "instructionalFocus": "Teach this standard by examining real reductions the learner will actually encounter. The most common: \"Repent and believe — nothing else is required.\" The response: Acts 2:38 commands repentance and baptism, and promises the Spirit. Help learners see that identifying reductions is not arrogance — it is doctrinal clarity in service of apostolic faithfulness.",
            "vocabulary": [
              "Partial Salvation Claim",
              "Doctrinal Distortion",
              "Reductionism",
              "Selective Reading",
              "False Assurance",
              "Doctrinal Omission",
              "Salvation Minimalism",
              "Apostolic Standard",
              "Scriptural Fullness"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 4:2",
                "text": "Ye shall not add unto the word which I command you, neither shall ye diminish ought from it."
              },
              {
                "reference": "Isaiah 29:13",
                "text": "This people draw near me with their mouth, and with their lips do honour me, but have removed their heart far from me, and their fear toward me is taught by the precept of men."
              },
              {
                "reference": "Matthew 7:21–23",
                "text": "Not every one that saith unto me, Lord, Lord, shall enter into the kingdom of heaven... I never knew you: depart from me, ye that work iniquity."
              },
              {
                "reference": "Acts 8:12–17",
                "text": "They were baptized, both men and women... the Holy Ghost was not yet fallen upon any of them."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "He said unto them, Have ye received the Holy Ghost since ye believed? And they said... We have not so much as heard whether there be any Holy Ghost."
              },
              {
                "reference": "Galatians 1:6–9",
                "text": "I marvel that ye are so soon removed from him that called you into the grace of Christ unto another gospel... let him be accursed."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men, after the rudiments of the world, and not after Christ."
              },
              {
                "reference": "2 Timothy 4:3–4",
                "text": "The time will come when they will not endure sound doctrine; but after their own lusts shall they heap to themselves teachers, having itching ears... shall be turned unto fables."
              },
              {
                "reference": "Titus 1:9",
                "text": "Holding fast the faithful word as he hath been taught, that he may be able by sound doctrine both to exhort and to convince the gainsayers."
              },
              {
                "reference": "Jude 3–4",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints. For there are certain men crept in unawares... turning the grace of our God into lasciviousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that some salvation teachings are incomplete; can name at least two common reductions of new-birth doctrine."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how each common reduction operates — what it keeps, what it drops, and why what it drops is doctrinally essential; can explain at least three reductions in specific terms."
              },
              {
                "level": "Application",
                "expectation": "Shows how to measure partial claims against the full apostolic doctrine — using the standards of Domains 1–14 as the baseline and identifying specific omissions."
              },
              {
                "level": "Defense",
                "expectation": "Demonstrates mature doctrinal discernment by identifying and explaining partial salvation claims, naming the specific reduction in each case, and showing from Scripture why the omitted element is essential to the full doctrine."
              }
            ]
          },
          {
            "code": "NB.15.2.18",
            "title": "Why Selective Readings of Faith, Grace, or Experience Can Distort the New Birth",
            "statement": "The learner demonstrates that selective readings of faith, grace, or experience can distort the doctrine of the new birth — and can explain why scriptural fullness is necessary to preserve apostolic salvation doctrine.",
            "scope": "Error often arises not from denying Scripture outright but from selecting one thread and using it against the rest. Grace without commanded response distorts the new birth by removing obedience from faith. Faith without apostolic content detaches belief from the revealed response. Experience without doctrine replaces apostolic witness with subjective validation. The full witness of Scripture — not a selected portion — is the standard.",
            "instructionalFocus": "Help learners understand that partial truth is the most effective form of error. A person cannot be corrected with a single verse — they must be shown the full pattern. Teach learners to always ask: What does the whole apostolic witness say?",
            "vocabulary": [
              "Partial Salvation Claim",
              "Doctrinal Distortion",
              "Reductionism",
              "Selective Reading",
              "False Assurance",
              "Doctrinal Omission",
              "Salvation Minimalism",
              "Apostolic Standard",
              "Scriptural Fullness"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 4:2",
                "text": "Ye shall not add unto the word which I command you, neither shall ye diminish ought from it."
              },
              {
                "reference": "Isaiah 29:13",
                "text": "This people draw near me with their mouth, and with their lips do honour me, but have removed their heart far from me, and their fear toward me is taught by the precept of men."
              },
              {
                "reference": "Matthew 7:21–23",
                "text": "Not every one that saith unto me, Lord, Lord, shall enter into the kingdom of heaven... I never knew you: depart from me, ye that work iniquity."
              },
              {
                "reference": "Acts 8:12–17",
                "text": "They were baptized, both men and women... the Holy Ghost was not yet fallen upon any of them."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "He said unto them, Have ye received the Holy Ghost since ye believed? And they said... We have not so much as heard whether there be any Holy Ghost."
              },
              {
                "reference": "Galatians 1:6–9",
                "text": "I marvel that ye are so soon removed from him that called you into the grace of Christ unto another gospel... let him be accursed."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men, after the rudiments of the world, and not after Christ."
              },
              {
                "reference": "2 Timothy 4:3–4",
                "text": "The time will come when they will not endure sound doctrine; but after their own lusts shall they heap to themselves teachers, having itching ears... shall be turned unto fables."
              },
              {
                "reference": "Titus 1:9",
                "text": "Holding fast the faithful word as he hath been taught, that he may be able by sound doctrine both to exhort and to convince the gainsayers."
              },
              {
                "reference": "Jude 3–4",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints. For there are certain men crept in unawares... turning the grace of our God into lasciviousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that a biblical word can be misused if isolated from the full message; can name faith, grace, and experience as three categories subject to selective use."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how each of the three selective readings works — grace without response, faith without content, experience without doctrine — and why each distorts the new birth."
              },
              {
                "level": "Application",
                "expectation": "Shows how to respond to selective readings by restoring the full scriptural witness — using Acts 2:38 alongside John 3:16, Titus 3:5 alongside Ephesians 2:8–9."
              },
              {
                "level": "Defense",
                "expectation": "Responds to specific selective-reading distortions with the full apostolic witness — demonstrating why the full-doctrine reading is more faithful to Scripture than the partial one."
              }
            ]
          },
          {
            "code": "NB.15.3.18",
            "title": "Synthesis: Doctrinal Discernment and Apostolic Fullness as the Safeguard of the New Birth",
            "statement": "The learner demonstrates that doctrinal discernment and commitment to apostolic fullness together form the safeguard of the new birth — and can apply this synthesis in real engagement with partial salvation claims.",
            "scope": "The learner must be able to do two things simultaneously: identify what is missing in a reduced doctrine and restore the full apostolic teaching without alienating the person. Doctrinal discernment is not cynicism or combativeness. It is the mature capacity to measure any salvation claim against the full apostolic standard, recognize where it falls short, and present the complete doctrine with clarity and grace.",
            "instructionalFocus": "End this domain by helping learners understand that they are not defending a tradition — they are carrying a complete gospel. The person with a reduced salvation message has not heard too much; they have heard too little. The learner's task is not to correct but to complete — to offer the full apostolic doctrine with the same warmth and urgency with which Peter offered it at Pentecost.",
            "vocabulary": [
              "Partial Salvation Claim",
              "Doctrinal Distortion",
              "Reductionism",
              "Selective Reading",
              "False Assurance",
              "Doctrinal Omission",
              "Salvation Minimalism",
              "Apostolic Standard",
              "Scriptural Fullness"
            ],
            "anchorScriptures": [
              {
                "reference": "Deuteronomy 4:2",
                "text": "Ye shall not add unto the word which I command you, neither shall ye diminish ought from it."
              },
              {
                "reference": "Isaiah 29:13",
                "text": "This people draw near me with their mouth, and with their lips do honour me, but have removed their heart far from me, and their fear toward me is taught by the precept of men."
              },
              {
                "reference": "Matthew 7:21–23",
                "text": "Not every one that saith unto me, Lord, Lord, shall enter into the kingdom of heaven... I never knew you: depart from me, ye that work iniquity."
              },
              {
                "reference": "Acts 8:12–17",
                "text": "They were baptized, both men and women... the Holy Ghost was not yet fallen upon any of them."
              },
              {
                "reference": "Acts 19:1–6",
                "text": "He said unto them, Have ye received the Holy Ghost since ye believed? And they said... We have not so much as heard whether there be any Holy Ghost."
              },
              {
                "reference": "Galatians 1:6–9",
                "text": "I marvel that ye are so soon removed from him that called you into the grace of Christ unto another gospel... let him be accursed."
              },
              {
                "reference": "Colossians 2:8",
                "text": "Beware lest any man spoil you through philosophy and vain deceit, after the tradition of men, after the rudiments of the world, and not after Christ."
              },
              {
                "reference": "2 Timothy 4:3–4",
                "text": "The time will come when they will not endure sound doctrine; but after their own lusts shall they heap to themselves teachers, having itching ears... shall be turned unto fables."
              },
              {
                "reference": "Titus 1:9",
                "text": "Holding fast the faithful word as he hath been taught, that he may be able by sound doctrine both to exhort and to convince the gainsayers."
              },
              {
                "reference": "Jude 3–4",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints. For there are certain men crept in unawares... turning the grace of our God into lasciviousness."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that doctrinal discernment and apostolic fullness work together to protect the doctrine of the new birth."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how the two work together: discernment identifies the reduction; apostolic fullness provides the complete alternative; both together form the safeguard."
              },
              {
                "level": "Application",
                "expectation": "Shows how to apply the synthesis in a real encounter — taking a specific partial salvation claim, identifying the reduction, and presenting the full apostolic teaching with clarity and grace."
              },
              {
                "level": "Defense",
                "expectation": "Presents doctrinal discernment and apostolic fullness as one integrated doctrine of new-birth protection — and demonstrates how to defend the full doctrine without reducing it to defensive argument."
              }
            ]
          }
        ]
      },
      {
        "domainCode": "NB.16",
        "domainTitle": "Doctrinal Discernment, Defense, and World-Facing Stability in the New Birth",
        "anchorScripture": {
          "reference": "Proverbs 4:7",
          "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
        },
        "standards": [
          {
            "code": "NB.16.1.18",
            "title": "Demonstrate Discernment by Identifying Teachings That Distort the Doctrine of the New Birth",
            "statement": "The learner demonstrates mature doctrinal discernment by identifying teachings that distort the doctrine of the new birth — naming the specific distortion, explaining what is wrong, and pointing to the full apostolic standard.",
            "scope": "Mature discernment does not operate by hostility or suspicion. It operates by knowing the full doctrine well enough to recognize when something is missing or misrepresented. The learner who has been formed by Domains 1–15 should be able to evaluate any salvation teaching by asking: Does this teaching account for sin and the human condition? Is the gospel proclaimed as redemptive accomplishment requiring response? Is repentance, baptism in Jesus' name, and Spirit reception present and integrated? Is the apostolic pattern honored?",
            "instructionalFocus": "Help learners understand that discernment is a gift of love, not a spirit of criticism. The person who can identify a reduced gospel is in a position to offer the full one. Teach learners to evaluate doctrine by asking: Is the full apostolic pattern present? Is any element missing, minimized, or redefined?",
            "vocabulary": [
              "Discernment",
              "Defense",
              "World-Facing Stability",
              "Readiness",
              "Meekness",
              "Testimony",
              "Earnest Contention",
              "Doctrinal Endurance",
              "Unashamed Witness",
              "Stable Foundation"
            ],
            "anchorScriptures": [
              {
                "reference": "Proverbs 4:7",
                "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
              },
              {
                "reference": "Matthew 10:19–20",
                "text": "Take no thought how or what ye shall speak: for it shall be given you in that same hour what ye shall speak. For it is not ye that speak, but the Spirit of your Father which speaketh in you."
              },
              {
                "reference": "Acts 4:18–20",
                "text": "Whether it be right in the sight of God to hearken unto you more than unto God, judge ye. For we cannot but speak the things which we have seen and heard."
              },
              {
                "reference": "Romans 1:16",
                "text": "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek."
              },
              {
                "reference": "1 Corinthians 15:58",
                "text": "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord."
              },
              {
                "reference": "2 Timothy 1:12",
                "text": "For I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day."
              },
              {
                "reference": "2 Timothy 2:24–25",
                "text": "And the servant of the Lord must not strive; but be gentle unto all men, apt to teach, patient, In meekness instructing those that oppose themselves..."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "Jude 3",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Revelation 12:11",
                "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that not all salvation teaching reflects the full apostolic doctrine; can name at least two categories of distortion and give an example of each."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the specific error in a given distorted teaching — naming what is missing, what is misrepresented, and why the distortion matters."
              },
              {
                "level": "Application",
                "expectation": "Takes a specific teaching and walks through a doctrinal evaluation — measuring it against the full apostolic standard established in Domains 1–15 and naming the specific points of divergence."
              },
              {
                "level": "Defense",
                "expectation": "Demonstrates mature doctrinal discernment in a sustained evaluation — identifying the distortion, explaining its doctrinal consequences, and presenting the full apostolic alternative with clarity and grace."
              }
            ]
          },
          {
            "code": "NB.16.2.18",
            "title": "Defend the Doctrine of the New Birth with Scriptural Clarity and Composure",
            "statement": "The learner demonstrates the ability to defend the doctrine of the new birth with scriptural clarity and composure — remaining clear, gentle, and grounded under challenge.",
            "scope": "Defense is not argument for its own sake — it is faithfulness to the once-delivered faith in the face of challenge. The learner must be able to respond to the most common objections to apostolic new-birth doctrine: that repentance and baptism are works, that Spirit reception is not essential, that the name of Jesus in baptism is unnecessary, that the apostolic pattern is culturally conditioned. Each of these objections must be met with scriptural clarity, not emotional reaction.",
            "instructionalFocus": "Teach learners to practice giving answers. The person who has never said out loud why they believe what they believe is not ready to give an answer. Role-play common objections and train learners to respond with scripturally grounded, composure-maintaining answers.",
            "vocabulary": [
              "Discernment",
              "Defense",
              "World-Facing Stability",
              "Readiness",
              "Meekness",
              "Testimony",
              "Earnest Contention",
              "Doctrinal Endurance",
              "Unashamed Witness",
              "Stable Foundation"
            ],
            "anchorScriptures": [
              {
                "reference": "Proverbs 4:7",
                "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
              },
              {
                "reference": "Matthew 10:19–20",
                "text": "Take no thought how or what ye shall speak: for it shall be given you in that same hour what ye shall speak. For it is not ye that speak, but the Spirit of your Father which speaketh in you."
              },
              {
                "reference": "Acts 4:18–20",
                "text": "Whether it be right in the sight of God to hearken unto you more than unto God, judge ye. For we cannot but speak the things which we have seen and heard."
              },
              {
                "reference": "Romans 1:16",
                "text": "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek."
              },
              {
                "reference": "1 Corinthians 15:58",
                "text": "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord."
              },
              {
                "reference": "2 Timothy 1:12",
                "text": "For I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day."
              },
              {
                "reference": "2 Timothy 2:24–25",
                "text": "And the servant of the Lord must not strive; but be gentle unto all men, apt to teach, patient, In meekness instructing those that oppose themselves..."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "Jude 3",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Revelation 12:11",
                "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that the apostolic new birth will face challenge and names at least two common objections."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the scriptural response to at least two common objections to apostolic new-birth doctrine — using specific texts to address the specific challenge."
              },
              {
                "level": "Application",
                "expectation": "Engages a specific objection to apostolic new-birth doctrine with a scripturally grounded, composure-maintaining response — addressing the actual argument rather than a caricature."
              },
              {
                "level": "Defense",
                "expectation": "Demonstrates mature defensive engagement across multiple objections — addressing each from Scripture, maintaining meekness and clarity, and concluding with a presentation of the full apostolic doctrine."
              }
            ]
          },
          {
            "code": "NB.16.3.18",
            "title": "Remain Stable Under Religious, Cultural, and Intellectual Pressure Concerning Salvation Doctrine",
            "statement": "The learner demonstrates the capacity to remain doctrinally stable under religious, cultural, and intellectual pressure concerning the doctrine of the new birth — without capitulation, defensiveness, or hostility.",
            "scope": "The .18 learner will face pressure from multiple directions: family members who believe differently, friends who consider the apostolic doctrine too exclusive, cultural voices that treat all religions as equivalent, and academic or intellectual challenges to the historicity or uniqueness of apostolic salvation. The learner must be able to remain stable under each of these pressures without pretending the pressure does not exist.",
            "instructionalFocus": "Help learners understand that stability is not stubbornness. It is the quiet confidence of a person who knows what they have received, who they have received it from, and why it is true. Stability is not achieved by having perfect answers to every question — it is achieved by being deeply formed in the doctrine.",
            "vocabulary": [
              "Discernment",
              "Defense",
              "World-Facing Stability",
              "Readiness",
              "Meekness",
              "Testimony",
              "Earnest Contention",
              "Doctrinal Endurance",
              "Unashamed Witness",
              "Stable Foundation"
            ],
            "anchorScriptures": [
              {
                "reference": "Proverbs 4:7",
                "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
              },
              {
                "reference": "Matthew 10:19–20",
                "text": "Take no thought how or what ye shall speak: for it shall be given you in that same hour what ye shall speak. For it is not ye that speak, but the Spirit of your Father which speaketh in you."
              },
              {
                "reference": "Acts 4:18–20",
                "text": "Whether it be right in the sight of God to hearken unto you more than unto God, judge ye. For we cannot but speak the things which we have seen and heard."
              },
              {
                "reference": "Romans 1:16",
                "text": "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek."
              },
              {
                "reference": "1 Corinthians 15:58",
                "text": "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord."
              },
              {
                "reference": "2 Timothy 1:12",
                "text": "For I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day."
              },
              {
                "reference": "2 Timothy 2:24–25",
                "text": "And the servant of the Lord must not strive; but be gentle unto all men, apt to teach, patient, In meekness instructing those that oppose themselves..."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "Jude 3",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Revelation 12:11",
                "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that doctrinal stability is required in real-world settings and names at least two sources of pressure the .18 learner will face."
              },
              {
                "level": "Explanation",
                "expectation": "Explains what each source of pressure looks like and what it demands of the learner — and why each form of pressure is best met with doctrinal clarity rather than social capitulation or defensive hostility."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates doctrinal stability in a specific pressure scenario — engaging the pressure source honestly, acknowledging the relational or social cost, and remaining clear without becoming combative."
              },
              {
                "level": "Defense",
                "expectation": "Presents doctrinal stability as a formed character quality rather than merely a set of arguments — and demonstrates how stability under pressure flows from the integrated formation of Domains 1–15."
              }
            ]
          },
          {
            "code": "NB.16.4.18",
            "title": "Bear Faithful Witness to the Apostolic Doctrine of the New Birth in the World",
            "statement": "The learner demonstrates readiness to bear faithful witness to the apostolic doctrine of the new birth in real-world settings — with meekness, clarity, and confidence in the gospel.",
            "scope": "Witness is the natural expression of a life that has been formed by the new birth and the doctrine that explains it. The learner must understand that witness is not argument — it is testimony. The most effective witness to the new birth is the person who knows what they have received, can explain it clearly, and invites others into the same experience. Witness requires both doctrinal clarity (what the new birth is and why it is necessary) and personal authenticity (the witness speaks from encounter, not only from knowledge).",
            "instructionalFocus": "Help learners understand that they are witnesses, not debaters. The goal of witness is not to win an argument but to present a person — Jesus Christ — and the salvation He has made possible. A learner who is doctrinally formed and personally authentic will be a more effective witness than one who is argumentatively skilled but personally distant.",
            "vocabulary": [
              "Discernment",
              "Defense",
              "World-Facing Stability",
              "Readiness",
              "Meekness",
              "Testimony",
              "Earnest Contention",
              "Doctrinal Endurance",
              "Unashamed Witness",
              "Stable Foundation"
            ],
            "anchorScriptures": [
              {
                "reference": "Proverbs 4:7",
                "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
              },
              {
                "reference": "Matthew 10:19–20",
                "text": "Take no thought how or what ye shall speak: for it shall be given you in that same hour what ye shall speak. For it is not ye that speak, but the Spirit of your Father which speaketh in you."
              },
              {
                "reference": "Acts 4:18–20",
                "text": "Whether it be right in the sight of God to hearken unto you more than unto God, judge ye. For we cannot but speak the things which we have seen and heard."
              },
              {
                "reference": "Romans 1:16",
                "text": "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek."
              },
              {
                "reference": "1 Corinthians 15:58",
                "text": "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord."
              },
              {
                "reference": "2 Timothy 1:12",
                "text": "For I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day."
              },
              {
                "reference": "2 Timothy 2:24–25",
                "text": "And the servant of the Lord must not strive; but be gentle unto all men, apt to teach, patient, In meekness instructing those that oppose themselves..."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "Jude 3",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Revelation 12:11",
                "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that bearing witness to the new birth is the expected outcome of this doctrinal formation and can name the basic content of apostolic witness."
              },
              {
                "level": "Explanation",
                "expectation": "Explains the relationship between doctrinal knowledge and faithful witness — and why witness requires both understanding the doctrine and speaking from personal encounter."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates faithful witness in a specific setting — presenting the apostolic doctrine of the new birth clearly, inviting response, and doing so with meekness and warmth."
              },
              {
                "level": "Defense",
                "expectation": "Presents faithful witness as the integrated outcome of all doctrinal formation — and demonstrates witness that is simultaneously doctrinally complete, pastorally warm, and personally authentic."
              }
            ]
          },
          {
            "code": "NB.16.5.18",
            "title": "Synthesis: Discernment, Defense, Witness, and Endurance as the Mature World-Facing Outcome of the Doctrine of the New Birth",
            "statement": "The learner demonstrates that discernment, defense, witness, and endurance form one mature world-facing outcome — and can present this synthesis as the capstone of the .18 formation in the doctrine of the new birth.",
            "scope": "This standard is the capstone of the entire subject. The learner who has been formed by Domains 1–16 should be able to demonstrate: (1) the ability to identify and evaluate doctrinal claims (discernment), (2) the ability to respond to challenge with scriptural clarity and composure (defense), (3) the ability to present the apostolic new birth to others with warmth and clarity (witness), and (4) the capacity to sustain all three over time under sustained pressure (endurance). These four together are the world-facing outcome of mature doctrinal formation.",
            "instructionalFocus": "This is the capstone standard of the entire document. Everything in Domains 1–15 has been building toward this: a young person who knows what salvation is, why it is necessary, how it is received, what it produces, and how to carry it into the world with clarity, meekness, and endurance. That is the .18 benchmark.",
            "vocabulary": [
              "Discernment",
              "Defense",
              "World-Facing Stability",
              "Readiness",
              "Meekness",
              "Testimony",
              "Earnest Contention",
              "Doctrinal Endurance",
              "Unashamed Witness",
              "Stable Foundation"
            ],
            "anchorScriptures": [
              {
                "reference": "Proverbs 4:7",
                "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
              },
              {
                "reference": "Matthew 10:19–20",
                "text": "Take no thought how or what ye shall speak: for it shall be given you in that same hour what ye shall speak. For it is not ye that speak, but the Spirit of your Father which speaketh in you."
              },
              {
                "reference": "Acts 4:18–20",
                "text": "Whether it be right in the sight of God to hearken unto you more than unto God, judge ye. For we cannot but speak the things which we have seen and heard."
              },
              {
                "reference": "Romans 1:16",
                "text": "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek."
              },
              {
                "reference": "1 Corinthians 15:58",
                "text": "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord."
              },
              {
                "reference": "2 Timothy 1:12",
                "text": "For I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day."
              },
              {
                "reference": "2 Timothy 2:24–25",
                "text": "And the servant of the Lord must not strive; but be gentle unto all men, apt to teach, patient, In meekness instructing those that oppose themselves..."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "Jude 3",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Revelation 12:11",
                "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "States that discernment, defense, witness, and endurance belong together as the mature world-facing outcome of new-birth formation."
              },
              {
                "level": "Explanation",
                "expectation": "Explains how each of the four dimensions relates to the others — and why a person who has only some of them is not fully formed for world-facing stability."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates all four dimensions in an integrated presentation — showing discernment, defense, witness, and the character of endurance in a sustained response to a real-world challenge."
              },
              {
                "level": "Defense",
                "expectation": "Presents discernment, defense, witness, and endurance as one integrated doctrine of mature world-facing formation — and reflects on how the full formation of Domains 1–15 has prepared this outcome."
              }
            ]
          },
          {
            "code": "NB.16.6.18",
            "title": "World-Facing Stability Under Alternate Religions, False Christs, and Occult Pressure",
            "statement": "The learner demonstrates the ability to remain stable in the doctrine of the new birth when confronted by alternate religions, false christs, occult influence, counterfeit spiritualities, and reduced Christian salvation claims.",
            "scope": "Mature readiness at the .18 benchmark includes more than answering familiar church questions. The learner must be able to face pressure from false spiritual systems, counterfeit christ-claims, occult attraction, religious pluralism, and salvation messages that sound biblical while omitting apostolic fullness. Stability here means more than refusal. It means the learner can identify the competing claim, explain why it fails, and remain anchored in the apostolic doctrine of repentance, baptism in Jesus' name, Spirit reception, and transformed covenant life.",
            "instructionalFocus": "Teach learners to recognize that adulthood brings direct pressure from rival spiritual claims. Train them not merely to refuse error, but to answer it with full apostolic clarity, spiritual sobriety, and calm doctrinal confidence.",
            "vocabulary": [
              "Discernment",
              "Defense",
              "World-Facing Stability",
              "Readiness",
              "Meekness",
              "Testimony",
              "Earnest Contention",
              "Doctrinal Endurance",
              "Unashamed Witness",
              "Stable Foundation"
            ],
            "anchorScriptures": [
              {
                "reference": "Proverbs 4:7",
                "text": "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding."
              },
              {
                "reference": "Matthew 10:19–20",
                "text": "Take no thought how or what ye shall speak: for it shall be given you in that same hour what ye shall speak. For it is not ye that speak, but the Spirit of your Father which speaketh in you."
              },
              {
                "reference": "Acts 4:18–20",
                "text": "Whether it be right in the sight of God to hearken unto you more than unto God, judge ye. For we cannot but speak the things which we have seen and heard."
              },
              {
                "reference": "Romans 1:16",
                "text": "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek."
              },
              {
                "reference": "1 Corinthians 15:58",
                "text": "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord."
              },
              {
                "reference": "2 Timothy 1:12",
                "text": "For I know whom I have believed, and am persuaded that he is able to keep that which I have committed unto him against that day."
              },
              {
                "reference": "2 Timothy 2:24–25",
                "text": "And the servant of the Lord must not strive; but be gentle unto all men, apt to teach, patient, In meekness instructing those that oppose themselves..."
              },
              {
                "reference": "1 Peter 3:15",
                "text": "But sanctify the Lord God in your hearts: and be ready always to give an answer to every man that asketh you a reason of the hope that is in you with meekness and fear."
              },
              {
                "reference": "Jude 3",
                "text": "Ye should earnestly contend for the faith which was once delivered unto the saints."
              },
              {
                "reference": "Revelation 12:11",
                "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
              }
            ],
            "evidenceOfLearning": [
              {
                "level": "Recognition",
                "expectation": "Recognizes that alternate religions, false spiritualities, and occult influences can challenge the doctrine of the new birth."
              },
              {
                "level": "Explanation",
                "expectation": "Explains why counterfeit spiritual claims and reduced salvation messages must be tested by the full apostolic standard."
              },
              {
                "level": "Application",
                "expectation": "Demonstrates doctrinal steadiness in a realistic pressure setting involving another religion, a false christ-claim, occult practice, or a reduced Christian salvation message."
              },
              {
                "level": "Defense",
                "expectation": "Responds with clarity and composure to alternate religions, false christs, occult pressures, and reduced Christian claims, while presenting the apostolic doctrine of the new birth as the full scriptural answer."
              }
            ]
          }
        ]
      }
    ],
    "requiresSubjectMastered": "OG"
  }
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

export const DEFAULT_STANDARD_CODE = "OG.1.1.18";
