# OG.1 · Flagship learner experience

**Goal:** A Scripture-led, premium, mobile-first lesson covering all five approved OG.1 standards through experience rather than repeated reading slides.

## Teaching arc

1. **Opening:** Four distinct Scripture witnesses—Moses, Isaiah, Jesus, and Paul—appear sequentially with biblical art, references, direct quotations, concise interpretations, and replayable narrator audio.
2. **The Shema (OG.1.1):** Hear Deuteronomy 6:4; progress through all three Hebrew phrases; optionally watch the educational film; read Deuteronomy 6:4 and 6:5 together; understand echad in context through Genesis 2:24, Isaiah 44:6 and Mark 12:29. Answer guided and written questions.
3. **Isaiah (OG.1.2):** Reveal *before*, *beside*, and *after*, then read Isaiah 45:22 on salvation offered to all the earth.
4. **New Testament (OG.1.3):** Follow Moses, Jesus, and Paul; examine 1 Corinthians 8:4–6, 1 Timothy 2:5 and James 2:19 in context.
5. **Doctrinal distinction (OG.1.4):** Represent Trinitarian claims fairly and show the Apostolic Oneness reading and genuine incarnation, anchored to the Scriptures.
6. **Devotion (OG.1.5):** Return to Deuteronomy 6:4–5, then follow exclusive worship, wholehearted love, and faithful witness.
7. **Exit exam:** Attempt all ten questions; no correctness gate. Provide optional practice, evidence-based scoring, source review, and final synthesis.

## Nonnegotiable product rules

- Never hide required Bible teaching behind Go deeper, Open, or disclosure controls.
- Continue reveals the next part of a multiphase scene; Previous reverses one part at a time. The navigation model lives in src/core/classroom/og1SceneFlow.js.
- One named chapter and a compact five-dot Journey with Up next are sufficient orientation; avoid redundant text and panels.
- Scripture, authentic contextual art, and short teaching belong together. No generic photos where a specific figure or passage is required.
- The narrator uses one stable voice and a simple on/off and replay action. Do not display a distracting AI-voice disclaimer.
- All required questions must receive an answer, but an incorrect, incomplete-in-quality, or low-scoring answer never blocks progress.
- If teacher evaluation is unavailable, save the submitted answer as unscored; exclude it from a scored rating. Never fabricate mastery credit.
- Use the approved OG.1 standards and KJV passages. Preserve fair descriptions of other Christian interpretations.

## Pre-release quality gates

- Verify builds and OG.1 regression suites.
- Inspect the rendered app at 320, 360, 390, 768 pixels and desktop: no horizontal overflow, duplicated chapter headings, or clipped Scripture.
- Test with a real keyboard and screen reader, plus iOS/Android touch and text zoom.
- Verify passage navigation, narration autoplay restrictions/replay, pause/resume, start-over, and progress persistence.
- Test correct and incorrect responses at each question, all ten exit answers, optional retakes and a teacher-service outage.
- Confirm rights to media and production API, privacy, accessibility and offline/error handling before store release.

**Status:** This branch provides a coherent teaching-flow pass and automated checks; real-device testing and production release checks remain open.
