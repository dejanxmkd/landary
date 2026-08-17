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
        './assets/olive-oil/500ml/giannos-greek-extra-virgin-olive-oil-500ml-front.png',
        './assets/olive-oil/500ml/giannos-greek-extra-virgin-olive-oil-500ml-back.png'
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
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-front.png',
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-front-angled.png',
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-side.png',
        './assets/olive-oil/3l/giannos-greek-extra-virgin-olive-oil-3-liter-back.png'
      ]
    }
  ];

  const state=OLIVE_PRODUCTS.map(()=>({purchase:'subscribe',packageIndex:0,qty:1,image:0}));
  const money=value=>`$${value.toFixed(2)}`;

  function productTemplate(product,index){
    const packageButtons=product.packages.map((item,itemIndex)=>`<button class="bag-option ${itemIndex===0?'is-selected':''}" type="button" data-olive-package="${itemIndex}"><span>${item[0]}</span><b>Save ${item[2]}%</b></button>`).join('');
    const title=product.titleLines.map(line=>`<span>${line}</span>`).join('');
    return `<article class="olive-slide" data-olive-index="${index}" style="--accent:#A2A315">
      <div class="olive-layout">
        <div class="olive-gallery">
          <div class="olive-image-stage"><img data-olive-image src="${product.images[0]}" alt="${product.name}"></div>
        </div>
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
    const olive=[162,163,21];
    return [{y:start,color:olive},{y:start+distance,color:olive}];
  };
  window.__oliveDetailOpen=false;

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
  }
  function closeDetails(index){
    const slide=slides[index];slide.scrollTop=0;slide.classList.remove('is-detail');document.body.classList.remove('olive-details-open');
    const link=slide.querySelector('[data-olive-details]');if(link)link.textContent='View Details';
    detailIndex=-1;window.__oliveDetailOpen=false;
  }

  track.addEventListener('click',event=>{
    const slide=event.target.closest('.olive-slide');if(!slide)return;
    const index=Number(slide.dataset.oliveIndex),current=state[index];
    const detail=event.target.closest('[data-olive-details]');if(detail){event.preventDefault();slide.classList.contains('is-detail')?closeDetails(index):openDetails(index);return}
    const purchase=event.target.closest('[data-olive-purchase]');if(purchase){current.purchase=purchase.dataset.olivePurchase;update(index);return}
    const pack=event.target.closest('[data-olive-package]');if(pack){current.packageIndex=Number(pack.dataset.olivePackage);slide.querySelectorAll('[data-olive-package]').forEach(btn=>btn.classList.toggle('is-selected',btn===pack));update(index);return}
    if(event.target.closest('[data-olive-minus]')){current.qty=Math.max(1,current.qty-1);update(index);return}
    if(event.target.closest('[data-olive-plus]')){current.qty+=1;update(index);return}
  });

  slides.forEach((slide,index)=>{
    const image=slide.querySelector('[data-olive-image]');const stage=slide.querySelector('.olive-image-stage');if(!stage||!image)return;
    let x=0;stage.addEventListener('pointerdown',event=>{x=event.clientX});
    stage.addEventListener('pointerup',event=>{const dx=event.clientX-x;if(Math.abs(dx)<45)return;const count=OLIVE_PRODUCTS[index].images.length;state[index].image=dx<0?(state[index].image+1)%count:(state[index].image-1+count)%count;image.src=OLIVE_PRODUCTS[index].images[state[index].image]});
    update(index);
  });

  addEventListener('scroll',()=>{if(detailIndex<0)render()},{passive:true});
  addEventListener('resize',render);
  requestAnimationFrame(render);
})();
