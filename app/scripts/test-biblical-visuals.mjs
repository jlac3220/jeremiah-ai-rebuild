import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get = path => readFileSync(new URL(path,import.meta.url),'utf8');
const gallery = get('../src/features/classroom/JourneyDestinations.jsx');
const lesson = get('../src/features/classroom/OG1LessonPlayer.jsx');
const shema = get('../src/features/classroom/ShemaExperience.jsx');

// Every biblical illustration slot must map to the named person or passage.
// Do not fill theological moments with random unrelated lifestyle/stock imagery.
assert.ok(gallery.includes("const GALLERY_ART = Object.freeze({"));
assert.ok(gallery.includes("export const BIBLICAL_ART = Object.freeze({"));
assert.doesNotMatch(gallery,/images\.pexels\.com|Wilderness dunes|desert terrain|Modern writing desk|Stone architecture of the biblical world/);
for(const [name,source] of Object.entries({
 'shema-encounter':'shema','moses-reading':'moses',
 'prophets-reading':'prophets','jesus-reading':'jesus','apostles-reading':'apostles',
 'moses-trail':'shema','jesus-trail':'jesus','apostles-trail':'apostles',
 'prophets-witness':'prophets'
})) {
 assert.ok(gallery.includes("'"+name+"':GALLERY_ART."+source),name+' must illustrate '+source);
}
assert.ok(shema.includes('BIBLICAL_ART.shema.src'),'Opening Shema image must depict Moses addressing Israel');
assert.doesNotMatch(shema,/chooseEverydayPhoto|openingPhoto|photoSeed/);
assert.ok(lesson.includes('<BiblicalApplicationArt index={evidenceIndex}/>'));
assert.ok(lesson.includes("type:'manuscript'"));
assert.ok(lesson.includes("Papyrus_Nash.jpg"));
assert.ok(lesson.includes("scene.type==='apostles'||failed"));
assert.ok(lesson.includes("index===2?'apostles':'shema'"));
assert.doesNotMatch(lesson,/Volunteers filling food|Volunteer packing|chooseEverydayPhoto|EverydayScenePhoto/);
assert.ok(lesson.includes('The one LORD is not one option'),'Keep approved lesson content unchanged');
console.log('PASS: OG.1 biblical witness pictures match subjects; Shema opening is biblical; OG.1.5 uses worship, original papyrus and Paul—not random volunteers, camels or city streets.');
