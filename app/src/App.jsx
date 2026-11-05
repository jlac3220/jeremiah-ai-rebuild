import OG1EvaluationApp from './features/pilot/OG1EvaluationApp';
import {isStandalonePilot} from './features/pilot/standalonePilot';
import AppShell from "./app/AppShell";

export default function App() {
  return isStandalonePilot()?<OG1EvaluationApp/>:<AppShell />;
}