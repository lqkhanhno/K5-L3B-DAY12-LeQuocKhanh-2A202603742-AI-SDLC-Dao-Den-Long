// run_headless.mjs — Chạy một scenario không giao diện, in kết quả JSON ra stdout.
//
// CÁCH DÙNG:
//   node tools/run_headless.mjs scenarios/co-ban.json
//
// ĐỊNH DẠNG OUTPUT: xem docs/notes/headless-contract.md
// LƯU Ý: định dạng này là GIẢ ĐỊNH ban đầu, sẽ được chỉnh khớp Test Contract
// chính thức ngay khi PRD-0 được cung cấp. Mọi thay đổi định dạng phải ghi vào
// CHANGELOG.md và chạy lại toàn bộ scenario cũ.

import { readFileSync } from 'node:fs';
import { createWorld, step } from '../src/core/index.mjs';

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Thiếu đường dẫn scenario. Dùng: node tools/run_headless.mjs scenarios/<ten>.json');
    process.exit(2);
  }

  let scenario;
  try {
    scenario = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Không đọc được scenario ${file}: ${err.message}`);
    process.exit(2);
  }

  const world = createWorld(scenario.world ?? {});
  const script = scenario.script ?? []; // [{ ticks, moveX, moveZ, sprint, action }]
  const events = [];
  let tick = 0;

  for (const seg of script) {
    const n = seg.ticks ?? 0;
    for (let i = 0; i < n; i++) {
      const ev = step(world, {
        moveX: seg.moveX ?? 0,
        moveZ: seg.moveZ ?? 0,
        sprint: seg.sprint ?? false,
        action: seg.action ?? false,
      });
      for (const e of ev) events.push({ tick, ...e });
      tick++;
      if (world.status !== 'playing') break;
    }
    if (world.status !== 'playing') break;
  }

  const output = {
    scenario: scenario.name ?? file,
    seed: world.seed,
    ticks: tick,
    status: world.status,
    player: {
      x: round(world.player.x),
      z: round(world.player.z),
      fireflies: world.player.fireflies,
    },
    lanterns: world.lanterns.map(l => ({ x: round(l.x), z: round(l.z), lit: l.lit })),
    firefliesCollected: world.fireflies.filter(f => f.collected).length,
    firefliesTotal: world.fireflies.length,
    elapsedSeconds: round(world.elapsedSeconds),
    events,
  };

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  process.exit(0);
}

// Làm tròn 4 chữ số để output ổn định giữa các lần chạy (tránh sai số float hiển thị).
function round(v) {
  return Math.round(v * 10000) / 10000;
}

main();
