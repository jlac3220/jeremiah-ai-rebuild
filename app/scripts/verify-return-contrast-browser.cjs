// Targeted reproduction of the Chapter 5 return-to-Shema contrast defect.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const phase=process.argv[2]||'after';
const out=path.resolve(__dirname,'../../docs/return-contrast-evidence',phase);
function rgb(s){return s.match(/[\d.]+/g).slice(0,3).map(Number)}
function luminance(c){return c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0)}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
(async()=>{
 const {default:content}=await import('../src/core/classroom/content/OG_1_LESSON.js');
 const {createLearningState}=await import('../src/core/classroom/learningEngine.js');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 fs.mkdirSync(out,{recursive:true});const results=[];
 try{for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:width===390?844:1000}});
  await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{}'}));
  await p.goto((process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4184')+'/#pilot');
  await p.getByRole('checkbox').check();await p.getByRole('button',{name:'Start the lesson'}).click();
  const state={...createLearningState(content,'direct'),currentMoveId:'devotion-show'};
  await p.evaluate(s=>localStorage.setItem('jeremiah-learning-state:OG.1.LESSON.18:direct',JSON.stringify(s)),state);
  await p.reload();await p.locator('.og1-return-heading').waitFor();
  const off=p.getByRole('button',{name:'Turn narration off',exact:true});if(await off.count())await off.click();
  const metrics=await p.locator('.og1-return-heading').evaluate(el=>({background:getComputedStyle(el).backgroundImage,colors:['span','h2','p'].map(selector=>({selector,color:getComputedStyle(el.querySelector(selector)).color}))}));
  const stops=metrics.background.match(/rgb\([^)]+\)/g).map(rgb);
  for(const item of metrics.colors){item.minimumContrast=Math.min(...stops.map(bg=>contrast(rgb(item.color),bg)));if(phase==='after')assert.ok(item.minimumContrast>=4.5,item.selector+' has readable contrast');}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width);
  await p.screenshot({path:`${out}/${width}-return.png`,fullPage:true});results.push({width,...metrics});await p.close();
 }}finally{await browser.close()}
 fs.writeFileSync(out+'/contrast.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
