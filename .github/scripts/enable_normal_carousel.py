from pathlib import Path

js=Path('app.js')
s=js.read_text()
s=s.replace("      if(!slide.classList.contains('is-detail'))return;\n      setImage(index,state[index].image===0?1:0);", "      setImage(index,state[index].image===0?1:0);", 1)
s=s.replace("      if(!slide.classList.contains('is-detail'))return;\n      setImage(index,state[index].image===1?0:1);", "      setImage(index,state[index].image===1?0:1);", 1)
s=s.replace("      if(!slide.classList.contains('is-detail'))return;\n      if(event.button!==undefined&&event.button!==0)return;", "      if(event.button!==undefined&&event.button!==0)return;", 1)
js.write_text(s)

css=Path('style.css')
c=css.read_text()
c=c.replace(".image-carousel:hover .carousel-arrow{opacity:1;transform:translateY(-50%) scale(1)}", ".image-carousel:hover .carousel-arrow{opacity:1;transform:translateY(-50%) scale(1);pointer-events:auto}", 1)
c=c.replace(".product-dot.is-active{background:#fff;transform:scaleX(1.08)}", ".product-dot.is-active{background:#fff;transform:scaleX(1.08)}\n.image-carousel:hover .product-dots{opacity:1;pointer-events:auto}", 1)
css.write_text(c)
