# Checkpoint 24 — Standards Brain + Alive AI Classroom

## Why this checkpoint exists

The earlier Classroom had useful infrastructure but the pedagogy was structurally biased toward one loop: prompt -> text response -> lexical evaluation -> stage advancement. This checkpoint preserves the session architecture while changing the learning model underneath it.

## What changed

### 1. The standard is now the instructional authority
`OG.1.1.18` now defines:
- essential question
- mastery target
- required knowledge
- required Scripture
- known misconceptions
- evidence of understanding
- teacher guardrails
- instructional moves and legal transitions

The AI cannot remove or rewrite these requirements.

### 2. Stages are milestones, not the pedagogy
Focus / Truth / Scripture / Checkpoint / Mastery remain useful status milestones, but the learner now moves through smaller instructional experiences inside them.

Current move types include:
- launch
- Scripture observation
- choice
- contrast
- passage comparison
- guided fill/rebuild
- scenario / pressure test
- free-response teach-back
- mastery response
- completion

### 3. Remediation changes the experience
A weak response can route the learner into a different instructional move rather than only changing feedback text.

A successful remediation route can satisfy the original learning target so adaptation does not penalize progress.

### 4. AI is live but bounded
The server endpoint `/api/jeremiah/teach`:
- loads the hard-coded standard server-side
- sends only the current standard/move context to OpenAI
- requests strict structured output
- validates the result
- prevents AI from marking an objectively wrong choice as correct
- allows AI strategy to select only from standard-authorized remediation routes

Default model routing:
- normal instructional reactions: `gpt-5.6-luna`
- teach-back and mastery: `gpt-5.6-sol`

Both are environment-configurable.

### 5. No browser API key
`OPENAI_API_KEY` remains server-side. Vite middleware handles the endpoint in development; `server.mjs` handles the same endpoint in production-style runs.

### 6. Guardrail mode
Without an API key the Classroom still runs with a deterministic local evaluator. This exists for development/testing, not as the intended final AI experience.

### 7. Existing session behaviors preserved
- Direct / Resume / Review / Adaptation presets remain data-driven.
- Presets still expose verses and truth explanation for Bible Support.
- New move state syncs back to the existing live-stage storage.
- Reset remains conditional and returns the active preset to its entry point.
- A visible reset confirmation is retained.

### 8. Classroom redesign
The visible Classroom is now mobile-first and immersive:
- warm Pentecostal visual language using ember/fire + water/light accents
- Scripture-forward teaching surfaces
- animated Jeremiah presence
- contextual learning map
- changing interaction types
- adaptive feedback surface
- main app bottom navigation hidden during the active Classroom session

## Validation added

`npm run test:brain` validates:
- standard contract completeness
- move graph integrity
- preset reachability to completion
- evidence and choice IDs
- remediation behavior
- alternate-route satisfaction of original learning targets
- free-response fallback behavior

## Next recommended checkpoint

Run the Classroom in Codespaces with a real `OPENAI_API_KEY`, stress-test the AI teacher with correct, wrong, partial, vague, off-topic, and adversarial learner responses, and tune the standard contract before adding more standards.
