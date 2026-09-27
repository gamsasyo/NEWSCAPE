// ?debug 로 열면 화면 위에 스크롤 진단 로그를 띄운다. (점프 원인 추적용, 2026-09-27)
// 기록: 우리가 set 하지 않은 스크롤 변화(EXT), 이미지 로드, Lenis limit 변화, 리사이즈, 폰트 로드
export function initDebug(lenis) {
  const box = document.createElement('pre');
  box.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99;margin:0;padding:6px 8px;'
    + 'font:11px/1.35 ui-monospace,Menlo,monospace;background:rgba(0,0,0,.8);color:#0f0;'
    + 'white-space:pre-wrap;pointer-events:none;max-height:45vh;overflow:hidden';
  document.body.appendChild(box);

  const t0 = performance.now();
  const lines = [];
  const log = (s) => {
    lines.push(`${((performance.now() - t0) / 1000).toFixed(1)}s y${Math.round(window.scrollY)} ${s}`);
    if (lines.length > 14) lines.shift();
    box.textContent = lines.join('\n');
  };

  // 우리가(Lenis 경유) 마지막으로 set 한 위치. 그것과 다른 곳으로 움직였으면 외부 요인.
  let lastSet = window.scrollY;
  const orig = window.scrollTo.bind(window);
  window.scrollTo = (...a) => {
    const o = a[0];
    const y = o && typeof o === 'object' ? o.top : a[1];
    if (typeof y === 'number') lastSet = y;
    return orig(...a);
  };
  window.addEventListener('scroll', () => {
    const d = window.scrollY - lastSet;
    if (Math.abs(d) > 25) { log(`EXT ${d > 0 ? '+' : ''}${Math.round(d)} (set ${Math.round(lastSet)}) act=${document.activeElement?.tagName}`); lastSet = window.scrollY; }
  }, { passive: true });

  document.querySelectorAll('figure img').forEach((img, i) => {
    if (img.complete) log(`IMG${i} already`);
    else img.addEventListener('load', () => log(`IMG${i} load h${img.getBoundingClientRect().height | 0}`));
  });
  document.querySelector('.video iframe')?.addEventListener('load', () => log('VIMEO load'));
  window.addEventListener('resize', () => log(`RESIZE ih${innerHeight} sh${document.documentElement.scrollHeight}`));
  document.fonts?.ready.then(() => log('FONTS ready'));

  let limit = lenis.limit;
  let sh = document.documentElement.scrollHeight;
  (function poll() {
    if (lenis.limit !== limit) { log(`LIMIT ${Math.round(limit)}→${Math.round(lenis.limit)}`); limit = lenis.limit; }
    const s = document.documentElement.scrollHeight;
    if (s !== sh) { log(`HEIGHT ${sh}→${s}`); sh = s; }
    requestAnimationFrame(poll);
  })();

  log(`start ih${innerHeight} sh${sh} limit${Math.round(limit)}`);
}
