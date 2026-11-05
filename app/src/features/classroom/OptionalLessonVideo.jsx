import {useState} from 'react';
import LessonIcon from '../../shared/lesson/LessonIcon';

// Cross-origin frames cannot reliably report playback failure. Always retain
// an explicit no-video path, including after the browser fires iframe onLoad.
export default function OptionalLessonVideo({video}) {
 const [mode,setMode]=useState('poster');
 return <div className="ogp-optional-video">
  {mode==='player'&&video?.embedUrl?<iframe src={video.embedUrl} title={video.videoTitle||video.title} loading="lazy" allow="encrypted-media; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={()=>setMode('unavailable')}/>:<div className="ogp-video-poster">
   <LessonIcon name="play"/>
   <strong>{video?.videoTitle||video?.title||'Optional lesson video'}</strong>
   <span>{video?.provider} {video?.duration&&`· ${video.duration}`}</span>
   {mode==='unavailable'?<p role="status">The video is unavailable here. You can continue with the Scripture and lesson below.</p>:<p>Optional viewing. The lesson works without video.</p>}
   {video?.embedUrl&&<button type="button" onClick={()=>setMode('player')}>{mode==='unavailable'?'Try video again':'Load optional video'}</button>}
  </div>}
  {mode==='player'&&<div className="ogp-video-help"><span>Video not playing?</span><button type="button" onClick={()=>setMode('unavailable')}>Continue without video</button></div>}
 </div>;
}
