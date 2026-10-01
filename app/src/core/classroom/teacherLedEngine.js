import { advanceUnscoredMove, recordAttempt, resolveNextMoveId, updateLearningExperience, markLearningMilestones } from './learningEngine.js';

export function evaluateTeachingChoice(move, learnerResponse) {
 if (!move.authoredFeedback) return null;
 const selected=learnerResponse?.choiceIds || [];
 const choice=selected.length===1 ? move.choices.find(c=>c.id===selected[0]) : null;
 const strong=Boolean(choice && move.expectedChoiceIds.length===1 && move.expectedChoiceIds[0]===choice.id);
 return {
  verdict:strong?'strong':'weak', strategy:strong?'affirm_and_deepen':'clarify',
  teacherMessage:choice?.teachingMessage || 'Choose one explanation so we can work through your reasoning.',
  followUpPrompt:strong?'':(move.next.weak===move.id?'Use the explanation above to reconsider the situation.':'Let’s approach the distinction through a different example.'),
  evidenceObserved:strong?(move.evidenceIds || []):[],misconceptionIds:[],source:'lesson',
 };
}

export function saveTeachingDecision(state, content, move, decision) {
 if (state.currentMoveId!==move.id || state.experience?.teachingDecision?.moveId===move.id) return state;
 // A reported strong answer without rubric evidence cannot mark a written task mastered.
 let checked=decision;
 if (!['strong','partial','weak'].includes(decision?.verdict) || typeof decision?.teacherMessage!=='string' || !decision.teacherMessage.trim()) {
  checked={verdict:'partial',strategy:'encourage_retry',source:'fallback',teacherMessage:'Your explanation is saved, but the assessment response was incomplete. Please try again.',evidenceObserved:[],misconceptionIds:[]};
 }

 if (['free_response','mastery_response'].includes(move.type) && checked.verdict==='strong' && !(move.evidenceIds || []).every(id=>checked.evidenceObserved?.includes(id))) {
  checked={...checked,verdict:'partial',teacherMessage:'Your answer is saved, but the assessment did not establish every part of this task. Review the question and develop the missing reasoning.',evidenceObserved:[]};
 }
 let next=recordAttempt(state,move,checked);
 if(checked.verdict==='strong' && move.scripture?.length) next=markLearningMilestones(next,['scripture']);
 return updateLearningExperience(next,{teachingDecision:{moveId:move.id,decision:checked}});
}

export function continueTeaching(state, content) {
 const move=content.instructionalMoves.find(m=>m.id===state.currentMoveId);
 if(!move) return state;
 if(move.type==='teach') return advanceUnscoredMove(state,move);
 const feedback=state.experience?.teachingDecision;
 if(!feedback || feedback.moveId!==move.id) return state;
 const nextId=resolveNextMoveId(move,feedback.decision.verdict,feedback.decision.strategy);
 const next=updateLearningExperience({...state,currentMoveId:nextId},{teachingDecision:null});
 return nextId==='complete'?markLearningMilestones(next,['complete']):next;
}
