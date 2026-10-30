import {useEffect,useState} from 'react';
import './JourneyDestinations.css';

// Purpose-led image library for modern OG.1 teaching.
// Each scene is a contemporary photograph of a setting or illustrative activity,
// NOT a portrait of a biblical figure or an original ancient artifact.
// Original artifacts (such as the Nash Papyrus) appear separately with provenance.
// Different lesson contexts use different scenes to avoid repeating the same image.
const photo = (id, alt, credit, reference, quote, focal='center') => ({
 src:`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
 alt,artist:credit,work:'Context photography',source:`https://www.pexels.com/photo/${id}/`,
 focal,reference,quote,
});
const SHEMA_QUOTE='“Hear, O Israel: The LORD our God is one LORD.”';
const ISAIAH_QUOTE='“I am the first, and I am the last; and beside me there is no God.”';
const JESUS_QUOTE='“The Lord our God is one Lord.”';
const PAUL_QUOTE='“There is none other God but one.”';

export const BIBLICAL_ART = Object.freeze({
 shema: photo(28086996, 'Sunset over the mountains and desert in Wadi Rum, Jordan', 'Nikola Čedíková · Pexels', 'Deuteronomy 6:4', SHEMA_QUOTE, '50% 38%'),
 moses: photo(32279575, 'Person in traditional Middle Eastern attire seen in a desert setting; contextual modern photograph, not Moses', 'Dajana Reçi · Pexels', 'Deuteronomy 6:4', SHEMA_QUOTE, '50% 40%'),
 prophets: photo(7386039, 'Photographed decorative parchment inscriptions; illustrative setting, not an authentic Isaiah manuscript', 'Photography Maghradze PH · Pexels', 'Isaiah 44:6', ISAIAH_QUOTE, '50% 47%'),
 jesus: photo(17690070, 'Historic stone street in present-day Jerusalem; contextual photograph, not a depiction of Jesus', 'Thắng-Nhật Trần · Pexels', 'Mark 12:29', JESUS_QUOTE, '50% 37%'),
 apostles: photo(1650203, 'Close-up of a person writing with a quill; modern re-creation of writing, not the apostle Paul', 'Vika Glitter · Pexels', '1 Corinthians 8:4', PAUL_QUOTE, '50% 45%'),
 'moses-reading': photo(28718329, 'Desert dunes under warm sunlight, illustrating the landscape of a wilderness journey', 'Eslam Mohammed Abdelmaksoud · Pexels', 'Deuteronomy 6:4', SHEMA_QUOTE),
 'prophets-reading': photo(12187158, 'Rugged desert path at sunset, landscape contextualizing the biblical world', 'Raziuddin Farooqi · Pexels', 'Isaiah 44:6', ISAIAH_QUOTE),
 'jesus-reading': photo(1659291, 'Stone architecture in present-day Jerusalem, contextual background for the Gospel scene', 'BECCA SIEGEL · Pexels', 'Mark 12:29', JESUS_QUOTE),
 'apostles-reading': photo(36516078, 'Warmly lit writing desk and papers, a modern re-creation of historical correspondence', 'Muhtelifane · Pexels', '1 Corinthians 8:4', PAUL_QUOTE),
 'moses-trail': photo(11042744, 'Camels in the rocky desert in Jordan at sunset, contextual landscape', 'Elias Strale · Pexels', 'Deuteronomy 6:4', SHEMA_QUOTE),
 'jesus-trail': photo(18717576, 'Roman-era stone columns at Jerash, Jordan, contextual architecture of the ancient region', 'AXP Photography · Pexels', 'Mark 12:29', JESUS_QUOTE),
 'apostles-trail': photo(6980533, 'Person writing by hand on parchment-like paper; illustrative correspondence', 'KoolShooters · Pexels', '1 Corinthians 8:4', PAUL_QUOTE),
 'prophets-witness': photo(39811859, 'Desert mountains at sunset near Dahab, Egypt, landscape illustration', 'Mohamed Elshiekh · Pexels', 'Isaiah 44:6', ISAIAH_QUOTE),
 'shema-encounter': photo(2867771, 'Desert dunes at sunset, a scene evoking the ancient wilderness', 'Yasin Gündogdu · Pexels', 'Deuteronomy 6:4', SHEMA_QUOTE),
});

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
 return <span className={'ogj-art ogj-art--'+tone.replace(/[^a-z0-9-]/gi,'')} role="img" aria-label={art.alt}>
  {!failed&&<img key={tone} className="ogj-photo" src={art.src} alt="" loading="lazy" decoding="async" style={{objectPosition:art.focal}} onError={()=>setFailed(true)}/>}
  <span aria-hidden="true" className="ogj-fallback">{tone==='moses'||tone==='shema'?'מֹשֶׁה':tone==='prophets'?'יְשַׁעְיָהוּ':tone==='jesus'?'ΙΗΣΟΥΣ':'ΠΑΥΛΟΣ'}</span>
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
     <small>Visual context: {art.artist}. Modern illustrative photograph, not a portrait or eyewitness image of a biblical figure.</small>
    </div>
    <div className="ogj-reveal-actions">
     <button type="button" onClick={()=>onSpeak?.(stop.narration)}>▶ Hear Scripture</button>
     {onOpenBible&&<button type="button" className="ogj-read-link" onClick={()=>onOpenBible(art.reference)}>Read in Bible ↗</button>}
    </div>
   </div>}
 </div>;
}
