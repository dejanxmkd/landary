from pathlib import Path
p=Path('app.js')
s=p.read_text()
old="    return stops.sort((a,b)=>a.y-b.y);"
new="    if(typeof window.__oliveSnapStops==='function')stops.push(...window.__oliveSnapStops());\n    return stops.sort((a,b)=>a.y-b.y);"
if old not in s: raise SystemExit('globalStops return not found')
s=s.replace(old,new,1)
old="    if(detailIndex>=0||snapping)return;"
new="    if(detailIndex>=0||window.__oliveDetailOpen||snapping)return;"
if old not in s: raise SystemExit('snap guard not found')
s=s.replace(old,new,1)
old="    if(detailIndex>=0)return;\n    renderHorizontal();"
new="    if(detailIndex>=0||window.__oliveDetailOpen)return;\n    renderHorizontal();"
if old not in s: raise SystemExit('scroll guard not found')
s=s.replace(old,new,1)
p.write_text(s)
