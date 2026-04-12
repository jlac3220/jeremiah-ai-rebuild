# Checkpoint 19 — Live stage status sync

## What changed

This step kept the visible Classroom session surface aligned with live progression instead of leaving it as an entry-only snapshot.

### 1. Classroom now compares preset entry stage to live stage
The status surface now tracks the relationship between:
- the preset entry stage
- the current live stage

### 2. Classroom now shows session movement explicitly
The page now explains whether the learner is:
- still at the preset entry stage
- advanced beyond the preset entry stage
- earlier than the preset entry stage because of reset or reopen behavior

### 3. The status surface now reflects real progression
This makes the Classroom context area more truthful as the learner advances through the live stage flow.

## Files touched

- app/src/features/classroom/ClassroomPage.jsx

## Current state

The rebuild now has:
- multiple real Classroom session presets
- page-data-driven preset selection
- visible preset/session context
- live-stage-aware session movement feedback
- entry-intent-aware framing, action, and feedback
- session-driven Bible Support
- stage-aware progression and evaluation

## Recommended next step

Persist live stage movement back into session state so reopening Classroom can restore not only the preset, but also the learner’s current live stage position.
