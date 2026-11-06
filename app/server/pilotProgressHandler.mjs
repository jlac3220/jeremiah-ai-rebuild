import {randomUUID} from 'node:crypto';
import {withPilotService,redisEval} from './pilotSecurity.mjs';
import {readJsonBody,sendJson} from './httpUtils.mjs';

// Anonymous, device-local participant IDs only. No IP, account, exam answers,
// scores, free-text responses, or personally identifying fields are recorded.
const PREFIX='{jeremiah-pilot-progress-v1}:';
const PARTICIPANTS=PREFIX+'participants';
const AGE=['18-29','30-44','45-59','60-74','75plus','prefer_not'];
const BIBLE=['very','somewhat','little','none'];
const CHURCH=['current','previous','familiar','none'];
const TECH=['very','somewhat','not_very'];
const SEX=['female','male','prefer_not'];
const valid=(value,options)=>typeof value==='string'&&options.includes(value)?value:'';
const EVENTS=new Set(['started','chapter','assessment','completed']);
const WRITE=`
local key=KEYS[2]
if redis.call('EXISTS',key)==0 then
 redis.call('HSET',key,'firstSeen',ARGV[1],'maxChapter','0','completed','0','assessment','0')
 redis.call('HSET',key,'age',ARGV[4],'bible',ARGV[5],'church',ARGV[6],'tech',ARGV[7],'sex',ARGV[8])
 redis.call('SADD',KEYS[1],ARGV[9])
end
redis.call('HSET',key,'lastSeen',ARGV[1])
local prior=tonumber(redis.call('HGET',key,'maxChapter') or '0')
local chapter=tonumber(ARGV[3]) or 0
if chapter>prior then redis.call('HSET',key,'maxChapter',chapter) end
if ARGV[2]=='assessment' or ARGV[2]=='completed' then redis.call('HSET',key,'assessment','1') end
if ARGV[2]=='completed' then redis.call('HSET',key,'completed','1') end
return 1
`;
const READ=`
local ids=redis.call('SMEMBERS',KEYS[1])
local rows={}
for i=1,math.min(#ids,1000) do
 local d=redis.call('HMGET',ARGV[1]..ids[i],'firstSeen','lastSeen','maxChapter','completed','assessment','age','bible','church','tech','sex')
 if d[1] then
  table.insert(rows,table.concat({d[1] or '',d[2] or '',d[3] or '',d[4] or '',d[5] or '',d[6] or '',d[7] or '',d[8] or '',d[9] or '',d[10] or ''},'|'))
 end
end
return rows
`;
export async function handlePilotProgress(req,res){
 if(req.method!=='POST'){sendJson(res,405,{error:'Method not allowed'});return;}
 return withPilotService(req,res,'progress',async()=>{
  try{
   const body=await readJsonBody(req,1500);
   if(!body||typeof body!=='object'||Array.isArray(body)||
      typeof body.participantId!=='string'||!/^[-a-f0-9]{36}$/.test(body.participantId)||
      !EVENTS.has(body.event)||!Number.isInteger(body.chapter)||body.chapter<0||body.chapter>5){
    sendJson(res,400,{error:'Invalid progress event'});return;
   }
   const p=body.profile||{};
   if(!p||typeof p!=='object'||Array.isArray(p)){sendJson(res,400,{error:'Invalid profile'});return;}
   await redisEval(WRITE,[PARTICIPANTS,PREFIX+'p:'+body.participantId],[
    Date.now(),body.event,body.chapter,valid(p.age,AGE),valid(p.bibleFamiliarity,BIBLE),
    valid(p.pentecostalExperience,CHURCH),valid(p.techComfort,TECH),valid(p.sex,SEX),body.participantId
   ]);
   sendJson(res,200,{accepted:true});
  }catch(error){
   console.error(JSON.stringify({event:'pilot_progress_unavailable',category:'storage_unavailable'}));
   sendJson(res,503,{error:'Progress tracking is temporarily unavailable'});
  }
 });
}
function groups(records,key){
 const categories=new Map();
 for(const r of records){if(!r[key])continue;const a=categories.get(r[key])||{count:0,completed:0};a.count++;if(r.completed)a.completed++;categories.set(r[key],a);}
 // Hide small groups, including completion counts, to protect anonymity.
 return Object.fromEntries([...categories.entries()].filter(([,r])=>r.count>=3).map(([k,r])=>[k,{...r,rate:Math.round(r.completed/r.count*100)}]));
}
export async function pilotProgressSummary(){
 const rows=await redisEval(READ,[PARTICIPANTS],[PREFIX+'p:']);
 const now=Date.now(),inactiveMs=7*24*3600*1000;
 const records=(Array.isArray(rows)?rows:[]).map(line=>{
  const [firstSeen,lastSeen,chapter,completed,assessment,age,bible,church,tech,sex]=String(line).split('|');
  return {firstSeen:Number(firstSeen),lastSeen:Number(lastSeen),chapter:Number(chapter),completed:completed==='1',assessment:assessment==='1',age,bible,church,tech,sex};
 }).filter(x=>Number.isFinite(x.firstSeen)&&x.firstSeen>0);
 const started=records.length,completed=records.filter(r=>r.completed).length;
 const unfinished=records.filter(r=>!r.completed),inactive=unfinished.filter(r=>now-r.lastSeen>inactiveMs).length;
 return {started,completed,inProgress:unfinished.length-inactive,inactiveSevenDays:inactive,
  completionRate:started?Math.round(completed/started*100):0,
  assessmentReached:records.filter(r=>r.assessment).length,
  lastChapterUnfinished:[1,2,3,4,5].map(chapter=>({chapter,count:unfinished.filter(r=>r.chapter===chapter).length})),
  demographics:{age:groups(records,'age'),bibleFamiliarity:groups(records,'bible'),pentecostalExperience:groups(records,'church'),techComfort:groups(records,'tech'),sex:groups(records,'sex')},
  note:'Anonymous browser-based counts. Unfinished means no recorded completion; inactive means no event for 7+ days. Groups with fewer than 3 participants are hidden.'
 };
}
