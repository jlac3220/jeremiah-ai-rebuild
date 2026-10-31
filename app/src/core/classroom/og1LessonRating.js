// Evidence of Learning ratings follow the four performance bands in the
// doctrinal standards. This is an instructional estimate, not certification.
export const OG1_RATING_LABELS={1:'Minimal Understanding',2:'Approaching Understanding',3:'Comprehensive Understanding',4:'Extensive Understanding'};

export function rateOG1Lesson(content,state){
 const standards=(content.coveredStandards||[]).map(s=>s.id);
 const moves=content.instructionalMoves||[];
 const history=state.teacherHistory||[];
 const exam=state.experience?.exitExam?.latest;
 const rows=standards.map(standardId=>{
  const related=moves.filter(m=>(m.standardIds||[]).includes(standardId)&&m.type!=='teach');
  const attempts=history.filter(h=>related.some(m=>m.id===h.moveId));
  const responses=related.map(m=>({move:m,record:attempts.filter(a=>a.moveId===m.id).at(-1)})).filter(x=>x.record);
  const written=responses.filter(x=>['free_response','mastery_response'].includes(x.move.type));
  const scenario=responses.filter(x=>x.move.type==='scenario');
  const strongWritten=written.some(x=>x.record.verdict==='strong');
  const partialWritten=written.some(x=>x.record.verdict==='partial');
  const strongScenario=scenario.some(x=>x.record.verdict==='strong');
  const correctExam=(exam?.results||[]).filter(x=>x.standardId===standardId&&x.correct).length;
  // Recognition alone is never credited as comprehensive or extensive.
  // A strong written response can demonstrate Level 3. Level 4 requires written evidence explicitly verified against the
  // standard's Level-4 rubric. Mere success on a selection task is insufficient.
  const levelFourId=standardId+':evidence-4';
  const completeRubric=Boolean(state.experience?.standardEvidence?.[standardId]?.evidenceIds?.includes(levelFourId));
  const level=strongWritten&&completeRubric?4:strongWritten?3:(partialWritten||strongScenario||correctExam>=2)?2:1;
  return {standardId,level,label:OG1_RATING_LABELS[level],
   attempted:responses.length,possible:related.length,
   examCorrect:correctExam,examQuestions:(exam?.results||[]).filter(x=>x.standardId===standardId).length,
   evidence:level===4?'Written explanation verified against all rubric evidence':strongWritten?'Independent written explanation':partialWritten?'Developing written explanation':strongScenario?'Correct guided connection':correctExam?'Scripture recognition':'Limited evidence collected'};
 });
 return {level:rows.length?Math.min(...rows.map(x=>x.level)):1,
  standards:rows,label:OG1_RATING_LABELS[rows.length?Math.min(...rows.map(x=>x.level)):1],
  note:'A provisional assessment of demonstrated evidence. Level 4 requires synthesis and evaluation verified against the standard’s extensive-understanding criteria.'};
}
