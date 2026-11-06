import {readFile} from 'node:fs/promises';
import {requireOwner,issueSession,usageSnapshot,pilotEnforced} from './pilotSecurity.mjs';
import {pilotFeedbackFile,validatePilotFeedback} from './pilotFeedbackHandler.mjs';
import {PILOT_RATING_AREAS,PILOT_TEXT_FIELDS} from '../src/data/og1PilotSurvey.js';
import {sendJson} from './httpUtils.mjs';
import {pilotProgressSummary} from './pilotProgressHandler.mjs';
const PREFIX='jeremiah-pilot/og1/';
const testRecord=r=>r.submissionId?.startsWith('issue63_test_')||Object.keys(PILOT_TEXT_FIELDS).some(f=>String(r[f]||'').startsWith('[ISSUE63 TEST]'));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const redactComment=s=>String(s||'').replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,'[email removed]').replace(/(?:https?:\/\/|www\.)\S+/gi,'[link removed]').replace(/\+?\d[\d\s().-]{7,}\d/g,'[number removed]');
export function reportCsv(records){
 const csv=v=>'"'+(/^[\s\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]*[=+\-@\t\r]/u.test(String(v??''))?"'":'')+String(v??'').replace(/"/g,'""')+'"';
 const fields=['submittedAt','completed','overall',...PILOT_RATING_AREAS.map(a=>a.id),'priority','device','future',...Object.keys(PILOT_TEXT_FIELDS)];
 return [fields,...records.map(r=>fields.map(f=>f in PILOT_TEXT_FIELDS?redactComment(r[f]):r.ratings?.[f]??r[f]??''))].map(row=>row.map(csv).join(',')).join('\r\n');
}
export function summarizeFeedback(records){
 const entries=records.filter(r=>!testRecord(r));
 const distribution=values=>Object.fromEntries([1,2,3,4,5].map(n=>[n,values.filter(x=>x===n).length]));
 return {responses:entries.length,completed:entries.filter(r=>r.completed).length,excludedTests:records.length-entries.length,overall:distribution(entries.map(r=>r.overall)),categories:PILOT_RATING_AREAS.map(a=>({...a,counts:distribution(entries.map(r=>r.ratings?.[a.id]))})),priorities:Object.entries(entries.reduce((a,r)=>{if(r.priority)a[r.priority]=(a[r.priority]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1])};
}
async function readRecords(){
 if(process.env.VERCEL==='1'||process.env.PILOT_STORAGE==='vercel-blob'){
  const blob=await import('@vercel/blob'),records=[];let cursor;
  do{const batch=await blob.list({prefix:PREFIX,limit:1000,...(cursor?{cursor}:{})});
   for(const item of batch.blobs||[]){if(!item.pathname.endsWith('.json'))continue;const file=await blob.get(item.pathname,{access:'private'});if(file?.stream){const r=JSON.parse(await new Response(file.stream).text());records.push({...validatePilotFeedback(r),submittedAt:r.submittedAt});}}
   cursor=batch.hasMore?batch.cursor:undefined;if(records.length>10_000)throw new Error('Report needs paginated archive');
  }while(cursor);return records;
 }
 try{return (await readFile(pilotFeedbackFile(),'utf8')).split('\n').filter(Boolean).map(s=>JSON.parse(s));}catch(e){if(e.code==='ENOENT')return [];throw e;}
}
export async function handlePilotReport(req,res){
 // no-referrer makes native form POSTs serialize Origin as "null", even
 // to this same host. Retain the origin for these authenticated actions;
 // same-origin still suppresses referrers to every external destination.
 res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
 res.setHeader('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
 if(!requireOwner(req,res))return;
 if(req.method!=='GET'){sendJson(res,405,{error:'Method not allowed'});return;}
 const url=new URL(req.url,'http://localhost');
 if(url.searchParams.get('setup')==='1'){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jeremiah private service setup</title><body style="font:18px/1.6 system-ui;max-width:740px;padding:30px;margin:auto;color:#17304a"><p>OWNER ONLY</p><h1>Verify the launch services</h1><p>The first two checks diagnose the confirmed failures without opening paid access. The full check requires persistent limits and verified pricing. None of these actions opens invitations.</p><form method="post" action="/api/pilot/verify?accountOnly=1"><button style="font:inherit;padding:14px;margin:10px 0">Check key and model access · no generation</button></form><form method="post" action="/api/pilot/verify?feedbackOnly=1"><button style="font:inherit;padding:14px;margin:10px 0">Check private feedback write and read-back</button></form><form method="post" action="/api/pilot/verify"><button style="font:inherit;padding:14px;margin:10px 0">Run all service checks · small paid requests</button></form><p><a href="/api/pilot/report">Open private report and CSV</a></p></body></html>');return;
 }

 try{
  if(url.searchParams.get('verify')){
   const id=url.searchParams.get('verify');if(!/^issue63_test_[a-f0-9]{32}$/.test(id)){sendJson(res,400,{error:'Only marked verification records are supported.'});return;}
   const blob=await import('@vercel/blob');const file=await blob.get(PREFIX+id+'.json',{access:'private'});
   const record=file?.stream?JSON.parse(await new Response(file.stream).text()):null;
   sendJson(res,200,{found:record?.submissionId===id,privateReadBack:Boolean(record),overall:record?.overall,lesson:record?.lesson,excludedFromAnalysis:testRecord(record||{})});return;
  }
  const records=await readRecords(),summary=summarizeFeedback(records),entries=records.filter(r=>!testRecord(r));
  // Show owner-only receipt metadata for the live lesson→survey milestone,
  // without mixing test ratings/comments into participant analysis or CSV.
  const checks=records.filter(testRecord).sort((a,b)=>String(b.submittedAt||'').localeCompare(String(a.submittedAt||''))).slice(0,20);
  const usage=pilotEnforced()?await usageSnapshot().catch(()=>null):null;
  const progress=await pilotProgressSummary().catch(()=>null);
  if(url.searchParams.get('format')==='csv'){res.setHeader('Content-Type','text/csv; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="jeremiah-private-feedback.csv"');res.end(reportCsv(entries));return;}
  // An authenticated owner can verify paid services without opening invitations.
  if(process.env.PILOT_ACCESS_MODE==='verify'&&process.env.PILOT_SESSION_SECRET?.length>=32)issueSession(res,'verify');
  const bars=counts=>Object.entries(counts).map(([score,n])=>`<span>${score} ★: <b>${n}</b></span>`).join(' ');
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jeremiah · Private feedback</title><style>body{font:16px/1.6 system-ui;margin:0;background:#f5f7fb;color:#17304a}main{max-width:1000px;margin:auto;padding:32px 20px}h1{line-height:1.2}section{background:white;border:1px solid #d4dfea;border-radius:12px;padding:22px;margin:20px 0}a{color:#003da5}span{display:inline-block;padding:4px 12px 4px 0}li{margin-bottom:12px;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:12px 5px;border-bottom:1px solid #e2e8f0}small{color:#52647a}</style><main><small>OWNER ONLY · PRIVATE FEEDBACK</small><h1>What adult testers are telling us</h1><section><h2>Private service verification</h2><p>This performs one real storage check and small paid Ask, teaching and Ash speech requests. Marked test feedback is excluded below. A failure never opens the pilot.</p><form method="post" action="/api/pilot/verify"><button style="padding:14px 18px;font:inherit;background:#003da5;color:white;border:0;border-radius:8px">Run real service checks</button></form></section><p><a href="?format=csv">Download private CSV</a> · <a href="/#pilot">Review the lesson</a></p><section><h2>Anonymous lesson completion</h2>${progress?`<p><strong>${progress.started}</strong> started · <strong>${progress.completed}</strong> completed · <strong>${progress.inProgress}</strong> still in progress · <strong>${progress.inactiveSevenDays}</strong> no activity for 7+ days.</p><p><strong>${progress.completionRate}%</strong> completion rate · ${progress.assessmentReached} reached the assessment.</p><h3>Last chapter reached (unfinished)</h3><table><tr><th>Chapter</th><th>Participants</th></tr>${progress.lastChapterUnfinished.map(r=>`<tr><td>${r.chapter}</td><td>${r.count}</td></tr>`).join('')}</table><h3>Completion by age range</h3><table><tr><th>Age range</th><th>Started</th><th>Completed</th><th>Rate</th></tr>${Object.entries(progress.demographics.age).map(([age,r])=>`<tr><td>${escape(age==='75plus'?'75+':age)}</td><td>${r.count}</td><td>${r.completed}</td><td>${r.rate}%</td></tr>`).join('')||'<tr><td colspan="4">Not enough participants in any age group yet (minimum 3 per group).</td></tr>'}</table><p><small>${escape(progress.note)}</small></p>`:'<p>Anonymous progress tracking is not available yet. This does not affect lesson access.</p>'}</section><section><h2>Pilot usage allowance</h2>${usage?`<p>Reserved this month: $${usage.monthReservedUsd.toFixed(2)} of $${usage.monthlyBudgetUsd.toFixed(2)} maximum. ${usage.monthCalls} provider attempts this month; ${usage.dayCalls} today.</p><p>Reservations use conservative, explicitly configured prices and are not refunded after failures. They are not an OpenAI invoice. Check the dedicated OpenAI project billing page as well.</p>`:'<p>Live persistent usage accounting has not been verified here. Paid services fail closed if it is unavailable.</p>'}</section><section><h2>${summary.responses} responses</h2><p>${summary.completed} completed · ${summary.responses-summary.completed} partial · ${summary.excludedTests} marked test records excluded</p><h3>Overall ratings</h3>${bars(summary.overall)}</section><section aria-labelledby="verification-receipts"><h2 id="verification-receipts">Marked verification submissions</h2><p>Latest 20 internal checks, excluded from participant ratings and CSV. A completed lesson survey should appear here after its saved receipt. No lesson answers or scores are collected.</p><ul>${checks.map(r=>`<li><strong>${r.completed?'Completed lesson':'Partial evaluation'}</strong> · ${escape(r.submittedAt)}<br><code style="overflow-wrap:anywhere">${escape(r.submissionId)}</code></li>`).join('')||'<li>No marked verification submissions yet.</li>'}</ul></section><section><h2>Experience ratings</h2><table><tr><th>Area</th><th>Rating distribution</th></tr>${summary.categories.map(a=>`<tr><td>${escape(a.label)}</td><td>${bars(a.counts)}</td></tr>`).join('')}</table></section><section><h2>Priorities</h2><ol>${summary.priorities.map(([p,n])=>`<li>${escape(p)} — ${n}</li>`).join('')||'<li>No priorities submitted yet.</li>'}</ol></section><section><h2>Comments</h2><p>Private owner view. Email addresses, links and phone-like numbers are removed; names or other identifying details may remain. Review before sharing. These are optional comments, not lesson answers or grades.</p><ul>${entries.flatMap(r=>Object.keys(PILOT_TEXT_FIELDS).filter(f=>r[f]).map(f=>`<li><strong>${escape(f)}</strong>: ${escape(redactComment(r[f]))}</li>`)).join('')||'<li>No comments yet.</li>'}</ul></section></main></html>`);
 }catch{sendJson(res,503,{error:'Private feedback reporting is unavailable. No records have been published.'});}
}
