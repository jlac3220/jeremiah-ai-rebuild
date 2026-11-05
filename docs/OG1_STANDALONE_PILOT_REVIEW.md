# Issue #65 — standalone OG.1 evaluation

Based on PR #64 at `d78f23fadee808c66a4ae4a49fc9ac5b056d0b72`. Separate branch; no merge, deployment, domain reassignment, or release approval.

## Final review corrections

The three review items on PR #66 are addressed without changing lesson content or design:

1. Invitation input/unlock controls now have 49px minimum height, the existing button treatment, and visible keyboard focus. Verified at 320px and 390px (also 1440px).
2. The embedded standalone survey says **Up next: Return to welcome**. Creator hosts retain **Return to Jeremiah**.
3. The existing witness art loads eagerly. During slow/failed loads, the hero no longer repeats the witness name over its label, and portraits show explicit sequence numerals instead of blank circles. Loaded portraits use the same approved illustrations; no art was replaced.

The owner-only dashboard additionally lists the latest marked verification receipt IDs, times and completed/partial status. Test ratings/comments remain excluded from participant analysis and CSV. No lesson answers or grades are added to survey storage.

| Final review capture | Phone | Desktop |
|---|---|---|
| Invitation / keyboard focus | [390px](standalone-pilot-evidence/review/390-invitation-focus.png) · [320px](standalone-pilot-evidence/review/320-invitation-focus.png) | [1440px](standalone-pilot-evidence/review/1440-invitation-focus.png) |
| Loaded witness art | [Phone](standalone-pilot-evidence/review/390-opening.png) | [Desktop](standalone-pilot-evidence/review/1440-opening.png) |
| Slow image fallback | [Phone](standalone-pilot-evidence/review/390-opening-loading.png) | [Desktop](standalone-pilot-evidence/review/1440-opening-loading.png) |
| Failed image fallback | [Phone](standalone-pilot-evidence/review/390-opening-image-failure.png) | [Desktop](standalone-pilot-evidence/review/1440-opening-image-failure.png) |
| Standalone survey copy | [Phone](standalone-pilot-evidence/review/390-survey.png) | [Desktop](standalone-pilot-evidence/review/1440-survey.png) |

[Private-report screenshot with synthetic test receipt metadata](standalone-pilot-evidence/review/owner-local-report.png) · [Final browser results](standalone-pilot-evidence/review/results.json) · [Scripted tests](standalone-pilot-evidence/review/scripted-tests.json).

All 25 scripted suites, both builds, Stage 1, Stage 2 and the fresh opening-correction browser suite pass after the corrections. The fresh standalone phone/desktop journeys complete the full lesson, ten-question exam, completed and partial surveys, storage retry/duplicate behavior and the private owner report. 320px large-text, keyboard and slow/failed-art checks pass. Existing lint remains 11 errors/6 warnings; the previously reported legacy Shema runner timeout has not been reclassified as passing.

**Live status:** read-only HTTPS check still finds `pilot.jeremiah.app` at `d78f23fa`, mode closed, and unauthenticated owner setup returns 401. The protected pilot-project preview redirects to Vercel authentication; a 200 login HTML response is not an API success. No live AI, audio, Blob or persistent budget success is asserted by local fixtures. Use the [closed deployment/milestone handoff](CLOSED_OG1_DEPLOYMENT_HANDOFF.md) in coordination with Issue #63. No production change or invitation opening is performed here.

## Experience

`pilot.jeremiah.app` mounts a dedicated welcome → OG.1 lesson → ten-question exam/results → survey → saved thank-you shell. No general application router, bottom navigation, lesson selector, or chapter-browser controls are rendered. Unknown hashes, direct lesson links before consent, reloads and browser history stay within the evaluation. The static voice-audition page redirects to welcome on the pilot host.

Early feedback is available on welcome and in lesson options. Incomplete submissions are marked incomplete. Success is displayed only after storage acknowledges saving; failed requests retain the draft. Retries keep the same submission ID. Explicit additional feedback creates a new ID.

Approved teaching data, Scripture, Shema design styles, imagery, exam questions and scoring are unchanged. Existing direct/review progress is recovered; restart archives previous evidence and exam history. The fixed lesson shell does not mutate creator classroom selections. Creator hosts retain the full application.

Signed invite sessions are independently restricted on the server, including old PR #64 cookies and spoofed Host headers: no Ask Jeremiah, visual discovery, or other teaching standards. KJV context is limited to chapters cited by OG.1; Ash narration and existing private report authentication, budget and release gates are retained.

## Review screenshots

These are real Chromium captures, not mockups. Before is the currently deployed PR #64, signed out and closed. After is this branch served locally with explicit synthetic upstream fixtures and actual private local survey storage. No implication that this branch is already deployed.

| Screen | Phone (390px) | Desktop (1440px) |
|---|---|---|
| Before welcome | [Phone](standalone-pilot-evidence/before/390-welcome.png) | [Desktop](standalone-pilot-evidence/before/1440-welcome.png) |
| Before general-app escape | [Phone](standalone-pilot-evidence/before/390-home-escape.png) | [Desktop](standalone-pilot-evidence/before/1440-home-escape.png) |
| After welcome | [Phone](standalone-pilot-evidence/local/390-welcome.png) | [Desktop](standalone-pilot-evidence/local/1440-welcome.png) |
| Approved opening | [Phone](standalone-pilot-evidence/local/390-opening.png) | [Desktop](standalone-pilot-evidence/local/1440-opening.png) |
| Assessment | [Phone](standalone-pilot-evidence/local/390-assessment.png) | [Desktop](standalone-pilot-evidence/local/1440-assessment.png) |
| Results | [Phone](standalone-pilot-evidence/local/390-results.png) | [Desktop](standalone-pilot-evidence/local/1440-results.png) |
| Survey | [Phone](standalone-pilot-evidence/local/390-survey.png) | [Desktop](standalone-pilot-evidence/local/1440-survey.png) |
| Saved thank-you | [Phone](standalone-pilot-evidence/local/390-thank-you.png) | [Desktop](standalone-pilot-evidence/local/1440-thank-you.png) |

Full-page variants and save-failure/early-feedback captures are alongside native viewport screenshots.

## Verification and limits

- All 25 scripted suites pass, including private feedback, duplicate handling, release/budget gates, forbidden APIs, signed-session capability, creator host routing, content and exam preservation.
- Regular and standalone preview production builds pass. Existing Stage 1 and Stage 2 browser suites pass. The separate legacy Shema browser runner times out waiting for its post-review primary action; this is reported as a failed check, not counted as passing. The fresh standalone full-lesson runs traverse the preserved Shema interaction successfully.
- Fresh independent 390px phone and 1440px desktop sessions traverse the complete authored lesson and all ten exam questions through the UI, pause/resume/reload, restart with retained exam archive, survey failure/reload/retry/deduplication, completed and incomplete receipts, and creator-selector preservation.
- A 320px reduced-motion welcome with 150% root text passes overflow and browser back/forward isolation checks.
- Inline KJV dialog and narration failure fallback are exercised. Test upstream OpenAI, Redis and KJV responses are fixtures. The speech fixture deliberately returns failure; it does not fabricate audio success.
- Local file feedback storage is real and private; live Vercel Blob read-back is not proven by these tests. Owner reports reject unauthenticated participant requests.
- Repository lint still reports the existing 11 errors and 6 warnings; it is not a passing check.
- Hosted before audit confirms PR #64 remains `mode: closed`, unauthenticated. Its general-app hash escape is demonstrated in before screenshots.

## Preview and release

For a dedicated evaluation preview build only: `VITE_OG1_EVALUATION=true npm run build --prefix app`. Serve with `node app/server.mjs` and closed access. Leave this build flag unset on creator deployments; pilot hostname detection works without it. `PILOT_DEPLOYMENT_SCOPE=og1` additionally restricts alternate aliases of a dedicated pilot deployment. The browser harness explicitly enables isolated local fixtures and local test-only invitation approval; never configure its preload on Vercel.

Public access remains closed. Real semantic evaluation and Ash responses, successful private Blob submission/read-back/duplicate handling, configured persistent usage limits, and owner reporting still require authorized staging verification before opening the pilot. No credentials are included in evidence. This PR does not flip either release gate or change `jeremiah.app`.
