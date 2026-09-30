import content from "../src/core/classroom/content/OG_1_1_18.js";
import {
  advanceLearningState,
  advanceUnscoredMove,
  createLearningState,
  getInstructionalMove,
} from "../src/core/classroom/learningEngine.js";
import { teachWithJeremiah } from "../server/teacherCore.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

let state = createLearningState(content, "direct");
let move = getInstructionalMove(content, state.currentMoveId);
state = advanceUnscoredMove(state, move);
assert(state.currentMoveId === "hear_the_shema", "launch should enter the Shema move");

move = getInstructionalMove(content, state.currentMoveId);
let decision = await teachWithJeremiah({
  standardId: content.standardId,
  moveId: move.id,
  learnerResponse: { choiceIds: ["hear"] },
  learnerState: state,
});
assert(decision.verdict === "weak", "wrong observation should not pass");
state = advanceLearningState(state, move, decision);
assert(state.currentMoveId === "shema_contrast", "wrong observation should branch to contrast");

move = getInstructionalMove(content, state.currentMoveId);
decision = await teachWithJeremiah({
  standardId: content.standardId,
  moveId: move.id,
  learnerResponse: { choiceIds: ["one-being"] },
  learnerState: state,
});
assert(decision.verdict === "strong", "correct remediation should pass");
state = advanceLearningState(state, move, decision);
assert(state.completedMoveIds.includes("hear_the_shema"), "remediation should satisfy the original learning target");
assert(state.currentMoveId === "say_it_plainly", "remediation should rejoin main path");

const teachBack = getInstructionalMove(content, "teach_it_back");
decision = await teachWithJeremiah({
  standardId: content.standardId,
  moveId: teachBack.id,
  learnerResponse: {
    text: "God is one, and Isaiah says there is no other God beside Him. The Shema gives the confession one LORD.",
  },
  learnerState: state,
});
assert(["strong", "partial"].includes(decision.verdict), "teach-back should receive a meaningful verdict");

console.log("Jeremiah learning engine smoke test passed.");
