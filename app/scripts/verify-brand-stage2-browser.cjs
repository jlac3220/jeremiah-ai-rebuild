// Real browser captures; synthetic learner state, unavailable APIs, no remote writes.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4184',phase=process.argv[2]||'after';
const out=process.env.JEREMIAH_SCREENSHOT_DIR||path.resolve(__dirname,'../../docs/branding-stage2-evidence',phase);
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const {default:content}=await import('../src/core/classroom/content/OG_1_LESSON.js');
 const {createLearningState}=await import('../src/core/classroom/learningEngine.js');
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const metrics=[];
 try{for(const width of [390,1440]){
  const p=await b.newPage({viewport:{width,height:width===390?844:1000},deviceScaleFactor:2}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Unavailable in visual review"}'}));
  async function shot(name){await p.waitForTimeout(180);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,name+' overflow');await p.screenshot({path:`${out}/${width}-${name}.png`,fullPage:true,scale:'css'});metrics.push({width,name,deviceScaleFactor:2,overflow:false});}
  for(const [name,hash] of [['home','home'],['classroom','classroom'],['progress','progress'],['profile','profile'],['bible-support','bibleSupport']]){await p.goto(base+'/#'+hash);await p.locator('nav[aria-label="Main navigation"]').waitFor();await shot(name);assert.equal(await p.getByRole('navigation',{name:'Main navigation'}).getByRole('button').count(),6);}
  await p.goto(base+'/#pilot');await p.getByRole('checkbox').check();await shot('pilot');await p.getByRole('button',{name:'Start the lesson'}).click();await p.locator('.ogp-toolbar').waitFor();assert.equal(await p.locator('.ogp-toolbar').count(),1);assert.equal(await p.locator('nav[aria-label="Main navigation"]').count(),0);await shot('lesson');
  async function seed(move){const state=createLearningState(content,'direct');state.currentMoveId=move;await p.evaluate(state=>{localStorage.setItem('jeremiah-learning-state:OG.1.LESSON.18:direct',JSON.stringify(state));localStorage.setItem('jeremiah.lesson.narration.enabled','false');},state);await p.reload();await p.locator('.ogp-toolbar').waitFor();}
  await seed('shema-show');await shot('chapter');await p.getByRole('button',{name:'Lesson options'}).click();await p.getByRole('button',{name:'Open chapter map',exact:true}).click();await shot('map');await seed('complete');assert.equal(await p.locator('.ogp-compact-heading h1').textContent(),'Exit exam · in progress');await shot('exam');
  if(phase==='after'){await p.goto(base+'/#home');const logo=p.locator('.brand-flame img').first();await logo.waitFor();assert.ok(await logo.evaluate(img=>img.complete&&img.naturalWidth>=img.clientWidth*2),'High DPI logo');for(const button of await p.getByRole('navigation',{name:'Main navigation'}).getByRole('button').all()){const box=await button.boundingBox();assert.ok(box.width>=44&&box.height>=44,'44px targets');}await p.route('**/brand/**',r=>r.abort());await p.reload();await p.locator('.brand-flame-fallback').first().waitFor();await shot('logo-fallback');}
  assert.deepEqual(errors,[]);await p.close();
 }fs.writeFileSync(out+'/metrics.json',JSON.stringify(metrics,null,2));console.log('PASS brand review:',phase,metrics.length,'screens; six destinations, pilot, single toolbar, chapter/map/exam, no overflow/runtime errors.');}finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
