import { useState } from 'react';
import { ROUTES } from '../../app/routes';
import { resolveCurriculumReference } from '../../core/bible/curriculumReferences';
import { setBibleReaderIntent } from '../../core/bible/bibleReaderIntent';
import { getLessonMedia } from '../../data/curriculum/mediaCatalog';
import DeepDiveSheet from './DeepDiveSheet';
import GuidedWitnesses from './GuidedWitnesses';
import { getLessonExperience } from '../../core/classroom/content/lessonExperience';
import { getTeachingPlan } from '../../data/curriculum/teachingPlans';
import { getClassroomResources } from '../../data/curriculum/classroomResources';
import './CurriculumLesson.css';

const labels = {learn:'Understand',scripture:'Read',sources:'Explore',check:'Recognize',explain:'Explain',apply:'Apply',defend:'Defend',complete:'Complete'};
function paragraphs(text) { return String(text || '').split(/(?<=[.!?])\s+(?=[A-Z“])/).reduce((groups, sentence) => { const last=groups.at(-1); if(last && last.length<280) groups[groups.length-1]+=' '+sentence; else groups.push(sentence); return groups; },[]); }
export default function CurriculumLesson({ content, move, state, onProgress, percent, responseText, onResponseText, selectedChoiceId, onSelectChoice, ready, teacherDecision, isThinking, errorMessage, onSubmit, onContinue, onTeacherContinue, onNavigate }) {
  const [passage, setPassage] = useState(null);
  const [mediaError, setMediaError] = useState({});
  const [mediaChecks, setMediaChecks] = useState({});
  const response = ['free_response','mastery_response'].includes(move.type);
  const unscored = move.type === 'teach';
  const complete = move.type === 'complete';
  const domain = content.sourceDomain;
  const media = getLessonMedia(content);
  const experience = getLessonExperience(content);
  const resources = getClassroomResources(content);
  const plan = getTeachingPlan(content);
  function openReference(verse) {
    const ref=resolveCurriculumReference(verse.reference);
    setPassage({ ...verse, reference:ref.reference, kind:'scripture' });
  }
  function openBible(item) {
    setBibleReaderIntent(item.reference,{translation:'kjv',returnRoute:ROUTES.CLASSROOM_LESSON,source:'classroom'});
    onNavigate(ROUTES.BIBLE_SUPPORT);
  }
  return <div className="cl-page">
    <header className="cl-topbar"><button type="button" aria-label="Leave lesson" onClick={() => onNavigate(ROUTES.CLASSROOM_STUDY)}>←</button><span>{content.studyTitle}</span><span className="cl-percent">{percent}%</span></header>
    <div className="cl-progress" role="progressbar" aria-label="Lesson progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{width:percent+'%'}} /></div>
    <main className="cl-shell"><p className="ld-eyebrow">Domain {String(domain.number).padStart(2,'0')} · {labels[move.id]}</p><h1>{move.title}</h1>
      {!complete && <p className="cl-breadcrumb">{domain.title} · {content.standardId}</p>}
      {move.id === 'learn' && <><div className="cl-target"><span className="ld-eyebrow">The truth you are learning</span><p>{content.sourceStandard.statement.replace(/^The (?:student can|learner demonstrates that)\s+/,'')}</p></div>{paragraphs(experience.teaching).map((p,i)=><p className="cl-prose" key={i}>{p}</p>)}<div className="cl-keywords">{experience.vocabulary.map(v=><button type="button" key={v.term} onClick={()=>setPassage({kind:"dictionary",title:v.term,provider:"Classroom vocabulary",summary:v.definition,purpose:v.relevance})}>{v.term} <span>+</span></button>)}</div><details className="cl-vocabulary"><summary>Words that matter in this domain</summary><dl>{domain.vocabulary.map((v)=><div key={v.term}><dt>{v.term}</dt><dd>{v.definition}</dd></div>)}</dl></details></>}
      {move.id === 'scripture' && <><GuidedWitnesses content={content} state={state} onProgress={onProgress} onOpen={openReference} /><details className="cl-vocabulary"><summary>All core Scripture in this domain</summary><div className="cl-scripture-list">{domain.scripture.map((v)=><button type="button" key={v.reference} onClick={()=>openReference(v)}><strong>{v.reference} <span>↗</span></strong><span>{v.function}</span></button>)}</div></details><details className="cl-vocabulary"><summary>Keep the thread</summary><p className="cl-prose">{plan.connection}</p></details></>}
      {move.id === 'sources' && <><GuidedWitnesses content={content} state={state} onProgress={onProgress} onOpen={openReference} mode="connect" />{resources.length>0 && <section className="cl-resource-shelf"><p className="ld-eyebrow">On the classroom table</p>{resources.map(resource=><button type="button" key={resource.id} onClick={()=>setPassage(resource)}><span>{resource.kind}</span><strong>{resource.title}</strong><small>{resource.provider}</small><span>Explore →</span></button>)}</section>}<div className="cl-media-list">{media.map((source)=><article className="cl-media" key={source.id}><div className="cl-media-title"><span className="ld-eyebrow">{source.role==='historical_context'?'Historical lens · Jewish tradition':`${source.provider} · Video`}</span><h2>{source.title}</h2>{source.duration && <small className="cl-media-duration">{source.duration} · Optional viewing</small>}</div>{source.embedUrl && <div className="cl-video-frame"><iframe src={source.embedUrl} title={source.videoTitle || source.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation" /></div>}{source.videoUrl && !mediaError[source.id] && <video controls playsInline preload="none" poster={source.thumbnail || undefined} onError={()=>setMediaError({...mediaError,[source.id]:true})}><source src={source.videoUrl} type="video/mp4" />Your browser cannot play this video.</video>}{mediaError[source.id] && <p className="cl-muted">The video could not load. Check your connection and try again.</p>}{source.purpose && <p>{source.purpose}</p>}<span className="cl-media-credit">Source: {source.provider}</span>{source.lessonCheck && <MediaLessonCheck check={source.lessonCheck} selection={mediaChecks[source.id]} onSelect={(answer)=>setMediaChecks({...mediaChecks,[source.id]:answer})}/>}{source.posterUrl && <button type="button" className="cl-poster-button" onClick={()=>setPassage({kind:"poster",title:source.title,imageUrl:source.posterUrl,provider:source.provider})}>Explore the illustrated poster</button>}</article>)}</div><section className="cl-witness-map"><span className="ld-eyebrow">One biblical witness</span><h2>Follow the Scripture connections</h2><div>{['OT','NT'].map((testament)=><section key={testament}><h3>{testament==='OT'?'Old Testament':'New Testament'}</h3>{domain.scripture.filter((v)=>resolveCurriculumReference(v.reference).book.testament===testament).map((v)=><button type="button" key={v.reference} onClick={()=>openReference(v)}>{v.reference} ↗</button>)}</section>)}</div></section><p className="cl-muted">Follow the passages at your own pace. Extra resources are optional.</p></>}
      {(response || move.id === 'check') && <><p className="cl-prompt">{move.prompt}</p>{response && <details className="cl-vocabulary"><summary>Revisit the supporting Scripture</summary><div className="cl-reference-buttons">{domain.scripture.map((v)=><button key={v.reference} type="button" onClick={()=>openReference(v)}>{v.reference} ↗</button>)}</div></details>}{!teacherDecision && !response && <div className="cl-choices" role="group" aria-label="Answer choices">{move.choices.map((choice)=><button type="button" key={choice.id} aria-pressed={selectedChoiceId===choice.id} onClick={()=>onSelectChoice(choice.id)}>{choice.label}</button>)}</div>}{response && !teacherDecision && <label className="cl-response-label">Your explanation<textarea value={responseText} onChange={(e)=>onResponseText(e.target.value)} disabled={isThinking} rows={8} placeholder="Explain the truth and connect it to Scripture." /></label>}</>}
      {isThinking && <p className="cl-muted" role="status">Jeremiah is reading your explanation…</p>}{errorMessage && <p className="cl-error" role="alert">{errorMessage}</p>}
      {teacherDecision && <section className="cl-feedback" aria-live="polite"><span className="ld-eyebrow">{teacherDecision.source==='fallback' && response ? 'Assessment unavailable' : 'Jeremiah’s feedback'}</span><p>{teacherDecision.teacherMessage}</p>{teacherDecision.followUpPrompt && <p className="cl-muted">{teacherDecision.followUpPrompt}</p>}<button type="button" className="ld-primary" onClick={onTeacherContinue}>{teacherDecision.verdict==='strong'?'Continue':'Return to your answer'} →</button></section>}
      {complete && <><p className="cl-prose">You have worked through the teaching, Scripture, explanation, application, and defense of this truth.</p><h2>{content.standardTitle}</h2><div className="cl-complete-evidence">{content.sourceStandard.evidence.map((e)=><p key={e.level}><strong>{e.label}</strong><span>{e.text}</span></p>)}</div><button type="button" className="ld-primary" onClick={()=>onNavigate(ROUTES.CLASSROOM_STUDY)}>Return to your study room →</button></>}
      {!teacherDecision && !complete && <button type="button" className="ld-primary cl-next" disabled={isThinking || (!unscored && !ready)} onClick={unscored?onContinue:onSubmit}>{unscored?'Continue':response?'Check my explanation':'Check my answer'} →</button>}
      <p className="cl-muted cl-save">Your place and answers are saved in this browser.</p>
    </main>
    <DeepDiveSheet item={passage} onClose={()=>setPassage(null)} onOpenBible={openBible} />
  </div>;
}


function MediaLessonCheck({check,selection,onSelect}) {
  const selected=check.choices.find(choice=>choice.id===selection);
  const correct=selected?.id===check.answerId;
  return <section className="cl-media-check" aria-label="Video learning check">
    <span className="ld-eyebrow">Pause &amp; notice</span>
    <h3>{check.title}</h3>
    <p>{check.prompt}</p>
    <div className="cl-media-check-choices" role="group" aria-label={check.prompt}>
      {check.choices.map(choice=><button type="button" key={choice.id} aria-pressed={selection===choice.id} onClick={()=>onSelect(choice.id)}>{choice.label}</button>)}
    </div>
    {selected && <p className={correct?'cl-media-check-correct':'cl-media-check-rethink'} role="status">{correct?check.correctFeedback:check.incorrectFeedback}</p>}
  </section>;
}
