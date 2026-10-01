import { ROUTES } from '../../app/routes';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import { setClassroomEntryIntent, CLASSROOM_ENTRY_INTENTS } from '../../core/classroom/classroomEntryIntent';
import { setActiveClassroomStandardId, setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import '../home/LearningDashboard.css';

export default function ProfilePage({ onNavigate }) {
  const data = getLearningDashboard();
  const active = data.active;
  function resume() {
    setClassroomEntryIntent(active.started ? CLASSROOM_ENTRY_INTENTS.RESUME : CLASSROOM_ENTRY_INTENTS.DIRECT);
    setActiveClassroomStandardId(active.content.standardId);
    setActiveClassroomSessionPreset(active.preset);
    onNavigate(active.started ? ROUTES.CLASSROOM_STUDY : ROUTES.CLASSROOM);
  }
  return <div className="ld-page"><div className="ld-content">
    <header className="ld-header"><span className="ld-brand">JEREMIAH</span><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.HOME)}>Back to Home</button></header>
    <section className="ld-hero"><p className="ld-eyebrow">Your space</p><h1>Keep growing.</h1><p>Your learning stays with you in this browser. Return to your lesson whenever you are ready.</p></section>
    <section className="ld-feature"><p className="ld-eyebrow">{active.content.studyTitle}</p><h2>{active.content.standardTitle}</h2><p className="ld-muted">{active.started ? active.move?.title : 'Your first lesson is ready.'}</p><button type="button" className="ld-primary" onClick={resume}>{active.started ? 'Continue learning' : 'Begin learning'} <span>→</span></button></section>
    <section className="ld-bottom"><div><p className="ld-eyebrow">Your learning</p><div className="ld-stats"><div><strong>{data.mastered}</strong><span>Mastered</span></div><div><strong>{data.inProgress}</strong><span>In progress</span></div><div><strong>{data.reviewNeeded}</strong><span>To revisit</span></div></div><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.PROGRESS)}>View progress →</button></div><div className="ld-bible"><p className="ld-eyebrow">Reading</p><h3>Make room for Scripture.</h3><p>Your Bible reader remembers your last chapter.</p><button type="button" className="ld-link" onClick={() => onNavigate(ROUTES.BIBLE_SUPPORT)}>Open the Bible →</button></div></section>
  </div></div>;
}
