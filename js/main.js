/* ==========================================================================
   PULDIGI - main.js (redesign)
   Nav · hé lộ khi cuộn · đếm số · parallax chuột · portfolio ghim · lightbox · form
   Không dùng thư viện ngoài.
   ========================================================================== */

/* ==== CẤU HÌNH FORM ====
   Dán URL Google Apps Script (Web app, "Anyone") vào đây. Script cần trả JSON {"ok":true}.
   Chưa có endpoint thì form KHÔNG báo thành công giả, mà hướng khách nhắn Zalo.   */
const FORM_ENDPOINT = "";

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- NAV: nền kem khi rời đầu trang + scroll-spy ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('#toggle'), menu = $('#navmenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#navmenu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
  }));

  const spyLinks = $$('[data-spy]');
  const spyIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      spyLinks.forEach(a => a.classList.toggle('active', a.dataset.spy === e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['services', 'process', 'work'].forEach(id => { const el = document.getElementById(id); if (el) spyIO.observe(el); });
  // rời khỏi 3 mục thì bỏ gạch chân
  const clearIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) spyLinks.forEach(a => a.classList.remove('active')); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['top', 'ideas', 'video', 'results', 'pricing', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) clearIO.observe(el); });

  /* ---------- HÉ LỘ KHI CUỘN ---------- */
  // danh sách dịch vụ: 500ms, cách 80ms; bảng giá: 200ms, cách 200ms
  $$('.svc-row').forEach((el, i) => el.style.transitionDelay = '0s,' + (i * 80) + 'ms,' + (i * 80) + 'ms');
  $$('.price').forEach((el, i) => el.style.transitionDelay = (i * 200) + 'ms,' + (i * 200) + 'ms,0s,0s');
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.svc-row,.price,.reveal,.video-card,.draw').forEach(el => revealIO.observe(el));
  // sau khi hiện xong, trả transition-delay về 0 để hover không bị trễ
  $$('.svc-row,.price').forEach(el => el.addEventListener('transitionend', e => {
    if (e.propertyName === 'opacity') el.style.transitionDelay = '0s';
  }));

  /* ---------- ĐẾM SỐ (1 lần, ~1.4s), giữ định dạng "398,1K" ---------- */
  const fmt = (v, d) => v.toFixed(d).replace('.', ',');
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; countIO.unobserve(el);
      const raw = el.dataset.count, target = parseFloat(raw), suf = el.dataset.suffix || '';
      const d = (raw.split('.')[1] || '').length, dur = 1400, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1), k = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * k, d) + suf;
        if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target, d) + suf;
      };
      el.textContent = fmt(0, d) + suf;
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('.stat-val').forEach(el => countIO.observe(el));

  /* ---------- PARALLAX CHUỘT Ở THẺ ẢNH HERO (nhẹ, theo chuột, không theo cuộn) ---------- */
  const stack = $('#heroStack');
  if (stack && window.matchMedia('(hover:hover)').matches) {
    const hero = $('#top');
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    const loop = () => {
      cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
      stack.style.setProperty('--mx', cx.toFixed(3)); stack.style.setProperty('--my', cy.toFixed(3));
      raf = (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) ? requestAnimationFrame(loop) : null;
    };
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2; ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---------- PORTFOLIO: ghim + trượt ngang (desktop), mobile vuốt native ---------- */
  const work = $('#work'), track = $('#workTrack'), bar = $('#workBar');
  if (work && track) {
    const sizeWork = () => {
      if (window.innerWidth <= 860) { work.style.height = ''; track.style.transform = ''; return; }
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      work.style.height = (window.innerHeight + maxX) + 'px';
    };
    const slide = () => {
      if (window.innerWidth <= 860) return;
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      const total = work.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -work.getBoundingClientRect().top / total));
      track.style.transform = 'translateX(' + (-p * maxX).toFixed(1) + 'px)';
      if (bar) bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    };
    sizeWork(); slide();
    window.addEventListener('scroll', slide, { passive: true });
    window.addEventListener('resize', () => { sizeWork(); slide(); });
    window.addEventListener('load', () => { sizeWork(); slide(); });
    $$('img', track).forEach(i => i.addEventListener('load', () => { sizeWork(); slide(); }));
  }

  /* ---------- LIGHTBOX VIDEO (250ms, nút đóng + Esc) ---------- */
  const lb = $('#lightbox'), lbInner = $('#lbInner'), lbClose = $('#lbClose');
  let lastFocus = null;
  const openVideo = src => {
    lastFocus = document.activeElement;
    lbInner.innerHTML = '<video src="' + src + '" controls autoplay playsinline preload="metadata"></video>';
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; lbClose.focus();
  };
  const closeVideo = () => {
    if (!lb.classList.contains('open')) return;
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbInner.innerHTML = ''; }, 250);
    if (lastFocus) lastFocus.focus();
  };
  const vcard = $('#videoCard');
  if (vcard) vcard.addEventListener('click', () => openVideo(vcard.dataset.video));
  const vcardHero = $('#videoCardHero');
  if (vcardHero) vcardHero.addEventListener('click', () => openVideo(vcardHero.dataset.video));
  lbClose.addEventListener('click', closeVideo);
  lb.addEventListener('click', e => { if (e.target === lb) closeVideo(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });

  /* ---------- FORM LIÊN HỆ ----------
     Chỉ báo thành công khi máy chủ xác nhận (HTTP ok và JSON ok:true).
     Chưa có FORM_ENDPOINT: báo rõ chưa gửi được, hướng sang Zalo/email.            */
  const form = $('#leadForm'), note = $('#formNote'), btn = $('#submitBtn'), btnT = $('.btn-t', btn);
  const say = (msg, cls) => { note.className = 'form-note ' + (cls || ''); note.textContent = msg; };
  const zaloMsg = 'Chưa gửi được. Vui lòng nhắn Zalo 0972 177 282 hoặc email nhungkim2468@gmail.com.';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    say('');
    if (form.website.value.trim() !== '') return;               // honeypot
    if (!form.name.value.trim() || !form.contact.value.trim()) {
      say('Vui lòng nhập họ tên và số điện thoại hoặc email.', 'err'); return;
    }
    const data = {
      name: form.name.value.trim(), contact: form.contact.value.trim(),
      service: form.service.value, message: form.message.value.trim(),
      time: new Date().toLocaleString('vi-VN')
    };
    if (!FORM_ENDPOINT) {
      // Chưa nối backend: mở sẵn email đã điền để khách gửi bằng 1 cú bấm.
      const sub = 'Yêu cầu tư vấn - ' + data.service + ' - ' + data.name;
      const body =
        'Họ tên: ' + data.name + '\n' +
        'Liên hệ: ' + data.contact + '\n' +
        'Dịch vụ: ' + data.service + '\n' +
        'Nội dung: ' + (data.message || '(chưa ghi)') + '\n' +
        'Thời gian: ' + data.time;
      window.location.href = 'mailto:nhungkim2468@gmail.com?subject=' +
        encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
      say('Đang mở email đã điền sẵn. Hoặc nhắn nhanh Zalo 0972 177 282.', 'ok');
      return;
    }

    btn.disabled = true; btnT.textContent = 'Đang xử lý...';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data)
      });
      const j = await res.json();
      if (!res.ok || !(j && (j.ok === true || j.result === 'success'))) throw new Error('not-confirmed');
      say('Đã nhận thông tin. Puldigi sẽ phản hồi trong vòng 24 giờ.', 'ok');
      form.reset();
    } catch (err) {
      say(zaloMsg, 'err');
    } finally {
      btn.disabled = false; btnT.textContent = 'Gửi yêu cầu';
    }
  });

  /* ---------- ① đèn spotlight theo chuột (mục nền đen) ---------- */
  const ideas = $('#ideas'), spot = ideas && $('.spot', ideas);
  if (ideas && spot) {
    ideas.addEventListener('mousemove', e => {
      const r = ideas.getBoundingClientRect();
      spot.style.left = (e.clientX - r.left) + 'px';
      spot.style.top = (e.clientY - r.top) + 'px';
      spot.style.opacity = '1';
    });
    ideas.addEventListener('mouseleave', () => {
      spot.style.opacity = '.6'; spot.style.left = '50%'; spot.style.top = '50%';
    });
  }

  /* ---------- ④ thẻ bảng giá nghiêng 3D theo chuột ---------- */
  $$('.price').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = 'rotateY(' + (px * 8).toFixed(2) + 'deg) rotateX(' + (-py * 8).toFixed(2) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
});
