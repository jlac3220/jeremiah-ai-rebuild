# OG.1 premium UX/UI design audit

**Date:** November 4, 2026 (America/Chicago)

**Application reviewed:** `feature/og1-shema-blueprint-pass1` at `8f759f99eb6eed29ba2f9231d40cbefea5948f7f`

**Audit branch:** `codex/og1-premium-design-audit`

**Status:** Recommendations for review only. No redesign implemented.

**Tracking:** [GitHub issue #41](https://github.com/jlac3220/jeremiah-ai-rebuild/issues/41).
This report addresses its audit-only assignment. The feature branch was rechecked
against GitHub for that issue and still points to the revision above.

## Executive assessment

Jeremiah already has the ingredients of an exceptional Bible-learning product:
scene-specific biblical art, a recognizable navy/blue visual family, readable
Scripture typography, purposeful Hebrew, an unfolding witness narrative, and
genuine reasoning/recall activities. The Moses encounter and desktop phrase
investigation are strong enough to refine rather than replace.

The experience is **not yet consistently premium**. It alternates between an
immersive scene, a stack of instructional cards, and a long course-style form.
Accumulated chrome, repeated introductions, inconsistent component styling,
and distant actions make the learner repeatedly navigate the interface instead
of remaining inside the investigation. The greatest gains will come from
hierarchy, continuity, dependable media states, and mobile ergonomics—not more
decoration, more slides, or a new application shell.

**First priorities:** repair the final-summary contrast; make chapter status
truthful; subordinate restart/audio controls; keep progress actions discoverable;
resolve visual fallback/media states. Then refine the existing Shema experience
as the reference implementation before extending changes across OG.1.

## Evidence and limits

I read the root [`AGENTS.md`](../AGENTS.md) before reviewing the application.
The requested feature branch was checked out on a new task branch, preserving
the earlier technical-audit branch. This report and its screenshot evidence are
the only changes. No standards, questions, instructional prose, Lesson Blueprints,
application functionality, production settings, or deployment were changed.

### Instructional sources reviewed

The following documents were read from **`curriculum/lesson-blueprint-framework`
at `bf8c6391c24fcc35953ca9e3cc82fbaee2d704cb`**, without merging that branch:

- `docs/lesson-blueprints/README.md` and `TEMPLATE.md`;
- all five standard blueprints, `OG.1.1.18.md` through `OG.1.5.18.md`;
- `OG.1.MASTER-LESSON.md` and `OG.1.ALIGNMENT-REVIEW.md`;
- `app/docs/JEREMIAH_LESSON_BLUEPRINT.md`.

[Browse the exact Blueprint source revision](https://github.com/jlac3220/jeremiah-ai-rebuild/tree/bf8c6391c24fcc35953ca9e3cc82fbaee2d704cb/docs/lesson-blueprints).
The standard blueprints/master map remain **DRAFT** in that revision. They inform
this assessment; they are not authorization to implement new instruction. The
authoring guide also calls for neutral reading surfaces and one blue action color.
Recommendations below distinguish presentation work from instructional decisions.

The design north star is their connected movement: hear the confession → assemble
the prophetic witness → trace Jesus and the apostles → distinguish interpretations
fairly → respond in devotion. Each chapter needs a distinct intellectual task,
not the same seven-screen template with different artwork. Viewed, completed,
supported, independently demonstrated, and unassessed work must remain distinct.

### Actual visual inspection

Built the feature branch and ran its existing Node server locally, without a
deployment. Used installed Chromium through Playwright and **opened the captured
screenshots for visual inspection**, rather than inferring appearance from JSX.
The main review used **390×844**; additional checks used **320×740**, **768×1024**,
and **1440×1000**. These are browser viewport simulations, not physical devices.

Captured 34 primary states and three follow-up captures: pilot landing; opener;
four-witness progression; all Shema teaching modes; guided practice; context
reasoning; new recitation and feedback; independent explanation; Isaiah; NT
continuity; interpretation investigation/comparison; devotion; ten-item exam,
results, understanding report, synthesis and survey; Home and Ask Jeremiah.
Reviewed the comparison again after its animation settled to avoid confusing a
fading frame with its final contrast. Thirteen unmodified captures are committed
under [`design-audit-evidence/`](design-audit-evidence/).

Later chapters and end states were reached using isolated browser learning-state
fixtures, not by earning mastery. All ten exam items were answered through the UI
to inspect results. No real learner information or survey response was used or
submitted. Zero JavaScript page exceptions and no horizontal document overflow
were observed in the 34 primary captures. This is not a comprehensive WCAG audit.

**Important preview limitations:** no server AI key was present, so audible
narration quality, timing, and live grading were not reviewed. The video embed
rendered a broken-frame state, and the full-context Bible request returned
`fetch failed` in this restricted environment. Those observations establish the
local failure experience, not that the production services are broken. No Vercel
preview URL, live production screen, screen reader, physical mobile keyboard,
or physical iOS/Android audio behavior was inspected.

The issue's supplied Vercel preview was attempted with a read-only HTTPS request;
the environment proxy denied the connection (CONNECT 403), so the running local
build remained the visual-review source. Browser: **Chromium 155.0.8059.79**,
headless, device scale factor 1, installed Playwright, local production Node
server, Node 24.22.1 / npm 11.9.0. Light reading and dark narrative surfaces were
both inspected; these are not claims about a user-selectable dark-mode theme.

## What is already excellent—and should survive

| Existing strength | Visually observed evidence | Preserve and refine |
| --- | --- | --- |
| Contextual biblical art | Moses addresses a gathered Israelite audience; Jesus and Paul are visually distinct in the witness/continuity sequence. | Keep specific people, actions, settings, and passage associations. Do not replace them with generic portraits or unrelated stock imagery. |
| Cinematic opening potential | The Shema encounter pairs a wide historic scene, strong title, KJV quotation and optional voice/context controls. Desktop composition has presence. | Preserve the art and typographic premise; adjust mobile crop, chrome and reading contrast before adding effects. |
| Hebrew as purposeful emphasis | The phrase investigation makes Hebrew, transliteration and interpretation distinct; `echad` receives contextual support. | Retain script hierarchy and RTL/language markup; do not turn Hebrew into background wallpaper or a vocabulary game. |
| Scripture pairings | Deuteronomy 6:4–5 is presented as confession followed by response. | Preserve the actual texts, contextual reading and conceptual relationship. Refine layout rather than rewriting the explanation. |
| Distinct cognitive activities | Phrase meaning, conclusion-plus-reason selection, memory recall, independent writing, passage investigation and the exam all exist. | Make their interaction behavior more legible; do not replace them with uniform quiz cards or add novelty unrelated to the task. |
| New Shema recitation | The uncluttered recall step separates memory evidence from the later explanation; its prompt does not display the answer. | Keep this improvement. Any study aid must remain outside independent recall and must not contaminate its evidence. |
| Fair interpretation comparison | The settled comparison gives both positions readable, equally sized cards and explicitly identifies shared monotheism. | Keep visual parity; avoid color or animation implying that one card is the correct quiz option before the learner reasons. |
| Existing usability foundations | Large main buttons, visible focus styling, phase labels, autosaved answers, a reversible reveal sequence, reduced-motion styling, optional feedback. | Extend and unify these foundations. Preserve exam/history/survey behavior and existing fixes. |

Representative strong compositions:

- [Shema encounter, mobile](design-audit-evidence/06-shema-encounter-mobile.png)
- [Phrase investigation, desktop](design-audit-evidence/31-phrases-desktop.png)
- [Settled comparison, mobile](design-audit-evidence/37-comparison-settled-mobile.png)
- [New recitation step, mobile](design-audit-evidence/13-shema-recite-mobile.png)

## Prioritized findings and recommendations

Priority reflects learner impact, not a request to implement immediately. Effort
is relative: **S** one bounded component/state; **M** several related components;
**L** interaction/progression work requiring instructional review and regression
coverage. All work still needs owner review; no time estimates are implied.

| ID | Priority / effort | Specific finding | Recommended change | Acceptance evidence |
| --- | --- | --- | --- | --- |
| D01 | P0 / S | Final-summary prose is difficult to read on its navy gradient. | Give dark narrative surfaces explicit foreground tokens; remove the broad finish-paragraph color collision. | Normal text ≥4.5:1 across the entire gradient; large text ≥3:1; inspect actual mobile/desktop rendering. |
| D02 | P1 / S–M | `context-challenge` says “The opening” and “Up next: Chapter 1” even though it is a Chapter 1 reasoning task. Exam entry already says “Journey complete.” | Derive location from explicit chapter/phase metadata, not move-name prefixes alone. Show teaching covered, assessment in progress, and finished states separately. | Traverse every authored move and exam/report/survey state; title and next destination remain truthful. |
| D03 | P1 / M | The mobile header promotes “Start over” as a gold primary-looking action; brand, return, audio and chapter chrome precede every scene. | Make one quiet top bar; put restart behind a secondary lesson menu and retain its confirmation/history. Keep audio compact and accessible; use a restrained current-chapter control. | One clear primary action per state, a usable 44×44 return target, and noticeably more first-viewport space for Scripture. |
| D04 | P1 / M | Main actions are below long card stacks; the results-to-report action is thousands of pixels down. | Add a discoverable, safe-area-aware action rail where needed; surface the next learning destination before the optional detailed review. Keep all review material accessible. | At 390px the learner can find the next action without reading all ten review cards; focused inputs and the mobile keyboard are not obscured. |
| D05 | P1 / M | Audio failure remains visible after narration is turned off, sometimes with a second replay control. | Consolidate audio into one control/status component. Offer compact, recoverable error UI and a remembered preference. Separate optional manual playback from automatic narration clearly. | Off produces a calm no-audio experience; no duplicate replay paths; text is complete; error/off/loading/replay are keyboard accessible and announced. |
| D06 | P1 / M | Isaiah’s evidence art falls back to a blurred label “Isaiah 44:6” while the active quoted evidence is Isaiah 43:10. The video shows a browser broken-frame icon. | Bind visual fallback/reference to the active passage; provide a deliberate text-first fallback. Give optional video an authored poster, attribution, clear optionality and usable failure/continue state. | All before/beside/after states have matching references; blocked media cannot create a misleading source label or obstruct progress. |
| D07 | P1 / M | Independent explanation, interpretation and closure are very long on mobile; the learner must scroll through repeated framing before acting. | Recompose existing text into a task-first workspace with optional support and visible saved status. Make the ending progressive rather than one giant report stack. | Same words/questions/rubrics remain available; input and required task are easy to locate; no duplicate answer request or new evidence burden. |
| D08 | P1 / S–M | Emoji playback icons and missing-glyph squares appear beside Bible links, suggested questions and Home actions in this Chromium environment. | Use one controlled SVG icon set with consistent optical size, accessible labels and text alternatives. Verify actual font fallback. | No tofu or OS-colored playback emoji across supported browsers; 20/24px icon grid, consistent stroke and hit areas. |
| D09 | P2 / M | The strongest scene is reused in the opener, witness tour, Shema encounter and NT trail; many beats remain “reveal → next” in a rounded card. | Assign each reuse a different visual purpose; keep a scene when the cognitive focus changes instead of resetting it. Present existing evidence through the task it supports. | A storyboard identifies what the learner newly notices or does at each beat. No screen exists solely to restate the preceding screen. |
| D10 | P2 / M | A quiet chapter indicator exists, but the complete chapter overview is not presented after the opener. | Offer a lightweight expandable five-chapter contents view; preserve current place and allow safe review without claiming mastery. | Learners can name the current chapter, next task and route back; contents never becomes a mandatory extra hub. |
| D11 | P2 / M | Home, Ask, pilot and lesson use different logos, button colors, surface treatments and heading styles. | Apply a shared identity and semantic tokens gradually, beginning with the lesson chrome and common actions. | Screens look like the same product while supporting different modes; no flattening of scene art or loss of route functionality. |
| D12 | P2 / M | Motion is mostly short fade/translate entrances, often paired with scroll-to-top; it does not yet convey narrative continuity. | Animate a retained scene or evidence connection when meaning changes; use bounded, interruptible transitions and stable controls. | No motion gates progress; reduced motion shows the same information instantly; focus and reading position remain predictable. |

### D01: a concrete accessibility defect, not a taste preference

[The final-summary screenshot](design-audit-evidence/26-summary-mobile.png) shows
dark slate prose on a dark blue panel. Browser-computed foreground is
`rgb(82,100,122)` (`#52647A`), on a gradient from `#172B49` to `#323F77`.
Relative-luminance contrast against those endpoints is approximately **2.34:1
and 1.64:1**. The paragraph is 19.04px normal-weight text and fails even the 3:1
large-text threshold. The broad `.ogp-finish p` rule competes with the intended
`.og1-synthesis-head p` styling. Fix the component boundary and token usage rather
than layering another unrelated theme override. This is the highest-impact
small correction to the purposeful ending.

### D02–D04: wayfinding and ergonomics before cosmetic polish

[The context-reasoning capture](design-audit-evidence/12-context-reasoning-mobile.png)
visibly labels a Shema task as the opening. The current chapter calculation in
`OG1LessonPlayer.jsx` uses the first segment of the move ID, which cannot classify
`context-challenge` or `prayer-challenge` correctly. A real progress model should
not depend on a naming convention the authored moves do not consistently follow.

At 390px the return button measured **21.1×44px**; restart and audio were about
108×44 and 116×44. Expand the return hit area rather than shrinking all controls.
The two-row header is about 112px tall before chapter context. In the failed-audio
state, the banner adds roughly another 110px. “Start over” should never be the
brightest action above a lesson the learner is trying to continue.

The [ten-item results page](design-audit-evidence/24-exam-results-mobile.png) is
approximately **5,199px** high at 390px. The next-report action sits after all
ten explanations; the DOM probe placed it more than 4,000px below the viewport's
top at that moment. Keep answer review, but put a clear next destination near the
score and make detailed review expandable or independently navigable. Do not
require the learner to consume every explanation merely to reach the report.

### D05–D06: dependable quiet states are part of premium design

The visible narration banner is an environment-induced error, not proof of a
production outage. Its **persistence after Off** is an observed UX issue. A useful
recovery prompt becomes noise when repeated on every scene. Keep one accessible
audio state with readable text, replay on demand, and a preference that survives
a return visit. Do not introduce a voice selector or background music requirement.

[Isaiah's fallback](design-audit-evidence/17-isaiah-evidence-mobile.png) was not a
historical image loading successfully: the DOM contained no image in that active
art region. Source inspection confirms the artifact placement is fixed at Isaiah
44:6 while the before/after quotations use 43:10. Prefer no illustration over a
misleading label. A designed fallback can retain the active verse and evidence
relationship without pretending to depict a manuscript or fabricate archaeology.

The inline Bible failure state had a clear close button and preserved the lesson;
focus entered the dialog and Escape closed it in the browser probe. Preserve that
behavior. The raw `fetch failed` message and native-looking retry button need a
branded, learner-readable recovery treatment. A reading-first experience is not
dependable until full-context Scripture can load under the intended deployment
conditions; do not substitute invented passage text.

## Scene and engagement assessment

| Moment | Current experiential quality | Smallest useful design direction |
| --- | --- | --- |
| Pilot entry | Editorial heading and clear consent/privacy are good; the start action comes after a long introductory sequence. | Bring consent/start closer to the invitation, retain all disclosure and voluntary feedback, and move secondary explanation below. |
| Opening / witness tour | Strong Scripture-centered promise and distinct witnesses. Multiple successive Moses/Shema presentations risk feeling like repeated introductions. | Treat the opener and witness tour as one retained visual sequence, with different focus/crop and a single optional contents reveal. Any beat removal requires instructional review. |
| Shema encounter | The strongest cinematic opportunity. On mobile the illustration is heavily overlaid and the subject is less legible than on desktop. | Art-direct a portrait crop with a safe text zone. Let Scripture retain priority; avoid large title copy competing with the quoted text. |
| Phrase investigation | Good Hebrew/meaning split and sequence awareness. The mobile track has tiny labels, and all three phrases advance by another Next tap. | Keep the same material in a stable, accessible phrase inspector with clear current/previous states. No decorative game layer. |
| Optional film | A purposeful change of medium, but a 9:45 embed interrupts the short-beat rhythm; playback was blocked locally. | Clearly communicate optional length before loading. Provide a verified poster/context and preserve an equally complete no-video path. Do not cut/rehost copyrighted video or rewrite its scope. |
| Verse 4→5 / echad | Thoughtful Scripture pairing and contextual lenses. Several nested cards compete with the main idea. | One passage relationship at a time; progressive context on demand. Preserve every current quotation and explanatory claim. |
| Guided connection | Large choices and an understandable phrase task. It resembles repeated MC cards more than reconstructing a confession. | Improve selection/feedback affordances and reveal the assembled connection after the existing task; keep objective correctness and keyboard equivalent. |
| Context reasoning | A valuable conclusion-plus-reason task, but dense instructions and incorrect location undermine confidence. | Correct wayfinding; use clearer spacing between the unchanged claim and reason groups. Do not simplify or rewrite questions during design cleanup. |
| Recitation | Clean, purposeful break from guided practice; already improved in this branch. | Keep the independent blank response and separate KJV feedback. Improve action placement and keyboard ergonomics; never expose the answer as a visual flourish. |
| Independent explanation | Strong evidence trail, autosave reassurance and optional support. At 390px the full page is about 1,748px. | Present the unchanged task and response as the primary workspace; make support intentionally available rather than another mandatory scroll barrier. |
| Isaiah | Before/beside/after provides a real evidence structure. The current artifact fallback weakens credibility. | Bind the exact passage to the active evidence; later consider cumulative evidence layering with a static accessible equivalent. |
| NT continuity | Distinct Moses/Jesus/Paul thumbnails and an explicit throughline work well. Some art is too dark to contribute beyond texture. | Use the scene change to show the witness relationship; retain full-context access and readable passage anchors. |
| Interpretation | Shared premise and fair parallel cards are strong. The prior 2,005px investigation and subsequent summary repeat several framing layers. | Keep the unchanged passages and definitions in a comparison workspace; make the relevant text context available without repeated introductory framing. |
| Devotion | Returning to 6:4–5 gives the lesson purpose beyond a debate. The observed application scene is predominantly text/panel graphics. | A later approved transfer design could use credible modern care/worship/community imagery. Do not add scenarios, personal disclosures or judgments about sincerity without instructional approval. |
| Exam → report → synthesis | Evidence/recognition distinctions are valuable; the flow feels like several separate endings, with dense review between destinations. | Give each state one job: concise result and next step; expandable evidence report; readable closing; then optional survey. Preserve all records, scoring and review. |
| Home / Ask | Home has a clear learning invitation; Ask's quiet conversational canvas is suitably different from the cinematic lesson. | Share wordmark, action color, icons and type roles. Do not force chat to look like a biblical scene or keep Home's multicolored tile palette as the default lesson language. |

## Gap matrix against the five Blueprint learning tasks

This compares the inspected UI with the draft direction, not with newly approved
teaching requirements. It does not change instruction or scoring.

| Standard / Blueprint task | Existing UI and strength | Experiential gap | Minimal design recommendation / boundary |
| --- | --- | --- | --- |
| OG.1.1.18 · Explain the confession | Specific Moses encounter, phrase/Hebrew inspector, contextual reasoning, separate KJV recall, teach-back workspace | Repeated opening/Shema framing; reasoning task mislocated; support competes with input | Correct location and hierarchy; retain independent recall and all questions. Reordering teaching beats needs instructional approval. |
| OG.1.2.18 · Construct the evidence | Before/beside/after sequence and guided matching | Fixed manuscript fallback conflicts with active reference; statements feel sequential rather than cumulative | Bind fallback to the active passage and make existing evidence relationships visible. Additional draft memory tasks are not authorized by this audit. |
| OG.1.3.18 · Trace the argument | Moses→Jesus→Paul thumbnails, quotation and context links | Repeated art and next/reveal rhythm; context is dispersed | Retain a stable passage trail and intentional scene focus. Do not add/remove epistles or alter the transfer prompt. |
| OG.1.4.18 · Represent and evaluate fairly | Shared monotheistic premise, equal comparison cards, actual passage questions | Investigation, comparison and summary repeat framing; prayer-challenge naming also lacks chapter metadata | Preserve parity and context in an organized comparison workspace. New claims, rewritten questions or altered progression require approval. |
| OG.1.5.18 · Apply with integrity | Return to 6:4–5 and devotion consequences gives the lesson purpose | Primarily text/graphic panels; ending repeats earlier relationships and has weak contrast | Repair contrast and compose the ending deliberately. Modern scenarios require instructional approval; never add moral cases or grade sincerity as design cleanup. |

## Proposed design system — for review, not implementation

**Direction:** a contemporary Scripture reader with cinematic chapter encounters.
Use immersion at meaningful narrative transitions, calm editorial surfaces for
reading, and focused workspaces for reasoning. “Premium” should mean precise,
coherent, responsive and trustworthy—not constant motion, expensive-looking
ornaments, or every paragraph inside a shadowed card.

### 1. Semantic palette and surfaces

| Role | Proposed starting token | Usage |
| --- | --- | --- |
| Reading canvas | `#F4F7FC` | Existing cool neutral; use white for the main reading/work surface. |
| Surface | `#FFFFFF` | Forms, passage context, ordinary instruction. |
| Ink | `#172033` | Primary reading and navigation text. |
| Secondary ink | `#52647A` | Supporting copy on light surfaces only, after contrast testing. |
| Primary action | `#1463E8`; hover/pressed `#0C54C8` | One blue family for continue, submit, selected controls. Reconcile existing violet/indigo overrides gradually. |
| Narrative stage | `#14283F` | Chapter encounters, explicitly paired with light foreground tokens. |
| On-stage text | `#F7FAFF`; secondary `#DFE5FA` | Dark-panel Scripture and explanatory text, tested against image/gradient extremes. |
| Border | `#DCE4EF` | Grouping and input boundaries; do not rely on faint borders alone for interactive state. |
| Focus | `#1463E8` with contrasting offset/halo | Persistent keyboard focus visible on dark and light scenes. |
| Editorial gold | `#D8B878` | Sparse detail inside biblical imagery; never a competing primary action or correctness signal. |
| Feedback | Semantic success/caution/error roles, with icon and text | Bounded feedback only, not whole chapter color themes. Final values require contrast validation. |

These are proposed roles, not verified universal accessible combinations. Test
every foreground/background pair and image overlay. Keep neutral reading cards
and one action blue as the authoring guide directs; narrative art may vary in
lighting without becoming a separate tan/green/purple UI theme per chapter.

### 2. Type and spacing

- **UI and explanation:** one reliable system sans stack or explicitly licensed,
  self-hosted Inter. Current CSS names Inter, but this runtime exposed no loaded
  `FontFace` entries; a declared family is not proof that its font file is present.
  Verify real font fallback before tuning line breaks.
- **Scripture:** retain a restrained serif such as the existing Georgia stack.
  Reserve it principally for quotations and a small number of editorial moments;
  avoid arbitrary alternation between sans and serif for equivalent headings.
- **Hebrew:** a verified Hebrew-capable fallback or approved self-hosted font,
  with `lang="he"`, RTL, natural diacritics and no artificial tracking.
- **Scale:** 16–18px body, 1.55–1.75 line height; 18–24px passage text; mobile
  scene titles generally 28–36px, fluid upward on desktop; labels generally
  12–14px. Do not use 9–10px uppercase metadata for essential navigation.
- **Measure:** around 60–70 characters for prose; focused question/workspace
  max-width about 720–800px, cinematic stage up to about 1120px. Larger display
  type should not make the title overpower the Scripture.
- **Rhythm:** a 4px spacing basis; common steps 8/12/16/24/32/48. Mobile gutters
  16–20px; comfortable card padding 20–24px; reserve 40–48px gaps for real scene
  boundaries. Remove redundant separator + empty gap + card shadow combinations.
- **Shape/depth:** one 12px control radius and 16–20px container family. One subtle
  elevation for a floating surface; avoid stacking three different shadows to
  imply importance. Preserve useful density differences between reading and art.

### 3. Shared components and content hierarchy

1. **LessonBar:** back with a full hit area, compact chapter/contents control,
   audio state, secondary menu. Restart stays available with confirmation and
   preserved history, but is visually subordinate.
2. **SceneStage:** art, protected readable text zone, reference and optional
   context/voice actions. No mandatory splash transition before every activity.
3. **ScriptureBlock:** unchanged KJV, accurate reference, explicitly labeled
   excerpt where applicable, read-in-context control, accessible text-only state.
4. **EvidenceWorkspace:** phrase inspector / evidence trail / interpretation
   comparison using common selection, disclosure and feedback affordances.
   Distinct tasks may use distinct layouts; they should not have unrelated UI rules.
5. **ResponseWorkspace:** unchanged prompt, response, autosave, optional support,
   evidence provenance and recoverable assessment state. Recall gets no hints
   that reveal the target passage during the independent attempt.
6. **ActionRail:** previous/next or submit, safe-area-aware, never covering text,
   focused fields or system keyboard. Use sticky behavior selectively rather
   than forcing every scene into one viewport or hiding reading material.
7. **EvidenceReport:** concise result, truthful coverage/status, expandable
   standard details and review; independent evidence is not a completion badge.
8. **MediaState:** poster, attribution, loading, optionality, retry and text-first
   continuation. Use consistent iconography, not platform emoji.

Consolidate design tokens and component styles incrementally. The current long
player stylesheet, theme layer and component-specific overrides make a visually
small change affect distant states—the summary contrast collision demonstrates
why this matters. Do not delete legacy components or rewrite the styling system
as an audit follow-up without a bounded plan and visual regression evidence.

### 4. Motion and cinematic presentation

**Observed:** current scenes mostly use ~0.35–0.48s fade/vertical-arrival effects.
The settled comparison is readable; intermediate faded frames were not treated
as a permanent contrast defect. A browser reduced-motion probe returned
`animation-name:none` and `0s` on the phrase feature, a useful existing safeguard.

**Proposed motion grammar:**

| Event | Proposed treatment | Constraint |
| --- | --- | --- |
| Select a phrase/answer | 120–180ms state transition | Immediate feedback; no wait to use next action. |
| Reveal evidence | 180–260ms opacity/short translation | Newly available text is announced; retain earlier evidence and context. |
| Change biblical witness/chapter | 300–450ms restrained crossfade or art crop transition | User-triggered, interruptible, no scroll hijack; reference updates with the scene. |
| Follow a Scripture connection | Retained passage anchors with a subtle connecting line/focus shift | The relationship also exists as text and a static sequence. |
| Enter reading/recall | Still, readable surface; no ambient animation | No moving text or soundtrack; no answer exposed during recall. |
| Reduced motion | Immediate state change | Same content, progress and focus order; no animation-dependent meaning. |

Optional slow art movement can be prototyped only if it does not crop faces,
reduce contrast, consume battery unnecessarily, or compete with Scripture.
Avoid mandatory camera moves, autoplay video, theatrical invented biblical
dialogue, reward confetti, and stock “cinematic” effects on every card. The
most valuable cinematic improvement is a coherent sequence with intentional
silence, continuity and composition.

### 5. Art direction and narration

Create a scene ledger before commissioning replacement media: active passage,
person/action/place/era, conceptual purpose, existing asset, crop for phone and
desktop, source/license/provenance, alt text, and fallback. Keep Moses, Isaiah,
Jesus and Paul distinct; maintain Jesus' continuity across Gospel scenes. Use
the requested event—not a generic crucifixion for every passage about Jesus.
Do not imply depictions are historical photographs, images prove doctrine, or a
decorative manuscript contains the exact quoted verse without verification.

Retain one narrator and the shared authored-script manifest already present in
this branch; the earlier allowlist mismatch is **not** assumed to remain. Prefer
brief optional introductions and on-demand KJV reading. Show all narrated meaning
in readable text, avoid simultaneous competing audio from the film, and make
loading/off/error states calm. Do not prescribe voice timbre or claim Ash sounds
premium without actually listening on supported devices. Audio and external
media verification remain a separate acceptance requirement.

## Accessibility and responsiveness assessment

**Verified locally:** no horizontal overflow in the captured states, readable
stacking at 320px, distinct 768px recall layout, expanded desktop scene/phrase
layouts, large principal actions, text-based no-audio progress, inline reader
focus entry/Escape dismissal, and reduced-motion disabling of the tested phrase
animation. The 390px return target width and summary contrast need correction.

Issue #41 follow-up checks: Previous returned from the witness scene to the
opening; Next returned to the same witness; restart Cancel preserved that scene;
confirmed restart returned to the opening, all in an isolated browser profile.
Opening the restart dialog **did not move focus inside it**. Add explicit dialog
focus entry, containment, Escape/cancel and focus return while preserving archives.
A sampled Tab sequence reached restart, narration, replay and the next action
with solid visible focus outlines after keyboard navigation. This does not
establish full keyboard accessibility or a working restart focus trap. The inline
Bible dialog's focus entry/Escape result is a separate, passing probe.

**Required future checks, not claimed passes:** keyboard-only end-to-end use;
screen-reader headings, reveals, questions and saved-state announcements; focus
return and trapping for every modal, including restart; 200% text resizing and
400% browser zoom/reflow; contrast on all art crops; forced colors; touch precision;
physical mobile keyboard/landscape/safe areas; video captions/transcripts; audio
autoplay policy and interruption; slow-network/media failures. Use a minimum
44×44px design target for key touch controls and WCAG 2.2 AA criteria, including
target-size requirements/exceptions, when validating actual accessibility.

The Blueprint's quiet reading alternative should be a complete experience, not
a degraded fallback. Avoid animation-only meaning, color-only correctness,
time pressure, or mandatory audio. Never grade spiritual sincerity or infer
understanding from attendance, sound playback, confidence or tap count.

## Improvement plan and approval boundaries

| Stage | Bounded work proposed | Complexity / risk | Impact and review criteria |
| --- | --- | --- | --- |
| 1. Small, high-impact refinements | D01 contrast, D02 truthful location, D06 reference-safe fallback, D08 icons, restart dialog focus; quieter controls and nearby report action | S–M; low instructional risk, medium CSS/focus regression risk | Highest immediate quality gain. Narrow PRs with actual before/after captures; unchanged content, scoring, archives and survey. Review mobile/desktop/keyboard states before expanding. |
| 2. Interaction and scene diversity | D03–D05 shared chrome/audio/actions; D07/D09/D10 task-first workspaces, contents and evidence continuity; coherent typography and progressive result review | M–L; medium interaction/persistence risk, high instructional risk if sequence/support changes | Highest engagement potential. Use gap matrix and storyboard first. Preserve recall, questions, weights and evidence provenance; exact approval for reordered/combined teaching. Establish Shema quality before other chapters and shared Home/Ask/pilot styling. |
| 3. High-effort immersive polish | Portrait/desktop scene variants, verified modern/historical media, retained-scene motion and narration synchronization, cross-device performance/accessibility polish | L; medium-high asset/license, playback, performance and accessibility risk | Add after the usable baseline is approved. Compare a small prototype with invited learners; verify actual audio, rights, reduced-motion/no-audio equivalence, and exam/report/survey regression. No automatic deployment. |

**Greatest impact per unit of work:** contrast + accurate status first; then a
quieter header and nearby actions; then task-first composition and continuity.
Do not start with a new logo, new illustration library, sweeping CSS rewrite,
new mandatory activities or elaborate animation infrastructure.

The new recitation flow is real progress on this feature branch. Preserve it,
the shared narration manifest, unscored-service handling, restart archives,
exam/report and pilot-survey work rather than reintroducing earlier defects.
Recommendations about fewer repeated screens, adaptive tasks, additional lived
scenarios or altered assessment pacing are **instructional review items**, not
authorization to merge scenes, remove questions or change a Blueprint. Reformatting
existing prose does not grant permission to change its meaning or hide required
instructions/support from learners who need them.

## Success criteria for an approved design pass

- In a five-person formative review, at least four learners can identify current
  chapter, next task, audio control and route back without assistance. This is a
  proposed usability target, not a result already measured.
- At 390px, a learner can find the required task and next action without navigating
  unrelated framing or all optional answer-review explanations. Avoid a false
  “everything above the fold” requirement that makes Scripture cramped.
- Every important UI text/gradient/crop pair meets the chosen contrast target;
  no misleading passage labels, broken icon glyphs, or contradictory chapter state.
- Each reveal has a documented intellectual purpose. Completion remains distinct
  from demonstrated evidence; all approved content and records are preserved.
- Mobile/desktop/reduced-motion/no-audio paths provide the same learning and
  assessment opportunity. Playback, duration or device capability never gates credit.
- Compare pilot feedback for navigation, imagery, narration, pacing and assessment
  before/after approved changes, with explicit sample sizes. Completion and survey
  ratings inform design; they do not establish doctrinal mastery or causal impact.

## Validation performed for this documentation audit

- `npm run build` **passed** on the target feature revision. It emitted a large
  entry-chunk warning: 1,011.45kB JS (289.75kB gzip) and 398.00kB CSS (78.29kB
  gzip). This supports a future route/style-loading review, not a claim that
  network performance was benchmarked.
- `test:narration`, `test:grouped`, `test:og1-rating`, `test:og1-journey`,
  `test:og1-inline-bible`, and `test:pilot` **passed**. They are regression/contract
  evidence, not proof of visual polish, live audio, external Bible availability,
  physical-device accessibility, or a deployed preview.
- The actual local built-app browser review and measurements are described above.
  No wholesale test-suite rerun or new application test suite was needed for this
  documentation-only assessment; no new behavior was implemented.
- GitHub API access remained blocked during initial PR preparation. A draft PR
  must target `feature/og1-shema-blueprint-pass1`; creating or reviewing that PR
  does not authorize merging, deploying, production changes or redesign work.

## Browser review guide

For this audit, review the committed screenshots through GitHub; no local tooling
or deployment is required. Start with the strong
[desktop phrase composition](design-audit-evidence/31-phrases-desktop.png), then
compare the [mobile phrase state](design-audit-evidence/07-shema-phrases-mobile.png),
[independent response](design-audit-evidence/15-shema-explain-mobile.png),
[exam entry](design-audit-evidence/23-exam-mobile.png),
[long results](design-audit-evidence/24-exam-results-mobile.png), and
[summary contrast defect](design-audit-evidence/26-summary-mobile.png).
For product-wide consistency, compare
[Home](design-audit-evidence/28-home-mobile.png) and
[Ask Jeremiah](design-audit-evidence/29-ask-mobile.png).

These are **current-state captures**, not proposed redesign mockups. Several
include the unavailable-audio banner from this environment. End-flow values are
synthetic browser-fixture results and must not be interpreted as real learner
performance. After recommendations are reviewed, any interactive design prototype
should be separately authorized and kept away from production.


Annotated examples for issue #41 (the original screenshot remains unmodified;
red bounds and explanatory notes are added beside it):

- [Shema controls, audio failure and scene strength](design-audit-evidence/annotated-shema-controls.png)
- [Reasoning task with incorrect chapter context](design-audit-evidence/annotated-chapter-context.png)
- [Final-summary contrast and connected ending](design-audit-evidence/annotated-summary-contrast.png)
