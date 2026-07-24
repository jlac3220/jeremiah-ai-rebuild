import { motion } from "framer-motion";
import { colors } from "../../../shared/theme";
import { chatMessageIn } from "../../../shared/motion";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      {...chatMessageIn}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          borderRadius: "18px",
          padding: "14px 16px",
          lineHeight: 1.6,
          fontSize: "0.98rem",
          ...(isUser
            ? { background: colors.primaryGradient, color: "#ffffff", borderBottomRightRadius: "4px" }
            : { background: "#ffffff", border: `1px solid ${colors.cardBorder}`, color: colors.text, borderBottomLeftRadius: "4px" }),
        }}
      >
        {content}
      </div>
    </motion.div>
  );
}
