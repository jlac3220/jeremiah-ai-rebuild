import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rateOG1Lesson} from '../src/core/classroom/og1LessonRating.js';
import {continueTeaching} from '../src/core/classroom/teacherLedEngine.js';
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
assert.equal(advanced.level,1,'Overall conservative rating cannot hide an unassessed standard');
const withExam=rateOG1Lesson(content,{teacherHistory:[],experience:{exitExam:{latest:{results:[{standardId:'OG.1.2.18',correct:true},{standardId:'OG.1.2.18',correct:true}]}}}});
assert.equal(withExam.standards[1].level,2,'Two correct recall questions support approaching but not comprehensive');
const player=readFileSync(new URL('../src/features/classroom/OG1LessonPlayer.jsx',import.meta.url),'utf8');
const exam=readFileSync(new URL('../src/features/classroom/OG1ExitExam.jsx',import.meta.url),'utf8');
assert.ok(player.includes('Continue without an answer'));
assert.ok(player.includes('Object.values(form.placements||{}).some(Boolean)'),'Partial answer can be assessed');
assert.ok(player.includes('finalRating.standards.map'));
assert.ok(exam.includes('Finish lesson without taking the exam'));
assert.ok(exam.includes('View my learning-level report'));
console.log('PASS OG.1 open progression + per-standard evidence ratings 1–4.');
