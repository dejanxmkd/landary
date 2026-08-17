(()=>{
  const section=document.getElementById('olive-scroll');
  const track=document.getElementById('olive-track');
  if(!section||!track)return;

  const OLIVE_PRODUCTS=[
    {
      slug:'olive-500ml',
      name:'Giannos Greek Extra Virgin Olive Oil 500ml',
      titleLines:['Giannos Greek Extra Virgin','Olive Oil 500ml'],
      price:20,
      description:'Greek extra virgin olive oil made for everyday cooking, finishing, dipping, and the moments gathered around the table.',
      packages:[['Single',1,10],['3-Bottle',3,15],['6-Bottle',6,20]],
      images:[
        {label:'Front',src:'./assets/olive-oil/500ml/giannos-greek-extra-virgin-olive-oil-500ml-front.png'},
        {label:'Back',src:'./assets/olive-oil/500ml/giannos-greek-extra-virgin-olive-oil-500ml-back.png'}
      ]
    },
    {
      slug:'olive-3l',
      name:'Giannos Extra Virgin Olive Oil 3L',
      titleLines:['Giannos Extra Virgin','Olive Oil 3L'],
      price:75,
      description:'A generous 3 liter tin of Greek extra virgin olive oil for kitchens where olive oil is part of the everyday ritual.',
      packages:[['Single',1,10],['2-Tin',2,15],['4-Tin',4,20]],
      images:[
        {label:'Front',src:'./assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-front.png'},
        {label:'Front angled',src:'./assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-front-angled.png'},
        {label:'Side',src:'./assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-side.png'},
        {label:'Back',src:'./assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-back.png'}
      ]
    }
  ];

  const state=OLIVE_PRODUCTS.map(()=>({purchase:'subscribe',packageIndex:0,qty:1,image:0}));
  const money=value=>`$${value.toFixed(2)}`;

  function imageCarouselTemplate(product){
    const panels=product.images.map((image,index)=>`<figure class="olive-image-panel" data-olive-image-panel="${index}"><img src="${image.src}" alt="${product.name} — ${image.label}" draggable="false"></figure>`).join('');
    const dots=product.images.map((image,index)=>`<button class="product-dot ${index===0?'is-active':''}" type="button" data-olive-image-dot="${index}" aria-label="Show ${image.label} image" aria-pressed="${index===0?'true':'false'}"></button>`).join('');
    return `<div class="olive-image-carousel" data-olive-carousel>
      <div class="olive-image-viewport" data-olive-image-viewport>
        <div class="olive-image-track" data-olive-image-track>${panels}</div>
      </div>
      <button class="carousel-arrow carousel-arrow--prev" type="button" data-olive-image-prev aria-label="Previous product image"><span class="material-icons" aria-hidden="true">chevron_left</span></button>
      <button class="carousel-arrow carousel-arrow--next" type="button" data-olive-image-next aria-label="Next product image"><span class="material-icons" aria-hidden="true">chevron_right</span></button>
      <div class="product-dots" aria-label="Product images">${dots}</div>
    </div>`;
  }

  function productTemplate(product,index){
    const packageButtons=product.packages.map((item,itemIndex)=>`<button class="bag-option ${itemIndex===0?'is-selected':''}" type="button" data-olive-package="${itemIndex}"><span>${item[0]}</span><b>Save ${item[2]}%</b></button>`).join('');
    const title=product.titleLines.map(line=>`<span>${line}</span>`).join('');
    return `<article class="olive-slide" data-olive-index="${index}" style="--accent:#3d5825">
      <div class="olive-layout">
        <div class="olive-gallery">${imageCarouselTemplate(product)}</div>
        <div class="olive-copy"><div class="olive-shell">
          <h2 class="copy-title olive-title">${title}</h2>
          <p class="copy-description olive-description">${product.description}</p>
          <a class="view-details olive-view-details" href="#" data-olive-details>View Details</a>
          <div class="detail-content olive-detail">
            <dl class="detail-meta">
              <div><dt>Product</dt><dd>Greek Extra Virgin Olive Oil</dd></div>
              <div><dt>Size</dt><dd>${index===0?'500ml':'3L'}</dd></div>
              <div><dt>Price</dt><dd>${money(product.price)}</dd></div>
            </dl>
            <div class="detail-form">
              <section class="detail-block purchase-card is-selected" data-olive-purchase-card="subscribe">
                <button class="purchase-card__head" type="button" data-olive-purchase="subscribe"><span class="material-icons radio-icon">radio_button_checked</span><strong>Subscribe &amp; Save</strong><span class="purchase-card__prices"><s data-olive-sub-original>${money(product.price)}</s><b data-olive-sub-price>${money(product.price*.9)}</b></span></button>
                <div class="purchase-card__body">
                  <h3>Select Quantity</h3>
                  <div class="bag-options">${packageButtons}</div>
                  <h3>Select Frequency</h3>
                  <div class="frequency-field"><select class="frequency-select" aria-label="Delivery frequency"><option>Every Month</option><option>Every 2 Months</option><option>Every 3 Months</option></select><span class="material-icons frequency-field__icon">expand_more</span></div>
                  <div class="subscription-benefits"><span><i class="material-icons">check_circle</i><em>Up to 20% off on every order</em></span><span><i class="material-icons">check_circle</i><em>Free shipping within the US</em></span><span><i class="material-icons">check_circle</i><em>Early access to new products</em></span></div>
                </div>
              </section>
              <section class="detail-block purchase-card" data-olive-purchase-card="one-time">
                <button class="purchase-card__head" type="button" data-olive-purchase="one-time"><span class="material-icons radio-icon">radio_button_unchecked</span><strong>One Time Purchase</strong><span class="purchase-card__prices"><b data-olive-one-price>${money(product.price)}</b></span></button>
              </section>
              <section class="detail-block cart-block">
                <div class="quantity-stepper"><button type="button" data-olive-minus aria-label="Decrease quantity"><span class="material-icons">remove</span></button><span data-olive-qty>1</span><button type="button" data-olive-plus aria-label="Increase quantity"><span class="material-icons">add</span></button></div>
                <button class="add-cart" type="button">Add to Cart · <span data-olive-total>${money(product.price*.9)}</span></button>
              </section>
            </div>
          </div>
        </div></div>
      </div>
    </article>`;
  }

  track.innerHTML=OLIVE_PRODUCTS.map(productTemplate).join('');
  const slides=[...track.querySelectorAll('.olive-slide')];
  let detailIndex=-1;

  function metrics(){const start=section.offsetTop;const distance=Math.max(section.offsetHeight-innerHeight,1);return{start,distance}}
  function render(){const{start,distance}=metrics();const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));track.style.transform=`translate3d(${-progress*100}vw,0,0)`}

  window.__oliveSnapStops=()=>{
    const{start,distance}=metrics();
    return [{y:start},{y:start+distance}];
  };
  window.__oliveDetailOpen=false;

  function setImage(index,nextImage,instant=false){
    const product=OLIVE_PRODUCTS[index],slide=slides[index];
    const count=product.images.length;
    const imageIndex=((nextImage%count)+count)%count;
    state[index].image=imageIndex;
    const imageTrack=slide.querySelector('[data-olive-image-track]');
    if(imageTrack){
      imageTrack.classList.toggle('is-instant',instant);
      imageTrack.style.transform=`translate3d(${-imageIndex*100}%,0,0)`;
      if(instant)requestAnimationFrame(()=>imageTrack.classList.remove('is-instant'));
    }
    slide.querySelectorAll('[data-olive-image-dot]').forEach(dot=>{
      const active=Number(dot.dataset.oliveImageDot)===imageIndex;
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-pressed',String(active));
    });
  }

  function update(index){
    const product=OLIVE_PRODUCTS[index],current=state[index],slide=slides[index];
    const pack=product.packages[current.packageIndex];
    const original=product.price*pack[1];
    const subscribe=original*(1-pack[2]/100);
    const unit=current.purchase==='subscribe'?subscribe:original;
    slide.querySelector('[data-olive-sub-original]').textContent=money(original);
    slide.querySelector('[data-olive-sub-price]').textContent=money(subscribe);
    slide.querySelector('[data-olive-one-price]').textContent=money(original);
    slide.querySelector('[data-olive-total]').textContent=money(unit*current.qty);
    slide.querySelector('[data-olive-qty]').textContent=current.qty;
    slide.querySelectorAll('[data-olive-purchase-card]').forEach(card=>{
      const selected=card.dataset.olivePurchaseCard===current.purchase;
      card.classList.toggle('is-selected',selected);
      const icon=card.querySelector('.radio-icon');if(icon)icon.textContent=selected?'radio_button_checked':'radio_button_unchecked';
    });
  }

  function openDetails(index){
    if(detailIndex>=0)return;
    const slide=slides[index];detailIndex=index;window.__oliveDetailOpen=true;
    slide.classList.add('is-detail');document.body.classList.add('olive-details-open');
    const link=slide.querySelector('[data-olive-details]');if(link)link.textContent='Close Details';
    setImage(index,state[index].image,true);
  }
  function closeDetails(index){
    const slide=slides[index];slide.scrollTop=0;slide.classList.remove('is-detail');document.body.classList.remove('olive-details-open');
    const link=slide.querySelector('[data-olive-details]');if(link)link.textContent='View Details';
    detailIndex=-1;window.__oliveDetailOpen=false;
  }

  track.addEventListener('click',event=>{
    const slide=event.target.closest('.olive-slide');if(!slide)return;
    const index=Number(slide.dataset.oliveIndex),current=state[index];
    const prev=event.target.closest('[data-olive-image-prev]');if(prev){event.preventDefault();event.stopPropagation();setImage(index,current.image-1);return}
    const next=event.target.closest('[data-olive-image-next]');if(next){event.preventDefault();event.stopPropagation();setImage(index,current.image+1);return}
    const dot=event.target.closest('[data-olive-image-dot]');if(dot){event.preventDefault();event.stopPropagation();setImage(index,Number(dot.dataset.oliveImageDot));return}
    const detail=event.target.closest('[data-olive-details]');if(detail){event.preventDefault();slide.classList.contains('is-detail')?closeDetails(index):openDetails(index);return}
    const purchase=event.target.closest('[data-olive-purchase]');if(purchase){current.purchase=purchase.dataset.olivePurchase;update(index);return}
    const pack=event.target.closest('[data-olive-package]');if(pack){current.packageIndex=Number(pack.dataset.olivePackage);slide.querySelectorAll('[data-olive-package]').forEach(btn=>btn.classList.toggle('is-selected',btn===pack));update(index);return}
    if(event.target.closest('[data-olive-minus]')){current.qty=Math.max(1,current.qty-1);update(index);return}
    if(event.target.closest('[data-olive-plus]')){current.qty+=1;update(index);return}
  });

  slides.forEach((slide,index)=>{
    const viewport=slide.querySelector('[data-olive-image-viewport]');if(!viewport)return;
    let startX=0,startY=0,tracking=false;
    viewport.addEventListener('pointerdown',event=>{
      if(event.target.closest('button'))return;
      startX=event.clientX;startY=event.clientY;tracking=true;
      if(viewport.setPointerCapture)viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointerup',event=>{
      if(!tracking)return;tracking=false;
      const dx=event.clientX-startX,dy=event.clientY-startY;
      if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy))return;
      setImage(index,state[index].image+(dx<0?1:-1));
    });
    viewport.addEventListener('pointercancel',()=>{tracking=false});
    setImage(index,0,true);
    update(index);
  });

  addEventListener('scroll',()=>{if(detailIndex<0)render()},{passive:true});
  addEventListener('resize',render);
  requestAnimationFrame(render);
})();
