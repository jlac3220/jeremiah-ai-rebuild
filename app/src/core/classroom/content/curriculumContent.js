import og from '../../../data/curriculum/og.json' with { type: 'json' };
import nb from '../../../data/curriculum/nb.json' with { type: 'json' };
export const CURRICULUM_STUDIES = [og, nb];

function task(text) {
  return text.replace(/^(?:The student|The learner)\s+/i, '').replace(/^Demonstrates\b/, 'Demonstrate').replace(/^Explains\b/, 'Explain').replace(/^Shows\b/, 'Show').replace(/^Responds\b/, 'Respond').replace(/^States\b/, 'State').replace(/^Identifies\b/, 'Identify').replace(/^Presents\b/, 'Present').replace(/^Articulates\b/, 'Articulate').replace(/^Connects\b/, 'Connect').replace(/^Defends\b/, 'Defend');
}
function makeContent(study, standard) {
  const domain = study.domains.find((d) => d.number === standard.domain);
  const evidence = standard.evidence;
  const scripture = domain.scripture.map((v, index) => ({ id: `${standard.id}-verse-${index}`, reference: v.reference, text: v.excerpt, note: v.function }));
  const others = study.standards.filter((s) => s.domain === standard.domain && s.id !== standard.id).slice(0, 2);
  const choices = [{ id: 'target', label: standard.statement }, ...others.map((s, i) => ({ id: `other-${i}`, label: s.statement }))];
  // Rotate placement by standard number, so the target is not always first.
  const rotate = Number(standard.id.split('.')[2]) % choices.length;
  choices.push(...choices.splice(0, rotate));
  const brain = {
    essentialQuestion: `What does Scripture teach about ${standard.title.replace(/^Synthesis:\s*/, '').replace(/\.$/, '')}?`,
    masteryTarget: standard.statement,
    requiredKnowledge: evidence.map((e) => ({ id: `evidence-${e.level}`, title: e.label, description: e.text })),
    requiredScripture: scripture,
    misconceptions: [],
    evidenceOfUnderstanding: evidence.map((e) => ({ id: `evidence-${e.level}`, description: e.text })),
    teacherGuardrails: ['Teach within the uploaded Apostolic formation standard.', 'Scripture establishes doctrine; outside media provides context only.', 'Evaluate the entire explanation against the standard and its scope; do not award mastery for keywords.'],
  };
  const moves = [
    { id: 'learn', type: 'teach', stageId: 'truth', title: standard.title, body: standard.scope, next: { continue: 'scripture' } },
    { id: 'scripture', type: 'teach', stageId: 'scripture', title: 'Follow the witness of Scripture', body: standard.focus, scripture, next: { continue: 'sources' } },
    { id: 'sources', type: 'teach', stageId: 'scripture', title: 'See the setting. Make the connection.', next: { continue: 'check' } },
    { id: 'check', type: 'scenario', stageId: 'checkpoint', title: 'Name the central truth', prompt: 'Which statement expresses the specific truth this lesson is establishing?', choices, expectedChoiceIds: ['target'], evidenceIds: ['evidence-1'], next: { strong: 'explain', partial: 'check', weak: 'check' } },
    { id: 'explain', type: 'free_response', stageId: 'checkpoint', title: 'Explain it clearly', prompt: task(evidence.find((e) => e.level === 2).text), scripture, evidenceIds: ['evidence-2'], next: { strong: 'apply', partial: 'explain', weak: 'explain' } },
    { id: 'apply', type: 'free_response', stageId: 'checkpoint', title: 'Carry the truth into practice', prompt: task(evidence.find((e) => e.level === 3).text), scripture, evidenceIds: ['evidence-3'], next: { strong: 'defend', partial: 'apply', weak: 'apply' } },
    { id: 'defend', type: 'mastery_response', stageId: 'mastery', title: 'Hold the truth with clarity', prompt: task(evidence.find((e) => e.level === 4).text), scripture, evidenceIds: ['evidence-4'], next: { strong: 'complete', partial: 'defend', weak: 'defend' } },
    { id: 'complete', type: 'complete', stageId: 'mastery', title: 'This lesson is complete.' },
  ];
  const presets = Object.fromEntries(['direct', 'resume', 'review', 'adaptation'].map((id) => [id, { currentStageId: id === 'review' ? 'checkpoint' : 'truth', currentMoveId: id === 'review' ? 'check' : 'learn', learnerLevel: '.18 Readiness', verses: scripture, truthExplanation: standard.scope, checkpoint: { title: standard.title, prompt: standard.statement } }]));
  return { studyId: study.id, studyTitle: study.title, domainId: domain.id, standardId: standard.id, standardTitle: standard.title, truthStatement: standard.statement, brain, instructionalMoves: moves, presets, sourceStandard: standard, sourceDomain: domain, sourceDocument: { file: study.sourceFile, sha256: study.sourceSha256 } };
}
export const curriculumContentRegistry = Object.fromEntries(CURRICULUM_STUDIES.flatMap((study) => study.standards.map((standard) => [standard.id, makeContent(study, standard)])));
