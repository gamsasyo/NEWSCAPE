// 로고 페이드인 → 유지 → 페이드아웃 + 본문 페이드인(동시). 페이드아웃이 *시작*되는 순간 resolve
// → 글이 나타나면서 바로 자동 스크롤이 움직인다 (재영 요청 2026-09-26).
const T = { fadeIn: 800, hold: 1200, fadeOut: 800 };

export function playIntro() {
  const intro = document.getElementById('intro');
  const page = document.getElementById('page');
  return new Promise((resolve) => {
    requestAnimationFrame(() => intro.classList.add('show'));
    setTimeout(() => {
      intro.classList.add('hide');
      page.classList.add('ready');
      resolve();
      setTimeout(() => intro.remove(), T.fadeOut);
    }, T.fadeIn + T.hold);
  });
}
