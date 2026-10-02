import { advanceUnscoredMove, recordAttempt, resolveNextMoveId, updateLearningExperience, markLearningMilestones } from './learningEngine.js';

export function evaluateTeachingChoice(move, learnerResponse) {
 if (move.interaction?.type === 'reasoning') {
  const task=move.interaction;
  const claim=task.claims.find(item=>item.id===learnerResponse?.claimId);
  const reason=task.reasons.find(item=>item.id===learnerResponse?.reasonId);
  const correctClaim=claim?.id===task.answer.claim;
  const correctReason=reason?.id===task.answer.reason;
  const strong=Boolean(claim && reason && correctClaim && correctReason);
  return {verdict:strong?'strong':'weak',strategy:strong?'affirm_and_deepen':'clarify',source:'lesson',
   teacherMessage:strong?'Your conclusion and its supporting reason fit together. Keep that reasoning when the example changes.':correctClaim?'Your conclusion fits, but its supporting reason needs work.':correctReason?'You found relevant evidence. Reconsider the conclusion you connected to it.':'Reconsider both the conclusion and the evidence used to support it.',
   itemResults:[{id:'claim',correct:Boolean(correctClaim),message:claim?.feedback || 'Choose a conclusion.'},{id:'reason',correct:Boolean(correctReason),message:reason?.feedback || 'Choose a supporting reason.'}],
   evidenceObserved:[],misconceptionIds:[]};
 }
 if (move.interaction?.type === 'match') {
  const placements=learnerResponse?.placements || {};
  const results=move.interaction.items.map(item=>({id:item.id,correct:placements[item.id]===item.answer,message:item.explanation}));
  const strong=results.every(item=>item.correct);
  return {verdict:strong?'strong':'weak',strategy:strong?'affirm_and_deepen':'clarify',source:'lesson',
   teacherMessage:strong?'You connected every item to its evidence. Now carry the reasoning into a new situation.':'Some connections need another look. Compare the explanations below, then revise your choices.',
   itemResults:results,evidenceObserved:strong?(move.evidenceIds || []):[],misconceptionIds:[]};
 }
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
 if(content.coveredStandards && state.experience?.drafts?.[move.id]?.usedSupport && checked.verdict==='strong') {
  checked={...checked,verdict:'partial',supportedPass:true,evidenceObserved:[],teacherMessage:'Your supported explanation meets the criteria. Close the support and try again from memory in your own words to establish independent understanding.'};
 }
 let next=recordAttempt(state,move,checked);
 if(content.coveredStandards && checked.verdict==='strong' && move.evidenceIds?.length) {
  next=updateLearningExperience(next,{standardEvidence:{...(next.experience?.standardEvidence || {}),...Object.fromEntries((move.standardIds || []).map(id=>[id,{evidenceIds:move.evidenceIds,moveId:move.id,establishedAt:Date.now()}]))}});
 }
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
 const retryDraft=state.experience?.drafts?.[move.id];
 const independentRetry=content.coveredStandards && nextId===move.id && retryDraft?.usedSupport && feedback.decision.supportedPass;
 const next=updateLearningExperience({...state,currentMoveId:nextId},{teachingDecision:null,...(independentRetry?{drafts:{[move.id]:{...retryDraft,supportedResponse:retryDraft.responseText,responseText:'',usedSupport:false}}}: {})});
 return nextId==='complete'?markLearningMilestones(next,['complete']):next;
}
