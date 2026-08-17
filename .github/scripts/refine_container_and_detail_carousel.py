from pathlib import Path
import re

# site-shell.css
p=Path('site-shell.css'); s=p.read_text()
s=s.replace("body.is-loading{overflow:hidden;height:100dvh}","body.is-loading{overflow:hidden;height:100dvh}\n:root{--site-container:1600px;--site-gutter:clamp(24px,3vw,48px)}")
s=s.replace(".site-header{position:fixed;top:0;left:0;right:0;z-index:1100;background:rgba(253,248,236,.96);color:var(--intro,#3d5825);opacity:0;translate:0 -10px;pointer-events:none;transition:opacity 440ms ease,translate 560ms var(--ease,cubic-bezier(.16,1,.3,1));backdrop-filter:blur(10px)}\nbody.site-ready .site-header{opacity:1;translate:0 0;pointer-events:auto}",".site-header{position:fixed;top:0;left:0;right:0;z-index:1100;background:rgba(253,248,236,.96);color:var(--intro,#3d5825);opacity:0;pointer-events:none;transition:opacity 520ms ease;backdrop-filter:blur(10px)}\nbody.site-transitioning .site-header,body.site-ready .site-header{opacity:1}\nbody.site-ready .site-header{pointer-events:auto}")
s=s.replace(".site-nav{height:72px;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:28px;padding:0 clamp(20px,3vw,48px);border-bottom:1px solid rgba(61,88,37,.14)}", ".site-nav{height:72px;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:28px;width:min(100%,var(--site-container));margin:0 auto;padding:0 var(--site-gutter);border-bottom:1px solid rgba(61,88,37,.14)}")
s=s.replace("font-size:14px;font-weight:500", "font-size:16px;font-weight:500",1)
s=s.replace(".site-nav__link{font-size:12px}",".site-nav__link{font-size:14px}")
p.write_text(s)

# site-shell.js: stage header before logo movement, keep target perfectly static
p=Path('site-shell.js'); s=p.read_text()
s=s.replace("loader.classList.add('is-moving');\n    const from=loaderLogo.getBoundingClientRect();", "loader.classList.add('is-moving');\n    document.body.classList.add('site-transitioning');\n    const from=loaderLogo.getBoundingClientRect();")
s=s.replace("document.body.classList.add('site-ready');\n      loader.classList.add('is-complete');", "document.body.classList.add('site-ready');\n      document.body.classList.remove('site-transitioning');\n      loader.classList.add('is-complete');")
p.write_text(s)

# style.css: shared content container + detail-only image UI
p=Path('style.css'); s=p.read_text()
s=s.replace("--page-inline:clamp(20px,4vw,64px);", "--page-inline:clamp(20px,4vw,64px);\n  --site-container:1600px;\n  --site-gutter:clamp(24px,3vw,48px);")
s=s.replace(".intro-copy{width:min(1420px,100%);", ".intro-copy{width:min(calc(var(--site-container) - (var(--site-gutter) * 2)),100%);")
s=s.replace(".coffee-layout{position:relative;width:100%;height:100%;display:grid;", ".coffee-layout{position:relative;width:min(100%,var(--site-container));margin:0 auto;padding-inline:var(--site-gutter);height:100%;display:grid;")
s=s.replace(".image-carousel:hover .product-dots{opacity:1;pointer-events:auto}", ".coffee-slide.is-detail .product-dots,.olive-slide.is-detail .product-dots,.honey-slide.is-detail .product-dots{opacity:1;pointer-events:auto}")
# Hide all secondary carousel UI in normal state
s += "\n/* Product image carousel is detail-only. */\n.coffee-slide:not(.is-detail) .edge-nav,.olive-slide:not(.is-detail) .edge-nav,.honey-slide:not(.is-detail) .edge-nav,.coffee-slide:not(.is-detail) .product-dots,.olive-slide:not(.is-detail) .product-dots,.honey-slide:not(.is-detail) .product-dots{opacity:0!important;pointer-events:none!important}\n"
p.write_text(s)

# olive.css / honey.css align product containers and remove hover dot reveal
for filename, layout, hover_rule in [
    ('olive.css','.olive-layout','.olive-image-carousel:hover .product-dots{opacity:1;pointer-events:auto}\n'),
    ('honey.css','.honey-layout','.honey-image-carousel:hover .product-dots,.honey-slide.is-detail .product-dots{opacity:1;pointer-events:auto}\n')]:
    p=Path(filename); s=p.read_text()
    if filename=='olive.css':
        s=s.replace(".olive-layout{position:relative;width:100%;height:100%;display:grid;", ".olive-layout{position:relative;width:min(100%,var(--site-container));margin:0 auto;padding-inline:var(--site-gutter);height:100%;display:grid;")
        s=s.replace(hover_rule,'')
    else:
        s=s.replace(".honey-layout{position:relative;width:100%;height:100%;display:grid;", ".honey-layout{position:relative;width:min(100%,var(--site-container));margin:0 auto;padding-inline:var(--site-gutter);height:100%;display:grid;")
        s=s.replace(hover_rule,'.honey-slide.is-detail .product-dots{opacity:1;pointer-events:auto}\n')
    p.write_text(s)

# app.js: image interaction only while detail; reset to primary on close
p=Path('app.js'); s=p.read_text()
s=s.replace("prev?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();toggleCarousel(index)});", "prev?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;toggleCarousel(index)});")
s=s.replace("next?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();toggleCarousel(index)});", "next?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;toggleCarousel(index)});")
s=s.replace("dot.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();setCarouselImage(index,Number(dot.dataset.imageDot))});", "dot.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;setCarouselImage(index,Number(dot.dataset.imageDot))});")
s=s.replace("if(!viewport)return;\n\n    prev?", "if(!viewport)return;\n\n    prev?")
s=s.replace("viewport.addEventListener('pointerdown',event=>{\n      if(event.pointerType==='mouse'&&event.button!==0)return;", "viewport.addEventListener('pointerdown',event=>{\n      if(!slide.classList.contains('is-detail'))return;\n      if(event.pointerType==='mouse'&&event.button!==0)return;")
s=s.replace("animation.addEventListener('finish',()=>{slide.classList.remove('is-closing','is-detail');document.body.classList.remove('details-open');slide.scrollTop=0;animation.cancel();detailIndex=-1}", "animation.addEventListener('finish',()=>{slide.classList.remove('is-closing','is-detail');document.body.classList.remove('details-open');slide.scrollTop=0;state[index].image=0;renderCarousel(index,false);animation.cancel();detailIndex=-1}")
p.write_text(s)

# olive.js and honey.js: controls/swipe detail only, reset image 0 on close
for filename,prefix in [('olive.js','olive'),('honey.js','honey')]:
    p=Path(filename); s=p.read_text()
    # delegated click handlers
    if prefix=='olive':
        s=s.replace("if(event.target.closest('[data-olive-image-prev]')){event.preventDefault();event.stopPropagation();setImage(index,current.image-1);return}","if(event.target.closest('[data-olive-image-prev]')){event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;setImage(index,current.image-1);return}")
        s=s.replace("if(event.target.closest('[data-olive-image-next]')){event.preventDefault();event.stopPropagation();setImage(index,current.image+1);return}","if(event.target.closest('[data-olive-image-next]')){event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;setImage(index,current.image+1);return}")
        s=s.replace("if(dot){event.preventDefault();event.stopPropagation();setImage(index,Number(dot.dataset.oliveImageDot));return}","if(dot){event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;setImage(index,Number(dot.dataset.oliveImageDot));return}")
    else:
        s=s.replace("if(event.target.closest('[data-honey-image-prev]')){event.preventDefault();event.stopPropagation();setImage(index,current.image-1);return}","if(event.target.closest('[data-honey-image-prev]')){event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;setImage(index,current.image-1);return}")
        s=s.replace("if(event.target.closest('[data-honey-image-next]')){event.preventDefault();event.stopPropagation();setImage(index,current.image+1);return}","if(event.target.closest('[data-honey-image-next]')){event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;setImage(index,current.image+1);return}")
        s=s.replace("if(dot){event.preventDefault();event.stopPropagation();setImage(index,Number(dot.dataset.honeyImageDot));return}","if(dot){event.preventDefault();event.stopPropagation();if(!slide.classList.contains('is-detail'))return;setImage(index,Number(dot.dataset.honeyImageDot));return}")
    s=s.replace("viewport.addEventListener('pointerdown',event=>{startX=event.clientX;startY=event.clientY;tracking=true;", "viewport.addEventListener('pointerdown',event=>{if(!slide.classList.contains('is-detail'))return;startX=event.clientX;startY=event.clientY;tracking=true;")
    # reset image in finish close before detailIndex reset
    s=s.replace("slide.scrollTop=0;animation.cancel();detailIndex=-1;setImage(index,state[index].image,true)","slide.scrollTop=0;state[index].image=0;setImage(index,0,true);animation.cancel();detailIndex=-1")
    p.write_text(s)

# cache bust
p=Path('index.html'); s=p.read_text()
for name in ['style.css','olive.css','honey.css','site-shell.css','site-shell.js','app.js','olive.js','honey.js']:
    s=re.sub(re.escape(name)+r'\?v=\d+',name+'?v=202608171514',s)
p.write_text(s)
