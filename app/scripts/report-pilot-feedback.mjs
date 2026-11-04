import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {loadLocalEnv} from '../server/loadEnv.mjs';
import {pilotFeedbackFile} from '../server/pilotFeedbackHandler.mjs';
import {PILOT_RATING_AREAS,PILOT_TEXT_FIELDS} from '../src/data/og1PilotSurvey.js';

function asCsv(value){
 let s=value===null||value===undefined?'':String(value);
 // Avoid spreadsheet formula execution even if a participant supplies formula-like text.
 if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
const counted=(entries,key)=>Object.entries(entries.reduce((counts,entry)=>{
 const label=entry[key]||'(not answered)';
 counts[label]=(counts[label]||0)+1;
 return counts;
},{})).sort((a,b)=>b[1]-a[1]);

await loadLocalEnv();
const file=pilotFeedbackFile();
let raw;
try{raw=await readFile(file,'utf8');}catch(e){
 if(e.code==='ENOENT'){console.log('No pilot feedback yet. Expected file:',file);process.exit(0);}
 throw e;
}
const entries=raw.split('\n').filter(Boolean).flatMap((line,index)=>{
 try{return [JSON.parse(line)];}
 catch{console.error('Skipped malformed feedback record at line',index+1);return [];}
});
console.log('\nJEREMIAH · OG.1 PILOT REPORT');
console.log('Responses:',entries.length);
console.log('Completed lesson:',entries.filter(e=>e.completed).length,'· Partial experience:',entries.filter(e=>!e.completed).length);
if(!entries.length)process.exit(0);
const average=values=>values.length?(values.reduce((a,b)=>a+b,0)/values.length).toFixed(2):'—';
console.log('\nOverall rating (1–5):',average(entries.map(e=>e.overall).filter(v=>Number.isInteger(v)&&v>=1&&v<=5)));
console.log('\nExperience categories:');
for(const area of PILOT_RATING_AREAS){
 const values=entries.map(e=>e.ratings?.[area.id]).filter(v=>Number.isInteger(v)&&v>=1&&v<=5);
 console.log('  '+area.label.padEnd(28),average(values),'('+values.length+' responses)');
}
console.log('\nTop priorities:');
for(const [name,count] of counted(entries,'priority'))console.log('  '+name.padEnd(20),count);
console.log('\nInterest in another lesson:');
for(const [name,count] of counted(entries,'future'))console.log('  '+name.padEnd(20),count);
console.log('\nMost memorable part:');
for(const [name,count] of counted(entries,'moment'))console.log('  '+name.padEnd(20),count);
console.log('\nDevice breakdown:');
for(const [name,count] of counted(entries,'device'))console.log('  '+name.padEnd(20),count);

const columns=['submittedAt','submissionId','completed','overall',...PILOT_RATING_AREAS.map(area=>'rating_'+area.id),
 'future','priority','moment','device','role',...Object.keys(PILOT_TEXT_FIELDS)];
const rows=entries.map(entry=>columns.map(column=>{
 if(column.startsWith('rating_'))return asCsv(entry.ratings?.[column.slice(7)]||'');
 return asCsv(entry[column]??'');
}).join(','));
const outputDir=path.dirname(file);
await mkdir(outputDir,{recursive:true,mode:0o700});
const output=path.join(outputDir,'og1-pilot-report.csv');
await writeFile(output,[columns.map(asCsv).join(','),...rows].join('\n')+'\n',{encoding:'utf8',mode:0o600});
console.log('\nPrivate CSV export:',output);
console.log('Keep the CSV private. It contains optional open-text comments and should not be committed to Git.');
