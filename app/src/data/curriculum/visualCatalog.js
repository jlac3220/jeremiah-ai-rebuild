// Curated illustrations are educational depictions, not historical photographs.
import {EVERYDAY_PHOTO_LIBRARY} from '../../features/classroom/everydayPhotoLibrary.js';
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
 shema: illustrated("/images/og1/og1-moses-shema.webp","Moses addresses the people of Israel as they hear the Shema","Jeremiah image library","","Deuteronomy 6:4",SHEMA,"50% 38%"),
 moses: illustrated("/images/og1/og1-moses-shema.webp","Moses delivers the confession to Israel in the wilderness","Jeremiah image library","","Deuteronomy 6:4",SHEMA,"50% 38%"),
 prophets: illustrated("/images/og1/og1-isaiah-declaration.webp","A prophet explains the message of the one LORD to craftsmen surrounded by carved idols","Jeremiah image library","","Isaiah 44:6",ISAIAH,"50% 35%"),
 jesus: illustrated("/images/og1/og1-jesus-scribe.webp","Jesus answers a scribe about the greatest commandment","Jeremiah image library","","Mark 12:29",JESUS,"50% 38%"),
 apostles: illustrated("/images/og1/og1-paul-writing.webp","Paul composes his message to the Corinthian believers","Jeremiah image library","","1 Corinthians 8:4",PAUL,"50% 40%"),
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
 // Neutral Bible-photo fallback ONLY when the verse has no authentic
 // named subject/artifact scene. Never claim the pictured page is the cited text.
 Object.freeze({id:'reading-scripture-open-bible',
  src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Reading_Scripture_%28Unsplash%29.jpg/960px-Reading_Scripture_%28Unsplash%29.jpg',
  alt:'An open Bible on a table beside a lamp, illustrating Scripture reading',
  credit:'Aaron Burden · Wikimedia Commons CC0',
  sourceUrl:'https://commons.wikimedia.org/wiki/File:Reading_Scripture_(Unsplash).jpg',
  intent:'reading',topics:['scripture'],references:[],previewApproved:true,rightsStatus:'cleared',priority:1}),
 media('moses-addresses-israel',GALLERY_ART.shema,{intent:'scripture',
  subjects:['Moses'],references:['Deuteronomy 6:4'],topics:['the shema'],priority:10}),
 media('isaiah-proclaims',GALLERY_ART.prophets,{intent:'scripture',
  subjects:['Isaiah'],references:['Isaiah 43:10','Isaiah 44:6','Isaiah 45:5'],topics:['prophetic witness'],priority:10,rightsStatus:'cleared'}),
 media('jesus-teaches-scribe',GALLERY_ART.jesus,{intent:'scripture',
  subjects:['Jesus'],references:['Mark 12:29'],topics:['the greatest commandment'],priority:10}),
 media('paul-teaches-church',GALLERY_ART.apostles,{intent:'scripture',
  subjects:['Paul'],references:['1 Corinthians 8:4','1 Corinthians 8:4-6'],topics:['apostolic witness'],priority:10,rightsStatus:'cleared'}),
 // Later manuscript witness to Isaiah, NOT Isaiah's autograph.
 Object.freeze({id:'great-isaiah-scroll',
  src:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Great_Isaiah_Scroll.jpg/960px-Great_Isaiah_Scroll.jpg',
  alt:'Great Isaiah Scroll manuscript preserving the text of Isaiah in Hebrew',
  credit:'Great Isaiah Scroll · Wikimedia Commons, public domain',
  sourceUrl:'https://commons.wikimedia.org/wiki/File:Great_Isaiah_Scroll.jpg',
  intent:'artifact',references:['Isaiah 43:10','Isaiah 44:6','Isaiah 45:5'],
  topics:['Isaiah witness'],previewApproved:true,rightsStatus:'cleared',priority:8}),
 Object.freeze({id:'nash-papyrus',src:'https://upload.wikimedia.org/wikipedia/commons/9/93/Papyrus_Nash.jpg',
  alt:'The Nash Papyrus, an ancient manuscript fragment containing the Shema',
  credit:'Cambridge University Library · MS Or.233',
  sourceUrl:'https://cudl.lib.cam.ac.uk/view/MS-OR-00233/1',
  intent:'artifact',references:['Deuteronomy 6:4'],topics:['the shema'],
  previewApproved:true,rightsStatus:'needs-review',priority:30}),
 // Distinct contemporary scenes for broad life application, not fabricated
 // illustrations of a named biblical event. See Deuteronomy 6:5.
 Object.freeze({id:'heart-soul-might-prayer',...EVERYDAY_PHOTO_LIBRARY.worship[2],
  intent:'concept',topics:['heart soul might','wholehearted devotion'],
  references:['Deuteronomy 6:5'],previewApproved:true,rightsStatus:'needs-review',priority:30}),
 Object.freeze({id:'wholehearted-love-community',...EVERYDAY_PHOTO_LIBRARY.worship[0],
  intent:'concept',topics:['wholehearted love'],
  references:['Deuteronomy 6:5'],previewApproved:true,rightsStatus:'needs-review',priority:30}),
 Object.freeze({id:'exclusive-worship-congregation',...EVERYDAY_PHOTO_LIBRARY.worship[1],
  intent:'concept',topics:['exclusive worship'],
  references:['Exodus 20:3-5'],previewApproved:true,rightsStatus:'needs-review',priority:30}),
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
