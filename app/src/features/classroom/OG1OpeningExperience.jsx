import {useState} from 'react';
import {BIBLICAL_ART} from '../../data/curriculum/visualCatalog';
import {DestinationArt} from './JourneyDestinations';
import './OG1OpeningExperience.css';

const WITNESSES = [
 {name:'Moses',tone:'moses',moment:'THE CONFESSION'},
 {name:'Isaiah',tone:'prophets',moment:'THE PROPHETS'},
 {name:'Jesus',tone:'jesus',moment:'THE REAFFIRMATION'},
 {name:'Paul',tone:'apostles',moment:'THE CHURCH'}
];

export default function OG1OpeningExperience({content,move,options,onOpenBible}) {
 const [selected,setSelected]=useState(0);
 const witness=WITNESSES[selected],art=BIBLICAL_ART[witness.tone];
 return <article className="ogp-opening" aria-label="The one LORD across four biblical witnesses">
  <div className="ogp-opening-hero">
   <div className="ogp-opening-scene" aria-hidden="true"><DestinationArt tone="shema-encounter" content={content} move={move}/><span className="ogp-opening-scene-shade"/></div>
   <div className="ogp-opening-hero-copy">
    <span className="ogp-opening-eyebrow">THE ONE TRUE GOD · OUR FIRST QUESTION</span>
    <h2>One LORD.<br/><em>One unfolding story.</em></h2>
    <blockquote>“Hear, O Israel: The LORD our God is <strong>one LORD:</strong>”</blockquote>
    <span className="ogp-opening-verse">DEUTERONOMY 6:4 · KJV</span>
    <p>You will discover what this confession means, how Isaiah and the New Testament carry it forward, and why it matters.</p>
   </div>
  </div>
  <section className="ogp-opening-explore" aria-label="Preview the witnesses ahead">
   <header><span>TOUCH A WITNESS</span><h3>Four voices. Discover the connection.</h3></header>
   <div className="ogp-opening-witnesses" role="group" aria-label="Choose a biblical witness">
    {WITNESSES.map((item,index)=><button type="button" key={item.name} aria-pressed={selected===index} onClick={()=>setSelected(index)}>
     <span className="ogp-opening-witness-count">{String(index+1).padStart(2,'0')}</span><strong>{item.name}</strong>
    </button>)}
   </div>
   <div className="ogp-opening-answer" aria-live="polite" aria-atomic="true">
    <div className="ogp-opening-answer-art" aria-hidden="true"><DestinationArt tone={witness.tone} content={content} move={move}/></div>
    <div className="ogp-opening-answer-copy">
     <span>{witness.moment} · {art.reference.toUpperCase()}</span>
     <blockquote>{art.quote}</blockquote>
     <p>{options[selected]?.[1]||''}</p>
     <button type="button" onClick={()=>onOpenBible?.(art.reference)}>Read {art.reference} in context <span aria-hidden="true">↗</span></button>
    </div>
   </div>
   <p className="ogp-opening-next">This is a preview. You'll examine the Scripture behind each witness in the lesson itself.</p>
  </section>
 </article>;
}
