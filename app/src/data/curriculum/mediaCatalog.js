import sources from './media.json' with { type: 'json' };
// A broad domain match is not sufficient. Video selection requires reviewed content,
// an explicit lesson placement, and a reason for any later return to the same video.
export function getLessonMedia(content) {
 return sources.filter(source=>source.review?.status==='approved' && source.review?.doctrinalAlignment==='apostolic-pentecostal' && source.lessonPlacements?.some(p=>p.standardId===content.standardId && p.purpose)).slice(0,1);
}
