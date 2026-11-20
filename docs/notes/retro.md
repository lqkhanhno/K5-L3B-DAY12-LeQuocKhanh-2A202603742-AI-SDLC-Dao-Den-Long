# Retro — tổng hợp cả dự án (Checkpoint 5)

> Điền theo khung CHECKPOINTS CP5: điều hiệu quả/không khi làm với AI; những lần AI sai và cách
> phát hiện; harness nào giúp nhiều nhất; token/chi phí; nếu làm lại thì đổi gì.

## Số liệu tổng hợp

| Phase | Test | Scenario | Commit chính | Bằng chứng |
|---|---|---|---|---|
| 1 | 18 | 1 | core + headless + view + README | `docs/proof/phase-1.md` (R1–R10) |
| 2 | 25 (+7) | 2 (+1) | required + bao vây | `docs/proof/phase-2.md` (R2.1–R2.5) |
| 3 | 31 (+6) | 3 (+1) | thắp tự động + bỏ chạy | `docs/proof/phase-3.md` (R3.1–R3.5) |
| 4 | 32 (+1) | 4 (+1) | benchmark + đóng gói | `docs/proof/phase-4.md` (R4.1–R4.6, số đo) |

Token ước tính toàn dự án: ~195k input / ~43k output (chi tiết từng phase trong `ai-log.md`).
Tiết kiệm nhất nhờ: kiến trúc không `npm install` (agent không đọc node_modules), AGENTS.md ngắn
(7 mục), test nhanh < 6s cho cả bộ 32 → dám chạy liên tục mà ít tốn.

## Điều gì hiệu quả khi làm với AI

- **Tách logic/hiển thị ngay từ đầu** — mọi thay đổi luật Phase 2–4 chỉ sửa `src/core`, view gần như không đụng. Đây là quyết định một lần, tiết kiệm cả dự án.
- **Nghĩ cách kiểm chứng trước khi code** (GUIDE bước 3): mỗi ticket viết tiêu chí "làm A thấy B" trước, để agent (tôi) code trúng ngay lần đầu.
- **Hằng số gom một file** (`constants.mjs`): khi luật đổi (Phase 3), chỗ phải sửa hiển nhiên.
- **Bằng chứng là file sinh bằng lệnh thật** — bảng truy vết mỗi phase chỉ trỏ vào output đã lưu, không phải gõ lại.

## Điều KHÔNG hiệu quả / AI đã sai (và cách phát hiện)

| Lần | AI sai | Phát hiện bằng | Sửa thế nào / harness |
|---|---|---|---|
| 1 | `await` trong vòng lặp đồng bộ (P1) | chạy test → SyntaxError ngay | đọc stack, sửa 1 dòng |
| 2 | Luật thua áp cho thế giới trống (P1) | 4 test đỏ | thêm `length > 0` |
| 3 | 3 test đặt thực thể sai vị trí ý định (P1) | test đỏ, tự hỏi "test đang kiểm gì?" | đặt vị trí cứng qua params |
| 4 | Đổi import mà không đổi tham chiếu → 17/18 đỏ (P2) | hồi quy đỏ hàng loạt | grep trước khi đổi; **ghi bài học vào AGENTS.md** |
| 5 | Sai thời điểm "tự thắp cùng tick" (P3) | 2 test đỏ | đặt đèn xa để tách bước |
| 6 | Scenario đo kết thúc sớm — bài đo không trung thực (P4) | tự kiểm `ticks` trong output | `timeLimitSeconds` qua params, đo lại |

Mẫu hình chung: **không lỗi nào do đọc code phát hiện** — tất cả nhờ chạy thật. Đúng tinh thần "agent bảo chạy rồi không phải bằng chứng".

## Harness nào giúp nhiều nhất

1. **`run_tests.mjs` một lệnh, thoát mã rõ** — cứu lỗi nhanh nhất, dùng nhiều nhất.
2. **AGENTS.md tích lũy bài học** — sau P2 không còn lặp lỗi import.
3. **Skill `verify-game`** — quy trình lưu bằng chứng thống nhất, không quên bước tất định.

Không cần hook trong dự án này: bộ test < 6 giây, tự giác chạy rẻ hơn cơ chế ép.

## Nếu làm lại từ đầu

- Viết `benchmark.mjs` ngay từ Phase 1 thay vì Phase 4 — con số đo sớm phát hiện thiết kế chậm.
- Cho "thắp tự động" ngay từ PRD — trải nghiệm chơi tốt hơn ngay, Phase 3 khỏi phải sửa test cũ.
- Tránh stub vendor trong sandbox không mạng: chuẩn bị Three.js local trước khi viết package.mjs.
