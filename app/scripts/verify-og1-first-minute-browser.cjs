// End-to-end smoke for the real first-minute route, not a seeded lesson mock.
// Requires a built app on JEREMIAH_REVIEW_URL and installed Playwright/Chromium.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4184';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  for(const [width,height] of [[390,844],[1440,1000],[320,440]]){
   const p=await browser.newPage({viewport:{width,height},reducedMotion:width===320?'reduce':'no-preference'});
   const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Offline test"}'}));
   await p.goto(base+'/#pilot');
   await p.getByRole('checkbox').check();
   await p.getByRole('button',{name:'Start the lesson'}).click();
   const intro=p.locator('.ogp-opening');
   await intro.waitFor();
   assert.equal(await p.locator('.ogp-opening-witnesses button').count(),4,'All four witnesses are available without extra Next screens');
   assert.match(await intro.innerText(),/You will discover what this confession means/);
   assert.match(await intro.innerText(),/Deuteronomy 6:4/);
   for(const [index,who,ref] of [[1,'Isaiah','Isaiah 44:6'],[2,'Jesus','Mark 12:29'],[3,'Paul','1 Corinthians 8:4']]){
    await p.locator('.ogp-opening-witnesses button').nth(index).click();
    assert.equal(await p.locator('.ogp-opening-witnesses button').nth(index).getAttribute('aria-pressed'),'true');
    assert.match(await p.locator('.ogp-opening-answer').innerText(),new RegExp(who+'|'+ref.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
   }
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,'No intro overflow');
   const primary=p.locator('nav.ogp-controls button.ogp-action');
   assert.match(await primary.innerText(),/Begin Chapter 1/);
   await primary.click();
   await p.locator('.shema-world').waitFor();
   await primary.click();
   await p.locator('.shema-signature').waitFor();
   await primary.click();await primary.click();
   assert.equal(await p.locator('.shema-signature').getAttribute('data-phrase'),'3');
   await p.getByRole('button',{name:/Follow the evidence/}).click();
   assert.match(await p.locator('#shema-continuity').innerText(),/Isaiah 44:6/);
   await p.locator('#shema-continuity [role=group]').getByRole('button',{name:'Jesus'}).click();
   assert.match(await p.locator('#shema-continuity').innerText(),/Mark 12:29/);
   assert.match(await p.locator('#shema-continuity').innerText(),/not part of your assessment/);
   await p.getByRole('button',{name:/Follow the evidence/}).click();
   assert.equal(await p.locator('#shema-continuity').count(),0);
   assert.equal(await p.getByRole('button',{name:'Hear this phrase'}).count(),0);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,'No phrase overflow');
   assert.deepEqual(errors,[], 'No browser exceptions');
   await p.close();
  }
  console.log('PASS first-minute experience: visual opening, four selectable witnesses, one transition to Chapter 1, voluntary evidence trail, no new graded task');
 } finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
