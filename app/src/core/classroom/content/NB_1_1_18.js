import { curriculumContentRegistry } from './curriculumContent.js';

const base = curriculumContentRegistry['NB.1.1.18'];
const verse = (reference, text, note) => ({ reference, text, note });
const command = verse('Genesis 2:16-17', 'Of every tree of the garden thou mayest freely eat: But of the tree of the knowledge of good and evil, thou shalt not eat of it.', 'KJV excerpt. The gift and the boundary come from the same God.');
const breach = verse('Genesis 3:6', 'She took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat.', 'KJV excerpt. Read the action in light of the command already given.');
const separation = verse('Isaiah 59:2', 'But your iniquities have separated between you and your God', 'KJV excerpt. Iniquities means wrongdoing; the sentence identifies a broken relationship.');
const universal = verse('Romans 3:23', 'For all have sinned, and come short of the glory of God;', 'KJV. Paul includes everyone in the need for salvation.');
const inward = verse('Psalm 51:6', 'Behold, thou desirest truth in the inward parts', 'KJV excerpt. God addresses the inner person as well as outward actions.');
const gift = verse('Romans 6:23', 'For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.', 'KJV. Notice the contrast between sin’s wages and God’s gift.');

function check(id, title, teaching, prompt, choices, correct, next, repair, extra = {}) {
 return { id, type:'scenario', stageId:'checkpoint', title, teaching, prompt,
   choices:choices.map(([choiceId,label,message])=>({id:choiceId,label,teachingMessage:message})),
   expectedChoiceIds:[correct], authoredFeedback:true,
   next:{strong:next,partial:repair || id,weak:repair || id}, ...extra };
}
const moves = [
 {id:'learn',type:'teach',stageId:'truth',title:'What actually broke?',eyebrow:'Begin with a situation',
  teaching:[
   'A person lies to protect their reputation. Nobody discovers it. Their friends still trust them. From the outside, everything looks unchanged.',
   'Yet one thing has changed: the person has acted against God’s will. The wrong does not wait for public exposure, and it does not disappear if the person feels no remorse.',
   'This is where our lesson begins. To understand why new birth is necessary, we must first understand what sin has done. We will follow the command, the breach, and the need for God’s rescue.',
  ],illustration:'hidden-lie', next:{continue:'scripture'},cta:'Start with God’s command'},
 check('scripture','The boundary was already there',[
   'In Genesis 2, God gives generously and also gives a command. The boundary is part of a relationship in which God is the giver of life and the one with authority.',
   'Genesis 3 then records a choice against that command. The fruit’s appearance did not change whose word governed the choice. Sin involves the rejection of God’s will.',
  ],'What makes the act in Genesis 3 a breach of the relationship with God?',[
   ['appearance','The fruit looked attractive.','Attraction describes what drew attention. It does not explain why the act was wrong. Read the command again: the breach occurs when God’s word is rejected.'],
   ['command','They acted against the command God had given.','Yes. You connected the act to the authority it rejected. The moral issue is already present before shame, hiding, or blame enters the story.'],
   ['shame','They felt ashamed afterward.','Shame follows the act. A feeling can reveal a breach, but it does not create the moral boundary. Let’s separate the command from the reaction.'],
  ],'command','distinguish','repair-command',{scripture:[command,breach],illustration:'command-and-breach',concept:'authority'}),
 check('repair-command','Change the example. Keep the principle.',[
   'Imagine that someone gives you permission to borrow a tool, with one clear condition: do not sell it. You sell it, then explain that you felt comfortable doing so.',
   'The feeling did not change the permission. The example helps separate an authority’s instruction from a person’s reaction; God’s authority extends beyond this limited human illustration.',
  ],'Which explanation gets the principle right?',[
   ['feeling','Feeling comfortable made the sale acceptable.','The instruction still stood. Feeling comfortable cannot turn a refusal of a known boundary into obedience.'],
   ['exposure','The sale becomes wrong only when the owner discovers it.','Discovery changes what the owner knows, not what the borrower did. Return to the instruction that governed the action.'],
   ['authority','The borrower rejected a boundary that their feelings could not change.','That is the distinction. Now carry it back to Genesis: the command, not the later feeling, establishes the boundary.'],
  ],'authority','distinguish',null,{scripture:[command],progressOptional:true,satisfiesMoveIds:['scripture'],concept:'authority'}),
 check('distinguish','A limitation is not the same as a refusal',[
   'Consider two people facing an instruction. One cannot read its language. The other understands the instruction and deliberately rejects it. Those descriptions give us different information.',
   'Limited ability is not, by itself, proof of rebellion. Scripture calls us to identify wrongdoing against God. We must not label every weakness, disability, or painful circumstance as a person’s moral failure.',
  ],'Which description clearly identifies the distinction we are studying?',[
   ['difficulty','Any difficulty following an instruction is rebellion.','Difficulty tells us something about ability or circumstances. It does not, by itself, establish a rejection of God’s will.'],
   ['refusal','An understood instruction is deliberately rejected; that differs from an inability to understand it.','Yes. You distinguished inability from a chosen refusal. We are defining sin by its relationship to God’s will, not treating every human limitation as sin.'],
   ['normal','If refusal is common in a culture, it stops being wrongdoing.','Common behavior and right behavior are different questions. A culture can normalize an action without changing God’s will.'],
  ],'refusal','sources','repair-distinguish',{illustration:'limitation-and-refusal',concept:'limitation'}),
 check('repair-distinguish','Popularity does not settle the question',[
   'At a workplace, dishonest reporting is normal. A new employee says, “Everybody does it, so it cannot be wrong.” The frequency of the action has answered a social question: what people commonly do.',
   'It has not answered the moral question: whether the action agrees with God’s will. We need both the right definition and the right standard of judgment.',
  ],'Which question should come first when evaluating the employee’s claim?',[
   ['popular','Will the coworkers approve?','Approval tells you what the group accepts. It does not determine whether the act agrees with God’s will.'],
   ['will','Does the action agree with God’s will?','Yes. You moved from popularity to the moral standard. Now we can examine what violating that standard produces.'],
   ['comfortable','Does the employee feel anxious?','Anxiety is an experience, not a final moral standard. A calm person can still choose wrongdoing.'],
  ],'will','sources',null,{progressOptional:true,satisfiesMoveIds:['distinguish'],concept:'limitation'}),
 check('sources','One breach. Three connected consequences.',[
   'Return to the undiscovered lie. The person is accountable for what they have done: that is guilt. The willingness to protect themselves through deception also exposes an inward disorder: that is corruption.',
   'Isaiah identifies the relational consequence: wrongdoing separates people from God. These terms name related aspects of the problem. They are not three feelings that must occur in a particular order.',
  ],'The person stops feeling bad about the lie. What follows?',[
   ['cleared','The guilt has ended because the guilty feeling has ended.','Feeling guilty and being accountable are different. A change in emotion does not make the past act truthful or repair the relationship.'],
   ['separate','Only the inward problem remains; the relationship is automatically restored.','The inward problem matters, but it is not the whole breach. The relationship with God also needs to be addressed.'],
   ['accountable','Accountability, the inward problem, and the broken relationship still need to be addressed.','Yes. You kept the whole problem in view. This is why the lesson does not stop at emotional relief.'],
  ],'accountable','universal','repair-consequences',{scripture:[separation,inward],illustration:'consequences',concept:'consequences'}),
 check('repair-consequences','Name the problem precisely',[
   'Listen to three statements: “I did wrong.” “I keep wanting to hide the truth.” “My relationship with God needs restoration.”',
   'The first names accountability, the second an inward disorder, and the third a broken relationship. None is fully described by “I feel upset.” Naming the problem prepares us to understand the rescue.',
  ],'Which explanation holds the three ideas together?',[
   ['feelings','Guilt, corruption, and separation are different names for embarrassment.','Embarrassment may occur, but the terms describe moral accountability, the inner person, and relationship with God.'],
   ['whole','Sin involves real accountability, an inward problem, and separation from God.','Yes. Now you can explain why an outward improvement alone cannot address everything sin has damaged.'],
   ['public','All three disappear when other people forgive or forget.','Human forgiveness matters, but other people cannot simply erase wrongdoing before God or supply the new life he gives.'],
  ],'whole','universal',null,{scripture:[separation,inward],illustration:'consequences',progressOptional:true,satisfiesMoveIds:['sources'],concept:'consequences'}),
 check('universal','Who belongs in “all”?',[
   'Paul does not divide humanity into people who need salvation and respectable people who do not. “All have sinned” includes the religious, the admired, and the person whose wrong is hidden.',
   'That does not make every action equally harmful. It establishes that comparison with another person cannot remove our own need before God.',
  ],'A generous person says, “I have done less harm than my neighbor, so I do not need salvation.” How does Romans 3:23 answer?',[
   ['less','Doing less harm places the person outside Paul’s statement.','A comparison with a neighbor cannot remove a person from “all.” Less harm is not the same claim as no sin.'],
   ['all','The person’s goodness toward others does not remove their own need for salvation.','Yes. You preserved the value of doing good while recognizing the universal need named in the passage.'],
   ['equal','Paul means every person has committed exactly the same wrongs.','The verse names a shared need. It does not say every person has committed identical acts or caused identical harm.'],
  ],'all','rescue','repair-universal',{scripture:[universal],illustration:'all',concept:'universality',evidenceIds:['evidence-1']}),
 check('repair-universal','A shared need is not an identical record',[
   'Two people have different histories. One has caused harm openly; another has hidden their wrongs behind an admired reputation. Their histories are not interchangeable.',
   'Yet Paul’s statement includes both. A shared need for salvation does not require an identical list of actions.',
  ],'What can we conclude from “all have sinned”?',[
   ['same','Everyone has the same moral history.','A shared need and an identical history are different claims. Paul establishes the shared need.'],
   ['visible','Only people whose wrongdoing is visible need salvation.','Visibility affects public knowledge. It does not determine whether a person has sinned.'],
   ['need','Both people need God’s salvation, even though their histories differ.','That is the point. Now let’s ask what kind of rescue can answer that need.'],
  ],'need','rescue',null,{scripture:[universal],progressOptional:true,satisfiesMoveIds:['universal'],concept:'universality',evidenceIds:['evidence-1']}),
 check('rescue','Why improvement is not the whole answer',[
   'Honesty, restitution, and changed habits matter. But promising to behave better does not, by itself, erase guilt, cleanse the inward person, or restore communion with God.',
   'Romans 6:23 names both the depth of the problem and its answer: sin pays death; God gives life through Jesus Christ. This is why the new birth is received as God’s saving work. Later lessons will develop the apostolic response to that gift.',
  ],'Which response addresses the full problem we have traced?',[
   ['image','Help the person feel confident about themselves and leave the wrong unaddressed.','Confidence may change a feeling. It leaves the wrongdoing, inward corruption, and separation unaddressed.'],
   ['rescue','The person needs God’s forgiveness, cleansing, and restoring work, with a real response to him.','Yes. The need reaches beyond managing appearances or improving a habit. It calls for the saving work of God.'],
   ['habits','Treat a new habit as sufficient to cancel the whole breach.','A changed habit can be good, but it cannot be made into a self-issued pardon or the source of new life.'],
  ],'rescue','check','repair-rescue',{scripture:[gift,separation],illustration:'rescue',concept:'rescue'}),
 check('repair-rescue','Repairing harm and receiving life',[
   'Suppose a dishonest person returns what they took and stops stealing. Those are meaningful changes. We should not dismiss them.',
   'Now ask a second question: can that person declare themselves cleansed before God simply because they repaired a visible loss? The need for God’s saving work remains. Changed conduct must be connected to a real turning and response to God.',
  ],'Which explanation avoids both mistakes?',[
   ['nothing','Changed conduct is worthless, so it does not matter.','Conduct matters. The mistake is making it the power that grants us spiritual life or erases our need for God.'],
   ['enough','Returning the property supplies everything God’s salvation would supply.','Restitution addresses a harm. It must not be confused with the whole saving work of God.'],
   ['both','Repairing harm matters, and the person still needs God’s saving work.','Yes. You held both truths together: a real response matters, and God is the giver of the life we need.'],
  ],'both','check',null,{scripture:[gift],progressOptional:true,satisfiesMoveIds:['rescue'],concept:'rescue'}),
 check('check','Carry it into a new conversation',[],
  'Maya says, “My community accepts dishonest business practices. I do not feel guilty, and my company gives money away. Why would I need new birth?” Which explanation addresses her reasoning?',[
   ['emotion','She needs new birth only if guilt begins to trouble her.','This makes a feeling the standard again. Her question is about wrongdoing before God, whether or not she feels it.'],
   ['comparison','Her company’s generosity proves that the dishonest practice has been cancelled out.','A good act does not turn a dishonest one into truth or automatically restore communion with God.'],
   ['relation','Social approval, calm feelings, and generosity do not remove wrongdoing before God or the need for his rescue.','You applied the distinction in a new situation. Now explain the reasoning yourself, using a passage rather than repeating a choice.'],
  ],'relation','explain','repair-transfer',{concept:'transfer'}),
 check('repair-transfer','Locate the standard of judgment',[
   'Maya offered three reasons: her group approves, she feels calm, and her company does some good. None answers whether the dishonest practice agrees with God’s will.',
   'Change the situation: a person is admired for loyalty but knowingly lies to protect a friend. Admiration and loyalty do not make the lie truthful. Start with the act’s relationship to God’s will, then explain the need it creates.',
  ],'Which is the strongest explanation in this different situation?',[
   ['loyalty','Loyalty makes any protective action morally right.','A valued motive cannot automatically make every chosen action right. We still have to evaluate the action itself.'],
   ['truth','A valued motive does not erase wrongdoing; the person still needs to address their relationship with God.','Yes. You transferred the principle beyond the original example. Now put the reasoning into your own words.'],
   ['reputation','Being admired means there cannot be a spiritual problem.','Reputation describes other people’s judgment. It does not settle the person’s standing before God.'],
  ],'truth','explain',null,{progressOptional:true,satisfiesMoveIds:['check'],concept:'transfer'}),
 {id:'explain',type:'free_response',stageId:'checkpoint',title:'Explain what the breach means',eyebrow:'Let me hear your reasoning',teaching:[],
  prompt:'Explain to someone new to the Bible what sin is and why guilt, corruption, and separation are more than bad feelings. Use Isaiah 59:2 or Romans 3:23 to support your explanation.',
  scripture:[separation,universal],evidenceIds:['evidence-2'],
  assessmentCriteria:['Defines sin as wrongdoing or rebellion against God’s will, not merely limitation or social disapproval.','Distinguishes real accountability, inward disorder, and a broken relationship from emotions.','Uses the meaning of at least one supplied passage to support the explanation; a verse number alone is insufficient.'],
  next:{strong:'apply',partial:'explain',weak:'explain'}},
 {id:'apply',type:'free_response',stageId:'checkpoint',title:'Choose the help that fits the need',eyebrow:'Apply the truth',teaching:[],
  prompt:'A friend says, “I stopped the dishonest habit and I feel better now. That means I no longer need God to save me.” Explain what is good about the change and what it cannot accomplish by itself. Connect your answer to Romans 6:23.',
  scripture:[gift],evidenceIds:['evidence-3'],
  assessmentCriteria:['Affirms that stopping wrongdoing matters.','Explains why changed habits or improved feelings do not, by themselves, erase guilt or supply reconciliation and new spiritual life.','Connects the need for God’s saving work to the contrast between sin’s wages and God’s gift in Romans 6:23.'],
  next:{strong:'defend',partial:'apply',weak:'apply'}},
 {id:'defend',type:'mastery_response',stageId:'mastery',title:'Explain it without the scaffolding',eyebrow:'Independent understanding',teaching:[],
  prompt:'Someone says, “Sin is just a label cultures put on behavior. What people really need is a healthier self-image.” Give a respectful response that defines sin, explains its consequences, and shows why the new birth is necessary. Use a Scripture passage and explain how it supports your answer.',
  scripture:[separation,universal,gift],evidenceIds:['evidence-4'],
  assessmentCriteria:['Explains why God’s will, not cultural acceptance or feelings alone, establishes the moral issue.','Connects guilt, corruption, and separation to the need for God’s saving work.','Explains why emotional relief or self-improvement is insufficient without dismissing appropriate care or meaningful behavioral change.','Uses a relevant biblical passage in context and responds respectfully.'],
  next:{strong:'complete',partial:'defend',weak:'defend'}},
 {id:'complete',type:'complete',stageId:'mastery',title:'You can now explain the need for new birth.',teaching:[]},
];

export default {
 ...base,
 lessonFormat:'teacher-led', curriculumVersion:2,
 legacyMoveMap:{learn:'learn',scripture:'learn',sources:'learn',check:'learn',explain:'learn',apply:'learn',defend:'learn',complete:'complete'},
 instructionalMoves:moves,
 presets:Object.fromEntries(Object.entries(base.presets).map(([id,preset])=>[id,{...preset,currentMoveId:'learn',currentStageId:'truth'}])),
 brain:{...base.brain,
  misconceptions:[
   {id:'feelings-define-sin',description:'Treats guilt or shame as the source of moral wrongdoing.'},
   {id:'culture-defines-sin',description:'Treats social acceptance as decisive moral authority.'},
   {id:'limitation-is-rebellion',description:'Equates human inability with a chosen refusal of God’s will.'},
   {id:'improvement-is-salvation',description:'Treats improved habits as sufficient to erase guilt and supply spiritual life.'},
  ],
  teacherGuardrails:[...base.brain.teacherGuardrails,'Do not solicit a personal confession; all practice uses fictional situations.','Do not identify disability, distress, or an inability as sin without moral grounds.','Affirm meaningful behavioral change and appropriate emotional care while distinguishing them from the full saving work of God.','Assess the learner’s reasoning against every criterion of the current move. Award the current evidence ID only when all those criteria are met.'],
 },
};
