from pathlib import Path
p=Path('style.css')
s=p.read_text()
s=s.replace(".coffee-slide.is-detail .coffee-gallery{height:auto;min-height:200svh;overflow:visible}\n.coffee-slide.is-detail .gallery-stack{height:auto}\n.coffee-slide.is-detail .product-frame{height:100svh}\n.coffee-slide.is-detail .product-frame--secondary{display:grid}", ".coffee-slide.is-detail .coffee-gallery{position:relative;height:auto;min-height:200svh;overflow:visible;align-self:start}\n.coffee-slide.is-detail .gallery-stack{height:auto;min-height:200svh}\n.coffee-slide.is-detail .product-frame{position:sticky;top:0;height:100svh}\n.coffee-slide.is-detail .product-frame--secondary{display:grid;z-index:2}")
s=s.replace(".coffee-slide.is-detail .coffee-gallery{position:relative;height:auto;min-height:136svh}.coffee-slide.is-detail .product-frame{height:68svh}", ".coffee-slide.is-detail .coffee-gallery{position:relative;height:auto;min-height:136svh;overflow:visible}.coffee-slide.is-detail .product-frame{position:sticky;top:0;height:68svh}")
p.write_text(s)
