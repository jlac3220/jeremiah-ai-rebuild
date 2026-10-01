import { ROUTES } from '../../app/routes';
const NAV_ITEMS = [
  { id: ROUTES.HOME, label: 'Home', path: 'M3 10 12 3l9 7v10h-6v-6H9v6H3Z' },
  { id: ROUTES.CLASSROOM, label: 'Classroom', path: 'm2 8 10-5 10 5-10 5Zm4 3v6c4 3 8 3 12 0v-6M22 8v9' },
  { id: ROUTES.PROGRESS, label: 'Progress', path: 'M4 20V10m8 10V4m8 16v-7' },
  { id: ROUTES.PROFILE, label: 'Profile', path: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2' },
  { id: ROUTES.BIBLE_SUPPORT, label: 'Bible', path: 'M12 5v16M3 4c3-1 6-1 9 1 3-2 6-2 9-1v16c-3-1-6-1-9 1-3-2-6-2-9-1Z' },
];
export default function BottomNav({ currentRoute, onNavigate }) {
  return <nav className="app-nav" aria-label="Main navigation"><div className="app-nav-rail">{NAV_ITEMS.map((item) => <button key={item.id} type="button" onClick={() => onNavigate(item.id)} aria-current={currentRoute === item.id ? 'page' : undefined}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.path} /></svg><span>{item.label}</span></button>)}</div></nav>;
}
