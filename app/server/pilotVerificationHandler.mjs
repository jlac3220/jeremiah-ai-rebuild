import {randomUUID} from 'node:crypto';
import {requireOwner,withPilotService} from './pilotSecurity.mjs';
import {sendJson} from './httpUtils.mjs';
import {recordPrivateBlobFeedback,validatePilotFeedback} from './pilotFeedbackHandler.mjs';
import {OG1_PILOT_SURVEY_VERSION} from '../src/data/og1PilotSurvey.js';
import {answerAskJeremiah} from './askJeremiahCore.mjs';
import {teachWithJeremiah} from './teacherCore.mjs';
import {openAIRequest} from './openaiService.mjs';
import {NARRATOR} from './narrationHandler.mjs';

export async function verifyPrivateFeedback(){
 const blob=await import('@vercel/blob'),id='issue63_test_'+randomUUID().replaceAll('-','');
 const entry=validatePilotFeedback({version:OG1_PILOT_SURVEY_VERSION,submissionId:id,overall:4,ratings:{scripture:4},completed:false,bestPart:'ISSUE63 AUTOMATED SERVICE CHECK — EXCLUDE FROM ANALYSIS'});
 const first=await recordPrivateBlobFeedback(entry),again=await recordPrivateBlobFeedback(entry);
 const file=await blob.get('jeremiah-pilot/og1/'+id+'.json',{access:'private',abortSignal:AbortSignal.timeout(6000)});
 const value=file?.stream?JSON.parse(await new Response(file.stream).text()):null;
 const meta=await blob.head('jeremiah-pilot/og1/'+id+'.json',{abortSignal:AbortSignal.timeout(6000)});
 const anonymous=await fetch(meta.url,{redirect:'manual',signal:AbortSignal.timeout(6000)});
 const passed=first.accepted&&!first.duplicate&&again.duplicate&&value?.submissionId===id&&value.overall===4&&[401,403,404].includes(anonymous.status);
 return {passed,accepted:first.accepted,duplicate:again.duplicate,readBack:value?.submissionId===id,anonymousReadDenied:[401,403,404].includes(anonymous.status),testRecord:id,excludedFromAnalysis:true};
}
async function verifyAsk(){const result=await answerAskJeremiah({question:'What does Deuteronomy 6:4 teach about God?'});return {passed:result.status==='answered'&&result.source==='openai'&&Boolean(result.answer)&&result.sources.length>0,status:result.status,source:result.source,sources:result.sources.map(s=>s.id)};}
async function verifyTeacher(){const r=await teachWithJeremiah({standardId:'OG.1.LESSON.18',moveId:'shema-try',learnerResponse:{text:'The Shema calls Israel to listen and respond to its covenant God. Echad means one, but Genesis 2:24 illustrates word usage, not multiple divine persons. Isaiah 44:6 excludes another God; Jesus reaffirms the confession in Mark 12:29. Deuteronomy 6:5 calls for love with the whole heart, soul and might.'}});return {passed:r.source==='openai'&&['strong','partial','weak'].includes(r.verdict),source:r.source,verdict:r.verdict,model:r.model||null,responseId:r.responseId||null,category:r.diagnostic||null};}
async function verifyNarration(){
 // Deliberately one fresh, bounded provider request. Cached MP3 delivery alone
 // cannot prove current credentials or speech-model access work.
 const r=await openAIRequest('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:NARRATOR.model,voice:NARRATOR.voice,speed:NARRATOR.speed,instructions:NARRATOR.instructions,input:'Hear, O Israel: The LORD our God is one LORD.',response_format:'mp3'})},{service:'narration'});
 const bytes=new Uint8Array(await r.arrayBuffer()),mp3=bytes.length>1000&&((bytes[0]===73&&bytes[1]===68&&bytes[2]===51)||(bytes[0]===255&&(bytes[1]&224)===224));
 return {passed:mp3&&r.headers.get('content-type')?.includes('audio/mpeg'),status:r.status,contentType:r.headers.get('content-type'),voice:NARRATOR.voice,bytes:bytes.length};
}
async function verifyAccount(){
 if(!process.env.OPENAI_API_KEY)return {passed:false,category:'key_not_configured'};
 try{
  const r=await fetch('https://api.openai.com/v1/models',{headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY},signal:AbortSignal.timeout(6000)});
  if(!r.ok)return {passed:false,category:r.status===401?'authentication':r.status===403?'permission':'provider_unavailable',upstreamStatus:r.status};
  const data=await r.json(),ids=new Set((data.data||[]).map(m=>m.id));
  const models={fast:ids.has(process.env.JEREMIAH_OPENAI_MODEL_FAST),deep:ids.has(process.env.JEREMIAH_OPENAI_MODEL_DEEP),ash:ids.has(NARRATOR.model)};
  return {passed:Object.values(models).every(Boolean),authenticationPassed:true,modelsAvailable:models};
 }catch{return {passed:false,category:'network_or_timeout'};}
}
export async function handlePilotVerification(req,res){
 if(!requireOwner(req,res))return;
 if(req.method!=='POST'){sendJson(res,405,{error:'Use the private report’s verification action.'});return;}
 const url=new URL(req.url,'http://localhost'),origin=req.headers?.origin;
 if(req.headers?.['sec-fetch-site']==='cross-site'||(origin&&origin!=='https://'+req.headers?.host&&origin!=='http://'+req.headers?.host)){sendJson(res,403,{error:'Same-origin access required.'});return;}
 // Owner-only, non-generative checks unblock diagnosis before a Redis/pricing
 // configuration exists. They cannot invoke any paid OpenAI operation.
 if(url.searchParams.get('accountOnly')==='1'){sendJson(res,200,await verifyAccount());return;}
 if(url.searchParams.get('feedbackOnly')==='1'){try{sendJson(res,200,await verifyPrivateFeedback())}catch{sendJson(res,503,{passed:false,category:'private_storage_unavailable'})}return;}

 return withPilotService(req,res,'verification',async()=>{
  const account=await verifyAccount();
  const blocked=()=>Promise.resolve({passed:false,category:account.authenticationPassed?'model_not_available':account.category});
  const names=['feedback','ask','teaching','narration','outOfScope'];
  const results=await Promise.allSettled([verifyPrivateFeedback(),account.passed?verifyAsk():blocked(),account.passed?verifyTeacher():blocked(),account.passed?verifyNarration():blocked(),answerAskJeremiah({question:'Who won the World Series?'}).then(r=>({passed:r.status==='not_covered',status:r.status}))]);
  const checks={account,...Object.fromEntries(results.map((r,i)=>[names[i],r.status==='fulfilled'?r.value:{passed:false,category:['authentication','permission','model_unavailable','model_not_configured','quota_or_rate_limit','network_or_timeout','provider_unavailable','request_rejected','pricing_not_configured'].includes(r.reason?.code)?r.reason.code:'service_unavailable'}]))};
  sendJson(res,200,{verifiedAt:new Date().toISOString(),commit:process.env.VERCEL_GIT_COMMIT_SHA||'local',allPassed:Object.values(checks).every(r=>r.passed),checks,publicPilotOpened:false});
 });
}
