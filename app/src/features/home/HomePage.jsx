import { ROUTES } from '../../app/routes';
import { CLASSROOM_ENTRY_INTENTS, setClassroomEntryIntent } from '../../core/classroom/classroomEntryIntent';
import { setActiveClassroomStandardId, setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import './LearningDashboard.css';

function TileIcon({ kind }) {
  if (kind === 'bible') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v16M3 4c3-1 6-1 9 1 3-2 6-2 9-1v16c-3-1-6-1-9 1-3-2-6-2-9-1z"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 18v-5m5 5V9m5 9V5m5 13v-8M2 21h20"/>
    </svg>
  );
}

export default function HomePage({ onNavigate }) {
  const data = getLearningDashboard();
  const active = data.active;
  function openLesson() {
    setClassroomEntryIntent(active.started ? CLASSROOM_ENTRY_INTENTS.RESUME : CLASSROOM_ENTRY_INTENTS.DIRECT);
    setActiveClassroomStandardId(active.content.standardId);
    setActiveClassroomSessionPreset(active.preset);
    onNavigate(ROUTES.CLASSROOM_LESSON);
  }
  const action = active.mastered ? 'Revisit lesson' : active.started ? 'Continue learning' : 'Start learning';

  return (
    <div className="ld-page ld-home">
      <div className="ld-content">
        <header className="ld-header">
          <div className="ld-logo"><span className="ld-logo-mark" aria-hidden="true">J</span><span>Jeremiah</span></div>
          <button type="button" className="ld-profile-shortcut" onClick={() => onNavigate(ROUTES.PROFILE)} aria-label="Open your profile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/></svg>
          </button>
        </header>

        <section className="ld-home-intro">
          <div className="ld-intro-copy">
            <span className="ld-home-label">YOUR LEARNING SPACE</span>
            <h1>Pick up where you left off.</h1>
            <p>One meaningful step at a time.</p>
          </div>
          <div className="ld-intro-art" aria-hidden="true"><span className="ld-orbit ld-orbit-back"/><span className="ld-orbit ld-orbit-front"/><span className="ld-art-book">✦</span><span className="ld-art-small">●</span></div>
        </section>

        <section className="ld-continue-card" aria-label="Continue your lesson">
          <div className="ld-feature-heading">
            <span className="ld-card-kicker"><span className="ld-live-dot" />{active.content.studyTitle}</span>
            <span className="ld-lesson-status">{active.mastered ? 'Completed' : active.started ? 'In progress' : 'Up next'}</span>
          </div>
          <h2>{active.content.standardTitle}</h2>
          <p className="ld-next-step"><span className="ld-step-icon" aria-hidden="true">↗</span><span><small>UP NEXT</small><strong>{active.move?.title || 'Begin your lesson'}</strong></span></p>
          <div className="ld-progress-label"><span>Lesson progress</span><strong>{active.percent}%</strong></div>
          <div className="ld-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={active.percent} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: active.percent + '%' }} />
          </div>
          <button type="button" className="ld-primary" onClick={openLesson}>{action}<span aria-hidden="true">→</span></button>
          <details className="ld-overview"><summary>What will I learn?</summary><p>{active.content.truthStatement}</p></details>
        </section>

        <section className="ld-under-card" aria-label="More ways to learn">
          <button type="button" className="ld-bible-row" onClick={() => onNavigate(ROUTES.BIBLE_SUPPORT)}>
            <span className="ld-tile-icon"><TileIcon kind="bible"/></span>
            <span><strong>Open the Bible</strong><small>Read and explore Scripture</small></span>
            <span className="ld-bible-arrow" aria-hidden="true">→</span>
          </button>
          <div className="ld-mini-stats" aria-label="Your learning at a glance">
            <span><strong>{data.mastered}</strong> mastered</span>
            <span><strong>{data.inProgress}</strong> in progress</span>
            <span><strong>{data.reviewNeeded}</strong> to revisit</span>
          </div>
        </section>
      </div>
    </div>
  );
}
