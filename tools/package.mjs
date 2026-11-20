// package.mjs — [Ticket-04 / R4.4] Tạo bản chạy được KHÔNG CẦN MẠNG trong dist/dao-den-long/.
//
//   node tools/package.mjs
//
// Bước tải Three.js về vendor/ cần mạng; chỉ chạy LẦN ĐẦU. Sau đó đóng gói lặp lại được offline.
// Kết quả: dist/dao-den-long/ — mở index.html trực tiếp (file://) hoặc npx serve đều chạy.

import { mkdirSync, cpSync, writeFileSync, existsSync, statSync, readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist', 'dao-den-long');
const VENDOR = join(ROOT, 'vendor');
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const THREE_LOCAL = join(VENDOR, 'three.module.js');

// --- Bước 1: bảo đảm Three.js local ---
function hasThree() {
  try { return statSync(THREE_LOCAL).size > 100_000; } catch { return false; }
}
if (!hasThree()) {
  console.log('Tải Three.js về vendor/ (chỉ lần đầu, cần mạng)...');
  mkdirSync(VENDOR, { recursive: true });
  try {
    execFileSync('curl', ['-sSL', '--retry', '2', '-o', THREE_LOCAL, THREE_URL], { stdio: 'inherit' });
  } catch {
    // curl thất bại — kiểm tra lại bên dưới, báo lỗi thân thiện thay vì ném stack.
  }
}
if (!hasThree()) {
  console.error('KHÔNG tải được Three.js (cần mạng lần đầu) hoặc file vendor/three.module.js không hợp lệ (<100KB).');
  console.error('Tải thủ công từ ' + THREE_URL + ' rồi đặt vào vendor/three.module.js, sau đó chạy lại: node tools/package.mjs');
  process.exit(1);
}
console.log(`Three.js local sẵn: ${(statSync(THREE_LOCAL).size / 1024 / 1024).toFixed(2)} MB`);

// --- Bước 2: dựng dist ---
mkdirSync(DIST, { recursive: true });

// index.html bản đóng gói: import map trỏ vendor/ thay vì CDN
const html = readFileSync(join(ROOT, 'index.html'), 'utf8')
  .replace('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js', './vendor/three.module.js')
  .replace('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/', './vendor/addons/');
writeFileSync(join(DIST, 'index.html'), html);

// Mã nguồn view + core + vendor
cpSync(join(ROOT, 'src'), join(DIST, 'src'), { recursive: true });
mkdirSync(join(DIST, 'vendor'), { recursive: true });
cpSync(THREE_LOCAL, join(DIST, 'vendor', 'three.module.js'));

// README hướng dẫn bản đóng gói
writeFileSync(join(DIST, 'README.txt'), `DAO DEN LONG — ban chay khong can mang
=============================================

Cach 1 (Chrome/Edge chan file:// co the chan module — nen dung cach 2):
  Mo index.html bang trinh duyet.

Cach 2 (khuyen nghi, 1 lenh):
  npx serve .
  # hoac: python3 -m http.server 3000

Roi mo http://localhost:3000 (hoac cong may bo tro ra).

Dieu khien:
  WASD / mui ten: di chuyen
  Shift: chay nhanh
  Mang du dom dom den gan Den Long Lon la den tu thap — Bong Muc so anh sang!

Chay kiem chung (can Node >= 18):
  node tools/run_tests.mjs
`);

// Kèm tools để người chấm chạy test ngay trong dist (tùy chọn)
cpSync(join(ROOT, 'tools'), join(DIST, 'tools'), { recursive: true });
cpSync(join(ROOT, 'scenarios'), join(DIST, 'scenarios'), { recursive: true });
cpSync(join(ROOT, 'tests'), join(DIST, 'tests'), { recursive: true });

// Liệt kê kết quả
function tree(dir, prefix = '') {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const isDir = statSync(p).isDirectory();
    console.log(`${prefix}${isDir ? '📁' : '📄'} ${name}`);
    if (isDir && name !== 'addons') tree(p, prefix + '  ');
  }
}
console.log('\nĐã tạo dist/dao-den-long/:');
tree(DIST);
console.log('\nXong. Zip lại nếu cần: cd dist && zip -r dao-den-long.zip dao-den-long');
