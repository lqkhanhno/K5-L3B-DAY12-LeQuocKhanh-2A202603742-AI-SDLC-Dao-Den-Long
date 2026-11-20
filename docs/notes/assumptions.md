# Giả định (Assumptions)

Mỗi chỗ mơ hồ của đề: tự chọn giá trị hợp lý, ghi lại ở đây, kiểm chứng theo đúng giả định đó.

## Nguồn yêu cầu

Xem `requirements-source.md` — lab board không dùng; PRD-0 suy ra từ README.md, contract tự thiết kế, ticket tự định nghĩa bám tính chất phase trong CHECKPOINTS.md.

## Phase 1 (PRD-0 suy ra từ README: "gom đom đóm để thắp lại các Đèn Lồng Lớn và né Bóng Mực")

| # | Chỗ mơ hồ | Giả định đã chọn | Ghi chú |
|---|---|---|---|
| A1 | Số đom đóm, số đèn lồng mỗi màn | 12 đom đóm, 3 đèn lồng, seed cố định 2026 | đặt trong `createWorld` gọi từ view; headless nhận qua params |
| A2 | Cách "gom" đom đóm | Đủ gần (≤ 1.2 đơn vị) thì tự gom, không cần phím | gần gũi cảm nhận "thu thập" tự nhiên |
| A3 | Cách "thắp" đèn | Nhấn/giữ E khi đứng ≤ 1.6 đơn vị, mỗi đèn tốn 1 đom đóm | phím E là lựa chọn hiển nhiên, ghi luật tốn 1 đom |
| A4 | Bóng Mực hoạt động thế nào | Đuổi thẳng người chơi, tốc độ 3.2 (chậm hơn người đi 6.0), chạm thì mất 2 đom đóm | né được bằng chạy; không giết người chơi trong Phase 1 |
| A5 | Thắng/thua | Thắng: thắp đủ mọi đèn. Thua: hết giờ (180s) hoặc hết đom đóm mà chưa thắp đèn nào | "hết giờ" là ràng buộc lab 4h; hết đom = không còn cách thắng |
| A6 | Số Bóng Mực | 1 con ở màn Phase 1 | đủ tạo động lực "né", không quá khó |
| A7 | Kích thước đảo | Bán kính 40 đơn vị, mọi thực thể nằm trong đảo | đủ rộng để đi lại có ý nghĩa trong 180s |
| A8 | Test Contract | Tự thiết kế: JSON scenario vào → JSON kết quả ra, tick 30Hz, tất định theo seed | xem `headless-contract.md`; sẽ chỉnh khớp nếu đề chính thức phát hành |
| A9 | Nhân vật phím điều khiển | WASD/mũi tên + Shift sprint + E thắp | chuẩn PC, không cần gamepad |

Mọi con số trên nằm tập trung trong `src/core/constants.mjs` — phase sau đổi luật chỉ sửa một file.
