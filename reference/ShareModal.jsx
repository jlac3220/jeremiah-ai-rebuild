/**
 * ChatInput – Polished, accessible compose area for the Jeremiah chat.
 *
 * Features:
 *   - Auto-growing textarea (up to 5 lines)
 *   - Animated focus ring with blue glow
 *   - Send button with scale-on-hover and disabled state
 *   - Keyboard shortcut: Enter to send, Shift+Enter for newline
 *   - Full ARIA labeling for screen readers
 *
 * Props:
 *   value       {string}   - Current text value
 *   onChange    {function} - Called with new string on every keystroke
 *   onSend      {function} - Called when user submits (button click or Enter)
 *   disabled    {boolean}  - Disables the textarea and button while loading
 *   placeholder {string}   - Placeholder text for the textarea
 *   sendColor   {string}   - Optional CSS gradient/color override for the send button
 */

import React, { useRef, useEffect } from "react";

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Ask Jeremiah anything…",
  sendColor,
}) {
  const textareaRef = useRef(null);

  /** Auto-grow textarea height based on content */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [value]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend && onSend();
    }
  }

  const canSend = !disabled && value.trim().length > 0;

  const btnStyle = sendColor
    ? { background: sendColor }
    : { background: "linear-gradient(135deg, #1a3fcc, #003DA5)" };

  return (
    <div className="ci-wrap" role="form" aria-label="Send a message to Jeremiah">
      <div className="ci-row">
        <label htmlFor="jeremiah-input" className="sr-only">
          Your message to Jeremiah
        </label>
        <textarea
          id="jeremiah-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="ci-textarea"
          aria-label={placeholder}
          aria-multiline="true"
          aria-disabled={disabled}
        />
        <button
          onClick={() => onSend && onSend()}
          disabled={!canSend}
          className={`ci-send ${canSend ? "ci-send--active" : ""}`}
          style={canSend ? btnStyle : {}}
          aria-label="Send message"
          title="Send (Enter)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
          </svg>
        </button>
      </div>
      <div className="ci-hint" aria-hidden="true">
        Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
      </div>
    </div>
  );
}
