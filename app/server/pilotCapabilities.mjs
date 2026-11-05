import {session,ownerAuthorized} from './pilotSecurity.mjs';
import content from '../src/core/classroom/content/OG_1_LESSON.js';
import {parseBibleReference} from '../src/core/bible/bibleReaderIntent.js';
import {findBibleBook} from '../src/core/bible/bibleCatalog.js';
export const OG1_STANDARD='OG.1.LESSON.18';
export function pilotHostname(req){return String(req.headers?.host||'').trim().toLowerCase().split(':')[0].replace(/\.$/,'')==='pilot.jeremiah.app';}
export function og1Only(req){
 // Participant capability is independent of Host/Origin/forwarded headers.
 // Legacy PR #64 invite cookies are also lesson-scoped, without a migration.
 if(session(req)?.scope==='invite')return true;
 if(pilotHostname(req))return true;
 return process.env.PILOT_DEPLOYMENT_SCOPE==='og1'&&!ownerAuthorized(req)&&session(req)?.scope!=='verify';
}
const chapters=new Set(content.instructionalMoves.flatMap(m=>m.scripture||[]).map(v=>v.reference).concat(['Genesis 2:24']).map(ref=>{const p=parseBibleReference(ref),book=p&&findBibleBook(p.book);return book?book.osis+':'+p.chapter:''}));
export function og1Chapter(book,chapter,translation){return translation==='kjv'&&chapters.has(book+':'+chapter);}
