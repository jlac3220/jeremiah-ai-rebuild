import { useState } from "react";
import AppRouter from "./AppRouter";
import { MAIN_NAV_ROUTES, ROUTES } from "./routes";
import BottomNav from "../shared/layout/BottomNav";

export default function AppShell() {
  const [currentRoute, setCurrentRoute] = useState(ROUTES.HOME);

  const showBottomNav = MAIN_NAV_ROUTES.includes(currentRoute);

  return (
    <div style={shellStyle}>
      <main style={{ ...mainStyle, paddingBottom: showBottomNav ? "88px" : "0px" }}>
        <AppRouter
          currentRoute={currentRoute}
          onNavigate={setCurrentRoute}
        />
      </main>

      {showBottomNav && (
        <div style={bottomNavWrapStyle}>
          <BottomNav
            currentRoute={currentRoute}
            onNavigate={setCurrentRoute}
          />
        </div>
      )}
    </div>
  );
}

const shellStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
};

const mainStyle = {
  flex: 1,
};

const bottomNavWrapStyle = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  background: "#ffffff",
};