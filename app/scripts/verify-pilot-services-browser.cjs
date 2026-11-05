// Independent browser contexts; real local handlers and file persistence, no
// mocked network routes. This does not substitute for hosted Blob/OpenAI tests.
const {chromium}=require('playwright'),{spawn}=require('node:child_process'),{randomBytes}=require('node:crypto'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const app=path.resolve(__dirname,'..'),dir=await fs.mkdtemp(path.join(os.tmpdir(),'jeremiah-service-review-')),out=path.resolve(app,'../docs/pilot-launch-evidence/local');await fs.mkdir(out,{recursive:true});
 const password=randomBytes(32).toString('hex'),signing=randomBytes(32).toString('hex'),children=[];
 function start(port,enforced){const child=spawn(process.execPath,['server.mjs'],{cwd:app,env:{...process.env,PORT:String(port),OPENAI_API_KEY:'',PILOT_FEEDBACK_FILE:path.join(dir,'feedback.jsonl'),PILOT_OWNER_PASSWORD:password,PILOT_SESSION_SECRET:signing,PILOT_ACCESS_ENFORCED:enforced?'true':'false',PILOT_ACCESS_MODE:'closed',VERCEL:'0'},stdio:'ignore'});children.push(child);}
 async function ready(base){for(let i=0;i<60;i++){try{if((await fetch(base+'/api/pilot/access')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100))}throw new Error('Local review server unavailable')}
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  start(4193,false);start(4194,true);await Promise.all([ready('http://127.0.0.1:4193'),ready('http://127.0.0.1:4194')]);
  const sample={version:'og1-pilot-2026-11-v1',submissionId:'localfixture00000000000001',overall:4,ratings:{flow:3},completed:false,priority:'teaching',bestPart:'Synthetic local review only. No real participant data. <script>window.feedbackXss=true</script>',score:100,learnerResponse:'MUST NOT BE STORED'};
  const post=()=>fetch('http://127.0.0.1:4193/api/pilot/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sample)}).then(r=>r.json());
  assert.equal((await post()).duplicate,false);assert.equal((await post()).duplicate,true);
  const disk=await fs.readFile(path.join(dir,'feedback.jsonl'),'utf8');assert.equal(disk.trim().split('\n').length,1);assert.ok(!disk.includes('MUST NOT BE STORED'));assert.ok(!disk.includes('score'));
  for(const width of [390,1440]){
   const context=await b.newContext({viewport:{width,height:width===390?844:1000}}),p=await context.newPage();
   assert.equal((await context.request.get('http://127.0.0.1:4193/api/pilot/report')).status(),401);
   await p.goto('http://127.0.0.1:4194/#pilot');await p.getByText('The pilot is closed while we verify its services.',{exact:false}).waitFor();await p.getByRole('checkbox').check();assert.equal(await p.getByRole('button',{name:'Start the lesson',exact:false}).isDisabled(),true);await p.screenshot({path:`${out}/${width}-closed-gate.png`,fullPage:true});
   await p.goto('http://127.0.0.1:4193/#pilot-feedback');await p.getByRole('button',{name:'4 of 5 · Good',exact:true}).click();await p.getByRole('button',{name:'Continue',exact:false}).click();await p.getByRole('button',{name:'Continue',exact:false}).click();await p.locator('textarea[name="bestPart"]').fill('Synthetic phone/desktop submission through the actual survey.');await p.getByRole('button',{name:'Submit my feedback',exact:false}).click();await p.locator('.ogsurvey-thanks').waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width);await p.screenshot({path:`${out}/${width}-local-receipt.png`});await context.close();
   const owner=await b.newContext({viewport:{width,height:width===390?844:1000},httpCredentials:{username:'owner',password}}),report=await owner.newPage();
   await report.goto('http://127.0.0.1:4193/api/pilot/report');await report.getByRole('heading',{name:'What adult testers are telling us'}).waitFor();assert.equal(await report.evaluate(()=>document.documentElement.scrollWidth),width);assert.equal(await report.locator('script').count(),0);assert.equal(await report.evaluate(()=>Boolean(window.feedbackXss)),false);await report.screenshot({path:`${out}/${width}-private-report.png`,fullPage:true});const csv=await owner.request.get('http://127.0.0.1:4193/api/pilot/report?format=csv');assert.equal(csv.status(),200);assert.match(csv.headers()['content-type'],/text\/csv/);assert.ok(!(await csv.text()).includes('MUST NOT BE STORED'));await owner.close();
  }
  console.log('PASS independent Chromium contexts 390/1440: closed-gate enforcement, real local survey receipt/retry, private owner report/CSV, no raw grades/answers, no overflow. Hosted private Blob and real OpenAI remain separate required gates.');
 }finally{await b.close();for(const child of children)child.kill('SIGTERM');await fs.rm(dir,{recursive:true,force:true})}
})().catch(e=>{console.error(e);process.exit(1)});
