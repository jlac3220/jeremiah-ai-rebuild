# Checkpoint 15 — Entry-intent feedback surface

## What changed

This step pushed Classroom entry intent into the feedback surface itself.

### 1. Feedback framing now changes by entry intent and result
The feedback panel now speaks differently depending on:
- resume path
- review path
- learner adaptation path
- direct classroom entry

And it varies by:
- empty
- weak
- partial
- strong

### 2. The evaluator stayed stable
This step did not rewrite the doctrinal evaluator. Instead, it changed the way Jeremiah AI presents feedback to the learner after evaluation.

### 3. Entry intent now affects the live teaching response loop
Entry intent now affects:
- the visible entry label
- the opening surface content
- the first lesson block
- the response hint
- the response action card
- the submit action label
- the feedback surface

This pushes the rebuild further from static shell behavior and deeper into guided teaching behavior.

## Files touched

- app/src/core/classroom/classroomEntryIntent.js
- app/src/features/classroom/ClassroomPage.jsx

## Recommended next step

Move from one hardcoded session toward multiple session presets so Home, Progress, and Profile are not just framing the same single lesson, but can eventually open different real lesson contexts.
