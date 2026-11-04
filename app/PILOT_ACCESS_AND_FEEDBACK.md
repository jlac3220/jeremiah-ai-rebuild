# Jeremiah OG.1 pilot: access, feedback, launch

## Recommended public-facing address

The owner controls **jeremiah.app**. For a limited pilot, deploy the current Node application under a **separate hostname**, such as:

**https://pilot.jeremiah.app/#pilot** — a *planned* URL, not currently verified as deployed.

The current React app uses hash-based navigation. The pilot entry lives at the #pilot fragment and the early feedback screen at #pilot-feedback. A dedicated subdomain avoids overwriting an existing website at the primary domain.

## Tester flow

1. Open the pilot link on mobile or desktop. Confirm that you are at least 18. Begin OG.1 without creating an account.
2. Experience all five chapters, the ten-question exit assessment (responses are required but correctness does not gate progression), an understanding report, and the final synthesis.
3. At the end, choose **Evaluate the experience** or **Finish without survey**. An overall rating of 1–5 is required only if the learner elects to submit feedback.
4. Learners who cannot finish can submit feedback through the pilot entry page.
5. Survey submissions are confirmed by the server. Draft survey answers are kept in local browser storage for retry on network failure.

The survey measures teaching clarity, structure, navigation, UI/theme, imagery, engagement, narration, assessment, pacing, interest in further lessons, strongest experience, improvement priority, and optional written feedback on successes, changes, confusion and other ideas. Device and participant perspective are optional.

## Hosting requirements before inviting others

- Use a Node 22 or later host for the existing Vite production build **and** Node API. This is not a static-only website. From app, run npm ci, npm run build, and npm run start. The server defaults to port 4173 and responds to the existing teaching, narration, Bible, visual discovery and new survey endpoints.
- Configure HTTPS/TLS and pilot.jeremiah.app DNS at your current domain provider. **Do not replace existing jeremiah.app DNS until the current site and hosting are identified.**
- Keep OPENAI_API_KEY server-side. Pilot usage will involve real third-party API processing and costs. Check quotas, latency, and server-side failure behavior.
- Set PILOT_FEEDBACK_FILE to a **durable, backed-up private volume**, e.g. /var/lib/jeremiah/og1-feedback.jsonl. The default app/.pilot-data/og1-feedback.jsonl is Git-ignored but can disappear when a Codespace or ephemeral container is deleted. Never rely on ephemeral filesystem storage for a public cohort.
- Configure host-level bot protection, a rate limit and optional access gate. The built-in transient limiter helps with duplicate requests but is not production authentication or sophisticated anti-spam. A link alone does not restrict users to invited adults.
- Publish a privacy notice and retention/deletion policy before public access. Feedback submissions intentionally exclude usernames, IP addresses, grades and lesson answers; unstructured comments may still contain volunteered personal details. Lesson written answers are sent to the separate teaching service.
- Pilot access is framed for adults 18+. Age confirmation on the page is not independent proof of age. Establish parental/age compliance before including minors.
- Test one iPhone, one Android device and a computer with an actual hosted HTTPS link, especially audio, video, local resume, exam completion, survey retry and private persisted results.

## Reviewing the feedback privately

From the running app directory with the feedback volume available, run:

    npm run pilot:report

The script prints overall/category averages, improvement priorities, favorite moments and device counts and writes a private CSV beside the stored JSONL file. Never commit or publicly expose raw comments. Revisit recurring complaints and choose the next lesson improvements based on both quantified priorities and open-ended observations.

## Codespaces-only smoke test

Run:

    cd /workspaces/jeremiah-ai-rebuild
    git pull --ff-only origin feature/media-standards-research
    cd app
    npm run build

Open your existing forwarded port 4173 URL and add /#pilot. For development tests you can use npm run start or the existing running Node server. Restart Node after server-side changes. The Codespaces port is for testing, **not** a permanent 400-person public pilot endpoint.

## Launch status

These code changes do not modify DNS or publish a live site. Confirm who manages DNS/hosting and select the pilot hostname, create durable backend storage, configure TLS and test an end-to-end external submission before distributing an invitation.
