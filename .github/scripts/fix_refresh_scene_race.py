from pathlib import Path
p=Path('app.js')
s=p.read_text()
old="requestAnimationFrame(()=>requestAnimationFrame(()=>{setTransitions();showHero()}));"
new="requestAnimationFrame(()=>requestAnimationFrame(()=>{setTransitions();if(scene===0)showHero()}));"
if old not in s:
    raise SystemExit('resetScene reveal block not found')
s=s.replace(old,new,1)
p.write_text(s)
