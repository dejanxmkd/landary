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

  const state=PRODUCTS.map(product=>({grind:product.defaultGrind,purchase:'subscribe',bags:1,discount:10,qty:1}));
  const money=value=>`$${value.toFixed(2)}`;

  function slideTemplate(product,index){
    const grind=product.defaultGrind;
    const pair=product.images[grind];
    return `<article class="coffee-slide" data-index="${index}" style="--accent:${product.color}">
      <div class="coffee-layout">
        <div class="coffee-gallery"><div class="gallery-stack">
          <figure class="product-frame"><img data-front src="${pair[0]}" alt="${product.name} front"></figure>
          <figure class="product-frame product-frame--secondary"><img data-back src="${pair[1]}" alt="${product.name} back"></figure>
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

  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    activeIndex=Math.max(0,Math.min(PRODUCTS.length-1,Math.round(exact)));
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;
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

  function updateImages(index){const slide=slides[index];const product=PRODUCTS[index];const pair=product.images[state[index].grind]||product.images[product.defaultGrind];slide.querySelector('[data-front]').src=pair[0];slide.querySelector('[data-back]').src=pair[1]}

  function updatePurchase(index){
    const slide=slides[index];const current=state[index];const original=20*current.bags;const subscription=original*(1-current.discount/100);const unit=current.purchase==='subscribe'?subscription:original;
    slide.querySelector('[data-subscribe-original]').textContent=money(original);slide.querySelector('[data-subscribe-price]').textContent=money(subscription);slide.querySelector('[data-one-time-price]').textContent=money(original);slide.querySelector('[data-cart-total]').textContent=money(unit*current.qty);slide.querySelector('[data-qty]').textContent=current.qty;
    slide.querySelectorAll('[data-purchase-card]').forEach(card=>{const selected=card.dataset.purchaseCard===current.purchase;card.classList.toggle('is-selected',selected);const icon=card.querySelector('.radio-icon');if(icon)icon.textContent=selected?'radio_button_checked':'radio_button_unchecked'});
  }

  function openDetails(index){
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

  track.addEventListener('click',event=>{
    const slide=event.target.closest('.coffee-slide');if(!slide)return;const index=Number(slide.dataset.index);const current=state[index];
    const toggle=event.target.closest('[data-toggle-details]');if(toggle){event.preventDefault();if(slide.classList.contains('is-detail'))closeDetails(index);else openDetails(index);return}
    const grind=event.target.closest('[data-grind]');if(grind){current.grind=grind.dataset.grind;slide.querySelectorAll('[data-grind]').forEach(btn=>btn.classList.toggle('is-selected',btn===grind));updateImages(index);return}
    const purchase=event.target.closest('[data-purchase]');if(purchase){current.purchase=purchase.dataset.purchase;updatePurchase(index);return}
    const bags=event.target.closest('[data-bags]');if(bags){current.bags=Number(bags.dataset.bags);current.discount=Number(bags.dataset.discount);slide.querySelectorAll('[data-bags]').forEach(btn=>btn.classList.toggle('is-selected',btn===bags));updatePurchase(index);return}
    if(event.target.closest('[data-qty-minus]')){current.qty=Math.max(1,current.qty-1);updatePurchase(index);return}
    if(event.target.closest('[data-qty-plus]')){current.qty+=1;updatePurchase(index)}
  });

  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{if(detailIndex<0)renderHorizontal()});
  addEventListener('keydown',event=>{if(event.key==='Escape'&&detailIndex>=0)closeDetails(detailIndex)});
  history.scrollRestoration='auto';
  PRODUCTS.forEach((_,index)=>updatePurchase(index));
  requestAnimationFrame(renderHorizontal);
})();