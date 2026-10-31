import { deepenOG1 } from './OG_1_deeper.js';
import { alignAuthoredOrRegenerate } from './standardsDrivenLesson.js';
import { curriculumContentRegistry, CURRICULUM_STUDIES } from './curriculumContent.js';
const base = curriculumContentRegistry['OG.1.1.18'];
const study = CURRICULUM_STUDIES.find(s=>s.id==='OG');
const standards = study.standards.filter(s=>s.domain===1);
const domain = study.domains.find(d=>d.number===1);
const verse=(reference,text,note)=>({reference,text,note});
const shema=verse('Deuteronomy 6:4','Hear, O Israel: The LORD our God is one LORD.','KJV. Hear the confession before reasoning about its implications.');
const mark=verse('Mark 12:29','The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord:','KJV. Jesus repeats Israel’s confession when answering about the first commandment.');
const isaiah=[
 verse('Isaiah 43:10','before me there was no God formed, neither shall there be after me.','KJV excerpt. The claim excludes a deity before or after the LORD.'),
 verse('Isaiah 44:6','I am the first, and I am the last; and beside me there is no God.','KJV excerpt. Eternity and exclusivity belong together.'),
 verse('Isaiah 44:8','Is there a God beside me? yea, there is no God; I know not any.','KJV excerpt. The question is answered by God himself.'),
 verse('Isaiah 45:5','I am the LORD, and there is none else, there is no God beside me:','KJV excerpt. This is more than a claim to first place.'),
 verse('Isaiah 45:22','Look unto me, and be ye saved, all the ends of the earth: for I am God, and there is none else.','KJV. The exclusive God calls all the earth to salvation.'),
 verse('Isaiah 46:9','for I am God, and there is none else; I am God, and there is none like me,','KJV excerpt. Remembering God’s works supports the confession.')];
const nt=[
 verse('1 Corinthians 8:4-6','there is none other God but one.','KJV excerpt from verse 4. Open the passage: Paul contrasts so-called gods with one God, the Father, and one Lord Jesus Christ.'),
 verse('Ephesians 4:5-6','One Lord, one faith, one baptism, One God and Father of all, who is above all, and through all, and in you all.','KJV. Paul places the confession in the unity of the church.'),
 verse('1 Timothy 2:5','For there is one God, and one mediator between God and men, the man Christ Jesus;','KJV. Notice both one God and the mediator’s real humanity.'),
 verse('James 2:19','Thou believest that there is one God; thou doest well: the devils also believe, and tremble.','KJV. A correct confession must also be lived; recognition alone is insufficient.')];
const incarnation=[verse('John 1:1','In the beginning was the Word, and the Word was with God, and the Word was God.','KJV. Read through verse 14: the Word became flesh.'),verse('Matthew 28:19','baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:','KJV excerpt. Compare the command with Acts 2:38 in its full setting.'),verse('Acts 2:38','Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins,','KJV excerpt. Peter’s apostolic instruction names Jesus Christ.'),verse('Luke 22:42','Father, if thou be willing, remove this cup from me: nevertheless not my will, but thine, be done.','KJV. Jesus’ prayer is real; his humanity must not be erased.')];
const show=(id,title,teaching,scripture,next,visual,extra={})=>({id,type:'teach',stageId:'truth',phase:'Show me',title,teaching,scripture,next:{continue:next},visual,...extra});
const match=(id,title,prompt,items,options,next,standardId,extra={})=>({id,type:'scenario',stageId:'checkpoint',phase:'Guide me',title,prompt,teaching:['Make the connections yourself. After you check, we will look at the reasoning behind each connection. You can revise the ones that need another look.'],interaction:{type:'match',items,options},next:{strong:next,partial:id,weak:id},standardIds:[standardId],evidenceIds:[],...extra});
const attempt=(id,title,prompt,standard,next,scripture)=>({id,type:'free_response',stageId:'checkpoint',phase:'Let me try',title,prompt,teaching:['Use your own explanation. The support drawer is available if you need it; opening it makes this a supported attempt. A fresh attempt without support is needed to establish independent understanding.'],standardIds:[standard.id],assessmentCriteria:standard.evidence.map(e=>e.text),evidenceIds:standard.evidence.map(e=>`${standard.id}:evidence-${e.level}`),scripture,next:{strong:next,partial:id,weak:id}});
const moves=[
 show('learn','One confession. One unfolding story.',[
  'Imagine hearing “God is one” in four different settings: Israel gathered to listen, Isaiah challenging rival claims, Jesus answering a question, and the apostles teaching the church. Does the confession change as the story unfolds?',
  'We will investigate that question together. Each of the five OG.1 standards governs a chapter: the Shema, Isaiah’s exclusive declarations, New Testament continuity, the exact doctrinal distinction, and undivided devotion to the one LORD.',
  'Five standards belong to this connected lesson. Your place is saved between its chapters; you do not need to finish the whole lesson in one sitting.'
 ],[shema],'shema-show','story',{cta:'Follow the confession'}),
 show('shema-show','Listen before you define',[
  'Hear is a summons to Israel. “The LORD our God” identifies the one Israel belongs to. “One LORD” is the confession that governs how the rest of the revelation is understood. Deuteronomy 6:5 immediately calls Israel to wholehearted love.',
  'Shema means “hear”; echad means “one.” Echad can describe a single individual or a unity, as in two people becoming “one flesh” (Genesis 2:24). That example shows the word’s flexibility; it does not prove that God consists of multiple divine persons. Read “one” with the subject, Israel’s covenant confession, and the surrounding Scripture.',
  'The OG.1.1 standard calls for the Apostolic understanding of numerical oneness. The argument is cumulative: the Shema confesses the one LORD; Isaiah excludes another God before, beside, or after him; Jesus reaffirms the same confession. The word echad is not, by itself, a proof of either theological position.'
 ],[shema,mark],'shema-guide','scroll'),
 match('shema-guide','Rebuild the confession','Match each phrase from Deuteronomy 6:4 to its meaning.',[
  {id:'hear',label:'Hear, O Israel',answer:'summons',explanation:'The opening addresses a people and calls them to listen.'},
  {id:'our',label:'The LORD our God',answer:'identity',explanation:'This identifies Israel’s God and the covenant relationship.'},
  {id:'one',label:'is one LORD',answer:'confession',explanation:'The confession concerns who God is, not just agreement within a group.'}
 ],[{id:'confession',label:'Confesses God’s oneness'},{id:'summons',label:'Calls Israel to listen'},{id:'identity',label:'Identifies the covenant God'}],'shema-try',standards[0].id),
 attempt('shema-try','Explain the anchor', 'Recite Deuteronomy 6:4 and explain the meaning of shema and echad in its context. How does verse 5 relate to verse 4? A friend points to “one flesh” in Genesis 2:24: explain why a word’s other uses do not decide this passage. Use Isaiah 44:6 and Jesus’ repetition in Mark 12:29 to show why the Shema remains foundational.',standards[0],'isaiah-show',[shema,mark,...isaiah.slice(0,2),...nt.slice(0,2)]),
 show('isaiah-show','The witness stand',[
  'Isaiah 43 calls for witnesses. The issue is not which rival deity deserves first place. The LORD declares that no God was formed before him and none will follow. The later declarations add “beside me” and “none else.” Together they exclude rivals across time and alongside God.',
  'Watch the three directions in the visual: before, beside, after. These are a way to organize the words, not a picture of God. Isaiah 45 also connects the one God to salvation for all the earth.',
  'Read all six witnesses below. When another passage introduces language you find difficult, hold it beside this established confession instead of silently replacing the confession.'
 ],isaiah,'isaiah-guide','exclusivity'),
 match('isaiah-guide','Test the rival claims','Which passage in Isaiah 43–45 answers each claim about God?',[
  {id:'earlier',label:'“Perhaps an earlier deity made this God.”',answer:'before',explanation:'Isaiah 43:10 explicitly excludes a God formed before the LORD.'},
  {id:'alongside',label:'“Another God could exist alongside him.”',answer:'beside',explanation:'Isaiah 44:6 directly rules out a God beside him.'},
  {id:'local',label:'“This God can only call Israel to salvation.”',answer:'earth',explanation:'Isaiah 45:22 calls all the ends of the earth to the one God.'}
 ],[{id:'earth',label:'Isaiah 45:22 · all the ends of the earth'},{id:'before',label:'Isaiah 43:10 · no God before me'},{id:'beside',label:'Isaiah 44:6 · no God beside me'}],'isaiah-try',standards[1].id,{activityLabel:'Evidence challenge'}),
 attempt('isaiah-try','Make the cumulative case','Identify four declarations about God in Isaiah 43–46 and explain their significance. Someone argues, “These verses rule out rival gods, but do not by themselves settle every question about divine persons.” State that position fairly, then explain the Apostolic reading of the passages’ absolute exclusivity. Do not misrepresent the other person as believing in three gods.',standards[1],'continuity-show',isaiah),
 show('continuity-show','Follow the same thread',[
  'Jesus answers with the Shema. Paul then says there is no other God but one before addressing “one God, the Father” and “one Lord Jesus Christ.” Read the surrounding contrast with so-called gods: the confession is not introduced as permission to add deities.',
  'Ephesians places one God in the church’s shared confession. First Timothy joins one God to a real human mediator. James affirms one God while warning that recognition without a faithful response is insufficient.',
  'The Apostolic reading keeps Jesus’ identity and real humanity within this monotheistic framework. “Father” and “Lord” must be explained in the passages, not merely counted as labels and turned into a number of gods.'
 ],[mark,...nt],'continuity-guide','story'),
 match('continuity-guide','Build the Scripture trail','Match Deuteronomy 6:4, Mark 12:29, and 1 Corinthians 8:4 to their roles in the biblical witness.',[
 {id:'paul',label:'Paul: “there is none other God but one”',answer:'application',explanation:'Paul applies monotheism while addressing idols and the church’s life.'},
 {id:'moses',label:'Israel: “The LORD our God is one LORD”',answer:'foundation',explanation:'Deuteronomy supplies the foundational confession.'},
 {id:'jesus',label:'Jesus: “The first … Hear, O Israel”',answer:'affirmation',explanation:'Mark records Jesus reaffirming the confession.'}
 ],[{id:'foundation',label:'1 · Foundational confession'},{id:'affirmation',label:'2 · Jesus’ reaffirmation'},{id:'application',label:'3 · Apostolic application'}],'continuity-try',standards[2].id,{activityLabel:'Build the argument'}),
 attempt('continuity-try','Answer a new reading','A reader claims that 1 Corinthians 8:6 changes the confession of Deuteronomy 6:4 by introducing another divine person. Build a short response from Deuteronomy through Jesus to Paul and James. Explain the contribution of 1 Corinthians 8:4–6, Ephesians 4:5–6, 1 Timothy 2:5, and James 2:19, including why the Apostolic reading sees continuity rather than a revised confession.',standards[2],'distinction-show',[shema,mark,...nt]),
 show('distinction-show','Represent the claim fairly',[
  'Classical Trinitarian theology confesses one God, one divine essence or being, in three distinct, coequal and coeternal persons: Father, Son and Holy Spirit. Each person is fully divine; the persons are not three gods or three parts of God. In this teaching, “essence” answers what God is, “person” identifies the eternal distinctions, and “proceeding” describes the Spirit’s eternal relation of origin—not a later creation.',
  'Apostolic Oneness teaching confesses one indivisible God, not three eternal divine persons. Father, Son and Holy Spirit identify God’s revelation and work; the Son is the genuine incarnation of the one God, fully divine and truly human. Jesus’ prayer to the Father is real human prayer, not an acted performance. The Father is not a second God, and God is not confined to Christ’s human body.',
  'The actual disagreement is whether Scripture reveals eternal distinctions of divine persons or the one God manifested in genuine incarnation. Compare John 1:1 and 1:14 (the Word and the incarnation), Matthew 28:19 and Acts 2:38 (the baptismal command and apostolic practice), and Luke 22:42 with 1 Timothy 2:5 (Jesus’ real prayer and human mediation). Represent the Trinitarian interpretation fairly, then explain why the OG.1.4 standard teaches the Apostolic reading.'
 ],incarnation,'distinction-guide','comparison',{sourceCredit:'Reinforcement: UPCI, Our Beliefs; The True Humanity of Jesus Christ. Summary of the one God’s revelation and genuine incarnation; Scripture remains the basis of the lesson.'}),
 match('distinction-guide','Repair the explanation','Classify each statement about classical Trinitarian and Apostolic Oneness theology.',[
 {id:'three',label:'“Trinitarians teach three separate gods.”',answer:'misstates',explanation:'This misstates their claim of one divine essence. Critique the actual distinction of persons.'},
 {id:'persons',label:'“One divine essence, three coeternal persons.”',answer:'trinitarian',explanation:'This states the trinitarian position accurately enough to identify the disagreement.'},
 {id:'human',label:'“The one God became truly human in Jesus; his prayers are real.”',answer:'oneness',explanation:'Genuine incarnation is essential to the Oneness explanation of Jesus’ prayers.'},
 {id:'acting',label:'“Jesus only pretended to pray.”',answer:'misstates',explanation:'Oneness does not erase Jesus’ real humanity or turn his prayer into playacting.'}
 ],[{id:'oneness',label:'Accurate Oneness claim'},{id:'misstates',label:'Misrepresents a position'},{id:'trinitarian',label:'Accurate trinitarian claim'}],'distinction-try',standards[3].id,{activityLabel:'Claim clinic'}),
 attempt('distinction-try','Teach it to someone who disagrees','Explain both positions fairly, including essence, person, and proceeding. Show where their readings of John 1:1 and Matthew 28:19 alongside Acts 2:38 differ. Then answer, “If Jesus is God, who was he praying to?” Ground the Apostolic explanation in genuine incarnation and Scripture. Bring back the Shema and Isaiah as the framework, without dismissing the other person.',standards[3],'devotion-show',[shema,...incarnation,...nt.slice(2,3)]),
 show('devotion-show','One Lord. An undivided response.',[
  'The next verse after the Shema commands love for God with all the heart, soul, and might. Confession leads directly to allegiance. The first commandment excludes rival gods; the second forbids making an image to worship. God does not receive a compartment of life while another authority governs the rest.',
  'Deuteronomy 6:5 calls for love with all the heart, soul and might. The OG.1.5 standard connects this confession to worship directed to the one Lord, an undivided moral allegiance, and one gospel offered to all people. This is the principle to understand here; particular ethical laws belong in the lessons where those laws are taught.',
  'Knowing the confession does not by itself demonstrate wholehearted love. Rather than introducing an unrelated moral dilemma, connect the first and second commandments to the Shema: no rival gods, no images for worship, and no divided devotion. Then explain how one God shapes worship, personal allegiance and the apostolic witness.'
 ],[verse('Deuteronomy 6:5','And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.','KJV. The command immediately follows the confession.'),verse('Exodus 20:3-5','Thou shalt have no other gods before me.','KJV excerpt from verse 3. Read verses 4–5 for the prohibition of images and bowing down to them.'),nt[3]],'devotion-guide','devotion'),
 {id:'devotion-guide',type:'scenario',stageId:'checkpoint',phase:'Guide me',title:'Trace the meaning of undivided devotion',standardIds:[standards[4].id],teaching:['Read Deuteronomy 6:4–5 as one confession followed by a command. The one LORD calls for love with the whole heart, soul and might; the first two commandments exclude rival worship.'],prompt:'What relationship exists between Deuteronomy 6:4–5 and exclusive worship?',authoredFeedback:true,
 choices:[
 {id:'separate',label:'The Shema is only a statement about numbers; verse 5 is unrelated.',teachingMessage:'Verse 5 immediately commands love for the LORD with the whole heart, soul and might. The confession and the response belong together.'},
 {id:'honest',label:'Because there is one LORD, he alone receives worship and our undivided allegiance.',teachingMessage:'Yes. This directly explains the Shema’s connection to wholehearted love, the commandments against rival worship, and the unity of Christian mission and life.'},
 {id:'abandon',label:'The confession matters only as an argument against other theological views.',teachingMessage:'OG.1.5 includes the response of worship, love, ethics and mission—not just an intellectual claim. Explain the connection without inventing a separate scenario.'}
 ],expectedChoiceIds:['honest'],evidenceIds:[],next:{strong:'devotion-try',partial:'devotion-guide',weak:'devotion-guide'}},
 attempt('devotion-try','Bring the confession into life','Explain the relationship between Deuteronomy 6:4–5, exclusive worship, and wholehearted devotion and relate the confession to the first two commandments. Explain why the one LORD requires exclusive worship and undivided moral allegiance, and how the same confession shapes the one apostolic gospel and care for the community. Stay within the OG.1.5 learning objectives rather than introducing unrelated moral cases.',standards[4],'complete',[shema,verse('Deuteronomy 6:5','And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.','KJV.'),nt[3]]),
 {id:'complete',type:'complete',stageId:'mastery',title:'One story, five connections.'}
];
for(const [index,prefix] of ['shema','isaiah','continuity','distinction','devotion'].entries()) {
 moves.find(m=>m.id===`${prefix}-show`).standardIds=[standards[index].id];
}
// Complete one goal at a time: Show me -> Guide me -> Let me try.
// The optional reasoning challenges remain part of their own chapters.
// This order is easier to learn from, resume, and review on a phone.
const guidedRoute={
 'shema-guide':'context-challenge',
 'context-challenge':'shema-try',
 'shema-try':'isaiah-show',
 'isaiah-guide':'isaiah-try',
 'isaiah-try':'continuity-show',
 'continuity-guide':'continuity-try',
 'continuity-try':'distinction-show',
 'prayer-challenge':'distinction-guide',
 'distinction-guide':'distinction-try',
 'distinction-try':'devotion-show',
 'devotion-guide':'devotion-try',
 'devotion-try':'complete'
};
deepenOG1(moves);
for(const [id,next] of Object.entries(guidedRoute))moves.find(m=>m.id===id).next.strong=next;

const lessonChapters=[
 {standardId:standards[0].id,title:'The Shema',question:'What does Deuteronomy 6:4 actually confess?',anchor:'Deuteronomy 6:4–5'},
 {standardId:standards[1].id,title:'Isaiah’s witness',question:'How does God exclude every rival claim?',anchor:'Isaiah 43:10; 44:6; 45:5'},
 {standardId:standards[2].id,title:'The same confession',question:'Do Jesus and the apostles change the confession?',anchor:'Mark 12:29; 1 Corinthians 8:4–6'},
 {standardId:standards[3].id,title:'Explain the difference',question:'Where do Oneness and Trinitarian readings differ?',anchor:'John 1:1, 14; 1 Timothy 2:5'},
 {standardId:standards[4].id,title:'Love the one Lord',question:'How does the confession shape everyday allegiance?',anchor:'Deuteronomy 6:4–5; James 2:19'}
];
const orderedMoves=[];
let cursor='learn';
while(cursor){const move=moves.find(m=>m.id===cursor);orderedMoves.push(move);cursor=move.next?.continue || move.next?.strong;}
const knowledge=standards.flatMap(s=>s.evidence.map(e=>({id:`${s.id}:evidence-${e.level}`,title:`${s.title}: ${e.label}`,description:e.text})));
const authoredLesson = {...base,standardId:'OG.1.LESSON.18',standardTitle:'One God: the confession through Scripture',lessonFormat:'teacher-led',coveredStandards:standards,lessonChapters,instructionalMoves:orderedMoves,curriculumVersion:1,
 sourceDomain:{...base.sourceDomain,vocabulary:[{term:'Shema',definition:'Hebrew for hear; the opening word used to name Israel’s confession in Deuteronomy 6:4.'},{term:'Echad',definition:'Hebrew for one. Interpret the word in the setting of the passage; this lesson develops its Apostolic interpretation alongside Isaiah’s declarations.'},{term:'Monotheism',definition:'Belief in one God.'},{term:'Incarnation',definition:'God becoming truly human in Jesus Christ; his humanity is genuine.'},{term:'Essence and person',definition:'In trinitarian theology, essence identifies the one divine being and person identifies the three eternal distinctions. Oneness rejects those eternal personal distinctions.'},{term:'Doxology',definition:'Praise directed to God; this lesson connects confession to worship.'}]},
 completionSummary:'You investigated the confession, weighed Isaiah’s witnesses, traced New Testament continuity, explained the doctrinal distinction fairly, and connected the confession to life.',
 takeaways:['Read the Shema within its covenant and scriptural context.','Let Isaiah’s declarations accumulate into an argument.','Trace the confession through Jesus and the apostles.','Represent another position accurately before explaining the Apostolic response.','Connect the confession to worship, ethics, and mission.'],
 presets:Object.fromEntries(Object.entries(base.presets).map(([id,p])=>[id,{...p,currentMoveId:'learn',currentStageId:'truth'}])),
 brain:{...base.brain,masteryTarget:standards.map(s=>s.statement).join('\n'),requiredKnowledge:knowledge,evidenceOfUnderstanding:knowledge,requiredScripture:[shema,mark,...isaiah,...nt,...incarnation],teacherGuardrails:[...base.brain.teacherGuardrails,'Assess only the current standard. All its listed criteria must be demonstrated for strong. Do not infer recall from copied support. Be precise and respectful about trinitarian beliefs. Teach the supplied Apostolic interpretation without presenting a caricature of other Christians.']}};


// Refreshes chapter plans from the approved standards. When those standards are
// revised, a fresh, source-derived lesson replaces stale authored scenes.
export default alignAuthoredOrRegenerate({authored:authoredLesson,base,standards,domain});
