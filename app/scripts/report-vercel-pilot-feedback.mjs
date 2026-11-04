import {writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {loadLocalEnv} from '../server/loadEnv.mjs';

await loadLocalEnv();
if(!process.env.BLOB_READ_WRITE_TOKEN){
 console.error('Private Blob access is not configured. Connect a private Blob store, then set BLOB_READ_WRITE_TOKEN locally with vercel env pull.');
 process.exit(1);
}
const {list,get}=await import('@vercel/blob');
const records=[];
let cursor;
do {
 const batch=await list({prefix:'jeremiah-pilot/og1/',limit:1000,...(cursor?{cursor}:{})});
 for(const item of batch.blobs||[]) {
  if(!item.pathname.endsWith('.json'))continue;
  const file=await get(item.pathname,{access:'private'});
  if(!file?.stream)continue;
  records.push(JSON.parse(await new Response(file.stream).text()));
 }
 cursor=batch.hasMore?batch.cursor:undefined;
}while(cursor);
const dir=path.resolve(process.cwd(),'.pilot-data');
await mkdir(dir,{recursive:true,mode:0o700});
const name=path.join(dir,'vercel-og1-feedback.jsonl');
await writeFile(name,records.map(record=>JSON.stringify(record)).join('\n')+(records.length?'\n':''),{encoding:'utf8',mode:0o600});
process.env.PILOT_FEEDBACK_FILE=name;
console.log('Downloaded',records.length,'private responses from Vercel Blob into',name);
await import('./report-pilot-feedback.mjs');
