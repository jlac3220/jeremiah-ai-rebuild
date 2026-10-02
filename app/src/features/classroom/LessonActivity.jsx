import { useEffect, useState } from 'react';
import './LessonActivity.css';

const scenes=[
 {title:'Israel listens',reference:'Deuteronomy 6:4',caption:'The LORD our God is one LORD.',detail:'The confession begins with a summons to hear. Read Deuteronomy 6:5: the response is wholehearted love.'},
 {title:'Jesus reaffirms',reference:'Mark 12:29',caption:'Hear, O Israel; The Lord our God is one Lord.',detail:'When asked about the first commandment, Jesus repeats the confession. Notice what remains the same.'},
 {title:'The apostles apply',reference:'1 Corinthians 8:4',caption:'There is none other God but one.',detail:'Paul brings the confession into a setting where people speak of many gods. The exclusive claim continues.'}
];
function Landscape({scene=0}){
 return <svg viewBox="0 0 720 240" role="img" aria-label={['An illustrated gathering in a desert landscape','An illustrated open courtyard with people gathered to listen','An illustrated writing table looking toward a city'][scene]}>
  <defs><linearGradient id={`sky-${scene}`} x2="0" y2="1"><stop stopColor="#133c4a"/><stop offset="1" stopColor="#839b96"/></linearGradient></defs>
  <path fill={`url(#sky-${scene})`} d="M0 0h720v240H0z"/><circle cx="586" cy="60" r="28" fill="#edc785"/>
  <path d="M0 167L105 76 204 165 307 101 436 190 564 120 720 173V240H0Z" fill="#758679"/><path d="M0 208Q200 142 383 208T720 184V240H0Z" fill="#b4936e"/>
  {scene===0?<g fill="#e7d4af" stroke="#5c6356" strokeWidth="3"><path d="M65 201l49-76 55 76zM495 207l49-65 53 65z"/><path d="M114 125v76M544 142v65"/>{[230,275,321,370,420].map((x,i)=><g key={x} transform={`translate(${x} ${173+i%2*12})`}><circle r="9" cy="-22" fill="#503e30"/><path d="M-13 14l5-26h16l7 26z"/></g>)}</g>:scene===1?<g fill="#d2bc94"><path d="M52 58h24v167H52zM178 58h24v167h-24zM40 44h177v20H40zM509 62h25v160h-25zM650 62h25v160h-25zM497 47h190v22H497z"/>{[255,310,365,420,463].map(x=><g key={x}><circle cx={x} cy="176" r="9" fill="#503e30"/><path d={`M${x-12} 213l4-26h16l5 26z`} fill="#f0dec1"/></g>)}</g>:<g><path d="M84 104h36V64h35v40h45v85H84zM225 113h34V80h29v33h27v77h-90zM510 90h40V55h28v35h54v99H510z" fill="#d1bb98"/><path d="M123 212h474v28H123z" fill="#543d2f"/><path d="M220 160q70-22 140 0v68q-70-20-140 0zM360 160q70-22 140 0v68q-70-20-140 0z" fill="#f3dfb8"/><path d="M360 161v65M240 179h99m-99 13h99m-99 13h99m41-26h95m-95 13h95" stroke="#9c835e" strokeWidth="3"/></g>}
 </svg>;
}
export function LessonVisual({kind}){
 const [index,setIndex]=useState(0);
 const [playing,setPlaying]=useState(false);
 useEffect(()=>{if(!playing)return;const timer=setTimeout(()=>{if(index===2)setPlaying(false);else setIndex(index+1);},6500);return()=>clearTimeout(timer);},[playing,index]);
 if(kind==='story')return <figure className="la-film"><Landscape scene={index}/><figcaption><span className="la-kicker">Illustrated Scripture journey · {index+1} of 3</span><h2>{scenes[index].title}</h2><blockquote>“{scenes[index].caption}”</blockquote><strong>{scenes[index].reference} · KJV</strong><p>{scenes[index].detail}</p><div className="la-controls"><button type="button" onClick={()=>{if(index===2)setIndex(0);setPlaying(!playing);}}>{playing?'Pause':'Play the sequence'}</button>{scenes.map((s,i)=><button type="button" key={s.reference} aria-label={s.title} aria-pressed={index===i} onClick={()=>{setIndex(i);setPlaying(false);}}>{i+1}</button>)}</div><small>Original instructional illustration; not a historical reconstruction. Read at your pace or play the sequence.</small></figcaption></figure>;
 if(kind==='devotion')return <figure className="la-evidence"><span className="la-kicker">Follow the confession into life</span><h2>“With all thine heart”</h2><div className="la-directions">{['Worship','Ethics','Mission'].map((label,i)=><button type="button" key={label} aria-pressed={index===i} onClick={()=>setIndex(i)}>{label}<span aria-hidden="true">{['♡','⚖','↗'][i]}</span></button>)}</div><p>{['Exclusive devotion: the one Lord receives worship, not a share alongside rival gods.','Undivided allegiance: honesty and care remain under the same Lord as public worship.','One gospel: the call to know and respond to this God reaches beyond one community.'][index]}</p><figcaption>Deuteronomy 6:4–5 connects who God is with the response of the whole person.</figcaption></figure>;
 if(kind==='scroll')return <figure className="la-scroll"><span className="la-kicker">Look closely at the confession</span><div lang="he" dir="rtl" className="la-hebrew">שְׁמַע יִשְׂרָאֵל</div><p>Shema Yisrael · Hear, O Israel</p><div className="la-phrase">The LORD <span>our God</span> is <strong>one LORD.</strong></div><figcaption>The words identify God and summon a people to listen. This is a typeset teaching illustration, not an ancient manuscript.</figcaption></figure>;
 if(kind==='exclusivity')return <figure className="la-evidence"><span className="la-kicker">Examine the scope of the claim</span><h2>Before. Beside. After.</h2><div className="la-directions">{['Before','Beside','After'].map((label,i)=><button type="button" key={label} aria-pressed={index===i} onClick={()=>setIndex(i)}>{label}<span aria-hidden="true">{['←','↔','→'][i]}</span></button>)}</div><blockquote>{['“before me there was no God formed”','“beside me there is no God”','“neither shall there be after me”'][index]}</blockquote><p>{index===1?'Isaiah 44:6':'Isaiah 43:10'} · KJV excerpt</p><figcaption>{['Not a successor to an earlier god.','Not one deity standing alongside another.','Not replaced by a later deity.'][index]} These directions organize Isaiah’s language; they do not depict God.</figcaption></figure>;
 return <figure className="la-comparison"><span className="la-kicker">Locate the actual disagreement</span><h2>Both say “one God.”</h2><div><section><h3>Trinitarian confession</h3><p>One divine essence</p><strong>Three eternal persons</strong></section><section><h3>Oneness confession</h3><p>One undivided God</p><strong>No eternal division into persons</strong></section></div><figcaption>Now explain the incarnation. A fair comparison must preserve both the actual disagreement and Jesus’ real humanity.</figcaption></figure>;
}
export default function LessonActivity({move,draft,feedback,onChange}){
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
