# Jeremiah AI technical audit

Audit date: November 4, 2026 (America/Chicago).

## Scope and method

This is a non-destructive audit of `codex/jeremiah-continuation` at
`1e5caae03471e4aa047ddcb11c29af377535ff0d`, after reading the root
[`AGENTS.md`](../AGENTS.md). The audit branch is
`codex/jeremiah-technical-audit`; its intended PR base is
`codex/jeremiah-continuation`.

Only this report changes tracked files. No application source, curriculum,
survey schema, lockfile, infrastructure, branch merges, or deployments were
changed. The requested production build was run; the application was not
re-scaffolded or rebuilt from scratch. Existing Node 24.22.1 / npm 11.9.0 were
used. `npm ci` succeeded on this branch, unlike the older main-branch lockfile
encountered during environment onboarding.

Evidence includes source inspection, every package-defined `test:*` command,
lint, a production build, local API probes, and Chromium/Playwright checks of
the built application. Browser profiles and survey records were isolated;
synthetic feedback and CSV exports were written only under `/tmp/jeremiah-audit`.
No real pilot records were read or submitted. Test-generated Python bytecode
was removed. Logs and screenshots are temporary evidence, not committed assets.

**Conclusion:** the continuation branch contains a substantial, functioning
OG.1 pilot rather than the minimal application on `main`. Its local lesson,
exam, summary, and survey flow work, with important defects in narration-script
alignment, offline assessment semantics, and restart preservation. Production
AI/audio, durable Blob storage, and the actual Vercel production branch remain
unverified; passing local contract tests does not establish deployment readiness.

## Branch and deployment continuity

Read-only Git remote inspection confirmed:

| Branch | Observed SHA | Meaning |
| --- | --- | --- |
| `main` | `e0171847ab534d58e819c41d7115317213af3083` | Older application; 540 commits behind the documented deployed baseline, with no main-only commits in that comparison |
| `archive/pre-codex-2026-11-04` | `5a631e6d3161f6f2b2c379078e06ca8da826f4e2` | Preserved deployment baseline |
| `codex/jeremiah-continuation` | `1e5caae03471e4aa047ddcb11c29af377535ff0d` | Baseline plus continuity instructions; this audit's source |
| `feature/media-standards-research` | `87cf94d0746f4f3acc7ef3c8be849fe1f1f35b7e` | Its current remote tip differs from the documented baseline; not incorporated into this audit |

`AGENTS.md` records that the baseline was confirmed deployed on November 4 and
that GitHub's default branch remained `main`. GitHub default-branch selection
and Vercel production-branch selection are separate project settings, explaining
how a newer feature branch can serve production while `main` remains old.
The current default branch and live Vercel selection could not be independently
read: `api.github.com` was denied by the environment proxy, and no Vercel project
credentials/settings were available. Do not interpret the handoff as a fresh
verification of the live deployment or assume the current feature tip is deployed.

Recommended ongoing workflow: branch narrowly scoped tasks from
`codex/jeremiah-continuation`, target PRs back to that branch, run the relevant
checks and production build, and inspect responsive behavior. For future approved
feature work, verify the preview's deployment SHA/branch in Vercel before review.
Keep production promotion separate and owner-approved. Preserve the archive;
do not replace the continuation with `main`. No preview or production deployment
was requested or initiated as part of this audit.

## Feature inventory

| Area | Working evidence | Incomplete or unverified |
| --- | --- | --- |
| OG.1 flagship | `OG.1.LESSON.18` resolves to the authored player, not generated fallback; 19 instructional moves cover five approved standards. All six teaching sections, including the opener, rendered and advanced to an activity locally. | Browser run exercised teaching scenes by seeding each move, not every learner answer in one uninterrupted sitting. Detailed responsive checks covered the opener and final flow at 390px, teaching scenes at 1440px, not a full device matrix. |
| Lesson structure | Scripture-first opener, four witnesses, Shema phrases/echad, Isaiah reveals, OT-to-NT continuity, fair doctrinal comparison, devotion, final synthesis. Persistent chapter dots and next-chapter text work. | The detailed chapter overview component is not mounted by the flagship player; comments describing an automatic roadmap are stale. |
| Narration | Fixed server-generated Ash voice, replay/stop/off controls, authored-text restriction, local/memory cache, optional private Blob cache; autoplay failures have a user-facing replay message. | Four player scripts are rejected by the server. No API key or cached audio was available to verify audible voice quality, timing, generation, or durable caching. |
| Visual experience | Distinct local Moses, Isaiah, Jesus, and Paul WebP assignments, curated scene selection, contextual alternatives, progressive reveals, alt text and responsive layouts. Runtime visual search is deliberately disabled for learner imagery. | Some rights metadata is still `needs-review`; external manuscript/stock imagery and embedded video playback were not verified remotely. Several placements reuse art. |
| Assessment | Objective matching/reasoning is deterministic; ten standalone exit items, two per standard, explicit depth/skill metadata, review explanations, saved answers, optional retry. Weighted report separates score from evidence coverage. | Offline fallback is scored as partial; restart drops assessment history. Exit items measure only Levels 1–2, appropriately requiring written evidence for higher levels. Live semantic grading was not exercised. |
| Ask Jeremiah | Curriculum retrieval, explicit source traces, bounded question/history, contextual follow-ups, Apostolic persona, out-of-scope handling, clear missing-service error. Local out-of-scope and missing-key UI paths passed. | Live answer quality/model access unverified. Citation correctness is prompt-guided rather than deterministically verified. No application-level rate limit or upstream deadline found. |
| Pilot survey | Adult-pilot consent, direct `#pilot` / `#pilot-feedback` routes, optional three-step feedback, nine rating categories, draft restore, required overall rating, server-confirmed success, duplicate-safe storage, private reporting. | Vercel Blob was only tested with a mock SDK. Browser storage denial/quota handling is inconsistent. No actual durable-store connection verified. |
| Vercel | Six Node function adapters reuse local handlers, parsed-body support, SPA rewrite, 60-second function limit, private immutable Blob feedback design. | Actual project root, production branch, environment scopes, Blob attachment, deployment identity, and runtime routing were not accessible. |

Primary implementation: [lesson player](../app/src/features/classroom/OG1LessonPlayer.jsx),
[lesson contract](../app/src/core/classroom/content/OG_1_LESSON.js),
[scene navigation](../app/src/core/classroom/og1SceneFlow.js),
[teacher-led engine](../app/src/core/classroom/teacherLedEngine.js).
OG.1 preserves OT-to-NT continuity and identifies excerpts rather than inventing
replacement Bible text. The doctrinal comparison explicitly distinguishes the
classical Trinitarian claim from three gods. This audit is not a theological or
copyright certification.

## Prioritized findings

### High: four narration scripts cannot pass the server allowlist

`OG1LessonPlayer.jsx:194–201` requests new prose for identity, comparison,
mission, and return scenes. `server/narrationHandler.mjs:22–68` constructs its
allowlist from separately maintained authored lines, witness lines, and lesson
Scripture, excluding all four new prose lines. Direct handler probes returned
HTTP 400, `This audio is not in the authored Jeremiah lesson.`, for each:

- “Jesus Christ stands at the center of this question…”
- “Two explanations now come into view…”
- “The confession of one God is more than a statement to remember…”
- “We return to the words of Moses…”

The identity condition also requires `moment===0`, while `createMoments` places
identity after an initial reading, making that narration branch unreachable in
the current scene ordering. The other affected scenes will request rejected audio.
`test:narration` checks configuration and rejected inputs, not acceptance of every
player script. Recommended separate fix: a shared versioned narration manifest
and an acceptance test enumerating every reachable spoken scene without calling
the paid provider.

### High: assessment outage is reported as demonstrated partial understanding

`server/teacherCore.mjs:99–106` returns `verdict:'partial', source:'fallback'`
when meaning-based evaluation is unavailable. `og1LessonRating.js` maps partial
to 55 and treats it as developing written evidence without excluding fallback
sources. A direct reproduction with one fallback response to `shema-try` produced
55% written performance and Level 2 for that standard, despite no semantic
assessment occurring. It avoids awarding mastery, but still fabricates a
measurement of understanding during an outage.

The player separately handles failed API requests as `unscored`, excluded from
weighted scoring. Recommended separate fix: make all assessment-unavailable
paths consistently unscored, retain the learner's text, explain the limitation,
and test that outages cannot increase any score or level.

### High: “Start over” does not preserve all history promised by the UI

The confirmation in `OG1LessonPlayer.jsx` promises earlier answers and learning
history will be kept. `restartTeaching` in `teacherLedEngine.js` creates a fresh
review state and archives only current move, drafts, milestones, and standard
evidence. It omits `teacherHistory`, attempts, and the complete exit-exam object
(answers, results, attempts, best score). A seeded state with teacher history and
an exam restarted with zero history and no archived exam. This is a data-retention
defect, distinct from the pilot landing's explicitly destructive “Start fresh.”
Recommended fix: a versioned run archive that preserves all prior assessment
evidence, plus restart/restore tests; do not silently migrate or delete real work.

### Medium: the full chapter overview is absent from the flagship player

`OG1JourneyMap.jsx` defines useful chapter names, questions, summaries, and an
expandable location guide. The player imports only `OG1_JOURNEY_CHAPTERS`.
`createMoments` never creates `kind:'roadmap'`, and the roadmap render branch
returns `null`. The compact five-dot indicator works, but the requested clear
overview after the opener is not delivered. Integrate the overview deliberately
in a later UX task and test the rendered journey, rather than only source strings.

### Medium: public AI endpoints lack application-level abuse and timeout controls

`askJeremiahHandler.mjs` and `apiHandler.mjs` bound request bodies and methods,
but do not enforce authentication, spending quotas, or rate limits. Ask Jeremiah
can make two model requests for one question. Neither the Ask response fetch nor
the teacher response fetch specifies an upstream timeout or propagates browser
cancellation. Narration does have a 45-second timeout and a finite text allowlist,
but no shared cross-instance generation budget. Vercel's 60-second function cap
is not equivalent to controlling provider work or costs. External WAF controls
may exist but were not visible. Recommend bounded request deadlines, shared
rate/cost budgets appropriate to an invited pilot, and clear retry behavior.

### Medium: pilot reliability needs stronger storage and error-boundary coverage

The survey's local draft and server confirmation worked, including a simulated
503 followed by refresh. Local JSONL and private Blob implementations deduplicate
submission IDs; Blob writes use private access and disallow overwrite. Schema
validation excludes explicit identity/score fields and bounds free text. However:

- Several localStorage writes/removals are unguarded, including the draft effect
  and post-success receipt. Disabled storage or quota exhaustion can interrupt
  rendering or make a successful server save look failed. Learning state has
  similar unguarded reads/writes. Test and disclose storage failure rather than
  silently implying persistence.
- Survey throttling is process-local and uses `req.socket.remoteAddress`;
  effectiveness and participant separation behind Vercel's proxy are unverified.
- The local JSONL adapter reads the entire file for each deduplication check and
  serializes only within a single process. It is suitable for a small single-server
  pilot, not multi-instance durable storage.
- Feedback free text can still contain volunteered personal information despite
  the schema excluding names/email fields. Maintain private retention/access rules
  and a deletion process; do not describe it as guaranteed de-identified data.
- The Vercel report downloader skips entries without a stream and aborts on invalid
  JSON. Consider explicit record-level reconciliation so report counts cannot hide
  missing data. Real reporting was not run against private production responses.

Sources: [survey](../app/src/features/pilot/OG1PilotSurvey.jsx),
[schema](../app/src/data/og1PilotSurvey.js),
[storage](../app/server/pilotFeedbackHandler.mjs),
[Blob report](../app/scripts/report-vercel-pilot-feedback.mjs).

### Medium: bundle size and lint/CI gaps

The production build emits a 1,006.78 kB minified entry chunk (288.41 kB gzip)
and a >500 kB warning. The shell eagerly imports major routes; consider route-level
code splitting and lazy curriculum/media tooling before optimizing individual
components. This is a measured bundle warning, not a measured mobile latency claim.

Lint reports **12 errors and 6 warnings**, all pre-existing because source was
unchanged. Errors include unused variables, render-time ref updates in OG.1
dialogs, effect-triggered state updates, mixed exports in `OG1JourneyMap`, and
missing Node globals in the Vite config. Several stylesheets contain successive
overrides and legacy player components remain; later cleanup needs visual
regression coverage and should preserve legacy work.

The two GitHub workflows install with `npm ci`, run meaningful suites, and build,
but neither runs lint. Their push triggers name historical development branches;
PR triggers are path-filtered. A docs-only PR such as this one may run no checks.
`test:narration` and the live Bible-source smoke are not in those CI workflows.
Many UI tests inspect source strings rather than rendering components; they did
not catch the allowlist mismatch or missing roadmap. Add browser integration,
offline scoring, restart retention, and real handler-acceptance checks in future
implementation work. Do not disable current assertions to obtain a green result.

### Medium: visual provenance and accessibility require review beyond contracts

The curated catalogue marks some local witness and external photo assets
`rightsStatus:'needs-review'`. Tests verify editorial placement rather than legal
clearance or the historical accuracy of every depiction. Maintain asset-specific
source/license/provenance records. Some manuscript images hide their whole figure
on loading failure; contextual images can disappear without a visible placeholder.
Keep Scripture readable and provide purposeful non-image fallbacks.

Positive accessibility provisions include button labels, pressed states, focus
styles, progress semantics, reduced-motion CSS, stage focus, and inline Bible
Escape handling/focus restoration. The restart dialog lacks the explicit focus
management present in the Bible dialog. Narration preference is component-local,
defaults on, and does not persist after reload. Conduct keyboard, screen-reader,
contrast, zoom, and physical iOS/Android audio testing before a broader pilot;
automated source checks and a headless screenshot are insufficient evidence.

## Assessment interpretation

The exam is ten independently scored multiple-choice questions, with two per
standard and an 8/10 recognition threshold. `og1ExitExam.js` includes standard,
reference, assessed skill, and Level 1/2 depth metadata. Distractors are generally
parallel biblical/doctrinal statements, with no new branch or scoring changes made
here. A content expert should review fairness and difficulty with pilot responses;
passing tests cannot demonstrate psychometric validity.

The learning report is a separate measure: 50% written, 25% guided, 25% exam
when present, renormalized over available components and averaged by standard.
Level 3 requires strong independent writing; Level 4 also requires explicit rubric
evidence. The report appears before final synthesis and explains the awarded level,
coverage, component weights, and next steps. Retrying clears current exam answers
while preserving up to ten attempt summaries and best score; current reporting uses
the latest attempt. These are intentional distinctions, not a single pass/fail gate.
Offline fallback contamination described above must be corrected separately.

## Vercel and environment requirements

[`app/vercel.json`](../app/vercel.json) declares Vite, `npm run build`, `dist`,
six `.mjs` function entry points with a 60-second maximum, and a catch-all rewrite
to `/index.html`. It presupposes a Vercel project rooted at `app/`; that external
setting is not encoded in the repository. `npm start` serves built assets and the
same handlers locally; Vite development middleware also exposes them. `vite preview`
does not register these development APIs and should not be used as evidence that
the complete backend works.

Required production capabilities:

| Capability | Configuration / destination | Audit status |
| --- | --- | --- |
| Teacher + Ask | Server-only `OPENAI_API_KEY`, access to `api.openai.com`; fast/deep model overrides | Key absent locally; default `gpt-5.6-luna` / `gpt-5.6-sol` account availability not verified |
| Narration generation | Same server key, `gpt-4o-mini-tts`, Ash | No paid generation attempted; missing-service UI verified |
| Durable feedback/audio | Private Vercel Blob, usable `BLOB_READ_WRITE_TOKEN` or supported OIDC binding; `VERCEL=1` chooses Blob for feedback | Bindings absent locally; mock adapter tests pass, actual attachment/authorization unknown |
| Full Bible chapters | Server access to `ebible.org` | External smoke blocked here; parser tests pass, not live chapter availability |
| Visual research | `api.openverse.org`; curated learner scenes do not invoke discovery | No live discovery requested |
| External media | Wikimedia/stock asset hosts and YouTube embeds where selected | Not comprehensively fetched or played |

Do not expose the AI key through any `VITE_` variable. Private Blob feedback has
no public listing endpoint. The catch-all rewrite and all six API methods should
still be checked against an owner-approved Vercel preview: contract tests do not
emulate Vercel routing, bundling, read-only filesystems, duration limits, or secrets.
No security headers/CSP are declared in `vercel.json`; assess hosted headers and
embed requirements before choosing a policy. No production settings were changed.

## Validation results

All commands ran from `app/`. No package-defined `test:*` command was omitted.

| Check | Result |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` | Passed; 178 packages installed; lockfile unchanged |
| `test:brain`, `test:standards-driven` | Passed; graph/contracts, adaptive engine and deterministic scenarios |
| `test:narration`, `test:everyday-photos`, `test:biblical-visuals` | Passed; contracts only, not audible narration or remote asset integrity |
| `test:bible-source` | Failed: `fetch failed` before a live chapter could be validated; separate proxy request to eBible returned CONNECT 403 |
| `test:bible`, `test:dashboard`, `test:curriculum`, `test:teacher-led`, `test:grouped` | Passed |
| `test:media` | Passed: 24 Node subtests, zero failed/skipped |
| `test:crawler` | Passed: four Python tests; test-generated bytecode removed |
| `test:content-scan`, `test:visual-framework`, `test:visual-discovery` | Passed |
| `test:ask-jeremiah` | Passed with retrieval/mocked-provider coverage, not live AI answers |
| `test:og1-evidence`, `test:og1-climax`, `test:og1-exam`, `test:og1-theme`, `test:og1-journey`, `test:og1-inline-bible`, `test:og1-rating` | Passed |
| `test:pilot`, `test:vercel` | Passed; local persistence and mocked private Blob contract |
| `npm run lint` | Failed: 12 errors, six warnings |
| `npm run build` | Passed, with large-chunk warning |

Total: **25 of 26 test commands passed; one external integration command failed**.
These commands contain different numbers of assertions; “25” is not a count of
individual test cases. No checks were disabled, converted into trivial passing
checks, or described as live integrations when mocked.

The additional, unregistered `node scripts/test-visual-coverage.mjs` was also run
and **failed** at line 17: `OG.1 and the classroom should have broad, purpose-led
visual coverage`. It expects at least 19 distinct legacy photo references and
specific older render-source patterns. The current catalogue uses curated local
witness art, so this test is out of alignment with the present implementation;
its failure is not proof that 19 learner-visible images failed to load. Reconcile
the intended variety requirement with the curated-art direction in a future task,
then register an appropriate behavioral coverage check rather than ignoring or
loosening this assertion without review.

Additional built-app checks:

1. At 390×844, pilot consent and OG.1 entry worked; opener had no horizontal
   document overflow and no browser page exceptions. Missing narration produced
   the expected service error. Screenshot inspected locally.
2. At 1440×1000, the opening and all five chapter teaching sequences advanced
   through their reveals to the next task, using isolated seeded move states;
   no horizontal overflow or page exceptions observed. Embedded video playback
   and completing all matching/written tasks continuously were not verified.
3. With only the local completion state seeded, answered and submitted all ten
   exam items through the UI, reviewed the Level 1 report, final summary, and
   survey. The survey saved one synthetic response to temporary JSONL; the
   existing report command produced the expected one-record private CSV.
   Seeding isolates the end flow and does not demonstrate earned lesson mastery.
4. A mocked feedback HTTP 503 retained the unsent survey draft after refresh.
5. Ask Jeremiah returned a short out-of-scope answer to a sports question and
   a visible unavailable-service/retry message for an in-scope question without
   a configured key.
6. Direct probes reproduced all four narration HTTP 400s, restart history loss,
   and offline fallback scoring. No upstream paid APIs were called.

## Recommended next work, in order

1. Fix narration-manifest alignment, offline scoring, and restart preservation
   in separate, narrowly scoped changes with regression tests.
2. Verify actual Vercel production SHA/branch/root and secret/Blob scopes through
   authorized project access. Exercise APIs and durable survey/reporting on an
   explicitly approved preview, without mixing synthetic and real pilot records.
3. Restore the chapter overview, persist accessible audio preferences, and improve
   browser-storage failure handling; retain approved curriculum and survey schema.
4. Resolve lint and add integration/CI coverage for actual rendered end flows,
   narration scripts, retries, and restart migration.
5. Split the bundle, review image provenance and repeated artwork, and complete
   keyboard/screen-reader/mobile audio testing using pilot feedback as evidence.

This audit does not authorize any of those implementation changes or deployment.
