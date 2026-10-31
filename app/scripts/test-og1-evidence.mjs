import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {OG1_EVIDENCE,OG1_EVIDENCE_BY_ID,OG1_EVIDENCE_DEFAULT} from '../src/data/curriculum/og1Evidence.js';

assert.equal(OG1_EVIDENCE.length,5);
assert.equal(new Set(OG1_EVIDENCE.map(item=>item.id)).size,5);
for(const art of OG1_EVIDENCE){
 for(const field of ['id','chapter','title','era','institution','shelfmark','reference',
   'language','passage','image','imageAlt','imageNote','source','imageSource','rights']){
  assert.ok(typeof art[field]==='string' && art[field].trim(),art.id+' missing '+field);
 }
 assert.equal(OG1_EVIDENCE_BY_ID[art.id],art);
 assert.ok(art.source.startsWith('https://'));
 assert.ok(art.imageSource.startsWith('https://commons.wikimedia.org/wiki/File:'));
 assert.ok(art.image.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
}
for(const chapter of ['learn','shema','isaiah','continuity','distinction','devotion'])
 assert.ok(OG1_EVIDENCE_BY_ID[OG1_EVIDENCE_DEFAULT[chapter]],chapter+' has no evidence');
assert.match(OG1_EVIDENCE_BY_ID.nash.passage,/one LORD/);
assert.match(OG1_EVIDENCE_BY_ID.isaiah.passage,/beside me there is no God/);
assert.match(OG1_EVIDENCE_BY_ID.sinaiticus.passage,/Hear, O Israel/);
assert.match(OG1_EVIDENCE_BY_ID.p46.passage,/none other God but one/);
assert.match(OG1_EVIDENCE_BY_ID.p75.passage,/the Word was God/);
assert.match(OG1_EVIDENCE_BY_ID.p46.imageNote,/NOT 1 Corinthians 8:4/);
assert.match(OG1_EVIDENCE_BY_ID.isaiah.imageNote,/not a pinpointed image/);
assert.match(OG1_EVIDENCE_BY_ID.sinaiticus.imageNote,/not a close-up/);
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const lesson=read('../src/features/classroom/OG1LessonPlayer.jsx');
assert.ok(!lesson.includes('<OG1ManuscriptImage'),'No duplicated artifact below the main Scripture scene');
assert.ok(!lesson.includes('not Isaiah’s original writing'),'No interruption of Isaiah Scripture testimony');
assert.ok(lesson.includes('tone="isaiah-manuscript"'),'One primary manuscript visual remains in Isaiah testimony');
console.log('PASS OG.1: genuine original scene art, without repeated artifact card or unnecessary disclaimer.');
