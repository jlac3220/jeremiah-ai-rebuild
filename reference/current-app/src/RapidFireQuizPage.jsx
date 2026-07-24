// src/RapidFireQuizPage.js
// Rapid Fire — Daily verse drill
// Auto-loads today's verse whether accessed from homepage or bottom nav
// Tables: rapid_fire_quizzes, rapid_fire_questions

import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import { supabase } from "./supabaseClient";
import { theme as THEME } from "./theme";

const theme = THEME || {};
const gradients = theme.gradients || {};
const colors = theme.colors || {};

const QUIZ_TABLE = "rapid_fire_quizzes";
const Q_TABLE = "rapid_fire_questions";

// Same logic as HomePage to pick daily verse
function dayKeyUTC() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function hashToIndex(key, length) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

function normalizeCorrectChoice(v) {
  if (!v) return null;
  const s = String(v).trim().toUpperCase();
  if (["A", "B", "C", "D", "T", "F"].includes(s)) return s;
  if (s === "TRUE") return "T";
  if (s === "FALSE") return "F";
  return null;
}

function buildChoices(q) {
  const type = String(q.question_type || "").toUpperCase();

  if (type === "TF") {
    return [
      { key: "T", label: "True" },
      { key: "F", label: "False" },
    ];
  }

  const out = [];
  if (q.choice_a) out.push({ key: "A", label: q.choice_a });
  if (q.choice_b) out.push({ key: "B", label: q.choice_b });
  if (q.choice_c) out.push({ key: "C", label: q.choice_c });
  if (q.choice_d) out.push({ key: "D", label: q.choice_d });
  return out;
}

export default function RapidFireQuizPage({
  onBack,
  backLabel,
  onShowProfile,
  onShowAccount,
  onShare,
  profileImageUrl,
  profile, // Current profile for saving progress
  onComplete, // Callback when quiz completed (for streak/heat score)
}) {
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState("");

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Track if already completed today
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(false);
  const [todayScore, setTodayScore] = useState(null); // { correct, total, isPerfect }
  const [practiceMode, setPracticeMode] = useState(false); // User chose to practice again

  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);

  const [showVerse, setShowVerse] = useState(false);

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [score, setScore] = useState({ correct: 0, answered: 0 });

  const [hasSaved, setHasSaved] = useState(false); // Track if we've saved this completion

  const total = questions.length || 0;
  const currentQuestion = useMemo(
    () => questions[qIndex] || null,
    [questions, qIndex]
  );

  const correctChoice = useMemo(() => {
    if (!currentQuestion) return null;
    return normalizeCorrectChoice(currentQuestion.correct_choice);
  }, [currentQuestion]);

  const isFinished = useMemo(() => {
    if (!total) return false;
    return score.answered >= total;
  }, [score.answered, total]);

  const progressPct = useMemo(() => {
    if (!total) return 0;
    return Math.round((Math.min(score.answered, total) / total) * 100);
  }, [score.answered, total]);

  const isCorrect = useMemo(() => {
    if (!submitted) return null;
    if (!correctChoice) return null;
    return selectedChoice === correctChoice;
  }, [submitted, selectedChoice, correctChoice]);

  // Save completion when quiz finishes (skip if practice mode)
  useEffect(() => {
    if (!isFinished || hasSaved) return;
    if (practiceMode) return; // Don't save practice attempts
    if (!profile?.id || !selectedQuiz?.quiz_id) return;

    async function saveCompletion() {
      const isPerfect = score.correct === total;
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      try {
        // Just insert - the unique constraint will prevent duplicates per day
        const { error: saveError } = await supabase
          .from("rapid_fire_progress")
          .insert({
            profile_id: profile.id,
            quiz_id: selectedQuiz.quiz_id,
            score_correct: score.correct,
            score_total: total,
            is_perfect: isPerfect,
            completed_date: today,
          });

        if (saveError) {
          // If duplicate key error, that's fine - already completed today
          if (saveError.code === "23505") {
            console.log("Already completed this quiz today");
          } else {
            console.error("Error saving rapid fire progress:", saveError);
          }
        } else {
          console.log("Rapid Fire completion saved!", {
            correct: score.correct,
            total,
            isPerfect,
          });

          // Notify parent to update streak/heat score
          if (onComplete) {
            onComplete({
              correct: score.correct,
              total,
              isPerfect,
              quizId: selectedQuiz.quiz_id,
            });
          }
        }
      } catch (err) {
        console.error("Failed to save completion:", err);
      }

      setHasSaved(true);
    }

    saveCompletion();
  }, [
    isFinished,
    hasSaved,
    practiceMode,
    profile,
    selectedQuiz,
    score,
    total,
    onComplete,
  ]);

  // Load today's daily verse quiz and check if already completed
  useEffect(() => {
    let alive = true;
    const today = dayKeyUTC();
    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    async function loadDailyVerse() {
      setLoadingQuiz(true);
      setError("");

      try {
        const { data, error: e } = await supabase
          .from(QUIZ_TABLE)
          .select("*")
          .order("display_order", { ascending: true });

        if (e) throw e;

        const usable = (data || []).filter((v) => v.verse_text && v.quiz_id);

        if (!usable.length) {
          if (alive) setError("No verses available yet.");
          return;
        }

        // Pick today's verse using same hash as HomePage
        const dailyQuiz = usable[hashToIndex(today, usable.length)];

        if (alive) setSelectedQuiz(dailyQuiz);

        // Check if user already completed today's quiz
        if (profile?.id && dailyQuiz?.quiz_id) {
          const { data: progress, error: progressError } = await supabase
            .from("rapid_fire_progress")
            .select("score_correct, score_total, is_perfect")
            .eq("profile_id", profile.id)
            .eq("quiz_id", dailyQuiz.quiz_id)
            .eq("completed_date", todayDate)
            .maybeSingle();

          if (!progressError && progress) {
            if (alive) {
              setAlreadyCompletedToday(true);
              setTodayScore({
                correct: progress.score_correct,
                total: progress.score_total,
                isPerfect: progress.is_perfect,
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
        if (alive) setError(err?.message || "Failed to load daily verse.");
      } finally {
        if (alive) setLoadingQuiz(false);
      }
    }

    loadDailyVerse();
    return () => {
      alive = false;
    };
  }, [profile]);

  // Load questions for the quiz
  useEffect(() => {
    if (!selectedQuiz?.quiz_id) {
      setQuestions([]);
      return;
    }

    // Skip loading questions if already completed and not in practice mode
    if (alreadyCompletedToday && !practiceMode) {
      return;
    }

    let alive = true;

    async function run() {
      setLoadingQuestions(true);
      setError("");

      // Reset state
      setQIndex(0);
      setSelectedChoice(null);
      setSubmitted(false);
      setScore({ correct: 0, answered: 0 });

      try {
        const { data, error: e } = await supabase
          .from(Q_TABLE)
          .select("*")
          .eq("quiz_id", selectedQuiz.quiz_id)
          .order("display_order", { ascending: true });

        if (e) throw e;

        const cleaned = (data || [])
          .filter((q) => q.question_id)
          .map((q) => ({
            ...q,
            question_type: String(q.question_type || "").toUpperCase(),
            correct_choice: normalizeCorrectChoice(q.correct_choice),
          }))
          .filter((q) => q.question_type === "MC" || q.question_type === "TF");

        if (!alive) return;
        setQuestions(cleaned);
      } catch (err) {
        console.error(err);
        if (!alive) return;
        setError(err?.message || "Failed to load questions.");
        setQuestions([]);
      } finally {
        if (alive) setLoadingQuestions(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [selectedQuiz, alreadyCompletedToday, practiceMode]);

  function resetCurrent() {
    setSelectedChoice(null);
    setSubmitted(false);
  }

  function goNext() {
    resetCurrent();
    setQIndex((i) => Math.min(i + 1, Math.max(0, questions.length - 1)));
  }

  function restart() {
    setQIndex(0);
    setSelectedChoice(null);
    setSubmitted(false);
    setScore({ correct: 0, answered: 0 });
    setHasSaved(false); // Allow saving again on retry
  }

  function startPractice() {
    setPracticeMode(true);
    setScore({ correct: 0, answered: 0 });
    setQIndex(0);
    setSelectedChoice(null);
    setSubmitted(false);
  }

  function handleSubmit() {
    if (!currentQuestion || submitted) return;
    if (!selectedChoice) return;

    setSubmitted(true);

    const cc = correctChoice;
    const ok = cc ? selectedChoice === cc : false;

    setScore((s) => ({
      answered: s.answered + 1,
      correct: s.correct + (ok ? 1 : 0),
    }));

    // Auto-advance after brief delay
    setTimeout(() => {
      if (qIndex < questions.length - 1) goNext();
    }, 1200);
  }

  const choices = useMemo(() => {
    if (!currentQuestion) return [];
    return buildChoices(currentQuestion);
  }, [currentQuestion]);

  // Show completed UI if already done today and not practicing
  const showCompletedState = alreadyCompletedToday && !practiceMode;

  return (
    <div className="rf-page">
      <PageHeader
        title="Rapid Fire"
        onBack={onBack}
        backLabel={backLabel}
        onProfile={onShowProfile}
        onAccount={onShowAccount}
        onShare={onShare}
        profileImageUrl={profileImageUrl}
      />

      <div className="rf-wrap">
        {/* Banner */}
        <div className="rf-banner">
          <div className="rf-banner-tag">DAILY DRILL</div>
          <div className="rf-banner-title">Rapid Fire</div>
          <div className="rf-banner-sub">
            {showCompletedState
              ? "You've completed today's drill!"
              : "Today's verse. Master it. Build your fire."}
          </div>
        </div>

        {/* Today's Verse Card */}
        <div className="rf-card">
          <div className="rf-card-head">
            <div className="rf-card-title">Today's Verse</div>
            <button
              type="button"
              className="rf-link"
              onClick={() => setShowVerse((v) => !v)}
              disabled={!selectedQuiz}
            >
              {showVerse ? "Hide verse" : "Read verse"}
            </button>
          </div>

          {loadingQuiz ? (
            <div className="rf-muted">Loading…</div>
          ) : !selectedQuiz ? (
            <div className="rf-muted">No verse available.</div>
          ) : (
            <div className="rf-verse-header">
              <span className="rf-verse-ref-inline">
                {selectedQuiz.verse_ref}
              </span>
            </div>
          )}

          {selectedQuiz && showVerse && (
            <div className="rf-verse">
              <div className="rf-verse-text">
                {selectedQuiz.verse_text || "Verse text not set yet."}
              </div>
            </div>
          )}
        </div>

        {/* Question Card OR Completed State */}
        <div className="rf-card">
          <div className="rf-card-head">
            <div className="rf-card-title">
              {showCompletedState
                ? "Today's Drill Complete"
                : isFinished
                ? "Complete"
                : "Question"}
            </div>
            <div className="rf-counter">
              {showCompletedState
                ? "✓"
                : total
                ? `${Math.min(qIndex + 1, total)} of ${total}`
                : "—"}
            </div>
          </div>

          {error ? <div className="rf-error">{error}</div> : null}

          {/* Already completed today - show summary */}
          {showCompletedState ? (
            <div className="rf-finish">
              <div className="rf-finish-icon">🔥</div>
              <div className="rf-finish-title">Great job today!</div>
              <div className="rf-finish-sub">
                Today's score: <b>{todayScore?.correct || 0}</b> /{" "}
                <b>{todayScore?.total || 0}</b>
                {todayScore?.isPerfect && (
                  <span className="rf-perfect-badge">Perfect!</span>
                )}
              </div>
              <div className="rf-finish-msg">
                {todayScore?.isPerfect
                  ? "Amazing! You've mastered this verse."
                  : "Nice work! Come back tomorrow for a new verse."}
              </div>

              <div className="rf-completed-info">
                <p>+15 pts earned for today's completion</p>
                {todayScore?.isPerfect && <p>+5 bonus for perfect score!</p>}
              </div>

              <div className="rf-nextrow">
                <button
                  type="button"
                  className="rf-smallbtn"
                  onClick={startPractice}
                >
                  Practice Again
                </button>
                <button
                  type="button"
                  className="rf-smallbtn primary"
                  onClick={onBack}
                >
                  Done
                </button>
              </div>
            </div>
          ) : loadingQuestions ? (
            <div className="rf-muted">Loading questions…</div>
          ) : !selectedQuiz ? (
            <div className="rf-muted">No verse selected.</div>
          ) : total === 0 ? (
            <div className="rf-muted">No questions for this verse yet.</div>
          ) : isFinished ? (
            <div className="rf-finish">
              <div className="rf-finish-icon">🔥</div>
              <div className="rf-finish-title">
                {practiceMode ? "Practice complete!" : "Rapid Fire complete!"}
              </div>
              <div className="rf-finish-sub">
                {practiceMode ? "Practice" : "Final"} score:{" "}
                <b>{score.correct}</b> / <b>{total}</b>
                {score.correct === total && (
                  <span className="rf-perfect-badge">Perfect!</span>
                )}
              </div>
              <div className="rf-finish-msg">
                {score.correct === total
                  ? "Perfect! You've mastered today's verse."
                  : score.correct >= total * 0.7
                  ? "Great work! Keep drilling to perfect it."
                  : "Keep studying—you'll get it!"}
              </div>

              {!practiceMode && (
                <div className="rf-completed-info">
                  <p>+15 pts earned!</p>
                  {score.correct === total && (
                    <p>+5 bonus for perfect score!</p>
                  )}
                </div>
              )}

              <div className="rf-nextrow">
                <button type="button" className="rf-smallbtn" onClick={restart}>
                  {practiceMode ? "Practice Again" : "Try Again"}
                </button>
                <button
                  type="button"
                  className="rf-smallbtn primary"
                  onClick={onBack}
                >
                  Done
                </button>
              </div>
            </div>
          ) : !currentQuestion ? (
            <div className="rf-muted">No current question.</div>
          ) : (
            <>
              {practiceMode && (
                <div className="rf-practice-badge">Practice Mode</div>
              )}
              <div className="rf-qtext">{currentQuestion.question_text}</div>

              {choices.length === 0 ? (
                <div className="rf-muted">
                  This question has no choices saved.
                </div>
              ) : (
                <div className="rf-choices">
                  {choices.map((c) => {
                    const picked = selectedChoice === c.key;
                    const show = submitted && correctChoice;
                    const correct = show && c.key === correctChoice;
                    const wrongPick = show && picked && c.key !== correctChoice;

                    return (
                      <button
                        key={c.key}
                        type="button"
                        className={`rf-choice ${picked ? "picked" : ""} ${
                          correct ? "correct" : ""
                        } ${wrongPick ? "wrong" : ""}`}
                        onClick={() => {
                          if (submitted) return;
                          setSelectedChoice(c.key);
                        }}
                        disabled={submitted}
                      >
                        <div className="rf-badge">{c.key}</div>
                        <div className="rf-label">{c.label}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {submitted && (
                <div
                  className={`rf-feedback ${isCorrect ? "correct" : "wrong"}`}
                >
                  <div className="rf-feedback-title">
                    {isCorrect ? "✓ Correct!" : `✗ Incorrect`}
                  </div>
                  <div className="rf-feedback-body">
                    {currentQuestion.explanation ||
                      "Keep the verse wording in view. Choose the option that matches the text."}
                  </div>
                </div>
              )}

              <div className="rf-submitbar">
                <button
                  type="button"
                  className="rf-submit"
                  onClick={handleSubmit}
                  disabled={
                    !selectedChoice || submitted || choices.length === 0
                  }
                >
                  Submit Answer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .rf-page{
          min-height: 100vh;
          background: ${colors?.background || "#f3f4f6"};
          padding-bottom: 88px;
        }

        .rf-wrap{
          max-width: 920px;
          margin: 0 auto;
          padding: 14px;
        }

        .rf-banner{
          border-radius: 16px;
          padding: 16px;
          background: ${
            gradients?.primary || "linear-gradient(135deg, #1e40af, #0b2a6f)"
          };
          box-shadow: 0 14px 28px rgba(0,0,0,.18);
          color: #fff;
          margin-bottom: 14px;
        }

        .rf-banner-tag{
          display:inline-block;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .10em;
          opacity: .95;
          background: rgba(255,140,0,.25);
          padding: 6px 10px;
          border-radius: 999px;
        }

        .rf-banner-title{
          margin-top: 10px;
          font-size: 1.3rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .rf-banner-sub{
          margin-top: 6px;
          opacity: .92;
          font-weight: 650;
          line-height: 1.4;
          max-width: 560px;
        }

        .rf-banner-row{
          display:flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .rf-pill{
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          padding: 8px 12px;
          display:flex;
          gap: 8px;
          align-items: center;
        }

        .rf-pill-k{
          font-size: .78rem;
          font-weight: 800;
          opacity: .92;
        }

        .rf-pill-v{
          font-size: .9rem;
          font-weight: 900;
        }

        .rf-banner-controls{
          display:flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 12px;
        }

        .rf-toggle{
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.18);
          color: #fff;
          font-weight: 900;
          border-radius: 12px;
          padding: 10px 12px;
          cursor: pointer;
        }

        .rf-toggle.on{
          background: rgba(255,140,0,.25);
          border-color: rgba(255,140,0,.35);
        }

        .rf-card{
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 10px 22px rgba(0,0,0,.08);
          padding: 14px;
          margin-bottom: 14px;
        }

        .rf-card-head{
          display:flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .rf-card-title{
          font-weight: 900;
          color: #0f172a;
        }

        .rf-counter{
          font-weight: 900;
          color: #64748b;
          font-size: .9rem;
        }

        .rf-link{
          border: none;
          background: transparent;
          color: #2563eb;
          font-weight: 900;
          cursor: pointer;
        }

        .rf-verse-header{
          padding: 8px 0;
        }

        .rf-verse-ref-inline{
          font-weight: 900;
          color: #1e40af;
          font-size: 1.1rem;
        }

        .rf-verse{
          margin-top: 12px;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          border-radius: 14px;
          padding: 12px;
        }

        .rf-verse-text{
          color: #334155;
          line-height: 1.55;
          font-weight: 650;
          font-style: italic;
        }

        .rf-practice-badge{
          display: inline-block;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 12px;
        }

        .rf-qtext{
          font-weight: 900;
          color: #0f172a;
          font-size: 1.05rem;
          margin-bottom: 12px;
        }

        .rf-choices{
          display:flex;
          flex-direction: column;
          gap: 10px;
        }

        .rf-choice{
          width: 100%;
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          background: #fff;
          text-align:left;
          cursor:pointer;
          transition: transform .06s ease, box-shadow .12s ease;
        }

        .rf-choice:active{
          transform: scale(.99);
        }

        .rf-badge{
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight: 900;
          color: #0f172a;
          flex: 0 0 auto;
        }

        .rf-label{
          font-weight: 750;
          color: #0f172a;
        }

        .rf-choice.picked{
          border-color: rgba(37,99,235,.35);
          box-shadow: 0 10px 18px rgba(37,99,235,.10);
        }

        .rf-choice.correct{
          border-color: rgba(34,197,94,.35);
          box-shadow: 0 10px 18px rgba(34,197,94,.10);
        }

        .rf-choice.wrong{
          border-color: rgba(239,68,68,.35);
          box-shadow: 0 10px 18px rgba(239,68,68,.10);
        }

        .rf-feedback{
          margin-top: 12px;
          border-radius: 14px;
          padding: 12px;
        }

        .rf-feedback.correct{
          border: 1px solid rgba(34,197,94,.35);
          background: rgba(34,197,94,.08);
        }

        .rf-feedback.wrong{
          border: 1px solid rgba(239,68,68,.35);
          background: rgba(239,68,68,.08);
        }

        .rf-feedback-title{
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .rf-feedback-body{
          font-weight: 650;
          color: #334155;
          line-height: 1.55;
        }

        .rf-nextrow{
          display:flex;
          justify-content:flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .rf-smallbtn{
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #fff;
          font-weight: 900;
          cursor:pointer;
        }

        .rf-smallbtn.primary{
          border-color: rgba(255,140,0,.35);
          background: rgba(255,140,0,.14);
        }

        .rf-submitbar{
          margin-top: 14px;
        }

        .rf-submit{
          width: 100%;
          border: none;
          border-radius: 16px;
          padding: 14px 16px;
          font-weight: 900;
          color: #111827;
          cursor: pointer;
          background: ${
            gradients?.cta ||
            "linear-gradient(90deg, #f59e0b, #ef4444, #1e3a8a)"
          };
          box-shadow: 0 14px 24px rgba(0,0,0,.12);
        }

        .rf-submit:disabled{
          opacity: .55;
          cursor: not-allowed;
        }

        .rf-muted{
          color: #64748b;
          font-weight: 750;
        }

        .rf-error{
          margin-bottom: 10px;
          border: 1px solid rgba(239,68,68,.35);
          background: rgba(239,68,68,.08);
          padding: 10px 12px;
          border-radius: 12px;
          color: #7f1d1d;
          font-weight: 900;
        }

        .rf-finish{
          text-align: center;
          padding: 1rem 0;
        }

        .rf-finish-icon{
          font-size: 3rem;
          margin-bottom: 8px;
        }

        .rf-finish-title{
          font-weight: 950;
          font-size: 1.2rem;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .rf-finish-sub{
          color: #334155;
          font-weight: 700;
          font-size: 1.05rem;
        }

        .rf-perfect-badge{
          display: inline-block;
          margin-left: 8px;
          padding: 2px 10px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #78350f;
          font-size: 0.75rem;
          font-weight: 800;
          border-radius: 999px;
          vertical-align: middle;
        }

        .rf-finish-msg{
          margin-top: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .rf-completed-info{
          margin-top: 16px;
          padding: 12px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
        }

        .rf-completed-info p{
          margin: 0;
          color: #166534;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .rf-completed-info p + p{
          margin-top: 4px;
        }

        .rf-finish .rf-nextrow{
          justify-content: center;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
}
