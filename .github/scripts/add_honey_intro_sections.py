from pathlib import Path
import re

index=Path('index.html')
s=index.read_text()
needle='''    <section class="olive-scroll" id="olive-scroll" aria-label="Olive oil collection">\n      <div class="olive-sticky">\n        <div class="olive-track" id="olive-track"></div>\n      </div>\n    </section>\n'''
addition='''    <section class="olive-scroll" id="olive-scroll" aria-label="Olive oil collection">\n      <div class="olive-sticky">\n        <div class="olive-track" id="olive-track"></div>\n      </div>\n    </section>\n\n    <section class="section section--honey-intro" aria-labelledby="honey-intro-title">\n      <div class="intro-copy">\n        <h2 id="honey-intro-title" class="display-title">\n          <span>Made for the little moments</span>\n          <span>worth savoring.</span>\n        </h2>\n      </div>\n    </section>\n\n    <section class="section section--honey-story" aria-labelledby="honey-story-title">\n      <div class="intro-copy">\n        <h2 id="honey-story-title" class="display-title">\n          <span>And some are made</span>\n          <span>a little sweeter.</span>\n        </h2>\n      </div>\n    </section>\n'''
if 'section--honey-intro' not in s:
    if needle not in s: raise SystemExit('olive section block not found')
    s=s.replace(needle,addition)
s=re.sub(r'app\.js\?v=\d+','app.js?v=202608171445',s)
index.write_text(s)

app=Path('app.js')
s=app.read_text()
# Add honey sections to snap points.
s=s.replace("    const oliveStory=document.querySelector('.section--olive-story');\n    const{start,distance}=sectionMetrics();", "    const oliveStory=document.querySelector('.section--olive-story');\n    const honeyIntro=document.querySelector('.section--honey-intro');\n    const honeyStory=document.querySelector('.section--honey-story');\n    const{start,distance}=sectionMetrics();")
s=s.replace("    if(typeof window.__oliveSnapStops==='function')stops.push(...window.__oliveSnapStops().map(stop=>({y:stop.y})));\n    return stops.sort((a,b)=>a.y-b.y);", "    if(typeof window.__oliveSnapStops==='function')stops.push(...window.__oliveSnapStops().map(stop=>({y:stop.y})));\n    if(honeyIntro)stops.push({y:honeyIntro.offsetTop});\n    if(honeyStory)stops.push({y:honeyStory.offsetTop});\n    return stops.sort((a,b)=>a.y-b.y);")
# Add honey sections to global bidirectional sequence groups.
s=s.replace("    const oliveSection=document.getElementById('olive-scroll');\n    const groups=[hero,story,coffeeSection,oliveIntro,oliveStory,oliveSection].filter(Boolean);", "    const oliveSection=document.getElementById('olive-scroll');\n    const honeyIntro=document.querySelector('.section--honey-intro');\n    const honeyStory=document.querySelector('.section--honey-story');\n    const groups=[hero,story,coffeeSection,oliveIntro,oliveStory,oliveSection,honeyIntro,honeyStory].filter(Boolean);")
app.write_text(s)
