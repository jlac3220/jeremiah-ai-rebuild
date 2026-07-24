// src/components/ask/MasteryDialog.jsx
import React from "react";

export default function MasteryDialog({ standard, stats, onClose, onReflect }) {
  if (!standard) return null;
  const confetti = ["🎉","✨","🔥","⭐","🏆"];
  return (
    <div className="md-overlay" onClick={onClose}>
      <div className="md-box" onClick={e => e.stopPropagation()}>
        <div className="md-confetti-row">
          {confetti.map((c, i) => (
            <span key={i} className="md-confetti-piece" style={{ animationDelay: `${i * 0.08}s` }}>{c}</span>
          ))}
        </div>
        <div className="md-badge">🏆</div>
        <h2 className="md-title">Standard Mastered!</h2>
        <div className="md-std-code">{standard.code}</div>
        <div className="md-std-name">{standard.domainTitle || standard.title}</div>
        {stats && (
          <div className="md-stats">
            <div className="md-stat">
              <div className="md-stat-num">{stats.answered || 0}</div>
              <div className="md-stat-lbl">Questions answered</div>
            </div>
            <div className="md-stat-divider" />
            <div className="md-stat">
              <div className="md-stat-num">{stats.correct || 0}</div>
              <div className="md-stat-lbl">Correct</div>
            </div>
          </div>
        )}
        <div className="md-purpose">
          <p className="md-purpose-prompt">
            You've proven you can <strong>recognize, explain, apply, and defend</strong> this standard.
            That's not memorization — that's mastery.
          </p>
        </div>
        <div className="md-actions">
          <button className="md-btn md-btn--primary" onClick={onReflect}>
            Reflect with Jeremiah →
          </button>
          <button className="md-btn md-btn--secondary" onClick={onClose}>
            Keep Going
          </button>
        </div>
      </div>
    </div>
  );
}
