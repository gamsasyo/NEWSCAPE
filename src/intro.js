// 로고 페이드인 → 유지 → 페이드아웃 → 본문 노출. resolve 되면 자동 스크롤 시작해도 됨.
// reduced(동작 줄이기): 페이드 없이 로고를 같은 시간 동안 정지 상태로 보여준 뒤 본문.
const T = { fadeIn: 800, hold: 1200, fadeOut: 800 };

export function playIntro({ reduced }) {
  const intro = document.getElementById('intro');
  const page = document.getElementById('page');
  if (reduced) {
    intro.classList.add('show');
    return new Promise((resolve) => {
      setTimeout(() => { intro.remove(); page.classList.add('ready'); resolve(); }, T.fadeIn + T.hold);
    });
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
