import {readJsonBody,sendJson} from './httpUtils.mjs';
import {discoverLessonVisuals} from './visualDiscovery.mjs';

// Only lesson metadata reaches external search. User chats and identities do not.
export async function handleVisualDiscovery(req,res) {
 if(req.method!=='POST'){sendJson(res,405,{error:'Method not allowed'});return;}
 try{
  const body=await readJsonBody(req,4000);
  const brief=body?.brief||{};
  const fields=['intent','subject','reference','topic','learningGoal'];
  if(fields.some(k=>typeof brief[k]==='string'&&brief[k].length>220)){
   sendJson(res,400,{error:'Visual brief is too long'});return;
  }
  const result=await discoverLessonVisuals(brief);
  res.setHeader('Cache-Control','private, max-age=900');
  sendJson(res,200,result);
 }catch(error){
  sendJson(res,error?.status||503,{error:'Visual discovery temporarily unavailable'});
 }
}
