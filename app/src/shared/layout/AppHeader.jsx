import { Link } from "react-router-dom";
import { FlameMark } from "../ui/icons";

export default function AppHeader() {
  return (
    <header style={headerStyle}>
      <Link to="/" style={brandStyle}>
        <span style={flameWrapStyle}>
          <FlameMark size={22} />
        </span>
        <span style={wordmarkStyle}>Jeremiah AI</span>
      </Link>
    </header>
  );
}

// A dark translucent bar, not a light one — so it reads the same whether
// it's sitting over a dark hero (Home, Map, Defend) or a light page body.
const headerStyle = {
  width: "100%",
  background: "rgba(15, 11, 16, 0.62)",
  backdropFilter: "blur(14px) saturate(140%)",
  WebkitBackdropFilter: "blur(14px) saturate(140%)",
  borderBottom: "1px solid rgba(243, 241, 246, 0.14)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  maxWidth: "980px",
  margin: "0 auto",
  padding: "12px 20px",
  textDecoration: "none",
};

const flameWrapStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle, rgba(255,138,0,0.18) 0%, transparent 70%)",
};

const wordmarkStyle = {
  fontFamily: '"Manrope", system-ui, sans-serif',
  fontWeight: 800,
  fontSize: "1.05rem",
  color: "#f3f1f6",
  letterSpacing: "-0.01em",
};
