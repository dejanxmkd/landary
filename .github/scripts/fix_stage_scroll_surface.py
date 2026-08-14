from pathlib import Path

js=Path('app.js')
s=js.read_text()
s=s.replace("  document.addEventListener('wheel',onWheel,{passive:false,capture:true});\n  addEventListener('touchstart',onTouchStart,{passive:true});\n  addEventListener('touchend',onTouchEnd,{passive:true});",
            "  stage.addEventListener('wheel',onWheel,{passive:false,capture:true});\n  stage.addEventListener('touchstart',onTouchStart,{passive:true,capture:true});\n  stage.addEventListener('touchend',onTouchEnd,{passive:true,capture:true});",1)
if "stage.addEventListener('wheel',onWheel" not in s:
    raise SystemExit('stage wheel listener patch failed')
js.write_text(s)

css=Path('style.css')
c=css.read_text()
old='.stage{position:fixed;inset:0;overflow:hidden;background:var(--bg)}'
new='.stage{position:fixed;inset:0;width:100vw;height:100svh;overflow:hidden;background:var(--bg);pointer-events:auto;touch-action:none}'
if old not in c:
    raise SystemExit('stage css block not found')
c=c.replace(old,new,1)
css.write_text(c)
