import {useEffect,useRef,useState} from 'react';
import {OG1_JOURNEY_CHAPTERS} from './OG1JourneyMap';

export default function OG1ChapterGuide({expanded,onClose,chapterNumber,finish,taskTitle,next}) {
 const [selected,setSelected]=useState(null);
 const heading=useRef(null);
 const index=selected??Math.max(0,chapterNumber-1);
 const chapter=OG1_JOURNEY_CHAPTERS[index];
 useEffect(()=>{
  if(!expanded)return;
  const previous=document.activeElement;
  heading.current?.focus({preventScroll:true});
  return ()=>previous?.isConnected&&previous.focus();
 },[expanded]);
 if(!expanded)return null;
 return <section id="og2-chapter-guide" className="og2-chapter-guide" aria-labelledby="og2-guide-title">
  <header><div><span>ONE CONNECTED JOURNEY</span><h2 id="og2-guide-title" ref={heading} tabIndex={-1}>Five chapters. One unfolding story.</h2></div><button type="button" onClick={onClose}>Close chapter map</button></header>
  <p className="og2-guide-place"><strong>Your place · {taskTitle}</strong><span>Up next: {next}</span></p>
  <div className="og2-guide-chapters" role="group" aria-label="Explore each chapter’s focus">
   {OG1_JOURNEY_CHAPTERS.map((item,i)=><button type="button" key={item.id} aria-pressed={index===i} aria-controls="og2-chapter-focus" onClick={()=>setSelected(i)}>
    <span>{item.number}</span><strong>{item.title}</strong><small>{finish||chapterNumber>i+1?'Covered':chapterNumber===i+1?'You are here':'Ahead'}</small>
   </button>)}
  </div>
  <div id="og2-chapter-focus" className="og2-guide-focus" aria-live="polite"><span>{chapter.scripture}</span><h3>{chapter.question}</h3><p>{chapter.summary}</p></div>
  <footer><span>Explore the chapter focus here. Your saved place and assessment evidence stay unchanged.</span><button type="button" onClick={onClose}>Return to my lesson →</button></footer>
 </section>;
}
