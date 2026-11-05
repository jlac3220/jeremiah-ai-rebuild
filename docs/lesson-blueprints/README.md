# Jeremiah AI — Lesson Blueprint System

**Governing rule:** One reviewed and owner-approved instructional blueprint for **each standard** must exist before Codex builds or substantively rewrites the lesson that teaches it.

## Source of truth and ownership

1. **Standards remain authoritative.** Use the existing curriculum source files in `app/src/data/curriculum/` (including `og.json`, `nb.json`). A blueprint must quote the exact standard ID, statement, and source path. It must not silently amend the standards.
2. **ChatGPT + project owner lead instructional design.** They define outcomes, scriptural reasoning, learning progression, activities, assessments, mastery, accessibility, and review criteria.
3. **Codex leads implementation.** It converts **approved** blueprints into tested, responsive features, with visual/media choices in service of the intended learning. It must flag ambiguities and seek approval before altering teaching claims or assessment targets.
4. **Learner feedback informs revisions.** Analytics and survey insights are evidence for improvement, not automatic authority to weaken standards.
5. **Existing features are preserved** until reviewed. The OG.1 prototype is a valuable implementation to align against blueprints, not something to delete or blindly replace.

## Blueprint lifecycle

`DRAFT → REVIEW REQUESTED → OWNER APPROVED → CODE IMPLEMENTED → VERIFIED AGAINST BLUEPRINT`

- Mark each blueprint with a status and revision. **Only the owner may approve** theological/instructional content.
- A draft is *not* permission for Codex to implement it.
- Make a new pull request for material blueprint revisions; keep an audit trail.
- If a completed lesson deviates from the approved blueprint, either revise the implementation or submit the proposed blueprint change for reapproval.
- Protect production and the archived pre-Codex branch. No automatic deployment or merges.

## Minimum blueprint requirements

Use [TEMPLATE.md](TEMPLATE.md). Each blueprint must specify:

- Exact standard statement, evidence levels, prerequisites, boundaries and overlapping standards.
- A **student-facing destination**: what the learner should genuinely be able to *do*, not just what screens they should see.
- Scriptural evidence with KJV and interpretive sequence; label optional enrichment separately.
- Instructional arc: hook → investigation → explicit teaching → meaningful interaction → retrieval → independent transfer → reflection/closure.
- At least one **observable assessment** aligned to each relevant evidence level; diagnostic, formative, and summative roles must not be conflated.
- Criteria for evidence-based feedback, misconception handling, remediation, and learner progression.
- DOK and the standard's existing performance levels as **separate dimensions** (do not falsely equate them).
- Media/art direction for the *specific* biblical scene, accessibility, narration, and responsive interactions.
- Approval checklist and implementer acceptance tests.

## A standard is not automatically a whole lesson

For a composite lesson such as **OG.1**, preserve a separate blueprint for each of its standards (OG.1.1.18 through OG.1.5.18). Then create a **lesson composition map** showing sequence, transitions, coverage, shared assets, and domain-level assessment. A domain-level ten-question exit test cannot, by itself, demonstrate four distinct levels of understanding for every standard.

## OG.1 pilot — full draft set (not yet approved)

| File | Standard | Status |
|---|---|---|
| [OG.1.1.18.md](OG.1.1.18.md) | The Shema as Doctrinal Foundation | **DRAFT** |
| [OG.1.2.18.md](OG.1.2.18.md) | Isaiah’s Monotheistic Declarations | **DRAFT** |
| [OG.1.3.18.md](OG.1.3.18.md) | New Testament Continuity | **DRAFT** |
| [OG.1.4.18.md](OG.1.4.18.md) | Oneness vs. Trinitarianism | **DRAFT** |
| [OG.1.5.18.md](OG.1.5.18.md) | Unity of God and Undivided Devotion | **DRAFT** |
| [OG.1.MASTER-LESSON.md](OG.1.MASTER-LESSON.md) | Five-standard composition, teaching flow and assessment architecture | **DRAFT** |
| [OG.1.ALIGNMENT-REVIEW.md](OG.1.ALIGNMENT-REVIEW.md) | Existing 19-move pilot versus proposed blueprints; preserve/adjust gaps | **DRAFT** |

These are **five distinct standard-level instructional blueprints**, not five separate apps. The composition map describes how to teach them as one flowing OG.1 experience without teaching redundancy.

**Review gate:** Draft content, questions and source interpretations must be reviewed and explicitly approved by the project owner. Codex may inspect the drafts to understand direction, but may **not** modify instructional functionality based on these drafts until their exact revisions are approved. The existing app, assessments, survey, deployment and preserved historical branches remain untouched by this documentation work.

Next, review the complete set as an instructional unit, prioritize needed edits, then agree on the minimal implementation gap matrix before Codex changes any lesson.

This framework creates *documentation only*. It does not change the running application.
