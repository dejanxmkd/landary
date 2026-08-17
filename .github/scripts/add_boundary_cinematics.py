from pathlib import Path

# Patch app.js with shared boundary cinematic state handling.
app = Path('app.js')
s = app.read_text()
marker = "  const introObserver=new IntersectionObserver(entries=>{\n"
insert = """  function updateBoundaryCinematics(){
    const story=document.querySelector('.section--story');
    const oliveStory=document.querySelector('.section--olive-story');
    const oliveSection=document.getElementById('olive-scroll');
    const threshold=innerHeight*.72;

    const coffeeTop=coffeeSection.getBoundingClientRect().top;
    const coffeeEntering=coffeeTop<=threshold;
    coffeeSection.classList.toggle('is-entry-cinematic-active',coffeeEntering);
    if(story)story.classList.toggle('is-cinematic-leaving',coffeeEntering&&coffeeTop>-innerHeight*.35);

    if(oliveSection){
      const oliveTop=oliveSection.getBoundingClientRect().top;
      const oliveEntering=oliveTop<=threshold;
      oliveSection.classList.toggle('is-entry-cinematic-active',oliveEntering);
      if(oliveStory)oliveStory.classList.toggle('is-cinematic-leaving',oliveEntering&&oliveTop>-innerHeight*.35);
    }
  }

"""
if 'function updateBoundaryCinematics()' not in s:
    s = s.replace(marker, insert + marker)

s = s.replace("  addEventListener('scroll',onScroll,{passive:true});\n", "  addEventListener('scroll',onScroll,{passive:true});\n  addEventListener('scroll',updateBoundaryCinematics,{passive:true});\n")
s = s.replace("  addEventListener('resize',()=>{if(detailIndex<0){renderHorizontal()}});\n", "  addEventListener('resize',()=>{if(detailIndex<0){renderHorizontal()}updateBoundaryCinematics()});\n")
s = s.replace("  requestAnimationFrame(()=>{renderHorizontal()});\n", "  requestAnimationFrame(()=>{renderHorizontal();updateBoundaryCinematics()});\n")
app.write_text(s)

# Add coffee boundary cinematic + previous intro exit.
style = Path('style.css')
s = style.read_text()
anchor = ".section.is-cinematic-active .intro-copy{opacity:1;filter:blur(0);translate:0 0}\n"
addition = """.section.is-cinematic-leaving .intro-copy{opacity:0;filter:blur(14px);translate:0 -34px}
.coffee-scroll .coffee-slide:first-child .product-frame img,.coffee-scroll .coffee-slide:first-child .copy-shell{transition:opacity 900ms var(--ease),filter 1100ms var(--ease),translate 1100ms var(--ease),scale 1100ms var(--ease)}
.coffee-scroll:not(.is-entry-cinematic-active) .coffee-slide:first-child .product-frame img,.coffee-scroll:not(.is-entry-cinematic-active) .coffee-slide:first-child .copy-shell{opacity:0!important;filter:blur(14px);translate:0 38px;scale:.985}
.coffee-scroll.is-entry-cinematic-active .coffee-slide:first-child .product-frame img,.coffee-scroll.is-entry-cinematic-active .coffee-slide:first-child .copy-shell{opacity:1;filter:blur(0);translate:0 0;scale:1}
"""
if '.section.is-cinematic-leaving .intro-copy' not in s:
    s = s.replace(anchor, anchor + addition)
# reduced motion
s = s.replace("@media(prefers-reduced-motion:reduce){.intro-copy{transition:none;opacity:1;filter:none;translate:none}", "@media(prefers-reduced-motion:reduce){.intro-copy{transition:none;opacity:1;filter:none;translate:none}.coffee-scroll .coffee-slide:first-child .product-frame img,.coffee-scroll .coffee-slide:first-child .copy-shell{transition:none!important;opacity:1!important;filter:none!important;translate:none!important;scale:1!important}")
style.write_text(s)

# Add same entry cinematic to olive first product.
olive_css = Path('olive.css')
s = olive_css.read_text()
anchor = ".olive-slide:not(.is-detail) .olive-image-panel img,.olive-slide:not(.is-detail) .olive-shell{opacity:var(--micro-opacity,1);scale:var(--micro-scale,1);will-change:opacity,scale}\n"
addition = """.olive-scroll .olive-slide:first-child .olive-image-panel img,.olive-scroll .olive-slide:first-child .olive-shell{transition:opacity 900ms var(--ease),filter 1100ms var(--ease),translate 1100ms var(--ease),scale 1100ms var(--ease)}
.olive-scroll:not(.is-entry-cinematic-active) .olive-slide:first-child .olive-image-panel img,.olive-scroll:not(.is-entry-cinematic-active) .olive-slide:first-child .olive-shell{opacity:0!important;filter:blur(14px);translate:0 38px;scale:.985}
.olive-scroll.is-entry-cinematic-active .olive-slide:first-child .olive-image-panel img,.olive-scroll.is-entry-cinematic-active .olive-slide:first-child .olive-shell{opacity:1;filter:blur(0);translate:0 0;scale:1}
"""
if '.olive-scroll:not(.is-entry-cinematic-active)' not in s:
    s = s.replace(anchor, anchor + addition)
s = s.replace("@media(prefers-reduced-motion:reduce){.olive-slide{--micro-opacity:1!important;--micro-scale:1!important}}", "@media(prefers-reduced-motion:reduce){.olive-slide{--micro-opacity:1!important;--micro-scale:1!important}.olive-scroll .olive-slide:first-child .olive-image-panel img,.olive-scroll .olive-slide:first-child .olive-shell{transition:none!important;opacity:1!important;filter:none!important;translate:none!important;scale:1!important}}")
olive_css.write_text(s)

# Bust caches.
index = Path('index.html')
s = index.read_text()
import re
s = re.sub(r'style\.css\?v=\d+', 'style.css?v=202608171409', s)
s = re.sub(r'olive\.css\?v=\d+', 'olive.css?v=202608171409', s)
s = re.sub(r'app\.js\?v=\d+', 'app.js?v=202608171409', s)
s = re.sub(r'olive\.js\?v=\d+', 'olive.js?v=202608171409', s)
index.write_text(s)
