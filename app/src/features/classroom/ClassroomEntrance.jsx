import { ROUTES } from '../../app/routes';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import { setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { setClassroomEntryIntent, CLASSROOM_ENTRY_INTENTS } from '../../core/classroom/classroomEntryIntent';
import '../home/LearningDashboard.css';
import './ClassroomEntrance.css';

export function ClassroomStudyRoom({ onNavigate }) {
  const { active } = getLearningDashboard();
  function enter() {
    setActiveClassroomSessionPreset(active.preset);
    setClassroomEntryIntent(active.started ? CLASSROOM_ENTRY_INTENTS.RESUME : CLASSROOM_ENTRY_INTENTS.DIRECT);
    onNavigate(ROUTES.CLASSROOM_LESSON);
  }
  return <div className="ld-page ce-page"><div className="ld-content">
    <header className="ld-header"><span className="ld-brand">JEREMIAH</span><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.CLASSROOM)}>← All rooms</button></header>
    <section className="ld-hero"><p className="ld-eyebrow">The One True God</p><h1>Come ready to understand.</h1><p>Start with Scripture. Work through its meaning. Then explain the truth in your own words.</p></section>
    <div className="ce-layout"><section className="ld-feature ce-lesson"><div className="ld-feature-heading"><span className="ld-eyebrow">{active.content.studyTitle}</span><span className="ld-path">{active.mastered ? 'Ready to revisit' : active.started ? 'Your place is saved' : 'Begin here'}</span></div>
      <h2>{active.content.standardTitle}</h2><p className="ld-truth">{active.content.brain?.essentialQuestion || active.content.truthStatement}</p>
      <div className="ld-next"><span className="ld-eyebrow">{active.started ? 'Where you left off' : 'Your opening passage'}</span><p>{active.started ? active.move?.title : 'Deuteronomy 6:4 · Hear, O Israel'}</p></div>
      {active.started && <><div className="ld-progress-label"><span>Lesson progress</span><strong>{active.percent}%</strong></div><div className="ld-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={active.percent} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${active.percent}%`}} /></div></>}
      <button type="button" className="ld-primary" onClick={enter}>{active.mastered ? 'Revisit lesson' : active.started ? 'Continue your lesson' : 'Begin your lesson'} <span>→</span></button><p className="ce-save-note">You can leave and return. Your place and answers are saved in this browser.</p>
    </section><aside className="ce-expect"><p className="ld-eyebrow">How learning works here</p><ol><li><span>01</span><div><h3>Listen to the Word</h3><p>Read the passage and notice what it says.</p></div></li><li><span>02</span><div><h3>Make the connection</h3><p>Compare Scripture and work through guided questions.</p></div></li><li><span>03</span><div><h3>Explain the truth</h3><p>Check your understanding and put it into your own words.</p></div></li></ol><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.BIBLE_SUPPORT)}>Open the Bible first →</button></aside></div>
  </div></div>;
}

export default function ClassroomEntrance({ onNavigate }) {
  const { active } = getLearningDashboard();
  return <div className="ld-page ce-page"><div className="ld-content">
    <header className="ld-header"><span className="ld-brand">JEREMIAH</span><span className="ld-header-note">Classroom</span></header>
    <section className="ld-hero"><p className="ld-eyebrow">A place to learn</p><h1>Different rooms.<br />Deeper understanding.</h1><p>Choose a room to explore. Each study brings you into Scripture, guided teaching, and a clearer understanding of the truth.</p></section>
    <section className="ce-doors" aria-label="Classroom rooms">
      <button type="button" className="ce-door ce-door-active" onClick={() => onNavigate(ROUTES.CLASSROOM_STUDY)}><span className="ce-door-number">01</span><span className="ld-eyebrow">Study room</span><h2>The One True God</h2><p>Who is God? Begin with Israel’s confession and follow its witness through Scripture.</p><span className="ce-door-status">{active.started ? 'Your lesson is waiting' : '1 lesson ready'}</span><span className="ce-door-action">Enter this room <span>→</span></span></button>
      <article className="ce-door ce-door-planned"><span className="ce-door-number">02</span><span className="ld-eyebrow">Study room</span><h2>New Birth</h2><p>Explore repentance, baptism, and the gift of the Holy Ghost.</p><span className="ce-door-status">Lessons in preparation</span></article>
      <button type="button" className="ce-door" onClick={() => onNavigate(ROUTES.BIBLE_SUPPORT)}><span className="ce-door-number">03</span><span className="ld-eyebrow">Reading room</span><h2>The Bible</h2><p>Take time with the text. Read a chapter or follow the passages from your lesson.</p><span className="ce-door-status">KJV · ASV · WEB</span><span className="ce-door-action">Open the Bible <span>→</span></span></button>
    </section>
  </div></div>;
}
