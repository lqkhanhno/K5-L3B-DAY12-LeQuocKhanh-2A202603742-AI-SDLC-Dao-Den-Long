// phase2.test.mjs — Test luật mới Phase 2 (Ticket-02): R2.1 required, R2.3 bao vây.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWorld, step, C } from '../src/core/index.mjs';

// ---- R2.1: đèn cần required đom đóm ----
// [Phase 3 / R3.4] Luật thắp ĐỔI từ "nhấn E" sang "tự thắp khi đủ điều kiện" — các test này
// được sửa theo luật mới (bỏ bước nhấn action). Ý định kiểm tra (trừ đúng required,
// ép params) giữ nguyên. Test lantern_rejected ĐÃ BỎ theo R3.1 — thay bằng test "im lặng".

test('R2.1: đèn mặc định cần 3 đom đóm — đứng đủ gần và đủ thì TỰ thắp, trừ đúng 3', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 5, lanternCount: 1,
    // [Phase 3] Đèn ở XA ngoài litRadius để tách bạch: tick đầu chỉ gom, không thắp;
    // rồi di chuyển lại gần — đủ điều kiện tick nào là thắp tick đó (không cần action).
    fireflyPositions: [{ x: 0.5, z: 0 }, { x: 0.6, z: 0 }, { x: 0.7, z: 0 }, { x: -20, z: -20 }, { x: -21, z: -21 }],
    lanternPositions: [{ x: 8, z: 0 }],
  });
  step(w, {}); // gom 3 đom đóm; đèn xa (8 > 1.6) nên chưa thắp
  assert.equal(w.player.fireflies, 3);
  assert.equal(w.lanterns[0].lit, false);
  const events = step(w, { moveX: 1, moveZ: 0 }); // tiến gần thêm; chưa đủ gần
  assert.equal(w.lanterns[0].lit, false);
  // Tiến tiếp đến trong litRadius — tick nào đủ điều kiện là tự thắp tick đó.
  let litTick = -1;
  for (let i = 0; i < 60; i++) {
    const ev = step(w, { moveX: 1, moveZ: 0 });
    if (w.lanterns[0].lit) { litTick = i; assert.ok(ev.some(e => e.type === 'lantern_lit')); break; }
  }
  assert.ok(litTick >= 0, 'phải tự thắp khi đi vào bán kính');
  assert.equal(w.player.fireflies, 0); // trừ đúng 3
});

test('R2.1/R3.1: thiếu đom đóm thì không thắp, không mất, KHÔNG có sự kiện nào (im lặng)', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 2, lanternCount: 1,
    fireflyPositions: [{ x: 0.5, z: 0 }, { x: 0.6, z: 0 }],
    lanternPositions: [{ x: 1, z: 0 }],
  });
  step(w, {}); // có 2 < 3
  const events = step(w, {});
  assert.equal(w.lanterns[0].lit, false);
  assert.equal(w.player.fireflies, 2); // không mất
  assert.equal(events.find(e => e.type === 'lantern_lit'), undefined);
  assert.equal(events.find(e => e.type === 'lantern_rejected'), undefined); // sự kiện này đã bị bỏ
});

test('R2.1: required ép qua params được tôn trọng', () => {
  const w = createWorld({ seed: 1, fireflyCount: 0, lanternCount: 2,
    lanternRequiredFireflies: [5, 1] });
  assert.equal(w.lanterns[0].required, 5);
  assert.equal(w.lanterns[1].required, 1);
});

// ---- R2.3: Bóng Mực bao vây ----

test('R2.3: 1 con vẫn đuổi thẳng (hành vi Phase 1 giữ nguyên)', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 0, lanternCount: 1, inkCount: 1,
    lanternPositions: [{ x: 0, z: 30 }],
    inkPositions: [{ x: 5, z: 5 }],
  });
  const d0 = Math.hypot(w.player.x - w.inks[0].x, w.player.z - w.inks[0].z);
  for (let i = 0; i < 30; i++) step(w, {});
  const d1 = Math.hypot(w.player.x - w.inks[0].x, w.player.z - w.inks[0].z);
  assert.ok(d1 < d0, `khoảng cách phải giảm: ${d0} -> ${d1}`);
});

test('R2.3: 2 con trong followRadius thì vòng quanh — khoảng cách giữ gần nguyên, không lao vào', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 0, lanternCount: 1, inkCount: 2,
    lanternPositions: [{ x: 0, z: 30 }],
    inkPositions: [{ x: 4, z: 0 }, { x: -4, z: 0 }],
  });
  step(w, {}); // đưa cả 2 vào chế độ bao vây (d=4 < followRadius=6)
  const d0 = worldDist(w);
  for (let i = 0; i < 90; i++) step(w, {}); // 3 giây
  const d1 = worldDist(w);
  assert.ok(d1 > C.INK.catchRadius + 0.1, `không được lao vào người chơi: d=${d1}`);
  // Khoảng cách trung bình không giảm dần về 0: đứng lại gần bằng ban đầu (orbit giữ bán kính).
  assert.ok(Math.abs(d1 - d0) < 2.0, `bán kính orbit giữ ổn định: ${d0} -> ${d1}`);
});

test('R2.3: ngoài followRadius thì vẫn tiến về người chơi', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 0, lanternCount: 1, inkCount: 2,
    lanternPositions: [{ x: 0, z: 30 }],
    inkPositions: [{ x: 20, z: 0 }, { x: -20, z: 0 }],
  });
  for (let i = 0; i < 60; i++) step(w, {}); // 2 giây — vẫn ngoài 6 (3.2*2=6.4 đi được)
  const d = Math.min(
    Math.hypot(w.player.x - w.inks[0].x, w.player.z - w.inks[0].z),
    Math.hypot(w.player.x - w.inks[1].x, w.player.z - w.inks[1].z));
  assert.ok(d < 20, `phải tiến gần hơn vị trí xuất phát: d=${d}`);
});

function worldDist(w) {
  return Math.min(...w.inks.map(ink => Math.hypot(w.player.x - ink.x, w.player.z - ink.z)));
}
