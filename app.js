const animationStylesheet = document.createElement('link');
animationStylesheet.rel = 'stylesheet';
animationStylesheet.href = 'animations.css';
document.head.appendChild(animationStylesheet);

const toast = document.querySelector('.toast');
let toastTimer;

document.querySelectorAll('[data-coming-soon]').forEach((card) => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    const name = card.dataset.comingSoon;
    if (!toast) return;
    toast.textContent = `${name} patterns are next in the library.`;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  });
});
