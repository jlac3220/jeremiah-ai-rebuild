import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rateOG1Lesson} from '../src/core/classroom/og1LessonRating.js';
import {continueTeaching,saveTeachingDecision,evaluateTeachingChoice} from '../src/core/classroom/teacherLedEngine.js';
import og1 from '../src/core/classroom/content/OG_1_LESSON.js';
import {teachWithJeremiah} from '../server/teacherCore.mjs';
const content={standardId:'OG.1.LESSON.18',coveredStandards:[{id:'OG.1.1.18'},{id:'OG.1.2.18'}],instructionalMoves:[
 {id:'shema-guide',type:'scenario',standardIds:['OG.1.1.18'],next:{strong:'shema-try',weak:'shema-guide',partial:'shema-guide'}},
 {id:'shema-try',type:'free_response',standardIds:['OG.1.1.18'],next:{strong:'isaiah-guide',weak:'shema-try',partial:'shema-try'}},
 {id:'isaiah-guide',type:'scenario',standardIds:['OG.1.2.18'],next:{strong:'complete',weak:'isaiah-guide',partial:'isaiah-guide'}}
]};
const state={currentMoveId:'shema-guide',teacherHistory:[{moveId:'shema-guide',verdict:'weak'}],experience:{teachingDecision:{moveId:'shema-guide',decision:{verdict:'weak',strategy:'clarify'}}}};
assert.equal(continueTeaching(state,content).currentMoveId,'shema-try','Wrong answers advance in OG.1');
assert.equal(continueTeaching(state,{...content,standardId:'OTHER'}).currentMoveId,'shema-guide','Other curricula retain original routing');
const empty=rateOG1Lesson(content,{teacherHistory:[],experience:{}});
assert.deepEqual(empty.standards.map(s=>s.level),[1,1]);
assert.ok(empty.meaning.includes('recognize some important Scriptures'));
assert.ok(empty.standards.every(s=>s.meaning&&s.nextStep),'Every standard must explain the rating and offer next instruction');
assert.ok(empty.standards.find(s=>s.standardId==='OG.1.2.18').nextStep.includes('Isaiah 43:10'));

const guided=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-guide',verdict:'strong'}],experience:{}});
assert.equal(guided.standards[0].level,2);
const written=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-try',verdict:'strong'}],experience:{}});
assert.equal(written.standards[0].level,3);
const advanced=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-try',verdict:'strong'}],experience:{standardEvidence:{'OG.1.1.18':{evidenceIds:['OG.1.1.18:evidence-4']}}}});
assert.equal(advanced.standards[0].level,4);
assert.equal(advanced.level,2,'Overall level balances assessed standards without implying universal extensive understanding');
assert.ok(advanced.coverage<100,'Unassessed work is transparently reflected in coverage');
const withExam=rateOG1Lesson(content,{teacherHistory:[],experience:{exitExam:{latest:{results:[{standardId:'OG.1.2.18',correct:true},{standardId:'OG.1.2.18',correct:true}]}}}});
assert.equal(withExam.standards[1].level,2,'Two correct recall questions support approaching but not comprehensive');
assert.equal(withExam.standards[1].score,100);
assert.equal(empty.standards[0].score,null,'Unassessed standards must not be treated as incorrect');
const outage=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-try',verdict:'unscored'}],experience:{}});
assert.equal(outage.standards[0].score,null,'Teacher outage must not become a failing grade');
assert.ok(outage.standards[0].coverage>0,'An answered question still counts as attempted');
const fallbackMove=content.instructionalMoves[1];
const savedOutage=saveTeachingDecision({currentMoveId:'shema-try',teacherHistory:[],attemptsByMove:{},completedMoveIds:[],evidenceIds:[],misconceptions:[],experience:{}},content,fallbackMove,{verdict:'unscored',strategy:'continue_without_grade',source:'service-unavailable',teacherMessage:'Answer saved; evaluation unavailable.',evidenceObserved:[],misconceptionIds:[]});
assert.equal(savedOutage.teacherHistory.at(-1).verdict,'unscored');
assert.ok(!savedOutage.completedMoveIds.includes('shema-try'),'Unscored work must not grant mastery');
assert.equal(continueTeaching(savedOutage,content).currentMoveId,'isaiah-guide','An answer still permits moving forward');

const combined=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-guide',verdict:'strong'},{moveId:'shema-try',verdict:'weak'}],experience:{exitExam:{latest:{results:[{standardId:'OG.1.1.18',correct:true},{standardId:'OG.1.1.18',correct:false}]}}}});
assert.equal(combined.standards[0].score,45,'50% written + 25% guided + 25% exam = 45%');
assert.equal(combined.standards[0].level,1,'Low weighted score cannot be masked by one strong guided response');
assert.equal(combined.standards[0].coverage,100);
const player=readFileSync(new URL('../src/features/classroom/OG1LessonPlayer.jsx',import.meta.url),'utf8');
const exam=readFileSync(new URL('../src/features/classroom/OG1ExitExam.jsx',import.meta.url),'utf8');
assert.ok(!player.includes('Continue without an answer'));
assert.ok(player.includes('Please answer this question before continuing'));
assert.ok(player.includes('const anyAnswer=ready;'),'Every required assessment response must be complete before submission');
assert.ok(player.includes('finalRating.standards.map'));
assert.ok(player.includes("completionScreen==='understanding'"),'Understanding has its own screen');
assert.ok(player.includes("completionScreen==='summary'"),'Final summary is a subsequent screen');
assert.ok(player.includes('Continue to final summary'),'Learner controls reveal-to-summary transition');
assert.ok(player.includes('Understanding report'),'Learner can revisit ratings from the final summary');
assert.ok(!exam.includes('Finish lesson without taking the exam'));
assert.ok(exam.includes('View my learning-level report'));

// Outages and older persisted fallback records must never imply understanding.
const legacyPartial=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-try',verdict:'partial'}],experience:{}});
assert.equal(legacyPartial.standards[0].score,null,'Older ambiguous partial written evidence needs reassessment');
assert.ok(legacyPartial.standards[0].coverage>0,'Legacy attempt is retained in coverage');
const verifiedPartial=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-try',verdict:'partial',source:'openai'}],experience:{}});
assert.equal(verifiedPartial.standards[0].score,55,'Verified partial semantic assessment is scoreable');
const offlinePartial=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-try',verdict:'partial',source:'fallback'}],experience:{}});
assert.equal(offlinePartial.standards[0].score,null,'Offline fallback may not count as partial understanding');
const supportedPartial=rateOG1Lesson(content,{teacherHistory:[{moveId:'shema-try',verdict:'partial',source:'openai',usedSupport:true}],experience:{}});
assert.equal(supportedPartial.standards[0].score,null,'Assisted writing may not count as independent written evidence');
const oldStyleFallback=saveTeachingDecision({currentMoveId:'shema-try',teacherHistory:[],attemptsByMove:{},completedMoveIds:[],evidenceIds:[],misconceptions:[],experience:{}},content,fallbackMove,{verdict:'partial',strategy:'encourage_retry',source:'fallback',teacherMessage:'Offline',evidenceObserved:[],misconceptionIds:[]});
assert.equal(oldStyleFallback.teacherHistory.at(-1).verdict,'unscored','State boundary also rejects outdated offline partial verdicts');
assert.equal(oldStyleFallback.teacherHistory.at(-1).source,'fallback','Assessor provenance is saved for future reloads');
assert.equal(rateOG1Lesson(content,oldStyleFallback).standards[0].score,null);
assert.equal(continueTeaching(oldStyleFallback,content).currentMoveId,'isaiah-guide');
const missingModelKey=process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;
try{
 const decision=await teachWithJeremiah({standardId:'OG.1.LESSON.18',moveId:'shema-try',learnerResponse:{text:'Deuteronomy 6:4 affirms one LORD and no other God.'}});
 assert.equal(decision.verdict,'unscored','Live teacher handler must not award offline writing credit');
 assert.equal(decision.source,'service-unavailable');
 assert.deepEqual(decision.evidenceObserved,[]);
}finally{
 if(missingModelKey!==undefined)process.env.OPENAI_API_KEY=missingModelKey;
}


const memoryMove=og1.instructionalMoves.find(m=>m.id==='shema-recite');
assert.ok(memoryMove,'OG.1.1 has a separate recitation moment');
assert.equal(memoryMove.phase,'Let me try');
assert.equal(memoryMove.assessmentRole,'memory_recall');
assert.equal(memoryMove.scripture.length,0,'KJV answer cannot display inside independent recall activity');
assert.ok(!memoryMove.prompt.includes('Hear, O Israel'),'Memory prompt must not contain its own answer');
assert.equal(og1.instructionalMoves.find(m=>m.id==='context-challenge').next.strong,'shema-recite');
assert.equal(og1.instructionalMoves.find(m=>m.id==='shema-recite').next.strong,'shema-try');
const exactRecall=evaluateTeachingChoice(memoryMove,{text:'HEAR O ISRAEL, the lord our God is ONE Lord!'});
assert.equal(exactRecall.verdict,'strong','Capitals and punctuation are not recitation errors');
assert.deepEqual(exactRecall.evidenceObserved,['OG.1.1.18:evidence-1']);
assert.equal(evaluateTeachingChoice(memoryMove,{text:'The LORD is one'}).verdict,'weak','A paraphrase is not full KJV recall');
assert.equal(evaluateTeachingChoice(memoryMove,{text:''}).verdict,'weak','Blank recall never earns evidence');
const actualRow=attempts=>{
 const row=rateOG1Lesson(og1,{teacherHistory:attempts,experience:{standardEvidence:{'OG.1.1.18':{evidenceIds:['OG.1.1.18:evidence-4']}}}}).standards.find(s=>s.standardId==='OG.1.1.18');
 return row;
};
const recallOnly=actualRow([{moveId:'shema-recite',verdict:'strong',source:'lesson'}]);
assert.equal(recallOnly.score,null,'Memorization alone cannot become the independent explanation score');
assert.equal(recallOnly.recitationVerified,true);
assert.equal(recallOnly.level,1,'Accurate recitation without reasoning does not prove level 3');
const noRecall=actualRow([{moveId:'shema-try',verdict:'strong',source:'openai'}]);
assert.equal(noRecall.recitationVerified,false);
assert.equal(noRecall.level,2,'OG.1.1 cannot earn advanced levels without required recitation');
const both=actualRow([{moveId:'shema-recite',verdict:'strong',source:'lesson'},{moveId:'shema-try',verdict:'strong',source:'openai'}]);
assert.equal(both.recitationVerified,true);
assert.equal(both.level,4,'Both independent reasoning and recitation support the full rubric');
const incorrectRecall=actualRow([{moveId:'shema-recite',verdict:'weak',source:'lesson'},{moveId:'shema-try',verdict:'strong',source:'openai'}]);
assert.equal(incorrectRecall.recitationVerified,false);
assert.equal(incorrectRecall.level,2);

console.log('PASS OG.1 open progression + per-standard evidence ratings 1–4.');
