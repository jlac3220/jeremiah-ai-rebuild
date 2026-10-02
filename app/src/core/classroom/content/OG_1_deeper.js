// Authored practice: choosing a conclusion is not enough; its evidence must fit.
export function deepenOG1(moves) {
 const byId=id=>moves.find(m=>m.id===id);
 byId('shema-show').workedExample={title:'Watch how I use context',steps:[
  {label:'Notice the word',text:'Echad means one. That identifies the word; it does not yet explain every use of it.'},
  {label:'Ask what is being described',text:'Genesis 2:24 speaks of two people becoming one flesh. Deuteronomy 6:4 confesses the LORD. The subjects and contexts differ.'},
  {label:'Read the surrounding witness',text:'Isaiah says there is no God beside the LORD. In this Apostolic reading, that exclusive language governs how we explain God’s oneness.'},
  {label:'State the reasoning',text:'I cannot import everything about marriage into the description of God merely because both passages use one. I must interpret the confession with its own scriptural setting.'}
 ]};
 byId('distinction-show').workedExample={title:'Work through the prayer without erasing the humanity',steps:[
  {label:'Observe before answering',text:'In Luke 22:42, Jesus addresses the Father and submits his will. An explanation must take that real prayer and submission seriously.'},
  {label:'Keep both truths',text:'First Timothy 2:5 confesses one God and calls the mediator the man Christ Jesus. John 1:14 says the Word became flesh. The humanity is genuine.'},
  {label:'Explain the Apostolic reading',text:'God became truly human in Jesus. In his real human life, Jesus prays to the Father. The Father is not another god, and God is not confined to the human body of Jesus.'},
  {label:'Name the limits of the answer',text:'“He was only acting” denies the reality of the prayer. “There must be two gods” abandons monotheism. The Oneness explanation holds genuine incarnation together with the confession of one God; it must explain both, not discard one.'}
 ]};
 const reason=(id,title,scenario,claimPrompt,claims,reasonPrompt,reasons,answer,next,standardId)=>({id,title,type:'scenario',stageId:'checkpoint',phase:'Guide me',standardIds:[standardId],teaching:[scenario],prompt:'Make a judgment, then choose the reason that supports it.',interaction:{type:'reasoning',claimPrompt,claims,reasonPrompt,reasons,answer},evidenceIds:[],next:{strong:next,partial:id,weak:id}});
 moves.push(reason('context-challenge','Can the same word settle the question?',
  'A fictional reader says: “A team is one team with many members. Therefore, when Scripture says God is one, it must mean a group of divine persons.” Test the inference rather than simply agreeing or disagreeing with the conclusion.',
  '1 · Does this comparison establish the meaning of the Shema?',[
   {id:'yes',label:'Yes. The same number always describes the same kind of unity.',feedback:'A number can describe different subjects. The analogy does not establish what the biblical passage means.'},
   {id:'no',label:'No. The comparison alone cannot establish that meaning.',feedback:'You identified the limit of the analogy. Now give the reason for that judgment.'}],
  '2 · Which reason actually answers the argument?',[
   {id:'context',label:'The subject and scriptural context must govern the meaning; Isaiah excludes a God beside the LORD.',feedback:'This connects the conclusion to the relevant evidence instead of importing the structure of a team into God.'},
   {id:'dictionary',label:'The word one can never describe anything with multiple members.',feedback:'A team can be called one team. Denying ordinary usage is unnecessary; explain why that usage cannot decide this passage.'},
   {id:'preference',label:'The comparison sounds unfamiliar, so it must be wrong.',feedback:'Familiarity does not establish an interpretation. Test the claim against the actual wording and context.'}],
  {claim:'no',reason:'context'},'isaiah-show','OG.1.1.18'));
 moves.push(reason('prayer-challenge','A correct conclusion needs a sound explanation',
  'A learner says: “I believe God is one, so Jesus’ prayer must only have been a performance for the disciples.” They have kept the confession but explained away something the passage presents as real.',
  '1 · What needs correcting?',[
   {id:'prayer',label:'The claim that Jesus’ prayer was only a performance.',feedback:'Yes. The confession does not give us permission to erase the humanity or the prayer.'},
   {id:'oneness',label:'The confession of one God must be abandoned.',feedback:'First Timothy 2:5 affirms one God alongside Christ’s human mediation. The task is to hold the truths together.'}],
  '2 · Which explanation repairs the mistake?',[
   {id:'costume',label:'God wore a human appearance, so the human experience was not real.',feedback:'A human appearance alone is not genuine incarnation. The lesson affirms a real human life.'},
   {id:'incarnation',label:'The Word became flesh; Jesus’ genuine human life includes real prayer and submission to the Father.',feedback:'This preserves the reality of the prayer while explaining it within the Apostolic understanding of incarnation.'},
   {id:'two',label:'Prayer requires two gods who communicate.',feedback:'That inference contradicts the confession. Distinguish genuine human mediation from adding a second deity.'}],
  {claim:'prayer',reason:'incarnation'},'distinction-guide','OG.1.4.18'));
 byId('shema-guide').next.strong='context-challenge';
 byId('distinction-show').next.continue='prayer-challenge';
 // Support teaches the missing thinking move rather than offering a generic exhortation.
 const support={
  'shema-try':['Separate the quotation from your explanation of its phrases.','For the objection, distinguish possible uses of a word from the meaning in this setting.','Explain what the later witnesses preserve; do not merely list their references.'],
  'isaiah-try':['Organize the declarations by what they rule out: before, beside, after, or another savior.','Explain the cumulative force instead of treating four quotations as four unrelated facts.','State the objection accurately before explaining the Apostolic response.'],
  'continuity-try':['Begin with the confession, then explain Jesus’ reaffirmation.','Ask what problem each apostolic passage addresses and how one God functions in that argument.','Address the proposed second-person reading directly, using the surrounding contrast with so-called gods.'],
  'distinction-try':['State both positions in terms their adherents could recognize.','Distinguish an observation in the text from your interpretation of it.','Keep the real humanity and the real prayer in your explanation of incarnation.'],
  'devotion-try':['Connect the command in verse 5 to the confession in verse 4.','Use one concrete example each for worship, conduct and mission.','Explain how the same allegiance governs all three; avoid merely saying that belief matters.']
 };
 for(const [id,steps] of Object.entries(support))byId(id).supportSteps=steps;
}
