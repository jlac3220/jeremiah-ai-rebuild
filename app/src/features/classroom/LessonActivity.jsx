import { useEffect, useState } from 'react';
import './LessonActivity.css';

// Every scene has its own verified subject, image, and credit.
// Biblical scenes are historic artistic depictions, not photographs of events.
const scenes = [
  {
    id: 'moses',
    step: '01 / 04',
    tab: 'Moses',
    kicker: 'THE ORIGINAL CONFESSION',
    title: 'Moses calls Israel to hear',
    reference: 'Deuteronomy 6:4',
    caption: 'The LORD our God is one LORD.',
    detail: 'On the plains of Moab, Moses calls Israel to listen. The confession is followed by a call to love God with the whole heart. This is where the journey begins.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Moses_Pleading_with_Israel.jpg?width=1200',
    alt: 'Historical color Bible illustration showing Moses speaking to the people of Israel.',
    credit: 'Providence Lithograph Company, 1907 · Public domain',
  },
  {
    id: 'jesus',
    step: '02 / 04',
    tab: 'Jesus',
    kicker: 'THE SAME CONFESSION',
    title: 'Jesus repeats the confession',
    reference: 'Mark 12:29',
    caption: 'Hear, O Israel; The Lord our God is one Lord.',
    detail: 'Asked which commandment comes first, Jesus answers with the Shema. He does not replace the confession: He reaffirms it, and calls for love of God and neighbor.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Brooklyn_Museum_-_The_Scribe_Stood_to_Tempt_Jesus_%28Le_scribe_se_leva_pour_tenter_J%C3%A9sus%29_-_James_Tissot_-_overall.jpg',
    alt: 'Painting by James Tissot depicting Jesus seated with followers while a scribe questions him.',
    credit: 'James Tissot · Brooklyn Museum · Public domain',
  },
  {
    id: 'paul',
    step: '03 / 04',
    tab: 'Paul',
    kicker: 'THE APOSTOLIC WITNESS',
    title: 'Paul carries it into the church',
    reference: '1 Corinthians 8:4',
    caption: 'There is none other God but one.',
    detail: 'Writing to believers surrounded by claims about many gods, Paul preserves the same confession. Different audience. The same truth.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Valentin_de_Boulogne_-_Saint_Paul_Writing_His_Epistles_-_BF.1991.4_-_Museum_of_Fine_Arts.jpg',
    alt: 'A painting by Valentin de Boulogne of the apostle Paul writing at a desk.',
    credit: 'Valentin de Boulogne · Public domain',
  },
  {
    id: 'today',
    step: '04 / 04',
    tab: 'Your world',
    kicker: 'THE CONFESSION REACHES YOU',
    title: 'What does one Lord mean on an ordinary Tuesday?',
    reference: 'Deuteronomy 6:5 · Mark 12:30',
    caption: 'Love the LORD thy God with all thine heart.',
    detail: 'The confession does not belong only to ancient courtyards and letters. It reaches the conversations, commitments, relationships, and choices of ordinary people today.',
    image: 'https://images.unsplash.com/photo-1758445038510-1ed36a6e6edd?auto=format&fit=crop&w=1400&q=82',
    alt: 'Candid modern photograph of two people talking together at a café table by a window.',
    credit: 'Zhen Yao · Unsplash License',
  },
];

function SceneImage({ scene }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [scene.id]);
  return <div className="la-scene-media">
    {failed
      ? <div className="la-scene-fallback" role="img" aria-label={scene.alt}>An image of this scene could not load.</div>
      : <img key={scene.id} src={scene.image} alt={scene.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />}
    <span className="la-scene-media-label">{scene.kicker}</span>
    <small className="la-scene-credit">{scene.credit}</small>
  </div>;
}

export function LessonVisual({kind}) {
 const [index,setIndex]=useState(0);
 const [playing,setPlaying]=useState(false);
 useEffect(()=>{
   if(kind!=='story' || !playing)return;
   const timer=setTimeout(()=>{
     if(index===scenes.length-1)setPlaying(false);
     else setIndex(value=>Math.min(value+1,scenes.length-1));
   },7000);
   return()=>clearTimeout(timer);
 },[kind,playing,index]);
 if(kind==='story'){
   const scene=scenes[index];
   return <figure className="la-film la-film-cinematic">
     <SceneImage scene={scene}/>
     <figcaption className="la-scene-copy" aria-live="polite">
       <span className="la-kicker">{scene.step} · Scripture across time</span>
       <h2>{scene.title}</h2>
       <blockquote>“{scene.caption}”</blockquote>
       <strong>{scene.reference} · KJV {scene.id==='today'?'excerpt':''}</strong>
       <p>{scene.detail}</p>
       <div className="la-controls la-story-controls" aria-label="Choose a moment in the journey">
         <button type="button" onClick={()=>{if(index===scenes.length-1)setIndex(0);setPlaying(value=>!value);}}>{playing?'Pause journey':'Play journey'} <span aria-hidden="true">▶</span></button>
         {scenes.map((s,i)=><button type="button" key={s.id} aria-label={'Show '+s.tab} aria-pressed={index===i} onClick={()=>{setIndex(i);setPlaying(false);}}>{s.tab}</button>)}
       </div>
       <small className="la-art-notice">Historical scenes are artists’ interpretations, not photographs. Each screen uses a different image.</small>
     </figcaption>
   </figure>;
 }
 if(kind==='devotion')return <figure className="la-evidence la-devotion">
   <div className="la-devotion-visual">
     <img src="https://images.unsplash.com/photo-1770097286875-0cbf4ca2f8c1?auto=format&fit=crop&w=1400&q=82" alt="Present-day people standing together in prayer and worship inside a church." loading="lazy" decoding="async"/>
     <span>WORSHIP IN THE WORLD YOU KNOW</span>
     <small>AMONWAT DUMKRUT · Unsplash License</small>
   </div>
   <span className="la-kicker">Follow the confession into life</span><h2>“With all thine heart”</h2>
   <div className="la-directions">{['Worship','Ethics','Mission'].map((label,i)=><button type="button" key={label} aria-pressed={index===i} onClick={()=>setIndex(i)}>{label}<span aria-hidden="true">{['♡','⚖','↗'][i]}</span></button>)}</div>
   <p>{['Exclusive devotion: the one Lord receives worship, not a share alongside rival gods.','Undivided allegiance: honesty and care remain under the same Lord as public worship.','One gospel: the call to know and respond to this God reaches beyond one community.'][index]}</p>
   <figcaption>Deuteronomy 6:4–5 connects who God is with the response of the whole person.</figcaption>
 </figure>;
 if(kind==='scroll')return <figure className="la-scroll"><span className="la-kicker">Look closely at the confession</span><div lang="he" dir="rtl" className="la-hebrew">שְׁמַע יִשְׂרָאֵל</div><p>Shema Yisrael · Hear, O Israel</p><div className="la-phrase">The LORD <span>our God</span> is <strong>one LORD.</strong></div><figcaption>The words identify God and summon a people to listen. This is a typeset teaching illustration, not an ancient manuscript.</figcaption></figure>;
 if(kind==='exclusivity')return <figure className="la-evidence"><span className="la-kicker">Examine the scope of the claim</span><h2>Before. Beside. After.</h2><div className="la-directions">{['Before','Beside','After'].map((label,i)=><button type="button" key={label} aria-pressed={index===i} onClick={()=>setIndex(i)}>{label}<span aria-hidden="true">{['←','↔','→'][i]}</span></button>)}</div><blockquote>{['“before me there was no God formed”','“beside me there is no God”','“neither shall there be after me”'][index]}</blockquote><p>{index===1?'Isaiah 44:6':'Isaiah 43:10'} · KJV excerpt</p><figcaption>{['Not a successor to an earlier god.','Not one deity standing alongside another.','Not replaced by a later deity.'][index]} These directions organize Isaiah’s language; they do not depict God.</figcaption></figure>;
 return <figure className="la-comparison"><span className="la-kicker">Locate the actual disagreement</span><h2>Both say “one God.”</h2><div><section><h3>Trinitarian confession</h3><p>One divine essence</p><strong>Three eternal persons</strong></section><section><h3>Oneness confession</h3><p>One undivided God</p><strong>No eternal division into persons</strong></section></div><figcaption>Now explain the incarnation. A fair comparison must preserve both the actual disagreement and Jesus’ real humanity.</figcaption></figure>;
}

export default function LessonActivity({move,draft,feedback,onChange}){
 if(move.interaction.type==='reasoning')return <div className="la-reasoning">{[['claim','claimId','claims','claimPrompt'],['reason','reasonId','reasons','reasonPrompt']].map(([id,field,options,prompt])=>{const result=feedback?.itemResults?.find(r=>r.id===id);return <fieldset key={id} disabled={Boolean(feedback)}><legend>{move.interaction[prompt]}</legend>{move.interaction[options].map(option=><button type="button" key={option.id} aria-pressed={draft[field]===option.id} onClick={()=>onChange({[field]:option.id})}>{option.label}</button>)}{result && <p className={result.correct?'la-correct':'la-rethink'}>{result.message}</p>}</fieldset>;})}</div>;
 const {items,options}=move.interaction;
 const results=feedback?.itemResults || [];
 const trail=move.id==='continuity-guide';
 const clinic=move.id==='distinction-guide';
 return <div className={`la-activity ${trail?'la-trail':clinic?'la-clinic':'la-matching'}`}>
  <p className="la-kicker">{move.activityLabel || 'Phrase workshop'} · {items.filter(i=>draft.placements?.[i.id]).length}/{items.length} connected</p>
  {items.map((item,i)=>{const result=results.find(r=>r.id===item.id);return <fieldset key={item.id} disabled={Boolean(feedback)}><legend>{trail?'Witness':clinic?'Claim':`Evidence ${i+1}`}</legend><p>{item.label}</p>
   {clinic?<div className="la-verdicts">{options.map(option=><button type="button" key={option.id} aria-pressed={draft.placements?.[item.id]===option.id} onClick={()=>onChange({placements:{...draft.placements,[item.id]:option.id}})}>{option.label}</button>)}</div>:<label>{trail?'Position in the argument':'Connect to'}<select value={draft.placements?.[item.id] || ''} onChange={e=>onChange({placements:{...draft.placements,[item.id]:e.target.value}})}><option value="">Choose a connection…</option>{options.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>}
   {result && <p className={result.correct?'la-correct':'la-rethink'}><strong>{result.correct?'Connected: ':'Reconsider: '}</strong>{result.message}</p>}
  </fieldset>;})}
 </div>;
}

export function WorkedExample({move,draft,onChange}) {
 const steps=move.workedExample.steps;
 const current=Math.min(draft.workedStep || 0,steps.length-1);
 return <section className="la-worked" aria-label="A worked example"><p className="la-kicker">Think it through with Jeremiah</p><h2>{move.workedExample.title}</h2><div className="la-worked-tabs" role="group" aria-label="Reasoning steps">{steps.map((step,i)=><button type="button" key={step.label} aria-pressed={current===i} onClick={()=>onChange({workedStep:i})}>{i+1} · {step.label}</button>)}</div><div aria-live="polite"><h3>{steps[current].label}</h3><p>{steps[current].text}</p></div>{current<steps.length-1 && <button type="button" onClick={()=>onChange({workedStep:current+1})}>Follow the reasoning →</button>}<small>Explore at your pace. These steps model the reasoning; opening them does not earn assessment credit.</small></section>;
}
