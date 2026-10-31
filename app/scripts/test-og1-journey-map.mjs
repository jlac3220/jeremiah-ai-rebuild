import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import content from '../src/core/classroom/content/OG_1_LESSON.js';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const journey=read('../src/features/classroom/OG1JourneyMap.jsx');
const player=read('../src/features/classroom/OG1LessonPlayer.jsx');
const destinations=read('../src/features/classroom/JourneyDestinations.jsx');
const narrator=read('../server/narrationHandler.mjs');
for(const phrase of ['Moses calls Israel to hear','The LORD declares that no other God','Jesus reaffirms the confession','Paul carries the confession']){
 assert.ok(destinations.includes(phrase),'Spoken witness lacks commentary: '+phrase);
 assert.ok(narrator.includes(phrase),'Speech endpoint must authorize narrated commentary: '+phrase);
 assert.ok(player.includes(phrase),'Automatic narrator must match the authored witness: '+phrase);
}

assert.equal((destinations.match(/commentary:'/g)||[]).length,4,'Every witness needs authored commentary');
assert.ok(destinations.includes('ogj-witness-commentary'),'Commentary displayed beneath Scripture and reference');
const css=read('../src/features/classroom/OG1JourneyMap.css');
const chapters=[
 ['shema','The Shema','DEUTERONOMY 6:4'],
 ['isaiah','Isaiah’s Witness','ISAIAH 43'],
 ['continuity','Jesus and the Apostles','MARK 12'],
 ['distinction','Understanding the Difference','JOHN 1'],
 ['devotion','Knowing Him. Loving Him.','DEUTERONOMY 6:4']
];
assert.equal(content.lessonChapters.length,5,'Roadmap must remain aligned with five OG.1 standards');
assert.ok(content.instructionalMoves.some(m=>m.id==='learn'));
for(const [id,title,ref] of chapters){
 assert.ok(journey.includes("id:'"+id+"'"),'Missing chapter '+id);
 assert.ok(journey.includes("title:'"+title+"'"),'Missing chapter title '+title);
 assert.ok(journey.includes(ref),'Missing source reference '+ref);
}
assert.ok(journey.includes("activeChapter>=6"),'Exam is a distinct final destination');
assert.ok(journey.includes("position<activeChapter?'COVERED'"),'Do not equate past chapters with mastery');
assert.ok(journey.includes("This is a focused investigation"),'Doctrinal comparison must not become narrative bridge');
assert.ok(journey.includes("Return to the Shema"),'Devotion must return to the Shema');
assert.ok(!player.includes("if(move.id==='learn')moments.push({kind:'roadmap'"),'Journey should be a notice, not a slide');
const encounter=player.indexOf("if(move.scripture?.length)moments.push({kind:'read'");
const roadmap=player.indexOf('const discovery=DISCOVERIES[move.id]');
const discovery=player.indexOf("const discovery=DISCOVERIES[move.id]");
assert.ok(encounter>0&&encounter<discovery,'Intro → witness sequence');
assert.ok(player.includes('ogp-journey-notice'),'Compact journey notice renders');
assert.ok(player.includes("!['identity','return','mission','roadmap'].includes(current.kind)"),'Avoid duplicate headings');
assert.ok(!player.includes('aria-controls="og1-journey-recap"'),'No optional journey toggle is required');
for(const x of ['aria-current','UP NEXT','10-question exit exam']){
 assert.ok(journey.includes(x),'Map missing accessible signpost '+x);
}
assert.ok(player.includes('role="status" className="ogp-journey-notice"'),'Journey updates automatically');
assert.ok(!player.includes('<OG1JourneyLocation'),'Large journey card should be removed');
assert.ok(journey.includes('og1-journey--minimal'),'Compact chapter map must render');
assert.ok(journey.includes('og1-journey-minimal-list'),'Five-stop list required');
assert.ok(!journey.includes('item.summary}'),'Avoid paragraphs inside chapter list');
assert.ok(css.includes('.og1-journey-minimal-item'),'Compact spacing required');
assert.ok(css.includes('@media(max-width:680px)'), 'Mobile roadmap required');
assert.ok(css.includes('prefers-reduced-motion'), 'Reduced motion required');
console.log('PASS OG.1 journey: intro-first roadmap, all chapters, context-aware current/next, exit exam and responsive layout.');
