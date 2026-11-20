// phase2.test.mjs — Test luật mới Phase 2 (Ticket-02): R2.1 required, R2.3 bao vây.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWorld, step, C } from '../src/core/index.mjs';

// ---- R2.1: đèn cần required đom đóm ----

test('R2.1: đèn mặc định cần 3 đom đóm — đủ thì thắp, trừ đúng 3', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 5, lanternCount: 1,
    fireflyPositions: [{ x: 0.5, z: 0 }, { x: 0.6, z: 0 }, { x: 0.7, z: 0 }, { x: -20, z: -20 }, { x: -21, z: -21 }],
    lanternPositions: [{ x: 1, z: 0 }],
  });
  step(w, {}); // gom 3 đom đóm gần chỗ đứng
  assert.equal(w.player.fireflies, 3);
  step(w, { action: true });
  assert.equal(w.lanterns[0].lit, true);
  assert.equal(w.player.fireflies, 0); // trừ đúng 3
});

test('R2.1: thiếu đom đóm thì KHÔNG thắp, KHÔNG mất, có sự kiện lantern_rejected (have/need)', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 2, lanternCount: 1,
    fireflyPositions: [{ x: 0.5, z: 0 }, { x: 0.6, z: 0 }],
    lanternPositions: [{ x: 1, z: 0 }],
  });
  step(w, {}); // có 2 < 3
  const events = step(w, { action: true });
  assert.equal(w.lanterns[0].lit, false);
  assert.equal(w.player.fireflies, 2); // không mất
  const rej = events.find(e => e.type === 'lantern_rejected');
  assert.ok(rej, 'phải có lantern_rejected');
  assert.equal(rej.have, 2);
  assert.equal(rej.need, 3);
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
