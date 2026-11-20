# Ticket-02 — Mở rộng: Hệ thống đèn lồng theo mực nạp và Bóng Mực biết bao vây

> **Phase 2** (60 phút). Tính chất phase theo CHECKPOINTS.md: *tiếp nhận yêu cầu mới, mở rộng sản phẩm
> mà không làm hỏng những gì đã đúng*. Yêu cầu mới có thể **bổ sung** Phase 1; không thay thế luật nào.
> Nguồn: ticket do sinh viên định nghĩa (xem `docs/notes/requirements-source.md`).

## Bối cảnh (giọng khách hàng)

Bản Phase 1 chơi được nhưng "gom xong là thắp" quá dễ — không có quyết định thú vị. Khách muốn
đèn lồng **cần nhiều đom đóm mới sáng**, và Bóng Mực **thông minh hơn chút** để người chơi phải né thật.

## Yêu cầu bắt buộc (mỗi ý một tiêu chí kiểm chứng được)

- **R2.1** Mỗi Đèn Lồng Lớn khai báo `requiredFireflies` (số đom đóm cần để thắp; mặc định 3).
  Thắp thành công khi người chơi có đủ số đom đóm và nhấn E trong bán kính thắp. Nhấn khi thiếu thì
  KHÔNG thắp, KHÔNG mất đom đóm, phát sự kiện `lantern_rejected` (kèm `have`, `need`).
- **R2.2** Output headless bổ sung `required` cho từng đèn và đếm `firefliesSpent` tổng đom đóm đã nạp.
- **R2.3** Bóng Mực (nếu ≥ 2 con) giữ khoảng cách theo dõi `followRadius` (mặc định 6): ngoài bán kính
  thì tiến về người chơi, trong bán kính thì **vòng quanh** người chơi (góc quay đều mỗi tick) thay vì lao thẳng.
  1 con thì giữ hành vi cũ (đuổi thẳng).
- **R2.4** **Hồi quy:** toàn bộ test và scenario Phase 1 phải còn xanh sau khi tích hợp (sửa nếu luật
  mới làm sai — kèm lý do, không tắt âm thầm).
- **R2.5** Scenario mới `bao-vay.json`: 2 Bóng Mực bao vây, người chơi sống sót qua đủ số tick mà
  không mất đom đóm (chứng minh hành vi vòng quanh đúng).

## Giả định tự chọn (điền vào assumptions.md A10+)

- `requiredFireflies = 3` cho mọi đèn; thắp xong đèn KHÔNG hoàn đom đóm.
- `followRadius = 6`, tốc độ vòng quanh = tốc độ Bóng Mực, chiều quay đồng hồ.
- "Vòng quanh" = giữ bán kính hiện tại, góc tăng 1.2 rad/giây quanh người chơi.

## Bàn giao phase

- Code + test + scenario theo trên, bằng chứng `docs/proof/phase-2.md`, tag `phase-2`.
