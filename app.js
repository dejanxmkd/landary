const main = document.getElementById('cinematic-scroll');
const hero = document.querySelector('.hero__content');
const story = document.querySelector('.story__copy');
const product = document.querySelector('.product');

const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);
const map = (p, a, b) => clamp((p - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;

function render() {
  const maxScroll = Math.max(main.offsetHeight - window.innerHeight, 1);
  const p = clamp(window.scrollY / maxScroll);

  const heroOut = map(p, 0.08, 0.24);
  hero.style.opacity = 1 - heroOut;
  hero.style.filter = `blur(${lerp(0, 20, heroOut)}px)`;
  hero.style.transform = `translateY(${lerp(0, -72, heroOut)}px) scale(${lerp(1, .975, heroOut)})`;

  const storyIn = map(p, 0.30, 0.44);
  const storyOut = map(p, 0.53, 0.66);
  let storyOpacity;
  let storyY;
  let storyBlur;
  let storyScale;

  if (p < 0.53) {
    storyOpacity = storyIn;
    storyY = lerp(70, 0, storyIn);
    storyBlur = lerp(20, 0, storyIn);
    storyScale = lerp(.98, 1, storyIn);
  } else {
    storyOpacity = 1 - storyOut;
    storyY = lerp(0, -76, storyOut);
    storyBlur = lerp(0, 18, storyOut);
    storyScale = lerp(1, .985, storyOut);
  }

  story.style.opacity = storyOpacity;
  story.style.filter = `blur(${storyBlur}px)`;
  story.style.transform = `translateY(${storyY}px) scale(${storyScale})`;

  const productIn = map(p, 0.49, 0.78);
  const mobile = window.innerWidth <= 640;
  const targetX = mobile ? 0 : -window.innerWidth * 0.25;
  const targetY = window.innerHeight * 0.07;
  const startScale = mobile ? .25 : .22;
  const targetScale = mobile ? .92 : 1;

  product.style.opacity = productIn;
  product.style.filter = `blur(${lerp(20, 0, productIn)}px)`;
  product.style.transform = `translate(calc(-50% + ${lerp(0, targetX, productIn)}px), calc(-50% + ${lerp(0, targetY, productIn)}px)) scale(${lerp(startScale, targetScale, productIn)})`;
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    render();
    ticking = false;
  });
}

render();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', render);
