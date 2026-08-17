from pathlib import Path
import re

HEADER_VAR='var(--site-header-height)'

# site shell: one source of truth for fixed header height
p=Path('site-shell.css'); s=p.read_text()
s=s.replace(':root{--site-container:1600px;--site-gutter:clamp(24px,3vw,48px)}', ':root{--site-container:1600px;--site-gutter:clamp(24px,3vw,48px);--site-header-height:102px}')
s=s.replace('@media(max-width:900px){\n  .site-announcement', '@media(max-width:900px){\n  :root{--site-header-height:92px}\n  .site-announcement')
p.write_text(s)

# shared coffee/text layout
p=Path('style.css'); s=p.read_text()
if '--site-header-height:' not in s:
    s=s.replace('  --site-gutter:clamp(24px,3vw,48px);', '  --site-gutter:clamp(24px,3vw,48px);\n  --site-header-height:102px;')
s=s.replace('.landing{width:100%}', '.landing{width:100%;padding-top:var(--site-header-height)}')
s=s.replace('.section{position:relative;width:100%;height:100dvh;min-height:100svh;', '.section{position:relative;width:100%;height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height));')
s=s.replace('.coffee-sticky{position:sticky;top:0;width:100%;height:100dvh;min-height:100svh;', '.coffee-sticky{position:sticky;top:var(--site-header-height);width:100%;height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height));')
s=s.replace('.coffee-track{display:flex;width:600vw;height:100dvh;min-height:100svh;', '.coffee-track{display:flex;width:600vw;height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height));')
s=s.replace('.coffee-slide{--accent:#4D6E48;position:relative;flex:0 0 100vw;width:100vw;height:100dvh;min-height:100svh;', '.coffee-slide{--accent:#4D6E48;position:relative;flex:0 0 100vw;width:100vw;height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height));')
# details should also stay inside the frame below navigation
s=s.replace('height:100dvh;min-height:100svh', 'height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height))')
# restore loader/body unrelated accidental replacements if any (none expected)
# mobile header variable mirrors shell
if '@media(max-width:900px){:root{--site-header-height:92px}' not in s:
    s += '\n@media(max-width:900px){:root{--site-header-height:92px}}\n'
p.write_text(s)

# olive/honey sticky and slide frames below header
for filename, prefix in [('olive.css','olive'),('honey.css','honey')]:
    p=Path(filename); s=p.read_text()
    s=s.replace(f'.{prefix}-sticky{{position:sticky;top:0;width:100%;height:100dvh;min-height:100svh;', f'.{prefix}-sticky{{position:sticky;top:var(--site-header-height);width:100%;height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height));')
    s=s.replace(f'.{prefix}-track{{display:flex;width:200vw;height:100dvh;min-height:100svh;', f'.{prefix}-track{{display:flex;width:200vw;height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height));')
    # slide declaration contains other vars before position
    s=s.replace('width:100vw;height:100dvh;min-height:100svh;', 'width:100vw;height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height));',1)
    s=s.replace('height:100dvh;min-height:100svh', 'height:calc(100dvh - var(--site-header-height));min-height:calc(100svh - var(--site-header-height))')
    p.write_text(s)

# JS metrics: sticky starts when section top reaches header bottom; travel uses actual sticky height
p=Path('app.js'); s=p.read_text()
s=s.replace("  function sectionMetrics(){\n    const start=coffeeSection.offsetTop;\n    const distance=Math.max(coffeeSection.offsetHeight-innerHeight,1);\n    return {start,distance};\n  }", "  function sectionMetrics(){\n    const sticky=coffeeSection.querySelector('.coffee-sticky');\n    const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'))||0;\n    const start=coffeeSection.offsetTop-header;\n    const distance=Math.max(coffeeSection.offsetHeight-(sticky?.offsetHeight||innerHeight),1);\n    return {start,distance};\n  }")
p.write_text(s)

p=Path('olive.js'); s=p.read_text()
s=s.replace("  function metrics(){const start=section.offsetTop;const distance=Math.max(section.offsetHeight-innerHeight,1);return{start,distance}}", "  function metrics(){const sticky=section.querySelector('.olive-sticky');const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'))||0;const start=section.offsetTop-header;const distance=Math.max(section.offsetHeight-(sticky?.offsetHeight||innerHeight),1);return{start,distance}}")
p.write_text(s)

p=Path('honey.js'); s=p.read_text()
s=s.replace("  function metrics(){\n    const start=section.offsetTop;\n    const distance=Math.max(section.offsetHeight-innerHeight,1);\n    return{start,distance};\n  }", "  function metrics(){\n    const sticky=section.querySelector('.honey-sticky');\n    const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'))||0;\n    const start=section.offsetTop-header;\n    const distance=Math.max(section.offsetHeight-(sticky?.offsetHeight||innerHeight),1);\n    return{start,distance};\n  }")
p.write_text(s)

# cache bust
p=Path('index.html'); s=p.read_text()
for name in ['style.css','olive.css','honey.css','site-shell.css','app.js','olive.js','honey.js']:
    s=re.sub(re.escape(name)+r'\?v=\d+',name+'?v=202608171520',s)
p.write_text(s)
