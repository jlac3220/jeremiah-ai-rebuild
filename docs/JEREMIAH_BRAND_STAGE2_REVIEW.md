# Issue #49: Stage 2 branding review

Base: `codex/og1-stage2-interactive-experience` at `8fd60b2e6f9200f475567599dbca3cc3a6dcff80`. Integration branch: `codex/jeremiah-app-brand-stage2-port`. No merge of `main`, production deploy, hosting change, or content/assessment revision.

## Selective integration of the eleven theme-source files

| Source in ccb5ef7 | Stage 2 decision |
| --- | --- |
| index.html | Port flame favicon, title, description and theme-color; retain referrer policy. |
| public/brand/home.png | Copy exact existing asset; retain vector fallback. |
| public/brand/jeremiah-flame.png | Copy exact existing asset; shared decorative image with monogram fallback. |
| AppShell.jsx | Keep hash routing, Bible intent cleanup, six-route navigation, learner resume/preset initialization, pilot and lesson routes. Add only scoped surface class and skip link. |
| BottomNav.jsx | Keep all six destinations, labels, aria-current and callbacks. Port Home artwork and Classroom flame; retain remaining Stage 2 icons. |
| index.css | Keep Stage 2 file unchanged; put scoped brand tokens and overrides in jeremiahAppBrand.css. |
| HomePage.jsx | Keep saved dashboard, progress and lesson handlers; replace initials with logo, restore public brand tagline, scope visual treatment. |
| ClassroomPage.jsx | Keep entire file unchanged. Brand existing ClassroomEntrance headers and replace monogram inside existing OG1LessonToolbar; no second lesson header. |
| ProgressPage.jsx | Keep dynamic learner data and callbacks; replace header wordmark. |
| ProfilePage.jsx | Keep saved learning/resume behavior; replace header wordmark. |
| BibleSupportPage.jsx | Keep reader intent, translations, chapter controls, errors and persistence; put a decorative flame inside existing title. |

The pilot landing uses the same shared mark in its existing header. No font asset or third-party font request was added. The public copy is “Apostles’ Doctrine • Pentecostal Experience”. The existing OG.1 lesson palette, dark scenes, semantic feedback states and toolbar remain intact.

## Asset provenance and access

The two raster assets are byte-for-byte copies of the owner-directed branding commit ccb5ef70c4473a252fefee38d00323b11b545526, originally supplied in jlac3220/12-29-25. The owner explicitly authorized reuse as this app’s branding. The flame is 1024×1024 RGBA; Home is 704×704 RGBA, well above their 24–32 CSS-pixel display sizes at 2× and 3× density. No new artwork or font license is asserted; no independent licensing document accompanied these owner-supplied assets.

Decorative images use empty alt text because adjacent wordmarks and button labels provide accessible names. Failed flame images show J; failed Home artwork shows the existing vector house. Verified six navigation targets at least 44×44 CSS px at 390px; existing stage regression covers 320px lesson controls. App navigation remains hidden in the lesson. Pilot header wordmark contrast was corrected after reviewing rendered screenshots.

## Validation

- `npm ci` and `npm run build` pass on the Stage 2 lockfile. Existing large-chunk build warning remains.
- All 23 unique test commands used by the two GitHub CI workflows pass; see [CI results](branding-stage2-evidence/ci-results.json).
- [Stage 1 browser regression](branding-stage2-evidence/stage1.log) passes: all 20 authored labels, media failures, narration Off, keyboard restart, archived exam/history, actual ten-question exam, review/report/summary/survey, contrast, short viewport and reduced motion.
- [Stage 2 browser regression](branding-stage2-evidence/stage2.log) passes: authored prompts, draft persistence, independent/support provenance, unavailable assessment, non-mutating map, retained witness/evidence, narration preference, fair comparison, responsive writing and media fallback.
- [Branding browser review](branding-stage2-evidence/after.log) passes: all six destinations retained; pilot entry, one lesson toolbar, opening/chapter/map/actual exit exam, image fallback, high-DPI source size, touch targets, no page errors or horizontal overflow at 390 and 1440.
- Repository lint remains the documented baseline: 10 errors, 6 warnings. No new lint findings; [output](branding-stage2-evidence/lint.log).
- `git diff --exit-code 8fd60b2 -- app/src/core app/src/data app/server app/api app/vercel.json curriculum app/src/features/classroom/OG1LessonPlayer.jsx app/src/features/classroom/OG1ExitExam.jsx app/src/features/pilot/OG1PilotSurvey.jsx` passes.
- No data schema, narrator, question, scoring, storage key, learner attempt, survey path, or Issue #48 instructional contract was changed.

Screenshots use real Chromium and synthetic isolated browser state with deviceScaleFactor 2, exported at CSS resolution. Before captures come from an archived unchanged Stage 2 source tree; after captures use the production build. The screenshot fixtures intentionally return unavailable narration/Bible APIs and never send paid AI requests or survey writes; the visible reader error is that explicit fallback, not a claim of successful remote chapter fetch. Live voice, AI grading, external Bible/video and physical-device/screen-reader quality are outside this branding verification.

## Before / after screenshots

| Screen | 390 before | 390 after | 1440 before | 1440 after |
| --- | --- | --- | --- | --- |
| home | [390 before](branding-stage2-evidence/before/390-home.png) | [390 after](branding-stage2-evidence/after/390-home.png) | [1440 before](branding-stage2-evidence/before/1440-home.png) | [1440 after](branding-stage2-evidence/after/1440-home.png) |
| classroom | [390 before](branding-stage2-evidence/before/390-classroom.png) | [390 after](branding-stage2-evidence/after/390-classroom.png) | [1440 before](branding-stage2-evidence/before/1440-classroom.png) | [1440 after](branding-stage2-evidence/after/1440-classroom.png) |
| progress | [390 before](branding-stage2-evidence/before/390-progress.png) | [390 after](branding-stage2-evidence/after/390-progress.png) | [1440 before](branding-stage2-evidence/before/1440-progress.png) | [1440 after](branding-stage2-evidence/after/1440-progress.png) |
| profile | [390 before](branding-stage2-evidence/before/390-profile.png) | [390 after](branding-stage2-evidence/after/390-profile.png) | [1440 before](branding-stage2-evidence/before/1440-profile.png) | [1440 after](branding-stage2-evidence/after/1440-profile.png) |
| bible-support | [390 before](branding-stage2-evidence/before/390-bible-support.png) | [390 after](branding-stage2-evidence/after/390-bible-support.png) | [1440 before](branding-stage2-evidence/before/1440-bible-support.png) | [1440 after](branding-stage2-evidence/after/1440-bible-support.png) |
| pilot | [390 before](branding-stage2-evidence/before/390-pilot.png) | [390 after](branding-stage2-evidence/after/390-pilot.png) | [1440 before](branding-stage2-evidence/before/1440-pilot.png) | [1440 after](branding-stage2-evidence/after/1440-pilot.png) |
| lesson | [390 before](branding-stage2-evidence/before/390-lesson.png) | [390 after](branding-stage2-evidence/after/390-lesson.png) | [1440 before](branding-stage2-evidence/before/1440-lesson.png) | [1440 after](branding-stage2-evidence/after/1440-lesson.png) |
| chapter | [390 before](branding-stage2-evidence/before/390-chapter.png) | [390 after](branding-stage2-evidence/after/390-chapter.png) | [1440 before](branding-stage2-evidence/before/1440-chapter.png) | [1440 after](branding-stage2-evidence/after/1440-chapter.png) |
| map | [390 before](branding-stage2-evidence/before/390-map.png) | [390 after](branding-stage2-evidence/after/390-map.png) | [1440 before](branding-stage2-evidence/before/1440-map.png) | [1440 after](branding-stage2-evidence/after/1440-map.png) |
| exam | [390 before](branding-stage2-evidence/before/390-exam.png) | [390 after](branding-stage2-evidence/after/390-exam.png) | [1440 before](branding-stage2-evidence/before/1440-exam.png) | [1440 after](branding-stage2-evidence/after/1440-exam.png) |

42 real captures include two after-only logo-failure screens. [Before measurements](branding-stage2-evidence/before/metrics.json), [after measurements](branding-stage2-evidence/after/metrics.json).

## Reproduce

From `app/`, run `npm ci`, `npm run build`, then `PORT=4184 PILOT_FEEDBACK_FILE=/tmp/jeremiah-brand-test-feedback.jsonl npm start`. With Playwright/Chromium available to the review runner, run:

```sh
JEREMIAH_REVIEW_URL=http://127.0.0.1:4184 node scripts/verify-og1-stage1-browser.cjs
JEREMIAH_REVIEW_URL=http://127.0.0.1:4184 node scripts/verify-og1-stage2-browser.cjs
JEREMIAH_REVIEW_URL=http://127.0.0.1:4184 node scripts/verify-brand-stage2-browser.cjs after
```

The browser runner uses the review environment’s Playwright, not a new application dependency. Preview deployment and GitHub checks are reported on the draft PR; a local build/screenshot is not evidence of a hosted URL. No merge or production deployment is authorized.

## Hosted review

Draft PR: [#50](https://github.com/jlac3220/jeremiah-ai-rebuild/pull/50), targeting Stage 2. [Branch preview](https://jeremiah-ai-rebuild-git-codex-j-8c43dd-jlace3320-3949s-projects.vercel.app/#pilot), or [Home](https://jeremiah-ai-rebuild-git-codex-j-8c43dd-jlace3320-3949s-projects.vercel.app/#home). Both Vercel integrations and both GitHub CI workflows passed for the initial integration commit. The preview requires owner Vercel sign-in; anonymous requests redirect to the Vercel login screen. Local production-build browser checks are verified; protected hosted app behavior is not claimed. No production, access-protection, or hosting settings changed.
