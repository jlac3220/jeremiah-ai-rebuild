// Real fresh-learner journey. No localStorage seeding or skipped teaching moves.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const phase=process.argv[2]||'after',base=process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4184';
const out=process.env.JEREMIAH_SCREENSHOT_DIR||path.resolve(__dirname,'../../docs/teaching-progression-evidence',phase),key='jeremiah-learning-state:OG.1.LESSON.18:direct';
(async()=>{
 const {default:content}=await import('../src/core/classroom/content/OG_1_LESSON.js');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});fs.mkdirSync(out,{recursive:true});const records=[];
 async function fresh(width,height){const p=await browser.newPage({viewport:{width,height},deviceScaleFactor:2});p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Unavailable in synthetic review"}'}));await p.goto(base+'/#pilot');await p.getByRole('checkbox').check();await p.getByRole('button',{name:'Start the lesson'}).click();const off=p.getByRole('button',{name:'Turn narration off',exact:true});if(await off.count())await off.click();return p;}
 const stored=p=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 const next=p=>p.locator('nav.ogp-controls button.ogp-action');
 async function shot(p,width,name){await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,name+' overflow');await p.screenshot({path:`${out}/${width}-${name}.png`,scale:'css'});await p.screenshot({path:`${out}/${width}-${name}-full.png`,fullPage:true,scale:'css'});const box=await next(p).boundingBox();await next(p).scrollIntoViewIfNeeded();await p.screenshot({path:`${out}/${width}-${name}-action.png`,scale:'css'});return {name,primary:await next(p).innerText(),primaryBottom:box.y+box.height};}
 async function answer(p,move){
  if(move.type==='free_response'){await p.getByRole('textbox').fill(move.interaction?.expectedText||'Synthetic learner explanation: one God, Scripture in context, genuine incarnation and real human prayer.');return;}
  if(move.interaction?.type==='reasoning'){for(const [n,group] of ['claims','reasons'].entries()){const id=move.interaction.answer[n?'reason':'claim'];const label=move.interaction[group].find(x=>x.id===id).label;await p.locator('.la-reasoning fieldset').nth(n).getByRole('button',{name:label,exact:true}).click();}return;}
  if(move.interaction?.type==='match'){
   for(const [i,item] of move.interaction.items.entries()){
    if(move.id==='shema-guide'){const label=move.interaction.options.find(x=>x.id===item.answer).label;await p.locator('.shema-practice-options').getByRole('button',{name:label,exact:true}).click();if(i<move.interaction.items.length-1)await p.getByRole('button',{name:'Continue to the next phrase',exact:false}).click();}
    else{if(move.id==='distinction-guide')await p.locator('.la-verdicts').getByRole('button',{name:move.interaction.options.find(x=>x.id===item.answer).label,exact:true}).click();else await p.locator('.la-activity select').selectOption(item.answer);if(i<move.interaction.items.length-1)await p.getByRole('button',{name:'Reveal next phrase',exact:false}).click();}
   }return;
  }
  await p.locator('.ogp-options button').first().click();
 }
 try{
 for(const width of [390,1440]){
  const p=await fresh(width,width===390?844:1000),seen=new Set(),flow=[];let steps=0;
  while(steps++<130){
   const state=await stored(p),move=content.instructionalMoves.find(x=>x.id===state.currentMoveId);let name=null;
   const root=await p.locator('.ogp-page').getAttribute('class');
   if(root.includes('ogp-scene-shema-manuscript')&&await p.locator('.shema-phrase-track button').nth(2).getAttribute('aria-current')==='step')name='phrase-3';
   if(root.includes('ogp-scene-shema-connection'))name='connection';
   if(root.includes('ogp-scene-shema-echad')){const i=(await p.locator('[data-inquiry-step]').count()?Number(await p.locator('[data-inquiry-step]').getAttribute('data-inquiry-step')):0);name=['echad-intro','echad-genesis','echad-isaiah','echad-jesus','echad-conclusion'][i];}
   if(root.includes('ogp-scene-identity'))name='identity-'+(await p.locator('.og1-identity').getAttribute('data-question')||'word');
   if(root.includes('ogp-scene-comparison'))name='comparison-'+await p.locator('.ogp-compare-columns section').count();
   if(root.includes('ogp-scene-doctrine-summary'))name='doctrinal-synthesis';
   if(root.includes('ogp-scene-return'))name='return-devotion';
   if(name&&!seen.has(name)){if(phase==='after'&&(name.startsWith('echad-')||name.startsWith('identity-')))await p.waitForFunction(()=>window.scrollY===0);flow.push(await shot(p,width,name));seen.add(name);
    if(phase==='after'&&name==='echad-intro'){
     const before=await stored(p);await p.getByRole('button',{name:'Trinitarian One divine being',exact:false}).click();assert.match(await p.locator('.og1-inquiry-limit').innerText(),/not a proof/);await p.getByRole('button',{name:'Apostolic Oneness One indivisible',exact:false}).click();assert.match(await p.locator('.og1-inquiry-limit').innerText(),/real prayer/);assert.deepEqual(await stored(p),before,'Discovery must not record assessment or mastery');
    }
    if(phase==='after'){
     const copy=await p.locator('.ogp-stage').innerText();
     if(name?.startsWith('echad-')&&!['echad-intro','echad-conclusion'].includes(name)){assert.match(copy,/WHAT THIS ESTABLISHES/);assert.match(copy,/WHAT IT DOES NOT SETTLE/);}
     if(name==='echad-conclusion'){assert.match(copy,/Neither interpretation rests on one Hebrew word/);assert.match(copy,/John’s Word, baptism in Jesus’ name, and Jesus’ prayer/);}
     if(name?.startsWith('identity-')){
      assert.equal(await p.locator('.og1-identity-passage').count(),2,'Both passages must be visible');assert.match(copy,/Trinitarian/);assert.match(copy,/Apostolic Oneness/);assert.match(copy,/What this clarifies/);
      const link=p.locator('.og1-identity-passage button').last(),ref=(await link.innerText()).split(' · ')[0];await link.click();assert.match(await p.locator('.og1-bible-header').innerText(),new RegExp(ref.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));await p.keyboard.press('Escape');
     }
     if(name==='identity-prayer'){const before=await stored(p),track=p.locator('.og1-identity-deck button');await track.last().focus();await p.keyboard.press('Home');assert.equal(await p.locator('.og1-identity').getAttribute('data-question'),'word');await p.keyboard.press('End');assert.equal(await p.locator('.og1-identity').getAttribute('data-question'),'prayer');assert.deepEqual(await stored(p),before,'Review never changes evidence');}
     if(name==='comparison-2'){assert.match(copy,/Essence/);assert.match(copy,/person/);assert.match(copy,/Proceeding/);assert.match(copy,/not a later creation/);}
     if(name==='doctrinal-synthesis'){assert.match(copy,/John 1:1, 14/);assert.match(copy,/Matthew 28:19/);assert.match(copy,/Acts 2:38/);assert.match(copy,/Luke 22:42/);assert.match(copy,/1 Timothy 2:5/);assert.match(copy,/cumulative interpretation, not a dictionary proof/);}
    }
   }
   if(name==='return-devotion')break;
   if(move.type!=='teach'&&state.experience?.teachingDecision?.moveId!==move.id){await answer(p,move);await next(p).click();await p.locator('.og2-teacher').waitFor();}
   else await next(p).click();
  }
  assert.ok(steps<130,'Complete chapter progression');
  if(phase==='after')for(const required of ['echad-intro','echad-genesis','echad-isaiah','echad-jesus','echad-conclusion','identity-word','identity-name','identity-prayer','comparison-2','doctrinal-synthesis','return-devotion'])assert.ok(seen.has(required),required+' reached through main action');
  assert.deepEqual(p.errors,[]);records.push({width,flow,steps,seeded:false});
  if(phase==='after'&&width===390){
   // Revisit the completed teaching through the existing Previous controls on a
   // second fresh page, checking keyboard/short/reduced-motion without seeding.
   const q=await fresh(320,440);await q.emulateMedia({reducedMotion:'reduce'});for(let i=0;i<20;i++){if(await q.locator('.og1-inquiry').count())break;await next(q).click();}
   await q.locator('.og1-inquiry').waitFor();const before=await stored(q);const option=q.locator('.og1-inquiry-claims button').first();await option.focus();await q.keyboard.press('Enter');assert.equal(await option.getAttribute('aria-pressed'),'true');assert.notEqual(await option.evaluate(e=>getComputedStyle(e).outlineStyle),'none');assert.deepEqual(await stored(q),before);
   await shot(q,320,'short-reduced-motion');await q.evaluate(()=>document.documentElement.style.fontSize='32px');await shot(q,320,'large-text');assert.equal(await q.locator('.og1-inquiry-copy').evaluate(e=>e.scrollWidth<=e.clientWidth),true,'200% text not clipped inside card');await q.evaluate(()=>document.documentElement.style.fontSize='');
   await next(q).click();await q.getByRole('button',{name:'Previous',exact:false}).click();assert.equal(await q.locator('[data-inquiry-step]').getAttribute('data-inquiry-step'),'0','Bridge revisitable');
   await q.route('**/images/**',r=>r.abort());await q.reload();for(let i=0;i<8;i++){if(await q.locator('.og1-inquiry').count())break;await next(q).click();}await q.locator('.og1-inquiry').waitFor();await q.locator('.og1-inquiry-scene:not(:has(img))').waitFor();await shot(q,320,'image-fallback');assert.deepEqual(q.errors,[]);await q.close();
  }
  await p.close();
 }
 fs.writeFileSync(out+'/flows.json',JSON.stringify(records,null,2));console.log('PASS teaching progression '+phase+': fresh phone/desktop through real lesson interactions and exact CTA checkpoints.'+(phase==='after'?' All evidence/interpretation pairs, preserved discovery state; short/reduced-motion/keyboard/200% text/fallback.':''));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
