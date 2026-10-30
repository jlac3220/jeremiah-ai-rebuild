import {useEffect,useState} from 'react';
import './JourneyDestinations.css';

// Public-domain representations of biblical figures. These are paintings,
// not photographs or assertions about the subjects' historical appearance.
// Source pages and artist details are displayed in the experience.
export const BIBLICAL_ART = {
 moses: {
  src:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg/960px-Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg',
  alt:'Rembrandt painting showing Moses holding the tablets of the Law',
  artist:'Rembrandt van Rijn',
  work:'Moses with the Tablets of the Law (1659)',
  source:'https://commons.wikimedia.org/wiki/File:Rembrandt_-_Moses_with_the_Ten_Commandments_-_Google_Art_Project.jpg',
  focal:'50% 38%',
  reference:'Deuteronomy 6:4',
  quote:'“Hear, O Israel: The LORD our God is one LORD.”'
 },
 prophets: {
  src:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Michelangelo%2C_profeti%2C_Isaiah_01.jpg/500px-Michelangelo%2C_profeti%2C_Isaiah_01.jpg',
  alt:'Michelangelo fresco portraying the prophet Isaiah holding a book',
  artist:'Michelangelo',
  work:'The Prophet Isaiah (1509)',
  source:'https://commons.wikimedia.org/wiki/File:Michelangelo,_profeti,_Isaiah_01.jpg',
  focal:'50% 32%',
  reference:'Isaiah 44:6',
  quote:'“I am the first, and I am the last; and beside me there is no God.”'
 },
 jesus: {
  src:'https://upload.wikimedia.org/wikipedia/commons/2/27/Brooklyn_Museum_-_The_Scribe_Stood_to_Tempt_Jesus_%28Le_scribe_se_leva_pour_tenter_J%C3%A9sus%29_-_James_Tissot_-_overall.jpg',
  alt:'James Tissot watercolor showing Jesus speaking with a scribe and a gathered crowd',
  artist:'James Tissot',
  work:'The Scribe Stood to Tempt Jesus (1886–1894)',
  source:'https://commons.wikimedia.org/wiki/File:Brooklyn_Museum_-_The_Scribe_Stood_to_Tempt_Jesus_(Le_scribe_se_leva_pour_tenter_J%C3%A9sus)_-_James_Tissot_-_overall.jpg',
  focal:'42% 44%',
  reference:'Mark 12:29',
  quote:'“The Lord our God is one Lord.”'
 },
 apostles: {
  src:'https://upload.wikimedia.org/wikipedia/commons/2/27/Jan_Lievens_-_St._Paul_writing_to_the_Thessalonians.jpg',
  alt:'Jan Lievens painting portraying the apostle Paul writing a letter at his desk',
  artist:'Jan Lievens',
  work:'St Paul Writing to the Thessalonians (c. 1629)',
  source:'https://commons.wikimedia.org/wiki/File:Jan_Lievens_-_St._Paul_writing_to_the_Thessalonians.jpg',
  focal:'50% 34%',
  reference:'1 Corinthians 8:4',
  quote:'“There is none other God but one.”'
 }
};

const STOPS = [
 {title:'Moses',name:'MOSES',era:'THE FOUNDATION',place:'ISRAEL · DEUTERONOMY 6',tone:'moses',narration:'Hear, O Israel: The LORD our God is one LORD. Moses gives the confession to Israel.'},
 {title:'Isaiah',name:'ISAIAH',era:'THE PROPHETIC WITNESS',place:'ISAIAH · THE LORD ALONE',tone:'prophets',narration:'I am the first, and I am the last; and beside me there is no God. Isaiah, chapter forty four, verse six.'},
 {title:'Jesus',name:'JESUS',era:'THE REAFFIRMATION',place:'JESUS · MARK 12:29',tone:'jesus',narration:'Hear, O Israel; The Lord our God is one Lord. Mark chapter twelve, verse twenty-nine.'},
 {title:'The Apostles',name:'PAUL',era:'THE CONTINUATION',place:'PAUL · THE EARLY CHURCH',tone:'apostles',narration:'There is none other God but one. First Corinthians, chapter eight, verse four.'}
];

export function DestinationArt({tone}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[tone]);
 const art=BIBLICAL_ART[tone]||BIBLICAL_ART.moses;
 return <span className={'ogj-art ogj-art--'+tone} role="img" aria-label={art.alt}>
  {!failed&&<img key={tone} className="ogj-photo" src={art.src} alt="" loading="lazy" decoding="async" style={{objectPosition:art.focal}} onError={()=>setFailed(true)}/>}
  <span aria-hidden="true" className="ogj-fallback">{tone==='moses'?'מֹשֶׁה':tone==='prophets'?'יְשַׁעְיָהוּ':tone==='jesus'?'ΙΗΣΟΥΣ':'ΠΑΥΛΟΣ'}</span>
 </span>;
}

export default function JourneyDestinations({options,selected,onSelect,onSpeak,onOpenBible}) {
 const stop=selected===null?null:STOPS[selected];
 const art=stop?BIBLICAL_ART[stop.tone]:null;
 return <div className="ogj-journey">
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
     <p>{options[selected][1]}</p>
     <small>Artwork: {art.work} — {art.artist}. Artistic depiction, not a historical photograph.</small>
    </div>
    <div className="ogj-reveal-actions">
     <button type="button" onClick={()=>onSpeak?.(stop.narration)}>▶ Hear Scripture</button>
     {onOpenBible&&<button type="button" className="ogj-read-link" onClick={()=>onOpenBible(art.reference)}>Read in Bible ↗</button>}
    </div>
   </div>}
 </div>;
}
