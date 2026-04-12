# Checkpoint 17 — Data-driven preset selection

## What changed

This step moved Classroom preset selection away from fixed route mapping and toward page-data signals.

### 1. Home now chooses its preset from home data
Home no longer hardcodes a preset choice.
It now selects a Classroom preset from the available continue-session signals in `homeData`.

### 2. Progress now chooses its preset from progress data
Progress no longer hardcodes review every time.
It now prefers the review preset when review-needed signals are present, otherwise it can fall back to resume or direct flow.

### 3. Profile now chooses its preset from profile data
Profile no longer hardcodes adaptation every time.
It now selects the adaptation preset from learner-level or adaptation-related signals in `profileData`.

### 4. Session selection is now closer to real app behavior
This does not yet use backend state, but it moves the rebuild from fixed route wiring toward state-driven Classroom entry behavior.

## Files touched

- app/src/core/classroom/classroomSessionData.js
- app/src/features/home/HomePage.jsx
- app/src/features/progress/ProgressPage.jsx
- app/src/features/profile/ProfilePage.jsx

## Current state

The rebuild now has:
- multiple active session presets
- entry-intent-aware Classroom framing
- page-data-driven preset selection
- session-driven Bible Support
- stage-aware Classroom progression and evaluation

## Recommended next step

Expose the chosen preset or session path visibly in Classroom so the user can see which session context was selected and verify that Home, Progress, and Profile are truly opening different lesson contexts.
