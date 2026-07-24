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
    <button type="button" style={{ ...baseStyle, ...style }} {...rest}>
      {children}
    </button>
  );
}
