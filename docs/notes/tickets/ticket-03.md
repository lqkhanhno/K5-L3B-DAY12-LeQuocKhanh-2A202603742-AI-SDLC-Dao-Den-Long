# Ticket-03 — THAY ĐỔI: Đèn tự sáng khi nạp đủ, bỏ phím E; Bóng Mực mất năng lực trong ánh sáng

> **Phase 3** (30 phút — ngắn). Tính chất phase theo CHECKPOINTS.md: *xử lý một thay đổi yêu cầu
> có thể **thay thế** những luật đã có*. Ticket này **thay thế** hai luật của Phase 1–2 (ghi rõ ở
> R3.1). Nguồn: ticket do sinh viên định nghĩa (xem `requirements-source.md`).

## Bối cảnh (giọng khách hàng)

Test người chơi phản ánh: nhấn E "giả tạo", muốn đèn **tự sáng khi người chơi mang đủ đom đóm đến gần** —
giống c HoldingOffer dâng lửa. Đồng thời sương đen quá an toàn: Bóng Mực phải **sợ ánh sáng đèn lồng**.

## Yêu cầu bắt buộc

- **R3.1 [THAY THẾ R2.1 + phím E của Phase 1]** Khi người chơi đang đứng trong bán kính thắp của đèn
  còn tối và **mang đủ** `required` đom đóm, đèn **tự thắp ngay không cần nhấn phím**, trừ đúng
  `required` đom đóm. Phím E không còn tác dụng. Sự kiện `lantern_rejected` **bỏ** — thiếu đom đóm
  thì đơn giản không có gì xảy ra (im lặng là hành vi chính xác).
- **R3.2** Bóng Mực trong bán kính `lightRadius` (mặc định 5) của **một đèn đã thắp** thì bỏ chạy:
  di chuyển **ngược hướng** ra khỏi đèn với tốc độ `fleeSpeed` (mặc định 4.0) thay vì bao vây/đuổi.
  Ngoài bán kính thì hành vi Phase 2 tiếp tục hiệu lực.
- **R3.3** Đèn đã thắp giờ là **an toàn vùng**: scenario mới `an-toan.json` chứng minh người chơi đứng
  cạnh đèn đã thắp, Bóng Mực không thể lại gần hơn `lightRadius` sau khi đuổi đến.
- **R3.4 [Hồi quy có thay thế]** Test Phase 1–2 dùng phím E để thắp: **sửa theo luật mới kèm lý do**
  (thắp tự động). Scenario `co-ban.json` cập nhật tương tự. Test bao vây Phase 2 vẫn giữ — Bóng Mực
  2 con vẫn orbit khi KHÔNG có đèn thắp gần đó (thế giới scenario không có đèn thắp sẵn).
- **R3.5** Headless: output thêm `fleeing: true/false` cho từng Bóng Mực ở trạng thái cuối.

## Giả định tự chọn (A14+)

- `lightRadius = 5`, `fleeSpeed = 4.0` (nhanh hơn người đi bộ 6.0? Không — 4.0 < 6.0 nên người chơi
  vẫn thoát được khi chạy; Bóng Mực chạy 3.2 khi đuổi, bỏ chạy 4.0 để thoát ánh sáng nhanh hơn đuổi).
- Khi vừa thắp đèn mà Bóng Mực đang ở trong vùng sáng, nó chuyển bỏ chạy ngay từ tick kế tiếp.
- "Bỏ chạy" = vector từ đèn đến Bóng Mực, chuẩn hóa, di chuyển theo hướng đó `fleeSpeed`.

## Bàn giao phase

- Code + test theo trên, ghi chú thiết kế thay thế trong `docs/notes/design-changes.md`,
  bằng chứng `docs/proof/phase-3.md`, tag `phase-3`.
