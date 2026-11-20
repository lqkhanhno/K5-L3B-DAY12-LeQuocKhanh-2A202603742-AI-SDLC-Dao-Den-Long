# Nhật ký dùng AI (AI log)

Ghi lại: phase nào, dùng AI làm gì, AI sai ở đâu và phát hiện thế nào, token/chi phí ước tính.

> Cách ước tính: 1 request Claude Code trung bình ~ dung lượng ngữ cảnh đó; ghi ước lượng thô là đủ, trọng tâm là thói quen cân nhắc.

| Thời điểm | Phase | Việc | AI sai / khắc phục | Token ước tính |
|---|---|---|---|---|
| 2026-11-20 | CP0 | Đọc 6 file đề, chốt kiến trúc (Three.js qua CDN + core thuần Node), viết AGENTS.md, skill verify-game | — | ~40k input / ~8k output |

## Bài học tiết kiệm token

- Kiến trúc không cần `npm install` giúp agent không đốt token đọc node_modules và người chấm không cần cài gì.
- Ghi sẵn quy tắc "chạy test trước khi báo xong" vào AGENTS.md để không phải nhắc lại mỗi lần.
