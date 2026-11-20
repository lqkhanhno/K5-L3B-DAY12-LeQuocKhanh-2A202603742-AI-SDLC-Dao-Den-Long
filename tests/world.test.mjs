// world.test.mjs — Test logic thuần: sinh thế giới tất định, giá trị biên.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWorld, mulberry32, C } from '../src/core/index.mjs';

test('cùng seed -> cùng thế giới (tất định)', () => {
  const a = createWorld({ seed: 42, fireflyCount: 5, lanternCount: 2 });
  const b = createWorld({ seed: 42, fireflyCount: 5, lanternCount: 2 });
  assert.deepEqual(a, b);
});

test('khác seed -> thế giới khác nhau (xác suất cao)', () => {
  const a = createWorld({ seed: 1, fireflyCount: 5, lanternCount: 2 });
  const b = createWorld({ seed: 2, fireflyCount: 5, lanternCount: 2 });
  assert.notDeepEqual(a.fireflies.map(f => [f.x, f.z]), b.fireflies.map(f => [f.x, f.z]));
});

test('số lượng thực thể theo params', () => {
  const w = createWorld({ seed: 7, fireflyCount: 20, lanternCount: 4, inkCount: 2 });
  assert.equal(w.fireflies.length, 20);
  assert.equal(w.lanterns.length, 4);
  assert.equal(w.inks.length, 2);
  assert.equal(w.status, 'playing');
  assert.equal(w.player.fireflies, 0);
});

test('mulberry32: chuỗi số lặp lại đúng với cùng seed', () => {
  const r1 = mulberry32(123);
  const r2 = mulberry32(123);
  for (let i = 0; i < 10; i++) assert.equal(r1(), r2());
});

test('mọi thực thể nằm trong bán kính đảo', () => {
  const w = createWorld({ seed: 99, fireflyCount: 50, lanternCount: 5, inkCount: 3 });
  const inR = (e) => Math.hypot(e.x, e.z) <= C.WORLD.radius + 1e-9;
  assert.ok(w.fireflies.every(inR));
  assert.ok(w.lanterns.every(inR));
  assert.ok(w.inks.every(inR));
});

test('ép vị trí qua params được tôn trọng (cho scenario test)', () => {
  const w = createWorld({ seed: 1, lanternCount: 1, lanternPositions: [{ x: 3, z: 4 }] });
  assert.equal(w.lanterns[0].x, 3);
  assert.equal(w.lanterns[0].z, 4);
});
