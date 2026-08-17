from pathlib import Path
import re

index=Path('index.html')
text=index.read_text()
text=text.replace("  <style>@font-face{font-family:'TAY Rosemary';src:url('./assets/fonts/TAYRosemary.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}</style>\n",'')
text=text.replace("  <style>@media(max-width:760px){.product-frame img,.copy-shell,.olive-image-panel img,.olive-shell{filter:none!important;translate:0 0!important}}</style>\n",'')
text=re.sub(r'style\.css\?v=\d+','style.css?v=202608171355',text)
index.write_text(text)

style=Path('style.css')
text=style.read_text()
font="@font-face{font-family:'TAY Rosemary';src:url('./assets/fonts/TAYRosemary.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}\n"
if not text.startswith('@font-face'):
    text=font+text
text=text.replace("@media(prefers-reduced-motion:reduce){.intro-copy{transition:none;opacity:1;filter:none;translate:none}.product-frame img,.copy-shell{filter:none;translate:none}}","@media(prefers-reduced-motion:reduce){.intro-copy{transition:none;opacity:1;filter:none;translate:none}.coffee-slide{--micro-opacity:1!important;--micro-scale:1!important}}")
style.write_text(text)
