import {useState} from 'react';

// Classroom imagery is chosen during editorial preparation, not at run time.
// A visual stays bound to its reviewed teaching placement. Search/discovery
// may generate candidates for the editorial workflow, never for a learner.
export default function useDiscoveredLessonVisual(brief,assignedAsset=null) {
 const identity = JSON.stringify({
  standardId:brief?.standardId || '',
  revision:brief?.revision || '',
  intent:brief?.intent || '',
  reference:brief?.reference || '',
  subject:brief?.subject || '',
  topic:brief?.topic || '',
  learningGoal:brief?.learningGoal || '',
  assetId:assignedAsset?.id || ''
 });
 const [failedIdentity,setFailedIdentity]=useState(null);
 const asset = failedIdentity===identity ? null : assignedAsset;
 return {
  asset,
  loading:false,
  discovered:false,
  onError:()=>setFailedIdentity(identity)
 };
}
