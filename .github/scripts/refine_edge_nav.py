from pathlib import Path

style=Path('style.css')
s=style.read_text()
s=s.replace(".edge-nav{position:absolute;top:50%;z-index:6;display:flex;align-items:center;gap:11px;padding:12px 0;border:0;background:transparent;color:var(--intro);opacity:0;transform:translateY(-50%);cursor:pointer;pointer-events:none;transition:opacity 260ms ease,gap 360ms var(--ease)}", ".edge-nav{position:absolute;top:50%;z-index:6;display:flex;align-items:center;gap:15px;padding:12px 0;border:0;background:transparent;color:var(--intro);opacity:0;transform:translateY(-50%);cursor:pointer;pointer-events:none;transition:opacity 260ms ease}")
s=s.replace(".edge-nav i{display:block;width:34px;height:1px;background:currentColor;opacity:.72;transition:width 360ms var(--ease),height 220ms ease,opacity 260ms ease}", ".edge-nav i{display:block;width:34px;height:2px;background:currentColor;opacity:1;transition:width 360ms var(--ease)}")
s=s.replace(".image-carousel:hover .edge-nav,.coffee-slide.is-detail .edge-nav,.olive-image-carousel:hover .edge-nav,.olive-slide.is-detail .edge-nav{opacity:.72;pointer-events:auto}", ".image-carousel:hover .edge-nav,.coffee-slide.is-detail .edge-nav,.olive-image-carousel:hover .edge-nav,.olive-slide.is-detail .edge-nav{opacity:1;pointer-events:auto}")
s=s.replace(".edge-nav:hover{opacity:1!important;gap:15px}\n.edge-nav:hover i{width:48px;height:2px;opacity:1}", ".edge-nav:hover{opacity:1!important}\n.edge-nav:hover i{width:48px}")
s=s.replace(".coffee-slide.is-detail .edge-nav{opacity:.72}.edge-nav{gap:8px}", ".coffee-slide.is-detail .edge-nav{opacity:1}.edge-nav{gap:10px}")
style.write_text(s)

index=Path('index.html')
s=index.read_text().replace('style.css?v=202608171409','style.css?v=202608171417')
index.write_text(s)
