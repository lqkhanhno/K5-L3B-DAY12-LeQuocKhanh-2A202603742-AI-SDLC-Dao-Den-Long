// constants.mjs — Toàn bộ hằng số game ở MỘT nơi.
// Mọi con số tự chọn theo giả định phải nằm ở đây (không rải rác trong code)
// để khi ticket phase sau đổi luật, chỉ sửa một file + assumptions.md.

export const TICK_RATE = 30;              // bước mô phỏng logic (Hz) — headless & view dùng chung
export const TICK_DT = 1 / TICK_RATE;     // giây mỗi tick

// Người chơi: Mây, người giữ đèn nhỏ tuổi
export const PLAYER = {
  speed: 6.0,            // đơn vị thế giới / giây khi đi bộ
  sprintMultiplier: 1.6, // hệ số chạy nhanh (Shift)
  radius: 0.5,           // bán kính va chạm
};

// Đom đóm
export const FIREFLY = {
  collectRadius: 1.2,    // khoảng cách gom
  respawnSeconds: 0,     // 0 = không hồi sinh trong Phase 1 (giả định, sẽ ghi vào assumptions)
  idleBobAmplitude: 0.25,
  idleBobSpeed: 2.0,
};

// Đèn Lồng Lớn
export const LANTERN = {
  litRadius: 1.6,        // khoảng cách thắp đèn
  lightPerFirefly: 20,   // (Phase 1, không còn dùng sau R2.1 — giữ để hồi quy tham chiếu)
  requiredFireflies: 3,  // [Phase 2 / R2.1] số đom đóm cần để thắp mỗi đèn
};

// Bóng Mực — kẻ địch
export const INK = {
  speed: 3.2,
  radius: 0.7,
  catchRadius: 1.0,      // khoảng cách bị bắt
  drainOnCatch: 2,       // số đom đóm mất khi bị chạm
  followRadius: 6,       // [Phase 2 / R2.3] trong bán kính này, Bóng Mực vòng quanh thay vì lao thẳng
  orbitAngularSpeed: 1.2, // [Phase 2] tốc độ góc vòng quanh (rad/giây)
  lightRadius: 5,        // [Phase 3 / R3.2] trong bán kính đèn ĐÃ THẮP thì Bóng Mực bỏ chạy
  fleeSpeed: 4.0,        // [Phase 3] tốc độ bỏ chạy khỏi ánh sáng
};

// Thời gian và thắng/thua
export const ROUND = {
  timeLimitSeconds: 180, // giới hạn mỗi màn (giả định Phase 1)
  winCondition: 'all_lanterns_lit',
  loseConditions: ['time_out', 'all_fireflies_lost'],
};

// Thế giới — đảo tròn, hợp nhất giữa headless và view
export const WORLD = {
  radius: 40,            // bán kính đảo
  fogDensity: 0.028,
};
