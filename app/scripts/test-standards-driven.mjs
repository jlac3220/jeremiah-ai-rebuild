import assert from 'node:assert/strict';
import { CURRICULUM_STUDIES, curriculumContentRegistry } from '../src/core/classroom/content/curriculumContent.js';
import authored from '../src/core/classroom/content/OG_1_LESSON.js';
import { alignAuthoredOrRegenerate, getStandardsPlan, standardSignature } from '../src/core/classroom/content/standardsDrivenLesson.js';
import { createLearningState, loadLearningState, saveLearningState } from '../src/core/classroom/learningEngine.js';
import { validateGroupedLessonBlueprint } from '../src/core/classroom/lessonBlueprint.js';
import { teachWithJeremiah } from '../server/teacherCore.mjs';

const study = CURRICULUM_STUDIES.find(item => item.id === 'OG');
const domain = study.domains.find(item => item.number === 1);
const standards = study.standards.filter(item => item.domain === 1);
const base = curriculumContentRegistry['OG.1.1.18'];
assert.equal(standards.length, 5);
assert.equal(authored.isStandardsGenerated, false, 'Unchanged approved standards retain the cinematic OG.1 lesson');
assert.equal(authored.editorialStatus, 'approved_source');
assert.equal(getStandardsPlan(standards, domain).some(item => item.needsLessonUpdate), false);
assert.deepEqual(authored.coveredStandards.map(item => item.id), standards.map(item => item.id));
assert.equal(validateGroupedLessonBlueprint(authored).valid, true);

const revised = structuredClone(standards);
revised[0].statement += ' [2026 audited emphasis]';
revised[1].evidence[2].text += ' [additional approved criterion]';
const next = alignAuthoredOrRegenerate({ authored, base, standards:revised, domain });
assert.equal(next.isStandardsGenerated, true, 'Approved changes generate a new lesson structure');
assert.equal(next.editorialStatus, 'needs_review', 'Regenerated instruction must be flagged for editorial review');
assert.notEqual(next.sourceRevision, authored.sourceRevision);
assert.equal(next.lessonChapters.length, 5);
assert.deepEqual(next.lessonChapters.map(item => item.standardId), standards.map(item => item.id));
assert.equal(validateGroupedLessonBlueprint(next).valid, true);

for (const [index, standard] of revised.entries()) {
 const moves = next.instructionalMoves.filter(move => move.standardIds?.includes(standard.id));
 assert.deepEqual(moves.map(move => move.phase), ['Show me', 'Guide me', 'Let me try']);
 assert.equal(moves[0].sourceRevision, standardSignature(standard, domain));
 assert.equal(moves[0].teaching[0], standard.scope, 'Show me must use the revised scope');
 assert.equal(moves[0].teaching[1], standard.focus, 'Show me must use the revised teaching focus');
 assert.ok(moves[1].choices.some(item => item.label === standard.statement));
 assert.deepEqual(moves[2].assessmentCriteria, standard.evidence.map(item => item.text));
 assert.deepEqual(moves[2].evidenceIds, standard.evidence.map(item => standard.id + ':evidence-' + item.level));
 assert.ok(moves[2].prompt.includes(standard.statement));
 assert.equal(moves[2].next.strong, index === revised.length - 1 ? 'complete' : next.lessonChapters[index + 1].standardId.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().replace(/^/, 'source-') + '-show');
}

const storage = new Map();
globalThis.window = {localStorage:{
 getItem:key => storage.get(key) || null,
 setItem:(key, value) => storage.set(key, value),
 removeItem:key => storage.delete(key)
}};
const complete = createLearningState(authored);
complete.currentMoveId = 'complete';
complete.milestones.complete = true;
complete.milestones.mastery = true;
complete.experience.drafts = { 'shema-try': { responseText: 'Original answer preserved' } };
complete.experience.standardEvidence = { 'OG.1.1.18': { evidenceIds: ['OG.1.1.18:evidence-1'] } };
saveLearningState(complete);
const reset = loadLearningState(next);
assert.equal(reset.currentMoveId, next.instructionalMoves[0].id);
assert.equal(reset.milestones.complete, false, 'New standards must require new mastery evidence');
assert.equal(reset.milestones.mastery, false);
assert.equal(reset.experience.earlierLesson.drafts['shema-try'].responseText, 'Original answer preserved');
assert.equal(Object.keys(reset.experience.standardEvidence || {}).length, 0);
assert.equal(reset.sourceRevision, next.sourceRevision);
saveLearningState(reset);
assert.equal(loadLearningState(next).sourceRevision, next.sourceRevision, 'Unchanged draft does not continuously reset');

// Another change with the same numeric curriculumVersion must still trigger reassessment.
const revisedAgain = structuredClone(revised);
revisedAgain[4].focus += ' [newly audited instructional emphasis]';
const another = alignAuthoredOrRegenerate({authored, base, standards:revisedAgain, domain});
assert.equal(another.curriculumVersion, next.curriculumVersion);
assert.notEqual(another.sourceRevision, next.sourceRevision);
const furtherReset = loadLearningState(another);
assert.equal(furtherReset.sourceRevision, another.sourceRevision);
assert.equal(furtherReset.currentMoveId, another.instructionalMoves[0].id);

const previousKey = process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;
try {
 const fallback = await teachWithJeremiah({
  standardId:'OG.1.LESSON.18', moveId:'shema-try',
  learnerResponse:{text:'One Lord. God is one. No other God. Isaiah. Deuteronomy 6:4.'}
 });
 assert.equal(fallback.verdict, 'partial', 'Offline keyword matching must not award grouped-standard mastery');
 assert.deepEqual(fallback.evidenceObserved, []);
} finally {
 if(previousKey) process.env.OPENAI_API_KEY=previousKey;
}
console.log('PASS: approved OG.1 preserved, revised standards rebuild all five lesson chapters, all 20 rubric criteria update, old work archives, changed standards demand new mastery, offline fallback awards none.');
