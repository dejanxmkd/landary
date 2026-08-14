(()=>{
  const main=document.getElementById('cinematic-scroll');
  const stage=document.querySelector('.stage');
  const hero=document.querySelector('.hero__content');
  const story=document.querySelector('.story__copy');
  const panels=[...document.querySelectorAll('.coffee-panel')];
  if(!main||!stage||!hero||!story||!panels.length)return;

  const items=panels.map(panel=>({panel,product:panel.querySelector('.product'),copy:panel.querySelector('.product-copy')}));
  const detailBack=document.querySelector('[data-close-product]');
  const inlineDetail=document.querySelector('[data-inline-detail]');
  const detailMetaValues=[...document.querySelectorAll('.detail-meta dd')];

  const INTRO='#3d5825';
  const COLORS=['#4D6E48','#1C6E95','#563B66','#CF9A35','#634227','#332016'];
  const DURATION=1380;
  const LOCK=1540;
  const MORPH=1000;
  const EASE='cubic-bezier(.16,1,.3,1)';

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
    {Ground:[GRIND_IMAGES[2].Ground,'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-back.png'],'Whole Bean':[GRIND_IMAGES[2]['Whole Bean'],'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-back.png']},
    {Ground:[GRIND_IMAGES[3].Ground,'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-back.png'],'Whole Bean':[GRIND_IMAGES[3]['Whole Bean'],'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-back.png']},
    {Ground:[PRODUCT_IMAGES.hazelnut,'./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png'],'Whole Bean':[PRODUCT_IMAGES.hazelnut,'./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png']},
    {Ground:[PRODUCT_IMAGES['espresso-roast'],'./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png'],'Whole Bean':[PRODUCT_IMAGES['espresso-roast'],'./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png']}
  ];

  let scene=0,locked=false,detailOpen=false,detailIndex=0,wheelReady=true,wheelTimer=null,touchStartY=null;
  const transition=`transform ${DURATION}ms ${EASE},opacity ${DURATION}ms ${EASE},filter ${DURATION}ms ${EASE}`;
  const setBg=color=>[stage,document.body,document.documentElement].forEach(el=>el.style.backgroundColor=color);
  const mobile=()=>innerWidth<=640;
  const productTarget=()=>mobile()?'translate(-50%,-50%) scale(.88)':'translate(calc(-50% - 25vw),-50%) scale(1)';
  const copyTarget=()=>mobile()?'translateY(0)':'translate(0,-50%)';
  const productOffscreen=position=>mobile()
    ?position==='before'?'translate(-50%,-72%) scale(.94)':'translate(-50%,-28%) scale(.94)'
    :position==='before'?'translate(calc(-50% - 25vw),calc(-50% - 24vh)) scale(.96)':'translate(calc(-50% - 25vw),calc(-50% + 24vh)) scale(.96)';
  const copyOffscreen=position=>mobile()
    ?position==='before'?'translateY(-20vh)':'translateY(20vh)'
    :position==='before'?'translate(0,calc(-50% - 22vh))':'translate(0,calc(-50% + 22vh))';

  function loadImages(){
    const first=items[0]?.product?.querySelector('img');
    if(first)first.src=PRODUCT_IMAGES.brazil.Ground;
    document.querySelectorAll('[data-coffee-image]').forEach(img=>{const src=PRODUCT_IMAGES[img.dataset.coffeeImage];if(src)img.src=src});
  }
  function setTransitions(){
    hero.style.transition=transition;story.style.transition=transition;
    panels.forEach((panel,i)=>{panel.style.transition=transition;if(items[i].product)items[i].product.style.transition=transition;if(items[i].copy)items[i].copy.style.transition=transition});
    [stage,document.body,document.documentElement].forEach(el=>el.style.transition=`background-color ${DURATION}ms ${EASE}`);
  }
  function placeHero(position='below'){
    hero.style.opacity='0';hero.style.filter='blur(12px)';hero.style.transform=`translateY(${position==='below'?12:-12}vh) scale(.985)`;
  }
  function showHero(){hero.style.opacity='1';hero.style.filter='blur(0)';hero.style.transform='translateY(0) scale(1)'}
  function hideHero(direction=1){hero.style.opacity='0';hero.style.filter='blur(12px)';hero.style.transform=`translateY(${direction>0?-10:10}vh) scale(.985)`}
  function placeStory(direction=1){story.style.opacity='0';story.style.filter='blur(12px)';story.style.transform=`translateY(${direction>0?12:-12}vh) scale(.985)`}
  function showStory(){story.style.opacity='1';story.style.filter='blur(0)';story.style.transform='translateY(0) scale(1)'}
  function hideStory(direction=1){story.style.opacity='0';story.style.filter='blur(12px)';story.style.transform=`translateY(${direction>0?-10:10}vh) scale(.985)`}

  function setCoffee(index,position){
    const {panel,product,copy}=items[index],active=position==='active';
    panel.style.display='block';panel.style.visibility='visible';panel.style.pointerEvents=active?'auto':'none';panel.style.zIndex=active?'6':'5';
    panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform=active?'translateY(0)':position==='before'?'translateY(-100vh)':'translateY(100vh)';
    if(product){product.style.visibility='visible';product.style.opacity='1';product.style.filter='blur(0)';product.style.transform=productTarget()}
    if(copy){copy.style.visibility='visible';copy.style.opacity='1';copy.style.filter='blur(0)';copy.style.transform=copyTarget()}
  }
  function renderCoffee(activeIndex){panels.forEach((_,i)=>setCoffee(i,i===activeIndex?'active':i<activeIndex?'before':'after'));setBg(COLORS[activeIndex])}
  function resetScene(){
    setTransitions();
    hero.style.transition='none';story.style.transition='none';
    placeHero('below');placeStory(1);
    panels.forEach((_,i)=>setCoffee(i,'after'));
    setBg(INTRO);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{setTransitions();showHero()}));
  }

  function goToScene(next){
    if(locked||detailOpen||next<0||next>panels.length+1||next===scene)return;
    locked=true;const previous=scene,direction=next>previous?1:-1;scene=next;
    if(next===0){
      hideStory(-1);panels.forEach((_,i)=>setCoffee(i,'after'));setBg(INTRO);placeHero('above');setTimeout(showHero,180);
    }
    else if(next===1){
      hideHero(direction);panels.forEach((_,i)=>setCoffee(i,'after'));setBg(INTRO);placeStory(direction);setTimeout(showStory,260);
    }
    else{
      const coffeeIndex=next-2;hideHero(direction);
      if(previous===1){
        hideStory(1);panels.forEach((_,i)=>setCoffee(i,i<coffeeIndex?'before':'after'));setBg(COLORS[coffeeIndex]);setTimeout(()=>renderCoffee(coffeeIndex),340);
      }
      else{hideStory(direction);renderCoffee(coffeeIndex)}
    }
    setTimeout(()=>locked=false,LOCK);
  }

  function wheelDirection(e){
    if(Math.abs(e.deltaY)<3)return 0;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>wheelReady=true,170);if(!wheelReady)return 0;wheelReady=false;return e.deltaY>0?1:-1;
  }
  function onWheel(e){if(detailOpen)return;e.preventDefault();const dir=wheelDirection(e);if(dir&&!locked)goToScene(scene+dir)}
  function onTouchStart(e){if(!detailOpen)touchStartY=e.touches?.[0]?.clientY??null}
  function onTouchEnd(e){
    if(detailOpen||locked||touchStartY===null)return;const endY=e.changedTouches?.[0]?.clientY;if(typeof endY!=='number'){touchStartY=null;return}const delta=touchStartY-endY;touchStartY=null;if(Math.abs(delta)>=36)goToScene(scene+(delta>0?1:-1));
  }

  function selectedGrind(){return document.querySelector('.choice-tab.is-selected')?.dataset.grind||'Ground'}
  function detailPair(index,grind=selectedGrind()){const variants=DETAIL_IMAGES[index];return variants?.[grind]||variants?.Ground||variants?.['Whole Bean']||[]}
  function removeSecondary(index){const gallery=items[index]?.product?.parentElement;gallery?.querySelector('.detail-product-secondary')?.remove();if(gallery)gallery.scrollTop=0}
  function syncDetailImages(index){
    const {product}=items[index]||{},gallery=product?.parentElement,pair=detailPair(index),front=product?.querySelector('img');if(front&&pair[0])front.src=pair[0];if(!gallery)return;
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
    if(collapsed){description.style.maxHeight='0';description.style.marginTop='0';description.style.opacity='0';description.style.transform='translateY(-24px)';description.style.overflow='hidden'}
    else{description.style.maxHeight='220px';description.style.marginTop='24px';description.style.opacity='1';description.style.transform='translateY(0)';description.style.overflow='hidden'}
  }
  function openDetail(e){
    e?.preventDefault();const requested=Number(e?.currentTarget?.dataset.openProduct),index=Number.isInteger(requested)?requested:Math.max(0,scene-2);if(detailOpen||scene!==index+2)return;
    const {panel,product,copy}=items[index];if(!panel||!product||!copy)return;const description=copy.querySelector('.product-copy__description');
    if(detailBack&&detailBack.parentElement!==copy)copy.insertBefore(detailBack,copy.firstChild);if(inlineDetail&&inlineDetail.parentElement!==copy)copy.appendChild(inlineDetail);syncDetailContent(index);
    const before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];detailOpen=true;detailIndex=index;document.body.classList.add('detail-open');panel.classList.add('is-detail');panel.style.zIndex='10';panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform='translateY(0)';panel.style.pointerEvents='auto';
    product.style.transition='none';product.style.opacity='1';product.style.filter='blur(0)';product.style.transform='translateX(-50%)';copy.style.transition='none';copy.style.opacity='1';copy.style.filter='blur(0)';copy.style.transform='none';
    if(innerWidth>840){copy.style.top='0';copy.style.height='100svh';copy.style.paddingTop='32px';copy.style.paddingBottom='32px'}
    afterLayout(()=>{animateVertical([product,copy],before);requestAnimationFrame(()=>collapseDescription(description,true))});
  }
  function closeDetail(){
    if(!detailOpen)return;const {panel,product,copy}=items[detailIndex];if(!panel||!product||!copy)return;const description=copy.querySelector('.product-copy__description'),before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];
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

  stage.addEventListener('wheel',onWheel,{passive:false,capture:true});
  stage.addEventListener('touchstart',onTouchStart,{passive:true,capture:true});
  stage.addEventListener('touchend',onTouchEnd,{passive:true,capture:true});
  addEventListener('keydown',e=>{if(detailOpen){if(e.key==='Escape')closeDetail();return}if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();goToScene(scene+1)}if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();goToScene(scene-1)}});
  addEventListener('resize',()=>{if(detailOpen)return;setTransitions();if(scene===0)showHero();else if(scene===1)showStory();else renderCoffee(scene-2)});

  history.scrollRestoration='manual';main.style.height='100svh';document.body.style.overflow='hidden';document.body.classList.remove('detail-open');panels.forEach(panel=>panel.classList.remove('is-detail'));loadImages();updatePurchase();setTransitions();resetScene();
})();