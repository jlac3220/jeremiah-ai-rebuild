import assert from 'node:assert/strict';
import {randomUUID,createHmac} from 'node:crypto';
import {og1Only,og1Chapter} from '../server/pilotCapabilities.mjs';
import {handleAskJeremiah} from '../server/askJeremiahHandler.mjs';
import {handleVisualDiscovery} from '../server/visualDiscoveryHandler.mjs';
import {handleJeremiahApi} from '../server/apiHandler.mjs';
import {handleBibleApi} from '../server/bibleHandler.mjs';
import {issueSession} from '../server/pilotSecurity.mjs';
import {isStandalonePilot,pilotRoute} from '../src/features/pilot/standalonePilot.js';
import content from '../src/core/classroom/content/OG_1_LESSON.js';
import {parseBibleReference} from '../src/core/bible/bibleReaderIntent.js';
import {findBibleBook} from '../src/core/bible/bibleCatalog.js';
const env={...process.env},fetcher=globalThis.fetch;
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(s){this.body=s}});
try{
 process.env.PILOT_SESSION_SECRET='unit-test-only-standalone-signing-secret-32';delete process.env.VERCEL;delete process.env.PILOT_ACCESS_ENFORCED;
 assert.equal(isStandalonePilot('pilot.jeremiah.app'),true);assert.equal(isStandalonePilot('PILOT.JEREMIAH.APP.'),true);assert.equal(isStandalonePilot('jeremiah.app'),false);assert.equal(isStandalonePilot('creator.vercel.app'),false);
 for(const hash of ['','#home','#askJeremiah','#classroom','#progress','#profile','#bibleSupport','#study','#unknown','#login'])assert.equal(pilotRoute(hash),'pilot');
 const signed=response();issueSession(signed,'invite');const cookie=signed.headers['Set-Cookie'];
 const pilot={method:'POST',url:'/api/jeremiah/ask',headers:{host:'pilot.jeremiah.app'},body:{question:'One God?'}};
 const spoofed={...pilot,headers:{host:'creator.vercel.app','x-forwarded-host':'creator.vercel.app',cookie}};
 assert.equal(og1Only(spoofed),true,'Signed participant capability cannot be changed by Host/Origin');
 // PR #64 cookies have no capability field. Their invite scope is still OG.1.
 const value=Buffer.from(JSON.stringify({id:randomUUID(),scope:'invite',exp:Date.now()+10000})).toString('base64url'),sig=createHmac('sha256',process.env.PILOT_SESSION_SECRET).update(value).digest('base64url');
 assert.equal(og1Only({headers:{host:'creator.vercel.app',cookie:'jeremiah_pilot_session='+value+'.'+sig}}),true);
 let providerCalls=0;globalThis.fetch=async()=>{providerCalls++;throw new Error('Forbidden request reached provider')};
 for(const req of [pilot,spoofed])for(const handler of [handleAskJeremiah,handleVisualDiscovery]){const r=response();await handler(req,r);assert.equal(r.statusCode,403);}
 const wrongLesson=response();await handleJeremiahApi({...spoofed,body:{standardId:'NB.1.18',moveId:'learn'}},wrongLesson);assert.equal(wrongLesson.statusCode,403);assert.equal(providerCalls,0);
 const wrongBible=response();await handleBibleApi({...spoofed,method:'GET',url:'/api/bible/chapter?translation=kjv&book=Rev&chapter=22'},wrongBible);assert.equal(wrongBible.statusCode,403);assert.equal(providerCalls,0);
 for(const v of content.instructionalMoves.flatMap(m=>m.scripture||[])){const p=parseBibleReference(v.reference);assert.equal(og1Chapter(findBibleBook(p.book).osis,p.chapter,'kjv'),true,v.reference);}
 assert.equal(og1Chapter('Gen',2,'kjv'),true);assert.equal(og1Chapter('John',1,'asv'),false);
 globalThis.fetch=async()=>new Response('<span id="V4">4</span>Hear, O Israel: The LORD our God is one LORD:<span id="V5">5</span>And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.');
 const context=response();await handleBibleApi({...pilot,method:'GET',url:'/api/bible/chapter?translation=kjv&book=Deut&chapter=6'},context);assert.equal(context.statusCode,200);assert.match(context.body,/Hear, O Israel/);
 process.env.PILOT_DEPLOYMENT_SCOPE='og1';assert.equal(og1Only({headers:{host:'another-alias.vercel.app'}}),true,'Dedicated deployment scope covers alternate aliases');
 console.log('PASS standalone pilot: host/route isolation, signed legacy/new invite capabilities, spoofed-header resistance, forbidden APIs/standards, exact KJV context allowlist and creator-host preservation.');
}finally{globalThis.fetch=fetcher;for(const k of Object.keys(process.env))if(!(k in env))delete process.env[k];Object.assign(process.env,env)}
