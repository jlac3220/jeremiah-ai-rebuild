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
  description:'This fragment preserves a version of the Ten Commandments followed by the Shema. It survives from many centuries after the time of Moses.',
  observe:'Look at the fragmented edges and the lines of Hebrew ink. These are surviving ancient writing, not a modern illustration.',
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
  imageNote:'Wide view of the Isaiah manuscript. The whole scroll is shown; this is not a pinpointed image of Isaiah 44:6.',
  description:'A remarkable early copy of nearly the entire book of Isaiah. It is a later witness to Isaiah’s words, not Isaiah’s original manuscript.',
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
  imageNote:'Photograph of the actual codex in its display case, not a close-up of Mark 12:29.',
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
  imageNote:'The displayed leaf is 2 Corinthians 11:33–12:9, NOT 1 Corinthians 8:4; both letters are preserved in P46.',
  description:'One of the earliest surviving collections of Paul’s epistles, including 1 Corinthians. The pictured leaf comes from another passage in the same manuscript.',
  observe:'Examine the handwritten Greek text, worn edges, and missing portions. Then read Paul’s confession in the KJV beside it.',
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
  observe:'Look for the compact lines of Greek script and the transition between two Gospel books. The KJV at right is an English translation, not a transcription of the photo.',
  source:'https://www.vaticanlibrary.va/en/multimedia/papiro-hanna-1.html',
  imageSource:'https://commons.wikimedia.org/wiki/File:Papyrus_75a.gif',
  rights:'Historical image is marked public domain on Wikimedia Commons; Vatican photography and new reproductions require separate permission.'
 }
]);
export const OG1_EVIDENCE_BY_ID=Object.freeze(Object.fromEntries(OG1_EVIDENCE.map(a=>[a.id,a])));
export const OG1_EVIDENCE_DEFAULT=Object.freeze({
 learn:'nash',shema:'nash',isaiah:'isaiah',continuity:'sinaiticus',distinction:'p75',devotion:'nash'
});
