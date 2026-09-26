import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './style.css';
import { playIntro } from './intro.js';
import { armAutoScroll } from './autoscroll.js';
import { initGallery } from './gallery.js';
import { initRsvp } from './rsvp.js';

history.scrollRestoration = 'manual';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
if (!reduced) {
  lenis = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true });
  lenis.stop();                 // 인트로 동안 스크롤 잠금
  window.scrollTo(0, 0);
}

initGallery(lenis);
initRsvp();
initLinks();

playIntro({ reduced }).then(() => {
  if (!lenis) return;
  lenis.start();
  armAutoScroll(lenis, 1500);
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
