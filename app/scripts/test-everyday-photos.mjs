import assert from "node:assert/strict";
import { EVERYDAY_PHOTO_LIBRARY, chooseEverydayPhoto, EVERYDAY_PHOTO_CATEGORIES } from "../src/features/classroom/everydayPhotoLibrary.js";

const categories = ["worship", "conduct", "outreach", "opening"];
const photos = [];
for (const category of categories) {
 const entries = EVERYDAY_PHOTO_LIBRARY[category];
 assert.ok(entries.length >= 4, category + " needs enough images to feel varied");
 for (const entry of entries) {
  assert.match(entry.src, /^https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg/);
  assert.match(entry.source, /^https:\/\/www\.pexels\.com\/photo\/\d+\/$/);
  assert.ok(entry.alt.length > 20, "Image needs meaningful alternative text");
  assert.ok(entry.credit.includes("Pexels"), "Photo source should remain credited");
  assert.doesNotMatch(entry.alt, /computer|laptop|monitor|screen|desk|politic|protest|campaign/i);
  photos.push(entry.src);
 }
 assert.equal(chooseEverydayPhoto(category, 123).src, chooseEverydayPhoto(category, 123).src);
 assert.notEqual(chooseEverydayPhoto(category, 0).src, chooseEverydayPhoto(category, 1).src);
}
assert.deepEqual(EVERYDAY_PHOTO_CATEGORIES, ["worship","conduct","outreach"]);
assert.equal(new Set(photos).size, photos.length, "No repeated images across neighboring lesson categories");
console.log("PASS: 16 distinct, credited, curated, varied, screen-free everyday-life images.");
