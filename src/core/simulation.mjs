// simulation.mjs — Vòng lặp mô phỏng logic game. THUẦN, không import trình duyệt.
// Đây là "trái tim" chạy được cả headless lẫn view. Mỗi tick là một bước TICK_DT giây.
// Đầu vào: world + intent của người chơi (di chuyển, hành động). Đầu ra: world thay đổi tại chỗ + sự kiện.
// [Phase 2] thêm: đèn cần `required` đom đóm (R2.1), Bóng Mực bao vây khi ≥2 con (R2.3).

import * as C from './constants.mjs';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const dist2 = (ax, az, bx, bz) => (ax - bx) ** 2 + (az - bz) ** 2;

/**
 * Mô phỏng đúng một tick logic.
 * @param {object} world — trạng thái từ createWorld
 * @param {object} input — { moveX, moveZ, sprint, action } — intent, giá trị chuẩn hóa
 * @returns {Array} events — danh sách sự kiện phát sinh tick này (dùng cho headless output và view VFX)
 */
export function step(world, input = {}) {
  const events = [];
  if (world.status !== 'playing') return events;

  // 1) Di chuyển người chơi theo intent, chuẩn hóa vector, tốc độ theo sprint.
  const len = Math.hypot(input.moveX || 0, input.moveZ || 0);
  if (len > 0) {
    const speed = C.PLAYER.speed * ((input.sprint) ? C.PLAYER.sprintMultiplier : 1);
    const nx = (input.moveX || 0) / len;
    const nz = (input.moveZ || 0) / len;
    world.player.x = clamp(world.player.x + nx * speed * C.TICK_DT, -C.WORLD.radius, C.WORLD.radius);
    world.player.z = clamp(world.player.z + nz * speed * C.TICK_DT, -C.WORLD.radius, C.WORLD.radius);
  }

  // 2) Gom đom đóm: đủ gần thì thu.
  for (const f of world.fireflies) {
    if (!f.collected && dist2(world.player.x, world.player.z, f.x, f.z) <= C.FIREFLY.collectRadius ** 2) {
      f.collected = true;
      world.player.fireflies += 1;
      events.push({ type: 'firefly_collected', id: f.id, x: f.x, z: f.z });
    }
  }

  // 3) Thắp đèn: hành động "thắp" khi đứng gần đèn còn tối.
  // [Phase 2 / R2.1] cần đủ `required` đom đóm; thiếu thì không thắp, không mất gì,
  // phát sự kiện lantern_rejected kèm have/need để headless kiểm chứng được.
  if (input.action) {
    for (const l of world.lanterns) {
      if (!l.lit && dist2(world.player.x, world.player.z, l.x, l.z) <= C.LANTERN.litRadius ** 2) {
        if (world.player.fireflies >= l.required) {
          l.lit = true;
          world.player.fireflies -= l.required;
          events.push({ type: 'lantern_lit', x: l.x, z: l.z, remainingFireflies: world.player.fireflies });
        } else {
          events.push({ type: 'lantern_rejected', x: l.x, z: l.z, have: world.player.fireflies, need: l.required });
        }
      }
    }
  }

  // 4) Bóng Mực: [Phase 2 / R2.3] 1 con đuổi thẳng (như Phase 1); từ 2 con trở lên,
  // ngoài followRadius đuổi thẳng, trong followRadius thì vòng quanh người chơi
  // (giữ khoảng cách hiện tại, góc tăng đều orbitAngularSpeed — chiều kim đồng hồ nhìn từ trên).
  for (const ink of world.inks) {
    const dx = world.player.x - ink.x;
    const dz = world.player.z - ink.z;
    const d = Math.hypot(dx, dz) || 1e-9;
    if (world.inks.length >= 2 && d < C.INK.followRadius) {
      // Chế độ bao vây: di chuyển tiếp tuyến quanh người chơi, giữ gần bán kính hiện tại.
      const ang = Math.atan2(ink.z - world.player.z, ink.x - world.player.x);
      const nextAng = ang + C.INK.orbitAngularSpeed * C.TICK_DT;
      const keepR = Math.max(d, C.INK.catchRadius * 1.2); // không tự lao vào người chơi
      const targetX = world.player.x + Math.cos(nextAng) * keepR;
      const targetZ = world.player.z + Math.sin(nextAng) * keepR;
      // Di chuyển về mục tiêu với tốc độ INK, giới hạn bởi độ dài bước.
      const stepLen = C.INK.speed * C.TICK_DT;
      const moveX = targetX - ink.x, moveZ = targetZ - ink.z;
      const moveLen = Math.hypot(moveX, moveZ) || 1e-9;
      const k = Math.min(1, stepLen / moveLen);
      ink.x += moveX * k;
      ink.z += moveZ * k;
      ink.dirX = moveX / moveLen; ink.dirZ = moveZ / moveLen;
    } else {
      ink.dirX = dx / d; ink.dirZ = dz / d;
      ink.x += ink.dirX * C.INK.speed * C.TICK_DT;
      ink.z += ink.dirZ * C.INK.speed * C.TICK_DT;
    }
    if (dist2(world.player.x, world.player.z, ink.x, ink.z) <= C.INK.catchRadius ** 2 &&
        world.player.fireflies > 0) {
      world.player.fireflies = Math.max(0, world.player.fireflies - C.INK.drainOnCatch);
      events.push({ type: 'ink_caught', remainingFireflies: world.player.fireflies });
    }
  }

  // 5) Thời gian và điều kiện thắng/thua.
  world.elapsedSeconds += C.TICK_DT;
  const litCount = world.lanterns.filter(l => l.lit).length;
  if (litCount === world.lanterns.length && world.lanterns.length > 0) {
    world.status = 'won';
    events.push({ type: 'game_won' });
  } else if (world.fireflies.length > 0 && world.player.fireflies === 0 && litCount === 0 &&
             world.fireflies.every(f => f.collected) ) {
    // Hết đom đóm mà chưa thắp được đèn nào -> không còn cách thắng (giả định Phase 1).
    // Lưu ý: chỉ áp dụng khi thế giới CÓ đom đóm; thế giới không có đom đóm (degenerate,
    // dùng cho test di chuyển) thì không thua ngay mà chờ time_out.
    world.status = 'lost';
    events.push({ type: 'game_lost', reason: 'all_fireflies_lost' });
  } else if (world.elapsedSeconds >= C.ROUND.timeLimitSeconds) {
    world.status = 'lost';
    events.push({ type: 'game_lost', reason: 'time_out' });
  }

  return events;
}
