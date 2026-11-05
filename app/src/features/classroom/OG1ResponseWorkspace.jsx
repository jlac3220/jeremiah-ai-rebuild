import {useId,useState} from 'react';
import LessonIcon from '../../shared/lesson/LessonIcon';
import './OG1ResponseWorkspace.css';

export function OG1TeacherFeedback({feedback,move,onReadBible}) {
 if(!feedback)return null;
 const unscored=feedback.verdict==='unscored'||['fallback','service-unavailable'].includes(feedback.source);
 const source=unscored?'Assessment unavailable':feedback.source==='lesson'
  ?move.assessmentRole==='memory_recall'?'KJV recall check':'Authored activity feedback'
  :feedback.source==='openai'?'Meaning-based assessment':'Assessment feedback';
 const status=unscored?'Saved · not assessed':feedback.supportedPass?'Supported practice':
  feedback.verdict==='strong'?'Connection established':feedback.verdict==='weak'?'A connection to revisit':'Keep developing your explanation';
 return <section className="og2-teacher" data-status={unscored?'unscored':feedback.verdict} aria-label="Jeremiah feedback" role="status">
  <header><span aria-hidden="true" className="og2-teacher-mark">J</span><div><strong>Jeremiah responds</strong><small>{source}</small></div></header>
  <h3>{status}</h3>
  <p>{feedback.teacherMessage}</p>
  {feedback.itemResults?.length>0&&<ul>{feedback.itemResults.map((result,index)=><li key={result.id}>
   <strong>{result.correct?'Connected':'Revisit'} · {move.interaction?.items?.[index]?.label||result.id}</strong>
   <span>{result.message}</span>
  </li>)}</ul>}
  {feedback.followUpPrompt&&feedback.followUpPrompt!==move.prompt&&<p className="og2-teacher-next"><strong>Next step</strong>{feedback.followUpPrompt}</p>}
  {(move.assessmentRole==='memory_recall'||move.scripture?.[0]?.reference)&&onReadBible&&<button type="button" onClick={()=>onReadBible(move.assessmentRole==='memory_recall'?'Deuteronomy 6:4':move.scripture[0].reference)}><LessonIcon name="context"/>{move.assessmentRole==='memory_recall'?'Review the KJV verse in context':'Revisit the Scripture'}</button>}
 </section>;
}

export default function OG1ResponseWorkspace({move,value,onChange,disabled,feedback,onReadBible,actions,guidance,usedSupport,onUseSupport,title}) {
 const [supportOpen,setSupportOpen]=useState(false);
 const id=useId();
 const recall=move.assessmentRole==='memory_recall';
 const label=recall?'Your recitation of Deuteronomy 6:4':'Your explanation';
 const hasSupport=!recall&&Boolean(guidance||move.supportSteps?.length);
 function toggleSupport(){
  if(!supportOpen&&!feedback)onUseSupport?.();
  setSupportOpen(open=>!open);
 }
 return <section className="og2-workspace" data-mode={recall?'recall':'explanation'} aria-label={recall?'Independent Scripture recall':'Scripture explanation workspace'}>
  <header className="og2-workspace-heading"><span>{recall?'RECALL THE WORDS':usedSupport?'SUPPORTED EXPLANATION':'EXPLAIN THE CONNECTION'}</span><h2>{title||move.title}</h2></header>
  <div className="og2-workspace-grid">
   <section className="og2-task-brief" aria-label="Read the task"><span className="og2-task-label">Your task</span><p id={id+'-prompt'}>{move.prompt}</p>
    {recall&&<div className="og2-recall-note"><LessonIcon name="context"/><span>Memory recall and explanation are separate. Review the KJV after checking your attempt.</span></div>}
   </section>
   <section className="og2-writing-desk" aria-label="Write and review your response">
    <div className="og2-writing-meta"><label htmlFor={id+'-response'}>{label}</label><span>{recall?'Independent recall':usedSupport?'Supported attempt':'In your own words'}</span></div>
    <textarea id={id+'-response'} aria-describedby={id+'-prompt'} value={value||''} disabled={disabled} onChange={event=>onChange(event.target.value)} rows={recall?5:8} placeholder={recall?'Write the entire verse from memory…':'Develop your explanation here, using the task and Scripture to guide your reasoning…'}/>
    <div className="og2-save-state"><span>{(value||'').trim()?value.trim().split(/\s+/).length+' words':'Your words. Your reasoning.'}</span><span>Autosaved as you write</span></div>
    <OG1TeacherFeedback feedback={feedback} move={move} onReadBible={onReadBible}/>
    <nav className="ogp-controls og2-workspace-actions" aria-label="Lesson moment navigation">{actions}</nav>
    {hasSupport&&<div className="og2-support">
     <button type="button" aria-expanded={supportOpen} aria-controls={id+'-support'} onClick={toggleSupport}><LessonIcon name="context"/>{supportOpen?'Close teaching support':'Open teaching support'}<span aria-hidden="true">{supportOpen?'−':'+'}</span></button>
     {usedSupport&&<small>Support used · this remains a supported attempt after closing.</small>}
     {supportOpen&&<aside id={id+'-support'} aria-label="Teaching support"><p className="og2-support-note">Use this guidance to develop your reasoning. Supported work is kept distinct from independent evidence.</p>{guidance}{move.supportSteps?.length>0&&<ol>{move.supportSteps.map(step=><li key={step}>{step}</li>)}</ol>}</aside>}
    </div>}
   </section>
  </div>
 </section>;
}
