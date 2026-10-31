import React from 'react';
import './JourneyDestinations.css';
import {BIBLICAL_ART,WITNESS_PLACEMENTS,VISUAL_ASSETS} from '../../data/curriculum/visualCatalog';
import {createVisualBrief,chooseLessonVisual} from '../../core/classroom/visualIntelligence';
import useDiscoveredLessonVisual from './useDiscoveredLessonVisual';
export {BIBLICAL_ART} from '../../data/curriculum/visualCatalog';

const STOPS = [
 {title:'Moses',name:'MOSES',era:'THE FOUNDATION',place:'ISRAEL · DEUTERONOMY 6',tone:'moses',commentary:'Moses calls Israel to hear and respond to the LORD as their one God. The confession is a call to covenant faithfulness.',narration:'Hear, O Israel: The LORD our God is one LORD. Deuteronomy chapter six, verse four. Moses calls Israel to hear and respond to the one LORD.'},
 {title:'Isaiah',name:'ISAIAH',era:'THE PROPHETIC WITNESS',place:'ISAIAH · THE LORD ALONE',tone:'prophets',commentary:'Isaiah declares that the LORD has no rival before, beside, or after him. His words make the confession unmistakably exclusive.',narration:'I am the first, and I am the last; and beside me there is no God. Isaiah chapter forty four, verse six. The LORD declares that no other God exists beside him.'},
 {title:'Jesus',name:'JESUS',era:'THE REAFFIRMATION',place:'JESUS · MARK 12:29',tone:'jesus',commentary:'When asked about the first commandment, Jesus begins with Israel’s confession. He affirms the one LORD and the call to love him.',narration:'Hear, O Israel; The Lord our God is one Lord. Mark chapter twelve, verse twenty-nine. Jesus reaffirms the confession when asked about the first commandment.'},
 {title:'Paul',name:'PAUL',era:'THE CONTINUATION',place:'PAUL · THE EARLY CHURCH',tone:'apostles',commentary:'Paul brings the same confession into the setting of idol worship. The early church continues to proclaim that there is no other God but one.',narration:'There is none other God but one. First Corinthians chapter eight, verse four. Paul carries the confession into his teaching about idols and the one God.'}
];

// A named teaching placement is evaluated using the same engine as all other
// classroom images. Unknown/unsupported placements intentionally show no art.
export function DestinationArt({tone,content,move,placement}) {
 const target=placement||WITNESS_PLACEMENTS[tone];
 const brief=target?createVisualBrief({content,move,placement:target}):null;
 const approved=brief?chooseLessonVisual(brief,VISUAL_ASSETS).asset:null;
 const {asset:art,onError}=useDiscoveredLessonVisual(brief,approved);
 const label=target?.subject||target?.reference||'Bible teaching';
 if(!target)return null;
 return <span className={'ogj-art ogj-art--'+String(tone||'context').replace(/[^a-z0-9-]/gi,'')}
   role="img" aria-label={art?.alt||label}>
  {art&&<img key={art.id} className="ogj-photo" src={art.src} alt=""
   loading="lazy" decoding="async" style={{objectPosition:art.focal||'50% 38%'}}
   onError={onError}/>}
  <span aria-hidden="true" className="ogj-fallback">{label}</span>
 </span>;
}

export default function JourneyDestinations({options,selected,onSelect,onSpeak,onOpenBible}) {
 const stop=selected===null?null:STOPS[selected];
 const art=stop?BIBLICAL_ART[stop.tone]:null;
 return <div className="ogj-journey" data-visual-revision="2026-10-30-curated-scenes">
  <div className="ogj-introduction"><span className="ogj-eyebrow">FOUR WITNESSES · ONE CONFESSION</span><p>Follow the confession from Moses to Isaiah, Jesus, and Paul. Choose a witness to explore the Scripture.</p></div>
  <div className="ogj-gallery" role="group" aria-label="Biblical voices">
   {STOPS.map((item,i)=><button key={item.tone} type="button" className={'ogj-destination'+(selected===i?' is-selected':'')} aria-pressed={selected===i} onClick={()=>onSelect(i)}>
    <DestinationArt tone={item.tone}/>
    <span className="ogj-card-shade" aria-hidden="true"/>
    <span className="ogj-era">{String(i+1).padStart(2,'0')} / {item.era}</span>
    <span className="ogj-card-caption"><span>{item.place}</span><strong>{item.title}</strong></span>
    <span className="ogj-card-arrow" aria-hidden="true">{selected===i?'✓':'↗'}</span>
   </button>)}
  </div>
  {stop&&<div className="ogj-reveal" aria-live="polite">
    <div className="ogj-reveal-copy">
     <span className="ogj-reveal-kicker">{stop.name} · {art.reference.toUpperCase()}</span>
     <blockquote>{art.quote}</blockquote>
     <p className="ogj-witness-commentary">{stop.commentary}</p>


    </div>
    <div className="ogj-reveal-actions">
     <button type="button" onClick={()=>onSpeak?.(stop.narration)}>▶ Hear Scripture</button>
     {onOpenBible&&<button type="button" className="ogj-read-link" onClick={()=>onOpenBible(art.reference)}>Read in Bible ↗</button>}
    </div>
   </div>}
 </div>;
}
