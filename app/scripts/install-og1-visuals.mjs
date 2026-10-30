/**
 * OG.1 fixed visual installer.
 * Add the four named WebP assets under app/public/images/og1 first.
 * Then run: node app/scripts/install-og1-visuals.mjs
 * Does not alter instructional moves, standards, or Scripture.
 */
import {existsSync,readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const at=path=>join(root,path);
const slots={
 shema:['og1-moses-shema.webp','Deuteronomy 6:4','Moses addresses Israel as they hear the Shema','SHEMA','50% 38%'],
 moses:['og1-moses-shema.webp','Deuteronomy 6:4','Moses delivers the confession to Israel in the wilderness','SHEMA','50% 38%'],
 prophets:['og1-isaiah-declaration.webp','Isaiah 44:6','A prophet explains the one LORD to craftsmen among carved idols','ISAIAH','50% 35%'],
 jesus:['og1-jesus-scribe.webp','Mark 12:29','Jesus answers a scribe about the greatest commandment','JESUS','50% 38%'],
 apostles:['og1-paul-writing.webp','1 Corinthians 8:4','Paul composes his message to the Corinthians','PAUL','50% 40%']
};
for(const [file] of Object.values(slots)){
 if(!existsSync(at('public/images/og1/'+file)))throw Error('Missing image: '+file+'; no source changes made.');
}
const path='src/data/curriculum/visualCatalog.js';
const original=readFileSync(at(path),'utf8');
let next=original;
for(const [key,[file,reference,alt,quote,focal]] of Object.entries(slots)){
 const pattern=new RegExp('^ '+key+': illustrated\\([^\\n]+\\),?$','m');
 if(!pattern.test(next))throw Error('OG.1 gallery slot not found: '+key+'; no source changes made.');
 const line=' '+key+': illustrated('+[
  JSON.stringify('/images/og1/'+file),JSON.stringify(alt),
  JSON.stringify('Jeremiah image library'),JSON.stringify(''),
  JSON.stringify(reference),quote,JSON.stringify(focal)
 ].join(',')+'),';
 next=next.replace(pattern,line);
}
if(next!==original){
 const backup=at('og1-image-backup/'+path);
 mkdirSync(dirname(backup),{recursive:true});
 if(!existsSync(backup))copyFileSync(at(path),backup);
 writeFileSync(at(path),next,'utf8');
}
console.log('OG.1: 5 placement bindings; 4 fixed local scene images. Lesson text unchanged.');
