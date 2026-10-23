# Jeremiah lesson blueprint — authoring standard (v1)

This is the required format for newly authored Jeremiah lessons. It does not claim that all existing lessons are already rewritten. Live rules: src/core/classroom/lessonBlueprint.js; visual path: src/features/classroom/LessonPath.jsx.

## Lesson goal

Make every standard one coherent, phone-readable learning chapter. Scripture and the assigned curricular standard determine doctrine; outside educational media provides context, not authority. Audience: capable high-school/adult reader, no assumed church experience.

## Standard teaching loop

1. **Encounter** — One engaging biblical question or safe fictional scenario that introduces the standard and purpose.
2. **Show me** — Jeremiah teaches in clear language, opens the Scripture in context, and models the reasoning. Use a worked example, authentic visual, or carefully reviewed short media only where it adds meaning.
3. **Guide me** — Matching, ordering, highlighting, sorting, or scenario decision matched to the intellectual skill; provide specific correct/incorrect feedback and retries. Guided practice never establishes independent mastery.
4. **Let me try** — Transfer the learning to a new passage or challenge in the learner's own words, checked against every required evidence criterion. Do not reward memorized keywords alone.
5. **Feedback** — Identify what worked, what was missing, and which passage or reasoning move to revisit. A supported draft can teach, but independence must be demonstrated separately.
6. **Next connection** — Summarize in a single sentence, record progress, and continue to the next standard.

## Required lesson specification

| Element | Editorial requirement |
|---|---|
| Identity | Accurate standard ID, title, one-sentence goal and a clear central question |
| Scripture | Precise anchor quotation, verified context, opens in Jeremiah's Bible |
| Teaching | Two to four short explanation cards; key term defined only when helpful |
| Model | Example of how to reason with the passage rather than only repeat a conclusion |
| Practice | At least one meaningful interaction with explanatory feedback and retry |
| Independence | A distinct application or explanation checked against source standard rubrics |
| Support | Optional contextual verses or structured hints; separate independent retry |
| Media | Publisher, exact URL, source scope, reviewed claims, embedding rights, attribution and optionality |
| Transition | One-sentence synthesis and why the next chapter follows |

Don't select a question type just for variety. Choose it because the standard requires ordering, classification, comparison, reasoning, or application.

## Mobile and accessibility contract

White or neutral cards, charcoal text, one blue action color. No tan/green/purple/coral themed cards. One meaningful thought at a time, readable sizes, visible progress, keyboard access, focus state, touch-friendly targets, reduced motion, safe resume/restart, and no unnecessary scrolling. Don't ask students for personal disclosure as proof of mastery.

## First audited case: OG.1

The study-room entry is **OG.1.LESSON.18**, covering these standards. OG.1.1.18 is the first chapter rather than a separate visible study-room button.

| Chapter | Standard | Goal |
|---|---|---|
| The Shema | OG.1.1.18 | Deuteronomy 6:4–5; context, shema, echad and New Testament reaffirmation |
| Isaiah's witness | OG.1.2.18 | Cumulative before/beside/after declarations and their theological significance |
| The same confession | OG.1.3.18 | Jesus and the apostles continue the confession of one God |
| Explain the difference | OG.1.4.18 | State both Oneness and Trinitarian readings accurately; keep Christ's true humanity |
| Love the one Lord | OG.1.5.18 | Undivided devotion in worship, honest conduct and mission |

Each chapter now teaches **Show me → Guide me → Let me try** before proceeding to the next. The earlier route delayed independent practice across several chapters; that is corrected. The five required independent evaluations and twenty rubric evidence points remain intact.

### OG.1 editorial cautions

- The Hebrew word *echad* must be interpreted in context, not used as a free-standing lexicon proof. Read Deuteronomy 6:4–5 alongside the exclusivity in Isaiah.
- Trinitarian Christianity affirms one God, not three separate gods. Present the opposing position as its proponents understand it before responding from Apostolic theology.
- Jesus' prayers are real; a Oneness interpretation must not make the incarnation a costume or a performance.
- BibleProject's **Shema / Listen** explains listening and covenant response, not Apostolic Godhead doctrine. Publisher synopsis alone is not a full-video doctrinal or rights clearance.
- Media, even when embedded in-app, remains optional, attributed and reviewed for rights; do not edit or repost copyrighted video.

## Chapter release checklist

- [ ] Exact standard and four evidence-level criteria preserved
- [ ] All Scripture and interpretations checked for fidelity and context
- [ ] Modeled teacher reasoning, guided activity, independent task
- [ ] Clear feedback on wrong answers, retries, assessment unavailability safe
- [ ] Media relevance, permission, player, attribution and doctrinal scope reviewed
- [ ] iPhone readability and back/resume/restart behavior tested
- [ ] Test suite and build pass (test:grouped, test:curriculum, build)

## Current scope

This update provides a reusable specification and a structured OG.1 model. The remaining curriculum lessons display a common progress format but **do not yet all have individually reviewed media and bespoke instruction**. Apply this editorial checklist one standard at a time.