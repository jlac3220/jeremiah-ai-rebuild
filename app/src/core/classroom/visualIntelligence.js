// One decision path for every classroom. Standards define the teaching target;
// visual assets are optional supporting evidence, never a source of doctrine.
const normalize = value => String(value || '').toLowerCase().replace(/\bdeut\.?\b/g, 'deuteronomy')
 .replace(/\bisa\.?\b/g, 'isaiah').replace(/\b1\s*cor\.?\b/g, '1 corinthians')
 .replace(/\bmark\.?\b/g, 'mark').replace(/[^a-z0-9]+/g, ' ').trim();

function fingerprint(value) {
 const text = JSON.stringify(value);
 let hash = 2166136261;
 for (let i=0;i<text.length;i++) hash = Math.imul(hash ^ text.charCodeAt(i),16777619) >>> 0;
 return hash.toString(16).padStart(8,'0');
}

// Inference is intentionally conservative: only an explicitly cited passage
// can suggest a specific scene automatically. Keywords like 'desert' or 'life'
// are NOT permission to show an unrelated picture.
export function inferVisualPlacement({content={},move={}}={}) {
 if(move.visualPlacement)return move.visualPlacement;
 if(move.type!=='teach')return null;
 const standard=content.sourceStandard || content.coveredStandards?.find(s=>move.standardIds?.includes(s.id)) || {};
 const teaching=[standard.statement,standard.scope,standard.focus,move.title,...(move.teaching||[])].filter(Boolean).join(' ');
 const normalized=normalize(teaching);
 const explicit=(move.scripture||[]).find(verse=>{
  const ref=normalize(verse.reference);
  return ref && normalized.includes(ref);
 });
 if(!explicit)return null;
 return {intent:'scripture',reference:explicit.reference,
  learningGoal:standard.statement||move.title||'Understand the Scripture in context'};
}

// Placement is explicit. A verse or historical claim requires subject- or
// passage-grounded media; a broad life application may use a broad life image.
// Without either kind of meaningful placement, we don't force an illustration.
export function createVisualBrief({content={},move={},placement={}}={}) {
 const standard = content.sourceStandard || content.coveredStandards?.find(s=>move.standardIds?.includes(s.id)) || {};
 const source = (move.scripture || [])[0] || {};
 const reference = placement.reference || source.reference || '';
 const intent = placement.intent || (reference ? 'scripture' : 'none');
 const goal = placement.learningGoal || move.title || standard.statement || content.brain?.masteryTarget || '';
 const revision = fingerprint({
  id:standard.id || content.standardId,statement:standard.statement,scope:standard.scope,
  focus:standard.focus,evidence:standard.evidence,sourceRevision:content.sourceRevision,scripture:move.scripture,
  goal,reference,intent,topic:placement.topic,subject:placement.subject
 });
 return {
  intent,reference,subject:placement.subject || '',topic:placement.topic || '',
  setting:placement.setting || '',purpose:placement.purpose || 'support-understanding',
  learningGoal:goal,standardId:standard.id || move.standardIds?.[0] || content.standardId || '',
  revision,editorialStatus:content.editorialStatus || 'unreviewed'
 };
}

const normalizedIncludes=(arr,value)=>Boolean(value)&&Array.isArray(arr)&&arr.some(v=>normalize(v)===normalize(value));

export function chooseLessonVisual(brief,assets=[],{recentIds=[],failedIds=[]}={}) {
 if(!brief?.learningGoal || brief.intent==='none') return {asset:null,status:'not-needed',brief};
 const matches = assets.filter(asset=>{
  if(!asset?.id || !asset.src || !asset.alt || asset.previewApproved!==true || failedIds.includes(asset.id))return false;
  if(brief.intent==='general') return asset.intent==='general' && normalizedIncludes(asset.topics,brief.topic);
  if(brief.intent==='artifact') return asset.intent==='artifact' && normalizedIncludes(asset.references,brief.reference);
  if(brief.intent==='scripture') return ['scripture','artifact'].includes(asset.intent) && normalizedIncludes(asset.references,brief.reference);
  if(brief.intent==='historical') {
   // Historical scenes must depict the specified subject; if a passage is also
   // specified, it must be an approved reference for the actual illustration.
   return asset.intent==='scripture' && normalizedIncludes(asset.subjects,brief.subject)
    && (!brief.reference || normalizedIncludes(asset.references,brief.reference))
    && (!brief.setting || normalizedIncludes(asset.settings,brief.setting));
  }
  if(brief.intent==='concept') return asset.intent==='concept' && normalizedIncludes(asset.topics,brief.topic)
   && (!asset.references?.length || normalizedIncludes(asset.references,brief.reference));
  return false;
 });
 const ranked=matches.sort((a,b)=>
  (recentIds.includes(a.id)?1:0)-(recentIds.includes(b.id)?1:0)
  || (b.priority||0)-(a.priority||0) || a.id.localeCompare(b.id));
 const asset=ranked[0]||null;
 return {asset,status:asset?'selected':'needs-art',brief,
  reviewRequired:Boolean(asset && (asset.rightsStatus!=='cleared' || brief.editorialStatus==='needs_review'
    || (asset.approvedRevision && asset.approvedRevision!==brief.revision))),
  // A missing image becomes an editorial request, never an unrelated fallback.
  creationBrief:asset?null:{
   intent:brief.intent,reference:brief.reference,subject:brief.subject,topic:brief.topic,
   learningGoal:brief.learningGoal,standardId:brief.standardId,revision:brief.revision,
   instruction:'Find or create a directly relevant, rights-cleared visual; otherwise leave this placement empty.'
  }};
}
