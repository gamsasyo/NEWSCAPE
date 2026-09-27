import { defineConfig } from 'vite';

// 초대 페이지는 newscape.mov/rsvp/ (2026-09-27). 워크플로에서 BASE_PATH=/rsvp/ 로 넘기고, 루트엔 redirect.html.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
