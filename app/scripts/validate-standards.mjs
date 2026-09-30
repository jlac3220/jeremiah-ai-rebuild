import { classroomContentRegistry } from "../src/core/classroom/content/classroomContentRegistry.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateStandard(standard) {
  assert(standard.standardId, "standardId is required");
  assert(standard.brain?.masteryTarget, `${standard.standardId}: masteryTarget is required`);
  assert(standard.brain?.requiredKnowledge?.length, `${standard.standardId}: requiredKnowledge is required`);
  assert(standard.brain?.requiredScripture?.length, `${standard.standardId}: requiredScripture is required`);
  assert(standard.instructionalMoves?.length, `${standard.standardId}: instructionalMoves are required`);

  const encounterSources = (standard.instructionalMoves || [])
    .filter((move) => move.type === "encounter")
    .flatMap((move) => move.encounter?.curatedSources || []);

  const encountersWithSources = (standard.instructionalMoves || []).filter(
    (move) => move.type === "encounter" && (move.encounter?.curatedSources || []).length
  );

  for (const move of encountersWithSources) {
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(move.encounter?.sourcesVerifiedAt || ""),
      `${standard.standardId}: encounter ${move.id} requires sourcesVerifiedAt (YYYY-MM-DD)`
    );
  }

  const sourceIds = encounterSources.map((source) => source.id);
  assert(
    new Set(sourceIds).size === sourceIds.length,
    `${standard.standardId}: curated source IDs must be unique`
  );

  const encounterMoves = (standard.instructionalMoves || []).filter(
    (move) => move.type === "encounter"
  );

  for (const move of encounterMoves) {
    const encounter = move.encounter || {};
    assert(
      encounter.sourceRole === "enrichment_only",
      `${standard.standardId}: encounter ${move.id} must mark external sources enrichment_only`
    );
    assert(
      encounter.primaryVerse?.reference && encounter.primaryVerse?.text,
      `${standard.standardId}: encounter ${move.id} requires a primaryVerse`
    );
    assert(
      encounter.noticePrompt,
      `${standard.standardId}: encounter ${move.id} requires a noticePrompt`
    );
    assert(
      encounter.destination,
      `${standard.standardId}: encounter ${move.id} requires a learning destination`
    );
    assert(
      move.next?.continue,
      `${standard.standardId}: encounter ${move.id} requires a continue route into instruction`
    );

    const handoffMove = (standard.instructionalMoves || []).find(
      (candidate) => candidate.id === move.next?.continue
    );
    assert(
      handoffMove?.handoff,
      `${standard.standardId}: encounter ${move.id} must flow into a teaching move with a handoff contract`
    );
    assert(
      Array.isArray(handoffMove?.teaching) && handoffMove.teaching.length > 0,
      `${standard.standardId}: handoff move ${handoffMove?.id || "missing"} must contain teaching`
    );

    const encounterSourceIds = new Set(
      (encounter.curatedSources || []).map((source) => source.id)
    );

    for (const moment of encounter.mediaMoments || []) {
      assert(
        encounterSourceIds.has(moment.sourceId),
        `${standard.standardId}: encounter ${move.id} media moment ${moment.id} references missing source ${moment.sourceId}`
      );
    }

    for (const moment of encounter.sourceMoments || []) {
      assert(
        encounterSourceIds.has(moment.sourceId),
        `${standard.standardId}: encounter ${move.id} source moment ${moment.id} references missing source ${moment.sourceId}`
      );
    }

    assert(
      !(move.evidenceIds || []).length,
      `${standard.standardId}: encounter ${move.id} cannot award mastery evidence`
    );
    assert(
      !(move.expectedChoiceIds || []).length,
      `${standard.standardId}: encounter ${move.id} cannot become an assessment gate`
    );
    assert(
      !move.strategyRoutes,
      `${standard.standardId}: encounter ${move.id} cannot control remediation or doctrinal routing`
    );
  }

  for (const source of encounterSources) {
    assert(source.id, `${standard.standardId}: curated source id is required`);
    assert(source.provider, `${standard.standardId}: source ${source.id} requires provider`);
    assert(source.title, `${standard.standardId}: source ${source.id} requires title`);
    assert(
      /^https:\/\//.test(source.url || ""),
      `${standard.standardId}: source ${source.id} requires an https URL`
    );
    assert(
      source.purpose,
      `${standard.standardId}: source ${source.id} requires a classroom purpose`
    );

    if (source.type === "video") {
      assert(
        /^https:\/\//.test(source.embedUrl || ""),
        `${standard.standardId}: video source ${source.id} requires an https embedUrl`
      );
    }

    if (source.type === "image") {
      assert(
        /^https:\/\//.test(source.imageUrl || ""),
        `${standard.standardId}: image source ${source.id} requires an https imageUrl`
      );
      assert(
        source.attribution,
        `${standard.standardId}: image source ${source.id} requires attribution`
      );
      assert(
        source.license,
        `${standard.standardId}: image source ${source.id} requires license metadata`
      );
    }
  }

  const moves = standard.instructionalMoves;
  const ids = moves.map((move) => move.id);
  assert(new Set(ids).size === ids.length, `${standard.standardId}: move IDs must be unique`);
  const idSet = new Set(ids);
  const evidenceIds = new Set(standard.brain.requiredKnowledge.map((item) => item.id));

  for (const move of moves) {
    for (const nextId of Object.values(move.next || {})) {
      assert(idSet.has(nextId), `${standard.standardId}: ${move.id} points to missing move ${nextId}`);
    }
    for (const routeId of Object.values(move.strategyRoutes || {})) {
      assert(idSet.has(routeId), `${standard.standardId}: ${move.id} has missing strategy route ${routeId}`);
    }
    for (const evidenceId of move.evidenceIds || []) {
      assert(evidenceIds.has(evidenceId), `${standard.standardId}: ${move.id} uses unknown evidence ${evidenceId}`);
    }
    const choiceIds = new Set((move.choices || []).map((choice) => choice.id));
    for (const expectedId of move.expectedChoiceIds || []) {
      assert(choiceIds.has(expectedId), `${standard.standardId}: ${move.id} expects missing choice ${expectedId}`);
    }
  }

  for (const [presetId, preset] of Object.entries(standard.presets || {})) {
    assert(idSet.has(preset.currentMoveId), `${standard.standardId}: preset ${presetId} has invalid currentMoveId`);
  }

  const complete = moves.find((move) => move.type === "complete");
  assert(complete, `${standard.standardId}: a complete move is required`);

  for (const [presetId, preset] of Object.entries(standard.presets || {})) {
    const seen = new Set();
    const queue = [preset.currentMoveId];
    let reachesComplete = false;
    while (queue.length) {
      const id = queue.shift();
      if (seen.has(id)) continue;
      seen.add(id);
      if (id === complete.id) {
        reachesComplete = true;
        break;
      }
      const move = moves.find((item) => item.id === id);
      for (const target of Object.values(move?.next || {})) queue.push(target);
    }
    assert(reachesComplete, `${standard.standardId}: preset ${presetId} cannot reach completion`);
  }

  return `${standard.standardId}: ${moves.length} instructional moves validated`;
}

for (const standard of Object.values(classroomContentRegistry)) {
  console.log(validateStandard(standard));
}
