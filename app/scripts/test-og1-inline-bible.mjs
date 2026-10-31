import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseBibleReference} from '../src/core/bible/bibleReaderIntent.js';
import {findBibleBook} from '../src/core/bible/bibleCatalog.js';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const player=read('../src/features/classroom/OG1LessonPlayer.jsx');
const inline=read('../src/features/classroom/OG1InlineBible.jsx');
const css=read('../src/features/classroom/OG1InlineBible.css');
for(const ref of ['Deuteronomy 6:4-5','Isaiah 44:6','Mark 12:29','1 Corinthians 8:4-6','John 1:1, 14','Matthew 28:19 · Acts 2:38']){
 const parsed=parseBibleReference(ref);
 assert.ok(parsed?.book&&parsed?.chapter,ref+' must parse');
 assert.equal(findBibleBook(parsed.book).name,parsed.book,ref+' must recognize the book');
}
assert.ok(player.includes('setInlineBibleReference(reference)'), 'Links must open the in-lesson Bible');
assert.ok(!player.includes('setBibleReaderIntent('), 'No page-changing reader intent');
assert.ok(!player.includes('onNavigate(ROUTES.BIBLE_SUPPORT)'), 'No page-changing Bible route');
assert.ok(player.includes('<OG1InlineBible reference={inlineBibleReference}'),'Inline panel included');
for(const term of ["loadBibleChapter('kjv'",'getChapterVerses(data)','parseBibleReference(reference','role="dialog"','aria-modal="true"','onClose','Return to lesson','is-highlighted','Previous chapter','Next chapter']){
 assert.ok(inline.includes(term),'Missing KJV reader feature: '+term);
}
assert.ok(css.includes('@media(max-width:650px)'), 'Mobile reader required');
assert.ok(css.includes('.og1-bible-scripture{flex:1;overflow-y:auto'), 'Chapter scrolling must not move classroom');
console.log('PASS OG.1 inline KJV: valid source references, context modal, no route change, chapter navigation and responsive reader.');
