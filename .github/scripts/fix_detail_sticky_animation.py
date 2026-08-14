from pathlib import Path

css=Path('style.css')
s=css.read_text()
s=s.replace(".coffee-slide.is-detail .coffee-copy{height:auto;min-height:220svh;overflow:visible;padding:180px 5vw 72px 0}\n.coffee-slide.is-detail .copy-shell{position:relative;left:auto;top:auto;transform:none}", ".coffee-slide.is-detail .coffee-copy{position:sticky;top:0;align-self:start;height:auto;min-height:100svh;overflow:visible;padding:180px 5vw 72px 0}\n.coffee-slide.is-detail .copy-shell{position:relative;left:auto;top:auto;transform:none;will-change:transform}")
s=s.replace(".coffee-slide.is-detail .coffee-copy{position:relative;left:auto;right:auto;bottom:auto;height:auto;min-height:114svh;padding:110px 20px 64px;text-align:left}.coffee-slide.is-detail .copy-shell{position:relative;left:auto;top:auto;width:100%;transform:none}", ".coffee-slide.is-detail .coffee-copy{position:relative;left:auto;right:auto;bottom:auto;height:auto;min-height:114svh;padding:110px 20px 64px;text-align:left}.coffee-slide.is-detail .copy-shell{position:relative;left:auto;top:auto;width:100%;transform:none;will-change:transform}")
css.write_text(s)

js=Path('app.js')
j=js.read_text()
old="""  function openDetails(index){
    if(detailIndex>=0)return;
    const slide=slides[index];
    const toggle=slide.querySelector('[data-toggle-details]');
    detailIndex=index;
    slide.classList.add('is-detail');
    document.body.classList.add('details-open');
    if(toggle)toggle.textContent='Close Details';
  }

  function closeDetails(index){
    const slide=slides[index];
    const toggle=slide.querySelector('[data-toggle-details]');
    slide.classList.remove('is-detail');
    document.body.classList.remove('details-open');
    if(toggle)toggle.textContent='View Details';
    detailIndex=-1;
  }
"""
new="""  function animateCopyLayout(slide,mutate){
    const shell=slide.querySelector('.copy-shell');
    if(!shell){mutate();return}
    const before=shell.getBoundingClientRect();
    mutate();
    const after=shell.getBoundingClientRect();
    const dx=before.left-after.left;
    const dy=before.top-after.top;
    if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
    shell.getAnimations().forEach(animation=>animation.cancel());
    shell.animate(
      [{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],
      {duration:950,easing:'cubic-bezier(.16,1,.3,1)'}
    );
  }

  function openDetails(index){
    if(detailIndex>=0)return;
    const slide=slides[index];
    const toggle=slide.querySelector('[data-toggle-details]');
    detailIndex=index;
    animateCopyLayout(slide,()=>{
      slide.classList.add('is-detail');
      document.body.classList.add('details-open');
      if(toggle)toggle.textContent='Close Details';
    });
  }

  function closeDetails(index){
    const slide=slides[index];
    const toggle=slide.querySelector('[data-toggle-details]');
    animateCopyLayout(slide,()=>{
      slide.classList.remove('is-detail');
      document.body.classList.remove('details-open');
      if(toggle)toggle.textContent='View Details';
    });
    detailIndex=-1;
  }
"""
if old not in j:
    raise SystemExit('details functions not found')
j=j.replace(old,new,1)
js.write_text(j)
