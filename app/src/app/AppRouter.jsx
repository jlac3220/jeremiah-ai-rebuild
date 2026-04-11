import { ROUTES } from "./routes";
import HomePage from "../features/home/HomePage";
import ClassroomPage from "../features/classroom/ClassroomPage";
import ProgressPage from "../features/progress/ProgressPage";
import ProfilePage from "../features/profile/ProfilePage";

function Placeholder({ title }) {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>{title}</h1>
    </div>
  );
}

export default function AppRouter({ currentRoute, onNavigate }) {
  switch (currentRoute) {
    case ROUTES.STARTUP:
      return <Placeholder title="Startup" />;

    case ROUTES.LOGIN:
      return <Placeholder title="Login" />;

    case ROUTES.PROFILE_SELECT:
      return <Placeholder title="Profile Select" />;

    case ROUTES.CLASSROOM:
      return <ClassroomPage onNavigate={onNavigate} />;

    case ROUTES.PROGRESS:
      return <ProgressPage onNavigate={onNavigate} />;

    case ROUTES.PROFILE:
      return <ProfilePage onNavigate={onNavigate} />;

    case ROUTES.BIBLE_SUPPORT:
      return <Placeholder title="Bible Support" />;

    case ROUTES.HOME:
    default:
      return <HomePage onNavigate={onNavigate} />;
  }
}