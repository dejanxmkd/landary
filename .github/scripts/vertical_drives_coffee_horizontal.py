from pathlib import Path
import re

p=Path('app.js')
s=p.read_text()

# Restore scene range to Hero + Story + one scene per coffee.
s=s.replace("if(detailOpen||next<0||next>2||next===scene)return;", "if(detailOpen||next<0||next>panels.length+1||next===scene)return;", 1)

# Replace scene navigation so coffee scenes stay in one pinned visual area while index changes horizontally.
pattern=r"  function goToScene\(next\)\{.*?\n  \}\n\n  function syncSceneFromScroll\(\)\{.*?\n  \}"
replacement="""  function goToScene(next){
    if(detailOpen||next<0||next>panels.length+1||next===scene)return;
    const previous=scene,direction=next>previous?1:-1;scene=next;
    if(next===0){
      hideStory(-1);setBg(INTRO);placeHero('above');setTimeout(showHero,180);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';
    }else if(next===1){
      hideHero(direction);setBg(INTRO);placeStory(direction);setTimeout(showStory,260);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';
    }else{
      hideHero(direction);hideStory(1);coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';
      const nextCoffee=Math.max(0,Math.min(panels.length-1,next-2));
      renderCoffee(nextCoffee);
      coffeeTrack.scrollTo({left:nextCoffee*innerWidth,top:0,behavior:'smooth'});
    }
  }

  function syncSceneFromScroll(){
    if(detailOpen)return;
    const vh=Math.max(window.innerHeight,1);
    const maxScene=panels.length+1;
    const next=Math.max(0,Math.min(maxScene,Math.round(window.scrollY/vh)));
    if(next!==scene)goToScene(next);
  }"""
s2,n=re.subn(pattern,replacement,s,count=1,flags=re.S)
if n!=1:
    raise SystemExit('scene block patch failed')
s=s2

# Details are valid for whichever coffee scene is active.
s=s.replace("if(detailOpen||scene!==2||index!==coffeeIndex)return;", "if(detailOpen||scene<2||index!==coffeeIndex)return;", 1)

# Horizontal track is controlled only by vertical page scroll; remove its own scroll listener.
s=re.sub(r"\n  coffeeTrack\.addEventListener\('scroll',\(\)=>\{.*?\n  \},\{passive:true\}\);", "", s, count=1, flags=re.S)

# Create one vertical stop for Hero, Story and every coffee.
s=s.replace("for(let i=0;i<3;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",
            "for(let i=0;i<panels.length+2;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}",1)

# Init must restore the horizontal position when page restores scroll.
s=s.replace("coffeeTrack.style.opacity='0';coffeeTrack.style.pointerEvents='none';requestAnimationFrame(()=>{syncSceneFromScroll();if(scene===2){coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';renderCoffee(coffeeIndex)}});",
            "coffeeTrack.style.opacity='0';coffeeTrack.style.pointerEvents='none';requestAnimationFrame(()=>{syncSceneFromScroll();if(scene>=2){coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';const i=Math.max(0,scene-2);renderCoffee(i);coffeeTrack.scrollLeft=i*innerWidth}});",1)

p.write_text(s)

css=Path('style.css')
c=css.read_text()
# Prevent direct horizontal scrolling/swiping; vertical page scroll owns navigation.
c=c.replace("overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-behavior:smooth;overscroll-behavior-x:contain;",
            "overflow-x:hidden;overflow-y:hidden;scroll-behavior:smooth;overscroll-behavior:contain;",1)
css.write_text(c)
