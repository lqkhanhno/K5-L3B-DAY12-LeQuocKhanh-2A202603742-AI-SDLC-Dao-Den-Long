// benchmark.mjs — Đo hiệu năng theo Ticket-04 (R4.1, R4.2, R4.3). In kết quả dạng văn bản rõ ràng.
//
//   node tools/benchmark.mjs
//
// Ngưỡng (giả định A15): 100k tick < 5s; thế giới lớn < 100ms; 10 lần tất định từng byte, không quá 2× lần đầu.

import { performance } from 'node:perf_hooks';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createWorld } from '../src/core/index.mjs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'ĐẠT' : 'TRƯỢT'}  ${name}: ${detail}`);
  if (!ok) failures++;
};

// --- R4.1: 100k tick < 5s (chạy qua headless runner để đo trọn pipeline) ---
{
  const scen = join(ROOT, 'scenarios', 'hieu-nang.json');
  const t0 = performance.now();
  const out = execFileSync(process.execPath, [join(ROOT, 'tools', 'run_headless.mjs'), scen], { encoding: 'utf8' });
  const ms = performance.now() - t0;
  const result = JSON.parse(out);
  check('R4.1 100k tick', ms < 5000, `${ms.toFixed(0)} ms (ngưỡng 5000 ms), status=${result.status}, ticks=${result.ticks}`);
  globalThis.__hieu_nang_out = out;
}

// --- R4.2: tạo thế giới lớn < 100 ms ---
{
  const t0 = performance.now();
  const w = createWorld({ seed: 7, fireflyCount: 1000, lanternCount: 50, inkCount: 20 });
  const ms = performance.now() - t0;
  check('R4.2 thế giới 1000/50/20', ms < 100, `${ms.toFixed(1)} ms (ngưỡng 100 ms), thực thể=${w.fireflies.length + w.lanterns.length + w.inks.length}`);
}

// --- R4.3: 10 lần liên tiếp — giống nhau từng byte, không quá 2× lần đầu ---
{
  const scen = join(ROOT, 'scenarios', 'hieu-nang.json');
  const times = [];
  const outs = [];
  for (let i = 0; i < 10; i++) {
    const t0 = performance.now();
    outs.push(execFileSync(process.execPath, [join(ROOT, 'tools', 'run_headless.mjs'), scen], { encoding: 'utf8' }));
    times.push(performance.now() - t0);
  }
  const allSame = outs.every(o => o === outs[0]);
  const maxOverFirst = Math.max(...times) / times[0];
  check('R4.3a tất định 10 lần', allSame, allSame ? '10 output giống hệt từng byte' : 'CÓ output khác nhau — TẤT ĐỊNH BỊ PHÁ');
  check('R4.3b ổn định thời gian', maxOverFirst <= 2, `max/lần đầu = ${maxOverFirst.toFixed(2)}× (ngưỡng 2×); lần đầu ${times[0].toFixed(0)} ms, max ${Math.max(...times).toFixed(0)} ms`);
}

console.log(failures === 0 ? '\nKẾT LUẬN: mọi ngưỡng ĐẠT.' : `\nKẾT LUẬN: ${failures} ngưỡng TRƯỢT.`);
process.exit(failures === 0 ? 0 : 1);
