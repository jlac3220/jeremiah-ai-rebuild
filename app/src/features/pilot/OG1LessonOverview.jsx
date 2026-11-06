import BrandLogo from '../../shared/brand/BrandLogo';
import './OG1LessonOverview.css';

// Learner-facing outline. Internal standards remain in the curriculum and scoring engine.
const CHAPTERS=[
 {title:'The Shema',reference:'Deuteronomy 6:4–5',description:'Hear Israel’s confession and discover why it matters.'},
 {title:'Isaiah’s Witness',reference:'Isaiah 43–46',description:'Examine God’s declarations that there is no other God.'},
 {title:'Jesus and the Apostles',reference:'Mark 12:29 · 1 Corinthians 8:4',description:'Follow the same confession into the New Testament.'},
 {title:'Understanding the Difference',reference:'John 1 · Acts 2:38',description:'Explore how Christians interpret the identity of Jesus and the one God.'},
 {title:'Living the Confession',reference:'Deuteronomy 6:5',description:'Consider how knowing the one Lord shapes worship and devotion.'}
];
export default function OG1LessonOverview({onEnter,onBack,resuming=false}){
 return <div className="ogpilot-page og1-overview">
  <header className="ogpilot-top"><BrandLogo/><span>THE ONE TRUE GOD · LESSON PREVIEW</span></header>
  <main className="og1-overview-shell" id="og1-lesson-overview">
   <div className="og1-overview-intro"><span className="ogpilot-eyebrow">BEFORE YOU BEGIN · YOUR GUIDE</span><h1>The One True God</h1><p className="og1-overview-lede">One confession. Five chapters. A journey through the Scriptures from Moses to the apostles—and what those words mean for us today.</p></div>
   <section className="og1-overview-list" aria-labelledby="overview-contents-title">
    <div className="og1-overview-heading"><span>YOUR JOURNEY</span><h2 id="overview-contents-title">Table of Contents</h2><p>You’ll explore Scripture, view scenes, hear narration, and respond to questions along the way. The short video is optional: press Next to continue without watching.</p></div>
    <ol>{CHAPTERS.map((chapter,index)=><li key={chapter.title}><span className="og1-overview-number">{String(index+1).padStart(2,'0')}</span><div><h3>{chapter.title}</h3><p>{chapter.description}</p><small>{chapter.reference}</small></div></li>)}</ol>
    <div className="og1-overview-close"><p>At the end, you’ll check your understanding and have an opportunity to give anonymous feedback. Your progress is saved in this browser.</p><div className="og1-overview-actions"><button className="ogpilot-primary" type="button" onClick={onEnter}>{resuming?'Continue the Lesson':'Enter the Lesson'} <span aria-hidden="true">→</span></button><button className="ogpilot-secondary" type="button" onClick={onBack}>← Back to participant information</button></div></div>
   </section>
  </main>
 </div>;
}
