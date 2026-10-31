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
  'What does Deuteronomy 6:4 declare about God?',
  [['a','The LORD our God is one LORD.'],['b','There are different gods for different nations.'],['c','The LORD is only one among several gods.'],['d','Every person defines God for themselves.']],
  'a','The Shema identifies the LORD as Israel’s one God, not one deity among rivals.'),
 question('shema-hearing','OG.1.1.18','Deuteronomy 6:4–5',
  'What does the command “Hear, O Israel” in Deuteronomy 6:4 require of Israel?',
  [['a','Because listening means only hearing the sounds correctly.'],['b','Because Israel is called to listen and respond to the LORD.'],['c','Because the verse gives a new name for Moses.'],['d','Because Deuteronomy replaces the commandments.']],
  'b','Shema summons Israel to hear and respond; verse 5 immediately calls for wholehearted love.'),
 question('isaiah-before-after','OG.1.2.18','Isaiah 43:10',
  'What does Isaiah 43:10 teach about the existence of other gods?',
  [['a','Another god existed before the LORD.'],['b','A new god will eventually replace the LORD.'],['c','No God was formed before him, and none shall be after him.'],['d','The LORD is one of many equally eternal gods.']],
  'c','Isaiah explicitly excludes another God before or after the LORD.'),
 question('isaiah-beside','OG.1.2.18','Isaiah 44:6',
  'True or false: Isaiah 44:6 declares that there is no God beside the LORD.',
  [['t','True'],['f','False']],'t',
  'The LORD declares: “beside me there is no God.”','true_false'),
 question('jesus-shema','OG.1.3.18','Mark 12:28–29',
  'Which confession does Jesus quote in Mark 12:29?',
  [['a','That Israel’s earlier confession no longer mattered.'],['b','That every nation has a different supreme god.'],['c','That the commandments were all canceled.'],['d','“Hear, O Israel; The Lord our God is one Lord.”']],
  'd','Jesus reaffirms the Shema rather than replacing Israel’s confession.'),
 question('paul-idols','OG.1.3.18','1 Corinthians 8:4–6',
  'What does Paul affirm about God in 1 Corinthians 8:4?',
  [['a','He says there is none other God but one.'],['b','He teaches that idols are other genuine gods.'],['c','He abandons the confession of the one God.'],['d','He says each city should worship its own god.']],
  'a','Paul affirms one God in the setting of idol worship and then discusses one God the Father and one Lord Jesus Christ.'),
 question('fair-trinity','OG.1.4.18','John 1:1; Matthew 28:19',
  'Which statement accurately describes classical Trinitarian teaching?',
  [['a','Three separate gods competing for worship.'],['b','One divine essence in three coequal, coeternal persons.'],['c','One God whose Son was only pretending to be human.'],['d','The Father alone is divine; the Son has no divine identity.']],
  'b','The classical Trinitarian claim is one divine essence in three eternal persons, not three gods.'),
 question('apostolic-incarnation','OG.1.4.18','John 1:1, 14; Luke 22:42; 1 Timothy 2:5',
  'How does Apostolic Oneness theology explain Jesus’ prayers to the Father in Luke 22:42?',
  [['a','Jesus only acted as though he were praying.'],['b','They prove Jesus was not truly human.'],['c','Jesus is truly human as well as fully divine; his prayers are real.'],['d','They require two separate gods.']],
  'c','The Apostolic account teaches genuine incarnation and genuine human prayer, not an acted performance.'),
 question('love-command','OG.1.5.18','Deuteronomy 6:4–5',
  'What relationship do Deuteronomy 6:4–5 establish between God’s identity and devotion?',
  [['a','A correct definition makes love unnecessary.'],['b','Verse 5 has nothing to do with the confession in verse 4.'],['c','Love is directed to whatever god someone imagines.'],['d','Knowing who the LORD is directs devotion; verse 5 calls for wholehearted love.']],
  'd','Verse 4 identifies the LORD; verse 5 calls Israel to love that LORD with heart, soul and might.'),
 question('exclusive-worship','OG.1.5.18','Exodus 20:3–5; James 2:19',
  'True or false: James 2:19 teaches that belief in one God alone is sufficient.',
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
