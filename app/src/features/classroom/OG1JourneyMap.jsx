import './OG1JourneyMap.css';

// Location guide for the five approved OG.1 standards, not another lesson.
export const OG1_JOURNEY_CHAPTERS=Object.freeze([
 {id:'shema',number:'01',title:'The Shema',eyebrow:'THE FOUNDATION',
  scripture:'DEUTERONOMY 6:4–5',question:'Who is the LORD Israel is called to hear?',
  summary:'Begin with the confession itself. Hear the words, explore their meaning, and discover the command that follows.'},
 {id:'isaiah',number:'02',title:'Isaiah’s Witness',eyebrow:'THE EXCLUSIVE CLAIM',
  scripture:'ISAIAH 43–45',question:'Is there another God before, beside, or after Him?',
  summary:'Examine Isaiah’s declarations and see why the LORD is not simply first among rivals.'},
 {id:'continuity',number:'03',title:'Jesus and the Apostles',eyebrow:'THE CONTINUING CONFESSION',
  scripture:'MARK 12 · 1 CORINTHIANS 8',question:'Does the confession change in the New Testament?',
  summary:'Hear Jesus repeat the confession and see how Paul teaches it to the church.'},
 {id:'distinction',number:'04',title:'Understanding the Difference',eyebrow:'THE DOCTRINAL INVESTIGATION',
  scripture:'JOHN 1 · MATTHEW 28 · ACTS 2',question:'How do Oneness and Trinitarian explanations differ?',
  summary:'Study the interpretations carefully. This is a focused investigation, not a detour from the biblical confession.'},
 {id:'devotion',number:'05',title:'Knowing Him. Loving Him.',eyebrow:'THE RESPONSE',
  scripture:'DEUTERONOMY 6:4–5',question:'How does knowing who God is shape our devotion?',
  summary:'Return to the Shema: the one LORD is the object of worship, allegiance, love, and witness.'}
]);

// activeChapter 0=prologue, 1..5=current chapter, 6=exit exam, 7=complete.
// Earlier chapters are "covered", not "mastered": learners can skip checks.
function progressStatus(position,activeChapter){
 if(activeChapter===0)return position===1?'START HERE':'AHEAD';
 if(activeChapter>=6)return 'COVERED';
 if(position===activeChapter)return 'YOU ARE HERE';
 return position<activeChapter?'COVERED':'AHEAD';
}

export function OG1JourneyMap({activeChapter=0,compact=false}){
 return <section className={'og1-journey og1-journey--minimal'+(compact?' og1-journey--compact':'')}
  aria-label="OG.1 five-chapter learning map">
  {!compact&&<header className="og1-journey-minimal-heading">
    <span>OG.1 · YOUR JOURNEY</span>
    <h2>One God. One unfolding story.</h2>
    <p>Five chapters. One final examination.</p>
   </header>}
  <ol className="og1-journey-minimal-list">
   {OG1_JOURNEY_CHAPTERS.map((item,index)=>{
    const status=progressStatus(index+1,activeChapter);
    return <li key={item.id} aria-current={status==='YOU ARE HERE'||status==='START HERE'?'step':undefined}
      className={'og1-journey-minimal-item '+(status==='YOU ARE HERE'||status==='START HERE'?'is-current':status==='COVERED'?'is-covered':'is-ahead')}>
      <span className="og1-journey-minimal-number">{item.number}</span>
      <strong>{item.title}</strong>
      <span className="og1-journey-minimal-status">{status==='YOU ARE HERE'||status==='START HERE'?'●':status==='COVERED'?'✓':'○'}</span>
      <span className="og1-journey-sr-only">{status}</span>
     </li>;
   })}
  </ol>
  <div className={'og1-journey-minimal-exam'+(activeChapter>=6?' is-current':'')}>
   <span aria-hidden="true">✦</span><span>Final · 10-question exit exam</span>
   <strong>{activeChapter>=7?'Complete':activeChapter===6?'You are here':''}</strong>
  </div>
 </section>;
}

export function OG1JourneyLocation({activeChapter=0,expanded=false,onToggle}){
 const here=activeChapter>0&&activeChapter<=5?OG1_JOURNEY_CHAPTERS[activeChapter-1]:null;
 const next=activeChapter===0?OG1_JOURNEY_CHAPTERS[0]:
  activeChapter<5?OG1_JOURNEY_CHAPTERS[activeChapter]:null;
 return <div className="og1-journey-location" aria-label="Position in OG.1">
   <div className="og1-journey-location-now">
    <span>{activeChapter===0?'OPENING':activeChapter===6?'FINAL ASSESSMENT':activeChapter>=7?'JOURNEY COMPLETE':'CHAPTER '+here.number+' / 05'}</span>
    <strong>{activeChapter===0?'The confession begins':activeChapter===6?'Exit Exam':activeChapter>=7?'One complete story':here.title}</strong>
   </div>
   <span className="og1-journey-location-divider" aria-hidden="true">›</span>
   <div className="og1-journey-location-next">
    <span>{activeChapter>=7?'FINISHED':'UP NEXT'}</span>
    <strong>{next?next.title:activeChapter===5?'10-question exit exam':activeChapter===6?'Final summary':'Review and continue'}</strong>
   </div>
   <button type="button" aria-expanded={expanded} aria-controls="og1-journey-recap" onClick={onToggle}>
    {expanded?'Close map':'View journey'} <span aria-hidden="true">{expanded?'−':'↗'}</span>
   </button>
  </div>;
}
