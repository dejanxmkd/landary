from pathlib import Path

js=Path('app.js')
s=js.read_text()
old="""  function closeDetails(index){
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
new="""  function closeDetails(index){
    const slide=slides[index];
    const shell=slide.querySelector('.copy-shell');
    const toggle=slide.querySelector('[data-toggle-details]');
    if(!shell)return;

    const current=shell.getBoundingClientRect();
    const probe=shell.cloneNode(true);
    probe.querySelector('.detail-content')?.remove();
    probe.style.cssText=`position:fixed;left:${current.left}px;top:-10000px;width:${current.width}px;transform:none;visibility:hidden;pointer-events:none;`;
    document.body.appendChild(probe);
    const collapsedHeight=probe.getBoundingClientRect().height;
    probe.remove();

    const targetTop=(innerHeight-collapsedHeight)/2;
    const dy=targetTop-current.top;

    slide.classList.add('is-closing');
    if(toggle)toggle.textContent='View Details';
    shell.getAnimations().forEach(animation=>animation.cancel());
    const animation=shell.animate(
      [{transform:'translateY(0)'},{transform:`translateY(${dy}px)`}],
      {duration:950,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}
    );

    animation.addEventListener('finish',()=>{
      slide.classList.remove('is-closing','is-detail');
      document.body.classList.remove('details-open');
      animation.cancel();
      detailIndex=-1;
    },{once:true});
  }
"""
if old not in s: raise SystemExit('closeDetails block not found')
s=s.replace(old,new,1)
js.write_text(s)

css=Path('style.css')
c=css.read_text()
needle=".coffee-slide.is-detail .detail-content{max-height:1800px;margin-top:30px;opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0);transition:max-height 1000ms var(--ease),opacity 520ms ease 100ms,transform 1000ms var(--ease),margin-top 1000ms var(--ease),visibility 0s linear 0s}\n"
addition=needle+".coffee-slide.is-detail.is-closing .detail-content{max-height:0;margin-top:0;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-8px);transition:max-height 950ms var(--ease),opacity 360ms ease,transform 950ms var(--ease),margin-top 950ms var(--ease),visibility 0s linear 950ms}\n"
if needle not in c: raise SystemExit('detail content rule not found')
c=c.replace(needle,addition,1)
css.write_text(c)
