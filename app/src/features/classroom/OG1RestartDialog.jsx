import {useEffect,useRef} from 'react';

export default function OG1RestartDialog({onCancel,onRestart}) {
 const dialog=useRef(null);
 useEffect(()=>{
  const previous=document.activeElement;
  const element=dialog.current;
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  element.showModal();
  // Native modal dialog makes the page inert and handles dismissal semantics.
  return ()=>{element.close();document.body.style.overflow=overflow;previous?.focus()};
 },[]);
 function containTab(event){
  if(event.key!=='Tab')return;
  const buttons=[...dialog.current.querySelectorAll('button:not([disabled])')];
  const first=buttons[0],last=buttons.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }
 return <dialog ref={dialog} className="ogp-restart-dialog ogp-modal" aria-labelledby="ogp-restart-title" aria-describedby="ogp-restart-description" onKeyDown={containTab} onCancel={event=>{event.preventDefault();onCancel()}}>
  <h2 id="ogp-restart-title">Start OG.1 from the beginning?</h2>
  <p id="ogp-restart-description">You'll return to the first lesson moment. Your earlier answers and learning history will be kept for review.</p>
  <div className="ogp-restart-actions"><button type="button" className="ogp-back" autoFocus onClick={onCancel}>Keep my place</button><button type="button" className="ogp-action" onClick={onRestart}>Start from beginning →</button></div>
 </dialog>;
}
