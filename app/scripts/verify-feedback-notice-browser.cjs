const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const phase=process.argv[2]||'after',out=path.resolve(__dirname,'../../docs/feedback-notice-evidence',phase);
(async()=>{
 const {default:content}=await import('../src/core/classroom/content/OG_1_LESSON.js');
 const {createLearningState}=await import('../src/core/classroom/learningEngine.js');
 const {OG1_EXIT_QUESTIONS,OG1_EXIT_EXAM_VERSION,gradeOG1ExitExam}=await import('../src/data/curriculum/og1ExitExam.js');
 const answers=Object.fromEntries(OG1_EXIT_QUESTIONS.map(q=>[q.id,q.answerId]));
 const exam={version:OG1_EXIT_EXAM_VERSION,answers,latest:{...gradeOG1ExitExam(answers),completedAt:1},attempts:[{score:100,at:1}],bestScore:100,passed:true};
 const key='jeremiah-learning-state:OG.1.LESSON.18:direct';
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});fs.mkdirSync(out,{recursive:true});
 try{for(const width of [390,1440]){
  const p=await b.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
  await p.route('**/api/**',r=>r.fulfill({status:503,contentType:'application/json',body:'{}'}));
  await p.goto((process.env.JEREMIAH_REVIEW_URL||'http://127.0.0.1:4184')+'/#pilot');await p.getByRole('checkbox').check();await p.getByRole('button',{name:'Start the lesson'}).click();
  const state={...createLearningState(content,'direct'),currentMoveId:'complete'};state.experience.exitExam=exam;
  await p.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key,state});await p.reload();
  const off=p.getByRole('button',{name:'Turn narration off',exact:true});if(await off.count())await off.click();
  await p.getByRole('button',{name:'View my learning-level report'}).click();await p.getByRole('button',{name:'Continue to final summary'}).click();
  if(phase==='after'){
   await p.evaluate(()=>scrollTo(0,0));
   const floating=p.getByRole('button',{name:'Feedback · optional',exact:true});await floating.waitFor();
   const box=await floating.boundingBox();assert.ok(box.height>=44&&box.y>=0&&box.y+box.height<=(width===390?844:1000));
   await p.screenshot({path:`${out}/${width}-floating-top.png`});
  }
  const notice=p.locator('.ogp-finish-survey-invite');await notice.scrollIntoViewIfNeeded();await p.screenshot({path:`${out}/${width}-feedback.png`});await notice.screenshot({path:`${out}/${width}-feedback-detail.png`});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),width);
  if(phase==='after'){
   await p.getByRole('region',{name:'Help shape the next Jeremiah lesson.'}).waitFor();
   assert.match(await notice.innerText(),/optional, anonymous, and separate from your answers/);
   for(const button of await notice.getByRole('button').all())assert.ok((await button.boundingBox()).height>=44);
   const readSaved=()=>p.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key));return {exam:s.experience.exitExam,history:s.teacherHistory,attempts:s.attemptsByMove,evidence:s.evidenceIds,mastery:s.milestones.mastery};},key);
   const saved=await readSaved();
   await p.getByRole('button',{name:'Understanding report'}).click();await p.getByRole('button',{name:'Continue to final summary'}).click();
   await p.getByRole('button',{name:'Finish without survey',exact:true}).click();
   assert.equal(await notice.count(),0);assert.deepEqual(await readSaved(),saved);
   await p.getByRole('checkbox').check();await p.getByRole('button',{name:/Continue my lesson|Revisit the lesson|Start the lesson/}).click();
   await p.getByRole('button',{name:'View my learning-level report'}).click();await p.getByRole('button',{name:'Continue to final summary'}).click();
   await p.evaluate(()=>scrollTo(0,0));
   await p.getByRole('button',{name:'Feedback · optional',exact:true}).click();assert.equal(await p.locator('.ogp-floating-feedback').count(),0);assert.equal(await p.locator('.ogp-compact-heading h1').innerText(),'Pilot feedback · optional');
   assert.deepEqual(await readSaved(),saved);
  }
  await p.close();
 }}finally{await b.close()}
 console.log('PASS feedback notice '+phase+': real phone/desktop captures, no overflow'+(phase==='after'?'; labelled notice, 44px controls, optional survey/report navigation and saved exam unchanged.':'.'));
})().catch(e=>{console.error(e);process.exit(1)});
