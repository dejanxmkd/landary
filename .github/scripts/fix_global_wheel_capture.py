from pathlib import Path
p=Path('app.js')
s=p.read_text()
old="  addEventListener('wheel',onWheel,{passive:false});"
new="  document.addEventListener('wheel',onWheel,{passive:false,capture:true});"
if old not in s:
    raise SystemExit('wheel listener not found')
s=s.replace(old,new,1)
p.write_text(s)
