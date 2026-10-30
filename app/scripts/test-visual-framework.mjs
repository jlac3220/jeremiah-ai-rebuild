import assert from 'node:assert/strict';
import {createVisualBrief,chooseLessonVisual,inferVisualPlacement} from '../src/core/classroom/visualIntelligence.js';
import {VISUAL_ASSETS} from '../src/data/curriculum/visualCatalog.js';
import {curriculumContentRegistry} from '../src/core/classroom/content/curriculumContent.js';

const og=curriculumContentRegistry['OG.1.1.18'];
const nb=curriculumContentRegistry['NB.1.1.18'];
assert.ok(og && nb,'Tests must cover original OG and NB standards');

const inspect=(content,placement,move={type:'teach',id:'show',title:'Teach the objective'})=>
 chooseLessonVisual(createVisualBrief({content,move,placement}),VISUAL_ASSETS);
const placement=(intent,more={})=>({intent,learningGoal:'Understand the exact learning objective',...more});

const shema=inspect(og,placement('historical',{subject:'Moses',reference:'Deuteronomy 6:4'}));
assert.equal(shema.asset?.id,'moses-addresses-israel');
assert.equal(shema.reviewRequired,true,'Rights must be reviewed before release');

const isaiah=inspect(og,placement('scripture',{reference:'Isaiah 44:6'}));
assert.equal(isaiah.asset?.id,'isaiah-proclaims');
const apostle=inspect(og,placement('historical',{subject:'Paul',reference:'1 Corinthians 8:4'}));
assert.equal(apostle.asset?.id,'paul-teaches-church');
const manuscript=inspect(og,placement('artifact',{reference:'Deuteronomy 6:4'}));
assert.equal(manuscript.asset?.id,'nash-papyrus');

const generic=inspect(nb,placement('general',{topic:'worship'}));
assert.equal(generic.asset?.id,'congregation-worship','General worship photo is valid for generic worship');
assert.notEqual(generic.asset?.id,shema.asset?.id,'Different purposes require different images');

const wrongScene=inspect(nb,placement('scripture',{reference:'Acts 2:38'}));
assert.equal(wrongScene.asset,null,'An unrelated OG illustration must not appear for NB');
assert.equal(wrongScene.status,'needs-art');
assert.equal(wrongScene.creationBrief.reference,'Acts 2:38');
assert.equal(inspect(og,placement('historical',{subject:'Moses',reference:'Isaiah 44:6'})).asset,null,'Subject and passage must agree');
assert.equal(inspect(nb,placement('general',{topic:'scripture'})).asset,null,'No keyword-driven image substitution');
assert.equal(inspect(og,placement('none')).status,'not-needed','Some teaching moments need no image');

const move={id:'show',type:'teach',title:'Investigate Acts 2:38',scripture:[{reference:'Acts 2:38'}]};
const inferred=inferVisualPlacement({content:{sourceStandard:{statement:'Explain Acts 2:38',scope:'Study Acts 2:38'}},move});
assert.equal(inferred?.reference,'Acts 2:38');
assert.equal(inferVisualPlacement({content:nb,move:{type:'teach',title:'A broad discussion',scripture:[{reference:'Acts 2:38'}]}}),null,
 'Do not infer an image merely because a passage is in an unrelated domain reference list');

const revised=JSON.parse(JSON.stringify(og));
revised.sourceStandard.statement+=' Revised learning objective.';
assert.notEqual(
 createVisualBrief({content:og,move,placement:placement('scripture',{reference:'Deuteronomy 6:4'})}).revision,
 createVisualBrief({content:revised,move,placement:placement('scripture',{reference:'Deuteronomy 6:4'})}).revision,
 'Changing a standard must invalidate its visual brief');

const reused=inspect(nb,placement('general',{topic:'worship'}),move);
assert.equal(reused.asset.id,generic.asset.id,'All studies use the same approved catalog and selector');
console.log('PASS: shared visual framework evaluates OG, NB, historical context, general life, artifacts, mismatches, missing assets, and revisions.');
