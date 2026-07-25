import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import AppHeader from "../shared/layout/AppHeader";
import BottomNav from "../shared/layout/BottomNav";
import DesktopSidebar from "../shared/layout/DesktopSidebar";

export default function AppShell() {
  return (
    <BrowserRouter>
      <div style={shellStyle}>
        <AppHeader />
        <div className="jai-body-row">
          <DesktopSidebar />
          <main className="jai-main-area" style={mainStyle}>
            <AppRoutes />
          </main>
        </div>

        <div className="jai-bottom-nav" style={bottomNavWrapStyle}>
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

const shellStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
};

const mainStyle = {
  paddingBottom: "88px",
};

const bottomNavWrapStyle = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  background: "#ffffff",
};
