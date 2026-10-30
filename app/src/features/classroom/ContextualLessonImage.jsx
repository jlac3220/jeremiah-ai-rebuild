import {useEffect,useState} from 'react';
import {createVisualBrief,chooseLessonVisual} from '../../core/classroom/visualIntelligence';
import {VISUAL_ASSETS} from '../../data/curriculum/visualCatalog';

// Shared classroom visual outlet for OG, NB and future approved standards.
// No matched, reviewed asset means no picture, not a random fallback.
export default function ContextualLessonImage({content,move,placement,className=''}) {
 const brief=placement?createVisualBrief({content,move,placement}):null;
 const decision=brief?chooseLessonVisual(brief,VISUAL_ASSETS):null;
 const visual=decision?.asset;
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[visual?.id]);
 if(!visual||failed)return null;
 return <figure className={'jeremiah-context-image '+className} style={{margin:'20px 0',position:'relative'}}>
  <img src={visual.src} alt={visual.alt} loading="lazy" decoding="async"
   onError={()=>setFailed(true)} style={{width:'100%',maxHeight:420,objectFit:'cover',borderRadius:14,display:'block'}}/>
  <figcaption style={{fontSize:12,marginTop:8,opacity:.76}}>
   {visual.credit||'Supporting illustration'}{decision.reviewRequired?' · Editorial/rights review required':''}
  </figcaption>
 </figure>;
}
