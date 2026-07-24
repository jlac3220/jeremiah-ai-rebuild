import { motion } from "framer-motion";

const baseStyle = {
  border: "none",
  background: "#ffffff",
  color: "#0f172a",
  padding: "14px 18px",
  borderRadius: "16px",
  fontSize: "0.98rem",
  fontWeight: 800,
  cursor: "pointer",
};

export default function PrimaryButton({ style, disabled, children, ...rest }) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      style={{
        ...baseStyle,
        ...(disabled ? { opacity: 0.6, cursor: "not-allowed" } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
