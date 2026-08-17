(()=>{
  const section=document.getElementById('olive-scroll');
  const track=document.getElementById('olive-track');
  if(!section||!track)return;

  const OLIVE_PRODUCTS=[
    {
      slug:'olive-500ml',
      name:'Giannos Greek Extra Virgin Olive Oil 500ml',
      price:20,
      description:'Greek extra virgin olive oil made for everyday cooking, finishing, dipping, and the moments gathered around the table.',
      packages:[['Single',1,10],['3-Bottle',3,15],['6-Bottle',6,20]],
      images:[
        'https://www.giannos.com/cdn/shop/files/Giannos_Olive_Oil_Resized_-_Front.png?v=1777448601&width=1946',
        'https://www.giannos.com/cdn/shop/files/Giannos_Olive_Oil_Resized_-_Back.png?v=1777448601&width=1946'
      ]
    },
    {
      slug:'olive-3l',
      name:'Giannos Extra Virgin Olive Oil 3L',
      price:75,
      description:'A generous 3 liter tin of Greek extra virgin olive oil for kitchens where olive oil is part of the everyday ritual.',
      packages:[['Single',1,10],['2-Tin',2,15],['4-Tin',4,20]],
      images:[
        'https://www.giannos.com/cdn/shop/files/olive-oil-3L-tin-front.jpg?v=1775600164&width=1946',
        'https://www.giannos.com/cdn/shop/files/olive-oil-3L-tin-angled.jpg?v=1775600169&width=1946'
      ]
    }
  ];

  const state=OLIVE_PRODUCTS.map(()=>({purchase:'subscribe',packageIndex:0,qty:1,image:0}));
  const money=value=>`$${value.toFixed(2)}`;

  function productTemplate(product,index){
    const packageButtons=product.packages.map((item,itemIndex)=>`<button class="olive-package ${itemIndex===0?'is-selected':''}" type="button" data-olive-package="${itemIndex}"><span>${item[0]}</span><b>Save ${item[2]}%</b></button>`).join('');
    return `<article class="olive-slide" data-olive-index="${index}">
      <div class="olive-layout">
        <div class="olive-gallery">
          <div class="olive-image-stage">
            <img data-olive-image src="${product.images[0]}" alt="${product.name}">
          </div>
        </div>
        <div class="olive-copy"><div class="olive-shell">
          <h2 class="olive-title">${product.name}</h2>
          <p class="olive-description">${product.description}</p>
          <a class="olive-view-details" href="#" data-olive-details>View Details</a>
          <div class="olive-detail">
            <div class="olive-price-row"><span>Greek Extra Virgin Olive Oil</span><strong>${money(product.price)}</strong></div>
            <section class="olive-card is-selected" data-olive-purchase-card="subscribe">
              <button class="olive-card-head" type="button" data-olive-purchase="subscribe"><span class="material-icons">radio_button_checked</span><strong>Subscribe &amp; Save</strong><span class="olive-card-price"><s data-olive-sub-original>${money(product.price)}</s><b data-olive-sub-price>${money(product.price*.9)}</b></span></button>
              <div class="olive-card-body">
                <span class="olive-label">Select Quantity</span>
                <div class="olive-package-options">${packageButtons}</div>
                <span class="olive-label">Select Frequency</span>
                <div class="olive-frequency"><select aria-label="Delivery frequency"><option>Deliver every month</option><option>Deliver every 2 months</option><option>Deliver every 3 months</option></select><span class="material-icons">expand_more</span></div>
                <div class="olive-benefits"><span><i class="material-icons">check_circle</i>Up to 20% off on every order</span><span><i class="material-icons">check_circle</i>Free shipping within the US</span><span><i class="material-icons">check_circle</i>Early access to new products</span></div>
              </div>
            </section>
            <section class="olive-card" data-olive-purchase-card="one-time"><button class="olive-card-head" type="button" data-olive-purchase="one-time"><span class="material-icons">radio_button_unchecked</span><strong>One Time Purchase</strong><span class="olive-card-price"><b data-olive-one-price>${money(product.price)}</b></span></button></section>
            <div class="olive-cart-row"><button type="button" data-olive-minus><span class="material-icons">remove</span></button><span data-olive-qty>1</span><button type="button" data-olive-plus><span class="material-icons">add</span></button></div>
            <button class="olive-add-cart" type="button">Add to Cart · <span data-olive-total>${money(product.price*.9)}</span></button>
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
    const cream=[243,238,223];
    return [{y:start,color:cream},{y:start+distance,color:cream}];
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
      const icon=card.querySelector('.material-icons');if(icon)icon.textContent=selected?'radio_button_checked':'radio_button_unchecked';
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
    const image=slide.querySelector('[data-olive-image]');
    const stage=slide.querySelector('.olive-image-stage');
    if(!stage||!image)return;
    let x=0;
    stage.addEventListener('pointerdown',event=>{x=event.clientX});
    stage.addEventListener('pointerup',event=>{const dx=event.clientX-x;if(Math.abs(dx)<45)return;state[index].image=dx<0?1:0;image.src=OLIVE_PRODUCTS[index].images[state[index].image]});
    update(index);
  });

  addEventListener('scroll',()=>{if(detailIndex<0)render()},{passive:true});
  addEventListener('resize',render);
  requestAnimationFrame(render);
})();
