import { defineConfig } from 'vite';

// 초대 페이지 = newscape.mov 루트 (2026-09-27). /rsvp 는 redirect.html 로 루트에 넘김.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
