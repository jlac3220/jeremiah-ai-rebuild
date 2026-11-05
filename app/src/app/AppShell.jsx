import { useState } from "react";
import AppRouter from "./AppRouter";
import { MAIN_NAV_ROUTES, ROUTES } from "./routes";
import BottomNav from "../shared/layout/BottomNav";

export default function AppShell() {
  const [currentRoute, setCurrentRoute] = useState(ROUTES.HOME);
  const showBottomNav = MAIN_NAV_ROUTES.includes(currentRoute);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="brand-header">
        <div className="brand-header-inner">
          <button className="brand-home" onClick={() => setCurrentRoute(ROUTES.HOME)} aria-label="Jeremiah home">
            <img src="/brand/jeremiah-flame.png" alt="" />
            <span className="brand-wordmark">Jeremiah<span className="brand-caption">ROOTED IN THE WORD</span></span>
          </button>
          <span className="brand-header-note">Learn. Understand. Grow.</span>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className={showBottomNav ? "app-main with-navigation" : "app-main"}>
        <AppRouter currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      </main>
      {showBottomNav && <BottomNav currentRoute={currentRoute} onNavigate={setCurrentRoute} />}
    </div>
  );
}
