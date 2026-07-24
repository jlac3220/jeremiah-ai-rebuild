/* src/styles.css */

/* =============================================================
   DESIGN TOKENS — CSS Custom Properties
   Mirrors theme.js so CSS and JS stay in sync.
   ============================================================= */
:root {
  /* ---- Typography ---- */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;

  /* ---- Neutral palette ---- */
  --color-black-pale:  #F5F5F5;
  --color-black-light: #D4D4D4;
  --color-black:       #737373;
  --color-black-deep:  #404040;
  --color-black-dark:  #171717;

  /* ---- Yellow / Spark ---- */
  --color-yellow-pale:  #FEF9C3;
  --color-yellow-light: #FDE047;
  --color-yellow:       #FACC15;
  --color-yellow-deep:  #FBBF24;
  --color-yellow-dark:  #CA8A04;

  /* ---- Orange / Fire ---- */
  --color-orange-pale:  #FFEDD5;
  --color-orange-light: #FB923C;
  --color-orange:       #F97316;
  --color-orange-deep:  #EA580C;
  --color-orange-dark:  #C2410C;

  /* ---- Red / Torch ---- */
  --color-red-pale:  #FEE2E2;
  --color-red-light: #FCA5A5;
  --color-red:       #EF4444;
  --color-red-deep:  #DC2626;
  --color-red-dark:  #B91C1C;

  /* ---- Purple / Spirit ---- */
  --color-purple-pale:  #EDE9FE;
  --color-purple-light: #C4B5FD;
  --color-purple:       #9333EA;
  --color-purple-deep:  #7C3AED;
  --color-purple-dark:  #5B21B6;

  /* ---- Blue / Truth ---- */
  --color-blue-pale:  #DBEAFE;
  --color-blue-light: #93C5FD;
  --color-blue:       #4F46E5;
  --color-blue-deep:  #1D4ED8;
  --color-blue-dark:  #1E3A8A;

  /* ---- Semantic / text ---- */
  --color-text-primary:   #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted:     #9CA3AF;
  --color-text-inverse:   #FFFFFF;

  /* ---- Semantic / background ---- */
  --color-bg-page:  #FFFFFF;
  --color-bg-soft:  #F8FAFC;
  --color-bg-muted: #F1F5F9;
  --color-bg-dark:  #0F0F23;

  /* ---- Semantic / border ---- */
  --color-border:      #E5E7EB;
  --color-border-soft: rgba(229, 231, 235, 0.5);

  /* ---- Status ---- */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error:   #EF4444;

  /* ---- Brand ---- */
  --color-white:         #FFFFFF;
  --color-primary:       #003DA5;
  --color-primary-deep:  #002366;

  /* ---- Gradients ---- */
  --gradient-page:         linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 50%, #E9EEF4 100%);
  --gradient-flame:        linear-gradient(145deg, #FFB400 0%, #FF6A00 35%, #E02121 65%, #002366 100%);
  --gradient-flame-simple: linear-gradient(135deg, #F97316 0%, #EF4444 100%);
  --gradient-spirit:       linear-gradient(135deg, #5B21B6 0%, #4C1D95 100%);
  --gradient-truth:        linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
  --gradient-primary:      linear-gradient(135deg, #003DA5 0%, #002366 100%);

  /* ---- Shadows ---- */
  --shadow-sm:     0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow:        0 2px 12px rgba(0, 0, 0, 0.04);
  --shadow-md:     0 4px 20px rgba(0, 0, 0, 0.06);
  --shadow-lg:     0 8px 30px rgba(0, 0, 0, 0.08);
  --shadow-xl:     0 18px 45px rgba(15, 23, 42, 0.14);
  --shadow-card:   0 18px 45px rgba(15, 23, 42, 0.14);
  --shadow-button: 0 12px 28px rgba(0, 61, 165, 0.35);

  /* ---- Border radii ---- */
  --radius-sm:   4px;
  --radius:      8px;
  --radius-md:   10px;
  --radius-lg:   12px;
  --radius-xl:   14px;
  --radius-2xl:  16px;
  --radius-3xl:  20px;
  --radius-card: 24px;
  --radius-pill: 999px;

  /* ---- Spacing scale ---- */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.25rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* ---- Transitions ---- */
  --transition-fast: 0.15s ease;
  --transition:      0.2s ease;
  --transition-slow: 0.3s ease;

  /* ---- Layout ---- */
  --app-max: 960px;

  /* ---- Focus ring (accessible, WCAG 2.1 AA) ---- */
  --focus-ring: 0 0 0 3px rgba(29, 78, 216, 0.45);
  --focus-ring-offset: 2px;
}

/* =============================================================
   BASE RESETS
   ============================================================= */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Hide CodeSandbox button */
[class*="csb"],
[class*="CodeSandbox"],
iframe[title*="sandbox"],
button[title*="sandbox"],
a[href*="codesandbox"] {
  display: none !important;
}

html {
  scroll-behavior: smooth;
}

/* Lock the page itself and make it solid white */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--color-bg-page);
}

/* App root becomes the scroller */
#root {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--color-bg-page);
}

/* Lock outer scroll when Jeremiah is open */
body.ask-open #root {
  overflow: hidden;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* =============================================================
   GLOBAL ACCESSIBILITY — Focus Indicators
   Visible only when using keyboard; hidden for mouse/touch.
   ============================================================= */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-blue-deep);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-sm);
}

/* =============================================================
   GLOBAL INTERACTIVE ELEMENTS
   ============================================================= */

/* Remove tap highlight on mobile */
button,
a,
[role="button"] {
  -webkit-tap-highlight-color: transparent;
}

/* Ensure pointer cursor on interactive elements */
button,
[role="button"],
label[for],
select,
summary {
  cursor: pointer;
}

/* Disabled state — consistent across the app */
:disabled,
[disabled],
[aria-disabled="true"] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* =============================================================
   SKIP NAVIGATION (accessibility) — visually hidden until focused
   ============================================================= */
.skip-to-main {
  position: absolute;
  top: -9999px;
  left: -9999px;
  z-index: 9999;
  padding: 0.6rem 1.2rem;
  background: var(--color-blue-dark);
  color: var(--color-white);
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  white-space: nowrap;
}

.skip-to-main:focus-visible {
  top: var(--space-3);
  left: var(--space-3);
  outline: 2px solid var(--color-yellow);
  outline-offset: 2px;
}

/* =============================================================
   COMMON UTILITY CLASSES
   ============================================================= */

/* Visually hidden but screen-reader accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* =============================================================
   HEADER / NAV
   ============================================================= */

/* Lock the top header bar */
.ignite-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background: var(--color-white);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* =============================================================
   STARTUP / TAGLINE (StartupPage component)
   ============================================================= */

/* Tagline container */
.ignite-tagline-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: var(--space-4);
  margin-top: auto;
}

/* Actual text */
.ignite-tagline {
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.88);
  opacity: 0;
  transform: translateY(8px);
  animation: igniteTaglineFade 700ms ease-out forwards;
  animation-delay: 1s;
  text-align: center;
  white-space: normal;
}

/* Dot between phrases */
.ignite-tag-sep {
  opacity: 0.9;
}

/* Fade animation */
@keyframes igniteTaglineFade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive sizing */
@media (max-width: 640px) {
  .ignite-tagline {
    font-size: 0.72rem;
    letter-spacing: 0.16em;
  }
}

@media (max-width: 380px) {
  .ignite-tagline {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
  }
}
