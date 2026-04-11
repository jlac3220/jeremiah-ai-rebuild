# Checkpoint 13 — Entry-intent lesson block

## What changed

This step moved Classroom entry intent deeper into the live lesson area instead of leaving it only in the opening surface.

### 1. Entry intent now affects the first active lesson block
The first dark lesson block inside Classroom now changes by entry intent:
- Home -> continuation emphasis
- Progress -> correction / review emphasis
- Profile -> learner-level adaptation emphasis
- direct access -> general classroom emphasis

### 2. Entry intent now changes the response hint
The response box now uses entry-intent-aware hint text so the learner is pushed toward the right kind of response based on how they entered Classroom.

### 3. Classroom is becoming behavior-aware, not just label-aware
Entry intent now affects:
- the visible entry label
- the opening surface content
- the first active lesson block
- the response hint

This moves the rebuild closer to a guided doctrinal learning flow instead of a static shell with route changes.

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
- source-aware first lesson block

## Recommended next step

Make entry intent affect the first response action itself:
- resume should reinforce continuation language
- review should reinforce correction language
- adaptation should reinforce learner-level framing

That would push entry intent one level deeper into the live teaching interaction.
