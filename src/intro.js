// 로고 페이드인 → 유지 → 페이드아웃 → 본문 노출. resolve 되면 자동 스크롤 시작해도 됨.
const T = { fadeIn: 800, hold: 1200, fadeOut: 800 };

export function playIntro({ reduced }) {
  const intro = document.getElementById('intro');
  const page = document.getElementById('page');
  if (reduced) {
    intro.remove();
    page.classList.add('ready');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    requestAnimationFrame(() => intro.classList.add('show'));
    setTimeout(() => {
      intro.classList.add('hide');
      page.classList.add('ready');
      setTimeout(() => { intro.remove(); resolve(); }, T.fadeOut);
    }, T.fadeIn + T.hold);
  });
}
