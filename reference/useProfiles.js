/**
 * QuickStartTips – Suggests short prompts on the home screen to give new users
 * an easy way to begin a conversation with Jeremiah.
 *
 * Features:
 *   - Displays a grid of tap-able suggestion pills
 *   - Clicking a tip directly sends that question
 *   - Accessible: each button has a descriptive aria-label
 *
 * Props:
 *   onSelect  {function(tip: string)} - Called when the user taps a suggestion
 */

import React from "react";

const TIPS = [
  "What is the Oneness of God?",
  "Explain Acts 2:38 to me",
  "What does it mean to be filled with the Spirit?",
  "Why do we baptize in Jesus' name?",
  "What is the new birth?",
  "Walk me through John 3:5",
];

export default function QuickStartTips({ onSelect }) {
  return (
    <section className="qst-section" aria-label="Quick-start questions">
      <div className="qst-label" aria-hidden="true">Start here</div>
      <ul className="qst-grid">
        {TIPS.map((tip) => (
          <li key={tip} className="qst-li">
            <button
              className="qst-pill"
              onClick={() => onSelect && onSelect(tip)}
              aria-label={`Ask: ${tip}`}
            >
              <span className="qst-pill-icon" aria-hidden="true">✦</span>
              {tip}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
