# OG.1 — Existing Pilot vs. Draft Blueprint Alignment

**Status:** DRAFT editorial analysis; no application change authorized  
**Source code inspected:** current `codex/jeremiah-continuation` at the time of blueprint review, including `OG_1_LESSON.js`, `OG1LessonPlayer.jsx`, `og1ExitExam.js`, and `og1LessonRating.js`  
**Purpose:** Give Codex a precise *future* gap-analysis starting point. This document is not a claim that end-to-end browser acceptance has been performed.

## What we must preserve

The existing `OG.1.LESSON.18` is **not a throwaway prototype**. Its audited instructional flow includes 19 moves across the five standards (the show/guide/try cadence with deeper challenges), distinct Scripture scenes, optional narration, a chapter status indicator, an independent response in each chapter, a ten-item domain exam, an understanding report, progress persistence, and the pilot feedback survey.

Previous work also repaired offline written-scoring claims, lesson restart archives, and narration script allowlists. Treat those completed fixes as required regressions, not features to replace.

## Alignment matrix

| Standard | Existing moves or features | What is already strong | Draft blueprint gap to examine | Minimal proposed work *after approval* |
|---|---|---|---|---|
| **OG.1.1.18** | `shema-show`, `shema-guide`, `shema-try`; shema scene and `echad` reveal | Text-first confession, covenant bridge, contextual comparison with Genesis 2:24 | One `shema-try` prompt requests recitation, Hebrew explanation, love, Genesis, Isaiah and Mark **all at once**; independent memory recall is not separately recorded | Break into short faithful recitation and one independent contextual reasoning prompt; reuse existing scenes |
| **OG.1.2.18** | `isaiah-show`, `isaiah-guide`, `isaiah-try`; before/beside/after visual | Six Isaiah witnesses, contextual exclusion, evidence mapping | `isaiah-try` requests four declarations and a theological counterargument in one answer; memory quotation and exegesis need independently visible evidence | Guided memory retrieval for four passages, followed by one new cumulative case |
| **OG.1.3.18** | `continuity-show`, `continuity-guide`, `continuity-try`; text trail | Deut → Jesus → Paul connection, important context in 1 Cor 8 | Written transfer asks for Deut, Mark, Paul, James plus four named epistles/references in one response; high cognitive load without separable reasoning checkpoints | Preserve OT/NT trail, stage two context decisions, then one focused independent explanation |
| **OG.1.4.18** | `distinction-show`, `distinction-guide`, `distinction-try` and deeper prayer challenge | Classical Trinity defined fairly; genuine humanity and prayer defended | Large final task asks for technical terms, two interpretation comparisons, prayer challenge, Shema and Isaiah all in a single answer; accuracy and charitable framing risk being hard to diagnose | Retain the claim clinic; separate fair definitions from an original, reasoned incarnation challenge |
| **OG.1.5.18** | `devotion-show`, `devotion-guide`, `devotion-try` | Strong recovery of Deut 6:4→5, exclusive worship and communal response | The current prompt is long and abstract; an authentic transfer example is missing from the independent question, and the app must never score spiritual sincerity | Offer a noncoercive lived scenario and score Scripture-to-action explanation only |
| **Domain level** | Five chapter status indicators; 10-item MC exit exam (2 per standard); weighted written/guided/exam report; pilot survey | Useful common flow and feedback/reporting foundations | The detailed chapter overview after the opening is not mounted; simple MC recall/connection cannot alone justify high-level understanding; potential excessive total cognitive load | Restore a **light** contents roadmap and use an adaptive evidence bank—not a mandatory 20-question second exam |

## Assessment engineering implications

1. **A prompt is not automatically an assessment rubric.** Existing `attempt(...)` supplies the four source evidence descriptions as `assessmentCriteria` and all four IDs as `evidenceIds`. Before implementing a new blueprint, clarify which independent response demonstrates which level; do not reward all four levels just because one `strong` verdict arrives.
2. **Unscored is not partial.** Provider failures, unknown provenance, and supported-writing outcomes must not become meaningful evidence. Preserve answers and offer reassessment.
3. **Completion is not mastery.** A learner can finish the journey without level-4 defense. Explain the level in ordinary language.
4. **The two domain MC items per standard stay useful.** They are not enough to demonstrate independent interpretation or defense; do not discard them or falsely upgrade their significance.
5. **Avoid unnecessary double testing.** The four candidate tasks per standard are an assessment *bank*. Proposed minimum: brief practice, one meaningful independent explanation per chapter, deeper challenge only if needed, and the existing 10-item domain exam.

## Experience engineering implications

- **Progress:** The compact five-step indicator exists. The expanded table of contents after the opener is absent. Make it a single, lightweight moment; preserve "Up next" without a dominant Explore hub.
- **Scripture:** Inline context must work without requiring off-site browsing. Keep KJV readable; optional historical media cannot replace the Bible.
- **Narrator:** New scripts must go through the shared manifest and pass exact allowlist tests. Playback quality still needs actual-device checking.
- **Visuals:** Existing purpose-specific scenes should be retained and refined only where they misrepresent a passage, repeat unhelpfully, or lack verified rights.
- **Persistence:** Never erase prior answers or exam data when a learner restarts; never mix pilot survey records with synthetic tests.
- **Accessibility:** Mobile-first layout, reading-first mode, narration Off/Replay, reduced motion, captions, keyboard and focus management.

## Recommended implementation order after owner approval

**First** approve the source-grounded standard-level learning outcomes and exam-evidence philosophy. **Then** ask Codex for a fresh code-to-blueprint delta (because code may have changed), with **no automatic rewrite**. Implement OG.1.1.18 and its small assessment improvements first, validate the experience, and use the same approved framework to finish OG.1.2–5.

## Review blockers

- The exact blueprint revisions require **owner sign-off**.
- Decide one performance evidence policy: typed explanations for the initial pilot (simplest to validate), with optional spoken input after consent, transcription, and fairness testing.
- Decide the maximum assessment burden and whether each standard's evidence can be captured partly during the experience instead of entirely at the end.
- Use an explicit acceptance rubric for responsive quality, meaningful interactions, and doctrinal correctness before any live deployment.
