import sources from './media.json' with { type: 'json' };
// A broad domain match is not sufficient. Videos need reviewed content and an
// explicit lesson placement. Context-only material must remain visibly scoped as such.
export function getLessonMedia(content) {
 return sources.filter(source=>{
  const review=source.review;
  const approvedScope=review?.doctrinalAlignment==='apostolic-pentecostal' || (review?.doctrinalAlignment==='context-only' && source.role==='historical_context');
  return review?.status==='approved' && approvedScope && source.lessonPlacements?.some(p=>p.standardId===content.standardId && p.purpose);
 }).slice(0,1);
}
