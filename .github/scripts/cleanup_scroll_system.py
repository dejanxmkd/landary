from pathlib import Path
import re

# --- app.js: remove snap/gated/cinematic state machinery ---
p=Path('app.js'); s=p.read_text()
s=s.replace("  let snapTimer=0;\n  let snapping=false;\n","")
s=re.sub(r"\n  function globalStops\(\)\{.*?\n  \}\n\n  function renderHorizontal", "\n  function renderHorizontal", s, count=1, flags=re.S)
old=re.search(r"  function renderHorizontal\(\)\{.*?\n  \}\n\n  function snapToNearest",s,re.S)
if not old: raise SystemExit('coffee render/snap block not found')
new="""  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;
    slides.forEach((slide,index)=>{
      const d=Math.min(1,Math.abs(index-exact));
      slide.style.setProperty('--micro-opacity',(1-d*.10).toFixed(3));
      slide.style.setProperty('--micro-scale',(1-d*.015).toFixed(4));
      slide.style.setProperty('--micro-y',`${(d*10).toFixed(1)}px`);
    });
  }

  function onScroll"""
s=s[:old.start()]+new+s[old.end():]
# The replacement leaves the old snap body between new onScroll and old onScroll. Replace the whole duplicated area safely.
s=re.sub(r"  function onScroll\(\)\{\n    if\(detailIndex>=0\|\|window\.__oliveDetailOpen\|\|window\.__honeyDetailOpen\|\|snapping\)return;.*?\n  \}\n\n  function onScroll\(\)\{.*?\n  \}\n", "  function onScroll(){\n    if(detailIndex>=0)return;\n    renderHorizontal();\n  }\n", s, count=1, flags=re.S)
# fallback if structure differs because function signature replacement swallowed snap header
s=re.sub(r"  function onScroll\(\)\{\n    if\(detailIndex>=0\|\|window\.__oliveDetailOpen\|\|window\.__honeyDetailOpen\|\|snapping\)return;.*?snapTimer=setTimeout\(snapToNearest,80\);\n  \}\n", "  function onScroll(){\n    if(detailIndex>=0)return;\n    renderHorizontal();\n  }\n", s, count=1, flags=re.S)
s=re.sub(r"\n  function updateSectionSequence\(\)\{.*?\n  \}\n\n  const introObserver", "\n  const introObserver", s, count=1, flags=re.S)
s=s.replace("entry.target.classList.toggle('is-cinematic-active',entry.isIntersecting&&entry.intersectionRatio>.45)","entry.target.classList.toggle('is-visible',entry.isIntersecting&&entry.intersectionRatio>.32)")
s=s.replace("},{threshold:[0,.45,.7]});","},{threshold:[0,.32,.65],rootMargin:'-6% 0px -6% 0px'});")
s=s.replace("  addEventListener('scroll',updateSectionSequence,{passive:true});\n","")
s=s.replace("  addEventListener('resize',()=>{if(detailIndex<0){renderHorizontal()}updateSectionSequence()});","  addEventListener('resize',()=>{if(detailIndex<0)renderHorizontal()});")
s=s.replace("  requestAnimationFrame(()=>{renderHorizontal();updateSectionSequence()});","  requestAnimationFrame(renderHorizontal);")
# Ensure no snap leftovers
for token in ['function snapToNearest','function globalStops','updateSectionSequence','snapTimer','snapping','__oliveSnapStops','__honeySnapStops','is-sequence-','is-cinematic-','is-entry-cinematic-']:
    if token in s: raise SystemExit(f'app.js leftover: {token}')
p.write_text(s)

# --- olive.js: direct scroll mapping, remove snap/global detail flags ---
p=Path('olive.js'); s=p.read_text()
s=re.sub(r"  function render\(\)\{.*?\n  \}\n\n  window\.__oliveSnapStops=.*?;\n  window\.__oliveDetailOpen=false;", """  function render(){
    const{start,distance}=metrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(OLIVE_PRODUCTS.length-1);
    track.style.transform=`translate3d(${-progress*100}vw,0,0)`;
    slides.forEach((slide,index)=>{
      const d=Math.min(1,Math.abs(index-exact));
      slide.style.setProperty('--micro-opacity',(1-d*.10).toFixed(3));
      slide.style.setProperty('--micro-scale',(1-d*.015).toFixed(4));
      slide.style.setProperty('--micro-y',`${(d*10).toFixed(1)}px`);
    });
  }""", s, count=1, flags=re.S)
s=s.replace("detailIndex=index;window.__oliveDetailOpen=true;setImage","detailIndex=index;setImage")
s=s.replace("detailIndex=-1;window.__oliveDetailOpen=false;setImage","detailIndex=-1;setImage")
for token in ['__oliveSnapStops','__oliveDetailOpen','activeStart','activeDistance']:
    if token in s: raise SystemExit(f'olive.js leftover: {token}')
p.write_text(s)

# --- honey.js: direct scroll mapping, remove snap/global detail flags ---
p=Path('honey.js'); s=p.read_text()
s=s.replace("  window.__honeyDetailOpen=false;\n","")
s=re.sub(r"  function metrics\(\)\{.*?\n  \}\n\n  function render\(\)\{.*?\n  \}\n\n  window\.__honeySnapStops=\(\)=>\{.*?\n  \};", """  function metrics(){
    const start=section.offsetTop;
    const distance=Math.max(section.offsetHeight-innerHeight,1);
    return{start,distance};
  }

  function render(){
    const{start,distance}=metrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    track.style.transform=`translate3d(${-progress*100}vw,0,0)`;
    slides.forEach((slide,index)=>{
      const d=Math.min(1,Math.abs(index-exact));
      slide.style.setProperty('--micro-opacity',(1-d*.10).toFixed(3));
      slide.style.setProperty('--micro-scale',(1-d*.015).toFixed(4));
      slide.style.setProperty('--micro-y',`${(d*10).toFixed(1)}px`);
    });
  }""", s, count=1, flags=re.S)
s=s.replace("detailIndex=index;window.__honeyDetailOpen=true;setImage","detailIndex=index;setImage")
s=s.replace("detailIndex=-1;window.__honeyDetailOpen=false;setImage","detailIndex=-1;setImage")
for token in ['__honeySnapStops','__honeyDetailOpen','activeStart','activeDistance']:
    if token in s: raise SystemExit(f'honey.js leftover: {token}')
p.write_text(s)

# --- style.css: delete legacy cinematic/gated CSS, keep one micro reveal system ---
p=Path('style.css'); s=p.read_text()
s=re.sub(r"\.intro-copy\{.*?\}\n\.section\.is-cinematic-active .*?\n\.section\.is-cinematic-leaving .*?\n", ".intro-copy{width:min(1420px,100%);text-align:center;opacity:.18;translate:0 18px;transition:opacity 420ms ease,translate 560ms var(--ease);will-change:opacity,translate}\n.section.is-visible .intro-copy{opacity:1;translate:0 0}\n", s, count=1, flags=re.S)
s=re.sub(r"\.coffee-scroll \.coffee-slide:first-child .*?\.coffee-scroll\.is-entry-cinematic-active .*?\n", "", s, count=1, flags=re.S)
s=s.replace("transition:transform 760ms cubic-bezier(.16,1,.3,1)","transition:transform 520ms cubic-bezier(.16,1,.3,1)")
s=s.replace(".coffee-slide:not(.is-detail) .product-frame img,.coffee-slide:not(.is-detail) .copy-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);will-change:opacity,scale}",".coffee-slide:not(.is-detail) .product-frame img,.coffee-slide:not(.is-detail) .copy-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);translate:0 var(--micro-y,0px);will-change:opacity,scale,translate}")
# Remove appended legacy blocks from their comments onward
s=re.sub(r"\n\n/\* Global gated section handoff:.*", "", s, flags=re.S)
# reduced motion old selectors -> simple
s=re.sub(r"@media\(prefers-reduced-motion:reduce\)\{.*?\}\n?$", "@media(prefers-reduced-motion:reduce){.intro-copy{transition:none;opacity:1;translate:none}.coffee-slide{--micro-opacity:1!important;--micro-scale:1!important;--micro-y:0px!important}}\n", s, flags=re.S)
for token in ['is-cinematic','is-entry-cinematic','is-sequence','blur(14px)','Global gated']:
    if token in s: raise SystemExit(f'style.css leftover: {token}')
p.write_text(s)

# --- olive.css cleanup ---
p=Path('olive.css'); s=p.read_text()
s=s.replace("transition:transform 760ms cubic-bezier(.16,1,.3,1)","transition:transform 520ms cubic-bezier(.16,1,.3,1)")
s=s.replace(".olive-slide:not(.is-detail) .olive-image-panel img,.olive-slide:not(.is-detail) .olive-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);will-change:opacity,scale}",".olive-slide:not(.is-detail) .olive-image-panel img,.olive-slide:not(.is-detail) .olive-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);translate:0 var(--micro-y,0px);will-change:opacity,scale,translate}")
s=re.sub(r"\.olive-scroll \.olive-slide:first-child .*?\.olive-scroll\.is-entry-cinematic-active .*?\n", "", s, count=1, flags=re.S)
s=re.sub(r"\n\n/\* Same gated handoff.*", "", s, flags=re.S)
s=re.sub(r"@media\(prefers-reduced-motion:reduce\)\{.*?\}\n?$", "@media(prefers-reduced-motion:reduce){.olive-slide{--micro-opacity:1!important;--micro-scale:1!important;--micro-y:0px!important}}\n", s, flags=re.S)
for token in ['is-cinematic','is-entry-cinematic','is-sequence','blur(14px)','gated handoff']:
    if token in s: raise SystemExit(f'olive.css leftover: {token}')
p.write_text(s)

# --- honey.css cleanup ---
p=Path('honey.css'); s=p.read_text()
s=s.replace("transition:transform 620ms cubic-bezier(.16,1,.3,1)","transition:transform 520ms cubic-bezier(.16,1,.3,1)")
s=s.replace(".honey-slide:not(.is-detail) .honey-image-panel img,.honey-slide:not(.is-detail) .honey-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);will-change:opacity,scale}",".honey-slide:not(.is-detail) .honey-image-panel img,.honey-slide:not(.is-detail) .honey-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);translate:0 var(--micro-y,0px);will-change:opacity,scale,translate}")
s=re.sub(r"\.honey-scroll \.honey-slide:first-child .*?\.honey-scroll\.is-sequence-active.*?\n", "", s, count=1, flags=re.S)
s=re.sub(r"\.honey-scroll:not\(\.is-sequence-active\).*?\n", "", s)
s=re.sub(r"@media\(prefers-reduced-motion:reduce\)\{.*?\}\n?$", "@media(prefers-reduced-motion:reduce){.honey-slide{--micro-opacity:1!important;--micro-scale:1!important;--micro-y:0px!important}}\n", s, flags=re.S)
for token in ['is-cinematic','is-entry-cinematic','is-sequence','blur(10px)']:
    if token in s: raise SystemExit(f'honey.css leftover: {token}')
p.write_text(s)

# cache bust
p=Path('index.html'); s=p.read_text()
for name in ['style.css','olive.css','honey.css','app.js','olive.js','honey.js']:
    s=re.sub(re.escape(name)+r'\?v=\d+',name+'?v=202608171455',s)
p.write_text(s)
