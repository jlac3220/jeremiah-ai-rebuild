// Design tokens. Pulled out of the inline style objects that were
// copy-pasted near-verbatim across HomePage/ProgressPage/ProfilePage/
// ClassroomPage — one home for the palette instead of five.
export const colors = {
  pageGradient: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  primaryGradient: "linear-gradient(135deg, #0b1228 0%, #16233b 55%, #1f2f4b 100%)",

  cardBg: "#ffffff",
  cardBorder: "#e2e8f0",
  cardShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",

  text: "#0f172a",
  textMuted: "#475569",
  textFaint: "#64748b",

  checkpointBg: "#fff7ed",
  checkpointBorder: "#fed7aa",
  checkpointTextDark: "#7c2d12",
  checkpointTextMid: "#9a3412",

  masteredBg: "#ecfdf5",
  masteredText: "#047857",

  reviewBg: "#ffedd5",
  reviewText: "#9a3412",

  infoBg: "#eff6ff",
  infoText: "#1d4ed8",

  strongBg: "#f0fdf4",
  strongBorder: "#86efac",
  partialBg: "#fff7ed",
  partialBorder: "#fdba74",
  weakBg: "#fef2f2",
  weakBorder: "#fca5a5",
};

// The "ignite" identity for the Doctrine Map: mastery is visualized as
// light, not a percentage bar. Same warm progression FireLevelMeter used in
// the original app, repurposed as a lit/dim state per standard instead of a
// single account-wide points meter.
export const ignite = {
  unlit: "#cbd5e1",
  dim: "#94a3b8",
  spark: "#FFD000",
  ember: "#FF8A00",
  blaze: "#FF4D00",
  inferno: "#D1001F",
  glow: "0 0 24px rgba(255, 138, 0, 0.55)",
  lockedBg: "#f1f5f9",
  lockedText: "#94a3b8",
};

export const radius = {
  sm: "14px",
  md: "20px",
  lg: "26px",
  xl: "32px",
  pill: "999px",
};

export const spacing = {
  xs: "8px",
  sm: "14px",
  md: "20px",
  lg: "26px",
  xl: "32px",
};
