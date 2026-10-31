import {OG1_EVIDENCE_BY_ID} from '../../data/curriculum/og1Evidence';
import './OG1ManuscriptImage.css';

// A restrained source illustration, not another activity or a competing card.
// The caption makes clear when a general manuscript photo is not the exact verse.
export default function OG1ManuscriptImage({artifactId}){
 const item=OG1_EVIDENCE_BY_ID[artifactId];
 if(!item)return null;
 return <figure className="og1-manuscript-image">
  <img src={item.image} alt={item.imageAlt} loading="lazy" onError={event=>{event.currentTarget.closest('figure').hidden=true}}/>
  <figcaption><strong>{item.title}</strong><span>{item.imageNote}</span></figcaption>
 </figure>;
}
