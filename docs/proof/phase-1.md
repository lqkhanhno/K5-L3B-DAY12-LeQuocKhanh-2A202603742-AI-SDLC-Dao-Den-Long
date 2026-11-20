# Bằng chứng kiểm chứng — Phase 1 (bản khung, chưa có PRD-0)

> **Bối cảnh trung thực:** Phase 1 được làm trước khi PRD-0 chính thức được paste từ lab board.
> Nội dung dưới đây chứng minh phần **khung nền chắc chắn đúng** (kiến trúc headless, tính tất định,
> luật game cơ bản theo giả định). Sau khi có PRD-0, bảng truy vết sẽ được điền theo yêu cầu thật
> và chạy lại toàn bộ; các mục chưa khớp PRD sẽ được ghi **"chưa đạt / cần xem lại"** thay vì bịa "đạt".

- Ngày chạy: 2026-11-20
- Commit: xem `git log --oneline` tại tag `phase-1`
- Môi trường: Node v22.23.5, Linux sandbox (Ubuntu 22), không GPU

## 1. Truy vết yêu cầu → kiểm chứng (phần khung)

| # | Yêu cầu (giả định Phase 1) | Cách kiểm chứng | Bằng chứng | Kết quả |
|---|---|---|---|---|
| R1 | Cùng seed → cùng thế giới (tất định) | Test unit + chạy headless 2 lần so byte | `run_tests_output.txt` (test "cùng seed"), `determinism-check.txt` | ✅ Đạt |
| R2 | Gom đom đóm khi đủ gần | Test unit (trong/ngoài bán kính) + scenario | `run_tests_output.txt` test 1–2 | ✅ Đạt |
| R3 | Thắp đèn: gần đèn + có đom đóm + nhấn action | Test unit + scenario co-ban.json | `run_tests_output.txt` test 3–5, `scenario-co-ban-output.json` | ✅ Đạt |
| R4 | Không có đom đóm thì không thắp được | Test unit | `run_tests_output.txt` test 4 | ✅ Đạt |
| R5 | Thắp đủ đèn → thắng; hết giờ → thua | Test unit (status transitions) | `run_tests_output.txt` test 5–6 | ✅ Đạt |
| R6 | Tốc độ người chơi đúng hằng số, sprint nhanh hơn | Test unit đo vị trí sau 30 tick | `run_tests_output.txt` test 7–8 | ✅ Đạt |
| R7 | Bóng Mực đuổi theo, chạm thì mất đom đóm | Test unit | `run_tests_output.txt` test 9 | ✅ Đạt |
| R8 | Headless output đúng định dạng JSON cố định | Lệnh thật + file nguyên văn | `scenario-co-ban-output.json` | ✅ Đạt |
| R9 | Yêu cầu cụ thể của PRD-0 (chưa có) | — | — | ⏳ Chờ PRD-0 |

## 2. Cách tái lập

```bash
node tools/run_tests.mjs                       # 18/18 pass, thoát mã 0
node tools/run_headless.mjs scenarios/co-ban.json
node tools/run_headless.mjs scenarios/co-ban.json   # chạy 2 lần: output phải giống hệt
```

## 3. Lỗi thật đã gặp và cách xử lý trong phase này

- `run_tests.mjs`: lỗi `await` trong vòng lặp đồng bộ → sửa thành đọc đồng bộ (commit trước khi chạy xanh).
- Luật "hết đom đóm → thua" áp nhầm cho thế giới **không có** đom đóm (degenerate, dùng cho test di chuyển) → thêm điều kiện `fireflies.length > 0`.
- 3 test viết sai kịch bản (đặt đom đóm/đèn sai vị trí mong muốn) → sửa kịch bản test, không sửa luật cho khớp.
