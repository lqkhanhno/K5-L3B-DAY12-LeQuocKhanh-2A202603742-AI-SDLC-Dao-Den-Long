// run_tests.mjs — Chạy toàn bộ test + scenario và báo mã thoát. Không framework ngoài,
// chỉ assert của Node: đủ dùng, không cần npm install (người chấm clone là chạy được).
//
//   node tools/run_tests.mjs
//
// Thoát 0 = mọi thứ xanh. Thoát 1 = có đỏ. Đầu ra liệt kê từng test, đếm số đạt/sai.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- Nạp mọi file test trong tests/ ---
const testFiles = [];
(function collect(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) collect(p);
    else if (name.endsWith('.test.mjs')) testFiles.push(p);
  }
})(join(ROOT, 'tests'));

for (const f of testFiles) {
  await import(pathToFileURL(f).href);
}

// --- Chạy mọi scenario JSON qua headless runner và kiểm tra expect tối thiểu ---
// Cấu trúc expect (tùy chọn trong file scenario):
//   "expect": { "status": "won", "firefliesCollected": 5, "lanternsLit": 2 }
const scenarioDir = join(ROOT, 'scenarios');
for (const name of readdirSync(scenarioDir)) {
  if (!name.endsWith('.json')) continue;
  test(`scenario: ${name}`, () => {
    const out = execFileSync(process.execPath,
      [join(ROOT, 'tools', 'run_headless.mjs'), join(scenarioDir, name)],
      { encoding: 'utf8' });
    const result = JSON.parse(out);
    const scen = JSON.parse(readFileSync(join(scenarioDir, name), 'utf8'));
    if (scen.expect) {
      if (scen.expect.status !== undefined) assert.equal(result.status, scen.expect.status);
      if (scen.expect.firefliesCollected !== undefined)
        assert.equal(result.firefliesCollected, scen.expect.firefliesCollected);
      if (scen.expect.lanternsLit !== undefined)
        assert.equal(result.lanterns.filter(l => l.lit).length, scen.expect.lanternsLit);
      if (scen.expect.eventsInclude !== undefined) {
        for (const evType of scen.expect.eventsInclude)
          assert.ok(result.events.some(e => e.type === evType), `thiếu sự kiện ${evType}`);
      }
    }
  });
}

// --- Tính tất định: chạy 2 lần scenario đầu tiên, output phải giống nhau hệt ---
const firstScenario = readdirSync(scenarioDir).find(n => n.endsWith('.json'));
if (firstScenario) {
  test(`tất định: ${firstScenario} chạy 2 lần ra cùng kết quả`, () => {
    const run = () => execFileSync(process.execPath,
      [join(ROOT, 'tools', 'run_headless.mjs'), join(scenarioDir, firstScenario)],
      { encoding: 'utf8' });
    assert.equal(run(), run());
  });
}
