import { motion } from "framer-motion";
import { colors } from "../../../shared/theme";

export default function ThinkingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}>
      <div
        style={{
          borderRadius: "18px",
          padding: "14px 18px",
          background: "#ffffff",
          border: `1px solid ${colors.cardBorder}`,
          display: "flex",
          gap: "6px",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "999px",
              background: colors.textFaint,
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
}
