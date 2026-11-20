# K5-L3B-DAY12-LeQuocKhanh-2A202603742-AI-SDLC-Dao-Den-Long

> **Đảo Đèn Lồng** — game 3D góc nhìn thứ ba, làm trong lab Day 12 *AI SDLC*: áp dụng quy trình phần mềm cùng AI qua 4 phase.
> Sinh viên: **Lê Quốc Khánh — 2A202603742**. Repo cá nhân, nộp theo [SUBMISSION.md](SUBMISSION.md) của lab.
>
> 🎬 **Video demo:** *(điền link Release v1.0.0 hoặc docs/demo/demo.mp4 — xem CP5)*
> 🏷️ **Bản phát hành:** `v1.0.0` — kèm `dist/dao-den-long.zip` chạy được không cần mạng.

## 🎮 Chạy game (tối đa 3 lệnh, không cần cài package)

Cần: **Node.js ≥ 18** (chỉ dùng `node` + `npx serve`, không cần `npm install`).

```bash
git clone https://github.com/lqkhanhno/K5-L3B-DAY12-LeQuocKhanh-2A202603742-AI-SDLC-Dao-Den-Long.git
cd K5-L3B-DAY12-LeQuocKhanh-2A202603742-AI-SDLC-Dao-Den-Long
npx serve .          # hoặc: python3 -m http.server 3000
```

Mở trình duyệt tại địa chỉ hiện ra (mặc định `http://localhost:3000`).

**Điều khiển:** `W A S D` / phím mũi tên — di chuyển · `Shift` — chạy nhanh · Mang đủ đom đóm đến gần Đèn Lồng Lớn là đèn **tự thắp** (không cần phím) · Bóng Mực đuổi bạn trong sương nhưng **sợ ánh sáng đèn đã thắp**.

**Mục tiêu:** gom đom đóm trong đảo, nạp đủ vào các Đèn Lồng Lớn (mỗi đèn cần 3) để thắp đủ tất cả trước khi hết giờ.

## 🧪 Chạy test và chế độ headless

```bash
node tools/run_tests.mjs                                    # 32 test + 4 scenario + tất định (thoát 0 = xanh)
node tools/run_headless.mjs scenarios/co-ban.json           # chạy 1 scenario, in JSON ra stdout
node tools/benchmark.mjs                                    # đo hiệu năng theo Ticket-04
node tools/package.mjs                                      # tạo dist/dao-den-long/ chạy được không cần mạng
```

Test Contract (định dạng đầu vào/đầu ra headless): `docs/notes/headless-contract.md`. Kiến trúc tách **logic game** (`src/core/`, thuần Node, không phụ thuộc trình duyệt) khỏi **hiển thị** (`src/view/`, Three.js) để cùng một luật chạy cả trong game lẫn headless — ví dụ một scenario cho ra cùng kết quả byte-đền-byte trên mọi máy.

## 📁 Cấu trúc

```text
index.html              trang game (Three.js qua CDN; bản dist dùng vendor/ local)
src/core/               logic game thuần (world, simulation, constants)
src/view/               hiển thị Three.js + HUD + điều khiển
scenarios/*.json        kịch bản headless (4 cái, gồm scenario đo hiệu năng)
tests/*.test.mjs        32 test đơn vị (node:test, không framework ngoài)
tools/                  run_headless, run_tests, benchmark, package
docs/notes/             giả định, nhật ký AI, retro, Test Contract, ticket tự định nghĩa
docs/proof/             bằng chứng kiểm chứng từng phase (output nguyên văn + truy vết)
.agents/skills/         skill verify-game (harness)
AGENTS.md               hướng dẫn cho AI agent (harness, có mục bài học)
```

## 🏮 Sáng tạo của tôi

- **Bóng Mực sợ ánh sáng** (Phase 3): đèn đã thắp thành trú ẩn chiến thuật — Bóng Mực bị đẩy ra vùng sáng, nhạt màu đi khi đang bỏ chạy (flag `fleeing` đồng bộ giữa headless và view).
- **Bóng Mực bao vây** (Phase 2): từ 2 con trở lên chuyển từ đuổi thẳng sang vòng quanh người chơi — tạo cảm giác bị vây chứ không phải bị lao vào.
- **Bảng "xN" trên đèn lồng** hiển thị số đom đóm cần thắp (canvas texture, không asset ngoài).
- **Mây mang đèn lồng phát sáng theo người** — hào quang point light giúp định hướng trong sương; đom đóm nhấp nhô như đang bay.
- Cả 4 ý đều **không phá Test Contract**: thực thể thêm không đổi đầu ra headless (điểm hạng mục F rubric).

## 📝 Ghi chú

- Nhân vật, bối cảnh là bản gốc của lab; nguồn asset và công cụ AI ghi trong [CREDITS.md](CREDITS.md). Giấy phép: [MIT](LICENSE).
- Tiến độ theo phase: [CHANGELOG.md](CHANGELOG.md); bằng chứng từng phase: `docs/proof/`; giả định: `docs/notes/assumptions.md`; nhật ký AI + token: `docs/notes/ai-log.md`; retro: `docs/notes/retro.md`.
