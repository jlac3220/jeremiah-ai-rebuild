import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {validatePilotFeedback,recordPilotFeedback} from '../server/pilotFeedbackHandler.mjs';
import {OG1_PILOT_SURVEY_VERSION,PILOT_RATING_AREAS} from '../src/data/og1PilotSurvey.js';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');

const base={version:OG1_PILOT_SURVEY_VERSION,submissionId:'testpilotresponse0000000001',completed:true,overall:5,
 ratings:{scripture:5,flow:4,navigation:3},priority:'navigation',moment:'shema',
 future:'yes',bestPart:'The visual Shema',improve:'Fewer words on chapter breaks',confusing:'The first timeline',
 other:'Great lesson.',device:'phone',role:'learner'};
const cleaned=validatePilotFeedback(base);
assert.equal(cleaned.overall,5);
assert.equal(cleaned.completed,true);
assert.equal(Object.keys(cleaned.ratings).length,PILOT_RATING_AREAS.length);
assert.equal(cleaned.ratings.imagery,0);
assert.equal(cleaned.priority,'navigation');
assert.equal(cleaned.improve,'Fewer words on chapter breaks');
assert.equal(cleaned.email,undefined,'No email or other PII accepted');
assert.equal(cleaned.ip,undefined,'IP never becomes part of persisted feedback');
assert.throws(()=>validatePilotFeedback({...base,overall:0}),/required/);
assert.throws(()=>validatePilotFeedback({...base,completed:'yes'}),/completion status/);
assert.throws(()=>validatePilotFeedback({...base,ratings:{scripture:7}}),/Ratings/);
assert.throws(()=>validatePilotFeedback({...base,priority:'anything'}),/priority/);
assert.throws(()=>validatePilotFeedback({...base,improve:'x'.repeat(1600)}),/too long/);
assert.throws(()=>validatePilotFeedback({...base,submissionId:'bad'}),/identifier/);

const dir=await mkdtemp(path.join(tmpdir(),'jeremiah-pilot-'));
try{
 const file=path.join(dir,'private','feedback.jsonl');
 const [first,second]=await Promise.all([
  recordPilotFeedback(cleaned,file),
  recordPilotFeedback(cleaned,file)
 ]);
 assert.equal(first.accepted,true);
 assert.equal(second.duplicate,true);
 const lines=(await readFile(file,'utf8')).trim().split('\n');
 assert.equal(lines.length,1,'Duplicate client retries must not create duplicate responses');
 const stored=JSON.parse(lines[0]);
 assert.equal(stored.overall,5);
 assert.equal(stored.lesson,'OG.1.LESSON.18');
 assert.equal(typeof stored.submittedAt,'string');
 assert.equal(stored.improve,base.improve);
 assert.equal(stored.email,undefined);
}finally{await rm(dir,{recursive:true,force:true});}

const router=read('../src/app/AppRouter.jsx');
const landing=read('../src/features/pilot/OG1PilotLanding.jsx');
const player=read('../src/features/classroom/OG1LessonPlayer.jsx');
const survey=read('../src/features/pilot/OG1PilotSurvey.jsx');
const server=read('../server.mjs');
const vite=read('../vite.config.js');
assert.ok(router.includes('ROUTES.PILOT_FEEDBACK')&&router.includes('ROUTES.PILOT'),'Pilot routes are direct links');
assert.ok(landing.includes('setActiveClassroomStandardId(PILOT_STANDARD)'),'Pilot must enter OG.1 specifically');
assert.ok(landing.includes('setActiveClassroomSessionPreset('),'Pilot uses existing lesson engine');
assert.ok(player.includes("completionScreen==='survey'"),'Survey follows final synthesis');
assert.ok(player.includes('Finish without survey'),'Feedback remains voluntary');
assert.ok(survey.includes("fetch('/api/pilot/feedback'"),'Survey sends to controlled first-party API');
assert.ok(survey.includes('localStorage.setItem(DRAFT_KEY'),'Survey draft can survive refresh');
assert.ok(survey.includes('result.accepted'),'Survey success must be confirmed by server');
assert.ok(server.includes('handlePilotFeedback(req, res)'),'Production server accepts pilot feedback');
assert.ok(vite.includes('handlePilotFeedback(req, res)'),'Development server accepts pilot feedback');
console.log('PASS OG.1 pilot: direct entry, optional end survey, validated anonymous storage, idempotency and private feedback.');
