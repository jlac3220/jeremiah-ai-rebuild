// Standards are the curriculum authority. Authored art and pacing are never authority.
// If the approved source changes, compile teaching and assessment from the new text
// and mark the regenerated experience for editorial review before public release.
export const APPROVED_OG1_SIGNATURES = Object.freeze({
  "OG.1.1.18": "0964e424",
  "OG.1.2.18": "9e65f216",
  "OG.1.3.18": "a6c1d023",
  "OG.1.4.18": "8c67c447",
  "OG.1.5.18": "565bf5bf"
});

export function standardSignature(standard,domain) {
 const data=JSON.stringify({id:standard.id,title:standard.title,statement:standard.statement,
  scope:standard.scope,focus:standard.focus,evidence:standard.evidence,
  domain:{title:domain.title,anchor:domain.anchor,scripture:domain.scripture,vocabulary:domain.vocabulary}});
 let hash=2166136261;
 for(let i=0;i<data.length;i++) hash=Math.imul(hash ^ data.charCodeAt(i),16777619)>>>0;
 return hash.toString(16).padStart(8,'0');
}

export function getStandardsPlan(standards,domain) {
 return standards.map(standard=>({
  standardId:standard.id, title:standard.title, statement:standard.statement,
  scope:standard.scope, teachingFocus:standard.focus,
  objectives:standard.evidence.map(item=>({level:item.level,label:item.label,objective:item.text})),
  masteryCriteria:standard.evidence.map(item=>({id:standard.id+':evidence-'+item.level,level:item.level,criterion:item.text})),
  anchor:domain.anchor, sources:domain.scripture, revision:standardSignature(standard,domain),
  needsLessonUpdate:APPROVED_OG1_SIGNATURES[standard.id]!==standardSignature(standard,domain)
 }));
}
const safeText=v=>String(v||'').trim();
function chapterScripture(domain,standard,index) {
 // No fabricated verses. Chapter one introduces the domain's anchor;
 // subsequent generated chapters use a distinct reference if available.
 const all=domain.scripture||[];
 const first=all[index]||all[0];
 return first?[{reference:first.reference,text:first.excerpt,note:first.function}]:[];
}
export function compileUpdatedStandardsLesson({base,standards,domain,standardId='OG.1.LESSON.18'}) {
 if(!standards.length)throw new Error('Cannot generate a lesson without standards.');
 const plan=getStandardsPlan(standards,domain);
 const moves=[];
 for(const [index,standard] of standards.entries()){
  if(!standard.statement || !standard.scope || !standard.focus || !standard.evidence?.length)throw new Error('Incomplete approved standard: '+standard.id);
  const id='source-'+standard.id.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase();
  const following=standards[index+1]?'source-'+standards[index+1].id.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase()+'-show':'complete';
  const scripture=chapterScripture(domain,standard,index);
  moves.push({
   id:id+'-show',type:'teach',stageId:'truth',phase:'Show me',standardIds:[standard.id],
   title:standard.title,
   teaching:[safeText(standard.scope),safeText(standard.focus)],
   scripture, next:{continue:id+'-guide'}, sourceRevision:plan[index].revision
  });
  const other=standards.filter(s=>s.id!==standard.id).slice(0,2);
  const choices=[{id:'target',label:standard.statement,
   teachingMessage:'This is the exact approved learning statement. The next step is to explain it, not simply recognize it.'},
   ...other.map((s,i)=>({id:'other-'+i,label:s.statement,
    teachingMessage:'That is a different approved standard. Return to the objective being studied here.'}))];
  moves.push({
   id:id+'-guide',type:'scenario',stageId:'checkpoint',phase:'Guide me',
   standardIds:[standard.id],title:'Identify the learning objective',
   teaching:['The standard is the target. Choose the approved objective for this chapter.'],
   prompt:'Which statement defines exactly what you are learning in this chapter?',
   choices,expectedChoiceIds:['target'],authoredFeedback:true,evidenceIds:[],
   next:{strong:id+'-try',partial:id+'-guide',weak:id+'-guide'},sourceRevision:plan[index].revision
  });
  moves.push({
   id:id+'-try',type:'free_response',stageId:'checkpoint',phase:'Let me try',
   standardIds:[standard.id],title:'Demonstrate the standard',
   prompt:standard.statement+' Explain your answer with Scripture and demonstrate these four requirements: '+
    standard.evidence.map(item=>item.label+': '+item.text).join(' '),
   teaching:[safeText(standard.focus)],
   scripture,assessmentCriteria:standard.evidence.map(e=>e.text),
   evidenceIds:standard.evidence.map(e=>standard.id+':evidence-'+e.level),
   next:{strong:following,partial:id+'-try',weak:id+'-try'},sourceRevision:plan[index].revision
  });
 }
 moves.push({id:'complete',type:'complete',stageId:'mastery',title:'Standards demonstrated.'});
 const first=moves[0].id;
 const presets=Object.fromEntries(['direct','resume','review','adaptation'].map(id=>[id,{...base.presets?.[id],currentMoveId:first,currentStageId:'truth'}]));
 const knowledge=plan.flatMap(p=>p.masteryCriteria.map(e=>({id:e.id,title:p.title+' — '+e.level,description:e.criterion})));
 return {...base,standardId,standardTitle:domain.title,studyId:base.studyId||'OG',
  lessonFormat:'teacher-led',isStandardsGenerated:true,
  editorialStatus:'needs_review',sourceRevision:plan.map(p=>p.revision).join('-'),
  sourceAlignment:plan,coveredStandards:standards,
  lessonChapters:standards.map((s,i)=>({standardId:s.id,title:s.title,question:s.statement,anchor:domain.anchor})),
  instructionalMoves:moves,presets,
  curriculumVersion:2, // archived earlier attempts remain available; new evidence must be established.
  sourceDomain:domain,
  brain:{...base.brain,essentialQuestion:domain.anchor,
   masteryTarget:standards.map(s=>s.statement).join('\n'),
   requiredKnowledge:knowledge,evidenceOfUnderstanding:knowledge,
   requiredScripture:(domain.scripture||[]).map(v=>({reference:v.reference,text:v.excerpt,note:v.function})),
   teacherGuardrails:[...(base.brain?.teacherGuardrails||[]),
    'Teach and assess only the current approved standard. Do not add unrelated scenarios.',
    'Use the four source evidence criteria; a change to the source standard requires fresh mastery.']
  }};
}
export function alignAuthoredOrRegenerate({authored,base,standards,domain}) {
 const plan=getStandardsPlan(standards,domain);
 const hasChange=plan.length!==5 || plan.some(s=>s.needsLessonUpdate);
 if(hasChange)return compileUpdatedStandardsLesson({base,standards,domain,standardId:authored.standardId});
 return {...authored,sourceRevision:plan.map(s=>s.revision).join('-'),
  sourceAlignment:plan,editorialStatus:'approved_source',isStandardsGenerated:false};
}
