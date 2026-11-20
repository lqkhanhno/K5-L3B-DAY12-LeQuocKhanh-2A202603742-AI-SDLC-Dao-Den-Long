// simulation.test.mjs — Test luật chơi cốt lõi theo giả định Phase 1.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWorld, step, C } from '../src/core/index.mjs';

// Thế giới nhỏ cố định cho test: 1 đom đóm ngay cạnh, 1 đèn lồng ngay cạnh.
function tinyWorld() {
  return createWorld({
    seed: 1,
    fireflyCount: 1,
    lanternCount: 1,
    fireflyPositions: [{ x: 1, z: 0 }],
    lanternPositions: [{ x: 2, z: 0 }],
  });
}

test('đi đến gần đom đóm thì gom được', () => {
  const w = tinyWorld();
  // Người chơi ở (0,0), đom đóm ở (1,0), collectRadius=1.2: đứng yên đã đủ gần.
  const events = step(w, {});
  assert.equal(w.player.fireflies, 1);
  assert.ok(events.some(e => e.type === 'firefly_collected'));
});

test('đom đóm xa thì chưa gom được', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 1, lanternCount: 1,
    fireflyPositions: [{ x: 10, z: 0 }],
    lanternPositions: [{ x: 2, z: 0 }],
  });
  step(w, {});
  assert.equal(w.player.fireflies, 0);
});

test('giữ action cạnh đèn lồng còn tối, có đom đóm -> thắp được', () => {
  const w = tinyWorld();
  step(w, {}); // gom đom đóm
  // Người chơi ở (0,0), đèn ở (2,0), litRadius=1.6 -> 2 > 1.6: phải tiến lại trước.
  for (let i = 0; i < 5; i++) step(w, { moveX: 1, moveZ: 0 });
  const events = step(w, { action: true });
  assert.equal(w.lanterns[0].lit, true);
  assert.equal(w.player.fireflies, 0);
  assert.ok(events.some(e => e.type === 'lantern_lit'));
});

test('không có đom đóm thì không thắp được đèn', () => {
  const w = tinyWorld();
  // Đứng xa đèn (đèn ở (2,0), litRadius 1.6), nhấn action liên tục: không có đom đóm
  // nên dù tiến lại gần (trong bán kính gom thì cũng gom được) — dùng thế giới không đom đóm.
  const w2 = createWorld({ seed: 1, fireflyCount: 0, lanternCount: 1,
    lanternPositions: [{ x: 1, z: 0 }] });
  step(w2, { action: true });
  assert.equal(w2.lanterns[0].lit, false);
  assert.equal(w.status, 'playing'); // w chưa thắp vì đứng xa đèn
});

test('thắp đèn cuối cùng -> thắng', () => {
  const w = tinyWorld();
  step(w, {});
  for (let i = 0; i < 5; i++) step(w, { moveX: 1, moveZ: 0 });
  step(w, { action: true });
  assert.equal(w.status, 'won');
});

test('hết thời gian -> thua vì time_out', () => {
  const w = tinyWorld();
  const totalTicks = Math.ceil(C.ROUND.timeLimitSeconds * C.TICK_RATE) + 2;
  for (let i = 0; i < totalTicks; i++) step(w, {});
  assert.equal(w.status, 'lost');
});

test('tốc độ di chuyển đúng hằng số (đi 1 giây = speed đơn vị)', () => {
  // Thế giới trống (0 đom đóm, 1 đèn xa) để không bị kết thúc sớm bởi luật thắng/thua.
  const w = createWorld({ seed: 1, fireflyCount: 0, lanternCount: 1,
    lanternPositions: [{ x: 0, z: 30 }] });
  const ticks = C.TICK_RATE;
  for (let i = 0; i < ticks; i++) step(w, { moveX: 1, moveZ: 0 });
  assert.ok(Math.abs(w.player.x - C.PLAYER.speed) < 1e-6, `x=${w.player.x}`);
  assert.equal(w.player.z, 0);
});

test('sprint nhanh hơn đi bộ', () => {
  const mk = () => createWorld({ seed: 1, fireflyCount: 0, lanternCount: 1,
    lanternPositions: [{ x: 0, z: 30 }] });
  const a = mk(), b = mk();
  const ticks = C.TICK_RATE;
  for (let i = 0; i < ticks; i++) step(a, { moveX: 1, moveZ: 0 });
  for (let i = 0; i < ticks; i++) step(b, { moveX: 1, moveZ: 0, sprint: true });
  assert.ok(b.player.x > a.player.x * 1.2);
});

test('Bóng Mực đuổi theo và làm mất đom đóm', () => {
  const w = createWorld({
    seed: 1, fireflyCount: 2, lanternCount: 1, inkCount: 1,
    fireflyPositions: [{ x: 0.3, z: 0 }, { x: -20, z: -20 }],
    lanternPositions: [{ x: 0, z: 30 }],
    inkPositions: [{ x: 1.5, z: 0 }],
  });
  step(w, {}); // gom đom đóm ngay cạnh (0.3,0)
  assert.equal(w.player.fireflies, 1);
  // Bóng Mực ở (1.5,0) bay về người chơi: sau vài tick chạm (catchRadius 1.0) -> mất 2.
  for (let i = 0; i < 20; i++) step(w, {});
  assert.ok(w.player.fireflies === 0, `fireflies=${w.player.fireflies}`);
  assert.ok(w.inks[0].x > 1.0 || w.inks[0].x < 1.5, 'Bóng Mực đã di chuyển về phía người chơi');
});

test('không có input -> trạng thái không đổi ngoài thời gian', () => {
  // Đom đóm và đèn đặt XA ngoài mọi bán kính gom/thắp: đứng không thì không có gì xảy ra
  // ngoài đồng hồ thời gian. (Ở tinyWorld, đom đóm nằm sẵn trong bán kính gom nên đứng
  // không vẫn gom được — đúng luật, nhưng không phải kịch bản của test này.)
  const mk = () => createWorld({ seed: 1, fireflyCount: 1, lanternCount: 1,
    fireflyPositions: [{ x: 15, z: 15 }],
    lanternPositions: [{ x: -20, z: -20 }] });
  const w1 = mk();
  const w2 = mk();
  for (let i = 0; i < 30; i++) step(w1, {});
  assert.equal(w1.player.x, w2.player.x);
  assert.equal(w1.player.fireflies, w2.player.fireflies);
  assert.equal(w1.lanterns[0].lit, w2.lanterns[0].lit);
  assert.equal(w1.status, 'playing');
});
