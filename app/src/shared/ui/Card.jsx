import { colors, radius } from "../theme";

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

export default function Card({ variant = "light", style, children, ...rest }) {
  return (
    <div style={{ ...baseStyle, ...variants[variant], ...style }} {...rest}>
      {children}
    </div>
  );
}
