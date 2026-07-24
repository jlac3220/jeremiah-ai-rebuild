/**
 * VisualBlock – Renders interactive visual elements returned by the Jeremiah AI teacher.
 *
 * Supported types:
 *   whiteboard      – A definition or concept "lock it in" card
 *   verse           – A highlighted scripture quote
 *   game_choice     – Multiple-choice "find the wrong one" game
 *   game_blank      – Fill-in-the-blank game
 *   scripture_read  – A read-it-now popup with optional prompt
 *   assignment      – A student task card with a "Done" button
 */

import React, { useState } from "react";

/**
 * @param {{
 *   visual: object,
 *   onAnswer: (text: string) => void,
 * }} props
 */
export default function VisualBlock({ visual, onAnswer }) {
  const [answered, setAnswered] = useState(null);
  const [blankVal, setBlankVal] = useState("");
  const [blankResult, setBlankResult] = useState(null);
  const [done, setDone] = useState(false);

  if (!visual || visual.type === "none") return null;

  if (visual.type === "whiteboard") {
    return (
      <div className="wb-card">
        <div className="wb-header">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect width="12" height="12" rx="2" fill="white" opacity="0.3" />
            <path d="M2 4h8M2 6h8M2 8h5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="wb-label">Lock this in</span>
        </div>
        <div className="wb-body">
          <div className="wb-term">{visual.term}</div>
          {visual.ref && <div className="wb-ref">{visual.ref}</div>}
        </div>
      </div>
    );
  }

  if (visual.type === "verse") {
    return (
      <div className="verse-card">
        <div className="verse-accent" />
        <div className="verse-content">
          <div className="verse-text">"{visual.text}"</div>
          <div className="verse-ref">{visual.ref}</div>
        </div>
      </div>
    );
  }

  if (visual.type === "game_choice") {
    const handlePick = (i) => {
      if (answered !== null) return;
      setAnswered(i);
      const isCorrect = i === visual.correct;
      setTimeout(() => {
        onAnswer &&
          onAnswer(
            isCorrect
              ? `Got it — "${visual.choices[i]}" is the wrong one. ${visual.feedback_right}`
              : `I picked "${visual.choices[i]}" but that was off. ${visual.feedback_wrong}`
          );
      }, 1400);
    };

    return (
      <div className="game-card">
        <div className="game-header">
          <div className="game-dot" />
          <span className="game-label">Find the wrong one</span>
        </div>
        <div className="game-body">
          <div className="game-q">{visual.question}</div>
          {(visual.choices || []).map((choice, i) => {
            let cls = "choice-btn";
            if (answered !== null) {
              if (i === visual.correct) cls += " right";
              else if (i === answered && i !== visual.correct) cls += " wrong";
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handlePick(i)}
                disabled={answered !== null}
              >
                <span className="choice-num">{i + 1}</span>
                <span className="choice-text">{choice}</span>
                {answered !== null && i === visual.correct && (
                  <span className="choice-check">✓</span>
                )}
                {answered !== null && i === answered && i !== visual.correct && (
                  <span className="choice-x">✗</span>
                )}
              </button>
            );
          })}
          {answered !== null && (
            <div className={`game-fb ${answered === visual.correct ? "yes" : "no"}`}>
              {answered === visual.correct
                ? `🎉 ${visual.feedback_right}`
                : `💡 ${visual.feedback_wrong}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (visual.type === "game_blank") {
    const check = () => {
      if (!blankVal.trim() || blankResult) return;
      const val = blankVal.trim().toLowerCase();
      const ans = (visual.answer || "").toLowerCase();
      const correct = val === ans || ans.includes(val) || val.includes(ans);
      setBlankResult(correct ? "right" : "wrong");
      setTimeout(() => {
        onAnswer &&
          onAnswer(
            correct
              ? `My answer was "${blankVal}" — got it. ${visual.feedback_right}`
              : `I said "${blankVal}" — that was wrong. ${visual.feedback_wrong}`
          );
      }, 1400);
    };

    return (
      <div className="game-card">
        <div className="game-header">
          <div className="game-dot" />
          <span className="game-label">Fill in the blank</span>
        </div>
        <div className="game-body">
          <div className="game-q">{visual.question}</div>
          {!blankResult ? (
            <div className="blank-row">
              <input
                className="blank-input"
                value={blankVal}
                onChange={(e) => setBlankVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") check();
                }}
                placeholder="your answer..."
                autoComplete="off"
              />
              <button className="blank-btn" onClick={check}>
                Check
              </button>
            </div>
          ) : (
            <div className={`game-fb ${blankResult}`}>
              {blankResult === "right"
                ? `🎉 ${visual.feedback_right}`
                : `💡 ${visual.feedback_wrong}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (visual.type === "scripture_read" || visual.type === "scripture_popup") {
    return (
      <div className="scripture-popup">
        <div className="scripture-popup-header">
          <span className="scripture-popup-icon">📖</span>
          <span className="scripture-popup-label">Read This</span>
        </div>
        <div className="scripture-popup-ref">{visual.ref}</div>
        <div className="scripture-popup-text">"{visual.text}"</div>
        {(visual.task || visual.prompt) && (
          <div className="scripture-popup-prompt">→ {visual.task || visual.prompt}</div>
        )}
      </div>
    );
  }

  if (visual.type === "assignment") {
    return (
      <div className="assignment-card">
        <div className="assignment-header">
          <span className="assignment-icon">✏️</span>
          <span className="assignment-label">Your Turn</span>
        </div>
        <div className="assignment-task">{visual.task}</div>
        {!done ? (
          <button
            className="assignment-done"
            onClick={() => {
              setDone(true);
              onAnswer && onAnswer(`Done: ${visual.task}`);
            }}
          >
            Done ✓
          </button>
        ) : (
          <div className="assignment-complete">✓ Completed — Jeremiah will check your work</div>
        )}
      </div>
    );
  }

  return null;
}
