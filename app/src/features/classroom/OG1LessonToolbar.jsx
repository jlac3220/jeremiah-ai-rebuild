import {BrandFlame} from '../../shared/brand/BrandLogo';
import {useEffect,useRef,useState} from 'react';
import {ROUTES} from '../../app/routes';
import LessonIcon from '../../shared/lesson/LessonIcon';

export default function OG1LessonToolbar({narration,narrationText,onNavigate,onRestart,onOpenMap,standalone=false}) {
 const [open,setOpen]=useState(false);
 const root=useRef(null);
 const trigger=useRef(null);
 useEffect(()=>{
  if(!open)return;
  function closeOutside(event){if(!root.current?.contains(event.target))setOpen(false)}
  document.addEventListener('pointerdown',closeOutside);
  return ()=>document.removeEventListener('pointerdown',closeOutside);
 },[open]);
 function keydown(event){
  if(event.key==='Escape'&&open){event.preventDefault();setOpen(false);trigger.current?.focus()}
 }
 return <header className="ogp-header ogp-toolbar" ref={root} onKeyDown={keydown}>
  <button type="button" className="ogp-toolbar-back" aria-label={standalone?'Pause OG.1 and return to welcome':'Return to classroom'} onClick={()=>{narration.stop();onNavigate(standalone?ROUTES.PILOT:ROUTES.CLASSROOM_STUDY)}}><LessonIcon name="back"/><span>{standalone?'Pause OG.1':'Classroom'}</span></button>
  <div className="ogp-toolbar-brand"><BrandFlame /><strong>JEREMIAH<small>THE ONE TRUE GOD</small></strong></div>
  <div className="ogp-toolbar-actions">
   <button type="button" className="ogp-audio-setting" aria-pressed={narration.enabled} aria-label={narration.enabled?'Turn narration off':'Turn narration on'} onClick={narration.toggle}><LessonIcon name={narration.enabled?'sound':'muted'}/><span>Audio {narration.enabled?'on':'off'}</span></button>
   {narration.enabled&&narrationText&&<button type="button" className="ogp-audio-replay" aria-label={narration.loading?'Preparing narration':narration.speaking?'Stop narration':'Replay narration'} disabled={narration.loading} onClick={()=>narration.speaking?narration.stop():narration.speak(narrationText)}><LessonIcon name={narration.speaking?'stop':'replay'}/></button>}
   <button type="button" ref={trigger} className="ogp-options-trigger" aria-label="Lesson options" aria-expanded={open} aria-controls="ogp-lesson-options" onClick={()=>setOpen(value=>!value)}><LessonIcon name="more"/></button>
  </div>
  {open&&<section id="ogp-lesson-options" className="ogp-options-panel" aria-label="Lesson contents and options">
   <h2>In this lesson</h2>
   <button type="button" onClick={()=>{setOpen(false);trigger.current?.focus();onOpenMap?.()}}><LessonIcon name="context"/>Open chapter map</button>
   <p>Chapter coverage records your place, not mastery.</p>
   {standalone&&<button type="button" onClick={()=>{setOpen(false);narration.stop();onNavigate(ROUTES.PILOT_FEEDBACK)}}>I couldn’t finish · Give feedback</button>}
   <button type="button" onClick={()=>{setOpen(false);trigger.current?.focus();onRestart()}}><LessonIcon name="replay"/>Start over</button>
  </section>}
 </header>;
}
