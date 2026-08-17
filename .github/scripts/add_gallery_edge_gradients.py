from pathlib import Path
import re

style=Path('style.css')
s=style.read_text()
anchor='.image-carousel{position:relative;width:100%;height:100%;touch-action:pan-y;user-select:none}'
addition=""".image-carousel::before,.image-carousel::after{content:'';position:absolute;top:0;bottom:0;z-index:4;width:clamp(40px,4.5vw,72px);pointer-events:none}\n.image-carousel::before{left:0;background:linear-gradient(90deg,var(--paper) 0%,rgba(253,248,236,.9) 24%,rgba(253,248,236,0) 100%)}\n.image-carousel::after{right:0;background:linear-gradient(270deg,var(--paper) 0%,rgba(253,248,236,.9) 24%,rgba(253,248,236,0) 100%)}\n"""
if '.image-carousel::before,.image-carousel::after' not in s:
    s=s.replace(anchor,anchor+'\n'+addition)
s=s.replace('@media(max-width:760px){.display-title', '@media(max-width:760px){.image-carousel::before,.image-carousel::after{width:28px}.display-title')
style.write_text(s)

olive=Path('olive.css')
s=olive.read_text()
anchor='.olive-image-carousel{position:relative;width:100%;height:100%;touch-action:pan-y;user-select:none}'
addition=""".olive-image-carousel::before,.olive-image-carousel::after{content:'';position:absolute;top:0;bottom:0;z-index:4;width:clamp(40px,4.5vw,72px);pointer-events:none}\n.olive-image-carousel::before{left:0;background:linear-gradient(90deg,#fdf8ec 0%,rgba(253,248,236,.9) 24%,rgba(253,248,236,0) 100%)}\n.olive-image-carousel::after{right:0;background:linear-gradient(270deg,#fdf8ec 0%,rgba(253,248,236,.9) 24%,rgba(253,248,236,0) 100%)}\n"""
if '.olive-image-carousel::before,.olive-image-carousel::after' not in s:
    s=s.replace(anchor,anchor+'\n'+addition)
s=s.replace('@media(max-width:760px){.olive-layout', '@media(max-width:760px){.olive-image-carousel::before,.olive-image-carousel::after{width:28px}.olive-layout')
olive.write_text(s)

index=Path('index.html')
s=index.read_text()
s=re.sub(r'style\.css\?v=\d+','style.css?v=202608171425',s)
s=re.sub(r'olive\.css\?v=\d+','olive.css?v=202608171425',s)
index.write_text(s)
