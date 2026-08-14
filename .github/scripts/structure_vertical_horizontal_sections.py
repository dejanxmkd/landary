from pathlib import Path
import re

p=Path('app.js')
s=p.read_text()

s=s.replace("let scene=0,locked=false,detailOpen=false,detailIndex=0,wheelReady=true,wheelTimer=null,touchStartY=null;",
            "let scene=0,coffeeIndex=0,locked=false,detailOpen=false,detailIndex=0,wheelReady=true,wheelTimer=null,touchStartY=null;",1)

# Coffee panels are real horizontal sections, so do not individually translate them in/out.
s=re.sub(r"  function setCoffee\(index,position\)\{.*?\n  \}", """  function setCoffee(index,position){
    const {panel,product,copy}=items[index],active=position==='active';
    panel.style.display='block';panel.style.visibility='visible';panel.style.pointerEvents=active?'auto':'none';panel.style.zIndex='2';
    panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform='none';
    if(product){product.style.visibility='visible';product.style.opacity='1';product.style.filter='blur(0)';product.style.transform=productTarget()}
    if(copy){copy.style.visibility='visible';copy.style.opacity='1';copy.style.filter='blur(0)';copy.style.transform=copyTarget()}
  }""", s, count=1, flags=re.S)

# renderCoffee only updates active state/background; native horizontal scroll handles movement.
s=re.sub(r"  function renderCoffee\(activeIndex\)\{.*?\}", """  function renderCoffee(activeIndex){
    coffeeIndex=Math.max(0,Math.min(panels.length-1,activeIndex));
    panels.forEach((panel,i)=>{panel.style.pointerEvents=i===coffeeIndex?'auto':'none';panel.classList.toggle('is-active-coffee',i===coffeeIndex)});
    setBg(COLORS[coffeeIndex]);
  }""", s, count=1, flags=re.S)

# Three vertical sections only: Hero, Story, Coffee collection.
s=re.sub(r"  function goToScene\(next\)\{.*?\n  \}\n\n  function syncSceneFromScroll\(\)\{.*?\n  \}", """  function goToScene(next){
    if(detailOpen||next<0||next>2||next===scene)return;
    const previous=scene,direction=next>previous?1:-1;scene=next;
    if(next===0){
      hideStory(-1);setBg(INTRO);placeHero('above');setTimeout(showHero,180);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';
    }else if(next===1){
      hideHero(direction);setBg(INTRO);placeStory(direction);setTimeout(showStory,260);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';
    }else{
      hideHero(direction);hideStory(1);coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';renderCoffee(coffeeIndex);
    }
  }

  function syncSceneFromScroll(){
    if(detailOpen)return;
    const next=Math.max(0,Math.min(2,Math.round(window.scrollY/Math.max(window.innerHeight,1))));
    if(next!==scene)goToScene(next);
  }""", s, count=1, flags=re.S)

# Detail open uses active horizontal coffee index.
s=s.replace("const requested=Number(e?.currentTarget?.dataset.openProduct),index=Number.isInteger(requested)?requested:Math.max(0,scene-2);if(detailOpen||scene!==index+2)return;",
            "const requested=Number(e?.currentTarget?.dataset.openProduct),index=Number.isInteger(requested)?requested:coffeeIndex;if(detailOpen||scene!==2||index!==coffeeIndex)return;",1)
s=s.replace("const index=detailOpen?detailIndex:Math.max(0,scene-2);",
            "const index=detailOpen?detailIndex:coffeeIndex;",1)

# Remove any prior page-scroll listener block insertion assumptions and add horizontal track setup before listeners.
anchor="  document.querySelector('[data-close-product]')?.addEventListener('click',closeDetail);\n"
setup="""  document.querySelector('[data-close-product]')?.addEventListener('click',closeDetail);

  const coffeeTrack=document.createElement('div');
  coffeeTrack.className='coffee-horizontal-track';
  const coffeeParent=panels[0]?.parentElement;
  if(coffeeParent){coffeeParent.insertBefore(coffeeTrack,panels[0]);panels.forEach(panel=>{panel.classList.add('coffee-horizontal-section');coffeeTrack.appendChild(panel)})}
  coffeeTrack.addEventListener('scroll',()=>{
    if(detailOpen)return;
    const next=Math.max(0,Math.min(panels.length-1,Math.round(coffeeTrack.scrollLeft/Math.max(innerWidth,1))));
    if(next!==coffeeIndex)renderCoffee(next);
  },{passive:true});
"""
if anchor not in s:
    raise SystemExit('close-product anchor not found')
s=s.replace(anchor,setup,1)

# Replace native vertical track count with exactly 3 stops and keep only page scroll listener.
s=s.replace("for(let i=0;i<panels.length+2;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",
            "for(let i=0;i<3;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",1)

# Init: track hidden until third vertical section.
s=s.replace("requestAnimationFrame(syncSceneFromScroll);",
            "coffeeTrack.style.opacity='0';coffeeTrack.style.pointerEvents='none';requestAnimationFrame(()=>{syncSceneFromScroll();if(scene===2){coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';renderCoffee(coffeeIndex)}});",1)

p.write_text(s)

css=Path('style.css')
c=css.read_text()

# Override old absolute coffee-panel behavior with real horizontal full-screen sections.
c += """

/* Three vertical sections: Hero, Story, then native horizontal coffee sections */
.coffee-horizontal-track{position:absolute;inset:0;z-index:6;display:flex;width:100vw;height:100svh;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-behavior:smooth;overscroll-behavior-x:contain;transition:opacity .55s ease;-ms-overflow-style:none;scrollbar-width:none}
.coffee-horizontal-track::-webkit-scrollbar{display:none}
.coffee-horizontal-section{position:relative!important;inset:auto!important;flex:0 0 100vw;width:100vw;height:100svh;min-width:100vw;scroll-snap-align:start;scroll-snap-stop:always;opacity:1!important;filter:none!important;transform:none!important;overflow:hidden}
.coffee-horizontal-section .product-gallery{position:absolute;inset:0}
.coffee-horizontal-section .product-copy{pointer-events:auto}
"""
css.write_text(c)
