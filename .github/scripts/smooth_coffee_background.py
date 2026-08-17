from pathlib import Path

js=Path('app.js')
s=js.read_text()

needle="""  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    activeIndex=Math.max(0,Math.min(PRODUCTS.length-1,Math.round(exact)));
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;
  }
"""
replacement="""  const coffeeSticky=coffeeSection.querySelector('.coffee-sticky');
  const colorRgb=PRODUCTS.map(product=>{
    const hex=product.color.replace('#','');
    return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];
  });

  function renderHorizontal(){
    const{start,distance}=sectionMetrics();
    const progress=Math.max(0,Math.min(1,(scrollY-start)/distance));
    const exact=progress*(PRODUCTS.length-1);
    activeIndex=Math.max(0,Math.min(PRODUCTS.length-1,Math.round(exact)));
    track.style.transform=`translate3d(${-exact*100}vw,0,0)`;

    if(coffeeSticky){
      const from=Math.min(PRODUCTS.length-1,Math.floor(exact));
      const to=Math.min(PRODUCTS.length-1,from+1);
      const mix=exact-from;
      const a=colorRgb[from],b=colorRgb[to];
      const r=Math.round(a[0]+(b[0]-a[0])*mix);
      const g=Math.round(a[1]+(b[1]-a[1])*mix);
      const bl=Math.round(a[2]+(b[2]-a[2])*mix);
      coffeeSticky.style.backgroundColor=`rgb(${r} ${g} ${bl})`;
    }
  }
"""
if needle not in s:
    raise SystemExit('renderHorizontal block not found')
s=s.replace(needle,replacement,1)
js.write_text(s)

css=Path('style.css')
c=css.read_text()
old=".coffee-sticky{position:sticky;top:0;width:100%;height:100dvh;min-height:100svh;overflow:hidden}"
new=".coffee-sticky{position:sticky;top:0;width:100%;height:100dvh;min-height:100svh;overflow:hidden;background:#4D6E48}"
if old not in c:
    raise SystemExit('coffee-sticky rule not found')
c=c.replace(old,new,1)
old2=".coffee-slide{--accent:#4D6E48;position:relative;flex:0 0 100vw;width:100vw;height:100dvh;min-height:100svh;background:var(--accent);overflow:hidden}"
new2=".coffee-slide{--accent:#4D6E48;position:relative;flex:0 0 100vw;width:100vw;height:100dvh;min-height:100svh;background:transparent;overflow:hidden}"
if old2 not in c:
    raise SystemExit('coffee-slide rule not found')
c=c.replace(old2,new2,1)
css.write_text(c)
