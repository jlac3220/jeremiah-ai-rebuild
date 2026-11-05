import {createHash,createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import {AsyncLocalStorage} from 'node:async_hooks';
import {readJsonBody,sendJson} from './httpUtils.mjs';
const context=new AsyncLocalStorage();
const COOKIE='jeremiah_pilot_session';
export const pilotEnforced=()=>process.env.VERCEL==='1'||process.env.PILOT_ACCESS_ENFORCED==='true';
const equal=(a,b)=>timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());
export function ownerAuthorized(req){
 const secret=process.env.PILOT_OWNER_PASSWORD,user=process.env.PILOT_OWNER_USERNAME||'owner';
 if(!secret||secret.length<32)return false;
 const auth=req.headers?.authorization||'';if(typeof auth!=='string'||!auth.startsWith('Basic '))return false;
 const decoded=Buffer.from(auth.slice(6),'base64').toString(),i=decoded.indexOf(':');
 return i>0&&equal(decoded.slice(0,i),user)&&equal(decoded.slice(i+1),secret);
}
export function requireOwner(req,res){if(ownerAuthorized(req))return true;res.setHeader('WWW-Authenticate','Basic realm="Jeremiah private pilot report", charset="UTF-8"');sendJson(res,401,{error:'Owner authentication required.'});return false;}
const signingReady=()=>Boolean(process.env.PILOT_SESSION_SECRET?.length>=32);
const mode=()=>process.env.PILOT_ACCESS_MODE==='verify'?'verify':process.env.PILOT_ACCESS_MODE==='invite'&&process.env.PILOT_RELEASE_APPROVED==='true'?'invite':'closed';
const authorized=(req,m,s)=>m!=='closed'&&(ownerAuthorized(req)||(m==='verify'?s?.scope==='verify':s?.scope==='invite'));
function signature(value){return createHmac('sha256',process.env.PILOT_SESSION_SECRET).update(value).digest('base64url');}
export function session(req){
 if(!signingReady())return null;
 const raw=(req.headers?.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'';
 const [value,sig]=raw.split('.');if(!value||!sig||!equal(sig,signature(value)))return null;
 try{const s=JSON.parse(Buffer.from(value,'base64url'));return s.exp>Date.now()&&/^[a-f0-9-]{36}$/.test(s.id)&&['verify','invite'].includes(s.scope)?s:null;}catch{return null;}
}
export function issueSession(res,scope){
 if(!signingReady())throw new Error('Session signing unavailable');
 const value=Buffer.from(JSON.stringify({id:randomUUID(),scope,exp:Date.now()+3_600_000})).toString('base64url');
 res.setHeader('Set-Cookie',`${COOKIE}=${value}.${signature(value)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`);
}
export async function redisEval(script,keys,args){
 const url=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN;
 if(!url||!token||!url.startsWith('https://'))throw new Error('Usage storage unavailable');
 const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',script,String(keys.length),...keys,...args.map(String)]),signal:AbortSignal.timeout(4000)});
 if(!response.ok)throw new Error('Usage storage unavailable');
 const data=await response.json();if(data.error)throw new Error('Usage storage unavailable');return data.result;
}
// Check all counters before incrementing any. One atomic operation across cold
// starts, processes and functions. Counts only; no prompts, answers or raw IPs.
export const LIMIT_SCRIPT=`local n=#KEYS
for i=1,n do if tonumber(redis.call('GET',KEYS[i]) or '0')+tonumber(ARGV[(i-1)*3+3])>tonumber(ARGV[(i-1)*3+1]) then return i end end
for i=1,n do local v=redis.call('INCRBY',KEYS[i],ARGV[(i-1)*3+3]);if v==tonumber(ARGV[(i-1)*3+3]) then redis.call('EXPIRE',KEYS[i],ARGV[(i-1)*3+2]) end end
return 0`;
const positive=(name,fallback,max)=>{const value=process.env[name];if(value===undefined||value==='')return fallback;const n=Number(value);if(!Number.isSafeInteger(n)||n<=0)throw new Error('Usage limits are not configured correctly');return Math.min(n,max);};
function identity(req){
 const address=process.env.VERCEL==='1'?req.headers?.['x-vercel-forwarded-for']:req.socket?.remoteAddress;
 return createHmac('sha256',process.env.PILOT_SESSION_SECRET).update(new Date().toISOString().slice(0,10)+':'+(address||'unknown')).digest('hex');
}
async function reserveLimits(service,req,s,paid=false,cost=0){
 const now=Date.now(),day=new Date(now).toISOString().slice(0,10),month=day.slice(0,7),prefix='{jeremiah-pilot-v1}:';
 const keys=paid?[prefix+'paid:day:'+day,prefix+'paid:month:'+month]:[prefix+service+':ip:'+identity(req)+':'+Math.floor(now/600000),prefix+service+':session:'+s.id+':'+Math.floor(now/3600000)];
 const args=paid?[positive('PILOT_MAX_DAILY_PROVIDER_CALLS',100,500),172800,1,positive('PILOT_MAX_MONTHLY_PROVIDER_CALLS',1000,5000),2_764_800,1]:[service==='access'?5:30,660,1,service==='narration'?80:service==='feedback'?10:30,3660,1];
 if(!paid){keys.push(prefix+service+':requests:day:'+day,prefix+service+':requests:month:'+month);args.push(positive('PILOT_MAX_DAILY_SERVICE_REQUESTS',1000,5000),172800,1,positive('PILOT_MAX_MONTHLY_SERVICE_REQUESTS',10000,50000),2_764_800,1);}
 if(paid){keys.push(prefix+'spend:day:'+day,prefix+'spend:month:'+month);args.push(positive('PILOT_DAILY_BUDGET_CENTS',300,1000)*10000,172800,cost,positive('PILOT_MONTHLY_BUDGET_CENTS',1000,1000)*10000,2_764_800,cost);}
 const rejected=await redisEval(LIMIT_SCRIPT,keys,args);if(rejected)throw Object.assign(new Error('Usage limit reached. Please try again later.'),{status:429});
}
export function providerReservation(body){
 let request,prices;try{request=JSON.parse(body);prices=JSON.parse(process.env.PILOT_MODEL_PRICING_JSON||'{}')[request.model];}catch{}
 // Explicitly verified prices only: never silently guess the cost of a model
 // alias. Reserve a conservative upper bound; failed calls are not refunded.
 if(request?.response_format==='mp3'){
  if(!(Number.isFinite(prices?.maxAuthoredClipUsd)&&prices.maxAuthoredClipUsd>0&&prices.maxAuthoredClipUsd<=1))throw Object.assign(new Error('Verified speech pricing is required.'),{code:'pricing_not_configured',status:503});
  return Math.ceil(prices.maxAuthoredClipUsd*1e6);
 }
 if(!(Number.isFinite(prices?.inputUsdPerMillion)&&Number.isFinite(prices?.outputUsdPerMillion)&&prices.inputUsdPerMillion>0&&prices.outputUsdPerMillion>0&&request?.max_output_tokens>0))throw Object.assign(new Error('Verified model pricing is required.'),{code:'pricing_not_configured',status:503});
 const upperInputTokens=Buffer.byteLength(body,'utf8')+2048;
 return Math.ceil(upperInputTokens*prices.inputUsdPerMillion+request.max_output_tokens*prices.outputUsdPerMillion);
}
export function remainingProviderTime(){return Math.max(0,Math.min(20_000,(context.getStore()?.deadline||Date.now()+20_000)-Date.now()));}
export async function reserveProviderCall({body}={}){const current=context.getStore();if(current)await reserveLimits(current.service,current.req,current.s,true,providerReservation(body));}
export async function withPilotService(req,res,service,work){
 if(!pilotEnforced())return work();
 if(req.headers?.['sec-fetch-site']==='cross-site'){sendJson(res,403,{error:'Same-origin access required.'});return;}
 const origin=req.headers?.origin;if(origin){try{if(new URL(origin).host!==req.headers.host){sendJson(res,403,{error:'Same-origin access required.'});return;}}catch{sendJson(res,403,{error:'Same-origin access required.'});return;}}
 const m=mode(),s=session(req);
 if(!signingReady()||m==='closed'){sendJson(res,503,{error:'The pilot is closed while services are verified.'});return;}
 const allowed=authorized(req,m,s);
 if(!allowed){sendJson(res,401,{error:'An active private pilot invitation is required.'});return;}
 const current=s||{id:'00000000-0000-0000-0000-000000000000',scope:'verify'};
 try{await reserveLimits(service,req,current);return await context.run({service,req,s:current,deadline:Date.now()+45_000},work);}
 catch(error){res.setHeader('Retry-After',error.status===429?'600':'60');sendJson(res,error.status===429?429:503,{error:error.status===429?error.message:'Pilot services are temporarily unavailable. Please retry shortly.'});}
}
export async function handlePilotAccess(req,res){
 if(req.method==='GET'){sendJson(res,200,{mode:pilotEnforced()?mode():'local',authenticated:!pilotEnforced()||(signingReady()&&Boolean(authorized(req,mode(),session(req)))),version:process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,8)||'development'});return;}
 if(req.method!=='POST'){sendJson(res,405,{error:'Method not allowed'});return;}
 const origin=req.headers?.origin;if(req.headers?.['sec-fetch-site']==='cross-site'||(origin&&origin!=='https://'+req.headers?.host&&origin!=='http://'+req.headers?.host)){sendJson(res,403,{error:'Same-origin access required.'});return;}
 if(!signingReady()||mode()==='closed'){sendJson(res,503,{error:'The pilot is not open. Please wait for your invitation.'});return;}
 try{
  const body=await readJsonBody(req,2000);await reserveLimits('access',req,{id:'access:'+identity(req)});
  if(mode()==='verify'){if(!ownerAuthorized(req)){sendJson(res,401,{error:'Private verification access required.'});return;}issueSession(res,'verify');}
  else{const code=process.env.PILOT_INVITE_CODE;if(!code||code.length<24||body.adultConsent!==true||typeof body.code!=='string'||!equal(body.code,code)){sendJson(res,401,{error:'Check your invitation and adult consent.'});return;}issueSession(res,'invite');}
  sendJson(res,200,{accepted:true});
 }catch(error){sendJson(res,error.status===429?429:503,{error:'Access is temporarily unavailable. Please retry later.'});}
}

export async function usageSnapshot(){
 const day=new Date().toISOString().slice(0,10),prefix='{jeremiah-pilot-v1}:',month=day.slice(0,7);
 const values=await redisEval("return {redis.call('GET',KEYS[1]) or '0',redis.call('GET',KEYS[2]) or '0',redis.call('GET',KEYS[3]) or '0',redis.call('GET',KEYS[4]) or '0'}",[prefix+'paid:day:'+day,prefix+'paid:month:'+month,prefix+'spend:day:'+day,prefix+'spend:month:'+month],[]);
 return {dayCalls:Number(values[0]),monthCalls:Number(values[1]),dayReservedUsd:Number(values[2])/1e6,monthReservedUsd:Number(values[3])/1e6,monthlyBudgetUsd:positive('PILOT_MONTHLY_BUDGET_CENTS',1000,1000)/100};
}
