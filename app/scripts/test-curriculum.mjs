import assert from 'node:assert/strict';
import { CURRICULUM_STUDIES } from '../src/core/classroom/content/curriculumContent.js';
import { classroomContentRegistry } from '../src/core/classroom/content/classroomContentRegistry.js';
import { resolveCurriculumReference } from '../src/core/bible/curriculumReferences.js';
import { parseBibleReference } from '../src/core/bible/bibleReaderIntent.js';
import { getLessonMedia } from '../src/data/curriculum/mediaCatalog.js';
import { createLearningState, saveLearningState, loadLearningState, advanceLearningState, advanceUnscoredMove } from '../src/core/classroom/learningEngine.js';
import { teachWithJeremiah } from '../server/teacherCore.mjs';
const saved = new Map();
globalThis.window = { localStorage: { getItem: key=>saved.get(key)||null, setItem:(key,value)=>saved.set(key,value) } };
assert.equal(CURRICULUM_STUDIES.reduce((n,s)=>n+s.standards.length,0),126);
assert.equal(CURRICULUM_STUDIES.reduce((n,s)=>n+s.domains.length,0),31);
for (const study of CURRICULUM_STUDIES) {
  for (const domain of study.domains) {
    assert.ok(domain.vocabulary.length >= 5, domain.id+' vocabulary');
    assert.ok(domain.scripture.length >= 7, domain.id+' Scripture');
    for (const verse of domain.scripture) {
      const ref = resolveCurriculumReference(verse.reference);
      assert.ok(ref.chapter <= ref.book.chapters);
      assert.equal(parseBibleReference(ref.reference).endVerse,ref.endVerse);
    }
  }
  for (const standard of study.standards) {
    assert.deepEqual(standard.evidence.map(e=>e.level),[1,2,3,4]);
    assert.ok(standard.scope && standard.focus && standard.statement);
    const content=classroomContentRegistry[standard.id];
    if (!content.sourceStandard) continue; // Original curated Shema lesson has its own smoke test.
    assert.ok(getLessonMedia(content).length,standard.id+' reinforcement');
    let state=createLearningState(content);
    for (const id of ['learn','scripture','sources']) state=advanceUnscoredMove(state,content.instructionalMoves.find(m=>m.id===id));
    assert.equal(state.currentMoveId,'check');
    const check=content.instructionalMoves.find(m=>m.id==='check');
    state=advanceLearningState(state,check,{verdict:'weak',strategy:'encourage_retry',misconceptionIds:[],evidenceObserved:[]});
    assert.equal(state.currentMoveId,'check','Wrong recognition answer must not advance');
    state=advanceLearningState(state,check,{verdict:'strong',strategy:'affirm_and_deepen',misconceptionIds:[],evidenceObserved:['evidence-1']});
    assert.equal(state.currentMoveId,'explain');
    saveLearningState(state);
    assert.equal(loadLearningState(content).currentMoveId,'explain');
    assert.equal(loadLearningState(content,'review').currentMoveId,'check','Review state stays independent');
    for(const id of ['explain','apply','defend']) {
      const move=content.instructionalMoves.find(m=>m.id===id);
      const retry=advanceLearningState(state,move,{verdict:'partial',strategy:'clarify',misconceptionIds:[],evidenceObserved:[]});
      assert.equal(retry.currentMoveId,id);
      state=advanceLearningState(state,move,{verdict:'strong',strategy:'affirm_and_deepen',misconceptionIds:[],evidenceObserved:move.evidenceIds});
    }
    assert.equal(state.currentMoveId,'complete');
  }
}
const previousKey=process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;
try {
 const decision=await teachWithJeremiah({standardId:'NB.5.1.18',moveId:'defend',learnerResponse:{text:'God is one. Jesus is God. One God.'}});
 assert.equal(decision.verdict,'partial');
 assert.equal(decision.evidenceObserved.length,0,'Unavailable assessment must not grant mastery');
 assert.match(decision.teacherMessage,/not been marked as mastered/);
} finally {if(previousKey) process.env.OPENAI_API_KEY=previousKey;}
console.log('Curriculum: 126 standards, 31 domains, Scripture ranges, vocabulary, reinforcement, independent saves and assessment retries passed.');
