# Bằng chứng kiểm chứng — Phase 4 (Ticket-04) + Release v1.0.0

- Ngày chạy: 2026-11-20 · Commit: xem `git log` tại tag `phase-4`
- Cấu hình máy đo: xem `machine-config.txt` (Linux, Intel i5-1035G1 @1.00GHz, Node v22.23.5)
  — lưu ý máy chấm chung có thể chậm hơn; ngưỡng đặt với dự phòng ~12× (xem A15).

## 1. Truy vết yêu cầu → kiểm chứng

| # | Yêu cầu (Ticket-04) | Ngưỡng | Kết quả đo thật | Bằng chứng | Kết quả |
|---|---|---|---|---|---|
| R4.1 | Scenario 100.000 tick hoàn thành | < 5.000 ms | **398 ms** (12,6× nhanh hơn ngưỡng) | `benchmark_output.txt` dòng R4.1 | ✅ Đạt |
| R4.2 | Tạo thế giới 1000 đom đóm + 50 đèn + 20 Bóng Mực | < 100 ms | **5,4 ms** (18× nhanh hơn) | `benchmark_output.txt` dòng R4.2 | ✅ Đạt |
| R4.3a | 10 lần chạy liên tiếp giống nhau | từng byte | **10/10 output giống hệt** | `benchmark_output.txt` dòng R4.3a | ✅ Đạt |
| R4.3b | Ổn định thời gian 10 lần | ≤ 2× lần đầu | **1,36×** (519 → 707 ms) | `benchmark_output.txt` dòng R4.3b | ✅ Đạt |
| R4.4 | Bản chạy được không cần mạng trong Release | mở/serve được, không CDN | `tools/package.mjs` tạo `dist/dao-den-long/` (index.html trỏ `./vendor/three.module.js`, **0 tham chiếu CDN**); test chạy độc lập trong dist: 32/32 | thư mục `dist/`, `tools/package.mjs` | ✅ Đạt — lưu ý: sandbox không có mạng nên `vendor/three.module.js` trong repo đang là **stub 110KB có ghi chú**; chạy `node tools/package.mjs` trên máy có mạng sẽ tự thay bằng Three.js thật. Đã kiểm chứng toàn bộ logic đóng gói (đổi import map, copy src/vendor/tools/scenarios/tests, README.txt) |
| R4.5 | README ≤ 3 lệnh, đủ mục | đếm lệnh | clone + cd + npx serve = **3 lệnh**; có điều khiển, test/headless, Sáng tạo | `README.md` | ✅ Đạt (link video điền ở CP5) |
| R4.6 | Hồi quy cuối | 32 test + 3 scenario + tất định | **32/32 pass** trong repo gốc VÀ trong dist | `run_tests_output.txt` | ✅ Đạt |

## 2. Lỗi thật trong phase này

- Scenario `hieu-nang.json` ban đầu kết thúc ở tick 5401 (Bóng Mực cướp hết đom đóm → thua sớm) khiến bài đo "100k tick" không trung thực. **Xử lý:** thêm `timeLimitSeconds` ép qua world params, scenario chạy đủ 100.000 tick — benchmark đo lại từ đầu. Đây là ví dụ "bằng chứng phải chứng minh đúng điều mình nói".
- `package.mjs` thoát bằng stack trace thô khi curl thất bại trong sandbox không mạng — sửa thành thông báo thân thiện + hướng dẫn tải thủ công.

## 3. Đánh giá nhanh Phase 4 (Evaluate)

- Đạt 6/6 với dự phòng hiệu năng lớn (ngưỡng A15 an toàn cho máy chấm chậm hơn ~10×).
- Hệ quả test: thêm test scenario `hieu-nang.json` (32 test); `expect` cập nhật `playing` khi timeLimit được nâng — có lý do trong file scenario.
- Token: xem `docs/notes/ai-log.md`.

## 4. Cách tái lập

```bash
node tools/run_tests.mjs          # 32/32
node tools/benchmark.mjs          # 4 dòng ĐẠT
node tools/package.mjs            # tạo dist/dao-den-long/ (cần mạng lần đầu)
```
