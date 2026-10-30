import assert from 'node:assert/strict';
import {allAskStandards,selectAskStandards,inferQuestionTheme,answerAskJeremiah,OUT_OF_SCOPE} from '../server/askJeremiahCore.mjs';
import {CURRICULUM_STUDIES} from '../src/core/classroom/content/curriculumContent.js';
import {JEREMIAH_PERSONA} from '../server/askJeremiahPersona.mjs';
// Ensure every role the product owner asked for reaches the live AI prompt.
for (const role of ['PREACHER','TEACHER','THEOLOGIAN','FRIEND','PASTOR','FAITHFUL SAINT','WITNESS']) {
 assert.match(JEREMIAH_PERSONA,new RegExp(role+':'),'Missing Jeremiah character role: '+role);
}
assert.match(JEREMIAH_PERSONA,/not a literal human being/i,'Jeremiah must not claim human identity');
assert.match(JEREMIAH_PERSONA,/CURRICULUM BOUNDARY:/,'Persona must remain accountable to approved studies');
const standards=allAskStandards();
assert.ok(standards.some(s=>s.id.startsWith('OG.')),'Use approved OG standards');
assert.ok(standards.some(s=>s.id.startsWith('NB.')),'Use approved NB standards');
assert.deepEqual(new Set(standards.map(s=>s.studyId)),new Set(CURRICULUM_STUDIES.map(s=>s.id)),'New approved studies join Ask Jeremiah automatically');
assert.ok(selectAskStandards('What does Deuteronomy 6:4 teach about the one God?').some(s=>s.studyId==='OG'));
assert.ok(selectAskStandards('What do the standards teach about repentance?').some(s=>s.studyId==='NB'));
assert.deepEqual(selectAskStandards('Who won the World Series?'),[],'Sports are not in curriculum');
assert.deepEqual(selectAskStandards('How do I bake sourdough bread?'),[],'Recipes are out of scope');
assert.equal(inferQuestionTheme('how many gods is there?')?.name,'divine-oneness');
assert.equal(inferQuestionTheme('how did the world start?')?.name,'creation');
assert.equal(inferQuestionTheme('Who created Minecraft?'),null,'A named game is not biblical creation');
const oneness=selectAskStandards('how many gods is there?',{limit:3});
assert.equal(oneness[0]?.id,'OG.1.1.18','Simple number-of-gods questions begin with the Shema, not comparative theology');
assert.ok(!oneness.some(s=>s.id==='OG.15.1.18'),'Never lead with doctrinal alternatives for this basic question');
const creation=selectAskStandards('how did the world start?',{limit:3});
assert.equal(creation[0]?.id,'OG.3.1.18','The creation question is explicitly covered by John 1 and Genesis 1');
assert.ok(!selectAskStandards('Who created Minecraft?').some(s=>s.id==='OG.3.1.18'),
 'Unrelated game creation must not be routed into a Genesis lesson');

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
 for(const role of ['PREACHER','TEACHER','THEOLOGIAN','FRIEND','PASTOR','FAITHFUL SAINT','WITNESS']) assert.ok(sent.instructions.includes(role+':'),'Role missing in model request: '+role);
 assert.match(sent.instructions,/Do not introduce denominations/);
 assert.match(sent.instructions,/Never describe your own evidence-processing/);
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
const topicalRequests=[];
const topicalFetcher=async(_url,options)=>{
 const sent=JSON.parse(options.body);
 const request=JSON.parse(sent.input[0].content[0].text);
 topicalRequests.push({request,instructions:sent.instructions});
 const id=request.approvedStandards[0].id;
 return fakeResponse({status:'answered',answer:id==='OG.3.1.18'
  ? 'Genesis 1:1 says God created heaven and earth. The same Creator is revealed through Jesus Christ in John 1.'
  : 'There is one God. Deuteronomy 6:4 declares that the LORD our God is one LORD.',standardIds:[id]});
};
const oneGodAnswer=await answerAskJeremiah({question:'how many gods is there?'},{apiKey:'fake-key',fetcher:topicalFetcher});
assert.equal(oneGodAnswer.status,'answered');
assert.equal(oneGodAnswer.sources[0].id,'OG.1.1.18');
const creationAnswer=await answerAskJeremiah({question:'how did the world start?',history:[
 {role:'user',text:'how many gods is there?'},
 {role:'assistant',text:'There is one God.'}
]},{apiKey:'fake-key',fetcher:topicalFetcher});
assert.equal(creationAnswer.status,'answered','A new simple question is not a follow-up to the previous oneness question');
assert.equal(creationAnswer.sources[0].id,'OG.3.1.18');
assert.equal(topicalRequests[1].request.approvedStandards[0].id,'OG.3.1.18');
assert.ok(topicalRequests[1].request.primaryScripture.some(v=>/Gen\.?\s*1:1/i.test(v.reference)),
 'Genesis 1:1 must be offered as primary evidence');
assert.ok(topicalRequests[0].request.primaryScripture.some(v=>/Deut\.?\s*6:4/i.test(v.reference)),
 'Deuteronomy 6:4 must be offered as primary evidence');
assert.match(topicalRequests[0].instructions,/Oneness theology affirms/,'Tell the model not to sound like a doctrinal index');
assert.match(topicalRequests[0].instructions,/Do not cite verses about studying Scripture/);
let correctionCalls=0;
const corrected=await answerAskJeremiah({question:'how many gods is there?'},{
 apiKey:'fake-key',
 fetcher:async(_url,options)=>{
  correctionCalls++;
  const sent=JSON.parse(options.body);
  if(correctionCalls===1)return fakeResponse({status:'answered',
   answer:'There is one God. Oneness theology affirms this. The supplied Scripture evidence says to search the Scriptures (Acts 17:11).',
   standardIds:['OG.1.1.18']});
  assert.match(sent.instructions,/REVISE THIS ANSWER FOR DIRECTNESS/,'Unrelated or robotic evidence must trigger a rewrite');
  return fakeResponse({status:'answered',
   answer:'There is one God, and Scripture could not be clearer. Deuteronomy 6:4 declares: The LORD our God is one LORD. Isaiah 45:5 says there is none else. That is why we hold firmly to one God.',
   standardIds:['OG.1.1.18']});
 }
});
assert.equal(correctionCalls,2,'Model must get one chance to correct a robotic, wrongly cited answer');
assert.equal(corrected.status,'answered');
assert.match(corrected.answer,/Deuteronomy 6:4/);
assert.doesNotMatch(corrected.answer,/Oneness theology affirms|supplied Scripture/);


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
