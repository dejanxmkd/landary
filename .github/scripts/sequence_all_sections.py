from pathlib import Path
import re

app=Path('app.js')
s=app.read_text()

# Replace the old boundary-only cinematic helper with a global gated sequence.
pattern=r"  function updateBoundaryCinematics\(\)\{.*?\n  \}\n\n  const introObserver="
replacement="""  function updateSectionSequence(){
    if(detailIndex>=0||window.__oliveDetailOpen)return;
    const hero=document.querySelector('.section--hero');
    const story=document.querySelector('.section--story');
    const oliveIntro=document.querySelector('.section--olive-intro');
    const oliveStory=document.querySelector('.section--olive-story');
    const oliveSection=document.getElementById('olive-scroll');
    const h=Math.max(innerHeight,1);
    const revealLine=h*.10;
    const leaveStart=h*.42;

    const ordered=[hero,story,coffeeSection,oliveIntro,oliveStory,oliveSection].filter(Boolean);
    ordered.forEach((node,index)=>{
      const top=node.getBoundingClientRect().top;
      const prev=index>0?ordered[index-1]:null;
      const prevBottom=prev?prev.getBoundingClientRect().bottom:-Infinity;
      const canReveal=index===0 ? top<=revealLine : (top<=revealLine && prevBottom<=h*.12);
      node.classList.toggle('is-sequence-active',canReveal);

      const next=index<ordered.length-1?ordered[index+1]:null;
      if(next){
        const nextTop=next.getBoundingClientRect().top;
        node.classList.toggle('is-sequence-leaving',nextTop<=leaveStart);
      }else{
        node.classList.remove('is-sequence-leaving');
      }
    });
  }

  const introObserver="""
ns2,n=re.subn(pattern,replacement,s,flags=re.S)
if n!=1:
    raise SystemExit(f'expected one boundary helper, replaced {n}')
s=ns2
s=s.replace("  addEventListener('scroll',updateBoundaryCinematics,{passive:true});\n", "  addEventListener('scroll',updateSectionSequence,{passive:true});\n")
s=s.replace("updateBoundaryCinematics()", "updateSectionSequence()")
app.write_text(s)

style=Path('style.css')
s=style.read_text()
# Disable old observer/boundary activation as visual source; sequence classes now own visibility.
s += """

/* Global gated section handoff: incoming content waits until outgoing content is gone. */
.section .intro-copy{opacity:0;filter:blur(14px);translate:0 34px}
.section.is-sequence-active:not(.is-sequence-leaving) .intro-copy{opacity:1;filter:blur(0);translate:0 0}
.section.is-sequence-leaving .intro-copy{opacity:0;filter:blur(14px);translate:0 -34px}
.coffee-scroll .coffee-slide:first-child .product-frame img,.coffee-scroll .coffee-slide:first-child .copy-shell{opacity:0!important;filter:blur(14px);translate:0 38px;scale:.985}
.coffee-scroll.is-sequence-active:not(.is-sequence-leaving) .coffee-slide:first-child .product-frame img,.coffee-scroll.is-sequence-active:not(.is-sequence-leaving) .coffee-slide:first-child .copy-shell{opacity:1!important;filter:blur(0);translate:0 0;scale:1}
.coffee-scroll.is-sequence-leaving .coffee-slide:last-child .product-frame img,.coffee-scroll.is-sequence-leaving .coffee-slide:last-child .copy-shell{opacity:0!important;filter:blur(14px);translate:0 -38px;scale:.985;transition:opacity 700ms var(--ease),filter 850ms var(--ease),translate 850ms var(--ease),scale 850ms var(--ease)}
"""
style.write_text(s)

olive=Path('olive.css')
s=olive.read_text()
s += """

/* Same gated handoff for the olive collection. */
.olive-scroll .olive-slide:first-child .olive-image-panel img,.olive-scroll .olive-slide:first-child .olive-shell{opacity:0!important;filter:blur(14px);translate:0 38px;scale:.985}
.olive-scroll.is-sequence-active:not(.is-sequence-leaving) .olive-slide:first-child .olive-image-panel img,.olive-scroll.is-sequence-active:not(.is-sequence-leaving) .olive-slide:first-child .olive-shell{opacity:1!important;filter:blur(0);translate:0 0;scale:1}
"""
olive.write_text(s)

index=Path('index.html')
s=index.read_text()
s=re.sub(r'style\.css\?v=\d+','style.css?v=202608171433',s)
s=re.sub(r'olive\.css\?v=\d+','olive.css?v=202608171433',s)
s=re.sub(r'app\.js\?v=\d+','app.js?v=202608171433',s)
index.write_text(s)
