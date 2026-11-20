# Test Contract — Chế độ headless (bản làm việc của sinh viên)

> **Trạng thái: BẢN NHÁP tự đặt ra.** PRD-0 chính thức chưa được cung cấp vào thời điểm viết;
> định dạng dưới đây do sinh viên tự thiết kế theo yêu cầu chung trong README lab (chế độ headless
> với đầu vào/đầu ra cố định, tất định). **Sẽ điều chỉnh khớp Test Contract chính thức ngay khi
> PRD-0 được phát hành** — mọi thay đổi định dạng ghi vào CHANGELOG.md và chạy lại toàn bộ scenario.

## Đầu vào

File JSON scenario, cấp cho `node tools/run_headless.mjs <file.json>`:

```json
{
  "name": "tên-scenario",
  "world": {
    "seed": 7,
    "fireflyCount": 2,
    "lanternCount": 1,
    "inkCount": 0,
    "fireflyPositions": [{"x": 0.5, "z": 0}],
    "lanternPositions": [{"x": 2, "z": 0}],
    "inkPositions": []
  },
  "script": [
    {"ticks": 1, "moveX": 0, "moveZ": 0, "sprint": false, "action": false}
  ],
  "expect": {"status": "won", "firefliesCollected": 1, "lanternsLit": 1}
}
```

- `world.seed`: tất định qua PRNG mulberry32 — cùng seed cùng kết quả trên mọi máy.
- Vị trí có thể bỏ (sinh từ seed) hoặc ép cứng (cho test đích xác).
- `script`: từng đoạn input với số tick; mỗi tick là 1/30 giây (`TICK_RATE = 30`).

## Đầu ra

JSON một đối tượng ra **stdout**, nguyên văn ví dụ:

```json
{
  "scenario": "co-ban-gom-va-thap",
  "seed": 7,
  "ticks": 10,
  "status": "won",
  "player": {"x": 1.8, "z": 0, "fireflies": 0},
  "lanterns": [{"x": 2, "z": 0, "lit": true}],
  "firefliesCollected": 1,
  "firefliesTotal": 2,
  "elapsedSeconds": 0.3333,
  "events": [
    {"tick": 0, "type": "firefly_collected", "id": 0, "x": 0.5, "z": 0},
    {"tick": 9, "type": "lantern_lit", "x": 2, "z": 0, "remainingFireflies": 0},
    {"tick": 9, "type": "game_won"}
  ]
}
```

- `status`: `playing` | `won` | `lost`.
- Số thực làm tròn 4 chữ số để output ổn định giữa các lần chạy.
- Lỗi sử dụng (thiếu file, JSON hỏng): thông báo ra **stderr**, thoát mã 2. Chạy thành công: thoát mã 0 bất kể thắng/thua.

## Tính tất định

Cùng file scenario chạy nhiều lần phải ra output byte-đền-byte. Kiểm tra tự động trong `run_tests.mjs`.
