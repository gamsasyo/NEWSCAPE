// 로고 페이드인 → 유지 → 페이드아웃 + 본문 페이드인(동시). 페이드아웃이 *시작*되는 순간 resolve
// → 글이 나타나면서 바로 자동 스크롤이 움직인다 (재영 요청 2026-09-26).
// 로고가 떠 있는 동안 폰트·사진을 미리 받아 디코딩해 둔다 → 초반 스크롤 버벅임 방지 (재영 2026-10-31).
// 준비가 늦으면 로고를 최대 MAX_WAIT 까지만 더 붙잡고 그냥 시작한다.
const T = { fadeIn: 800, hold: 1200, fadeOut: 800 };
const MAX_WAIT = 5000;

// Typekit 은 스크립트가 늦게 붙어서 document.fonts.ready 가 폰트 요청 전에 끝나버릴 수 있다 → wf-active/inactive 클래스를 기다린다
function typekitDone() {
  const h = document.documentElement;
  const done = () => /\bwf-(active|inactive)\b/.test(h.className);
  if (done()) return Promise.resolve();
  return new Promise((r) => {
    const mo = new MutationObserver(() => { if (done()) { mo.disconnect(); r(); } });
    mo.observe(h, { attributes: true, attributeFilter: ['class'] });
  });
}

function preload() {
  // 첫 화면 근처 2장만 디코딩까지 기다린다. 8장 전부 디코딩하면 iOS가 메모리 압박으로 버렸다가
  // 출발 순간 다시 디코딩해서 버벅인다 (재영 2026-10-31). 나머지는 내려받기만 미리.
  const all = [...document.querySelectorAll('#page img')];
  all.forEach((img) => { img.loading = 'eager'; });
  const imgs = all.slice(0, 2).map((img) => img.decode().catch(() => {}));
  return Promise.all([typekitDone().then(() => document.fonts.ready), ...imgs]);
}

export function playIntro() {
  const intro = document.getElementById('intro');
  const page = document.getElementById('page');
  const ready = preload();
  const minTime = new Promise((r) => setTimeout(r, T.fadeIn + T.hold));
  const cap = new Promise((r) => setTimeout(r, MAX_WAIT));
  requestAnimationFrame(() => intro.classList.add('show'));
  return Promise.race([Promise.all([ready, minTime]), cap]).then(() => {
    intro.classList.add('hide');
    page.classList.add('ready');
    setTimeout(() => intro.remove(), T.fadeOut);
  });
}
