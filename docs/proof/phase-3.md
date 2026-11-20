# Bằng chứng kiểm chứng — Phase 3 (Ticket-03)

- Ngày chạy: 2026-11-20 · Commit: xem `git log` tại tag `phase-3`
- Môi trường: Node v22.23.5, Linux sandbox (Ubuntu 22)
- Ticket: `docs/notes/tickets/ticket-03.md` · Thiết kế đổi hướng: `docs/notes/design-changes.md` · Giả định mới: A14

## 1. Truy vết yêu cầu → kiểm chứng

| # | Yêu cầu (Ticket-03) | Cách kiểm chứng | Bằng chứng | Kết quả |
|---|---|---|---|---|
| R3.1 | Thắp TỰ ĐỘNG khi đủ điều kiện, bỏ phím E; thiếu thì im lặng (bỏ `lantern_rejected`) | Test unit: (a) nhấn E thiếu đom đóm → 0 sự kiện; (b) tự thắp khi đi vào bán kính; (c) test Phase 1 cũ đã sửa theo luật mới | `run_tests_output.txt` test R3.1 + test "giữ action... (sửa Phase 3)" | ✅ Đạt |
| R3.2 | Bóng Mực trong lightRadius của đèn đã thắp thì bỏ chạy (fleeSpeed 4.0), flag `fleeing` | Test unit 3 cái: chạy ra xa đèn đo khoảng cách; fleeing true/false; đèn chưa thắp không có tác dụng | `run_tests_output.txt` test R3.2 ×3 | ✅ Đạt |
| R3.3 | Đèn đã thắp là vùng an toàn — Bóng Mực không chạm được người chơi đứng cạnh | Test unit 300 tick + scenario `an-toan.json` 10 giây | `run_tests_output.txt` R3.3; `scenario-an-toan-output.json`: **0 ink_caught**, Bóng Mực cuối nằm ở x=5.92 (mép ngoài vùng sáng quanh đèn x=1) | ✅ Đạt |
| R3.4 | Hồi quy có thay thế: test/scenario dùng phím E sửa kèm lý do; bao vây vẫn hoạt động khi không có vùng sáng | Chạy lại toàn bộ; đọc lý do trong comment test | `run_tests_output.txt` 31/31 pass; lý do trong `tests/simulation.test.mjs` (khối comment `[Phase 3 / R3.4]`), `tests/phase2.test.mjs`, `scenarios/co-ban.json` | ✅ Đạt (có lý do, không tắt âm thầm) |
| R3.5 | Headless thêm `inks[].fleeing` | Lệnh thật, xem output | `scenario-an-toan-output.json` (`"fleeing": false`), `scenario-bao-vay-output.json` | ✅ Đạt |

## 2. Test cũ bị luật mới làm sai — sửa kèm lý do (không tắt âm thầm)

| Test | Lý do sai | Xử lý |
|---|---|---|
| Phase 1 "giữ action... thắp được" | Phím E không còn tồn tại | Sửa: đổi tên ý định thành tự thắp, đèn đặt (1.2,0) trong litRadius; comment `[Phase 3 / R3.4]` |
| Phase 2 "R2.1 đủ thì thắp" | Nhấn action không còn cần thiết; tự thắp trong cùng tick gom khi đèn trong bán kính | Sửa: đèn đặt xa (8,0) để tách bước gom/thắp, đi vào bán kính rồi tự thắp; comment `[Phase 3]` |
| Phase 2 "R2.1 lantern_rejected" | Sự kiện bị XÓA theo R3.1 | Thay bằng test "im lặng": không có lantern_lit và không có lantern_rejected |

## 3. Đánh giá nhanh Phase 3 (Evaluate)

- **Đạt:** 5/5 yêu cầu. Scenario `an-toan` chứng minh bằng số: Bóng Mực đứng ở 5.92 sau 10 giây = bị ánh sáng đẩy ra, không vào được vùng catchRadius quanh người chơi.
- **AI sai ở đâu:** 2 lần — (1) viết test "tự thắp" mà quên rằng đủ điều kiện trong CÙNG tick nghĩa là gom + thắp xảy ra cùng lúc với đèn gần (đặt đèn xa để tách bạch); (2) không tính litRadius khi đặt đèn ở (2,0) trong test cũ (2 > 1.6 nên trước đây phải đi bộ, giờ phải đặt đèn gần hơn). Phát hiện bằng chạy test, không phải đọc code.
- **Hồi quy phát hiện thay đổi hướng chính xác như thiết kế:** 3 test đỏ ngay lần chạy đầu đều là test nhắm phím E — không có lỗi bất ngờ ngoài dự kiến.
- **Token:** xem `docs/notes/ai-log.md`.

## 4. Cách tái lập

```bash
node tools/run_tests.mjs                              # 31/31 pass
node tools/run_headless.mjs scenarios/an-toan.json    # không có ink_caught, có lantern_lit
```
