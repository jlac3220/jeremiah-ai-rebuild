import assert from 'node:assert/strict';
import content from '../src/core/classroom/content/NB_1_1_18.js';
import { createLearningState, loadLearningState, saveLearningState, getInstructionalMove, getStandardProgress, updateLearningExperience } from '../src/core/classroom/learningEngine.js';
import { evaluateTeachingChoice, saveTeachingDecision, continueTeaching, restartTeaching } from '../src/core/classroom/teacherLedEngine.js';
import { teachWithJeremiah } from '../server/teacherCore.mjs';
const storage=new Map();
globalThis.window={localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}};
const moveFor=id=>getInstructionalMove(content,id);
function respond(state,id){const move=moveFor(state.currentMoveId);return saveTeachingDecision(state,content,move,evaluateTeachingChoice(move,{choiceIds:[id]}));}

// Every authored answer teaches specifically; wrong answers route into another example.
for(const move of content.instructionalMoves.filter(m=>m.authoredFeedback)) {
 const initial={...createLearningState(content),currentMoveId:move.id};
 assert.equal(continueTeaching(initial,content),initial,'A question cannot be skipped');
 const messages=new Set();
 for(const choice of move.choices){
  let state=respond(initial,choice.id);messages.add(state.experience.teachingDecision.decision.teacherMessage);
  assert.equal(state.currentMoveId,move.id,'Feedback must be read before moving on');
  assert.equal(state.attemptsByMove[move.id],1);
  assert.equal(respond(state,choice.id),state,'Double submission must not duplicate evidence');
  saveLearningState(state);
  state=loadLearningState(content);
  assert.equal(state.experience.teachingDecision.decision.teacherMessage,choice.teachingMessage,'Feedback survives refresh');
  const correct=move.expectedChoiceIds.includes(choice.id);
  assert.equal(state.completedMoveIds.includes(move.id),correct,'Reading and wrong guesses do not complete the check');
  state=continueTeaching(state,content);
  assert.equal(state.currentMoveId,correct?move.next.strong:move.next.weak);
  if(!correct && !move.progressOptional){
   const repair=moveFor(state.currentMoveId);
   assert.notEqual(repair.prompt,move.prompt,'Reteaching uses a fresh problem');
   assert.ok(repair.teaching.length>=2);
   state=respond(state,repair.expectedChoiceIds[0]);
   assert.ok(state.completedMoveIds.includes(move.id),'Successful alternate example satisfies the original checkpoint');
   assert.equal(continueTeaching(state,content).currentMoveId,move.next.strong);
  }
 }
 assert.equal(messages.size,move.choices.length,'Each misconception gets a specific explanation');
 assert.equal(evaluateTeachingChoice(move,{choiceIds:move.choices.map(c=>c.id)}).verdict,'weak','Selecting all options cannot pass');
}

// Full successful route, then incomplete, unavailable, and successful written assessment.
let state=createLearningState(content);
while(moveFor(state.currentMoveId).type!=='free_response'){
 const move=moveFor(state.currentMoveId);
 state=move.type==='teach'?continueTeaching(state,content):continueTeaching(respond(state,move.expectedChoiceIds[0]),content);
}
assert.equal(state.currentMoveId,'explain');
assert.equal(state.milestones.mastery,false);
for(const id of ['explain','apply','defend']){
 const move=moveFor(id);
 state=updateLearningExperience(state,{drafts:{[id]:{responseText:'A saved explanation with reasoning.'}}});
 let rejected=saveTeachingDecision(state,content,move,{verdict:'strong',evidenceObserved:[],source:'openai',teacherMessage:'A claimed pass without evidence.'});
 assert.equal(rejected.experience.teachingDecision.decision.verdict,'partial','A strong label without criterion evidence cannot pass');
 assert.equal(continueTeaching(rejected,content).currentMoveId,id);
 rejected=saveTeachingDecision(state,content,move,{verdict:'partial',evidenceObserved:[],source:'fallback',teacherMessage:'Unavailable'});
 assert.equal(continueTeaching(rejected,content).currentMoveId,id);
 const malformed=saveTeachingDecision(state,content,move,{});
 assert.equal(malformed.experience.teachingDecision.decision.source,'fallback');
 assert.equal(continueTeaching(malformed,content).currentMoveId,id);
 state=saveTeachingDecision(state,content,move,{verdict:'strong',evidenceObserved:move.evidenceIds,misconceptionIds:[],source:'openai',teacherMessage:'Specific reasoning established.'});
 saveLearningState(state);state=continueTeaching(loadLearningState(content),content);
}
assert.equal(state.currentMoveId,'complete');assert.equal(getStandardProgress(content,state),100);
assert.equal(state.milestones.complete,true);assert.equal(state.milestones.mastery,true);
assert.deepEqual(state.evidenceIds,['evidence-1','evidence-2','evidence-3','evidence-4']);

// Earlier work is retained, and migration is stable after the first save.
const key='jeremiah-learning-state:NB.1.1.18:direct';
storage.set(key,JSON.stringify({standardId:content.standardId,presetId:'direct',currentMoveId:'apply',milestones:{started:true},experience:{drafts:{explain:{responseText:'Earlier answer'}}},lastUpdatedAt:10}));
state=loadLearningState(content);assert.equal(state.currentMoveId,'learn');assert.equal(state.experience.earlierLesson.drafts.explain.responseText,'Earlier answer');
state=continueTeaching(state,content);saveLearningState(state);assert.equal(loadLearningState(content).currentMoveId,'scripture');
assert.equal(loadLearningState(content,'review').currentMoveId,'learn');
storage.set(key,JSON.stringify({currentMoveId:'complete',milestones:{complete:true,mastery:true},experience:{drafts:{defend:{responseText:'Earlier completion'}}}}));
state=loadLearningState(content);assert.equal(state.currentMoveId,'complete');assert.equal(state.experience.earlierCompletion,true);

const apiKey=process.env.OPENAI_API_KEY;delete process.env.OPENAI_API_KEY;
try {
 const choice=await teachWithJeremiah({standardId:content.standardId,moveId:'scripture',learnerResponse:{choiceIds:['shame']}});
 assert.match(choice.teacherMessage,/Shame follows/);assert.equal(choice.source,'lesson');
 const writing=await teachWithJeremiah({standardId:content.standardId,moveId:'defend',learnerResponse:{text:'God is one. One God. Deuteronomy.'}});
 assert.equal(writing.verdict,'partial');assert.equal(writing.evidenceObserved.length,0);
} finally {if(apiKey)process.env.OPENAI_API_KEY=apiKey;}

// Starting a new run must not erase the saved written work or the complete exam.
const oldExam={latest:{answers:{'shema-confession':'a'},results:[{id:'shema-confession',correct:true}],score:100},
 attempts:[{score:80},{score:100}],bestScore:100};
const beforeRestart={...createLearningState(content,'review'),currentMoveId:'complete',
 teacherHistory:[{moveId:'explain',verdict:'strong',source:'openai',at:111}],
 attemptsByMove:{explain:2},completedMoveIds:['learn','explain'],
 evidenceIds:['evidence-1'],misconceptions:['confused-unity'],
 milestones:{started:true,mastery:true,complete:true},
 experience:{drafts:{explain:{responseText:'Earlier learner explanation'}},
  standardEvidence:{'OG.1.1.18':{evidenceIds:['evidence-1']}},
  exitExam:oldExam,
  previousRuns:[{archiveVersion:0,currentMoveId:'earliest'}],
  earlierLesson:{archiveVersion:0,currentMoveId:'older'},
  teachingDecision:{moveId:'explain',decision:{verdict:'strong'}}}};
const afterRestart=restartTeaching(content,beforeRestart);
assert.equal(afterRestart.currentMoveId,createLearningState(content,'review').currentMoveId);
assert.equal(afterRestart.milestones.mastery,false,'A fresh run must not automatically inherit old mastery');
assert.equal(afterRestart.teacherHistory.length,0,'A new attempt starts with empty current history');
assert.equal(afterRestart.experience.earlierLesson.archiveVersion,1);
assert.deepEqual(afterRestart.experience.earlierLesson.teacherHistory,beforeRestart.teacherHistory);
assert.deepEqual(afterRestart.experience.earlierLesson.attemptsByMove,beforeRestart.attemptsByMove);
assert.deepEqual(afterRestart.experience.earlierLesson.completedMoveIds,beforeRestart.completedMoveIds);
assert.deepEqual(afterRestart.experience.earlierLesson.evidenceIds,beforeRestart.evidenceIds);
assert.deepEqual(afterRestart.experience.earlierLesson.experience.exitExam,oldExam);
assert.deepEqual(afterRestart.experience.earlierLesson.exitExam,oldExam);
assert.equal(afterRestart.experience.earlierLesson.drafts.explain.responseText,'Earlier learner explanation');
assert.deepEqual(afterRestart.experience.previousRuns.map(r=>r.currentMoveId),['earliest','older']);
saveLearningState(afterRestart);
const restored=loadLearningState(content,'review');
assert.deepEqual(restored.experience.earlierLesson.experience.exitExam,oldExam,'Previous exam must survive localStorage reload');
const twice=restartTeaching(content,restored);
assert.equal(twice.experience.previousRuns.length,3,'Restarting twice retains the earlier runs exactly once');
assert.deepEqual(twice.experience.previousRuns.at(-1).experience.exitExam,oldExam,'Second restart retains first exam history');
assert.ok(!Object.hasOwn(twice.experience.earlierLesson.experience,'previousRuns'),'Archives must not nest prior-run lists recursively');

console.log('Teacher-led lesson: all answer paths, alternate examples, no skip/double submit, written rubric gates, saved feedback, and migration passed.');
