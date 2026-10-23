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

function MobileTeachingCards({ paragraphs = [], guided = false, onReadyChange }) {
 const [index,setIndex]=useState(0);
 const active=Math.min(index,Math.max(0,paragraphs.length-1));
 const finished=active===paragraphs.length-1;
 useEffect(()=>{if(guided)onReadyChange?.(finished);},[guided,finished,onReadyChange]);
 if(!paragraphs.length)return null;
 return <div className={'tl-mobile-teaching'+(guided?' tl-guided-teaching':'')} style={guided?{display:'block',background:'#f3f8ff',border:'1px solid #d5e6fc',borderLeft:'4px solid #1c66c7',borderRadius:15,padding:20,margin:'14px 0'}:undefined} aria-label="Jeremiah's teaching">
  {guided&&<div className="tl-guided-counter"><span>JEREMIAH TEACHES</span><strong>{active+1} / {paragraphs.length}</strong></div>}
  <p className="tl-teaching" key={active}>{paragraphs[active]}</p>
  {paragraphs.length>1&&<div className="tl-teaching-controls"><span>{guided?(finished?'Ready to explore':'One thought at a time'):`Thought ${active+1} of ${paragraphs.length}`}</span><div>
    <button type="button" disabled={active===0} onClick={()=>setIndex(i=>Math.max(0,i-1))} aria-label="Previous teaching thought">←</button>
    <button type="button" disabled={finished} onClick={()=>setIndex(i=>Math.min(paragraphs.length-1,i+1))}>{finished?'✓':'Next →'}</button>
  </div></div>}
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
 return <section className={'og1-scene og1-scene-'+scene.theme} aria-label={scene.label}>
  <div className="og1-scene-art"><div className="og1-scene-rays" aria-hidden="true"/><span className="og1-scene-eyebrow">{scene.label}</span><div className="og1-scene-emblem" aria-hidden="true">{scene.theme==='witness'?'✦':scene.theme==='continuity'?'∞':scene.theme==='distinction'?'✳':'♥'}</div><h2>{scene.heading}</h2><blockquote>“{scene.verse}”</blockquote><span className="og1-scene-reference">{scene.reference} · KJV</span></div>
  <div className="og1-scene-body"><p>{scene.prompt}</p><div className="og1-scene-tabs" role="group" aria-label="Explore the Scripture connections">{scene.options.map((option,i)=><button type="button" key={option.name} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{option.name}</button>)}</div><div className="og1-scene-insight" role="status" key={selected}><span className="og1-scene-insight-number">{String(selected+1).padStart(2,'0')}</span><strong>{scene.options[selected].name}</strong><p>{scene.options[selected].detail}</p></div><button type="button" className="og1-scene-read" onClick={()=>onReadBible({reference:scene.reference.split(' · ')[0]})}>Explore {scene.reference.toLowerCase()} in the Bible ↗</button></div>
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
 const [teachingReady,setTeachingReady]=useState(false);
 const [exploreEarly,setExploreEarly]=useState(false);
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
 const guidedTeaching=isOG1 && !complete && (move.teaching?.length||0)>1;
 const revealActivity=!guidedTeaching || teachingReady || exploreEarly;
 const letters=['A','B','C'];
 useEffect(()=>()=>abortRef.current?.abort(),[]);
 useEffect(()=>{
  if(previousMove.current!==move.id){headingRef.current?.focus();previousMove.current=move.id;setTeachingReady(false);setExploreEarly(false);}
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
   <h1 className={isOG1Visual?"tl-chapter-heading-sr":undefined} ref={headingRef} tabIndex={-1}>{move.title}</h1>
   {state.experience?.earlierLesson && move.id==='learn' && <p className="tl-saved-note">Your earlier written answers are saved while you work through this lesson. <button type="button" onClick={()=>setDetail({kind:'notes',provider:'Earlier lesson',title:'Your earlier answers',summary:[state.experience.earlierLesson,...(state.experience.previousRuns || [])].flatMap(run=>Object.values(run.drafts || {})).map(d=>d.responseText).filter(Boolean).join('\n\n') || 'No written answers were recorded in the earlier sequence.'})}>View earlier answers</button></p>}
   {!complete && <>
    {content.standardId==='OG.1.LESSON.18' && move.id==='learn' && <OG1OpeningEncounter onReadBible={()=>openBible({reference:'Deuteronomy 6'})} />}
    {content.standardId==='OG.1.LESSON.18' && <OG1ChapterScene key={move.id} move={move} onReadBible={openBible} />}
    <div className="tl-teacher"><span className="tl-teacher-mark" aria-hidden="true">J</span><span>Jeremiah <small>Your teacher</small></span></div>
    {move.visual && !isOG1Visual && <LessonVisual key={`${move.id}:${state.experience?.restartAt || 0}`} kind={move.visual}/>}
    {isOG1Visual && <div className="tl-teaching-intro">JEREMIAH EXPLAINS</div>}
    <div className="tl-desktop-teaching" style={guidedTeaching?{display:"none"}:undefined}>{move.teaching?.map((paragraph,i)=><p className="tl-teaching" key={i}>{paragraph}</p>)}</div>
    <MobileTeachingCards key={move.id} paragraphs={move.teaching || []} guided={guidedTeaching} onReadyChange={setTeachingReady} />
    {guidedTeaching && !revealActivity && <button type="button" className="tl-guided-skip" onClick={()=>setExploreEarly(true)}>Jump to the activity ↓</button>}
    {guidedTeaching && revealActivity && <div className="tl-guided-transition">NOW, EXPLORE THE SCRIPTURE <span aria-hidden="true">↓</span></div>}
    {move.id==='learn' && !content.coveredStandards && <InteractivePractice content={content} state={state} onProgress={(patch)=>onStateChange(current=>updateLearningExperience(current,patch))} />}
    {revealActivity && move.workedExample && <WorkedExample move={move} draft={draft} onChange={changeDraft}/>}
    {move.sourceCredit && <p className="tl-saved-note">{move.sourceCredit}</p>}
    {move.illustration && !isOG1Visual && <LessonIllustration key={move.id} kind={move.illustration}/>}
    {revealActivity && !written && move.scripture?.length>0 && (isOG1Visual ? <details className="tl-og1-passages"><summary>Explore the supporting Scriptures · {move.scripture.length} passages</summary><section className="tl-scripture" aria-label="Scripture we are working through">{move.scripture.map(item=><article key={item.reference}><span className="tl-small">{item.reference}</span><blockquote>{item.text}</blockquote><p>{item.note}</p><button type="button" onClick={()=>openScripture(item)}>Read in context →</button></article>)}</section></details> : <section className="tl-scripture" aria-label="Scripture we are working through">{move.scripture.map(item=><article key={item.reference}><span className="tl-small">{item.reference}</span><blockquote>{item.text}</blockquote><p>{item.note}</p><button type="button" onClick={()=>openScripture(item)}>Read the passage in context →</button></article>)}</section>)}
    {revealActivity && move.id==='shema-show' && shemaVideo && <section className="tl-media" aria-label="Optional historical context video"><div><span className="tl-small">Historical lens · Jewish tradition</span><h2>{shemaVideo.title}</h2><p>{shemaVideo.purpose}</p><small>{shemaVideo.duration} · Optional viewing · Source: {shemaVideo.provider}</small></div><div className="tl-media-frame"><iframe src={shemaVideo.embedUrl} title={shemaVideo.videoTitle || shemaVideo.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; picture-in-picture; web-share" allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation" /></div><fieldset><legend>{shemaVideo.lessonCheck.title}</legend><p>{shemaVideo.lessonCheck.prompt}</p>{shemaVideo.lessonCheck.choices.map(choice=><label key={choice.id}><input type="radio" name="shema-video-check" value={choice.id} checked={mediaAnswer===choice.id} onChange={()=>setMediaAnswer(choice.id)} />{choice.label}</label>)}{mediaAnswer && <p className={mediaAnswer===shemaVideo.lessonCheck.answerId?'tl-media-feedback is-correct':'tl-media-feedback'} role="status">{mediaAnswer===shemaVideo.lessonCheck.answerId?shemaVideo.lessonCheck.correctFeedback:shemaVideo.lessonCheck.incorrectFeedback}</p>}</fieldset></section>}
    {revealActivity && move.type==='teach' && <button type="button" className="tl-primary" onClick={next}>{move.cta || 'Continue'} →</button>}
    {revealActivity && move.prompt && <section className="tl-question" aria-label="Check your understanding"><p className="tl-small">{written?'Your explanation':move.id==='check'?'A fresh situation':'Let me check your understanding'}</p><h2>{move.prompt}</h2>
     {(matching || reasoning) && <LessonActivity move={move} draft={draft} feedback={feedback} onChange={changeDraft}/>}
     {!written && !matching && !reasoning && <div className="tl-choices" role="group" aria-label="Choose an explanation">{move.choices.map((choice,i)=><button type="button" key={choice.id} disabled={Boolean(feedback)} aria-pressed={draft.selectedChoiceId===choice.id} onClick={()=>changeDraft({selectedChoiceId:choice.id})}><span>{letters[i]}</span><span>{choice.label}</span></button>)}</div>}
     {written && <><label className="tl-response">Your answer<textarea rows={7} value={draft.responseText || ''} disabled={thinking || Boolean(feedback)} onChange={event=>changeDraft({responseText:event.target.value})} placeholder="Explain your reasoning. Show how the passage supports it."/></label>
      <button type="button" className="tl-text-button" aria-expanded={showGuide} onClick={()=>{if(!showGuide && content.coveredStandards)changeDraft({usedSupport:true});setShowGuide(value=>!value);}}>{showGuide?'Close the support':'Need support before you answer?'}</button>
      {showGuide && <aside className="tl-support"><p>{content.coveredStandards?'Read the passages in context. Explain how their wording supports the claim, address the actual objection fairly, and distinguish each part of the question. This support is practice; a later attempt without this drawer establishes independent understanding.':move.id==='defend'?'Start with the claim you are answering. Explain the moral standard, the damage sin causes, and the need for God’s rescue. Choose a passage and explain its connection.':'Work through the question one part at a time. Name the truth, explain the distinction, and connect the passage to your reasoning.'}</p>{move.supportSteps && <ol>{move.supportSteps.map(step=><li key={step}>{step}</li>)}</ol>}{move.scripture.map(item=><button type="button" key={item.reference} onClick={()=>openScripture(item)}>{item.reference} →</button>)}</aside>}
     </>}
     {!feedback && <button type="button" className="tl-primary" disabled={thinking || !ready} onClick={submit}>{thinking?'Reading your explanation…':written?'Discuss my explanation':'Discuss my answer'} {!thinking && '→'}</button>}
    </section>}
    {revealActivity && move.prompt && <div className="tl-skip-discussion"><button type="button" onClick={skipDiscussion}>Skip question for now →</button><small>Continue exploring. This won't count toward mastery.</small></div>}
    {thinking && <p role="status" className="tl-saved-note">Your explanation is being assessed against this lesson’s Scripture and learning goals.</p>}
    {error && <p className="tl-error" role="alert">{error}</p>}
    {feedback && <section ref={feedbackRef} tabIndex={-1} aria-label="Jeremiah’s feedback" className={`tl-feedback ${feedback.verdict==='strong'?'is-understood':'is-teaching'}`} aria-live="polite"><span className="tl-small">{feedback.source==='fallback' && written?'Assessment unavailable':'Jeremiah’s response'}</span><p>{feedback.teacherMessage}</p>{feedback.followUpPrompt && <p className="tl-follow-up">{feedback.followUpPrompt}</p>}<button type="button" className="tl-primary" onClick={next}>{feedback.verdict==='strong'?(move.id==='defend'?'See what you have established':'Build on that understanding'):written?'Develop my explanation':move.next.weak===move.id?'Reconsider my answer':'Work through another example'} →</button></section>}
   </>}
   {complete && <section className="tl-complete"><p className="tl-teaching">{state.experience?.earlierCompletion?'Your completion from the earlier version is saved. You can revisit this lesson through the new teaching sequence.':content.completionSummary || 'You traced the moral boundary, distinguished wrongdoing from feelings and limitation, and connected guilt, corruption, and separation to the need for God’s saving work.'}</p>
    <h2>Keep these connections with you</h2><ul>{(content.takeaways || ['Sin is evaluated against God’s will.','Its consequences reach accountability, the inward person, and relationship with God.','The need for rescue includes every person.','God gives the life that self-improvement cannot supply.']).map(text=><li key={text}>{text}</li>)}</ul>
    <h2>Your explanations</h2>{content.instructionalMoves.filter(m=>['free_response','mastery_response'].includes(m.type)).map(m=>m.id).map(id=>{const answer=state.experience?.drafts?.[id]?.responseText;return answer?<details key={id}><summary>{getInstructionalMove(content,id).title}</summary><p>{answer}</p></details>:null;})}
    <button type="button" className="tl-primary" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>Return to the {content.studyTitle} room →</button>
    <button type="button" className="tl-text-button" onClick={restart}>{state.experience?.earlierCompletion?'Study the new teaching sequence':'Review this lesson'}</button>
   </section>}
   {!complete && <details className="tl-vocabulary"><summary>Keep the key words close</summary><dl>{content.sourceDomain.vocabulary.map(item=><div key={item.term}><dt>{item.term}</dt><dd>{item.definition}</dd></div>)}</dl></details>}
   {content.coveredStandards && <details className="tl-vocabulary"><summary>Your learning goals · {Object.keys(state.experience?.standardEvidence || {}).length} established</summary><ul>{content.coveredStandards.map(s=><li key={s.id}><strong>{s.title}</strong><p>{state.experience?.standardEvidence?.[s.id]?'Independent understanding established':'Still developing'} · {s.id}</p></li>)}</ul></details>}
   <footer className="tl-footer">{content.standardId} · Your answers and place are saved in this browser.</footer>
  </main>
  <DeepDiveSheet item={detail} onClose={()=>setDetail(null)} onOpenBible={openBible}/>
 </div>;
}
