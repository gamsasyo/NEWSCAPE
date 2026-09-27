import { defineConfig } from 'vite';

// 초대 페이지 = newscape.mov 루트 (2026-09-27).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
