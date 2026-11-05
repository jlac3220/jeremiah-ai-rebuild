import LessonIcon from '../../shared/lesson/LessonIcon';
import './OG1StoryClimax.css';

const QUESTIONS=[
 {id:'word',number:'01',reference:'John 1:1, 14',label:'THE WORD',
  question:'How is the Word with God, God, and made flesh?',
  passages:[['John 1:1','In the beginning was the Word, and the Word was with God, and the Word was God.'],['John 1:14','And the Word was made flesh, and dwelt among us']],
  trinitarian:'The Word is the eternal Son, personally distinct from the Father yet sharing the one divine being, who becomes truly human.',
  oneness:'The Word is God’s own self-expression, made flesh in Jesus: the one God genuinely incarnate, rather than a second eternal divine person.',
  limit:'Both affirm Jesus’ deity and genuine humanity. The disagreement concerns eternal personal distinction; the word echad alone did not answer it.'},
 {id:'name',number:'02',reference:'Matthew 28:19 · Acts 2:38',label:'THE NAME',
  question:'How do the baptismal command and Peter’s instruction fit together?',
  passages:[['Matthew 28:19','baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:'],['Acts 2:38','be baptized every one of you in the name of Jesus Christ for the remission of sins,']],
  trinitarian:'The commission names Father, Son and Holy Spirit as distinct persons. Baptism in Jesus’ name expresses his authority; Acts does not cancel the commission.',
  oneness:'The singular name in the commission is understood through Peter’s instruction to baptize in Jesus Christ’s name: the one God revealed in Jesus.',
  limit:'Both texts must be read together. A singular “name” alone does not settle the entire doctrine of God.'},
 {id:'prayer',number:'03',reference:'Luke 22:42 · 1 Timothy 2:5',label:'THE PRAYER',
  question:'If Jesus is God, who is he praying to?',
  passages:[['Luke 22:42','Father, if thou be willing, remove this cup from me: nevertheless not my will, but thine, be done.'],['1 Timothy 2:5','For there is one God, and one mediator between God and men, the man Christ Jesus;']],
  trinitarian:'The incarnate Son prays to the Father. His real human will is distinguished from the divine will; Father and Son are eternally distinct persons.',
  oneness:'Jesus prays as a genuine human being to the Father, the one God. His human will and mediation are real; the prayer is not acting, and God is not confined to his body.',
  limit:'The prayer must be explained, not denied. The Apostolic account appeals to genuine incarnation, not a conversation acted out for an audience.'}
];
export function OG1IdentityInvestigation({sequenceIndex=0,revealedThrough=sequenceIndex,onInspect,onOpenBible}) {
 const active=Math.max(0,Math.min(sequenceIndex,2)),item=QUESTIONS[active];
 function keydown(event){const targets={ArrowLeft:active-1,ArrowRight:active+1,Home:0,End:revealedThrough};if(!(event.key in targets))return;event.preventDefault();const next=targets[event.key];if(next<0||next>revealedThrough||next>2)return;event.currentTarget.parentElement.querySelectorAll('button')[next].focus();onInspect?.(next);}
 return <div className="og1-identity" data-question={item.id}>
   <div className="og1-identity-hero">
    <span>RETURN TO OUR QUESTION · ONE LORD</span>
    <h2>One God. How do we understand Jesus?</h2>
    <p>{active===0?'Echad gave us “one,” not a complete account of Father, Son and Spirit. Isaiah excluded rivals; Jesus and Paul carried the confession forward. These next passages raise the question we promised to return to.':'Keep the one-God confession in view. Follow how each reading explains this next pair of passages.'}</p>
   </div>
   <div className="og1-identity-deck" role="group" aria-label="Three Scripture questions about Jesus">
    {QUESTIONS.map((q,i)=><button type="button" key={q.id} disabled={i>revealedThrough} onClick={()=>onInspect?.(i)} onKeyDown={keydown} aria-pressed={active===i} aria-controls="og1-identity-reasoning">
     <span>{q.number} · {q.label}</span><strong>{q.reference}</strong>
    </button>)}
   </div>
   <section id="og1-identity-reasoning" className="og1-identity-question" key={item.id} aria-live="polite" aria-atomic="true">
    <div><span>READ THE PASSAGE PAIR · {item.number} / 03</span>
     <h3>{item.question}</h3>
     {item.passages.map(([ref,text])=><div className="og1-identity-passage" key={ref}><blockquote>“{text}”</blockquote><button type="button" className="og1-inquiry-read" onClick={()=>onOpenBible?.(ref)}>{ref} · KJV <LessonIcon name="context"/></button><small>KJV excerpt · Read in context.</small></div>)}
    </div>
    <div className="og1-identity-implication">
     <span>TWO READINGS · THE SAME PASSAGES</span>
     <div><strong>Trinitarian</strong><p>{item.trinitarian}</p></div>
     <div><strong>Apostolic Oneness</strong><p>{item.oneness}</p></div>
     <div className="og1-identity-limit"><strong>What this clarifies</strong><p>{item.limit}</p></div>
    </div>
   </section>
   <p className="og1-identity-transition"><strong>{active===2?'Now we can compare fairly.':'Follow the question, not just a label.'}</strong> {active===2?'We have examined Word, name and prayer. Both readings confess one God and genuine incarnation; the difference concerns eternal persons. Gather the interpretations before explaining the Apostolic conclusion.':'The blue action takes you through each passage pair. Then we will name the shared confession, the actual disagreement and the Apostolic reasons.'}</p>
 </div>;
}


export function OG1ReturnToShema({onOpenBible}) {
 return <div className="og1-return">
  <div className="og1-return-heading">
   <span>RETURN TO THE BEGINNING</span>
   <h2>Knowing who He is changes how we respond.</h2>
   <p>The doctrinal investigation matters because we must know whom we worship. But this final chapter does not depend on winning a comparison. We have now explained why the Apostolic reading understands one God genuinely incarnate in Jesus. We return to Moses: the confession of who the LORD is, followed by the command to love Him.</p>
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
  <button type="button" onClick={()=>onOpenBible?.('Deuteronomy 6:4-5')}>Read both verses together in the Bible <LessonIcon name="context"/></button>
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
     <button type="button" className="og1-consequence-read" onClick={()=>onOpenBible?.(item.displayReference)}>Read in context <LessonIcon name="context"/></button>
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
    <small>{w.reference} <LessonIcon name="context"/></small>
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
