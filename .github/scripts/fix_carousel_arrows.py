from pathlib import Path

js=Path('app.js')
s=js.read_text()

old="""  function openDetails(index){
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
"""
new="""  function openDetails(index){
    if(detailIndex>=0)return;
    const slide=slides[index];
    const toggle=slide.querySelector('[data-toggle-details]');
    detailIndex=index;
    updateImages(index,false);
    animateCopyLayout(slide,()=>{
      slide.classList.add('is-detail');
      document.body.classList.add('details-open');
      if(toggle)toggle.textContent='Close Details';
    });
  }
"""
if old not in s: raise SystemExit('openDetails block not found')
s=s.replace(old,new,1)

old="""    const imageDot=event.target.closest('[data-image-dot]');if(imageDot){setImage(index,Number(imageDot.dataset.imageDot));return}
    if(event.target.closest('[data-image-prev]')){setImage(index,state[index].image===0?1:0);return}
    if(event.target.closest('[data-image-next]')){setImage(index,state[index].image===1?0:1);return}
    const grind=event.target.closest('[data-grind]');"""
new="""    const imageDot=event.target.closest('[data-image-dot]');if(imageDot){setImage(index,Number(imageDot.dataset.imageDot));return}
    const grind=event.target.closest('[data-grind]');"""
if old not in s: raise SystemExit('delegated arrow handlers not found')
s=s.replace(old,new,1)

old="""  slides.forEach((slide,index)=>{
    const carousel=slide.querySelector('[data-image-carousel]');
    if(!carousel)return;
    let startX=0,startY=0,tracking=false;
    carousel.addEventListener('pointerdown',event=>{if(!slide.classList.contains('is-detail'))return;tracking=true;startX=event.clientX;startY=event.clientY;carousel.setPointerCapture?.(event.pointerId)});
    carousel.addEventListener('pointerup',event=>{if(!tracking)return;tracking=false;const dx=event.clientX-startX;const dy=event.clientY-startY;if(Math.abs(dx)>46&&Math.abs(dx)>Math.abs(dy)*1.25)setImage(index,dx<0?1:0)});
    carousel.addEventListener('pointercancel',()=>{tracking=false});
  });
"""
new="""  slides.forEach((slide,index)=>{
    const carousel=slide.querySelector('[data-image-carousel]');
    const swipeSurface=carousel?.querySelector('.image-viewport');
    const prev=carousel?.querySelector('[data-image-prev]');
    const next=carousel?.querySelector('[data-image-next]');
    if(!carousel||!swipeSurface)return;

    prev?.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      if(!slide.classList.contains('is-detail'))return;
      setImage(index,state[index].image===0?1:0);
    });
    next?.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      if(!slide.classList.contains('is-detail'))return;
      setImage(index,state[index].image===1?0:1);
    });

    let startX=0,startY=0,tracking=false,pointerId=null;
    swipeSurface.addEventListener('pointerdown',event=>{
      if(!slide.classList.contains('is-detail'))return;
      if(event.button!==undefined&&event.button!==0)return;
      tracking=true;pointerId=event.pointerId;startX=event.clientX;startY=event.clientY;
      swipeSurface.setPointerCapture?.(event.pointerId);
    });
    swipeSurface.addEventListener('pointerup',event=>{
      if(!tracking||event.pointerId!==pointerId)return;
      tracking=false;pointerId=null;
      const dx=event.clientX-startX;const dy=event.clientY-startY;
      if(Math.abs(dx)>46&&Math.abs(dx)>Math.abs(dy)*1.25)setImage(index,dx<0?1:0);
    });
    swipeSurface.addEventListener('pointercancel',()=>{tracking=false;pointerId=null});
  });
"""
if old not in s: raise SystemExit('swipe block not found')
s=s.replace(old,new,1)
js.write_text(s)

css=Path('style.css')
c=css.read_text()
old=".carousel-arrow{position:absolute;top:50%;z-index:6;width:52px;height:52px;padding:0;border:1px solid rgba(255,255,255,.18);border-radius:50%;background:rgba(255,255,255,.08);color:#fff;display:grid;place-items:center;opacity:0;transform:translateY(-50%) scale(.92);cursor:pointer;backdrop-filter:blur(10px);transition:opacity 260ms ease,transform 360ms var(--ease),background 260ms ease,border-color 260ms ease}"
new=".carousel-arrow{position:absolute;top:50%;z-index:6;width:52px;height:52px;padding:0;border:1px solid rgba(255,255,255,.18);border-radius:50%;background:rgba(255,255,255,.08);color:#fff;display:grid;place-items:center;opacity:0;transform:translateY(-50%) scale(.92);cursor:pointer;backdrop-filter:blur(10px);pointer-events:none;transition:opacity 260ms ease,transform 360ms var(--ease),background 260ms ease,border-color 260ms ease}"
if old not in c: raise SystemExit('carousel arrow css not found')
c=c.replace(old,new,1)
old=".coffee-slide.is-detail .product-dots{opacity:1;pointer-events:auto}"
new=".coffee-slide.is-detail .product-dots{opacity:1;pointer-events:auto}\n.coffee-slide.is-detail .carousel-arrow{pointer-events:auto}"
if old not in c: raise SystemExit('detail dots css not found')
c=c.replace(old,new,1)
css.write_text(c)
