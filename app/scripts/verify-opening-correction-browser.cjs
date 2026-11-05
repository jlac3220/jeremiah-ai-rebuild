// Fresh learners only: no state seeding. Compare PR #57, PR #58 and correction.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const phase=process.argv[2]||'after',base=process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4184',out=process.env.JEREMIAH_SCREENSHOT_DIR||path.resolve(__dirname,'../../docs/opening-correction-evidence',phase);
const key='jeremiah-learning-state:OG.1.LESSON.18:direct';
(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const records=[];
async function fresh(width,height=width===390?844:1000,reduced=false){const p=await b.newPage({viewport:{width,height},deviceScaleFactor:2,reducedMotion:reduced?'reduce':'no-preference'});p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Unavailable in browser review"}'}));await p.goto(base+'/#pilot');await p.getByRole('checkbox').check();await p.getByRole('button',{name:'Start the lesson'}).click();const off=p.getByRole('button',{name:'Turn narration off',exact:true});if(await off.count())await off.click();return p;}
async function shot(p,width,name){await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,name+' overflow');await p.screenshot({path:`${out}/${width}-${name}.png`,scale:'css'});await p.screenshot({path:`${out}/${width}-${name}-full.png`,fullPage:true,scale:'css'});}
const primary=p=>p.locator('nav.ogp-controls button.ogp-action');
try{
for(const width of [390,1440]){
 const p=await fresh(width);await shot(p,width,'opening');const journey=[];
 if(phase==='after'){
  for(const [i,name] of ['Moses','Isaiah','Jesus','Paul'].entries()){
   assert.equal(await p.locator('.og1-opening').getAttribute('data-witness'),name);assert.equal(await p.locator('.og1-opening-status').innerText(),`${i+1} of 4 witnesses viewed`);assert.ok((await p.locator('.og1-opening-establishes').innerText()).length>30);journey.push({name,primary:await primary(p).innerText()});await shot(p,width,'witness-'+name.toLowerCase());const box=await primary(p).boundingBox();assert.ok(box.height>=44);if(width===390)assert.ok(box.y+box.height<=844,name+' primary visible without scrolling');journey[journey.length-1].primaryBottom=box.y+box.height;await primary(p).click();
  }
 }else{
  for(let i=0;i<10&&!(await p.locator('.shema-world').count());i++){journey.push({primary:await primary(p).innerText(),witness:await p.locator('.ogj-guided-copy h2,.ogp-opening-answer-copy>span').allTextContents()});await primary(p).click();}
 }
 await p.locator('.shema-world').waitFor();await shot(p,width,'encounter');await primary(p).click();await p.locator('.shema-signature').waitFor();await shot(p,width,'phrase');assert.equal(await p.getByRole('button',{name:'Hear this phrase'}).count(),0);assert.deepEqual(p.errors,[]);records.push({width,journey});await p.close();
}
if(phase==='after'){
 for(const mode of ['explore','skip','keyboard','fallback']){
  const p=await fresh(mode==='keyboard'?320:390,mode==='keyboard'?440:844,mode==='keyboard');
  const saved=async()=>p.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key));return {history:s.teacherHistory,attempts:s.attemptsByMove,evidence:s.evidenceIds,mastery:s.milestones.mastery,exam:s.experience.exitExam};},key);const before=await saved();
  if(mode==='skip'){await p.getByRole('button',{name:'Skip preview',exact:false}).click();await p.locator('.shema-world').waitFor();assert.deepEqual(await saved(),before,'Skipping never fabricates evidence or mastery');}
  if(mode==='explore'){for(const name of ['Paul','Isaiah','Jesus']){await p.getByRole('button',{name:new RegExp('^'+name+' ')}).click();assert.equal(await p.locator('.og1-opening').getAttribute('data-witness'),name);}assert.equal(await p.locator('.og1-opening-status').innerText(),'4 of 4 witnesses viewed');assert.match(await primary(p).innerText(),/Begin Chapter 1/);assert.deepEqual(await saved(),before);await primary(p).click();await p.locator('.shema-world').waitFor();}
  if(mode==='keyboard'){const first=p.locator('.og1-opening-choices button').first();await first.focus();await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.og1-opening').getAttribute('data-witness'),'Isaiah');assert.notEqual(await p.locator('.og1-opening-choices button').nth(1).evaluate(el=>getComputedStyle(el).outlineStyle),'none');assert.equal(await p.locator('.og1-opening-choices .is-suggested').count(),0);assert.equal(await p.locator('.og1-opening-choices button').first().evaluate(el=>getComputedStyle(el).animationName),'none');await primary(p).scrollIntoViewIfNeeded();assert.ok((await primary(p).boundingBox()).height>=44);await shot(p,320,'short-keyboard');}
  if(mode==='fallback'){await p.route('**/images/**',r=>r.abort());await p.reload();await p.locator('.og1-opening-scene .ogj-art:not(:has(img))').waitFor();for(let i=0;i<4;i++)await primary(p).click();await p.locator('.shema-world').waitFor();await primary(p).click();await p.locator('.shema-signature-fallback').waitFor();await shot(p,390,'image-fallback');}
  assert.deepEqual(p.errors,[]);await p.close();
 }
}
fs.writeFileSync(out+'/flows.json',JSON.stringify(records,null,2));console.log('PASS fresh learner:',phase,'phone/desktop opening→encounter→approved phrase card; '+(phase==='after'?'CTA-only visits all four witnesses; intentional exploration, explicit skip, keyboard, short reduced-motion phone, image fallback preserve evidence/history.':'actual baseline CTA route captured.'));
}finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
