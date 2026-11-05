// Presentation only: never changes learning progression, evidence, or mastery.
export function getOG1ChapterNumber(content, move) {
 return (content.lessonChapters || []).findIndex(chapter =>
  (move?.standardIds || []).includes(chapter.standardId)) + 1;
}

export function getOG1LessonLocation(content, move, screen = 'exam', examSubmitted = false) {
 const chapterNumber = getOG1ChapterNumber(content, move);
 if (move?.type === 'complete') {
  const states = {
   exam: {title:examSubmitted?'Exit exam results':'Exit exam · in progress',next:'Your Understanding'},
   understanding: {title:'Your Understanding',next:'Final lesson summary'},
   summary: {title:'Final lesson summary',next:'Optional pilot survey'},
   survey: {title:'Pilot feedback · optional',next:'Return to Jeremiah'},
  };
  return {...(states[screen] || states.exam),chapterNumber:0,phase:screen};
 }
 const nextId = move?.next?.continue || move?.next?.strong;
 const nextMove = content.instructionalMoves.find(item => item.id === nextId);
 const nextChapter = getOG1ChapterNumber(content, nextMove);
 const chapter = content.lessonChapters?.[chapterNumber-1];
 let next = nextMove?.title || 'Continue the lesson';
 if (nextMove?.type === 'complete') next = '10-question exit exam';
 else if (nextChapter && nextChapter !== chapterNumber) {
  next = `Chapter ${nextChapter} · ${content.lessonChapters[nextChapter-1].title}`;
 }
 return {chapterNumber,phase:'teaching',title:chapterNumber?`Chapter ${chapterNumber} · ${chapter.title}`:
  move?.id==='learn'?'The opening · A confession begins':'The One True God',next};
}
