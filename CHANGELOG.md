# CHANGELOG

Tất cả thay đổi đáng nhớ của dự án. Tag phase tương ứng với mốc phát hành.

## [phase-4] / v1.0.0 — 2026-11-20 (Ticket-04)

- Đo hiệu năng (`tools/benchmark.mjs`): 100k tick **398 ms** (ngưỡng 5s), thế giới 1070 thực thể **5,4 ms** (ngưỡng 100 ms), 10 lần chạy tất định từng byte, ổn định 1,36× (ngưỡng 2×). Kèm cấu hình máy đo trong `docs/proof/phase-4/`.
- Đóng gói không cần mạng: `tools/package.mjs` → `dist/dao-den-long/` (Three.js local trong vendor/, 0 tham chiếu CDN, test chạy độc lập 32/32).
- `timeLimitSeconds` ép được qua world params (scenario đo cần chạy dài hơn mặc định).
- Bằng chứng: `docs/proof/phase-4.md`.

## [phase-3] — 2026-11-20 (Ticket-03 — THAY ĐỔI LUẬT)

- **[THAY THẾ]** Thắp đèn **tự động** khi mang đủ `required` đom đóm vào bán kính — bỏ phím E; sự kiện `lantern_rejected` xóa khỏi contract (R3.1). Lý do và ảnh hưởng: `docs/notes/design-changes.md`.
- **[BỔ SUNG]** Bóng Mực **bỏ chạy** khỏi đèn đã thắp trong `lightRadius=5` với `fleeSpeed=4.0`; flag `fleeing` trong output headless (R3.2, R3.5). Đèn đã thắp giờ là vùng trú ẩn.
- 3 test cũ sửa kèm lý do (không tắt âm thầm); 25 → **31 test**, 3 scenario. Bằng chứng: `docs/proof/phase-3.md`.

## [phase-2] — 2026-11-20 (Ticket-02)

- Đèn Lồng Lớn cần `requiredFireflies` (mặc định 3) đom đóm để thắp; thiếu thì có sự kiện `lantern_rejected` (R2.1).
- Bóng Mực từ 2 con trở lên chuyển chế độ **bao vây**: trong bán kính 6 thì vòng quanh người chơi thay vì lao thẳng (R2.3).
- Headless output bổ sung `required` từng đèn + tổng `firefliesSpent` (R2.2).
- View: bảng "xN" trên đèn lồng hiển thị số đom đóm cần; thế giới mặc định có 2 Bóng Mực.
- 18 → **25 test** (thêm 7 test Phase 2), 2 scenario, hồi quy xanh. Bằng chứng: `docs/proof/phase-2.md`.

## [phase-1] — 2026-11-20

- Khung dự án không npm install: Node thuần cho logic, Three.js qua CDN cho view.
- Core logic: sinh thế giới tất định theo seed (mulberry32), gom đom đóm, thắp Đèn Lồng Lớn (nhấn E, tốn 1 đom đóm), Bóng Mực đuổi và trừ đom đóm, thắng khi thắp đủ đèn, thua khi hết giờ 180s.
- Chế độ headless theo Test Contract tự thiết kế (`docs/notes/headless-contract.md`): scenario JSON → output JSON, tick 30Hz, tất định byte-đền-byte.
- 18 test đơn vị (node:test) + 1 scenario + kiểm tra tất định, tất cả xanh bằng một lệnh `node tools/run_tests.mjs`.
- Bằng chứng: `docs/proof/phase-1.md` và thư mục `docs/proof/phase-1/`.
