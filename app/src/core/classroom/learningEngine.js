const STORAGE_PREFIX = "jeremiah-learning-state";

function keyFor(standardId, presetId) {
  return `${STORAGE_PREFIX}:${standardId}:${presetId}`;
}

export function getInstructionalMove(content, moveId) {
  return content?.instructionalMoves?.find((move) => move.id === moveId) || null;
}

export function getInitialMoveId(content, presetId = "direct") {
  return (
    content?.presets?.[presetId]?.currentMoveId ||
    content?.instructionalMoves?.[0]?.id ||
    ""
  );
}

export function createLearningState(content, presetId = "direct") {
  return {
    standardId: content.standardId,
    presetId,
    currentMoveId: getInitialMoveId(content, presetId),
    completedMoveIds: [],
    attemptsByMove: {},
    evidenceIds: [],
    misconceptions: [],
    teacherHistory: [],
    encounterData: null,
    milestones: {
      started: false,
      scripture: false,
      evidence: false,
      checkpoint: false,
      teachBack: false,
      mastery: false,
      complete: false,
    },
    experience: {
      sceneIndex: 0,
      sceneId: "",
      selections: {},
      viewedSourceIds: [],
      drafts: {},
      updatedAt: null,
    },
    lastUpdatedAt: Date.now(),
  };
}

export function loadLearningState(content, presetId = "direct") {
  if (typeof window === "undefined") return createLearningState(content, presetId);

  const storageKey = keyFor(content.standardId, presetId);
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) return createLearningState(content, presetId);

  try {
    const parsed = JSON.parse(raw);
    const moveExists = getInstructionalMove(content, parsed.currentMoveId);

    if (!moveExists) return createLearningState(content, presetId);

    const base = createLearningState(content, presetId);

    return {
      ...base,
      ...parsed,
      milestones: {
        ...base.milestones,
        ...(parsed.milestones || {}),
      },
      experience: {
        ...base.experience,
        ...(parsed.experience || {}),
        selections: {
          ...base.experience.selections,
          ...(parsed.experience?.selections || {}),
        },
        viewedSourceIds: parsed.experience?.viewedSourceIds || [],
        drafts: {
          ...base.experience.drafts,
          ...(parsed.experience?.drafts || {}),
        },
      },
      standardId: content.standardId,
      presetId,
    };
  } catch {
    return createLearningState(content, presetId);
  }
}

export function saveLearningState(state) {
  if (typeof window === "undefined" || !state?.standardId || !state?.presetId) {
    return;
  }

  window.localStorage.setItem(
    keyFor(state.standardId, state.presetId),
    JSON.stringify({ ...state, lastUpdatedAt: Date.now() })
  );
}

export function clearLearningState(content, presetId = "direct") {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(keyFor(content.standardId, presetId));
}

export function updateLearningExperience(state, patch = {}) {
  return {
    ...state,
    experience: {
      ...(state.experience || {}),
      ...patch,
      selections: {
        ...(state.experience?.selections || {}),
        ...(patch.selections || {}),
      },
      viewedSourceIds: [
        ...new Set([
          ...(state.experience?.viewedSourceIds || []),
          ...(patch.viewedSourceIds || []),
        ]),
      ],
      drafts: {
        ...(state.experience?.drafts || {}),
        ...(patch.drafts || {}),
      },
      updatedAt: Date.now(),
    },
    lastUpdatedAt: Date.now(),
  };
}

export function markLearningMilestones(state, milestoneIds = []) {
  const milestones = { ...(state.milestones || {}) };
  milestoneIds.forEach((id) => {
    if (id) milestones[id] = true;
  });

  return {
    ...state,
    milestones,
    lastUpdatedAt: Date.now(),
  };
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

export function recordAttempt(state, move, teacherDecision) {
  const attemptCount = (state.attemptsByMove?.[move.id] || 0) + 1;
  const completed = teacherDecision.verdict === "strong";

  const milestoneId =
    completed && move.type === "scenario"
      ? "checkpoint"
      : completed && move.type === "free_response"
        ? "teachBack"
        : completed && move.type === "mastery_response"
          ? "mastery"
          : "";

  return {
    ...state,
    milestones: {
      ...(state.milestones || {}),
      ...(completed ? { started: true } : {}),
      ...(milestoneId ? { [milestoneId]: true } : {}),
    },
    attemptsByMove: {
      ...state.attemptsByMove,
      [move.id]: attemptCount,
    },
    completedMoveIds: completed
      ? unique([
          ...(state.completedMoveIds || []),
          move.id,
          ...(move.satisfiesMoveIds || []),
        ])
      : state.completedMoveIds || [],
    evidenceIds: completed
      ? unique([...(state.evidenceIds || []), ...(move.evidenceIds || [])])
      : state.evidenceIds || [],
    misconceptions: unique([
      ...(state.misconceptions || []),
      ...(teacherDecision.misconceptionIds || []),
    ]),
    teacherHistory: [
      ...(state.teacherHistory || []),
      {
        moveId: move.id,
        verdict: teacherDecision.verdict,
        strategy: teacherDecision.strategy,
        at: Date.now(),
      },
    ].slice(-20),
    lastUpdatedAt: Date.now(),
  };
}

export function resolveNextMoveId(move, verdict, strategy = "") {
  if (!move?.next) return move?.id || "";

  if (verdict === "continue") {
    return move.next.continue || move.id;
  }

  if (verdict !== "strong" && strategy && move.strategyRoutes?.[strategy]) {
    return move.strategyRoutes[strategy];
  }

  return move.next[verdict] || move.id;
}

export function advanceLearningState(state, move, teacherDecision) {
  const recorded = recordAttempt(state, move, teacherDecision);
  const nextMoveId = resolveNextMoveId(
    move,
    teacherDecision.verdict,
    teacherDecision.strategy
  );

  return {
    ...recorded,
    currentMoveId: nextMoveId,
    lastUpdatedAt: Date.now(),
  };
}

export function advanceUnscoredMove(state, move) {
  const nextMoveId = resolveNextMoveId(move, "continue");
  return {
    ...state,
    milestones: {
      ...(state.milestones || {}),
      started: true,
    },
    currentMoveId: nextMoveId,
    completedMoveIds: unique([...(state.completedMoveIds || []), move.id]),
    lastUpdatedAt: Date.now(),
  };
}

export function advanceEncounterMove(state, move, encounterData = {}) {
  const advanced = advanceUnscoredMove(state, move);

  return {
    ...advanced,
    milestones: {
      ...(advanced.milestones || {}),
      started: true,
      scripture: true,
      evidence: true,
    },
    encounterData: {
      ...(state.encounterData || {}),
      ...encounterData,
      completedAt: Date.now(),
    },
    lastUpdatedAt: Date.now(),
  };
}

export function getStandardProgress(content, state) {
  const completeMove = (content.instructionalMoves || []).find(
    (move) => move.type === "complete"
  );

  if (completeMove && state.currentMoveId === completeMove.id) {
    return 100;
  }

  const mainMoves = (content.instructionalMoves || []).filter(
    (move) => move.type !== "complete" && !move.progressOptional
  );
  const required = Math.max(mainMoves.length, 1);
  const completed = mainMoves.filter((move) =>
    state.completedMoveIds?.includes(move.id)
  ).length;

  return Math.min(99, Math.round((completed / required) * 100));
}
