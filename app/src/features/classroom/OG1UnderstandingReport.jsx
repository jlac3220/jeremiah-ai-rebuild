import './OG1UnderstandingReport.css';

// Presentation only: the rating and evidence are supplied by the unchanged engine.
export default function OG1UnderstandingReport({rating,actions}) {
 return <div className="ogp-depth-report">
  <header className="ogp-report-overview">
   <span className="ogp-understanding-eyebrow">YOUR LEARNING · OG.1</span>
   <h1 id="ogp-understanding-title">Your Understanding</h1>
   <p className="ogp-understanding-level">Level {rating.level} · {rating.label}</p>
   <p>Weighted performance: {rating.score===null?'Not assessed':rating.score+'%'} · Evidence coverage: {rating.coverage}%</p>
   <p>{rating.meaning}</p><p>{rating.note}</p>
  </header>
  {actions}
  <ol className="ogp-depth-report-list">
   {rating.standards.map(item=><li className="ogp-standard-report" key={item.standardId}>
    <div className="ogp-standard-result"><strong>{item.standardId}</strong><span>Level {item.level} · {item.label}</span><small>Weighted performance: {item.score===null?'Not assessed':item.score+'%'} · Evidence coverage: {item.coverage}%</small></div>
    <div className="ogp-standard-explanation"><p>{item.meaning}</p><p><strong>What to work on next:</strong> {item.nextStep}</p>
     {item.recitationVerified!==null&&<small>Deuteronomy 6:4 KJV recitation: {item.recitationVerified?'Verified in the recall check':item.recitationAttempted?'Attempted; not yet verified':'Not yet attempted'}</small>}
     <details><summary>What you demonstrated</summary><p>{item.evidence}</p></details>
    </div>
   </li>)}
  </ol>
 </div>;
}
