import { useEffect, useState } from 'react';
import {VISUAL_ASSETS} from '../../data/curriculum/visualCatalog';
import {createVisualBrief,chooseLessonVisual} from '../../core/classroom/visualIntelligence';
import useDiscoveredLessonVisual from './useDiscoveredLessonVisual';
import './ShemaExperience.css';
import OptionalLessonVideo from './OptionalLessonVideo';
import LessonIcon from '../../shared/lesson/LessonIcon';
import OG1ResponseWorkspace from './OG1ResponseWorkspace';

const PHRASES = [
 {id:'hear',text:'Hear, O Israel',spoken:'Hear, O Israel.',hebrew:'שְׁמַע',roman:'SHEMA · HEAR',title:'More than hearing a sound.',meaning:'The confession opens with a summons to listen and respond. The people are being addressed, not merely given information.'},
 {id:'belong',text:'The LORD our God',spoken:'The Lord our God.',hebrew:'יְהוָה אֱלֹהֵינוּ',roman:'THE LORD · OUR GOD',title:'A people and their God.',meaning:'These words identify the LORD as Israel’s covenant God. The confession is personal and communal, not an abstract number.'},
 {id:'one',text:'is one LORD',spoken:'Is one Lord.',hebrew:'יְהוָה אֶחָד',roman:'ONE LORD',title:'The heart of the confession.',meaning:'The LORD is confessed as one. Read that claim beside Isaiah’s declarations and Jesus’ repetition, rather than building everything on a dictionary definition.'}
];


// A discovery surface, not a new assessment. The parent still owns reveal order.
const ESTABLISHES = {
 hear: 'Israel is called to listen and respond to the LORD.',
 belong: '“Our God” identifies the LORD as Israel’s covenant God.',
 one: 'The confession identifies the LORD as one, read in the wider witness of Scripture.'
};

function ShemaPhraseStudy({sequenceIndex,revealedThrough,onInspect,image,onImageError,onOpenBible}) {
 const index=Math.max(0,Math.min(sequenceIndex,PHRASES.length-1));
 const phrase=PHRASES[index];
 const [connection,setConnection]=useState(null);
 useEffect(()=>{setConnection(null)},[index]);
 const continuity=connection==='Isaiah'
  ? {reference:'Isaiah 44:6',quote:'I am the first, and I am the last; and beside me there is no God.',meaning:'Isaiah says the LORD has no rival. His declaration helps explain the confession without relying on a single word alone.'}
  : {reference:'Mark 12:29',quote:'Hear, O Israel; The Lord our God is one Lord:',meaning:'Jesus reaffirms the same confession when asked for the first commandment. The New Testament does not set it aside.'};
 function exploreWithKeyboard(event) {
  const positions={ArrowLeft:index-1,ArrowRight:index+1,Home:0,End:Math.min(revealedThrough,PHRASES.length-1)};
  if(!(event.key in positions))return;
  event.preventDefault();
  const next=positions[event.key];
  if(!onInspect||next<0||next>revealedThrough||next>=PHRASES.length)return;
  event.currentTarget.parentElement.querySelectorAll('button')[next]?.focus();
  onInspect(next);
 }
 return <article className="shema-phrase-story shema-signature" aria-label="Discover the words of the Shema">
  <div className="shema-signature-scene">
   {image?<img className="shema-signature-photo" src={image.src} alt="Moses addresses the gathered people of Israel" style={{objectPosition:image.focal||'50% 38%'}} onError={onImageError} decoding="async"/>:<div className="shema-signature-fallback" aria-hidden="true"/>}
   <div className="shema-signature-scene-shade" aria-hidden="true"/>
   <header className="shema-signature-caption"><span>DEUTERONOMY 6:4 · KJV</span><span>{String(index+1).padStart(2,'0')} / 03</span></header>
   <blockquote className="shema-signature-confession">
    <div className="shema-phrase-track" role="group" aria-label="Three parts of the confession">
     {PHRASES.map((part,i)=><button type="button" key={part.id} disabled={!onInspect||i>revealedThrough} onClick={()=>onInspect(i)} onKeyDown={exploreWithKeyboard} className={i===index?'is-active':i<index?'is-complete':'is-upcoming'} aria-current={i===index?'step':undefined} aria-controls="og2-phrase-meaning">
      <span className="shema-signature-step" aria-hidden="true">{i>revealedThrough?<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="9" width="10" height="8" rx="2"/><path d="M7 9V6a3 3 0 0 1 6 0v3"/></svg>:i===index?<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 15 10-10M5 5h10v10"/></svg>:String(i+1).padStart(2,'0')}</span>
      <strong>{part.text}{i===0||i===2?':':''}</strong>
     </button>)}
    </div>
   </blockquote>
   <p className="shema-signature-invitation" role={!image?'status':undefined}>{image?'Explore the phrases as they are revealed.':'Scene unavailable. Keep exploring the words.'}</p>
  </div>
  <section id="og2-phrase-meaning" className="shema-phrase-feature shema-signature-teaching" key={phrase.id} aria-live="polite" aria-atomic="true">
   <div className="shema-signature-language"><span>THE HEBREW</span><strong className="shema-signature-hebrew" lang="he" dir="rtl">{phrase.hebrew}</strong><small>{phrase.roman}</small></div>
   <div className="shema-signature-meaning"><span className="shema-signature-kicker">THE WORDS → THE MEANING</span><h2>{phrase.title}</h2><p>{phrase.meaning}</p>
    <div className="shema-signature-establishes">
      <div className="shema-signature-establishes-head"><span>What this establishes</span>
       {index===2&&<button type="button" aria-expanded={Boolean(connection)} aria-controls="shema-continuity" onClick={()=>setConnection(old=>old?null:'Isaiah')}>Follow the evidence <span aria-hidden="true">{connection?'−':'+'}</span></button>}
      </div>
      <p>{ESTABLISHES[phrase.id]}</p>
      {index===2&&connection&&<div id="shema-continuity" className="shema-signature-continuity">
       <div role="group" aria-label="Compare biblical witnesses">{['Isaiah','Jesus'].map(name=><button key={name} type="button" aria-pressed={connection===name} onClick={()=>setConnection(name)}>{name}</button>)}</div>
       <blockquote>“{continuity.quote}”</blockquote>
       <span>{continuity.reference} · KJV</span>
       <p>{continuity.meaning}</p>
       <button type="button" className="shema-signature-source" onClick={()=>onOpenBible?.(continuity.reference)}>Read the passage in context ↗</button>
       <small>Explore freely. This is not part of your assessment.</small>
      </div>}
     </div>
   </div>
  </section>
 </article>;
}

export default function ShemaExperience({kind,sequenceIndex=0,revealedThrough=sequenceIndex,onInspect,video,onOpenBible,onSpeak,content,move}) {
 const openingBrief=createVisualBrief({content,move,placement:{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Israel receives the confession in Deuteronomy 6:4'}});
 const knownOpening=chooseLessonVisual(openingBrief,VISUAL_ASSETS).asset;
 const {asset:openingImage,onError:openingImageError}=useDiscoveredLessonVisual(openingBrief,knownOpening);

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
   <div className="shema-opening-actions"><button type="button" className="shema-opening-listen" onClick={()=>onSpeak?.('Hear, O Israel: The LORD our God is one LORD.')}><LessonIcon name="play"/> Hear the Scripture</button><button type="button" className="shema-artifact-link" onClick={()=>onOpenBible?.('Deuteronomy 6:4')}>Read in context <LessonIcon name="context"/></button></div>
  </div>
  <div className="shema-world-footer"><span>THE ONE LORD · DEUTERONOMY 6</span><span aria-hidden="true">✦</span></div>
 </div>;

 if(kind==='shema-manuscript')return <ShemaPhraseStudy sequenceIndex={sequenceIndex} revealedThrough={revealedThrough} onInspect={onInspect} image={openingImage} onImageError={openingImageError} onOpenBible={onOpenBible}/>;

 if(kind==='shema-cinema')return <div className="shema-cinema">
  <div className="shema-cinema-top"><span className="shema-eyebrow">A SHORT FILM · LISTENING IN CONTEXT</span><span className="shema-film-time">{video?.duration||'SHORT FILM'}</span></div>
  <h2>What does it mean to <em>hear?</em></h2>
  <p>Notice how Scripture connects listening with responding. Jeremiah will return to the text afterward.</p>
  <div className="shema-cinema-frame"><OptionalLessonVideo video={video}/></div>
  <div className="shema-film-footer"><span>{video?.provider||'Optional educational context'}</span><span>Optional viewing · Continue when ready</span></div>
 </div>;

 if(kind==='shema-connection')return <div className="shema-verse-bridge">
  <div className="shema-bridge-heading"><span>READ THEM TOGETHER</span><h2>One confession. <em>One response.</em></h2><p>The next verse tells Israel what knowing the one LORD calls for.</p></div>
  <div className="shema-bridge-panels">
   <article className="shema-bridge-panel shema-bridge-panel--confession">
    <span>01 · THE CONFESSION</span>
    <blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote>
    <button type="button" onClick={()=>onOpenBible?.('Deuteronomy 6:4')}>Deuteronomy 6:4 · Read in context <LessonIcon name="context"/></button>
   </article>
   <div className="shema-bridge-arrow" aria-hidden="true">→</div>
   <article className="shema-bridge-panel shema-bridge-panel--response">
    <span>02 · THE RESPONSE</span>
    <blockquote>“And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.”</blockquote>
    <button type="button" onClick={()=>onOpenBible?.('Deuteronomy 6:5')}>Deuteronomy 6:5 · Read in context <LessonIcon name="context"/></button>
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

export function ShemaTeachBack(props) {
 return <OG1ResponseWorkspace {...props} title="Can you teach the confession?" guidance={
   <aside className="shema-teachback-brief" aria-label="Your evidence trail">
    <span className="shema-kicker">YOUR EVIDENCE TRAIL</span>
    <ol>
     <li><strong>Remember</strong><span>You completed a separate Deuteronomy 6:4 memory check. Now explain its meaning.</span></li>
     <li><strong>Explain</strong><span>Describe <em>shema</em>, <em>echad</em>, and wholehearted love in verse 5.</span></li>
     <li><strong>Reason</strong><span>Address “one flesh” in Genesis 2:24 using context.</span></li>
     <li><strong>Connect</strong><span>Bring in Isaiah 44:6 and Mark 12:29.</span></li>
    </ol>
   </aside>
 }/>;
}
