// Guard the modern media direction: chapter imagery must not silently collapse
// back into a small repeated art pool. No external requests are needed.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path=>readFileSync(new URL(path,import.meta.url),'utf8');
const witness=read('../src/features/classroom/JourneyDestinations.jsx');
const theme=read('../src/theme/jeremiahVisualSystem.css');
const lesson=read('../src/features/classroom/OG1LessonPlayer.jsx');
const sources=[witness,theme];
const all=[];
for(const [i,source] of sources.entries()){
 const matches=[...source.matchAll(i===0 ? /photo\((\d+),/g : /images\.pexels\.com\/photos\/(\d+)\//g)];
 const ids=matches.map(match=>match[1]);
 assert.equal(ids.length,new Set(ids).size, 'Repeated visual source in '+(i===0?'the biblical photo library':'the global theme'));
 all.push(...ids);
}
assert.ok(all.length>=19,'OG.1 and the classroom should have broad, purpose-led visual coverage');
assert.equal(all.length,new Set(all).size,'Classroom cards and lesson imagery must not reuse the same photo');
for(const [name,text] of [['biblical witnesses',witness],['global theme',theme]]){
 assert.doesNotMatch(text,/Rembrandt|Michelangelo|James_Tissot|Jan_Lievens|Moses_Pleading_with_Israel|upload\.wikimedia\.org/i, name+' must not use the legacy Renaissance art');
}
for(const variant of ['shema-encounter','moses-reading','prophets-reading','jesus-reading','apostles-reading','prophets-witness','moses-trail','jesus-trail','apostles-trail']){
 assert.ok(witness.includes("'"+variant+"'")||witness.includes(variant+':'),variant+' must have a distinct photo');
}
assert.match(lesson,/DestinationArt tone=\{readingArtTone\(current\.verse\.reference\)\+"-reading"\}/);
assert.match(lesson,/moses-trail/);
assert.match(lesson,/prophets-witness/);
console.log('Visual coverage passed: '+all.length+' unique photos, no recycled classical paintings, distinct OG.1 reading and trail scenes.');
