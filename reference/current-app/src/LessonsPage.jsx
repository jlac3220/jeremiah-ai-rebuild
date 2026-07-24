// src/LessonsPage.js — loads lessons for NB, OG, or PS and passes full row to App
import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import { supabase } from "./supabaseClient";
import { theme as THEME } from "./theme";

// Safe theme fallbacks (prevents crashes if any nested keys are missing)
const theme = THEME || {};
const colors = theme.colors || {};
const gradients = theme.gradients || {};
const typography = theme.typography || {};
const roles = typography.roles || {};
const lineHeights = typography.lineHeights || { relaxed: "1.6" };

// Map studyId -> lessons table name
const LESSON_TABLE_MAP = {
  NB: "Lessons",
  OG: "Lessons_OG",
  PS: "Lessons_PS",
};

// Map studyId -> display title
const STUDY_TITLE_MAP = {
  NB: "The New Birth",
  OG: "The One True God",
  PS: "Pentecost and Sinai",
};

// Map studyId -> pill label
const STUDY_PILL_MAP = {
  NB: "Core Study Two",
  OG: "Core Study One",
  PS: "Core Study Three",
};

// Map studyId -> description
const STUDY_DESC_MAP = {
  NB: "Learn the essential steps of salvation: repentance, baptism, and the Holy Spirit.",
  OG: "Discover the biblical revelation of one God and His saving name.",
  PS: "Trace the connection between Mount Sinai and the Day of Pentecost.",
};

export default function LessonsPage({
  studyId, // "NB", "OG", or "PS"
  onSelectLesson, // (lessonRow) => void
  onBack,
  backLabel,
  lessonProgress = {}, // lessonProgress[lesson_id] = { isComplete, started, readingDone, ... }
  onShowProfile,
  onShowAccount,
  profileImageUrl,
}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableName = LESSON_TABLE_MAP[studyId] || "Lessons";
  const studyTitle = STUDY_TITLE_MAP[studyId] || "Study";
  const studyPill = STUDY_PILL_MAP[studyId] || "Core Study";
  const studyDesc = STUDY_DESC_MAP[studyId] || "";

  useEffect(() => {
    let active = true;

    async function fetchLessons() {
      if (!studyId) {
        setLessons([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let query = supabase.from(tableName).select("*");
        query = query.order("lesson_order", { ascending: true });

        const { data, error } = await query;

        if (!active) return;

        if (error) {
          console.error("LessonsPage: Supabase error:", error);
          setError("Could not load lessons.");
          setLessons([]);
          setLoading(false);
          return;
        }

        // Normalize rows so downstream always sees lesson_id + study_id
        const normalized = (data || []).map((row) => {
          let lessonKey = row.lesson_id || row.lesson_code || row.id;

          // If OG/PS rows ever lack a usable key, build OG01/PS01 etc from lesson_order
          if (
            !lessonKey &&
            (studyId === "OG" || studyId === "PS") &&
            row.lesson_order != null
          ) {
            const padded = String(row.lesson_order).padStart(2, "0");
            lessonKey = `${studyId}${padded}`;
          }

          return {
            ...row,
            lesson_id: lessonKey,
            study_id: row.study_id || studyId,
          };
        });

        setLessons(normalized);
        setLoading(false);
      } catch (err) {
        console.error("LessonsPage: Network error:", err);
        if (active) {
          setError("Network error. Please try again.");
          setLessons([]);
          setLoading(false);
        }
      }
    }

    fetchLessons();

    return () => {
      active = false;
    };
  }, [studyId, tableName]);

  // Calculate percent for a single lesson based on milestones.
  // Matches LessonDetailPage's completionPercent exactly:
  // - If a record exists at all, "started" is implicit (1/4 = 25%)
  // - Each of the 3 remaining milestones adds 25%
  function lessonPercent(lp) {
    if (!lp) return 0;
    if (lp.isComplete) return 100;
    if (lp.completionPercent != null) return lp.completionPercent;
    if (lp.percent != null) return lp.percent;
    // Record exists → started is implicit
    const steps = [lp.readingDone, lp.scripturesDone, lp.quizPassed];
    const done = steps.filter(Boolean).length;
    return Math.round(((1 + done) / 4) * 100);
  }

  // Combine base lessons with local progress
  const lessonsWithProgress = useMemo(() => {
    return (lessons || []).map((lesson) => {
      const lp = lessonProgress[lesson.lesson_id] || null;
      const percent = lessonPercent(lp);
      return {
        ...lesson,
        progress: {
          ...(lp || {}),
          percent,
        },
      };
    });
  }, [lessons, lessonProgress]);

  const handleOpenLesson = (lesson) => {
    if (typeof onSelectLesson === "function") {
      onSelectLesson(lesson); // pass full normalized row up to App
    }
  };

  // Calculate overall progress using fractional per-lesson percents
  const overallProgress = useMemo(() => {
    if (!lessonsWithProgress.length)
      return { completed: 0, total: 0, percent: 0 };
    const completed = lessonsWithProgress.filter(
      (l) => l.progress?.isComplete
    ).length;
    const total = lessonsWithProgress.length;
    const totalPoints = lessonsWithProgress.reduce(
      (sum, l) => sum + (l.progress?.percent || 0),
      0
    );
    return {
      completed,
      total,
      percent: Math.round(totalPoints / total),
    };
  }, [lessonsWithProgress]);

  const blueDark = colors?.blue?.dark || "#0b2a6f";
  const blueDeep = colors?.blue?.deep || "#003DA5";
  const white = colors?.white || "#ffffff";
  const blackLight = colors?.black?.light || "#e5e7eb";
  const flameGrad =
    gradients?.flame || "linear-gradient(90deg, #FFB400, #FF6A00, #E02121)";

  const role = (k, fallback) => roles?.[k] || fallback;
  const roleBodySmall = role("bodySmall", { fontSize: "0.875rem" });
  const roleBody = role("body", { fontSize: "1rem" });
  const roleHeroTitle = role("heroTitle", {
    fontSize: "1.9rem",
    fontWeight: 800,
  });
  const roleCardTitle = role("cardTitle", {
    fontSize: "1.05rem",
    fontWeight: 800,
  });

  const relaxedLH = lineHeights?.relaxed || "1.6";

  return (
    <div className="lessons-page">
      <PageHeader
        title={studyTitle}
        onBack={onBack}
        backLabel={backLabel}
        onProfile={onShowProfile}
        onAccount={onShowAccount}
        profileImageUrl={profileImageUrl}
      />

      <main className="lessons-content">
        <section className="hero-card">
          <div className="hero-pill">{studyPill}</div>
          <h1 className="hero-title">{studyTitle}</h1>
          <p className="hero-sub">{studyDesc}</p>

          <div className="hero-progress-row">
            <div className="hero-progress-label">
              {loading
                ? "Loading lessons..."
                : `${overallProgress.completed} of ${overallProgress.total} lessons complete`}
            </div>
            <div className="hero-progress-percent">
              {loading ? "" : `${overallProgress.percent}%`}
            </div>
          </div>

          <div className="hero-progress-bar">
            <div
              className="hero-progress-fill"
              style={{ width: loading ? "0%" : `${overallProgress.percent}%` }}
            />
          </div>
        </section>

        {loading && <div className="status-text">Loading lessons…</div>}
        {error && !loading && <div className="status-text error">{error}</div>}
        {!loading && !error && lessonsWithProgress.length === 0 && (
          <div className="status-text">No lessons found for this study.</div>
        )}

        {!loading && !error && lessonsWithProgress.length > 0 && (
          <section className="lessons-list">
            {lessonsWithProgress.map((lesson) => {
              const lp = lesson.progress || {};
              const percent = lp.percent || 0;
              const isComplete = !!lp.isComplete;
              const isStarted = percent > 0 && !isComplete;

              return (
                <button
                  key={lesson.lesson_id}
                  type="button"
                  className={`lesson-card ${isComplete ? "complete" : ""} ${
                    isStarted ? "in-progress" : ""
                  }`}
                  onClick={() => handleOpenLesson(lesson)}
                >
                  <div
                    className={`lesson-number ${isComplete ? "complete" : ""}`}
                  >
                    {isComplete ? (
                      <span className="check-icon">✓</span>
                    ) : (
                      lesson.lesson_order
                    )}
                  </div>

                  <div className="lesson-main">
                    <div className="lesson-title">
                      {lesson.lesson_title || `Lesson ${lesson.lesson_order}`}
                    </div>

                    {lesson.lesson_description && (
                      <div className="lesson-sub">
                        {lesson.lesson_description}
                      </div>
                    )}

                    <div className="lesson-progress-row">
                      <div className="lesson-bar">
                        <div
                          className={`lesson-bar-fill ${
                            isComplete ? "complete" : ""
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div
                        className={`lesson-percent ${
                          isComplete ? "complete" : ""
                        }`}
                      >
                        {Math.round(percent)}%
                      </div>
                    </div>
                  </div>

                  <div className="lesson-arrow">›</div>
                </button>
              );
            })}
          </section>
        )}
      </main>

      <style>
        {styles(
          blueDark,
          blueDeep,
          white,
          blackLight,
          flameGrad,
          roleBodySmall,
          roleBody,
          roleHeroTitle,
          roleCardTitle,
          relaxedLH
        )}
      </style>
    </div>
  );
}

const styles = (
  blueDark,
  blueDeep,
  white,
  blackLight,
  flameGrad,
  roleBodySmall,
  roleBody,
  roleHeroTitle,
  roleCardTitle,
  relaxedLH
) => `
  .lessons-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e9eef4 100%);
  }

  .lessons-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1rem 4.8rem;
  }

  /* Hero card */
  .hero-card {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    padding: 1.4rem 1.5rem;
    border-radius: 24px;
    background: linear-gradient(135deg, ${blueDark} 0%, ${blueDeep} 50%, ${blueDark} 100%);
    color: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.3);
  }

  .hero-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    font-size: ${roleBodySmall.fontSize};
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .hero-title {
    margin: 0 0 0.3rem;
    font-size: ${roleHeroTitle.fontSize};
    font-weight: ${roleHeroTitle.fontWeight};
    letter-spacing: -0.02em;
  }

  .hero-sub {
    margin: 0 0 1rem;
    font-size: ${roleBody.fontSize};
    line-height: ${relaxedLH};
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
    font-size: ${roleBodySmall.fontSize};
    opacity: 0.9;
  }

  .hero-progress-percent {
    font-size: ${roleBodySmall.fontSize};
    font-weight: 700;
  }

  .hero-progress-bar {
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;
  }

  .hero-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: ${flameGrad};
    transition: width 300ms ease-out;
  }

  /* Status text */
  .status-text {
    margin-top: 1.4rem;
    font-size: ${roleBody.fontSize};
    color: #6b7280;
    text-align: center;
  }

  .status-text.error {
    color: #b91c1c;
  }

  /* Lessons list */
  .lessons-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Lesson card */
  .lesson-card {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.1rem;
    border-radius: 18px;
    border: 1px solid ${blackLight};
    background: ${white};
    text-align: left;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
  }

  .lesson-card:active {
    transform: scale(0.98);
  }

  .lesson-card:hover {
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.10);
    border-color: rgba(29, 78, 216, 0.25);
  }

  .lesson-card.complete {
    border-color: #86efac;
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
    box-shadow: 0 6px 16px rgba(22, 163, 74, 0.15);
  }

  .lesson-card.in-progress {
    border-color: rgba(251, 146, 60, 0.4);
    background: linear-gradient(135deg, #fffbeb 0%, #fefce8 100%);
  }

  /* Lesson number badge */
  .lesson-number {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 800;
    color: ${blueDeep};
    background: rgba(29, 78, 216, 0.08);
    border: 1px solid rgba(29, 78, 216, 0.15);
    flex-shrink: 0;
  }

  .lesson-number.complete {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border-color: #16a34a;
    color: #ffffff;
  }

  .check-icon {
    font-size: 1.2rem;
    font-weight: 700;
  }

  /* Lesson main content */
  .lesson-main {
    flex: 1;
    min-width: 0;
  }

  .lesson-title {
    font-size: ${roleCardTitle.fontSize};
    font-weight: ${roleCardTitle.fontWeight};
    color: #111827;
    margin-bottom: 0.2rem;
    line-height: 1.3;
  }

  .lesson-sub {
    font-size: ${roleBodySmall.fontSize};
    color: #6b7280;
    line-height: ${relaxedLH};
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Progress row inside card */
  .lesson-progress-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .lesson-bar {
    flex: 1;
    height: 4px;
    border-radius: 999px;
    background: #e5e7eb;
    overflow: hidden;
  }

  .lesson-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: ${flameGrad};
    transition: width 200ms ease-out;
  }

  .lesson-bar-fill.complete {
    background: linear-gradient(90deg, #22c55e, #16a34a);
  }

  .lesson-percent {
    font-size: 0.75rem;
    font-weight: 700;
    color: #6b7280;
    min-width: 32px;
    text-align: right;
  }

  .lesson-percent.complete {
    color: #16a34a;
  }

  /* Arrow */
  .lesson-arrow {
    font-size: 1.5rem;
    color: #9ca3af;
    font-weight: 300;
    flex-shrink: 0;
    transition: transform 0.15s ease, color 0.15s ease;
  }

  .lesson-card:hover .lesson-arrow {
    transform: translateX(3px);
    color: ${blueDeep};
  }

  .lesson-card.complete .lesson-arrow {
    color: #16a34a;
  }

  @media (max-width: 640px) {
    .lessons-content {
      padding: 0 0.75rem 3.6rem;
    }

    .hero-card {
      padding: 1.2rem 1.1rem;
      border-radius: 20px;
    }

    .hero-title {
      font-size: 1.5rem;
    }

    .lesson-card {
      padding: 0.9rem;
      gap: 0.75rem;
    }

    .lesson-number {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }

    .lesson-title {
      font-size: 1rem;
    }

    .lesson-arrow {
      display: none;
    }
  }
`;
