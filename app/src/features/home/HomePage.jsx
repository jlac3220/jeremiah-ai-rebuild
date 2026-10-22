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
    onNavigate(active.started ? ROUTES.CLASSROOM_STUDY : ROUTES.CLASSROOM);
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
          <span className="ld-home-label">YOUR CLASSROOM</span>
          <h1>Keep your momentum.</h1>
          <p>One step closer to understanding.</p>
        </section>

        <section className="ld-continue-card" aria-label="Continue your lesson">
          <div className="ld-feature-heading">
            <span className="ld-card-kicker"><span className="ld-live-dot" />{active.content.studyTitle}</span>
            <span className="ld-lesson-status">{active.mastered ? 'Completed' : active.started ? 'In progress' : 'Up next'}</span>
          </div>
          <h2>{active.content.standardTitle}</h2>
          <div className="ld-move-chip"><span aria-hidden="true">↗</span>{active.move?.title || 'Your next lesson'}</div>
          <div className="ld-progress-label"><span>Your progress</span><strong>{active.percent}%</strong></div>
          <div className="ld-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={active.percent} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: active.percent + '%' }} />
          </div>
          <button type="button" className="ld-primary" onClick={openLesson}>{action}<span aria-hidden="true">→</span></button>
          <details className="ld-overview"><summary>What's this lesson about?</summary><p>{active.content.truthStatement}</p></details>
        </section>

        <section className="ld-quick-section" aria-label="Quick access">
          <div className="ld-section-heading"><h2>Your space</h2><span>Explore</span></div>
          <div className="ld-quick-grid">
            <button type="button" className="ld-quick-tile ld-quick-bible" onClick={() => onNavigate(ROUTES.BIBLE_SUPPORT)}>
              <span className="ld-tile-icon"><TileIcon kind="bible"/></span>
              <span className="ld-quick-copy"><strong>Read the Bible</strong><small>KJV · ASV · WEB</small></span>
              <span className="ld-tile-arrow" aria-hidden="true">↗</span>
            </button>
            <button type="button" className="ld-quick-tile ld-quick-progress" onClick={() => onNavigate(ROUTES.PROGRESS)}>
              <span className="ld-tile-icon"><TileIcon kind="progress"/></span>
              <span className="ld-quick-copy"><strong>My progress</strong><small>Track your journey</small></span>
              <span className="ld-tile-arrow" aria-hidden="true">↗</span>
            </button>
          </div>
        </section>

        <section className="ld-snapshot" aria-label="Your learning at a glance">
          <div><strong>{data.mastered}</strong><span>Mastered</span></div>
          <div><strong>{data.inProgress}</strong><span>In progress</span></div>
          <div><strong>{data.reviewNeeded}</strong><span>To revisit</span></div>
        </section>
      </div>
    </div>
  );
}
