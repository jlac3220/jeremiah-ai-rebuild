# Jeremiah.app on Vercel — production pilot handoff

The domain owner has confirmed that **jeremiah.app** is already managed on Vercel and that its old unused app can be replaced. The intended public pilot link is:

**https://jeremiah.app/#pilot**

This URL is **not declared live** until Vercel deployment, DNS attachment and end-to-end checks are complete.

## Deployment architecture

- GitHub: jlac3220/jeremiah-ai-rebuild
- Production branch: feature/media-standards-research
- Vercel Root Directory: app
- Vercel Framework: Vite
- Build Command: npm run build
- Output Directory: dist
- Six Node API functions inside app/api: Jeremiah teaching, Ask Jeremiah, narration, visual discovery, Bible chapter, and private pilot survey submission
- Single-page fallback configured in app/vercel.json
- Node.js runtime: Node 22 or newer; use the provider's supported version
- Reproducible npm dependency installation uses the committed lockfile and @vercel/blob private-storage SDK

Codespaces uses app/server.mjs on port 4173; **Vercel does not run that permanent server**. The API functions use the same underlying handlers via Vercel's own serverless Node endpoints.

## Required Vercel integrations and settings

1. Create a **Private Vercel Blob store** from the Vercel project's Storage tab and connect it to the project's Preview and Production environments. Do not choose Public storage for user feedback. Confirm BLOB_READ_WRITE_TOKEN is available to the functions. The same private store caches authored narrator clips to avoid repeated voice-generation costs across cold starts.
2. Set OPENAI_API_KEY as a **server-only environment variable** on the Vercel project. Check the project's API quota before invitations. Do not add API keys to GitHub commits, VITE_ prefixed variables, or browser code.
3. Confirm the Project Settings -> Root Directory is **app**, not the repository root, and the Vercel Git source/production branch points to feature/media-standards-research.
4. Set appropriate function execution time (app/vercel.json configures up to 60 seconds for the authored API functions) and configure a production region, billing alerts and provider-level rate limits. The survey's own limiter only applies per instance and is not protection against large-scale abuse.
5. Turn off unnecessary Vercel Authentication and password protection only for the **public launch**, once privacy notices, user testing and access limits are reviewed. Before then, keep the preview protected.
6. Publish a privacy notice and contact route before the first invited tester. The pilot is for adults 18+; ticking the age confirmation checkbox is not independent age verification. No names, email, scores, or Bible answer drafts are in the survey data; free text can contain information voluntarily entered by testers.

Vercel Functions have **ephemeral disks**. The Vercel survey handler must never fall back to a JSONL file on a function. When VERCEL=1, it uses only private Blob, returns a 503 if not configured, and never claims submission success without a confirmed Blob write. Locally, Codespaces can still use the private, Git-ignored app/.pilot-data folder.

## Safely replacing the old Vercel app

There are two safe approaches:

- If the existing Vercel project's Git source can be switched to the Jeremiah repository: configure the Root Directory, secret variables and private storage, deploy a **preview**, validate everything, then promote to production on the same project/domain.
- If the old project's Git source cannot be switched: create a **new** Vercel project from the Jeremiah GitHub repo, configure the same settings, test its preview deployment, then move the jeremiah.app custom domain from the unused project to the new one. Keep the old project available for rollback and never remove the domain before the new preview is verified.

If the project has a production domain, do not accidentally replace it with an unverified development build. Promoting the new application is the final step, not the first.

## Acceptance test before sending the invitation

- Open the deployment preview in private/incognito on phone and desktop.
- Open /#pilot, confirm the adult acknowledgement and enter OG.1 without any login.
- Hear the authored narrator; confirm it uses the backend MP3 endpoint, not device speech.
- Use Read in Bible, return to a lesson, and inspect contextual visuals.
- Submit a learner response and verify the server evaluation or the unscored fallback without blocking progress.
- Finish the ten-item assessment, view the understanding report, and choose Evaluate the experience.
- Submit a **test survey** and verify its private JSON response exists in the Vercel Blob Storage browser and the Thank you screen is shown.
- Test a browser refresh, retry the same submissionId, and the Leave without submitting flow. Confirm duplicate retries do not add extra records.
- Confirm provider protection/quotas, data handling, and HTTPS before public invitations.

## Private feedback review

To analyze production feedback from an authenticated local environment:

    cd /workspaces/jeremiah-ai-rebuild/app
    vercel env pull .env.local
    npm run pilot:report:vercel

The report downloads private Blob records to app/.pilot-data/vercel-og1-feedback.jsonl (Git-ignored), prints category averages and top priorities, then generates a private CSV next to that file. Never expose the Blob token or the individual comments on a public page.

## Codespaces update

After the merged GitHub changes:

    cd /workspaces/jeremiah-ai-rebuild
    git pull --ff-only origin feature/media-standards-research
    cd app
    npm install
    npm run build

Your Codespaces port 4173 preview works for local testing. Restart node server.mjs after backend changes to pick them up. A Codespaces port is not a permanent hosted service.

## Status

Source code can be prepared and tested through GitHub, but **this PR does not deploy or deactivate any Vercel project**. Deployment/production promotion requires connecting the Vercel account and choosing the correct project; the private Blob integration must be provisioned before survey intake.
