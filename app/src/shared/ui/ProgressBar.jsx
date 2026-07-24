import { motion } from "framer-motion";

const trackStyleBase = {
  width: "100%",
  height: "12px",
  borderRadius: "999px",
  overflow: "hidden",
};

const fillStyleBase = {
  height: "100%",
  borderRadius: "999px",
};

/** tone: "light" (for dark cards, white fill) | "dark" (for light cards, navy fill) */
export default function ProgressBar({ percent = 0, tone = "light" }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const track =
    tone === "light"
      ? { ...trackStyleBase, background: "rgba(255,255,255,0.14)" }
      : { ...trackStyleBase, background: "#e2e8f0" };
  const fillColor = tone === "light" ? "#ffffff" : "#0f172a";

  return (
    <div style={track}>
      <motion.div
        style={{ ...fillStyleBase, background: fillColor }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
