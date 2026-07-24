/**
 * ShimmerLoader – Animated loading indicator shown while Jeremiah is thinking.
 *
 * Features:
 *   - Bouncing typing dots (existing pattern, enhanced)
 *   - Optional shimmer skeleton bar for longer wait hints
 *   - Accessible: role="status" with sr-only text so screen readers announce activity
 *
 * Props:
 *   variant  {'dots'|'shimmer'} - Visual style. Defaults to 'dots'.
 */

import React from "react";

export default function ShimmerLoader({ variant = "dots" }) {
  if (variant === "shimmer") {
    return (
      <div className="shimmer-wrap" role="status" aria-label="Jeremiah is thinking">
        <span className="sr-only">Jeremiah is thinking…</span>
        <div className="shimmer-bar shimmer-bar--wide" aria-hidden="true" />
        <div className="shimmer-bar shimmer-bar--med" aria-hidden="true" />
        <div className="shimmer-bar shimmer-bar--short" aria-hidden="true" />
      </div>
    );
  }

  // Default: bouncing dots inside a chat bubble
  return (
    <div className="msg assistant" role="status" aria-label="Jeremiah is thinking">
      <div className="msg-av" aria-hidden="true">
        <img src="/ignite-logo-flame.png" alt="" />
      </div>
      <div className="msg-body">
        <div className="msg-bubble typing-bubble" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="sr-only">Jeremiah is thinking…</span>
      </div>
    </div>
  );
}
