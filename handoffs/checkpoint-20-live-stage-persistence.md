# Checkpoint 20 — Live stage persistence

## What changed

This step persisted the learner's live Classroom stage back into session state.

### 1. Live stage now saves per session preset
Each active Classroom preset can now remember its most recent live stage position in session storage.

### 2. Reopening Classroom now restores the live stage
Classroom no longer reopens only at the preset entry stage.
It now restores the saved live stage for the active preset when available.

### 3. Preset entry stage remains visible
The original preset entry stage is still preserved separately so Classroom can continue showing:
- preset entry stage
- live stage
- session movement

That keeps the status surface honest while also restoring real learner progress.

## Files touched

- app/src/core/classroom/classroomSessionData.js
- app/src/features/classroom/ClassroomPage.jsx

## Current state

The rebuild now has:
- multiple real Classroom session presets
- page-data-driven preset selection
- visible preset/session context
- live-stage-aware session movement
- persisted live stage by preset
- entry-intent-aware framing, action, and feedback
- session-driven Bible Support
- stage-aware progression and evaluation

## Recommended next step

Add a simple reset control for the active preset so Jeremiah AI can intentionally restart the current preset from its entry stage when desired.
