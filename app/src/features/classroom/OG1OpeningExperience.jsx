import {useState} from 'react';
import {BIBLICAL_ART} from '../../data/curriculum/visualCatalog';
import {DestinationArt} from './JourneyDestinations';
import LessonIcon from '../../shared/lesson/LessonIcon';
import './OG1OpeningExperience.css';

// These are the existing four witness explanations, not new assessment criteria.
const WITNESSES=[
 {name:'Moses',tone:'moses',question:'Where does the confession begin?',commentary:'Moses calls Israel to hear and respond to the LORD as their one God. The confession is a call to covenant faithfulness.'},
 {name:'Isaiah',tone:'prophets',question:'Can another god stand beside the LORD?',commentary:'Isaiah declares that the LORD has no rival before, beside, or after him. His words make the confession unmistakably exclusive.'},
 {name:'Jesus',tone:'jesus',question:'Does Jesus replace Israel’s confession?',commentary:'When asked about the first commandment, Jesus begins with Israel’s confession. He affirms the one LORD and the call to love him.'},
 {name:'Paul',tone:'apostles',question:'What does the confession mean in a world of idols?',commentary:'Paul brings the same confession into the setting of idol worship. The early church continues to proclaim that there is no other God but one.'}
];

export default function OG1OpeningExperience({content,move,onOpenBible,onContinue,onWitnessChange}) {
 const [selected,setSelected]=useState(0);
 const [viewed,setViewed]=useState([0]);
 const nextUnseen=WITNESSES.findIndex((_,i)=>!viewed.includes(i));
 const witness=WITNESSES[selected],art=BIBLICAL_ART[witness.tone];
 function choose(index){setSelected(index);setViewed(old=>old.includes(index)?old:[...old,index]);onWitnessChange?.(index);}
 function next(){if(nextUnseen<0)onContinue();else choose(nextUnseen);}
 function keydown(event){
  const targets={ArrowLeft:(selected+3)%4,ArrowRight:(selected+1)%4,Home:0,End:3};
  if(!(event.key in targets))return;
  event.preventDefault();const index=targets[event.key];
  event.currentTarget.parentElement.querySelectorAll('button')[index].focus();choose(index);
 }
 return <article className="ogp-encounter og1-opening" data-witness={witness.name} aria-label="One confession across four witnesses">
  <div className="og1-opening-scene">
   <div className="og1-opening-art" aria-hidden="true"><DestinationArt key={witness.tone} tone={witness.tone} content={content} move={move}/></div>
   <div className="og1-opening-shade" aria-hidden="true"/>
   <button type="button" className="og1-opening-reference" onClick={()=>onOpenBible(art.reference)} aria-label={'Read '+art.reference+' in context'}>{art.reference.toUpperCase()} · KJV <LessonIcon name="context"/></button>
   <div className="og1-opening-scripture" key={witness.name}><span>THE WITNESS · {witness.name.toUpperCase()}</span><blockquote>{art.quote}</blockquote></div>
  </div>
  <section className="og1-opening-interaction">
   <header><h2>One confession. Four witnesses.</h2><p>Tap a witness—or follow with the blue button.</p></header>
   <div className="og1-opening-choices" role="group" aria-label="Choose a biblical witness">
    {WITNESSES.map((item,i)=><button type="button" key={item.name} className={viewed.length===1&&i===nextUnseen?'is-suggested':''} aria-pressed={selected===i} aria-controls="og1-opening-explanation" onClick={()=>choose(i)} onKeyDown={keydown}>
     <span className="og1-opening-portrait" aria-hidden="true"><DestinationArt tone={item.tone} content={content} move={move}/></span>
     <strong>{item.name}</strong><small>{selected===i?'On screen':viewed.includes(i)?'Viewed':i===nextUnseen?'Up next':'Explore'}</small>
    </button>)}
   </div>
   <div id="og1-opening-explanation" className="og1-opening-explanation" key={witness.name} aria-live="polite" aria-atomic="true">
    <h3>{witness.question}</h3>
    <div className="og1-opening-establishes"><strong>What this establishes</strong><p>{witness.commentary}</p></div>
   </div>
   <footer className="og1-opening-footer">
    <span className="og1-opening-status" role="status">{viewed.length} of 4 witnesses viewed</span><small>Preview, not an assessment.</small>
    <nav className="ogp-controls" aria-label="Lesson moment navigation"><button type="button" className="ogp-action" onClick={next}>{nextUnseen<0?'Begin Chapter 1 · The Shema':`Meet ${WITNESSES[nextUnseen].name} · ${viewed.length+1} of 4`} <span aria-hidden="true">→</span></button></nav>
    {nextUnseen>=0&&<button className="og1-opening-skip" type="button" onClick={onContinue}>Skip preview · Begin Chapter 1</button>}
   </footer>
  </section>
 </article>;
}
