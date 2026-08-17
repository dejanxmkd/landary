from pathlib import Path
import re

# Make the 20% smaller image size the base size in every state, including View Details.
p=Path('style.css'); s=p.read_text()
s=s.replace('.product-frame img{display:block;width:min(36vw,540px);max-width:100%;max-height:82svh;object-fit:contain}', '.product-frame img{display:block;width:min(28.8vw,432px);max-width:100%;max-height:65.6svh;object-fit:contain}')
s=s.replace('.product-frame img{width:min(42vw,470px)}', '.product-frame img{width:min(33.6vw,376px)}')
s=s.replace('.product-frame img{width:min(70vw,330px);max-height:46svh}', '.product-frame img{width:min(56vw,264px);max-height:36.8svh}')
s=s.replace('.coffee-slide.is-detail .product-frame img{max-height:52svh}', '.coffee-slide.is-detail .product-frame img{max-height:36.8svh}')
s=re.sub(r'\n/\* Normal product view: product imagery is 20% smaller; detail gallery keeps full size\. \*/\n\.coffee-slide:not\(\.is-detail\) \.product-frame img\{[^\n]+\}\n@media\(max-width:1000px\)\{\.coffee-slide:not\(\.is-detail\) \.product-frame img\{[^\n]+\}\}\n@media\(max-width:760px\)\{\.coffee-slide:not\(\.is-detail\) \.product-frame img\{[^\n]+\}\}\n?', '\n', s)
p.write_text(s)

p=Path('olive.css'); s=p.read_text()
s=s.replace('.olive-image-panel img{display:block;max-width:78%;max-height:78svh;object-fit:contain;pointer-events:none}', '.olive-image-panel img{display:block;max-width:62.4%;max-height:62.4svh;object-fit:contain;pointer-events:none}')
s=s.replace('.olive-image-panel img{max-width:72%;max-height:45svh}', '.olive-image-panel img{max-width:57.6%;max-height:36svh}')
s=re.sub(r'\n/\* Normal product view: product imagery is 20% smaller; detail gallery keeps full size\. \*/\n\.olive-slide:not\(\.is-detail\) \.olive-image-panel img\{[^\n]+\}\n@media\(max-width:760px\)\{\.olive-slide:not\(\.is-detail\) \.olive-image-panel img\{[^\n]+\}\}\n?', '\n', s)
p.write_text(s)

p=Path('honey.css'); s=p.read_text()
s=s.replace('.honey-image-panel img{display:block;max-width:76%;max-height:76svh;object-fit:contain;pointer-events:none}', '.honey-image-panel img{display:block;max-width:60.8%;max-height:60.8svh;object-fit:contain;pointer-events:none}')
s=s.replace('.honey-image-panel img{max-width:72%;max-height:45svh}', '.honey-image-panel img{max-width:57.6%;max-height:36svh}')
s=re.sub(r'\n/\* Normal product view: product imagery is 20% smaller; detail gallery keeps full size\. \*/\n\.honey-slide:not\(\.is-detail\) \.honey-image-panel img\{[^\n]+\}\n@media\(max-width:760px\)\{\.honey-slide:not\(\.is-detail\) \.honey-image-panel img\{[^\n]+\}\}\n?', '\n', s)
p.write_text(s)

# Shared magnet scroll: text sections + every product stop in Coffee / Olive / Honey.
Path('magnet.js').write_text(r'''(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer=0;
  let snapping=false;
  let releaseTimer=0;

  const headerHeight=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'))||0;

  function productStops(sectionSelector,stickySelector,slideSelector){
    const section=document.querySelector(sectionSelector);
    if(!section)return[];
    const sticky=section.querySelector(stickySelector);
    const count=section.querySelectorAll(slideSelector).length;
    if(!sticky||count<1)return[];
    const start=section.offsetTop-headerHeight();
    if(count===1)return[start];
    const distance=Math.max(section.offsetHeight-sticky.offsetHeight,0);
    return Array.from({length:count},(_,index)=>start+distance*(index/(count-1)));
  }

  function stops(){
    const points=[...document.querySelectorAll('.landing > .section')].map(section=>section.offsetTop-headerHeight());
    points.push(...productStops('#coffee-scroll','.coffee-sticky','.coffee-slide'));
    points.push(...productStops('#olive-scroll','.olive-sticky','.olive-slide'));
    points.push(...productStops('#honey-scroll','.honey-sticky','.honey-slide'));
    return [...new Set(points.map(value=>Math.max(0,Math.round(value))))].sort((a,b)=>a-b);
  }

  function nearestStop(){
    if(document.body.classList.contains('is-loading')||document.body.classList.contains('details-open'))return;
    const points=stops();
    if(!points.length)return;
    const y=scrollY;
    let target=points[0];
    let best=Math.abs(target-y);
    for(let i=1;i<points.length;i++){
      const distance=Math.abs(points[i]-y);
      if(distance<best){best=distance;target=points[i]}
    }
    if(best<2)return;
    snapping=true;
    scrollTo({top:target,behavior:reduced?'auto':'smooth'});
    clearTimeout(releaseTimer);
    releaseTimer=setTimeout(()=>{snapping=false},reduced?80:520);
  }

  addEventListener('scroll',()=>{
    if(snapping)return;
    clearTimeout(timer);
    timer=setTimeout(nearestStop,110);
  },{passive:true});

  addEventListener('resize',()=>{clearTimeout(timer)},{passive:true});
})();
''')

p=Path('index.html'); s=p.read_text()
# cache bust CSS
for name in ['style.css','olive.css','honey.css']:
    s=re.sub(re.escape(name)+r'\?v=\d+',name+'?v=202608171545',s)
# add magnet script once after product scripts
if 'magnet.js' not in s:
    s=s.replace('  <script src="honey.js?v=202608171520"></script>\n', '  <script src="honey.js?v=202608171520"></script>\n  <script src="magnet.js?v=202608171545"></script>\n')
else:
    s=re.sub(r'magnet\.js\?v=\d+','magnet.js?v=202608171545',s)
p.write_text(s)
