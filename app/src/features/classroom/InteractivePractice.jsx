import { useState } from 'react';
import { evaluateInteractiveActivity, getInteractiveActivities } from '../../data/curriculum/interactiveActivities';
import './InteractivePractice.css';

// One mobile-sized activity at a time. Tap, choose, or use up/down controls:
// the learner never needs HTML5 drag/drop, a mouse, or external navigation.
export default function InteractivePractice({ content, state, onProgress }) {
  const activities=getInteractiveActivities(content);
  const [index,setIndex]=useState(0);
  if (!activities.length) return null;
  const activity=activities[Math.min(index,activities.length-1)];
  const all=state.experience?.selections?.interactiveActivities || {};
  const saved=all[activity.id] || {};
  const answers=saved.answers || {};
  const ordered=activity.kind==='order'
    ? (Array.isArray(answers.order) && answers.order.length===activity.items.length
       ? answers.order : [...activity.items].reverse().map(item=>item.id))
    : [];
  const correct=evaluateInteractiveActivity(activity,activity.kind==='order'?{...answers,order:ordered}:answers);
  const complete=activity.kind==='blank'?Boolean(answers.choice)
    :activity.kind==='match'?activity.pairs.every(p=>Boolean(answers[p.id]))
    :activity.kind==='sort'?activity.items.every(p=>Boolean(answers[p.id]))
    :activity.kind==='order';
  const update=(next)=>{
    onProgress({selections:{interactiveActivities:{
      ...all,[activity.id]:{answers:next,checked:false}
    }}});
  };
  const check=()=>onProgress({selections:{interactiveActivities:{
    ...all,[activity.id]:{answers:activity.kind==='order'?{...answers,order:ordered}:answers,checked:true}
  }}});
  const swap=(i,direction)=>{
    const next=[...ordered],j=i+direction;
    if(j<0 || j>=next.length) return;
    [next[i],next[j]]=[next[j],next[i]];
    update({...answers,order:next});
  };
  const opts=activity.kind==='match'?[...activity.pairs].reverse():[];
  return <section className="ip-wrap" aria-label="Interactive Scripture practice">
    <div className="ip-heading">
      <span className="ip-eyebrow">TRY IT YOURSELF</span>
      <span className="ip-number">Practice {Math.min(index+1,activities.length)} of {activities.length}</span>
    </div>
    <h2>{activity.title}</h2>
    <p className="ip-instruction">{activity.instruction}</p>
    {activity.reference && <span className="ip-reference">Read alongside {activity.reference}</span>}

    {activity.kind==='match' && <div className="ip-match">
      {activity.pairs.map(pair=><label className="ip-row" key={pair.id}>
        <strong>{pair.label}</strong>
        <select aria-label={'What does '+pair.label+' teach?'} value={answers[pair.id] || ''}
          onChange={e=>update({...answers,[pair.id]:e.target.value})}>
          <option value="">Choose what it teaches…</option>
          {opts.map(opt=><option value={opt.id} key={opt.id}>{opt.meaning}</option>)}
        </select>
      </label>)}
    </div>}

    {activity.kind==='blank' && <div className="ip-blank">
      <p>{activity.before}<span className="ip-blank-answer">{answers.choice || '________'}</span>{activity.after}</p>
      <div className="ip-pills" role="group" aria-label="Fill in the missing words">
        {activity.options.map(option=><button type="button" key={option}
          aria-pressed={answers.choice===option}
          onClick={()=>update({...answers,choice:option})}>{option}</button>)}
      </div>
    </div>}

    {activity.kind==='order' && <ol className="ip-order">
      {ordered.map((id,i)=>{
        const item=activity.items.find(x=>x.id===id);
        return <li key={id}><span className="ip-order-number">{i+1}</span>
          <span className="ip-order-text">{item?.text}</span>
          <span className="ip-move-actions">
            <button type="button" aria-label={'Move '+item?.text+' earlier'}
              disabled={i===0} onClick={()=>swap(i,-1)}>↑</button>
            <button type="button" aria-label={'Move '+item?.text+' later'}
              disabled={i===ordered.length-1} onClick={()=>swap(i,1)}>↓</button>
          </span>
        </li>;
      })}
    </ol>}

    {activity.kind==='sort' && <div className="ip-sort">
      <div className="ip-sort-key">{activity.groups.map(g=><span key={g.id}>{g.label}</span>)}</div>
      {activity.items.map(item=><div className="ip-sort-row" key={item.id}>
        <strong>{item.text}</strong>
        <div role="group" aria-label={'Category for '+item.text}>
          {activity.groups.map(group=><button type="button" key={group.id}
            aria-pressed={answers[item.id]===group.id}
            onClick={()=>update({...answers,[item.id]:group.id})}>{group.label}</button>)}
        </div>
      </div>)}
    </div>}

    <div className="ip-footer">
      <button type="button" className="ip-check" disabled={!complete} onClick={check}>Check my work →</button>
      {saved.checked && <p className={correct?'ip-feedback ip-right':'ip-feedback ip-retry'} role="status">
        <strong>{correct?'Nice work':'Try once more'}</strong>
        {correct?activity.correctFeedback:activity.incorrectFeedback}
      </p>}
      {activities.length>1 && <div className="ip-pagination">
        <button type="button" disabled={index===0} onClick={()=>setIndex(i=>i-1)}>← Previous</button>
        <div aria-hidden="true">{activities.map((a,i)=><span key={a.id} className={i===index?'is-current':''}/>)}</div>
        <button type="button" disabled={index===activities.length-1} onClick={()=>setIndex(i=>i+1)}>Next →</button>
      </div>}
    </div>
    <p className="ip-note">Practice helps you learn. Jeremiah’s scored lesson checks remain separate.</p>
  </section>;
}
