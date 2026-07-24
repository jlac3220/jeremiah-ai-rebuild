/**
 * MessageBubble – Animated chat message bubble for the Jeremiah conversation.
 *
 * Features:
 *   - Slide-up + fade-in entrance animation on mount
 *   - Distinct visual styles for user vs. assistant roles
 *   - Flame avatar for Jeremiah (assistant)
 *   - Supports rich content via dangerouslySetInnerHTML (pre-sanitized)
 *   - Renders an interactive VisualBlock if message includes one
 *   - Proper ARIA roles and labels for screen readers
 *
 * Props:
 *   message     {object}   - { id, role: 'user'|'assistant', content: string, visual: object|null }
 *   formatFn    {function} - Converts raw text to safe HTML (bold/italic markdown → <strong>/<em>)
 *   onAnswer    {function} - Passed to VisualBlock for interactive cards
 */

import React, { useRef, useEffect } from "react";
import VisualBlock from "./VisualBlock";

export default function MessageBubble({ message, formatFn, onAnswer }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Trigger entrance animation by adding class after a micro-tick
    requestAnimationFrame(() => el.classList.add("msg--visible"));
  }, []);

  const { role, content, visual } = message;
  const isAssistant = role === "assistant";

  return (
    <div
      ref={ref}
      className={`msg msg--animate ${role}`}
      role="article"
      aria-label={isAssistant ? "Jeremiah says" : "You said"}
    >
      {isAssistant && (
        <div className="msg-av" aria-hidden="true">
          <img src="/ignite-logo-flame.png" alt="" />
        </div>
      )}
      <div className="msg-body">
        {content && (
          <div
            className="msg-bubble"
            dangerouslySetInnerHTML={{ __html: formatFn ? formatFn(content) : content }}
          />
        )}
        {visual && visual.type !== "none" && (
          <VisualBlock visual={visual} onAnswer={onAnswer} />
        )}
      </div>
    </div>
  );
}
