import { useState } from 'react';
import './PosterViewer.css';

export default function PosterViewer({ item }) {
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);
  return <>
    <span className="sc-sheet-label">{item.provider} · Illustrated poster</span>
    <h2>{item.title}</h2>
    <div className="pv-tools" aria-label="Poster zoom controls">
      <button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={()=>setZoom(Math.max(1,zoom-0.5))}>−</button>
      <span aria-live="polite">{Math.round(zoom*100)}%</span>
      <button type="button" aria-label="Zoom in" disabled={zoom >= 4} onClick={()=>setZoom(Math.min(4,zoom+0.5))}>+</button>
      <button type="button" onClick={()=>setZoom(1)}>Fit poster</button>
    </div>
    <p className="pv-hint">Zoom in to read the details. Scroll across the poster to explore.</p>
    {status === 'loading' && <p role="status">Loading the poster…</p>}
    {status === 'error' && <div role="alert"><p>The poster could not load. Check your connection and try again.</p><button type="button" onClick={()=>{setStatus('loading');setRetry(retry+1);}}>Try again</button></div>}
    <div className="pv-canvas" tabIndex={0} role="region" aria-label="Illustrated poster" hidden={status==='error'}>
      <img key={retry} src={item.imageUrl} alt={`${item.title} illustrated teaching poster by ${item.provider}`} style={{width:`${zoom*100}%`}} onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')} />
    </div>
    <small>Illustration: {item.provider}</small>
  </>;
}
