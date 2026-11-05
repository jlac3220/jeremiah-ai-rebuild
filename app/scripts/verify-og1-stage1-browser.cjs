// Run against `npm run build && PORT=4182 npm start` with Playwright and Chromium
// available in the audit environment. No production URLs or learner data used.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4182';
const key='jeremiah-learning-state:OG.1.LESSON.18:direct';

(async()=>{
 const {default:content}=await import('../src/core/classroom/content/OG_1_LESSON.js');
 const {createLearningState}=await import('../src/core/classroom/learningEngine.js');
 const {getOG1LessonLocation}=await import('../src/core/classroom/og1LessonLocation.js');
 const {OG1_EXIT_QUESTIONS,OG1_EXIT_EXAM_VERSION,gradeOG1ExitExam}=await import('../src/data/curriculum/og1ExitExam.js');
 const answers=Object.fromEntries(OG1_EXIT_QUESTIONS.map(q=>[q.id,q.answerId]));
 const exam={version:OG1_EXIT_EXAM_VERSION,answers,latest:{...gradeOG1ExitExam(answers),completedAt:1},attempts:[{score:100,at:1}],bestScore:100,passed:true};
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 // Deterministic unavailable-service states; no paid voice or remote Bible calls.
 await page.route('**/api/jeremiah/narration?**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"Unavailable in browser test"}'}));
 await page.route('**/api/bible/chapter?**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"Unavailable in browser test"}'}));
 await page.goto(base+'/#pilot');
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Start the lesson'}).click();
 async function seed(id,{withExam=false,history=[]}={}){
  const state={...createLearningState(content,'direct'),currentMoveId:id,teacherHistory:history};
  if(withExam)state.experience.exitExam=exam;
  await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key,state});
  await page.reload();
  await page.locator('.ogp-toolbar').waitFor();
  return state;
 }
 async function quiet(){const button=page.getByRole('button',{name:'Turn narration off',exact:true});if(await button.count())await button.click()}
 const headings=[];
 for(const move of content.instructionalMoves){
  await seed(move.id);await quiet();
  const expected=getOG1LessonLocation(content,move);
  const title=await page.locator('.ogp-compact-heading h1').textContent();
  if(expected.chapterNumber)assert.ok(title.startsWith(`Chapter ${expected.chapterNumber} ·`),move.id);
  else assert.equal(title,expected.title,move.id);
  assert.equal(await page.locator('.ogp-mini-caption strong').textContent(),'Up next: '+expected.next);
  assert.doesNotMatch(title,/mastery|Journey complete/i);
  const size=await page.evaluate(()=>[innerWidth,document.documentElement.scrollWidth]);
  assert.equal(size[0],size[1],move.id+' has no horizontal overflow');
  headings.push({move:move.id,title,next:expected.next});
 }
 console.log('PASS all authored chapter/next labels:',JSON.stringify(headings));

 // Audio Off clears stale errors and leaves a complete, usable text experience.
 await seed('shema-show');
 await page.locator('.ogp-voice-error').waitFor();
 await quiet();
 assert.equal(await page.locator('.ogp-voice-error').count(),0);
 const back=await page.getByRole('button',{name:'Return to classroom'}).boundingBox();
 assert.ok(back.width>=44&&back.height>=44,'Back has a 44px target');
 const toolbar=await page.locator('.ogp-toolbar').boundingBox();
 assert.ok(toolbar.height<=76,'Quiet single-row mobile header');
 // The optional video is not fetched until requested; blocked players have an exit.
 for(let i=0;i<4;i++)await page.locator('nav.ogp-controls button.ogp-action').click();
 assert.equal(await page.locator('.shema-cinema-frame iframe').count(),0);
 await page.route('**/*youtube*',route=>route.abort());
 await page.getByRole('button',{name:'Load optional video'}).click();
 await page.getByRole('button',{name:'Continue without video'}).click();
 assert.equal(await page.locator('.shema-cinema-frame iframe').count(),0);
 await page.getByText('The video is unavailable here.',{exact:false}).waitFor();
 await page.locator('nav.ogp-controls button.ogp-action').click();
 assert.equal(await page.locator('.shema-verse-bridge').count(),1);

 // A missing image never changes the active passage label or its Scripture.
 await page.route('**/images/**',route=>route.abort());
 await seed('isaiah-show');await quiet();
 await page.locator('nav.ogp-controls button.ogp-action').click();
 for(const reference of ['Isaiah 43:10','Isaiah 44:6','Isaiah 43:10']){
  assert.equal(await page.locator('.ogp-witness-art .ogj-fallback').textContent(),reference);
  assert.equal(await page.locator('.ogp-witness-copy > strong').textContent(),reference.toUpperCase()+' · KJV');
  await page.locator('nav.ogp-controls button.ogp-action').click();
 }
 await page.unroute('**/images/**');

 // Native dialog traps both Tab directions and returns focus without losing work.
 const saved=await seed('shema-recite',{withExam:true,history:[{moveId:'shema-recite',verdict:'strong',source:'lesson'}]});await quiet();
 async function openRestart(){await page.getByRole('button',{name:'Lesson options',exact:true}).click();await page.getByRole('button',{name:'Start over',exact:true}).click()}
 await openRestart();
 assert.equal(await page.getByRole('button',{name:'Keep my place'}).evaluate(el=>el===document.activeElement),true);
 await page.keyboard.press('Shift+Tab');
 assert.equal(await page.getByRole('button',{name:'Start from beginning',exact:false}).evaluate(el=>el===document.activeElement),true);
 await page.keyboard.press('Tab');
 assert.equal(await page.getByRole('button',{name:'Keep my place'}).evaluate(el=>el===document.activeElement),true);
 await page.keyboard.press('Escape');
 assert.equal(await page.getByRole('dialog').count(),0);
 assert.equal(await page.getByRole('button',{name:'Lesson options',exact:true}).evaluate(el=>el===document.activeElement),true);
 let persisted=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 assert.deepEqual(persisted.experience.exitExam,exam);
 assert.deepEqual(persisted.teacherHistory,saved.teacherHistory);
 await openRestart();await page.getByRole('button',{name:'Keep my place'}).click();
 assert.equal(await page.getByRole('dialog').count(),0);
 await openRestart();await page.getByRole('button',{name:'Start from beginning',exact:false}).click();
 await page.locator('.ogp-encounter').waitFor();
 const archived=await page.evaluate(()=>JSON.parse(localStorage.getItem('jeremiah-learning-state:OG.1.LESSON.18:review')).experience.earlierLesson);
 assert.deepEqual(archived.exitExam,exam);
 assert.deepEqual(archived.teacherHistory,saved.teacherHistory);

 // Return through the pilot to select the direct preset after the review run.
 await page.goto(base+'/#pilot');await page.getByRole('checkbox').check();await page.getByRole('button',{name:/Continue my lesson|Revisit the lesson|Start the lesson/}).click();
 await seed('complete');await quiet();
 assert.equal(await page.locator('.ogp-compact-heading h1').textContent(),'Exit exam · in progress');
 for(let i=0;i<OG1_EXIT_QUESTIONS.length;i++){
  const question=OG1_EXIT_QUESTIONS[i];
  const choice=question.choices.find(item=>item.id===question.answerId);
  await page.getByRole('button',{name:choice.label,exact:false}).click();
  await page.getByRole('button',{name:i===9?'Submit exit exam':'Next question',exact:false}).click();
 }
 assert.equal(await page.locator('.ogp-compact-heading h1').textContent(),'Exit exam results');
 persisted=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 assert.deepEqual(persisted.experience.exitExam.answers,answers);
 assert.equal(persisted.experience.exitExam.latest.score,100);
 await page.reload();await quiet();
 assert.equal(await page.locator('.ogp-compact-heading h1').textContent(),'Exit exam results');
 const report=page.getByRole('button',{name:'View my learning-level report'});
 assert.equal(await report.count(),1);
 assert.equal(await report.evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('.og1-exam-review'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
 assert.equal(await page.locator('.og1-exam-review article').count(),10,'Every explanation preserved');
 await page.getByRole('button',{name:'Review all 10 answers'}).click();
 assert.equal(await page.locator('.og1-exam-review-title').evaluate(el=>el===document.activeElement),true);
 await report.click();
 assert.equal(await page.locator('.ogp-compact-heading h1').textContent(),'Your Understanding');
 await page.getByRole('button',{name:'Continue to final summary'}).click();
 assert.equal(await page.locator('.ogp-compact-heading h1').textContent(),'Final lesson summary');
 const color=await page.locator('.og1-synthesis-head p').evaluate(el=>getComputedStyle(el).color);
 function luminance(rgb){return rgb.map(value=>{const n=value/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4}).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0)}
 const fg=luminance(color.match(/\d+/g).map(Number));
 const ratios=[[23,43,73],[50,63,119]].map(bg=>(fg+.05)/(luminance(bg)+.05));
 assert.ok(ratios.every(r=>r>=4.5),'Summary prose meets AA on both gradient endpoints');
 console.log('Summary computed color and endpoint contrast:',color,ratios);
 await page.getByRole('button',{name:'Evaluate the experience'}).click();
 assert.equal(await page.locator('.ogp-compact-heading h1').textContent(),'Pilot feedback · optional');

 // Restart is also available from the optional end survey.
 await openRestart();await page.getByRole('button',{name:'Start from beginning',exact:false}).click();
 await page.locator('.ogp-encounter').waitFor();
 await page.goto(base+'/#pilot');await page.getByRole('checkbox').check();await page.getByRole('button',{name:/Continue my lesson|Revisit the lesson|Start the lesson/}).click();

 // Recitation remains independent. No sticky action overlays input at short heights.
 await seed('shema-recite');await quiet();
 assert.equal(await page.getByRole('textbox').inputValue(),'');
 assert.equal(await page.getByText('Hear, O Israel:',{exact:false}).count(),0);
 await page.setViewportSize({width:320,height:440});
 await page.getByRole('textbox').fill('Independent test response');
 const positioning=await page.locator('nav.ogp-controls').evaluate(el=>getComputedStyle(el).position);
 assert.ok(!['fixed','sticky'].includes(positioning));
 await page.emulateMedia({reducedMotion:'reduce'});
 await seed('shema-show');await quiet();await page.locator('nav.ogp-controls button.ogp-action').click();
 assert.equal(await page.locator('.shema-phrase-feature').evaluate(el=>getComputedStyle(el).animationName),'none');
 assert.deepEqual(errors,[]);
 console.log('PASS Stage 1 browser: labels, Off, video/image failures, keyboard dialog, archived exam/history, results/report/survey, contrast, short viewport, reduced motion.');
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
