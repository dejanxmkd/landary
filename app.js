(()=>{
  const main=document.getElementById('cinematic-scroll');
  const stage=document.querySelector('.stage');
  const hero=document.querySelector('.hero__content');
  const heroSubtitle=document.querySelector('.hero__subtitle');
  const scrollCue=document.querySelector('.scroll-cue');
  const story=document.querySelector('.story__copy');
  const panels=[...document.querySelectorAll('.coffee-panel')];
  if(!main||!stage||!hero||!story||!panels.length)return;

  const brazil=panels[0];
  const items=panels.map(panel=>({panel,product:panel.querySelector('.product'),copy:panel.querySelector('.product-copy')}));
  const brazilProduct=items[0].product;
  const brazilCopy=items[0].copy;
  const brazilImage=brazilProduct?.querySelector('img');
  const detailBack=document.querySelector('[data-close-product]');
  const inlineDetail=document.querySelector('[data-inline-detail]');
  const detailMetaValues=[...document.querySelectorAll('.detail-meta dd')];

  const PRODUCT_DETAILS=[
    ['Chocolate, caramel and naturally sweet body','Medium','12 ounces'],
    ['Rich vanilla, subtle nuttiness and creamy finish','Medium','12 ounces'],
    ['Milk chocolate, citrus and a smooth finish','Medium','12 ounces'],
    ['Rich aroma, layered flavor and a hint of sweetness','Medium','12 ounces'],
    ['Earthy sweetness and warm roasted hazelnut','Medium','12 ounces'],
    ['Rich aroma, layered flavor and a rounded finish','Medium','12 ounces']
  ];

  const INTRO='#3d5825';
  const COLORS=['#4D6E48','#1C6E95','#563B66','#CF9A35','#634227','#332016'];
  const MORPH=900;
  const EASE='cubic-bezier(.22,1,.36,1)';
  const COFFEE_START=.34;
  const COFFEE_END=.96;
  const SNAP_DELAY=170;

  const PRODUCT_IMAGES={
    brazil:{Ground:'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-front.png','Whole Bean':'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-front.png'},
    'french-vanilla':'./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-front.png',
    'colombian-roast':'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png',
    'original-roast':'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png',
    hazelnut:'./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-front.png',
    'espresso-roast':'./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-front.png'
  };

  const GRIND_IMAGES=[
    {Ground:PRODUCT_IMAGES.brazil.Ground,'Whole Bean':PRODUCT_IMAGES.brazil['Whole Bean']},
    {Ground:PRODUCT_IMAGES['french-vanilla'],'Whole Bean':PRODUCT_IMAGES['french-vanilla']},
    {Ground:'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png','Whole Bean':'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-front.png'},
    {Ground:'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png','Whole Bean':'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-front.png'},
    {Ground:PRODUCT_IMAGES.hazelnut,'Whole Bean':PRODUCT_IMAGES.hazelnut},
    {Ground:PRODUCT_IMAGES['espresso-roast'],'Whole Bean':PRODUCT_IMAGES['espresso-roast']}
  ];

  let detailOpen=false;
  let detailIndex=0;
  let renderRaf=0;
  let snapTimer=null;
  let snapInProgress=false;

  const clamp=(v,min=0,max=1)=>Math.min(Math.max(v,min),max);
  const map=(p,a,b)=>clamp((p-a)/(b-a));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const maxScroll=()=>Math.max(main.offsetHeight-innerHeight,1);
  const progress=()=>clamp(scrollY/maxScroll());
  const currentCoffeePhase=()=>map(progress(),COFFEE_START,COFFEE_END)*(panels.length-1);
  const activeCoffeeIndex=()=>Math.max(0,Math.min(panels.length-1,Math.round(currentCoffeePhase())));
  const coffeeAnchor=index=>COFFEE_START+(index/(panels.length-1))*(COFFEE_END-COFFEE_START);

  function hexToRgb(hex){
    const clean=hex.replace('#','');
    return [parseInt(clean.slice(0,2),16),parseInt(clean.slice(2,4),16),parseInt(clean.slice(4,6),16)];
  }

  function mixColor(a,b,t){
    const A=hexToRgb(a),B=hexToRgb(b),s=smooth(clamp(t));
    return `rgb(${Math.round(lerp(A[0],B[0],s))},${Math.round(lerp(A[1],B[1],s))},${Math.round(lerp(A[2],B[2],s))})`;
  }

  function setBg(color){
    stage.style.backgroundColor=color;
    document.body.style.backgroundColor=color;
    document.documentElement.style.backgroundColor=color;
  }

  function positionScrollCue(){
    if(!heroSubtitle||!scrollCue)return;
    const subtitleBottom=hero.offsetTop+heroSubtitle.offsetTop+heroSubtitle.offsetHeight;
    const midpoint=subtitleBottom+(innerHeight-subtitleBottom)/2;
    scrollCue.style.top=`${Math.round(midpoint-scrollCue.offsetHeight/2)}px`;
  }

  function loadImages(){
    if(brazilImage)brazilImage.src=PRODUCT_IMAGES.brazil.Ground;
    document.querySelectorAll('[data-coffee-image]').forEach(img=>{
      const src=PRODUCT_IMAGES[img.dataset.coffeeImage];
      if(src)img.src=src;
    });
  }

  function baseProductTransform(){
    return innerWidth<=640?'translate(-50%,-62%) scale(.78)':'translate(calc(-50% - 25vw),-50%) scale(1)';
  }

  function baseCopyTransform(){
    return innerWidth<=640?'translateY(0)':'translate(0,-50%)';
  }

  function renderBackground(p,phase){
    if(p<COFFEE_START){
      const introBlend=map(p,.315,COFFEE_START);
      setBg(mixColor(INTRO,COLORS[0],introBlend));
      return;
    }
    const i=Math.min(Math.floor(phase),COLORS.length-1);
    const next=Math.min(i+1,COLORS.length-1);
    setBg(mixColor(COLORS[i],COLORS[next],phase-i));
  }

  function renderScene(){
    if(detailOpen)return;
    const p=progress();

    const heroOut=map(p,.06,.19);
    hero.style.transition='none';
    hero.style.opacity=String(1-heroOut);
    hero.style.filter=`blur(${lerp(0,20,heroOut)}px)`;
    hero.style.transform=`translateY(${lerp(0,-82,heroOut)}px) scale(${lerp(1,.975,heroOut)})`;

    const storyIn=map(p,.15,.23);
    const storyOut=map(p,.25,.31);
    const storyAlpha=storyIn*(1-storyOut);
    story.style.transition='none';
    story.style.opacity=String(storyAlpha);
    story.style.filter=`blur(${lerp(20,0,storyIn)+lerp(0,18,storyOut)}px)`;
    story.style.transform=`translateY(${lerp(70,0,storyIn)-lerp(0,88,storyOut)}px) scale(${lerp(.98,1,storyIn)-lerp(0,.02,storyOut)})`;

    const coffeeT=map(p,COFFEE_START,COFFEE_END);
    const phase=coffeeT*(panels.length-1);
    const nearest=Math.round(phase);
    const coffeeReveal=map(p,.325,.36);

    panels.forEach((panel,index)=>{
      const distance=phase-index;
      const abs=Math.abs(distance);
      const fade=1-smooth(clamp((abs-.12)/.78));
      const alpha=fade*coffeeReveal;
      const x=-distance*44;
      const blur=Math.min(abs*17,18);
      const {product,copy}=items[index];

      panel.style.display='block';
      panel.style.visibility='visible';
      panel.style.transition='none';
      panel.style.opacity=String(alpha);
      panel.style.filter=`blur(${blur}px)`;
      panel.style.transform=`translateX(${x}vw)`;
      panel.style.zIndex=index===nearest?'6':'2';
      panel.style.pointerEvents=index===nearest&&alpha>.72?'auto':'none';

      if(product){
        product.style.visibility='visible';
        product.style.transition='none';
        product.style.opacity=String(alpha);
        product.style.filter=`blur(${Math.min(abs*12,14)}px)`;
        product.style.transform=baseProductTransform();
      }

      if(copy){
        copy.style.visibility='visible';
        copy.style.transition='none';
        copy.style.opacity=String(alpha);
        copy.style.filter=`blur(${Math.min(abs*12,14)}px)`;
        copy.style.transform=baseCopyTransform();
      }
    });

    renderBackground(p,phase);
  }

  function magneticSnap(){
    if(detailOpen||snapInProgress)return;
    const p=progress();
    if(p<COFFEE_START-.015||p>COFFEE_END+.015)return;

    const nearest=activeCoffeeIndex();
    const targetProgress=coffeeAnchor(nearest);
    const targetY=Math.round(targetProgress*maxScroll());
    if(Math.abs(scrollY-targetY)<3)return;

    snapInProgress=true;
    window.scrollTo({top:targetY,behavior:'smooth'});
    setTimeout(()=>{snapInProgress=false},520);
  }

  function scheduleMagneticSnap(){
    if(detailOpen||snapInProgress)return;
    clearTimeout(snapTimer);
    snapTimer=setTimeout(magneticSnap,SNAP_DELAY);
  }

  function scheduleRender(){
    if(detailOpen)return;
    cancelAnimationFrame(renderRaf);
    renderRaf=requestAnimationFrame(renderScene);
    scheduleMagneticSnap();
  }

  function cancelMagnet(){
    clearTimeout(snapTimer);
    if(!snapInProgress)return;
    snapInProgress=false;
    window.scrollTo({top:scrollY,behavior:'auto'});
  }

  function animateVerticalFor(els,before,done){
    const animations=[];
    els.forEach((el,index)=>{
      if(!el||!before[index])return;
      const after=el.getBoundingClientRect();
      const dy=before[index].top-after.top;
      if(Math.abs(dy)<1)return;
      animations.push(el.animate([{translate:`0 ${dy}px`},{translate:'0 0'}],{duration:MORPH,easing:EASE,fill:'both'}));
    });
    Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{
      animations.forEach(a=>a.cancel());
      done?.();
    });
  }

  const afterLayout=cb=>requestAnimationFrame(()=>requestAnimationFrame(cb));

  function collapseDescription(description,collapsed){
    if(!description)return;
    description.style.transition=`opacity ${MORPH}ms ${EASE},transform ${MORPH}ms ${EASE},max-height ${MORPH}ms ${EASE},margin ${MORPH}ms ${EASE}`;
    if(collapsed){
      description.style.maxHeight='0';
      description.style.marginTop='0';
      description.style.opacity='0';
      description.style.transform='translateY(-28px)';
      description.style.overflow='hidden';
    }else{
      description.style.maxHeight='220px';
      description.style.marginTop='24px';
      description.style.opacity='1';
      description.style.transform='translateY(0)';
      description.style.overflow='hidden';
    }
  }

  function syncDetailContent(index){
    const values=PRODUCT_DETAILS[index]||PRODUCT_DETAILS[0];
    detailMetaValues.forEach((el,i)=>{el.textContent=values[i]||'—'});
    const image=items[index]?.product?.querySelector('img');
    const selected=document.querySelector('.choice-tab.is-selected')?.dataset.grind||'Ground';
    const variants=GRIND_IMAGES[index];
    if(image&&variants)image.src=variants[selected]||variants.Ground||variants['Whole Bean'];
  }

  function openDetail(e){
    e?.preventDefault();
    if(detailOpen)return;
    clearTimeout(snapTimer);
    const phase=currentCoffeePhase();
    const index=activeCoffeeIndex();
    if(Math.abs(phase-index)>.42)return;
    const {panel,product,copy}=items[index];
    if(!panel||!product||!copy)return;

    const description=copy.querySelector('.product-copy__description');
    if(detailBack&&detailBack.parentElement!==copy)copy.insertBefore(detailBack,copy.firstChild);
    if(inlineDetail&&inlineDetail.parentElement!==copy)copy.appendChild(inlineDetail);
    syncDetailContent(index);

    const before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];
    detailOpen=true;
    detailIndex=index;
    document.body.classList.add('detail-open');
    panel.classList.add('is-detail');
    panel.style.zIndex='10';
    panel.style.opacity='1';
    panel.style.filter='blur(0)';
    panel.style.transform='translateX(0)';
    panel.style.pointerEvents='auto';
    product.style.transition='none';
    product.style.opacity='1';
    product.style.filter='blur(0)';
    product.style.transform='translateX(-50%)';
    copy.style.transition='none';
    copy.style.opacity='1';
    copy.style.filter='blur(0)';
    copy.style.transform='none';

    if(innerWidth>840){
      copy.style.top='0';
      copy.style.height='100svh';
      copy.style.paddingTop='32px';
      copy.style.paddingBottom='32px';
    }

    afterLayout(()=>{
      animateVerticalFor([product,copy],before);
      requestAnimationFrame(()=>collapseDescription(description,true));
    });
  }

  function closeDetail(){
    if(!detailOpen)return;
    const {panel,product,copy}=items[detailIndex];
    if(!panel||!product||!copy)return;
    const description=copy.querySelector('.product-copy__description');
    const before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];

    detailOpen=false;
    collapseDescription(description,false);
    document.body.classList.remove('detail-open');
    copy.style.top='';
    copy.style.height='';
    copy.style.paddingTop='';
    copy.style.paddingBottom='';
    panel.classList.remove('is-detail');
    renderScene();

    afterLayout(()=>animateVerticalFor([product,copy],before,()=>{
      setTimeout(()=>{
        if(!description)return;
        description.style.transition='';
        description.style.maxHeight='';
        description.style.marginTop='';
        description.style.opacity='';
        description.style.transform='';
        description.style.overflow='';
      },80);
    }));
  }

  const purchaseCards=[...document.querySelectorAll('[data-purchase-card]')];
  const bagOptions=[...document.querySelectorAll('.bag-option')];
  const grindOptions=[...document.querySelectorAll('.choice-tab')];
  const subscribeOriginal=document.querySelector('[data-subscribe-original]');
  const subscribePrice=document.querySelector('[data-subscribe-price]');
  const oneTimePrice=document.querySelector('[data-one-time-price]');
  const cartTotal=document.querySelector('[data-cart-total]');
  const qtyLabel=document.querySelector('[data-qty]');
  let purchaseMode='subscribe',bagCount=1,discount=10,qty=1;
  const money=v=>`$${v.toFixed(2)}`;

  function updatePurchase(){
    const original=20*bagCount;
    const subscription=original*(1-discount/100);
    const total=(purchaseMode==='subscribe'?subscription:original)*qty;
    if(subscribeOriginal)subscribeOriginal.textContent=money(original);
    if(subscribePrice)subscribePrice.textContent=money(subscription);
    if(oneTimePrice)oneTimePrice.textContent=money(original);
    if(cartTotal)cartTotal.textContent=money(total);
    if(qtyLabel)qtyLabel.textContent=qty;
    purchaseCards.forEach(card=>{
      const selected=card.dataset.purchaseCard===purchaseMode;
      card.classList.toggle('is-selected',selected);
      const icon=card.querySelector('.radio-icon');
      if(icon)icon.textContent=selected?'radio_button_checked':'radio_button_unchecked';
    });
  }

  document.querySelectorAll('[data-purchase]').forEach(button=>button.addEventListener('click',()=>{
    purchaseMode=button.dataset.purchase;
    updatePurchase();
  }));

  bagOptions.forEach(button=>button.addEventListener('click',()=>{
    bagCount=Number(button.dataset.bags);
    discount=Number(button.dataset.discount);
    bagOptions.forEach(item=>item.classList.toggle('is-selected',item===button));
    updatePurchase();
  }));

  grindOptions.forEach(button=>button.addEventListener('click',()=>{
    grindOptions.forEach(item=>item.classList.toggle('is-selected',item===button));
    const index=detailOpen?detailIndex:activeCoffeeIndex();
    const image=items[index]?.product?.querySelector('img');
    const variants=GRIND_IMAGES[index];
    const src=variants?.[button.dataset.grind];
    if(image&&src)image.src=src;
  }));

  document.querySelector('[data-qty-minus]')?.addEventListener('click',()=>{
    qty=Math.max(1,qty-1);
    updatePurchase();
  });

  document.querySelector('[data-qty-plus]')?.addEventListener('click',()=>{
    qty+=1;
    updatePurchase();
  });

  document.querySelectorAll('[data-open-product]').forEach(link=>link.addEventListener('click',openDetail));
  document.querySelector('[data-close-product]')?.addEventListener('click',closeDetail);

  addEventListener('scroll',scheduleRender,{passive:true});
  addEventListener('wheel',cancelMagnet,{passive:true});
  addEventListener('touchstart',cancelMagnet,{passive:true});
  addEventListener('resize',()=>{
    positionScrollCue();
    scheduleRender();
  });
  addEventListener('keydown',e=>{
    cancelMagnet();
    if(detailOpen&&e.key==='Escape')closeDetail();
  });

  history.scrollRestoration='manual';
  document.body.classList.remove('detail-open');
  panels.forEach(panel=>panel.classList.remove('is-detail'));
  loadImages();
  updatePurchase();
  positionScrollCue();
  scrollTo(0,0);
  renderScene();
  document.fonts?.ready.then(positionScrollCue);
})();