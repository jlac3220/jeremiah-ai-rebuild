import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import BottomNav from "../shared/layout/BottomNav";

export default function AppShell() {
  return (
    <BrowserRouter>
      <div style={shellStyle}>
        <main style={mainStyle}>
          <AppRoutes />
        </main>

        <div style={bottomNavWrapStyle}>
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
  flex: 1,
  paddingBottom: "88px",
};

const bottomNavWrapStyle = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  background: "#ffffff",
};
