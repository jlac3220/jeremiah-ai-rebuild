import {withPilotService} from './pilotSecurity.mjs';
import {appendFile, mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {BlobNotFoundError} from '@vercel/blob';
import {readJsonBody, sendJson} from './httpUtils.mjs';
import {
 OG1_PILOT_SURVEY_VERSION,PILOT_RATING_AREAS,PILOT_PRIORITY_OPTIONS,
 PILOT_MOMENT_OPTIONS,PILOT_DEVICE_OPTIONS,PILOT_ROLE_OPTIONS,
 PILOT_FUTURE_OPTIONS,PILOT_TEXT_FIELDS
} from '../src/data/og1PilotSurvey.js';

// Minimal single-server pilot store. Requires a persistent mounted disk for hosted use.
// No IP address, name, email, user profile, exam response, or score is stored.
export function pilotFeedbackFile(){
 return path.resolve(process.env.PILOT_FEEDBACK_FILE||path.join(process.cwd(),'.pilot-data','og1-feedback.jsonl'));
}
const allowed=options=>new Set(options.map(([id])=>id));
const ratingAreas=new Set(PILOT_RATING_AREAS.map(item=>item.id));
const priorities=allowed(PILOT_PRIORITY_OPTIONS);
const moments=allowed(PILOT_MOMENT_OPTIONS);
const devices=allowed(PILOT_DEVICE_OPTIONS);
const roles=allowed(PILOT_ROLE_OPTIONS);
const futures=allowed(PILOT_FUTURE_OPTIONS);
const throttles=new Map();
let pending=Promise.resolve();

function optionalEnum(value,values,label){
 if(value===undefined||value===null||value==='')return '';
 if(typeof value!=='string'||!values.has(value))throw new Error('Invalid '+label);
 return value;
}
function optionalText(value,max,label){
 if(value===undefined||value===null)return '';
 if(typeof value!=='string'||value.length>max+100)throw new Error('Invalid '+label);
 const cleaned=value.replace(/[^\S\n]+/g,' ').trim();
 if(cleaned.length>max)throw new Error(label+' is too long');
 return cleaned;
}
function rating(value){
 if(value===undefined||value===null||value===0||value==='')return 0;
 if(!Number.isInteger(value)||value<1||value>5)throw new Error('Ratings must be between 1 and 5');
 return value;
}
export function validatePilotFeedback(body){
 if(!body||typeof body!=='object'||Array.isArray(body))throw new Error('Invalid feedback');
 if(body.version!==OG1_PILOT_SURVEY_VERSION)throw new Error('Survey version changed. Refresh the lesson and try again.');
 if(typeof body.submissionId!=='string'||!/^[A-Za-z0-9_-]{16,80}$/.test(body.submissionId))throw new Error('Invalid submission identifier');
 const overall=rating(body.overall);
 if(!overall)throw new Error('An overall experience rating is required');
 if(body.ratings&& (typeof body.ratings!=='object'||Array.isArray(body.ratings)))throw new Error('Invalid ratings');
 const incoming=body.ratings||{};
 if(Object.keys(incoming).some(id=>!ratingAreas.has(id)))throw new Error('Unknown rating category');
 const ratings=Object.fromEntries(PILOT_RATING_AREAS.map(area=>[area.id,rating(incoming[area.id])]));
 if(typeof body.completed!=='boolean')throw new Error('Invalid completion status');
 const result={version:OG1_PILOT_SURVEY_VERSION,submissionId:body.submissionId,lesson:'OG.1.LESSON.18',overall,ratings,completed:body.completed,
  future:optionalEnum(body.future,futures,'future lesson interest'),
  priority:optionalEnum(body.priority,priorities,'improvement priority'),
  moment:optionalEnum(body.moment,moments,'favorite moment'),
  device:optionalEnum(body.device,devices,'device'),
  role:optionalEnum(body.role,roles,'role')
 };
 for(const [field,max] of Object.entries(PILOT_TEXT_FIELDS))result[field]=optionalText(body[field],max,field);
 return result;
}

async function persistPilotFeedback(entry,file=pilotFeedbackFile()){
 const dir=path.dirname(file);
 await mkdir(dir,{recursive:true,mode:0o700});
 // Serialized writes also ensure a browser retry cannot create duplicate records.
 let existing='';
 try{existing=await readFile(file,'utf8');}catch(e){if(e.code!=='ENOENT')throw e;}
 if(existing.split('\n').some(line=>{
  if(!line)return false;
  try{return JSON.parse(line).submissionId===entry.submissionId;}catch{return false;}
 }))return {accepted:true,duplicate:true};
 await appendFile(file,JSON.stringify({...entry,submittedAt:new Date().toISOString()})+'\n',{encoding:'utf8',mode:0o600});
 return {accepted:true,duplicate:false};
}
// On Vercel, function disks are ephemeral: store each response as a private,
// immutable Blob. A stable submission ID prevents duplicate browser retries.
// Never expose blob URLs to survey participants or through unauthenticated APIs.
export async function recordPrivateBlobFeedback(entry, sdk) {
 const blob=sdk||await import('@vercel/blob');
 const pathname='jeremiah-pilot/og1/'+entry.submissionId+'.json';
 try {
  await blob.head(pathname,{abortSignal:AbortSignal.timeout(8000)});
  return {accepted:true,duplicate:true};
 } catch(error) {
  if(!(error instanceof BlobNotFoundError))throw error;
 }
 try {
  await blob.put(pathname,JSON.stringify({...entry,submittedAt:new Date().toISOString()}),{
   access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:false,abortSignal:AbortSignal.timeout(8000)
  });
  return {accepted:true,duplicate:false};
 } catch(error) {
  // A concurrent retry may have created the same immutable object.
  try {
   await blob.head(pathname,{abortSignal:AbortSignal.timeout(8000)});
   return {accepted:true,duplicate:true};
  } catch {
   throw error;
  }
 }
}
export function recordPilotFeedback(entry,file){
 // The local file adapter remains for Codespaces. Vercel must use durable Blob.
 if(!file && (process.env.VERCEL==='1'||process.env.PILOT_STORAGE==='vercel-blob')){
  if(!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL_OIDC_TOKEN) {
   return Promise.reject(new Error('Private pilot Blob storage has not been connected to this deployment.'));
  }
  return recordPrivateBlobFeedback(entry);
 }
 // Keep writes in order on a single app instance.
 const work=pending.then(()=>persistPilotFeedback(entry,file));
 pending=work.catch(()=>{});
 return work;
}
function throttle(req){
 const ip=req.socket?.remoteAddress||'unknown';
 const now=Date.now();
 if(throttles.size>2000)for(const [id,v] of throttles)if(now-v.started>300000)throttles.delete(id);
 const old=throttles.get(ip);
 const next=!old||now-old.started>300000?{started:now,count:1}:{started:old.started,count:old.count+1};
 throttles.set(ip,next);
 return next.count<=120; // transient rate control only; IP is never written to disk
}
async function handlePilotFeedbackUnchecked(req,res){
 if(req.method!=='POST'){sendJson(res,405,{error:'Method not allowed'});return;}
 if(!throttle(req)){sendJson(res,429,{error:'Too many submissions. Please try again later.'});return;}
 try{
  const data=validatePilotFeedback(await readJsonBody(req,16_000));
  const result=await recordPilotFeedback(data);
  sendJson(res,200,{...result,message:'Thank you. Your feedback will help shape Jeremiah.'});
 }catch(error){
  if(['Invalid feedback','Invalid ratings','Unknown rating category'].some(t=>error.message.startsWith(t))||
     error.message.startsWith('Invalid ')||error.message.includes('required')||
     error.message.includes('Ratings must')||error.message.includes('too long')||
     error.message.includes('Survey version changed')){
    sendJson(res,400,{error:error.message});return;
  }
  console.error(JSON.stringify({event:'pilot_feedback_storage_failed',category:error instanceof BlobNotFoundError?'not_found':'storage_unavailable'}));
  sendJson(res,503,{error:'Feedback could not be saved right now. Your answers are still on this device—please retry.'});
 }
}

export async function handlePilotFeedback(req,res){return withPilotService(req,res,'feedback',()=>handlePilotFeedbackUnchecked(req,res));}
