import BrandLogo from '../../shared/brand/BrandLogo';
import ogStudy from '../../data/curriculum/og.json';
import {useEffect,useState} from 'react';
import {ROUTES} from '../../app/routes';
import {getClassroomContentByStandardId} from '../../core/classroom/content/classroomContentRegistry';
import {loadLearningState,clearLearningState} from '../../core/classroom/learningEngine';
import {setActiveClassroomStandardId,setActiveClassroomSessionPreset} from '../../core/classroom/classroomSessionData';
import {setClassroomEntryIntent,CLASSROOM_ENTRY_INTENTS} from '../../core/classroom/classroomEntryIntent';
import './OG1PilotLanding.css';

const PILOT_STANDARD='OG.1.LESSON.18';
const OG1_DOMAIN=ogStudy.domains.find(domain=>domain.id==='OG.1');
const PROFILE_KEY='jeremiah-og1-participant-profile';
const PROFILE_FIELDS=[
 ['age','Age range',[['','Select an answer'],['18-29','18–29'],['30-44','30–44'],['45-59','45–59'],['60-74','60–74'],['75plus','75+'],['prefer_not','Prefer not to answer']]],
 ['sex','Sex',[['','Select an answer'],['female','Female'],['male','Male'],['prefer_not','Prefer not to answer']]],
 ['bibleFamiliarity','Bible familiarity',[['','Select an answer'],['very','Very familiar'],['somewhat','Somewhat familiar'],['little','A little familiar'],['none','Not familiar']]],
 ['pentecostalExperience','Pentecostal / Apostolic teaching experience',[['','Select an answer'],['current','Currently attend'],['previous','Previously attended'],['familiar','Familiar, never attended'],['none','Little or no experience']]],
 ['techComfort','Comfort with technology',[['','Select an answer'],['very','Very comfortable'],['somewhat','Somewhat comfortable'],['not_very','Not very comfortable']]]
];
export function hasCompletePilotProfile(profile=savedProfile()){return PROFILE_FIELDS.every(([key,,options])=>Boolean(profile?.[key])&&options.some(([value])=>value===profile[key]));}
function savedProfile(){try{const p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');return p&&typeof p==='object'&&!Array.isArray(p)?Object.fromEntries(PROFILE_FIELDS.map(([key,,options])=>[key,options.some(([v])=>v===p[key])?p[key]:''])):{};}catch{return {};}}


export default function OG1PilotLanding({onNavigate,standalone=false,lessonState,onStart,onEarlyFeedback}){
 const [consent,setConsent]=useState(false);
 const [profile,setProfile]=useState(savedProfile);
 const profileComplete=hasCompletePilotProfile(profile);
 const remainingProfileQuestions=PROFILE_FIELDS.filter(([key])=>!profile[key]).length;
 const [ownerName,setOwnerName]=useState('owner'),[ownerPassword,setOwnerPassword]=useState('');
 const [access,setAccess]=useState(null),[accessUnavailable,setAccessUnavailable]=useState(false),[invite,setInvite]=useState(''),[accessError,setAccessError]=useState(''),[unlocking,setUnlocking]=useState(false);
 useEffect(()=>{const controller=new AbortController();fetch('/api/pilot/access',{signal:controller.signal}).then(r=>r.ok?r.json():null).then(value=>{if(value&&['closed','invite','verify','local','link'].includes(value.mode)&&typeof value.authenticated==='boolean')setAccess(value);else setAccessUnavailable(true)}).catch(()=>{if(!controller.signal.aborted)setAccessUnavailable(true)});return()=>controller.abort();},[]);
 const needsInvite=access?.mode==='invite'&&!access.authenticated;
 const needsOwner=access?.mode==='verify'&&!access.authenticated;
 const localPreview=['localhost','127.0.0.1'].includes(window.location.hostname);
 const closed=(!access&&!localPreview)||access?.mode==='closed'||needsOwner;
 async function unlock(event){event.preventDefault();if(!consent||unlocking)return;setUnlocking(true);setAccessError('');try{const r=await fetch('/api/pilot/access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:invite,adultConsent:consent})});const data=await r.json();if(!r.ok||!data.accepted)throw new Error(data.error||'Invitation unavailable.');setInvite('');setAccess(old=>({...old,authenticated:true}));}catch(e){setAccessError(e.message||'Please retry your invitation.');}finally{setUnlocking(false);}}

 async function unlockOwner(event){
  event.preventDefault();
  if(unlocking||!ownerName||!ownerPassword)return;
  setUnlocking(true);setAccessError('');
  try{
   const auth=btoa(ownerName+':'+ownerPassword);
   const r=await fetch('/api/pilot/access',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json',Authorization:'Basic '+auth},body:JSON.stringify({adultConsent:true})});
   const data=await r.json();
   if(!r.ok||!data.accepted)throw new Error(data.error||'Owner verification failed.');
   const check=await fetch('/api/pilot/access',{credentials:'same-origin'});
   const session=check.ok?await check.json():null;
   if(!session?.authenticated||session.mode!=='verify')throw new Error('Owner session was not established. Please try again.');
   setOwnerPassword('');setAccess(session);
  }catch(e){setAccessError(e.message||'Owner verification failed.');}
  finally{setUnlocking(false);}
 }
 const [progress,setProgress]=useState(()=>{
  const content=getClassroomContentByStandardId(PILOT_STANDARD);
  return lessonState||(content?loadLearningState(content,'direct'):null);
 });
 const [showReset,setShowReset]=useState(false);
 const started=Boolean(progress?.completedMoveIds?.length||Object.keys(progress?.attemptsByMove||{}).length);
 const finished=Boolean(progress?.milestones?.complete||progress?.currentMoveId==='complete');
 function begin(fresh=false){
  if(!profileComplete||closed||needsInvite||needsOwner||(access?.mode==='invite'&&!consent))return;
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));}catch{/* browser storage may be disabled */}
  if(standalone){onStart?.(fresh);return;}
  const content=getClassroomContentByStandardId(PILOT_STANDARD);
  if(!content)return;
  if(fresh){clearLearningState(content,'direct');setProgress(loadLearningState(content,'direct'));}
  // The pilot always uses the new OG.1 player, never an old saved legacy-view flag.
  window.sessionStorage.removeItem('jeremiah-og1-classic');
  setActiveClassroomStandardId(PILOT_STANDARD);
  setActiveClassroomSessionPreset('direct');
  setClassroomEntryIntent(CLASSROOM_ENTRY_INTENTS.DIRECT);
  window.sessionStorage.setItem('jeremiah-pilot-active','1');
  onNavigate(ROUTES.CLASSROOM_LESSON);
 }
 return <div className="ogpilot-page">
  <header className="ogpilot-top"><BrandLogo /><span>{standalone?ogStudy.title.toUpperCase():'LESSON EXPERIENCE PILOT'}</span></header>
  <main className="ogpilot-shell">
   <section className="ogpilot-hero">
    <div>{!standalone&&<span className="ogpilot-eyebrow">INVITATION · HELP SHAPE THE EXPERIENCE</span>}
     <h1>{standalone?ogStudy.title:'Explore the lesson.'}{!standalone&&<><br/><em>Help make it remarkable.</em></>}</h1>
     {standalone&&<p className="ogpilot-domain-subtitle"><strong>OG.1</strong> · {OG1_DOMAIN.title}</p>}
     <p>{standalone?'Discover what Scripture teaches about the one God. First, tell us a little about yourself; then preview the five chapters before entering the lesson.':'Follow the confession of one God from Moses through Isaiah, Jesus, and the apostles. Experience the Scripture, imagery, narration, activities, and assessments—then tell us what worked and what needs to change.'}</p>
     {!standalone&&<div className="ogpilot-meta"><span>One complete lesson</span><span>Five connected chapters</span><span>Optional anonymous feedback</span></div>}
    </div>
    {!standalone&&<aside className="ogpilot-verse"><span>THE ONE TRUE GOD</span><blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote><small>DEUTERONOMY 6:4 · KJV</small><div aria-hidden="true">אֶחָד</div></aside>}
   </section>
   <section className="ogpilot-start" aria-labelledby={standalone?undefined:'ogpilot-start-title'} aria-label={standalone?'Get ready for The One True God lesson':undefined}>
    <div>{!standalone&&<><span className="ogpilot-eyebrow">HOW IT WORKS</span><h2 id="ogpilot-start-title">Your experience matters.</h2></>}<p>{standalone?'Your progress stays in this browser. The optional survey never includes your lesson answers or score.':'No account is required. Your lesson progress stays in this browser; if you return using the same browser, you can continue. The survey never sends your answers or exam score with your feedback.'}</p>
     <p className="ogpilot-privacy-note">This pilot uses AI to process written lesson responses. Feedback is optional. Please do not include personal identifying information.</p>
     {needsInvite&&<label className="ogpilot-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I am 18 or older and agree to participate in this private pilot.</span></label>}
     {closed&&<p role="status">{!access?(accessUnavailable?'Pilot access is temporarily unavailable. Please retry later.':'Checking private pilot access…'):needsOwner?'Owner sign-in required. Your private verification session has ended. Sign in to continue.':'The pilot is not open for participants yet.'}</p>}
     {needsOwner&&<form className="ogpilot-invite" onSubmit={unlockOwner}>
      <p>Owner verification required to enter this private pilot.</p>
      <label>Owner username<input type="text" autoComplete="username" value={ownerName} onChange={e=>setOwnerName(e.target.value)}/></label>
      <label>Owner password<input type="password" autoComplete="current-password" value={ownerPassword} onChange={e=>setOwnerPassword(e.target.value)}/></label>
      <button className="ogpilot-secondary" disabled={!ownerName||!ownerPassword||unlocking}>{unlocking?'Verifying owner…':'Unlock owner access'}</button>
      {accessError&&<p role="alert">{accessError}</p>}
     </form>}
     {needsInvite&&<form className="ogpilot-invite" onSubmit={unlock}><label>Private invitation code<input type="password" aria-label="Private invitation code" autoComplete="off" value={invite} onChange={e=>setInvite(e.target.value)}/></label><button className="ogpilot-secondary" disabled={!consent||!invite||unlocking}>{unlocking?'Checking invitation…':'Unlock my invitation'}</button>{accessError&&<p role="alert">{accessError}</p>}</form>}
     <div className="ogpilot-profile" style={{margin:'22px 0',padding:'20px',border:'1px solid #cbd5e1',borderRadius:16}}>
      <h2 style={{marginTop:0,fontSize:'1.2rem'}}>Tell us a little about yourself <span style={{fontSize:'.7rem',fontWeight:700,color:'#a34822',verticalAlign:'middle'}}>REQUIRED</span></h2>
      <p style={{fontSize:'.9rem'}}>All five answers are required to begin the lesson. No name or email. Your responses help us understand feedback across different groups.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14}}>
       {PROFILE_FIELDS.map(([key,label,options])=><label key={key} style={{display:'flex',flexDirection:'column',gap:6,fontWeight:600}}>{label} <span style={{fontSize:'.72rem',fontWeight:600,color:'#a34822'}}>Required</span>
        <select required aria-label={label} value={profile[key]||''} onChange={e=>setProfile(old=>({...old,[key]:e.target.value}))} style={{minHeight:44,padding:8,borderRadius:8,border:'1px solid #94a3b8',background:'#fff',color:'#172b4d',fontSize:'.95rem'}}>
         {options.map(([value,text])=><option key={value} value={value}>{text}</option>)}
        </select>
       </label>)}
      </div>
     </div>
     {!profileComplete&&<p role="status" aria-live="polite" style={{margin:'4px 0 12px',fontSize:'.93rem',fontWeight:600,color:'#a34822'}}>Complete all five required questions to unlock the lesson. {remainingProfileQuestions} {remainingProfileQuestions===1?'answer':'answers'} remaining.</p>}
     <div className="ogpilot-actions">
      <button type="button" className="ogpilot-primary" disabled={!profileComplete||closed||needsInvite||needsOwner||(access?.mode==='invite'&&!consent)} onClick={()=>begin(false)}>{standalone?(finished?'Review the lesson outline':started?'Continue to the lesson outline':'View lesson outline'):(finished?'Revisit the lesson':started?'Continue my lesson':'Start the lesson')} <span aria-hidden="true">→</span></button>
      {started&&<button type="button" className="ogpilot-secondary" onClick={()=>setShowReset(true)}>Start fresh</button>}
     </div>
     {showReset&&<div className="ogpilot-confirm" role="group" aria-label="Confirm restart"><p>Start from the beginning on this browser? {standalone?'Your previous run and results will be kept in history.':'Your existing local progress for this lesson will be cleared.'}</p><button type="button" disabled={!profileComplete||(access?.mode==='invite'&&!consent)} onClick={()=>{setShowReset(false);begin(true)}}>Yes, start fresh</button><button type="button" onClick={()=>setShowReset(false)}>Cancel</button></div>}
    </div>
    <aside className="ogpilot-feedback-invite">{!standalone&&<span className="ogpilot-eyebrow">YOUR VOICE SHAPES THE NEXT VERSION</span>}<h3>{standalone?'Leaving early?':'What should Jeremiah do better?'}</h3><p>{standalone?'Tell us why you couldn’t finish. You can return to your saved lesson later.':'After the lesson, evaluate teaching clarity, pacing, visual design, navigation, narrator, activities, and more. If you cannot finish, you can still tell us why.'}</p><button type="button" disabled={standalone&&(closed||needsInvite||needsOwner||(access?.mode==='invite'&&!consent))} onClick={()=>standalone?onEarlyFeedback?.():onNavigate(ROUTES.PILOT_FEEDBACK)}>{standalone?"I couldn’t finish · Give feedback ↗":'Share feedback without finishing ↗'}</button></aside>
   </section>
   <footer className="ogpilot-footnote">{access?.version&&access.version!=='development'?'Pilot edition '+access.version+' · ':''}Pilot evaluation · Please avoid including names or other identifying information in free-text feedback.</footer>
  </main>
 </div>;
}
