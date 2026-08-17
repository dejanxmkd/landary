(()=>{
  const loader=document.querySelector('[data-site-loader]');
  const loaderLogo=document.querySelector('[data-loader-logo]');
  const counter=document.querySelector('[data-loader-counter]');
  const navTarget=document.querySelector('[data-nav-logo-target]');
  if(!loader||!loaderLogo||!counter||!navTarget){document.body.classList.remove('is-loading');document.body.classList.add('site-ready');return}

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countDuration=reduced?450:3000;
  const moveDuration=reduced?220:650;
  let started=performance.now();

  const tick=now=>{
    const t=Math.min(1,(now-started)/countDuration);
    const eased=1-Math.pow(1-t,3);
    counter.textContent=`${Math.round(eased*100)}%`;
    if(t<1){requestAnimationFrame(tick);return}
    counter.textContent='100%';
    setTimeout(moveLogo,reduced?30:120);
  };

  function moveLogo(){
    loader.classList.add('is-moving');
    const from=loaderLogo.getBoundingClientRect();
    const to=navTarget.getBoundingClientRect();
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
      document.body.classList.add('site-ready');
      loader.classList.add('is-complete');
      setTimeout(()=>{
        document.body.classList.remove('is-loading');
        loader.hidden=true;
      },reduced?40:440);
    },{once:true});
  }

  requestAnimationFrame(tick);
})();
