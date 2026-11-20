// main.js — Lớp hiển thị Three.js. KHÔNG chứa luật game: mọi quyết định đều qua src/core.
// Nhiệm vụ: vẽ thế giới từ createWorld, mỗi frame bơm step() theo tick accumulator,
// đọc input bàn phím -> intent, cập nhật HUD. Điều khiển: WASD/mũi tên, Shift sprint, E thắp.

import * as THREE from 'three';
import { createWorld, step, C } from '../core/index.mjs';

// ---- Khởi tạo renderer, scene, camera ----
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1220);
scene.fog = new THREE.FogExp2(0x0a1220, C.WORLD.fogDensity);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);

// Ánh sáng: trăng mờ + đèn point light gắn theo người chơi (đèn lồng nhỏ của Mây).
scene.add(new THREE.AmbientLight(0x22334d, 1.2));
const moon = new THREE.DirectionalLight(0x88aaff, 0.5);
moon.position.set(-20, 40, -10);
scene.add(moon);
const lanternLight = new THREE.PointLight(0xffc357, 2.2, 14, 1.6);
scene.add(lanternLight);

// ---- Thế giới: đảo, biển, đom đóm, đèn lồng, Bóng Mực ----
const world = createWorld({ seed: 2026, fireflyCount: 12, lanternCount: 3, inkCount: 2 });

// Đảo: đĩa tròn
const island = new THREE.Mesh(
  new THREE.CylinderGeometry(C.WORLD.radius, C.WORLD.radius * 1.05, 2, 48),
  new THREE.MeshStandardMaterial({ color: 0x1d3a2f, roughness: 0.9 })
);
island.position.y = -1;
scene.add(island);

// Biển: mặt phẳng lớn dưới đảo
const sea = new THREE.Mesh(
  new THREE.CircleGeometry(400, 32),
  new THREE.MeshStandardMaterial({ color: 0x0d1b2e, roughness: 0.35, metalness: 0.2 })
);
sea.rotation.x = -Math.PI / 2;
sea.position.y = -1.05;
scene.add(sea);

// Người chơi: Mây — hình con nhỏ + đèn lồng
const playerMesh = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(C.PLAYER.radius * 0.6, 0.7, 4, 12),
  new THREE.MeshStandardMaterial({ color: 0xffe0b3, roughness: 0.6 })
);
body.position.y = 0.9;
playerMesh.add(body);
const cage = new THREE.Mesh(
  new THREE.SphereGeometry(0.28, 12, 10),
  new THREE.MeshBasicMaterial({ color: 0xffd977, wireframe: true })
);
cage.position.set(0.55, 1.5, 0);
playerMesh.add(cage);
scene.add(playerMesh);

// Đom đóm: các điểm sáng bob lên xuống
const fireflyMeshes = world.fireflies.map(f => {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xd7ff7a })
  );
  const halo = new THREE.PointLight(0xd7ff7a, 0.7, 4);
  m.add(halo);
  m.position.set(f.x, 1.0, f.z);
  scene.add(m);
  return m;
});

// Đèn Lồng Lớn: cột + lồng đèn; khi thắp thì sáng. [Phase 2] hiển thị số đom đóm cần (required).
const lanternMeshes = world.lanterns.map(l => {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 3, 8),
    new THREE.MeshStandardMaterial({ color: 0x4a3b2a, roughness: 0.8 })
  );
  pole.position.y = 1.5;
  g.add(pole);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x554433, roughness: 0.5 });
  const lamp = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), lampMat);
  lamp.position.y = 3.2;
  g.add(lamp);
  const light = new THREE.PointLight(0xffb347, 0, 25, 1.4);
  light.position.y = 3.2;
  g.add(light);
  // Bảng nhỏ hiển thị "xN" — số đom đóm cần để thắp (canvas texture).
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 64;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#101828';
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = '#ffd977';
  ctx.font = 'bold 44px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`x${l.required}`, 64, 34);
  const sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv) }));
  sign.scale.set(1.4, 0.7, 1);
  sign.position.y = 4.1;
  g.add(sign);
  g.position.set(l.x, 0, l.z);
  scene.add(g);
  return { group: g, lamp, light };
});

// Bóng Mực: khối tối mờ
const inkMeshes = world.inks.map(() => {
  const m = new THREE.Mesh(
    new THREE.IcosahedronGeometry(C.INK.radius, 1),
    new THREE.MeshStandardMaterial({ color: 0x101018, roughness: 1, transparent: true, opacity: 0.92 })
  );
  m.position.y = 1;
  scene.add(m);
  return m;
});

// ---- Input ----
const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; });
addEventListener('keyup', e => { keys[e.code] = false; });

function readIntent() {
  let moveX = 0, moveZ = 0;
  if (keys['KeyW'] || keys['ArrowUp']) moveZ -= 1;
  if (keys['KeyS'] || keys['ArrowDown']) moveZ += 1;
  if (keys['KeyA'] || keys['ArrowLeft']) moveX -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) moveX += 1;
  return { moveX, moveZ, sprint: !!(keys['ShiftLeft'] || keys['ShiftRight']), action: !!keys['KeyE'] };
}

// ---- Camera góc thứ ba bám sau người chơi ----
let camYaw = 0;
function updateCamera() {
  const dist = 12, height = 7;
  camera.position.set(
    world.player.x - Math.sin(camYaw) * dist,
    height,
    world.player.z - Math.cos(camYaw) * dist
  );
  camera.lookAt(world.player.x, 1.2, world.player.z);
}

// ---- Vòng lặp: logic theo tick cố định, render theo rAF ----
// [Phase 3] thắp đèn tự động — phím E đã bỏ; HUD ghi chú luật mới.
let acc = 0;
let last = performance.now();
const hudFireflies = document.getElementById('hud-fireflies');
const hudLanterns = document.getElementById('hud-lanterns');
const hudTime = document.getElementById('hud-time');

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.25);
  last = now;
  acc += dt;
  while (acc >= C.TICK_DT) {
    step(world, readIntent());
    acc -= C.TICK_DT;
  }

  // Đồng bộ mesh từ world (view chỉ đọc).
  playerMesh.position.set(world.player.x, 0, world.player.z);
  lanternLight.position.set(world.player.x + 0.55, 1.9, world.player.z);
  world.fireflies.forEach((f, i) => {
    const m = fireflyMeshes[i];
    m.visible = !f.collected;
    if (!f.collected) {
      m.position.y = 1.0 + Math.sin(now / 1000 * C.FIREFLY.idleBobSpeed + i) * C.FIREFLY.idleBobAmplitude;
    }
  });
  world.lanterns.forEach((l, i) => {
    const { lamp, light } = lanternMeshes[i];
    if (l.lit) {
      lamp.material.color.set(0xffc357);
      lamp.material.emissive = new THREE.Color(0xff9900);
      light.intensity = 2.5;
    }
  });
  world.inks.forEach((ink, i) => {
    inkMeshes[i].position.set(ink.x, 1 + Math.sin(now / 700 + i) * 0.15, ink.z);
    // [Phase 3] Bóng Mực đang bỏ chạy khỏi ánh sáng thì nhạt màu đi.
    inkMeshes[i].material.opacity = ink.fleeing ? 0.55 : 0.92;
  });

  updateCamera();

  hudFireflies.textContent = world.player.fireflies;
  const lit = world.lanterns.filter(l => l.lit).length;
  hudLanterns.textContent = `${lit}/${world.lanterns.length}`;
  hudTime.textContent = `${Math.floor(world.elapsedSeconds)}s`;

  if (world.status === 'won') hudTime.textContent += ' — THẮNG! Đảo đã sáng đèn 🏮';
  if (world.status === 'lost') hudTime.textContent += ' — THUA (' + (world.inks.length ? 'hết đom đóm' : 'hết giờ') + ')';

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
