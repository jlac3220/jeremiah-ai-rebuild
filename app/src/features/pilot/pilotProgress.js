const ID_KEY='jeremiah-og1-anonymous-participant-id';
const PROFILE_KEY='jeremiah-og1-participant-profile';
// One random ID per browser, never an email, device fingerprint or account.
function participantId(){
 try{
  let id=window.localStorage.getItem(ID_KEY);
  if(!id||!/^[-a-f0-9]{36}$/.test(id)){id=window.crypto.randomUUID();window.localStorage.setItem(ID_KEY,id);}
  return id;
 }catch{return null;}
}
function profile(){
 try{return JSON.parse(window.localStorage.getItem(PROFILE_KEY)||'{}');}catch{return {};}
}
const sent=new Set();
export function recordPilotMilestone(event,chapter=0){
 if(typeof window==='undefined'||!['pilot.jeremiah.app','localhost','127.0.0.1'].includes(window.location.hostname))return;
 if(!['started','chapter','assessment','completed'].includes(event)||!Number.isInteger(chapter)||chapter<0||chapter>5)return;
 const id=participantId();if(!id)return;
 const key=id+':'+event+':'+chapter;
 if(sent.has(key))return;
 sent.add(key);
 fetch('/api/pilot/progress',{method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({participantId:id,event,chapter,profile:profile()}),
  credentials:'same-origin',keepalive:true
 }).then(r=>{if(!r.ok)sent.delete(key);}).catch(()=>sent.delete(key));
}
