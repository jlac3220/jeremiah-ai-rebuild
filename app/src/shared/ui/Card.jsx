import { motion } from "framer-motion";
import { colors, radius } from "../theme";
import { fadeInUp } from "../motion";

const baseStyle = {
  borderRadius: radius.lg,
  padding: "24px",
  boxSizing: "border-box",
};

const variants = {
  light: {
    background: colors.cardBg,
    border: `1px solid ${colors.cardBorder}`,
    boxShadow: colors.cardShadow,
    color: colors.text,
  },
  dark: {
    background: colors.primaryGradient,
    color: "#ffffff",
    boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
  },
  checkpoint: {
    background: colors.checkpointBg,
    border: `1px solid ${colors.checkpointBorder}`,
    boxShadow: "0 10px 24px rgba(249, 115, 22, 0.08)",
  },
  subtle: {
    background: "#f8fafc",
    border: `1px solid ${colors.cardBorder}`,
  },
};

/** animate: false to skip the entrance motion (e.g. inside a list already staggering). */
export default function Card({ variant = "light", style, animate = true, children, ...rest }) {
  const motionProps = animate
    ? { initial: fadeInUp.initial, animate: fadeInUp.animate, transition: fadeInUp.transition }
    : {};

  return (
    <motion.div
      style={{ ...baseStyle, ...variants[variant], ...style }}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
