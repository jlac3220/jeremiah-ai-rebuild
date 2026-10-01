import { getTeachingPlan } from '../../data/curriculum/teachingPlans';
import { getLessonExperience } from '../../core/classroom/content/lessonExperience';
export default function GuidedWitnesses({ content, state, onProgress, onOpen, mode='read' }) {
 const { witnesses }=getLessonExperience(content);
 const plan=getTeachingPlan(content);
 const selections=state.experience?.selections || {};
 const active=Math.min(Number(selections.witnessIndex)||0,witnesses.length-1);
 const verse=witnesses[active];
 function choose(index){onProgress({selections:{...selections,witnessIndex:index},milestoneIds:['started']});}
 return <section className="cl-guided">
   <h2>{mode==='connect'?'Bring the witnesses together':plan.opening}</h2>
   <p className="cl-prose">{mode==='connect'?plan.connection:plan.encounter}</p>
   <p className="ld-eyebrow">{mode==='connect'?'Trace the truth':'Listen to the text'} · {active+1} of {witnesses.length}</p>
   <div className="cl-witness-tabs" role="group" aria-label="Scripture witnesses">{witnesses.map((v,i)=><button type="button" key={v.reference} aria-pressed={active===i} onClick={()=>choose(i)}>{v.reference}</button>)}</div>
   <blockquote>{verse.excerpt}</blockquote>
   <button type="button" className="cl-read-passage" onClick={()=>onOpen(verse)}>Read {verse.reference} in context →</button>
   <div className="cl-guided-teaching"><span className="ld-eyebrow">{mode==='connect'?'The connection':'What this establishes'}</span><p>{verse.function}</p></div>
   {mode==='connect' && <div className="cl-connection"><span>Scripture</span><strong>{verse.reference}</strong><span>establishes</span><p>{content.standardTitle}</p><span>Learn to explain</span><p>{content.sourceStandard.evidence.find(e=>e.level===2).text}</p></div>}
   {active<witnesses.length-1 && <button type="button" className="ld-link" onClick={()=>choose(active+1)}>Follow the next witness →</button>}
 </section>;
}
