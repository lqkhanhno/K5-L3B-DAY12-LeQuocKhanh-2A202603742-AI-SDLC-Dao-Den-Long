# CHANGELOG

Tất cả thay đổi đáng nhớ của dự án. Tag phase tương ứng với mốc phát hành.

## [phase-1] — 2026-11-20

- Khung dự án không npm install: Node thuần cho logic, Three.js qua CDN cho view.
- Core logic: sinh thế giới tất định theo seed (mulberry32), gom đom đóm, thắp Đèn Lồng Lớn (nhấn E, tốn 1 đom đóm), Bóng Mực đuổi và trừ đom đóm, thắng khi thắp đủ đèn, thua khi hết giờ 180s.
- Chế độ headless theo Test Contract tự thiết kế (`docs/notes/headless-contract.md`): scenario JSON → output JSON, tick 30Hz, tất định byte-đền-byte.
- 18 test đơn vị (node:test) + 1 scenario + kiểm tra tất định, tất cả xanh bằng một lệnh `node tools/run_tests.mjs`.
- Bằng chứng: `docs/proof/phase-1.md` và thư mục `docs/proof/phase-1/`.
