import {useState} from 'react';
import LessonIcon from '../../shared/lesson/LessonIcon';
import './OG1Inquiry.css';

const EVIDENCE=[
 {ref:'Genesis 2:24',quote:'and they shall be one flesh.',title:'A word can describe a union.',shows:'Here echad describes two people becoming “one flesh.” The subject is a marriage, not God.',limit:'This shows how the word can be used. It neither proves nor refutes three eternal divine persons.',thread:'Word usage → Read the subject'},
 {ref:'Isaiah 44:6',quote:'I am the first, and I am the last; and beside me there is no God.',title:'The LORD excludes every rival.',shows:'Isaiah identifies the LORD as the only God. This gives Israel’s confession its exclusive force.',limit:'Both interpretations affirm one God. Exclusivity alone does not explain how Father, Son and Spirit relate.',thread:'Word usage → The one God'},
 {ref:'Mark 12:29',quote:'The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord:',title:'Jesus carries the confession forward.',shows:'Asked for the first commandment, Jesus repeats the Shema. The one-God confession continues into the New Testament.',limit:'Repeating the confession does not, by itself, explain Jesus’ incarnation or his prayers to the Father.',thread:'The one God → Jesus’ confession'}
];

export default function OG1EchadInquiry({className,index,image,onImageError,onOpenBible}) {
 const [claim,setClaim]=useState(null);
 const evidence=EVIDENCE[index-1];
 const read=ref=><button type="button" className="og1-inquiry-read" onClick={()=>onOpenBible?.(ref)}>{ref} · KJV <LessonIcon name="context"/></button>;
 return <article className={className+' og1-inquiry'} data-inquiry-step={index} aria-label="Why examine the word one?">
  <div className="og1-inquiry-scene">
   {image&&<img className="og1-inquiry-photo" src={image.src} alt="Moses addresses Israel as they receive the confession" onError={onImageError} style={{objectPosition:image.focal||'50% 38%'}}/>}
   <div className="og1-inquiry-shade" aria-hidden="true"/>
   <span className="og1-inquiry-kicker">THE QUESTION BEGINS HERE · DEUTERONOMY 6:4</span>
   <blockquote>“Hear, O Israel: The LORD our God is <mark>one</mark> LORD:”</blockquote>
   <div className="og1-inquiry-word"><strong lang="he" dir="rtl">אֶחָד</strong><span>echad <span aria-hidden="true">→</span> one</span></div>
   <small>The Hebrew word behind “one” in the confession.</small>
  </div>
  <section className="og1-inquiry-copy" key={index} aria-live="polite" aria-atomic="true">
   <span className="og1-inquiry-kicker">{index===0?'01 · ASK THE QUESTION':index===4?'05 · CARRY THE QUESTION FORWARD':`0${index+1} · FOLLOW THE EVIDENCE`}</span>
   {index===0?<>
    <h2>Does “one” answer every question?</h2>
    <p>Christians agree that God is one. How, then, should we understand Father, Son and Holy Spirit?</p>
    <div className="og1-inquiry-claims" role="group" aria-label="Explore two interpretations, not a quiz">
     <button type="button" aria-pressed={claim==='trinity'} onClick={()=>setClaim('trinity')}><strong>Trinitarian</strong><span>One divine being; Father, Son and Spirit are three eternal persons.</span></button>
     <button type="button" aria-pressed={claim==='oneness'} onClick={()=>setClaim('oneness')}><strong>Apostolic Oneness</strong><span>One indivisible God, truly becoming human in Jesus—without three eternal persons.</span></button>
    </div>
    <p className="og1-inquiry-limit">{claim===null?'Explore either reading. Neither is proved or refuted by the dictionary meaning of echad alone.':claim==='trinity'?'“One flesh” shows a use of the word, not a proof of three divine persons. The Trinitarian reading makes its case from wider Scripture.':'“One” names the confession, but the Apostolic explanation must also account for the Word, incarnation and Jesus’ real prayer.'}</p>
    <small className="og1-inquiry-note">Discovery only · No answer to submit or score.</small>
   </>:evidence?<>
    <h2>{evidence.title}</h2>
    <div className="og1-inquiry-evidence"><blockquote>“{evidence.quote}”</blockquote>{read(evidence.ref)}<small>KJV excerpt · Read the whole passage in context.</small></div>
    <div className="og1-inquiry-reason"><strong>WHAT THIS ESTABLISHES</strong><p>{evidence.shows}</p></div>
    <div className="og1-inquiry-limit"><strong>WHAT IT DOES NOT SETTLE</strong><p>{evidence.limit}</p></div>
    <small className="og1-inquiry-note">{evidence.thread}</small>
   </>:<>
    <h2>A starting point. Not a shortcut.</h2>
    <div className="og1-inquiry-reason"><strong>WHAT WE CAN SAY</strong><p>Echad means “one.” Isaiah excludes rival gods; Jesus repeats the confession. This is the shared one-God ground from which we continue.</p></div>
    <div className="og1-inquiry-limit"><strong>THE QUESTION WE WILL RETURN TO</strong><p>Do Father, Son and Spirit name three eternal persons, or the one God revealed in genuine incarnation? Neither interpretation rests on one Hebrew word.</p></div>
    <p className="og1-inquiry-next">Next we follow Isaiah and Paul. Then John’s Word, baptism in Jesus’ name, and Jesus’ prayer will bring us back to this question.</p>
   </>}
  </section>
 </article>;
}
