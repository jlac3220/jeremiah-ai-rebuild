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
   <section className="jh-hero jh-ignite-hero" aria-label="Welcome to Jeremiah">
    <div className="jh-ignite-hero-copy">
     <div className="jh-ignite-tag"><span aria-hidden="true">✦</span> APOSTLES' DOCTRINE · PENTECOSTAL EXPERIENCE</div>
     <h1>Let the Word <em>come alive.</em></h1>
     <p>Real Scripture. Meaningful discoveries. A learning journey that grows with you.</p>
     <button type="button" className="jh-ignite-start" onClick={openLesson}>{active.started?'Pick up your lesson':'Start learning'} <span aria-hidden="true">↗</span></button>
    </div>
    <div className="jh-ignite-scene" aria-hidden="true">
     <div className="jh-ignite-disc"><span>✦</span></div>
     <div className="jh-ignite-verse"><span>HEAR, O ISRAEL</span><strong>ONE LORD</strong><small>DEUTERONOMY 6:4</small></div>
     <div className="jh-ignite-spark jh-ignite-spark-one">✦</div><div className="jh-ignite-spark jh-ignite-spark-two">✳</div>
    </div>
   </section>

   <section className="jh-ignite-section" aria-label="Your learning journey">
    <div className="jh-ignite-section-heading"><div><span className="jh-ignite-eyebrow">YOUR NEXT DISCOVERY</span><h2>Continue your journey</h2></div><span className="jh-ignite-chapter">{active.started?'In progress':'Ready to begin'}</span></div>
    <div className="jh-ignite-lesson">
     <div className="jh-ignite-lesson-art" aria-hidden="true"><div className="jh-ignite-arch"><span>✦</span><strong>01</strong><small>LEARN · GROW · LIVE</small></div><div className="jh-ignite-rings"/><div className="jh-ignite-lesson-art-label">{active.content.studyId==='OG'?'THE ONE TRUE GOD':'THE NEW BIRTH'}</div></div>
     <div className="jh-ignite-lesson-content">
      <div className="jh-ignite-meta"><span>{active.content.studyTitle}</span><small>{active.mastered?'Completed':active.started?'Continuing':'New lesson'}</small></div>
      <h3>{active.content.standardTitle}</h3>
      <p className="jh-ignite-next"><span aria-hidden="true">↗</span> {active.move?.title || 'Discover the lesson'}</p>
      <div className="jh-ignite-progress"><span>Lesson progress</span><strong>{active.percent}%</strong></div>
      <div className="jh-ignite-bar" role="progressbar" aria-label="Lesson progress" aria-valuenow={active.percent} aria-valuemin={0} aria-valuemax={100}><i style={{width:active.percent+'%'}}/></div>
      <button type="button" className="jh-ignite-continue" onClick={openLesson}>{action} <span aria-hidden="true">→</span></button>
     </div>
    </div>
   </section>

   <section className="jh-ignite-explore" aria-label="More ways to explore">
    <button type="button" className="jh-ignite-tile jh-ignite-tile-bible" onClick={()=>onNavigate(ROUTES.BIBLE_SUPPORT)}><span className="jh-ignite-tile-graphic"><BookIcon/></span><strong>Read Scripture</strong><small>Open your Bible</small><span className="jh-ignite-tile-arrow" aria-hidden="true">↗</span></button>
    <button type="button" className="jh-ignite-tile jh-ignite-tile-study" onClick={()=>onNavigate(ROUTES.CLASSROOM)}><span className="jh-ignite-tile-graphic">✦</span><strong>Enter Classroom</strong><small>Explore the standards</small><span className="jh-ignite-tile-arrow" aria-hidden="true">↗</span></button>
    <button type="button" className="jh-ignite-tile jh-ignite-tile-ask" onClick={()=>onNavigate(ROUTES.ASK_JEREMIAH)}><span className="jh-ignite-tile-graphic" aria-hidden="true">✧</span><strong>Ask Jeremiah</strong><small>Questions from the standards</small><span className="jh-ignite-tile-arrow" aria-hidden="true">↗</span></button>
    <button type="button" className="jh-ignite-tile jh-ignite-tile-progress" onClick={()=>onNavigate(ROUTES.PROGRESS)}><span className="jh-ignite-tile-graphic"><span className="jh-ignite-progress-number">{data.mastered}</span></span><strong>Your Growth</strong><small>See what you've learned</small><span className="jh-ignite-tile-arrow" aria-hidden="true">↗</span></button>
   </section>
   <div className="jh-footnote"><span><strong>{data.mastered}</strong> mastered</span><span aria-hidden="true">·</span><span><strong>{data.reviewNeeded}</strong> to revisit</span></div>
  </div>
 </div>;
}