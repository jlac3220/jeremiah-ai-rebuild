import {useEffect,useRef,useState} from 'react';
import {OG1_EVIDENCE,OG1_EVIDENCE_DEFAULT} from '../../data/curriculum/og1Evidence';
import './OG1EvidenceExperience.css';

// Every picture in this viewer is of an actual surviving artifact.
// The adjacent KJV is a translation, not a transcription of Greek/Hebrew ink.
export default function OG1EvidenceExperience({open,onClose,chapter='learn',onReadBible}) {
 const [selectedId,setSelectedId]=useState('nash');
 const [zoom,setZoom]=useState(1);
 const [imageFailed,setImageFailed]=useState(false);
 const [revealed,setRevealed]=useState(false);
 const dialog=useRef(null);
 const opened=useRef(false);
 const selected=OG1_EVIDENCE.find(item=>item.id===selectedId)||OG1_EVIDENCE[0];

 useEffect(()=>{
  if(open&&!opened.current){
   setSelectedId(OG1_EVIDENCE_DEFAULT[chapter]||'nash');
   setZoom(1);
   setImageFailed(false);
   setRevealed(false);
  }
  opened.current=open;
 },[open,chapter]);

 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement;
  const oldOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  dialog.current?.focus();
  const onKey=(e)=>{
   if(e.key==='Escape'){e.preventDefault();onClose();return;}
   if(e.key!=='Tab')return;
   const controls=[...dialog.current.querySelectorAll('a[href],button:not([disabled])')];
   if(!controls.length)return;
   const first=controls[0],last=controls[controls.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',onKey);
  return ()=>{
   document.removeEventListener('keydown',onKey);
   document.body.style.overflow=oldOverflow;
   previous?.focus?.();
  };
 },[open,onClose]);

 function choose(id){
  setSelectedId(id);
  setZoom(1);
  setImageFailed(false);
  setRevealed(false);
 }
 if(!open)return null;
 return <div className="oge-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section className="oge-panel" role="dialog" aria-modal="true" aria-labelledby="oge-title" tabIndex={-1} ref={dialog}>
   <div className="oge-top">
    <div><span className="oge-eyebrow">JEREMIAH · THE ONE TRUE GOD</span>
     <h2 id="oge-title">Explore the Evidence</h2>
     <p>Look closely at manuscripts that survived from the ancient world.</p>
    </div>
    <button type="button" className="oge-close" aria-label="Close evidence experience" onClick={onClose}>✕</button>
   </div>
   <nav className="oge-tabs" aria-label="Choose a historical artifact">
    {OG1_EVIDENCE.map(item=><button key={item.id} type="button"
     aria-current={selectedId===item.id?'true':undefined}
     className={selectedId===item.id?'is-active':''} onClick={()=>choose(item.id)}>
     <span>{item.institution.split('·')[0].split('/')[0]}</span><strong>{item.title}</strong>
    </button>)}
   </nav>
   <div className="oge-content" key={selected.id}>
    <div className="oge-image-column">
     <div className="oge-image-header">
      <span>THE ORIGINAL ARTIFACT</span>
      <div className="oge-zoom-controls" aria-label="Magnify manuscript image">
       <button type="button" aria-label="Zoom out" disabled={zoom<=1||imageFailed} onClick={()=>setZoom(z=>Math.max(1,+(z-.5).toFixed(1)))}>−</button>
       <span aria-live="polite">{Math.round(zoom*100)}%</span>
       <button type="button" aria-label="Zoom in" disabled={zoom>=3||imageFailed} onClick={()=>setZoom(z=>Math.min(3,+(z+.5).toFixed(1)))}>+</button>
       <button type="button" aria-label="Reset zoom" onClick={()=>setZoom(1)}>Reset</button>
      </div>
     </div>
     <div className="oge-image-viewport" role="region" aria-label={'Magnifiable image: '+selected.title} tabIndex={0}>
      {imageFailed?<div className="oge-image-missing"><strong>Image unavailable</strong><span>The original collection is still accessible below.</span></div>
       :<img src={selected.image} alt={selected.imageAlt} loading="lazy"
        style={{width:zoom*100+'%'}} onError={()=>setImageFailed(true)}/>}
     </div>
     <p className="oge-image-note">{selected.imageNote}</p>
     <div className="oge-attribution"><span>Image reference: <a href={selected.imageSource} target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a></span>
      <a href={selected.source} target="_blank" rel="noopener noreferrer" className="oge-source-link">Examine the institution's collection ↗</a>
     </div>
    </div>
    <div className="oge-reading">
     <span className="oge-era">{selected.era} · {selected.language} manuscript</span>
     <h3>{selected.title}</h3>
     <p className="oge-institution">{selected.institution} · {selected.shelfmark}</p>
     <p>{selected.description}</p>
     <div className="oge-scripture">
      <span>{selected.reference.toUpperCase()} · KJV</span>
      <blockquote>“{selected.passage}”</blockquote>
      <small>The KJV text is shown beside the manuscript for study; it is not printed on the artifact.</small>
     </div>
     <div className="oge-observe"><span>LOOK CLOSER</span><p>{selected.observe}</p></div>
     <button type="button" className="oge-reveal" aria-expanded={revealed}
       onClick={()=>setRevealed(v=>!v)}>{revealed?'Hide the connection':'Why this matters'} <span aria-hidden="true">↗</span></button>
     {revealed&&<p className="oge-revelation">This artifact is a later manuscript witness to the biblical writing. It helps us encounter the history of the text without treating the artifact as the original page written by its biblical author.</p>}
     <div className="oge-actions">
      <button type="button" onClick={()=>{onClose();onReadBible?.(selected.reference);}}>Read the passage in Jeremiah →</button>
      <button type="button" onClick={onClose}>Return to the lesson</button>
     </div>
    </div>
   </div>
  </section>
 </div>;
}
