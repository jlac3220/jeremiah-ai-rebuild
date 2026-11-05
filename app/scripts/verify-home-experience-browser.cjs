// Browser regression for the feature-first Home. Requires Playwright/Chromium
// in the review environment; no paid API calls, writes, or real user data.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4184';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  for (const width of [320,390,768,1440]) {
   const p=await browser.newPage({viewport:{width,height:width<500?844:1000}});
   const errors=[];p.on('pageerror',error=>errors.push(error.message));
   await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Offline review"}'}));
   await p.goto(base+'/#home');
   await p.getByRole('heading',{name:width<=700?/Know the Word/:/Scripture is more than words/}).waitFor();
   assert.equal(await p.getByRole('button',{name:/Begin your lesson|Continue your lesson|Review your lesson/}).count(),1,'Only one direct lesson CTA');
   assert.equal(await p.getByRole('navigation',{name:'Main navigation'}).getByRole('button').count(),6,'Six distinct nav destinations');
   const labels=await p.getByRole('navigation',{name:'Main navigation'}).locator('button svg').count();
   assert.equal(labels,6,'All six nav icons use the same vector treatment');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width,'Home horizontal overflow at '+width);
   await p.getByRole('button',{name:/Talk with Jeremiah/}).click();
   assert.ok(p.url().endsWith('#askJeremiah'),'Ask button opens the teacher');
   await p.goto(base+'/#home');
   await p.getByRole('button',{name:/Explore the studies/}).click();
   assert.ok(p.url().endsWith('#classroom'),'Studies opens classroom, not the current lesson');
   await p.goto(base+'/#home');
   await p.getByRole('button',{name:/Your learning journey/}).click();
   assert.ok(p.url().endsWith('#progress'),'Progress opens independently');
   await p.goto(base+'/#home');
   await p.getByRole('button',{name:/Read in context/}).click();
   assert.ok(p.url().endsWith('#bibleSupport'),'Today's passage opens the Bible');
   assert.deepEqual(errors,[],'No runtime errors');
   await p.close();
  }
  console.log('PASS home experience: independent routes, daily Scripture, one lesson CTA, six simple icons, 320/390/768/1440 widths');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
