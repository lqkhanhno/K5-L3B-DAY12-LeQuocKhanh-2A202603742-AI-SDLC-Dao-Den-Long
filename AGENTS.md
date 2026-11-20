# AGENTS.md — Hướng dẫn cho AI agent

Dự án: game 3D "Đảo Đèn Lồng" (lab Day 12 AI SDLC). Môi trường chấm: macOS/Linux, Node.js.

## Kiến trúc bắt buộc

- Tách **logic game** khỏi **hiển thị**. Logic thuần nằm trong `src/core/`, KHÔNG import Three.js, DOM, window hay bất cứ thứ gì của trình duyệt. Logic phải chạy được bằng Node không cần cửa sổ (chế độ headless theo Test Contract).
- Phần hiển thị (Three.js) nằm trong `src/view/` và chỉ được **gọi** logic từ `src/core/`, không được nhúng luật game vào view.
- Chưa có package npm ở giai đoạn này: core chạy bằng Node thuần (ES Modules), view nạp Three.js qua CDN import map trong `index.html`. Nếu sau này cần package, phải chắc người chấm clone sạch chạy được trong tối đa 3 lệnh.

## Lệnh

```bash
node tools/run_headless.mjs scenarios/<ten>.json   # chạy scenario headless, in output ra stdout
node tools/run_tests.mjs                           # chạy toàn bộ test + scenario, thoát mã khác 0 nếu đỏ
```

- Test thuần nằm trong `tests/`. Scenario JSON nằm trong `scenarios/`.
- Sau khi sửa bất kỳ file logic nào, PHẢI chạy `node tools/run_tests.mjs` và báo kết quả thật (đã chạy, đỏ hay xanh). Không tuyên bố "đã kiểm tra" nếu chưa chạy lệnh.

## Quy ước

- Commit nhỏ, mỗi commit một việc, thông điệp tiếng Việt ngắn rõ.
- Không bao giờ sửa tay output của chương trình để tạo bằng chứng. Bằng chứng sinh ra bằng lệnh thật.
- Không commit `.env`, API key. Không xóa file harness (AGENTS.md, skills, hooks) sau khi dùng.
- Giả định mơ hồ của đề: tự chọn giá trị hợp lý, ghi vào `docs/notes/assumptions.md`, kèm ngày phase.
- Yêu cầu chưa đạt: ghi "chưa đạt" + lý do trong `docs/proof/` — trung thực hơn giấu lỗi.

## Bài học đã học (cập nhật khi agent mắc lỗi lần 2)

- Node không cho `await` trong vòng lặp đồng bộ trong module: khi viết script quét file, dùng `readFileSync` thay vì await import trong callback của `test()`.
- Luật điều kiện thắng/thua phải xử lý cả trường hợp degenerate (thế giới trống): kiểm tra `length > 0` trước khi tuyên bố thua theo danh sách rỗng.
- Khi viết test scenario, đặt vị trí thực thể CỐ ĐỊNH qua params thay vì để seed sinh — test ý định phải đích xác, không phụ thuộc ngẫu nhiên.
- Import và tham chiếu phải đồng bộ: nếu đổi `import { X }` thành `import * as C`, phải đổi TẤT CẢ tham chiếu trong file (grep `X\.` trước khi commit). Lỗi này đã xảy ra 2 lần trong Phase 2.
