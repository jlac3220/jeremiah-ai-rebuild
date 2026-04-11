# Checkpoint 11 — Session-driven Bible Support and Classroom Entry Intent

## What changed

This checkpoint captures the next rebuild step after checkpoint 09 plus the cleanup work that followed.

### 1. Bible Support now serves the active Classroom session
- `BibleSupportPage.jsx` no longer renders hardcoded OG content
- the page now reads from `currentSession`
- study title, standard title, truth statement, and verses are now session-driven
- selecting a verse updates the passage reader dynamically

### 2. Classroom entry intent now varies by source page
- Home enters Classroom as `resume`
- Progress enters Classroom as `review`
- Profile enters Classroom as `adaptation`
- Classroom reads the entry intent and shows the correct visible label

### 3. Redundant session fields were removed
- removed the separate `currentStage` field from `classroomSessionData.js`
- removed the old `sessionType` field from `classroomSessionData.js`
- live stage label now comes from the stage system instead of duplicated session data
- visible session label now comes from entry intent instead of a static hardcoded field

## Current state

The rebuild now has:
- four main tabs: Home, Classroom, Progress, Profile
- Bible Support as a support flow, not a main tab
- stage-aware Classroom progression
- stage-aware response evaluation
- transition messaging on strong advancement
- session-driven Bible Support
- source-aware Classroom entry labeling

## Files touched in this step

- `app/src/features/bible-support/BibleSupportPage.jsx`
- `app/src/core/classroom/classroomSessionData.js`
- `app/src/core/classroom/classroomEntryIntent.js`
- `app/src/features/home/HomePage.jsx`
- `app/src/features/progress/ProgressPage.jsx`
- `app/src/features/profile/ProfilePage.jsx`
- `app/src/features/classroom/ClassroomPage.jsx`

## Recommended next step

Make the Classroom opening surface change more meaningfully by entry intent, not just the label:
- resume should emphasize continuation
- review should emphasize correction / weak areas
- adaptation should emphasize learner-level delivery

This should remain a guided doctrinal flow, not a generic dashboard jump.
