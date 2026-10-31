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

function Manuscript({active,onSelect,visited}) {
 return <div className="shema-manuscript">
  <div className="shema-manuscript-head"><span>THE WORDS ON THE PAGE</span><span>DEUTERONOMY 6:4</span></div>
  <div className="shema-ink-line" aria-label="Select a phrase from Deuteronomy 6:4">
   {PHRASES.map((phrase,i)=><button key={phrase.id} type="button" aria-pressed={active===i} className={'shema-word'+(active===i?' selected':'')+(visited.includes(i)?' visited':'')} onClick={()=>onSelect(i)}>{phrase.text}<span aria-hidden="true">{visited.includes(i)?'✦':'·'}</span></button>)}
  </div>
  <div className="shema-manuscript-bottom">THE LORD OUR GOD IS ONE LORD <span>✧</span> KJV</div>
 </div>;
}

export default function ShemaExperience({kind,sequenceIndex=0,video,onOpenBible,onInteraction,onSpeak,narrationEnabled=false,content,move}) {
 const [phrase,setPhrase]=useState(-1);
 const [visited,setVisited]=useState([]);
 const [verseRevealed,setVerseRevealed]=useState(false);
 const [seenVideo,setSeenVideo]=useState(false);
 const [selectedReflection,setSelectedReflection]=useState('');

 const openingBrief=createVisualBrief({content,move,placement:{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Israel receives the confession in Deuteronomy 6:4'}});
 const knownOpening=chooseLessonVisual(openingBrief,VISUAL_ASSETS).asset;
 const {asset:openingImage,onError:openingImageError}=useDiscoveredLessonVisual(openingBrief,knownOpening);
 const selected=phrase>=0?PHRASES[phrase]:null;
 function selectPhrase(i) {
  setPhrase(i);
  const next=visited.includes(i)?visited:[...visited,i];
  setVisited(next);
  onInteraction?.({visitedCount:next.length,phrase:i});
  if(narrationEnabled) onSpeak?.(PHRASES[i].spoken);
 }
 if(kind==='shema-encounter')return <div className="shema-world">
  <div className="shema-world-art">
   {openingImage&&<img key={openingImage.id} className="shema-world-photo"
     src={openingImage.src}
     alt="Moses addresses the gathered people of Israel"
     style={{objectPosition:openingImage.focal||'50% 38%'}}
     onError={openingImageError}
     loading="eager" decoding="async"/>}
  </div>
  <div className="shema-world-copy">
   <span className="shema-eyebrow">01 / THE INVITATION</span>
   <h2>Before you explain it, <em>hear it.</em></h2>
   <blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote>
   <span className="shema-source">DEUTERONOMY 6:4 · KING JAMES VERSION</span>
   <p>These are the words Israel was called to hear. A confession that would echo into the teaching of Jesus.</p>
   <div className="shema-opening-actions"><button type="button" className="shema-opening-listen" onClick={()=>onSpeak?.('Hear, O Israel: The LORD our God is one LORD.')}>▶ Hear the confession</button><button type="button" className="shema-artifact-link" onClick={()=>onOpenBible('Deuteronomy 6:4')}>Read in context <span>↗</span></button></div>
  </div>
  <div className="shema-world-footer"><span>AN ENCOUNTER WITH SCRIPTURE</span><span aria-hidden="true">✦</span></div>
 </div>;
 if(kind==='shema-manuscript')return <div className="shema-explore">
  <div className="shema-explore-top"><span className="shema-eyebrow">02 / INVESTIGATE</span><p>Three phrases. One confession. Touch the words themselves to discover what each contributes.</p></div>
  <aside className="shema-artifact" aria-label="Authentic ancient manuscript example">
   <div className="shema-artifact-image"><img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Papyrus_Nash.jpg" alt="The Nash Papyrus, an ancient Hebrew manuscript fragment containing the Ten Commandments and the Shema" loading="lazy"/></div>
   <div className="shema-artifact-copy">
    <span className="shema-kicker">REAL ARTIFACT · SECOND CENTURY BCE</span>
    <h3>The Nash Papyrus</h3>
    <p>This Hebrew papyrus preserves the Ten Commandments followed by the Shema. It is a later ancient witness to the confession, not Moses’ original writing.</p>
    <a href="https://cudl.lib.cam.ac.uk/view/MS-OR-00233/1" target="_blank" rel="noopener noreferrer">Examine the manuscript at Cambridge University Library ↗</a>
    <small>Public-domain reproduction · Cambridge University Library, MS Or.233.</small>
   </div>
  </aside>
  <div className="shema-sequential-status">PART {sequenceIndex+1} OF 3 · {PHRASES[sequenceIndex]?.text}</div>
  <div className="shema-word-reveal" aria-live="polite" key={PHRASES[sequenceIndex]?.id||'intro'}>
   {PHRASES[sequenceIndex]?<><div className="shema-hebrew" lang="he" dir="rtl">{PHRASES[sequenceIndex].hebrew}</div><div><span className="shema-kicker">{PHRASES[sequenceIndex].roman}</span><h3>{PHRASES[sequenceIndex].title}</h3><p>{PHRASES[sequenceIndex].meaning}</p><button className="shema-listen-phrase" type="button" onClick={()=>onSpeak?.(PHRASES[sequenceIndex].spoken)} aria-label={'Hear the words '+PHRASES[sequenceIndex].text}>▶ Hear these words</button></div></>:<div className="shema-word-intro"><span>✦</span><p>Continue to discover each phrase in order.</p></div>}
  </div>
  <p className="shema-explore-footer">{visited.length===3?'You have examined the whole confession. The words belong together.':visited.length>0?'Explore another phrase—or continue when you are ready.':'The words are waiting to be explored.'}</p>
 </div>;
 if(kind==='shema-cinema')return <div className="shema-cinema">
  <div className="shema-cinema-top"><span className="shema-eyebrow">03 / A DIFFERENT VOICE</span><span className="shema-film-time">{video?.duration||'SHORT FILM'}</span></div>
  <h2>Hear the word <em>Shema</em> in its world.</h2>
  <p>This brief film explores why the confession begins with a call to listen. Watch for the relationship between hearing and responding.</p>
  <div className="shema-cinema-frame">{video?<iframe src={video.embedUrl} title={video.videoTitle||video.title} loading="lazy" allow="encrypted-media; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<div className="shema-no-film">Video unavailable. Continue with the Scripture.</div>}</div>
  <div className="shema-film-footer"><span>{video?.provider||'Optional context'} · Educational context, not a doctrinal authority</span><button type="button" aria-pressed={seenVideo} onClick={()=>{setSeenVideo(v=>!v);onInteraction?.({watched:true})}}>{seenVideo?'✓ Marked as viewed':'Mark as viewed ✓'}</button></div>
 </div>;
 if(kind==='shema-connection')return <div className="shema-turn">
  <span className="shema-eyebrow">04 / WHAT COMES NEXT?</span>
  <h2>One LORD. <em>Now what?</em></h2>
  <p>Deuteronomy doesn't stop with a statement about God. What would you expect the next verse to ask of Israel?</p>
  <div className="shema-turn-options" role="group" aria-label="What follows the confession">
   {['Know the right definition','Love the LORD with all you are'].map((text,i)=><button type="button" key={text} aria-pressed={selectedReflection===String(i)} onClick={()=>{setSelectedReflection(String(i));setVerseRevealed(true);onInteraction?.({response:i});if(narrationEnabled) onSpeak?.('And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.')}}>{text}<span>{selectedReflection===String(i)?'●':'○'}</span></button>)}
  </div>
  {verseRevealed&&<div className="shema-verse-five" aria-live="polite">
   <div className="shema-verse-voice-row"><span className="shema-kicker">TURN THE PAGE · DEUTERONOMY 6:5</span><button type="button" onClick={()=>onSpeak?.('And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.')}>▶ Hear the verse</button></div>
   <blockquote>“And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.”</blockquote>
   <p>{selectedReflection==='1'?'Exactly. The confession calls for a whole-life response, not only a correct definition.':'The text takes us further: knowledge matters, but the confession calls Israel to wholehearted love.'}</p>
  </div>}
 </div>;
 if(kind==='shema-echad')return <section className="shema-resolution"><span className="shema-eyebrow">THE HEBREW WORD</span><h2>What does <em>echad</em> mean?</h2><p><em>Echad</em> means “one.” It can describe a single thing or a union, as in the “one flesh” of Genesis 2:24. That flexibility does not prove God consists of multiple divine persons.</p><p>In Deuteronomy 6:4, Israel confesses the LORD as the one God worthy of exclusive devotion. Isaiah 43:10 and 44:6 deny another God before or beside him, and Jesus reaffirms the confession in Mark 12:29. Context—not a dictionary definition alone—carries the argument.</p></section>;
 if(kind==='shema-resolution')return <div className="shema-resolution">
  <span className="shema-eyebrow">05 / THE REVELATION</span>
  <span className="shema-resolution-star" aria-hidden="true">✦</span>
  <h2>The confession is not the finish line.</h2>
  <p className="shema-resolution-hero">“Hear” opens a summons. “Our God” identifies the LORD. “One LORD” anchors the confession. And the very next verse calls for wholehearted love.</p>
  <div className="shema-resolution-bridge"><span>DEUTERONOMY 6:4</span><div aria-hidden="true">→</div><span>DEUTERONOMY 6:5</span></div>
  <p>Now you're ready to build the meaning of the words yourself, before meeting Isaiah and the New Testament witnesses.</p>
  
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
   <p>Imagine someone asks: “If two people can be <em>one flesh</em>, what does <em>one LORD</em> really mean?” Answer from Scripture, not just from a definition.</p>
  </div>
  <div className="shema-teachback-layout">
   <aside className="shema-teachback-brief" aria-label="Your evidence trail">
    <span className="shema-kicker">YOUR EVIDENCE TRAIL</span>
    <ol>
     <li><strong>Recall</strong><span>Write Deuteronomy 6:4 from memory.</span></li>
     <li><strong>Explain</strong><span>Describe <em>shema</em>, <em>echad</em>, and wholehearted love in verse 5.</span></li>
     <li><strong>Reason</strong><span>Address “one flesh” in Genesis 2:24 using context.</span></li>
     <li><strong>Connect</strong><span>Bring in Isaiah 44:6 and Mark 12:29.</span></li>
    </ol>
   </aside>
   <div className="shema-teachback-response">
    <label htmlFor="shema-written-response">Your explanation</label>
    <textarea id="shema-written-response" value={value||''} disabled={disabled} onChange={e=>onChange(e.target.value)} rows={10} placeholder="Begin with the words of Deuteronomy 6:4, then build your answer…"/>
    <div className="shema-response-footer"><span>{(value||'').trim()?value.trim().split(/\s+/).length+' words':'Your words. Your reasoning.'}</span><span>Autosaved as you write</span></div>
   </div>
  </div>
  <details className="shema-full-rubric"><summary>Read the full challenge</summary><p>{move.prompt}</p></details>
 </div>;
}
