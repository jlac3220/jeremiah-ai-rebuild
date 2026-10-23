import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '../../app/routes';
import { setBibleReaderIntent } from '../../core/bible/bibleReaderIntent';
import { getInstructionalMove, getStandardProgress, updateLearningExperience } from '../../core/classroom/learningEngine';
import { evaluateTeachingChoice, saveTeachingDecision, continueTeaching, skipTeachingMove } from '../../core/classroom/teacherLedEngine';
import { askJeremiahTeacher } from '../../services/jeremiahTeacher';
import { getLessonMedia } from '../../data/curriculum/mediaCatalog';
import LessonActivity from './LessonActivity';
import './OG1LessonPlayer.css';

const CHAPTERS = {
 shema: 'Hear the confession', isaiah: 'Test the witnesses', continuity: 'Follow the same Lord',
 distinction: 'Understand the difference', devotion: 'Live the confession'
};
const VERBS = { learn:'BEGIN', 'shema-show':'READ', 'isaiah-show':'EXAMINE', 'continuity-show':'CONNECT','distinction-show':'COMPARE','devotion-show':'APPLY' };
const TITLES = {learn:'One confession. One story.', 'shema-show':'Hear, O Israel.', 'isaiah-show':'No God before, beside, or after.', 'continuity-show':'Jesus repeats the confession.', 'distinction-show':'What is the actual disagreement?', 'devotion-show':'The confession shapes your life.'};

function createMoments(move,video) {
 if(move.type==='complete')return [];
 if(move.type!=='teach')return [{kind:'task',verb:move.type==='free_response'?'EXPLAIN':move.interaction?.type==='match'?'CONNECT':'ANSWER',title:move.title}];
 const moments=[];
 if(move.scripture?.length)moments.push({kind:'read',verb:VERBS[move.id]||'READ',title:TITLES[move.id]||move.title,verse:move.scripture[0]});
 else moments.push({kind:'intro',verb:'ENCOUNTER',title:TITLES[move.id]||move.title});
 (move.teaching||[]).forEach((text,i)=>moments.push({kind:'teach',verb:['NOTICE','DISCOVER','CONNECT'][i%3],title:['Look closer','Think about this','Make the connection'][i%3],text}));
 if(move.id==='shema-show'&&video)moments.push({kind:'watch',verb:'WATCH',title:'Listen to the meaning of Shema',video});
 if(move.id==='shema-show'&&video?.lessonCheck)moments.push({kind:'videoCheck',verb:'NOTICE',title:'What did you notice?',check:video.lessonCheck});
 return moments;
}

export default function OG1LessonPlayer({content,state,onStateChange,onNavigate,onUseClassic}) {
 const move=getInstructionalMove(content,state.currentMoveId);
 const video=getLessonMedia(content).find(item=>item.id==='unpacked-shema');
 const moments=createMoments(move,video);
 const [moment,setMoment]=useState(0);
 const [draft,setDraft]=useState({});
 const [mediaChoice,setMediaChoice]=useState('');
 const [thinking,setThinking]=useState(false);
 const [error,setError]=useState('');
 const abort=useRef(null);
 const priorMove=useRef(move.id);
 const finish=move.type==='complete';
 const assessment=move.type!=='teach'&&!finish;
 const written=['free_response','mastery_response'].includes(move.type);
 const matching=move.interaction?.type==='match';
 const reasoning=move.interaction?.type==='reasoning';
 const feedback=state.experience?.teachingDecision?.moveId===move.id?state.experience.teachingDecision.decision:null;
 const savedDraft=state.experience?.drafts?.[move.id]||{};
 const form={...savedDraft,...draft};
 const ready=written?Boolean(form.responseText?.trim()):matching?move.interaction.items.every(i=>form.placements?.[i.id]):reasoning?Boolean(form.claimId&&form.reasonId):Boolean(form.selectedChoiceId);
 const total=moments.length;
 const current=moments[Math.min(moment,total-1)];
 const percent=getStandardProgress(content,state);
 const chapter=move.id.split('-')[0];
 useEffect(()=>{if(priorMove.current!==move.id){priorMove.current=move.id;setMoment(0);setDraft({});setMediaChoice('');setError('');}},[move.id]);
 useEffect(()=>()=>abort.current?.abort(),[]);
 function change(patch) {
  if(thinking||feedback)return;
  setDraft(old=>({...old,...patch}));
  onStateChange(old=>updateLearningExperience(old,{drafts:{[move.id]:{...(old.experience?.drafts?.[move.id]||{}),...patch}}}));
 }
 function readVerse(reference) {
  setBibleReaderIntent(reference,{translation:'kjv',returnRoute:ROUTES.CLASSROOM_LESSON,source:'classroom'});
  onNavigate(ROUTES.BIBLE_SUPPORT);
 }
 function advance(){if(moment<total-1){setMoment(i=>i+1);return;}if(move.type==='teach')onStateChange(old=>continueTeaching(old,content));}
 function back(){setMoment(i=>Math.max(0,i-1));}
 function skip(){abort.current?.abort();setThinking(false);onStateChange(old=>skipTeachingMove(old,content));}
 async function check(){
  if(!ready||thinking||feedback)return;
  const answer=written?{text:form.responseText.trim()}:matching?{placements:form.placements}:reasoning?{claimId:form.claimId,reasonId:form.reasonId}:{choiceIds:[form.selectedChoiceId]};
  let decision=evaluateTeachingChoice(move,answer);
  if(!decision){
   setThinking(true);const controller=new AbortController();abort.current=controller;
   try{decision=await askJeremiahTeacher({standardId:content.standardId,moveId:move.id,learnerResponse:answer,learnerState:{completedMoveIds:state.completedMoveIds,evidenceIds:state.evidenceIds,misconceptions:state.misconceptions,attemptsByMove:state.attemptsByMove}},controller.signal);}
   catch(e){if(e.name!=='AbortError')setError('Jeremiah cannot check that response right now. Your answer is saved.');}
   finally{if(!controller.signal.aborted)setThinking(false);}
   if(controller.signal.aborted||!decision)return;
  }
  onStateChange(old=>saveTeachingDecision(old,content,move,decision));
 }
 const buttonText=current?.kind==='watch'?'I watched / Continue':current?.kind==='videoCheck'?'Continue to the activity':moment===total-1?'Continue to the next activity':'Reveal the next idea';
 return <div className="ogp-page">
  <header className="ogp-header"><button type="button" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>← <span>Classroom</span></button><strong>JEREMIAH <small>THE ONE TRUE GOD</small></strong><button type="button" className="ogp-classic" onClick={onUseClassic}>Original view</button></header>
  <div className="ogp-progress"><span style={{width:percent+'%'}}/></div>
  <main className="ogp-shell" key={move.id}>
   <div className="ogp-context"><span>{CHAPTERS[chapter]||'The One True God'}</span><small>{finish?'FINISH':moment+1+' / '+total}</small></div>
   {finish?<section className="ogp-finish"><span className="ogp-verb">JOURNEY REVIEWED</span><h1>One Lord. One unfolding story.</h1><p>You've explored Israel's confession, Isaiah's declarations, the apostolic witness, and the call to love the Lord. Your responses remain saved for review.</p><button type="button" className="ogp-action" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>Explore another lesson →</button></section>:<>
    <section className="ogp-stage" aria-label={current.verb+' learning moment'}>
     <span className="ogp-verb">{current.verb}</span>
     <h1>{current.title}</h1>
     {current.kind==='read'&&<><blockquote className="ogp-verse">“{current.verse.text}”</blockquote><span className="ogp-reference">{current.verse.reference} · KJV</span><p className="ogp-prompt">Read it once, then notice what the passage actually says.</p><button type="button" className="ogp-link" onClick={()=>readVerse(current.verse.reference)}>Open in the Bible ↗</button></>}
     {current.kind==='intro'&&<p className="ogp-thought">Let's follow the confession from Moses through the prophets and into the apostolic witness.</p>}
     {current.kind==='teach'&&<p className="ogp-thought">{current.text}</p>}
     {current.kind==='watch'&&<><p className="ogp-prompt">Watch for the meaning of <em>shema</em>. This is historical and language context; Jeremiah will connect it to Apostolic teaching.</p><div className="ogp-video"><iframe src={current.video.embedUrl} title={current.video.videoTitle||current.video.title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div><small>Optional · {current.video.provider} · {current.video.duration}</small></>}
     {current.kind==='videoCheck'&&<><p className="ogp-prompt">{current.check.prompt}</p><div className="ogp-options">{current.check.choices.map(c=><button type="button" key={c.id} aria-pressed={mediaChoice===c.id} onClick={()=>setMediaChoice(c.id)}>{c.label}</button>)}</div>{mediaChoice&&<p className="ogp-feedback">{mediaChoice===current.check.answerId?current.check.correctFeedback:current.check.incorrectFeedback}</p>}</>}
     {current.kind==='task'&&<><p className="ogp-prompt">{move.prompt}</p>
      {(matching||reasoning)&&<LessonActivity key={move.id} move={move} draft={form} feedback={feedback} onChange={change}/>}
      {!written&&!matching&&!reasoning&&<div className="ogp-options">{(move.choices||[]).map(c=><button key={c.id} type="button" disabled={Boolean(feedback)} aria-pressed={form.selectedChoiceId===c.id} onClick={()=>change({selectedChoiceId:c.id})}>{c.label}</button>)}</div>}
      {written&&<><textarea aria-label="Your explanation" rows={5} placeholder="Explain what the Scripture teaches in your own words." value={form.responseText||''} disabled={Boolean(feedback)||thinking} onChange={e=>change({responseText:e.target.value})}/><details className="ogp-help"><summary>Need a hint?</summary><p>Begin with the Scripture's main claim, then explain how the surrounding passages support it. Use your own words.</p></details></>}
      {feedback&&<div className="ogp-feedback" role="status"><strong>Jeremiah responds</strong><p>{feedback.teacherMessage}</p></div>}
      {error&&<p role="alert" className="ogp-error">{error}</p>}
     </>}
    </section>
    <nav className="ogp-controls" aria-label="Lesson moment navigation">
     {assessment ? (feedback?<button type="button" className="ogp-action" onClick={()=>onStateChange(old=>continueTeaching(old,content))}>Continue →</button>:<button type="button" className="ogp-action" onClick={check} disabled={!ready||thinking}>{thinking?'Checking…':written?'Discuss my explanation':'Check my connection'} →</button>)
     :<button type="button" className="ogp-action" onClick={advance}>{buttonText} →</button>}
     {!assessment&&moment>0&&<button type="button" className="ogp-back" onClick={back}>← Previous</button>}
     {assessment&&<button type="button" className="ogp-back" onClick={skip}>Skip for now (no mastery)</button>}
    </nav>
   </>}
  </main>
 </div>;
}
