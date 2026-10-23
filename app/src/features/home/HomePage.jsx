import { ROUTES } from '../../app/routes';
import { CLASSROOM_ENTRY_INTENTS, setClassroomEntryIntent } from '../../core/classroom/classroomEntryIntent';
import { setActiveClassroomStandardId, setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import './LearningDashboard.css';

function BookIcon() {
 return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 7.5C11.5 4.7 6.5 5.6 3.5 7v19c4.3-1.6 8.4-1.2 12.5 1.5M16 7.5c4.5-2.8 9.5-1.9 12.5-.5v19c-4.3-1.6-8.4-1.2-12.5 1.5V7.5Z"/><path d="M7 12c2.3-.5 4.1-.3 6 .7M19 12c2.2-1 4.1-1.2 6-.7"/></svg>;
}
function SacredArtwork() {
 return <div className="jh-art" aria-hidden="true">
  <div className="jh-art-halo" />
  <svg className="jh-art-svg" viewBox="0 0 300 310" fill="none">
   <circle cx="151" cy="155" r="119" stroke="#91B5ED" strokeWidth="1" opacity=".34"/>
   <circle cx="151" cy="155" r="99" stroke="#91B5ED" strokeWidth="1" opacity=".27"/>
   <path d="M151 17v28m0 219v28M13 155h29m218 0h28M53 57l20 20m156 156 20 20M247 57l-20 20M73 233l-20 20" stroke="#B6CFF5" strokeWidth="1.5" opacity=".65"/>
   <path d="M84 84q65-20 132 0v163q-64-22-132 0V84Z" fill="#E3EFFF" stroke="#A7CCFF" strokeWidth="2"/>
   <path d="M84 84q65-20 132 0v163q-64-22-132 0V84Z" fill="url(#page)" />
   <path d="M105 114h91M105 132h91M105 150h75M105 195h91M105 213h83" stroke="#6392D5" strokeWidth="2.5" strokeLinecap="round" opacity=".68"/>
   <path d="M151 163l-17-12 17-12 17 12-17 12Z" fill="#2375E8"/>
   <path d="M151 139v24m-17-12h34" stroke="#2375E8" strokeWidth="1.5"/>
   <circle cx="151" cy="37" r="4" fill="#B5D0F5"/><circle cx="270" cy="155" r="4" fill="#B5D0F5"/>
   <defs><linearGradient id="page" x1="82" y1="82" x2="212" y2="245" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFFFF"/><stop offset="1" stopColor="#D6E8FF"/></linearGradient></defs>
  </svg>
  <div className="jh-art-caption">DEUTERONOMY 6:4</div>
 </div>;
}
export default function HomePage({ onNavigate }) {
 const data=getLearningDashboard();
 const active=data.active;
 function openLesson() {
  setClassroomEntryIntent(active.started?CLASSROOM_ENTRY_INTENTS.RESUME:CLASSROOM_ENTRY_INTENTS.DIRECT);
  setActiveClassroomStandardId(active.content.standardId);
  setActiveClassroomSessionPreset(active.preset);
  onNavigate(ROUTES.CLASSROOM_LESSON);
 }
 const action=active.mastered?'Review lesson':active.started?'Continue lesson':'Begin lesson';
 return <div className="ld-page ld-home jh-page">
  <div className="ld-content jh-shell">
   <header className="ld-header jh-header">
    <div className="ld-logo"><span className="ld-logo-mark">J</span><span>Jeremiah</span></div>
    <button type="button" className="ld-profile-shortcut" onClick={()=>onNavigate(ROUTES.PROFILE)} aria-label="Open profile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/></svg></button>
   </header>
   <section className="jh-hero" aria-label="Your next step in Scripture">
    <div className="jh-hero-copy">
     <div className="jh-overline"><span className="jh-overline-mark"/>A PLACE TO GROW</div>
     <h1>Discover the <em>Word.</em><br/>Understand the truth.</h1>
     <p>Explore Scripture, one meaningful lesson at a time.</p>
     <button type="button" className="jh-hero-link" onClick={()=>onNavigate(ROUTES.CLASSROOM)}>Explore your classroom <span aria-hidden="true">↗</span></button>
    </div>
    <SacredArtwork/>
   </section>
   <div className="jh-section-top"><div><span className="jh-kicker">YOUR JOURNEY</span><h2>Continue learning</h2></div><span className="jh-count">{data.inProgress} in progress</span></div>
   <section className="jh-feature" aria-label="Current lesson">
    <div className="jh-feature-upper">
     <div><span className="jh-study">{active.content.studyTitle}</span><h3>{active.content.standardTitle}</h3></div>
     <span className="jh-status">{active.mastered?'Completed':active.started?'In progress':'Ready to begin'}</span>
    </div>
    <div className="jh-feature-foot">
     <div className="jh-next"><span className="jh-next-symbol" aria-hidden="true">↗</span><span><small>YOUR NEXT STEP</small><strong>{active.move?.title || 'Start your journey'}</strong></span></div>
     <div className="jh-progress"><div><span>Progress</span><strong>{active.percent}%</strong></div><div className="jh-progress-track" role="progressbar" aria-label="Lesson progress" aria-valuenow={active.percent} aria-valuemin={0} aria-valuemax={100}><i style={{width:active.percent+'%'}}/></div></div>
     <button type="button" className="jh-continue" onClick={openLesson}>{action}<span aria-hidden="true">→</span></button>
    </div>
   </section>
   <div className="jh-explore">
    <button type="button" className="jh-tool" onClick={()=>onNavigate(ROUTES.BIBLE_SUPPORT)}><span className="jh-tool-visual"><BookIcon/></span><span className="jh-tool-body"><strong>Open the Bible</strong><small>Read. Reflect. Discover.</small></span><span aria-hidden="true" className="jh-tool-arrow">↗</span></button>
    <button type="button" className="jh-tool jh-tool-classroom" onClick={()=>onNavigate(ROUTES.CLASSROOM)}><span className="jh-tool-visual jh-tool-visual-path" aria-hidden="true"><span>01</span></span><span className="jh-tool-body"><strong>Explore lessons</strong><small>Follow your learning path</small></span><span aria-hidden="true" className="jh-tool-arrow">↗</span></button>
   </div>
   <div className="jh-footnote"><span><strong>{data.mastered}</strong> mastered</span><span aria-hidden="true">·</span><span><strong>{data.reviewNeeded}</strong> to revisit</span></div>
  </div>
 </div>;
}