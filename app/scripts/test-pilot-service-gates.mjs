import assert from 'node:assert/strict';
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
import {openAIRequest,OpenAIServiceError,configuredModel} from '../server/openaiService.mjs';
import {LIMIT_SCRIPT,redisEval,withPilotService,requireOwner,ownerAuthorized,issueSession,session,providerReservation,reserveProviderCall,handlePilotAccess,usageSnapshot} from '../server/pilotSecurity.mjs';
import {summarizeFeedback,reportCsv,redactComment,handlePilotReport} from '../server/pilotReportHandler.mjs';
import {handlePilotVerification} from '../server/pilotVerificationHandler.mjs';
import {teachWithJeremiah} from '../server/teacherCore.mjs';

const original={...process.env},realFetch=globalThis.fetch,logs=[],warn=console.warn;
const res=()=>({headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v},end(s){this.body=s},writeHead(status,headers){this.statusCode=status;for(const [k,v] of Object.entries(headers))this.setHeader(k,v)}});
try{
 console.warn=line=>logs.push(line);
 let calls=0;
 await assert.rejects(openAIRequest('https://api.openai.com/v1/responses',{body:'{}'},{service:'test',reserve:async()=>{},fetcher:async()=>{calls++;return new Response('{"error":"secret-sentinel-DO-NOT-EXPOSE"}',{status:401})}}),e=>e instanceof OpenAIServiceError&&e.code==='authentication'&&!e.message.includes('sentinel'));
 assert.equal(calls,1,'Never retry authentication');assert.ok(!logs.join('').includes('sentinel'));
 calls=0;await openAIRequest('https://api.openai.com/v1/responses',{body:'{}'},{service:'test',reserve:async()=>{},sleep:async()=>{},fetcher:async()=>++calls===1?new Response('',{status:502}):new Response('{}')});assert.equal(calls,2);
 calls=0;await assert.rejects(openAIRequest('https://api.openai.com/v1/responses',{body:'{}'},{reserve:async()=>{},fetcher:async()=>{calls++;throw new Error('secret-sentinel')}}),e=>e.code==='network_or_timeout');assert.equal(calls,1);
 delete process.env.JEREMIAH_OPENAI_MODEL_FAST;assert.throws(()=>configuredModel('fast'),e=>e.code==='model_not_configured');
 process.env.OPENAI_API_KEY='unit-test-only';process.env.JEREMIAH_OPENAI_MODEL_DEEP='unit-model';
 const outage=await teachWithJeremiah({standardId:'OG.1.LESSON.18',moveId:'shema-try',learnerResponse:{text:'Unit test response'}},{fetcher:async()=>new Response('credential-sentinel',{status:401})});assert.equal(outage.verdict,'unscored');assert.equal(outage.source,'service-unavailable');assert.deepEqual(outage.evidenceObserved,[]);assert.equal(outage.diagnostic,'authentication');assert.ok(!JSON.stringify(outage).includes('sentinel'));
 process.env.PILOT_OWNER_PASSWORD='unit-test-only-owner-password-32-characters';process.env.PILOT_SESSION_SECRET='unit-test-only-signing-secret-32-characters';
 const req={method:'POST',url:'/api/jeremiah/ask',headers:{host:'localhost',authorization:'Basic '+Buffer.from('owner:'+process.env.PILOT_OWNER_PASSWORD).toString('base64')},socket:{remoteAddress:'127.0.0.1'}};
 assert.equal(ownerAuthorized(req),true);assert.equal(ownerAuthorized({...req,headers:{}}),false);
 const unauthorized=res();await handlePilotReport({...req,method:'GET',headers:{}},unauthorized);assert.equal(unauthorized.statusCode,401);assert.ok(!unauthorized.body.includes('responses'));
 const setup=res();await handlePilotReport({...req,method:'GET',url:'/api/pilot/report?setup=1'},setup);assert.equal(setup.headers['content-type'],'text/html; charset=utf-8');assert.ok(setup.body.includes('no generation'));
 const deniedVerification=res();await handlePilotVerification({...req,url:'/api/pilot/verify?accountOnly=1',headers:{}},deniedVerification);assert.equal(deniedVerification.statusCode,401);
 process.env.JEREMIAH_OPENAI_MODEL_FAST='unit-model';const temporaryFetch=globalThis.fetch;globalThis.fetch=async url=>{assert.equal(url,'https://api.openai.com/v1/models');return Response.json({data:[{id:'unit-model'},{id:'gpt-4o-mini-tts'}]})};const account=res();await handlePilotVerification({...req,url:'/api/pilot/verify?accountOnly=1'},account);assert.equal(JSON.parse(account.body).passed,true);globalThis.fetch=temporaryFetch;
 const cookie=res();issueSession(cookie,'verify');const signed=cookie.headers['set-cookie'];assert.match(signed,/HttpOnly/);assert.match(signed,/Secure/);assert.match(signed,/SameSite=Strict/);assert.equal(session({headers:{cookie:signed}}).scope,'verify');assert.equal(session({headers:{cookie:signed.replace('=', '=x')}}),null);
 process.env.PILOT_ACCESS_ENFORCED='true';delete process.env.PILOT_ACCESS_MODE;let invoked=false;const closed=res();await withPilotService(req,closed,'ask',()=>{invoked=true});assert.equal(closed.statusCode,503);assert.equal(invoked,false);
 process.env.PILOT_ACCESS_MODE='verify';delete process.env.UPSTASH_REDIS_REST_URL;const noRedis=res();await withPilotService(req,noRedis,'ask',()=>{invoked=true});assert.equal(noRedis.statusCode,503);assert.equal(invoked,false,'No paid work if limiter unavailable');
 process.env.PILOT_MODEL_PRICING_JSON='{}';assert.throws(()=>providerReservation('{"model":"unit-model","max_output_tokens":900}'),e=>e.code==='pricing_not_configured');
 process.env.PILOT_MODEL_PRICING_JSON=JSON.stringify({'unit-model':{inputUsdPerMillion:1,outputUsdPerMillion:4},'unit-tts':{maxAuthoredClipUsd:.1}});assert.ok(providerReservation('{"model":"unit-model","max_output_tokens":900}')>3600);assert.equal(providerReservation('{"model":"unit-tts","response_format":"mp3"}'),100000);
 const records=[{submissionId:'real-fixture',overall:4,completed:true,ratings:{flow:2},priority:'teaching',bestPart:'=HYPERLINK("bad") person@example.org +1 (555) 123-4567'},{submissionId:'issue63_test_fixture',overall:1}];
 assert.equal(summarizeFeedback([...records,{submissionId:'manual-test-fixture',bestPart:'[ISSUE63 TEST] manual phone test',overall:5}]).excludedTests,2);
 assert.equal(summarizeFeedback(records).responses,1);assert.equal(summarizeFeedback(records).excludedTests,1);assert.equal(summarizeFeedback(records).categories.find(a=>a.id==='flow').counts[2],1);assert.ok(reportCsv(records).includes("'=HYPERLINK"));assert.ok(!redactComment(records[0].bestPart).includes('example.org'));
 process.env.UPSTASH_REDIS_REST_URL='https://redis.invalid';process.env.UPSTASH_REDIS_REST_TOKEN='unit-only';
 for(const result of [0,[],['0','0','invalid','0'],['0','0','-1','0'],['0','0',null,'0']]){globalThis.fetch=async()=>Response.json({result});await assert.rejects(usageSnapshot(),/Usage accounting unavailable/);}
 globalThis.fetch=async()=>Response.json({result:['1','2','100000','200000']});const snapshot=await usageSnapshot();assert.equal(snapshot.dayCalls,1);assert.equal(snapshot.monthCalls,2);assert.equal(snapshot.monthReservedUsd,.2);globalThis.fetch=realFetch;
 if(process.env.PILOT_REDIS_TEST_CONTAINER){
  const execute=promisify(execFile),env={...process.env};for(const k of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[k];
  const isolated=JSON.parse((await execute('docker',['--host=unix:///var/run/docker.sock','inspect',process.env.PILOT_REDIS_TEST_CONTAINER],{env,maxBuffer:200000})).stdout)[0];
  assert.equal(isolated.HostConfig.NetworkMode==='none'&&isolated.HostConfig.ReadonlyRootfs===true&&Object.hasOwn(isolated.HostConfig.Tmpfs||{},'/data'),true,'Redis integration test requires an isolated read-only container with tmpfs /data; never a production database');
  const cli=async args=>(await execute('docker',['--host=unix:///var/run/docker.sock','exec',process.env.PILOT_REDIS_TEST_CONTAINER,'redis-cli','--raw',...args],{env,maxBuffer:200000})).stdout.trim();
  await cli(['FLUSHDB']);process.env.UPSTASH_REDIS_REST_URL='https://redis.invalid';process.env.UPSTASH_REDIS_REST_TOKEN='unit-test-only';
  globalThis.fetch=async(url,options)=>{assert.equal(url,'https://redis.invalid');const output=await cli(JSON.parse(options.body));if(output.startsWith('ERR'))throw new Error(output);return Response.json({result:Number(output)})};
  const results=await Promise.all(Array.from({length:40},()=>redisEval(LIMIT_SCRIPT,['{unit}:concurrency'],[10,60,1])));assert.equal(results.filter(x=>x===0).length,10);assert.equal(results.filter(x=>x===1).length,30);assert.equal(await cli(['GET','{unit}:concurrency']),'10');
  await cli(['SET','{unit}:full','2']);assert.equal(await redisEval(LIMIT_SCRIPT,['{unit}:untouched','{unit}:full'],[5,60,1,2,60,1]),2);assert.equal(await cli(['EXISTS','{unit}:untouched']),'0','Rejected multi-bucket reservation is atomic');
  assert.ok(Number(await cli(['TTL','{unit}:concurrency']))>0);
  // Real Redis proves the currency reservations deny the next request and do
  // not run provider work; each request still uses a separate server context.
  await cli(['FLUSHDB']);process.env.PILOT_DAILY_BUDGET_CENTS='1';process.env.PILOT_MONTHLY_BUDGET_CENTS='1';let paid=0;
  for(let i=0;i<8;i++){const response=res();await withPilotService(req,response,'ask',async()=>{await reserveProviderCall({body:'{"model":"unit-model","max_output_tokens":900}'});paid++})}
  assert.equal(paid,1,'Conservative reservations enforce the 1-cent test cap');
  await cli(['FLUSHDB']);process.env.PILOT_DAILY_BUDGET_CENTS='300';process.env.PILOT_MONTHLY_BUDGET_CENTS='1000';process.env.PILOT_ACCESS_MODE='invite';process.env.PILOT_RELEASE_APPROVED='false';
  const inviteReq={method:'POST',url:'/api/pilot/access',headers:{host:'localhost'},socket:{remoteAddress:'127.0.0.1'},body:{code:'unit-test-only-invitation-code-32chars',adultConsent:true}};
  const notApproved=res();await handlePilotAccess(inviteReq,notApproved);assert.equal(notApproved.statusCode,503);
  process.env.PILOT_RELEASE_APPROVED='true';process.env.PILOT_INVITE_CODE=inviteReq.body.code;
  const noConsent=res();await handlePilotAccess({...inviteReq,body:{...inviteReq.body,adultConsent:false}},noConsent);assert.equal(noConsent.statusCode,401);
  const granted=res();await handlePilotAccess(inviteReq,granted);assert.equal(granted.statusCode,200);assert.equal(JSON.parse(granted.body).accepted,true);const cookie=granted.headers['set-cookie'];assert.equal(session({headers:{cookie}}).scope,'invite');
  const invitedReq={...inviteReq,headers:{host:'localhost',cookie}};let grantedWork=false;await withPilotService(invitedReq,res(),'ask',async()=>{grantedWork=true});assert.equal(grantedWork,true);
  process.env.PILOT_ACCESS_MODE='verify';const restricted=res();await handlePilotAccess({...invitedReq,method:'GET'},restricted);assert.equal(JSON.parse(restricted.body).authenticated,false,'Invite cookie cannot enter owner verification mode');
  console.log('PASS real Redis: 40 concurrent clients, exact acceptance count, TTL, atomic multi-bucket denial and currency cap.');
 }
 console.log('PASS pilot gates: owner/server authentication, signed sessions, closed/fail-closed access, private reporting, conservative pricing, safe provider retries/errors and explicitly unscored outages.');
}finally{console.warn=warn;globalThis.fetch=realFetch;for(const k of Object.keys(process.env))if(!(k in original))delete process.env[k];Object.assign(process.env,original)}
