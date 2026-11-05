# Jeremiah AI — instructions for Codex

## Project identity and continuity
- Continue the EXISTING Jeremiah AI application. Do not scaffold a replacement, initialize a new project, or discard existing work.
- GitHub repository: `jlac3220/jeremiah-ai-rebuild`.
- The source baseline for this branch is commit `5a631e6d3161f6f2b2c379078e06ca8da826f4e2` (`feature/media-standards-research`), the version confirmed deployed to Vercel on November 4, 2026.
- `main` was 540 commits behind this baseline when this handoff was created; **do not treat `main` as the latest application** or overwrite the newer work with it.
- An untouched backup of the baseline lives at `archive/pre-codex-2026-11-04`. Preserve it.
- Work on `codex/jeremiah-continuation` or a new task branch based on it. Do not force-push or change production deployments, DNS, domains, or default branches without explicit approval.

## Technical map
- Application root: `app/` (React 19, Vite, JavaScript). Install/run/build from there.
- App shell: `app/src/app/`; lesson experiences: `app/src/features/classroom/`.
- Key OG.1 components include `OG1LessonPlayer.jsx`, `OG1ExitExam.jsx`, `OG1JourneyMap.jsx`, `OG1InlineBible.jsx`, and associated CSS.
- Ask Jeremiah lives at `app/src/features/ask-jeremiah/`.
- Pilot entry/survey: `app/src/features/pilot/OG1PilotLanding.jsx` and `OG1PilotSurvey.jsx`; survey schema: `app/src/data/og1PilotSurvey.js`.
- Existing tests and commands are defined in `app/package.json`, including `test:brain`, `test:ask-jeremiah`, `test:og1-exam`, `test:og1-rating`, `test:og1-journey`, `test:og1-inline-bible`, `test:pilot`, `test:vercel`, and `build`.
- Previous handoff/checkpoint documentation is under `handoffs/` and original app reference under `reference/`.

## Curriculum and theological guardrails
- Scripture is authoritative; the project teaches a specifically Apostolic / Oneness Pentecostal position, with KJV as the primary English translation.
- Teaching should follow Old Testament to New Testament continuity. Cornerstones include Deuteronomy 6:4 and Acts 2:38.
- Preserve the existing standards-based curriculum and identifiers (OG, NB, PS). Do not invent standards or replace approved content casually.
- Ask Jeremiah should speak like a confident, compassionate Apostolic teacher, not as a detached encyclopedia or a robot. Stay inside the approved teaching standards; questions outside scope (for example, creation when not in the standards) should receive a short, natural out-of-scope response rather than a fabricated lesson.
- Don't invent Bible quotations, references, or unsupported theological conclusions. Make assessments measure understanding fairly rather than leading the learner.

## Experience requirements
- Mobile-first, polished, visually rich, varied interaction; avoid repetitive slide templates and generic stock imagery.
- Biblical scenes should match the *specific* scripture or event. Distinct figures (Moses, Isaiah, Jesus, Paul) must look distinct. Ordinary-life visuals should feel modern and varied. Scripture-only moments can use clean Bible imagery.
- Keep coherent visual style; avoid redundant visuals, unnecessary manuscript distractions, and unsupported image/disclaimer text.
- OG.1 should offer a clear chapter overview after its opener, a persistent but quiet chapter/progress indicator, inline 'read in context' access, progressive reveals, meaningful narration, and a purposeful ending.
- Use a single narrator (previous preference: Ash), with short optional auto-narration on slide entry and an off control; avoid a distracting voice picker.
- OG.1's assessment target is 10 standalone, non-leading questions with standard/depth tags; weighted understanding score; Level 1–4 explanation before final summary.
- Preserve and test the existing end-of-lesson pilot survey, feedback submission path, and reports. Never silently discard survey responses or change the schema without a migration plan.

## Working practices
1. FIRST audit the existing app and deployment configuration. Confirm the most complete working lesson, the survey flow, environment dependencies, and whether the deployment displays the expected branch. Report factual findings before changing infrastructure.
2. For each improvement, make a narrowly scoped change on a task branch, run relevant tests and `npm run build`, inspect the responsive UI, and provide a preview and brief changelog.
3. Preserve content and functionality unless the owner explicitly directs a change. No deleting legacy work merely for cleanup.
4. If tests fail, distinguish pre-existing issues from new regressions. Do not claim a feature works without checking.
5. Get owner approval before merging to production or changing the Vercel production branch, DNS, or domain `jeremiah.app`.
6. User works in a browser and cannot install local developer tooling. Provide browser-accessible previews and review steps.

## Immediate next task
Conduct a non-destructive technical audit. Explain why the GitHub default `main` branch and Vercel production branch differ; establish the correct ongoing development/preview workflow from this branch, and verify that OG.1, the narrator, assessment, and end-of-lesson feedback are intact. Do not rebuild from scratch.

## Instructional blueprint approval gate (proposed)
- **Every standard must have an owner-approved blueprint before a new lesson is implemented or its instructional content is materially revised.** See `docs/lesson-blueprints/README.md` and `docs/lesson-blueprints/TEMPLATE.md`.
- Blueprint status **DRAFT** does not authorize implementation. The project owner must approve the exact revision before lesson development begins.
- Preserve the authoritative standard wording in `app/src/data/curriculum/`. A blueprint specifies *how to teach and assess* the approved standard; it does not silently rewrite the standard.
- For combined lessons (e.g., OG.1), create a separate blueprint for **each** contained standard and a composition map for the overall sequence and shared domain assessment.
- ChatGPT and the owner lead learning goals, scriptural reasoning, instructional progression, valid questions, level-of-understanding evidence, and correction paths; Codex leads accessible implementation, tests, and preview. Raise instructional ambiguities instead of independently inventing answers.
- DOK and standard-defined evidence of learning are distinct; do not inflate mastery ratings based on simple multiple-choice recognition.
- This blueprint rule is awaiting owner review in the curriculum PR; do not change running app functionality as part of the documentation proposal.
