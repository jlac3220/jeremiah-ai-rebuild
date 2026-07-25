import { Link } from "react-router-dom";
import { FlameMark } from "../ui/icons";
import { gradients } from "../theme";

export default function AppHeader() {
  return (
    <header style={headerStyle}>
      <Link to="/" style={brandStyle}>
        <span style={flameWrapStyle}>
          <FlameMark size={22} />
        </span>
        <span style={wordmarkStyle}>
          <span style={wordmarkFlameStyle}>Jeremiah</span>
          <span style={wordmarkAccentStyle}> AI</span>
        </span>
      </Link>
    </header>
  );
}

// A dark translucent bar, not a light one — so it reads the same whether
// it's sitting over a dark hero (Home, Map, Defend) or a light page body.
// Fixed height so DesktopSidebar can position itself exactly below this bar
// (sticky top offset) instead of guessing.
export const HEADER_HEIGHT = 64;

const headerStyle = {
  width: "100%",
  height: `${HEADER_HEIGHT}px`,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  background: "rgba(15, 11, 16, 0.62)",
  backdropFilter: "blur(14px) saturate(140%)",
  WebkitBackdropFilter: "blur(14px) saturate(140%)",
  borderBottom: "1px solid rgba(243, 241, 246, 0.14)",
  position: "sticky",
  top: 0,
  zIndex: 20,
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "0 20px",
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

// Two-tone wordmark matching the original brand mark: the name in flame
// gradient, the accent portion in a cool blue — same split the logo used.
const wordmarkStyle = {
  fontFamily: '"Manrope", system-ui, sans-serif',
  fontWeight: 800,
  fontSize: "1.05rem",
  letterSpacing: "-0.01em",
};

const wordmarkFlameStyle = {
  background: gradients.flame,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const wordmarkAccentStyle = {
  color: "#5b8cff",
};
