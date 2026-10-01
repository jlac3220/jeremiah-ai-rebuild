// The imported standard remains authoritative. These helpers select its evidence;
// they never substitute a video's theology for the lesson's Scripture.
const stop = new Set('the and that this with from into must student learner standard scripture teaching demonstrates explains'.split(' '));
function words(text) { return String(text).toLowerCase().match(/[a-z]{4,}/g)?.filter(w=>!stop.has(w)) || []; }
function similarity(a,b) { const set=new Set(words(a));return words(b).reduce((n,w)=>n+(set.has(w)?1:0),0); }
export function getLessonExperience(content) {
 const standard=content.sourceStandard;
 const focus=standard.title+' '+standard.statement+' '+standard.focus;
 const ranked=content.sourceDomain.scripture.map((verse,index)=>({verse,index,score:similarity(focus,verse.function+' '+verse.reference)})).sort((a,b)=>b.score-a.score || a.index-b.index);
 const witnesses=ranked.slice(0,3).map(v=>v.verse);
 const vocabulary=[...content.sourceDomain.vocabulary].sort((a,b)=>similarity(focus,b.term+' '+b.relevance)-similarity(focus,a.term+' '+a.relevance)).slice(0,3);
 const paragraphs=standard.scope.match(/[^.!?]+[.!?]+(?:[”"])?|[^.!?]+$/g) || [standard.scope];
 const teaching=paragraphs.filter(p=>!/^\s*(?:The (?:student|learner)|A learner|Teach |Help |Use |Contrast )/i.test(p)).map(p=>p.trim().replace(/^This standard (?:establishes that|requires that|teaches that)\s*/i,'').replace(/^This standard is /i,'The truth here is ')).join(' ');
 return {witnesses,vocabulary,teaching:teaching || standard.scope};
}
