// phase3.test.mjs — Test luật Phase 3 (Ticket-03): R3.1 thắp tự động thay phím E, R3.2 bỏ chạy khỏi ánh sáng.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWorld, step, C } from '../src/core/index.mjs';

// ---- R3.1: thắp tự động ----

test('R3.1: phím E KHÔNG còn tác dụng — nhấn E khi thiếu đom đóm không có sự kiện gì', () => {
  const w = createWorld({ seed: 1, fireflyCount: 0, lanternCount: 1,
    lanternPositions: [{ x: 1, z: 0 }] });
  const events = step(w, { action: true }); // nhấn E nhưng không có đom đóm
  assert.equal(w.lanterns[0].lit, false);
  assert.equal(events.length, 0, 'im lặng là hành vi chính xác');
});

// ---- R3.2: Bóng Mực bỏ chạy khỏi đèn đã thắp ----

test('R3.2: Bóng Mực trong lightRadius của đèn đã thắp thì bỏ chạy ra xa đèn', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 3, lanternCount: 2,
    fireflyPositions: [{ x: 0.5, z: 0 }, { x: 0.6, z: 0 }, { x: 0.7, z: 0 }],
    // Đèn A tại (1,0) — người chơi tự thắp ngay tick đầu (đủ 3, trong litRadius);
    // đèn B xa để test kết thúc đúng thời điểm. Bóng Mực đặt TRONG lightRadius của A.
    lanternPositions: [{ x: 1, z: 0 }, { x: 0, z: 30 }],
    inkCount: 1,
    inkPositions: [{ x: 3, z: 0 }], // cách đèn A là 2 < lightRadius 5
  });
  step(w, {}); // gom + tự thắp đèn A
  assert.equal(w.lanterns[0].lit, true);
  const distToLantern0 = () => Math.hypot(w.inks[0].x - 1, w.inks[0].z - 0);
  const d0 = distToLantern0();
  for (let i = 0; i < 60; i++) step(w, {}); // 2 giây — phải chạy ra xa đèn
  const d1 = distToLantern0();
  assert.ok(d1 > d0 + 1, `Bóng Mực phải ra xa đèn: ${d0} -> ${d1}`);
});

test('R3.2: fleeing=true khi trong vùng sáng, false khi không', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 3, lanternCount: 2,
    fireflyPositions: [{ x: 0.5, z: 0 }, { x: 0.6, z: 0 }, { x: 0.7, z: 0 }],
    lanternPositions: [{ x: 1, z: 0 }, { x: 0, z: 30 }],
    inkCount: 2,
    inkPositions: [{ x: 3, z: 0 }, { x: 25, z: 25 }],
  });
  step(w, {}); // thắp đèn A
  assert.equal(w.inks[0].fleeing, true);
  assert.equal(w.inks[1].fleeing, false);
});

test('R3.2: đèn CHƯA thắp không khiến Bóng Mực bỏ chạy', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 0, lanternCount: 1, inkCount: 1,
    lanternPositions: [{ x: 1, z: 0 }],
    inkPositions: [{ x: 3, z: 0 }],
  });
  step(w, {});
  assert.equal(w.inks[0].fleeing, false);
});

// ---- R3.3: vùng an toàn quanh đèn đã thắp ----

test('R3.3: người chơi cạnh đèn đã thắp — Bóng Mực không lại gần hơn lightRadius', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 3, lanternCount: 2,
    fireflyPositions: [{ x: 0.5, z: 0 }, { x: 0.6, z: 0 }, { x: 0.7, z: 0 }],
    lanternPositions: [{ x: 1, z: 0 }, { x: 0, z: 30 }],
    inkCount: 1,
    inkPositions: [{ x: 8, z: 0 }], // ngoài lightRadius, đuổi về người chơi
  });
  step(w, {}); // thắp đèn A; người chơi tại (0,0) gần đèn A
  // Bóng Mực tiến về; khi vào vùng sáng nó bỏ chạy — không được chạm người chơi.
  for (let i = 0; i < 300; i++) step(w, {}); // 10 giây
  const dPlayer = Math.hypot(w.inks[0].x - w.player.x, w.inks[0].z - w.player.z);
  assert.ok(dPlayer > C.INK.catchRadius, `không được chạm người chơi: d=${dPlayer}`);
  assert.ok(dPlayer > 2.0, `phải bị đẩy ra vùng sáng: d=${dPlayer}`);
});
