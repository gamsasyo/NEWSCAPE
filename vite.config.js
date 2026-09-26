import { defineConfig } from 'vite';

// GitHub Pages(프로젝트 페이지)는 /NEWSCAPE/ 하위 경로. 커스텀 도메인 붙이면 BASE_PATH 빼면 됨.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
