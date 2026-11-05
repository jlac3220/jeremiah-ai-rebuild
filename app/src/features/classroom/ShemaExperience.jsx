import { useState } from 'react';
import {VISUAL_ASSETS} from '../../data/curriculum/visualCatalog';
import {createVisualBrief,chooseLessonVisual} from '../../core/classroom/visualIntelligence';
import useDiscoveredLessonVisual from './useDiscoveredLessonVisual';
import './ShemaExperience.css';

const PHRASES = [
 {id:'hear',text:'Hear, O Israel',spoken:'Hear, O Israel.',hebrew:'שְׁמַע',roman:'SHEMA · HEAR',title:'More than hearing a sound.',meaning:'The confession opens with a summons to listen and respond. The people are being addressed, not merely given information.'},
 {id:'belong',text:'The LORD our God',spoken:'The Lord our God.',hebrew:'יְהוָה אֱלֹהֵינוּ',roman:'THE LORD · OUR GOD',title:'A people and their God.',meaning:'These words identify the LORD as Israel’s covenant God. The confession is personal and communal, not an abstract number.'},
 {id:'one',text:'is one LORD',spoken:'Is one Lord.',hebrew:'יְהוָה אֶחָד',roman:'ONE LORD',title:'The heart of the confession.',meaning:'The LORD is confessed as one. Read that claim beside Isaiah’s declarations and Jesus’ repetition, rather than building everything on a dictionary definition.'}
];

export default function ShemaExperience({kind,sequenceIndex=0,video,onOpenBible,onSpeak,content,move}) {
 const openingBrief=createVisualBrief({content,move,placement:{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Israel receives the confession in Deuteronomy 6:4'}});
 const knownOpening=chooseLessonVisual(openingBrief,VISUAL_ASSETS).asset;
 const {asset:openingImage,onError:openingImageError}=useDiscoveredLessonVisual(openingBrief,knownOpening);
 const currentPhrase=PHRASES[Math.max(0,Math.min(sequenceIndex,PHRASES.length-1))];

 if(kind==='shema-encounter')return <div className="shema-world">
  <div className="shema-world-art">
   {openingImage&&<img key={openingImage.id} className="shema-world-photo"
     src={openingImage.src} alt="Moses addresses the gathered people of Israel"
     style={{objectPosition:openingImage.focal||'50% 38%'}}
     onError={openingImageError} loading="eager" decoding="async"/>}
  </div>
  <div className="shema-world-copy">
   <span className="shema-eyebrow">A CONFESSION THAT SHAPES EVERYTHING</span>
   <h2>Before you explain it, <em>hear it.</em></h2>
   <blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote>
   <span className="shema-source">DEUTERONOMY 6:4 · KJV</span>
   <p>The words Moses gave to Israel will be heard again from the lips of Jesus. Begin with the confession itself.</p>
   <div className="shema-opening-actions"><button type="button" className="shema-opening-listen" onClick={()=>onSpeak?.('Hear, O Israel: The LORD our God is one LORD.')}>▶ Hear the Scripture</button><button type="button" className="shema-artifact-link" onClick={()=>onOpenBible?.('Deuteronomy 6:4')}>Read in context ↗</button></div>
  </div>
  <div className="shema-world-footer"><span>THE ONE LORD · DEUTERONOMY 6</span><span aria-hidden="true">✦</span></div>
 </div>;

 if(kind==='shema-manuscript')return <div className="shema-phrase-story">
  <div className="shema-phrase-overline"><span>THE WORDS OF THE CONFESSION</span><span>DEUTERONOMY 6:4</span></div>
  <div className="shema-phrase-track" aria-label="Three parts of the confession">
   {PHRASES.map((part,i)=><div key={part.id} className={i===sequenceIndex?'is-active':i<sequenceIndex?'is-complete':'is-upcoming'} aria-current={i===sequenceIndex?'step':undefined}>
    <span>{i<sequenceIndex?'✓':String(i+1).padStart(2,'0')}</span>
    <strong>{part.text}</strong>
   </div>)}
  </div>
  <div className="shema-phrase-feature" key={currentPhrase.id} aria-live="polite">
   <div className="shema-phrase-language">
    <span>IN HEBREW</span>
    <strong lang="he" dir="rtl">{currentPhrase.hebrew}</strong>
    <small>{currentPhrase.roman}</small>
   </div>
   <div className="shema-phrase-teaching">
    <span>PART {sequenceIndex+1} OF THREE</span>
    <h2>{currentPhrase.title}</h2>
    <p>{currentPhrase.meaning}</p>
    <button type="button" onClick={()=>onSpeak?.(currentPhrase.spoken)}>▶ Hear this phrase</button>
   </div>
  </div>
  <p className="shema-phrase-footer">Each phrase builds the same confession. Continue to reveal the next one.</p>
 </div>;

 if(kind==='shema-cinema')return <div className="shema-cinema">
  <div className="shema-cinema-top"><span className="shema-eyebrow">A SHORT FILM · LISTENING IN CONTEXT</span><span className="shema-film-time">{video?.duration||'SHORT FILM'}</span></div>
  <h2>What does it mean to <em>hear?</em></h2>
  <p>Notice how Scripture connects listening with responding. Jeremiah will return to the text afterward.</p>
  <div className="shema-cinema-frame">{video?<iframe src={video.embedUrl} title={video.videoTitle||video.title} loading="lazy" allow="encrypted-media; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="shema-no-film">Video unavailable. Continue with the Scripture.</div>}</div>
  <div className="shema-film-footer"><span>{video?.provider||'Optional educational context'}</span><span>Optional viewing · Continue when ready</span></div>
 </div>;

 if(kind==='shema-connection')return <div className="shema-verse-bridge">
  <div className="shema-bridge-heading"><span>READ THEM TOGETHER</span><h2>One confession. <em>One response.</em></h2><p>The next verse tells Israel what knowing the one LORD calls for.</p></div>
  <div className="shema-bridge-panels">
   <article className="shema-bridge-panel shema-bridge-panel--confession">
    <span>01 · THE CONFESSION</span>
    <blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote>
    <button type="button" onClick={()=>onOpenBible?.('Deuteronomy 6:4')}>Deuteronomy 6:4 · Read in context ↗</button>
   </article>
   <div className="shema-bridge-arrow" aria-hidden="true">→</div>
   <article className="shema-bridge-panel shema-bridge-panel--response">
    <span>02 · THE RESPONSE</span>
    <blockquote>“And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.”</blockquote>
    <button type="button" onClick={()=>onOpenBible?.('Deuteronomy 6:5')}>Deuteronomy 6:5 · Read in context ↗</button>
   </article>
  </div>
  <p className="shema-bridge-takeaway"><strong>Notice the movement:</strong> who the LORD is gives direction to the love he commands. The two verses belong together.</p>
 </div>;

 if(kind==='shema-echad')return <div className="shema-echad-scene">
  <div className="shema-echad-hero">
   <span>ONE WORD · READ IN CONTEXT</span>
   <strong lang="he" dir="rtl">אֶחָד</strong>
   <h2>Echad <em>means “one.”</em></h2>
   <p>But one word cannot settle every question about who God is. Its meaning must be read in the sentence and in the wider Scripture.</p>
  </div>
  <div className="shema-echad-evidence">
   <div className="shema-echad-evidence-intro"><span>THREE SCRIPTURAL LENSES</span><p>The passage provides the argument, not a detached dictionary definition.</p></div>
   <div className="shema-echad-evidence-grid">
    <article><span>GENESIS 2:24</span><h3>“One flesh”</h3><p>The same Hebrew word can describe a union. That use alone does not establish multiple divine persons.</p></article>
    <article><span>ISAIAH 44:6</span><h3>“Beside me there is no God”</h3><p>The LORD speaks without a rival. This clarifies the exclusivity of Israel’s confession.</p></article>
    <article><span>MARK 12:29</span><h3>Jesus reaffirms it</h3><p>Asked for the first commandment, Jesus begins with the Shema itself.</p></article>
   </div>
   <p className="shema-echad-conclusion">The Apostolic reading begins with this testimony to the one LORD—and follows it through the prophets and the New Testament.</p>
  </div>
 </div>;
 return null;
}

export function ShemaPhrasePractice({move,draft,feedback,onChange,onStepChange}) {
 const [step,setStep]=useState(0);
 const items=move.interaction.items;
 const answers=move.interaction.options;
 const current=items[step];
 const choice=draft.placements?.[current.id]||'';
 const completed=items.filter(item=>draft.placements?.[item.id]).length;
 function moveTo(next){setStep(next);onStepChange?.(next)}
 function choose(id){if(feedback)return;onChange({placements:{...draft.placements,[current.id]:id}})}
 return <div className="shema-practice">
  <div className="shema-practice-head"><span>RECONSTRUCT THE CONFESSION</span><span>{step+1} / {items.length}</span></div>
  <div className="shema-practice-scene">
   <span className="shema-practice-kicker">THE WORDS</span>
   <h3>“{current.label}”</h3>
   <p>What does this phrase contribute to the confession?</p>
  </div>
  <div className="shema-practice-options" role="group" aria-label={'Meaning of '+current.label}>
   {answers.map(answer=><button type="button" key={answer.id} disabled={Boolean(feedback)} aria-pressed={choice===answer.id} onClick={()=>choose(answer.id)}><span className="shema-choice-indicator" aria-hidden="true">{choice===answer.id?'✓':'○'}</span>{answer.label}</button>)}
  </div>
  {!feedback&&<div className="shema-practice-footer">
   {step>0&&<button type="button" className="shema-practice-back" onClick={()=>moveTo(step-1)}>← Previous phrase</button>}
   {step<items.length-1&&<button type="button" className="shema-practice-forward" disabled={!choice} onClick={()=>moveTo(step+1)}>Continue to the next phrase →</button>}
   {step===items.length-1&&choice&&<p>{completed===items.length?'The three connections are ready. Check your reasoning with Jeremiah below.':'Review any unfinished connections before checking.'}</p>}
  </div>}
 </div>;
}

export function ShemaTeachBack({move,value,onChange,disabled}) {
 return <div className="shema-teachback">
  <div className="shema-teachback-intro">
   <span className="shema-eyebrow">FINAL CHALLENGE / CHAPTER ONE</span>
   <h2>Can you teach the confession?</h2>
   <p>{move.prompt}</p>
  </div>
  <div className="shema-teachback-layout">
   <aside className="shema-teachback-brief" aria-label="Your evidence trail">
    <span className="shema-kicker">YOUR EVIDENCE TRAIL</span>
    <ol>
     <li><strong>Remember</strong><span>You completed a separate Deuteronomy 6:4 memory check. Now explain its meaning.</span></li>
     <li><strong>Explain</strong><span>Describe <em>shema</em>, <em>echad</em>, and wholehearted love in verse 5.</span></li>
     <li><strong>Reason</strong><span>Address “one flesh” in Genesis 2:24 using context.</span></li>
     <li><strong>Connect</strong><span>Bring in Isaiah 44:6 and Mark 12:29.</span></li>
    </ol>
   </aside>
   <div className="shema-teachback-response">
    <label htmlFor="shema-written-response">Your explanation</label>
    <textarea id="shema-written-response" value={value||''} disabled={disabled} onChange={e=>onChange(e.target.value)} rows={10} placeholder="Explain the meaning of the confession, then support your reasoning from Scripture…"/>
    <div className="shema-response-footer"><span>{(value||'').trim()?value.trim().split(/\s+/).length+' words':'Your words. Your reasoning.'}</span><span>Autosaved as you write</span></div>
   </div>
  </div>
 </div>;
}
