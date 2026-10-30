import assert from 'node:assert/strict';
import {allAskStandards,selectAskStandards,answerAskJeremiah} from '../server/askJeremiahCore.mjs';
const standards=allAskStandards();
assert.ok(standards.some(s=>s.id.startsWith('OG.')),'Use approved OG standards');
assert.ok(standards.some(s=>s.id.startsWith('NB.')),'Use approved NB standards');
assert.ok(standards.every(s=>['OG','NB'].includes(s.studyId)),'No other curricula enabled');
assert.ok(selectAskStandards('What does Deuteronomy 6:4 teach about the one God?').some(s=>s.studyId==='OG'));
assert.ok(selectAskStandards('What do the standards teach about repentance?').some(s=>s.studyId==='NB'));
assert.deepEqual(selectAskStandards('Who won the World Series?'),[],'Sports are not in curriculum');
assert.deepEqual(selectAskStandards('How do I bake sourdough bread?'),[],'Recipes are out of scope');

let calls=0;
const fakeResponse=json=>({ok:true,json:async()=>({
 output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(json)}]}]
})});
const fetcher=async(_url,options)=>{
 calls++;
 const sent=JSON.parse(options.body);
 assert.equal(sent.store,false,'Do not store API conversation at model provider');
 assert.match(sent.instructions,/ONLY factual\/doctrinal authority/);
 assert.ok(sent.input[0].content[0].text.includes('approvedStandards'));
 return fakeResponse({status:'answered',answer:'Deuteronomy 6:4 confesses the LORD as one.',standardIds:['OG.1.1.18']});
};
const notCovered=await answerAskJeremiah({question:'Who won the World Series?'},{apiKey:'fake-key',fetcher});
assert.equal(notCovered.status,'not_covered');
assert.equal(notCovered.sources.length,0);
assert.equal(calls,0,'Off-topic questions must not call the language model');

const answered=await answerAskJeremiah({question:'What does Deuteronomy 6:4 teach?'},{apiKey:'fake-key',fetcher});
assert.equal(answered.status,'answered');
assert.equal(answered.sources[0].id,'OG.1.1.18');
assert.equal(calls,1);

const unknown=await answerAskJeremiah({question:'What does Deuteronomy 6:4 teach?'},{
 apiKey:'fake-key',
 fetcher:async()=>fakeResponse({status:'answered',answer:'Made up answer',standardIds:['FAKE.9.9.18']})
});
assert.equal(unknown.status,'not_covered','No unsupported standard citations');

const refuse=await answerAskJeremiah({question:'Explain repentance'},{apiKey:'fake-key',
 fetcher:async()=>fakeResponse({status:'not_covered',answer:'Sorry',standardIds:[]})
});
assert.equal(refuse.status,'not_covered','Model can refuse a weakly supported question');

await assert.rejects(answerAskJeremiah({question:'What does Deuteronomy 6:4 teach?'},{apiKey:''}),e=>e.status===503);
await assert.rejects(answerAskJeremiah({question:''},{apiKey:'fake'}),e=>e.status===400);
await assert.rejects(answerAskJeremiah({question:'a'.repeat(1601)},{apiKey:'fake'}),e=>e.status===400);

console.log('PASS: Ask Jeremiah uses current OG/NB standards, rejects unrelated topics before AI, constrains citations, and fails closed without API access.');
