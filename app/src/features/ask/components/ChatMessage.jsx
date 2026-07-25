import { motion } from "framer-motion";
import { colors } from "../../../shared/theme";
import { chatMessageIn } from "../../../shared/motion";
import { FlameMark } from "../../../shared/ui/icons";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      {...chatMessageIn}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "8px",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      {!isUser ? (
        <div style={avatarStyle}>
          <FlameMark size={18} />
        </div>
      ) : null}
      <div
        style={{
          maxWidth: "78%",
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

const avatarStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  background: "#0f172a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
