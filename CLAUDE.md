# PULDIGI — Website cá nhân / bán dịch vụ digital marketing

Đây là brief cho Claude Code. Đọc kỹ trước khi sửa. Chủ dự án: **Nhung** (marketer, không chuyên code — luôn giải thích thuật ngữ khi dùng, giao code đầy đủ cả file, không đưa snippet rời).

## Mục tiêu website
One-page site giới thiệu dịch vụ + kiếm khách freelance. Domain **puldigi.com** (đã có ở Mắt Bão). Host dự kiến **GitHub Pages** (repo public). Nền tảng: **HTML/CSS/JS thuần, không framework**.

## Cấu trúc file (đã dựng sẵn, đây là bản khởi đầu — chỉ cần chỉnh/tiếp tục)
```
index.html        toàn bộ nội dung, semantic HTML
css/style.css     biến màu trong :root, mobile-first, breakpoint 900/1024/560px
js/main.js        nav, lọc portfolio, facade video, reveal, gửi form
assets/           logo (3 bản), favicon, ảnh webp, video mp4, og-image
CNAME             chứa "puldigi.com"
robots.txt · sitemap.xml
```

## Quy ước ĐÃ CHỐT — không tự đổi, muốn đổi phải hỏi Nhung
- **KHÔNG danh xưng** trong nội dung: không "tôi", không "chúng tôi". Viết bằng cụm danh từ / câu không chủ ngữ.
- **Màu lấy đúng từ logo:** cam `#D9663C`, xanh ngọc `#0E9384`, xanh đậm `#0C3B1F`, nền kem `#FBF7F0`, chữ nâu `#2A1D18`. Đã khai báo ở `:root`.
- **Font:** Fraunces (tiêu đề) + Be Vietnam Pro (nội dung).
- **Liên hệ chỉ Zalo + Email**, KHÔNG Facebook: Zalo `0972 177 282`, email `nhungkim2468@gmail.com`.
- **Không có section "Về tôi"** — site nói về dịch vụ, không kể tiểu sử.
- 4 dịch vụ: Facebook Ads · Video ads TikTok · Website & Landing page · Content & Entity SEO.
- Clip TikTok Vlasta hiện ở **section riêng khung điện thoại** (id="video"): bấm play phát clip thật ngay trong khung 9:16.
- Portfolio là **gallery không số liệu** (4 card): Vlasta website + 3 card ads icon (hoa/du lịch/BĐS). Bộ lọc: Tất cả / Website / Facebook Ads.
- Mọi hiệu ứng bọc trong `@media (prefers-reduced-motion: no-preference)` hoặc có fallback tĩnh.

## VIỆC CÒN LẠI
1. **Nối form với Google Apps Script** (ưu tiên 1):
   - Dựng Apps Script đổ lead vào Google Sheet (cột: Thời gian, Họ tên, SĐT/Email, Dịch vụ, Nội dung).
   - Dán URL endpoint vào hằng `FORM_ENDPOINT` đầu file `js/main.js`. Form đã sẵn honeypot chống spam (ô ẩn name="website").
2. **Deploy GitHub Pages:** tạo repo `puldigi` (public) → push → Settings → Pages → nhánh main. File `CNAME` đã có sẵn.
3. **Trỏ domain tại Mắt Bão:** 4 bản ghi A (`185.199.108.153` / `.109.153` / `.110.153` / `.111.153`) + CNAME `www` → `<tài-khoản>.github.io`. Bật Enforce HTTPS sau khi DNS lan truyền.
4. **Google Analytics 4 + Search Console** (nộp sitemap.xml) sau khi live.
5. **Ảnh OG:** hiện là bản tự tạo `assets/og-image.jpg` (1200×630). Thay bằng bản đẹp hơn nếu muốn.

## Lưu ý kỹ thuật
- Ảnh phải nén WebP < 200KB **trước khi commit** (repo GitHub lưu mọi phiên bản → dễ phình).
- Video `assets/video/vlasta-tiktok.mp4` đã nén H.264 4.2MB. Đừng thêm nhiều mp4 vào repo; nếu có link TikTok thì chuyển facade sang nhúng link cho nhẹ.
- Kiểm tra responsive 375 / 768 / 1024px và điểm PageSpeed mobile ≥ 85 trước khi launch.

## Phong cách trả lời cho Nhung
Tiếng Việt, giọng đồng nghiệp thân thiện nhưng chuyên môn. Giải thích thuật ngữ lần đầu dùng. Khi có nhiều cách làm → liệt kê + đề xuất 1 lựa chọn tốt nhất kèm lý do. Giao code luôn đầy đủ cả file.
