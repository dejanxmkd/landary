const main=document.getElementById('cinematic-scroll');
const hero=document.querySelector('.hero__content');
const story=document.querySelector('.story__copy');
const product=document.querySelector('.product');
const productImage=product.querySelector('img');

async function loadProductImage(){
  const parts=await Promise.all(Array.from({length:8},(_,i)=>i+1).map(async n=>{
    const response=await fetch(`./assets/product-v2/${String(n).padStart(2,'0')}.txt`);
    if(!response.ok) throw new Error('Product image failed to load');
    return response.text();
  }));
  const raw=atob(parts.join(''));
  const bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  productImage.src=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
}
loadProductImage().catch(console.error);

const clamp=(v,min=0,max=1)=>Math.min(Math.max(v,min),max);
const map=(p,a,b)=>clamp((p-a)/(b-a));
const lerp=(a,b,t)=>a+(b-a)*t;
function render(){
  const maxScroll=Math.max(main.offsetHeight-window.innerHeight,1),p=clamp(window.scrollY/maxScroll),heroOut=map(p,.08,.24);
  hero.style.opacity=1-heroOut;
  hero.style.filter=`blur(${lerp(0,20,heroOut)}px)`;
  hero.style.transform=`translateY(${lerp(0,-72,heroOut)}px) scale(${lerp(1,.975,heroOut)})`;
  const storyIn=map(p,.30,.44),storyOut=map(p,.53,.66);let o,y,b,s;
  if(p<.53){o=storyIn;y=lerp(70,0,storyIn);b=lerp(20,0,storyIn);s=lerp(.98,1,storyIn)}else{o=1-storyOut;y=lerp(0,-76,storyOut);b=lerp(0,18,storyOut);s=lerp(1,.985,storyOut)}
  story.style.opacity=o;story.style.filter=`blur(${b}px)`;story.style.transform=`translateY(${y}px) scale(${s})`;
  const productIn=map(p,.47,.74),mobile=window.innerWidth<=640,targetX=mobile?0:-window.innerWidth*.25,targetY=window.innerHeight*.07,startScale=mobile?.25:.22,targetScale=mobile?.92:1;
  product.style.opacity=productIn;
  product.style.filter=`blur(${lerp(20,0,productIn)}px)`;
  product.style.transform=`translate(calc(-50% + ${lerp(0,targetX,productIn)}px),calc(-50% + ${lerp(0,targetY,productIn)}px)) scale(${lerp(startScale,targetScale,productIn)})`;
}
let ticking=false;
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{render();ticking=false})}
render();
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',render);