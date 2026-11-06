# PR #66 → one verified live OG.1 evaluation

**Public invitations remain closed. This is a staging handoff, not permission to merge, promote a public release, or modify `jeremiah.app`.**

## Candidate and target

Use the latest commit on PR #66, `codex/standalone-og1-evaluation`, based on PR #64 (`d78f23fa`). Record its full SHA before deploying; do not deploy stale `main` or merge the stacked drafts. The three review fixes preserve the approved teaching, imagery and assessment behavior.

The last confirmed live `pilot.jeremiah.app` deployment is PR #64 (`d78f23fa`), closed. Issue #63 records that this hostname is attached to **jeremiah-ai-rebuild** (`prj_OOGeWahgkgheGLSNHEymNMtlzBwH`), root `app`. A separate `jeremiah-ai-pilot` preview project also builds this PR; its existence does not mean it owns the custom domain. Confirm current assignments through authorized Vercel tooling before any promotion. Do not move domains, alter DNS, change the production Git branch, or touch the legacy `jeremiah-app-shrr` project serving `jeremiah.app`.

The new candidate is **prepared for** a controlled deployment to the existing pilot target. This workspace has no Vercel management connector/token or owner-report credentials. Its sole ready secret is a deployment-protection bypass restricted to a different, old rebuild deployment; it cannot authorize management operations or the current pilot report. Do not broaden or copy that credential onto other hosts. Pushing PR code triggers protected previews only; it is not proof of a pilot deployment.

## Operator: configure privately, with no public invite

Use the existing Vercel-side workflow from Issue #63. Secrets go into Vercel's secure server environment settings, never GitHub, chat, client variables, URLs, screenshots or logs.

| Setting | Required action |
|---|---|
| `PILOT_ACCESS_MODE` | Start `closed`; later use `verify` for owner-only verification. Never `invite` at this milestone. |
| `PILOT_RELEASE_APPROVED` | Keep `false` throughout. |
| `PILOT_INVITE_CODE` | Leave unset. No invitations issued. |
| `PILOT_OWNER_USERNAME` / `PILOT_OWNER_PASSWORD` | Username defaults to `owner`; use a unique random password of at least 32 characters. |
| `PILOT_SESSION_SECRET` | Separate random secret of at least 32 characters. |
| `OPENAI_API_KEY` | Dedicated, server-only pilot project key, billing/credit and permissions verified. Do not copy to untrusted PR previews. |
| `JEREMIAH_OPENAI_MODEL_FAST`, `JEREMIAH_OPENAI_MODEL_DEEP` | Exact model IDs confirmed by the account check; do not assume defaults or silently replace models. |
| `BLOB_READ_WRITE_TOKEN` | Connected **private** Blob store, correctly scoped to this deployment environment. No file-storage fallback on Vercel. |
| Redis | `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (or existing supported KV aliases), persistent across functions. |
| Budget | `PILOT_MONTHLY_BUDGET_CENTS=1000`, `PILOT_DAILY_BUDGET_CENTS=300`. The OpenAI project notification budget alone is not a hard spend stop. |
| `PILOT_MODEL_PRICING_JSON` | Independently verified conservative prices for both exact Responses model IDs and the fixed authored Ash speech bound. Missing prices must keep generation denied. See Issue #63 readiness guide for schema; do not invent rates. |

On the shared rebuild target, leave `VITE_OG1_EVALUATION` unset: the **actual `pilot.jeremiah.app` hostname always mounts the OG.1 shell**, while creator hosts retain their normal application. For a separate, dedicated pilot preview only, set `VITE_OG1_EVALUATION=true` at build time and `PILOT_DEPLOYMENT_SCOPE=og1` server-side so alternate aliases are also isolated. Do not apply dedicated-preview flags to all creator environments.

Build from `app`: `npm ci`, `npm run build`; output `dist`; use the existing Vercel Node API functions and redirects. Do not run fixture preloads, local test credentials, fake pricing, or the browser harness in deployment. Saving settings requires a new deployment before they take effect.

## Verify before the first live lesson

1. Stage the **exact PR #66 candidate SHA** on the authorized existing pilot target with the above gate closed. Record deployment URL/ID and configuration scope. Do not merge. Confirm `GET /api/pilot/access` reports its expected eight-character SHA and unauthenticated access. Do not infer a successful deployment from a green preview on a different project.
2. In a clean browser without Vercel/owner authentication, verify welcome and closed notice at `https://pilot.jeremiah.app/#pilot`; `#home`, `#classroom`, `#askJeremiah`, direct lesson hashes and history cannot reveal another app page. Report/setup/CSV/verification endpoints must return `401`. Feedback must reject unauthenticated submissions. Forbidden general-app APIs stay denied. Check phone and desktop. Leave the apex domain untouched.
3. Owner opens [private setup](https://pilot.jeremiah.app/api/pilot/report?setup=1), using the browser's HTTPS Basic authentication prompt. **Check key and model access · no generation** must succeed. This diagnoses credentials without paid calls or Redis. Then **Check private feedback write and read-back** must pass accepted write, immutable duplicate, private read-back and anonymous denial. This creates an explicitly excluded internal record, not participant feedback. Do not accept local fixtures as proof.
4. After Redis and verified pricing are configured, deploy the same candidate with `PILOT_ACCESS_MODE=verify`, `PILOT_RELEASE_APPROVED=false` and no invite code. This permits only the authenticated owner/signed verification session; it does not open public invitations. Check unauthenticated access again.
5. Owner clicks **Run all service checks · small paid requests**. Save only the safe result JSON: exact commit, timestamp and `allPassed:true`; real semantic teaching must have `source:openai` with a scored verdict, and narration must be a **fresh** Ash `200 audio/mpeg` response, not just cache delivery. This owner-only verifier also checks Ask internally as required by Issue #63; do **not** restore an Ask route or public Ask API to the OG.1-only experience. If a check fails, keep verification-only mode, inspect safe status/category diagnostics and fix the actual service before proceeding.
6. Open the [private dashboard](https://pilot.jeremiah.app/api/pilot/report), confirm its persistent usage allowance is available, then follow **Review the lesson** in the same browser. The report issues the signed verification cookie only in verify mode; the password is not a client-side gate. Cookies expire after one hour; reauthenticate through the report if needed. Check the dedicated provider billing separately. No fallback may authorize paid requests if the limiter/pricing is missing.

## Milestone: one real lesson → one real survey → private report

- Use a fresh owner browser profile with no seeded lesson or assessment state, no route mocks and no API fixtures. A separate unauthenticated context must remain closed throughout.
- Acknowledge adult consent and start OG.1. Follow all four witnesses and complete every authored learning activity. Confirm the approved images load, hear real Ash playback, and verify at least one real written teaching response is scored with `source:openai` (not `unscored` / `service-unavailable`). Provider metadata may be recorded; never save credentials, prompts or personal learner responses in public evidence.
- Complete the ten-question exam through the UI, inspect results/understanding/final summary, and enter the survey. Confirm `Up next: Return to welcome`. Do not change teaching or scoring to make the smoke test pass.
- Begin one optional comment with **`[ISSUE63 TEST] LIVE OG1 milestone`**, then add a non-personal date/device marker. Submit once. Record the safe request submission ID and accepted/duplicate status without recording its content. Thank-you must appear only after a successful save. Retry that same ID through authorized testing; require `duplicate:true`, one immutable record and no extra count. Do not press **Share additional feedback** for a retry: that intentionally creates a new submission.
- Reopen the authenticated dashboard. Its **Marked verification submissions** section must show the same ID/time and **Completed lesson**. These receipt metadata rows are owner-only and excluded from participant aggregates/CSV; test comments are not displayed there. Verify this against a genuine private Blob read, not local file storage. Owner tooling may inspect the exact private pathname `jeremiah-pilot/og1/<submissionId>.json` without publishing its URL/token/content. Confirm anonymous Blob access is denied.
- Check anonymous dashboard/CSV access is still `401`; CSV excludes marked tests, grades and individual lesson answers. Preserve the internal record as verification evidence. Do not delete participant records.
- Record exact SHA/deployment, real teacher source/verdict, fresh Ash status/type, playback result, survey accepted/read-back/duplicate result, matching private report receipt, persistent reservation totals, phone/desktop outcome and any human/device limitations. Update Issue #63 with redacted metadata and link the candidate PR.

**The milestone is not complete until all these are real hosted responses.** Passing local journeys exercise explicit upstream fixtures and actual private local file writes. They are regression evidence, not a live OpenAI or Blob claim. Physical phone/Safari playback still needs an actual device check if only Chromium viewport testing is available.

## Stop and rollback

Keep public invitations closed even after the first successful internal run; opening invitations is a separate owner decision. To stop owner verification, set mode `closed` and release approval `false`, then redeploy. Keep feedback and learner progress. For urgent containment use protection/key controls on the pilot/rebuild target only. Do not roll paid endpoints back to an old unguarded build, do not repoint the apex, and do not merge the drafts as a shortcut.
