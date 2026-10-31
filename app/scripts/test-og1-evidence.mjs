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
const viewer=read('../src/features/classroom/OG1EvidenceExperience.jsx');
const css=read('../src/features/classroom/OG1EvidenceExperience.css');
const inline=read('../src/features/classroom/OG1ManuscriptMoment.jsx');
const inlineCss=read('../src/features/classroom/OG1ManuscriptMoment.css');
assert.ok(lesson.includes('<OG1ManuscriptMoment'),'Manuscripts must appear inside teaching');
for(const [id,placement] of [['nash',"current.kind==='shema-manuscript'"],['isaiah',"current.kind==='witness'"],['sinaiticus',"evidenceIndex===1"],['p46',"'p46'"],['p75',"current.kind==='identity'"]]){
 assert.ok(lesson.includes(placement),id+' lacks contextual teaching placement');
 assert.ok(OG1_EVIDENCE_BY_ID[id],id+' missing from Explore');
}
assert.ok(inline.includes('OG1_EVIDENCE_BY_ID[artifactId]'),'Inline evidence must use same curated artifact');
assert.ok(inline.includes('item.imageNote'),'Photo limitations must be visible inline');
assert.ok(inline.includes('onExplore?.(item.id)'),'Explore must open exact manuscript');
assert.ok(lesson.includes('selectedArtifactId={artifactSelection}'),'Viewer selection must follow contextual teaching');
assert.ok(viewer.includes('selectedArtifactId||OG1_EVIDENCE_DEFAULT'),'Viewer must support lesson selection');
assert.ok(inlineCss.includes('@media(max-width:690px)'),'Inline manuscript must fit mobile');
assert.ok(lesson.includes('Examine the historical manuscripts') && lesson.includes('<OG1EvidenceExperience'),'Historic artifacts remain accessible as an optional supporting resource');
for(const fragment of ['role="dialog"','aria-modal="true"','Zoom in','Zoom out',
  'Return to the lesson','Read the passage in Jeremiah','imageFailed','onError',
  'selected.imageNote','selected.imageSource','selected.source']){
 assert.ok(viewer.includes(fragment),'Viewer missing '+fragment);
}
assert.ok(css.includes('@media(max-width:800px)'),'Mobile treatment required');
console.log('PASS OG.1 evidence: five real source entries, chapter coverage, no misattributed folios, zoom, KJV and mobile UI integration.');
