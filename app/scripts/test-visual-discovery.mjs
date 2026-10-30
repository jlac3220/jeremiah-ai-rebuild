import assert from 'node:assert/strict';
import {planVisualDiscovery,scoreVisualCandidate,discoverLessonVisuals} from '../server/visualDiscovery.mjs';

const brief={intent:'historical',subject:'Moses',reference:'Deuteronomy 6:4',learningGoal:'Moses addresses the people of Israel'};
const named=planVisualDiscovery(brief);
assert.equal(named.kind,'person');
assert.match(named.queries[0],/Moses/);
const future=planVisualDiscovery({intent:'historical',subject:'Barnabas',learningGoal:'Barnabas speaks'});
assert.match(future.queries[0],/Barnabas/,'New figures automatically get searches');

const bible=planVisualDiscovery({intent:'scripture',reference:'John 1:1',learningGoal:'Read John 1:1'});
assert.equal(bible.kind,'reading');
assert.ok(bible.queries.some(q=>/open Bible/i.test(q)),'Scripture reading looks for actual Bible pages');
const worship=planVisualDiscovery({intent:'general',topic:'worship',learningGoal:'Community worship'});
assert.equal(worship.kind,'people');
assert.ok(worship.queries.some(q=>/worshiping/i.test(q)));
const manuscript=planVisualDiscovery({intent:'artifact',reference:'Isaiah 44:6',learningGoal:'Evidence manuscript'});
assert.equal(manuscript.kind,'manuscript');

const item=(id,title,extras={})=>({id,title,tags:[],license:'cc0',filetype:'jpg',width:1400,height:960,
 url:'https://example.org/'+id+'.jpg',foreign_landing_url:'https://example.org/art/'+id,
 creator:'Artist',mature:false,...extras});
const candidates=[
 item('moses1','Moses preaching to the Israelites biblical painting'),
 item('moses2','Moses speaking before Israel watercolor illustration'),
 item('wrong','Man standing on a rocky hillside'),
 item('misleading','Moses the singer concert poster'),
 item('restricted','Moses in the wilderness painting',{license:'by-nc'}),
 item('lowres','Moses illustration',{width:220,height:150}),
];
assert.ok(scoreVisualCandidate(candidates[0],named)>0);
assert.ok(scoreVisualCandidate(candidates[1],named)>0);
assert.equal(scoreVisualCandidate(candidates[2],named),-1,'A generic figure is not Moses');
assert.equal(scoreVisualCandidate(candidates[3],named),-1,'A singer named Moses is not the biblical witness');
assert.equal(scoreVisualCandidate(candidates[4],named),-1,'Unsupported license must be rejected');
assert.equal(scoreVisualCandidate(candidates[5],named),-1,'Tiny images fail quality threshold');
assert.equal(scoreVisualCandidate(item('notJesus','Generic historical man'),planVisualDiscovery({
 intent:'historical',subject:'Jesus',learningGoal:'Jesus speaks'
})),-1);

let urls=[];
const fetcher=async url=>{
 urls.push(url);
 return {ok:true,json:async()=>({results:candidates})};
};
const results=await discoverLessonVisuals(brief,{fetcher,force:true});
assert.equal(results.status,'discovered');
assert.deepEqual(new Set(results.assets.map(a=>a.id)),new Set(['discovered-moses1','discovered-moses2']));
assert.ok(results.needsEditorialReview);
assert.ok(results.assets.every(a=>a.sourceUrl&&a.credit&&a.rightsStatus==='needs-review'));
assert.ok(urls.every(x=>new URL(x).hostname==='api.openverse.org'),'External API query is fixed, not user supplied');
const none=await discoverLessonVisuals({intent:'historical',subject:'Isaiah',learningGoal:'Isaiah teaches'},{
 force:true,fetcher:async()=>({ok:true,json:async()=>({results:[item('wrong','Generic man on a mountain')]})})
});
assert.equal(none.status,'no-suitable-licensed-image','No matches means do not invent an Isaiah image');
assert.equal(none.assets.length,0);
console.log('PASS: visual search builds queries from subjects and scenes, rejects mismatches and bad rights, and supplies preview candidates for review.');
