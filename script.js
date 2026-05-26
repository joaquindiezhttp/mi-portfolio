// ============================================================
//  JOACO · Portfolio — interacciones
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Menú móvil ---- */
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('mobile-menu');

  const closeMenu = () => {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeMenu();
    } else {
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Cerrar menú');
      document.body.style.overflow = 'hidden';
    }
  });

  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });

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
