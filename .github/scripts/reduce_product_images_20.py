from pathlib import Path
import re

# Coffee: 20% smaller only outside View Details.
p=Path('style.css'); s=p.read_text()
s += "\n/* Normal product view: product imagery is 20% smaller; detail gallery keeps full size. */\n.coffee-slide:not(.is-detail) .product-frame img{width:min(28.8vw,432px);max-height:65.6svh}\n@media(max-width:1000px){.coffee-slide:not(.is-detail) .product-frame img{width:min(33.6vw,376px)}}\n@media(max-width:760px){.coffee-slide:not(.is-detail) .product-frame img{width:min(56vw,264px);max-height:36.8svh}}\n"
p.write_text(s)

# Olive: 78% -> 62.4%, 78svh -> 62.4svh; mobile 72% -> 57.6%, 45svh -> 36svh.
p=Path('olive.css'); s=p.read_text()
s += "\n/* Normal product view: product imagery is 20% smaller; detail gallery keeps full size. */\n.olive-slide:not(.is-detail) .olive-image-panel img{max-width:62.4%;max-height:62.4svh}\n@media(max-width:760px){.olive-slide:not(.is-detail) .olive-image-panel img{max-width:57.6%;max-height:36svh}}\n"
p.write_text(s)

# Honey: 76% -> 60.8%, 76svh -> 60.8svh; mobile 72% -> 57.6%, 45svh -> 36svh.
p=Path('honey.css'); s=p.read_text()
s += "\n/* Normal product view: product imagery is 20% smaller; detail gallery keeps full size. */\n.honey-slide:not(.is-detail) .honey-image-panel img{max-width:60.8%;max-height:60.8svh}\n@media(max-width:760px){.honey-slide:not(.is-detail) .honey-image-panel img{max-width:57.6%;max-height:36svh}}\n"
p.write_text(s)

# Cache bust.
p=Path('index.html'); s=p.read_text()
for name in ['style.css','olive.css','honey.css']:
    s=re.sub(re.escape(name)+r'\?v=\d+',name+'?v=202608171541',s)
p.write_text(s)
