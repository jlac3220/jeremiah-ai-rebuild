# Checkpoint 21 — Preset reset control

## What changed

This step added a direct reset control for the active Classroom preset.

### 1. Classroom can now reset the active preset to its original entry stage
The user can now intentionally restart the current preset from the preset entry stage instead of staying at the persisted live stage.

### 2. Reset keeps the preset context but clears the live stage drift
This reset does not switch the learner to a different preset.
It restores the current preset back to its own starting stage.

### 3. Reset updates live stage persistence too
When the reset is used, the saved live stage for the active preset is rewritten so reopening Classroom matches the reset state.

## Files touched

- app/src/features/classroom/ClassroomPage.jsx

## Current state

The rebuild now has:
- multiple real Classroom session presets
- page-data-driven preset selection
- visible preset/session context
- live-stage-aware session movement
- persisted live stage by preset
- preset reset control
- entry-intent-aware framing, action, and feedback
- session-driven Bible Support
- stage-aware progression and evaluation

## Recommended next step

Make the reset control conditional and smarter so it only appears when the live stage is different from the preset entry stage.
