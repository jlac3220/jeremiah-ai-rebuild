// OG.1 visual preview installer. Run in the app directory after the matching
// images/og1 files have been placed in public/. Does NOT change a lesson or standard.
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const catalog=new URL('../src/data/curriculum/visualCatalog.js',import.meta.url);
const imageDir=new URL('../public/images/og1/',import.meta.url);
const scenes={
 shema:{file:'og1-moses-shema-PREVIEW.webp',ref:'Deuteronomy 6:4',alt:'Illustrative reconstruction of Moses addressing Israel in the wilderness as they hear the Shema',label:'SHEMA'},
 moses:{file:'og1-moses-shema-PREVIEW.webp',ref:'Deuteronomy 6:4',alt:'Illustrative reconstruction of Moses proclaiming the Shema to Israel',label:'SHEMA'},
 prophets:{file:'og1-isaiah-declaration-CANDIDATE.webp',ref:'Isaiah 44:6',alt:'Concept candidate for Isaiah proclaiming the LORD alone is God; historical likeness imagined',label:'ISAIAH'},
 jesus:{file:'og1-jesus-scribe-CANDIDATE.webp',ref:'Mark 12:29',alt:'Concept candidate for Jesus answering a scribe about the first commandment',label:'JESUS'},
 apostles:{file:'og1-paul-writing-CANDIDATE.webp',ref:'1 Corinthians 8:4',alt:'Concept candidate for Paul composing his letter to the Corinthian church',label:'PAUL'}
};
for(const scene of Object.values(scenes)){
 const file=new URL(scene.file,imageDir);
 if(!existsSync(file))throw Error('Missing image: '+file.pathname+'; no source changed');
}
let source=readFileSync(catalog,'utf8');
const replacements=[];
for(const [key,scene] of Object.entries(scenes)){
 const pattern=new RegExp('^ '+key+': illustrated\\(.*\\),?$','m');
 const newLine=' '+key+': illustrated('+
  JSON.stringify('/images/og1/'+scene.file)+','+
  JSON.stringify(scene.alt)+','+
  JSON.stringify('AI-generated visual candidate; editorial review pending')+','+
  JSON.stringify('')+','+
  JSON.stringify(scene.ref)+','+scene.label+'),';
 if(!pattern.test(source))throw Error('Unexpected catalog format in '+key+'; no source changed');
 replacements.push([pattern,newLine]);
}
for(const [pattern,line] of replacements)source=source.replace(pattern,line);
// These candidate scenes are NOT rights/quality/editorial cleared.
source=source.replace(/(media\\('(?:isaiah-proclaims|paul-teaches-church)'[^\\n]+)rightsStatus:'cleared'/g,
 '$1rightsStatus:\'needs-review\'');
source=source.replace('priority:10,rightsStatus:\'cleared\'}),','priority:10,rightsStatus:\'needs-review\'}),');
writeFileSync(catalog,source,'utf8');
console.log('OG.1 visual candidates installed in catalog; 5 placements, 4 distinct images.');
console.log('Editorial review remains required; do not release these crops as final artwork.');
