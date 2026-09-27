import { defineConfig } from 'vite';

// 커스텀 도메인 newscape.mov (2026-09-27) → 루트 경로. 워크플로에서 BASE_PATH=/ 로 넘김.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
