(()=>{
  const section=document.getElementById('honey-scroll');
  const track=document.getElementById('honey-track');
  if(!section||!track)return;

  const PRODUCTS=[
    {
      slug:'oak-tree',
      name:'Greek Oak Tree Honey',
      price:15,
      description:'Giannos Greek Oak Tree Honey.',
      images:[
        {label:'Front',src:'./assets/honey/oak-tree/giannos-oak-tree-honey-front.png'},
        {label:'Back',src:'./assets/honey/oak-tree/giannos-oak-tree-honey-back.png'}
      ]
    },
    {
      slug:'wildflower',
      name:'Greek Wildflower Honey',
      price:15,
      description:'Giannos Greek Wildflower Honey.',
      images:[
        {label:'Front',src:'./assets/honey/wildflower/giannos-wildflower-honey-front.png'},
        {label:'Back',src:'./assets/honey/wildflower/giannos-wildflower-honey-back.png'}
      ]
    }
  ];

  const state=PRODUCTS.map(()=>({image:0}));
  const money=value=>`$${value.toFixed(2)}`;

  function carouselTemplate(product){
    const panels=product.images.map((image,index)=>`<figure class="honey-image-panel" data-honey-image-panel="${index}"><img src="${image.src}" alt="${product.name} — ${image.label}" draggable="false"></figure>`).join('');
    const dots=product.images.map((image,index)=>`<button class="product-dot ${index===0?'is-active':''}" type="button" data-honey-image-dot="${index}" aria-label="Show ${image.label} image" aria-pressed="${index===0?'true':'false'}"></button>`).join('');
    return `<div class="honey-image-carousel" data-honey-carousel>
      <div class="honey-image-viewport" data-honey-image-viewport><div class="honey-image-track" data-honey-image-track>${panels}</div></div>
      <button class="edge-nav edge-nav--prev" type="button" data-honey-image-prev aria-label="Previous product image"><span>Prev</span><i aria-hidden="true"></i></button>
      <button class="edge-nav edge-nav--next" type="button" data-honey-image-next aria-label="Next product image"><i aria-hidden="true"></i><span>Next</span></button>
      <div class="product-dots" aria-label="Product images">${dots}</div>
    </div>`;
  }

  function productTemplate(product,index){
    return `<article class="coffee-slide honey-slide" data-honey-index="${index}" style="--accent:#3d5825">
      <div class="coffee-layout honey-layout">
        <div class="coffee-gallery honey-gallery">${carouselTemplate(product)}</div>
        <div class="coffee-copy honey-copy"><div class="copy-shell honey-shell">
          <h2 class="copy-title honey-title">${product.name}</h2>
          <p class="copy-description honey-description">${product.description}</p>
          <div class="honey-price-row"><strong>${money(product.price)}</strong><span class="sold-out-badge">Sold out</span></div>
          <a class="view-details honey-view-details" href="#" data-honey-details>View Details</a>
          <div class="detail-content honey-detail">
            <dl class="detail-meta">
              <div><dt>Product</dt><dd>${product.name}</dd></div>
              <div><dt>Price</dt><dd>${money(product.price)}</dd></div>
              <div><dt>Status</dt><dd>Sold out</dd></div>
            </dl>
            <div class="detail-form">
              <section class="detail-block cart-block honey-sold-cart">
                <div class="quantity-stepper is-disabled" aria-label="Quantity unavailable">
                  <button type="button" disabled aria-label="Decrease quantity"><span class="material-icons">remove</span></button>
                  <span>1</span>
                  <button type="button" disabled aria-label="Increase quantity"><span class="material-icons">add</span></button>
                </div>
                <button class="add-cart honey-sold-button" type="button" disabled>Sold Out · ${money(product.price)}</button>
              </section>
            </div>
          </div>
        </div></div>
      </div>
    </article>`;
  }

  track.innerHTML=PRODUCTS.map(productTemplate).join('');
  const slides=[...track.querySelectorAll('.honey-slide')];
  let detailIndex=-1;

  function metrics(){
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
  }

  function setImage(index,nextImage,instant=false){
    const product=PRODUCTS[index],slide=slides[index];
    const count=product.images.length;
    const imageIndex=((nextImage%count)+count)%count;
    state[index].image=imageIndex;
    const imageTrack=slide.querySelector('[data-honey-image-track]');
    if(imageTrack){
      imageTrack.classList.toggle('is-instant',instant);
      imageTrack.style.transform=`translate3d(${-imageIndex*100}%,0,0)`;
      if(instant)requestAnimationFrame(()=>imageTrack.classList.remove('is-instant'));
    }
    slide.querySelectorAll('[data-honey-image-dot]').forEach(dot=>{
      const active=Number(dot.dataset.honeyImageDot)===imageIndex;
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-pressed',String(active));
    });
  }

  function animateCopyLayout(slide,mutate){
    const shell=slide.querySelector('.copy-shell');
    if(!shell){mutate();return}
    const before=shell.getBoundingClientRect();mutate();const after=shell.getBoundingClientRect();const dx=before.left-after.left;const dy=before.top-after.top;
    if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
    shell.getAnimations().forEach(animation=>animation.cancel());
    shell.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:950,easing:'cubic-bezier(.16,1,.3,1)'});
  }

  function openDetails(index){
    if(detailIndex>=0)return;
    const slide=slides[index];const link=slide.querySelector('[data-honey-details]');detailIndex=index;setImage(index,state[index].image,true);
    animateCopyLayout(slide,()=>{slide.classList.add('is-detail');document.body.classList.add('details-open');if(link)link.textContent='Close Details'});
  }

  function finishClose(index){
    const slide=slides[index];const shell=slide.querySelector('.copy-shell');const toggle=slide.querySelector('[data-honey-details]');if(!shell)return;
    const current=shell.getBoundingClientRect();const probe=shell.cloneNode(true);probe.querySelector('.detail-content')?.remove();probe.style.cssText=`position:fixed;left:${current.left}px;top:-10000px;width:${current.width}px;transform:none;visibility:hidden;pointer-events:none;`;document.body.appendChild(probe);const collapsedHeight=probe.getBoundingClientRect().height;probe.remove();
    const targetTop=(innerHeight-collapsedHeight)/2;const dy=targetTop-current.top;slide.classList.add('is-closing');if(toggle)toggle.textContent='View Details';shell.getAnimations().forEach(animation=>animation.cancel());
    const animation=shell.animate([{transform:'translateY(0)'},{transform:`translateY(${dy}px)`}],{duration:820,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
    animation.addEventListener('finish',()=>{slide.classList.remove('is-closing','is-detail');document.body.classList.remove('details-open');slide.scrollTop=0;animation.cancel();detailIndex=-1;setImage(index,state[index].image,true)},{once:true});
  }

  function closeDetails(index){
    const slide=slides[index];if(slide.classList.contains('is-closing'))return;const startTop=slide.scrollTop;if(startTop<=2){finishClose(index);return}
    const duration=Math.min(650,Math.max(360,startTop*.35));const started=performance.now();const ease=t=>1-Math.pow(1-t,4);slide.classList.add('is-returning');
    const step=now=>{const t=Math.min(1,(now-started)/duration);slide.scrollTop=startTop*(1-ease(t));if(t<1){requestAnimationFrame(step);return}slide.scrollTop=0;slide.classList.remove('is-returning');finishClose(index)};
    requestAnimationFrame(step);
  }

  track.addEventListener('click',event=>{
    const slide=event.target.closest('.honey-slide');if(!slide)return;
    const index=Number(slide.dataset.honeyIndex),current=state[index];
    if(event.target.closest('[data-honey-image-prev]')){event.preventDefault();event.stopPropagation();setImage(index,current.image-1);return}
    if(event.target.closest('[data-honey-image-next]')){event.preventDefault();event.stopPropagation();setImage(index,current.image+1);return}
    const dot=event.target.closest('[data-honey-image-dot]');if(dot){event.preventDefault();event.stopPropagation();setImage(index,Number(dot.dataset.honeyImageDot));return}
    const detail=event.target.closest('[data-honey-details]');if(detail){event.preventDefault();slide.classList.contains('is-detail')?closeDetails(index):openDetails(index)}
  });

  slides.forEach((slide,index)=>{
    const viewport=slide.querySelector('[data-honey-image-viewport]');if(!viewport)return;
    let startX=0,startY=0,tracking=false;
    viewport.addEventListener('pointerdown',event=>{startX=event.clientX;startY=event.clientY;tracking=true;viewport.setPointerCapture?.(event.pointerId)});
    viewport.addEventListener('pointerup',event=>{if(!tracking)return;tracking=false;const dx=event.clientX-startX,dy=event.clientY-startY;if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy))return;setImage(index,state[index].image+(dx<0?1:-1))});
    viewport.addEventListener('pointercancel',()=>{tracking=false});
    setImage(index,0,true);
  });

  addEventListener('scroll',()=>{if(detailIndex<0)render()},{passive:true});
  addEventListener('resize',render);
  requestAnimationFrame(render);
})();
