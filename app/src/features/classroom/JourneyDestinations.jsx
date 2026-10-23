import './JourneyDestinations.css';

const STOPS = [
 {title:'Moses',era:'THE FOUNDATION',place:'WILDERNESS · DEUTERONOMY 6',tone:'moses',narration:'Hear, O Israel: The LORD our God is one LORD. The confession is given to Israel in the wilderness.'},
 {title:'Prophets',era:'THE WITNESSES',place:'ISAIAH · THE LORD ALONE',tone:'prophets',narration:'I am the first, and I am the last; and beside me there is no God. Isaiah chapter forty four, verse six.'},
 {title:'Apostles',era:'THE CONTINUATION',place:'JESUS & THE EARLY CHURCH',tone:'apostles',narration:'Jesus repeats the Shema in Mark chapter twelve, verse twenty nine. Paul declares, there is none other God but one.'}
];

export function DestinationArt({tone}) {
 const prefix='journey-'+tone;
 return <svg className="ogj-art" viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label={
  tone==='moses'?'Illustrated rocky wilderness and a distant traveler beneath dawn light':
  tone==='prophets'?'Illustrated ancient hilltop city and a lookout tower under a golden sky':
  'Illustrated ancient harbor, sailing vessel and distant city at twilight'
 }>
  <defs>
   <linearGradient id={prefix+'-sky'} x1="0" y1="0" x2="0" y2="1">
    {tone==='moses'?<><stop stopColor="#243e58"/><stop offset=".61" stopColor="#b78267"/><stop offset="1" stopColor="#e4b789"/></>:tone==='prophets'?<><stop stopColor="#302f45"/><stop offset=".56" stopColor="#996758"/><stop offset="1" stopColor="#d4a16a"/></>:<><stop stopColor="#162a49"/><stop offset=".58" stopColor="#2d6175"/><stop offset="1" stopColor="#bb9877"/></>}
   </linearGradient>
   <radialGradient id={prefix+'-light'} cx=".63" cy=".29" r=".55"><stop stopColor="#ffd9a0" stopOpacity=".7"/><stop offset="1" stopColor="#f3c28a" stopOpacity="0"/></radialGradient>
  </defs>
  <rect width="400" height="420" fill={`url(#${prefix}-sky)`}/>
  <rect width="400" height="420" fill={`url(#${prefix}-light)`}/>
  <circle cx={tone==='apostles'?280:265} cy={tone==='prophets'?92:116} r={tone==='prophets'?34:40} fill="#f8dbab" opacity=".85"/>
  <g fill="#f5e4c1" opacity=".56"><circle cx="45" cy="55" r="1.4"/><circle cx="122" cy="86" r="1.2"/><circle cx="347" cy="45" r="1.1"/><circle cx="309" cy="169" r="1"/></g>
  {tone==='moses'&&<>
   <path d="M0 223 59 156 115 213 167 126 236 216 289 157 400 236V420H0Z" fill="#856c63" opacity=".58"/>
   <path d="M0 294 77 220 125 267 187 204 255 266 330 209 400 280V420H0Z" fill="#a87d5d"/>
   <path d="M0 338Q92 294 161 314T319 301T400 316V420H0Z" fill="#7f6556"/>
   <path d="M0 365Q106 327 160 343T294 324T400 355V420H0Z" fill="#4d5454"/>
   <path d="M182 420Q189 377 227 340Q239 324 235 319Q273 343 261 367Q248 391 243 420Z" fill="#c4a27b" opacity=".8"/>
   <g transform="translate(161 292)" fill="#263a43"><ellipse cx="18" cy="10" rx="6" ry="7"/><path d="M13 18 22 18 29 55 7 55Z"/><path d="M13 40 10 68 15 68 23 45 25 68 30 68 25 37Z"/><path d="M11 23 1 38 4 42 15 32Z"/><path d="M24 23 36 34 34 38 23 31Z"/></g>
   <path d="M197 305V360" stroke="#223742" strokeWidth="2.4" strokeLinecap="round"/>
   <path d="M0 405Q130 365 231 399T400 396" stroke="#d1ae80" strokeWidth="2" opacity=".34" fill="none"/>
  </>}
  {tone==='prophets'&&<>
   <path d="M0 248 73 197 137 248 214 177 302 257 352 218 400 247V420H0Z" fill="#5d5260" opacity=".53"/>
   <path d="M0 318Q76 261 144 289T268 269T400 288V420H0Z" fill="#70535a"/>
   <path d="M0 344Q90 326 157 315T400 332V420H0Z" fill="#3e4554"/>
   <g fill="#bd9072">
    <path d="M58 298V227L89 214 126 225V298Z"/><path d="M104 296V205L158 194 171 294Z"/>
    <path d="M162 302V234L222 216V304Z"/><path d="M224 306V195L263 180 302 197V311Z"/>
    <path d="M298 314V233L344 219 372 239V321Z"/>
   </g>
   <g fill="#765b58">
    <path d="M50 242 92 210 137 236 137 247 92 224 50 253Z"/>
    <path d="M216 199 261 175 306 200 306 210 261 189 216 211Z"/>
    <path d="M100 201 157 190 157 200 103 211Z"/>
   </g>
   <g fill="#293d4a" opacity=".8"><rect x="83" y="260" width="13" height="36" rx="5"/><rect x="245" y="240" width="17" height="69" rx="6"/><rect x="323" y="264" width="11" height="43" rx="5"/></g>
   <path d="M0 364Q122 340 228 353T400 347V420H0Z" fill="#273945"/>
   <path d="M0 412Q160 386 300 408T400 400" stroke="#b99576" strokeWidth="2" opacity=".32" fill="none"/>
  </>}
  {tone==='apostles'&&<>
   <path d="M0 261 57 222 143 253 210 207 281 263 359 232 400 245V420H0Z" fill="#53707b" opacity=".52"/>
   <path d="M0 284 63 261 137 282 199 247 286 289 356 258 400 280V420H0Z" fill="#2c5869"/>
   <g fill="#b68b71"><rect x="20" y="231" width="44" height="65"/><rect x="49" y="211" width="37" height="82"/><rect x="74" y="241" width="36" height="58"/><rect x="307" y="240" width="42" height="61"/><rect x="340" y="218" width="32" height="81"/></g>
   <path d="M42 233 64 215 89 236Z" fill="#e1b28c"/><path d="M337 217 354 193 372 216Z" fill="#d4a584"/>
   <path d="M0 299Q86 285 155 299T299 292T400 298V420H0Z" fill="#27546a"/>
   <path d="M0 315Q110 305 191 315T400 312V420H0Z" fill="#1a435b"/>
   <g transform="translate(116 197)">
    <path d="M42 0V141" stroke="#e8cba7" strokeWidth="4"/>
    <path d="M39 8 39 119-36 119Z" fill="#f5dab1" opacity=".94"/>
    <path d="M46 29 46 113 100 113Z" fill="#e6bf8e" opacity=".81"/>
    <path d="M-58 135Q-14 161 51 158T136 138L108 172H-12Z" fill="#132f42"/>
    <path d="M-58 135Q31 141 136 138" stroke="#d7b489" strokeWidth="3" fill="none"/>
   </g>
   <path d="M0 365Q88 350 177 369T400 360" stroke="#d3b38e" strokeWidth="2" opacity=".33" fill="none"/>
   <path d="M0 392Q95 378 181 392T400 385" stroke="#c6b8a6" strokeWidth="1.5" opacity=".24" fill="none"/>
  </>}
 </svg>;
}

export default function JourneyDestinations({options,selected,onSelect,onSpeak}) {
 return <div className="ogj-journey">
  <div className="ogj-introduction"><span className="ogj-eyebrow">THREE ERAS · ONE CONFESSION</span><p>Where does the confession travel? Choose a destination to explore the story.</p></div>
  <div className="ogj-gallery">
   {STOPS.map((stop,i)=><button key={stop.tone} type="button" className={'ogj-destination'+(selected===i?' is-selected':'')} aria-pressed={selected===i} onClick={()=>onSelect(i)}>
    <DestinationArt tone={stop.tone}/>
    <div className="ogj-card-shade" aria-hidden="true"/>
    <span className="ogj-era">{String(i+1).padStart(2,'0')} / {stop.era}</span>
    <div className="ogj-card-caption"><span>{stop.place}</span><strong>{stop.title}</strong></div>
    <span className="ogj-card-arrow" aria-hidden="true">{selected===i?'✓':'↗'}</span>
   </button>)}
  </div>
  {selected!==null&&<div className="ogj-reveal" aria-live="polite">
    <div><span className="ogj-reveal-kicker">YOUR DESTINATION · {STOPS[selected].era}</span><h2>{STOPS[selected].title}</h2><p>{options[selected][1]}</p><small>{selected===2?'The confession continues without being replaced.':'The same biblical confession is being tested and carried forward.'}</small></div>
    <button type="button" onClick={()=>onSpeak?.(STOPS[selected].narration)} aria-label={'Hear the '+STOPS[selected].title+' chapter introduction'}><span aria-hidden="true">◖))</span> Hear the words</button>
   </div>}
 </div>;
}
