// OG.1 exit examination: two independently scored items from each of the
// five approved OG.1 standards. These questions assess only concepts that
// the classroom actually teaches; they do not alter approved standards.
export const OG1_EXIT_EXAM_VERSION = 'og1-exit-2026-10-v1';
export const OG1_EXIT_PASS_COUNT = 8;
const question=(id,standardId,reference,prompt,choices,answerId,explanation,type='multiple_choice')=>Object.freeze({
 id,standardId,reference,prompt,type,
 choices:Object.freeze(choices.map(([value,label])=>Object.freeze({id:value,label}))),
 answerId,explanation
});

export const OG1_EXIT_QUESTIONS=Object.freeze([
 question('shema-confession','OG.1.1.18','Deuteronomy 6:4',
  'In Deuteronomy 6:4 (KJV), Israel is told, “Hear, O Israel.” What does the verse declare about the identity and oneness of the LORD?',
  [['a','The LORD our God is one LORD.'],['b','There are different gods for different nations.'],['c','The LORD is only one among several gods.'],['d','Every person defines God for themselves.']],
  'a','The Shema identifies the LORD as Israel’s one God, not one deity among rivals.'),
 question('shema-hearing','OG.1.1.18','Deuteronomy 6:4–5',
  'In the opening command of Deuteronomy 6:4–5, the Hebrew word shema is translated “Hear.” What response is Israel being called to make to the LORD?',
  [['a','Because listening means only hearing the sounds correctly.'],['b','Because Israel is called to listen and respond to the LORD.'],['c','Because the verse gives a new name for Moses.'],['d','Because Deuteronomy replaces the commandments.']],
  'b','Shema summons Israel to hear and respond; verse 5 immediately calls for wholehearted love.'),
 question('isaiah-before-after','OG.1.2.18','Isaiah 43:10',
  'Isaiah 43:10 records the LORD speaking about whether any God existed before him or would come after him. Which statement reflects that declaration?',
  [['a','Another god existed before the LORD.'],['b','A new god will eventually replace the LORD.'],['c','No God was formed before him, and none shall be after him.'],['d','The LORD is one of many equally eternal gods.']],
  'c','Isaiah explicitly excludes another God before or after the LORD.'),
 question('isaiah-beside','OG.1.2.18','Isaiah 44:6',
  'True or false: In Isaiah 44:6 (KJV), the LORD speaks of being the first and the last and declares that no other God exists beside him.',
  [['t','True'],['f','False']],'t',
  'The LORD declares: “beside me there is no God.”','true_false'),
 question('jesus-shema','OG.1.3.18','Mark 12:28–29',
  'In Mark 12:28–29, a scribe asks Jesus which commandment is first. Which confession does Jesus quote at the beginning of his answer?',
  [['a','That Israel’s earlier confession no longer mattered.'],['b','That every nation has a different supreme god.'],['c','That the commandments were all canceled.'],['d','“Hear, O Israel; The Lord our God is one Lord.”']],
  'd','Jesus reaffirms the Shema rather than replacing Israel’s confession.'),
 question('paul-idols','OG.1.3.18','1 Corinthians 8:4–6',
  'In 1 Corinthians 8:4–6, Paul discusses food offered to idols and the church’s confession about God. What does Paul affirm about the existence of other gods?',
  [['a','He says there is none other God but one.'],['b','He teaches that idols are other genuine gods.'],['c','He abandons the confession of the one God.'],['d','He says each city should worship its own god.']],
  'a','Paul affirms one God in the setting of idol worship and then discusses one God the Father and one Lord Jesus Christ.'),
 question('fair-trinity','OG.1.4.18','John 1:1; Matthew 28:19',
  'When comparing Apostolic Oneness theology with classical Trinitarian theology, which statement accurately describes what classical Trinitarian Christians teach about the one God, the Father, the Son, and the Holy Spirit?',
  [['a','Three separate gods competing for worship.'],['b','One divine essence in three coequal, coeternal persons.'],['c','One God whose Son was only pretending to be human.'],['d','The Father alone is divine; the Son has no divine identity.']],
  'b','The classical Trinitarian claim is one divine essence in three eternal persons, not three gods.'),
 question('apostolic-incarnation','OG.1.4.18','John 1:1, 14; Luke 22:42; 1 Timothy 2:5',
  'In Apostolic Oneness theology, Jesus Christ is understood as fully divine and truly human. In light of passages such as Luke 22:42 and 1 Timothy 2:5, how are his prayers to the Father understood?',
  [['a','Jesus only acted as though he were praying.'],['b','They prove Jesus was not truly human.'],['c','Jesus is truly human as well as fully divine; his prayers are real.'],['d','They require two separate gods.']],
  'c','The Apostolic account teaches genuine incarnation and genuine human prayer, not an acted performance.'),
 question('love-command','OG.1.5.18','Deuteronomy 6:4–5',
  'Deuteronomy 6:4 identifies the LORD as one, and Deuteronomy 6:5 commands love with all the heart, soul, and might. How are God’s identity and the command to love him connected?',
  [['a','A correct definition makes love unnecessary.'],['b','Verse 5 has nothing to do with the confession in verse 4.'],['c','Love is directed to whatever god someone imagines.'],['d','Knowing who the LORD is directs devotion; verse 5 calls for wholehearted love.']],
  'd','Verse 4 identifies the LORD; verse 5 calls Israel to love that LORD with heart, soul and might.'),
 question('exclusive-worship','OG.1.5.18','Exodus 20:3–5; James 2:19',
  'True or false: According to James 2:19 and the commandments against rival worship in Exodus 20:3–5, intellectually believing that one God exists is, by itself, the full response Scripture requires.',
  [['t','True'],['f','False']],'f',
  'James 2:19 warns that correct recognition alone is not enough, while the first commandments demand exclusive worship.','true_false')
]);

export function gradeOG1ExitExam(answers){
 if(!answers||typeof answers!=='object')throw new Error('Answers are required.');
 const rows=OG1_EXIT_QUESTIONS.map(q=>{
  const response=answers[q.id];
  if(!q.choices.some(choice=>choice.id===response))throw new Error('Complete all ten questions before submitting.');
  return Object.freeze({id:q.id,standardId:q.standardId,reference:q.reference,selectedId:response,answerId:q.answerId,correct:response===q.answerId});
 });
 const correct=rows.filter(row=>row.correct).length;
 return Object.freeze({
  total:rows.length,correct,score:Math.round(correct/rows.length*100),
  passed:correct>=OG1_EXIT_PASS_COUNT,results:Object.freeze(rows)
 });
}
