import { useState } from 'react';
export default function SinTeachingEncounter({ state, onProgress, onContinue, onOpen }) {
 const saved=state.experience?.selections || {};
 const [answer,setAnswer]=useState(saved.sinEncounterAnswer || '');
 const [checked,setChecked]=useState(false);
 const correct=answer==='rebellion';
 function choose(value){setAnswer(value);setChecked(false);onProgress({selections:{...saved,sinEncounterAnswer:value},milestoneIds:['started']});}
 return <section className="cl-guided">
  <p className="ld-eyebrow">Jeremiah · Let’s work through this</p>
  <h2>What actually broke?</h2>
  <p className="cl-prose">Imagine a person who lies to protect their reputation. Nobody discovers it. Their friends still trust them, and their life looks unchanged.</p>
  <div className="cl-connection"><span>What people see</span><strong>A reputation intact</strong><span>What God sees</span><strong>A person choosing deception over truth</strong></div>
  <p className="cl-prose">Sin is measured against God’s will. Getting away with a lie does not make the relationship with God whole. The wrong exists before anyone discovers it.</p>
  <p className="cl-prose">That is why Genesis begins with a command. God gives life and sets a boundary. When people reject his word, they do more than make their lives difficult: they reject his rule. Shame follows, but shame is a consequence of the breach.</p>
  <button type="button" className="cl-read-passage" onClick={()=>onOpen({reference:'Genesis 2:16-17',note:'Notice who gives the command and what consequence he names.'})}>Read the command in Genesis 2:16–17 →</button>
  <h2>Let me check the distinction.</h2>
  <p className="cl-prompt">The lie remains undiscovered. Why does the person still need reconciliation with God?</p>
  <div className="cl-choices">{[
    ['feelings','Because they will eventually feel guilty.'],
    ['rebellion','Because they have violated God’s will, even without being exposed.'],
    ['reputation','Because their reputation might suffer later.'],
  ].map(([id,label])=><button type="button" key={id} aria-pressed={answer===id} onClick={()=>choose(id)}>{label}</button>)}</div>
  {!checked && <button type="button" className="ld-primary cl-next" disabled={!answer} onClick={()=>setChecked(true)}>Discuss my answer →</button>}
  {checked && <div className="cl-feedback" aria-live="polite"><span className="ld-eyebrow">Jeremiah</span><p>{correct ? 'Yes. You located the wrong in the relationship with God. Feelings and public consequences may follow, but neither creates the sin. This distinction matters: salvation must address real guilt and separation, not merely help someone feel better.' : answer==='feelings' ? 'You noticed an important consequence: guilt can be felt. But suppose the person feels no remorse. Has the lie become right? No—the wrong is still measured against God’s will. Separate the act of rebellion from the feelings that may follow it.' : 'You noticed a possible social consequence. Now remove it: suppose nobody ever learns about the lie. The violation of God’s will remains. Reputation describes how other people see us; reconciliation concerns our relationship with God.'}</p>
  {correct ? <><p>Next, we will trace what Scripture says this breach produces—and why improvement alone cannot repair it.</p><button type="button" className="ld-primary" onClick={onContinue}>Follow the consequences in Scripture →</button></> : <><p>Try again: which answer identifies the wrong even when there is no exposure and no remorse?</p><button type="button" className="ld-primary" onClick={()=>{setAnswer('');setChecked(false);}}>Reconsider the situation →</button></>}
  </div>}
 </section>;
}
