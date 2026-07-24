// src/icons/Icon.js or src/Icon.js

import React from "react";

/* -------------------------------------------------------
   GENERIC BOOTSTRAP ICON WRAPPER (BI)
   ------------------------------------------------------- */
// Export BI as a utility, but the main component will be Icon
export function BI({
  name,
  size = 26,
  color = "currentColor",
  style = {},
  className = "",
}) {
  return (
    <i
      className={`bi bi-${name} ${className}`}
      style={{
        fontSize: size,
        color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        ...style,
      }}
    />
  );
}

/* -------------------------------------------------------
   TRUE DOVE ICON (CUSTOM SVG)
   ------------------------------------------------------- */
export function DoveIcon({ size = 26, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* body + wing */}
      <path d="M3 12c4 0 7-4 7-4s1 4 7 5c-3 2-5 5-5 8 0 0-6-3-9-9z" />
      {/* head / neck / motion */}
      <path d="M14 7s1.5-2 3-3 2 0 2 0-1 3-5 5" />
    </svg>
  );
}

/* -------------------------------------------------------
   BIBLE ICON (Bootstrap)
   ------------------------------------------------------- */
export function BibleIcon({ size = 26, color = "currentColor" }) {
  return <BI name="book-fill" size={size} color={color} />;
}

/* -------------------------------------------------------
   FIRE ICON (Bootstrap)
   ------------------------------------------------------- */
export function FireIcon({ size = 26, color = "currentColor" }) {
  return <BI name="fire" size={size} color={color} />;
}

/* -------------------------------------------------------
   MASTER ICON COMPONENT (The missing piece)
   - Uses the 'name' prop to dispatch to the correct icon.
   ------------------------------------------------------- */
export default function Icon({ name, ...props }) {
  switch (name) {
    case "book":
    case "bible":
      return <BibleIcon {...props} />;
    case "fire":
    case "flame":
      return <FireIcon {...props} />;
    case "dove":
      return <DoveIcon {...props} />;
    // Add other standard icons used in PageHeader:
    case "share":
      return <BI name="share" {...props} />;
    case "cog":
    case "settings":
      return <BI name="gear-fill" {...props} />; // Using gear-fill for settings
    case "user":
    case "profile":
      return <BI name="person-circle" {...props} />; // Using person-circle for profile
    case "arrow-left":
      return <BI name="arrow-left" {...props} />;
    case "cross": // Used in StudiesPage.js
      return <BI name="cross" {...props} />;
    default:
      // Fallback for any unknown icon name
      console.warn(`Icon not found: ${name}`);
      return <BI name="x-circle" {...props} />;
  }
}
