// Draghetto mascotte — componente web riutilizzabile, nessuna dipendenza, funziona offline.
// Uso:
//   <script src="draghetto.js"></script>
//   <drago-mascotte mood="happy" season="autumn"></drago-mascotte>
// Da JavaScript:
//   const drago = document.querySelector('drago-mascotte');
//   drago.mood = 'sad';          // 'happy' | 'sad' | 'angry'
//   drago.season = 'winter';     // 'autumn' | 'winter' | 'spring' | 'summer' | '' (nessuna)
//   drago.season = 'auto';       // stagione scelta in base alla data di oggi
//   drago.time = 'auto';         // 'day' | 'night' | 'auto' (sole o luna in base all'ora) | '' (nessuno)
//   drago.celebrate();           // piroetta di festa (es. obiettivo completato)

(function () {
  const MOODS = ['happy', 'sad', 'angry'];
  const SEASONS = ['autumn', 'winter', 'spring', 'summer'];

  const TIMES = ['day', 'night'];
  function timeFromDate(d = new Date()) {
    const h = d.getHours();
    return h >= 7 && h < 19 ? 'day' : 'night'; // giorno dalle 7:00 alle 18:59
  }

  function seasonFromDate(d = new Date()) {
    const m = d.getMonth(); // 0 = gennaio
    if (m === 11 || m <= 1) return 'winter';
    if (m <= 4) return 'spring';
    if (m <= 7) return 'summer';
    return 'autumn';
  }

  const STYLE = `
:host{display:inline-block;width:240px;max-width:100%}
svg{width:100%;height:auto;display:block;overflow:hidden}
.ex,.se{display:none}
.happy .h,.sad .s,.angry .a{display:inline}
.autumn .au,.winter .wi,.spring .sp,.summer .su{display:inline}
.autumn .nau{display:none}
#wl,#wr,#tail,#head,#lgl,#lgr,.smk{transform-box:fill-box}
#wl{transform-origin:100% 100%}#wr{transform-origin:0% 100%}#tail{transform-origin:0% 50%}
#head{transform-origin:50% 100%;transition:transform .6s}#lgl,#lgr{transform-origin:50% 0%}.smk{transform-origin:center}
.happy #drg{animation:bo .6s ease-in-out infinite}
.happy #wl{animation:fl .3s ease-in-out infinite alternate}.happy #wr{animation:fr .3s ease-in-out infinite alternate}
.happy #tail{animation:wag .4s ease-in-out infinite alternate}
.happy #lgl{animation:ll 4s ease-in-out infinite}.happy #lgr{animation:lr 4s ease-in-out infinite}
.sad #head{transform:translateY(12px) rotate(-4deg)}
.sad #wl{transform:rotate(28deg)}.sad #wr{transform:rotate(-28deg)}.sad #tail{transform:rotate(22deg)}
.sad #bod{animation:br 2.4s ease-in-out infinite}.sad #tear{animation:td 1.6s ease-in infinite}
.angry #drg{animation:sh .14s linear infinite}
.angry #wl{animation:fl .18s linear infinite alternate}.angry #wr{animation:fr .18s linear infinite alternate}
.angry .smk{animation:sm 1.2s ease-out infinite}.angry .smk2{animation-delay:.6s}
.fall{animation:fall linear infinite}
.spin{transform-box:fill-box;transform-origin:center;animation:spin 3s linear infinite}
.bird{transform-box:fill-box;transform-origin:50% 100%;animation:hop 2.6s ease-in-out infinite}
.crab{transition:transform .4s ease-in;animation:scut 2.2s ease-in-out infinite}
.angry .crab{animation:none;transform:translateY(44px)}
.spring.angry .bird{animation:orbit 2.4s linear infinite}
.spring.angry .bw{transform-box:fill-box;transform-origin:50% 100%;animation:flap .12s linear infinite alternate}
@keyframes scut{0%,100%{transform:translateX(0)}50%{transform:translateX(-6px)}}
@keyframes orbit{0%,100%{transform:translate(0,0) rotate(0)}20%{transform:translate(-90px,-22px) rotate(-10deg)}40%{transform:translate(-175px,60px) rotate(-20deg)}60%{transform:translate(-90px,135px) rotate(0)}80%{transform:translate(40px,70px) rotate(15deg)}}
@keyframes flap{to{transform:scaleY(-1)}}
@keyframes bo{50%{transform:translateY(-16px)}}
@keyframes fl{from{transform:rotate(0)}to{transform:rotate(-22deg)}}
@keyframes fr{from{transform:rotate(0)}to{transform:rotate(22deg)}}
@keyframes wag{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes br{50%{transform:translateY(3px)}}
@keyframes td{0%{transform:translateY(0);opacity:1}100%{transform:translateY(40px);opacity:0}}
@keyframes sh{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
@keyframes sm{0%{transform:translateY(0) scale(.6);opacity:.9}100%{transform:translateY(-45px) scale(1.4);opacity:0}}
@keyframes ll{0%,8%,28%,66%,90%,100%{transform:none}13%,23%{transform:translateY(-26px) rotate(28deg)}18%{transform:translateY(-30px) rotate(40deg)}71%,85%{transform:translateY(-28px) rotate(32deg)}78%{transform:translateY(-32px) rotate(42deg)}}
@keyframes lr{0%,36%,56%,66%,90%,100%{transform:none}41%,51%{transform:translateY(-26px) rotate(-28deg)}46%{transform:translateY(-30px) rotate(-40deg)}71%,85%{transform:translateY(-28px) rotate(-32deg)}78%{transform:translateY(-32px) rotate(-42deg)}}
@keyframes cl{0%,100%{transform:none}25%,75%{transform:translateY(-28px) rotate(32deg)}50%{transform:translateY(-32px) rotate(44deg)}}
@keyframes cr{0%,100%{transform:none}25%,75%{transform:translateY(-28px) rotate(-32deg)}50%{transform:translateY(-32px) rotate(-44deg)}}
@keyframes fall{0%{transform:translate(0,0);opacity:0}8%{opacity:1}50%{transform:translate(18px,160px)}92%{opacity:1}100%{transform:translate(-6px,320px);opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes hop{0%,70%,100%{transform:none}78%{transform:translateY(-7px)}86%{transform:none}93%{transform:rotate(-12deg)}}
.owl{transform-box:fill-box;transform-origin:50% 100%;animation:hop 3.2s ease-in-out infinite}
.autumn.angry .owl{animation:orbitL 2.4s linear infinite}
.autumn.angry .owl .bw{transform-box:fill-box;transform-origin:50% 0%;animation:flap .12s linear infinite alternate}
.ang{display:none}.winter.angry .ang{display:inline}.winter.angry .calm{display:none}
.tree{transform-box:fill-box;transform-origin:50% 100%;transition:transform .4s}
.winter.angry .tree{transform:rotate(-9deg)}
#drg{transform-box:fill-box;transform-origin:50% 50%}
.cel #drg{animation:piro 1.6s ease-in-out}
.cel #lgl{animation:cl 1.6s ease-in-out}.cel #lgr{animation:cr 1.6s ease-in-out}
.pals{display:none}.cel.spring .psp,.cel.autumn .pau{display:inline}
.cel .bird,.cel .owl{visibility:hidden}
.orb{transform-origin:340px 200px;animation:rot 1.6s linear}
.ctr{transform-box:fill-box;transform-origin:center;animation:rot 1.6s linear reverse}
@keyframes rot{to{transform:rotate(360deg)}}
@keyframes orbitL{0%,100%{transform:translate(0,0) rotate(0)}20%{transform:translate(90px,-22px) rotate(10deg)}40%{transform:translate(175px,60px) rotate(20deg)}60%{transform:translate(90px,135px) rotate(0)}80%{transform:translate(-40px,70px) rotate(-15deg)}}
@keyframes piro{0%{transform:none}15%{transform:translateY(-20px) scaleX(1)}30%{transform:translateY(-34px) scaleX(.05)}45%{transform:translateY(-40px) scaleX(-1)}60%{transform:translateY(-34px) scaleX(.05)}75%{transform:translateY(-20px) scaleX(1)}100%{transform:none}}
.walker{display:none}
.spring.sad .wsp,.autumn.sad .wau{display:inline;animation:walk 10s linear infinite}
.spring.sad .bird,.autumn.sad .owl{visibility:hidden}
.waddle{transform-box:fill-box;transform-origin:50% 100%;animation:wad .45s ease-in-out infinite alternate}
@keyframes walk{0%{transform:translateX(0);opacity:0}5%{opacity:1}95%{opacity:1}100%{transform:translateX(-500px);opacity:0}}
@keyframes wad{from{transform:rotate(-5deg)}to{transform:rotate(5deg) translateY(-2px)}}
.spook{fill:#1a1a1a;animation:spk 7s step-end infinite}
@keyframes spk{0%{fill:#1a1a1a;filter:none}42.857%{fill:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}50%{fill:#1a1a1a;filter:none}57.143%{fill:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}64.286%{fill:#1a1a1a;filter:none}71.429%{fill:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}78.571%{fill:#1a1a1a;filter:none}85.714%{fill:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}92.857%{fill:#1a1a1a;filter:none}100%{fill:#1a1a1a;filter:none}}
.spook2{color:#1a1a1a;fill:currentColor;animation:spk2 7s step-end infinite}
@keyframes spk2{0%{color:#1a1a1a;filter:none}50%{color:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}57.143%{color:#1a1a1a;filter:none}64.286%{color:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}71.429%{color:#1a1a1a;filter:none}78.571%{color:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}85.714%{color:#1a1a1a;filter:none}92.857%{color:#F2C230;filter:drop-shadow(0 0 4px #F2C230)}100%{color:#1a1a1a;filter:none}}
.tday,.tnight{display:none}.day .tday,.night .tnight{display:inline}
.rays{transform-box:fill-box;transform-origin:center;animation:spin 18s linear infinite}
.twk{animation:twk 2.4s ease-in-out infinite}
@keyframes twk{50%{opacity:.25}}
.fullmoon,.bats{display:none}.autumn.night .fullmoon,.autumn.night .bats{display:inline}.autumn.night .crescent{display:none}
.fullmoon .disc{filter:drop-shadow(0 0 6px #F7EBC0)}
.cld{animation:drift 10s ease-in-out infinite alternate}.cld2{animation-duration:13s;animation-delay:-5s}
@keyframes drift{from{transform:translateX(-55px)}to{transform:translateX(55px)}}
.bo{animation:rot 5s linear infinite}.bo2{animation-duration:6.5s;animation-direction:reverse}
.bwing{transform-box:fill-box;transform-origin:50% 100%;animation:bflap .16s ease-in-out infinite alternate}
@keyframes bflap{to{transform:scaleY(.25)}}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
`;

  const fallStyle = (d, t) => `style="animation-duration:${t}s;animation-delay:-${d}s"`;

  const LEAVES = [[135,2.5,8,'#E07B2A'],[165,5.5,9.5,'#E8B23A'],[545,0.5,8.5,'#C8402F'],[578,4.5,7,'#E07B2A'],[205,0,7,'#E8B23A'],[255,2,9,'#E07B2A'],[305,4,8,'#C8402F'],[378,1,10,'#E8B23A'],[428,3,7.5,'#E07B2A'],[490,5,9,'#C8402F'],[232,6,8.5,'#C8402F'],[455,7,8,'#E8B23A']]
    .map(([x,d,t,c]) => `<g class="fall" ${fallStyle(d,t)}><path class="spin" d="M${x} 22 Q${x+9} 31 ${x} 42 Q${x-9} 31 ${x} 22 Z M${x} 24 V40" fill="${c}" stroke="#8A4A1A" stroke-width="1"/></g>`).join('');

  const SNOW = [[130,2,7,4],[160,4.5,8.5,3],[540,0.8,7.5,4],[575,3,6.5,3],[200,0,6,4],[228,3,8,3],[262,1,7,5],[300,5,9,3],[335,2,6.5,4],[372,6,8,3],[405,4,7,5],[440,1.5,9,3],[472,3.5,6,4],[505,5.5,8,3]]
    .map(([x,d,t,r]) => `<g class="fall" ${fallStyle(d,t)}><circle cx="${x}" cy="30" r="${r}" fill="#fff" stroke="#B8C4CC" stroke-width="1"/></g>`).join('');

  const flower = (x, y, c, mid) => {
    const petals = [0,72,144,216,288].map(a => {
      const r = a * Math.PI / 180;
      return `<circle cx="${(x + 6*Math.cos(r)).toFixed(1)}" cy="${(y + 6*Math.sin(r)).toFixed(1)}" r="5" fill="${c}"/>`;
    }).join('');
    return `<path d="M${x} ${y} V${y+22}" stroke="#3E9C72" stroke-width="3"/><path d="M${x} ${y+14} Q${x+9} ${y+8} ${x+11} ${y+13} Q${x+5} ${y+17} ${x} ${y+14} Z" fill="#4FAE82"/>${petals}<circle cx="${x}" cy="${y}" r="4" fill="${mid}"/>`;
  };
  const FLOWERS = [[212,318,'#E24B4A','#F2C230'],[240,328,'#ED93B1','#F2C230'],[268,320,'#F2C230','#E07B2A'],[412,324,'#7F77DD','#F2C230'],[440,316,'#E24B4A','#F2C230'],[468,328,'#378ADD','#F2C230'],[496,320,'#ED93B1','#F2C230']]
    .map(([x,y,c,m]) => flower(x,y,c,m)).join('');

  const mush = (x, s, c, dots) => {
    const y = 346;
    let out = `<rect x="${x-3*s}" y="${y-11*s}" width="${6*s}" height="${11*s}" rx="${2*s}" fill="#F3E3BE"/><path d="M${x-12*s} ${y-9*s} Q${x} ${y-27*s} ${x+12*s} ${y-9*s} Z" fill="${c}"/>`;
    if (dots) out += `<circle cx="${x-5*s}" cy="${y-14*s}" r="${2*s}" fill="#fff"/><circle cx="${x+4*s}" cy="${y-17*s}" r="${2.2*s}" fill="#fff"/><circle cx="${x+7*s}" cy="${y-11*s}" r="${1.6*s}" fill="#fff"/>`;
    return out;
  };
  const MUSHROOMS = [[140,1.1,'#C8402F',1],[168,0.8,'#A86A3A',0],[218,1.3,'#C8402F',1],[246,0.9,'#A86A3A',0],[442,1,'#A86A3A',0],[472,1.35,'#C8402F',1],[548,1.1,'#A86A3A',0],[578,0.9,'#C8402F',1]]
    .map(([x,sz,c,d]) => mush(x,sz,c,d)).join('')
    + `<path d="M190 344 Q198 336 206 344 Q198 348 190 344 Z" fill="#E07B2A"/><path d="M410 343 Q419 335 428 343 Q419 348 410 343 Z" fill="#C8402F"/><path d="M500 345 Q508 337 516 345 Q508 349 500 345 Z" fill="#E8B23A"/>`;

  const STAR = '<polygon points="560,216 563.5,224 572,224 565.5,229 568,238 560,233 552,238 554.5,229 548,224 556.5,224" fill="#F2C230"/>';
  const gift = (x, y, w, h, c, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${c}"/><rect x="${x+w/2-3}" y="${y}" width="6" height="${h}" fill="${r}"/><rect x="${x}" y="${y+h/2-3}" width="${w}" height="6" fill="${r}"/><path d="M${x+w/2} ${y} Q${x+w/2-11} ${y-11} ${x+w/2-5} ${y-2} M${x+w/2} ${y} Q${x+w/2+11} ${y-11} ${x+w/2+5} ${y-2}" stroke="${r}" stroke-width="3" fill="none"/>`;
  const WINTER_PROPS = `
<g transform="translate(140 344) scale(1.4) translate(-160 -344)">
<g class="calm">
<circle cx="160" cy="320" r="24" fill="#fff" stroke="#B8C4CC" stroke-width="2"/><circle cx="160" cy="283" r="18" fill="#fff" stroke="#B8C4CC" stroke-width="2"/><circle cx="160" cy="254" r="13" fill="#fff" stroke="#B8C4CC" stroke-width="2"/>
<path d="M143 280 L124 266 M131 271 L126 262 M177 280 L194 268" stroke="#7A4A2A" stroke-width="3" stroke-linecap="round" fill="none"/>
<rect x="148" y="264" width="24" height="6" rx="3" fill="#E24B4A"/>
<rect x="150" y="230" width="20" height="13" fill="#1a1a1a"/><rect x="145" y="241" width="30" height="4" rx="2" fill="#1a1a1a"/>
<circle cx="155" cy="251" r="2" fill="#1a1a1a"/><circle cx="165" cy="251" r="2" fill="#1a1a1a"/><polygon points="160,255 175,258 160,260" fill="#E07B2A"/>
<circle cx="160" cy="280" r="2.2" fill="#1a1a1a"/><circle cx="160" cy="290" r="2.2" fill="#1a1a1a"/><circle cx="160" cy="312" r="2.2" fill="#1a1a1a"/>
</g>
<g class="ang">
<ellipse cx="160" cy="342" rx="46" ry="7" fill="#B5D4F4"/>
<path d="M130 342 Q124 322 140 312 Q137 298 150 292 Q149 279 160 277 Q171 279 170 292 Q183 298 180 312 Q196 322 190 342 Z" fill="#fff" stroke="#B8C4CC" stroke-width="2"/>
<circle cx="155" cy="289" r="2" fill="#1a1a1a"/><circle cx="165" cy="291" r="2" fill="#1a1a1a"/><polygon points="158,295 163,295 157,309" fill="#E07B2A"/>
<circle cx="160" cy="318" r="2.2" fill="#1a1a1a"/><circle cx="162" cy="330" r="2.2" fill="#1a1a1a"/>
<path d="M120 341 L134 336 M188 343 L201 338" stroke="#7A4A2A" stroke-width="3" stroke-linecap="round"/>
<rect x="126" y="336" width="20" height="5" rx="2" fill="#E24B4A"/>
<g transform="rotate(-28 192 336)"><rect x="182" y="323" width="20" height="13" fill="#1a1a1a"/><rect x="177" y="334" width="30" height="4" rx="2" fill="#1a1a1a"/></g>
<path d="M146 300 Q143 306 146 308 Q149 306 146 300 Z M176 318 Q173 324 176 326 Q179 324 176 318 Z" fill="#85B7EB"/>
</g>
</g>
<g transform="translate(575 344) scale(1.4) translate(-560 -344)">
<g class="tree">
<rect x="553" y="316" width="14" height="28" fill="#7A4A2A"/>
<polygon points="560,276 524,320 596,320" fill="#2F7D4A"/><polygon points="560,252 530,294 590,294" fill="#378A55"/>
<g class="calm"><polygon points="560,230 536,268 584,268" fill="#2F7D4A"/><circle cx="552" cy="262" r="4" fill="#E24B4A"/>${STAR}<circle cx="570" cy="282" r="4" fill="#F2C230"/><circle cx="544" cy="312" r="4" fill="#F2C230"/></g>
<g class="ang"><polygon points="560,252 548,262 556,268 546,276 560,272" fill="#1F5C37"/></g>
<circle cx="546" cy="288" r="4" fill="#378ADD"/><circle cx="576" cy="310" r="4" fill="#E24B4A"/><circle cx="562" cy="300" r="4" fill="#378ADD"/>
</g>
<g class="ang">
<g transform="translate(-40 108) rotate(28 560 228)">${STAR}</g>
<polygon points="560,230 536,268 584,268" fill="#2F7D4A" transform="translate(-58 66) rotate(-70 560 268) scale(.8)" opacity=".95"/>
<path d="M590 343 a4 4 0 0 1 8 0 Z" fill="#E24B4A"/><path d="M604 343 a4 4 0 0 1 8 0 Z" fill="#F2C230"/>
<path d="M596 340 l3 -5 l2 5 Z M610 341 l2 -4 l3 4 Z" fill="#B5D4F4"/>
</g>
</g>
${gift(196,318,28,26,'#E24B4A','#F2C230')}${gift(228,328,22,16,'#378ADD','#fff')}${gift(494,322,26,22,'#7F77DD','#F2C230')}${gift(604,328,22,16,'#E24B4A','#fff')}`;

  const SUMMER_PROPS = `
<g transform="translate(140 346) scale(1.5) translate(-156 -346)"><path d="M156 191 V346" stroke="#8A8F96" stroke-width="4"/>
<path d="M117 214 Q156 168 195 214 Z" fill="#E24B4A"/><path d="M156 191 L130 214 L142 214 Z M156 191 L170 214 L182 214 Z" fill="#fff"/><circle cx="156" cy="190" r="4" fill="#8A8F96"/></g>
<ellipse cx="552" cy="344" rx="24" ry="5" fill="#6B4A2A"/>
<g clip-path="url(#tana)"><g class="crab">
<path d="M544 328 L541 315 M549 328 L551 315" stroke="#E24B4A" stroke-width="2"/><circle cx="541" cy="313" r="3" fill="#1a1a1a"/><circle cx="551" cy="313" r="3" fill="#1a1a1a"/><circle cx="542" cy="312" r="1" fill="#fff"/><circle cx="552" cy="312" r="1" fill="#fff"/>
<path d="M542 339 L535 345 M548 340 L545 346" stroke="#E24B4A" stroke-width="2"/>
<ellipse cx="546" cy="334" rx="9" ry="7" fill="#E24B4A"/><circle cx="535" cy="330" r="5.5" fill="#E24B4A"/><path d="M531 327 L536 330" stroke="#A32D2D" stroke-width="1.5"/>
<ellipse cx="563" cy="326" rx="17" ry="15" fill="#F0C27A"/><path d="M555 326 A8 8 0 1 1 563 334 A5 5 0 1 1 558 329" fill="none" stroke="#C9893A" stroke-width="2"/>
</g></g>`;

  const BIRD = '<path d="M388 44 L376 38 L381 50 Z" fill="#185FA5"/><ellipse cx="400" cy="44" rx="14" ry="10" fill="#378ADD"/><circle cx="412" cy="34" r="8" fill="#378ADD"/><ellipse cx="402" cy="47" rx="8" ry="5" fill="#B5D4F4"/><path class="bw" d="M392 42 Q400 36 406 44 Q398 48 392 42 Z" fill="#185FA5"/><polygon points="419,32 427,35 419,37" fill="#EF9F27"/><circle cx="414" cy="31" r="1.8" fill="#0E2A1E"/><path d="M398 53 V57 M404 53 V57" stroke="#EF9F27" stroke-width="2"/>';
  const OWL = '<ellipse cx="278" cy="38" rx="13" ry="15" fill="#8A5A34"/><polygon points="267,30 265,17 274,26" fill="#8A5A34"/><polygon points="289,30 291,17 282,26" fill="#8A5A34"/><ellipse cx="278" cy="44" rx="8" ry="8" fill="#D9B98A"/><ellipse class="bw" cx="266" cy="41" rx="4" ry="9" fill="#6B4226"/><ellipse class="bw" cx="290" cy="41" rx="4" ry="9" fill="#6B4226"/><circle cx="273" cy="31" r="5" fill="#F2C230"/><circle cx="283" cy="31" r="5" fill="#F2C230"/><circle cx="273" cy="31" r="2.3" fill="#1a1a1a"/><circle cx="283" cy="31" r="2.3" fill="#1a1a1a"/><polygon points="276,35 280,35 278,40" fill="#E07B2A"/><path d="M274 53 V57 M282 53 V57" stroke="#E07B2A" stroke-width="2"/>';
  // alberi spogli dell'autunno: facce incise che lampeggiano a turno (mai accese insieme)
  const bareTree = (x, face) => `
<path d="M${x-26} 346 Q${x-18} 300 ${x-16} 230 Q${x-16} 190 ${x-30} 150 L${x-22} 146 Q${x-6} 180 ${x-4} 200 Q${x+2} 170 ${x+22} 130 L${x+30} 136 Q${x+14} 180 ${x+16} 230 Q${x+18} 300 ${x+26} 346 Z" fill="#7A5636"/>
<path d="M${x-26} 152 Q${x-48} 120 ${x-44} 88 M${x+26} 134 Q${x+40} 100 ${x+30} 68 M${x-4} 196 Q${x} 150 ${x-6} 112" fill="none" stroke="#7A5636" stroke-width="7" stroke-linecap="round"/>
<path d="M${x-38} 128 Q${x-58} 124 ${x-66} 106 M${x-44} 104 Q${x-30} 92 ${x-28} 76 M${x+34} 112 Q${x+54} 104 ${x+62} 86 M${x+33} 88 Q${x+20} 76 ${x+18} 62 M${x-5} 140 Q${x+10} 128 ${x+12} 112" fill="none" stroke="#7A5636" stroke-width="4" stroke-linecap="round"/>
<path d="M${x-10} 300 Q${x-6} 318 ${x-10} 336 M${x+9} 292 Q${x+12} 310 ${x+8} 330" fill="none" stroke="#5E4128" stroke-width="2" stroke-linecap="round"/>
${face}`;
  const SPOOKY_FACE = (x) => `<g class="spook"><ellipse cx="${x-9}" cy="242" rx="5" ry="8"/><ellipse cx="${x+9}" cy="242" rx="5" ry="8"/><ellipse cx="${x}" cy="272" rx="7" ry="13"/></g>`;
  const FUNNY_FACE = (x) => `<g class="spook2"><circle cx="${x-9}" cy="240" r="6"/><circle cx="${x+9}" cy="243" r="3.5"/><path d="M${x-8} 232 L${x-15} 229 M${x+5} 236 L${x+13} 233" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><ellipse cx="${x+1}" cy="252" rx="2.5" ry="2"/><path d="M${x-14} 262 Q${x} 282 ${x+14} 259 Q${x} 270 ${x-14} 262 Z"/><path d="M${x+2} 270 Q${x+6} 280 ${x+10} 266 Z"/></g>`;
  const TREES_AU = bareTree(140, SPOOKY_FACE(140)) + bareTree(565, FUNNY_FACE(565));

  // cielo: sole di giorno, luna e stelle di notte
  const SUN = `<g class="rays">${[0,45,90,135,180,225,270,315].map(a => `<rect x="512" y="10" width="6" height="12" rx="3" fill="#F2C230" transform="rotate(${a} 515 42)"/>`).join('')}</g><circle cx="515" cy="42" r="19" fill="#F7D046"/><circle cx="515" cy="42" r="14" fill="#FAE08A"/>`;
  const star = (x, y, r, d) => `<path class="twk" style="animation-delay:-${d}s" d="M${x} ${y-r} Q${x} ${y} ${x+r} ${y} Q${x} ${y} ${x} ${y+r} Q${x} ${y} ${x-r} ${y} Q${x} ${y} ${x} ${y-r} Z" fill="#F2C230"/>`;
  const MOON = `<g class="crescent"><mask id="luna"><circle cx="515" cy="42" r="20" fill="#fff"/><circle cx="526" cy="35" r="17" fill="#000"/></mask><circle cx="515" cy="42" r="20" fill="#F5E6A8" mask="url(#luna)"/></g>`
    + [[190,24,6,0],[226,62,4,.8],[450,20,5,1.6],[472,74,4,.4],[598,26,6,1.2],[150,108,4,2],[548,92,4,.6]].map(([x,y,r,d]) => star(x,y,r,d)).join('');

  // notte d'autunno: luna piena con nuvole che scorrono e pipistrelli intorno agli alberi
  const cloud = (x, y, k) => `<ellipse cx="${x}" cy="${y}" rx="${24*k}" ry="${8*k}"/><circle cx="${x-9*k}" cy="${y-5*k}" r="${9*k}"/><circle cx="${x+6*k}" cy="${y-8*k}" r="${11*k}"/>`;
  const FULL_MOON = `<g class="fullmoon"><circle class="disc" cx="515" cy="42" r="23" fill="#F7EBC0"/><circle cx="506" cy="35" r="4.5" fill="#E8D9A6"/><circle cx="523" cy="49" r="5.5" fill="#E8D9A6"/><circle cx="521" cy="32" r="2.5" fill="#E8D9A6"/><circle cx="505" cy="51" r="2" fill="#E8D9A6"/>
<g class="cld" fill="#9AA3B5" opacity=".92">${cloud(512, 30, 1)}</g><g class="cld cld2" fill="#8790A3" opacity=".9">${cloud(522, 60, .85)}</g></g>`;
  const bat = (x, y) => `<g fill="#1a1a1a"><path class="bwing" d="M${x} ${y} Q${x-6} ${y-8} ${x-16} ${y-5} Q${x-11} ${y-1} ${x-13} ${y+3} Q${x-6} ${y} ${x} ${y+3} Z"/><path class="bwing" d="M${x} ${y} Q${x+6} ${y-8} ${x+16} ${y-5} Q${x+11} ${y-1} ${x+13} ${y+3} Q${x+6} ${y} ${x} ${y+3} Z"/><ellipse cx="${x}" cy="${y+1}" rx="3" ry="4.5"/><path d="M${x-3} ${y-2} L${x-2.5} ${y-7} L${x} ${y-3} L${x+2.5} ${y-7} L${x+3} ${y-2} Z"/></g>`;
  const batRing = (cx, cy, r, cls, delays) => delays.map(d => `<g class="bo ${cls}" style="transform-origin:${cx}px ${cy}px;animation-delay:-${d}s">${bat(cx, cy - r)}</g>`).join('');
  const BATS = batRing(140, 112, 52, '', [0, 2.5]) + batRing(565, 108, 50, 'bo2', [0, 2.2, 4.4]);

  // compagni che girano intorno al drago durante celebrate()
  const pal = (inner, ang) => `<g transform="rotate(${ang} 340 200)"><g class="orb"><g transform="rotate(${-ang} 340 50)"><g class="ctr">${inner}</g></g></g></g>`;
  const PALS_SP = [0,120,240].map(a => pal(`<g transform="translate(-62 6)">${BIRD}</g>`, a)).join('');
  const PALS_AU = [0,120,240].map(a => pal(`<g transform="translate(62 12)">${OWL}</g>`, a)).join('');

  const SVG = `
<svg viewBox="75 5 555 355" role="img" aria-label="Draghetto mascotte">
<defs><clipPath id="tana"><rect x="500" y="240" width="100" height="104"/></clipPath></defs>
<g class="tday">${SUN}</g>
<g class="tnight">${MOON}${FULL_MOON}</g>
<g class="se au">${TREES_AU}</g>
<g class="bats">${BATS}</g>
<ellipse cx="340" cy="345" rx="95" ry="10" fill="#1F6B4E" opacity=".18"/>
<g class="se sp">${FLOWERS}</g>
<g class="se au">${MUSHROOMS}</g>
<g class="se wi">${WINTER_PROPS}</g>
<g class="se su">${SUMMER_PROPS}</g>
<g id="drg">
<g id="tail"><path d="M398 290 Q470 320 500 272" fill="none" stroke="#5BBE8E" stroke-width="24" stroke-linecap="round"/><path class="nau" d="M490 278 Q504 252 520 242 Q518 268 506 288 Z" fill="#1F6B4E"/>
<g class="se au" transform="translate(506 264) scale(1.4) translate(-506 -264)"><ellipse cx="494" cy="264" rx="9" ry="13" fill="#D86A1E"/><ellipse cx="518" cy="264" rx="9" ry="13" fill="#D86A1E"/><ellipse cx="506" cy="264" rx="11" ry="14" fill="#EF8A2A"/><rect x="503" y="246" width="6" height="7" rx="2" fill="#3E7D3A"/><polygon points="497,259 503,259 500,253" fill="#3A1A08"/><polygon points="509,259 515,259 512,253" fill="#3A1A08"/><path d="M496 267 L500 271 L504 267 L508 271 L512 267 L516 267 Q506 279 496 267 Z" fill="#3A1A08"/></g></g>
<g id="wl"><path d="M304 222 L198 142 Q214 172 202 184 Q226 188 218 206 Q242 206 252 228 Z" fill="#E9DC9A" stroke="#3E9C72" stroke-width="5" stroke-linejoin="round"/></g>
<g id="wr"><path d="M376 222 L482 142 Q466 172 478 184 Q454 188 462 206 Q438 206 428 228 Z" fill="#E9DC9A" stroke="#3E9C72" stroke-width="5" stroke-linejoin="round"/></g>
<g id="bod">
<ellipse cx="296" cy="316" rx="16" ry="22" fill="#3E9C72"/><ellipse cx="384" cy="316" rx="16" ry="22" fill="#3E9C72"/>
<ellipse cx="340" cy="266" rx="68" ry="66" fill="#5BBE8E"/>
<ellipse cx="340" cy="280" rx="38" ry="50" fill="#F3E3BE"/>
<path d="M314 262 Q340 268 366 262 M309 284 Q340 292 371 284 M315 306 Q340 313 365 306" fill="none" stroke="#E2CC9A" stroke-width="3" stroke-linecap="round"/>
<g class="se su"><path d="M278 292 Q340 302 402 292 L384 318 Q362 326 346 322 L340 310 L334 322 Q318 326 296 318 Z" fill="#378ADD"/><g fill="#fff"><circle cx="298" cy="302" r="3"/><circle cx="320" cy="308" r="3"/><circle cx="360" cy="308" r="3"/><circle cx="382" cy="302" r="3"/><circle cx="340" cy="302" r="3"/></g></g>
<g id="lgl"><rect x="306" y="294" width="24" height="34" rx="12" fill="#4FAE82"/><ellipse cx="318" cy="328" rx="18" ry="15" fill="#4FAE82"/><g fill="#F3E3BE"><circle cx="308" cy="341" r="4.5"/><circle cx="318" cy="344" r="4.5"/><circle cx="328" cy="341" r="4.5"/></g></g>
<g id="lgr"><rect x="350" y="294" width="24" height="34" rx="12" fill="#4FAE82"/><ellipse cx="362" cy="328" rx="18" ry="15" fill="#4FAE82"/><g fill="#F3E3BE"><circle cx="352" cy="341" r="4.5"/><circle cx="362" cy="344" r="4.5"/><circle cx="372" cy="341" r="4.5"/></g></g>
</g>
<g id="head">
<path d="M290 112 Q262 78 274 52 Q296 84 316 100 Z" fill="#F3E3BE"/><path d="M390 112 Q418 78 406 52 Q384 84 364 100 Z" fill="#F3E3BE"/>
<g fill="#1F6B4E"><path d="M320 98 Q314 74 332 60 Q332 80 344 94 Z"/><path d="M338 94 Q342 64 368 54 Q356 78 360 98 Z"/></g>
<path d="M268 148 L242 130 L260 172 Z" fill="#3E9C72"/><path d="M412 148 L438 130 L420 172 Z" fill="#3E9C72"/>
<ellipse cx="340" cy="155" rx="78" ry="66" fill="#5BBE8E"/>
<g class="se wi"><path d="M290 102 Q340 38 390 102 Z" fill="#C8402F"/><path d="M302 84 Q340 66 378 84" fill="none" stroke="#F5F0E6" stroke-width="5"/><rect x="284" y="94" width="112" height="15" rx="7" fill="#F5F0E6"/><circle cx="340" cy="48" r="11" fill="#F5F0E6"/></g>
<ellipse cx="340" cy="192" rx="44" ry="28" fill="#6CCB9C"/>
<ellipse cx="328" cy="181" rx="4.5" ry="3" fill="#1F6B4E"/><ellipse cx="352" cy="181" rx="4.5" ry="3" fill="#1F6B4E"/>
<g fill="#fff" stroke="#1F6B4E" stroke-width="3"><ellipse cx="303" cy="146" rx="22" ry="25"/><ellipse cx="377" cy="146" rx="22" ry="25"/></g>
<g class="ex h a"><circle cx="305" cy="148" r="16" fill="#3E8E62"/><circle cx="375" cy="148" r="16" fill="#3E8E62"/><circle cx="305" cy="148" r="11" fill="#0E2A1E"/><circle cx="375" cy="148" r="11" fill="#0E2A1E"/><circle cx="310" cy="142" r="5" fill="#fff"/><circle cx="380" cy="142" r="5" fill="#fff"/><circle cx="302" cy="153" r="2.5" fill="#fff"/><circle cx="372" cy="153" r="2.5" fill="#fff"/></g>
<g class="ex s"><circle cx="303" cy="155" r="16" fill="#3E8E62"/><circle cx="377" cy="155" r="16" fill="#3E8E62"/><circle cx="303" cy="156" r="11" fill="#0E2A1E"/><circle cx="377" cy="156" r="11" fill="#0E2A1E"/><circle cx="308" cy="150" r="5" fill="#fff"/><circle cx="382" cy="150" r="5" fill="#fff"/></g>
<g class="se su"><rect x="279" y="131" width="48" height="31" rx="12" fill="#1a1a1a"/><rect x="353" y="131" width="48" height="31" rx="12" fill="#1a1a1a"/><path d="M327 140 Q340 133 353 140 M279 140 L262 133 M401 140 L418 133" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/><path d="M289 153 L299 137 M363 153 L373 137" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/></g>
<g fill="none" stroke="#1F6B4E" stroke-width="6" stroke-linecap="round">
<path class="ex h" d="M283 114 Q302 104 320 112 M360 112 Q378 104 397 114"/>
<path class="ex s" d="M283 124 L319 110 M361 110 L397 124"/>
<path class="ex a" d="M283 112 L321 128 M359 128 L397 112"/>
</g>
<g class="ex h"><circle cx="278" cy="182" r="9" fill="#F0997B" opacity=".6"/><circle cx="402" cy="182" r="9" fill="#F0997B" opacity=".6"/><path d="M312 198 Q340 238 368 198 Z" fill="#6B1F24"/><path d="M324 214 Q340 230 356 214 Q340 207 324 214 Z" fill="#F08A8A"/><polygon points="318,199 325,199 321.5,207" fill="#fff"/><polygon points="355,199 362,199 358.5,207" fill="#fff"/></g>
<g class="ex s"><path d="M322 212 Q340 198 358 212" fill="none" stroke="#1F6B4E" stroke-width="4" stroke-linecap="round"/><path id="tear" d="M282 170 Q276 182 282 186 Q288 182 282 170 Z" fill="#85B7EB"/></g>
<g class="ex a"><path d="M314 200 L366 200 Q366 214 340 214 Q314 214 314 200 Z" fill="#6B1F24"/><polygon points="320,200 327,200 323.5,209" fill="#fff"/><polygon points="353,200 360,200 356.5,209" fill="#fff"/><polygon points="333,214 339,214 336,207" fill="#fff"/><polygon points="341,214 347,214 344,207" fill="#fff"/>
<circle class="smk" cx="326" cy="172" r="8" fill="#C9D3CE"/><circle class="smk smk2" cx="354" cy="172" r="8" fill="#C9D3CE"/></g>
<g class="se wi"><rect x="290" y="216" width="100" height="20" rx="10" fill="#C8402F"/><path d="M312 218 V234 M334 218 V234 M356 218 V234" stroke="#A8322A" stroke-width="3"/><rect x="354" y="226" width="20" height="48" rx="6" fill="#C8402F"/><path d="M354 254 H374 M354 263 H374" stroke="#F5F0E6" stroke-width="3"/></g>
<g class="se sp"><g class="bird">${BIRD}</g></g>
<g class="se au"><g transform="translate(0 4)"><g class="owl">${OWL}</g></g></g>
</g>
</g>
<g class="se au">${LEAVES}</g>
<g class="se wi">${SNOW}</g>
<g class="pals psp">${PALS_SP}</g>
<g class="pals pau">${PALS_AU}</g>
<g class="walker wsp"><g transform="translate(188 287)"><g transform="translate(804 0) scale(-1 1)"><g class="waddle">${BIRD}</g></g></g></g>
<g class="walker wau"><g transform="translate(312 287)"><g class="waddle">${OWL}</g></g></g>
</svg>`;

  class DragoMascotte extends HTMLElement {
    static get observedAttributes() { return ['mood', 'season', 'time']; }

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${STYLE}</style><div id="st">${SVG}</div>`;
      this._st = root.getElementById('st');
      this._celTimer = null;
      this._apply();
    }

    get mood() {
      const m = this.getAttribute('mood');
      return MOODS.includes(m) ? m : 'happy';
    }
    set mood(value) { this.setAttribute('mood', value); }

    get season() {
      const s = this.getAttribute('season');
      if (s === 'auto') return seasonFromDate();
      return SEASONS.includes(s) ? s : '';
    }
    set season(value) { this.setAttribute('season', value || ''); }

    get time() {
      const t = this.getAttribute('time');
      if (t === 'auto') return timeFromDate();
      return TIMES.includes(t) ? t : '';
    }
    set time(value) { this.setAttribute('time', value || ''); }

    // ricontrolla ogni minuto, così 'auto' cambia da solo all'alba e al tramonto
    connectedCallback() { this._tick = setInterval(() => this._apply(), 60000); }
    disconnectedCallback() { clearInterval(this._tick); }

    attributeChangedCallback() { this._apply(); }

    // Piroetta di festa (con gufi o uccellini che girano intorno in autunno e primavera).
    celebrate() {
      clearTimeout(this._celTimer);
      this._st.classList.remove('cel');
      void this._st.offsetWidth; // riavvia l'animazione
      this._st.classList.add('cel');
      this._celTimer = setTimeout(() => this._st.classList.remove('cel'), 1600);
    }

    _apply() {
      const cel = this._st.classList.contains('cel');
      this._st.className = [this.mood, this.season, this.time, cel ? 'cel' : ''].filter(Boolean).join(' ');
    }
  }

  if (!customElements.get('drago-mascotte')) {
    customElements.define('drago-mascotte', DragoMascotte);
  }
})();
