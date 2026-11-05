import assert from 'node:assert/strict';
import {BlobNotFoundError,BlobAccessError} from '@vercel/blob';
import {readFileSync} from 'node:fs';
import {readJsonBody} from '../server/httpUtils.mjs';
import {recordPrivateBlobFeedback} from '../server/pilotFeedbackHandler.mjs';
import {validatePilotFeedback} from '../server/pilotFeedbackHandler.mjs';
import {OG1_PILOT_SURVEY_VERSION} from '../src/data/og1PilotSurvey.js';

const read=filename=>readFileSync(new URL(filename,import.meta.url),'utf8');
const config=JSON.parse(read('../vercel.json'));
assert.equal(config.framework,'vite');
assert.equal(config.outputDirectory,'dist');
assert.ok(config.rewrites.some(r=>r.destination==='/index.html'));
assert.ok(config.functions['api/**/*.mjs'].maxDuration>=45);
const endpoints=[
 ['jeremiah/teach','handleJeremiahApi'],
 ['jeremiah/ask','handleAskJeremiah'],
 ['jeremiah/narration','handleNarrationApi'],
 ['visuals/discover','handleVisualDiscovery'],
 ['bible/chapter','handleBibleApi'],
 ['pilot/feedback','handlePilotFeedback']
];
for(const [file,fn] of endpoints){
 const entry=read('../api/'+file+'.mjs');
 assert.ok(entry.includes('export default async function handler'),file+' must deploy as a Vercel Node Function');
 assert.ok(entry.includes(fn+'(req, res)'),file+' must dispatch the existing API handler');
}
assert.equal(await readJsonBody({body:null},200),null,'Preparsed JSON null must not wait on an already-consumed serverless stream');
const parsed=await readJsonBody({body:{hello:'Vercel',numbers:[1,2]}},200);
assert.equal(parsed.hello,'Vercel');
await assert.rejects(readJsonBody({body:{large:'x'.repeat(200)}},50),/too large/i);
const sample=validatePilotFeedback({
 version:OG1_PILOT_SURVEY_VERSION,
 submissionId:'vercelpilotresponse000001',
 overall:4,ratings:{scripture:5},completed:true,priority:'imagery'
});
const stored=new Map();
const sdk={
 async head(name){
  if(stored.has(name))return {pathname:name};
  throw new BlobNotFoundError();
 },
 async put(name,data,options){
  assert.equal(options.access,'private');
  assert.equal(options.allowOverwrite,false);
  assert.equal(options.addRandomSuffix,false);
  if(stored.has(name))throw new Error('Object already exists');
  stored.set(name,JSON.parse(data));
 }
};
assert.equal(new BlobNotFoundError().name,'Error','Use the real installed SDK error contract, not a fake name');
const first=await recordPrivateBlobFeedback(sample,sdk);
const again=await recordPrivateBlobFeedback(sample,sdk);
assert.equal(first.duplicate,false);
assert.equal(again.duplicate,true);
assert.equal(stored.size,1);
await assert.rejects(recordPrivateBlobFeedback(sample,{async head(){throw new BlobAccessError();}}),BlobAccessError,'Authorization failure must not be mistaken for a missing record');
const concurrent=await Promise.all(Array.from({length:12},()=>recordPrivateBlobFeedback({...sample,submissionId:'concurrentpilot000000000001'},sdk)));
assert.equal(concurrent.filter(x=>!x.duplicate).length,1);assert.equal(stored.size,2);
const value=[...stored.values()][0];
assert.equal(value.overall,4);
assert.equal(value.lesson,'OG.1.LESSON.18');
assert.ok(value.submittedAt);
assert.ok(read('../server/pilotFeedbackHandler.mjs').includes("process.env.VERCEL==='1'"),'Vercel must never write survey files locally');
console.log('PASS Vercel: serverless endpoints, parsed request bodies, private Blob persistence, duplicate-safe feedback.');
