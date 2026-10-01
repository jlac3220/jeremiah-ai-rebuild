import assert from 'node:assert/strict';
import { parseVerses, handleBibleApi } from '../server/bibleHandler.mjs';

const html = `<head><title>Genesis 1</title></head><ul class='tnav'><li>Genesis 1</li></ul>
<div class='p'><span class='verse' id='V1'>1&#160;</span>In the beginning.
<a href='#FN1' class='notemark'>*<span class='popup'>Commentary</span></a></div>
<div class='p'>The verse continues.</div><div class='s1'>Section heading</div>
<div class='p'><span class='verse' id='V2'>2&#160;</span>Next verse.</div>
<ul class='tnav'><li>Genesis</li></ul><hr><p class='f' id='FN1'>Footnote</p>`;
assert.deepEqual(parseVerses(html), [
  { verse: 1, text: 'In the beginning. The verse continues.' },
  { verse: 2, text: 'Next verse.' },
]);
assert.deepEqual(parseVerses(`<span id='V1'>1</span>Only verse.<div class='copyright'>Public domain</div>`),
  [{ verse: 1, text: 'Only verse.' }]);
assert.deepEqual(parseVerses('<p>1 Navigation 2 Download</p>'), []);

const originalFetch = globalThis.fetch;
globalThis.fetch = async () => { throw new Error('Invalid requests must not fetch upstream'); };
try {
  for (const query of ['book=Gen&chapter=51', 'book=Jude&chapter=2', 'book=Unknown&chapter=1', 'translation=constructor&book=Gen&chapter=1']) {
    const res = { statusCode: 0, setHeader() {}, end(value) { this.payload = JSON.parse(value); } };
    await handleBibleApi({ url: '/?' + query, headers: {} }, res);
    assert.equal(res.statusCode, 400, query);
  }
} finally { globalThis.fetch = originalFetch; }
console.log('Bible parser and chapter validation passed');
