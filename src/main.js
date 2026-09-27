import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './style.css';
import { playIntro } from './intro.js';
import { armAutoScroll } from './autoscroll.js';
import { initGallery } from './gallery.js';
import { initRsvp } from './rsvp.js';
import { initSound } from './sound.js';

history.scrollRestoration = 'manual';

// 초대장 연출이라 OS의 '동작 줄이기' 설정과 무관하게 인트로·자동 스크롤을 항상 켠다 (재영 결정 2026-09-26)
const lenis = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true });
lenis.stop();                   // 인트로 동안 스크롤 잠금
window.scrollTo(0, 0);

initGallery(lenis);
initRsvp();
initLinks();
const sound = initSound();
if (location.search.includes('debug')) import('./debug.js').then((m) => m.initDebug(lenis));

playIntro().then(() => {
  sound.start();               // 로고 끝나면 영상(반복) 재생 + 소리 켜기 시도
  lenis.start();
  armAutoScroll(lenis, 500);   // 글 나타나는 중에 바로 출발 (기존 1500의 1/3)
});

function initLinks() {
  // 주소 복사: 알림 팝업 없이 조용히 복사만 (재영 2026-09-27)
  document.getElementById('copy-addr')?.addEventListener('click', (e) => {
    navigator.clipboard?.writeText(e.currentTarget.dataset.addr).catch(() => {});
  });
}
