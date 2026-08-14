from pathlib import Path
import re

# INDEX: same structure and View Details trigger for every coffee.
p=Path('index.html')
h=p.read_text()
products=[
    ('vanilla','french-vanilla','Giannos French Vanilla coffee bag',1),
    ('colombian','colombian-roast','Giannos Colombian Roast coffee bag',2),
    ('original','original-roast','Giannos Original Roast coffee bag',3),
    ('hazelnut','hazelnut','Giannos Hazelnut coffee bag',4),
    ('espresso','espresso-roast','Giannos Espresso Roast coffee bag',5),
]
for cls,key,alt,index in products:
    old=f'<div class="coffee-panel coffee-panel--{cls}"><figure class="product product--ready"><img data-coffee-image="{key}" alt="{alt}"></figure>'
    new=f'<div class="coffee-panel coffee-panel--{cls}"><div class="product-gallery" data-product-gallery><figure class="product product--ready"><img data-coffee-image="{key}" alt="{alt}"></figure></div>'
    if old not in h:
        raise SystemExit(f'panel structure not found: {cls}')
    h=h.replace(old,new,1)

h=h.replace('data-open-product>View Details</a>','data-open-product="0">View Details</a>',1)
for index in range(1,6):
    needle='<a class="product-copy__details" href="#">View Details</a>'
    if needle not in h:
        raise SystemExit(f'View Details link {index} not found')
    h=h.replace(needle,f'<a class="product-copy__details" href="#" data-open-product="{index}">View Details</a>',1)
p.write_text(h)

# CSS: Brazil detail layout becomes the generic coffee detail layout.
p=Path('style.css')
c=p.read_text().replace('.coffee-panel--brazil.is-detail','.coffee-panel.is-detail')
p.write_text(c)

# APP: current progress-based scroll system, generic shared details.
p=Path('app.js')
s=p.read_text()

anchor="  const brazilDescription=brazil.querySelector('.product-copy__description');"
insert="""  const brazilDescription=brazil.querySelector('.product-copy__description');
  const detailBack=document.querySelector('[data-close-product]');
  const inlineDetail=document.querySelector('[data-inline-detail]');
  const detailMetaValues=[...document.querySelectorAll('.detail-meta dd')];
  const PRODUCT_DETAILS=[
    ['Chocolate, caramel and naturally sweet body','Medium','12 ounces'],
    ['Rich vanilla, subtle nuttiness and creamy finish','Medium','12 ounces'],
    ['Milk chocolate, citrus and a smooth finish','Medium','12 ounces'],
    ['Rich aroma, layered flavor and a hint of sweetness','Medium','12 ounces'],
    ['Earthy sweetness and warm roasted hazelnut','Medium','12 ounces'],
    ['Rich aroma, layered flavor and a rounded finish','Medium','12 ounces']
  ];"""
if anchor not in s:
    raise SystemExit('detail anchor not found')
s=s.replace(anchor,insert,1)

m=re.search(r"  const PRODUCT_IMAGES=\{.*?\n  \};",s,re.S)
if not m:
    raise SystemExit('PRODUCT_IMAGES not found')
variants="""
  const GRIND_IMAGES=[
    {Ground:PRODUCT_IMAGES.brazil.Ground,'Whole Bean':PRODUCT_IMAGES.brazil['Whole Bean']},
    {Ground:PRODUCT_IMAGES['french-vanilla'],'Whole Bean':PRODUCT_IMAGES['french-vanilla']},
    {Ground:'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png','Whole Bean':'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-front.png'},
    {Ground:'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png','Whole Bean':'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-front.png'},
    {Ground:PRODUCT_IMAGES.hazelnut,'Whole Bean':PRODUCT_IMAGES.hazelnut},
    {Ground:PRODUCT_IMAGES['espresso-roast'],'Whole Bean':PRODUCT_IMAGES['espresso-roast']}
  ];"""
s=s[:m.end()]+variants+s[m.end():]

s=s.replace('  let detailOpen=false;','  let detailOpen=false;\n  let detailIndex=0;',1)

# Generic active-index helper.
needle="  const progress=()=>clamp(scrollY/maxScroll());"
replacement="""  const progress=()=>clamp(scrollY/maxScroll());
  const currentCoffeePhase=()=>map(progress(),COFFEE_START,COFFEE_END)*(panels.length-1);
  const activeCoffeeIndex=()=>Math.max(0,Math.min(panels.length-1,Math.round(currentCoffeePhase())));"""
if needle not in s: raise SystemExit('progress helper not found')
s=s.replace(needle,replacement,1)

# Replace Brazil-specific animate helper with generic helper.
s,count=re.subn(
    r"  function animateVertical\(before,done\)\{.*?\n  \}\n  const afterLayout=",
    """  function animateVerticalFor(els,before,done){
    const animations=[];
    els.forEach((el,index)=>{
      if(!el||!before[index])return;
      const after=el.getBoundingClientRect();
      const dy=before[index].top-after.top;
      if(Math.abs(dy)<1)return;
      animations.push(el.animate([{translate:`0 ${dy}px`},{translate:'0 0'}],{duration:MORPH,easing:EASE,fill:'both'}));
    });
    Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(()=>{
      animations.forEach(a=>a.cancel());
      done?.();
    });
  }
  const afterLayout=""",
    s,count=1,flags=re.S)
if count!=1: raise SystemExit('animateVertical block not found')

# Replace Brazil-only collapse/open/close block.
start=s.find('  function collapseDescription(')
end=s.find('  const purchaseCards=',start)
if start<0 or end<0: raise SystemExit('detail block not found')
generic="""  function collapseDescription(description,collapsed){
    if(!description)return;
    description.style.transition=`opacity ${MORPH}ms ${EASE},transform ${MORPH}ms ${EASE},max-height ${MORPH}ms ${EASE},margin ${MORPH}ms ${EASE}`;
    if(collapsed){description.style.maxHeight='0';description.style.marginTop='0';description.style.opacity='0';description.style.transform='translateY(-28px)';description.style.overflow='hidden'}
    else{description.style.maxHeight='220px';description.style.marginTop='24px';description.style.opacity='1';description.style.transform='translateY(0)';description.style.overflow='hidden'}
  }
  function syncDetailContent(index){
    const values=PRODUCT_DETAILS[index]||PRODUCT_DETAILS[0];
    detailMetaValues.forEach((el,i)=>{el.textContent=values[i]||'—'});
    const image=items[index]?.product?.querySelector('img');
    const selected=document.querySelector('.choice-tab.is-selected')?.dataset.grind||'Ground';
    const variants=GRIND_IMAGES[index];
    if(image&&variants)image.src=variants[selected]||variants.Ground||variants['Whole Bean'];
  }
  function openDetail(e){
    e?.preventDefault();
    if(detailOpen)return;
    const phase=currentCoffeePhase();
    const index=activeCoffeeIndex();
    if(Math.abs(phase-index)>.42)return;
    const {panel,product,copy}=items[index];
    if(!panel||!product||!copy)return;
    const description=copy.querySelector('.product-copy__description');
    if(detailBack&&detailBack.parentElement!==copy)copy.insertBefore(detailBack,copy.firstChild);
    if(inlineDetail&&inlineDetail.parentElement!==copy)copy.appendChild(inlineDetail);
    syncDetailContent(index);
    const before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];
    detailOpen=true;
    detailIndex=index;
    document.body.classList.add('detail-open');
    panel.classList.add('is-detail');
    panel.style.zIndex='10';panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform='translateX(0)';panel.style.pointerEvents='auto';
    product.style.transition='none';product.style.opacity='1';product.style.filter='blur(0)';product.style.transform='translateX(-50%)';
    copy.style.transition='none';copy.style.opacity='1';copy.style.filter='blur(0)';copy.style.transform='none';
    if(innerWidth>840){copy.style.top='0';copy.style.height='100svh';copy.style.paddingTop='32px';copy.style.paddingBottom='32px'}
    afterLayout(()=>{animateVerticalFor([product,copy],before);requestAnimationFrame(()=>collapseDescription(description,true))});
  }
  function closeDetail(){
    if(!detailOpen)return;
    const {panel,product,copy}=items[detailIndex];
    if(!panel||!product||!copy)return;
    const description=copy.querySelector('.product-copy__description');
    const before=[product.getBoundingClientRect(),copy.getBoundingClientRect()];
    detailOpen=false;
    collapseDescription(description,false);
    document.body.classList.remove('detail-open');
    copy.style.top='';copy.style.height='';copy.style.paddingTop='';copy.style.paddingBottom='';
    panel.classList.remove('is-detail');
    renderScene();
    afterLayout(()=>animateVerticalFor([product,copy],before,()=>{
      setTimeout(()=>{if(!description)return;description.style.transition='';description.style.maxHeight='';description.style.marginTop='';description.style.opacity='';description.style.transform='';description.style.overflow=''},80);
    }));
  }

"""
s=s[:start]+generic+s[end:]

# Grind changes the active detail product's image.
old="  grindOptions.forEach(button=>button.addEventListener('click',()=>{grindOptions.forEach(item=>item.classList.toggle('is-selected',item===button));const src=PRODUCT_IMAGES.brazil[button.dataset.grind];if(brazilImage&&src)brazilImage.src=src}));"
new="  grindOptions.forEach(button=>button.addEventListener('click',()=>{grindOptions.forEach(item=>item.classList.toggle('is-selected',item===button));const index=detailOpen?detailIndex:activeCoffeeIndex(),image=items[index]?.product?.querySelector('img'),variants=GRIND_IMAGES[index],src=variants?.[button.dataset.grind];if(image&&src)image.src=src}));"
if old not in s: raise SystemExit('grind listener not found')
s=s.replace(old,new,1)

# Every View Details link opens the shared detail component.
old="""  document.querySelector('[data-open-product]')?.addEventListener('click',openDetail);
  document.querySelector('[data-close-product]')?.addEventListener('click',closeDetail);
  document.querySelectorAll('.product-copy__details:not([data-open-product])').forEach(link=>link.addEventListener('click',e=>e.preventDefault()));"""
new="""  document.querySelectorAll('[data-open-product]').forEach(link=>link.addEventListener('click',openDetail));
  document.querySelector('[data-close-product]')?.addEventListener('click',closeDetail);"""
if old not in s: raise SystemExit('detail listeners not found')
s=s.replace(old,new,1)

s=s.replace("  brazil.classList.remove('is-detail');","  panels.forEach(panel=>panel.classList.remove('is-detail'));",1)
p.write_text(s)
