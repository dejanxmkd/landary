from pathlib import Path
p=Path('style.css')
s=p.read_text()
old=""".coffee-slide.is-detail{overflow-y:auto;overscroll-behavior:contain}
.coffee-slide.is-detail .coffee-layout{height:auto;min-height:220svh;align-items:start}
.coffee-slide.is-detail .coffee-gallery{position:relative;height:auto;min-height:200svh;overflow:visible;align-self:start}
.coffee-slide.is-detail .gallery-stack{height:auto;min-height:200svh}
.coffee-slide.is-detail .product-frame{position:sticky;top:0;height:100svh}
.coffee-slide.is-detail .product-frame--secondary{display:grid;z-index:2}
.coffee-slide.is-detail .coffee-copy{height:auto;min-height:220svh;overflow:visible;padding:0 5vw 72px 0}
.coffee-slide.is-detail .copy-shell{position:absolute;left:0;top:50svh;transform:translateY(-50%)}
.coffee-slide.is-detail .detail-content{max-height:1800px;margin-top:30px;opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0);transition:max-height 1000ms var(--ease),opacity 520ms ease 100ms,transform 1000ms var(--ease),margin-top 1000ms var(--ease),visibility 0s linear 0s}
"""
new=""".coffee-slide.is-detail{overflow-y:auto;overscroll-behavior:contain}
.coffee-slide.is-detail .coffee-layout{height:auto;min-height:220svh;align-items:start}
.coffee-slide.is-detail .coffee-gallery{position:relative;height:auto;min-height:200svh;overflow:visible;align-self:start;padding-top:180px}
.coffee-slide.is-detail .gallery-stack{height:auto;min-height:200svh}
.coffee-slide.is-detail .product-frame{position:relative;top:auto;height:100svh}
.coffee-slide.is-detail .product-frame--secondary{display:grid;z-index:auto}
.coffee-slide.is-detail .coffee-copy{height:auto;min-height:220svh;overflow:visible;padding:180px 5vw 72px 0}
.coffee-slide.is-detail .copy-shell{position:relative;left:auto;top:auto;transform:none}
.coffee-slide.is-detail .detail-content{max-height:1800px;margin-top:30px;opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0);transition:max-height 1000ms var(--ease),opacity 520ms ease 100ms,transform 1000ms var(--ease),margin-top 1000ms var(--ease),visibility 0s linear 0s}
"""
if old not in s: raise SystemExit('desktop detail block not found')
s=s.replace(old,new,1)
oldm=""".coffee-slide.is-detail .coffee-layout{display:block;min-height:250svh}.coffee-slide.is-detail .coffee-gallery{position:relative;height:auto;min-height:136svh;overflow:visible}.coffee-slide.is-detail .product-frame{position:sticky;top:0;height:68svh}.coffee-slide.is-detail .product-frame img{max-height:60svh}.coffee-slide.is-detail .coffee-copy{position:relative;left:auto;right:auto;bottom:auto;height:auto;min-height:114svh;padding:0 20px 64px;text-align:left}.coffee-slide.is-detail .copy-shell{position:absolute;left:20px;top:24svh;width:calc(100vw - 40px);transform:none}"""
newm=""".coffee-slide.is-detail .coffee-layout{display:block;min-height:250svh}.coffee-slide.is-detail .coffee-gallery{position:relative;height:auto;min-height:136svh;overflow:visible;padding-top:110px}.coffee-slide.is-detail .product-frame{position:relative;top:auto;height:68svh}.coffee-slide.is-detail .product-frame img{max-height:60svh}.coffee-slide.is-detail .coffee-copy{position:relative;left:auto;right:auto;bottom:auto;height:auto;min-height:114svh;padding:110px 20px 64px;text-align:left}.coffee-slide.is-detail .copy-shell{position:relative;left:auto;top:auto;width:100%;transform:none}"""
if oldm not in s: raise SystemExit('mobile detail block not found')
s=s.replace(oldm,newm,1)
p.write_text(s)
