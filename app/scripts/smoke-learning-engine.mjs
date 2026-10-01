import content from "../src/core/classroom/content/OG_1_1_18.js";
import {
  advanceEncounterMove,
  advanceLearningState,
  advanceUnscoredMove,
  createLearningState,
  getInstructionalMove,
  getStandardProgress,
} from "../src/core/classroom/learningEngine.js";
import { teachWithJeremiah } from "../server/teacherCore.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

let state = createLearningState(content, "direct");

let move = getInstructionalMove(content, state.currentMoveId);
assert(move.id === "arrival", "direct path should begin with the encounter");
state = advanceEncounterMove(state, move, {
  entryMode: "read",
  primaryPhrases: ["is one LORD"],
  bridgePhrases: ["there is no God beside me"],
  viewedSourceIds: ["nash-papyrus"],
});
assert(
  state.currentMoveId === "hear_the_shema",
  "encounter should lead into required Shema instruction"
);
assert(
  state.encounterData?.primaryPhrases?.includes("is one LORD"),
  "encounter memory should preserve the phrase the learner carried forward"
);
assert(
  state.encounterData?.viewedSourceIds?.includes("nash-papyrus"),
  "encounter memory should preserve sources the learner explored"
);

for (const expectedMoveId of [
  "hear_the_shema",
  "oneness_first",
  "isaiah_exclusion",
  "mark12_bridge",
  "synthesis",
]) {
  move = getInstructionalMove(content, state.currentMoveId);
  assert(move.id === expectedMoveId, `expected ${expectedMoveId}, got ${move.id}`);
  state = advanceUnscoredMove(state, move);
}

move = getInstructionalMove(content, state.currentMoveId);
assert(move.id === "pressure_test", "teaching sequence should lead to one pressure test");

let decision = await teachWithJeremiah({
  standardId: content.standardId,
  moveId: move.id,
  learnerResponse: { choiceIds: ["definitions-free"] },
  learnerState: state,
});
assert(decision.verdict === "weak", "wrong pressure-test answer should not pass");

state = advanceLearningState(state, move, decision);
assert(
  state.currentMoveId === "repair_foundation",
  "wrong pressure-test answer should route into reteaching"
);

move = getInstructionalMove(content, state.currentMoveId);
state = advanceUnscoredMove(state, move);
assert(
  state.currentMoveId === "pressure_test",
  "reteaching should return the learner to the pressure test"
);

move = getInstructionalMove(content, state.currentMoveId);
decision = await teachWithJeremiah({
  standardId: content.standardId,
  moveId: move.id,
  learnerResponse: { choiceIds: ["control-later"] },
  learnerState: state,
});
assert(decision.verdict === "strong", "correct pressure-test answer should pass");

state = advanceLearningState(state, move, decision);
assert(
  state.currentMoveId === "teach_it_back",
  "successful pressure test should move to teach-back"
);

const teachBack = getInstructionalMove(content, "teach_it_back");
decision = await teachWithJeremiah({
  standardId: content.standardId,
  moveId: teachBack.id,
  learnerResponse: {
    text: "God is one. Deuteronomy says the LORD our God is one LORD, and Isaiah says there is no God beside Him.",
  },
  learnerState: state,
});
assert(
  ["strong", "partial"].includes(decision.verdict),
  "teach-back should receive a meaningful verdict"
);

assert(
  getStandardProgress(content, state) > 0,
  "required teaching moves should count toward lesson progress"
);

console.log("Jeremiah learning engine smoke test passed.");
