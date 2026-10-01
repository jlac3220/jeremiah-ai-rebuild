import { useState } from 'react';

function Person({ label }) {
 return <span className="tl-person"><svg viewBox="0 0 64 80" aria-hidden="true"><circle cx="32" cy="19" r="12"/><path d="M12 69v-9c0-17 8-25 20-25s20 8 20 25v9"/></svg><span>{label}</span></span>;
}
export default function LessonIllustration({ kind }) {
 const [side,setSide]=useState('public');
 const [consequence,setConsequence]=useState('guilt');
 if(kind==='hidden-lie') return <figure className="tl-illustration tl-story">
  <figcaption>A fictional situation · One act, two perspectives</figcaption>
  <div className="tl-switch" role="group" aria-label="View the situation"><button type="button" aria-pressed={side==='public'} onClick={()=>setSide('public')}>What others see</button><button type="button" aria-pressed={side==='relationship'} onClick={()=>setSide('relationship')}>The relationship with God</button></div>
  <div className="tl-story-scene"><Person label="An admired person"/><div aria-live="polite"><span className="tl-small">{side==='public'?'An unchanged reputation':'An undiscovered breach'}</span><strong>{side==='public'?'“Nobody knows.”':'The lie is still a lie.'}</strong><p>{side==='public'?'The person remains trusted. The wrong is hidden from other people.':'Public trust does not erase a choice against God’s will.'}</p></div></div>
 </figure>;
 if(kind==='command-and-breach') return <figure className="tl-illustration"><figcaption>Read the action in light of the command</figcaption><ol className="tl-cause-chain"><li><small>God gives</small><strong>Life and provision</strong><span>“freely eat”</span></li><li><small>God commands</small><strong>A real boundary</strong><span>“thou shalt not”</span></li><li><small>The person acts</small><strong>The boundary is crossed</strong><span>“did eat”</span></li></ol></figure>;
 if(kind==='limitation-and-refusal') return <figure className="tl-illustration"><figcaption>Two different descriptions</figcaption><div className="tl-comparison"><div><span className="tl-symbol" aria-hidden="true">?</span><h3>“I cannot understand it.”</h3><p>The instruction is in a language the person cannot read.</p><strong>A limitation of ability</strong></div><div><span className="tl-symbol" aria-hidden="true">×</span><h3>“I understand. I refuse.”</h3><p>The person understands the instruction and deliberately rejects it.</p><strong>A chosen rejection</strong></div></div></figure>;
 if(kind==='consequences') {
  const items={guilt:['Guilt','Accountability for the wrong','“I am answerable for what I did.”','A guilty feeling can come and go. Accountability is the moral reality that the feeling may recognize.'],corruption:['Corruption','Disorder in the inward person','“I am willing to hide the truth to protect myself.”','The problem reaches into desires and motives. A respectable appearance can conceal the inward disorder.'],separation:['Separation','A broken relationship with God','“My relationship with God needs restoration.”','Isaiah 59:2 names the relational breach. Public approval does not restore communion with God.']};
  const current=items[consequence];
  return <figure className="tl-illustration"><figcaption>Look closely at each consequence</figcaption><div className="tl-switch" role="group" aria-label="Consequences of sin">{Object.entries(items).map(([id,item])=><button type="button" key={id} aria-pressed={consequence===id} onClick={()=>setConsequence(id)}>{item[0]}</button>)}</div><div className="tl-consequence" aria-live="polite"><span className="tl-small">{current[1]}</span><blockquote>{current[2]}</blockquote><p>{current[3]}</p></div></figure>;
 }
 if(kind==='all') return <figure className="tl-illustration"><figcaption>Different histories · A shared need</figcaption><div className="tl-people"><Person label="Admired"/><Person label="Religious"/><Person label="Openly at fault"/></div><div className="tl-shared"><strong>“All have sinned”</strong><span>Romans 3:23</span><p>The verse includes every person. It does not say their actions are identical.</p></div></figure>;
 if(kind==='rescue') return <figure className="tl-illustration"><figcaption>Match the response to the depth of the need</figcaption><div className="tl-rescue"><div><small>The human need</small><strong>Guilt</strong><strong>Inward corruption</strong><strong>Separation from God</strong></div><span className="tl-rescue-arrow" aria-hidden="true">→</span><div><small>God’s saving work</small><strong>Forgiveness</strong><strong>Cleansing and new life</strong><strong>Restored communion</strong></div></div><p>Changing an appearance cannot supply everything the relationship needs.</p></figure>;
 return null;
}
