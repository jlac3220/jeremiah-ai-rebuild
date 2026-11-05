import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {navigateScene,sceneRevealCount} from '../src/core/classroom/og1SceneFlow.js';

const sample=[
 {kind:'read'},
 {kind:'shema-manuscript'},
 {kind:'shema-connection'},
 {kind:'discovery',discovery:{options:[['Moses'],['Isaiah'],['Jesus'],['Paul']]}},
 {kind:'doctrine-summary'}
];
assert.equal(sceneRevealCount({kind:'shema-echad'}),5);
assert.equal(sceneRevealCount({kind:'identity'}),3);
for(const [kind,count] of [['shema-echad',5],['identity',3]]){
 const route=[{kind},{kind:'task'}];
 for(let i=0;i<count-1;i++)assert.deepEqual(navigateScene(route,0,i,'next'),{moment:0,reveal:i+1,atEnd:false});
 assert.deepEqual(navigateScene(route,0,count-1,'next'),{moment:1,reveal:0,atEnd:false});
 assert.deepEqual(navigateScene(route,1,0,'back'),{moment:0,reveal:count-1,atEnd:false});
}
assert.equal(sceneRevealCount(sample[0]),1);
assert.equal(sceneRevealCount(sample[1]),3);
assert.equal(sceneRevealCount(sample[3]),4);
assert.deepEqual(navigateScene(sample,0,0,'next'),{moment:1,reveal:0,atEnd:false});
assert.deepEqual(navigateScene(sample,1,0,'next'),{moment:1,reveal:1,atEnd:false});
assert.deepEqual(navigateScene(sample,1,2,'next'),{moment:2,reveal:0,atEnd:false});
assert.deepEqual(navigateScene(sample,2,0,'next'),{moment:3,reveal:0,atEnd:false});
assert.deepEqual(navigateScene(sample,3,2,'next'),{moment:3,reveal:3,atEnd:false});
assert.deepEqual(navigateScene(sample,3,3,'next'),{moment:4,reveal:0,atEnd:false});
assert.deepEqual(navigateScene(sample,4,0,'next'),{moment:4,reveal:0,atEnd:true});
assert.deepEqual(navigateScene(sample,4,0,'back'),{moment:3,reveal:3,atEnd:false});
assert.deepEqual(navigateScene(sample,2,0,'back'),{moment:1,reveal:2,atEnd:false});
assert.deepEqual(navigateScene(sample,1,2,'back'),{moment:1,reveal:1,atEnd:false});
assert.deepEqual(navigateScene(sample,0,0,'back'),{moment:0,reveal:0,atEnd:false});

const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const shema=read('../src/features/classroom/ShemaExperience.jsx');
const player=read('../src/features/classroom/OG1LessonPlayer.jsx');
const witnesses=read('../src/features/classroom/JourneyDestinations.jsx');
assert.ok(shema.includes('shema-phrase-track'),'Three Scripture phrases are displayed as a progressive sequence');
assert.ok(shema.includes('shema-verse-bridge'),'Verse 5 is shown without a click-to-open control');
assert.ok(shema.includes('shema-echad-scene'),'Echad receives a full contextual teaching scene');
assert.ok(!shema.includes('Touch the words themselves'),'Do not instruct learners to click disabled words');
assert.ok(!shema.includes('shema-artifact-image'),'Artifact tangent removed from core Shema sequence');
assert.ok(!shema.includes('<details'),'Required teaching or assessment instructions are not hidden');
assert.ok(!player.includes('<details'),'Required assessment help is not hidden behind extra controls');
assert.ok(player.includes("navigateScene(moments,moment,evidenceIndex,'next')"));
assert.ok(player.includes("navigateScene(moments,moment,evidenceIndex,'back')"));
assert.ok(player.includes("[move.id,moment]"),'New scenes receive focus; in-scene exploration preserves control focus and reading position');
assert.ok(shema.includes('aria-live="polite"'),'Phrase reveals announce their updated teaching without moving focus');
assert.ok(!player.includes("moments.push({kind:'insight'"),'No redundant reading-only recaps');
assert.ok(witnesses.includes('ogj-guided-scene'),'Active witness has a single full scene');
assert.ok(witnesses.includes('ogj-guided-track'),'All witnesses are oriented visually without fake buttons');
assert.ok(player.includes('current?.kind===\'discovery\'&&move.id===\'learn\''),'Narration follows guided witness');
console.log('PASS OG.1 flow: progressive, reversible, no hidden lessons, purposeful Scripture scenes.');
