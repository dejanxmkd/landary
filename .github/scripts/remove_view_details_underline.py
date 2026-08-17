from pathlib import Path

style=Path('style.css')
s=style.read_text()
old=".view-details{display:inline-block;margin-top:30px;font-size:18px;line-height:1.65;font-weight:500;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px;text-decoration-color:rgba(61,88,37,.72);transition:opacity .25s ease}"
new=".view-details{display:inline-block;margin-top:30px;font-size:18px;line-height:1.65;font-weight:500;text-decoration:none;transition:opacity .25s ease}"
if old not in s:
    raise SystemExit('view-details style not found')
style.write_text(s.replace(old,new))

index=Path('index.html')
s=index.read_text().replace('style.css?v=202608171433','style.css?v=202608171435')
index.write_text(s)
