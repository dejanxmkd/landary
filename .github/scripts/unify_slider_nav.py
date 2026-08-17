from pathlib import Path

# Coffee markup: replace circle chevrons with shared edge nav labels.
app = Path('app.js')
s = app.read_text()
s = s.replace('''<button class="carousel-arrow carousel-arrow--prev" type="button" data-image-prev aria-label="Previous product image"><span class="material-icons" aria-hidden="true">chevron_left</span></button>\n            <button class="carousel-arrow carousel-arrow--next" type="button" data-image-next aria-label="Next product image"><span class="material-icons" aria-hidden="true">chevron_right</span></button>''', '''<button class="edge-nav edge-nav--prev" type="button" data-image-prev aria-label="Previous product image"><span>Prev</span><i aria-hidden="true"></i></button>\n            <button class="edge-nav edge-nav--next" type="button" data-image-next aria-label="Next product image"><i aria-hidden="true"></i><span>Next</span></button>''')
app.write_text(s)

# Olive markup: use the exact same shared class names.
olive = Path('olive.js')
s = olive.read_text()
s = s.replace('class="olive-edge-nav olive-edge-nav--prev"', 'class="edge-nav edge-nav--prev"')
s = s.replace('class="olive-edge-nav olive-edge-nav--next"', 'class="edge-nav edge-nav--next"')
olive.write_text(s)

# Shared nav styling in primary brand font.
style = Path('style.css')
s = style.read_text()
start = s.index('.carousel-arrow{')
end = s.index('.product-dots{', start)
shared = '''.edge-nav{position:absolute;top:50%;z-index:6;display:flex;align-items:center;gap:11px;padding:12px 0;border:0;background:transparent;color:var(--intro);opacity:0;transform:translateY(-50%);cursor:pointer;pointer-events:none;transition:opacity 260ms ease,gap 360ms var(--ease)}\n.edge-nav span{font-family:var(--font-title);font-size:18px;font-weight:400;line-height:1;letter-spacing:.01em;text-transform:uppercase}\n.edge-nav i{display:block;width:34px;height:1px;background:currentColor;opacity:.72;transition:width 360ms var(--ease),height 220ms ease,opacity 260ms ease}\n.edge-nav--prev{left:clamp(22px,3vw,52px)}\n.edge-nav--next{right:clamp(22px,3vw,52px)}\n.image-carousel:hover .edge-nav,.coffee-slide.is-detail .edge-nav,.olive-image-carousel:hover .edge-nav,.olive-slide.is-detail .edge-nav{opacity:.72;pointer-events:auto}\n.edge-nav:hover{opacity:1!important;gap:15px}\n.edge-nav:hover i{width:48px;height:2px;opacity:1}\n'''
s = s[:start] + shared + s[end:]
# Replace old mobile carousel-arrow rules with shared edge nav rules.
s = s.replace('.coffee-slide.is-detail .carousel-arrow{width:44px;height:44px;opacity:.72}.coffee-slide.is-detail .carousel-arrow--prev{left:16px}.coffee-slide.is-detail .carousel-arrow--next{right:16px}', '.coffee-slide.is-detail .edge-nav{opacity:.72}.edge-nav{gap:8px}.edge-nav span{font-size:16px}.edge-nav i{width:22px}.edge-nav--prev{left:16px}.edge-nav--next{right:16px}')
style.write_text(s)

# Remove olive-only nav styling now that both sections share edge-nav.
css = Path('olive.css')
s = css.read_text()
start = s.index('.olive-edge-nav{')
end = s.index('.olive-image-carousel:hover .product-dots', start)
s = s[:start] + s[end:]
# Remove old olive mobile nav overrides.
s = s.replace('.olive-edge-nav{top:48%;gap:8px}.olive-edge-nav span{font-size:10px}.olive-edge-nav i{width:22px}.olive-edge-nav--prev{left:16px}.olive-edge-nav--next{right:16px}', '.edge-nav{top:48%}')
css.write_text(s)

# Bust cache.
index = Path('index.html')
s = index.read_text()
for old,new in [
    ('style.css?v=202608171355','style.css?v=202608171406'),
    ('olive.css?v=202608171351','olive.css?v=202608171406'),
    ('app.js?v=202608171351','app.js?v=202608171406'),
    ('olive.js?v=202608171351','olive.js?v=202608171406')
]:
    s = s.replace(old,new)
index.write_text(s)
