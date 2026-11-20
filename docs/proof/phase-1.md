# Bằng chứng kiểm chứng — Phase 1

> **Nguồn yêu cầu:** lab board không dùng; PRD-0 = mô tả dự án trong README.md (xem `docs/notes/requirements-source.md`).
> Yêu cầu bắt buộc từ README/GUIDE/SUBMISSION: (1) game 3D góc nhìn thứ ba chơi được — Mây gom đom đóm,
> thắp Đèn Lồng Lớn, né Bóng Mực; (2) chế độ headless theo Test Contract với đầu ra cố định và tất định;
> (3) chạy được trên macOS/Linux bằng tối đa 3 lệnh; (4) mỗi yêu cầu chính có bằng chứng.
> Các con số cụ thể (12 đom đóm, 3 đèn, 180s…) là giả định A1–A9 trong `docs/notes/assumptions.md`.

- Ngày chạy: 2026-11-20
- Commit: xem `git log --oneline` tại tag `phase-1`
- Môi trường: Node v22.23.5, Linux sandbox (Ubuntu 22), không GPU

## 1. Truy vết yêu cầu → kiểm chứng

| # | Yêu cầu | Cách kiểm chứng | Bằng chứng | Kết quả |
|---|---|---|---|---|
| R1 | Cùng seed → cùng thế giới, chạy 2 lần ra cùng kết quả (đề yêu cầu tất định) | Test unit + chạy headless 2 lần so byte | `run_tests_output.txt` (test "cùng seed"), `determinism-check.txt` | ✅ Đạt |
| R2 | Mây gom được đom đóm (cơ chế lõi từ README) | Test unit (trong/ngoài bán kính) + scenario | `run_tests_output.txt` test 1–2 | ✅ Đạt |
| R3 | Đom đóm thắp được Đèn Lồng Lớn (cơ chế lõi) | Test unit + scenario co-ban.json | `run_tests_output.txt` test 3–5, `scenario-co-ban-output.json` | ✅ Đạt |
| R4 | Không có đom đóm thì không thắp được (hệ quả luật A3) | Test unit | `run_tests_output.txt` test 4 | ✅ Đạt |
| R5 | Điều kiện thắng (thắp đủ đèn) / thua (hết giờ) | Test unit (status transitions) | `run_tests_output.txt` test 5–6 | ✅ Đạt |
| R6 | Người chơi di chuyển được, có tốc độ xác định (chơi được) | Test unit đo vị trí sau 30 tick | `run_tests_output.txt` test 7–8 | ✅ Đạt |
| R7 | Bóng Mực là mối nguy thực (né = có ý nghĩa) | Test unit: đuổi theo, chạm mất đom đóm | `run_tests_output.txt` test 9 | ✅ Đạt |
| R8 | Headless: đầu vào/đầu ra cố định (Test Contract) | Lệnh thật + file nguyên văn + tài liệu định dạng | `scenario-co-ban-output.json`, `docs/notes/headless-contract.md` | ✅ Đạt |
| R9 | Chạy được macOS/Linux ≤ 3 lệnh, không npm install | Thiết kế: Node thuần + CDN; hướng dẫn trong README; **chưa test được trên macOS thật** (môi trường chỉ có Linux) | README mục "Chạy game" | ⚠️ Đạt trên Linux; macOS chưa thử — người chấm chạy được vì không có dependency hệ điều hành |
| R10 | Game 3D hiển thị đúng (đồ họa, camera, HUD) | Chỉ xem được bằng trình duyệt — **không chạy được trong sandbox**, người chơi/chấm sẽ thấy | `index.html`, `src/view/main.js`; cú pháp đã `node --check` | ⚠️ Cần xác nhận bằng mắt (video demo sẽ là bằng chứng) |

## 2. Cách tái lập

```bash
node tools/run_tests.mjs                       # 18/18 pass, thoát mã 0
node tools/run_headless.mjs scenarios/co-ban.json
node tools/run_headless.mjs scenarios/co-ban.json   # chạy 2 lần: output phải giống hệt
```

## 3. Đánh giá nhanh Phase 1 (Evaluate)

- **Đạt:** kiến trúc tách logic/hiển thị giúp test 18/18 chạy < 0.5s không cần trình duyệt; tất định đạt mức byte-đền-byte; mọi con số game gom một file constants.
- **AI đã sai ở đâu (phát hiện bằng chạy thật, không phải đọc code):** (1) lỗi `await` trong vòng lặp đồng bộ của run_tests; (2) luật thua "hết đom đóm" áp nhầm cho thế giới trống; (3) 3 test đặt thực thể sai vị trí so với ý định. Cả 3 đều bắt được qua chạy test — đúng như GUIDE nói "agent bảo chạy rồi không phải bằng chứng".
- **Harness chỉnh:** AGENTS.md bổ sung bài học (xem mục "Bài học đã học").
- **Token:** xem `docs/notes/ai-log.md`.
- **Chưa đạt / rủi ro:** R9 macOS chưa thử thật; R10 cần xác nhận bằng mắt qua video demo (CP5).

- `run_tests.mjs`: lỗi `await` trong vòng lặp đồng bộ → sửa thành đọc đồng bộ (commit trước khi chạy xanh).
- Luật "hết đom đóm → thua" áp nhầm cho thế giới **không có** đom đóm (degenerate, dùng cho test di chuyển) → thêm điều kiện `fireflies.length > 0`.
- 3 test viết sai kịch bản (đặt đom đóm/đèn sai vị trí mong muốn) → sửa kịch bản test, không sửa luật cho khớp.
