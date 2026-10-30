import {useEffect,useMemo,useState} from 'react';

// One discovery hook for OG, NB and every later curriculum. Searches are
// cached/deduplicated per meaning; actual image choices vary across surfaces.
const requests=new Map();
const usage=new Map();
const recently=[];
function nextImage(images,failed=[]) {
 const candidates=images.filter(a=>a?.id&&a.src&&!failed.includes(a.id));
 const ordered=[...candidates].sort((a,b)=>
  (usage.get(a.id)||0)-(usage.get(b.id)||0)
  || (recently.includes(a.id)?1:0)-(recently.includes(b.id)?1:0)
  || a.id.localeCompare(b.id));
 const result=ordered[0]||null;
 if(result){
  usage.set(result.id,(usage.get(result.id)||0)+1);
  recently.push(result.id);
  if(recently.length>18)recently.shift();
 }
 return result;
}
function discover(brief,key) {
 const old=requests.get(key);
 if(old&&Date.now()-old.at<1000*60*30)return old.promise;
 const promise=fetch('/api/visuals/discover',{
  method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({brief})
 }).then(r=>{if(!r.ok)throw new Error('No visual search');return r.json()})
  .then(data=>Array.isArray(data.assets)?data.assets:[]).catch(()=>[]);
 requests.set(key,{at:Date.now(),promise});
 if(requests.size>100)requests.delete(requests.keys().next().value);
 return promise;
}
export default function useDiscoveredLessonVisual(brief,fallback=null){
 const key=useMemo(()=>JSON.stringify(brief?{
  intent:brief.intent,subject:brief.subject,reference:brief.reference,
  topic:brief.topic,learningGoal:brief.learningGoal
 }:null),[brief?.intent,brief?.subject,brief?.reference,brief?.topic,brief?.learningGoal]);
 const [state,setState]=useState({key:null,assets:[],active:null,failed:[]});
 useEffect(()=>{
  let live=true;
  if(!brief||brief.intent==='none'){
   setState({key,assets:[],active:null,failed:[]});return;
  }
  // Retain a relevant known illustration during discovery; if no licensed,
  // relevant candidate exists, that illustration remains the fallback.
  setState({key,assets:[],active:null,failed:[]});
  // Search metadata does not prove identity. Never replace an editorially
  // chosen Isaiah/Moses/Jesus/Paul scene with an unreviewed stock result.
  // Discovery remains available for future editorial review, but not as an
  // automatic override of the classroom's selected art.
  if(fallback)return ()=>{live=false};
  discover(JSON.parse(key),key).then(assets=>{
   // Unreviewed licensed results are candidates, not permission to assert
   // that a random scene depicts the event. Future studies may promote them
   // to the catalog once their subject, verse, and license are checked.
   const approved=assets.filter(a=>a.editorialStatus==='approved'&&a.rightsStatus==='cleared');
   if(live)setState({key,assets:approved,active:nextImage(approved),failed:[]});
  });
  return ()=>{live=false};
 },[key,fallback?.id]);
 const same=state.key===key;
 const asset=same?(state.active||fallback):fallback;
 function onError(){
  setState(prev=>{
   if(prev.key!==key)return prev;
   const failed=[...prev.failed,prev.active?.id||fallback?.id].filter(Boolean);
   return {...prev,failed,active:nextImage(prev.assets,failed)};
  });
 }
 // If the chosen remote image fails, fall back to a specifically vetted
 // match; never substitute a random biblical person or unrelated location.
 const failedFallback=same&&state.failed.includes(fallback?.id);
 return {asset:failedFallback?null:asset,loading:!same||state.active===null&&state.assets.length===0,
  discovered:Boolean(same&&state.active),onError};
}
