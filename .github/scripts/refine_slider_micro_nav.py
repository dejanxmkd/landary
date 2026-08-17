from pathlib import Path
import re

# Strengthen the same scroll-driven micro motion consistently across product collections.
for filename in ['app.js','olive.js','honey.js']:
    p=Path(filename)
    s=p.read_text()
    s=s.replace("slide.style.setProperty('--micro-opacity',(1-d*.10).toFixed(3));", "slide.style.setProperty('--micro-opacity',(1-d*.12).toFixed(3));")
    s=s.replace("slide.style.setProperty('--micro-scale',(1-d*.015).toFixed(4));", "slide.style.setProperty('--micro-scale',(1-d*.018).toFixed(4));")
    s=s.replace("slide.style.setProperty('--micro-y',`${(d*10).toFixed(1)}px`);", "slide.style.setProperty('--micro-y',`${(d*14).toFixed(1)}px`);")
    p.write_text(s)

# PREV/NEXT are detail-only. Remove all normal carousel-hover exposure.
p=Path('style.css')
s=p.read_text()
old=".image-carousel:hover .edge-nav,.coffee-slide.is-detail .edge-nav,.olive-image-carousel:hover .edge-nav,.olive-slide.is-detail .edge-nav{opacity:1;pointer-events:auto}"
new=".coffee-slide.is-detail .edge-nav,.olive-slide.is-detail .edge-nav,.honey-slide.is-detail .edge-nav{opacity:1;pointer-events:auto}"
if old not in s:
    raise SystemExit('Expected shared edge-nav visibility rule not found')
s=s.replace(old,new,1)
p.write_text(s)

# Cache bust only the files changed in this pass.
p=Path('index.html')
s=p.read_text()
for name in ['style.css','app.js','olive.js','honey.js']:
    s=re.sub(re.escape(name)+r'\?v=\d+',name+'?v=202608171503',s)
p.write_text(s)
