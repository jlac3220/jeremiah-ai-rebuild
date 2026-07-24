// src/theme.js — Ignite App Design System

// -----------------------------
// Global typography scale
// -----------------------------
const fontScale = 1.1;

const baseFontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  hero: 26,
};

const fontSizes = Object.fromEntries(
  Object.entries(baseFontSizes).map(([key, value]) => [
    key,
    `${value * fontScale}px`,
  ])
);

const lineHeights = {
  tight: 1.1,
  normal: 1.4,
  relaxed: 1.6,
};

const tracking = {
  normal: "0em",
  wide: "0.14em",
  wider: "0.18em",
};

const textRoles = {
  body: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.normal,
    fontWeight: 400,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    fontWeight: 400,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.relaxed,
    fontWeight: 400,
  },
  labelCaps: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: tracking.wider,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: tracking.wide,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.tight,
    fontWeight: 700,
  },
  heroTitle: {
    fontSize: fontSizes.hero,
    lineHeight: lineHeights.tight,
    fontWeight: 900,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    fontWeight: 400,
  },
};

// -----------------------------
// Core Ignite theme object
// -----------------------------
const baseTheme = {
  colors: {
    // =========================
    // BLACK — Neutrals/Text/Backgrounds
    // =========================
    black: {
      pale: "#F5F5F5", // Light backgrounds
      light: "#D4D4D4", // Borders, dividers
      DEFAULT: "#737373", // Secondary text
      deep: "#404040", // Body text
      dark: "#171717", // Primary text, headings
    },

    // =========================
    // YELLOW — Fire: Spark, Ember
    // =========================
    yellow: {
      pale: "#FEF9C3", // Light backgrounds
      light: "#FDE047", // Highlights
      DEFAULT: "#FACC15", // Spark
      deep: "#FBBF24", // Ember
      dark: "#CA8A04", // Dark accents
    },

    // =========================
    // ORANGE — Fire: Fiery, Burning
    // =========================
    orange: {
      pale: "#FFEDD5", // Light backgrounds
      light: "#FB923C", // Fiery
      DEFAULT: "#F97316", // Burning
      deep: "#EA580C", // Pressed states
      dark: "#C2410C", // Ablaze
    },

    // =========================
    // RED — Fire: Torched, Scorching
    // =========================
    red: {
      pale: "#FEE2E2", // Light backgrounds
      light: "#FCA5A5", // Highlights
      DEFAULT: "#EF4444", // Torched
      deep: "#DC2626", // Scorching
      dark: "#B91C1C", // Dark accents
    },

    // =========================
    // PURPLE — Spirit, Fire: Sear
    // =========================
    purple: {
      pale: "#EDE9FE", // Light backgrounds
      light: "#C4B5FD", // Highlights
      DEFAULT: "#9333EA", // Sear
      deep: "#7C3AED", // Buttons
      dark: "#5B21B6", // Dark accents
    },

    // =========================
    // BLUE — Truth, Fire: Wildfire, Firestorm, Inferno
    // =========================
    blue: {
      pale: "#DBEAFE", // Light backgrounds
      light: "#93C5FD", // Highlights
      DEFAULT: "#4F46E5", // Wildfire
      deep: "#1D4ED8", // Firestorm
      dark: "#1E3A8A", // Inferno
    },

    // =========================
    // BRAND COLORS (legacy)
    // =========================
    primary: "#003DA5",
    primaryDeep: "#002366",

    // =========================
    // FLAME FAMILY
    // =========================
    flame: {
      yellow: "#FFD700",
      amber: "#FFB400",
      orange: "#FF6A00",
      red: "#E02121",
    },

    // =========================
    // FIRE LEVELS (progression)
    // =========================
    fireLevels: {
      spark: "#FACC15",
      ember: "#FBBF24",
      kindle: "#FB923C",
      smolder: "#F97316",
      flare: "#EF4444",
      burn: "#DC2626",
      scorch: "#C2410C",
      sear: "#9333EA",
      blaze: "#4F46E5",
      inferno: "#1E3A8A",
    },

    // =========================
    // SEMANTIC
    // =========================
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      muted: "#9CA3AF",
      inverse: "#FFFFFF",
    },

    background: {
      page: "#FFFFFF",
      soft: "#F8FAFC",
      muted: "#F1F5F9",
      dark: "#0F0F23",
    },

    border: {
      DEFAULT: "#E5E7EB",
      soft: "rgba(229, 231, 235, 0.5)",
      dark: "rgba(255, 255, 255, 0.08)",
    },

    // Status
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",

    white: "#FFFFFF",
  },

  // =========================
  // GRADIENTS
  // =========================
  gradients: {
    // Page backgrounds
    pageLight: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 50%, #E9EEF4 100%)",
    pageDark: "linear-gradient(180deg, #0B1120 0%, #020617 100%)",

    // Fire hero card
    fireDark: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F0F23 100%)",
    fireGlow:
      "radial-gradient(ellipse at 20% 50%, rgba(255, 164, 0, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)",

    // Spirit & Truth banner
    spiritTruth:
      "linear-gradient(90deg, #8B5CF6 0%, #7C3AED 10%, #5B21B6 20%, #4C1D95 30%, #2E1065 40%, #1E3A8A 60%, #1E40AF 70%, #1D4ED8 80%, #2563EB 90%, #3B82F6 100%)",

    // Individual section gradients
    spirit: "linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%)",
    spiritLight: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)",
    truth: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
    truthLight: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",

    // Fire/flame
    flame:
      "linear-gradient(145deg, #FFB400 0%, #FF6A00 35%, #E02121 65%, #002366 100%)",
    flameLight: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
    flameSimple: "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",

    // Buttons
    primary: "linear-gradient(135deg, #003DA5 0%, #002366 100%)",
    spiritBtn: "linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%)",
    truthBtn: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
    flameBtn: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
  },

  // =========================
  // SHADOWS
  // =========================
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 2px 12px rgba(0, 0, 0, 0.04)",
    md: "0 4px 20px rgba(0, 0, 0, 0.06)",
    lg: "0 8px 30px rgba(0, 0, 0, 0.08)",
    xl: "0 18px 45px rgba(15, 23, 42, 0.14)",

    // Legacy
    card: "0 18px 45px rgba(15, 23, 42, 0.14)",
    cardSoft: "0 10px 30px rgba(15, 23, 42, 0.08)",
    button: "0 12px 28px rgba(0, 61, 165, 0.35)",
    floating: "0 18px 40px rgba(15, 23, 42, 0.22)",

    // Colored
    spirit: "0 2px 8px rgba(91, 33, 182, 0.35)",
    truth: "0 2px 8px rgba(30, 58, 138, 0.35)",
    flame: "0 2px 8px rgba(249, 115, 22, 0.35)",
    danger: "0 2px 16px rgba(239, 68, 68, 0.08)",
  },

  // =========================
  // RADII
  // =========================
  radii: {
    none: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "10px",
    lg: "12px",
    xl: "14px",
    "2xl": "16px",
    "3xl": "20px",
    "4xl": "24px",
    card: "24px",
    button: "999px",
    pill: "999px",
    full: "9999px",
  },

  // =========================
  // TYPOGRAPHY
  // =========================
  typography: {
    scale: fontScale,
    baseFontSizes,
    fontSizes,
    lineHeights,
    tracking,
    roles: textRoles,

    // Legacy shortcuts
    title: {
      fontSize: fontSizes.xl,
      fontWeight: 800,
      color: "#111827",
    },
    subtitle: {
      fontSize: fontSizes.sm,
      color: "#6B7280",
    },
    labelCaps: textRoles.labelCaps,
  },

  // =========================
  // SPACING
  // =========================
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
  },

  // =========================
  // TRANSITIONS
  // =========================
  transitions: {
    fast: "0.15s ease",
    DEFAULT: "0.2s ease",
    slow: "0.3s ease",
  },

  // =========================
  // BREAKPOINTS
  // =========================
  breakpoints: {
    sm: "380px",
    md: "640px",
    lg: "960px",
    xl: "1280px",
  },

  // =========================
  // Z-INDEX
  // =========================
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    toast: 400,
  },
};

// =========================
// HELPER FUNCTIONS
// =========================
export const withOpacity = (color, opacity) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getFireLevelColor = (level) => {
  return (
    baseTheme.colors.fireLevels[level.toLowerCase()] ||
    baseTheme.colors.fireLevels.spark
  );
};

// =========================
// EXPORTS
// =========================
export default baseTheme;
export const theme = baseTheme;
export const colors = baseTheme.colors;
export const gradients = baseTheme.gradients;
export const shadows = baseTheme.shadows;
export const typography = baseTheme.typography;
export const spacing = baseTheme.spacing;
export const radii = baseTheme.radii;
