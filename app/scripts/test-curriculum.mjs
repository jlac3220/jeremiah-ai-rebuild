import assert from 'node:assert/strict';
import { CURRICULUM_STUDIES } from '../src/core/classroom/content/curriculumContent.js';
import { classroomContentRegistry } from '../src/core/classroom/content/classroomContentRegistry.js';
import { resolveCurriculumReference } from '../src/core/bible/curriculumReferences.js';
import { parseBibleReference } from '../src/core/bible/bibleReaderIntent.js';
import { getLessonMedia } from '../src/data/curriculum/mediaCatalog.js';
import { createLearningState, saveLearningState, loadLearningState, advanceLearningState, advanceUnscoredMove } from '../src/core/classroom/learningEngine.js';
import { getTeachingPlan } from '../src/data/curriculum/teachingPlans.js';
import { classroomResources } from '../src/data/curriculum/classroomResources.js';
import { getLessonExperience } from '../src/core/classroom/content/lessonExperience.js';
import { getInteractiveActivities, evaluateInteractiveActivity } from '../src/data/curriculum/interactiveActivities.js';
import {getLessonFrame, LESSON_PHASES} from '../src/core/classroom/lessonBlueprint.js';
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
    assert.equal(getLessonFrame(content,content.instructionalMoves[0],{}).chapterCount,1,standard.id+' curriculum chapter');
    for(const [id,phase] of [['learn','Show me'],['scripture','Guide me'],['sources','Guide me'],['check','Let me try']]) {
      const curr=content.instructionalMoves.find(m=>m.id===id);
      if(curr) assert.equal(getLessonFrame(content,curr,{}).phase,phase,standard.id+' phase '+id);
    }
    assert.deepEqual(LESSON_PHASES,['Show me','Guide me','Let me try']);
    assert.ok(getTeachingPlan(content).encounter);
    assert.equal(getLessonExperience(content).witnesses.length,3);
    assert.equal(getLessonExperience(content).vocabulary.length,3);
    if(content.sourceStandard) {
      const exercises=getInteractiveActivities(content);
      assert.ok(exercises.length>=1,standard.id+': missing formative practice');
      for(const activity of exercises) {
        assert.ok(['match','sort','order','blank'].includes(activity.kind),standard.id+': unknown activity');
        assert.ok(activity.id && activity.title && activity.instruction,standard.id+': missing activity instructions');
        let correct;
        let wrong;
        if(activity.kind==='match') {
          assert.ok(activity.pairs.length>=2,standard.id+': too few matches');
          assert.equal(new Set(activity.pairs.map(p=>p.id)).size,activity.pairs.length);
          correct=Object.fromEntries(activity.pairs.map(p=>[p.id,p.id]));
          wrong={...correct,[activity.pairs[0].id]:'incorrect'};
        } else if(activity.kind==='sort') {
          assert.ok(activity.groups.length>=2 && activity.items.length>=3);
          correct=Object.fromEntries(activity.items.map(p=>[p.id,p.group]));
          wrong={...correct,[activity.items[0].id]:activity.groups.find(g=>g.id!==activity.items[0].group).id};
        } else if(activity.kind==='order') {
          assert.ok(activity.items.length>=3);
          correct={order:activity.items.map(p=>p.id)};
          wrong={order:[...correct.order].reverse()};
        } else {
          assert.ok(activity.before && Array.isArray(activity.options) && activity.options.includes(activity.answer));
          correct={choice:activity.answer};
          wrong={choice:activity.options.find(x=>x!==activity.answer)};
        }
        assert.equal(evaluateInteractiveActivity(activity,correct),true,standard.id+' '+activity.id+': correct answer');
        assert.equal(evaluateInteractiveActivity(activity,wrong),false,standard.id+' '+activity.id+': wrong answer');
        assert.equal(evaluateInteractiveActivity(activity,{}),false,standard.id+' '+activity.id+': unanswered must not pass');
      }
    }

    assert.ok(getLessonMedia(content).every(s=>s.review.status==='approved'),standard.id+' reviewed reinforcement');
    if (content.lessonFormat === 'teacher-led') continue; // Full branching and rubric tests live in test-teacher-led.mjs.
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
for(const resource of classroomResources) {
 assert.equal(resource.review.status,'approved');
 assert.ok(resource.standards.length<=2,'Resources need intentional, limited placement');
 for(const id of resource.standards) assert.ok(classroomContentRegistry[id]);
}
for(const specialId of ['OG.1.LESSON.18','NB.1.1.18']) {
 const special=classroomContentRegistry[specialId];
 assert.equal(special.lessonFormat,'teacher-led');
 assert.ok(getInteractiveActivities(special).length>0,specialId+': teacher-led practice missing');
}
const shemaMedia=getLessonMedia(classroomContentRegistry['OG.1.LESSON.18']);
assert.deepEqual(shemaMedia.map(item=>item.id),['unpacked-shema'],'The Shema context video is placed in the combined lesson learners open from the OG.1 room');
assert.equal(shemaMedia[0].review.doctrinalAlignment,'context-only','Context video must not be treated as the doctrinal authority');
assert.match(shemaMedia[0].embedUrl,/youtube-nocookie\.com\/embed\/8bN1LfiNQSk/,'The reviewed clip uses an embedded privacy-enhanced player');
assert.equal(shemaMedia[0].lessonCheck.answerId,'practice','The in-app check reinforces the source’s historical-context role');
assert.deepEqual(getLessonMedia(classroomContentRegistry['OG.1.1.18']),[],'The Shema context video is not duplicated in the legacy standalone lesson');
const otherOGLesson=Object.values(classroomContentRegistry).find(content=>content.studyId==='OG' && content.standardId!=='OG.1.1.18' && content.standardId!=='OG.1.LESSON.18');
assert.ok(otherOGLesson,'Another OG lesson exists for checking media placement');
assert.deepEqual(getLessonMedia(otherOGLesson),[],'The Shema video must not be repeated in other domains');
const previousKey=process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;
try {
 const decision=await teachWithJeremiah({standardId:'NB.5.1.18',moveId:'defend',learnerResponse:{text:'God is one. Jesus is God. One God.'}});
 assert.equal(decision.verdict,'partial');
 assert.equal(decision.evidenceObserved.length,0,'Unavailable assessment must not grant mastery');
 assert.match(decision.teacherMessage,/not been marked as mastered/);
} finally {if(previousKey) process.env.OPENAI_API_KEY=previousKey;}
console.log('Curriculum: 126 standards, 31 domains, reusable interactive practice, Scripture, independent saves and assessment retries passed.');
