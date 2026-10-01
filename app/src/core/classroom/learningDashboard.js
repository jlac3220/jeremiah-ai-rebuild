import { classroomContentRegistry } from './content/classroomContentRegistry.js';
import { loadLearningState, getStandardProgress, getInstructionalMove } from './learningEngine.js';

export function getLearningDashboard() {
  const standards = Object.values(classroomContentRegistry).map((content) => {
    const paths = Object.keys(content.presets || {}).map((preset) => {
      const state = loadLearningState(content, preset);
      const started = Boolean(state.milestones.started || state.completedMoveIds.length || state.experience.updatedAt || Object.keys(state.attemptsByMove).length);
      return { preset, state, started, percent: getStandardProgress(content, state) };
    });
    const active = paths.filter((p) => p.started).sort((a, b) => b.state.lastUpdatedAt - a.state.lastUpdatedAt)[0] || paths.find((p) => p.preset === 'direct');
    const mastered = paths.some((p) => p.state.milestones.complete || p.state.milestones.mastery);
    const needsReview = !mastered && (active.state.misconceptions?.length || 0) > 0;
    return { content, ...active, mastered, needsReview, move: getInstructionalMove(content, active.state.currentMoveId) };
  });
  const active = standards.filter((s) => s.started).sort((a, b) => b.state.lastUpdatedAt - a.state.lastUpdatedAt)[0] || standards[0];
  return {
    standards, active,
    mastered: standards.filter((s) => s.mastered).length,
    inProgress: standards.filter((s) => s.started && !s.mastered).length,
    reviewNeeded: standards.filter((s) => s.needsReview).length,
  };
}
