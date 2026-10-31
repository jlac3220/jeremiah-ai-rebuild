import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=relative=>readFileSync(new URL(relative,import.meta.url),'utf8');

const evidence=read('../src/features/classroom/OG1EvidenceExperience.css');
const doctrine=read('../src/features/classroom/OG1StoryClimax.css');
const shared=read('../src/features/classroom/OG1ThemeConsistency.css');
const lesson=read('../src/features/classroom/OG1LessonPlayer.css');
const player=read('../src/features/classroom/OG1LessonPlayer.jsx');

for(const [name,css] of [['evidence',evidence],['doctrine',doctrine],['shared',shared]]){
 for(const stale of ['#214657','#1e4854','#234e58','#315764','#194455']){
  assert.ok(!css.includes(stale),name+' still contains green/teal tone '+stale);
 }
}
assert.match(evidence,/\.oge-top\{[^}]+#172b48,#344a83/, 'Artifact viewer uses blue-indigo header');
assert.match(evidence,/\.oge-tabs button\.is-active\{[^}]+#4357c6/, 'Artifacts use indigo active state');
assert.match(evidence,/\.oge-scripture\{[^}]+#6878df/, 'Manuscript Scripture border matches classroom');
assert.match(evidence,/\.oge-launch\{[^}]+#eff2ff/, 'Explore launcher matches classroom');
assert.match(doctrine,/\.og1-identity-hero\{[^}]+#172a46,#303f76/, 'Doctrine hero not teal');
assert.match(doctrine,/\.og1-synthesis-head\{[^}]+#172b49,#313f73/, 'Cumulative synthesis not teal');
assert.match(doctrine,/\.og1-return-heading\{[^}]+#172b49,#364580/, 'Devotion bridge not green');
assert.match(shared,/\.oge-top\{[^}]+#172b49,#323f77/, 'Shared override cannot reintroduce teal');
assert.match(shared,/\.ogp-page \.og1-identity-hero,[^\n]*#172b49,#323f77/, 'Cross-module override matches inquiry');
assert.match(lesson,/\.ogp-mission-graphic\{[^}]+#465b91,#192743/, 'Missing-art fallback remains navy/indigo');
assert.ok(player.includes("import './OG1ThemeConsistency.css'"), 'Consistent theme remains included');
assert.ok(player.includes('OG1IdentityInvestigation') && player.includes('tone="isaiah-manuscript"'),'Doctrine and built-in manuscript scene remain connected');
const gallery=read('../src/features/classroom/JourneyDestinations.css');
assert.match(lesson, /@media\(max-width:600px\)/, 'OG.1 includes phone-specific layout');
assert.ok(lesson.includes('env(safe-area-inset-bottom)'), 'Phone layout respects home indicator');
assert.ok(lesson.includes('.ogp-start-over'), 'Restart stays visible on phone');
assert.ok(lesson.includes('min-height:48px'), 'Primary actions have touch-sized targets');
assert.match(gallery, /@media\(max-width:600px\)/, 'Witness gallery supports phone widths');
console.log('PASS OG.1 theme: Explore, doctrine, synthesis and fallback use the navy-indigo design language.');
