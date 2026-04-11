# Checkpoint 12 — Classroom entry-intent opening surface

## What changed

This step deepened the Classroom entry-intent behavior beyond just a small label.

### 1. Entry intent content became more meaningful
The entry-intent content now includes:
- eyebrow
- title
- body text
- emphasis section
- action section

This allows Classroom to open with a different instructional feel depending on how the learner arrived.

### 2. Classroom opening surface now reflects source intent
The top opening card in Classroom now changes in a meaningful way for:
- Home → resume
- Progress → review
- Profile → adaptation
- direct access → direct classroom session

### 3. The opening card now includes stronger session context
The card now shows:
- current stage pill
- emphasis card
- Jeremiah AI action card
- active standard card

This makes the Classroom opening feel more like guided instruction and less like a generic route destination.

## Files touched

- app/src/core/classroom/classroomEntryIntent.js
- app/src/features/classroom/ClassroomPage.jsx

## Current state

The rebuild now has:
- four main tabs
- Bible Support as a support flow
- stage-aware Classroom progression
- stage-aware evaluation
- session-driven Bible Support
- source-aware Classroom entry labels
- source-aware Classroom opening surface

## Recommended next step

Make the first actionable area under the opening surface shift by entry intent too:
- resume should emphasize continuing the current stage
- review should emphasize weak-area correction
- adaptation should emphasize learner-level framing

That would move entry intent from descriptive context into active lesson behavior.
