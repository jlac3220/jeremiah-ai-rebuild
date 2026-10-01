import { useEffect, useState } from 'react';
import AppRouter from './AppRouter';
import { MAIN_NAV_ROUTES, ROUTES } from './routes';
import BottomNav from '../shared/layout/BottomNav';
import { clearBibleReaderIntent } from '../core/bible/bibleReaderIntent';
import { getLearningDashboard } from '../core/classroom/learningDashboard';
import { setActiveClassroomSessionPreset } from '../core/classroom/classroomSessionData';
import { setClassroomEntryIntent, CLASSROOM_ENTRY_INTENTS } from '../core/classroom/classroomEntryIntent';
function readRoute() {
  const route = window.location.hash.slice(1);
  return MAIN_NAV_ROUTES.includes(route) ? route : ROUTES.HOME;
}
export default function AppShell() {
  const [currentRoute, setCurrentRoute] = useState(readRoute);
  useEffect(() => {
    function syncRoute() { setCurrentRoute(readRoute()); window.scrollTo(0, 0); }
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);
  function navigate(route) {
    if (route === currentRoute) return;
    // A reader opened from the main navigation is independent of a lesson link.
    if (currentRoute === ROUTES.BIBLE_SUPPORT && route !== ROUTES.CLASSROOM) clearBibleReaderIntent();
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  }
  function navigateFromNav(route) {
    if (route === ROUTES.BIBLE_SUPPORT) clearBibleReaderIntent();
    if (route === ROUTES.CLASSROOM) {
      const active = getLearningDashboard().active;
      setActiveClassroomSessionPreset(active.preset);
      setClassroomEntryIntent(active.started ? CLASSROOM_ENTRY_INTENTS.RESUME : CLASSROOM_ENTRY_INTENTS.DIRECT);
    }
    navigate(route);
  }
  const showBottomNav = MAIN_NAV_ROUTES.includes(currentRoute) && currentRoute !== ROUTES.CLASSROOM;
  return <div className="app-shell"><main className={showBottomNav ? 'app-main has-nav' : 'app-main'}><AppRouter currentRoute={currentRoute} onNavigate={navigate} /></main>{showBottomNav && <BottomNav currentRoute={currentRoute} onNavigate={navigateFromNav} />}</div>;
}
