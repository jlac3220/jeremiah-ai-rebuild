// Pilot research instrument. Keep the client and server on the same version.
export const OG1_PILOT_SURVEY_VERSION = 'og1-pilot-2026-11-v1';

export const PILOT_RATING_AREAS = Object.freeze([
 {id:'scripture',label:'Scripture and teaching',hint:'Clear biblical explanations and useful references'},
 {id:'flow',label:'Lesson structure',hint:'A natural progression from one idea to the next'},
 {id:'navigation',label:'Navigation',hint:'Knowing where I was and how to move around'},
 {id:'visuals',label:'Visual design and theme',hint:'Colors, layout, typography, and overall polish'},
 {id:'imagery',label:'Images and scenes',hint:'Relevant, believable imagery that supports learning'},
 {id:'interaction',label:'Interaction and engagement',hint:'Activities that helped rather than distracted'},
 {id:'narration',label:'Narrator and audio',hint:'Voice, pacing, clarity, and control'},
 {id:'assessment',label:'Questions and feedback',hint:'Fair, meaningful assessments and explanations'},
 {id:'pacing',label:'Length and pacing',hint:'A comfortable balance of time and depth'}
]);

export const PILOT_PRIORITY_OPTIONS = Object.freeze([
 ['teaching','Teaching clarity'],['navigation','Navigation / progress'],
 ['layout','UI / theme'],['imagery','Images / media'],['narration','Narration'],
 ['interaction','Activities'],['assessment','Questions / grading'],
 ['pacing','Pacing / length'],['performance','Technical issue'],['nothing','Nothing significant']
]);

export const PILOT_MOMENT_OPTIONS = Object.freeze([
 ['opening','The four witnesses'],['shema','The Shema / echad'],
 ['isaiah','Isaiah'],['continuity','Jesus and the apostles'],
 ['distinction','Explaining the difference'],['devotion','Devotion / application'],
 ['exam','Assessment / results'],['unsure','Not sure']
]);

export const PILOT_DEVICE_OPTIONS = Object.freeze([
 ['phone','Phone'],['tablet','Tablet'],['laptop','Laptop'],['desktop','Desktop'],['other','Other']
]);
export const PILOT_ROLE_OPTIONS = Object.freeze([
 ['learner','Learner'],['teacher','Teacher / educator'],['minister','Minister / church leader'],
 ['parent','Parent / guardian'],['other','Other'],['prefer_not','Prefer not to say']
]);
export const PILOT_FUTURE_OPTIONS = Object.freeze([
 ['yes','Yes'],['maybe','Maybe'],['no','No']
]);

export const PILOT_TEXT_FIELDS = Object.freeze({
 bestPart:1100,improve:1400,confusing:1100,other:1000
});

export function newPilotSurveyDraft(){
 return {overall:0,ratings:{},future:'',priority:'',moment:'',device:'',role:'',
  bestPart:'',improve:'',confusing:'',other:''};
}
