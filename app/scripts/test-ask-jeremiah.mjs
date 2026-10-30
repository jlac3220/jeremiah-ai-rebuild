import assert from 'node:assert/strict';
import {allAskStandards,selectAskStandards,answerAskJeremiah,OUT_OF_SCOPE} from '../server/askJeremiahCore.mjs';
import {CURRICULUM_STUDIES} from '../src/core/classroom/content/curriculumContent.js';
const standards=allAskStandards();
assert.ok(standards.some(s=>s.id.startsWith('OG.')),'Use approved OG standards');
assert.ok(standards.some(s=>s.id.startsWith('NB.')),'Use approved NB standards');
assert.deepEqual(new Set(standards.map(s=>s.studyId)),new Set(CURRICULUM_STUDIES.map(s=>s.id)),'New approved studies join Ask Jeremiah automatically');
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
 assert.doesNotMatch(sent.instructions,/take the conversation beyond OG\/NB/,'New studies must not require instruction edits');
 assert.match(sent.instructions,/Apostolic Bible teacher|Apostolic\/Oneness teacher/);
 assert.match(sent.instructions,/Do not introduce denominations/);
 assert.match(sent.instructions,/do NOT start with 'according to the standard'|Do NOT start with 'according to the standard'/i);
 assert.ok(sent.input[0].content[0].text.includes('approvedStandards'));
 return fakeResponse({status:'answered',answer:'Deuteronomy 6:4 confesses the LORD as one.',standardIds:['OG.1.1.18']});
};
const notCovered=await answerAskJeremiah({question:'Who won the World Series?'},{apiKey:'fake-key',fetcher});
assert.equal(notCovered.status,'not_covered');
assert.equal(notCovered.sources.length,0);
assert.equal(notCovered.answer,OUT_OF_SCOPE);
assert.doesNotMatch(notCovered.answer,/standards|perspective|Mormonism|Trinitarianism|One True God|New Birth|OG|NB/i,'The refusal must not name curricula or discuss unrelated subjects');
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
assert.equal(refuse.answer,OUT_OF_SCOPE,'Even model refusals use the same user-facing boundary language');

await assert.rejects(answerAskJeremiah({question:'What does Deuteronomy 6:4 teach?'},{apiKey:''}),e=>e.status===503);
await assert.rejects(answerAskJeremiah({question:''},{apiKey:'fake'}),e=>e.status===400);
await assert.rejects(answerAskJeremiah({question:'a'.repeat(1601)},{apiKey:'fake'}),e=>e.status===400);

console.log('PASS: Ask Jeremiah uses the approved curriculum dynamically, keeps refusals generic, rejects unrelated topics, and constrains sources.');
