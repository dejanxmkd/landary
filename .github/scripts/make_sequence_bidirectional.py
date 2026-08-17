from pathlib import Path
import re

app=Path('app.js')
s=app.read_text()
pattern=r"  function updateSectionSequence\(\)\{.*?\n  \}\n"
replacement="""  function updateSectionSequence(){
    const hero=document.querySelector('.section--hero');
    const story=document.querySelector('.section--story');
    const oliveIntro=document.querySelector('.section--olive-intro');
    const oliveStory=document.querySelector('.section--olive-story');
    const oliveSection=document.getElementById('olive-scroll');
    const groups=[hero,story,coffeeSection,oliveIntro,oliveStory,oliveSection].filter(Boolean);
    const y=scrollY;
    const vh=Math.max(innerHeight,1);
    const gate=Math.min(180,vh*.22);

    groups.forEach(group=>{
      group.classList.remove('is-sequence-active','is-sequence-leaving');
    });

    for(let i=0;i<groups.length;i++){
      const group=groups[i];
      const start=group.offsetTop;
      const end=start+group.offsetHeight;
      const isFirst=i===0;
      const isLast=i===groups.length-1;
      const enterAt=isFirst?start:start+gate;
      const leaveAt=isLast?end:end-gate;

      if(y>=enterAt&&y<leaveAt){
        group.classList.add('is-sequence-active');
        break;
      }

      if(y>=leaveAt&&y<end&& !isLast){
        group.classList.add('is-sequence-leaving');
        break;
      }

      if(y>=start&&y<enterAt&& !isFirst){
        // Deliberately keep both adjacent sections hidden inside the handoff gap.
        break;
      }
    }
  }
"""
ns2,n=re.subn(pattern,replacement,s,count=1,flags=re.S)
if n!=1:
    raise SystemExit(f'updateSectionSequence replacement count={n}')
app.write_text(ns2)

style=Path('style.css')
css=style.read_text()
css += "\n/* Bidirectional section gating: no incoming content during the boundary gap. */\n"
css += ".section:not(.is-sequence-active) .intro-copy{pointer-events:none}\n"
css += ".coffee-scroll:not(.is-sequence-active) .coffee-slide:first-child .product-frame img,.coffee-scroll:not(.is-sequence-active) .coffee-slide:first-child .copy-shell{pointer-events:none}\n"
style.write_text(css)

olive=Path('olive.css')
ocs=olive.read_text()
ocs += "\n/* Match the same bidirectional boundary gate used by the rest of the page. */\n"
ocs += ".olive-scroll:not(.is-sequence-active) .olive-slide:first-child .olive-image-panel img,.olive-scroll:not(.is-sequence-active) .olive-slide:first-child .olive-shell{pointer-events:none}\n"
olive.write_text(ocs)

index=Path('index.html')
i=index.read_text()
i=re.sub(r'app\.js\?v=\d+','app.js?v=202608171441',i)
i=re.sub(r'style\.css\?v=\d+','style.css?v=202608171441',i)
i=re.sub(r'olive\.css\?v=\d+','olive.css?v=202608171441',i)
index.write_text(i)
