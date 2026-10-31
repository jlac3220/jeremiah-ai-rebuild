import {useEffect,useRef,useState} from 'react';
import {findBibleBook,getChapterVerses,loadBibleChapter} from '../../core/bible/bibleCatalog';
import {parseBibleReference} from '../../core/bible/bibleReaderIntent';
import './OG1InlineBible.css';

// Uses the very same KJV chapter provider as Jeremiah's full Bible.
// No excerpt is invented or copied into this component.
export default function OG1InlineBible({reference,onClose}){
 const parsed=parseBibleReference(reference||'');
 const book=parsed?.book?findBibleBook(parsed.book):null;
 const [chapter,setChapter]=useState(parsed?.chapter||1);
 const [data,setData]=useState(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [size,setSize]=useState(1);
 const [reload,setReload]=useState(0);
 const dialogRef=useRef(null);
 const closeRef=useRef(onClose);
 closeRef.current=onClose;
 useEffect(()=>{setChapter(parsed?.chapter||1)},[reference]);
 useEffect(()=>{
  if(!book)return;
  let cancelled=false;
  setLoading(true);setData(null);setError('');
  loadBibleChapter('kjv',book,chapter).then(result=>{if(!cancelled)setData(result)})
   .catch(err=>{if(!cancelled)setError(err?.message||'Unable to load Scripture.')})
   .finally(()=>{if(!cancelled)setLoading(false)});
  return ()=>{cancelled=true};
 },[book?.osis,chapter,reload]);
 useEffect(()=>{
  const previous=document.activeElement;
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  dialogRef.current?.focus();
  function keydown(e){
   if(e.key==='Escape'){e.preventDefault();closeRef.current?.();return}
   if(e.key!=='Tab')return;
   const options=[...dialogRef.current?.querySelectorAll('button:not([disabled])')||[]];
   if(!options.length)return;
   if(e.shiftKey&&document.activeElement===options[0]){e.preventDefault();options[options.length-1].focus()}
   else if(!e.shiftKey&&document.activeElement===options[options.length-1]){e.preventDefault();options[0].focus()}
  }
  document.addEventListener('keydown',keydown);
  return ()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',keydown);previous?.focus?.()};
 },[]);
 if(!book||!parsed)return null;
 const verses=getChapterVerses(data);
 const focusStart=chapter===parsed.chapter?parsed.verse:null;
 const focusEnd=chapter===parsed.chapter?parsed.endVerse:null;
 return <div className="og1-bible-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="og1-bible-title" className="og1-bible-panel">
   <header className="og1-bible-header">
    <div><span>READ IN CONTEXT · KING JAMES VERSION</span><h2 id="og1-bible-title">{book.name} {chapter}</h2>
     <p>{reference} · The whole chapter, without leaving your lesson.</p></div>
    <button type="button" onClick={onClose} aria-label="Close Scripture and return to lesson">✕</button>
   </header>
   <div className="og1-bible-toolbar">
    <span>CHAPTER {chapter} OF {book.chapters}</span>
    <div><button type="button" disabled={size<=.9} onClick={()=>setSize(v=>Math.max(.9,v-.1))}>A−</button>
     <button type="button" disabled={size>=1.45} onClick={()=>setSize(v=>Math.min(1.45,v+.1))}>A+</button></div>
   </div>
   <div className="og1-bible-scripture" aria-live="polite">
    {loading?<p className="og1-bible-message">Loading KJV Scripture…</p>:
     error?<div className="og1-bible-message" role="alert"><p>{error}</p><button type="button" onClick={()=>setReload(n=>n+1)}>Try again</button></div>:
     <article style={{fontSize:size+'rem'}} aria-label={book.name+' chapter '+chapter}>
      {verses.map(item=><p key={item.verse} className={focusStart&&item.verse>=focusStart&&item.verse<=(focusEnd||focusStart)?'is-highlighted':''}>
       <sup>{item.verse}</sup>{item.text}
      </p>)}
     </article>}
   </div>
   <footer className="og1-bible-footer">
    <button type="button" disabled={chapter<=1} onClick={()=>setChapter(c=>c-1)}>← Previous chapter</button>
    <button type="button" onClick={onClose} className="og1-bible-return">Return to lesson →</button>
    <button type="button" disabled={chapter>=book.chapters} onClick={()=>setChapter(c=>c+1)}>Next chapter →</button>
   </footer>
  </section>
 </div>;
}
