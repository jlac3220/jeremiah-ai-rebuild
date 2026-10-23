import { getLessonFrame, LESSON_PHASES } from '../../core/classroom/lessonBlueprint';
import './LessonPath.css';

// A readable location marker, not a shortcut past assessment steps.
export default function LessonPath({content,move,state,compact=false}) {
 const frame=getLessonFrame(content,move,state);
 const multi=frame.chapterCount>1;
 return <section className={'lp-panel'+(compact?' lp-compact':'')} aria-label="Your learning path">
   <div className="lp-top">
     <span className="lp-kicker">{multi?'Chapter '+frame.chapterNumber+' of '+frame.chapterCount:'Your learning path'}</span>
     {multi&&<span className="lp-standard">{frame.chapter.standardId}</span>}
   </div>
   {multi&&<>
     <strong className="lp-chapter">{frame.chapter.title}</strong>
     <p className="lp-question">{frame.chapter.question}</p>
     <div className="lp-chapter-track" role="img" aria-label={'Chapter '+frame.chapterNumber+' of '+frame.chapterCount+'; '+frame.completed+' chapter assessments complete'}>
       {frame.chapters.map((chapter,i)=><span key={chapter.standardId} className={i<frame.chapterIndex?'is-before':i===frame.chapterIndex?'is-current':''}/>)}
     </div>
   </>}
   <div className="lp-phases" aria-label={'Current stage: '+frame.phase}>
     {LESSON_PHASES.map((phase,i)=><span key={phase} className={frame.isComplete||i<frame.phaseIndex?'is-finished':i===frame.phaseIndex?'is-active':''}>
       <i aria-hidden="true">{frame.isComplete||i<frame.phaseIndex?'✓':i+1}</i>{phase}
     </span>)}
   </div>
 </section>;
}
