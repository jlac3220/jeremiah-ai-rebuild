import {createVisualBrief,chooseLessonVisual,inferVisualPlacement} from '../../core/classroom/visualIntelligence';
import {VISUAL_ASSETS} from '../../data/curriculum/visualCatalog';
import useDiscoveredLessonVisual from './useDiscoveredLessonVisual';

// Every approved study asks for art the same way; no per-study URL mapping.
export default function ContextualLessonImage({content,move,placement,className=''}) {
 const resolvedPlacement=placement||inferVisualPlacement({content,move});
 const brief=resolvedPlacement?createVisualBrief({content,move,placement:resolvedPlacement}):null;
 const approved=brief?chooseLessonVisual(brief,VISUAL_ASSETS).asset:null;
 const {asset:visual,onError}=useDiscoveredLessonVisual(brief,approved);
 if(!visual)return null;
 return <figure className={'jeremiah-context-image '+className} style={{margin:'20px 0',position:'relative'}}>
  <img key={visual.id} src={visual.src} alt={visual.alt} loading="lazy" decoding="async"
   onError={onError} style={{width:'100%',maxHeight:420,objectFit:'cover',borderRadius:14,display:'block'}}/>


 </figure>;
}
