from pathlib import Path
import re

p=Path('app.js')
s=p.read_text()

s=s.replace("let scene=0,locked=false,detailOpen=false,detailIndex=0,wheelReady=true,wheelTimer=null,touchStartY=null;",
            "let scene=0,coffeeIndex=0,locked=false,detailOpen=false,detailIndex=0,wheelReady=true,wheelTimer=null,touchStartY=null;",1)

s=re.sub(r"  function setCoffee\(index,position\)\{.*?\n  \}", """  function setCoffee(index,position){
    const {panel,product,copy}=items[index],active=position==='active';
    panel.style.display='block';panel.style.visibility='visible';panel.style.pointerEvents=active?'auto':'none';panel.style.zIndex=active?'6':'5';
    panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform=active?'translateX(0)':position==='before'?'translateX(-100vw)':'translateX(100vw)';
    if(product){product.style.visibility='visible';product.style.opacity='1';product.style.filter='blur(0)';product.style.transform=productTarget()}
    if(copy){copy.style.visibility='visible';copy.style.opacity='1';copy.style.filter='blur(0)';copy.style.transform=copyTarget()}
  }""", s, count=1, flags=re.S)

s=re.sub(r"  function goToScene\(next\)\{.*?\n  \}\n\n  function syncSceneFromScroll\(\)\{.*?\n  \}", """  function goToScene(next){
    if(detailOpen||next<0||next>2||next===scene)return;
    const previous=scene,direction=next>previous?1:-1;scene=next;
    if(next===0){
      hideStory(-1);panels.forEach((_,i)=>setCoffee(i,'after'));setBg(INTRO);placeHero('above');setTimeout(showHero,180);
    }else if(next===1){
      hideHero(direction);panels.forEach((_,i)=>setCoffee(i,'after'));setBg(INTRO);placeStory(direction);setTimeout(showStory,260);
    }else{
      hideHero(direction);hideStory(1);setTimeout(()=>renderCoffee(coffeeIndex),260);
    }
  }

  function syncSceneFromScroll(){
    if(detailOpen)return;
    const next=Math.max(0,Math.min(2,Math.round(window.scrollY/Math.max(window.innerHeight,1))));
    if(next!==scene)goToScene(next);
  }

  function moveCoffee(direction){
    if(detailOpen||scene!==2||locked)return false;
    const next=coffeeIndex+direction;
    if(next<0||next>=panels.length)return false;
    locked=true;coffeeIndex=next;renderCoffee(coffeeIndex);
    setTimeout(()=>locked=false,520);
    return true;
  }

  function onCoffeeWheel(e){
    if(detailOpen||scene!==2)return;
    const amount=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    if(Math.abs(amount)<4)return;
    const direction=amount>0?1:-1;
    if((direction<0&&coffeeIndex===0)||(direction>0&&coffeeIndex===panels.length-1))return;
    e.preventDefault();
    moveCoffee(direction);
  }""", s, count=1, flags=re.S)

s=s.replace("const requested=Number(e?.currentTarget?.dataset.openProduct),index=Number.isInteger(requested)?requested:Math.max(0,scene-2);if(detailOpen||scene!==index+2)return;",
            "const requested=Number(e?.currentTarget?.dataset.openProduct),index=Number.isInteger(requested)?requested:coffeeIndex;if(detailOpen||scene!==2||index!==coffeeIndex)return;",1)

s=s.replace("const index=detailOpen?detailIndex:Math.max(0,scene-2);",
            "const index=detailOpen?detailIndex:coffeeIndex;",1)

s=s.replace("  addEventListener('scroll',syncSceneFromScroll,{passive:true});",
            "  addEventListener('scroll',syncSceneFromScroll,{passive:true});\n  document.addEventListener('wheel',onCoffeeWheel,{passive:false,capture:true});",1)

s=s.replace("for(let i=0;i<panels.length+2;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",
            "for(let i=0;i<3;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",1)

s=s.replace("requestAnimationFrame(syncSceneFromScroll);",
            "requestAnimationFrame(()=>{syncSceneFromScroll();if(scene===2)renderCoffee(coffeeIndex)});",1)

p.write_text(s)

css=Path('style.css')
c=css.read_text()
# Coffee panels move as full viewport horizontal slides; keep content layout inside unchanged.
if '.coffee-panel{position:absolute;inset:0;z-index:2;opacity:0;color:#fff}' in c:
    c=c.replace('.coffee-panel{position:absolute;inset:0;z-index:2;opacity:0;color:#fff}',
                '.coffee-panel{position:absolute;inset:0;z-index:2;opacity:0;color:#fff;will-change:transform}',1)
css.write_text(c)
