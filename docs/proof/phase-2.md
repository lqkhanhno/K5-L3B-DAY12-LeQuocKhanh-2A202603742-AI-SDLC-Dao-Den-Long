# Bằng chứng kiểm chứng — Phase 2 (Ticket-02)

- Ngày chạy: 2026-11-20 · Commit: xem `git log` tại tag `phase-2`
- Môi trường: Node v22.23.5, Linux sandbox (Ubuntu 22)
- Ticket: `docs/notes/tickets/ticket-02.md` · Giả định mới: A10–A13 trong `docs/notes/assumptions.md`

## 1. Truy vết yêu cầu → kiểm chứng

| # | Yêu cầu (Ticket-02) | Cách kiểm chứng | Bằng chứng | Kết quả |
|---|---|---|---|---|
| R2.1 | Đèn cần `required` đom đóm (mặc định 3); thiếu thì không thắp, không mất, có `lantern_rejected` kèm have/need | Test unit 3 cái (đủ/thiếu/ép params) + scenario | `run_tests_output.txt` test R2.1 ×3; `scenario-co-ban-output.json` (required=1 hiện trong output) | ✅ Đạt |
| R2.2 | Headless bổ sung `required` từng đèn và `firefliesSpent` | Lệnh thật, xem output nguyên văn | `scenario-co-ban-output.json`, `scenario-bao-vay-output.json` | ✅ Đạt |
| R2.3 | ≥2 Bóng Mực trong followRadius thì vòng quanh; 1 con đuổi thẳng như cũ | Test unit 3 cái (1 con thẳng, 2 con orbit giữ khoảng cách, ngoài bán kính vẫn tiến) | `run_tests_output.txt` test R2.3 ×3 | ✅ Đạt |
| R2.4 | Hồi quy: test/scenario Phase 1 còn xanh sau tích hợp | Chạy lại toàn bộ 18 test cũ | `run_tests_output.txt` — 18/18 cũ pass. **2 test cũ sửa có lý do** (xem mục 2) | ✅ Đạt (có ghi nhận) |
| R2.5 | Scenario `bao-vay.json`: 2 Bóng Mực bao vây, đứng yên 5s không mất đom đóm | Chạy thật, kiểm không có `ink_caught` | `scenario-bao-vay-output.json` (0 sự kiện ink_caught) | ✅ Đạt |

## 2. Test cũ bị luật mới làm sai — xử lý có lý do

- `simulation.test.mjs` test 3, 5 và `scenarios/co-ban.json`: luật mới đèn cần 3 đom đóm làm test ý định cũ (thắp bằng 1) sai. **Xử lý:** đặt `lanternRequiredFireflies: [1]` tường minh trong các test/scenario đó để giữ ý định gốc; luật mặc định 3 được test riêng. Không tắt test nào, không đổi ý định âm thầm.
- Khác với Phase 1, thêm trường mới vào output headless (`required`, `firefliesSpent`) là **bổ sung** — output cũ vẫn parse được.

## 3. Đánh giá nhanh Phase 2 (Evaluate)

- **Đạt:** cả 5 yêu cầu ticket. Hồi quy bắt được ngay lỗi thật của tôi (dùng `C.LANTERN` mà import thiếu namespace) — 17/18 đỏ trong một lần chạy, sửa 1 dòng xong 15/18, còn lại 3 là thay đổi ý định test có chủ đích.
- **AI sai ở đâu:** quên đồng bộ tham chiếu `WORLD`/`C` khi đổi kiểu import — lỗi kiểu này lặp lại lần 2 trong session → đã thêm bài học vào AGENTS.md ("import một kiểu, dùng một kiểu").
- **Harness:** hồi quy 18 test chạy < 1s là công cụ cứu lỗi nhanh nhất; không cần thêm hook lúc này.
- **Token:** xem `docs/notes/ai-log.md`.

## 4. Cách tái lập

```bash
node tools/run_tests.mjs                        # 25/25 pass
node tools/run_headless.mjs scenarios/bao-vay.json   # không có ink_caught
```
