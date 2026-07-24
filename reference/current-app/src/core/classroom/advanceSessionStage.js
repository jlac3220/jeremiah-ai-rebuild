import { sessionStages } from "./sessionStages";

export function advanceSessionStage(currentStageId, evaluationStatus) {
  if (evaluationStatus !== "strong") {
    return currentStageId;
  }

  const currentIndex = sessionStages.findIndex(
    (stage) => stage.id === currentStageId
  );

  if (currentIndex === -1) {
    return currentStageId;
  }

  const nextStage = sessionStages[currentIndex + 1];

  return nextStage ? nextStage.id : currentStageId;
}