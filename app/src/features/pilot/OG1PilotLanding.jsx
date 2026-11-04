import {useState} from 'react';
import {ROUTES} from '../../app/routes';
import {getClassroomContentByStandardId} from '../../core/classroom/content/classroomContentRegistry';
import {loadLearningState,clearLearningState} from '../../core/classroom/learningEngine';
import {setActiveClassroomStandardId,setActiveClassroomSessionPreset} from '../../core/classroom/classroomSessionData';
import {setClassroomEntryIntent,CLASSROOM_ENTRY_INTENTS} from '../../core/classroom/classroomEntryIntent';
import './OG1PilotLanding.css';

const PILOT_STANDARD='OG.1.LESSON.18';

export default function OG1PilotLanding({onNavigate}){
 const [consent,setConsent]=useState(false);
 const [progress,setProgress]=useState(()=>{
  const content=getClassroomContentByStandardId(PILOT_STANDARD);
  return content?loadLearningState(content,'direct'):null;
 });
 const [showReset,setShowReset]=useState(false);
 const started=Boolean(progress?.completedMoveIds?.length||Object.keys(progress?.attemptsByMove||{}).length);
 const finished=Boolean(progress?.milestones?.complete||progress?.currentMoveId==='complete');
 function begin(fresh=false){
  if(!consent)return;
  const content=getClassroomContentByStandardId(PILOT_STANDARD);
  if(!content)return;
  if(fresh){clearLearningState(content,'direct');setProgress(loadLearningState(content,'direct'));}
  // The pilot always uses the new OG.1 player, never an old saved legacy-view flag.
  window.sessionStorage.removeItem('jeremiah-og1-classic');
  setActiveClassroomStandardId(PILOT_STANDARD);
  setActiveClassroomSessionPreset('direct');
  setClassroomEntryIntent(CLASSROOM_ENTRY_INTENTS.DIRECT);
  window.sessionStorage.setItem('jeremiah-pilot-active','1');
  onNavigate(ROUTES.CLASSROOM_LESSON);
 }
 return <div className="ogpilot-page">
  <header className="ogpilot-top"><strong><span>J</span> JEREMIAH</strong><span>LESSON EXPERIENCE PILOT</span></header>
  <main className="ogpilot-shell">
   <section className="ogpilot-hero">
    <div><span className="ogpilot-eyebrow">INVITATION · HELP SHAPE THE EXPERIENCE</span>
     <h1>Explore the lesson.<br/><em>Help make it remarkable.</em></h1>
     <p>Follow the confession of one God from Moses through Isaiah, Jesus, and the apostles. Experience the Scripture, imagery, narration, activities, and assessments—then tell us what worked and what needs to change.</p>
     <div className="ogpilot-meta"><span>One complete lesson</span><span>Five connected chapters</span><span>Optional anonymous feedback</span></div>
    </div>
    <aside className="ogpilot-verse"><span>THE ONE TRUE GOD</span><blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote><small>DEUTERONOMY 6:4 · KJV</small><div aria-hidden="true">אֶחָד</div></aside>
   </section>
   <section className="ogpilot-start" aria-labelledby="ogpilot-start-title">
    <div><span className="ogpilot-eyebrow">HOW IT WORKS</span><h2 id="ogpilot-start-title">Your experience matters.</h2><p>No account is required. Your lesson progress stays in this browser; if you return using the same browser, you can continue. The survey never sends your answers or exam score with your feedback.</p>
     <label className="ogpilot-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I am 18 or older and understand this is a pilot lesson. My written lesson answers will be processed by Jeremiah's teaching service; submitting feedback is optional.</span></label>
     <div className="ogpilot-actions">
      <button type="button" className="ogpilot-primary" disabled={!consent} onClick={()=>begin(false)}>{finished?'Revisit the lesson':started?'Continue my lesson':'Start the lesson'} <span aria-hidden="true">→</span></button>
      {started&&<button type="button" className="ogpilot-secondary" onClick={()=>setShowReset(true)}>Start fresh</button>}
     </div>
     {showReset&&<div className="ogpilot-confirm" role="group" aria-label="Confirm restart"><p>Start from the beginning on this browser? Your existing local progress for this lesson will be cleared.</p><button type="button" disabled={!consent} onClick={()=>{setShowReset(false);begin(true)}}>Yes, start fresh</button><button type="button" onClick={()=>setShowReset(false)}>Cancel</button></div>}
    </div>
    <aside className="ogpilot-feedback-invite"><span className="ogpilot-eyebrow">YOUR VOICE SHAPES THE NEXT VERSION</span><h3>What should Jeremiah do better?</h3><p>After the lesson, evaluate teaching clarity, pacing, visual design, navigation, narrator, activities, and more. If you cannot finish, you can still tell us why.</p><button type="button" onClick={()=>onNavigate(ROUTES.PILOT_FEEDBACK)}>Share feedback without finishing ↗</button></aside>
   </section>
   <footer className="ogpilot-footnote">Pilot access is intended for invited adult testers. Please avoid including names or other identifying information in free-text feedback.</footer>
  </main>
 </div>;
}
