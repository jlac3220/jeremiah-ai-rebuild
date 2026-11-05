export default function LessonIcon({name,className=''}) {
 const paths={
  back:<path d="m14 6-6 6 6 6M8 12h12"/>,
  more:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  sound:<><path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
  muted:<><path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="m16 9 6 6m0-6-6 6"/></>,
  replay:<><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/></>,
  play:<path d="m8 5 11 7-11 7V5Z"/>,
  stop:<path d="M6 6h12v12H6z"/>,
  context:<><path d="M4 5h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v14h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4V5Z"/><path d="M12 6v14"/></>,
 };
 return <svg className={'lesson-icon '+className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.context}</svg>;
}
