(()=>{
  const coffeeSection=document.getElementById('coffee-scroll');
  const track=document.getElementById('coffee-track');
  if(!coffeeSection||!track)return;

  const PRODUCTS=[
    {slug:'brazil',name:'Giannos Brazil Roast',color:'#4D6E48',description:'A smooth, medium roast from Brazil with a naturally sweet body and soft notes of chocolate and caramel. Choose it whole bean for maximum freshness, or ground and ready for the way you brew every day.',flavor:'Chocolate, caramel and naturally sweet body',roast:'Medium',size:'12 ounces',defaultGrind:'Ground',images:{Ground:['./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-front.png','./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-back.png'],'Whole Bean':['./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-front.png','./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-back.png']}},
    {slug:'french-vanilla',name:'Giannos French Vanilla',color:'#1C6E95',description:'Rich vanilla flavor, subtle nuttiness, and a creamy finish come together in a comforting medium roast made for easy mornings and familiar routines.',flavor:'Rich vanilla, subtle nuttiness and creamy finish',roast:'Medium',size:'12 ounces',defaultGrind:'Ground',images:{Ground:['./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-front.png','./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-back.png'],'Whole Bean':['./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-front.png','./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-back.png']}},
    {slug:'colombian',name:'Giannos Colombian Roast',color:'#563B66',description:'A balanced medium roast with milk chocolate, hints of citrus, and a smooth finish. Choose whole bean or ground for a classic cup with brightness, body, and everyday drinkability.',flavor:'Milk chocolate, citrus and a smooth finish',roast:'Medium',size:'12 ounces',defaultGrind:'Ground',images:{Ground:['./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png','./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-back.png'],'Whole Bean':['./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-front.png','./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-back.png']}},
    {slug:'original',name:'Giannos Original Roast',color:'#CF9A35',description:'Rich aroma, layered flavor, and a full finish with just a hint of sweetness and no lingering aftertaste. A balanced medium roast made to feel familiar from the very first cup.',flavor:'Rich aroma, layered flavor and a hint of sweetness',roast:'Medium',size:'12 ounces',defaultGrind:'Ground',images:{Ground:['./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png','./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-back.png'],'Whole Bean':['./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-front.png','./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-back.png']}},
    {slug:'hazelnut',name:'Giannos Hazelnut',color:'#634227',description:'Earthy, sweet, and warmly roasted with a marbled hazelnut character that lingers into a long, smooth finish. A comforting medium roast made for slower cups and easy everyday brewing.',flavor:'Earthy sweetness and warm roasted hazelnut',roast:'Medium',size:'12 ounces',defaultGrind:'Ground',images:{Ground:['./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-front.png','./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png'],'Whole Bean':['./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-front.png','./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png']}},
    {slug:'espresso',name:'Giannos Espresso Roast',color:'#332016',description:'Rich aroma, layered flavor, and a hint of sweetness carried into a full, rounded finish. A medium roast built for espresso with enough depth to stay bold and smooth in every shot.',flavor:'Rich aroma, layered flavor and a rounded finish',roast:'Medium',size:'12 ounces',defaultGrind:'Whole Bean',images:{Ground:['./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-front.png','./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png'],'Whole Bean':['./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-front.png','./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png']}}
  ];

  const state=PRODUCTS.map(product=>({grind:product.defaultGrind,purchase:'subscribe',bags:1,discount:10,qty:1,image:0}));
  const money=value=>`$${value.toFixed(2)}`;

  function slideTemplate(product,index){
    const grind=product.defaultGrind;
    const pair=product.images[grind];
    return `<article class="coffee-slide" data-index="${index}" style="--accent:${product.color}">
      <div class="coffee-layout">
        <div class="coffee-gallery"><div class="gallery-stack">
          <div class="image-carousel" data-image-carousel>
            <div class="image-viewport">
              <div class="image-track" data-image-track>
                <figure class="product-frame image-panel"><img data-carousel-image="0" src="${pair[0]}" alt="${product.name} front"></figure>
                <figure class="product-frame image-panel"><img data-carousel-image="1" src="${pair[1]}" alt="${product.name} back"></figure>
              </div>
            </div>
            <button class="carousel-arrow carousel-arrow--prev" type="button" data-image-prev aria-label="Previous product image"><span class="material-icons" aria-hidden="true">chevron_left</span></button>
            <button class="carousel-arrow carousel-arrow--next" type="button" data-image-next aria-label="Next product image"><span class="material-icons" aria-hidden="true">chevron_right</span></button>
            <div class="product-dots" role="tablist" aria-label="Product images">
              <button class="product-dot is-active" type="button" data-image-dot="0" aria-label="Show front image" aria-selected="true"></button>
              <button class="product-dot" type="button" data-image-dot="1" aria-label="Show back image" aria-selected="false"></button>
            </div>
          </div>
        </div></div>
        <div class="coffee-copy"><div class="copy-shell">
          <h2 class="copy-title">${product.name}</h2>
          <p class="copy-description">${product.description}</p>
          <a class="view-details" href="#" data-toggle-details>View Details</a>
          <div class="detail-content">
            <dl class="detail-meta"><div><dt>Flavor Notes</dt><dd>${product.flavor}</dd></div><div><dt>Roast Profile</dt><dd>${product.roast}</dd></div><div><dt>Bag Size</dt><dd>${product.size}</dd></div></dl>
            <div class="detail-form">
              <section class="detail-block"><div class="grind-options" role="group" aria-label="Coffee format"><button class="choice-tab ${grind==='Ground'?'is-selected':''}" type="button" data-grind="Ground">Ground</button><button class="choice-tab ${grind==='Whole Bean'?'is-selected':''}" type="button" data-grind="Whole Bean">Whole Bean</button></div></section>
              <section class="detail-block purchase-card is-selected" data-purchase-card="subscribe"><button class="purchase-card__head" type="button" data-purchase="subscribe"><span class="material-icons radio-icon" aria-hidden="true">radio_button_checked</span><strong>Subscribe &amp; Save</strong><span class="purchase-card__prices"><s data-subscribe-original>$20.00</s><b data-subscribe-price>$18.00</b></span></button><div class="purchase-card__body"><h3>Select Quantity</h3><div class="bag-options"><button class="bag-option is-selected" type="button" data-bags="1" data-discount="10"><span>Single</span><b>Save 10%</b></button><button class="bag-option" type="button" data-bags="3" data-discount="15"><span>3-Bags</span><b>Save 15%</b></button><button class="bag-option" type="button" data-bags="6" data-discount="20"><span>6-Bags</span><b>Save 20%</b></button></div><h3>Select Frequency</h3><div class="frequency-field"><select class="frequency-select" aria-label="Delivery frequency"><option>Every Month</option><option>Every 2 Months</option><option>Every 3 Months</option><option>Deliver every 21 days</option><option>Deliver every 30 days</option><option>Deliver every 60 days</option></select><span class="material-icons frequency-field__icon" aria-hidden="true">expand_more</span></div><div class="subscription-benefits"><span><i class="material-icons" aria-hidden="true">check_circle</i><em>Up to 20% off on every order</em></span><span><i class="material-icons" aria-hidden="true">check_circle</i><em>Free shipping within the US</em></span><span><i class="material-icons" aria-hidden="true">check_circle</i><em>Early access to new products</em></span></div></div></section>
              <section class="detail-block purchase-card" data-purchase-card="one-time"><button class="purchase-card__head" type="button" data-purchase="one-time"><span class="material-icons radio-icon" aria-hidden="true">radio_button_unchecked</span><strong>One Time Purchase</strong><span class="purchase-card__prices"><b data-one-time-price>$20.00</b></span></button></section>
              <section class="detail-block cart-block"><div class="quantity-stepper" aria-label="Quantity"><button type="button" data-qty-minus aria-label="Decrease quantity"><span class="material-icons" aria-hidden="true">remove</span></button><span data-qty>1</span><button type="button" data-qty-plus aria-label="Increase quantity"><span class="material-icons" aria-hidden="true">add</span></button></div><button class="add-cart" type="button">Add to Cart · <span data-cart-total>$18.00</span></button></section>
            </div>
          </div>
        </div></div>
      </div>
    </article>`;
  }

  track.innerHTML=PRODUCTS.map(slideTemplate).join('');
  const slides=[...track.querySelectorAll('.coffee-slide')];

  function sectionMetrics(){const start=coffeeSection.offsetTop;const distance=Math.max(coffeeSection.offsetHeight-innerHeight,1);return{start,distance}}
  let activeIndex=0;
  let detailIndex=-1;
  let snapTimer=0;
  let snapping=false;

  const coffeeSticky=coffeeSection.querySelector('.coffee-sticky');
  const colorRgb=PRODUCTS.map(product=>{
    const hex=product.color.replace('#','');
    return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];
  });

  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    activeIndex=Math.max(0,Math.min(PRODUCTS.length-1,Math.round(exact)));
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;

    if(coffeeSticky){
      const from=Math.min(PRODUCTS.length-1,Math.floor(exact));
      const to=Math.min(PRODUCTS.length-1,from+1);
      const mix=exact-from;
      const a=colorRgb[from],b=colorRgb[to];
      const r=Math.round(a[0]+(b[0]-a[0])*mix);
      const g=Math.round(a[1]+(b[1]-a[1])*mix);
      const bl=Math.round(a[2]+(b[2]-a[2])*mix);
      coffeeSticky.style.backgroundColor=`rgb(${r} ${g} ${bl})`;
    }
  }

  function snapToNearest(){
    if(detailIndex>=0||snapping)return;
    const{start,distance}=sectionMetrics();
    if(scrollY<start-2||scrollY>start+distance+2)return;
    const step=distance/(PRODUCTS.length-1);
    const index=Math.max(0,Math.min(PRODUCTS.length-1,Math.round((scrollY-start)/step)));
    const target=start+index*step;
    if(Math.abs(scrollY-target)<3)return;
    snapping=true;
    scrollTo({top:target,behavior:'smooth'});
    setTimeout(()=>{snapping=false},520);
  }

  function onScroll(){if(detailIndex>=0)return;renderHorizontal();clearTimeout(snapTimer);snapTimer=setTimeout(snapToNearest,140)}

  function updateImages(index,animate=false){
    const slide=slides[index];
    const product=PRODUCTS[index];
    const current=state[index];
    const pair=product.images[current.grind]||product.images[product.defaultGrind];
    const images=[...slide.querySelectorAll('[data-carousel-image]')];
    const trackEl=slide.querySelector('[data-image-track]');
    images.forEach((image,imageIndex)=>{
      const src=pair[imageIndex]||pair[0];
      image.src=src;
      image.alt=`${product.name} ${imageIndex===0?'front':'back'} · ${current.grind}`;
    });
    if(trackEl){
      trackEl.style.setProperty('--image-index',String(current.image));
      trackEl.classList.toggle('is-instant',!animate);
      if(!animate)requestAnimationFrame(()=>trackEl.classList.remove('is-instant'));
    }
    slide.querySelectorAll('[data-image-dot]').forEach(dot=>{
      const active=Number(dot.dataset.imageDot)===current.image;
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-selected',String(active));
    });
  }

  function setImage(index,imageIndex){
    const next=Math.max(0,Math.min(1,imageIndex));
    if(state[index].image===next)return;
    state[index].image=next;
    updateImages(index,true);
  }

  function updatePurchase(index){
    const slide=slides[index];const current=state[index];const original=20*current.bags;const subscription=original*(1-current.discount/100);const unit=current.purchase==='subscribe'?subscription:original;
    slide.querySelector('[data-subscribe-original]').textContent=money(original);slide.querySelector('[data-subscribe-price]').textContent=money(subscription);slide.querySelector('[data-one-time-price]').textContent=money(original);slide.querySelector('[data-cart-total]').textContent=money(unit*current.qty);slide.querySelector('[data-qty]').textContent=current.qty;
    slide.querySelectorAll('[data-purchase-card]').forEach(card=>{const selected=card.dataset.purchaseCard===current.purchase;card.classList.toggle('is-selected',selected);const icon=card.querySelector('.radio-icon');if(icon)icon.textContent=selected?'radio_button_checked':'radio_button_unchecked'});
  }

  function animateCopyLayout(slide,mutate){
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
    updateImages(index,false);
    animateCopyLayout(slide,()=>{
      slide.classList.add('is-detail');
      document.body.classList.add('details-open');
      if(toggle)toggle.textContent='Close Details';
    });
  }

  function finishClose(index){
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
      {duration:820,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}
    );
    animation.addEventListener('finish',()=>{
      slide.classList.remove('is-closing','is-detail');
      document.body.classList.remove('details-open');
      slide.scrollTop=0;
      animation.cancel();
      detailIndex=-1;
    },{once:true});
  }

  function closeDetails(index){
    const slide=slides[index];
    if(slide.classList.contains('is-closing'))return;
    const startTop=slide.scrollTop;
    if(startTop<=2){finishClose(index);return}

    const duration=Math.min(650,Math.max(360,startTop*.35));
    const started=performance.now();
    slide.classList.add('is-returning');
    const ease=t=>1-Math.pow(1-t,4);
    const step=now=>{
      const t=Math.min(1,(now-started)/duration);
      slide.scrollTop=startTop*(1-ease(t));
      if(t<1){requestAnimationFrame(step);return}
      slide.scrollTop=0;
      slide.classList.remove('is-returning');
      finishClose(index);
    };
    requestAnimationFrame(step);
  }

  track.addEventListener('click',event=>{
    const slide=event.target.closest('.coffee-slide');if(!slide)return;const index=Number(slide.dataset.index);const current=state[index];
    const toggle=event.target.closest('[data-toggle-details]');if(toggle){event.preventDefault();if(slide.classList.contains('is-detail'))closeDetails(index);else openDetails(index);return}
    const imageDot=event.target.closest('[data-image-dot]');if(imageDot){setImage(index,Number(imageDot.dataset.imageDot));return}
    const grind=event.target.closest('[data-grind]');if(grind){current.grind=grind.dataset.grind;slide.querySelectorAll('[data-grind]').forEach(btn=>btn.classList.toggle('is-selected',btn===grind));updateImages(index,false);return}
    const purchase=event.target.closest('[data-purchase]');if(purchase){current.purchase=purchase.dataset.purchase;updatePurchase(index);return}
    const bags=event.target.closest('[data-bags]');if(bags){current.bags=Number(bags.dataset.bags);current.discount=Number(bags.dataset.discount);slide.querySelectorAll('[data-bags]').forEach(btn=>btn.classList.toggle('is-selected',btn===bags));updatePurchase(index);return}
    if(event.target.closest('[data-qty-minus]')){current.qty=Math.max(1,current.qty-1);updatePurchase(index);return}
    if(event.target.closest('[data-qty-plus]')){current.qty+=1;updatePurchase(index)}
  });

  slides.forEach((slide,index)=>{
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

  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{if(detailIndex<0)renderHorizontal()});
  addEventListener('keydown',event=>{if(event.key==='Escape'&&detailIndex>=0)closeDetails(detailIndex)});
  history.scrollRestoration='auto';
  PRODUCTS.forEach((_,index)=>{updatePurchase(index);updateImages(index,false)});
  requestAnimationFrame(renderHorizontal);
})();