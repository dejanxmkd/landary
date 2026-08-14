from pathlib import Path

app=Path('app.js')
s=app.read_text()

old="""    if(next===0){
      hideStory(-1);setBg(INTRO);placeHero('above');setTimeout(showHero,180);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';
    }else if(next===1){
      hideHero(direction);setBg(INTRO);placeStory(direction);setTimeout(showStory,260);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';
    }else{
      hideHero(direction);hideStory(1);coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';
      const nextCoffee=Math.max(0,Math.min(panels.length-1,next-2));
      renderCoffee(nextCoffee);
      coffeeTrack.scrollTo({left:nextCoffee*innerWidth,top:0,behavior:'smooth'});
    }"""
new="""    if(next===0){
      hideStory(-1);setBg(INTRO);placeHero('above');setTimeout(showHero,180);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';coffeeTrack.style.filter='blur(12px)';coffeeTrack.style.transform='translateY(12vh) scale(.985)';
    }else if(next===1){
      hideHero(direction);setBg(INTRO);placeStory(direction);setTimeout(showStory,260);coffeeTrack.style.pointerEvents='none';coffeeTrack.style.opacity='0';coffeeTrack.style.filter='blur(12px)';coffeeTrack.style.transform=direction<0?'translateY(12vh) scale(.985)':'translateY(12vh) scale(.985)';
    }else{
      hideHero(direction);hideStory(1);
      const nextCoffee=Math.max(0,Math.min(panels.length-1,next-2));
      renderCoffee(nextCoffee);
      coffeeTrack.scrollLeft=nextCoffee*innerWidth;
      coffeeTrack.style.pointerEvents='auto';
      coffeeTrack.style.opacity='1';
      coffeeTrack.style.filter='blur(0)';
      coffeeTrack.style.transform='translateY(0) scale(1)';
    }"""
if old not in s:
    raise SystemExit('goToScene transition block not found')
s=s.replace(old,new,1)

old_init="coffeeTrack.style.opacity='0';coffeeTrack.style.pointerEvents='none';requestAnimationFrame(()=>{syncSceneFromScroll();if(scene===2){coffeeTrack.style.opacity='1';coffeeTrack.style.pointerEvents='auto';renderCoffee(coffeeIndex)}});"
new_init="coffeeTrack.style.opacity='0';coffeeTrack.style.filter='blur(12px)';coffeeTrack.style.transform='translateY(12vh) scale(.985)';coffeeTrack.style.pointerEvents='none';requestAnimationFrame(()=>{syncSceneFromScroll();if(scene>=2){coffeeTrack.style.opacity='1';coffeeTrack.style.filter='blur(0)';coffeeTrack.style.transform='translateY(0) scale(1)';coffeeTrack.style.pointerEvents='auto';renderCoffee(coffeeIndex)}});"
if old_init in s:
    s=s.replace(old_init,new_init,1)
app.write_text(s)

css=Path('style.css')
c=css.read_text()
old_css="transition:opacity .55s ease"
new_css="transition:transform 1380ms cubic-bezier(.16,1,.3,1),opacity 1380ms cubic-bezier(.16,1,.3,1),filter 1380ms cubic-bezier(.16,1,.3,1)"
if old_css not in c:
    raise SystemExit('coffee track transition not found')
c=c.replace(old_css,new_css,1)
css.write_text(c)
