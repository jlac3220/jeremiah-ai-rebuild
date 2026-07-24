// src/StudiesPage.js — Uses props from App.js for progress tracking
import React, { useState } from "react";
import { theme } from "./theme";
import PageHeader from "./PageHeader";

const { colors, gradients, typography } = theme;
const { roles, lineHeights } = typography;

export default function StudiesPage({
  onBack,
  backLabel,
  onSelectStudy,
  onShowProfile,
  onShowAccount,
  onShare,
  profileImageUrl,
  // Progress props from App.js
  coreTrackCompleted = false,
  coreTrackStats = { totalLessons: 17, completedLessons: 0, percent: 0 },
  studyProgress = {
    OG: { completed: 0, total: 3, percent: 0 },
    NB: { completed: 0, total: 14, percent: 0 },
    PS: { completed: 0, total: 4, percent: 0 },
  },
}) {
  const [coreOpen, setCoreOpen] = useState(false);
  const [coreAnimating, setCoreAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("in");
  const [slideStudy, setSlideStudy] = useState(null);

  // Use progress from props
  const ogStats = studyProgress.OG || { completed: 0, total: 3, percent: 0 };
  const nbStats = studyProgress.NB || { completed: 0, total: 14, percent: 0 };
  const psStats = studyProgress.PS || { completed: 0, total: 4, percent: 0 };

  const coreCompleted = coreTrackStats.completedLessons || 0;
  const coreTotal = coreTrackStats.totalLessons || 17;
  const corePercent = coreTrackStats.percent || 0;

  // Core track = OG + NB only (foundation studies)
  const coreStudies = [
    {
      id: "OG",
      orderLabel: "Study One",
      title: "The One True God",
      tag: "Core study",
      headerLine: "See who Jesus is according to the Word.",
      description:
        "This study anchors everything else you believe. Walk through Scripture to see how the one true God is revealed in Jesus Christ and why that matters for your salvation.",
      highlights: [
        "See Old and New Testament passages that reveal one God.",
        "Understand how the fullness of God is in Jesus Christ.",
        "Connect the revelation of who He is to how He saves.",
      ],
      stats: {
        completed: ogStats.completed,
        total: ogStats.total,
        percent: ogStats.percent,
        hasStarted: ogStats.completed > 0 || ogStats.percent > 0,
      },
    },
    {
      id: "NB",
      orderLabel: "Study Two",
      title: "The New Birth",
      tag: "Core study",
      headerLine: "The New Birth sets the Word burning in your heart.",
      description:
        "That spark begins your walk with God. Each lesson in this study fuels your understanding of repentance, water baptism in Jesus' name, and the infilling of the Spirit as He lights the path before you.",
      highlights: [
        "See why every person needs the new birth.",
        "Walk through repentance, water baptism, and the Spirit.",
        "Build a clear, Bible-based understanding of salvation.",
      ],
      stats: {
        completed: nbStats.completed,
        total: nbStats.total,
        percent: nbStats.percent,
        hasStarted: nbStats.completed > 0 || nbStats.percent > 0,
      },
    },
  ];

  // Studies that unlock after completing core track (OG + NB)
  const lockedStudies = [
    {
      id: "PS",
      title: "Pentecost and Sinai",
      tag: "Typology",
      headerLine: "From Mount Sinai to the Upper Room.",
      description:
        "Trace the connection between the giving of the Law at Mount Sinai and the outpouring of the Holy Spirit on the Day of Pentecost. See how God's covenant with Israel foreshadows the New Testament experience of being filled with the Spirit.",
      highlights: [
        "Understand the parallels between Sinai and Pentecost.",
        "See how Old Testament types point to New Testament fulfillment.",
        "Connect covenant history to personal Spirit baptism.",
      ],
      blurb:
        "Trace the connection between Mount Sinai and the Day of Pentecost.",
      stats: psStats,
    },
  ];

  const handleOpenCore = () => {
    setSlideDirection("in");
    setCoreAnimating(true);
    setCoreOpen(true);
  };

  const handleReturnToStudies = () => {
    setSlideDirection("out");
    setCoreAnimating(true);
    setTimeout(() => {
      setCoreOpen(false);
      setCoreAnimating(false);
    }, 300);
  };

  const handleStartStudy = (id) => {
    const study = [...coreStudies, ...lockedStudies].find((s) => s.id === id);
    if (!study) return;

    const stats = study.stats;
    // Skip intro if any progress at all — completed lessons OR partial percent
    const hasStarted = (stats?.completed > 0) || (stats?.percent > 0);

    // If already started, go straight to lessons
    if (hasStarted && typeof onSelectStudy === "function") {
      onSelectStudy(study.id);
      return;
    }

    // Otherwise show intro panel
    setSlideStudy(study);
  };

  const handleCloseSlide = () => {
    setSlideStudy(null);
  };

  const handleBeginStudy = () => {
    if (slideStudy && typeof onSelectStudy === "function") {
      onSelectStudy(slideStudy.id);
      setSlideStudy(null);
    }
  };

  const headerBackHandler = coreOpen ? handleReturnToStudies : onBack;
  const headerBackLabel = coreOpen ? "All studies" : backLabel;

  return (
    <div className="studies-page">
      <PageHeader
        title="Studies"
        onBack={headerBackHandler}
        backLabel={headerBackLabel}
        onProfile={onShowProfile}
        onAccount={onShowAccount}
        onShare={onShare}
        profileImageUrl={profileImageUrl}
      />

      <main className="studies-content">
        {/* MAIN VIEW */}
        {!coreOpen && (
          <div
            className={`view-container ${
              coreAnimating && slideDirection === "out"
                ? "slide-in-from-left"
                : ""
            }`}
          >
            {/* Hero card for Core Track */}
            <section className="hero-card">
              <div className="hero-pill">
                <img
                  src="/ignite-logo-flame.png"
                  alt=""
                  className="pill-flame"
                />
                <span>Start here</span>
              </div>
              <h1 className="hero-title">Core Track</h1>
              <p className="hero-sub">
                Begin with The One True God and The New Birth — the foundation
                for everything else.
              </p>

              <div className="hero-progress-row">
                <div className="hero-progress-label">
                  {coreCompleted} of {coreTotal} lessons complete
                </div>
                <div className="hero-progress-percent">{corePercent}%</div>
              </div>
              <div className="hero-progress-bar">
                <div
                  className="hero-progress-fill"
                  style={{ width: `${corePercent}%` }}
                />
              </div>

              <button
                type="button"
                className="hero-action-btn"
                onClick={handleOpenCore}
              >
                <span>Open Core Track</span>
                <span className="hero-arrow">›</span>
              </button>
            </section>

            {/* Reset progress (subtle) */}
            <div className="reset-row">
              <button
                type="button"
                className="reset-progress-btn"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset all lesson progress? This cannot be undone."
                    )
                  ) {
                    localStorage.removeItem("ignite_lesson_progress");
                    window.location.reload();
                  }
                }}
              >
                Reset Progress
              </button>
            </div>

            {/* More studies section */}
            <div className="section-header-row">
              <div className="section-title">MORE STUDIES</div>
              <div className="section-hint">
                {!coreTrackCompleted
                  ? "Complete core track to unlock"
                  : "Now unlocked"}
              </div>
            </div>

            <div className="other-studies-list">
              {lockedStudies.map((study) => {
                const locked = !coreTrackCompleted;
                return (
                  <button
                    key={study.id}
                    type="button"
                    className={`other-study-card ${locked ? "locked" : ""}`}
                    onClick={() => !locked && handleStartStudy(study.id)}
                    disabled={locked}
                  >
                    <div className="study-icon-badge">
                      {locked ? "🔒" : "📖"}
                    </div>
                    <div className="other-study-content">
                      <div className="other-study-tag">{study.tag}</div>
                      <div className="other-study-title">{study.title}</div>
                      <div className="other-study-blurb">{study.blurb}</div>
                    </div>
                    {!locked && <div className="study-arrow">›</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CORE TRACK VIEW */}
        {coreOpen && (
          <section
            className={`core-view ${
              coreAnimating && slideDirection === "in"
                ? "slide-in-from-right"
                : ""
            } ${
              coreAnimating && slideDirection === "out"
                ? "slide-out-to-right"
                : ""
            }`}
          >
            {/* Simple header */}
            <div className="core-view-header">
              <h2 className="core-view-title">Core Track</h2>
              <p className="core-view-sub">
                Choose a study to continue your foundation.
              </p>
            </div>

            <div className="core-studies-list">
              {coreStudies.map((study, index) => {
                const stats = study.stats;
                const isComplete =
                  stats.completed === stats.total && stats.total > 0;
                const isStarted = (stats.percent > 0) && !isComplete;

                return (
                  <button
                    key={study.id}
                    type="button"
                    className={`core-study-card ${
                      isComplete ? "complete" : ""
                    } ${isStarted ? "in-progress" : ""}`}
                    onClick={() => handleStartStudy(study.id)}
                  >
                    {/* Accent bar */}
                    <div
                      className={`card-accent ${isComplete ? "complete" : ""}`}
                    />

                    {/* Header row */}
                    <div className="card-header-row">
                      <div className="card-tag-pill">{study.orderLabel}</div>
                      {isComplete && (
                        <div className="card-complete-badge">✓ Complete</div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="core-study-title">{study.title}</h3>
                    <p className="core-study-sub">{study.headerLine}</p>

                    {/* Progress section */}
                    <div className="card-progress-section">
                      <div className="progress-info-row">
                        <span className="progress-label">
                          {stats.completed} of {stats.total} lessons
                        </span>
                        <span
                          className={`progress-percent ${
                            isComplete ? "complete" : ""
                          }`}
                        >
                          {stats.percent}%
                        </span>
                      </div>
                      <div className="study-bar">
                        <div
                          className={`study-bar-fill ${
                            isComplete ? "complete" : ""
                          }`}
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="card-footer-row">
                      <span className="card-action-text">
                        {isComplete
                          ? "Review study"
                          : isStarted
                          ? "Continue"
                          : "Begin study"}
                      </span>
                      <span className="card-arrow">→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Centered Modal */}
      {slideStudy && (
        <div className="slide-overlay" onClick={handleCloseSlide}>
          <div className="slide-panel" onClick={(e) => e.stopPropagation()}>
            <div className="slide-header">
              <button
                type="button"
                className="slide-close"
                onClick={handleCloseSlide}
              >
                ✕
              </button>
              <div className="slide-tag">{slideStudy.tag}</div>
            </div>

            <div className="slide-content">
              <div className="slide-icon">
                <div className="slide-icon-circle">
                  <img
                    src="/ignite-logo-flame.png"
                    alt=""
                    className="slide-flame"
                  />
                </div>
              </div>

              <h2 className="slide-title">{slideStudy.title}</h2>
              <p className="slide-subtitle">{slideStudy.headerLine}</p>

              <p className="slide-description">{slideStudy.description}</p>

              {slideStudy.highlights && slideStudy.highlights.length > 0 && (
                <div className="slide-highlights">
                  <div className="highlights-label">What you will learn</div>
                  <ul className="highlights-list">
                    {slideStudy.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="slide-footer">
              <button
                type="button"
                className="begin-study-btn"
                onClick={handleBeginStudy}
              >
                Begin Study
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .studies-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e9eef4 100%);
  }

  .studies-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1rem 4.8rem;
    overflow-x: hidden;
  }

  .view-container {
    animation: none;
  }

  .slide-in-from-right {
    animation: slideInFromRight 0.3s ease forwards;
  }

  .slide-out-to-right {
    animation: slideOutToRight 0.3s ease forwards;
  }

  .slide-in-from-left {
    animation: slideInFromLeft 0.3s ease forwards;
  }

  @keyframes slideInFromRight {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideOutToRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }

  @keyframes slideInFromLeft {
    from { opacity: 0; transform: translateX(-30%); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* Hero card */
  .hero-card {
    margin-top: 1rem;
    margin-bottom: 0.75rem;
    padding: 1.4rem 1.5rem;
    border-radius: 24px;
    background: linear-gradient(135deg, ${colors.blue.dark} 0%, ${colors.blue.deep} 50%, ${colors.blue.dark} 100%);
    color: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.3);
  }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    font-size: ${roles.bodySmall.fontSize};
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .pill-flame {
    width: 14px;
    height: 14px;
    object-fit: contain;
  }

  .hero-title {
    margin: 0 0 0.3rem;
    font-size: ${roles.heroTitle.fontSize};
    font-weight: ${roles.heroTitle.fontWeight};
    letter-spacing: -0.02em;
  }

  .hero-sub {
    margin: 0 0 1rem;
    font-size: ${roles.body.fontSize};
    line-height: ${lineHeights.relaxed};
    opacity: 0.92;
  }

  .hero-progress-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.3rem;
  }

  .hero-progress-label {
    font-size: ${roles.bodySmall.fontSize};
    opacity: 0.9;
  }

  .hero-progress-percent {
    font-size: ${roles.bodySmall.fontSize};
    font-weight: 700;
  }

  .hero-progress-bar {
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .hero-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: ${gradients.flame};
    transition: width 300ms ease-out;
  }

  .hero-action-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1.2rem;
    border-radius: 999px;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-size: ${roles.body.fontSize};
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.12s ease;
  }

  .hero-action-btn:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  .hero-action-btn:active {
    transform: scale(0.98);
  }

  .hero-arrow {
    font-size: 1.3rem;
    transition: transform 0.15s ease;
  }

  .hero-action-btn:hover .hero-arrow {
    transform: translateX(3px);
  }

  /* Reset row */
  .reset-row {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .reset-progress-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #9ca3af;
    background: transparent;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .reset-progress-btn:hover {
    color: #dc2626;
    background: #fef2f2;
    border-color: #fecaca;
  }

  /* Section header */
  .section-header-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.6rem;
  }

  .section-title {
    font-size: ${roles.sectionTitle.fontSize};
    font-weight: ${roles.sectionTitle.fontWeight};
    letter-spacing: ${roles.sectionTitle.letterSpacing};
    color: #1f2937;
    text-transform: uppercase;
  }

  .section-hint {
    font-size: ${roles.bodySmall.fontSize};
    color: #6b7280;
  }

  /* Other studies */
  .other-studies-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .other-study-card {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.1rem;
    border-radius: 18px;
    border: 1px solid ${colors.black.light};
    background: ${colors.white};
    text-align: left;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  }

  .other-study-card:active:not(:disabled) {
    transform: scale(0.98);
  }

  .other-study-card:hover:not(:disabled) {
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.10);
    border-color: rgba(29, 78, 216, 0.25);
  }

  .other-study-card.locked {
    background: #f9fafb;
    opacity: 0.7;
    box-shadow: none;
    cursor: not-allowed;
  }

  .study-icon-badge {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    background: rgba(29, 78, 216, 0.08);
    border: 1px solid rgba(29, 78, 216, 0.15);
    flex-shrink: 0;
  }

  .other-study-card.locked .study-icon-badge {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  .other-study-content {
    flex: 1;
    min-width: 0;
  }

  .other-study-tag {
    font-size: ${roles.labelCaps.fontSize};
    text-transform: uppercase;
    letter-spacing: ${roles.labelCaps.letterSpacing};
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 0.1rem;
  }

  .other-study-title {
    font-size: ${roles.cardTitle.fontSize};
    font-weight: ${roles.cardTitle.fontWeight};
    color: ${colors.black.dark};
    margin-bottom: 0.15rem;
  }

  .other-study-blurb {
    font-size: ${roles.bodySmall.fontSize};
    color: #6b7280;
    line-height: ${lineHeights.relaxed};
  }

  .study-arrow {
    font-size: 1.5rem;
    color: #9ca3af;
    font-weight: 300;
    flex-shrink: 0;
    transition: transform 0.15s ease, color 0.15s ease;
  }

  .other-study-card:hover:not(:disabled) .study-arrow {
    transform: translateX(3px);
    color: ${colors.blue.deep};
  }

  /* Core view */
  .core-view {
    margin-top: 0.5rem;
  }

  .core-view-header {
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .core-view-title {
    margin: 0 0 0.2rem;
    font-size: 1.5rem;
    font-weight: 800;
    color: ${colors.black.dark};
  }

  .core-view-sub {
    margin: 0;
    font-size: ${roles.body.fontSize};
    color: #6b7280;
  }

  .core-studies-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .core-study-card {
    position: relative;
    width: 100%;
    padding: 1.25rem 1.4rem 1.25rem 1.6rem;
    border-radius: 20px;
    border: 1px solid ${colors.black.light};
    background: ${colors.white};
    text-align: left;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    overflow: hidden;
  }

  .core-study-card:active {
    transform: scale(0.98);
  }

  .core-study-card:hover {
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
    border-color: rgba(29, 78, 216, 0.3);
  }

  .core-study-card.complete {
    border-color: #86efac;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    box-shadow: 0 8px 24px rgba(22, 163, 74, 0.12);
  }

  .core-study-card.in-progress {
    border-color: rgba(251, 146, 60, 0.35);
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    box-shadow: 0 8px 24px rgba(251, 146, 60, 0.1);
  }

  /* Accent bar on left */
  .card-accent {
    position: absolute;
    left: 0;
    top: 16px;
    bottom: 16px;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: ${gradients.flame};
  }

  .card-accent.complete {
    background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  }

  /* Header row */
  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .card-tag-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    background: rgba(29, 78, 216, 0.08);
    border: 1px solid rgba(29, 78, 216, 0.12);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${colors.blue.deep};
  }

  .core-study-card.complete .card-tag-pill {
    background: rgba(22, 163, 74, 0.1);
    border-color: rgba(22, 163, 74, 0.2);
    color: #16a34a;
  }

  .core-study-card.in-progress .card-tag-pill {
    background: rgba(234, 88, 12, 0.1);
    border-color: rgba(234, 88, 12, 0.2);
    color: #ea580c;
  }

  .card-complete-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    font-size: 0.7rem;
    font-weight: 700;
    color: #ffffff;
  }

  /* Title */
  .core-study-title {
    margin: 0 0 0.25rem;
    font-size: 1.25rem;
    font-weight: 800;
    color: ${colors.black.dark};
    letter-spacing: -0.01em;
  }

  .core-study-sub {
    margin: 0 0 1rem;
    font-size: ${roles.body.fontSize};
    color: #6b7280;
    line-height: ${lineHeights.relaxed};
  }

  /* Progress section */
  .card-progress-section {
    background: rgba(15, 23, 42, 0.03);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
  }

  .core-study-card.complete .card-progress-section {
    background: rgba(22, 163, 74, 0.06);
  }

  .core-study-card.in-progress .card-progress-section {
    background: rgba(251, 146, 60, 0.08);
  }

  .progress-info-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
  }

  .progress-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
  }

  .progress-percent {
    font-size: 0.85rem;
    font-weight: 800;
    color: ${colors.blue.deep};
  }

  .progress-percent.complete {
    color: #16a34a;
  }

  .study-bar {
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
  }

  .study-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: ${gradients.flame};
    transition: width 300ms ease-out;
  }

  .study-bar-fill.complete {
    background: linear-gradient(90deg, #22c55e, #16a34a);
  }

  /* Footer row */
  .card-footer-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4rem;
  }

  .card-action-text {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${colors.blue.deep};
  }

  .core-study-card.complete .card-action-text {
    color: #16a34a;
  }

  .core-study-card.in-progress .card-action-text {
    color: #ea580c;
  }

  .card-arrow {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${colors.blue.deep};
    transition: transform 0.15s ease;
  }

  .core-study-card:hover .card-arrow {
    transform: translateX(4px);
  }

  .core-study-card.complete .card-arrow {
    color: #16a34a;
  }

  .core-study-card.in-progress .card-arrow {
    color: #ea580c;
  }

  /* Centered Modal */
  .slide-overlay {
    position: fixed !important;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100000 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem 120px 1rem;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .slide-panel {
    width: 100%;
    max-width: 500px;
    max-height: calc(100vh - 140px);
    background: ${colors.white};
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    animation: scaleIn 0.3s ease;
    overflow: hidden;
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .slide-header {
    padding: 1.2rem 1.4rem;
    border-bottom: 1px solid ${colors.black.light};
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  .slide-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid ${colors.black.light};
    background: #f9fafb;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slide-tag {
    font-size: ${roles.labelCaps.fontSize};
    text-transform: uppercase;
    letter-spacing: ${roles.labelCaps.letterSpacing};
    color: #6b7280;
    font-weight: 600;
  }

  .slide-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 1.5rem 1.4rem;
  }

  .slide-icon {
    margin-bottom: 1rem;
  }

  .slide-icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%);
    border: 1px solid rgba(251, 146, 60, 0.2);
  }

  .slide-flame {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }

  .slide-title {
    margin: 0 0 0.3rem;
    font-size: ${roles.heroTitle.fontSize};
    font-weight: ${roles.heroTitle.fontWeight};
    color: ${colors.black.dark};
  }

  .slide-subtitle {
    margin: 0 0 1rem;
    font-size: ${roles.body.fontSize};
    color: #6b7280;
  }

  .slide-description {
    margin: 0 0 1.5rem;
    font-size: ${roles.body.fontSize};
    color: ${colors.black.deep};
    line-height: ${lineHeights.relaxed};
  }

  .slide-highlights {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 1rem 1.2rem;
    border: 1px solid ${colors.black.light};
  }

  .highlights-label {
    font-size: ${roles.labelCaps.fontSize};
    text-transform: uppercase;
    letter-spacing: ${roles.labelCaps.letterSpacing};
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 0.6rem;
  }

  .highlights-list {
    margin: 0;
    padding-left: 1.2rem;
    font-size: ${roles.bodySmall.fontSize};
    color: ${colors.black.deep};
    line-height: 1.7;
  }

  .highlights-list li {
    margin-bottom: 0.35rem;
  }

  .highlights-list li::marker {
    color: ${colors.blue.deep};
  }

  .slide-footer {
    padding: 1.2rem 1.4rem;
    border-top: 1px solid ${colors.black.light};
    background: ${colors.white};
    flex-shrink: 0;
  }

  .begin-study-btn {
    width: 100%;
    background: ${gradients.flame};
    color: white;
    border: none;
    border-radius: 999px;
    padding: 1rem;
    font-size: ${roles.body.fontSize};
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease;
  }

  .begin-study-btn:active {
    transform: scale(0.97);
  }

  @media (max-width: 640px) {
    .studies-content {
      padding: 0 0.75rem 3.6rem;
    }

    .hero-card {
      padding: 1.2rem 1.1rem;
      border-radius: 20px;
    }

    .hero-title {
      font-size: 1.5rem;
    }

    .core-study-card {
      padding: 1rem;
      gap: 0.75rem;
    }

    .study-number {
      width: 44px;
      height: 44px;
      font-size: 1.1rem;
    }

    .study-arrow {
      display: none;
    }

    .slide-panel {
      max-width: 95%;
      max-height: 90vh;
    }
  }
`;
