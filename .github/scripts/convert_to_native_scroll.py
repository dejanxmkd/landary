from pathlib import Path

app=Path('app.js')
s=app.read_text()

# Remove synthetic wheel/touch navigation helpers.
start=s.find("  function wheelDirection(e){")
end=s.find("\n  function selectedGrind()", start)
if start == -1 or end == -1:
    raise SystemExit('wheel/touch helper block not found')
s=s[:start] + "  function syncSceneFromScroll(){\n    if(detailOpen)return;\n    const maxScene=panels.length+1;\n    const next=Math.max(0,Math.min(maxScene,Math.round(window.scrollY/Math.max(window.innerHeight,1))));\n    if(next!==scene){locked=false;goToScene(next)}\n  }\n\n" + s[end+1:]

# Let native scroll drive transitions without an artificial lock blocking later sections.
s=s.replace("    if(locked||detailOpen||next<0||next>panels.length+1||next===scene)return;\n    locked=true;const previous=scene,direction=next>previous?1:-1;scene=next;",
            "    if(detailOpen||next<0||next>panels.length+1||next===scene)return;\n    const previous=scene,direction=next>previous?1:-1;scene=next;",1)
s=s.replace("    setTimeout(()=>locked=false,LOCK);\n", "", 1)

# Replace synthetic input listeners with native page scroll syncing.
old_listeners="""  stage.addEventListener('wheel',onWheel,{passive:false,capture:true});
  stage.addEventListener('touchstart',onTouchStart,{passive:true,capture:true});
  stage.addEventListener('touchend',onTouchEnd,{passive:true,capture:true});
  addEventListener('keydown',e=>{if(detailOpen){if(e.key==='Escape')closeDetail();return}if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();goToScene(scene+1)}if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();goToScene(scene-1)}});
  addEventListener('resize',()=>{if(detailOpen)return;setTransitions();if(scene===0)showHero();else if(scene===1)showStory();else renderCoffee(scene-2)});

  history.scrollRestoration='manual';main.style.height='100svh';document.body.style.overflow='hidden';document.body.classList.remove('detail-open');panels.forEach(panel=>panel.classList.remove('is-detail'));loadImages();updatePurchase();setTransitions();resetScene();
})();"""
new_listeners="""  addEventListener('scroll',syncSceneFromScroll,{passive:true});
  addEventListener('keydown',e=>{if(detailOpen&&e.key==='Escape')closeDetail()});
  addEventListener('resize',()=>{if(detailOpen)return;syncSceneFromScroll();setTransitions();if(scene===0)showHero();else if(scene===1)showStory();else renderCoffee(scene-2)});

  const scrollTrack=document.createElement('div');
  scrollTrack.className='native-scroll-track';
  for(let i=0;i<panels.length+2;i++){const stop=document.createElement('div');stop.className='native-scroll-stop';stop.setAttribute('aria-hidden','true');scrollTrack.appendChild(stop)}
  main.appendChild(scrollTrack);
  history.scrollRestoration='auto';
  document.body.style.overflowY='auto';
  document.body.style.overflowX='hidden';
  document.body.classList.remove('detail-open');
  panels.forEach(panel=>panel.classList.remove('is-detail'));
  loadImages();updatePurchase();setTransitions();resetScene();
  requestAnimationFrame(syncSceneFromScroll);
})();"""
if old_listeners not in s:
    raise SystemExit('listener/init block not found')
s=s.replace(old_listeners,new_listeners,1)
app.write_text(s)

css=Path('style.css')
c=css.read_text()
c=c.replace("body{margin:0;background:var(--bg);color:var(--text);overflow:hidden;font-family:var(--font-body)}",
            "body{margin:0;background:var(--bg);color:var(--text);overflow-x:hidden;overflow-y:auto;font-family:var(--font-body)}",1)
c=c.replace("main{height:100svh}","main{position:relative;min-height:100svh}",1)
c=c.replace(".stage{position:fixed;inset:0;width:100vw;height:100svh;overflow:hidden;background:var(--bg);pointer-events:auto;touch-action:none}",
            ".stage{position:fixed;inset:0;width:100vw;height:100svh;overflow:hidden;background:var(--bg);pointer-events:auto}",1)
if '.native-scroll-track' not in c:
    c += "\n.native-scroll-track{position:relative;z-index:-1;width:100%;pointer-events:none}.native-scroll-stop{height:100svh;scroll-snap-align:start;scroll-snap-stop:always}html{scroll-snap-type:y mandatory;scroll-behavior:smooth}body.detail-open{overflow:hidden}\n"
css.write_text(c)
