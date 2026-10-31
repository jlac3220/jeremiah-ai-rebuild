import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {OG1_EXIT_EXAM_VERSION,OG1_EXIT_PASS_COUNT,OG1_EXIT_QUESTIONS,gradeOG1ExitExam} from '../src/data/curriculum/og1ExitExam.js';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const player=read('../src/features/classroom/OG1LessonPlayer.jsx');
const component=read('../src/features/classroom/OG1ExitExam.jsx');
const theme=read('../src/features/classroom/OG1ThemeConsistency.css');
const css=read('../src/features/classroom/OG1ExitExam.css');
assert.equal(OG1_EXIT_PASS_COUNT,8);
assert.match(OG1_EXIT_EXAM_VERSION,/v1$/);
assert.equal(OG1_EXIT_QUESTIONS.length,10);
assert.ok(OG1_EXIT_QUESTIONS.every(q=>q.type==='multiple_choice'&&q.choices.length===4),'OG.1 exit exam requires four credible choices per question, not obvious true/false items');
assert.equal(new Set(OG1_EXIT_QUESTIONS.map(q=>q.id)).size,10);
assert.deepEqual([...new Set(OG1_EXIT_QUESTIONS.map(q=>q.standardId))],
 ['OG.1.1.18','OG.1.2.18','OG.1.3.18','OG.1.4.18','OG.1.5.18']);
for(const standard of ['OG.1.1.18','OG.1.2.18','OG.1.3.18','OG.1.4.18','OG.1.5.18']){
 assert.equal(OG1_EXIT_QUESTIONS.filter(q=>q.standardId===standard).length,2,standard+' must have 2 questions');
}
for(const q of OG1_EXIT_QUESTIONS){
 assert.ok(q.prompt&&q.reference&&q.explanation,'Every question must be sourced and explained');
 assert.ok(Number.isInteger(q.evidenceLevel)&&q.evidenceLevel>=1&&q.evidenceLevel<=4,'Evidence level must use standards scale');
 assert.ok(typeof q.assessedSkill==='string'&&q.assessedSkill.length>3,'Question must declare assessed skill');
 assert.ok(q.evidenceLevel<=2,'Recognition/selection items must not claim comprehensive or extensive understanding');
 assert.ok(['multiple_choice','true_false'].includes(q.type));
 assert.ok(q.choices.length===2||q.choices.length===4);
 assert.equal(new Set(q.choices.map(c=>c.id)).size,q.choices.length,'Answer identifiers unique');
 assert.ok(q.choices.some(c=>c.id===q.answerId),'Each question has a valid answer');
}
// Each stem is reusable without a lesson slide, a chapter heading, or prior question.
for(const q of OG1_EXIT_QUESTIONS){
 assert.ok(q.prompt.length>=35&&q.prompt.length<=160,q.id+' must be concise and understandable independently');
 assert.match(q.prompt,/Deuteronomy|Isaiah|Mark|Corinthians|Trinitarian|Oneness|James|Exodus|Luke/,q.id+' must identify the passage or doctrine');
 assert.doesNotMatch(q.prompt,/in the opening command|declares that no other|with all the heart|fully divine and truly human|the LORD speaks of being/i,q.id+' should not teach the answer in the stem');
 assert.doesNotMatch(q.prompt,/\\b(this lesson|the slide|above|below|we just|previous question|as discussed)\\b/i,q.id+' depends on lesson context');
}
// Distractors must be meaningful alternatives, not implausible strawmen.
for(const phrase of ['different gods for different nations','every person defines God','commandments were all canceled','only acting as though','love unnecessary','each city should worship']){
 assert.ok(!OG1_EXIT_QUESTIONS.some(q=>q.choices.some(c=>c.label.toLowerCase().includes(phrase))), 'Distractor too obvious: '+phrase);
}
const correct=Object.fromEntries(OG1_EXIT_QUESTIONS.map(q=>[q.id,q.answerId]));
const perfect=gradeOG1ExitExam(correct);
assert.equal(perfect.correct,10);
assert.equal(perfect.total,10);
assert.equal(perfect.score,100);
assert.equal(perfect.passed,true);
assert.equal(perfect.results.length,10);
assert.ok(perfect.results.every(r=>r.correct));
 assert.ok(perfect.results.every(r=>r.evidenceLevel&&r.assessedSkill),'Results retain question-level alignment');
const wrongAnswers=Object.fromEntries(OG1_EXIT_QUESTIONS.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerId).id]));
assert.deepEqual([gradeOG1ExitExam(wrongAnswers).score,gradeOG1ExitExam(wrongAnswers).passed],[0,false]);
const answers80={...correct};
for(const q of OG1_EXIT_QUESTIONS.slice(0,2))answers80[q.id]=wrongAnswers[q.id];
assert.deepEqual([gradeOG1ExitExam(answers80).correct,gradeOG1ExitExam(answers80).passed],[8,true]);
const answers70={...answers80,[OG1_EXIT_QUESTIONS[2].id]:wrongAnswers[OG1_EXIT_QUESTIONS[2].id]};
assert.deepEqual([gradeOG1ExitExam(answers70).correct,gradeOG1ExitExam(answers70).passed],[7,false]);
assert.throws(()=>gradeOG1ExitExam({}),/Complete all ten/);
assert.throws(()=>gradeOG1ExitExam({...correct,[OG1_EXIT_QUESTIONS[0].id]:'bad'}),/Complete all ten/);
for(const required of ['<OG1ExitExam','examPassed','examReviewOpen','onSubmitted','displayProgress','OG1ThemeConsistency.css']){
 assert.ok(player.includes(required),'Missing OG.1 exit integration: '+required);
}
assert.ok(player.includes('finish?100:percent'),'Lesson completion should not depend on exam score');
assert.ok(player.includes('rateOG1Lesson(content,state)'),'Final rating must reflect collected evidence');
assert.ok(!component.includes('Finish lesson without taking the exam'),'Exam requires participation but not a passing grade');
assert.ok(component.includes('View my learning-level report'),'Final report accessible despite a failed exam');
assert.ok(player.includes("finish?(examPassed?'LESSON COMPLETE':'FINAL ASSESSMENT')"),'Completion header should not say prologue');
assert.ok(player.includes("finish||chapterNumber>i"),'All five chapter markers should be filled at exit');
for(const required of ['gradeOG1ExitExam(answers)','patchExam','latest','attempts','bestScore','onContinue',
   'onReadBible','aria-pressed','disabled={!allAnswered}','Retake all ten questions','Your selections save automatically']){
 assert.ok(component.includes(required),'Exam component missing '+required);
}
assert.ok(theme.includes('.oge-panel')&&theme.includes('.og1-identity-hero')&&theme.includes('.ogp-page .ogp-header'),'Theme should cover history, doctrine, and lesson shell');
assert.match(css,/@media\(max-width:640px\)/,'Exam must work on phones');
assert.match(theme,/prefers-reduced-motion/,'Motion accessibility required');
console.log('PASS OG.1 exit: ten balanced items, pass/fail boundary, persistence hooks, responsive and consistent UI.');
