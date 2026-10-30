import {useEffect,useState} from 'react';
import './JourneyDestinations.css';

// The artwork on these four witness cards must depict the named biblical person
// in a relevant scene. Images are *modern artistic interpretations* — not photographs
// of the historical individuals. Verify image reuse/hosting rights before release.
// The separate Nash Papyrus section is the authenticated ancient artifact.
const illustrated = (src,alt,artist,source,reference,quote,focal='50% 38%')=>({
 src,alt,artist,work:'Modern illustrative reconstruction',source,focal,reference,quote
});
const SHEMA='“Hear, O Israel: The LORD our God is one LORD.”';
const ISAIAH='“I am the first, and I am the last; and beside me there is no God.”';
const JESUS='“The Lord our God is one Lord.”';
const PAUL='“There is none other God but one.”';
export const BIBLICAL_ART = Object.freeze({
 shema: illustrated('https://cdn.prod.website-files.com/68864d00ea8f52f9e4d32cc2/69b0ad30a333e0c7acbccba5_Vayakhel%20Part%20I.webp','Modern illustration of Moses addressing the gathered Israelites in a wilderness encampment','Mitzvah Minute','https://www.mitzvah-minute.com/divrei-torah/vayakhel----part-i----vay-aq-hel-mosheh-reassembling-a-broken-nation---1-2----the-nation-after-the-golden-calf','Deuteronomy 6:4',SHEMA),
 moses: illustrated('https://cdn.prod.website-files.com/68864d00ea8f52f9e4d32cc2/69b0ad30a333e0c7acbccba5_Vayakhel%20Part%20I.webp','Moses addressing the Israelites, not an anonymous modern traveler','Mitzvah Minute','https://www.mitzvah-minute.com/divrei-torah/vayakhel----part-i----vay-aq-hel-mosheh-reassembling-a-broken-nation---1-2----the-nation-after-the-golden-calf','Deuteronomy 6:4',SHEMA,'50% 35%'),
 prophets: illustrated('https://www.heroisdabiblia.com.br/storage/posts/featured/MfCGF7Wa09bQZDGlh8d2A0MgpSycbjG0e6xhjA4u.webp','Modern depiction of Isaiah proclaiming his message from a rocky hillside above ancient Judah','Heróis da Bíblia','https://www.heroisdabiblia.com.br/en-us/artigos/isaiah-the-classical-prophet-of-judah-and-his-messianic-visions','Isaiah 44:6',ISAIAH,'62% 36%'),
 jesus: illustrated('https://static.wixstatic.com/media/83aeb0_e0b90c140408418d8bb35f96267923c0~mv2.jpg/v1/fill/w_1000%2Ch_667%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01/83aeb0_e0b90c140408418d8bb35f96267923c0~mv2.jpg','Jesus teaching a Jewish scribe about the greatest commandment, with other listeners present','Caminho de Fé','https://www.caminhodefe.com/post/o-cora%C3%A7%C3%A3o-da-lei-%C3%A9-o-amor','Mark 12:29',JESUS,'40% 35%'),
 apostles: illustrated('https://cdn.bibleworld.ai/bible-world/generations/e8158347-eb99-404f-9a7e-48445c96d610.png?format=jpeg&quality=85&width=1200','The apostle Paul preaching to a gathered early Christian community','BibleWorld · public gallery CC0','https://bibleworld.ai/image/db18cba8-835c-4785-8710-e7772a439bd2','1 Corinthians 8:4',PAUL,'59% 33%'),
 // Reading and continuity scenes use different compositions where available.
 'shema-encounter': illustrated('https://images.pexels.com/photos/2867771/pexels-photo-2867771.jpeg?auto=compress&cs=tinysrgb&w=1600','Wilderness dunes, a contemporary context photograph','Pexels','https://www.pexels.com/photo/2867771/','Deuteronomy 6:4',SHEMA),
 'moses-reading': illustrated('https://images.pexels.com/photos/28718329/pexels-photo-28718329.jpeg?auto=compress&cs=tinysrgb&w=1600','Desert landscape suggesting Israel’s wilderness setting','Pexels','https://www.pexels.com/photo/28718329/','Deuteronomy 6:4',SHEMA),
 'prophets-reading': illustrated('https://images.pexels.com/photos/12187158/pexels-photo-12187158.jpeg?auto=compress&cs=tinysrgb&w=1600','Rugged desert terrain for Isaiah reading','Pexels','https://www.pexels.com/photo/12187158/','Isaiah 44:6',ISAIAH),
 'jesus-reading': illustrated('https://images.pexels.com/photos/1659291/pexels-photo-1659291.jpeg?auto=compress&cs=tinysrgb&w=1600','Stone architecture of the biblical world','Pexels','https://www.pexels.com/photo/1659291/','Mark 12:29',JESUS),
 'apostles-reading': illustrated('https://images.pexels.com/photos/36516078/pexels-photo-36516078.jpeg?auto=compress&cs=tinysrgb&w=1600','Writing desk with papers as context for ancient correspondence','Pexels','https://www.pexels.com/photo/36516078/','1 Corinthians 8:4',PAUL),
 'moses-trail': illustrated('https://images.pexels.com/photos/11042744/pexels-photo-11042744.jpeg?auto=compress&cs=tinysrgb&w=1600','Wilderness landscape and desert travel','Pexels','https://www.pexels.com/photo/11042744/','Deuteronomy 6:4',SHEMA),
 'jesus-trail': illustrated('https://images.pexels.com/photos/18717576/pexels-photo-18717576.jpeg?auto=compress&cs=tinysrgb&w=1600','Ancient stone architecture as background context','Pexels','https://www.pexels.com/photo/18717576/','Mark 12:29',JESUS),
 'apostles-trail': illustrated('https://images.pexels.com/photos/6980533/pexels-photo-6980533.jpeg?auto=compress&cs=tinysrgb&w=1600','Writing scene illustrating correspondence','Pexels','https://www.pexels.com/photo/6980533/','1 Corinthians 8:4',PAUL),
 'prophets-witness': illustrated('https://images.pexels.com/photos/39811859/pexels-photo-39811859.jpeg?auto=compress&cs=tinysrgb&w=1600','Desert mountains for Isaiah’s prophetic witness','Pexels','https://www.pexels.com/photo/39811859/','Isaiah 44:6',ISAIAH)
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
     <small>Illustrative reconstruction · {art.artist}. The appearance of the biblical witness is imagined, not historically documented.</small>
    </div>
    <div className="ogj-reveal-actions">
     <button type="button" onClick={()=>onSpeak?.(stop.narration)}>▶ Hear Scripture</button>
     {onOpenBible&&<button type="button" className="ogj-read-link" onClick={()=>onOpenBible(art.reference)}>Read in Bible ↗</button>}
    </div>
   </div>}
 </div>;
}
