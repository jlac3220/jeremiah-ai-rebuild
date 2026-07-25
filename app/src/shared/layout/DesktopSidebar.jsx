import { NavLink } from "react-router-dom";
import { MAIN_NAV_ITEMS } from "../../app/routes";
import { HomeIcon, MapIcon, ChatIcon, ChartIcon, UserIcon } from "../ui/icons";
import { HEADER_HEIGHT } from "./AppHeader";
import { colors, fonts } from "../theme";

const ICONS = {
  [MAIN_NAV_ITEMS[0].path]: HomeIcon,
  [MAIN_NAV_ITEMS[1].path]: MapIcon,
  [MAIN_NAV_ITEMS[2].path]: ChatIcon,
  [MAIN_NAV_ITEMS[3].path]: ChartIcon,
  [MAIN_NAV_ITEMS[4].path]: UserIcon,
};

// The wide space beside a centered mobile-width column was reading as dead
// void on desktop. This gives that width a real job instead: a persistent
// nav rail, the way Linear/Notion/Khan Academy all use desktop width.
export default function DesktopSidebar() {
  return (
    <aside className="jai-sidebar-nav" style={asideStyle}>
      <nav aria-label="Main navigation" style={navStyle}>
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.path];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                ...itemStyle,
                ...(isActive ? activeItemStyle : inactiveItemStyle),
              })}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

const asideStyle = {
  width: "236px",
  flexShrink: 0,
  position: "sticky",
  top: `${HEADER_HEIGHT}px`,
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  background: "linear-gradient(180deg, #0f0b10 0%, #1a141c 100%)",
  borderRight: `1px solid ${colors.hairlineOnDark}`,
  boxSizing: "border-box",
  padding: "24px 14px",
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "11px 14px",
  borderRadius: "12px",
  fontFamily: fonts.body,
  fontSize: "0.92rem",
  fontWeight: 700,
  textDecoration: "none",
  transition: "background 150ms ease, color 150ms ease",
};

const activeItemStyle = {
  background: "rgba(255, 210, 63, 0.12)",
  color: colors.gold,
};

const inactiveItemStyle = {
  color: "rgba(243, 241, 246, 0.66)",
};
