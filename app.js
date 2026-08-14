(()=>{
  const main=document.getElementById('cinematic-scroll');
  const stage=document.querySelector('.stage');
  const hero=document.querySelector('.hero__content');
  const scrollCue=document.querySelector('.scroll-cue');
  const story=document.querySelector('.story__copy');
  const panels=[...document.querySelectorAll('.coffee-panel')];
  if(!main||!stage||!hero||!story||!panels.length)return;

  const items=panels.map(panel=>({panel,product:panel.querySelector('.product'),copy:panel.querySelector('.product-copy')}));
  const detailBack=document.querySelector('[data-close-product]');
  const inlineDetail=document.querySelector('[data-inline-detail]');
  const detailMetaValues=[...document.querySelectorAll('.detail-meta dd')];

  const INTRO='#3d5825';
  const COLORS=['#4D6E48','#1C6E95','#563B66','#CF9A35','#634227','#332016'];
  const DURATION=1100;
  const LOCK=1250;
  const MORPH=900;
  const EASE='cubic-bezier(.22,1,.36,1)';

  const PRODUCT_IMAGES={
    brazil:{Ground:'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-front.png','Whole Bean':'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-front.png'},
    'french-vanilla':'./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-front.png',
    'colombian-roast':'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png',
    'original-roast':'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png',
    hazelnut:'./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-front.png',
    'espresso-roast':'./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-front.png'
  };

  const PRODUCT_DETAILS=[
    ['Chocolate, caramel and naturally sweet body','Medium','12 ounces'],
    ['Rich vanilla, subtle nuttiness and creamy finish','Medium','12 ounces'],
    ['Milk chocolate, citrus and a smooth finish','Medium','12 ounces'],
    ['Rich aroma, layered flavor and a hint of sweetness','Medium','12 ounces'],
    ['Earthy sweetness and warm roasted hazelnut','Medium','12 ounces'],
    ['Rich aroma, layered flavor and a rounded finish','Medium','12 ounces']
  ];

  const GRIND_IMAGES=[
    {Ground:PRODUCT_IMAGES.brazil.Ground,'Whole Bean':PRODUCT_IMAGES.brazil['Whole Bean']},
    {Ground:PRODUCT_IMAGES['french-vanilla'],'Whole Bean':PRODUCT_IMAGES['french-vanilla']},
    {Ground:'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png','Whole Bean':'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-front.png'},
    {Ground:'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png','Whole Bean':'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-front.png'},
    {Ground:PRODUCT_IMAGES.hazelnut,'Whole Bean':PRODUCT_IMAGES.hazelnut},
    {Ground:PRODUCT_IMAGES['espresso-roast'],'Whole Bean':PRODUCT_IMAGES['espresso-roast']}
  ];

  const DETAIL_IMAGES=[
    {Ground:[PRODUCT_IMAGES.brazil.Ground,'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-back.png'],'Whole Bean':[PRODUCT_IMAGES.brazil['Whole Bean'],'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-back.png']},
    {Ground:[PRODUCT_IMAGES['french-vanilla'],'./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-back.png'],'Whole Bean':[PRODUCT_IMAGES['french-vanilla'],'./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-back.png']},
    {Ground:['./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png','./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-back.png'],'Whole Bean':['./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-front.png','./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-back.png']},
    {Ground:['./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png','./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-back.png'],'Whole Bean':['./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-front.png','./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-back.png']},
    {Ground:[PRODUCT_IMAGES.hazelnut,'./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png'],'Whole Bean':[PRODUCT_IMAGES.hazelnut,'./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png']},
    {Ground:[PRODUCT_IMAGES['espresso-roast'],'./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png'],'Whole Bean':[PRODUCT_IMAGES['espresso-roast'],'./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png']}
  ];

  let scene=0;
  let locked=false;
  let detailOpen=false;
  let detailIndex=0;
  let wheelReady=true;
  let wheelTimer=null;

  const transition=`transform ${DURATION}ms ${EASE},opacity ${DURATION}ms ${EASE},filter ${DURATION}ms ${EASE}`;
  const setBg=color=>{[stage,document.body,document.documentElement].forEach(el=>el.style.backgroundColor=color)};
  const productTarget=()=>innerWidth<=640?'translate(-50%,-62%) scale(.78)':'translate(calc(-50% - 25vw),-50%) scale(1)';
  const copyTarget=()=>innerWidth<=640?'translateY(0)':'translate(0,-50%)';

  function loadImages(){
    const first=items[0]?.product?.querySelector('img');
    if(first)first.src=PRODUCT_IMAGES.brazil.Ground;
    document.querySelectorAll('[data-coffee-image]').forEach(img=>{const src=PRODUCT_IMAGES[img.dataset.coffeeImage];if(src)img.src=src});
  }

  function setTransitions(){
    hero.style.transition=transition;
    story.style.transition=transition;
    panels.forEach((panel,index)=>{
      panel.style.transition=transition;
      if(items[index].product)items[index].product.style.transition=transition;
      if(items[index].copy)items[index].copy.style.transition=transition;
    });
    [stage,document.body,document.documentElement].forEach(el=>el.style.transition=`background-color ${DURATION}ms ${EASE}`);
  }

  function hideHero(direction=1){
    hero.style.opacity='0';hero.style.filter='blur(20px)';hero.style.transform=`translateY(${direction>0?-82:82}px) scale(.975)`;
    if(scrollCue)scrollCue.style.opacity='0';
  }
  function showHero(){
    hero.style.opacity='1';hero.style.filter='blur(0)';hero.style.transform='translateY(0) scale(1)';
    if(scrollCue)scrollCue.style.opacity='1';
  }
  function hideStory(direction=1){story.style.opacity='0';story.style.filter='blur(20px)';story.style.transform=`translateY(${direction>0?-88:88}px) scale(.98)`}
  function showStory(){story.style.opacity='1';story.style.filter='blur(0)';story.style.transform='translateY(0) scale(1)'}

  function setCoffee(index,position){
    const {panel,product,copy}=items[index];
    const active=position==='active';
    panel.style.display='block';panel.style.visibility='visible';panel.style.pointerEvents=active?'auto':'none';panel.style.zIndex=active?'6':'2';
    panel.style.opacity=active?'1':'0';panel.style.filter=active?'blur(0)':'blur(16px)';panel.style.transform=active?'translateX(0)':position==='before'?'translateX(-105vw)':'translateX(105vw)';
    if(product){product.style.visibility='visible';product.style.opacity=active?'1':'0';product.style.filter=active?'blur(0)':'blur(16px)';product.style.transform=active?productTarget():position==='before'?'translate(calc(-50% - 45vw),-50%) scale(.9)':'translate(calc(-50% + 28vw),-50%) scale(.9)'}
    if(copy){copy.style.visibility='visible';copy.style.opacity=active?'1':'0';copy.style.filter=active?'blur(0)':'blur(16px)';copy.style.transform=active?copyTarget():position==='before'?'translate(-18vw,-50%)':'translate(22vw,-50%)'}
  }

  function renderCoffee(activeIndex){
    panels.forEach((_,i)=>setCoffee(i,i===activeIndex?'active':i<activeIndex?'before':'after'));
    setBg(COLORS[activeIndex]);
  }

  function resetScene(){
    setTransitions();
    showHero();hideStory(1);
    panels.forEach((_,i)=>setCoffee(i,'after'));
    setBg(INTRO);
  }

  function goToScene(next){
    if(locked||detailOpen||next<0||next>panels.length+1||next===scene)return;
    locked=true;
    const previous=scene;
    const direction=next>previous?1:-1;
    scene=next;

    if(next===0){
      hideStory(-1);panels.forEach((_,i)=>setCoffee(i,'after'));setBg(INTRO);setTimeout(showHero,120);
    }else if(next===1){
      hideHero(direction);
      panels.forEach((_,i)=>setCoffee(i,'after'));
      setBg(INTRO);
      setTimeout(showStory,previous>1?360:220);
    }else{
      const coffeeIndex=next-2;
      hideHero(direction);
      if(previous===1){
        hideStory(1);
        panels.forEach((_,i)=>setCoffee(i,i<coffeeIndex?'before':'after'));
        setBg(COLORS[coffeeIndex]);
        setTimeout(()=>renderCoffee(coffeeIndex),420);
      }else{
        hideStory(direction);
        renderCoffee(coffeeIndex);
      }
    }
    setTimeout(()=>locked=false,LOCK);
  }

  function wheelDirection(e){
    if(Math.abs(e.deltaY)<3)return 0;
    clearTimeout(wheelTimer);
    wheelTimer=setTimeout(()=>wheelReady=true,150);
    if(!wheelReady)return 0;
    wheelReady=false;
    return e.deltaY>0?1:-1;
  }

  function onWheel(e){
    if(detailOpen)return;
    e.preventDefault();
    const dir=wheelDirection(e);
    if(!dir||locked)return;
    goToScene(scene+dir);
  }

  function selectedGrind(){return document.querySelector('.choice-tab.is-selected')?.dataset.grind||'Ground'}
  function detailPair(index,grind=selectedGrind()){const variants=DETAIL_IMAGES[index];return variants?.[grind]||variants?.Ground||variants?.['Whole Bean']||[]}
  function removeSecondary(index){const gallery=items[index]?.product?.parentElement;gallery?.querySelector('.detail-product-secondary')?.remove();if(gallery)gallery.scrollTop=0}
  function syncDetailImages(index){
    const {product}=items[index]||{};const gallery=product?.parentElement;const pair=detailPair(index);const front=product?.querySelector('img');if(front&&pair[0])front.src=pair[0];if(!gallery)return;
    let secondary=gallery.querySelector('.detail-product-secondary');
    if(pair[1]){if(!secondary){secondary=document.createElement('figure');secondary.className='product detail-product-secondary';secondary.innerHTML='<img alt="Coffee bag back">';gallery.appendChild(secondary)}const back=secondary.querySelector('img');if(back)back.src=pair[1]}
  }
  function syncDetailContent(index){const values=PRODUCT_DETAILS[index]||PRODUCT_DETAILS[0];detailMetaValues.forEach((el,i)=>el.textContent=values[i]||'—');syncDetailImages(index)}

  function animateVertical(els,before,done){
    const animations=[];els.forEach((el,i)=>{if(!el||!before[i])return;const after=el.getBoundingClientRect(),dy=before[i].top-after.top;if(Math.abs(dy)<1)return;animations.push(el.animate([{translate:`0 ${dy}px`},{translate:'0 0'}],{duration:MORPH,easing:EASE,fill:'both'}))});
    Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{animations.forEach(a=>a.cancel());done?.()});
  }
  const afterLayout=cb=>requestAnimationFrame(()=>requestAnimationFrame(cb));
  function collapseDescription(description,collapsed){
    if(!description)return;description.style.transition=`opacity ${MORPH}ms ${EASE},transform ${MORPH}ms ${EASE},max-height ${MORPH}ms ${EASE},margin ${MORPH}ms ${EASE}`;
    if(collapsed){description.style.maxHeight='0';description.style.marginTop='0';description.style.opacity='0';description.style.transform='translateY(-28px)';description.style.overflow='hidden'}
    else{description.style.maxHeight='220px';description.style.marginTop='24px';description.style.opacity='1';description.style.transform='translateY(0)';description.style.overflow='hidden'}
  }

  function openDetail(e){
    e?.preventDefault();
    const requested=Number(e?.currentTarget?.dataset.openProduct);
    const index=Number.isInteger(requested)?requested:Math.max(0,scene-2);
    if(detailOpen||scene!==index+2)return;
    const {panel,product,copy}=items[index];if(!panel||!product||!copy)return;
    const description=copy.querySelector('.product-copy__description');
    if(detailBack&&detailBack.parentElement!==copy)copy.insertBefore(detailBack,copy.firstChild);
    if(inlineDetail&&inlineDetail.parentElement!==copy)copy.appendChild(inlineDetail);
    syncDetailContent(index);
    const before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];
    detailOpen=true;detailIndex=index;document.body.classList.add('detail-open');panel.classList.add('is-detail');panel.style.zIndex='10';panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform='translateX(0)';panel.style.pointerEvents='auto';
    product.style.transition='none';product.style.opacity='1';product.style.filter='blur(0)';product.style.transform='translateX(-50%)';copy.style.transition='none';copy.style.opacity='1';copy.style.filter='blur(0)';copy.style.transform='none';
    if(innerWidth>840){copy.style.top='0';copy.style.height='100svh';copy.style.paddingTop='32px';copy.style.paddingBottom='32px'}
    afterLayout(()=>{animateVertical([product,copy],before);requestAnimationFrame(()=>collapseDescription(description,true))});
  }

  function closeDetail(){
    if(!detailOpen)return;
    const {panel,product,copy}=items[detailIndex];if(!panel||!product||!copy)return;
    const description=copy.querySelector('.product-copy__description');const before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];
    detailOpen=false;collapseDescription(description,false);document.body.classList.remove('detail-open');copy.style.top='';copy.style.height='';copy.style.paddingTop='';copy.style.paddingBottom='';removeSecondary(detailIndex);panel.classList.remove('is-detail');setTransitions();renderCoffee(detailIndex);
    afterLayout(()=>animateVertical([product,copy],before,()=>setTimeout(()=>{if(!description)return;description.style.transition='';description.style.maxHeight='';description.style.marginTop='';description.style.opacity='';description.style.transform='';description.style.overflow=''},80)));
  }

  const purchaseCards=[...document.querySelectorAll('[data-purchase-card]')],bagOptions=[...document.querySelectorAll('.bag-option')],grindOptions=[...document.querySelectorAll('.choice-tab')],subscribeOriginal=document.querySelector('[data-subscribe-original]'),subscribePrice=document.querySelector('[data-subscribe-price]'),oneTimePrice=document.querySelector('[data-one-time-price]'),cartTotal=document.querySelector('[data-cart-total]'),qtyLabel=document.querySelector('[data-qty]');
  let purchaseMode='subscribe',bagCount=1,discount=10,qty=1;const money=v=>`$${v.toFixed(2)}`;
  function updatePurchase(){const original=20*bagCount,subscription=original*(1-discount/100),total=(purchaseMode==='subscribe'?subscription:original)*qty;if(subscribeOriginal)subscribeOriginal.textContent=money(original);if(subscribePrice)subscribePrice.textContent=money(subscription);if(oneTimePrice)oneTimePrice.textContent=money(original);if(cartTotal)cartTotal.textContent=money(total);if(qtyLabel)qtyLabel.textContent=qty;purchaseCards.forEach(card=>{const selected=card.dataset.purchaseCard===purchaseMode;card.classList.toggle('is-selected',selected);const icon=card.querySelector('.radio-icon');if(icon)icon.textContent=selected?'radio_button_checked':'radio_button_unchecked'})}
  document.querySelectorAll('[data-purchase]').forEach(button=>button.addEventListener('click',()=>{purchaseMode=button.dataset.purchase;updatePurchase()}));
  bagOptions.forEach(button=>button.addEventListener('click',()=>{bagCount=Number(button.dataset.bags);discount=Number(button.dataset.discount);bagOptions.forEach(item=>item.classList.toggle('is-selected',item===button));updatePurchase()}));
  grindOptions.forEach(button=>button.addEventListener('click',()=>{grindOptions.forEach(item=>item.classList.toggle('is-selected',item===button));const index=detailOpen?detailIndex:Math.max(0,scene-2);if(detailOpen){syncDetailImages(index);return}const image=items[index]?.product?.querySelector('img'),src=GRIND_IMAGES[index]?.[button.dataset.grind];if(image&&src)image.src=src}));
  document.querySelector('[data-qty-minus]')?.addEventListener('click',()=>{qty=Math.max(1,qty-1);updatePurchase()});
  document.querySelector('[data-qty-plus]')?.addEventListener('click',()=>{qty+=1;updatePurchase()});
  document.querySelectorAll('[data-open-product]').forEach(link=>link.addEventListener('click',openDetail));
  document.querySelector('[data-close-product]')?.addEventListener('click',closeDetail);

  addEventListener('wheel',onWheel,{passive:false});
  addEventListener('keydown',e=>{if(detailOpen){if(e.key==='Escape')closeDetail();return}if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();goToScene(scene+1)}if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();goToScene(scene-1)}});
  addEventListener('resize',()=>{if(detailOpen)return;setTransitions();if(scene===0)showHero();else if(scene===1)showStory();else renderCoffee(scene-2)});

  history.scrollRestoration='manual';
  main.style.height='100svh';
  document.body.style.overflow='hidden';
  document.body.classList.remove('detail-open');
  panels.forEach(panel=>panel.classList.remove('is-detail'));
  loadImages();updatePurchase();setTransitions();resetScene();
})();