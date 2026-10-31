import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './style.css';
import { playIntro } from './intro.js';
import { armAutoScroll } from './autoscroll.js';
import { initGallery } from './gallery.js';
import { initSound } from './sound.js';

history.scrollRestoration = 'manual';

// 초대장 연출이라 OS의 '동작 줄이기' 설정과 무관하게 인트로·자동 스크롤을 항상 켠다 (재영 결정 2026-09-26)
const lenis = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true });
lenis.stop();                   // 인트로 동안 스크롤 잠금
window.scrollTo(0, 0);

initGallery(lenis);
initLinks();
const sound = initSound();
if (location.search.includes('debug')) import('./debug.js').then((m) => m.initDebug(lenis));

playIntro().then(() => {
  sound.start();               // 로고 끝나면 영상(반복) 재생 + 소리 켜기 시도
  lenis.start();
  armAutoScroll(lenis, 500);   // 글 나타나는 중에 바로 출발 (기존 1500의 1/3)
});

function initLinks() {
  // 복사 버튼: 주소는 조용히 복사만 (재영 2026-09-27), data-done 있으면 잠깐 글자 바꿔 알림 (메일 복사)
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener('click', () => {
      navigator.clipboard?.writeText(btn.dataset.copy).then(() => {
        if (!btn.dataset.done) return;
        btn.textContent = btn.dataset.done;
        setTimeout(() => { btn.textContent = label; }, 1500);
      }).catch(() => {});
    });
  });
}
