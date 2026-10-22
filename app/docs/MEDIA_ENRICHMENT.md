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

This fetches **only metadata** from an allowlisted public YouTube Atom feed, includes already-curated classroom videos, and also reads a local `research/sources/publisher-catalog.json` index of older videos checked against official publisher pages. The archive index currently adds `YHWH / LORD` and `1st Commandment: No Other Gods` as *provisional* OG.1.1.18 topical candidates. It writes a review queue under `.jeremiah-research/` and does **not** require an OpenAI key. The live feed contains only recent uploads; the archive index is a manually checked starting point, **not** automatic historical catalog crawling.

Candidates are filtered for a distinctive concept in the standard's title or an exact Scripture reference (or multiple supporting metadata terms), so vague overlaps such as generic language or prophetic themes are omitted. This conservative filter can also miss relevant resources; scores remain **metadata-only**, not theological or factual assessments. Publisher permissions and restrictions, including whether your app may charge for access to embedded media, must be reviewed before using a candidate.

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

The review JSON now preserves the model's summary, distinguishes `modelRelevance` from accepted-evidence `relevance`, and reports an `assessment` of `review-proposal`, `insufficient-source-evidence`, or `no-enrichment-identified`. This prevents unsupported PDF-extracted quotations being misreported as definitive evidence that a video lacks educational value. It also tracks accepted and rejected proposals in `evidenceReview`. The matcher tolerates punctuation and PDF line breaks but still requires the same word sequence, not a paraphrase.

Review exact evidence and `sourceLocation` references. Timestamps are sourced from actual caption/recording cues, not inferred from text or trusted from the AI model; these timestamps do not confirm video frames or that the source is reliable. Independently check historical and linguistic claims, compare doctrinal implications with the standard, and verify permissions for the proposed use before adding anything to a published lesson.

## Apostolic channel extraction pilot — Promise Church

Source: https://www.youtube.com/@Promiseapostolic/videos

This opt-in workflow is separate from the BibleProject recent-upload feed. It uses
the open-source **yt-dlp** CLI to list a bounded number of public channel videos.
A full channel may contain hundreds of uploads; flat-playlist mode reads metadata,
not media content. YouTube rate limits, unavailable captions and changed layouts
may cause failures. Nothing is inserted into a classroom automatically.

One-time installation in a **temporary virtual environment** (from Codespaces):

~~~bash
python3 -m venv /tmp/jeremiah-yt && /tmp/jeremiah-yt/bin/pip install -q -U yt-dlp
~~~

Inventory up to 80 recent channel videos, optionally searching the extracted titles
for a standard's distinctive concepts or cited Scriptures:

~~~bash
npm run extract:youtube -- \
  --channel https://www.youtube.com/@Promiseapostolic/videos \
  --limit 80 --standard OG.1.1.18 \
  --binary /tmp/jeremiah-yt/bin/yt-dlp
~~~

The JSON catalog is written under the gitignored .jeremiah-research directory;
the first 25 titles are printed in the terminal. All videos remain discovery
candidates with an unapproved checklist. Title matching is just triage; sermons
can contain useful teaching even when their titles are generic, so check the inventory.

For a specific public video, retrieve any publicly accessible human or
automatic English VTT caption files without downloading the video:

~~~bash
npm run extract:youtube -- \
  --video VIDEO_ID \
  --binary /tmp/jeremiah-yt/bin/yt-dlp
~~~

That outputs the caption file path (if YouTube provides one). Automatic
captions may be inaccurate and are not guaranteed for livestreams.

After checking source identity, context and permission to analyze the captions,
pass the resulting VTT to the existing grounded research pipeline:

~~~bash
npm run research:media -- \
  --standard OG.1.1.18 \
  --transcript .jeremiah-research/youtube-captions/VIDEO_ID.en.vtt \
  --title "Actual video title" --publisher "Promise Church" \
  --url "https://www.youtube.com/watch?v=VIDEO_ID" \
  --rights external-reference
~~~

Do not use an invented VIDEO_ID; substitute an exact returned catalog ID.
No claim or playback timestamp is accepted without matching caption text. Publisher
permission to embed or reuse footage is distinct from permission to analyze
publicly accessible metadata and captions. Do not rehost videos or publish
transcript text without verifying reuse rights.

## When YouTube blocks captions: owner-authorized original recordings

Some videos require YouTube bot verification even for public captions, including
the Promise Church recording JSFGj1qFbQ0. Do not depend on bypassing
verification or providing login cookies. We could not verify the spoken
content of that sermon.

If you control the channel, ask its owner for original MP3/MP4 recordings
(or export your own videos from YouTube Studio / Takeout). Having the channel
title or its public video URL does not itself grant permission to download,
rehost, transcribe, or republish copyrighted material.

From Codespaces, ensure ffmpeg and ffprobe are installed. The application
now supports converting a **locally supplied, authorized original recording**
into <=10-minute 48 kbps audio chunks and requesting timestamped OpenAI
Whisper transcription. It automatically deletes temporary audio after
transcription, keeps the resulting VTT in the gitignored
.jeremiah-research directory, and **does not** upload any media to GitHub.
Every audio chunk sends content to OpenAI under the account's API key; API
usage is chargeable and requires appropriate permissions. A default limit of
90 minutes prevents unexpectedly transcribing longer recordings; use
--max-minutes only to explicitly raise the limit (up to 240 minutes).

~~~bash
npm run transcribe:sermon -- \
  --media /path/to/authorized-sermon.mp4 \
  --title "Actual sermon title" \
  --publisher "Promise Church" \
  --url "https://www.youtube.com/watch?v=VIDEO_ID" \
  --rights permission \
  --rights-evidence "Documented permission from owner"
~~~

After checking the returned VTT path, call the existing research command:

~~~bash
npm run research:media -- \
  --standard NB.1.1.18 \
  --transcript .jeremiah-research/authorized-sermon-captions/sermon-ID.vtt \
  --title "Actual sermon title" --publisher "Promise Church" \
  --url "https://www.youtube.com/watch?v=VIDEO_ID" --rights external-reference
~~~

The chosen standard must match the actual transcript subject; do not assume
it matches from the sermon title alone. Automatic speech recognition and
ten-minute file boundaries can produce imperfect timings and words. Do not
represent an extracted quotation or timestamp as independently verified.
The analysis remains human-review-only.

If the owner cannot supply an original recording, YouTube's normal
**Show transcript** interface may be used to export a transcript manually
where available. Save it as an untracked .txt file and run research:media;
a plain-text transcript has **no defensible playback timestamps**.

## Not yet implemented

General web search, historical publisher catalog crawling, video frame inspection, multi-standard recommendation, media rights verification, or a review/dashboard approval UI. These are future increments, not capabilities of this pilot.

**Rule:** Outside media may enrich a standard but never quietly rewrite its required doctrine or mastery target.
