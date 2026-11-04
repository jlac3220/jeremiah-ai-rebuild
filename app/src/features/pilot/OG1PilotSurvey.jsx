import {useEffect,useState} from 'react';
import {
 OG1_PILOT_SURVEY_VERSION,PILOT_RATING_AREAS,PILOT_PRIORITY_OPTIONS,PILOT_MOMENT_OPTIONS,
 PILOT_DEVICE_OPTIONS,PILOT_ROLE_OPTIONS,PILOT_FUTURE_OPTIONS,newPilotSurveyDraft
} from '../../data/og1PilotSurvey.js';
import './OG1PilotSurvey.css';

const DRAFT_KEY='jeremiah-og1-pilot-survey-draft';
const RECEIPT_KEY='jeremiah-og1-pilot-survey-receipt';
const LABELS=['Very poor','Poor','Okay','Good','Excellent'];
function makeSubmissionId(){
 if(typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function')return crypto.randomUUID().replace(/-/g,'');
 return 'pilot'+Date.now()+Math.random().toString(36).slice(2,14);
}
function readDraft(){
 if(typeof window!=='undefined'){
  try{
   const parsed=JSON.parse(window.localStorage.getItem(DRAFT_KEY)||'null');
   if(parsed?.submissionId&&parsed?.version===OG1_PILOT_SURVEY_VERSION)return parsed;
  }catch{/* use fresh draft */}
 }
 return {...newPilotSurveyDraft(),submissionId:makeSubmissionId(),version:OG1_PILOT_SURVEY_VERSION};
}
function ChoiceSet({name,value,options,onChange}){
 return <div className="ogsurvey-choice-set" role="group" aria-label={name}>
  {options.map(([id,label])=><button type="button" key={id} aria-pressed={value===id} onClick={()=>onChange(id)}>{label}</button>)}
 </div>;
}
function RatingSet({name,value,onChange}){
 return <div className="ogsurvey-rating-set" role="group" aria-label={name}>
  {[1,2,3,4,5].map(number=><button type="button" key={number} aria-pressed={value===number} aria-label={number+' of 5 · '+LABELS[number-1]} onClick={()=>onChange(number)}><strong>{number}</strong><span>{LABELS[number-1]}</span></button>)}
 </div>;
}
function Field({name,label,value,onChange,placeholder,maxLength=1100}){
 return <label className="ogsurvey-field"><span>{label}</span><textarea name={name} value={value} onChange={e=>onChange(e.target.value)} maxLength={maxLength} placeholder={placeholder} rows={3}/><small>{value?.length||0} / {maxLength}</small></label>;
}

export default function OG1PilotSurvey({onDone,completed=true}){
 const [draft,setDraft]=useState(readDraft);
 const [step,setStep]=useState(0);
 const [sending,setSending]=useState(false);
 const [error,setError]=useState('');
 const [receipt,setReceipt]=useState(()=>{
  if(typeof window==='undefined')return null;
  try{return JSON.parse(window.localStorage.getItem(RECEIPT_KEY)||'null');}catch{return null;}
 });
 useEffect(()=>{
  if(!receipt&&typeof window!=='undefined')window.localStorage.setItem(DRAFT_KEY,JSON.stringify(draft));
 },[draft,receipt]);
 function change(field,value){setError('');setDraft(old=>({...old,[field]:value}));}
 function rate(id,value){setError('');setDraft(old=>({...old,ratings:{...old.ratings,[id]:value}}));}
 function goNext(){
  if(step===0&&!draft.overall){setError('Please give the experience an overall rating before continuing.');return;}
  setError('');setStep(i=>Math.min(2,i+1));window.scrollTo({top:0,behavior:'auto'});
 }
 function goBack(){setError('');setStep(i=>Math.max(0,i-1));window.scrollTo({top:0,behavior:'auto'});}
 async function submit(){
  if(sending)return;
  if(!draft.overall){setStep(0);setError('Please rate the overall experience before submitting.');return;}
  setSending(true);setError('');
  try{
   const response=await fetch('/api/pilot/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...draft,version:OG1_PILOT_SURVEY_VERSION,completed:Boolean(completed)})});
   const result=await response.json();
   if(!response.ok||!result.accepted)throw new Error(result.error||'Submission could not be saved');
   const saved={submittedAt:new Date().toISOString(),version:OG1_PILOT_SURVEY_VERSION};
   window.localStorage.setItem(RECEIPT_KEY,JSON.stringify(saved));
   window.localStorage.removeItem(DRAFT_KEY);
   setReceipt(saved);
   window.scrollTo({top:0,behavior:'auto'});
  }catch(e){setError(e?.message||'Could not save feedback. Your draft is still here.');}
  finally{setSending(false);}
 }
 function startAgain(){
  window.localStorage.removeItem(RECEIPT_KEY);
  window.localStorage.removeItem(DRAFT_KEY);
  setReceipt(null);setStep(0);setError('');
  setDraft({...newPilotSurveyDraft(),submissionId:makeSubmissionId(),version:OG1_PILOT_SURVEY_VERSION});
 }
 if(receipt)return <div className="ogsurvey-page"><section className="ogsurvey-thanks" role="status">
  <div className="ogsurvey-thanks-mark" aria-hidden="true">✓</div>
  <span>YOUR FEEDBACK WAS SAVED</span><h1>Thank you for helping shape Jeremiah.</h1>
  <p>Your answers are part of the pilot feedback we're using to improve the experience. Your lesson answers and score were not included with the survey.</p>
  <div className="ogsurvey-actions"><button type="button" className="ogsurvey-primary" onClick={onDone}>Return to Jeremiah →</button><button type="button" className="ogsurvey-secondary" onClick={startAgain}>Share additional feedback</button></div>
 </section></div>;
 return <div className="ogsurvey-page"><div className="ogsurvey-shell">
  <header className="ogsurvey-heading"><span>JEREMIAH · PILOT EVALUATION</span><h1>Help us build a better lesson.</h1><p>You've experienced Jeremiah. Now evaluate it as a learner—not as an examiner. Tell us what felt excellent, what slowed you down, and what we should improve. Positive and critical feedback are equally valuable.</p><div className="ogsurvey-privacy">Anonymous by default · No name or email required · Your lesson responses and score are not sent</div></header>
  <div className="ogsurvey-progress"><span>PART {step+1} OF 3</span><div aria-label={'Survey step '+(step+1)+' of 3'}>{[0,1,2].map(i=><span className={i<=step?'is-active':''} key={i}/>)}</div><strong>{['Your impression','The details','What to improve'][step]}</strong></div>
  {step===0&&<section className="ogsurvey-section" aria-labelledby="ogsurvey-overall-title">
   <div className="ogsurvey-section-heading"><span>01 · YOUR IMPRESSION</span><h2 id="ogsurvey-overall-title">How was the overall experience?</h2><p>Consider both the teaching and how the application delivered it.</p></div>
   <fieldset className="ogsurvey-overall"><legend>Overall experience <em>required</em></legend><RatingSet name="Overall experience" value={draft.overall} onChange={v=>change('overall',v)}/></fieldset>
   <fieldset className="ogsurvey-question"><legend>Would you want to take another lesson like this?</legend><ChoiceSet name="Interest in another lesson" value={draft.future} options={PILOT_FUTURE_OPTIONS} onChange={v=>change('future',v)}/></fieldset>
   <fieldset className="ogsurvey-question"><legend>What part stayed with you most?</legend><ChoiceSet name="Most memorable part" value={draft.moment} options={PILOT_MOMENT_OPTIONS} onChange={v=>change('moment',v)}/></fieldset>
  </section>}
  {step===1&&<section className="ogsurvey-section" aria-labelledby="ogsurvey-ratings-title">
   <div className="ogsurvey-section-heading"><span>02 · LOOK CLOSER</span><h2 id="ogsurvey-ratings-title">Rate the parts that matter.</h2><p>1 is very poor; 5 is excellent. Skip anything you didn't use or don't feel able to evaluate.</p></div>
   <div className="ogsurvey-ratings">{PILOT_RATING_AREAS.map(area=><fieldset className="ogsurvey-rating-row" key={area.id}>
    <legend><strong>{area.label}</strong><small>{area.hint}</small></legend>
    <RatingSet name={area.label} value={draft.ratings?.[area.id]||0} onChange={v=>rate(area.id,v)}/>
   </fieldset>)}</div>
  </section>}
  {step===2&&<section className="ogsurvey-section" aria-labelledby="ogsurvey-open-title">
   <div className="ogsurvey-section-heading"><span>03 · HELP US IMPROVE</span><h2 id="ogsurvey-open-title">What would make Jeremiah excellent?</h2><p>Your specific examples will help us prioritize the next design and teaching improvements.</p></div>
   <fieldset className="ogsurvey-question"><legend>What single area should we improve first?</legend><ChoiceSet name="Top improvement priority" value={draft.priority} options={PILOT_PRIORITY_OPTIONS} onChange={v=>change('priority',v)}/></fieldset>
   <div className="ogsurvey-open-fields">
    <Field name="bestPart" label="What worked especially well?" value={draft.bestPart} maxLength={1100} onChange={v=>change('bestPart',v)} placeholder="A moment, interaction, image, or teaching method you would keep…"/>
    <Field name="improve" label="What is the one change you'd most like us to make?" value={draft.improve} maxLength={1400} onChange={v=>change('improve',v)} placeholder="Be specific, even if it is critical."/>
    <Field name="confusing" label="Where did you feel lost, bored, frustrated, or unsure what to do?" value={draft.confusing} maxLength={1100} onChange={v=>change('confusing',v)} placeholder="A specific screen, question, audio issue, or instruction…"/>
    <Field name="other" label="Anything else we should know?" value={draft.other} maxLength={1000} onChange={v=>change('other',v)} placeholder="Ideas, accessibility concerns, teaching accuracy, or anything we missed…"/>
   </div>
   <div className="ogsurvey-optional-context"><fieldset className="ogsurvey-question"><legend>What kind of device did you use? <small>(optional)</small></legend><ChoiceSet name="Device used" value={draft.device} options={PILOT_DEVICE_OPTIONS} onChange={v=>change('device',v)}/></fieldset>
   <fieldset className="ogsurvey-question"><legend>Which best describes your perspective? <small>(optional)</small></legend><ChoiceSet name="Pilot participant perspective" value={draft.role} options={PILOT_ROLE_OPTIONS} onChange={v=>change('role',v)}/></fieldset></div>
   <p className="ogsurvey-privacy-note">Please don't include personal contact information, names, or private details in your comments. We use these responses to improve the lesson, not to evaluate individual learners.</p>
  </section>}
  {error&&<p role="alert" className="ogsurvey-error">{error}</p>}
  <footer className="ogsurvey-actions">
   {step>0&&<button type="button" className="ogsurvey-secondary" onClick={goBack} disabled={sending}>← Previous</button>}
   {step<2?<button type="button" className="ogsurvey-primary" onClick={goNext}>Continue →</button>:<button type="button" className="ogsurvey-primary" onClick={submit} disabled={sending}>{sending?'Saving…':'Submit my feedback →'}</button>}
   <button type="button" className="ogsurvey-skip" onClick={onDone} disabled={sending}>Leave without submitting</button>
  </footer>
  </div></div>;
}
