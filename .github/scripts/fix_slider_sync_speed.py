from pathlib import Path
import re

app=Path('app.js')
s=app.read_text()

# Keep the first coffee product locked until the section reveal point, and map the
# complete horizontal travel from that reveal point to the sticky-section end.
old="""  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;
"""
new="""  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const gate=Math.min(120,Math.max(64,innerHeight*.14));
    const activeStart=start+gate;
    const activeDistance=Math.max(distance-gate,1);
    const progress=Math.max(0,Math.min(1,(scrollY-activeStart)/activeDistance));
    const exact=progress*(PRODUCTS.length-1);
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;
"""
if old not in s: raise SystemExit('coffee renderHorizontal block not found')
s=s.replace(old,new,1)

old="""    const{start,distance}=sectionMetrics();
    const coffeeStep=distance/(PRODUCTS.length-1);
    const stops=[];
    if(hero)stops.push({y:hero.offsetTop});
    if(story)stops.push({y:story.offsetTop});
    PRODUCTS.forEach((_,index)=>stops.push({y:start+coffeeStep*index}));
"""
new="""    const{start,distance}=sectionMetrics();
    const gate=Math.min(120,Math.max(64,innerHeight*.14));
    const coffeeStart=start+gate;
    const coffeeDistance=Math.max(distance-gate,1);
    const coffeeStep=coffeeDistance/(PRODUCTS.length-1);
    const stops=[];
    if(hero)stops.push({y:hero.offsetTop});
    if(story)stops.push({y:story.offsetTop});
    PRODUCTS.forEach((_,index)=>stops.push({y:coffeeStart+coffeeStep*index}));
"""
if old not in s: raise SystemExit('coffee globalStops block not found')
s=s.replace(old,new,1)

s=s.replace('snapTimer=setTimeout(snapToNearest,140);','snapTimer=setTimeout(snapToNearest,80);')
s=s.replace("setTimeout(()=>{snapping=false},650);","setTimeout(()=>{snapping=false},460);")
s=s.replace('const gate=Math.min(180,vh*.22);','const gate=Math.min(120,Math.max(64,vh*.14));')
app.write_text(s)

olive=Path('olive.js')
s=olive.read_text()
old="""  function render(){
    const{start,distance}=metrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(OLIVE_PRODUCTS.length-1);
    track.style.transform=`translate3d(${-progress*100}vw,0,0)`;
"""
new="""  function render(){
    const{start,distance}=metrics();
    const gate=Math.min(120,Math.max(64,innerHeight*.14));
    const activeStart=start+gate;
    const activeDistance=Math.max(distance-gate,1);
    const progress=Math.max(0,Math.min(1,(scrollY-activeStart)/activeDistance));
    const exact=progress*(OLIVE_PRODUCTS.length-1);
    track.style.transform=`translate3d(${-progress*100}vw,0,0)`;
"""
if old not in s: raise SystemExit('olive render block not found')
s=s.replace(old,new,1)
old="  window.__oliveSnapStops=()=>{const{start,distance}=metrics();return[{y:start},{y:start+distance}]};"
new="  window.__oliveSnapStops=()=>{const{start,distance}=metrics();const gate=Math.min(120,Math.max(64,innerHeight*.14));const activeStart=start+gate;const activeDistance=Math.max(distance-gate,1);return[{y:activeStart},{y:activeStart+activeDistance}]};"
if old not in s: raise SystemExit('olive snap stops block not found')
s=s.replace(old,new,1)
olive.write_text(s)

# Speed up only the section/product reveal motion. Internal image carousel and
# product-detail animations are intentionally untouched.
style=Path('style.css')
s=style.read_text()
s=s.replace('transition:opacity 900ms var(--ease),filter 1100ms var(--ease),translate 1100ms var(--ease),scale 1100ms var(--ease)',
            'transition:opacity 420ms var(--ease),filter 560ms var(--ease),translate 560ms var(--ease),scale 560ms var(--ease)')
style.write_text(s)

olive_css=Path('olive.css')
s=olive_css.read_text()
s=s.replace('transition:opacity 900ms var(--ease),filter 1100ms var(--ease),translate 1100ms var(--ease),scale 1100ms var(--ease)',
            'transition:opacity 420ms var(--ease),filter 560ms var(--ease),translate 560ms var(--ease),scale 560ms var(--ease)')
olive_css.write_text(s)

index=Path('index.html')
s=index.read_text()
s=re.sub(r'app\.js\?v=\d+','app.js?v=202608171448',s)
s=re.sub(r'olive\.js\?v=\d+','olive.js?v=202608171448',s)
s=re.sub(r'style\.css\?v=\d+','style.css?v=202608171448',s)
s=re.sub(r'olive\.css\?v=\d+','olive.css?v=202608171448',s)
index.write_text(s)
