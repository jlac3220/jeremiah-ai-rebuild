import BrandLogo from '../../shared/brand/BrandLogo';
import { ROUTES } from '../../app/routes';
import { setBibleReaderIntent } from '../../core/bible/bibleReaderIntent';
import { CLASSROOM_ENTRY_INTENTS, setClassroomEntryIntent } from '../../core/classroom/classroomEntryIntent';
import { setActiveClassroomStandardId, setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import './LearningDashboard.css';
import './JeremiahHomeExperience.css';

// A small, verified KJV reading rotation while the old Rapid Fire service is
// rebuilt against the new curriculum. This is reading, not a graded quiz.
const DAILY_SCRIPTURES = Object.freeze([
 {reference:'Deuteronomy 6:4',text:'Hear, O Israel: The LORD our God is one LORD:'},
 {reference:'Deuteronomy 6:5',text:'And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.'},
 {reference:'John 3:16',text:'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'},
 {reference:'Mark 12:29',text:'And Jesus answered him, The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord:'},
 {reference:'Isaiah 44:6',text:'Thus saith the LORD the King of Israel, and his redeemer the LORD of hosts; I am the first, and I am the last; and beside me there is no God.'},
 {reference:'1 Timothy 2:5',text:'For there is one God, and one mediator between God and men, the man Christ Jesus;'},
 {reference:'Acts 2:38',text:'Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.'}
]);

function scriptureForToday() {
 const now=new Date();
 const day=Math.floor(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate())/86400000);
 return DAILY_SCRIPTURES[day%DAILY_SCRIPTURES.length];
}

function ExperienceArrow(){return <span className="jx-arrow" aria-hidden="true">↗</span>;}

export default function HomePage({onNavigate}) {
 const data=getLearningDashboard();
 const active=data.active;
 const verse=scriptureForToday();
 function openLesson() {
  if (!active) {onNavigate(ROUTES.CLASSROOM);return;}
  setClassroomEntryIntent(active.started?CLASSROOM_ENTRY_INTENTS.RESUME:CLASSROOM_ENTRY_INTENTS.DIRECT);
  setActiveClassroomStandardId(active.content.standardId);
  setActiveClassroomSessionPreset(active.preset);
  onNavigate(ROUTES.CLASSROOM_LESSON);
 }
 function openToday() {
  setBibleReaderIntent(verse.reference,{returnRoute:ROUTES.HOME,source:'home-daily-scripture'});
  onNavigate(ROUTES.BIBLE_SUPPORT);
 }
 const primary=active?.mastered?'Review your lesson':active?.started?'Continue your lesson':'Begin your lesson';
 return <div className="ld-page ld-home jh-page jx-home">
  <div className="ld-content jx-shell">
   <header className="ld-header jh-header jx-header">
    <BrandLogo/>
    <button type="button" className="ld-profile-shortcut" onClick={()=>onNavigate(ROUTES.PROFILE)} aria-label="Open profile">
     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/></svg>
    </button>
   </header>

   <section className="jx-hero" aria-labelledby="jx-hero-title">
    <div className="jx-hero-copy">
     <p className="jx-overline">APOSTLES’ DOCTRINE <span aria-hidden="true">·</span> PENTECOSTAL EXPERIENCE</p>
     <h1 id="jx-hero-title">Scripture is more than words. <em>Understand the story.</em></h1>
     <p className="jx-hero-intro">Discover what the Bible says, why it matters, and how each passage connects. Jeremiah guides you from reading to understanding.</p>
     <button type="button" className="jx-main-action" onClick={openLesson}>{primary} <ExperienceArrow/></button>
     {active&&<div className="jx-current" aria-label="Your current learning place">
      <span className="jx-current-mark" aria-hidden="true">01</span>
      <span><strong>{active.content.standardTitle}</strong><small>{active.started ? (active.move?.title || 'Your place is saved') : 'Start with the first confession'} <span aria-hidden="true">·</span> {active.percent}% covered</small></span>
     </div>}
    </div>
    <div className="jx-scripture-stage" aria-label="Our starting passage">
     <span className="jx-stage-overline">THE CONFESSION THAT BEGINS THE JOURNEY</span>
     <span className="jx-stage-mark" lang="he" dir="rtl">אֶחָד</span>
     <blockquote>“Hear, O Israel: The LORD our God is <strong>one LORD:</strong>”</blockquote>
     <span className="jx-stage-reference">DEUTERONOMY 6:4 <span aria-hidden="true">·</span> KJV</span>
     <div className="jx-stage-thread"><span>MOSES</span><span>ISAIAH</span><span>JESUS</span><span>APOSTLES</span></div>
    </div>
   </section>

   <section className="jx-paths" aria-labelledby="jx-paths-title">
    <div className="jx-section-heading">
     <span className="jx-eyebrow">A DIFFERENT WAY TO ENGAGE</span>
     <h2 id="jx-paths-title">How would you like to learn today?</h2>
     <p>Choose an experience. Each takes you somewhere different.</p>
    </div>
    <div className="jx-path-grid">
     <button className="jx-path jx-path-ask" type="button" onClick={()=>onNavigate(ROUTES.ASK_JEREMIAH)}>
      <span className="jx-path-index">01 / ASK</span><strong>Talk with Jeremiah</strong>
      <span>Bring a question. Work through Scripture with your personal Bible teacher.</span>
      <ExperienceArrow/>
     </button>
     <button className="jx-path jx-path-bible" type="button" onClick={()=>onNavigate(ROUTES.BIBLE_SUPPORT)}>
      <span className="jx-path-index">02 / READ</span><strong>Open the Bible</strong>
      <span>Read the chapter, explore the context, and follow a passage for yourself.</span>
      <ExperienceArrow/>
     </button>
     <button className="jx-path jx-path-studies" type="button" onClick={()=>onNavigate(ROUTES.CLASSROOM)}>
      <span className="jx-path-index">03 / STUDY</span><strong>Explore the studies</strong>
      <span>Choose a study room and see the full path beyond your current lesson.</span>
      <ExperienceArrow/>
     </button>
     <button className="jx-path jx-path-progress" type="button" onClick={()=>onNavigate(ROUTES.PROGRESS)}>
      <span className="jx-path-index">04 / GROW</span><strong>Your learning journey</strong>
      <span>See the ground you've covered and the understanding you're building.</span>
      <ExperienceArrow/>
     </button>
    </div>
   </section>

   <section className="jx-daily" aria-labelledby="jx-daily-title">
    <div className="jx-daily-lead"><span className="jx-eyebrow">FROM THE ORIGINAL JEREMIAH EXPERIENCE</span><h2 id="jx-daily-title">Today's Scripture</h2><p>A passage for today. Read the words, then open the chapter to understand their setting.</p></div>
    <div className="jx-daily-passage"><span>{verse.reference.toUpperCase()} · KJV</span><blockquote>“{verse.text}”</blockquote><button type="button" onClick={openToday}>Read in context <ExperienceArrow/></button></div>
   </section>
  </div>
 </div>;
}
