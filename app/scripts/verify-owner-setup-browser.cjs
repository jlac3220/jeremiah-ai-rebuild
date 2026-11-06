// Real forms, native owner authentication, actual HTTP handlers. No provider
// credentials or generation; expected diagnostics mean the check was reached,
// not that OpenAI/Blob services have passed live verification.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),{spawn}=require('node:child_process'),{randomBytes}=require('node:crypto'),fs=require('node:fs/promises'),path=require('node:path');
(async()=>{
 const before=process.argv.includes('--before'),app=path.resolve(__dirname,'..'),out=path.resolve(app,'../docs/standalone-pilot-evidence/issue67'),base='http://localhost:4192',password=randomBytes(32).toString('hex');
 await fs.mkdir(out,{recursive:true});
 const child=spawn(process.execPath,['server.mjs'],{cwd:app,env:{...process.env,PORT:'4192',VERCEL:'0',PILOT_ACCESS_ENFORCED:'true',PILOT_ACCESS_MODE:'closed',PILOT_RELEASE_APPROVED:'false',PILOT_OWNER_PASSWORD:password,PILOT_SESSION_SECRET:randomBytes(32).toString('hex'),OPENAI_API_KEY:'',BLOB_READ_WRITE_TOKEN:'',VERCEL_OIDC_TOKEN:'',PILOT_INVITE_CODE:''},stdio:'ignore'});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),results=[];
 try{
  let ready=false;for(let i=0;i<60;i++){try{if((await fetch(base+'/api/pilot/access')).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}assert.ok(ready);
  for(const width of [390,1440]){
   const ctx=await browser.newContext({viewport:{width,height:width===390?844:1000},httpCredentials:{username:'owner',password}}),p=await ctx.newPage();
   for(const [query,label,diagnostic] of [['accountOnly=1','Check key and model access · no generation','key_not_configured'],['feedbackOnly=1','Check private feedback write and read-back','private_storage_unavailable']]){
    const setup=await p.goto(base+'/api/pilot/report?setup=1');assert.equal(setup.status(),200);
    assert.equal(setup.headers()['referrer-policy'],before?'no-referrer':'same-origin');assert.match(setup.headers()['content-security-policy'],/form-action 'self'/);assert.match(setup.headers()['cache-control'],/no-store/);
    const response=p.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/api/pilot/verify?'+query));
    const request=p.waitForRequest(r=>r.method()==='POST'&&r.url().endsWith('/api/pilot/verify?'+query));
    await p.getByRole('button',{name:label,exact:true}).click();const posted=await request,received=await response,headers=await posted.allHeaders();assert.equal(received.status(),before?403:query==='accountOnly=1'?200:503);await p.waitForLoadState('load');const payload=JSON.parse(await p.locator('body').innerText());
    assert.equal(headers['sec-fetch-site'],'same-origin');assert.equal(headers.origin,before?'null':base);
    if(before)assert.equal(payload.error,'Same-origin access required.');else{assert.equal(payload.category,diagnostic);assert.equal(payload.error,undefined);}
    results.push({width,button:query,origin:headers.origin,fetchSite:headers['sec-fetch-site'],reachedCheck:!before,status:received.status(),result:payload});
   }
   await p.goto(base+'/api/pilot/report?setup=1');await p.screenshot({path:out+'/'+(before?'before':'after')+'-'+width+'-setup.png',fullPage:true});if(!before){let referer;await p.route('http://127.0.0.1:4192/privacy-probe',async route=>{referer=(await route.request().allHeaders()).referer;await route.fulfill({status:200,contentType:'text/plain',body:'External referrer policy probe'})});await p.evaluate(()=>{const a=document.createElement('a');a.href='http://127.0.0.1:4192/privacy-probe';a.textContent='Privacy probe';document.body.append(a)});await p.getByRole('link',{name:'Privacy probe',exact:true}).click();await p.waitForLoadState('load');assert.equal(referer,undefined,'No owner-page referrer sent across origins');}await ctx.close();
  }
  const anonymous=await browser.newContext(),access=await anonymous.request.get(base+'/api/pilot/access');assert.deepEqual(((a)=>({mode:a.mode,authenticated:a.authenticated}))(await access.json()),{mode:'closed',authenticated:false});
  for(const query of ['accountOnly=1','feedbackOnly=1']){assert.equal((await anonymous.request.post(base+'/api/pilot/verify?'+query)).status(),401)}
  assert.equal((await anonymous.request.get(base+'/api/pilot/report?setup=1')).status(),401);await anonymous.close();
  const owner=await browser.newContext({httpCredentials:{username:'owner',password}});assert.equal((await owner.request.get(base+'/api/pilot/verify?accountOnly=1')).status(),405);for(const query of ['accountOnly=1','feedbackOnly=1'])for(const headers of [{origin:'https://attacker.invalid','sec-fetch-site':'cross-site'},{origin:'null','sec-fetch-site':'same-origin'},{origin:'https://sibling.invalid','sec-fetch-site':'same-site'},{origin:base,'sec-fetch-site':'cross-site'}])assert.equal((await owner.request.post(base+'/api/pilot/verify?'+query,{headers})).status(),403);await owner.close();
  await fs.writeFile(out+'/'+(before?'before':'after')+'.json',JSON.stringify({phase:before?'before':'after',realBrowser:true,providerCredentials:false,paidRequests:0,liveServiceVerification:false,publicPilotOpened:false,results},null,2));console.log('PASS '+(before?'reproduced Origin:null rejection':'both real setup buttons reach their checks')+' at 390/1440; anonymous and cross-site/null-origin requests remain denied; public access closed. Provider credentials deliberately absent; not live-service proof.');
 }finally{await browser.close();child.kill('SIGTERM')}
})().catch(e=>{console.error(e);process.exit(1)});
