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
  'Which teaching is explicitly stated in Deuteronomy 6:4?',
  [['a','The LORD our God is one LORD.'],['b','The LORD created the heavens and earth.'],['c','The LORD is holy and righteous.'],['d','The LORD delivered Israel from Egypt.']],
  'a','The Shema identifies the LORD as Israel’s one God, not one deity among rivals.'),
 question('shema-hearing','OG.1.1.18','Deuteronomy 6:4–5',
  'What is the primary force of “Hear, O Israel” in Deuteronomy 6:4?',
  [['a','A call to remember Israel’s history.'],['b','A summons to listen and respond to the LORD.'],['c','A command to gather for a sacrifice.'],['d','An instruction to teach future generations.']],
  'b','Shema summons Israel to hear and respond; verse 5 immediately calls for wholehearted love.'),
 question('isaiah-before-after','OG.1.2.18','Isaiah 43:10',
  'Which claim does the LORD make in Isaiah 43:10?',
  [['a','He alone formed the heavens and the earth.'],['b','He will gather his people from the nations.'],['c','No God was formed before him or shall be after him.'],['d','He is the first and the last, Israel’s redeemer.']],
  'c','Isaiah explicitly excludes another God before or after the LORD.'),
 question('isaiah-beside','OG.1.2.18','Isaiah 44:6',
  'Which declaration appears in Isaiah 44:6?',
  [['a','The LORD is my shepherd; I shall not want.'],['b','The just shall live by his faith.'],['c','I am the first, and I am the last; and beside me there is no God.'],['d','The LORD is longsuffering, and of great mercy.']],
  'c','Isaiah 44:6 calls the LORD the first and the last and declares that there is no God beside him.'),
 question('jesus-shema','OG.1.3.18','Mark 12:28–29',
  'Which Old Testament confession does Jesus quote in Mark 12:29?',
  [['a','The LORD is my shepherd; I shall not want.'],['b','The just shall live by his faith.'],['c','Thou shalt love thy neighbour as thyself.'],['d','Hear, O Israel; The Lord our God is one Lord.']],
  'd','Jesus reaffirms the Shema rather than replacing Israel’s confession.'),
 question('paul-idols','OG.1.3.18','1 Corinthians 8:4–6',
  'Which statement does Paul make in 1 Corinthians 8:4?',
  [['a','There is none other God but one.'],['b','There is one mediator between God and men.'],['c','There is one Lord, one faith, one baptism.'],['d','Every knee shall bow at the name of Jesus.']],
  'a','Paul affirms one God in the setting of idol worship and then discusses one God the Father and one Lord Jesus Christ.'),
 question('fair-trinity','OG.1.4.18','John 1:1; Matthew 28:19',
  'Which definition specifically describes classical Trinitarian theology?',
  [['a','One divine person revealed as Father, Son, and Holy Spirit.'],['b','One divine essence in three coequal, coeternal persons.'],['c','One supreme God with a Son who is subordinate by nature.'],['d','One God whose persons are successive historical manifestations.']],
  'b','The classical Trinitarian claim is one divine essence in three eternal persons, not three gods.'),
 question('apostolic-incarnation','OG.1.4.18','John 1:1, 14; Luke 22:42; 1 Timothy 2:5',
  'How does Apostolic Oneness theology understand Jesus’ prayers in Luke 22:42?',
  [['a','They express communication between two eternal divine persons.'],['b','They are chiefly examples of how believers should pray.'],['c','They are genuine prayers arising from Jesus’ real human life.'],['d','They reflect the dependence of a created, lesser divine being.']],
  'c','The Apostolic account teaches genuine incarnation and genuine human prayer, not an acted performance.'),
 question('love-command','OG.1.5.18','Deuteronomy 6:4–5',
  'What connection is made between Deuteronomy 6:4 and 6:5?',
  [['a','The LORD’s unity is linked to Israel’s observance of the Sabbath.'],['b','The LORD’s covenant is linked to Israel’s sacrificial offerings.'],['c','The LORD’s holiness is linked to Israel’s dietary instructions.'],['d','The confession of one LORD is followed by a command to love him.']],
  'd','Verse 4 identifies the LORD; verse 5 calls Israel to love that LORD with heart, soul and might.'),
 question('exclusive-worship','OG.1.5.18','Exodus 20:3–5; James 2:19',
  'What point does James 2:19 make about belief in one God?',
  [['a','Belief in one God removes the need for obedience.'],['b','Belief in one God is good, but even demons believe and tremble.'],['c','Belief in one God is the same as loving one’s neighbor.'],['d','Belief in one God must be accompanied by ceremonial sacrifices.']],
  'b','James 2:19 affirms belief in one God while noting that demons also believe and tremble; mere acknowledgment is not the full faithful response.')
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
