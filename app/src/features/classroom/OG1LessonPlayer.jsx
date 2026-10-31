import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '../../app/routes';
import OG1InlineBible from './OG1InlineBible';
import { getInstructionalMove, getStandardProgress, updateLearningExperience } from '../../core/classroom/learningEngine';
import { evaluateTeachingChoice, saveTeachingDecision, continueTeaching, skipTeachingMove, restartTeaching } from '../../core/classroom/teacherLedEngine';
import { askJeremiahTeacher } from '../../services/jeremiahTeacher';
import { getLessonMedia } from '../../data/curriculum/mediaCatalog';
import { VISUAL_ASSETS } from '../../data/curriculum/visualCatalog';
import {createVisualBrief,chooseLessonVisual} from '../../core/classroom/visualIntelligence';
import useDiscoveredLessonVisual from './useDiscoveredLessonVisual';
import LessonActivity from './LessonActivity';
import ShemaExperience, { ShemaPhrasePractice, ShemaTeachBack } from './ShemaExperience';
import useLessonNarration from './useLessonNarration';
import JourneyDestinations, { DestinationArt } from './JourneyDestinations';
import {OG1IdentityInvestigation,OG1ReturnToShema,OG1ConsequenceJourney,OG1FinalSynthesis} from './OG1StoryClimax';
import OG1ExitExam from './OG1ExitExam';
import {rateOG1Lesson} from '../../core/classroom/og1LessonRating';
import {OG1JourneyMap,OG1_JOURNEY_CHAPTERS} from './OG1JourneyMap';
import {OG1_EXIT_EXAM_VERSION} from '../../data/curriculum/og1ExitExam';
import './OG1LessonPlayer.css';
import './OG1ThemeConsistency.css';

// These are instructional purposes, not image IDs or keyword searches.
// Broad worship may use broad imagery; specific evidence must match the
// passage/subject. A missing or broken image is never replaced by Moses.
const APPLICATION_MOMENTS = [
 {intent:'general',topic:'worship',learningGoal:'Undivided worship of the one LORD',label:'UNDIVIDED WORSHIP'},
 {intent:'concept',topic:'wholehearted love',reference:'Deuteronomy 6:5',
  learningGoal:'Loving the LORD with heart, soul and might',label:'WHOLEHEARTED LOVE'},
 {intent:'historical',subject:'Paul',reference:'1 Corinthians 8:4',
  learningGoal:'Paul teaches the early church about the one God',label:'ONE GOSPEL'}
];
function BiblicalApplicationArt({index,content,move}) {
 const placement=APPLICATION_MOMENTS[index];
 const brief=placement?createVisualBrief({content,move,placement}):null;
 const approved=brief?chooseLessonVisual(brief,VISUAL_ASSETS).asset:null;
 const {asset:visual,onError}=useDiscoveredLessonVisual(brief,approved);
 return <div className="ogp-mission-photo">
  {visual?<img key={visual.id} src={visual.src} alt={visual.alt}
    style={{objectPosition:visual.focal||'50% 40%'}} loading="lazy" decoding="async"
    onError={onError}/>:<div className="ogp-mission-graphic" role="img"
    aria-label={placement?.learningGoal||'Scripture teaching'}>
    <strong>{placement?.label}</strong><span>ONE LORD</span>
    <small>{placement?.reference||'SCRIPTURE & LIFE'}</small>
   </div>}
  <span>{placement?.label||'THE LESSON'}</span>


 </div>;
}

// A specific named scene requires matching evidence. A broadly applicable
// command (like Deut. 6:5) may use an everyday, purpose-matched photograph.
// This accepts authored visualPlacement metadata from *any* standard.
function readingVisualPlacement(verse) {
 if(verse.visualPlacement)return verse.visualPlacement;
 const reference=String(verse.reference||'').trim();
 if(/^Deuteronomy 6:5\b/i.test(reference))return {
  intent:'concept',topic:'heart soul might',reference:'Deuteronomy 6:5',
  learningGoal:'Deuteronomy 6:5 calls for wholehearted love for the LORD'};
 if(/^Exodus 20:3(?:-|–|—|$)/i.test(reference))return {
  intent:'concept',topic:'exclusive worship',reference:'Exodus 20:3-5',
  learningGoal:'Exclusive worship means no rival gods or idols'};
 return {intent:'scripture',reference,learningGoal:'Understand '+reference+' in context'};
}
function ScriptureArt({verse,content,move}) {
 const placement=readingVisualPlacement(verse);
 const brief=createVisualBrief({content,move,placement});
 const approved=chooseLessonVisual(brief,VISUAL_ASSETS).asset;
 const {asset:visual,onError}=useDiscoveredLessonVisual(brief,approved);
 if(visual)return <img key={visual.id} className="ogp-verse-photo" src={visual.src}
  alt={visual.alt} loading="lazy" decoding="async"
  style={{objectPosition:visual.focal||'50% 45%'}} onError={onError}/>;
 // Unsupported or temporarily unavailable imagery gets designed Scripture
 // typography, never a misleading image of the wrong biblical figure.
 const parts=String(verse.reference||'').split(/\s+(?=\d)/);
 return <div className="ogp-verse-graphic" role="img"
  aria-label={'Scripture graphic for '+verse.reference}>
  <span>THE WORD</span><strong>{parts.slice(-1)[0]||'SCRIPTURE'}</strong>
  <small>{parts.slice(0,-1).join(' ')||verse.reference}</small><i aria-hidden="true">✦</i>
 </div>;
}

// Reading notes are shown only when real commentary exists.
function readingCommentary(note='') {
 const cleaned=String(note).replace(/^KJV(?:\s+excerpt(?:\s+from\s+verse\s+\d+)?)?\.\s*/i,'').trim();
 return cleaned || null;
}

const CHAPTER_NAMES=OG1_JOURNEY_CHAPTERS.map(chapter=>chapter.title);
const CHAPTER_SLUGS=OG1_JOURNEY_CHAPTERS.map(chapter=>chapter.id);
const SCENE_DESCRIPTIONS = {
 roadmap:'YOUR PATH', 'shema-encounter':'THE INVITATION','shema-manuscript':'THE MANUSCRIPT','shema-cinema':'THE FILM','shema-connection':'THE NEXT VERSE','shema-resolution':'THE CONNECTION',read:'THE TEXT', intro:'THE QUESTION', discovery:'INTERACTIVE STUDY', witness:'THE EVIDENCE',
 timeline:'THE THREAD', identity:'THE DOCTRINAL QUESTION', comparison:'THE DISTINCT EXPLANATIONS', return:'THE CONFESSION AND RESPONSE', mission:'THE CONSEQUENCES',
 insight:'THE INSIGHT', watch:'THE FILM', videoCheck:'LOOK CLOSER', task:'YOUR TURN'
};
const VERBS = { learn:'BEGIN', 'shema-show':'READ', 'isaiah-show':'EXAMINE', 'continuity-show':'CONNECT','distinction-show':'COMPARE','devotion-show':'APPLY' };
const TITLES = {learn:'One confession. One story.', 'shema-show':'Hear, O Israel.', 'isaiah-show':'No God before, beside, or after.', 'continuity-show':'Jesus repeats the confession.', 'distinction-show':'What is the actual disagreement?', 'devotion-show':'The confession shapes your life.'};

const DISCOVERIES={
 'learn':{question:'Where will this confession lead?',options:[['Moses','Moses calls Israel to hear that the LORD our God is one LORD.'],['Isaiah','Isaiah declares there is no God before, beside, or after the LORD.'],['Jesus','Jesus repeats the Shema as the first commandment in Mark 12:29.'],['Paul','Paul teaches the church that there is none other God but one.']],closer:'From Moses to Isaiah, Jesus, and Paul, the confession remains one.'},
 'shema-show':{question:'Touch a phrase to discover its role.',options:[['HEAR','Shema is a call to listen and respond.'],['OUR GOD','The LORD is the God to whom Israel belongs.'],['ONE LORD','The confession identifies the one LORD, leading into wholehearted love.']],closer:'These are not disconnected vocabulary words. Together, they form a confession and a response.'},
 'isaiah-show':{question:'Could another god exist in any direction?',options:[['BEFORE','Isaiah 43:10: no God was formed before him.'],['BESIDE','Isaiah 44:6: no God exists beside him.'],['AFTER','Isaiah 43:10: none shall be after him.']],closer:'Isaiah excludes rivals across time and alongside the LORD.'},
 'continuity-show':{question:'Follow the confession through Scripture.',options:[['MOSES','Deuteronomy 6:4: the LORD our God is one LORD.'],['JESUS','Mark 12:29: Jesus begins with the same confession.'],['PAUL','1 Corinthians 8:4: there is none other God but one.']],closer:'The witness advances in history without replacing the confession.'},
 'distinction-show':{question:'Touch each position to see where the disagreement really is.',options:[['SHARED','Both Oneness and trinitarian theology confess one God.'],['TRINITARIAN','One divine essence in three coequal, coeternal persons.'],['ONENESS','The one God is revealed as Father, in the incarnate Son, and as Holy Spirit; no eternal plurality of divine persons.']],closer:'A fair explanation starts with what is shared, then identifies the precise difference.'},
 'devotion-show':{question:'What response follows the confession?',options:[['WORSHIP','The LORD alone receives worship; no rival god shares devotion.'],['LOVE','Deuteronomy 6:5 commands love with all heart, soul and might.'],['WITNESS','The one Lord is proclaimed in one gospel to all people.']],closer:'This chapter applies OG.1.5: exclusive devotion, covenantal faithfulness and the witness of the one gospel.'}
};

function createMoments(move,video) {
 if(move.type==='complete')return [];
 if(move.type!=='teach')return [{kind:'task',verb:move.type==='free_response'?'EXPLAIN':move.interaction?.type==='match'?'CONNECT':'ANSWER',title:move.title}];
 if(move.id==='shema-show')return [
  {kind:'shema-encounter',verb:'ENCOUNTER',title:'Before you explain it, hear it.'},
  {kind:'shema-manuscript',verb:'EXPLORE',title:'Three phrases. One confession.'},
  ...(video?[{kind:'shema-cinema',verb:'WATCH',title:'Listen to the Shema',video}]:[]),
  {kind:'shema-connection',verb:'DISCOVER',title:'One LORD. Now what?'},
  {kind:'shema-resolution',verb:'UNDERSTAND',title:'The confession calls for a response.'},
  {kind:'shema-echad',verb:'UNDERSTAND',title:'What does echad mean?'}
 ];
 const moments=[];
 if(move.scripture?.length)moments.push({kind:'read',verb:VERBS[move.id]||'READ',title:TITLES[move.id]||move.title,verse:move.scripture[0]});
 else moments.push({kind:'intro',verb:'ENCOUNTER',title:TITLES[move.id]||move.title});
 // Exactly one roadmap moment follows the initial Scripture encounter.
 // The journey is shown in compact progress notices, not a separate slide.
 const discovery=DISCOVERIES[move.id];
 if(move.id==='isaiah-show')moments.push({kind:'witness',verb:'EXAMINE THE EVIDENCE',title:'Three declarations. One conclusion.'});
 else if(move.id==='continuity-show')moments.push({kind:'timeline',verb:'FOLLOW THE THREAD',title:'Does the confession change?'});
 else if(move.id==='distinction-show')moments.push({kind:'identity',verb:'EXAMINE THE QUESTIONS',title:'Three texts. Two explanations.'},{kind:'comparison',verb:'COMPARE THE CLAIMS',title:'Where the interpretations differ.'});
 else if(move.id==='devotion-show'){moments.unshift({kind:'return',verb:'RETURN TO THE BEGINNING',title:'Deuteronomy 6:4 leads to verse 5.'});moments.push({kind:'mission',verb:'FOLLOW THE CONSEQUENCES',title:'One Lord. An undivided response.'});}
 else if(discovery)moments.push({kind:'discovery',verb:'INVESTIGATE',title:discovery.question,discovery});
 if(move.teaching?.length)move.teaching.forEach((text,index)=>moments.push({kind:'insight',verb:'THE CONNECTION',title:index===0?'The connection':'Follow the reasoning',text,deeper:[]}));
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

export default function OG1LessonPlayer({content,state,onStateChange,onNavigate}) {
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
 const [consequenceRevealed,setConsequenceRevealed]=useState(false);
 const [practiceStep,setPracticeStep]=useState(0);
 const [thinking,setThinking]=useState(false);
 const [error,setError]=useState('');
 const [confirmRestart,setConfirmRestart]=useState(false);
 const [inlineBibleReference,setInlineBibleReference]=useState(null);
 const [examReviewOpen,setExamReviewOpen]=useState(false);
 const [completionScreen,setCompletionScreen]=useState('exam');
 const [showJourneyMap,setShowJourneyMap]=useState(false);
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
 const examPassed=Boolean(state.experience?.exitExam?.version===OG1_EXIT_EXAM_VERSION && state.experience?.exitExam?.passed);
 const finalRating=finish?rateOG1Lesson(content,state):null;
 const displayProgress=finish?100:percent;
 const chapter=move.id.split('-')[0];
 const chapterNumber=CHAPTER_SLUGS.indexOf(chapter)+1;
 const activeJourneyChapter=finish?(examPassed?7:6):chapterNumber;
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
   ? ['Hear, O Israel: The LORD our God is one LORD. Deuteronomy chapter six, verse four. Moses calls Israel to hear and respond to the one LORD.','I am the first, and I am the last; and beside me there is no God. Isaiah chapter forty four, verse six. The LORD declares that no other God exists beside him.','Hear, O Israel; The Lord our God is one Lord. Mark chapter twelve, verse twenty-nine. Jesus reaffirms the confession when asked about the first commandment.','There is none other God but one. First Corinthians chapter eight, verse four. Paul carries the confession into his teaching about idols and the one God.'][discoveryChoice]
  : current?.kind==='identity'&&moment===0
   ? 'Jesus Christ stands at the center of this question. We will examine how the Scriptures speak about the one God and the incarnation.'
  : current?.kind==='comparison'&&evidenceIndex===0
   ? 'Two explanations now come into view. Listen closely to what each actually teaches before considering their differences.'
  : current?.kind==='mission'&&evidenceIndex===0
   ? 'The confession of one God is more than a statement to remember. It calls us to wholehearted devotion.'
  : current?.kind==='return'&&moment===0
   ? 'We return to the words of Moses. Hear, O Israel: the LORD our God is one LORD.'
  : current?.kind==='read'&&move.id==='learn'&&current?.verse?.text
   ? current.verse.text
  : null;
 const narration=useLessonNarration({text:narrationText,key:move.id+':'+moment+':'+evidenceIndex+':'+discoveryChoice});
 useEffect(()=>{if(priorMove.current!==move.id){priorMove.current=move.id;setMoment(0);setDraft({});setMediaChoice('');setDiscoveryChoice(null);setOpeningHeard(false);setShowDepth(false);setEvidenceIndex(0);setConsequenceRevealed(false);setPracticeStep(0);setShowJourneyMap(false);setError('');}},[move.id]);
 useEffect(()=>()=>abort.current?.abort(),[]);
 useEffect(()=>{stageRef.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});},[move.id,moment]);
 function change(patch) {
  if(thinking||feedback)return;
  setDraft(old=>({...old,...patch}));
  onStateChange(old=>updateLearningExperience(old,{drafts:{[move.id]:{...(old.experience?.drafts?.[move.id]||{}),...patch}}}));
 }
 function readVerse(reference) {
  narration.stop();
  setInlineBibleReference(reference);
 }
 function advance(){if(current?.kind==='mission'&&evidenceIndex<2){setEvidenceIndex(i=>i+1);return;}if((current?.kind==='witness'||current?.kind==='timeline'||current?.kind==='comparison')&&evidenceIndex<2){setEvidenceIndex(i=>i+1);return;}if(current?.kind==='videoCheck'&&!mediaChoice){setError('Choose an answer before continuing. It does not need to be correct.');return;}if(current?.kind==='shema-manuscript'&&evidenceIndex<2){setEvidenceIndex(i=>i+1);return;}if(current?.kind==='discovery'&&evidenceIndex<((move.id==='learn')?3:current.discovery.options.length-1)){setEvidenceIndex(i=>i+1);return;}if(moment<total-1){setError('');setMoment(i=>i+1);setDiscoveryChoice(null);setShowDepth(false);setEvidenceIndex(0);setConsequenceRevealed(false);return;}if(move.type==='teach')onStateChange(old=>continueTeaching(old,content));}
 function back(){setMoment(i=>Math.max(0,i-1));setDiscoveryChoice(null);}
 function skip(){abort.current?.abort();setThinking(false);onStateChange(old=>skipTeachingMove(old,content));}
 function restart(){narration.stop();abort.current?.abort();setThinking(false);setError('');setMoment(0);setDraft({});setMediaChoice('');setDiscoveryChoice(null);setOpeningHeard(false);setShowDepth(false);setEvidenceIndex(0);setConsequenceRevealed(false);setPracticeStep(0);setShowJourneyMap(false);setConfirmRestart(false);onStateChange(old=>restartTeaching(content,old));}
 async function check(){
  if(thinking||feedback)return;
  const anyAnswer=ready;
  if(!anyAnswer){setError('Please answer this question before continuing. Your answer does not have to be correct.');return;}
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
 const buttonText=current?.kind==='roadmap'?'Meet the four witnesses':current?.kind==='insight'?(move.id==='distinction-show'?'Finish the doctrinal investigation':move.id==='devotion-show'?'Bring the whole lesson together':'Carry this understanding forward'):current?.kind==='watch'?'Reflect on what you saw':current?.kind==='videoCheck'?'Continue to the activity':moment===total-1?'Continue to the next activity':current?.kind==='read'&&move.id==='learn'?'See your journey':current?.kind==='read'?'Investigate this passage':current?.kind==='teach'?'Uncover the next connection':'Continue the journey';
 return <div className={`ogp-page ogp-theme-${chapter} ogp-scene-${sceneClass}`}>
  <header className="ogp-header">
   <button type="button" className="ogp-exit" aria-label="Return to classroom" onClick={()=>{narration.stop();onNavigate(ROUTES.CLASSROOM_STUDY)}}>← <span>CLASSROOM</span></button>
   <div className="ogp-brand"><span className="ogp-monogram" aria-hidden="true">J</span><span>JEREMIAH <small>THE ONE TRUE GOD</small></span></div>
   <div className="ogp-header-actions">
    <button type="button" className="ogp-start-over" onClick={()=>setConfirmRestart(true)}>↺ Start over</button>
    <button type="button" className="ogp-narration-setting" aria-pressed={narration.enabled} aria-label={narration.enabled?'Turn narration off':'Turn narration on'} onClick={narration.toggle}>{narration.enabled?'Narration on':'Narration off'}</button>
    {narration.enabled&&narrationText&&<button type="button" className="ogp-voice-replay" aria-label={narration.loading?'Preparing narration':narration.speaking?'Stop narration':'Replay narration'} title={narration.loading?'Preparing audio':narration.speaking?'Stop speaking':'Hear again'} disabled={narration.loading} onClick={()=>narration.speaking?narration.stop():narration.speak(narrationText)}>{narration.loading?'Preparing audio…':narration.speaking?'■ Stop':'↻ Replay'}</button>}
   </div>
  </header>
  <div className="ogp-progress" role="progressbar" aria-label="OG.1 learning journey" aria-valuemin={0} aria-valuemax={100} aria-valuenow={displayProgress}><span style={{width:displayProgress+'%'}}/></div>
  {narration.enabled&&!narration.error&&<p className="ogp-narration-disclosure">AI-generated narration · Ash on every device</p>}
  {narration.error&&<div className="ogp-voice-error" role="status"><span>{narration.error}</span>{narrationText&&<button type="button" onClick={()=>narration.speak(narrationText)}>Replay narration</button>}</div>}
  {confirmRestart && <div className="ogp-restart-overlay" role="presentation"><section className="ogp-restart-dialog" role="dialog" aria-modal="true" aria-labelledby="ogp-restart-title"><h2 id="ogp-restart-title">Start OG.1 from the beginning?</h2><p>You'll return to the first lesson moment. Your earlier answers and learning history will be kept for review.</p><div className="ogp-restart-actions"><button type="button" className="ogp-action" onClick={restart}>Start from beginning →</button><button type="button" className="ogp-back" onClick={()=>setConfirmRestart(false)}>Keep my place</button></div></section></div>}
  <main className="ogp-shell" key={move.id}>
   <div className="ogp-context">
     <div className="ogp-context-meta"><span>{finish?(examPassed?'LESSON COMPLETE':'FINAL ASSESSMENT'):chapterNumber===0?'PROLOGUE':`CHAPTER ${String(chapterNumber).padStart(2,'0')} / 05`}</span><span className="ogp-context-line"/><span>{finish?(examPassed?'COMPLETE':'EXIT EXAM'):SCENE_DESCRIPTIONS[sceneClass]||'THE JOURNEY'}</span></div>
     <div className="ogp-context-name">{finish?(examPassed?'OG.1 · Completed':'OG.1 · Exit exam'):chapterNumber===0?'A confession begins':CHAPTER_NAMES[chapterNumber-1]}{!finish&&<span className="ogp-scene-counter">MOMENT {String(moment+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>}</div>
     <div className="ogp-study-tools">{(finish||move.id!=='learn'||moment>1)&&<button type="button" className="ogp-study-link" aria-expanded={showJourneyMap} aria-controls="og1-journey-recap" onClick={()=>setShowJourneyMap(v=>!v)}>◇ {showJourneyMap?'Hide journey':'Journey'} <span aria-hidden="true">{showJourneyMap?'−':'↗'}</span></button>}</div>
     <div className="ogp-chapter-track" aria-label={finish?'All five lesson chapters completed':chapterNumber===0?'Opening':`Chapter ${chapterNumber} of five`}>
      {CHAPTER_SLUGS.map((slug,i)=><span key={slug} className={finish||chapterNumber>i?'is-reached':''}/>)}
     </div>
   </div>
   {(finish||move.id!=='learn'||moment>1)&&<div id="og1-journey-recap" className="og1-journey-map-recap" hidden={!showJourneyMap}><OG1JourneyMap activeChapter={activeJourneyChapter} compact/></div>}
   {finish?(completionScreen==='understanding'?<section className="ogp-finish ogp-finish--understanding" aria-labelledby="ogp-understanding-title">
 <div className="ogp-depth-report"><span className="ogp-understanding-eyebrow">YOUR LEARNING · OG.1</span><h1 id="ogp-understanding-title">Your Understanding</h1><p className="ogp-understanding-level">Level {finalRating.level} · {finalRating.label}</p><p>Weighted performance: {finalRating.score===null?'Not assessed':finalRating.score+'%'} · Evidence coverage: {finalRating.coverage}%</p><p>{finalRating.meaning}</p><p>{finalRating.note}</p><div className="ogp-depth-report-list">{finalRating.standards.map(item=><div key={item.standardId}><strong>{item.standardId}</strong><span>Level {item.level} · {item.label}</span><small>Weighted performance: {item.score===null?'Not assessed':item.score+'%'} · Evidence coverage: {item.coverage}%</small><p>{item.meaning}</p><small><strong>What you demonstrated:</strong> {item.evidence}</small><small><strong>What to work on next:</strong> {item.nextStep}</small></div>)}</div></div>
 <div className="ogp-finish-actions"><button type="button" className="ogp-action" onClick={()=>{setCompletionScreen('summary');window.scrollTo({top:0,behavior:'auto'})}}>Continue to final summary →</button><button type="button" className="ogp-back" onClick={()=>setCompletionScreen('exam')}>Review assessment ↗</button></div>
 </section>:completionScreen==='summary'?<section className="ogp-finish ogp-finish--synthesis" aria-label="Final lesson summary"><OG1FinalSynthesis onOpenBible={readVerse}/><div className="ogp-finish-actions"><button type="button" className="ogp-action" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>Explore another lesson →</button><button type="button" className="ogp-back" onClick={()=>{setCompletionScreen('understanding');window.scrollTo({top:0,behavior:'auto'})}}>← Review your understanding</button></div></section>:<OG1ExitExam state={state} onStateChange={onStateChange} onReadBible={readVerse} onSubmitted={()=>setExamReviewOpen(true)} onContinue={()=>{setCompletionScreen('understanding');window.scrollTo({top:0,behavior:'auto'})}}/>):<>
    <section key={move.id+':'+moment} ref={stageRef} tabIndex={-1} className={`ogp-stage ogp-stage--${sceneClass}`} aria-label={current.verb+' learning moment'}>
     {(move.id!=='learn'||current.kind!=='read')&&!['identity','return','mission','roadmap'].includes(current.kind)&&<><span className="ogp-verb"><span className="ogp-verb-dash"/> {current.verb}</span><h1>{current.title}</h1></>}
     {current.kind==='roadmap'&&null}
     {current.kind?.startsWith('shema-')&&<ShemaExperience content={content} move={move} kind={current.kind} sequenceIndex={evidenceIndex} video={current.video} onOpenBible={readVerse} onSpeak={narration.speak} narrationEnabled={narration.enabled}/>}
     {current.kind==='read'&&move.id==='learn'&&<div className="ogp-encounter">
      <div className="ogp-encounter-art" aria-hidden="true"><DestinationArt tone="shema-encounter" content={content} move={move}/></div>
      <div className="ogp-encounter-light" aria-hidden="true"><span/><span/><span/></div>
      <div className="ogp-encounter-inner">
       <span className="ogp-encounter-tag">DEUTERONOMY 6:4 · THE CONFESSION</span>
       <div className="ogp-encounter-symbol" aria-hidden="true">אחד</div>
       <blockquote>“Hear, O Israel:<br/>The LORD our God is <strong className="ogp-encounter-word">one LORD.</strong>”</blockquote>
       <span className="ogp-encounter-reference">A declaration carried across generations.</span>
       
       {<div className="ogp-encounter-reveal" aria-live="polite"><strong>THE DISCOVERY</strong><p>Jesus repeats this same confession in Mark 12:29. The question is not whether the story continues—it is whether the confession changes.</p></div>}
      </div>
     </div>}
     {current.kind==='read'&&move.id!=='learn'&&<div className="ogp-scripture-scene">
      <div className="ogp-scripture-ornament" aria-hidden="true"><ScriptureArt content={content} move={move} verse={current.verse}/></div>
      <div className="ogp-scripture-content">
       <span className="ogp-scripture-index">{current.verse.reference.toUpperCase()} · KJV</span>
       <blockquote className="ogp-verse">“{current.verse.text}”</blockquote>
       {readingCommentary(current.verse.note)&&<p className="ogp-scripture-commentary">{readingCommentary(current.verse.note)}</p>}
       <div className="ogp-scripture-footer"><button type="button" className="ogp-link" onClick={()=>readVerse(current.verse.reference)}>Read in context ↗</button></div>
      </div>
     </div>}
     {current.kind==='intro'&&<p className="ogp-thought">Let's follow the confession from Moses through the prophets and into the apostolic witness.</p>}
     {current.kind==='insight'&&<div className="ogp-insight"><span className="ogp-insight-mark" aria-hidden="true">✦</span><p className="ogp-thought">{current.text}</p></div>}
     {current.kind==='witness'&&<div className="ogp-witness">
      <p className="ogp-prompt">Isaiah makes three connected claims. Reveal each one and see how the evidence fits together.</p>
      <div className="ogp-witness-timeline" role="group" aria-label="Isaiah's three declarations">
       {['BEFORE','BESIDE','AFTER'].map((label,i)=><button type="button" key={label} className={evidenceIndex===i?'active':''} aria-pressed={evidenceIndex===i} disabled={i>evidenceIndex} onClick={()=>setEvidenceIndex(i)}>
        <span className="ogp-witness-number">0{i+1}</span><strong>{label}</strong>
        <small>{i<evidenceIndex?'Review':i===evidenceIndex?'Now exploring':'Next'}</small>
       </button>)}
      </div>
      <div className="ogp-witness-scroll" key={evidenceIndex}>
       <div className="ogp-witness-art" aria-hidden="true"><DestinationArt tone="isaiah-manuscript"
          content={content} move={move} placement={{intent:'artifact',reference:'Isaiah 44:6',
           learningGoal:'Inspect the later ancient manuscript witness to Isaiah’s declarations'}}/></div>
       <div className="ogp-witness-copy">
        <span>ISAIAH'S TESTIMONY · {String(evidenceIndex+1).padStart(2,'0')} / 03</span>
        <blockquote>{['“before me there was no God formed”','“beside me there is no God”','“neither shall there be after me”'][evidenceIndex]}</blockquote>
        <strong>{evidenceIndex===1?'ISAIAH 44:6':'ISAIAH 43:10'} · KJV</strong>
        <p>{['No earlier god produced the LORD.','No rival god stands alongside the LORD.','No later god can replace the LORD.'][evidenceIndex]}</p>
       </div>
      </div>
      {evidenceIndex===2&&<p className="ogp-witness-conclusion">Three directions. One testimony: the LORD declares that there is no other God.</p>}
     </div>}
     {current.kind==='timeline'&&<div className="ogp-trail">
      <p className="ogp-prompt">Trace the confession from Moses to Jesus to Paul. Each witness adds to the story.</p>
      <div className="ogp-trail-track" role="group" aria-label="Scripture witnesses">{[['MOSES','Deuteronomy 6:4','moses'],['JESUS','Mark 12:29','jesus'],['PAUL','1 Corinthians 8:4','apostles']].map(([name,ref,tone],i)=><button type="button" key={name} aria-pressed={evidenceIndex===i} onClick={()=>setEvidenceIndex(i)} disabled={i>evidenceIndex}>
       <span className="ogp-trail-thumb"><DestinationArt tone={tone} content={content} move={move}/><span className="ogp-trail-order">0{i+1}</span></span>
       <strong>{name}</strong><small>{ref}</small>
      </button>)}</div>
      <div className="ogp-trail-quote" key={evidenceIndex}><div className="ogp-trail-scene" aria-hidden="true"><DestinationArt tone={evidenceIndex===0?'moses-trail':evidenceIndex===1?'jesus-trail':'apostles-trail'} content={content} move={move}/></div><span>{['THE FOUNDATION','THE REAFFIRMATION','THE APOSTOLIC APPLICATION'][evidenceIndex]}</span><blockquote>{['“The LORD our God is one LORD”','“The Lord our God is one Lord”','“there is none other God but one”'][evidenceIndex]}</blockquote><p>{['Moses gives Israel the confession.','Jesus repeats the confession when asked about the first commandment.','Paul applies the confession while confronting idols.'][evidenceIndex]}</p></div>
     </div>}
     {current.kind==='identity'&&<OG1IdentityInvestigation onOpenBible={readVerse}/>}
     {current.kind==='return'&&<OG1ReturnToShema onOpenBible={readVerse}/>}
     {current.kind==='comparison'&&<div className="ogp-compare">
      <p className="ogp-prompt">A distinct doctrinal investigation: both explanations confess one God. Explore how they understand Father, Son, and Holy Spirit without misrepresenting either view.</p>
      <div className="ogp-compare-ring"><span>ONE GOD</span><small>Shared confession</small></div>
      {evidenceIndex>0&&<div className="ogp-compare-columns">
       {evidenceIndex>=1&&<section className="is-revealed"><span>TRINITARIAN TEACHING</span><h2>Three eternal persons</h2><p>One divine essence in three coequal, coeternal persons. This view does not claim there are three gods.</p></section>}
       {evidenceIndex>=2&&<section className="is-revealed"><span>APOSTOLIC ONENESS</span><h2>One undivided God</h2><p>The Father, Son through true incarnation, and Holy Spirit are understood without eternal distinctions of divine persons.</p></section>}
      </div>}
      {evidenceIndex===2&&<p className="ogp-compare-conclusion">The difference is not whether God is one. The difference concerns eternal personal distinctions and the understanding of Jesus Christ.</p>}
     </div>}
     {current.kind==='mission'&&<><p className="ogp-prompt">The one LORD is not one option among several objects of worship. Knowing who He is shapes the devotion He calls for.</p><OG1ConsequenceJourney index={evidenceIndex} expanded={true} onReveal={()=>{}} art={<BiblicalApplicationArt index={evidenceIndex} content={content} move={move}/>} onOpenBible={readVerse}/></>}
     {current.kind==='discovery'&&(move.id==='learn'
      ?<JourneyDestinations options={current.discovery.options} selected={evidenceIndex} onSelect={()=>{}} guided onSpeak={narration.speak} onOpenBible={readVerse}/>
      :<div className="ogp-discovery"><p className="ogp-prompt">Follow each piece of the larger picture.</p><div className="ogp-discovery-choices">{current.discovery.options.map(([label],i)=><span className={evidenceIndex===i?'is-active':''} key={label}>{label}</span>)}</div>{<div className="ogp-discovery-answer" aria-live="polite"><strong>{current.discovery.options[evidenceIndex][0]}</strong><p>{current.discovery.options[evidenceIndex][1]}</p><small>{current.discovery.closer}</small></div>}</div>)}
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
     {assessment ? (feedback?<button type="button" className="ogp-action" onClick={()=>onStateChange(old=>continueTeaching(old,content))}>Continue →</button>:(move.id==='shema-guide'&&practiceStep<2?null:<button type="button" className="ogp-action" onClick={check} disabled={thinking}>{thinking?'Checking…':written?'Discuss my explanation':'Check my connection'} →</button>))
     :<button type="button" className="ogp-action" onClick={advance} disabled={false}>{current?.kind==='witness'&&evidenceIndex<2?'Reveal the next declaration':current?.kind==='witness'?'Follow the conclusion':current?.kind==='mission'&&evidenceIndex<2?'Follow the next consequence':current?.kind==='mission'?'Bring the confession together':current?.kind==='return'?'See what the confession requires':current?.kind==='identity'?'Examine the two explanations':current?.kind==='comparison'&&evidenceIndex<2?'Reveal the next perspective':current?.kind==='comparison'?'Bring the views together':current?.kind==='timeline'&&evidenceIndex<2?['Hear Jesus reaffirm it','See how Paul applies it'][evidenceIndex]:current?.kind==='timeline'?'Bring the witnesses together':current?.kind==='shema-encounter'?'Examine the words':current?.kind==='shema-manuscript'?'Follow the story further':current?.kind==='shema-cinema'?'Discover what follows':current?.kind==='shema-connection'?'Bring the confession together':current?.kind==='shema-resolution'?'Build the confession':current?.kind==='shema-manuscript'&&evidenceIndex<2?'Reveal the next phrase':current?.kind==='discovery'?'Reveal the next part':buttonText} →</button>}
     {!assessment&&moment>0&&<button type="button" className="ogp-back" onClick={back}>← Previous</button>}
     
    </nav>
   </>}
  </main>
  {inlineBibleReference&&<OG1InlineBible reference={inlineBibleReference} onClose={()=>setInlineBibleReference(null)}/>}
 </div>;
}
