# OG.1 Stage 2 review — issue #45

Branch: `codex/og1-stage2-interactive-experience`  
Base/PR target: `codex/og1-stage1-design-repairs` at `4da21ede8d5114d7a18fd9759a6f6a6b6354ea2f`  
Reviewed against AGENTS.md, issue #45, the design audit in PR #42, and the master/OG.1.1 Lesson Blueprints on `curriculum/lesson-blueprint-framework` (reference revision `bf8c6391c24fcc35953ca9e3cc82fbaee2d704cb`). The Blueprints are instructional direction; their draft content was not substituted for approved lesson content.

## 1. Shema reference implementation

The first implementation commit (`a9b0ca8`) establishes the Shema reference before the later chapters are extended.

- **Task-first writing:** the full, unchanged prompt stays visible. At desktop/tablet widths it sits beside the response desk; on phones it precedes it. The input, autosave status, feedback and action share one workspace. Original evidence-trail guidance is available as optional teaching support, rather than a long mandatory panel above the input. The 390px explanation screen falls from 1,681 to 1,277px (24% shorter); the 320px screen falls from 1,815 to 1,374px. These are document-height measurements, not claims about learning outcomes.
- **Independent recall:** no KJV answer, hint, or teaching support appears during the memory attempt. The existing deterministic KJV checker is unchanged. Its feedback can open the existing Bible after checking. Recall and explanation remain separate tasks.
- **Honest feedback:** an editorial teacher response displays the actual feedback, source category, and status. Authored feedback, deterministic recall, meaning-based assessment, supported practice, and saved/unassessed responses are distinguishable. No invented personal analysis, mastery badge, or fake AI exchange is added. Actual follow-up prompts and item explanations remain available.
- **Optional support:** opening support before submission saves the existing `usedSupport` flag. Closing it or reloading cannot turn the work into independent evidence. The existing engine continues to withhold independent evidence from a supported pass. Required assessment instructions remain visible without opening support.
- **Narrative continuity:** both existing Moses placements and their original teaching remain. The prologue emphasizes the Scripture; the Shema encounter retains the landscape and invitation. Phone crops/overlays now expose the artwork while protecting reading contrast. No replacement imagery or new film was introduced.
- **Phrase exploration:** visited phrases become real, keyboard-operable review controls. Future phrases stay locked until reached in the existing sequence. The selected phrase is announced without scrolling the learner back to the top or taking focus from the chosen control.
- **Chapter guide:** a quiet “View chapter map” action expands five chapter focuses from the existing journey data. Exploring a chapter changes only the guide selection; it cannot skip teaching or alter evidence, current move, drafts, or saved resume state. It reports current/ahead/covered, not mastery. Close returns focus to the opener. The options menu links to the same guide.
- **Audio:** one On/Off preference persists on the device. A deliberate Hear/Replay tap still uses the existing authored-text MP3 endpoint; turning automatic narration off does not remove reading. Errors from manual playback belong to the current scene and do not leak into later scenes. Narrator, manifest, pronunciation and backend are unchanged. Video remains optional with the Stage 1 text-first exit.

### Annotated Shema comparison

| Evidence | Before | After | What to examine |
| --- | --- | --- | --- |
| Phone writing | [390px](stage2-evidence/before/390-explanation.png) | [390px](stage2-evidence/after/390-explanation.png) | Full prompt preserved; support no longer pushes the response below a second long panel. |
| Desktop writing | [1440px](stage2-evidence/before/1440-explanation.png) | [1440px](stage2-evidence/after/1440-explanation.png) | Prompt and response can be read together; measured line lengths and one primary action. |
| Moses encounter | [390px](stage2-evidence/before/390-encounter.png) | [390px](stage2-evidence/after/390-encounter.png) | Same scene, Scripture and narrative; tighter composition and visible artwork. |
| Phrase study | [390px](stage2-evidence/before/390-phrases.png) | [390px](stage2-evidence/after/390-phrases.png) | Clear visited/current/future states and reversible exploration. |
| Unscored feedback | [390px](stage2-evidence/before/390-unscored.png) | [390px](stage2-evidence/after/390-unscored.png) | Saved/unassessed is explicit; the actual response remains above feedback. |

Additional rendered states: [chapter guide](stage2-evidence/extra/390-chapter-map.png), [open support](stage2-evidence/extra/390-support.png), [supported feedback](stage2-evidence/extra/390-supported-feedback.png), [320×440 writing](stage2-evidence/extra/320-short-writing.png).

## 2. Extension to chapters 2–5

These chapters share typography and controls but retain different instructional patterns.

| Chapter | Implementation | Evidence |
| --- | --- | --- |
| Isaiah | A cumulative evidence board retains every reached BEFORE/BESIDE/AFTER quotation, reference and explanation. Reviewing a prior declaration does not erase later reached evidence. Future evidence still follows the authored reveal order. Original manuscript selection/fallback and concluding Bible link remain. | [Before](stage2-evidence/before/390-isaiah.png) · [After](stage2-evidence/after/390-isaiah.png) · [All three](stage2-evidence/extra/390-isaiah-complete.png) |
| Jesus and the Apostles | The Moses→Jesus→Paul track retains the original three distinct biblical images. Prior quotations and explanations stay in a trail as the active witness advances, so the connection can be read together. Original Pauline context and all Bible links remain. | [Before](stage2-evidence/before/390-continuity.png) · [After](stage2-evidence/after/390-continuity.png) · [Complete trail](stage2-evidence/extra/390-continuity-complete.png) |
| Understanding the Difference | Shared confession remains first; the original perspectives are revealed in order. Both positions receive identical type, spacing, border, background and weight. Existing identity investigation, doctrinal summary and questions remain. No preferred color or animated approval favors a position. | [Before](stage2-evidence/before/390-comparison.png) · [After](stage2-evidence/after/390-comparison.png) |
| Knowing Him. Loving Him. | A calmer confession/response spread leads into the existing consequence journey. Scripture uses readable serif typography, reduced card decoration and warm rules. Original devotion teaching, imagery/fallbacks and assessments remain. No sincerity score, private-reflection collection or claim to measure devotion is introduced. | [Before](stage2-evidence/before/390-devotion.png) · [After](stage2-evidence/after/390-devotion.png) |

All written chapter assessments now use the response workspace with their own complete authored prompts and existing support steps. Guided activity feedback also uses the teacher response treatment; interactions and graders remain the originals.

## Components and design decisions

| Component | Responsibility |
| --- | --- |
| `OG1ResponseWorkspace.jsx` / `.css` | Full task, labeled input, autosave status, actual feedback, existing submission action and optional support. Recall explicitly excludes support. |
| `OG1TeacherFeedback` (same file) | Source/status, actual teacher message, item explanations, follow-up prompt and appropriate Scripture review. |
| `OG1ChapterGuide.jsx` | Local orientation, existing chapter data, keyboard focus and return; no learning-state mutation. |
| `OG1InteractiveExperience.css` | Scoped Stage 2 scene composition. Legacy players retain their styling. |
| `OG1LessonPlayer.jsx` | Integrates workspaces/guide and cumulative evidence/trail; keeps existing navigation, evaluation, completion and archive callbacks. |
| `ShemaExperience.jsx` | Original phrase teaching with progressive review buttons; original teach-back evidence list passed as support. |
| `useLessonNarration.js` | Persists only the audio preference; confines manual-playback errors to their scene. |

The palette uses navy ink `#172b45`, secondary text `#52647a`, indigo `#4357b5`, pale paper and white writing surfaces. Warm bronze is limited to devotional structure. Existing type families remain: familiar sans for tasks/controls and serif for Scripture. Main prose is approximately 16px with 1.7–1.8 line height; phone controls have in-flow 44–48px targets. The composition changes serve reading and relationships rather than introducing a global theme or slide framework.

Large entrance animations are suppressed in Stage 2. Phrase updates retain only their existing short reveal, with reduced-motion suppression. There are no timers, forced waits, simulated conversations, new media sources, or motion that changes content/order. Focus changes on scene entry; it stays on controls during in-scene exploration.

## Preservation evidence

The following remain byte-for-byte unchanged from the Stage 1 base:

- All `app/src/core/` and `app/src/data/` files: 20 instructional moves, KJV/teaching text, approved standards, questions, matching/reasoning tasks, deterministic recall, rubric criteria, teacher evaluation, progression, weighted rating, 10-question exit exam and history/archive engines.
- Lesson Blueprint/curriculum source documents; biblical image assets and catalogues; narration manifest and MP3/text backend.
- Inline Bible component/source, exam component, report calculation, summary content, restart dialog, pilot survey component/schema/storage, API/server implementation and Vercel configuration.
- Dependencies, lockfile, package scripts, CI configuration, production/domain/secret settings.

Checked with `git diff --exit-code 4da21ed -- app/src/data app/src/core app/server app/api app/vercel.json curriculum` and review of the changed-file list. No legacy/source branches were merged, reset, replaced or deleted.

The only new persistent value is the device audio boolean `jeremiah.lesson.narration.enabled`. Support uses the existing draft `usedSupport` field and assessment rules. Revealed-phrase/map selection is local UI state; the existing move-level resume semantics are unchanged. No response or attempt is cleared to implement a retry. Existing feedback may recommend future independent practice; this patch does not introduce a new grading/retry contract.

## Validation and limitations

- **25/26 existing package test commands passed**, including every test command in both CI workflows. [Exact command statuses](stage2-evidence/test-results.json).
- **Production build passed** with the existing large-bundle warning (~1,024KB JavaScript / 294KB gzip). No production deployment was run.
- `test:bible-source` still fails with external `fetch failed` in this restricted environment. Parser, inline Bible contract, narration, media, grouped lesson, teacher-led, exam, weighted rating, Ask Jeremiah, pilot survey and Vercel tests pass. [Failure output](stage2-evidence/test-bible-source.log).
- Repository lint still reports the existing **10 errors and 6 warnings**. No new lint findings were introduced. [Lint output](stage2-evidence/lint.log). This patch does not claim a clean repository lint baseline.
- **Stage 1 browser regression passed** after updating selectors for the cumulative board and explicitly enabling audio for its error test (Off now intentionally survives reload). It checked every chapter/next label, media failure exits, keyboard restart/cancel, archived exam/history, actual 10-question submission, detailed answer review, report→summary→survey navigation, contrast, short viewport and reduced motion. [Output](stage2-evidence/stage1-browser.log). Survey persistence/API validation also passes in `test:pilot`; browser tests do not submit real feedback.
- **New Stage 2 browser regression passed** ([output](stage2-evidence/stage2-browser.log)): every written prompt equals its approved source; drafts survive reload; recall hides the answer; support remains supported after close/reload; a mocked strong supported response receives no independent evidence; unavailable assessment remains unscored and can continue; map exploration cannot mutate progress; future phrases stay locked while reached phrases can be revisited; Off survives reload while a deliberate Hear tap still uses the existing endpoint; Isaiah retains evidence; the final trail retains Moses/Jesus; comparison styles match; response focus/short-height/reduced-motion checks pass; missing Audio and blocked imagery/video retain the text experience. No page errors were observed.
- **72 matrix screenshots:** nine states before/after at widths **320, 390, 768, 1440px**. Heights 844px on phones and 1000px on tablet/desktop, device scale 1, real Chromium 155 + Playwright. No horizontal overflow in the captured matrix; [before measurements](stage2-evidence/before/metrics-all.json), [after measurements](stage2-evidence/after/metrics-all.json). Additional screenshots cover support, map, completed evidence/trail, short height, reduced motion and unavailable media. Representative screenshots at all four widths were visually inspected; the full matrix is rendered UI, not source-based mockups.
- Keyboard focus, semantic labels, live regions, contrast colors and target sizes were checked in Chromium. Physical iOS/Android keyboards, VoiceOver/NVDA announcement quality and real audio/YouTube playback still need device review. Browser emulation does not establish those results. No blanket accessibility certification or measured engagement gain is claimed.
- External assessment/audio were mocked in browser checks to avoid paid calls and unstable remote dependencies. Feedback screenshots use clearly synthetic fixtures; they do not establish live grading quality. The existing passage-specific manuscript fallback is visible where approved external imagery is unavailable; no substitute artwork was invented.

### Reproduce locally

Use installed Playwright and Chromium (`CHROMIUM_PATH` can override `/usr/bin/chromium`). From `app/`:

```sh
npm run build
PORT=4184 PILOT_FEEDBACK_FILE=/tmp/jeremiah-stage2-synthetic-feedback.jsonl npm start
```

In another terminal:

```sh
JEREMIAH_REVIEW_URL=http://127.0.0.1:4184 node scripts/verify-og1-stage1-browser.cjs
JEREMIAH_REVIEW_URL=http://127.0.0.1:4184 JEREMIAH_SCREENSHOT_DIR=/tmp/jeremiah-stage2/extra node scripts/verify-og1-stage2-browser.cjs
JEREMIAH_REVIEW_URL=http://127.0.0.1:4184 node scripts/capture-og1-stage2-browser.cjs after all
```

`capture-og1-stage2-browser.cjs` can target a separate server running the unchanged base to reproduce baseline captures; use a separate checkout rather than overwriting work. Synthetic browser storage is isolated per test. Browser scripts require the review environment's Playwright/Chromium; no new application dependency was added.

## Review route

Start at `/#pilot`, consent to the anonymous pilot, and begin/continue the lesson. Open the chapter guide, close it, explore the phrases in order, complete independent recall, then try the explanation with and without optional support. Follow Isaiah through all three declarations; follow Moses→Jesus→Paul; compare the two positions; read the confession/response in the final chapter. Complete the exit exam and continue through report, summary and optional survey. Existing restart offers cancel first and preserves prior work on confirmation.

The self-contained screenshot preview in this workspace is `/workspace/scratch/jeremiah-stage2-preview.html`. It is a visual review artifact, not a hosted interactive deployment. No merge or production deployment was performed. GitHub API availability and any automatic branch preview are reported separately; no hosting/authentication configuration was changed to obtain them.

### Published review branch

Implementation pushed in two reviewable commits: `a9b0ca8` (Shema reference) and `1c2a1b2` (later chapters, tests and visual review). The branch is [available on GitHub](https://github.com/jlac3220/jeremiah-ai-rebuild/tree/codex/og1-stage2-interactive-experience).

Creating the draft PR with the GitHub CLI returned `Post "https://api.github.com/graphql": Forbidden`. As permitted by issue #45, the fallback is this [comparison targeting Stage 1](https://github.com/jlac3220/jeremiah-ai-rebuild/compare/codex/og1-stage1-design-repairs...codex/og1-stage2-interactive-experience?expand=1). No PR number is claimed. The public commit page exposed no automatic Vercel preview URL during this review; the screenshot artifact and this image-linked review are available now. No authentication or hosting changes were made.
