// index.mjs — API công khai của core. View và headless runner chỉ import từ đây.

export { createWorld, mulberry32 } from './world.mjs';
export { step } from './simulation.mjs';
export * as C from './constants.mjs';
