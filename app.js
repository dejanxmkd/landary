(()=>{
  const main=document.getElementById('cinematic-scroll');
  const stage=document.querySelector('.stage');
  const hero=document.querySelector('.hero__content');
  const heroSubtitle=document.querySelector('.hero__subtitle');
  const scrollCue=document.querySelector('.scroll-cue');
  const story=document.querySelector('.story__copy');
  const panels=[...document.querySelectorAll('.coffee-panel')];
  const brazil=panels[0];
  const panelData=panels.map(panel=>({
    panel,
    product:panel.querySelector('.product'),
    copy:panel.querySelector('.product-copy')
  }));
  const brazilProduct=panelData[0]?.product;
  const brazilCopy=panelData[0]?.copy;
  const brazilImage=brazilProduct?.querySelector('img');
  const brazilDescription=brazil?.querySelector('.product-copy__description');

  const INTRO='#3d5825';
  const COLORS=['#4D6E48','#1C6E95','#563B66','#CF9A35','#634227','#332016'];
  const DURATION=1100;
  const LOCK=1050;
  const MORPH=950;
  const EASE='cubic-bezier(.22,1,.36,1)';

  const PRODUCT_IMAGES={
    brazil:{
      Ground:'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-front.png',
      'Whole Bean':'./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-front.png'
    },
    'french-vanilla':'./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-front.png',
    'colombian-roast':'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png',
    'original-roast':'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png',
    hazelnut:'./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-front.png',
    'espresso-roast':'./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-front.png'
  };

  let coffeeStarted=false;
  let active=0;
  let transitionLocked=false;
  let detailOpen=false;
  let wheelGestureActive=false;
  let wheelGestureTimer=null;

  const clamp=(v,min=0,max=1)=>Math.min(Math.max(v,min),max);
  const map=(p,a,b)=>clamp((p-a)/(b-a));
  const lerp=(a,b,t)=>a+(b-a)*t;

  function setBg(color){
    [stage,document.body,document.documentElement].forEach(el=>{if(el)el.style.backgroundColor=color});
  }

  function setTransition(el,on=true){
    if(!el)return;
    el.style.transition=on?`transform ${DURATION}ms ${EASE},opacity ${DURATION}ms ${EASE},filter ${DURATION}ms ${EASE}`:'none';
  }

  function positionScrollCue(){
    if(!hero||!heroSubtitle||!scrollCue)return;
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

  function maxScroll(){return Math.max(main.offsetHeight-innerHeight,1)}
  function scrollProgress(){return clamp(scrollY/maxScroll())}

  function prepareCoffeeChildren(){
    const mobile=innerWidth<=640;
    panelData.forEach(({product,copy},index)=>{
      if(product){
        product.style.visibility='visible';
        product.style.opacity='1';
        product.style.filter='blur(0)';
        if(index===0){
          product.style.transform=mobile?'translate(-50%,-62%) scale(.78)':'translate(calc(-50% - 25vw),-50%) scale(1)';
        }else{
          product.style.transform=mobile?'translate(-50%,-62%) scale(.78)':'translate(calc(-50% - 25vw),-50%) scale(1)';
        }
      }
      if(copy){
        copy.style.visibility='visible';
        copy.style.opacity='1';
        copy.style.filter='blur(0)';
        copy.style.transform=mobile?'translateY(0)':'translate(0,-50%)';
      }
    });
  }

  function hideCoffeePanels(){
    panels.forEach((panel,index)=>{
      setTransition(panel,false);
      panel.style.opacity='0';
      panel.style.filter='blur(14px)';
      panel.style.transform=index===0?'translateX(0)':'translateX(108vw)';
      panel.style.pointerEvents='none';
    });
  }

  function renderIntro(){
    if(coffeeStarted||detailOpen)return;
    const p=scrollProgress();
    const heroOut=map(p,.10,.34);
    const storyIn=map(p,.40,.64);

    hero.style.transition='none';
    story.style.transition='none';
    hero.style.opacity=1-heroOut;
    hero.style.filter=`blur(${lerp(0,20,heroOut)}px)`;
    hero.style.transform=`translateY(${lerp(0,-72,heroOut)}px) scale(${lerp(1,.975,heroOut)})`;

    story.style.opacity=storyIn;
    story.style.filter=`blur(${lerp(20,0,storyIn)}px)`;
    story.style.transform=`translateY(${lerp(70,0,storyIn)}px) scale(${lerp(.98,1,storyIn)})`;

    hideCoffeePanels();
    setBg(INTRO);
  }

  function renderCoffee(){
    if(detailOpen)return;
    prepareCoffeeChildren();
    panels.forEach((panel,index)=>{
      setTransition(panel,true);
      if(index===active){
        panel.style.opacity='1';
        panel.style.filter='blur(0)';
        panel.style.transform='translateX(0)';
        panel.style.pointerEvents='auto';
      }else if(index<active){
        panel.style.opacity='0';
        panel.style.filter='blur(14px)';
        panel.style.transform='translateX(-108vw)';
        panel.style.pointerEvents='none';
      }else{
        panel.style.opacity='0';
        panel.style.filter='blur(14px)';
        panel.style.transform='translateX(108vw)';
        panel.style.pointerEvents='none';
      }
    });
    setBg(COLORS[active]);
  }

  function startCoffee(){
    if(coffeeStarted||transitionLocked)return;
    coffeeStarted=true;
    active=0;
    transitionLocked=true;

    const mobile=innerWidth<=640;
    setTransition(story,true);
    setTransition(brazil,true);
    setTransition(brazilProduct,true);
    setTransition(brazilCopy,true);
    prepareCoffeeChildren();

    story.style.opacity='0';
    story.style.filter='blur(18px)';
    story.style.transform='translateY(-90px) scale(.98)';

    panels.forEach((panel,index)=>{
      panel.style.pointerEvents=index===0?'auto':'none';
      panel.style.opacity=index===0?'1':'0';
      panel.style.filter=index===0?'blur(0)':'blur(14px)';
      panel.style.transform=index===0?'translateX(0)':'translateX(108vw)';
    });

    brazilProduct.style.opacity='0';
    brazilProduct.style.filter='blur(18px)';
    brazilProduct.style.transform='translate(-50%,-50%) scale(.65)';
    brazilCopy.style.opacity='0';
    brazilCopy.style.filter='blur(18px)';
    brazilCopy.style.transform=mobile?'translateY(70px)':'translate(22vw,-50%)';
    setBg(COLORS[0]);

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        brazilProduct.style.opacity='1';
        brazilProduct.style.filter='blur(0)';
        brazilProduct.style.transform=mobile?'translate(-50%,-62%) scale(.78)':'translate(calc(-50% - 25vw),-50%) scale(1)';
        brazilCopy.style.opacity='1';
        brazilCopy.style.filter='blur(0)';
        brazilCopy.style.transform=mobile?'translateY(0)':'translate(0,-50%)';
      });
    });

    setTimeout(()=>{transitionLocked=false},LOCK);
  }

  function returnToStory(){
    if(!coffeeStarted||active!==0||detailOpen||transitionLocked)return;
    transitionLocked=true;
    const mobile=innerWidth<=640;

    setTransition(story,true);
    setTransition(brazil,true);
    setTransition(brazilProduct,true);
    setTransition(brazilCopy,true);

    brazilCopy.style.opacity='0';
    brazilCopy.style.filter='blur(18px)';
    brazilCopy.style.transform=mobile?'translateY(70px)':'translate(22vw,-50%)';
    brazilProduct.style.opacity='0';
    brazilProduct.style.filter='blur(18px)';
    brazilProduct.style.transform='translate(-50%,-50%) scale(.65)';
    brazil.style.opacity='0';
    brazil.style.filter='blur(14px)';
    setBg(INTRO);

    story.style.opacity='1';
    story.style.filter='blur(0)';
    story.style.transform='translateY(0) scale(1)';

    setTimeout(()=>{
      coffeeStarted=false;
      transitionLocked=false;
      active=0;
      scrollTo(0,maxScroll()*.64);
      renderIntro();
    },LOCK);
  }

  function stepCoffee(direction){
    if(!coffeeStarted||detailOpen||transitionLocked)return;
    if(direction<0&&active===0){
      returnToStory();
      return;
    }
    const next=active+direction;
    if(next<0||next>=panels.length)return;
    active=next;
    transitionLocked=true;
    renderCoffee();
    setTimeout(()=>{transitionLocked=false},LOCK);
  }

  function wheelDirection(e){
    if(Math.abs(e.deltaY)<2)return 0;
    clearTimeout(wheelGestureTimer);
    wheelGestureTimer=setTimeout(()=>{wheelGestureActive=false},170);
    if(wheelGestureActive)return 0;
    wheelGestureActive=true;
    return e.deltaY>0?1:-1;
  }

  function onWheel(e){
    if(detailOpen)return;
    if(!coffeeStarted)return;
    e.preventDefault();
    const direction=wheelDirection(e);
    if(!direction)return;
    stepCoffee(direction);
  }

  let scrollTicking=false;
  function onScroll(){
    if(coffeeStarted||detailOpen||scrollTicking)return;
    scrollTicking=true;
    requestAnimationFrame(()=>{
      renderIntro();
      if(scrollProgress()>=.76)startCoffee();
      scrollTicking=false;
    });
  }

  function animateVertical(before,done){
    const items=[brazilProduct,brazilCopy];
    const animations=[];
    items.forEach((el,index)=>{
      if(!el||!before[index])return;
      const after=el.getBoundingClientRect();
      const dy=before[index].top-after.top;
      if(Math.abs(dy)<1)return;
      animations.push(el.animate([{translate:`0 ${dy}px`},{translate:'0 0'}],{duration:MORPH,easing:EASE,fill:'both'}));
    });
    Promise.all(animations.map(animation=>animation.finished.catch(()=>{}))).then(()=>{
      animations.forEach(animation=>animation.cancel());
      done?.();
    });
  }

  function afterLayout(callback){requestAnimationFrame(()=>requestAnimationFrame(callback))}

  function collapseBrazilDescription(collapsed){
    if(!brazilDescription)return;
    brazilDescription.style.transition=`opacity ${MORPH}ms ${EASE},transform ${MORPH}ms ${EASE},max-height ${MORPH}ms ${EASE},margin ${MORPH}ms ${EASE}`;
    if(collapsed){
      brazilDescription.style.maxHeight='0px';
      brazilDescription.style.marginTop='0px';
      brazilDescription.style.opacity='0';
      brazilDescription.style.transform='translateY(-28px)';
      brazilDescription.style.overflow='hidden';
    }else{
      brazilDescription.style.maxHeight='220px';
      brazilDescription.style.marginTop='24px';
      brazilDescription.style.opacity='1';
      brazilDescription.style.transform='translateY(0)';
      brazilDescription.style.overflow='hidden';
    }
  }

  function openProductDetail(e){
    e?.preventDefault();
    if(detailOpen||!coffeeStarted||active!==0)return;
    const before=[brazilProduct.getBoundingClientRect(),brazilCopy.getBoundingClientRect()];
    detailOpen=true;
    document.body.classList.add('detail-open');
    brazil.classList.add('is-detail');
    brazil.style.opacity='1';
    brazil.style.filter='blur(0)';
    brazil.style.transform='translateX(0)';

    setTransition(brazilProduct,false);
    setTransition(brazilCopy,false);
    brazilProduct.style.opacity='1';
    brazilProduct.style.filter='blur(0)';
    brazilProduct.style.transform='translateX(-50%)';
    brazilCopy.style.opacity='1';
    brazilCopy.style.filter='blur(0)';
    brazilCopy.style.transform='none';

    if(innerWidth>840){
      brazilCopy.style.top='0';
      brazilCopy.style.height='100svh';
      brazilCopy.style.paddingTop='32px';
      brazilCopy.style.paddingBottom='32px';
    }

    afterLayout(()=>{
      animateVertical(before);
      requestAnimationFrame(()=>collapseBrazilDescription(true));
    });
  }

  function closeProductDetail(){
    if(!detailOpen)return;
    const before=[brazilProduct.getBoundingClientRect(),brazilCopy.getBoundingClientRect()];
    detailOpen=false;
    collapseBrazilDescription(false);
    document.body.classList.remove('detail-open');

    brazilCopy.style.top='';
    brazilCopy.style.height='';
    brazilCopy.style.paddingTop='';
    brazilCopy.style.paddingBottom='';
    brazil.classList.remove('is-detail');

    prepareCoffeeChildren();
    afterLayout(()=>{
      animateVertical(before,()=>{
        setTransition(brazilProduct,true);
        setTransition(brazilCopy,true);
        setTimeout(()=>{
          if(!brazilDescription)return;
          brazilDescription.style.transition='';
          brazilDescription.style.maxHeight='';
          brazilDescription.style.marginTop='';
          brazilDescription.style.opacity='';
          brazilDescription.style.transform='';
          brazilDescription.style.overflow='';
        },80);
      });
    });
  }

  const purchaseCards=[...document.querySelectorAll('[data-purchase-card]')];
  const bagOptions=[...document.querySelectorAll('.bag-option')];
  const grindOptions=[...document.querySelectorAll('.choice-tab')];
  const subscribeOriginal=document.querySelector('[data-subscribe-original]');
  const subscribePrice=document.querySelector('[data-subscribe-price]');
  const oneTimePrice=document.querySelector('[data-one-time-price]');
  const cartTotal=document.querySelector('[data-cart-total]');
  const qtyLabel=document.querySelector('[data-qty]');

  let purchaseMode='subscribe';
  let bagCount=1;
  let discount=10;
  let qty=1;
  const money=value=>`$${value.toFixed(2)}`;

  function updatePurchase(){
    const original=20*bagCount;
    const subscription=original*(1-discount/100);
    const unit=purchaseMode==='subscribe'?subscription:original;
    const total=unit*qty;
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
    const src=PRODUCT_IMAGES.brazil[button.dataset.grind];
    if(brazilImage&&src)brazilImage.src=src;
  }));

  document.querySelector('[data-qty-minus]')?.addEventListener('click',()=>{
    qty=Math.max(1,qty-1);
    updatePurchase();
  });
  document.querySelector('[data-qty-plus]')?.addEventListener('click',()=>{
    qty+=1;
    updatePurchase();
  });

  document.querySelector('[data-open-product]')?.addEventListener('click',openProductDetail);
  document.querySelector('[data-close-product]')?.addEventListener('click',closeProductDetail);
  document.querySelectorAll('.product-copy__details:not([data-open-product])').forEach(link=>link.addEventListener('click',e=>e.preventDefault()));

  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('wheel',onWheel,{passive:false});
  addEventListener('resize',()=>{
    positionScrollCue();
    if(coffeeStarted&&!detailOpen)renderCoffee();
    else if(!coffeeStarted)renderIntro();
  });
  addEventListener('keydown',e=>{
    if(detailOpen){
      if(e.key==='Escape')closeProductDetail();
      return;
    }
    if(!coffeeStarted)return;
    if(e.key==='ArrowDown'||e.key==='PageDown'){
      e.preventDefault();
      stepCoffee(1);
    }
    if(e.key==='ArrowUp'||e.key==='PageUp'){
      e.preventDefault();
      stepCoffee(-1);
    }
  });

  history.scrollRestoration='manual';
  loadImages();
  updatePurchase();
  positionScrollCue();
  setBg(INTRO);
  hideCoffeePanels();
  scrollTo(0,0);
  renderIntro();
  document.fonts?.ready.then(positionScrollCue);
})();