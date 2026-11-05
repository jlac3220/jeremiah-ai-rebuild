import assert from 'node:assert/strict';
import content from '../src/core/classroom/content/OG_1_LESSON.js';
import {getOG1ChapterNumber,getOG1LessonLocation} from '../src/core/classroom/og1LessonLocation.js';

const before=JSON.stringify(content);
const expectedChapters={learn:0,'shema-show':1,'shema-guide':1,'context-challenge':1,
 'shema-recite':1,'shema-try':1,'isaiah-show':2,'isaiah-guide':2,'isaiah-try':2,
 'continuity-show':3,'continuity-guide':3,'continuity-try':3,'distinction-show':4,
 'prayer-challenge':4,'distinction-guide':4,'distinction-try':4,'devotion-show':5,
 'devotion-guide':5,'devotion-try':5,complete:0};
assert.deepEqual(content.instructionalMoves.map(move=>move.id).sort(),Object.keys(expectedChapters).sort());
for(const move of content.instructionalMoves){
 assert.equal(getOG1ChapterNumber(content,move),expectedChapters[move.id],move.id+' chapter');
 const location=getOG1LessonLocation(content,move);
 assert.ok(location.title&&location.next,move.id+' has current and next destination');
 assert.doesNotMatch(location.title+' '+location.next,/mastered|mastery|Journey complete/i);
 if(move.type==='complete')continue;
 const next=content.instructionalMoves.find(item=>item.id===(move.next?.continue||move.next?.strong));
 assert.ok(next,'Authored next move exists');
 const nextChapter=expectedChapters[next.id];
 if(next.type==='complete')assert.equal(location.next,'10-question exit exam');
 else if(nextChapter!==expectedChapters[move.id])assert.match(location.next,new RegExp('^Chapter '+nextChapter+' · '));
 else assert.equal(location.next,next.title,'Same-chapter next task uses authored title');
}
const complete=content.instructionalMoves.find(move=>move.id==='complete');
assert.equal(getOG1LessonLocation(content,complete,'exam').title,'Exit exam · in progress');
assert.equal(getOG1LessonLocation(content,complete,'exam',true).title,'Exit exam results');
for(const [screen,title,next] of [
 ['understanding','Your Understanding','Final lesson summary'],
 ['summary','Final lesson summary','Optional pilot survey'],
 ['survey','Pilot feedback · optional','Return to Jeremiah'],
]){
 const location=getOG1LessonLocation(content,complete,screen,true);
 assert.equal(location.title,title);assert.equal(location.next,next);
}
assert.equal(JSON.stringify(content),before,'Presentation never mutates the curriculum or progression graph');
console.log('PASS Stage 1: all 20 moves and exam/report/summary/survey destinations; no mastery claims or content mutation.');
