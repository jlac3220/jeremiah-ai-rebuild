import { NavLink } from "react-router-dom";
import { MAIN_NAV_ITEMS } from "../../app/routes";

export default function BottomNav() {
  return (
    <nav aria-label="Main navigation" style={navStyle}>
      <div style={railStyle}>
        {MAIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            style={({ isActive }) => ({
              ...itemStyle,
              ...(isActive ? activeItemStyle : inactiveItemStyle),
            })}
          >
            <span style={labelStyle}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

const navStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(12px)",
  borderTop: "1px solid #e2e8f0",
  boxShadow: "0 -8px 24px rgba(15, 23, 42, 0.06)",
};

const railStyle = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: "8px",
  padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
  boxSizing: "border-box",
};

const itemStyle = {
  minWidth: 0,
  border: "none",
  padding: "12px 8px",
  borderRadius: "16px",
  fontSize: "0.9rem",
  fontWeight: 800,
  cursor: "pointer",
  transition: "all 180ms ease",
  whiteSpace: "nowrap",
  textAlign: "center",
  textDecoration: "none",
  display: "block",
};

const activeItemStyle = {
  background: "#0f172a",
  color: "#ffffff",
};

const inactiveItemStyle = {
  background: "#ffffff",
  color: "#334155",
};

const labelStyle = {
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
