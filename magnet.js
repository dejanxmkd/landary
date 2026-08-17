(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer=0;
  let snapping=false;
  let releaseTimer=0;

  const headerHeight=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'))||0;

  function productStops(sectionSelector,stickySelector,slideSelector){
    const section=document.querySelector(sectionSelector);
    if(!section)return[];
    const sticky=section.querySelector(stickySelector);
    const count=section.querySelectorAll(slideSelector).length;
    if(!sticky||count<1)return[];
    const start=section.offsetTop-headerHeight();
    if(count===1)return[start];
    const distance=Math.max(section.offsetHeight-sticky.offsetHeight,0);
    return Array.from({length:count},(_,index)=>start+distance*(index/(count-1)));
  }

  function stops(){
    const points=[...document.querySelectorAll('.landing > .section')].map(section=>section.offsetTop-headerHeight());
    points.push(...productStops('#coffee-scroll','.coffee-sticky','.coffee-slide'));
    points.push(...productStops('#olive-scroll','.olive-sticky','.olive-slide'));
    points.push(...productStops('#honey-scroll','.honey-sticky','.honey-slide'));
    return [...new Set(points.map(value=>Math.max(0,Math.round(value))))].sort((a,b)=>a-b);
  }

  function nearestStop(){
    if(document.body.classList.contains('is-loading')||document.body.classList.contains('details-open'))return;
    const points=stops();
    if(!points.length)return;
    const y=scrollY;
    let target=points[0];
    let best=Math.abs(target-y);
    for(let i=1;i<points.length;i++){
      const distance=Math.abs(points[i]-y);
      if(distance<best){best=distance;target=points[i]}
    }
    if(best<2)return;
    snapping=true;
    scrollTo({top:target,behavior:reduced?'auto':'smooth'});
    clearTimeout(releaseTimer);
    releaseTimer=setTimeout(()=>{snapping=false},reduced?80:520);
  }

  addEventListener('scroll',()=>{
    if(snapping)return;
    clearTimeout(timer);
    timer=setTimeout(nearestStop,110);
  },{passive:true});

  addEventListener('resize',()=>{clearTimeout(timer)},{passive:true});
})();
