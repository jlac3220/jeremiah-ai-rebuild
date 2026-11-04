// One source of truth for the scene-by-scene reveal sequence.
// Reading is automatic; required learner answers are handled separately.
const THREE_PART_SCENES=new Set(['shema-manuscript','witness','timeline','comparison','mission']);

export function sceneRevealCount(scene) {
 if (!scene) return 1;
 if (scene.kind==='discovery') return Math.max(1,scene.discovery?.options?.length||1);
 return THREE_PART_SCENES.has(scene.kind)?3:1;
}

export function navigateScene(moments,index,revealIndex,direction) {
 if(!Array.isArray(moments)||moments.length===0)return {moment:0,reveal:0,atEnd:true};
 const current=Math.max(0,Math.min(index,moments.length-1));
 const reveal=Math.max(0,Math.min(revealIndex,sceneRevealCount(moments[current])-1));
 if(direction==='next') {
  if(reveal+1<sceneRevealCount(moments[current]))return {moment:current,reveal:reveal+1,atEnd:false};
  if(current+1<moments.length)return {moment:current+1,reveal:0,atEnd:false};
  return {moment:current,reveal,atEnd:true};
 }
 if(reveal>0)return {moment:current,reveal:reveal-1,atEnd:false};
 if(current>0)return {moment:current-1,reveal:sceneRevealCount(moments[current-1])-1,atEnd:false};
 return {moment:0,reveal:0,atEnd:false};
}
