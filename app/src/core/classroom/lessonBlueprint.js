// Reusable lesson blueprint: the standard fixes what must be learned;
// the lesson author chooses suitable media, worked examples and practice.
// Progress is advisory; only scored rubric evidence establishes mastery.
export const LESSON_PHASES = Object.freeze(['Show me','Guide me','Let me try']);
export const LESSON_BLUEPRINT = Object.freeze([
  {id:'encounter',label:'Encounter',purpose:'One concrete question, scene or problem that makes the goal relevant.'},
  {id:'show',label:'Show me',purpose:'Teacher models the idea, explains Scripture in context, and checks each key claim.'},
  {id:'guide',label:'Guide me',purpose:'Learner practices with immediate, explanatory feedback and retries.'},
  {id:'try',label:'Let me try',purpose:'Learner independently applies and explains the idea against the standard rubric.'},
  {id:'feedback',label:'Feedback',purpose:'Specific next step when evidence is incomplete, or confirmation when fully demonstrated.'},
  {id:'bridge',label:'Next connection',purpose:'A short synthesis and move to the following standard.'},
]);

export function getLessonFrame(content, move, state={}) {
  const chapters=content.lessonChapters?.length
    ? content.lessonChapters
    : [{standardId:content.standardId,title:content.standardTitle,question:content.brain?.essentialQuestion||''}];
  const index=move?.type==='complete'
    ?chapters.length-1
    :Math.max(0,chapters.findIndex(ch=>move?.standardIds?.includes(ch.standardId)));
  const chapter=chapters[index];
  const phase=LESSON_PHASES.includes(move?.phase)
    ?move.phase
    :move?.type==='complete'?'Complete'
      :['scripture','sources'].includes(move?.id)?'Guide me'
      :move?.id==='learn'||move?.type==='teach'?'Show me':'Let me try';
  const completed=chapters.filter(ch=>Boolean(state.experience?.standardEvidence?.[ch.standardId])).length;
  return {
    chapter,chapterIndex:index,chapterNumber:index+1,chapterCount:chapters.length,
    phase,phaseIndex:LESSON_PHASES.indexOf(phase),
    chapters,completed,
    isComplete:move?.type==='complete'
  };
}

export function validateGroupedLessonBlueprint(content) {
  if(!content.lessonChapters?.length) return {valid:false,issues:['No authored chapter metadata']};
  const issues=[],chapters=content.lessonChapters;
  const moves=content.instructionalMoves||[];
  const ids=new Set(moves.map(m=>m.id));
  const coveredIds=(content.coveredStandards||[]).map(s=>s.id);
  if(chapters.length!==coveredIds.length)issues.push('Chapter count does not match covered standards');
  for(const chapter of chapters){
    if(!coveredIds.includes(chapter.standardId))issues.push('Unknown chapter: '+chapter.standardId);
    if(!chapter.title||!chapter.question||!chapter.anchor)issues.push('Incomplete chapter metadata: '+chapter.standardId);
    const sequence=moves.filter(m=>m.standardIds?.includes(chapter.standardId));
    for(const phase of LESSON_PHASES)if(!sequence.some(m=>m.phase===phase))issues.push(chapter.standardId+' missing '+phase);
    const steps=sequence.filter(m=>LESSON_PHASES.includes(m.phase)).map(m=>LESSON_PHASES.indexOf(m.phase));
    if(steps.some((v,i)=>i>0&&v<steps[i-1]))issues.push(chapter.standardId+' teaching phases out of order');
  }
  for(const move of moves){
    for(const next of Object.values(move.next||{}))if(!ids.has(next))issues.push(move.id+' links to missing '+next);
  }
  return {valid:issues.length===0,issues};
}
