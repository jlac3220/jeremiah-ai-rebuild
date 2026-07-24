// Shared Framer Motion variants — one place for the "fascinating" identity's
// motion language instead of ad-hoc transitions scattered per page.

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: "easeOut" },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// The Doctrine Map's signature moment: a node igniting when mastered.
export const igniteGlow = {
  initial: { boxShadow: "0 0 0px rgba(255,138,0,0)" },
  animate: {
    boxShadow: [
      "0 0 0px rgba(255,138,0,0)",
      "0 0 32px rgba(255,138,0,0.75)",
      "0 0 20px rgba(255,138,0,0.55)",
    ],
    transition: { duration: 1.1, ease: "easeOut" },
  },
};

export const nodeHover = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.98 },
};

// Classroom stage advance — the whole teaching surface shifts, not just text.
export const stageTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.32, ease: "easeOut" },
};

export const chatMessageIn = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.22, ease: "easeOut" },
};

export const thinkingPulse = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
  },
};
