// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Trang chủ: menu trong suốt -> có nền khi cuộn xuống
  if (document.body.classList.contains('home')) {
    var onScroll = function () {
      document.body.classList.toggle('scrolled', window.scrollY > 140);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Contact form -> Web3Forms (AJAX, không chuyển trang)
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = 'Đang gửi...';
      status.classList.add('ok');

      var data = new FormData(form);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            status.className = 'form-status ok';
            status.textContent = '✓ Cảm ơn bạn! Chúng tôi đã nhận được thông tin và sẽ liên hệ sớm.';
            form.reset();
          } else {
            status.className = 'form-status err';
            status.textContent = 'Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline.';
          }
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Không gửi được, vui lòng kiểm tra kết nối mạng.';
        });
    });
  }
});
