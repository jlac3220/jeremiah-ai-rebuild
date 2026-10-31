import {useState} from 'react';
import './OG1StoryClimax.css';

const QUESTIONS=[
 {id:'word',number:'01',reference:'John 1:1, 14',label:'THE WORD',
  question:'If the Word was with God—and was God—what does it mean that the Word became flesh?',
  quotation:'“And the Word was made flesh, and dwelt among us”',
  from:'John 1:14 · KJV excerpt',
  connection:'Both readings take John seriously. The question is how the Word, the one God, and the incarnation relate—not whether John has introduced a second god.'},
 {id:'name',number:'02',reference:'Matthew 28:19 · Acts 2:38',label:'THE NAME',
  question:'Jesus commands baptism in the name of Father, Son, and Holy Ghost. Why does Peter name Jesus Christ?',
  quotation:'“be baptized every one of you in the name of Jesus Christ”',
  from:'Acts 2:38 · KJV excerpt',
  connection:'Read the commission and apostolic practice together. The readings differ in how they understand the name and the relationship of Father, Son, and Spirit.'},
 {id:'prayer',number:'03',reference:'Luke 22:42 · 1 Timothy 2:5',label:'THE PRAYER',
  question:'When Jesus prays to the Father, how should we understand both his deity and his genuine humanity?',
  quotation:'“nevertheless not my will, but thine, be done.”',
  from:'Luke 22:42 · KJV excerpt',
  connection:'The prayer is real. The Apostolic account must explain real human willing and mediation without pretending Jesus was acting; Trinitarian teaching explains it with personal distinctions and the incarnate Son.'}
];
export function OG1IdentityInvestigation({onOpenBible}) {
 const [active,setActive]=useState(0);
 const item=QUESTIONS[active];
 return <div className="og1-identity">
   <div className="og1-identity-hero">
    <span>A DISTINCT DOCTRINAL INVESTIGATION</span>
    <p>Israel confessed one LORD. Isaiah excluded every rival. Jesus repeated the confession. Paul carried it into the church.</p>
    <h2>Who is the God we confess?</h2>
    <p>Knowing who God is matters to worship. Scripture must shape our understanding of the One we love, not the other way around. This focused investigation compares how Trinitarian and Apostolic Oneness teaching explain Father, Son, and Holy Spirit. Both confess one God; the interpretations differ.</p>
   </div>
   <div className="og1-identity-deck" role="group" aria-label="Three Scripture questions about Jesus">
    {QUESTIONS.map((q,i)=><button type="button" key={q.id} onClick={()=>setActive(i)} aria-pressed={active===i}>
     <span>{q.number} · {q.label}</span><strong>{q.reference}</strong>
    </button>)}
   </div>
   <section className="og1-identity-question" aria-live="polite">
    <div><span>EXAMINE THE PASSAGES · {item.number} / 03</span>
     <h3>{item.question}</h3>
     <blockquote>{item.quotation}</blockquote>
     <small>{item.from}</small>
    </div>
    <div className="og1-identity-implication">
     <span>WHY IT MATTERS</span>
     <p>{item.connection}</p>
     <button type="button" onClick={()=>onOpenBible?.(item.reference.split(' · ')[0].split(',')[0])}>Read in Jeremiah’s Bible ↗</button>
    </div>
   </section>
   <p className="og1-identity-transition"><strong>Why study this?</strong> What we believe about God affects what we mean when we confess Jesus as Lord and how we understand the Father, Son, and Holy Spirit. But an accurate explanation is not, by itself, wholehearted devotion.</p>
 </div>;
}


export function OG1ReturnToShema({onOpenBible}) {
 return <div className="og1-return">
  <div className="og1-return-heading">
   <span>RETURN TO THE BEGINNING</span>
   <h2>Knowing who He is changes how we respond.</h2>
   <p>The doctrinal investigation matters because we must know whom we worship. But this final chapter does not depend on winning a comparison. We return to Moses: the confession of who the LORD is, followed by the command to love Him.</p>
  </div>
  <div className="og1-return-verses">
   <section>
    <span>DEUTERONOMY 6:4</span>
    <blockquote>“Hear, O Israel: The LORD our God is one LORD:”</blockquote>
    <small>THE CONFESSION</small>
   </section>
   <div className="og1-return-arrow" aria-hidden="true">→</div>
   <section>
    <span>DEUTERONOMY 6:5</span>
    <blockquote>“And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.”</blockquote>
    <small>THE RESPONSE</small>
   </section>
  </div>
  <p className="og1-return-connection"><strong>Knowing Him gives direction to devotion.</strong> Verse 4 identifies the LORD to whom Israel belongs. Verse 5 commands love directed to that very LORD—with the whole heart, soul, and might. Accurate understanding is necessary; knowledge alone is not the response.</p>
  <button type="button" onClick={()=>onOpenBible?.('Deuteronomy 6:4-5')}>Read both verses together in the Bible ↗</button>
 </div>;
}

const CONSEQUENCES=[
 {step:'01',eyebrow:'THE LORD ALONE',title:'One God means no rival worship.',
  reference:'Exodus 20:3–5',displayReference:'Exodus 20:3',
  quote:'“Thou shalt have no other gods before me.”',
  setup:'Isaiah has already excluded every rival. The first commandment now makes that truth a demand on Israel’s worship.',
  revealTitle:'THE CONNECTION',reveal:'This is not a choice between two equal religious preferences. The God who says there is none beside him commands worship that belongs to him alone.',
  btn:'Uncover the consequence'},
 {step:'02',eyebrow:'THE RESPONSE',title:'The confession is followed by a command.',
  reference:'Deuteronomy 6:4–5',displayReference:'Deuteronomy 6:5',
  quote:'“And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.”',
  setup:'Deuteronomy does not end at “one LORD.” Verse 5 answers what the confession requires of a person who hears it.',
  revealTitle:'THE CONNECTION',reveal:'To confess one LORD while reserving part of life for rival allegiance is to separate what Deuteronomy joins together: who God is and the response he commands.',
  btn:'Connect verse 4 to verse 5'},
 {step:'03',eyebrow:'THE CONTINUING WITNESS',title:'The same confession reaches the church.',
  reference:'Mark 12:29 · 1 Corinthians 8:4',displayReference:'1 Corinthians 8:4',
  quote:'“there is none other God but one.”',
  setup:'Jesus repeats Israel’s confession. Paul carries it into a world full of idols and competing claims of worship.',
  revealTitle:'THE CONNECTION',reveal:'The one-God confession does not expire when the New Testament begins. It shapes the church’s worship, witness, and the one gospel it proclaims.',
  btn:'Trace the confession forward'}
];
export function OG1ConsequenceJourney({index,expanded,onReveal,art,onOpenBible}) {
 const item=CONSEQUENCES[index]||CONSEQUENCES[0];
 return <div className="og1-consequence">
   <p className="og1-consequence-lead">The confession tells us <strong>who</strong> receives our devotion. The very next verse tells us <strong>how</strong> to respond. Knowing the one LORD shapes exclusive worship, wholehearted love, and faithful witness.</p>
   <div className="og1-consequence-progress" aria-label={'Consequence '+(index+1)+' of 3'}>
    {CONSEQUENCES.map((x,i)=><span key={x.step} className={i<=index?'is-current':''}>{x.step}</span>)}
   </div>
   <section className="og1-consequence-stage">
    <div className="og1-consequence-art">{art}</div>
    <div className="og1-consequence-copy">
     <span>{item.eyebrow} · {item.step} / 03</span>
     <h2>{item.title}</h2>
     <blockquote>{item.quote}</blockquote>
     <small>{item.displayReference} · KJV</small>
     <p>{item.setup}</p>
     <button type="button" className="og1-consequence-read" onClick={()=>onOpenBible?.(item.displayReference)}>Read in context ↗</button>
    </div>
   </section>
   {!expanded?<button className="og1-consequence-reveal" type="button" onClick={onReveal}>{item.btn} <span>↗</span></button>
   :<div className="og1-consequence-revealed" role="status"><span>{item.revealTitle}</span><p>{item.reveal}</p></div>}
 </div>;
}

const WITNESSES=[
 {who:'MOSES',what:'The LORD our God is one LORD',reference:'Deuteronomy 6:4'},
 {who:'ISAIAH',what:'beside me there is no God',reference:'Isaiah 44:6'},
 {who:'JESUS',what:'The Lord our God is one Lord',reference:'Mark 12:29'},
 {who:'PAUL',what:'there is none other God but one',reference:'1 Corinthians 8:4'}
];
export function OG1FinalSynthesis({onOpenBible}) {
 return <div className="og1-synthesis">
  <div className="og1-synthesis-head">
   <span>THE ENTIRE CASE · FIVE STANDARDS</span>
   <h2>One confession. Every witness. One response.</h2>
   <p>From Moses and Isaiah through Jesus and Paul, Scripture identifies the one LORD. Knowing who He is is essential: it gives our worship its object, our allegiance its direction, and our love its meaning. Deuteronomy 6:5 then tells us what that knowledge calls for.</p>
  </div>
  <div className="og1-synthesis-witnesses">
   {WITNESSES.map((w,i)=><button type="button" onClick={()=>onOpenBible?.(w.reference)} key={w.who}>
    <span>0{i+1} / {w.who}</span>
    <strong>“{w.what}”</strong>
    <small>{w.reference} ↗</small>
   </button>)}
  </div>
  <div className="og1-synthesis-verdict">
   <span>THE COMMAND THAT FOLLOWS</span>
   <blockquote>“And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.”</blockquote>
   <small>DEUTERONOMY 6:5 · KJV</small>
   <p>Knowing the LORD is not an optional definition exercise. The revelation of who He is shapes the devotion He requires. But a correct confession is not the end: exclusive worship, wholehearted love, and faithful witness are its lived response.</p>
  </div>
 </div>;
}
