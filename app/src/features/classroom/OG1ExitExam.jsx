import {useState} from 'react';
import {updateLearningExperience} from '../../core/classroom/learningEngine';
import {OG1_EXIT_EXAM_VERSION,OG1_EXIT_PASS_COUNT,OG1_EXIT_QUESTIONS,gradeOG1ExitExam} from '../../data/curriculum/og1ExitExam';
import './OG1ExitExam.css';

const STANDARD_LABELS=['The Shema','Isaiah','New Testament','Understanding the Difference','Devotion'];
const letters=['A','B','C','D'];

export default function OG1ExitExam({state,onStateChange,onReadBible,onContinue}) {
 const [index,setIndex]=useState(0);
 const currentExam=state.experience?.exitExam?.version===OG1_EXIT_EXAM_VERSION?state.experience.exitExam:{};
 const answers=currentExam.answers||{};
 const latest=currentExam.latest||null;
 const question=OG1_EXIT_QUESTIONS[index];
 const answered=OG1_EXIT_QUESTIONS.filter(q=>q.choices.some(c=>c.id===answers[q.id])).length;
 const allAnswered=answered===OG1_EXIT_QUESTIONS.length;

 function patchExam(patch){
  onStateChange(old=>{
   const previous=old.experience?.exitExam?.version===OG1_EXIT_EXAM_VERSION?old.experience.exitExam:{};
   return updateLearningExperience(old,{exitExam:{...previous,...patch,version:OG1_EXIT_EXAM_VERSION}});
  });
 }
 function selectAnswer(answerId){
  if(latest)return;
  patchExam({answers:{...answers,[question.id]:answerId}});
 }
 function submit(){
  if(!allAnswered||latest)return;
  const result=gradeOG1ExitExam(answers);
  onStateChange(old=>{
   const previous=old.experience?.exitExam?.version===OG1_EXIT_EXAM_VERSION?old.experience.exitExam:{};
   return updateLearningExperience(old,{exitExam:{
    ...previous,version:OG1_EXIT_EXAM_VERSION,answers:{...answers},
    latest:{...result,completedAt:Date.now()},
    attempts:[...(previous.attempts||[]),{score:result.score,correct:result.correct,passed:result.passed,at:Date.now()}].slice(-10),
    bestScore:Math.max(previous.bestScore||0,result.score),passed:Boolean(previous.passed)||result.passed
   }});
  });
 }
 function retry(){patchExam({answers:{},latest:null});setIndex(0);}
 return <section className="og1-exam" aria-labelledby="og1-exam-title">
  <div className="og1-exam-intro">
   <span>OG.1 · THE ONE TRUE GOD</span>
   <h1 id="og1-exam-title">{latest?'Your Exit Exam Results':'The Exit Exam'}</h1>
   <p>{latest?'Review the passages behind your answers. The goal is understanding, not guessing.':'Ten questions. Five standards. One connected understanding of the one LORD.'}</p>
   <div className="og1-exam-intro-meta">
    <span>10 QUESTIONS</span><span>2 PER STANDARD</span><span>{OG1_EXIT_PASS_COUNT} OF 10 TO PASS</span>
   </div>
  </div>
  {latest?<div className="og1-exam-results">
    <div className="og1-exam-score">
     <div className="og1-exam-score-dial" aria-label={'Score: '+latest.score+' percent'}><strong>{latest.correct}<small> / 10</small></strong><span>{latest.score}%</span></div>
     <div>
      <span className="og1-exam-result-status">{latest.passed?'EXIT EXAM PASSED':'REVIEW AND TRY AGAIN'}</span>
      <h2>{latest.passed?'You made the connections.':'A few connections need another look.'}</h2>
      <p>{latest.passed?'You have demonstrated understanding across the five OG.1 standards.':'Review the explanations and Scripture references below, then take another attempt. Your earlier work is saved.'}</p>
      <small>BEST SCORE: {currentExam.bestScore??latest.score}% · ATTEMPTS: {currentExam.attempts?.length||1}</small>
     </div>
    </div>
    <div className="og1-exam-standard-breakdown" aria-label="Results by standard">
     {STANDARD_LABELS.map((label,i)=>{
      const id='OG.1.'+(i+1)+'.18';
      const correct=latest.results.filter(row=>row.standardId===id&&row.correct).length;
      return <div key={id}><span>{String(i+1).padStart(2,'0')} · {label}</span><strong>{correct}/2</strong></div>;
     })}
    </div>
    <h3 className="og1-exam-review-title">Answer review</h3>
    <div className="og1-exam-review">
     {OG1_EXIT_QUESTIONS.map((q,i)=>{
      const response=latest.results.find(row=>row.id===q.id);
      const chosen=q.choices.find(o=>o.id===response?.selectedId);
      const correct=q.choices.find(o=>o.id===q.answerId);
      return <article key={q.id} className={response?.correct?'is-correct':'is-incorrect'}>
       <div className="og1-exam-review-head"><span>{String(i+1).padStart(2,'0')} · {q.reference}</span><strong>{response?.correct?'✓ Correct':'Review'}</strong></div>
       <h4>{q.prompt}</h4>
       <p><span>Your answer:</span> {chosen?.label||'Not answered'}</p>
       {!response?.correct&&<p><span>Correct answer:</span> {correct?.label}</p>}
       <div className="og1-exam-explanation">{q.explanation}</div>
       <button type="button" onClick={()=>onReadBible?.(q.reference)}>Read in the Bible ↗</button>
      </article>;
     })}
    </div>
    <div className="og1-exam-result-actions">
     {currentExam.passed&&<button className="og1-exam-primary" type="button" onClick={onContinue}>Continue to your OG.1 summary →</button>}
     <button type="button" className="og1-exam-secondary" onClick={retry}>{latest.passed?'Practice another attempt':'Retake all ten questions'} ↻</button>
    </div>
   </div>:<div className="og1-exam-content">
    <div className="og1-exam-progress" aria-label={answered+' of ten answers saved'}>
     <div><span>{answered}/10 answered</span><span>Question {index+1} of 10</span></div>
     <div className="og1-exam-progress-bar"><span style={{width:answered*10+'%'}}/></div>
    </div>
    <nav className="og1-exam-jump" aria-label="Exit exam questions">
     {OG1_EXIT_QUESTIONS.map((q,i)=><button type="button" key={q.id}
      className={(index===i?'is-active ':'')+(answers[q.id]?'is-answered':'')}
      aria-current={index===i?'step':undefined}
      onClick={()=>setIndex(i)}
      aria-label={'Question '+(i+1)+(answers[q.id]?', answered':'')}
     >{String(i+1).padStart(2,'0')}</button>)}
    </nav>
    <div className="og1-exam-question" key={question.id}>
     <div className="og1-exam-question-meta"><span>STANDARD {question.standardId}</span><span>{question.reference}</span></div>
     <h2>{question.prompt}</h2>
     <div className="og1-exam-choices" role="group" aria-label="Select one answer">
      {question.choices.map((choice,i)=><button type="button" key={choice.id} aria-pressed={answers[question.id]===choice.id}
       onClick={()=>selectAnswer(choice.id)}><span>{letters[i]}</span><strong>{choice.label}</strong><span className="og1-exam-choice-check" aria-hidden="true">{answers[question.id]===choice.id?'✓':'○'}</span></button>)}
     </div>
     <div className="og1-exam-question-bottom"><button type="button" onClick={()=>onReadBible?.(question.reference)}>Read {question.reference} ↗</button><span>Your selections save automatically.</span></div>
    </div>
    <div className="og1-exam-nav">
     <button type="button" className="og1-exam-secondary" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>← Previous</button>
     {index<OG1_EXIT_QUESTIONS.length-1
      ?<button type="button" className="og1-exam-primary" onClick={()=>setIndex(i=>Math.min(9,i+1))}>Next question →</button>
      :<button type="button" className="og1-exam-primary" disabled={!allAnswered} onClick={submit}>Submit exit exam →</button>}
    </div>
    {index===9&&!allAnswered&&<p className="og1-exam-reminder" role="status">Answer all ten questions before submitting. You can jump to any unfinished number above.</p>}
   </div>}
 </section>;
}
