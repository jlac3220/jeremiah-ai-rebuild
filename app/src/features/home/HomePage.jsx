import { ROUTES } from '../../app/routes';
import { CLASSROOM_ENTRY_INTENTS, setClassroomEntryIntent } from '../../core/classroom/classroomEntryIntent';
import { setActiveClassroomStandardId, setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import './LearningDashboard.css';

export default function HomePage({ onNavigate }) {
  const data = getLearningDashboard();
  const active = data.active;
  function openLesson() {
    setClassroomEntryIntent(active.started ? CLASSROOM_ENTRY_INTENTS.RESUME : CLASSROOM_ENTRY_INTENTS.DIRECT);
    setActiveClassroomStandardId(active.content.standardId);
    setActiveClassroomSessionPreset(active.preset);
    onNavigate(active.started ? ROUTES.CLASSROOM_STUDY : ROUTES.CLASSROOM);
  }
  return <div className="ld-page"><div className="ld-content">
    <header className="ld-header"><span className="ld-brand">JEREMIAH</span><span className="ld-header-note">Rooted in the Word.</span></header>
    <section className="ld-hero"><p className="ld-eyebrow">A little deeper, every day</p><h1>{active.started ? 'Pick up the thread.' : 'Understanding starts here.'}</h1><p>Read carefully. Build understanding. Learn to explain what you believe.</p></section>
    <section className="ld-feature">
      <div className="ld-feature-heading"><span className="ld-eyebrow">{active.content.studyTitle}</span><span className="ld-path">{active.mastered ? 'Completed' : active.started ? 'Your place is saved' : 'Your first lesson'}</span></div>
      <h2>{active.content.standardTitle}</h2><p className="ld-truth">{active.content.truthStatement}</p>
      <div className="ld-next"><span className="ld-eyebrow">{active.mastered ? 'Return to the lesson' : active.started ? 'Where you left off' : 'Begin with Scripture'}</span><p>{active.move?.title || 'Open the Classroom'}</p></div>
      <div className="ld-progress-label"><span>Lesson progress</span><strong>{active.percent}%</strong></div>
      <div className="ld-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={active.percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${active.percent}%` }} /></div>
      <button type="button" className="ld-primary" onClick={openLesson}>{active.mastered ? 'Revisit lesson' : active.started ? 'Continue learning' : 'Enter Classroom'} <span>→</span></button>
    </section>
    <section className="ld-bottom"><div><p className="ld-eyebrow">Your learning</p><div className="ld-stats"><div><strong>{data.mastered}</strong><span>Mastered</span></div><div><strong>{data.inProgress}</strong><span>In progress</span></div><div><strong>{data.reviewNeeded}</strong><span>To revisit</span></div></div><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.PROGRESS)}>View your progress →</button></div>
      <div className="ld-bible"><span className="ld-eyebrow">Stay close to the text</span><h3>Open the Bible.</h3><p>A quiet place to read, with KJV, ASV, and WEB.</p><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.BIBLE_SUPPORT)}>Read Scripture →</button></div></section>
  </div></div>;
}
