from pathlib import Path

app=Path('app.js')
text=app.read_text()
old="""  function renderHorizontal(){\n    const{start,distance}=sectionMetrics();\n    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));\n    const exact=progress*(PRODUCTS.length-1);\n    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;\n    slides.forEach((slide,index)=>{\n      const delta=index-exact;\n      const distanceFromActive=Math.min(1,Math.abs(delta));\n      const opacity=Math.max(0,1-distanceFromActive*1.18);\n      const blur=distanceFromActive*15;\n      const direction=delta<0?-1:1;\n      slide.style.setProperty('--scene-opacity',opacity.toFixed(3));\n      slide.style.setProperty('--scene-blur',`${blur.toFixed(1)}px`);\n      slide.style.setProperty('--scene-image-y',`${(direction*distanceFromActive*24).toFixed(1)}px`);\n      slide.style.setProperty('--scene-copy-y',`${(direction*distanceFromActive*34).toFixed(1)}px`);\n    });\n  }\n"""
new="""  function renderHorizontal(){\n    const{start,distance}=sectionMetrics();\n    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));\n    const exact=progress*(PRODUCTS.length-1);\n    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;\n  }\n"""
if old not in text:
    raise SystemExit('renderHorizontal cinematic block not found')
app.write_text(text.replace(old,new))

css=Path('style.css')
text=css.read_text()
old_img=".product-frame img{display:block;width:min(36vw,540px);max-width:100%;max-height:82svh;object-fit:contain;opacity:var(--scene-opacity,1);filter:blur(var(--scene-blur,0px));translate:0 var(--scene-image-y,0px);will-change:opacity,filter,translate}"
new_img=".product-frame img{display:block;width:min(36vw,540px);max-width:100%;max-height:82svh;object-fit:contain}"
old_copy=".copy-shell{position:absolute;left:0;top:50%;width:min(44vw,720px);transform:translateY(-50%);transform-origin:left top;opacity:var(--scene-opacity,1);filter:blur(var(--scene-blur,0px));translate:0 var(--scene-copy-y,0px);will-change:opacity,filter,translate}"
new_copy=".copy-shell{position:absolute;left:0;top:50%;width:min(44vw,720px);transform:translateY(-50%);transform-origin:left top}"
if old_img not in text or old_copy not in text:
    raise SystemExit('cinematic css blocks not found')
text=text.replace(old_img,new_img).replace(old_copy,new_copy)
css.write_text(text)
