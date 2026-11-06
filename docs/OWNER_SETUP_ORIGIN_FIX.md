# Issue #67 — private setup form origin fix

PR #66, following `d026b2ca`. No merge, production deployment, public invitation, lesson change or change to `jeremiah.app`.

## Cause and scoped fix

The authenticated report/setup page emitted `Referrer-Policy: no-referrer`. In actual Chromium native form POSTs, this serializes the request Origin as the literal `null`, even when posting back to the same host. Both setup buttons therefore failed the verification endpoint's strict origin validation before running any check.

Change only the report response's policy to `same-origin`. Native forms can now send the legitimate same-origin Origin. Referrers to other origins remain suppressed. The relative form actions, CSP `form-action 'self'`, owner authentication, verification origin/Fetch Metadata checks, private/no-store responses, release gates, persistent limits and secret handling are unchanged. In particular, the endpoint still rejects `Origin: null`; no forwarded-host exception, origin bypass or client-side credential was added.

## Reproduction and regression checks

[Before: real browser requests](standalone-pilot-evidence/issue67/before.json) · [After: real browser requests](standalone-pilot-evidence/issue67/after.json).

At both 390px and 1440px, using native HTTP Basic owner authentication and the actual setup-page forms/HTTP handlers:

| Button | Before | After, with credentials deliberately absent |
|---|---|---|
| Check key and model access · no generation | `Origin: null`; origin rejection | Matching origin; HTTP 200 `category: key_not_configured` proves the account check is reached |
| Check private feedback write and read-back | `Origin: null`; origin rejection | Matching origin; HTTP 503 `category: private_storage_unavailable` proves the storage check is reached |

These diagnostic outcomes are expected in the credential-free test server, **not successful live OpenAI or Blob verification**. No paid requests were made.

Additional browser checks verify anonymous setup/verification returns 401; null/cross-site/sibling origins return 403 even with owner credentials; cross-site Fetch Metadata is rejected even with a matching Origin; GET verification remains 405; cross-origin navigation receives no Referer; and public access remains closed. Unit coverage also checks the exact `https://pilot.jeremiah.app` Origin/Host pair and preserves rejection of null and foreign origins.

Passing commands: `test:pilot-services`, `test:pilot`, `test:vercel`, `test:standalone-pilot`, production `build`, and `verify-owner-setup-browser.cjs` with Playwright/Chromium. No broad lesson retest is required for this response-header-only change.

Reproduce after build with Playwright available:

```
NODE_PATH=/path/to/node_modules node app/scripts/verify-owner-setup-browser.cjs
```

The optional `--before` records the original rejection and is intended only against the original uncorrected source. The runner generates ephemeral local owner/signing secrets, clears provider credentials, and never logs Authorization or secret values.

## Live confirmation still required after controlled redeployment

[Unauthenticated live observations](standalone-pilot-evidence/issue67/live-status.json) confirm the actual pilot remains closed on `d026b2ca`; its owner setup response still has the old `no-referrer` policy. This workspace has no Vercel management connector or owner credentials for the real pilot, so it cannot deploy or authenticate those live checks. No live successful owner button or service result is claimed.

The authorized Vercel-side operator should deploy the new exact PR #66 commit using the existing [closed handoff](CLOSED_OG1_DEPLOYMENT_HANDOFF.md), retain closed access and release approval false, then reload the setup page (or reopen it in a fresh owner-authenticated window) so it receives the new header. At `https://pilot.jeremiah.app/api/pilot/report?setup=1`, click both buttons. Expected Origin is `https://pilot.jeremiah.app` and Fetch Metadata is `same-origin`. Each should return its actual safe service-check result, not `Same-origin access required`. Do not enable invitations to test either button. Continue Issue #63's genuine OpenAI/Blob verification separately; do not publish headers containing credentials or raw upstream error bodies.
