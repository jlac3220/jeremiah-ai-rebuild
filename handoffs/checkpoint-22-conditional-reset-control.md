# Checkpoint 22 — Conditional preset reset control

## What changed

This step made the Classroom preset reset control conditional instead of always visible.

### 1. Reset now appears only when it is useful
The reset button only renders when the live stage is different from the preset entry stage.

### 2. Classroom status surface is cleaner
When the learner is already at the preset entry stage, Jeremiah AI no longer shows a redundant reset action.

### 3. Reset behavior is unchanged
This step does not alter the reset logic itself.
It only makes the control smarter about when it should appear.

## Files touched

- app/src/features/classroom/ClassroomPage.jsx

## Current state

The rebuild now has:
- multiple real Classroom session presets
- page-data-driven preset selection
- visible preset/session context
- live-stage-aware session movement
- persisted live stage by preset
- conditional preset reset control
- entry-intent-aware framing, action, and feedback
- session-driven Bible Support
- stage-aware progression and evaluation

## Recommended next step

Show a lightweight confirmation state after reset so the user can tell at a glance that the live stage has been restored to the preset entry stage.
