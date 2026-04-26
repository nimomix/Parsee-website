// Parsee marketing site — minimal interactivity.
// 1) IntersectionObserver-driven fade-in for .fade-in elements.
// 2) Falls back gracefully when IntersectionObserver isn't available
//    (everything appears immediately, no transforms).

(function () {
  const FADE_SELECTOR = '.fade-in';

  // Reduced-motion users get instant visibility — never observe.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll(FADE_SELECTOR).forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  document.querySelectorAll(FADE_SELECTOR).forEach(el => observer.observe(el));
})();
