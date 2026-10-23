import { useEffect, useRef, useState } from 'react';
import { ROUTES } from '../../app/routes';
import { setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { setBibleReaderIntent } from '../../core/bible/bibleReaderIntent';
import { getInstructionalMove, getStandardProgress, updateLearningExperience, saveLearningState } from '../../core/classroom/learningEngine';
import { evaluateTeachingChoice, saveTeachingDecision, continueTeaching, restartTeaching, skipTeachingMove } from '../../core/classroom/teacherLedEngine';
import { askJeremiahTeacher } from '../../services/jeremiahTeacher';
import { getLessonMedia } from '../../data/curriculum/mediaCatalog';
import DeepDiveSheet from './DeepDiveSheet';
import LessonIllustration from './LessonIllustration';
import LessonActivity, { LessonVisual, WorkedExample } from './LessonActivity';
import InteractivePractice from './InteractivePractice';
import LessonPath from './LessonPath';
import './TeacherLedLesson.css';

function MobileTeachingCards({ paragraphs = [] }) {
 const [index, setIndex] = useState(0);
 if (!paragraphs.length) return null;
 const active = Math.min(index, paragraphs.length - 1);
 return <div className="tl-mobile-teaching" aria-label="Teaching explanation">
  <p className="tl-teaching">{paragraphs[active]}</p>
  {paragraphs.length > 1 && <div className="tl-teaching-controls">
   <span aria-live="polite">Thought {active + 1} of {paragraphs.length}</span>
   <div>
    <button type="button" disabled={active === 0} onClick={() => setIndex(i => Math.max(0, i - 1))} aria-label="Previous teaching thought">←</button>
    <button type="button" disabled={active === paragraphs.length - 1} onClick={() => setIndex(i => Math.min(paragraphs.length - 1, i + 1))} aria-label="Next teaching thought">Next →</button>
   </div>
  </div>}
 </div>;
}

function OG1OpeningEncounter({onReadBible}) {
 const [response,setResponse]=useState(null);
 const choices=[
  {id:'many',label:'Israel is being told to choose the LORD above other gods.',feedback:'Israel must certainly worship the LORD alone. But notice that the confession says more: “the LORD our God is one LORD.” Keep both the command to worship and the statement of who God is in view.'},
  {id:'one',label:'The LORD is one, and Israel is called to hear and respond.',feedback:'Yes. The Shema begins with a call to listen and confesses the one LORD. Now watch how Jesus and the apostles carry that confession forward.'},
  {id:'history',label:'This is only a historical saying, with no claim for believers today.',feedback:'Jesus repeats this confession in Mark 12:29. We will examine why it remains central to the New Testament witness.'},
 ];
 return <section className="og1-encounter" aria-label="Opening encounter: Hear, O Israel">
  <div className="og1-encounter-top"><span>THE ONE TRUE GOD</span><span>ENCOUNTER · 01</span></div>
  <div className="og1-encounter-scripture"><span className="og1-encounter-glyph" aria-hidden="true">✦</span><p className="og1-encounter-call">Before we explain the doctrine, hear the Scripture.</p><blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote><div className="og1-encounter-reference">DEUTERONOMY 6:4 · KJV</div></div>
  <button type="button" className="og1-encounter-bible" onClick={onReadBible}>Read Deuteronomy 6 in the Bible <span aria-hidden="true">↗</span></button>
  <div className="og1-encounter-question"><span>THINK ABOUT THE WORD</span><h2>What is Israel being called to recognize?</h2><div className="og1-encounter-choices">{choices.map(choice=><button key={choice.id} type="button" aria-pressed={response===choice.id} onClick={()=>setResponse(choice.id)}>{choice.label}<span aria-hidden="true">{response===choice.id?'✓':'→'}</span></button>)}</div>
  {response && <p className="og1-encounter-feedback" role="status"><strong>Jeremiah:</strong> {choices.find(choice=>choice.id===response).feedback}</p>}</div>
  <div className="og1-encounter-journey"><span><b>01</b> Hear the confession</span><span><b>02</b> Trace the witness</span><span><b>03</b> Explain the truth</span></div>
 </section>;
}

const OG1_CHAPTER_SCENES = {
 'isaiah-show': {label:'THE PROPHETIC WITNESS',heading:'There is none else.',reference:'ISAIAH 45:5',verse:'I am the LORD, and there is none else, there is no God beside me:',theme:'witness',prompt:'Isaiah challenges every rival claim. Explore what each declaration rules out.',options:[{name:'Before',detail:'Isaiah 43:10 — no God formed before the LORD.'},{name:'Beside',detail:'Isaiah 44:6 — no God beside the LORD.'},{name:'After',detail:'Isaiah 43:10 — none shall come after him.'}]},
 'continuity-show': {label:'THE APOSTOLIC WITNESS',heading:'The same confession.',reference:'MARK 12:29',verse:'The Lord our God is one Lord:',theme:'continuity',prompt:'Follow the confession as it moves from Israel, through Jesus, to the apostles.',options:[{name:'Moses',detail:'Deuteronomy 6:4 — Israel confesses the one LORD.'},{name:'Jesus',detail:'Mark 12:29 — Jesus repeats the Shema.'},{name:'Paul',detail:'1 Corinthians 8:4 — there is none other God but one.'}]},
 'distinction-show': {label:'UNDERSTAND THE DIFFERENCE',heading:'Speak truthfully. Listen carefully.',reference:'1 TIMOTHY 2:5',verse:'For there is one God, and one mediator between God and men, the man Christ Jesus;',theme:'distinction',prompt:'Compare these descriptions without misrepresenting either view.',options:[{name:'Apostolic Oneness',detail:'The one God is revealed in Jesus Christ; Father, Son, and Holy Ghost are not three divine persons.'},{name:'Trinitarian teaching',detail:'One divine essence in three distinct, coequal, coeternal persons — not three separate gods.'},{name:'Shared confession',detail:'Both affirm that there is one God and confess Jesus Christ, while explaining divine identity differently.'}]},
 'devotion-show': {label:'FAITH IN ACTION',heading:'Love the LORD with all your heart.',reference:'DEUTERONOMY 6:5',verse:'And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.',theme:'devotion',prompt:'The Shema calls for more than a correct answer. Where does it lead?',options:[{name:'Heart',detail:'Love God with undivided devotion.'},{name:'Soul',detail:'Let faith shape your whole life.'},{name:'Might',detail:'Respond with the strength and actions of daily obedience.'}]}
};
function OG1ChapterScene({move,onReadBible}) {
 const scene=OG1_CHAPTER_SCENES[move.id];
 const [selected,setSelected]=useState(0);
 if(!scene)return null;
 return <section className="og1-scene-lite" aria-label={scene.label}>
  <div className="og1-scene-lite-head"><span>{scene.label}</span><strong>{scene.reference} · KJV</strong></div>
  <h2>{scene.heading}</h2>
  <blockquote>“{scene.verse}”</blockquote>
  <p>{scene.prompt}</p>
  <div className="og1-scene-lite-tabs" role="group" aria-label="Explore the Scripture connections">{scene.options.map((option,i)=><button type="button" key={option.name} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{option.name}</button>)}</div>
  <div className="og1-scene-lite-insight" role="status"><strong>{scene.options[selected].name}</strong><p>{scene.options[selected].detail}</p></div>
  <button type="button" className="og1-scene-lite-read" onClick={()=>onReadBible({reference:scene.reference})}>Read this passage in context →</button>
 </section>;
}

function GuidedReveal({paragraphs=[],onFinish}) {
 const [step,setStep]=useState(0);
 const actions=['NOTICE','DISCOVER','CONNECT','REFLECT'];
 const complete=step>=paragraphs.length;
 return <section aria-label="Guided discovery" style={{margin:'22px 0 18px',borderTop:'1px solid #dbe6f3',paddingTop:19}}>
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:13}}>
   <span style={{fontSize:12,fontWeight:800,letterSpacing:'.12em',color:'#1659a8'}}>JEREMIAH GUIDES YOU</span>
   <span style={{fontSize:12,color:'#64748b'}}>{complete?paragraphs.length:Math.min(paragraphs.length,step+1)} of {paragraphs.length} ideas</span>
  </div>
  <div key={step} aria-live="polite" style={{padding:'5px 0 16px'}}>
   <div style={{fontSize:12,fontWeight:850,letterSpacing:'.13em',color:'#1867c1',marginBottom:10}}>{complete?'READY TO RESPOND':actions[Math.min(step,actions.length-1)]}</div>
   {complete?<p style={{fontSize:19,lineHeight:1.6,color:'#223653',margin:0}}>Now explore the Scripture, then try the next challenge.</p>:<p style={{fontSize:19,lineHeight:1.7,color:'#223653',margin:0}}>{paragraphs[step]}</p>}
  </div>
  {!complete?<button type="button" onClick={()=>{const next=step+1;setStep(next);if(next>=paragraphs.length)onFinish();}} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:25,width:'100%',maxWidth:390,minHeight:51,border:0,borderRadius:12,background:'#1765dc',color:'white',padding:'12px 18px',fontSize:15,fontWeight:800,cursor:'pointer'}}>{step===paragraphs.length-1?'Explore the next step':'Reveal the next idea'}<span aria-hidden="true">→</span></button>:null}
  {step>0&&!complete&&<button type="button" onClick={()=>setStep(i=>Math.max(0,i-1))} style={{border:0,background:'none',color:'#52677f',padding:'12px 0',fontSize:13,cursor:'pointer'}}>← Previous idea</button>}
  {!complete&&<button type="button" onClick={()=>{setStep(paragraphs.length);onFinish();}} style={{display:'block',border:0,background:'none',color:'#52677f',padding:'10px 0',fontSize:13,cursor:'pointer'}}>Go straight to the activity ↓</button>}
 </section>;
}

export default function TeacherLedLesson({ content, state, onStateChange, onNavigate }) {
 const move=getInstructionalMove(content,state.currentMoveId);
 const draft=state.experience?.drafts?.[move.id] || {};
 const feedback=state.experience?.teachingDecision?.moveId===move.id?state.experience.teachingDecision.decision:null;
 const [detail,setDetail]=useState(null);
 const [thinking,setThinking]=useState(false);
 const [error,setError]=useState('');
 const [showGuide,setShowGuide]=useState(false);
 const [showRestart,setShowRestart]=useState(false);
 const [mediaAnswer,setMediaAnswer]=useState('');
 const [revealDone,setRevealDone]=useState(false);
 const [lessonScreen,setLessonScreen]=useState(0);
 const restartRef=useRef(null);
 useEffect(()=>{if(showRestart)restartRef.current?.focus();},[showRestart]);
 const abortRef=useRef(null);
 const headingRef=useRef(null);
 const feedbackRef=useRef(null);
 const previousMove=useRef(move.id);
 const currentMoveRef=useRef(move.id);
 currentMoveRef.current=move.id;
 const written=['free_response','mastery_response'].includes(move.type);
 const complete=move.type==='complete';
 const matching=move.interaction?.type==='match';
 const reasoning=move.interaction?.type==='reasoning';
 const ready=written?Boolean(draft.responseText?.trim()):reasoning?Boolean(draft.claimId && draft.reasonId):matching?move.interaction.items.every(item=>draft.placements?.[item.id]):Boolean(draft.selectedChoiceId);
 const percent=getStandardProgress(content,state);
 const mainMoves=content.instructionalMoves.filter(m=>!m.progressOptional && m.type!=='complete');
 const shemaVideo=getLessonMedia(content).find(source=>source.id==='unpacked-shema');
 const currentIndex=mainMoves.findIndex(m=>m.id===move.id);
 const isOG1=content.standardId==='OG.1.LESSON.18';
 const isOG1Visual=isOG1 && (move.id==='learn' || Boolean(OG1_CHAPTER_SCENES[move.id]));
 const guidedReveal=isOG1 && move.type==='teach' && (move.teaching?.length||0)>0;
 const showAfterReveal=!guidedReveal || revealDone;
 const screenFlow=isOG1 && move.type==='teach';
 const sceneScreen=!screenFlow || lessonScreen===0;
 const teachingScreen=!screenFlow || lessonScreen===1;
 const hasWatchScreen=screenFlow && move.id==='shema-show' && Boolean(shemaVideo);
 const watchScreen=hasWatchScreen && lessonScreen===2;
 const sourceScreen=!screenFlow || lessonScreen===(hasWatchScreen?3:2);
 const chapterActions={
  'learn':['ENCOUNTER','UNDERSTAND','OPEN SCRIPTURE'],
  'shema-show':['READ','DISCOVER','WATCH','NOTICE'],
  'isaiah-show':['EXAMINE','REASON','VERIFY'],
  'continuity-show':['CONNECT','DISCOVER','TRACE'],
  'distinction-show':['COMPARE','UNDERSTAND','INVESTIGATE'],
  'devotion-show':['REFLECT','CONSIDER','APPLY']
 };
 const screenLabels=chapterActions[move.id]||['READ','DISCOVER','EXPLORE'];
 const continuePrompt={
  'learn':'Find out what the confession means',
  'shema-show':'Discover what the words mean',
  'isaiah-show':'Reason from the evidence',
  'continuity-show':'Discover the connection',
  'distinction-show':'Understand the distinction',
  'devotion-show':'Consider your response'
 };
 const letters=['A','B','C'];
 useEffect(()=>()=>abortRef.current?.abort(),[]);
 useEffect(()=>{
  if(previousMove.current!==move.id){headingRef.current?.focus();previousMove.current=move.id;setRevealDone(false);setLessonScreen(0);}
 },[move.id]);
 useEffect(()=>{if(feedback)feedbackRef.current?.focus();},[feedback]);
 function changeDraft(patch){
  if(thinking || feedback) return;
  onStateChange(current=>updateLearningExperience(current,{drafts:{[move.id]:{...(current.experience?.drafts?.[move.id] || {}),...patch}}}));
 }
 function openScripture(item){setDetail({...item,kind:'scripture'});}
 function openBible(item){
  setBibleReaderIntent(item.reference,{translation:'kjv',returnRoute:ROUTES.CLASSROOM_LESSON,source:'classroom'});
  onNavigate(ROUTES.BIBLE_SUPPORT);
 }
 async function submit(){
  if(thinking || feedback || !ready) return;
  const learnerResponse=written?{text:draft.responseText.trim()}:reasoning?{claimId:draft.claimId,reasonId:draft.reasonId}:matching?{placements:draft.placements}:{choiceIds:[draft.selectedChoiceId]};
  setError('');
  let decision=evaluateTeachingChoice(move,learnerResponse);
  if(!decision){
   setThinking(true);
   abortRef.current?.abort();
   const controller=new AbortController();abortRef.current=controller;
   try {
    decision=await askJeremiahTeacher({standardId:content.standardId,moveId:move.id,learnerResponse,learnerState:{completedMoveIds:state.completedMoveIds,evidenceIds:state.evidenceIds,misconceptions:state.misconceptions,attemptsByMove:state.attemptsByMove}},controller.signal);
   } catch(caught){if(caught.name!=='AbortError')setError('Your answer is saved. Jeremiah could not assess it right now. Try again when the connection is ready.');}
   finally {if(!controller.signal.aborted)setThinking(false);}
   if(controller.signal.aborted || currentMoveRef.current!==move.id)return;
  }
  if(decision)onStateChange(current=>saveTeachingDecision(current,content,move,decision));
 }
 function next(){
  setError('');setShowGuide(false);
  onStateChange(current=>continueTeaching(current,content));
 }
 function skipDiscussion(){
  abortRef.current?.abort();setThinking(false);setError('');setShowGuide(false);
  onStateChange(current=>skipTeachingMove(current,content));
 }
 function showNotes(){
  const learned=mainMoves.filter(m=>state.completedMoveIds.includes(m.id) && m.teaching?.length);
  setDetail({kind:'notes',provider:'Your lesson notes',title:'Keep the reasoning together',summary:learned.length?learned.map(m=>`${m.title}: ${m.teaching.at(-1)}`).join('\n\n'):content.truthStatement});
 }
 function restart(){
  abortRef.current?.abort();
  setThinking(false);setError('');setShowGuide(false);setDetail(null);setShowRestart(false);
  saveLearningState(state);
  setActiveClassroomSessionPreset('review');
  onStateChange(current=>restartTeaching(content,current));
 }

 return <div className={isOG1?"tl-page tl-og1-flow":"tl-page"}>
  <header className="tl-header"><button type="button" aria-label="Leave lesson" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>←</button><span>JEREMIAH <small>{content.studyTitle}</small></span><div className="tl-header-actions"><button type="button" onClick={showNotes}>Lesson notes</button><button type="button" aria-expanded={showRestart} onClick={()=>setShowRestart(value=>!value)}>Start from the beginning</button></div></header>
  <div className="tl-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${percent}%`}}/></div>
  <main className="tl-main">
   {showRestart && <section className="tl-restart" role="group" aria-label="Restart lesson" tabIndex={-1} ref={restartRef}><h2>Start this lesson again?</h2><p>You’ll return to the opening in a fresh review. Your earlier answers and earned completion will be kept.</p><button type="button" className="tl-primary" onClick={restart}>Start from the beginning →</button><button type="button" className="tl-text-button" onClick={()=>setShowRestart(false)}>Keep my place</button></section>}
   <div className="tl-step"><span>{complete?'Lesson reflection':move.progressOptional?'A closer look':`${String(currentIndex+1).padStart(2,'0')} / ${String(mainMoves.length).padStart(2,'0')}`}</span><span>{move.phase || move.eyebrow || (move.progressOptional?'Let’s approach it another way':written?'Put the reasoning into words':'Build your understanding')}</span></div>
   <LessonPath content={content} move={move} state={state} compact={isOG1} />
   {screenFlow && lessonScreen>0 && <button type="button" className="tl-screen-back" onClick={()=>setLessonScreen(n=>Math.max(0,n-1))}>← Previous moment</button>}
   {screenFlow && <div className="tl-screen-progress" aria-label={'Moment '+(lessonScreen+1)+' of '+screenLabels.length}><span>{screenLabels[lessonScreen]}</span><small>{lessonScreen+1} / {screenLabels.length}</small></div>}
   <h1 className={isOG1Visual?"tl-chapter-heading-sr":undefined} ref={headingRef} tabIndex={-1}>{move.title}</h1>
   {state.experience?.earlierLesson && move.id==='learn' && <p className="tl-saved-note">Your earlier written answers are saved while you work through this lesson. <button type="button" onClick={()=>setDetail({kind:'notes',provider:'Earlier lesson',title:'Your earlier answers',summary:[state.experience.earlierLesson,...(state.experience.previousRuns || [])].flatMap(run=>Object.values(run.drafts || {})).map(d=>d.responseText).filter(Boolean).join('\n\n') || 'No written answers were recorded in the earlier sequence.'})}>View earlier answers</button></p>}
   {!complete && <>
    {screenFlow && sceneScreen && move.id==='shema-show' && <section className="tl-screen-scripture"><span>READ · DEUTERONOMY 6:4</span><blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote><p>Read this confession before you explore how its words connect to Jesus' teaching.</p><button type="button" onClick={()=>openBible({reference:'Deuteronomy 6:4'})}>Read in the Bible ↗</button></section>}
    {content.standardId==='OG.1.LESSON.18' && move.id==='learn' && sceneScreen && <OG1OpeningEncounter onReadBible={()=>openBible({reference:'Deuteronomy 6'})} />}
    {content.standardId==='OG.1.LESSON.18' && sceneScreen && <OG1ChapterScene key={move.id} move={move} onReadBible={openBible} />}
    {teachingScreen && !guidedReveal && <div className="tl-teacher"><span className="tl-teacher-mark" aria-hidden="true">J</span><span>Jeremiah <small>Your teacher</small></span></div>}
    {sceneScreen && move.visual && !isOG1Visual && <LessonVisual key={`${move.id}:${state.experience?.restartAt || 0}`} kind={move.visual}/>}
    {teachingScreen && isOG1Visual && !guidedReveal && <div className="tl-teaching-intro">JEREMIAH EXPLAINS</div>}
    {teachingScreen && <div className="tl-desktop-teaching" style={guidedReveal?{display:"none"}:undefined}>{move.teaching?.map((paragraph,i)=><p className="tl-teaching" key={i}>{paragraph}</p>)}</div>}
    {teachingScreen && !guidedReveal && <MobileTeachingCards key={move.id} paragraphs={move.teaching || []} />}
    {teachingScreen && guidedReveal && <GuidedReveal key={move.id} paragraphs={move.teaching||[]} onFinish={()=>{setRevealDone(true);setLessonScreen(2)}} />}
    {move.id==='learn' && !content.coveredStandards && <InteractivePractice content={content} state={state} onProgress={(patch)=>onStateChange(current=>updateLearningExperience(current,patch))} />}
    {sourceScreen && showAfterReveal && move.workedExample && <WorkedExample move={move} draft={draft} onChange={changeDraft}/>}
    {sourceScreen && move.sourceCredit && <p className="tl-saved-note">{move.sourceCredit}</p>}
    {sceneScreen && move.illustration && !isOG1Visual && <LessonIllustration key={move.id} kind={move.illustration}/>}
    {sourceScreen && showAfterReveal && !written && move.scripture?.length>0 && (isOG1Visual ? <details className="tl-og1-passages"><summary>Explore the supporting Scriptures · {move.scripture.length} passages</summary><section className="tl-scripture" aria-label="Scripture we are working through">{move.scripture.map(item=><article key={item.reference}><span className="tl-small">{item.reference}</span><blockquote>{item.text}</blockquote><p>{item.note}</p><button type="button" onClick={()=>openScripture(item)}>Read in context →</button></article>)}</section></details> : <section className="tl-scripture" aria-label="Scripture we are working through">{move.scripture.map(item=><article key={item.reference}><span className="tl-small">{item.reference}</span><blockquote>{item.text}</blockquote><p>{item.note}</p><button type="button" onClick={()=>openScripture(item)}>Read the passage in context →</button></article>)}</section>)}
    {watchScreen && <section className="tl-watch-moment" aria-label="Watch the Shema video">
     <span className="tl-small">WATCH · LISTEN FOR THE MEANING OF SHEMA</span>
     <h2>Listen before you explain.</h2>
     <p>As you watch, notice why the confession begins with a call to hear. This video provides historical and language context; Jeremiah will connect it to Apostolic teaching afterward.</p>
     <div className="tl-media-frame"><iframe src={shemaVideo.embedUrl} title={shemaVideo.videoTitle || shemaVideo.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; picture-in-picture; web-share" allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation" /></div>
     <small>{shemaVideo.duration} · Optional · {shemaVideo.provider}</small>
     <button type="button" className="tl-primary" onClick={()=>setLessonScreen(3)}>Now connect what you noticed →</button>
    </section>}
    {sourceScreen && hasWatchScreen && <section className="tl-watch-notice" aria-label="Connect the video to Scripture">
     <span className="tl-small">NOTICE · MAKE THE CONNECTION</span>
     <h2>{shemaVideo.lessonCheck.prompt}</h2>
     <fieldset><legend>{shemaVideo.lessonCheck.title}</legend>{shemaVideo.lessonCheck.choices.map(choice=><label key={choice.id}><input type="radio" name="shema-video-check" value={choice.id} checked={mediaAnswer===choice.id} onChange={()=>setMediaAnswer(choice.id)}/>{choice.label}</label>)}</fieldset>
     {mediaAnswer && <p role="status">{mediaAnswer===shemaVideo.lessonCheck.answerId?shemaVideo.lessonCheck.correctFeedback:shemaVideo.lessonCheck.incorrectFeedback}</p>}
    </section>}
    {sourceScreen && showAfterReveal && move.type==='teach' && <button type="button" className="tl-primary" onClick={next}>{move.cta || 'Continue'} →</button>}
    {screenFlow && lessonScreen===0 && <button type="button" className="tl-primary tl-screen-next" onClick={()=>setLessonScreen(1)}>{continuePrompt[move.id]||"Discover the next idea"} →</button>}
    {move.prompt && isOG1 && <div className="tl-action-cue"><span>YOUR TURN</span><strong>{written?'EXPLAIN':matching?'MATCH':reasoning?'REASON':'ANSWER'}</strong><p>{written?'Explain the connection in your own words.':matching?'Touch a match to build the Scripture connection.':'Consider what Scripture teaches, then choose your answer.'}</p></div>}
    {move.prompt && <section className="tl-question" aria-label="Check your understanding"><p className="tl-small">{written?'Your explanation':move.id==='check'?'A fresh situation':'Let me check your understanding'}</p><h2>{move.prompt}</h2>
     {(matching || reasoning) && <LessonActivity move={move} draft={draft} feedback={feedback} onChange={changeDraft}/>}
     {!written && !matching && !reasoning && <div className="tl-choices" role="group" aria-label="Choose an explanation">{move.choices.map((choice,i)=><button type="button" key={choice.id} disabled={Boolean(feedback)} aria-pressed={draft.selectedChoiceId===choice.id} onClick={()=>changeDraft({selectedChoiceId:choice.id})}><span>{letters[i]}</span><span>{choice.label}</span></button>)}</div>}
     {written && <><label className="tl-response">Your answer<textarea rows={7} value={draft.responseText || ''} disabled={thinking || Boolean(feedback)} onChange={event=>changeDraft({responseText:event.target.value})} placeholder="Explain your reasoning. Show how the passage supports it."/></label>
      <button type="button" className="tl-text-button" aria-expanded={showGuide} onClick={()=>{if(!showGuide && content.coveredStandards)changeDraft({usedSupport:true});setShowGuide(value=>!value);}}>{showGuide?'Close the support':'Need support before you answer?'}</button>
      {showGuide && <aside className="tl-support"><p>{content.coveredStandards?'Read the passages in context. Explain how their wording supports the claim, address the actual objection fairly, and distinguish each part of the question. This support is practice; a later attempt without this drawer establishes independent understanding.':move.id==='defend'?'Start with the claim you are answering. Explain the moral standard, the damage sin causes, and the need for God’s rescue. Choose a passage and explain its connection.':'Work through the question one part at a time. Name the truth, explain the distinction, and connect the passage to your reasoning.'}</p>{move.supportSteps && <ol>{move.supportSteps.map(step=><li key={step}>{step}</li>)}</ol>}{move.scripture.map(item=><button type="button" key={item.reference} onClick={()=>openScripture(item)}>{item.reference} →</button>)}</aside>}
     </>}
     {!feedback && <button type="button" className="tl-primary" disabled={thinking || !ready} onClick={submit}>{thinking?'Reading your explanation…':written?'Discuss my explanation':'Discuss my answer'} {!thinking && '→'}</button>}
    </section>}
    {move.prompt && <div className="tl-skip-discussion"><button type="button" onClick={skipDiscussion}>Skip question for now →</button><small>Continue exploring. This won't count toward mastery.</small></div>}
    {thinking && <p role="status" className="tl-saved-note">Your explanation is being assessed against this lesson’s Scripture and learning goals.</p>}
    {error && <p className="tl-error" role="alert">{error}</p>}
    {feedback && <section ref={feedbackRef} tabIndex={-1} aria-label="Jeremiah’s feedback" className={`tl-feedback ${feedback.verdict==='strong'?'is-understood':'is-teaching'}`} aria-live="polite"><span className="tl-small">{feedback.source==='fallback' && written?'Assessment unavailable':'Jeremiah’s response'}</span><p>{feedback.teacherMessage}</p>{feedback.followUpPrompt && <p className="tl-follow-up">{feedback.followUpPrompt}</p>}<button type="button" className="tl-primary" onClick={next}>{feedback.verdict==='strong'?(move.id==='defend'?'See what you have established':'Build on that understanding'):written?'Develop my explanation':move.next.weak===move.id?'Reconsider my answer':'Work through another example'} →</button></section>}
   </>}
   {complete && (isOG1 ? <section className="tl-complete tl-og1-finish">
    <div className="tl-og1-finish-mark" aria-hidden="true">✦</div>
    <span className="tl-og1-finish-kicker">THE ONE TRUE GOD · JOURNEY REVIEWED</span>
    <h2>You've followed the confession.</h2>
    <p>From the Shema to the apostles, you traced the biblical witness to the one LORD. The next step is to carry that understanding into the rest of Scripture.</p>
    <div className="tl-og1-finish-actions">
     <button type="button" className="tl-primary" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>Explore the next lesson →</button>
     <button type="button" className="tl-text-button" onClick={()=>openBible({reference:'Mark 12:29'})}>Read Jesus' words in Mark 12 →</button>
    </div>
    <details className="tl-og1-finish-notes"><summary>Review my notes and answers</summary>
     <p>{content.completionSummary}</p>
     {(content.takeaways||[]).length>0 && <ul>{content.takeaways.map(item=><li key={item}>{item}</li>)}</ul>}
     {content.instructionalMoves.filter(m=>['free_response','mastery_response'].includes(m.type)).map(m=>{const answer=state.experience?.drafts?.[m.id]?.responseText;return answer?<div key={m.id}><strong>{m.title}</strong><p>{answer}</p></div>:null})}
    </details>
    <button type="button" className="tl-text-button" onClick={restart}>Revisit this journey</button>
   </section> : <section className="tl-complete"><p className="tl-teaching">{state.experience?.earlierCompletion?'Your completion from the earlier version is saved. You can revisit this lesson through the new teaching sequence.':content.completionSummary || 'You have completed this lesson.'}</p><h2>Keep these connections with you</h2><ul>{(content.takeaways || []).map(text=><li key={text}>{text}</li>)}</ul><h2>Your explanations</h2>{content.instructionalMoves.filter(m=>['free_response','mastery_response'].includes(m.type)).map(m=>m.id).map(id=>{const answer=state.experience?.drafts?.[id]?.responseText;return answer?<details key={id}><summary>{getInstructionalMove(content,id).title}</summary><p>{answer}</p></details>:null;})}<button type="button" className="tl-primary" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>Return to the {content.studyTitle} room →</button><button type="button" className="tl-text-button" onClick={restart}>Review this lesson</button></section>)}
   {!complete && (!screenFlow || sourceScreen) && <details className="tl-vocabulary"><summary>Keep the key words close</summary><dl>{content.sourceDomain.vocabulary.map(item=><div key={item.term}><dt>{item.term}</dt><dd>{item.definition}</dd></div>)}</dl></details>}
   {content.coveredStandards && (!screenFlow || sourceScreen) && <details className="tl-vocabulary"><summary>Your learning goals · {Object.keys(state.experience?.standardEvidence || {}).length} established</summary><ul>{content.coveredStandards.map(s=><li key={s.id}><strong>{s.title}</strong><p>{state.experience?.standardEvidence?.[s.id]?'Independent understanding established':'Still developing'} · {s.id}</p></li>)}</ul></details>}
   <footer className="tl-footer">{content.standardId} · Your answers and place are saved in this browser.</footer>
  </main>
  <DeepDiveSheet item={detail} onClose={()=>setDetail(null)} onOpenBible={openBible}/>
 </div>;
}
