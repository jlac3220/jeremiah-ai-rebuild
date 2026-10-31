import {OG1_EVIDENCE_BY_ID} from '../../data/curriculum/og1Evidence';
import './OG1ManuscriptMoment.css';

// A real textual witness appears only at its matching Scripture moment.
// Photo notes are visible so a collection-wide image is not passed off as
// a photograph of the exact quoted verse.
export default function OG1ManuscriptMoment({artifactId,onExplore}){
 const item=OG1_EVIDENCE_BY_ID[artifactId];
 if(!item)return null;
 return <aside className="og1-manuscript-moment" aria-label={'Historical manuscript: '+item.title}>
  <div className="og1-manuscript-moment-image"><img src={item.image} alt={item.imageAlt} loading="lazy"
    onError={e=>{e.currentTarget.hidden=true;e.currentTarget.parentElement.classList.add('is-unavailable')}}/>
    <span className="og1-manuscript-image-fallback">Manuscript image unavailable</span>
  </div>
  <div className="og1-manuscript-moment-copy">
   <span>FROM THE HISTORICAL RECORD · {item.era}</span>
   <h3>{item.title}</h3>
   <p>{item.description}</p>
   <small>{item.imageNote}</small>
   <button type="button" onClick={()=>onExplore?.(item.id)}>Examine this manuscript <span aria-hidden="true">↗</span></button>
  </div>
 </aside>;
}
