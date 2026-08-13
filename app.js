const motionStyles = document.createElement('style');
motionStyles.textContent = `
.category-card__preview *{transition:transform .42s cubic-bezier(.2,.7,.2,1),box-shadow .42s cubic-bezier(.2,.7,.2,1),border-color .42s cubic-bezier(.2,.7,.2,1)}
.category-card:nth-child(1):hover .mock-window{transform:translateY(-5px) scale(1.015)}
.category-card:nth-child(1):hover .mock-copy{transform:translate(-50%,-54%)}
.category-card:nth-child(1):hover .mock-copy span{transform:scale(1.12);box-shadow:0 0 0 5px rgba(104,92,255,.12)}
.category-card:nth-child(2):hover .split-demo{transform:scale(1.025)}
.category-card:nth-child(2):hover .split-demo__media{transform:translate(-4px,-4px);box-shadow:8px 8px 0 rgba(104,92,255,.1)}
.category-card:nth-child(3):hover .cta-demo strong{transform:translateY(-4px)}
.category-card:nth-child(3):hover .cta-demo em:first-child{transform:translateY(-3px) scale(1.08);box-shadow:0 5px 14px rgba(104,92,255,.25)}
.category-card:nth-child(4):hover .bento-grid i:nth-child(1){transform:translate(-3px,-3px)}
.category-card:nth-child(4):hover .bento-grid i:nth-child(2){transform:translate(3px,-3px)}
.category-card:nth-child(4):hover .bento-grid i:nth-child(3){transform:translate(-3px,3px) scale(1.04)}
.category-card:nth-child(4):hover .bento-grid i:nth-child(4){transform:translate(3px,3px)}
.category-card:nth-child(5):hover .pricing-demo .is-featured{transform:translateY(-5px) scale(1.04);box-shadow:0 12px 30px rgba(104,92,255,.18)}
.category-card:nth-child(6):hover .mock-window--header{transform:translateY(-4px)}
.category-card:nth-child(6):hover .header-demo b{transform:translateY(-3px)}
.category-card:nth-child(7):hover .newsletter-demo>span{transform:translateY(-5px) rotate(-8deg) scale(1.12)}
.category-card:nth-child(7):hover .newsletter-demo em:last-child{transform:translateX(4px) scale(1.08)}
.category-card:nth-child(8):hover .stats-demo>div span:nth-child(1){transform:translateY(-5px)}
.category-card:nth-child(8):hover .stats-demo>div span:nth-child(2){transform:translateY(-8px)}
.category-card:nth-child(8):hover .stats-demo>div span:nth-child(3){transform:translateY(-4px)}
.category-card:nth-child(9):hover .quote-demo strong{transform:translateY(-4px)}
.category-card:nth-child(9):hover .quote-demo span{transform:translateX(5px)}
.category-card:nth-child(10):hover .blog-demo>div span:nth-child(1){transform:translateY(-5px) rotate(-1deg)}
.category-card:nth-child(10):hover .blog-demo>div span:nth-child(2){transform:translateY(-9px)}
.category-card:nth-child(10):hover .blog-demo>div span:nth-child(3){transform:translateY(-4px) rotate(1deg)}
.category-card:nth-child(11):hover .contact-demo>div span:first-child{border-color:var(--accent);transform:translateY(-2px)}
.category-card:nth-child(11):hover .contact-demo>b{transform:translateY(3px)}
.category-card:nth-child(12):hover .team-demo>div span:nth-child(1){transform:translateY(-7px) rotate(-2deg)}
.category-card:nth-child(12):hover .team-demo>div span:nth-child(2){transform:translateY(-4px)}
.category-card:nth-child(12):hover .team-demo>div span:nth-child(3){transform:translateY(-6px) rotate(2deg)}
@media(prefers-reduced-motion:reduce){.category-card__preview,.category-card__preview *{transition-duration:.01ms;transform:none!important}}
`;
document.head.appendChild(motionStyles);

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
