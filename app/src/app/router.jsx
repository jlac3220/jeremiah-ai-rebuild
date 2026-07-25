import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";
import HomePage from "../features/home/HomePage";
import DoctrineMapPage from "../features/map/DoctrineMapPage";
import ClassroomPage from "../features/classroom/ClassroomPage";
import DefendTheFaithPage from "../features/defend/DefendTheFaithPage";
import AskJeremiahPage from "../features/ask/AskJeremiahPage";
import ProgressPage from "../features/progress/ProgressPage";
import ProfilePage from "../features/profile/ProfilePage";
import BibleSupportPage from "../features/bible-support/BibleSupportPage";
import RapidFirePage from "../features/rapid-fire/RapidFirePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.MAP} element={<DoctrineMapPage />} />
      <Route path={ROUTES.CLASSROOM} element={<ClassroomPage />} />
      <Route path={ROUTES.DEFEND} element={<DefendTheFaithPage />} />
      <Route path={ROUTES.BIBLE_SUPPORT} element={<BibleSupportPage />} />
      <Route path={ROUTES.ASK} element={<AskJeremiahPage />} />
      <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path={ROUTES.RAPID_FIRE} element={<RapidFirePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
