# Checkpoint 14 — Entry-intent response action

## What changed

This step pushed Classroom entry intent into the first live response action itself.

### 1. Entry intent now changes the response action framing
The response area now shows entry-intent-aware action language before the learner types:
- Home -> continuation framing
- Progress -> correction framing
- Profile -> learner-level framing
- direct access -> general classroom response framing

### 2. Entry intent now changes the submit button label
The first response action now uses source-aware submit language instead of one generic submit button for every entry path.

### 3. Entry intent now reaches the live teaching interaction
Entry intent now affects:
- the visible entry label
- the opening surface content
- the first lesson block
- the response hint
- the response action card
- the submit action label

This moves Classroom further from static shell behavior and closer to guided doctrinal interaction.

## Files touched

- app/src/core/classroom/classroomEntryIntent.js
- app/src/features/classroom/ClassroomPage.jsx

## Recommended next step

Make the feedback surface itself entry-intent aware so weak / partial / strong responses sound slightly different depending on whether the learner is resuming, reviewing, or learning through adaptation.
