import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './style.css';
import { playIntro } from './intro.js';
import { armAutoScroll } from './autoscroll.js';
import { initGallery } from './gallery.js';
import { initRsvp } from './rsvp.js';

history.scrollRestoration = 'manual';

// 초대장 연출이라 OS의 '동작 줄이기' 설정과 무관하게 인트로·자동 스크롤을 항상 켠다 (재영 결정 2026-09-26)
const lenis = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true });
lenis.stop();                   // 인트로 동안 스크롤 잠금
window.scrollTo(0, 0);

initGallery(lenis);
initRsvp();
initLinks();
if (location.search.includes('debug')) import('./debug.js').then((m) => m.initDebug(lenis));

playIntro().then(() => {
  lenis.start();
  armAutoScroll(lenis, 500);   // 글 나타나는 중에 바로 출발 (기존 1500의 1/3)
});

function initLinks() {
  const toast = document.getElementById('toast');
  document.getElementById('copy-addr')?.addEventListener('click', async (e) => {
    const addr = e.currentTarget.dataset.addr;
    try { await navigator.clipboard.writeText(addr); show('주소를 복사했습니다'); }
    catch { show(addr); }
  });
  let t;
  function show(msg) {
    toast.textContent = msg; toast.classList.add('on');
    clearTimeout(t); t = setTimeout(() => toast.classList.remove('on'), 1800);
  }
}
