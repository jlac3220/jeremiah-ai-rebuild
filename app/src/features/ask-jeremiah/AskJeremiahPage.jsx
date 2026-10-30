import {useEffect,useRef,useState} from 'react';
import {ROUTES} from '../../app/routes';
import {askJeremiah} from '../../services/askJeremiah';
import './AskJeremiahPage.css';

const SESSION_KEY='jeremiah.ask.messages.v1';
const STARTERS=[
 {label:'The one God',question:'What does Deuteronomy 6:4 teach about the one God?'},
 {label:'The New Birth',question:'Why does Scripture teach that we need to be born again?'},
 {label:'Jesus’ name baptism',question:'What do the New Birth standards teach about baptism in Jesus’ name?'},
 {label:'Receiving the Spirit',question:'What do the standards teach about receiving the Holy Spirit?'}
];
function restoreConversation(){
 try{
  const saved=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'[]');
  return Array.isArray(saved)?saved.filter(m=>['user','assistant'].includes(m.role)&&typeof m.text==='string').slice(-30):[];
 }catch{return [];}
}
function CompassIcon(){
 return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M16 3 19.3 12.7 29 16l-9.7 3.3L16 29l-3.3-9.7L3 16l9.7-3.3Z"/><circle cx="16" cy="16" r="2.2" fill="currentColor" stroke="none"/></svg>;
}
export default function AskJeremiahPage({onNavigate}){
 const [messages,setMessages]=useState(restoreConversation);
 const [draft,setDraft]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const controller=useRef(null);
 const bottom=useRef(null);
 const input=useRef(null);
 useEffect(()=>{try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(messages.slice(-30)));}catch{/* session storage optional */}},[messages]);
 useEffect(()=>{bottom.current?.scrollIntoView({behavior:'smooth',block:'end'});},[messages,busy,error]);
 useEffect(()=>()=>controller.current?.abort(),[]);
 async function send(text){
  const question=String(text||'').trim();
  if(!question||busy)return;
  const history=messages.slice(-6).map(m=>({role:m.role,text:m.text}));
  setMessages(prev=>[...prev,{id:Date.now()+'-u',role:'user',text:question}]);
  setDraft('');setError('');setBusy(true);
  const request=new AbortController();controller.current=request;
  try{
   const result=await askJeremiah(question,history,request.signal);
   if(!request.signal.aborted)setMessages(prev=>[...prev,{
    id:Date.now()+'-a',role:'assistant',text:result.answer,
    status:result.status,sources:result.sources||[]
   }]);
  }catch(e){
   if(e.name!=='AbortError')setError(e.message||'Unable to answer right now. Your question is still here.');
  }finally{
   if(controller.current===request){controller.current=null;setBusy(false);}
  }
 }
 function clearConversation(){
  controller.current?.abort();controller.current=null;
  setBusy(false);setMessages([]);setError('');setDraft('');input.current?.focus();
 }
 const lastQuestion=[...messages].reverse().find(m=>m.role==='user')?.text;
 return <div className="aj-page">
  <div className="aj-shell">
   <header className="aj-header">
    <button type="button" className="aj-wordmark" onClick={()=>onNavigate(ROUTES.HOME)} aria-label="Jeremiah home"><span className="aj-mark">J</span><span>JEREMIAH <small>THE CLASSROOM COMPANION</small></span></button>
    {messages.length>0&&<button type="button" className="aj-reset" onClick={clearConversation}>New conversation</button>}
   </header>
   <div className="aj-layout">
    <aside className="aj-intro" aria-label="About Ask Jeremiah">
     <span className="aj-overline">A DIFFERENT WAY TO LEARN</span>
     <h1>Ask <em>Jeremiah.</em></h1>
     <p>Bring your questions to the Word. Explore clear, Scripture-grounded answers connected to what you’re learning.</p>
     <div className="aj-scope"><div className="aj-scope-top"><span className="aj-scope-dot"/> SCRIPTURE-GROUNDED TEACHING</div><strong>The Word comes first <span>J</span></strong><p>Questions are answered from Jeremiah’s current teaching material. As new studies are added, Jeremiah’s knowledge grows with them.</p></div>
     <div className="aj-aside-note"><span>✦</span><span>The standards guide every answer. Jeremiah will tell you when a subject is not covered yet.</span></div>
    </aside>
    <section className="aj-chat" aria-label="Ask Jeremiah conversation">
     <div className="aj-chat-heading"><div className="aj-identity"><span className="aj-avatar">J</span><div><strong>Ask Jeremiah</strong><small>Scripture · Current teaching</small></div></div><span className="aj-status"><i/> Standards grounded</span></div>
     <div className="aj-thread" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
      {messages.length===0&&<div className="aj-welcome">
       <div className="aj-welcome-icon"><CompassIcon/></div>
       <span className="aj-overline">YOUR QUESTIONS BELONG HERE</span>
       <h2>What would you like to understand?</h2>
       <p>Ask naturally. Jeremiah will answer from the teaching he has, using Scripture to explain the truth.</p>
       <div className="aj-starters" aria-label="Suggested questions">{STARTERS.map(s=><button type="button" key={s.label} onClick={()=>send(s.question)} disabled={busy}><span>{s.label}</span><span aria-hidden="true">↗</span></button>)}</div>
      </div>}
      {messages.map(message=><article className={'aj-message aj-message--'+message.role} key={message.id}>
       {message.role==='assistant'&&<span className="aj-message-mark" aria-hidden="true">J</span>}
       <div className="aj-message-body">
        {message.role==='assistant'&&<div className="aj-message-byline">JEREMIAH</div>}
        <p>{message.text}</p>
        {message.role==='assistant'&&message.sources?.length>0&&<details className="aj-sources" aria-label="Teaching sources"><summary>Explore the teaching sources</summary><div className="aj-source-list">{message.sources.map(source=><span key={source.id} className="aj-source" title={source.title}>{source.title} · {source.id}</span>)}</div></details>}
       </div>
      </article>)}
      {busy&&<div className="aj-typing" role="status"><span className="aj-message-mark">J</span><span>Jeremiah is considering your question<span className="aj-typing-dots">···</span></span></div>}
      {error&&<div className="aj-error" role="alert"><p>{error}</p><button type="button" disabled={busy} onClick={()=>{setMessages(prev=>prev.slice(0,-1));send(lastQuestion)}}>Try again</button></div>}
      <div ref={bottom}/>
     </div>
     <div className="aj-composer">
      <form onSubmit={event=>{event.preventDefault();send(draft)}} aria-label="Ask a question">
       <label htmlFor="aj-question" className="aj-visually-hidden">Your question about the standards</label>
       <textarea id="aj-question" ref={input} rows={2} maxLength={1600} value={draft} placeholder="Ask about Scripture, God’s oneness, or the New Birth…" onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send(draft)}}} disabled={busy}/>
       <button type="submit" disabled={busy||!draft.trim()} aria-label="Send question"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7M12 5v14"/></svg></button>
      </form>
      <p>Scripture-grounded · Within Jeremiah’s current teaching</p>
     </div>
    </section>
   </div>
  </div>
 </div>;
}
