# Jeremiah.app — AI Classroom Prototype

This branch turns the existing Classroom into a standards-controlled adaptive learning environment.

## What changed

- `OG.1.1.18` is now a machine-readable instructional contract, not just lesson copy.
- The standard owns required knowledge, required Scripture, misconceptions, mastery evidence, and teacher guardrails.
- The learner moves through different instructional moves (observe, contrast, compare, scenario, guided rebuild, teach-back, mastery) instead of one repeating text-response form.
- Remediation is a real branch in the learning graph. A learner can take a different route and still satisfy the same required target.
- AI evaluates and teaches inside the standard; it does not own the curriculum or decide what the required truth is.
- Objective choice interactions are validated by the engine even if an AI response disagrees.
- Free-response teach-back/mastery can use OpenAI for semantic evaluation.
- Progress state is persisted locally per standard + session preset.

## AI architecture

Browser -> `/api/jeremiah/teach` -> server loads the hard-coded standard -> OpenAI Responses API -> structured teacher decision -> learning engine decides the legal next move.

The API key never goes to the browser.

Normal instructional reactions default to `gpt-5.6-luna`. Teach-back and mastery default to `gpt-5.6-sol`. Both can be changed with environment variables.

## Codespaces setup

1. Open the `app` folder.
2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Put your OpenAI API key in `.env`:

   ```bash
   OPENAI_API_KEY=your_key_here
   ```

4. Install the existing project dependencies:

   ```bash
   npm install
   ```

5. Validate the standard graph and learning engine:

   ```bash
   npm run test:brain
   ```

6. Start development:

   ```bash
   npm run dev
   ```

Vite's dev server hosts the Jeremiah API middleware at the same origin, so no separate backend command is needed during development.

## Production-style local run

```bash
npm run build
npm start
```

`server.mjs` serves both the built Vite app and `/api/jeremiah/teach` using Node's built-in HTTP server.

## Environment variables

```bash
OPENAI_API_KEY=
JEREMIAH_OPENAI_MODEL_FAST=gpt-5.6-luna
JEREMIAH_OPENAI_MODEL_DEEP=gpt-5.6-sol
PORT=4173
```

Do not use a `VITE_` prefix for `OPENAI_API_KEY`. Any `VITE_` variable can be exposed to browser code.

## Guardrail mode

If `OPENAI_API_KEY` is missing, Jeremiah still runs with a deterministic local evaluator so the Classroom can be tested without API spend. The feedback surface labels this as `Guardrail mode`.

This fallback is only a development safety net. The intended production experience uses the OpenAI teacher for semantic evaluation and adaptive instructional feedback.

## Brain tests

`npm run test:brain` checks:

- standard contract completeness
- unique instructional move IDs
- valid next-move graph references
- valid evidence IDs
- valid expected choice IDs
- every session preset can reach completion
- wrong-answer remediation branches correctly
- remediation can satisfy the original learning target
- free-response evaluation returns a meaningful verdict

## Design principle

> AI may adapt the instruction, but it may not adapt away the instruction.

The standard is the authority. The AI is the teacher. The learning engine is the referee.
