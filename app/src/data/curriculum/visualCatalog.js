// Curated illustrations are educational depictions, not historical photographs.
// External imagery still requires rights review before publication.
const illustrated = (src,alt,artist,source,reference,quote,focal='50% 38%')=>({
 src,alt,artist,work:'Modern illustrative reconstruction',source,focal,reference,quote
});
const SHEMA='“Hear, O Israel: The LORD our God is one LORD.”';
const ISAIAH='“I am the first, and I am the last; and beside me there is no God.”';
const JESUS='“The Lord our God is one Lord.”';
const PAUL='“There is none other God but one.”';
// Image assignments are editorially tied to the passage, not random stock scenery.
// A duplicate relevant witness is preferable to an unrelated camel, street, or desk.
// Unique, rights-cleared renderings can replace these slots without changing lesson content.
export const GALLERY_ART = Object.freeze({
 shema: illustrated('https://cdn.prod.website-files.com/68864d00ea8f52f9e4d32cc2/69b0ad30a333e0c7acbccba5_Vayakhel%20Part%20I.webp','Modern illustration of Moses addressing the gathered Israelites in a wilderness encampment','Mitzvah Minute','https://www.mitzvah-minute.com/divrei-torah/vayakhel----part-i----vay-aq-hel-mosheh-reassembling-a-broken-nation---1-2----the-nation-after-the-golden-calf','Deuteronomy 6:4',SHEMA),
 moses: illustrated('https://cdn.prod.website-files.com/68864d00ea8f52f9e4d32cc2/69b0ad30a333e0c7acbccba5_Vayakhel%20Part%20I.webp','Moses addressing the Israelites, not an anonymous modern traveler','Mitzvah Minute','https://www.mitzvah-minute.com/divrei-torah/vayakhel----part-i----vay-aq-hel-mosheh-reassembling-a-broken-nation---1-2----the-nation-after-the-golden-calf','Deuteronomy 6:4',SHEMA,'50% 35%'),
 prophets: illustrated('https://www.heroisdabiblia.com.br/storage/posts/featured/MfCGF7Wa09bQZDGlh8d2A0MgpSycbjG0e6xhjA4u.webp','Modern depiction of Isaiah proclaiming his message from a rocky hillside above ancient Judah','Heróis da Bíblia','https://www.heroisdabiblia.com.br/en-us/artigos/isaiah-the-classical-prophet-of-judah-and-his-messianic-visions','Isaiah 44:6',ISAIAH,'62% 36%'),
 jesus: illustrated('https://static.wixstatic.com/media/83aeb0_e0b90c140408418d8bb35f96267923c0~mv2.jpg/v1/fill/w_1000%2Ch_667%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01/83aeb0_e0b90c140408418d8bb35f96267923c0~mv2.jpg','Jesus teaching a Jewish scribe about the greatest commandment, with other listeners present','Caminho de Fé','https://www.caminhodefe.com/post/o-cora%C3%A7%C3%A3o-da-lei-%C3%A9-o-amor','Mark 12:29',JESUS,'40% 35%'),
 apostles: illustrated('https://cdn.bibleworld.ai/bible-world/generations/e8158347-eb99-404f-9a7e-48445c96d610.png?format=jpeg&quality=85&width=1200','The apostle Paul preaching to a gathered early Christian community','BibleWorld · public gallery CC0','https://bibleworld.ai/image/db18cba8-835c-4785-8710-e7772a439bd2','1 Corinthians 8:4',PAUL,'59% 33%'),
});
export const BIBLICAL_ART = Object.freeze({
 ...GALLERY_ART,
 'shema-encounter':GALLERY_ART.shema,
 'moses-reading':GALLERY_ART.moses,
 'prophets-reading':GALLERY_ART.prophets,
 'jesus-reading':GALLERY_ART.jesus,
 'apostles-reading':GALLERY_ART.apostles,
 'moses-trail':GALLERY_ART.shema,
 'jesus-trail':GALLERY_ART.jesus,
 'apostles-trail':GALLERY_ART.apostles,
 'prophets-witness':GALLERY_ART.prophets
});


const media = (id,art,options) => Object.freeze({
 id,src:art.src,alt:art.alt,credit:art.artist,sourceUrl:art.source,
 previewApproved:true,rightsStatus:'needs-review',...options
});

// The inventory is shared by OG, NB, and every subsequent study. Asset
// metadata describes the subject/passage, not a screen number or lesson name.
export const VISUAL_ASSETS = Object.freeze([
 media('moses-addresses-israel',GALLERY_ART.shema,{intent:'scripture',
  subjects:['Moses'],references:['Deuteronomy 6:4'],topics:['the shema'],priority:10}),
 media('isaiah-proclaims',GALLERY_ART.prophets,{intent:'scripture',
  subjects:['Isaiah'],references:['Isaiah 43:10','Isaiah 44:6','Isaiah 45:5'],topics:['prophetic witness'],priority:10}),
 media('jesus-teaches-scribe',GALLERY_ART.jesus,{intent:'scripture',
  subjects:['Jesus'],references:['Mark 12:29'],topics:['the greatest commandment'],priority:10}),
 media('paul-teaches-church',GALLERY_ART.apostles,{intent:'scripture',
  subjects:['Paul'],references:['1 Corinthians 8:4','1 Corinthians 8:4-6'],topics:['apostolic witness'],priority:10}),
 Object.freeze({id:'nash-papyrus',src:'https://upload.wikimedia.org/wikipedia/commons/9/93/Papyrus_Nash.jpg',
  alt:'The Nash Papyrus, an ancient manuscript fragment containing the Shema',
  credit:'Cambridge University Library · MS Or.233',
  sourceUrl:'https://cudl.lib.cam.ac.uk/view/MS-OR-00233/1',
  intent:'artifact',references:['Deuteronomy 6:4'],topics:['the shema'],
  previewApproved:true,rightsStatus:'needs-review',priority:30}),
 Object.freeze({id:'congregation-worship',src:'https://images.pexels.com/photos/35555152/pexels-photo-35555152.jpeg?auto=compress&cs=tinysrgb&w=1600',
  alt:'Congregation gathered for Christian worship',
  credit:'Caleb Oquendo · Pexels',sourceUrl:'https://www.pexels.com',
  intent:'general',topics:['worship'],previewApproved:true,rightsStatus:'needs-review',priority:10}),
]);

// The author states what the moment teaches; the engine picks an eligible asset.
// This map is semantic, NOT a table of image URLs or a fallback hierarchy.
export const WITNESS_PLACEMENTS = Object.freeze({
 shema:{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Moses gives Israel the Shema'},
 moses:{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Moses addresses Israel'},
 prophets:{intent:'historical',subject:'Isaiah',reference:'Isaiah 44:6',learningGoal:'Isaiah declares the LORD alone is God'},
 jesus:{intent:'historical',subject:'Jesus',reference:'Mark 12:29',learningGoal:'Jesus repeats the Shema'},
 apostles:{intent:'historical',subject:'Paul',reference:'1 Corinthians 8:4',learningGoal:'Paul teaches the one God'},
 'shema-encounter':{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Israel hears the Shema'},
 'moses-reading':{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Read the words of Moses'},
 'prophets-reading':{intent:'historical',subject:'Isaiah',reference:'Isaiah 44:6',learningGoal:'Read the words of Isaiah'},
 'jesus-reading':{intent:'historical',subject:'Jesus',reference:'Mark 12:29',learningGoal:'Read Jesus reaffirming the Shema'},
 'apostles-reading':{intent:'historical',subject:'Paul',reference:'1 Corinthians 8:4',learningGoal:'Read Paul on the one God'},
 'moses-trail':{intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Trace Moses and the Shema'},
 'jesus-trail':{intent:'historical',subject:'Jesus',reference:'Mark 12:29',learningGoal:'Trace Jesus and the Shema'},
 'apostles-trail':{intent:'historical',subject:'Paul',reference:'1 Corinthians 8:4',learningGoal:'Trace Paul and the Shema'},
 'prophets-witness':{intent:'historical',subject:'Isaiah',reference:'Isaiah 44:6',learningGoal:'Trace Isaiah and the one God'}
});
