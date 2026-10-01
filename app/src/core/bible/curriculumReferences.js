import { BIBLE_BOOKS, normalizeBibleBookName } from './bibleCatalog.js';
const aliases = {
  'gen':'Gen','ex':'Exod','exod':'Exod','lev':'Lev','num':'Num','deut':'Deut','josh':'Josh','judg':'Judg','ruth':'Ruth',
  '1sam':'1Sam','2sam':'2Sam','1kgs':'1Kgs','2kgs':'2Kgs','1chron':'1Chr','2chron':'2Chr','ps':'Ps','psa':'Ps','prov':'Prov','eccl':'Eccl','song':'Song',
  'isa':'Isa','jer':'Jer','ezek':'Ezek','dan':'Dan','hos':'Hos','joel':'Joel','amos':'Amos','obad':'Obad','jonah':'Jonah','mic':'Mic','nah':'Nah','hab':'Hab','zeph':'Zeph','hag':'Hag','zech':'Zech','mal':'Mal',
  'matt':'Matt','mk':'Mark','lk':'Luke','jn':'John','acts':'Acts','rom':'Rom','1cor':'1Cor','2cor':'2Cor','gal':'Gal','eph':'Eph','phil':'Phil','col':'Col','1thess':'1Thess','2thess':'2Thess','1tim':'1Tim','2tim':'2Tim','tit':'Titus','phlm':'Phlm','heb':'Heb','jas':'Jas','1pet':'1Pet','2pet':'2Pet','1john':'1John','2john':'2John','3john':'3John','jude':'Jude','rev':'Rev'
};
export function resolveCurriculumReference(reference) {
  const text = String(reference).replace(/^III\s+/,'3 ').replace(/^II\s+/,'2 ').replace(/^I\s+/,'1 ').replace(/[–—]/g,'-');
  const match = text.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
  if (!match) throw new Error('Unsupported Scripture reference: '+reference);
  const name = normalizeBibleBookName(match[1]);
  const book = BIBLE_BOOKS.find((b) => b.osis === aliases[name] || normalizeBibleBookName(b.name) === name || normalizeBibleBookName(b.osis) === name);
  if (!book) throw new Error('Unknown Scripture book: '+reference);
  const chapter = Number(match[2]);
  if (chapter > book.chapters) throw new Error('Invalid Scripture chapter: '+reference);
  const verse = match[3] ? Number(match[3]) : null;
  const endVerse = match[4] ? Number(match[4]) : verse;
  return { book, chapter, verse, endVerse, reference: `${book.name} ${chapter}${verse ? ':'+verse+(endVerse !== verse ? '-'+endVerse : '') : ''}` };
}
