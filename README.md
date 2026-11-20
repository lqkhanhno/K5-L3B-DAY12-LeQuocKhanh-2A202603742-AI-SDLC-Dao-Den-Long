# K5-L3B-DAY12-LeQuocKhanh-2A202603742-AI-SDLC-Dao-Den-Long

> **Đảo Đèn Lồng** — game 3D góc nhìn thứ ba, làm trong lab Day 12 *AI SDLC*: áp dụng quy trình phần mềm cùng AI qua 4 phase.
> Sinh viên: **Lê Quốc Khánh — 2A202603742**. Repo cá nhân, nộp theo [SUBMISSION.md](SUBMISSION.md) của lab.

## 🎮 Chạy game (tối đa 3 lệnh, không cần cài package)

Cần: **Node.js ≥ 18** (chỉ dùng `node` + `npx serve`, không cần `npm install`).

```bash
git clone https://github.com/lqkhanhno/K5-L3B-DAY12-LeQuocKhanh-2A202603742-AI-SDLC-Dao-Den-Long.git
cd K5-L3B-DAY12-LeQuocKhanh-2A202603742-AI-SDLC-Dao-Den-Long
npx serve .          # hoặc: python3 -m http.server 3000
```

Mở trình duyệt tại địa chỉ hiện ra (mặc định `http://localhost:3000`).

**Điều khiển:** `W A S D` / phím mũi tên — di chuyển · `Shift` — chạy nhanh · `E` — thắp đèn lồng (cần đang có đom đóm và đứng gần Đèn Lồng Lớn).

**Mục tiêu:** gom đom đóm trong đảo, nạp vào các Đèn Lồng Lớn để thắp đủ tất cả, né Bóng Mực trong sương đen trước khi hết giờ.

## 🧪 Chạy test và chế độ headless

```bash
node tools/run_tests.mjs                                    # toàn bộ test + scenario + tính tất định
node tools/run_headless.mjs scenarios/co-ban.json           # chạy 1 scenario, in JSON ra stdout
```

Test Contract (định dạng đầu vào/đầu ra headless): xem `docs/notes/headless-contract.md`. Kiến trúc tách **logic game** (`src/core/`, thuần Node, không phụ thuộc trình duyệt) khỏi **hiển thị** (`src/view/`, Three.js) để cùng một luật chạy cả trong game lẫn headless.

## 📁 Cấu trúc

```text
index.html              trang game (nạp Three.js qua CDN, không build step)
src/core/               logic game thuần (world, simulation, constants)
src/view/               hiển thị Three.js + HUD + điều khiển
scenarios/*.json        kịch bản headless
tests/*.test.mjs        test đơn vị (node:test, không framework ngoài)
tools/                  run_headless.mjs, run_tests.mjs
docs/notes/             giả định, nhật ký AI, retro, Test Contract
docs/proof/             bằng chứng kiểm chứng từng phase
.agents/skills/         skill verify-game (harness)
AGENTS.md               hướng dẫn cho AI agent (harness)
```

## 🏮 Sáng tạo của tôi

- Nhân vật Mây có đèn lồng nhỏ phát sáng theo người (hào quang point light), giúp định hướng trong sương.
- Đèn Lồng Lớn chuyển màu và phát sáng thật khi được thắp (emissive + point light), đom đóm nhấp nhô như đang bay.
- (đang cập nhật thêm qua các phase — phần này tăng theo hạng mục F của rubric)

## 📝 Ghi chú

- Nhân vật, bối cảnh là bản gốc của lab; nguồn asset và công cụ AI ghi trong [CREDITS.md](CREDITS.md). Giấy phép: [MIT](LICENSE).
- Tiến độ theo phase: xem [CHANGELOG.md](CHANGELOG.md); bằng chứng từng phase: `docs/proof/`.
