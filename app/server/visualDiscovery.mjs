// Licensed-media discovery for Jeremiah lesson art. Openverse searches the
// public creative commons; unlike a static URL list, this works for new lessons.
// Search metadata is a candidate signal, not proof of what an image depicts.
// Human editorial review remains required before public release.
const ROOT = 'https://api.openverse.org/v1/images/';
const cache = new Map();
const ttl = 1000 * 60 * 60 * 12;
const word = s => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const tokens = s => word(s).split(/\s+/).filter(x=>x.length>2);
const safe = s => String(s||'').slice(0,220).replace(/[<>\r\n]/g,' ').trim();
const unique = items => [...new Set(items.filter(Boolean))];
const allowedLicense = new Set(['cc0','pdm','by','by-sa']);
const supportedTypes = new Set(['historical','scripture','artifact','concept','general']);

export function planVisualDiscovery(brief={}) {
 const intent=supportedTypes.has(brief.intent)?brief.intent:'none';
 const subject=safe(brief.subject);
 const topic=safe(brief.topic);
 const goal=safe(brief.learningGoal);
 const reference=safe(brief.reference);
 if(intent==='none')return null;
 // Named biblical witnesses demand a named depiction. An unspecified verse
 // demands a reading image, not a guessed person standing in a desert.
 if(intent==='historical' && subject) return {
  kind:'person',subject,reference,
  queries:[subject+' Bible illustration',
   subject+' biblical digital painting',
   subject+' religious art scene'],
  required:tokens(subject),
  avoid:['music','concert','football','politician','singer','movie','cosplay'],
 };
 if(intent==='artifact')return {
  kind:'manuscript',reference,subject,
  queries:unique([
   reference+' ancient biblical manuscript scroll',
   'ancient Hebrew Greek Bible manuscript parchment'
  ]), required:['manuscript','scroll','papyrus','codex','bible','scripture'],
  avoid:['tattoo','jewelry','fashion']
 };
 if(intent==='scripture')return {
  kind:'reading',reference,subject,
  queries:['open Holy Bible pages photography','open Bible ancient scripture book photograph'],
  required:['bible','scripture','book','pages'],
  avoid:['cover','advertisement','logo']
 };
 // Use actual people for devotion and lived application; topics remain input
 // data, so future approved subjects do not require a growing hardcoded map.
 const t=topic||goal;
 const devotion=/pray|worship|love|devotion|faith|spirit|heart|soul/i.test(t);
 const search=devotion?'people praying worshiping together photograph':
  /service|help|kindness|community|generosity/i.test(t)?'people volunteering helping community photo':
  t?t+' people photography':'people community photography';
 return {kind:'people',reference,subject,
  queries:unique([search, devotion?'people Christian worship community photography':t+' people photograph']),
  required:devotion?['pray','prayer','worship','church','faith','religion']:['people','person','family','group','community','friend','help'],
  avoid:['protest','politics','violence','war','advertisement']
 };
}

export function scoreVisualCandidate(raw,plan,{excluded=[]}={}) {
 if(!raw || raw.mature || !allowedLicense.has(String(raw.license).toLowerCase()))return -1;
 if(!['image/jpeg','image/png','image/webp','jpg','jpeg','png','webp'].some(t=>String(raw.filetype||'').toLowerCase().includes(t)))return -1;
 if(!raw.url && !raw.thumbnail)return -1;
 if(raw.width && raw.width<480 || raw.height && raw.height<330)return -1;
 if(excluded.includes(raw.id))return -1;
 const title=word(raw.title);
 const tags=(raw.tags||[]).slice(0,18).map(t=>word(t.name||'')).join(' ');
 const evidence=title+' '+tags;
 const has=t=>new RegExp('\\b'+t+'\\b','i').test(evidence);
 // Never call a generic man in robes "Isaiah": the candidate must actually
 // identify the biblical person in title or metadata.
 if(plan.kind==='person' && !plan.required.every(has))return -1;
 // A matching name is not enough: distinguish "Moses the musician" from a
 // depiction of Moses in biblical context, even if search returns it first.
 const biblicalContext=['bible','biblical','scripture','christian','christ','jesus',
  'prophet','apostle','religious','saint','pharaoh','israel','israelites',
  'testament','disciples','gospel','ten commandments','red sea','hebrew',
  'christianity','judah','torah','aaron','church'];
 if(plan.kind==='person'&&!biblicalContext.some(has))return -1;
 if(plan.kind!=='person' && !plan.required.some(has))return -1;
 if(plan.avoid.some(has))return -1;
 const looksReligious=['bible','biblical','christian','jesus','moses','apostle','prophet','religious','scripture','holy','saint','church'];
 const mediums=['illustration','painting','artwork','digital','illustrated','art','depiction'];
 let score=plan.required.filter(has).length*6 + (plan.required.some(x=>title.includes(x))?6:0);
 if(plan.kind==='person'){
  if(looksReligious.some(has))score+=4;
  if(mediums.some(has))score+=4;
  if(['digital','cinematic','modern','realistic','illustration','illustrated'].some(has))score+=6;
  if(['engraving','woodcut','icon','fresco'].some(has))score-=3;
  if(['statue','sculpture','church window','stained glass'].some(has))score-=4;
 }else if(plan.kind==='people'){
  if(['photograph','photo','people','family'].some(has))score+=4;
  if(['illustration','painting','icon','drawing'].some(has))score-=4;
 }else if(plan.kind==='reading'){
  if(['open','page','pages','book'].some(has))score+=4;
 }
 if(raw.width>950 && raw.height>500)score+=2;
 return score;
}

export function normalizeVisualResult(raw,plan) {
 const url=raw.url||raw.thumbnail;
 const sourceUrl=raw.foreign_landing_url||raw.detail_url||raw.license_url;
 try {if(!['https:','http:'].includes(new URL(url).protocol)||!sourceUrl||!['https:','http:'].includes(new URL(sourceUrl).protocol))return null;}
 catch{return null;}
 return {id:'discovered-'+raw.id,src:url,alt:safe(raw.title)||'Bible teaching illustration',
  credit:[safe(raw.creator)||'Unknown creator',String(raw.license).toUpperCase()].join(' · '),
  sourceUrl,license:raw.license,licenseUrl:raw.license_url||'',
  subject:plan.subject,kind:plan.kind,provider:'Openverse',
  rightsStatus:'needs-review',previewApproved:true};
}
async function queryOpenverse(q,fetcher) {
 const url=new URL(ROOT); url.searchParams.set('q',q);
 url.searchParams.set('license','cc0,pdm,by,by-sa');
 url.searchParams.set('page_size','24');
 url.searchParams.set('mature','false');
 url.searchParams.set('filter_dead','true');
 const res=await fetcher(url.toString(),{headers:{Accept:'application/json'},signal:AbortSignal.timeout(7000)});
 if(!res.ok)throw new Error('Visual search unavailable');
 const data=await res.json();
 return Array.isArray(data.results)?data.results:[];
}
export async function discoverLessonVisuals(brief,{fetcher=fetch,force=false}={}) {
 const plan=planVisualDiscovery(brief);
 if(!plan)return {status:'no-subject',assets:[]};
 const key=JSON.stringify({kind:plan.kind,queries:plan.queries,subject:plan.subject,reference:plan.reference});
 const existing=cache.get(key);
 if(!force&&existing && Date.now()-existing.when<ttl)return existing.data;
 const collected=[];
 for(const q of plan.queries){
  try {
   collected.push(...await queryOpenverse(q,fetcher));
   const usable=collected.filter(x=>scoreVisualCandidate(x,plan)>0);
   if(usable.length>=6)break;
  }catch{/* Try next distinct query; no unrelated image substitution. */}
 }
 const seen=new Set();
 const ranked=collected.map(raw=>({raw,score:scoreVisualCandidate(raw,plan)}))
  .filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
 const assets=[];
 for(const {raw} of ranked){
  const item=normalizeVisualResult(raw,plan);
  if(item&&!seen.has(item.id)){assets.push(item);seen.add(item.id);}
  if(assets.length===10)break;
 }
 const data={status:assets.length?'discovered':'no-suitable-licensed-image',assets,
  queries:plan.queries,needsEditorialReview:assets.length>0};
 cache.set(key,{when:Date.now(),data});
 if(cache.size>180)cache.delete(cache.keys().next().value);
 return data;
}
