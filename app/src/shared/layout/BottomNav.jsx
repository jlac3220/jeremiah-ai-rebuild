import { ROUTES } from "../../app/routes";

const NAV_ITEMS = [
  { id: ROUTES.HOME, label: "Home", image: "/brand/home.png" },
  { id: ROUTES.CLASSROOM, label: "Classroom", image: "/brand/jeremiah-flame.png" },
  { id: ROUTES.PROGRESS, label: "Progress", icon: "progress" },
  { id: ROUTES.PROFILE, label: "Profile", icon: "profile" },
];

function NavIcon({ type }) {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {type === "progress" ? <><path d="M4 20h16M6 16v-4m6 4V8m6 8V4" /><path d="m5 7 5-3 4 1 5-3" /></> : <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>}
    </svg>
  );
}

export default function BottomNav({ currentRoute, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-rail">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} type="button" className="nav-item" onClick={() => onNavigate(item.id)} aria-current={currentRoute === item.id ? "page" : undefined}>
            <span className="nav-icon">{item.image ? <img src={item.image} alt="" /> : <NavIcon type={item.icon} />}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
