import { ROUTES } from '../../app/routes';
import { CLASSROOM_ENTRY_INTENTS, setClassroomEntryIntent } from '../../core/classroom/classroomEntryIntent';
import { setActiveClassroomStandardId, setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import '../home/LearningDashboard.css';

export default function ProgressPage({ onNavigate }) {
  const data = getLearningDashboard();
  function open(lesson) {
    setClassroomEntryIntent(lesson.started ? CLASSROOM_ENTRY_INTENTS.RESUME : CLASSROOM_ENTRY_INTENTS.DIRECT);
    setActiveClassroomStandardId(lesson.content.standardId);
    setActiveClassroomSessionPreset(lesson.preset);
    onNavigate(ROUTES.CLASSROOM_STUDY);
  }
  return <div className="ld-page"><div className="ld-content">
    <header className="ld-header"><span className="ld-brand">JEREMIAH</span><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.HOME)}>Back to Home</button></header>
    <section className="ld-hero"><p className="ld-eyebrow">Your learning</p><h1>Understanding takes root.</h1><p>{data.inProgress || data.mastered ? 'Your saved lessons, the ground you have covered, and your next step.' : 'Begin a lesson in Classroom. Your progress will appear here as you learn.'}</p></section>
    <div className="ld-stats"><div><strong>{data.mastered}</strong><span>Mastered</span></div><div><strong>{data.inProgress}</strong><span>In progress</span></div><div><strong>{data.reviewNeeded}</strong><span>To revisit</span></div></div>
    <section className="ld-section"><h2>Your lessons</h2>{data.standards.map((lesson) => <article className="ld-record" key={lesson.content.standardId}><div><p className="ld-eyebrow">{lesson.content.studyTitle}</p><h3>{lesson.content.standardTitle}</h3><p>{lesson.mastered ? 'Mastered' : lesson.needsReview ? 'A point to revisit' : lesson.started ? 'In progress' : 'Ready to begin'} · {lesson.percent}%</p>{lesson.started && <p>{lesson.move?.title}</p>}</div><button type="button" className="ld-link" onClick={() => open(lesson)}>{lesson.mastered ? 'Revisit' : lesson.started ? 'Continue' : 'Begin'} →</button></article>)}</section>
    <p className="ld-muted">Progress is saved in this browser.</p>
  </div></div>;
}
