import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '../../app/routes';
import { setBibleReaderIntent } from '../../core/bible/bibleReaderIntent';
import { getInstructionalMove, getStandardProgress, updateLearningExperience } from '../../core/classroom/learningEngine';
import { evaluateTeachingChoice, saveTeachingDecision, continueTeaching, skipTeachingMove, restartTeaching } from '../../core/classroom/teacherLedEngine';
import { askJeremiahTeacher } from '../../services/jeremiahTeacher';
import { getLessonMedia } from '../../data/curriculum/mediaCatalog';
import LessonActivity from './LessonActivity';
import ShemaExperience, { ShemaPhrasePractice, ShemaTeachBack } from './ShemaExperience';
import useLessonNarration from './useLessonNarration';
import JourneyDestinations, { DestinationArt } from './JourneyDestinations';
import './OG1LessonPlayer.css';

// Distinct contemporary people and settings for three lived-faith decisions.
// Photographs are illustrative, not depictions of the user's circumstances.
const TODAY_SCENES = [
 {src:'https://images.unsplash.com/photo-1770097286875-0cbf4ca2f8c1?auto=format&fit=crop&w=1400&q=82',alt:'Modern congregation gathered in worship',credit:'AMONWAT DUMKRUT · Unsplash',label:'YOUR WORSHIP'},
 {src:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=82',alt:'Real people collaborating at a work table',credit:'Rawpixel · Unsplash',label:'YOUR EVERYDAY CHOICES'},
 {src:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=82',alt:'Young adults gathered around a table learning and talking together',credit:'Unsplash · Everyday conversation',label:'YOUR CONVERSATIONS'}
];
function EverydayScenePhoto({index}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[index]);
 const scene=TODAY_SCENES[index]||TODAY_SCENES[0];
 return <div className="ogp-mission-photo">
  {!failed&&<img key={scene.src} src={scene.src} alt={scene.alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}
  <span>{scene.label}</span>
  {!failed&&<small>{scene.credit}</small>}
 </div>;
}

const CHAPTER_NAMES = ['The Shema','Isaiah’s Witness','The Apostolic Witness','The Difference','Living the Confession'];
const CHAPTER_SLUGS = ['shema','isaiah','continuity','distinction','devotion'];
const SCENE_DESCRIPTIONS = {
 'shema-encounter':'THE INVITATION','shema-manuscript':'THE MANUSCRIPT','shema-cinema':'THE FILM','shema-connection':'THE NEXT VERSE','shema-resolution':'THE CONNECTION',read:'THE TEXT', intro:'THE QUESTION', discovery:'INTERACTIVE STUDY', witness:'THE EVIDENCE',
 timeline:'THE THREAD', comparison:'THE DIFFERENCE', mission:'THE DECISION',
 insight:'THE INSIGHT', watch:'THE FILM', videoCheck:'LOOK CLOSER', task:'YOUR TURN'
};
const VERBS = { learn:'BEGIN', 'shema-show':'READ', 'isaiah-show':'EXAMINE', 'continuity-show':'CONNECT','distinction-show':'COMPARE','devotion-show':'APPLY' };
const TITLES = {learn:'One confession. One story.', 'shema-show':'Hear, O Israel.', 'isaiah-show':'No God before, beside, or after.', 'continuity-show':'Jesus repeats the confession.', 'distinction-show':'What is the actual disagreement?', 'devotion-show':'The confession shapes your life.'};

const DISCOVERIES={
 'learn':{question:'Where will this confession lead?',options:[['Moses','Israel hears the confession in Deuteronomy 6.'],['Prophets','Isaiah tests whether any other God exists.'],['Apostles','Jesus and the apostles carry the confession forward.']],closer:'One confession travels across the whole biblical story.'},
 'shema-show':{question:'Touch a phrase to discover its role.',options:[['HEAR','Shema is a call to listen and respond.'],['OUR GOD','The LORD is the God to whom Israel belongs.'],['ONE LORD','The confession identifies the one LORD, leading into wholehearted love.']],closer:'These are not disconnected vocabulary words. Together, they form a confession and a response.'},
 'isaiah-show':{question:'Could another god exist in any direction?',options:[['BEFORE','Isaiah 43:10: no God was formed before him.'],['BESIDE','Isaiah 44:6: no God exists beside him.'],['AFTER','Isaiah 43:10: none shall be after him.']],closer:'Isaiah excludes rivals across time and alongside the LORD.'},
 'continuity-show':{question:'Follow the confession through Scripture.',options:[['MOSES','Deuteronomy 6:4: the LORD our God is one LORD.'],['JESUS','Mark 12:29: Jesus begins with the same confession.'],['PAUL','1 Corinthians 8:4: there is none other God but one.']],closer:'The witness advances in history without replacing the confession.'},
 'distinction-show':{question:'Touch each position to see where the disagreement really is.',options:[['SHARED','Both Oneness and trinitarian theology confess one God.'],['TRINITARIAN','One divine essence in three coequal, coeternal persons.'],['ONENESS','The one God is revealed as Father, in the incarnate Son, and as Holy Spirit; no eternal plurality of divine persons.']],closer:'A fair explanation starts with what is shared, then identifies the precise difference.'},
 'devotion-show':{question:'Where does love for the one LORD become visible?',options:[['WORSHIP','The LORD receives undivided devotion.'],['CONDUCT','Honesty and care reflect allegiance beyond words.'],['MISSION','The confession shapes how believers share the gospel.']],closer:'The confession reaches beyond a correct answer into the life of the whole person.'}
};

function createMoments(move,video) {
 if(move.type==='complete')return [];
 if(move.type!=='teach')return [{kind:'task',verb:move.type==='free_response'?'EXPLAIN':move.interaction?.type==='match'?'CONNECT':'ANSWER',title:move.title}];
 if(move.id==='shema-show')return [
  {kind:'shema-encounter',verb:'ENCOUNTER',title:'Before you explain it, hear it.'},
  {kind:'shema-manuscript',verb:'EXPLORE',title:'Three phrases. One confession.'},
  ...(video?[{kind:'shema-cinema',verb:'WATCH',title:'Listen to the Shema',video}]:[]),
  {kind:'shema-connection',verb:'DISCOVER',title:'One LORD. Now what?'},
  {kind:'shema-resolution',verb:'UNDERSTAND',title:'The confession calls for a response.'}
 ];
 const moments=[];
 if(move.scripture?.length)moments.push({kind:'read',verb:VERBS[move.id]||'READ',title:TITLES[move.id]||move.title,verse:move.scripture[0]});
 else moments.push({kind:'intro',verb:'ENCOUNTER',title:TITLES[move.id]||move.title});
 const discovery=DISCOVERIES[move.id];
 if(move.id==='isaiah-show')moments.push({kind:'witness',verb:'EXAMINE THE EVIDENCE',title:'Three declarations. One conclusion.'});
 else if(move.id==='continuity-show')moments.push({kind:'timeline',verb:'FOLLOW THE THREAD',title:'Does the confession change?'});
 else if(move.id==='distinction-show')moments.push({kind:'comparison',verb:'COMPARE THE CLAIMS',title:'Both confess one God. What differs?'});
 else if(move.id==='devotion-show')moments.push({kind:'mission',verb:'MAKE A DECISION',title:'One confession. Three everyday choices.'});
 else if(discovery)moments.push({kind:'discovery',verb:'INVESTIGATE',title:discovery.question,discovery});
 if(move.teaching?.length)moments.push({kind:'insight',verb:'THE CONNECTION',title:move.id==='shema-show'?'Hear—and respond.':move.id==='isaiah-show'?'The witnesses agree.':move.id==='continuity-show'?'The confession continues.':move.id==='distinction-show'?'The disagreement has a precise meaning.':move.id==='devotion-show'?'Belief becomes allegiance.':'Carry this question forward.',text:move.teaching[0],deeper:move.teaching.slice(1)});
 if(move.id==='shema-show'&&video) {
  const film={kind:'watch',verb:'WATCH',title:'Listen to the meaning of Shema',video};
  const response=video.lessonCheck?{kind:'videoCheck',verb:'NOTICE',title:'What did you notice?',check:video.lessonCheck}:null;
  // Place the film before explanation so students discover before Jeremiah interprets.
  const read=moments.filter(m=>m.kind==='read');
  const other=moments.filter(m=>m.kind!=='read');
  return [...read,film,...(response?[response]:[]),...other];
 }
 return moments;
}

export default function OG1LessonPlayer({content,state,onStateChange,onNavigate,onUseClassic}) {
 const move=getInstructionalMove(content,state.currentMoveId);
 const video=getLessonMedia(content).find(item=>item.id==='unpacked-shema');
 const moments=createMoments(move,video);
 const [moment,setMoment]=useState(0);
 const [draft,setDraft]=useState({});
 const [mediaChoice,setMediaChoice]=useState('');
 const [discoveryChoice,setDiscoveryChoice]=useState(null);
 const [openingHeard,setOpeningHeard]=useState(false);
 const [showDepth,setShowDepth]=useState(false);
 const [evidenceIndex,setEvidenceIndex]=useState(0);
 const [caseChoice,setCaseChoice]=useState(null);
 const [practiceStep,setPracticeStep]=useState(0);
 const [thinking,setThinking]=useState(false);
 const [error,setError]=useState('');
 const [confirmRestart,setConfirmRestart]=useState(false);
 const abort=useRef(null);
 const stageRef=useRef(null);
 const priorMove=useRef(move.id);
 const finish=move.type==='complete';
 const assessment=move.type!=='teach'&&!finish;
 const written=['free_response','mastery_response'].includes(move.type);
 const matching=move.interaction?.type==='match';
 const reasoning=move.interaction?.type==='reasoning';
 const feedback=state.experience?.teachingDecision?.moveId===move.id?state.experience.teachingDecision.decision:null;
 const savedDraft=state.experience?.drafts?.[move.id]||{};
 const form={...savedDraft,...draft};
 const ready=written?Boolean(form.responseText?.trim()):matching?move.interaction.items.every(i=>form.placements?.[i.id]):reasoning?Boolean(form.claimId&&form.reasonId):Boolean(form.selectedChoiceId);
 const total=moments.length;
 const current=moments[Math.min(moment,total-1)];
 const percent=getStandardProgress(content,state);
 const chapter=move.id.split('-')[0];
 const chapterNumber=CHAPTER_SLUGS.indexOf(chapter)+1;
 const sceneClass=current?.kind||'complete';
 // Spoken moments are editorial choices, not narration of every button and quiz.
 // Reveals inside the Shema scene are voiced only when the student chooses them.
 const narrationText =
  current?.kind==='shema-encounter'||(move.id==='learn'&&current?.kind==='read')
   ? 'Hear, O Israel: The LORD our God is one LORD.'
  : current?.kind==='shema-resolution'
   ? 'Hear, O Israel. The LORD our God is one LORD. And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.'
  : current?.kind==='witness'
   ? ['Before me there was no God formed, neither shall there be after me.','Beside me there is no God.','Neither shall there be after me.'][evidenceIndex]
  : current?.kind==='timeline'
   ? ['The LORD our God is one LORD.','The Lord our God is one Lord.','There is none other God but one.'][evidenceIndex]
  : current?.kind==='discovery'&&move.id==='learn'&&discoveryChoice!==null
   ? ['Hear, O Israel: The LORD our God is one LORD. In the wilderness Moses gives the confession to Israel.','I am the first, and I am the last; and beside me there is no God. Isaiah chapter forty four, verse six.','Jesus repeats the Shema. The apostles declare, there is none other God but one.'][discoveryChoice]
  : current?.kind==='read'&&current?.verse?.text
   ? current.verse.text
  : null;
 const narration=useLessonNarration({text:narrationText,key:move.id+':'+moment+':'+evidenceIndex+':'+discoveryChoice});
 useEffect(()=>{if(priorMove.current!==move.id){priorMove.current=move.id;setMoment(0);setDraft({});setMediaChoice('');setDiscoveryChoice(null);setOpeningHeard(false);setShowDepth(false);setEvidenceIndex(0);setCaseChoice(null);setPracticeStep(0);setError('');}},[move.id]);
 useEffect(()=>()=>abort.current?.abort(),[]);
 useEffect(()=>{stageRef.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});},[move.id,moment]);
 function change(patch) {
  if(thinking||feedback)return;
  setDraft(old=>({...old,...patch}));
  onStateChange(old=>updateLearningExperience(old,{drafts:{[move.id]:{...(old.experience?.drafts?.[move.id]||{}),...patch}}}));
 }
 function readVerse(reference) {
  narration.stop();
  setBibleReaderIntent(reference,{translation:'kjv',returnRoute:ROUTES.CLASSROOM_LESSON,source:'classroom'});
  onNavigate(ROUTES.BIBLE_SUPPORT);
 }
 function advance(){if(current?.kind==='mission'&&caseChoice===null)return;if((current?.kind==='witness'||current?.kind==='timeline'||current?.kind==='comparison'||current?.kind==='mission')&&evidenceIndex<2){setEvidenceIndex(i=>i+1);setCaseChoice(null);return;}if(current?.kind==='discovery'&&discoveryChoice===null)return;if(moment<total-1){setMoment(i=>i+1);setDiscoveryChoice(null);setShowDepth(false);setEvidenceIndex(0);setCaseChoice(null);return;}if(move.type==='teach')onStateChange(old=>continueTeaching(old,content));}
 function back(){setMoment(i=>Math.max(0,i-1));setDiscoveryChoice(null);}
 function skip(){abort.current?.abort();setThinking(false);onStateChange(old=>skipTeachingMove(old,content));}
 function restart(){narration.stop();abort.current?.abort();setThinking(false);setError('');setMoment(0);setDraft({});setMediaChoice('');setDiscoveryChoice(null);setOpeningHeard(false);setShowDepth(false);setEvidenceIndex(0);setCaseChoice(null);setPracticeStep(0);setConfirmRestart(false);onStateChange(old=>restartTeaching(content,old));}
 async function check(){
  if(!ready||thinking||feedback)return;
  const answer=written?{text:form.responseText.trim()}:matching?{placements:form.placements}:reasoning?{claimId:form.claimId,reasonId:form.reasonId}:{choiceIds:[form.selectedChoiceId]};
  let decision=evaluateTeachingChoice(move,answer);
  if(!decision){
   setThinking(true);const controller=new AbortController();abort.current=controller;
   try{decision=await askJeremiahTeacher({standardId:content.standardId,moveId:move.id,learnerResponse:answer,learnerState:{completedMoveIds:state.completedMoveIds,evidenceIds:state.evidenceIds,misconceptions:state.misconceptions,attemptsByMove:state.attemptsByMove}},controller.signal);}
   catch(e){if(e.name!=='AbortError')setError('Jeremiah cannot check that response right now. Your answer is saved.');}
   finally{if(!controller.signal.aborted)setThinking(false);}
   if(controller.signal.aborted||!decision)return;
  }
  onStateChange(old=>saveTeachingDecision(old,content,move,decision));
 }
 const buttonText=current?.kind==='insight'?'Put this understanding to work':current?.kind==='watch'?'Reflect on what you saw':current?.kind==='videoCheck'?'Continue to the activity':moment===total-1?'Continue to the next activity':current?.kind==='read'&&move.id==='learn'?'Follow the confession':current?.kind==='read'?'Investigate this passage':current?.kind==='teach'?'Uncover the next connection':'Continue the journey';
 return <div className={`ogp-page ogp-theme-${chapter} ogp-scene-${sceneClass}`}>
  <header className="ogp-header">
   <button type="button" className="ogp-exit" aria-label="Return to classroom" onClick={()=>{narration.stop();onNavigate(ROUTES.CLASSROOM_STUDY)}}>← <span>CLASSROOM</span></button>
   <div className="ogp-brand"><span className="ogp-monogram" aria-hidden="true">J</span><span>JEREMIAH <small>THE ONE TRUE GOD</small></span></div>
   <div className="ogp-header-actions">
    <button type="button" className="ogp-voice-toggle" aria-pressed={narration.enabled} aria-label={narration.enabled?'Turn AI narration off':'Turn AI narration on'} disabled={!narration.supported} title={narration.supported?'Play fixed AI-generated Jeremiah narrator':'Audio playback unavailable in this browser'} onClick={narration.toggle}>
     <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{narration.enabled?<><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 6a8 8 0 0 1 0 12"/></>:<path d="m16 9 5 6m0-6-5 6"/>}</svg>
     <span>{narration.enabled?'AI voice on':'AI voice off'}</span>
    </button>
    {narration.enabled&&narrationText&&<button type="button" className="ogp-voice-replay" aria-label={narration.loading?'Preparing narration':narration.speaking?'Stop narration':'Replay narration'} title={narration.loading?'Preparing audio':narration.speaking?'Stop speaking':'Hear again'} disabled={narration.loading} onClick={()=>narration.speaking?narration.stop():narration.speak(narrationText)}>{narration.loading?'Preparing audio…':narration.speaking?'■ Stop':'↻ Replay'}</button>}
    <details className="ogp-menu"><summary aria-label="Lesson options"><span aria-hidden="true">•••</span></summary><div className="ogp-menu-panel"><button type="button" onClick={event=>{event.currentTarget.closest('details').open=false;setConfirmRestart(true)}}>↺ Start from beginning</button><button type="button" onClick={onUseClassic}>Original view</button>
     <p className="ogp-voice-note">Jeremiah uses one AI-generated narrator on every device. Audio is streamed from the app, not your phone’s voices.</p>

    </div></details>
   </div>
  </header>
  <div className="ogp-progress"><span style={{width:percent+'%'}}/></div>
  {narration.enabled&&!narration.error&&<p className="ogp-narration-disclosure">AI-generated narration · The same voice on every device</p>}
  {narration.error&&<div className="ogp-voice-error" role="status"><span>{narration.error}</span>{narrationText&&<button type="button" onClick={()=>narration.speak(narrationText)}>Replay narration</button>}</div>}
  {confirmRestart && <div className="ogp-restart-overlay" role="presentation"><section className="ogp-restart-dialog" role="dialog" aria-modal="true" aria-labelledby="ogp-restart-title"><h2 id="ogp-restart-title">Start OG.1 from the beginning?</h2><p>You'll return to the first lesson moment. Your earlier answers and learning history will be kept for review.</p><div className="ogp-restart-actions"><button type="button" className="ogp-action" onClick={restart}>Start from beginning →</button><button type="button" className="ogp-back" onClick={()=>setConfirmRestart(false)}>Keep my place</button></div></section></div>}
  <main className="ogp-shell" key={move.id}>
   <div className="ogp-context">
     <div className="ogp-context-meta"><span>{chapterNumber===0?'PROLOGUE':`CHAPTER ${String(chapterNumber).padStart(2,'0')} / 05`}</span><span className="ogp-context-line"/><span>{finish?'COMPLETE':SCENE_DESCRIPTIONS[sceneClass]||'THE JOURNEY'}</span></div>
     <div className="ogp-context-name">{chapterNumber===0?'A confession begins':CHAPTER_NAMES[chapterNumber-1]}{!finish&&<span className="ogp-scene-counter">MOMENT {String(moment+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>}</div>
     <div className="ogp-chapter-track" aria-label={chapterNumber===0?'Opening':`Chapter ${chapterNumber} of five`}>
      {CHAPTER_SLUGS.map((slug,i)=><span key={slug} className={chapterNumber>i?'is-reached':''}/>)}
     </div>
   </div>
   {finish?<section className="ogp-finish"><span className="ogp-verb">JOURNEY REVIEWED</span><h1>One Lord. One unfolding story.</h1><p>You've explored Israel's confession, Isaiah's declarations, the apostolic witness, and the call to love the Lord. Your responses remain saved for review.</p><button type="button" className="ogp-action" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>Explore another lesson →</button></section>:<>
    <section key={move.id+':'+moment} ref={stageRef} tabIndex={-1} className={`ogp-stage ogp-stage--${sceneClass}`} aria-label={current.verb+' learning moment'}>
     {(move.id!=='learn'||current.kind!=='read')&&<><span className="ogp-verb"><span className="ogp-verb-dash"/> {current.verb}</span><h1>{current.title}</h1></>}
     {current.kind?.startsWith('shema-')&&<ShemaExperience kind={current.kind} video={current.video} onOpenBible={readVerse} onSpeak={narration.speak} narrationEnabled={narration.enabled}/>}
     {current.kind==='read'&&move.id==='learn'&&<div className="ogp-encounter">
      <div className="ogp-encounter-light" aria-hidden="true"><span/><span/><span/></div>
      <div className="ogp-encounter-inner">
       <span className="ogp-encounter-tag">DEUTERONOMY 6:4 · THE CONFESSION</span>
       <div className="ogp-encounter-symbol" aria-hidden="true">אחד</div>
       <blockquote>“Hear, O Israel:<br/>The LORD our God is <button type="button" className="ogp-encounter-word" onClick={()=>setOpeningHeard(true)} aria-expanded={openingHeard}>one LORD.<span aria-hidden="true"> ✦</span></button>”</blockquote>
       <span className="ogp-encounter-reference">A declaration carried across generations.</span>
       {!openingHeard&&<p className="ogp-encounter-hint">Touch the highlighted words to discover where the story goes.</p>}
       {openingHeard&&<div className="ogp-encounter-reveal" aria-live="polite"><strong>THE DISCOVERY</strong><p>Jesus repeats this same confession in Mark 12:29. The question is not whether the story continues—it is whether the confession changes.</p></div>}
      </div>
     </div>}
     {current.kind==='read'&&move.id!=='learn'&&<div className="ogp-scripture-scene">
      <span className="ogp-scripture-ornament" aria-hidden="true">{chapter==='isaiah'||chapter==='continuity'?<DestinationArt tone={chapter==='isaiah'?'prophets':'jesus'}/>:chapter==='devotion'?'♡':'✦'}</span>
      <div className="ogp-scripture-content">
       <span className="ogp-scripture-index">SCRIPTURE · {current.verse.reference.toUpperCase()}</span>
       <blockquote className="ogp-verse">“{current.verse.text}”</blockquote>
       <span className="ogp-reference">KING JAMES VERSION</span>
       <div className="ogp-scripture-footer"><p>Read slowly. Which words carry the meaning?</p><button type="button" className="ogp-link" onClick={()=>readVerse(current.verse.reference)}>Read the full passage ↗</button></div>
      </div>
     </div>}
     {current.kind==='intro'&&<p className="ogp-thought">Let's follow the confession from Moses through the prophets and into the apostolic witness.</p>}
     {current.kind==='insight'&&<div className="ogp-insight"><span className="ogp-insight-mark" aria-hidden="true">✦</span><p className="ogp-thought">{current.text}</p>{current.deeper.length>0&&<><button type="button" className="ogp-depth-button" aria-expanded={showDepth} onClick={()=>setShowDepth(v=>!v)}>{showDepth?'Close the deeper explanation':'Explore the reasoning further'} →</button>{showDepth&&<div className="ogp-depth">{current.deeper.map((text,i)=><p key={i}>{text}</p>)}</div>}</>}</div>}
     {current.kind==='witness'&&<div className="ogp-witness">
      <p className="ogp-prompt">Isaiah's declarations rule out rival gods. Unseal the witnesses one at a time.</p>
      <div className="ogp-witness-timeline"><span className={evidenceIndex>=0?'active':''}>BEFORE</span><span className={evidenceIndex>=1?'active':''}>BESIDE</span><span className={evidenceIndex>=2?'active':''}>AFTER</span></div>
      <div className="ogp-witness-scroll" key={evidenceIndex}>
       <span>WITNESS {evidenceIndex+1} OF 3</span>
       <blockquote>{['“before me there was no God formed”','“beside me there is no God”','“neither shall there be after me”'][evidenceIndex]}</blockquote>
       <strong>{evidenceIndex===1?'ISAIAH 44:6':'ISAIAH 43:10'} · KJV</strong>
       <p>{['No earlier god produced the LORD.','No rival god stands alongside the LORD.','No later god can replace the LORD.'][evidenceIndex]}</p>
      </div>
      {evidenceIndex===2&&<p className="ogp-witness-conclusion">Three directions. One testimony: the LORD declares that there is no other God.</p>}
     </div>}
     {current.kind==='timeline'&&<div className="ogp-trail">
      <p className="ogp-prompt">Trace the confession from Moses to Jesus to Paul. Each witness adds to the story.</p>
      <div className="ogp-trail-track" role="group" aria-label="Scripture witnesses">{[['MOSES','Deuteronomy 6:4'],['JESUS','Mark 12:29'],['PAUL','1 Corinthians 8:4']].map(([name,ref],i)=><button type="button" key={name} aria-pressed={evidenceIndex===i} onClick={()=>setEvidenceIndex(i)} disabled={i>evidenceIndex}><span>{i+1}</span><strong>{name}</strong><small>{ref}</small></button>)}</div>
      <div className="ogp-trail-quote" key={evidenceIndex}><div className="ogp-trail-scene" aria-hidden="true"><DestinationArt tone={evidenceIndex===0?'moses':evidenceIndex===1?'jesus':'apostles'}/></div><span>{['THE FOUNDATION','THE REAFFIRMATION','THE APOSTOLIC APPLICATION'][evidenceIndex]}</span><blockquote>{['“The LORD our God is one LORD”','“The Lord our God is one Lord”','“there is none other God but one”'][evidenceIndex]}</blockquote><p>{['Moses gives Israel the confession.','Jesus repeats the confession when asked about the first commandment.','Paul applies the confession while confronting idols.'][evidenceIndex]}</p></div>
     </div>}
     {current.kind==='comparison'&&<div className="ogp-compare">
      <p className="ogp-prompt">Start with common ground. Then uncover the actual theological disagreement instead of assuming the other view believes in three gods.</p>
      <div className="ogp-compare-ring"><span>ONE GOD</span><small>Shared confession</small></div>
      {evidenceIndex>0&&<div className="ogp-compare-columns">
       {evidenceIndex>=1&&<section className="is-revealed"><span>TRINITARIAN TEACHING</span><h2>Three eternal persons</h2><p>One divine essence in three coequal, coeternal persons. This view does not claim there are three gods.</p></section>}
       {evidenceIndex>=2&&<section className="is-revealed"><span>APOSTOLIC ONENESS</span><h2>One undivided God</h2><p>The Father, Son through true incarnation, and Holy Spirit are understood without eternal distinctions of divine persons.</p></section>}
      </div>}
      {evidenceIndex===2&&<p className="ogp-compare-conclusion">The difference is not whether God is one. The difference concerns eternal personal distinctions and the understanding of Jesus Christ.</p>}
     </div>}
     {current.kind==='mission'&&<div className="ogp-mission">
      <p className="ogp-prompt">The Shema continues into Deuteronomy 6:5. What would wholehearted love look like beyond a spoken confession?</p>
      <div className="ogp-mission-scene ogp-mission-scene--photo">
       <EverydayScenePhoto index={evidenceIndex}/>
       <div className="ogp-mission-copy">
        <span>{['SCENE 1 · WORSHIP','SCENE 2 · CONDUCT','SCENE 3 · MISSION'][evidenceIndex]}</span>
        <h2>{['Who receives your devotion?','What happens when honesty costs you?','Who should hear this confession?'][evidenceIndex]}</h2>
        <p>{['A person offers God an hour of worship, but gives competing loyalties ultimate control of life.','A person knows that admitting a mistake will bring consequences.','A believer meets someone unfamiliar with Scripture and with a very different background.'][evidenceIndex]}</p>
       </div>
      </div>
      <div className="ogp-mission-options">{(evidenceIndex===0?['Keep worship separate from daily priorities','Let the one Lord shape every allegiance']:evidenceIndex===1?['Hide the mistake to protect your reputation','Tell the truth and take responsibility']:['Assume the message is only for people like you','Share the good news with humility and care']).map((choice,i)=><button key={choice} type="button" aria-pressed={caseChoice===i} onClick={()=>setCaseChoice(i)}>{choice}</button>)}</div>
      {caseChoice!==null&&<p className="ogp-mission-response">{caseChoice===1?['Wholehearted love involves undivided worship and allegiance.','Faithfulness extends to honest conduct, even when difficult.','The witness to one God calls believers to care about others.'][evidenceIndex]:'Consider whether that choice reflects wholehearted love for the LORD in Deuteronomy 6:5.'}</p>}
     </div>}
     {current.kind==='discovery'&&(move.id==='learn'
      ?<JourneyDestinations options={current.discovery.options} selected={discoveryChoice} onSelect={setDiscoveryChoice} onSpeak={narration.speak} onOpenBible={readVerse}/>
      :<div className="ogp-discovery"><p className="ogp-prompt">Choose what to investigate. Every path reveals a piece of the larger picture.</p><div className="ogp-discovery-choices">{current.discovery.options.map(([label,detail],i)=><button type="button" key={label} aria-pressed={discoveryChoice===i} onClick={()=>setDiscoveryChoice(i)}>{label}<span aria-hidden="true">↗</span></button>)}</div>{discoveryChoice!==null&&<div className="ogp-discovery-answer" aria-live="polite"><strong>{current.discovery.options[discoveryChoice][0]}</strong><p>{current.discovery.options[discoveryChoice][1]}</p><small>{current.discovery.closer}</small></div>}</div>)}
     {current.kind==='watch'&&<><p className="ogp-prompt">Watch for the meaning of <em>shema</em>. This is historical and language context; Jeremiah will connect it to Apostolic teaching.</p><div className="ogp-video"><iframe src={current.video.embedUrl} title={current.video.videoTitle||current.video.title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div><small>Optional · {current.video.provider} · {current.video.duration}</small></>}
     {current.kind==='videoCheck'&&<><p className="ogp-prompt">{current.check.prompt}</p><div className="ogp-options">{current.check.choices.map(c=><button type="button" key={c.id} aria-pressed={mediaChoice===c.id} onClick={()=>setMediaChoice(c.id)}>{c.label}</button>)}</div>{mediaChoice&&<p className="ogp-feedback">{mediaChoice===current.check.answerId?current.check.correctFeedback:current.check.incorrectFeedback}</p>}</>}
     {current.kind==='task'&&<>{move.id!=='shema-try'&&<p className="ogp-prompt">{move.prompt}</p>}
      {move.id==='shema-guide'?<ShemaPhrasePractice key={move.id} move={move} draft={form} feedback={feedback} onChange={change} onStepChange={setPracticeStep}/>:((matching||reasoning)&&<LessonActivity key={move.id} move={move} draft={form} feedback={feedback} onChange={change}/>)}
      {!written&&!matching&&!reasoning&&<div className="ogp-options">{(move.choices||[]).map(c=><button key={c.id} type="button" disabled={Boolean(feedback)} aria-pressed={form.selectedChoiceId===c.id} onClick={()=>change({selectedChoiceId:c.id})}>{c.label}</button>)}</div>}
      {written&&(move.id==='shema-try'?<ShemaTeachBack move={move} value={form.responseText||''} disabled={Boolean(feedback)||thinking} onChange={value=>change({responseText:value})}/>:<><textarea aria-label="Your explanation" rows={5} placeholder="Explain what the Scripture teaches in your own words." value={form.responseText||''} disabled={Boolean(feedback)||thinking} onChange={e=>change({responseText:e.target.value})}/><details className="ogp-help"><summary>Need a hint?</summary><p>Begin with the Scripture's main claim, then explain how the surrounding passages support it. Use your own words.</p></details></>)}
      {feedback&&<div className="ogp-feedback" role="status"><strong>Jeremiah responds</strong><p>{feedback.teacherMessage}</p></div>}
      {error&&<p role="alert" className="ogp-error">{error}</p>}
     </>}
    </section>
    <nav className="ogp-controls" aria-label="Lesson moment navigation">
     {assessment ? (feedback?<button type="button" className="ogp-action" onClick={()=>onStateChange(old=>continueTeaching(old,content))}>Continue →</button>:(move.id==='shema-guide'&&practiceStep<2?null:<button type="button" className="ogp-action" onClick={check} disabled={!ready||thinking}>{thinking?'Checking…':written?'Discuss my explanation':'Check my connection'} →</button>))
     :<button type="button" className="ogp-action" onClick={advance} disabled={(current?.kind==='discovery'&&discoveryChoice===null)||(current?.kind==='mission'&&caseChoice===null)}>{current?.kind==='witness'&&evidenceIndex<2?'Unseal the next witness':current?.kind==='witness'?'Follow the conclusion':current?.kind==='mission'&&evidenceIndex<2?'Try the next situation':current?.kind==='mission'?'Reflect on your choices':current?.kind==='comparison'&&evidenceIndex<2?'Reveal the next perspective':current?.kind==='comparison'?'Bring the views together':current?.kind==='timeline'&&evidenceIndex<2?['Hear Jesus reaffirm it','See how Paul applies it'][evidenceIndex]:current?.kind==='timeline'?'Bring the witnesses together':current?.kind==='shema-encounter'?'Examine the words':current?.kind==='shema-manuscript'?'Follow the story further':current?.kind==='shema-cinema'?'Discover what follows':current?.kind==='shema-connection'?'Bring the confession together':current?.kind==='shema-resolution'?'Build the confession':current?.kind==='discovery'?'Continue the discovery':buttonText} →</button>}
     {!assessment&&moment>0&&<button type="button" className="ogp-back" onClick={back}>← Previous</button>}
     {assessment&&<button type="button" className="ogp-back" onClick={skip}>Skip for now (no mastery)</button>}
    </nav>
   </>}
  </main>
 </div>;
}
