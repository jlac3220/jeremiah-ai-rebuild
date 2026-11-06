import {useState} from 'react';
import LessonIcon from '../../shared/lesson/LessonIcon';

// Load the educational video as soon as its lesson moment appears.
// Playback remains user-controlled: the existing lesson Next button skips it.
export default function OptionalLessonVideo({video}) {
 const [unavailable,setUnavailable]=useState(false);
 return <div className="ogp-optional-video">
  {video?.embedUrl&&!unavailable?<iframe src={video.embedUrl} title={video.videoTitle||video.title||'Lesson video'} loading="eager" allow="encrypted-media; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={()=>setUnavailable(true)}/>:<div className="ogp-video-poster">
   <LessonIcon name="play"/>
   <strong>{video?.videoTitle||video?.title||'Optional lesson video'}</strong>
   <span>{video?.provider} {video?.duration&&`· ${video.duration}`}</span>
   <p role="status">{unavailable?'Video could not be loaded here. You can continue to the next lesson moment.':'Video is not available. Continue to the next lesson moment.'}</p>
   {unavailable&&video?.embedUrl&&<button type="button" onClick={()=>setUnavailable(false)}>Retry video</button>}
  </div>}
  {video?.embedUrl&&!unavailable&&<p className="ogp-video-help">Press play to watch, or use the lesson’s Next button to continue without watching.</p>}
 </div>;
}
