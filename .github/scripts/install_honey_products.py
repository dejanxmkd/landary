from pathlib import Path
import zipfile,re,shutil

ZIP=Path('Giannos_Honey_4K_Transparent.zip')
if not ZIP.exists(): raise SystemExit('Honey ZIP missing')

mapping={
'Giannos_Honey_4K_Transparent/Giannos Oak Tree Honey/giannos-oak-tree-honey-front.png':Path('assets/honey/oak-tree/giannos-oak-tree-honey-front.png'),
'Giannos_Honey_4K_Transparent/Giannos Oak Tree Honey/giannos-oak-tree-honey-back.png':Path('assets/honey/oak-tree/giannos-oak-tree-honey-back.png'),
'Giannos_Honey_4K_Transparent/Giannos Wildflower Honey/giannos-wildflower-honey-front.png':Path('assets/honey/wildflower/giannos-wildflower-honey-front.png'),
'Giannos_Honey_4K_Transparent/Giannos Wildflower Honey/giannos-wildflower-honey-back.png':Path('assets/honey/wildflower/giannos-wildflower-honey-back.png'),
}
with zipfile.ZipFile(ZIP) as z:
    names=set(z.namelist())
    missing=set(mapping)-names
    if missing: raise SystemExit(f'Missing from ZIP: {missing}')
    for src,dst in mapping.items():
        dst.parent.mkdir(parents=True,exist_ok=True)
        with z.open(src) as r,dst.open('wb') as w: shutil.copyfileobj(r,w)
ZIP.unlink()

index=Path('index.html')
s=index.read_text()
if 'honey.css' not in s:
    s=s.replace('<link rel="stylesheet" href="olive.css?v=202608171448">','<link rel="stylesheet" href="olive.css?v=202608171448">\n  <link rel="stylesheet" href="honey.css?v=202608171452">')
slider='''\n    <section class="honey-scroll" id="honey-scroll" aria-label="Honey collection">\n      <div class="honey-sticky">\n        <div class="honey-track" id="honey-track"></div>\n      </div>\n    </section>\n'''
if 'id="honey-scroll"' not in s:
    marker='''    <section class="section section--honey-story" aria-labelledby="honey-story-title">\n      <div class="intro-copy">\n        <h2 id="honey-story-title" class="display-title">\n          <span>And some are made</span>\n          <span>a little sweeter.</span>\n        </h2>\n      </div>\n    </section>'''
    s=s.replace(marker,marker+slider)
if 'honey.js' not in s:
    s=s.replace('<script src="olive.js?v=202608171448"></script>','<script src="olive.js?v=202608171448"></script>\n  <script src="honey.js?v=202608171452"></script>')
s=re.sub(r'app\.js\?v=\d+','app.js?v=202608171452',s)
index.write_text(s)

app=Path('app.js')
s=app.read_text()
old="""    if(honeyIntro)stops.push({y:honeyIntro.offsetTop});\n    if(honeyStory)stops.push({y:honeyStory.offsetTop});\n    return stops.sort((a,b)=>a.y-b.y);"""
new="""    if(honeyIntro)stops.push({y:honeyIntro.offsetTop});\n    if(honeyStory)stops.push({y:honeyStory.offsetTop});\n    if(typeof window.__honeySnapStops==='function')stops.push(...window.__honeySnapStops().map(stop=>({y:stop.y})));\n    return stops.sort((a,b)=>a.y-b.y);"""
if old not in s: raise SystemExit('globalStops marker missing')
s=s.replace(old,new,1)
s=s.replace('if(detailIndex>=0||window.__oliveDetailOpen||snapping)return;','if(detailIndex>=0||window.__oliveDetailOpen||window.__honeyDetailOpen||snapping)return;',1)
s=s.replace('if(detailIndex>=0||window.__oliveDetailOpen)return;','if(detailIndex>=0||window.__oliveDetailOpen||window.__honeyDetailOpen)return;',1)
old="""    const honeyIntro=document.querySelector('.section--honey-intro');\n    const honeyStory=document.querySelector('.section--honey-story');\n    const groups=[hero,story,coffeeSection,oliveIntro,oliveStory,oliveSection,honeyIntro,honeyStory].filter(Boolean);"""
new="""    const honeyIntro=document.querySelector('.section--honey-intro');\n    const honeyStory=document.querySelector('.section--honey-story');\n    const honeySection=document.getElementById('honey-scroll');\n    const groups=[hero,story,coffeeSection,oliveIntro,oliveStory,oliveSection,honeyIntro,honeyStory,honeySection].filter(Boolean);"""
if old not in s: raise SystemExit('sequence groups marker missing')
s=s.replace(old,new,1)
app.write_text(s)
