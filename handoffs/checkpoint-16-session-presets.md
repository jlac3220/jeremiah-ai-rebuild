# Checkpoint 16 — Classroom session presets

## What changed

This step moved Jeremiah AI beyond one hardcoded live session.

### 1. Classroom now supports multiple session presets
The rebuild now has session presets for:
- direct classroom entry
- resume entry
- review entry
- learner adaptation entry

Each preset carries its own:
- current stage
- learner path
- truth explanation
- verse set
- checkpoint framing

### 2. Home, Progress, and Profile now open different real session contexts
These tabs are no longer only changing the framing around the same lesson.
They now set an active Classroom session preset before routing into Classroom.

### 3. Classroom and Bible Support now read the active session preset
The live session surface and support surface now pull from the active preset instead of a single hardcoded session object.

## Files touched

- app/src/core/classroom/classroomSessionData.js
- app/src/features/home/HomePage.jsx
- app/src/features/progress/ProgressPage.jsx
- app/src/features/profile/ProfilePage.jsx
- app/src/features/classroom/ClassroomPage.jsx
- app/src/features/bible-support/BibleSupportPage.jsx

## Current state

The rebuild now has:
- four main tabs
- Bible Support as a support flow
- stage-aware Classroom progression
- stage-aware evaluation
- entry-intent-aware lesson framing
- entry-intent-aware response action
- entry-intent-aware feedback
- multiple active session presets

## Recommended next step

Tie Progress and Profile more directly to preset selection logic so those presets are chosen from real data signals instead of fixed route mappings.
