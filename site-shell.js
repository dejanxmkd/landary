(()=>{
  const loader=document.querySelector('[data-site-loader]');
  const loaderLogo=document.querySelector('[data-loader-logo]');
  const counter=document.querySelector('[data-loader-counter]');
  const navTarget=document.querySelector('[data-nav-logo-target]');
  const header=document.querySelector('.site-header');
  if(!loader||!loaderLogo||!counter||!navTarget||!header){document.body.classList.remove('is-loading');document.body.classList.add('site-ready');return}

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countDuration=reduced?450:3000;
  const moveDuration=reduced?220:650;
  const navDuration=reduced?120:720;
  const contentDuration=reduced?120:720;
  let started=performance.now();

  const tick=now=>{
    const t=Math.min(1,(now-started)/countDuration);
    const eased=1-Math.pow(1-t,3);
    counter.textContent=`${Math.round(eased*100)}%`;
    if(t<1){requestAnimationFrame(tick);return}
    counter.textContent='100%';
    setTimeout(moveLogo,reduced?30:120);
  };

  function getFinalTargetRect(){
    header.classList.add('is-measuring');
    const rect=navTarget.getBoundingClientRect();
    header.classList.remove('is-measuring');
    return rect;
  }

  function moveLogo(){
    loader.classList.add('is-moving');
    const from=loaderLogo.getBoundingClientRect();
    const to=getFinalTargetRect();
    const fromCx=from.left+from.width/2;
    const fromCy=from.top+from.height/2;
    const toCx=to.left+to.width/2;
    const toCy=to.top+to.height/2;
    const dx=toCx-fromCx;
    const dy=toCy-fromCy;
    const scale=from.width?to.width/from.width:1;
    const animation=loaderLogo.animate([
      {transform:'translate3d(0,0,0) scale(1)'},
      {transform:`translate3d(${dx}px,${dy}px,0) scale(${scale})`}
    ],{duration:moveDuration,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});

    animation.addEventListener('finish',()=>{
      animation.cancel();
      loaderLogo.removeAttribute('style');
      navTarget.appendChild(loaderLogo);
      revealNavigation();
    },{once:true});
  }

  function revealNavigation(){
    requestAnimationFrame(()=>document.body.classList.add('nav-entering'));
    setTimeout(revealContent,navDuration);
  }

  function revealContent(){
    loader.classList.add('is-complete');
    document.body.classList.add('content-entering');
    setTimeout(()=>{
      document.body.classList.add('site-ready');
      document.body.classList.remove('nav-entering','content-entering','is-loading');
      loader.hidden=true;
    },contentDuration);
  }

  requestAnimationFrame(tick);
})();
