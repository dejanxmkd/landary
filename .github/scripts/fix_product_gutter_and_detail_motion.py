from pathlib import Path
import re

# Shared desktop product gutter.
style = Path('style.css')
s = style.read_text()
s = s.replace(
    '.coffee-layout{position:relative;width:100%;height:100%;display:grid;grid-template-columns:48% 52%}',
    '.coffee-layout{position:relative;width:100%;height:100%;display:grid;grid-template-columns:minmax(0,48fr) minmax(0,52fr);column-gap:clamp(32px,3vw,56px)}'
)
s = s.replace(
    '@media(max-width:1000px){.display-title{font-size:clamp(64px,9vw,100px)}.coffee-layout{grid-template-columns:46% 54%}',
    '@media(max-width:1000px){.display-title{font-size:clamp(64px,9vw,100px)}.coffee-layout{grid-template-columns:minmax(0,46fr) minmax(0,54fr);column-gap:clamp(24px,3vw,40px)}'
)
s = s.replace(
    '@media(max-width:760px){.display-title{font-size:clamp(42px,11.5vw,62px);line-height:.92}.coffee-layout{display:block}',
    '@media(max-width:760px){.display-title{font-size:clamp(42px,11.5vw,62px);line-height:.92}.coffee-layout{display:block;column-gap:0}'
)
style.write_text(s)

# Olive uses same grid proportions/gutter and exact same opening motion as coffee.
olive_css = Path('olive.css')
s = olive_css.read_text()
s = s.replace(
    '.olive-layout{position:relative;width:100%;height:100%;display:grid;grid-template-columns:48% 52%}',
    '.olive-layout{position:relative;width:100%;height:100%;display:grid;grid-template-columns:minmax(0,48fr) minmax(0,52fr);column-gap:clamp(32px,3vw,56px)}'
)
s = s.replace(
    '@media(max-width:760px){.olive-layout{display:block}',
    '@media(max-width:760px){.olive-layout{display:block;column-gap:0}'
)
olive_css.write_text(s)

olive = Path('olive.js')
s = olive.read_text()
open_old = '''  function openDetails(index){
    if(detailIndex>=0)return;
    const slide=slides[index];detailIndex=index;window.__oliveDetailOpen=true;
    slide.classList.add('is-detail');document.body.classList.add('details-open');
    const link=slide.querySelector('[data-olive-details]');if(link)link.textContent='Close Details';
    setImage(index,state[index].image,true);
  }
'''
open_new = '''  function animateCopyLayout(slide,mutate){
    const shell=slide.querySelector('.copy-shell');
    if(!shell){mutate();return}
    const before=shell.getBoundingClientRect();mutate();const after=shell.getBoundingClientRect();const dx=before.left-after.left;const dy=before.top-after.top;
    if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
    shell.getAnimations().forEach(animation=>animation.cancel());
    shell.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:950,easing:'cubic-bezier(.16,1,.3,1)'});
  }

  function openDetails(index){
    if(detailIndex>=0)return;
    const slide=slides[index];const link=slide.querySelector('[data-olive-details]');detailIndex=index;window.__oliveDetailOpen=true;setImage(index,state[index].image,true);
    animateCopyLayout(slide,()=>{slide.classList.add('is-detail');document.body.classList.add('details-open');if(link)link.textContent='Close Details'});
  }
'''
if open_old not in s:
    raise SystemExit('olive openDetails block not found')
s = s.replace(open_old, open_new)
olive.write_text(s)

# Cache bust.
index = Path('index.html')
s = index.read_text()
s = re.sub(r'style\.css\?v=\d+', 'style.css?v=202608171423', s)
s = re.sub(r'olive\.css\?v=\d+', 'olive.css?v=202608171423', s)
s = re.sub(r'app\.js\?v=\d+', 'app.js?v=202608171423', s)
s = re.sub(r'olive\.js\?v=\d+', 'olive.js?v=202608171423', s)
index.write_text(s)
