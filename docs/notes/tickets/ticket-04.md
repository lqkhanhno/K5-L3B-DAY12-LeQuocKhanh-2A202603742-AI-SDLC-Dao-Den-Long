# Ticket-04 — Hoàn thiện phát hành: đo hiệu năng, đóng gói, Release v1.0.0

> **Phase 4** (90 phút). Tính chất phase theo CHECKPOINTS.md: *đưa sản phẩm đến mức phát hành được,
> đo được, cài đặt dễ*. Nguồn: ticket do sinh viên định nghĩa (xem `requirements-source.md`).

## Yêu cầu bắt buộc (số đo cụ thể — phải chạy thật, lưu kết quả kèm cấu hình máy)

- **R4.1 [Đo]** Headless phải xử lý được scenario **dài**: 1 scenario 100.000 tick (≈ 55 phút game)
  hoàn thành trong **< 5 giây** trên máy chấm. Đo bằng lệnh `time`, lưu output kèm cấu hình.
- **R4.2 [Đo]** Sinh thế giới lớn: `createWorld` với 1.000 đom đóm + 50 đèn + 20 Bóng Mực hoàn thành
  trong **< 100 ms**. Đo tương tự.
- **R4.3 [Đo ổn định]** Chạy scenario đo hiệu năng **10 lần liên tiếp**: kết quả phải **giống hệt nhau
  từng byte** (tất định cả ở quy mô lớn) và không vượt quá 2× thời gian chạy lần đầu.
- **R4.4 [Đóng gói]** Có **bản chạy được không cần mạng** trong Release: script `tools/package.mjs`
  tạo thư mục `dist/dao-den-long/` chứa mọi file cần thiết (không phụ thuộc CDN — Three.js nhúng local)
  + hướng dẫn `dist/README.txt`. Người chấm chỉ cần mở `dist` và chạy.
- **R4.5 [Đọc sạch]** README: cài đặt & chạy **tối đa 3 lệnh**, có mục điều khiển, chạy test/headless,
  link video demo ở đầu (điền khi có video), mục "Sáng tạo của tôi".
- **R4.6 [Hồi quy cuối]** Toàn bộ 31 test + 3 scenario + tất định phải còn xanh ở trạng thái phát hành.

## Giả định tự chọn (A15)

- Ngưỡng đo lấy từ đặc điểm máy chấm chung: an toàn nếu nhanh gấp ~4× ngưỡng trên máy dev.
- Bản đóng gói dùng nhị phân Three.js module (đã có trong lib/ local sau R4.4).

## Bàn giao phase

- Code + đo + `docs/proof/phase-4.md` (bảng số đo kèm cấu hình máy), `dist/` build, tag `phase-4`,
  GitHub Release `v1.0.0` đính kèm `dist` (zip) + video demo.
