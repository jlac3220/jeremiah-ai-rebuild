import { colors } from "../theme";

const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "9px 14px",
  borderRadius: "999px",
  fontSize: "0.85rem",
  fontWeight: 800,
};

const tones = {
  neutral: { background: "#eef2ff", color: "#3730a3" },
  onDark: { background: "rgba(255,255,255,0.14)", color: "#ffffff" },
  mastered: { background: colors.masteredBg, color: colors.masteredText },
  review: { background: colors.reviewBg, color: colors.reviewText },
  info: { background: colors.infoBg, color: colors.infoText },
  locked: { background: "#f1f5f9", color: "#94a3b8" },
};

export default function Pill({ tone = "neutral", children, style }) {
  return <span style={{ ...baseStyle, ...tones[tone], ...style }}>{children}</span>;
}
