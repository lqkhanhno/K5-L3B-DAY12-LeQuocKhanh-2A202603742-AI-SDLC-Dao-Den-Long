# Ghi chú thiết kế — các lần ĐỔI HƯỚNG (design changes)

> CHECKPOINTS CP3: *"Người khác đọc ghi chú của bạn hiểu được vì sao đổi hướng."*

## Phase 3 (Ticket-03): hai luật bị THAY THẾ

### 1. Thắp đèn: từ "nhấn E" sang "tự động" (R3.1 thay R2.1 + phím E Phase 1)

- **Trước:** người chơi nhấn/giữ E khi đứng gần đèn còn tối và có ≥ required đom đóm; thiếu thì phát sự kiện `lantern_rejected`.
- **Sau:** trong mỗi tick, đèn còn tối tự thắp ngay khi người chơi vừa nằm trong `litRadius` và mang đủ `required`; thiếu thì **không có sự kiện nào**. `lantern_rejected` bị XÓA khỏi contract.
- **Vì sao:** phản hồi test người chơi ("nhấn E giả tạo") — đèn lồng tự nhận lửa hợp narrative hơn.
- **Ảnh hưởng thiết kế:** bước 3 của `step()` chuyển từ khối `if (input.action)` sang chạy mỗi tick. Ý nghĩa thứ tự tick thay đổi: gom và thắp có thể xảy ra trong CÙNG tick nếu đom đóm nằm giữa người chơi và đèn (chấp nhận — ghi vào test Phase 2 đã cập nhật).
- **Ảnh hưởng test:** 3 test/scenario cũ dùng action được sửa tường minh kèm lý do trong comment `[Phase 3 / R3.4]`; 1 test `lantern_rejected` bỏ và thay bằng test "im lặng".

### 2. Bóng Mực: thêm lớp ưu tiên "bỏ chạy khỏi ánh sáng" (R3.2 — bổ sung, không thay thế R2.3)

- **Trước:** 1 con đuổi thẳng; ≥2 con: trong `followRadius` orbit, ngoài đó đuổi thẳng.
- **Sau:** ưu tiên cao nhất là kiểm tra đèn ĐÃ THẮP trong `lightRadius=5`: nếu có, Bóng Mực chạy ra xa đèn với `fleeSpeed=4.0`, flag `fleeing=true`. Các nhánh cũ giữ nguyên khi không có vùng sáng.
- **Vì sao:** sương đen trước đó quá an toàn; đèn đã thắp cần có giá trị chiến thuật ngoài điều kiện thắng.
- **Hệ quả cân bằng:** `fleeSpeed (4.0) > chaseSpeed (3.2)` — Bóng Mực thoát ánh sáng nhanh hơn khi đuổi, nên vùng sáng là nơi trú thực sự nhưng không giữ được mãi (nó thoát ra rồi quay lại). Người đi bộ 6.0 vẫn né tốt.
- **Contract:** output headless thêm `inks[].fleeing` (R3.5) — bổ sung, không phá định dạng cũ.
