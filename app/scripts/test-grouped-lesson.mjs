import assert from 'node:assert/strict';
import content from '../src/core/classroom/content/OG_1_LESSON.js';
import {createLearningState,saveLearningState,loadLearningState} from '../src/core/classroom/learningEngine.js';
import {evaluateTeachingChoice,saveTeachingDecision,continueTeaching,restartTeaching} from '../src/core/classroom/teacherLedEngine.js';
import {getLearningDashboard} from '../src/core/classroom/learningDashboard.js';
import {teachWithJeremiah} from '../server/teacherCore.mjs';
const saved=new Map();globalThis.window={localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)}};
for(const standard of content.coveredStandards){
 for(const phase of ['Show me','Guide me','Let me try'])assert.ok(content.instructionalMoves.some(m=>m.phase===phase && m.standardIds?.includes(standard.id)),`${standard.id}: missing ${phase}`);
 const assessed=content.instructionalMoves.filter(m=>m.phase==='Let me try' && m.standardIds.includes(standard.id)).flatMap(m=>m.evidenceIds);
 for(const e of standard.evidence)assert.ok(assessed.includes(`${standard.id}:evidence-${e.level}`),'Every source criterion must remain assessable');
}
let state=createLearningState(content);
while(state.currentMoveId!=='complete'){
 const move=content.instructionalMoves.find(m=>m.id===state.currentMoveId);
 if(move.type==='teach'){state=continueTeaching(state,content);continue;}
 if(move.interaction?.type==='reasoning'){
  const task=move.interaction;
  for(const claim of task.claims)for(const reason of task.reasons){
   const response=evaluateTeachingChoice(move,{claimId:claim.id,reasonId:reason.id});
   const correct=claim.id===task.answer.claim && reason.id===task.answer.reason;
   assert.equal(response.verdict,correct?'strong':'weak','A correct conclusion with a wrong reason cannot pass');
   assert.equal(response.evidenceObserved.length,0,'Practice is not independent mastery');
   const attempted=saveTeachingDecision(state,content,move,response);
   saveLearningState(attempted);const restored=loadLearningState(content);
   assert.deepEqual(restored.experience.teachingDecision.decision.itemResults,response.itemResults);
   assert.equal(continueTeaching(restored,content).currentMoveId,correct?move.next.strong:move.id);
  }
  assert.equal(evaluateTeachingChoice(move,{}).verdict,'weak');
  const learnerResponse={claimId:task.answer.claim,reasonId:task.answer.reason};
  const api=await teachWithJeremiah({standardId:content.standardId,moveId:move.id,learnerResponse});assert.equal(api.verdict,'strong');
  state=saveTeachingDecision(state,content,move,api);
 }else if(move.interaction){
  const missing=evaluateTeachingChoice(move,{placements:{}});assert.equal(missing.verdict,'weak');
  let wrong=saveTeachingDecision(state,content,move,missing);wrong=continueTeaching(wrong,content);assert.equal(wrong.currentMoveId,move.id);assert.equal(wrong.evidenceIds.length,state.evidenceIds.length);
  const placements=Object.fromEntries(move.interaction.items.map(i=>[i.id,i.answer]));
  const response=evaluateTeachingChoice(move,{placements});assert.equal(response.verdict,'strong');
  const api=await teachWithJeremiah({standardId:content.standardId,moveId:move.id,learnerResponse:{placements}});assert.equal(api.verdict,'strong');
  state=saveTeachingDecision(state,content,move,response);
  saveLearningState(state);state=loadLearningState(content);assert.equal(state.experience.teachingDecision.moveId,move.id);
 }else if(move.authoredFeedback){
  const bad=evaluateTeachingChoice(move,{choiceIds:[move.choices.find(c=>!move.expectedChoiceIds.includes(c.id)).id]});assert.equal(bad.verdict,'weak');
  const good=evaluateTeachingChoice(move,{choiceIds:move.expectedChoiceIds});state=saveTeachingDecision(state,content,move,good);
 }else{
  const rubric={verdict:'strong',teacherMessage:'Fixture: criteria met',evidenceObserved:move.evidenceIds};
  const incomplete=saveTeachingDecision(state,content,move,{...rubric,evidenceObserved:[]});assert.equal(incomplete.experience.teachingDecision.decision.verdict,'partial');
  const supported={...state,experience:{...state.experience,drafts:{[move.id]:{usedSupport:true,responseText:'Supported draft'}}}};
  const held=saveTeachingDecision(supported,content,move,rubric);assert.equal(held.experience.teachingDecision.decision.verdict,'partial');
  const retry=continueTeaching(held,content);assert.equal(retry.currentMoveId,move.id);assert.equal(retry.experience.drafts[move.id].responseText,'');assert.equal(retry.experience.drafts[move.id].supportedResponse,'Supported draft');
  state=saveTeachingDecision(state,content,move,rubric);
  assert.ok(state.experience.standardEvidence[move.standardIds[0]]);
 }
 state=continueTeaching(state,content);
}
assert.equal(Object.keys(state.experience.standardEvidence).length,5);
assert.equal(state.evidenceIds.length,20);assert.ok(state.milestones.complete);
saveLearningState(state);assert.equal(loadLearningState(content).currentMoveId,'complete');
const dashboard=getLearningDashboard();assert.equal(dashboard.standards.filter(s=>s.content.domainId==='OG.1').length,1);
assert.equal(dashboard.mastered,1);
assert.equal(loadLearningState(content,'review').currentMoveId,'learn');
const partiallyDone={...state,currentMoveId:'prayer-challenge',presetId:'direct',experience:{...state.experience,drafts:{'shema-try':{responseText:'Keep this answer'}}}};
const restarted=restartTeaching(content,partiallyDone);
assert.equal(restarted.currentMoveId,'learn');assert.equal(restarted.experience.drafts['shema-try'],undefined);
assert.equal(restarted.experience.earlierLesson.drafts['shema-try'].responseText,'Keep this answer');
const restartedAgain=restartTeaching(content,{...restarted,experience:{...restarted.experience,drafts:{'isaiah-try':{responseText:'Second saved answer'}}}});
assert.equal(restartedAgain.experience.previousRuns[0].drafts['shema-try'].responseText,'Keep this answer');
assert.equal(restartedAgain.experience.earlierLesson.drafts['isaiah-try'].responseText,'Second saved answer');
assert.equal(restartTeaching(content,{...state,presetId:'review',milestones:{...state.milestones,complete:true}}).milestones.mastery,true);
console.log('Grouped OG.1: five standards, all three teaching phases, twenty rubric criteria, wrong answers, supported attempts, per-standard evidence, resume and dashboard deduplication passed. AI grading used fixtures, not a live model.');
