// Independent non-Vercel-account Chromium context. No route mocks or seeded state.
// Stops rather than claiming a successful pilot when live paid services fail.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const base=process.env.PILOT_TEST_BASE_URL||'https://jeremiah-ai-rebuild.vercel.app';
if(!/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(base))throw new Error('Use the authorized rebuild staging host; never jeremiah.app');
(async()=>{const out=path.resolve(__dirname,'../../docs/pilot-launch-evidence/hosted');fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const observations=[];
try{for(const width of [390,1440]){
 const context=await b.newContext({viewport:{width,height:width===390?844:1000}}),p=await context.newPage(),api=[];
 p.on('response',r=>{const u=new URL(r.url());if(u.pathname.startsWith('/api/'))api.push({path:u.pathname,status:r.status()})});
 const response=await p.goto(base+'/#pilot');await p.waitForTimeout(500);
 if(!(await p.getByRole('checkbox').count())){observations.push({width,siteStatus:response.status(),blocked:'deployment_protection_or_unavailable'});await p.screenshot({path:`${out}/${width}-entry.png`});await context.close();continue;}
 await p.getByRole('checkbox').check();const start=p.getByRole('button',{name:'Start the lesson',exact:false});
 if(await start.isDisabled()){observations.push({width,closed:true,api});await p.screenshot({path:`${out}/${width}-closed.png`,fullPage:true});await context.close();continue;}
 await start.click();await p.waitForTimeout(1500);await p.screenshot({path:`${out}/${width}-lesson-live.png`});
 await p.goto(base+'/#askJeremiah');await p.locator('#aj-question').waitFor();await p.locator('#aj-question').fill('What does Deuteronomy 6:4 teach about God?');await p.getByRole('button',{name:'Send question',exact:true}).click();await p.waitForTimeout(4000);await p.screenshot({path:`${out}/${width}-ask-live.png`,fullPage:true});
 observations.push({width,api,verifiedFullPilot:false,reason:api.some(r=>r.status>=400)?'live_service_failure':'full_real_services_and_survey_gate_still_required'});await context.close();
}fs.writeFileSync(out+'/observations.json',JSON.stringify({base,simulatedServices:false,seeded:false,physicalPhone:false,observations},null,2));console.log(JSON.stringify(observations,null,2));}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
