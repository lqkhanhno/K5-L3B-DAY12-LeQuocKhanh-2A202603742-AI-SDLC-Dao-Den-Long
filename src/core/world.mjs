// world.mjs — Sinh thế giới đảo: vị trí đom đóm, đèn lồng, Bóng Mực, điểm xuất phát.
// Sinh thế giới là HÀM THUẦN của seed (tất định): cùng seed -> cùng thế giới,
// bất kể platform hay thời điểm. Đây là nền tảng của Test Contract.
// PRD-0 chưa nêu bố cục cụ thể: bố cục dưới đây là GIẢ ĐỊNH, khai báo qua params.

import { WORLD } from './constants.mjs';

// PRNG mulberry32 — nhỏ, nhanh, tất định, đủ cho sinh thế giới.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rndPointInCircle(rnd, radius) {
  const r = radius * Math.sqrt(rnd());
  const theta = rnd() * Math.PI * 2;
  return { x: Math.cos(theta) * r, z: Math.sin(theta) * r };
}

/**
 * Sinh thế giới từ params. Hàm thuần: không đọc trạng thái ngoài, không副作用.
 * @param {object} params — do scenario/kịch bản cung cấp:
 *   seed, fireflyCount, lanternCount (mặc định theo giả định Phase 1),
 *   inkCount (0 nếu không đề cập), lanternPositions/fireflyPositions (tùy chọn, ép vị trí để test).
 */
export function createWorld(params = {}) {
  const seed = params.seed ?? 1;
  const rnd = mulberry32(seed);

  const fireflyCount = params.fireflyCount ?? 12;
  const lanternCount = params.lanternCount ?? 3;
  const inkCount = params.inkCount ?? 0; // giả định Phase 1: không có Bóng Mực nếu không nêu

  // Người chơi xuất phát ở tâm đảo.
  const player = { x: 0, z: 0, fireflies: 0 };

  const lanterns = [];
  for (let i = 0; i < lanternCount; i++) {
    const p = (params.lanternPositions && params.lanternPositions[i]) ||
      rndPointInCircle(rnd, WORLD.radius * 0.6);
    lanterns.push({ x: p.x, z: p.z, lit: false });
  }

  const fireflies = [];
  for (let i = 0; i < fireflyCount; i++) {
    const p = (params.fireflyPositions && params.fireflyPositions[i]) ||
      rndPointInCircle(rnd, WORLD.radius * 0.9);
    fireflies.push({ id: i, x: p.x, z: p.z, collected: false });
  }

  const inks = [];
  for (let i = 0; i < inkCount; i++) {
    const p = (params.inkPositions && params.inkPositions[i]) ||
      rndPointInCircle(rnd, WORLD.radius * 0.7);
    inks.push({ id: i, x: p.x, z: p.z, dirX: 0, dirZ: 0 });
  }

  return { seed, params, player, lanterns, fireflies, inks, elapsedSeconds: 0, status: 'playing' };
}
