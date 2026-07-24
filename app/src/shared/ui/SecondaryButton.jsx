import { motion } from "framer-motion";

const baseStyle = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "13px 16px",
  borderRadius: "16px",
  fontSize: "0.95rem",
  fontWeight: 800,
  cursor: "pointer",
};

export default function SecondaryButton({ style, children, ...rest }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{ ...baseStyle, ...style }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
