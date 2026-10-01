import { useState } from 'react';
import { ROUTES } from '../../app/routes';
import { getLearningDashboard } from '../../core/classroom/learningDashboard';
import { CURRICULUM_STUDIES } from '../../core/classroom/content/curriculumContent';
import { getActiveClassroomStandardId, getActiveClassroomStudyId, setActiveClassroomStudyId, setActiveClassroomStandardId, setActiveClassroomSessionPreset } from '../../core/classroom/classroomSessionData';
import { setClassroomEntryIntent, CLASSROOM_ENTRY_INTENTS } from '../../core/classroom/classroomEntryIntent';
import '../home/LearningDashboard.css';
import './ClassroomEntrance.css';

export function ClassroomStudyRoom({ onNavigate }) {
  const data = getLearningDashboard();
  const study = CURRICULUM_STUDIES.find((s)=>s.id===getActiveClassroomStudyId()) || CURRICULUM_STUDIES[0];
  const lessons = data.standards.filter((s)=>s.content.studyId===study.id);
  const selected = lessons.find((s)=>s.content.standardId===getActiveClassroomStandardId());
  const active = selected || lessons.filter((s)=>s.started).sort((a,b)=>b.state.lastUpdatedAt-a.state.lastUpdatedAt)[0] || lessons[0];
  const [query,setQuery] = useState('');
  const needle = query.toLowerCase().trim();
  function enter(lesson) {
    setActiveClassroomStandardId(lesson.content.standardId);
    setActiveClassroomSessionPreset(lesson.preset);
    setClassroomEntryIntent(lesson.started ? CLASSROOM_ENTRY_INTENTS.RESUME : CLASSROOM_ENTRY_INTENTS.DIRECT);
    onNavigate(ROUTES.CLASSROOM_LESSON);
  }
  const visible = lessons.filter((s)=>!needle || `${s.content.standardTitle} ${s.content.standardId} ${s.content.truthStatement}`.toLowerCase().includes(needle));
  return <div className="ld-page ce-page"><div className="ld-content">
    <header className="ld-header"><span className="ld-brand">JEREMIAH</span><button type="button" className="ld-link" onClick={()=>onNavigate(ROUTES.CLASSROOM)}>← All rooms</button></header>
    <section className="ld-hero"><p className="ld-eyebrow">Study room · {study.domains.length} domains · {lessons.length} lessons</p><h1>{study.title}</h1><p>{study.id==='OG'?'Follow the identity and revelation of the one God through Scripture, from Israel’s confession to the apostolic witness to Jesus Christ.':'Follow the apostolic doctrine of salvation, from the human need for rescue to repentance, baptism, Spirit reception, and transformed life.'}</p></section>
    <section className="ld-feature ce-feature"><div><span className="ld-eyebrow">{active.started?'Your place is saved':'Begin here'}</span><h2>{active.content.standardTitle}</h2><p className="ld-muted">{active.started?active.move?.title:'Read the Scripture. Build understanding. Learn to explain the truth.'}</p></div><button type="button" className="ld-primary" onClick={()=>enter(active)}>{active.mastered?'Revisit lesson':active.started?'Continue your lesson':'Begin your lesson'} →</button></section>
    <section className="ce-catalog"><div className="ce-catalog-heading"><div><p className="ld-eyebrow">The learning path</p><h2>Explore this room</h2></div><label>Find a lesson<input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search lessons or Scripture themes" /></label></div>
      {visible.length===0 && <p className="ld-muted" role="status">No lessons match that search.</p>}
      {study.domains.map((domain)=>{const list=visible.filter((s)=>s.content.domainId===domain.id);if(!list.length)return null;return <details className="ce-domain" key={domain.id} open={needle?true:undefined}><summary><span>{String(domain.number).padStart(2,'0')}</span><div><strong>{domain.title}</strong><small>{list.length} lessons · {list.filter((s)=>s.mastered).length} mastered</small></div><i aria-hidden="true">+</i></summary><div className="ce-domain-lessons">{list.map((lesson)=><button type="button" key={lesson.content.standardId} onClick={()=>enter(lesson)}><span><small>{lesson.content.standardId}</small><strong>{lesson.content.standardTitle}</strong></span><em>{lesson.mastered?'Mastered':lesson.started?`${lesson.percent}% · Continue`:'Begin'} →</em></button>)}</div></details>;})}
    </section>
  </div></div>;
}

export default function ClassroomEntrance({ onNavigate }) {
  const data=getLearningDashboard();
  function open(studyId){setActiveClassroomStudyId(studyId);onNavigate(ROUTES.CLASSROOM_STUDY);}
  return <div className="ld-page ce-page"><div className="ld-content"><header className="ld-header"><span className="ld-brand">JEREMIAH</span><span className="ld-header-note">Classroom</span></header><section className="ld-hero"><p className="ld-eyebrow">A place to learn</p><h1>Different rooms.<br />Deeper understanding.</h1><p>Choose a room. Follow the biblical story, explore its setting, and learn to explain its truth with clarity.</p></section><section className="ce-doors" aria-label="Classroom rooms">{CURRICULUM_STUDIES.map((study,index)=>{const lessons=data.standards.filter((s)=>s.content.studyId===study.id);return <button type="button" className={`ce-door ${index===0?'ce-door-active':''}`} key={study.id} onClick={()=>open(study.id)}><span className="ce-door-number">{String(index+1).padStart(2,'0')}</span><span className="ld-eyebrow">Study room</span><h2>{study.title}</h2><p>{study.id==='OG'?'Who is God? Follow his identity and revelation from creation to the apostolic witness.':'Why must we be born again? Follow the gospel and the full apostolic response.'}</p><span className="ce-door-status">{study.domains.length} domains · {lessons.length} lessons · {lessons.filter((s)=>s.mastered).length} mastered</span><span className="ce-door-action">Enter this room <span>→</span></span></button>;})}<button type="button" className="ce-door" onClick={()=>onNavigate(ROUTES.BIBLE_SUPPORT)}><span className="ce-door-number">03</span><span className="ld-eyebrow">Reading room</span><h2>The Bible</h2><p>Take time with the text. Read a chapter or follow the passages from your lesson.</p><span className="ce-door-status">KJV · ASV · WEB</span><span className="ce-door-action">Open the Bible →</span></button></section></div></div>;
}
