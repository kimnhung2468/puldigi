/* ============================================================
   puldigi — Light  •  Scroll interactions (GSAP + ScrollTrigger)
   ============================================================ */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Sticky nav shadow ---- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('stuck', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const menuBtn = document.querySelector('.menu-btn');
  const links   = document.querySelector('.nav-links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ---- Scroll-spy (menu active theo mục đang xem) ---- */
  const navA = [...document.querySelectorAll('.nav-links a[data-spy]')];
  const secs = navA.map(a => document.getElementById(a.dataset.spy)).filter(Boolean);
  if ('IntersectionObserver' in window && secs.length) {
    const spy = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting)
        navA.forEach(l => l.classList.toggle('active', l.dataset.spy === e.target.id)); });
    }, { rootMargin: '-50% 0px -48% 0px' });
    secs.forEach(s => spy.observe(s));
  }

  /* ---- GSAP ---- */
  if (typeof gsap === 'undefined' || reduce) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    ScrollTrigger.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter: () => gsap.to(el, {
        opacity: 1, y: 0, duration: .95, delay, ease: 'power3.out',
        onStart: () => el.classList.add('in')
      })
    });
  });

  /* ---- Đếm số (nếu có thẻ data-count) ---- */
  gsap.utils.toArray('[data-count]').forEach((node) => {
    const end = parseFloat(node.dataset.count);
    ScrollTrigger.create({
      trigger: node, start: 'top 92%', once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out',
          onUpdate: () => { node.textContent = Math.round(o.v); } });
      }
    });
  });

  /* ---- Parallax nhẹ: ảnh hero + chữ P banner ---- */
  const vis = document.querySelector('.hero-visual');
  if (vis) gsap.to(vis, { yPercent: -9, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  const letter = document.querySelector('.about-letter');
  if (letter) gsap.to(letter, { yPercent: -20, ease: 'none',
    scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---- Vẽ đường timeline quy trình khi cuộn ---- */
  const prog = document.querySelector('.flow-prog');
  if (prog) gsap.to(prog, { width: '78%', ease: 'none',
    scrollTrigger: { trigger: '.flow', start: 'top 72%', end: 'bottom 62%', scrub: true } });

  /* ---- Nút coral "từ tính" theo chuột (desktop) ---- */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn-coral').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25,
                     y: (e.clientY - r.top - r.height / 2) * .35, duration: .4 });
      });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.4)' }));
    });
  }
})();
