# OG.1 Instructional Clarity Audit — Intention → Evidence → Explanation → Understanding

**Status:** Curriculum and learner-experience REVIEW; no application changes authorized by this document.  
**Current app reviewed:** `codex/og1-stage2-interactive-experience` at `8fd60b2e6f9200f475567599dbca3cc3a6dcff80`.  
**Authority:** `app/src/data/curriculum/og.json`, `OG.1.1.18`–`OG.1.5.18`.  
**Reference plans:** Draft `curriculum/lesson-blueprint-framework`, including `OG.1.MASTER-LESSON.md` and `OG.1.ALIGNMENT-REVIEW.md`.  
**Basis:** Direct inspection of the authored lesson, rendered-scene source, teacher feedback/route logic, rubric/evidence rating, ten-question exam, chapter guide and final synthesis; Codex Stage 2 browser review supplied separate screenshot coverage. **This specific review did not execute a fresh live-AI or physical-device learner session.**

## The non-negotiable educational principle

**A question can open a chapter, but an explicit, Scripture-grounded answer must close it.**

Jeremiah must never depend on the learner inferring the doctrinal conclusion from imagery, Bible references, a multiple-choice answer, an optional reference link, or a poetic summary. Each chapter should plainly tell the learner:

1. **Intention:** Here is the exact truth and reasoning you will learn.
2. **Primary evidence:** Here is the biblical text in its context, with its correct reference.
3. **Interpretation:** Here is what the text states; here is how the Apostolic interpretation reasons from it; here is why that reasoning is preferred and how a relevant alternative reads it.
4. **Demonstration:** Here is what you should now be able to explain in your own words.
5. **Resolution:** Here is what you demonstrated, what is still uncertain, and how Jeremiah will help you close the gap before claiming understanding.
6. **Bridge:** Here is why this matters to the next chapter and to the overall confession.

The experience should not be cryptic, deliberately vague, robotic, coercive, or only a collection of proof texts. **Confident Apostolic instruction and accurate representation of competing readings are compatible.** Label explicit biblical quotations, contextual explanation, and the curriculum's doctrinal conclusions honestly.

## Summary judgment

The lesson has an excellent backbone: Shema, Isaiah, Jesus/apostles, a fair doctrinal comparison, and wholehearted devotion. Stage 2 improves evidence continuity, navigation, response composition and clarity of supported/unscored work. It **does not yet guarantee a complete teaching-to-understanding loop**. Key Scripture is referenced without reliably being taught on the main screen; some decisive teaching is stored in `move.teaching` but the Stage 2 OG.1 player does not directly render that field; several independent prompts demand more than the preceding scene explicitly establishes; deficient responses can be bypassed rather than remedied.

**Stage 3 should be gated by instructional clarity, not evaluated solely on cinematic effects.** The following findings are observations/proposals, not authority to change standards or grading.

## Critical cross-chapter findings

| ID | Priority | Code observation and learner consequence | Needed correction |
|---|---|---|---|
| **C01** | P0 | `app/src/core/classroom/teacherLedEngine.js` advances OG.1 assessments via `move.next.strong` for every verdict; the Stage 2 player offers `Continue` after weak, partial, supported and unscored feedback. A learner may advance without resolving a conceptual gap. | Preserve voluntary progression, but explicitly display **not-yet-demonstrated** status and a targeted **Teach me / Revisit / Try again** option before a clear **Continue without mastery** choice. Provide a concept-specific repair and independent recheck; no invented proficiency. |
| **C02** | P0 | `app/src/core/classroom/og1LessonRating.js` defaults a standard to **Level 1** even if `score=null` and no evidence was measured. "Minimal Understanding" can read as demonstrated proficiency although no assessment occurred. | Separate **not assessed / insufficient evidence** from demonstrated Level 1. Do not show a numeric mastery level if nothing supports even recognition. Preserve coverage vs. grade distinction. |
| **C03** | P0–P1 | One holistic `strong` from an OG.1 `*-try` move can carry the entire supplied list of its evidence IDs, including Level 4. A prompt's complexity or model verdict is not criterion-specific proof; the teacher model is *instructed* to check every criterion, but code does not store a full criterion-by-criterion explanation for audit. | Make evidence levels individually traceable and defensible. Mark **only demonstrated criteria**, record their Scripture/response basis and gap, and enforce an explicit Level 4 challenge. Do not equate `strong` with all four levels automatically. |
| **C04** | P1 | `OG_1_LESSON.js` contains important `move.teaching` paragraphs, yet `OG1LessonPlayer.jsx` has no direct `move.teaching` render path for its authored scenes. Selected teaching is separately re-authored in JSX, and not every claim in the teaching arrays is consequently guaranteed to reach the learner. | Build a **teaching coverage trace**: for each required concept/scripture/interpretation, identify the exact learner-visible scene, not merely a source array. Add missing short explanations within the approved authored lessons, with written text independent of audio. |
| **C05** | P1 | The 10-question domain exam has two items per standard, overwhelmingly recall/recognition/connection (item alignments are Levels 1–2). It cannot establish the higher-level understanding the course promises. | Preserve the exam, but independently collect a bounded, criterion-specific explanation/defense for the standards. No 20-question mandatory second exam. |
| **C06** | P1 | `OG1FinalSynthesis` brings the witnesses and Deut. 6:5 together effectively but mostly repeats quotations and devotion. It does not fully restate the Apostolic doctrinal resolution of Christ's identity or revisit the strongest challenge. | Close with an explicit **five-part answer**, not just a beautiful recap: *who the LORD is; what Isaiah establishes; how Jesus/apostles continue the confession; how Apostolic interpretation understands Jesus as fully divine/truly human; why wholehearted love follows*. Offer an ungraded concise synthesis review and honest criterion summary before exit. |

### Critical distinction

A **student may finish** and still have unresolved learning. That is acceptable **only if Jeremiah names the distinction and offers corrective teaching**. Never force the appearance of mastery, and never deny access to the rest of the lesson merely because AI is offline. The error is not letting someone move forward; it is presenting forward motion as the end of the teaching responsibility.

## Chapter-by-chapter evidence and completeness matrix

### Chapter 1 — OG.1.1.18: The Shema

**Authority:** Recite, translate and expound Deut. 6:4; explain covenant context, `shema`, `echad`, and the New Testament's use of the confession; defend its contextual Oneness interpretation.

**Already present:** KJV opening, Moses scene, phrase study, Deut. 6:4→5, an accurate warning that `echad` alone does not prove a theological system, Genesis 2:24 reasoning, and separate deterministic KJV recall. Mark 12:29 and Isaiah 44:6 appear in the interpretation.

**Clarity gap:** The independent explanation asks how Isaiah 44:6 and Mark 12:29 support the argument, but the student needs one decisive **directly taught synthesis** of what each contributes. The standard's Level 3 specifically includes **1 Cor. 8:4–6 and Eph. 4:5–6**; the present `shema-try` asks only for Isaiah/Mark and does not specifically demonstrate that full Level 3 requirement. Verse 5's devotion connection should be a clear outcome, not merely another interesting reveal.

**Required clear close (proposed language; owner review needed):**
> The Shema confesses that the LORD is Israel's one God. *Shema* summons Israel to hear and respond; *echad* means one. The word's meaning must be read in this passage and in the whole witness of Scripture, not settled by a lexical trick. Isaiah emphasizes that no other God exists before, beside or after the LORD. Jesus reaffirms this confession in Mark 12:29; the apostles continue it. This is why Apostolic teaching takes the one LORD as the foundation for understanding God, Jesus Christ and faithful worship.

**Proof:** Full verse recall independent of prompts; explanation of `echad`/context; a separate contextual defense; traced NT continuity at the right standard/level without granting Level 3 just for citing Mark.

### Chapter 2 — OG.1.2.18: Isaiah's witness

**Authority:** Identify, quote **at least four** relevant Isaiah declarations, understand Isaiah 43–46 as a sustained argument, and answer the strongest objection in context.

**Already present:** Excellent cumulative BEFORE/BESIDE/AFTER board with Isaiah 43:10 and 44:6, an optional Isaiah 45:22 context link, and a relevant guided matching activity.

**Clarity gap:** Required Isaiah **44:8, 45:5–6, 45:21–22 and 46:9** exist in the data array but are not all explained as distinct learner-visible passages in the main evidence board. The written prompt asks learners to *identify* four declarations, whereas the standard requires **quotation from memory** at Level 2. The question about whether exclusivity excludes internal persons is asked without guaranteeing an adequate worked example of how Apostolic reasoning reaches the conclusion; the Trinitarian alternate view must be represented accurately.

**Clear close (proposal):**
> Isaiah does not merely say the LORD ranks first. In distinct declarations he says no god was before him, none exists beside him, none comes after him, and there is none else. Read these in the setting of the LORD's challenge to idols and his call for all the earth to look to him. Apostolic teaching reasons from their cumulative exclusivity to the absolute oneness of God, while recognizing that other readers distinguish God's uniqueness from the question of personal distinctions.

**Proof:** Four actual passages recalled and attributed, an independent explanation of each one's contribution, and a contextual reply to a fair counter-reading. **Don't award memory evidence for merely selecting/identifying four references.**

### Chapter 3 — OG.1.3.18: Jesus and the apostles

**Authority:** Show OT→NT continuity using 1 Cor. 8:4–6, Eph. 4:5–6, 1 Tim. 2:5 and Jas. 2:19, particularly interpreting Paul's "one God, the Father" and "one Lord Jesus Christ" accurately.

**Already present:** Strong retained Moses→Jesus→Paul visual trail; Jesus' Mark 12:29 quotation; contextual pointer to 1 Cor. 8; links to Timothy and James.

**Clarity gap:** The main trail largely quotes **1 Cor. 8:4**, while the harder, essential phrasing in **8:6** receives only a short interpretive statement. Ephesians 4:5–6 is in the lesson data and demanded in the written prompt but not developed as a learner-visible main-scene explanation. First Timothy and James are primarily optional links. An argument cannot be declared understood if the student is asked to explain texts the lesson has not actually worked through.

**Clear close (proposal):**
> Jesus quotes the Shema. Paul continues to say that there is one God while also speaking of one Lord Jesus Christ. The Apostolic reading understands Paul's words in the context of his contrast with idols and the revelation of God in Jesus Christ—not as a second god. Ephesians, Timothy and James extend the same monotheistic confession into the church's life, Christ's genuine human mediation, and a living response to belief. Understanding requires reading those passages, not merely matching the names of their authors.

**Proof:** A short contextual explanation of each required NT passage and the exact disputed phrase in 1 Cor. 8:6; an OT→NT argument the student can restate without hints.

### Chapter 4 — OG.1.4.18: Understanding the difference

**Authority:** Accurately define classical Trinity and Apostolic Oneness, explain precise disagreement and key texts, and answer the Jesus-prayer objection with genuine incarnation.

**Already present:** Fair two-position cards, three Scripture investigation questions, distinctions in words/identity/baptism/prayer, and a non-caricatured doctrinal summary.

**Clarity gap:** The scene establishes **what** each reading says, but does not give a sufficiently explicit **Scripture-by-Scripture worked explanation of why Jeremiah reaches the Apostolic conclusion**. "Essence," "person," and especially "proceeding" appear in stored `move.teaching` and the final written prompt, but are not all guaranteed to be taught on screen. The student can reach the comparison with questions lingering rather than seeing the actual answer constructed.

**Clear close (proposal; identify inference as Apostolic interpretation):**
> Both traditions confess one God. Classical Trinitarian teaching distinguishes three coequal, coeternal persons in one divine essence. Apostolic teaching holds that the one God has revealed himself as Father, in the genuinely human incarnation of Jesus Christ, and as Holy Spirit—without three eternal divine persons. Jeremiah teaches this Apostolic reading by interpreting the Word made flesh, the baptismal accounts, Jesus' actual human prayer and the one-God confession together. These passages need to be explained in their contexts, not just displayed or used as a list of proof texts.

**Proof:** Fair description of both positions, clear explanation of two disputed passages, and a thoughtful independent response to "If Jesus is God, to whom is he praying?" that does not deny his humanity.

### Chapter 5 — OG.1.5.18: Knowing Him. Loving Him.

**Authority:** Connect Deut. 6:4→5 with exclusive worship, the first two commandments, moral allegiance, apostolic mission and lived community faithfulness.

**Already present:** Strong confession→command visual and three consequences; no grading of spiritual sincerity; clear linkage to worship and mission.

**Clarity gap:** The teaching and independent prompt remain largely **abstract**. The content explicitly says not to introduce an "unrelated moral dilemma," which is right; but an **on-standard, concrete example** would help the learner understand what the confession changes in ordinary behavior. The final prompt does not explicitly ask for the Level 4 response to the claim that Oneness is only an intellectual position.

**Clear close (proposal):**
> If the LORD alone is God, exclusive worship and undivided allegiance make sense: we cannot treat rival gods as equal objects of devotion. Deuteronomy 6:5 commands love with all the heart, soul and might. In the Apostolic witness, the same one Lord shapes proclamation, moral commitments and care for the community. Correct doctrinal knowledge matters, but knowing the words alone is not the whole response.

**Proof:** Explain the logic from identity to command; evaluate one concrete, noncoercive situation about worship/loyalty/community care; answer fairly why the confession is more than an intellectual argument. **Do not grade spiritual sincerity or demand private disclosures.**

## The pedagogical sequence to establish in every chapter

**1 — Declare the goal (not a riddle):**
"You are learning how [this specific Scripture claim] establishes [this specific understanding]. At the end you will explain [observable demonstration]."

**2 — Read the evidence:** A complete relevant KJV excerpt and surrounding context, with clear author/speaker/reference. Do not rely on a hidden `move.teaching` paragraph or a button the learner need not open.

**3 — Explain the evidence:** A direct sentence on **what the text says**, followed by a distinct direct sentence on **how Jeremiah interprets it**. When there is a genuine dispute, represent the competing interpretation fairly and explain why Jeremiah teaches his conclusion.

**4 — Work through the reasoning:** Show a concrete example that carries the biblical text to the doctrinal or practical claim. Let the learner investigate; don't let an unexplained discovery stand in for instruction.

**5 — Guided check:** If wrong, name the misconception and demonstrate how the verse answers it. Do not simply "take another look."

**6 — Independent understanding:** One focused explanation or transfer prompt with explicit criteria. A separate higher-level challenge when Level 4 is required. Only award the criteria actually demonstrated.

**7 — Repair or close:** For weak/partial/unscored work, give a brief targeted teaching path and a genuine option to retry; learners can deliberately continue with transparent "not yet demonstrated" status. For demonstrated work, state the **chapter's answer plainly**, connect the evidence and bridge forward.

The chapter should close with three learner-visible lines: **What we established / Which Scripture shows it / What you should now be able to explain.** These are not three new slide screens and should not force more clicking.

## The entire lesson must answer the entire question

The final synthesis should be a five-part explanation the learner can understand on its own. In plain language it should:

1. Identify the LORD of the Shema, explaining why `shema` and `echad` matter in context.
2. Summarize Isaiah's cumulative declarations and their force.
3. Explain precisely how Jesus and Paul preserve and use the confession—including Paul's challenging words in 1 Cor. 8:6.
4. **State and justify the Apostolic conclusion about Jesus Christ, Father, Son and Holy Spirit**, while retaining real humanity and explaining how this differs from classical Trinitarian interpretation. Do not merely restate the words "both believe in one God."
5. Explain why knowing this one God requires exclusive worship, wholehearted love, moral allegiance and faithful witness.

A visually strong quote carousel can be part of this, but it is not a substitute for the full explanation. The existing full-summary Scripture quotations and the exit survey should be preserved, not removed.

## Acceptance criteria for an owner-approved clarity pass

- **No unanswered instructional questions:** create a list of each authored hook/chapter question and cite the exact subsequent learner-visible answer and Scripture that closes it.
- **No required-but-untaught passages:** for each standard, enumerate the required KJV texts and show where each is read/explained on screen. Optional "Read in context" enhances but must not replace indispensable teaching.
- **Explicit visible intent:** before each chapter's main investigation, a concise goal and learner "I can explain..." statement; no grandiose mystery framing that remains unresolved.
- **Accurate explanatory bridge:** before asking for a difficult independent response, present a worked *analogous* interpretation (not the answer to the same assessment).
- **Recover from weak or unscored:** simulate a learner giving an incorrect answer, an unsupported response, and an AI outage in every chapter. The UI must state the gap and offer a meaningful way to learn/retry without silently advancing mastery.
- **No fake rubric level:** unassessed stays unassessed; only criterion-specific observed evidence can support Levels 1–4. Memory/recognition cannot establish defense. Cover all required Isaiah memory and Paul/Jesus interpretation criteria.
- **Honest completion:** both a well-prepared learner and one who answered poorly can reach the finale, but both can tell precisely what was learned, assessed, not assessed and still needed.
- **All five chapters conclude explicitly:** five clear closing statements and one coherent domain synthesis, with accessibility/no-audio equivalence.
- **Preserve without a rewrite:** retain every authorized standard, KJV passage, existing questions, images, audited media, narrator, stage design, chapter history, exams and survey, including Stage 1/2 design work. Changes to questions, grading, curriculum/blueprints, or teaching **require owner review before implementation**.

## Priority and Stage 3 gate

**First (critical, independently reviewable):** correctness of learning-status reports, criterion mapping, and weak/unscored learning paths (C01–C03). **Second:** visible instruction coverage and explicit chapter closures, starting with OG.1.1 then finishing OG.1.2–5 (C04–C05). **Third:** a complete, clear five-part finale (C06). Only then authorize further cinematic assets/motion that reinforce those explanations.

**Recommended owner-facing approval request:** "Do you approve changing the instructional explanations, chapter conclusions and targeted corrective paths according to this audit, while preserving the source standards and allowing explicit no-mastery continuation?" The request to **examine** alone is not permission to implement new doctrine or grading contracts.

This document is a review of existing source behavior, not an executed live-learning trial, a doctrinal resolution of disagreements, or a claim to have measured learner understanding.
