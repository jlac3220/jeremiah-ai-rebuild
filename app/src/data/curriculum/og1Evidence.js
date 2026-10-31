// OG.1 evidence is curated at authoring time. Never fabricate a manuscript
// or suggest that a photographed leaf contains a verse it does not show.
// Images are faithful manuscript/document reproductions referenced via
// Wikimedia Commons; institutional viewers remain the canonical examination.
export const OG1_EVIDENCE = Object.freeze([
 {
  id:'nash', chapter:'shema', title:'The Nash Papyrus',
  era:'Second century BC', institution:'Cambridge University Library', shelfmark:'MS Or.233',
  reference:'Deuteronomy 6:4', language:'Hebrew',
  passage:'Hear, O Israel: The LORD our God is one LORD.',
  image:'https://commons.wikimedia.org/wiki/Special:FilePath/Papyrus_Nash.jpg',
  imageAlt:'The genuine Nash Papyrus fragment containing the Ten Commandments and the Shema.',
  imageNote:'This papyrus preserves the Shema alongside the Ten Commandments.',
  description:'This ancient Hebrew fragment preserves the Ten Commandments and the Shema together—a remarkable witness to Israel’s confession.',
  observe:'Look at the fragile edges and the lines of Hebrew ink that have endured through the centuries.',
  source:'https://cudl.lib.cam.ac.uk/view/MS-OR-00233/1',
  imageSource:'https://commons.wikimedia.org/wiki/File:Papyrus_Nash.jpg',
  rights:'Public-domain historical reproduction listed on Wikimedia Commons.'
 },
 {
  id:'isaiah',chapter:'isaiah',title:'The Great Isaiah Scroll',
  era:'Approximately second century BC',institution:'Israel Museum · Shrine of the Book',shelfmark:'1QIsaᵃ',
  reference:'Isaiah 44:6',language:'Hebrew',
  passage:'I am the first, and I am the last; and beside me there is no God.',
  image:'https://commons.wikimedia.org/wiki/Special:FilePath/Great_Isaiah_Scroll.jpg?width=1920',
  imageAlt:'A genuine photographic reproduction of the Great Isaiah Scroll from Qumran.',
  imageNote:'The Great Isaiah Scroll, with its long columns of ancient Hebrew writing.',
  description:'An extraordinary early Hebrew manuscript preserving nearly the entire book of Isaiah.',
  observe:'Notice how long the scroll is and how the Hebrew writing continues in columns. Use the museum viewer to examine individual sections.',
  source:'https://dss.collections.imj.org.il/',
  imageSource:'https://commons.wikimedia.org/wiki/File:Great_Isaiah_Scroll.jpg',
  rights:'Wikimedia Commons identifies this two-dimensional reproduction as public domain in the US; museum image rights can differ elsewhere.'
 },
 {
  id:'sinaiticus',chapter:'continuity',title:'Codex Sinaiticus',
  era:'Fourth century AD',institution:'British Library and project partners',shelfmark:'Codex Sinaiticus',
  reference:'Mark 12:29',language:'Greek',
  passage:'And Jesus answered him, The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord:',
  image:'https://commons.wikimedia.org/wiki/Special:FilePath/Codex_Sinaiticus.jpg?width=1280',
  imageAlt:'Photograph of the original Codex Sinaiticus on display at the British Library.',
  imageNote:'Codex Sinaiticus, one of the great surviving witnesses to the Greek New Testament.',
  description:'One of the earliest surviving extensive Greek Christian Bibles. Its text includes the Gospel of Mark and Jesus’ response to the scribe.',
  observe:'See the physical manuscript on display. The project’s digital edition lets you navigate the text of Mark itself.',
  source:'https://www.codexsinaiticus.com/en/',
  imageSource:'https://commons.wikimedia.org/wiki/File:Codex_Sinaiticus.jpg',
  rights:'Display-case photograph by PotatoCow25, CC0 1.0 via Wikimedia Commons. Digital codex pages carry separate project conditions.'
 },
 {
  id:'p46',chapter:'continuity',title:'Papyrus 46 · Paul’s Letters',
  era:'Around AD 200',institution:'Chester Beatty / University of Michigan',shelfmark:'P46',
  reference:'1 Corinthians 8:4',language:'Greek',
  passage:'As concerning therefore the eating of those things that are offered in sacrifice unto idols, we know that an idol is nothing in the world, and that there is none other God but one.',
  image:'https://commons.wikimedia.org/wiki/Special:FilePath/P46.jpg',
  imageAlt:'Ancient Greek papyrus leaf of P46 containing part of Second Corinthians.',
  imageNote:'A surviving P46 leaf from 2 Corinthians, part of the same ancient collection that preserves 1 Corinthians.',
  description:'One of the earliest surviving collections of Paul’s letters, including 1 Corinthians.',
  observe:'Notice the handwritten Greek and the fragile papyrus preserved across centuries.',
  source:'https://viewer.cbl.ie/viewer/object/BP_II_ff_15_90/1/LOG_0000/',
  imageSource:'https://commons.wikimedia.org/wiki/File:P46.jpg',
  rights:'Wikimedia Commons marks this reproduction public domain; Chester Beatty normally offers its collection images as CC BY 4.0.'
 },
 {
  id:'p75',chapter:'distinction',title:'Hanna Papyrus · P75',
  era:'Around AD 200–225',institution:'Vatican Apostolic Library',shelfmark:'Pap.Hanna.1',
  reference:'John 1:1',language:'Greek',
  passage:'In the beginning was the Word, and the Word was with God, and the Word was God.',
  image:'https://commons.wikimedia.org/wiki/Special:FilePath/Papyrus_75a.gif',
  imageAlt:'Historic reproduction of P75 showing the transition from Luke to the beginning of John.',
  imageNote:'This leaf includes the end of Luke and beginning of John, including the opening of John 1.',
  description:'An early Greek manuscript of Luke and John. Its opening of John is an important textual witness to the passage used in OG.1.',
  observe:'Notice the lines of Greek script where the Gospel of Luke gives way to John.',
  source:'https://www.vaticanlibrary.va/en/multimedia/papiro-hanna-1.html',
  imageSource:'https://commons.wikimedia.org/wiki/File:Papyrus_75a.gif',
  rights:'Historical image is marked public domain on Wikimedia Commons; Vatican photography and new reproductions require separate permission.'
 }
]);
export const OG1_EVIDENCE_BY_ID=Object.freeze(Object.fromEntries(OG1_EVIDENCE.map(a=>[a.id,a])));
export const OG1_EVIDENCE_DEFAULT=Object.freeze({
 learn:'nash',shema:'nash',isaiah:'isaiah',continuity:'sinaiticus',distinction:'p75',devotion:'nash'
});
