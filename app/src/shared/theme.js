// Design tokens. The original app (reference/current-app/src/theme.js) had
// real atmosphere: layered radial glows behind hero cards, a proper 4-stop
// flame gradient, and colored shadows tinted to match each accent instead
// of one flat gray shadow everywhere. This restores that vocabulary instead
// of the flat single-gradient version this rebuild started with.
export const fonts = {
  display: '"Manrope", system-ui, sans-serif',
  body: '"Manrope", system-ui, sans-serif',
};

// Real per-subject identity — standardsRegistry.js already assigns these
// (OG blue, NB red) but nothing in the UI used them before now.
export const subjectAccent = {
  OG: { base: "#003DA5", soft: "#eff4ff", text: "#00287a", shadow: "0 10px 28px rgba(0, 61, 165, 0.35)" },
  NB: { base: "#dc2626", soft: "#fef2f2", text: "#991b1b", shadow: "0 10px 28px rgba(220, 38, 38, 0.32)" },
};

export function getSubjectAccent(subjectCode) {
  return subjectAccent[subjectCode] || subjectAccent.OG;
}

export const gradients = {
  page: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",

  // A dark hero card with real atmosphere: base navy gradient plus two soft
  // radial glows (amber lower-left, red upper-right) layered on top —
  // that's what makes it read as "lit from within" instead of flat navy.
  heroDark:
    "radial-gradient(ellipse 70% 60% at 15% 85%, rgba(255, 138, 0, 0.22) 0%, transparent 60%)," +
    "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(220, 38, 38, 0.16) 0%, transparent 55%)," +
    "linear-gradient(135deg, #0b1228 0%, #16233b 55%, #1f2f4b 100%)",

  // The real flame — four stops, not two. Used for the mastery moment,
  // primary CTA accents, and anywhere the "ignite" identity needs to be felt.
  flame: "linear-gradient(145deg, #FFD700 0%, #FFB400 30%, #FF6A00 65%, #E02121 100%)",
  flameSoft: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
};

export const colors = {
  pageGradient: gradients.page,
  primaryGradient: gradients.heroDark,

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

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 20px rgba(0, 0, 0, 0.06)",
  lg: "0 8px 30px rgba(0, 0, 0, 0.08)",
  xl: "0 18px 45px rgba(15, 23, 42, 0.14)",
  flame: "0 10px 28px rgba(249, 115, 22, 0.35)",
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
