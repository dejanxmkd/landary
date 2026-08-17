from pathlib import Path
import re

# Coffee: keep direct horizontal slide, add only tiny shared opacity/scale micro-motion.
app=Path('app.js')
text=app.read_text()
old="""  function renderHorizontal(){\n    const{start,distance}=sectionMetrics();\n    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));\n    const exact=progress*(PRODUCTS.length-1);\n    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;\n  }\n"""
new="""  function renderHorizontal(){\n    const{start,distance}=sectionMetrics();\n    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));\n    const exact=progress*(PRODUCTS.length-1);\n    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;\n    slides.forEach((slide,index)=>{\n      const distanceFromActive=Math.min(1,Math.abs(index-exact));\n      slide.style.setProperty('--micro-opacity',(1-distanceFromActive*.06).toFixed(3));\n      slide.style.setProperty('--micro-scale',(1-distanceFromActive*.012).toFixed(4));\n    });\n  }\n"""
if old not in text:
    raise SystemExit('coffee renderHorizontal block not found')
app.write_text(text.replace(old,new))

# Olive: remove old cinematic fade/blur/vertical drift and use exact same micro-motion.
olive=Path('olive.js')
text=olive.read_text()
old="""  function render(){\n    const{start,distance}=metrics();\n    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));\n    const exact=progress*(OLIVE_PRODUCTS.length-1);\n    track.style.transform=`translate3d(${-progress*100}vw,0,0)`;\n    slides.forEach((slide,index)=>{\n      const delta=index-exact;\n      const distanceFromActive=Math.min(1,Math.abs(delta));\n      const opacity=Math.max(0,1-distanceFromActive*1.18);\n      const blur=distanceFromActive*15;\n      const direction=delta<0?-1:1;\n      slide.style.setProperty('--scene-opacity',opacity.toFixed(3));\n      slide.style.setProperty('--scene-blur',`${blur.toFixed(1)}px`);\n      slide.style.setProperty('--scene-image-y',`${(direction*distanceFromActive*24).toFixed(1)}px`);\n      slide.style.setProperty('--scene-copy-y',`${(direction*distanceFromActive*34).toFixed(1)}px`);\n    });\n  }\n"""
new="""  function render(){\n    const{start,distance}=metrics();\n    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));\n    const exact=progress*(OLIVE_PRODUCTS.length-1);\n    track.style.transform=`translate3d(${-progress*100}vw,0,0)`;\n    slides.forEach((slide,index)=>{\n      const distanceFromActive=Math.min(1,Math.abs(index-exact));\n      slide.style.setProperty('--micro-opacity',(1-distanceFromActive*.06).toFixed(3));\n      slide.style.setProperty('--micro-scale',(1-distanceFromActive*.012).toFixed(4));\n    });\n  }\n"""
if old not in text:
    raise SystemExit('olive cinematic render block not found')
olive.write_text(text.replace(old,new))

# Coffee CSS: shared micro animation affects image and copy equally, never detail state.
css=Path('style.css')
text=css.read_text()
anchor=".product-frame img{display:block;width:min(36vw,540px);max-width:100%;max-height:82svh;object-fit:contain}\n"
addition=".coffee-slide:not(.is-detail) .product-frame img,.coffee-slide:not(.is-detail) .copy-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);will-change:opacity,scale}\n"
if addition not in text:
    if anchor not in text: raise SystemExit('coffee css anchor missing')
    text=text.replace(anchor,anchor+addition)
css.write_text(text)

# Olive CSS: delete all old cinematic variables, then use same exact micro animation.
css=Path('olive.css')
text=css.read_text()
old_img=".olive-image-panel img{display:block;max-width:78%;max-height:78svh;object-fit:contain;pointer-events:none;opacity:var(--scene-opacity,1);filter:blur(var(--scene-blur,0px));translate:0 var(--scene-image-y,0px);will-change:opacity,filter,translate}"
new_img=".olive-image-panel img{display:block;max-width:78%;max-height:78svh;object-fit:contain;pointer-events:none}"
old_shell=".olive-shell{position:absolute;left:0;top:50%;width:min(44vw,720px);transform:translateY(-50%);opacity:var(--scene-opacity,1);filter:blur(var(--scene-blur,0px));translate:0 var(--scene-copy-y,0px);will-change:opacity,filter,translate}"
new_shell=".olive-shell{position:absolute;left:0;top:50%;width:min(44vw,720px);transform:translateY(-50%)}"
if old_img not in text or old_shell not in text:
    raise SystemExit('olive cinematic css blocks missing')
text=text.replace(old_img,new_img).replace(old_shell,new_shell)
anchor=new_img+'\n'
addition=".olive-slide:not(.is-detail) .olive-image-panel img,.olive-slide:not(.is-detail) .olive-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);will-change:opacity,scale}\n"
if addition not in text:
    text=text.replace(anchor,anchor+addition)
text=text.replace('@media(prefers-reduced-motion:reduce){.olive-image-panel img,.olive-shell{filter:none;translate:none}}','@media(prefers-reduced-motion:reduce){.olive-slide{--micro-opacity:1!important;--micro-scale:1!important}}')
css.write_text(text)

# Cache bust all changed assets.
index=Path('index.html')
text=index.read_text()
version='202608171351'
for name in ('style.css','olive.css','app.js','olive.js'):
    text=re.sub(rf'{re.escape(name)}\?v=\d+',f'{name}?v={version}',text)
index.write_text(text)
