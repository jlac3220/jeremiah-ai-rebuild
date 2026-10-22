# Jeremiah Media Standards Enrichment — Pilot

This is a **review-only** implementation of standards-based audio/video research.
It discovers metadata from an editorially approved public channel feed, but does not download video, scrape arbitrary websites, or modify published lessons.

## Implemented

- Load real OG/NB standard contracts from the classroom registry.
- Read a supplied .txt, .srt, or .vtt transcript (including subtitle timestamps).
- Transcribe a local audio/video file that you are authorized to process (mp3, m4a, wav, webm, mp4, ogg, flac, mpeg, mpga; under 24 MB).
- Ask OpenAI to identify concepts and learning activities relevant to a specified standard.
- Reject extracted quotes that are not found in the source transcript and discard unknown standard knowledge IDs.
- Produce a source-linked JSON proposal with an incomplete credibility/doctrine/rights approval checklist.
- Attach a `sourceLocation` to each accepted claim and activity. VTT/SRT or authorized transcription segments yield caption-matched start/end times (even when the excerpt spans adjacent cues); untimed TXT/PDF extracts retain a source URL but **no invented playback timestamp**. Ambiguous repeated quotes have their times withheld.
- Discover prospective videos from BibleProject's public YouTube channel feed alongside videos already referenced in the classroom; match titles/descriptions against existing standards as metadata-only candidates.
- Leave all existing standards, classroom moves, and media untouched.

From the app directory, find possible teaching resources for one standard:

~~~bash
npm run discover:media -- --standard OG.1.1.18
~~~

This fetches **only metadata** from an allowlisted public YouTube Atom feed and includes already-curated classroom videos. It writes a review queue under `.jeremiah-research/` and does **not** require an OpenAI key. The live feed contains only recent uploads, so an older relevant video can appear through the classroom's existing resource catalog but may not appear in the feed.

Candidate scores are basic title/description keyword matches, **not** a theological or factual assessment. Publisher permissions and restrictions, including whether your app may charge for access to embedded media, must be reviewed before using a candidate.

Important: Exact transcript evidence **does not independently verify the claim**. Every output is marked needs_review. Video visuals are not inspected yet.

## Shema / Listen test source — OG.1.1.18

Publisher video: https://bibleproject.com/videos/shema-listen/

Publisher's script references with segment timings:
https://d1bsmz3sdihplr.cloudfront.net/media/Script%20References/word_studies/Shema-Listen_script-references_UPDATED.pdf

Our source metadata and proposed clip boundaries (not an AI transcript analysis):
research/sources/shema-listen.json

To analyze actual spoken content, obtain the transcript legally and save it outside the repository as a plain-text file (e.g. /tmp/shema.txt). The link above is a PDF, not a plaintext file. Do not commit a full copyrighted script to GitHub.

From the app directory:

~~~bash
npm run test:media

npm run research:media -- \
  --standard OG.1.1.18 \
  --transcript /tmp/shema.txt \
  --title "Shema / Listen" \
  --publisher "BibleProject" \
  --url "https://bibleproject.com/videos/shema-listen/" \
  --rights external-reference
~~~

For recordings you own or are authorized to transcribe:

~~~bash
npm run research:media -- \
  --standard OG.1.1.18 \
  --media /path/to/authorized-recording.mp3 \
  --title "Lesson recording" \
  --publisher "Authorized source" \
  --url "https://example.org/original-source" \
  --rights permission \
  --rights-evidence "Consent on file"
~~~

The CLI loads the server-only .env API key and saves a review proposal in .jeremiah-research/ (Git-ignored). It does not output or save the full transcript.

Review exact evidence and `sourceLocation` references. Timestamps are sourced from actual caption/recording cues, not inferred from text or trusted from the AI model; these timestamps do not confirm video frames or that the source is reliable. Independently check historical and linguistic claims, compare doctrinal implications with the standard, and verify permissions for the proposed use before adding anything to a published lesson.

## Not yet implemented

General web search, historical publisher catalog crawling, video frame inspection, multi-standard recommendation, media rights verification, or a review/dashboard approval UI. These are future increments, not capabilities of this pilot.

**Rule:** Outside media may enrich a standard but never quietly rewrite its required doctrine or mastery target.
