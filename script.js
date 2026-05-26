// ============================================================
//  JOACO · Portfolio — interacciones
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Scroll reveal ---- */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('in'), i * 60);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---- Año en el footer ---- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
