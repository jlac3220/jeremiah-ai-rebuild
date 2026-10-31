// Evidence of Learning ratings follow the four performance bands in the
// doctrinal standards. This is an instructional estimate, not certification.
export const OG1_RATING_LABELS={1:'Minimal Understanding',2:'Approaching Understanding',3:'Comprehensive Understanding',4:'Extensive Understanding'};

export const OG1_RATING_MEANINGS=Object.freeze({
 1:'You recognize some important Scriptures and concepts, but have not yet demonstrated a clear understanding of their meaning.',
 2:'You understand basic concepts and can connect some teachings to Scripture, but your explanations are still developing.',
 3:'You can explain the doctrine clearly, support your understanding with Scripture, and connect related biblical teachings.',
 4:'You demonstrate advanced understanding by connecting multiple Scriptures, evaluating interpretations, and defending conclusions with biblical evidence.'
});
const OG1_NEXT_STEPS=Object.freeze({
 'OG.1.1.18':'Explain how Deuteronomy 6:4–5, Isaiah 44:6, and Mark 12:29 contribute to the confession of one LORD.',
 'OG.1.2.18':'Explain how Isaiah 43:10, 44:6, and 45:5 together establish God’s exclusive identity.',
 'OG.1.3.18':'Connect Deuteronomy 6:4, Mark 12:29, and 1 Corinthians 8:4–6 in one supported explanation.',
 'OG.1.4.18':'Explain both the classical Trinitarian and Apostolic Oneness interpretations accurately, then support the Apostolic position with Scripture.',
 'OG.1.5.18':'Explain how Deuteronomy 6:4–5 connects knowing the one LORD with exclusive worship and undivided devotion.'
});
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
  return {standardId,level,label:OG1_RATING_LABELS[level],meaning:OG1_RATING_MEANINGS[level],
   nextStep:level===4?'Continue applying and defending this understanding with Scripture.':OG1_NEXT_STEPS[standardId]||'Explain the standard with supporting Scripture.',
   attempted:responses.length,possible:related.length,
   examCorrect:correctExam,examQuestions:(exam?.results||[]).filter(x=>x.standardId===standardId).length,
   evidence:level===4?'Written explanation verified against all rubric evidence':strongWritten?'Independent written explanation':partialWritten?'Developing written explanation':strongScenario?'Correct guided connection':correctExam?'Scripture recognition':'Limited evidence collected'};
 });
 return {level:rows.length?Math.min(...rows.map(x=>x.level)):1,
  standards:rows,label:OG1_RATING_LABELS[rows.length?Math.min(...rows.map(x=>x.level)):1],
  meaning:OG1_RATING_MEANINGS[rows.length?Math.min(...rows.map(x=>x.level)):1],
  note:'A provisional assessment of demonstrated evidence. Level 4 requires synthesis and evaluation verified against the standard’s extensive-understanding criteria.'};
}
