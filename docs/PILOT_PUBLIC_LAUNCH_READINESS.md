# Issue #63 · private service verification and launch gate

**NOT READY FOR INVITATIONS. No public pilot has been opened by this work.**

Source: latest PR #62, commit `c750ae36aab70d1a0f0ded434ba6474e1dde1ad7`. New branch: `codex/pilot-service-release-gates`. Keep `jeremiah.app` and its legacy Vercel project unchanged. No production merge, domain reassignment, DNS change or production deployment has been performed here.

## Confirmed failures and corrections

| Gate | Actual live evidence | Correction / remaining requirement |
| --- | --- | --- |
| Private feedback | Rebuild staging returns HTTP 503 | Installed Blob SDK's `BlobNotFoundError` has `.name === "Error"`. The former name-string check rejected every new record before `put`. Use `instanceof` the real SDK class; preserve private immutable writes and duplicate detection. Corrected tests use the actual SDK class, plus permission-denied and concurrent retry cases. **Corrected code still needs authorized staging deployment and a real write/read-back.** |
| Ask Jeremiah | HTTP 503 | Live teaching's safe upstream classification confirms **401 / incorrect API key**. The apparent service outage is authentication. Owner updated the key and redeployed; the known stable alias still gave the old authentication failure. The owner supplied a dashboard inspection URL, not the deployed website URL; the exact new website remains to be verified. |
| Semantic teaching | HTTP 200, `source: service-unavailable`, `verdict: unscored` | This is a failed service gate, not successful grading. Remove raw upstream diagnostic bodies (which can contain credential fragments), add bounded safe classifications, explicit models, timeout/backoff and real owner verification. Preserve saved/unscored answers. |
| Ash narration | HTTP 502 | The same server key fails the real speech request. Verify **fresh** `200 audio/mpeg` with fixed Ash settings, not merely delivery of an old cached file. |

[Redacted live baseline](pilot-launch-evidence/checks/live-baseline-redacted.json). No keys, credential fragments, provider error bodies or learner responses are in this evidence. Full raw upstream responses are not committed. The current alias's older code still has no durable usage guard; do not distribute it while verification is pending.

## What is implemented

- `recordPrivateBlobFeedback`: actual SDK missing-record detection, private JSON writes, stable IDs, immutable first-write wins, duplicate-safe retries, bounded storage requests. Permission/store/auth failures are not mistaken for missing records. SDK-backed contract tests cover sequential and concurrent duplicates; they are **not** a substitute for a deployed Blob write.
- Shared OpenAI request handling: explicit server-configured models (no unverified `gpt-5.6-*` defaults), fixed output limits, 20-second per-attempt timeout, a 45-second request-context deadline, at most one bounded transient HTTP retry; no blind retry after timeout/auth/model failures. Respect long Retry-After by not retrying immediately. Safe status/category/whitelisted error-code logging; never prompts, responses, headers or provider error messages. Token usage logs contain numeric counts only.
- `Ask` identifies actual provider answers with `source: openai`; authored out-of-scope refusal remains unchanged. Teacher outages remain explicitly unscored with no mastery evidence. Deployed narration remains authored-only, fixed Ash; audition alternatives are unavailable to pilot participants. MP3 responses are private-cacheable rather than shared through public CDN caches.
- Every deployed paid/feedback/visual-discovery handler is closed by default. Verification requires server-authenticated owner access; invitations require a separate signed, HttpOnly, Secure, SameSite=Strict session. A server secret is never a `VITE_` value, JS password, URL query token or localStorage credential. Cross-site calls are rejected.
- Persistent Redis REST Lua reservations provide per-IP/per-session throttles, global daily/monthly service-request caps and daily/monthly provider-call caps. IP buckets store only daily HMACs with expiry, not raw addresses. One atomic transaction checks all counters before incrementing; rejected requests do not partially consume other buckets. No in-memory fallback authorizes paid work.
- **Owner budget: $10/month**. The persistent ledger caps the monthly reservation allowance at 1,000 cents even if a larger value is configured. Default daily reservation allowance is $3. Each actual provider attempt—including retries/corrections—reserves conservatively before dispatch. Failed calls are not refunded. Missing/invalid storage, budgets or verified pricing deny generation.
- Private browser report at `/api/pilot/report`: server-side HTTP Basic owner authentication over HTTPS with a separate >=32-character random password, no client-side password check, no guessable-route authorization. Ratings/distributions, completed/partial counts, prioritized issues, redacted comments, private CSV and aggregate usage reservations. HTML escapes all comments; CSV neutralizes formulas. No scores/lesson answers/IPs are exported. Names in free text cannot be reliably auto-removed: comments remain owner-private and must be reviewed before sharing.
- Marked test IDs `issue63_test_<32 hex>` are excluded from aggregate analysis/CSV in both browser and CLI reports. For a manual phone survey test, begin a comment with `[ISSUE63 TEST]`; that explicitly marked record is excluded too, without developer tools or changes to the survey schema. Records can be retained privately as verification evidence; no real participant records are deleted.
- Browser owner action `/api/pilot/verify`: checks key/model access, a real marked private Blob write, duplicate retry, authorized read-back, denial of anonymous Blob download, in-scope Ask, out-of-scope refusal, real semantic evaluation and **fresh** Ash MP3 generation. Results contain safe metadata only. It does **not** open invitations or set release approval.
- Landing retains the approved visual design and adult consent, adds invitation/closed state and a short edition ID. Classroom, lesson content, assessments, progress/history, imagery, narration manifest, red feedback notice and floating feedback action are unchanged.

## Budget meaning — do not confuse settings with a hard provider stop

The owner confirmed **$10 project/monthly budget**, not prepaid credit. OpenAI project budgets can be notification thresholds rather than hard stops. This app therefore denies requests using its own persistent reservation ledger as well.

Currency reservations require **current, verified prices for the exact configured model IDs** in `PILOT_MODEL_PRICING_JSON`. Responses reserve UTF-8 request bytes plus overhead as a conservative input-token bound, and the full maximum output-token allowance. Speech requires an explicitly verified conservative cost bound for the longest <=1,200-character authored clip at fixed Ash settings. The bound must be rechecked when provider prices/settings change. No made-up prices or model aliases are assumed.

This controls this application's requests, not another application sharing the OpenAI key/project. Use a dedicated pilot key/project, check actual provider billing, and do not enable invitations until the prices/bounds and model permissions have been checked. Reservations may close access earlier than the actual bill. The private report displays reservations, not a billing invoice.

## Secure browser-only staging setup

No developer installation is needed for the owner. Values go directly into Vercel's secure environment-variable forms, never chat, screenshots, Git or browser source.

1. In **Vercel → jeremiah-ai-rebuild → Settings → Environment Variables**, keep the production-only OpenAI key scoped to this controlled staging release. Do not copy the production key onto all PR previews. Confirm the exact requested FAST/DEEP model IDs with the private model-access check; do not silently downgrade grading to an unverified model.
2. Attach a **private** Blob store with server-side `BLOB_READ_WRITE_TOKEN` (already reported configured). Private-store access still needs real verification after the code fix.
3. Before configuring paid access, deploy the corrected branch with the gate still closed and the owner password configured. Open `/api/pilot/report?setup=1`: **Check key and model access · no generation** verifies the key without any paid generation or Redis dependency. **Check private feedback write and read-back** verifies the real Blob fix separately. Both are owner-authenticated, and neither opens the pilot.
4. Add a Redis REST database through Vercel Marketplace/Upstash. Bind `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, or existing `KV_REST_API_URL` / `KV_REST_API_TOKEN`. This task could not inspect the Vercel account/WAF configuration because no Vercel connector/token is available in this workspace. Actual WAF/account feasibility remains unverified; the application does not rely on WAF or per-instance Maps for its global cap.
5. Generate separate random values with a password manager: `PILOT_OWNER_PASSWORD` >=32 characters and `PILOT_SESSION_SECRET` >=32 characters. Username defaults to `owner`. These are server settings, not a client password. Use a private browser window for the report and close it afterward to clear cached HTTP Basic credentials. Rotate both secrets to revoke owner/session access.
6. Set `PILOT_ACCESS_MODE=verify`, leave `PILOT_RELEASE_APPROVED=false`, and set `PILOT_MONTHLY_BUDGET_CENTS=1000`. Add the verified pricing JSON. The shape is `{ "<exact responses model ID>": { "inputUsdPerMillion": <verified number>, "outputUsdPerMillion": <verified number> }, "gpt-4o-mini-tts": { "maxAuthoredClipUsd": <verified conservative bound> } }`. These placeholders are deliberately not usable prices. Both exact FAST and DEEP IDs need entries.
7. Deploy **this correction branch** as a private production-environment staging deployment **only on the rebuild project**, retaining deployment protection. Saving environment values does not change an already-running deployment. Do not promote/reassign the apex domain or merge the draft stack into stale main.
8. Click **Visit** on the exact deployment and check `/#pilot`'s edition against the PR commit. A `vercel.com/.../deploymentID` dashboard URL is not the app website URL. Use the actual `https://…vercel.app` URL for testing.
9. Open that website's `/api/pilot/report`. Sign in using the server owner username/password in the browser's native HTTPS authentication prompt. Click **Run real service checks**. The JSON must say `allPassed: true`; `source: openai` is required for semantic teaching, and narration must be fresh `200 audio/mpeg`, voice `ash`. A 200/unscored response is a failure.
10. The owner report and verifier work in a browser; no token retrieval, local CLI or copy/paste of private raw records is required. The safe verification JSON can be shared for review. It contains no key or learner content.

**Never turn off protection on untrusted PR branches.** A private preview can remain closed and does not need the production OpenAI key. Do not share an invitation until the following gates are complete.

## Release checklist

- [x] Branch starts from PR #62; approved lesson/design/assessments preserved.
- [x] Live failures reproduced against the known rebuild staging alias, including explicitly unscored teaching.
- [x] Incorrect-key upstream classification identified without printing credential fragments.
- [x] Blob code defect corrected and regression tested using the actual installed SDK error class.
- [x] Private owner report/CSV, default-closed server gate and real-verification action implemented.
- [x] Real local Redis concurrency, atomic multi-bucket denial, TTL and currency-cap tests pass.
- [x] Local real-handler phone/desktop receipts, file persistence, duplicate retry, report authentication/CSV and closed-gate tests pass.
- [x] Independent hosted Chromium contexts (390/1440, no Vercel account/mocks/seeding) reproduce the current live failures; **not passed off as a successful full pilot**.
- [ ] Exact owner-redeployed website/commit identified and verified with the updated key.
- [ ] Corrected branch deployed privately with actual server configuration, dedicated key, private Blob and persistent limiter.
- [ ] Real Blob accepted/private/read-back/duplicate/anonymous-denial check passes on that deployment.
- [ ] Real Ask and semantic OpenAI evaluation pass (not fallback/unscored), out-of-scope refusal passes.
- [ ] Fresh fixed-Ash speech and actual browser playback pass; authored cache delivery also checked.
- [ ] Actual configured model prices/permissions, $10 reservation bound and provider billing reviewed; live limits active across instances.
- [ ] Protected owner report/CSV verified against real Blob data; anonymous access denied on the hosted site.
- [ ] Independent hosted full lesson: consent/start/resume/restart, images/audio/Ask/real teacher, ten-question exam, learning report, red invite/floating shortcut, partial and complete survey receipts/replay. Test Chrome phone viewport and desktop; physical phone/iOS Safari still require human/device testing.
- [ ] Owner approves the **exact** stable invitation-only domain. Proposed `pilot.jeremiah.app` requires explicit approval/DNS access; no domain has been created or changed by this work.
- [ ] Only after all above: set a new random `PILOT_INVITE_CODE` >=24 characters, `PILOT_ACCESS_MODE=invite`, `PILOT_RELEASE_APPROVED=true`, redeploy the controlled release, and invite only 5–10 adults initially. Keep the private owner report protected.

## Tests and evidence

- Production build, existing 23 repository test commands, added service-gate tests and Stage 1/Stage 2/Shema browser suites pass. Existing lint baseline remains 11 errors / 6 warnings; reported files are unchanged from PR #62.
- Real Redis in an isolated, no-network container: 40 concurrent callers for 10 slots → exactly 10 accepted; rejects are atomic; TTL and currency reservations verified. This proves the Lua implementation locally, not that the Vercel Redis binding is installed.
- Independent local browser contexts: actual HTTP handlers (no route mocks), real local file persistence, duplicate-safe retry, successful partial-survey UI receipt, anonymous report denial, owner report/CSV, closed paid access and no phone/desktop overflow. **Local file storage is not live Blob proof.**
- Hosted contexts: actual rebuild alias, no Vercel login or mocks; Ask 503 and narration 502 remain. Full hosted completion was not claimed after those failures.

[Check logs](pilot-launch-evidence/checks/) · [Hosted observations](pilot-launch-evidence/hosted/observations.json) · [Preservation](pilot-launch-evidence/checks/preservation.txt).

| Real screenshot | Phone | Desktop |
| --- | --- | --- |
| Local closed release gate | [390px](pilot-launch-evidence/local/390-closed-gate.png) | [1440px](pilot-launch-evidence/local/1440-closed-gate.png) |
| Local actual survey receipt | [390px](pilot-launch-evidence/local/390-local-receipt.png) | [1440px](pilot-launch-evidence/local/1440-local-receipt.png) |
| Local private report (synthetic records) | [390px](pilot-launch-evidence/local/390-private-report.png) | [1440px](pilot-launch-evidence/local/1440-private-report.png) |
| Hosted current Ask failure | [390px](pilot-launch-evidence/hosted/390-ask-live.png) | [1440px](pilot-launch-evidence/hosted/1440-ask-live.png) |

Reproduce local checks with Playwright/Chromium available: `npm run test:pilot-services`, `node scripts/verify-pilot-services-browser.cjs`, and the original lesson browser runners. The optional `PILOT_REDIS_TEST_CONTAINER` runs the test against a named isolated Redis container; it must never point to a production Redis. Hosted browser runner accepts `PILOT_TEST_BASE_URL` and deliberately rejects jeremiah.app.

## Rollout, monitoring and rollback

Redis time buckets use UTC billing periods. Vercel, Blob and Redis charges are separate from this OpenAI-project allowance.

Record the exact release commit, Vercel deployment ID/URL, configuration scope and verified test results. Monitor safe provider failure categories, numeric token usage, reservation counts, response rates and the private feedback report. Check actual provider billing and Vercel limits before expanding beyond 5–10 adults. No claims about learning retention/assessment accuracy follow from these engineering tests.

To stop the new release, set `PILOT_ACCESS_MODE=closed` and `PILOT_RELEASE_APPROVED=false`, then redeploy so those environment values actually apply. Preserve all private survey records and local learner state. For immediate containment use the rebuild project's deployment protection/WAF and the dedicated pilot key controls, without touching the apex project.

Keep the prior PR #62 frontend as a visual/content backup. **Do not roll the backend back to an older unguarded deployment with a working paid key exposed**: an old build does not understand the new closed flag. Before an old-code rollback, block public access to that rebuild deployment and disable its dedicated paid key, or retain the new guard while reverting only frontend changes. Never delete feedback as a rollback step.
