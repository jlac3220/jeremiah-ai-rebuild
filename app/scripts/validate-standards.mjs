import content from "../src/core/classroom/content/OG_1_1_18.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateStandard(standard) {
  assert(standard.standardId, "standardId is required");
  assert(standard.brain?.masteryTarget, `${standard.standardId}: masteryTarget is required`);
  assert(standard.brain?.requiredKnowledge?.length, `${standard.standardId}: requiredKnowledge is required`);
  assert(standard.brain?.requiredScripture?.length, `${standard.standardId}: requiredScripture is required`);
  assert(standard.instructionalMoves?.length, `${standard.standardId}: instructionalMoves are required`);

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

console.log(validateStandard(content));
