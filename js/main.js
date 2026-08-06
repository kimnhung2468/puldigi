/* ==========================================================================
   PULDIGI — main.js
   Nav · lọc portfolio · facade video · reveal khi cuộn · gửi form
   Không dùng thư viện ngoài.
   ========================================================================== */

/* ==== CẤU HÌNH FORM ====
   Sau khi dựng Google Apps Script (xem hướng dẫn), dán URL endpoint vào đây.
   Chưa có endpoint thì form vẫn báo thành công demo và không gửi đi đâu.        */
const FORM_ENDPOINT = ""; // ví dụ: "https://script.google.com/macros/s/AKfyc.../exec"

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- CUỘN TRANG: nav đổi nền · thanh tiến trình · parallax ----------
     Gom mọi việc theo cuộn vào 1 vòng lặp (requestAnimationFrame) cho mượt.   */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    // nav
    nav.classList.toggle('scrolled', y > 30);
    // thanh tiến trình
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    // parallax nhẹ — dùng thuộc tính "translate" riêng để không đè lên
    // animation (float) hay hiệu ứng reveal (vốn dùng "transform")
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      el.style.translate = '0 ' + (y * speed).toFixed(1) + 'px';
    });
    ticking = false;
  };
  const requestScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  onScroll();

  const toggle = document.getElementById('toggle');
  const menu = document.getElementById('navmenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- REVEAL khi cuộn (stagger cho nhóm) ---------- */
  document.querySelectorAll('.stagger').forEach(group => {
    [...group.children].forEach((child, i) => {
      child.style.transitionDelay = (i * 100) + 'ms';
    });
  });
  const revealSelector = '.reveal,.reveal-up,.reveal-left,.reveal-right,.reveal-pop';
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll(revealSelector).forEach(el => io.observe(el));

  /* ---------- LỌC PORTFOLIO ---------- */
  const filters = document.querySelectorAll('.filter');
  const works = document.querySelectorAll('.work');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.filter;
      works.forEach(w => {
        const show = (type === 'all' || w.dataset.type === type);
        w.classList.toggle('hide', !show);
      });
    });
  });

  /* ---------- FACADE VIDEO (mở lightbox khi bấm) ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbInner = document.getElementById('lbInner');
  const lbClose = document.getElementById('lbClose');

  const openVideo = (src) => {
    lbInner.innerHTML =
      '<video src="' + src + '" controls autoplay playsinline preload="metadata"></video>';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeVideo = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbInner.innerHTML = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.video-facade').forEach(el => {
    el.addEventListener('click', () => openVideo(el.dataset.video));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(el.dataset.video); }
    });
  });
  lbClose.addEventListener('click', closeVideo);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeVideo(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideo(); });

  /* ---------- ĐIỆN THOẠI PHÁT VIDEO TIKTOK ----------
     - Tự phát (tắt tiếng, lặp) khi khung máy lọt vào màn hình, dừng khi ra khỏi.
     - Nút loa: bật/tắt tiếng ngay trong máy.
     - Bấm vào máy: mở video toàn màn hình (có tiếng) qua lightbox.               */
  const phone = document.getElementById('vlastaPhone');
  if (phone) {
    const pv = phone.querySelector('.phone-video');
    const soundBtn = phone.querySelector('.sound-btn');

    // tự phát / tạm dừng theo tầm nhìn (tiết kiệm pin & băng thông)
    const playIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) pv.play().catch(() => {});
        else pv.pause();
      });
    }, { threshold: 0.4 });
    playIO.observe(phone);

    // bật / tắt tiếng
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pv.muted = !pv.muted;
      phone.classList.toggle('sound', !pv.muted);
      soundBtn.setAttribute('aria-label', pv.muted ? 'Bật tiếng' : 'Tắt tiếng');
      if (!pv.muted) pv.play().catch(() => {});
    });

    // bấm vào máy -> xem toàn màn hình có tiếng
    const openPhoneVideo = () => {
      pv.pause();
      openVideo(phone.dataset.video);
    };
    phone.addEventListener('click', openPhoneVideo);
    phone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPhoneVideo(); }
    });
  }

  /* ---------- GỬI FORM ---------- */
  const form = document.getElementById('leadForm');
  const note = document.getElementById('formNote');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    note.className = 'form-note';
    note.textContent = '';

    // honeypot: nếu ô ẩn có dữ liệu -> bot -> bỏ qua
    if (form.website.value.trim() !== '') return;

    // kiểm tra tối thiểu
    if (!form.name.value.trim() || !form.contact.value.trim()) {
      note.textContent = 'Vui lòng nhập họ tên và số điện thoại/email.';
      note.classList.add('err');
      return;
    }

    const data = {
      name: form.name.value.trim(),
      contact: form.contact.value.trim(),
      service: form.service.value,
      message: form.message.value.trim(),
      time: new Date().toLocaleString('vi-VN')
    };

    // chưa cấu hình endpoint -> báo thành công demo
    if (!FORM_ENDPOINT) {
      note.textContent = 'Cảm ơn bạn! Puldigi sẽ phản hồi trong vòng 24h.';
      note.classList.add('ok');
      form.reset();
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '.7';
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      note.textContent = 'Cảm ơn bạn! Puldigi sẽ phản hồi trong vòng 24h.';
      note.classList.add('ok');
      form.reset();
    } catch (err) {
      note.textContent = 'Có lỗi khi gửi. Vui lòng nhắn Zalo 0972 177 282 giúp mình nhé.';
      note.classList.add('err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });

});
