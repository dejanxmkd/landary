from pathlib import Path
import re

p=Path('app.js')
s=p.read_text()

# Only three vertical scenes: Hero, Story, Coffee area.
s=s.replace("if(detailOpen||next<0||next>panels.length+1||next===scene)return;",
            "if(detailOpen||next<0||next>2||next===scene)return;",1)
s=s.replace("    const maxScene=panels.length+1;\n    const next=Math.max(0,Math.min(maxScene,Math.round(window.scrollY/vh)));",
            "    const next=Math.max(0,Math.min(2,Math.round(window.scrollY/vh)));",1)

# Coffee scene always renders the current horizontal coffee, not a vertical scene-derived index.
old_else="""    }else{
      hideHero(direction);hideStory(1);
      const nextCoffee=Math.max(0,Math.min(panels.length-1,next-2));
      renderCoffee(nextCoffee);
      coffeeTrack.scrollLeft=nextCoffee*innerWidth;
      coffeeTrack.style.pointerEvents='auto';
      coffeeTrack.style.opacity='1';
      coffeeTrack.style.filter='blur(0)';
      coffeeTrack.style.transform='translateY(0) scale(1)';
    }"""
new_else="""    }else{
      hideHero(direction);hideStory(1);
      renderCoffee(coffeeIndex);
      coffeeTrack.scrollLeft=coffeeIndex*innerWidth;
      coffeeTrack.style.pointerEvents='auto';
      coffeeTrack.style.opacity='1';
      coffeeTrack.style.filter='blur(0)';
      coffeeTrack.style.transform='translateY(0) scale(1)';
    }"""
if old_else not in s:
    raise SystemExit('coffee scene block not found')
s=s.replace(old_else,new_else,1)

# Add wheel navigation for the full Coffee area. A normal vertical wheel advances horizontal sections.
anchor="""  if(coffeeParent){coffeeParent.insertBefore(coffeeTrack,panels[0]);panels.forEach(panel=>{panel.classList.add('coffee-horizontal-section');coffeeTrack.appendChild(panel)})}

  addEventListener('scroll',syncSceneFromScroll,{passive:true});"""
replacement="""  if(coffeeParent){coffeeParent.insertBefore(coffeeTrack,panels[0]);panels.forEach(panel=>{panel.classList.add('coffee-horizontal-section');coffeeTrack.appendChild(panel)})}

  let coffeeWheelLocked=false;
  function moveCoffeeByWheel(direction){
    if(detailOpen||scene!==2||coffeeWheelLocked)return false;
    const next=coffeeIndex+direction;
    if(next<0||next>=panels.length)return false;
    coffeeWheelLocked=true;
    renderCoffee(next);
    coffeeTrack.scrollTo({left:next*innerWidth,top:0,behavior:'smooth'});
    try{sessionStorage.setItem('giannosCoffeeIndex',String(next))}catch(_){ }
    setTimeout(()=>coffeeWheelLocked=false,650);
    return true;
  }
  function onCoffeeWheel(e){
    if(detailOpen||scene!==2)return;
    const delta=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;
    if(Math.abs(delta)<3)return;
    const direction=delta>0?1:-1;
    if(moveCoffeeByWheel(direction))e.preventDefault();
  }
  document.addEventListener('wheel',onCoffeeWheel,{passive:false,capture:true});

  coffeeTrack.addEventListener('scroll',()=>{
    if(detailOpen||scene!==2)return;
    const next=Math.max(0,Math.min(panels.length-1,Math.round(coffeeTrack.scrollLeft/Math.max(innerWidth,1))));
    if(next!==coffeeIndex){renderCoffee(next);try{sessionStorage.setItem('giannosCoffeeIndex',String(next))}catch(_){ }}
  },{passive:true});

  addEventListener('scroll',syncSceneFromScroll,{passive:true});"""
if anchor not in s:
    raise SystemExit('coffee track/listener anchor not found')
s=s.replace(anchor,replacement,1)

# Exactly three native vertical stops.
s=s.replace("for(let i=0;i<panels.length+2;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",
            "for(let i=0;i<3;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",1)

# Restore last horizontal coffee when refreshing within Coffee area.
old_init="""  loadImages();updatePurchase();setTransitions();resetScene();
  coffeeTrack.style.opacity='0';coffeeTrack.style.pointerEvents='none';requestAnimationFrame(()=>{syncSceneFromScroll();if(scene>=2){coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';const i=Math.max(0,scene-2);renderCoffee(i);coffeeTrack.scrollLeft=i*innerWidth}});"""
new_init="""  loadImages();updatePurchase();setTransitions();resetScene();
  try{const saved=Number(sessionStorage.getItem('giannosCoffeeIndex'));if(Number.isInteger(saved))coffeeIndex=Math.max(0,Math.min(panels.length-1,saved))}catch(_){ }
  coffeeTrack.style.opacity='0';coffeeTrack.style.pointerEvents='none';requestAnimationFrame(()=>{syncSceneFromScroll();if(scene===2){coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';renderCoffee(coffeeIndex);coffeeTrack.scrollLeft=coffeeIndex*innerWidth}});"""
if old_init not in s:
    raise SystemExit('init block not found')
s=s.replace(old_init,new_init,1)

# Resize should keep active coffee rather than deriving it from vertical scene.
s=s.replace("else renderCoffee(scene-2)","else renderCoffee(coffeeIndex)",1)

p.write_text(s)
