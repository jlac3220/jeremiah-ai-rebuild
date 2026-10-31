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
// The score measures observed performance, while levels require the kind of
// evidence specified by the doctrinal standards. Missing optional work does
// not count as a wrong answer; coverage is reported separately.
export const OG1_ASSESSMENT_WEIGHTS=Object.freeze({guided:0.25,written:0.50,exam:0.25});
const verdictScore=verdict=>verdict==='strong'?100:verdict==='partial'?55:verdict==='weak'?15:0;
const mean=values=>values.reduce((a,b)=>a+b,0)/Math.max(1,values.length);
const rounded=value=>Math.round(value);

export function rateOG1Lesson(content,state){
 const standards=(content.coveredStandards||[]).map(s=>s.id);
 const moves=content.instructionalMoves||[];
 const history=state.teacherHistory||[];
 const exam=state.experience?.exitExam?.latest;
 const rows=standards.map(standardId=>{
  const related=moves.filter(m=>(m.standardIds||[]).includes(standardId)&&m.type!=='teach');
  const responses=related.map(move=>({move,record:history.filter(h=>h.moveId===move.id).at(-1)})).filter(x=>x.record);
  const written=responses.filter(x=>['free_response','mastery_response'].includes(x.move.type));
  const guided=responses.filter(x=>x.move.type==='scenario');
  const examResults=(exam?.results||[]).filter(x=>x.standardId===standardId);
  const correctExam=examResults.filter(x=>x.correct).length;
  const components=[
   {key:'guided',values:guided.map(x=>verdictScore(x.record.verdict))},
   {key:'written',values:written.map(x=>verdictScore(x.record.verdict))},
   {key:'exam',values:examResults.map(x=>x.correct?100:0)}
  ];
  const observed=components.filter(x=>x.values.length);
  const effectiveWeight=observed.reduce((sum,x)=>sum+OG1_ASSESSMENT_WEIGHTS[x.key],0);
  const score=effectiveWeight?rounded(observed.reduce((sum,x)=>sum+mean(x.values)*OG1_ASSESSMENT_WEIGHTS[x.key],0)/effectiveWeight):null;
  const coverage=rounded(100*(responses.length+examResults.length)/Math.max(1,related.length+2));
  const strongWritten=written.some(x=>x.record.verdict==='strong');
  const partialWritten=written.some(x=>x.record.verdict==='partial');
  const strongGuided=guided.some(x=>x.record.verdict==='strong');
  const completeRubric=Boolean(state.experience?.standardEvidence?.[standardId]?.evidenceIds?.includes(standardId+':evidence-4'));
  // Scores guide the assessment only within the level justified by task type.
  // Recognition cannot prove deep explanation; an exceptional written response
  // is required for L3, and explicit Level-4 rubric evidence for L4.
  let level=1;
  if(score!==null&&score>=55&&(strongGuided||partialWritten||strongWritten||correctExam===2))level=2;
  if(score!==null&&score>=70&&strongWritten)level=3;
  if(score!==null&&score>=85&&strongWritten&&completeRubric)level=4;
  const evidence=level===4?'Extensive written reasoning verified against the standard rubric':
   strongWritten?'Independent written explanation':partialWritten?'Developing written explanation':
   strongGuided?'Correct guided connection':correctExam?'Scripture recognition':'Limited evidence collected';
  return {standardId,level,label:OG1_RATING_LABELS[level],meaning:OG1_RATING_MEANINGS[level],
   nextStep:level===4?'Continue applying and defending this understanding with Scripture.':OG1_NEXT_STEPS[standardId]||'Explain the standard with supporting Scripture.',
   score,coverage,components:Object.fromEntries(components.map(x=>[x.key,x.values.length?rounded(mean(x.values)):null])),
   attempted:responses.length,possible:related.length,examCorrect:correctExam,examQuestions:examResults.length,evidence};
 });
 // Aggregate observed evidence by standard, not by individual question count.
 // An unassessed standard is visible but cannot artificially drop the overall
 // weighted score; limited coverage is disclosed alongside the result.
 const measured=rows.filter(x=>x.score!==null);
 const score=measured.length?rounded(mean(measured.map(x=>x.score))):null;
 const coverage=rounded(mean(rows.map(x=>x.coverage)));
 const averageLevel=measured.length?rounded(mean(measured.map(x=>x.level))):1;
 const hasAdvanced=measured.some(x=>x.level>=3);
 const allExtensive=rows.length>0&&rows.every(x=>x.level===4);
 const level=allExtensive&&score>=85?4:hasAdvanced&&score>=70?Math.min(3,averageLevel):Math.min(2,averageLevel);
 return {level,score,coverage,standards:rows,label:OG1_RATING_LABELS[level],meaning:OG1_RATING_MEANINGS[level],
  note:'Weighted evidence: 50% independent explanation, 25% guided work, 25% exam when all three are available. Missing work is not counted as incorrect; coverage is shown separately. A high score alone cannot establish Level 3 or 4.'};
}
