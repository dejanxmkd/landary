from pathlib import Path

files=['app.js','olive.js','honey.js']
old='const targetTop=(innerHeight-collapsedHeight)/2;'
new="const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'))||0;const available=innerHeight-header;const targetTop=header+(available-collapsedHeight)/2;"
for name in files:
    p=Path(name)
    s=p.read_text()
    count=s.count(old)
    if count!=1:
        raise SystemExit(f'{name}: expected 1 targetTop, found {count}')
    p.write_text(s.replace(old,new))
