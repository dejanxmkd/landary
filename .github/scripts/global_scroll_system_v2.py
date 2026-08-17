from pathlib import Path

js=Path('app.js')
s=js.read_text()
start=s.index("  const coffeeSticky=coffeeSection.querySelector('.coffee-sticky');")
end=s.index("\n\n  function renderCarousel", start)
new_block="""  let detailIndex=-1;
  let snapTimer=0;
  let snapping=false;

  const WHITE=[255,255,255];
  const productColors=PRODUCTS.map(product=>{
    const hex=product.color.replace('#','');
    return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];
  });

  function sectionMetrics(){
    const start=coffeeSection.offsetTop;
    const distance=Math.max(coffeeSection.offsetHeight-innerHeight,1);
    return{start,distance};
  }

  function globalStops(){
    const hero=document.querySelector('.section--hero');
    const story=document.querySelector('.section--story');
    const oliveIntro=document.querySelector('.section--olive-intro');
    const oliveStory=document.querySelector('.section--olive-story');
    const{start,distance}=sectionMetrics();
    const coffeeStep=distance/(PRODUCTS.length-1);
    const stops=[];
    if(hero)stops.push({y:hero.offsetTop,color:WHITE});
    if(story)stops.push({y:story.offsetTop,color:WHITE});
    PRODUCTS.forEach((_,index)=>stops.push({y:start+coffeeStep*index,color:productColors[index]}));
    if(oliveIntro)stops.push({y:oliveIntro.offsetTop,color:WHITE});
    if(oliveStory)stops.push({y:oliveStory.offsetTop,color:WHITE});
    return stops.sort((a,b)=>a.y-b.y);
  }

  function renderBackground(){
    const stops=globalStops();
    if(!stops.length)return;
    const y=scrollY;
    if(y<=stops[0].y){document.body.style.backgroundColor='rgb(255 255 255)';return}
    const last=stops[stops.length-1];
    if(y>=last.y){document.body.style.backgroundColor=`rgb(${last.color[0]} ${last.color[1]} ${last.color[2]})`;return}
    let from=stops[0],to=stops[1];
    for(let i=0;i<stops.length-1;i++){
      if(y>=stops[i].y&&y<=stops[i+1].y){from=stops[i];to=stops[i+1];break}
    }
    const span=Math.max(to.y-from.y,1);
    const mix=Math.max(0,Math.min(1,(y-from.y)/span));
    const r=Math.round(from.color[0]+(to.color[0]-from.color[0])*mix);
    const g=Math.round(from.color[1]+(to.color[1]-from.color[1])*mix);
    const b=Math.round(from.color[2]+(to.color[2]-from.color[2])*mix);
    document.body.style.backgroundColor=`rgb(${r} ${g} ${b})`;
  }

  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;
  }

  function snapToNearest(){
    if(detailIndex>=0||snapping)return;
    const stops=globalStops();
    if(!stops.length)return;
    let target=stops[0].y;
    let nearest=Math.abs(scrollY-target);
    for(let i=1;i<stops.length;i++){
      const distance=Math.abs(scrollY-stops[i].y);
      if(distance<nearest){nearest=distance;target=stops[i].y}
    }
    if(Math.abs(scrollY-target)<3)return;
    snapping=true;
    scrollTo({top:target,behavior:'smooth'});
    setTimeout(()=>{snapping=false},650);
  }

  function onScroll(){
    if(detailIndex>=0)return;
    renderHorizontal();
    renderBackground();
    clearTimeout(snapTimer);
    snapTimer=setTimeout(snapToNearest,140);
  }"""
s=s[:start]+new_block+s[end:]
s=s.replace("addEventListener('resize',()=>{if(detailIndex<0)renderHorizontal()});","addEventListener('resize',()=>{if(detailIndex<0){renderHorizontal();renderBackground()}});",1)
s=s.replace("requestAnimationFrame(renderHorizontal);\n})();","requestAnimationFrame(()=>{renderHorizontal();renderBackground()});\n})();",1)
js.write_text(s)

css=Path('style.css')
c=css.read_text()
c=c.replace("body{margin:0;background:var(--intro);color:var(--text);font-family:var(--font-body);overflow-x:hidden}","body{margin:0;background:#fff;color:var(--text);font-family:var(--font-body);overflow-x:hidden}",1)
c=c.replace(".section{position:relative;width:100%;height:100dvh;min-height:100svh;display:grid;place-items:center;padding:var(--page-inline);background:var(--intro-light);color:var(--intro);overflow:hidden}",".section{position:relative;width:100%;height:100dvh;min-height:100svh;display:grid;place-items:center;padding:var(--page-inline);background:transparent;color:var(--intro);overflow:hidden}",1)
c=c.replace(".coffee-sticky{position:sticky;top:0;width:100%;height:100dvh;min-height:100svh;overflow:hidden;background:#4D6E48}",".coffee-sticky{position:sticky;top:0;width:100%;height:100dvh;min-height:100svh;overflow:hidden;background:transparent}",1)
css.write_text(c)
