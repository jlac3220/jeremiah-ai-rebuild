import {useCallback,useEffect,useState} from 'react';
import content from '../../core/classroom/content/OG_1_LESSON';
import {loadLearningState,saveLearningState,markLearningMilestones} from '../../core/classroom/learningEngine';
import {restartTeaching} from '../../core/classroom/teacherLedEngine';
import OG1LessonPlayer from '../classroom/OG1LessonPlayer';
import OG1PilotLanding from './OG1PilotLanding';
import OG1PilotSurvey from './OG1PilotSurvey';
import {pilotRoute} from './standalonePilot';
import './OG1EvaluationApp.css';

const CONSENT='jeremiah-og1-evaluation-consent';
function loadEvaluationState(){
 const prefix='jeremiah-learning-state:'+content.standardId+':';
 try{const direct=JSON.parse(localStorage.getItem(prefix+'direct')||'null'),review=JSON.parse(localStorage.getItem(prefix+'review')||'null');const preset=review&&(!direct||review.lastUpdatedAt>direct.lastUpdatedAt)?'review':'direct';return {...loadLearningState(content,preset),presetId:'direct'};}catch{return loadLearningState(content,'direct');}
}

export default function OG1EvaluationApp(){
 const [route,setRoute]=useState(()=>pilotRoute(window.location.hash));
 const [state,setState]=useState(loadEvaluationState);
 const changeState=useCallback(update=>setState(old=>{const next=typeof update==='function'?update(old):update;const fixed={...next,standardId:content.standardId,presetId:'direct'};return fixed.currentMoveId==='complete'?markLearningMilestones(fixed,['complete']):fixed;}),[]);
 const [accessFor,setAccessFor]=useState(null);
 const [consented,setConsented]=useState(()=>window.sessionStorage.getItem(CONSENT)==='1');
 const refreshAccess=useCallback(async()=>{try{const r=await fetch('/api/pilot/access');const a=r.ok?await r.json():null;const allowed=Boolean(a?.authenticated&&['local','invite','verify'].includes(a.mode));return allowed;}catch{return false;}},[]);
 useEffect(()=>{saveLearningState(state);},[state]);
 useEffect(()=>{let active=true;refreshAccess().then(allowed=>{if(active)setAccessFor(allowed?route:null)});return()=>{active=false};},[refreshAccess,route]);
 const navigate=useCallback(requested=>{const next=pilotRoute(requested);if(window.location.hash!=='#'+next)window.location.hash=next;setRoute(next);window.scrollTo({top:0,behavior:'auto'});},[]);
 useEffect(()=>{
  function sync(){const next=pilotRoute(window.location.hash);if(window.location.hash!=='#'+next)window.history.replaceState(null,'','#'+next);setRoute(next);window.scrollTo({top:0,behavior:'auto'});}
  const initial=pilotRoute(window.location.hash);if(window.location.hash!=='#'+initial)window.history.replaceState(null,'','#'+initial);window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync)};
 },[]);
 const entered=accessFor===route&&consented;
 async function start(fresh){if(!await refreshAccess())return;if(fresh)setState(old=>({...restartTeaching(content,old),presetId:'direct'}));window.sessionStorage.setItem(CONSENT,'1');setConsented(true);setAccessFor('lesson');navigate('lesson');}
 async function earlyFeedback(){if(!await refreshAccess())return;window.sessionStorage.setItem(CONSENT,'1');setConsented(true);setAccessFor('pilot-feedback');navigate('pilot-feedback');}
 // General-app routes and global classroom selectors never enter this shell.
 const onNavigate=destination=>navigate(destination==='pilot-feedback'?'pilot-feedback':'pilot');
 return <div className="app-shell" data-standalone-og1="true"><a className="brand-skip" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus()}}>Skip to main content</a><main className="app-main" id="main-content" tabIndex={-1}>
  {route==='lesson'&&entered?<OG1LessonPlayer content={content} state={state} onStateChange={changeState} onNavigate={onNavigate} standalone/>
   :route==='pilot-feedback'&&entered?<OG1PilotSurvey completed={false} standalone onDone={()=>navigate('pilot')}/>
   :<OG1PilotLanding standalone lessonState={state} onStart={start} onEarlyFeedback={earlyFeedback} onNavigate={()=>navigate('pilot')}/>}
 </main></div>;
}
