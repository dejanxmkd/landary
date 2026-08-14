from pathlib import Path

p=Path('app.js')
s=p.read_text()

anchor="""  const GRIND_IMAGES=[
    {Ground:PRODUCT_IMAGES.brazil.Ground,'Whole Bean':PRODUCT_IMAGES.brazil['Whole Bean']},
    {Ground:PRODUCT_IMAGES['french-vanilla'],'Whole Bean':PRODUCT_IMAGES['french-vanilla']},
    {Ground:'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png','Whole Bean':'./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-front.png'},
    {Ground:'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png','Whole Bean':'./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-front.png'},
    {Ground:PRODUCT_IMAGES.hazelnut,'Whole Bean':PRODUCT_IMAGES.hazelnut},
    {Ground:PRODUCT_IMAGES['espresso-roast'],'Whole Bean':PRODUCT_IMAGES['espresso-roast']}
  ];"""
if anchor not in s:
    raise SystemExit('GRIND_IMAGES block not found')

detail_images=anchor+"""
  const DETAIL_IMAGES=[
    {
      Ground:['./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-front.png','./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-ground-back.png'],
      'Whole Bean':['./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-front.png','./assets/product_images/giannos-brazil-roast/Giannos Brazil Roast/giannos-brazil-whole-back.png']
    },
    {
      Ground:['./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-front.png','./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-back.png'],
      'Whole Bean':['./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-front.png','./assets/product_images/giannos-french-vanilla/Giannos French Vanilla/giannos-french-vanilla-ground-back.png']
    },
    {
      Ground:['./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-front.png','./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-ground-back.png'],
      'Whole Bean':['./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-front.png','./assets/product_images/giannos-colombian-roast/Giannos Colombian Roast/giannos-colombia-whole-back.png']
    },
    {
      Ground:['./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-front.png','./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-ground-back.png'],
      'Whole Bean':['./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-front.png','./assets/product_images/giannos-original-roast/Giannos Original Roast/giannos-original-whole-back.png']
    },
    {
      Ground:['./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-front.png','./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png'],
      'Whole Bean':['./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-front.png','./assets/product_images/giannos-hazelnut/Giannos Hazelnut/giannos-hazelnut-ground-back.png']
    },
    {
      Ground:['./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-front.png','./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png'],
      'Whole Bean':['./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-front.png','./assets/product_images/giannos-espresso-roast/Giannos Espresso Roast/giannos-espresso-whole-back.png']
    }
  ];"""
s=s.replace(anchor,detail_images,1)

old_sync="""  function syncDetailContent(index){
    const values=PRODUCT_DETAILS[index]||PRODUCT_DETAILS[0];
    detailMetaValues.forEach((el,i)=>{el.textContent=values[i]||'—'});
    const image=items[index]?.product?.querySelector('img');
    const selected=document.querySelector('.choice-tab.is-selected')?.dataset.grind||'Ground';
    const variants=GRIND_IMAGES[index];
    if(image&&variants)image.src=variants[selected]||variants.Ground||variants['Whole Bean'];
  }"""
new_sync="""  function selectedGrind(){return document.querySelector('.choice-tab.is-selected')?.dataset.grind||'Ground'}
  function detailPair(index,grind=selectedGrind()){
    const variants=DETAIL_IMAGES[index];
    return variants?.[grind]||variants?.Ground||variants?.['Whole Bean']||[];
  }
  function syncDetailImages(index){
    const {product}=items[index]||{};
    const gallery=product?.parentElement;
    const pair=detailPair(index);
    const front=product?.querySelector('img');
    if(front&&pair[0])front.src=pair[0];
    if(!gallery)return;
    let secondary=gallery.querySelector('.detail-product-secondary');
    if(pair[1]){
      if(!secondary){
        secondary=document.createElement('figure');
        secondary.className='product detail-product-secondary';
        const image=document.createElement('img');
        image.alt=`${items[index]?.copy?.querySelector('.product-copy__title')?.textContent||'Coffee'} back`; 
        secondary.appendChild(image);
        gallery.appendChild(secondary);
      }
      const back=secondary.querySelector('img');
      if(back)back.src=pair[1];
    }else if(secondary){secondary.remove()}
  }
  function removeDetailSecondary(index){
    const gallery=items[index]?.product?.parentElement;
    gallery?.querySelector('.detail-product-secondary')?.remove();
    if(gallery)gallery.scrollTop=0;
  }
  function syncDetailContent(index){
    const values=PRODUCT_DETAILS[index]||PRODUCT_DETAILS[0];
    detailMetaValues.forEach((el,i)=>{el.textContent=values[i]||'—'});
    syncDetailImages(index);
  }"""
if old_sync not in s:
    raise SystemExit('syncDetailContent block not found')
s=s.replace(old_sync,new_sync,1)

old_open="""    panel.classList.add('is-detail');
    panel.style.zIndex='10';panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform='translateX(0)';panel.style.pointerEvents='auto';"""
new_open="""    panel.classList.add('is-detail');
    const gallery=product.parentElement;
    if(gallery)gallery.scrollTop=0;
    panel.style.zIndex='10';panel.style.opacity='1';panel.style.filter='blur(0)';panel.style.transform='translateX(0)';panel.style.pointerEvents='auto';"""
if old_open not in s:
    raise SystemExit('open detail panel block not found')
s=s.replace(old_open,new_open,1)

old_close="""    copy.style.top='';copy.style.height='';copy.style.paddingTop='';copy.style.paddingBottom='';
    panel.classList.remove('is-detail');
    renderScene();"""
new_close="""    copy.style.top='';copy.style.height='';copy.style.paddingTop='';copy.style.paddingBottom='';
    removeDetailSecondary(detailIndex);
    panel.classList.remove('is-detail');
    renderScene();"""
if old_close not in s:
    raise SystemExit('close detail block not found')
s=s.replace(old_close,new_close,1)

old_grind="""  grindOptions.forEach(button=>button.addEventListener('click',()=>{grindOptions.forEach(item=>item.classList.toggle('is-selected',item===button));const index=detailOpen?detailIndex:activeCoffeeIndex(),image=items[index]?.product?.querySelector('img'),variants=GRIND_IMAGES[index],src=variants?.[button.dataset.grind];if(image&&src)image.src=src}));"""
new_grind="""  grindOptions.forEach(button=>button.addEventListener('click',()=>{
    grindOptions.forEach(item=>item.classList.toggle('is-selected',item===button));
    const index=detailOpen?detailIndex:activeCoffeeIndex();
    if(detailOpen){syncDetailImages(index);return}
    const image=items[index]?.product?.querySelector('img'),variants=GRIND_IMAGES[index],src=variants?.[button.dataset.grind];
    if(image&&src)image.src=src;
  }));"""
if old_grind not in s:
    raise SystemExit('grind listener not found')
s=s.replace(old_grind,new_grind,1)

p.write_text(s)
