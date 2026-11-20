---
name: verify-game
description: Chạy kiểm chứng game Đảo Đèn Lồng và lưu bằng chứng vào docs/proof/. Dùng trước khi kết thúc bất kỳ phase nào, khi cần chứng minh yêu cầu chạy đúng, hoặc khi cần kiểm tra hồi quy sau thay đổi.
---

# Skill: verify-game

Mục đích: biến việc "kiểm chứng" từ một lời nhắc thành một quy trình lặp lại được, để bằng chứng luôn khớp với mã ở tag tương ứng.

## Khi nào dùng

- Trước khi gắn tag `phase-N`.
- Sau khi sửa logic game hoặc đổi Test Contract.
- Khi cần chứng minh một yêu cầu cụ thể đang đạt (hoặc chưa đạt) cho docs/proof/.

## Các bước

1. Xác định **phase hiện tại** (N) và tên file bằng chứng: `docs/proof/phase-N.md`.
2. Chạy toàn bộ test và scenario:
   ```bash
   node tools/run_tests.mjs 2>&1 | tee /tmp/verify-N.txt
   ```
3. Nếu contract có yêu cầu **tất định**, chạy cùng một scenario hai lần và so sánh:
   ```bash
   node tools/run_headless.mjs scenarios/<ten>.json > /tmp/run-a.json
   node tools/run_headless.mjs scenarios/<ten>.json > /tmp/run-b.json
   diff /tmp/run-a.json /tmp/run-b.json && echo "TAT DINH: giong nhau"
   ```
4. Đối chiếu từng yêu cầu bắt buộc của phase với kết quả vừa chạy. Ghi thành bảng: yêu cầu, cách kiểm chứng, bằng chứng, kết quả.
5. Yêu cầu nào không đạt thì ghi **"chưa đạt"** kèm lý do. Không ghi đạt khi chưa có bằng chứng.
6. Lưu output thật vào `docs/proof/phase-N/`, ghi rõ lệnh đã chạy và cấu hình máy.
7. **Không** sửa tay file output. Nếu output sai định dạng thì sửa mã, chạy lại, thay bằng chứng mới.
8. Cập nhật `docs/notes/ai-log.md`: lần này AI sai ở đâu, phát hiện thế nào.

## Nguyên tắc

- Bằng chứng phải khớp mã ở tag: checkout lại tag đó, chạy lại, phải ra cùng kết quả.
- Một dòng "test đỏ" trung thực có giá trị hơn một bảng toàn dấu xanh không chạy được.
