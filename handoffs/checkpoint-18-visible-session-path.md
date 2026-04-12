# Checkpoint 18 — Visible session path in Classroom

## What changed

This step made the selected Classroom session preset visible inside the Classroom page itself.

### 1. Classroom now shows the active session path
The page now displays the currently selected session path so it is obvious whether the learner entered through:
- resume
- review
- learner adaptation
- direct classroom entry

### 2. Classroom now exposes preset context clearly
The visible session surface now shows:
- active session path
- preset entry stage
- live stage
- learner path

This makes it possible to verify that Home, Progress, and Profile are opening different real lesson contexts instead of only changing outer framing.

## Files touched

- app/src/features/classroom/ClassroomPage.jsx

## Current state

The rebuild now has:
- multiple real Classroom session presets
- page-data-driven preset selection
- visible preset/session context in Classroom
- entry-intent-aware framing, action, and feedback
- session-driven Bible Support
- stage-aware progression and evaluation

## Recommended next step

Make the session path surface react to actual progress state over time so the visible preset and live stage stay aligned as the learner advances.
