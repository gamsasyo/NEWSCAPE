// 〈디파처스〉 영상 소리. 브라우저 정책상 소리 켠 자동재생은 불가 →
// 로고 끝나면 무음으로 재생을 시작하고, 첫 터치/클릭/키 입력에서 소리를 켠다. (버튼 없음 — 재영 결정 2026-09-27)
import Player from '@vimeo/player';

export function initSound() {
  const iframe = document.getElementById('departures');
  if (!iframe) return { start() {} };

  const player = new Player(iframe);
  let muted = true;
  const GESTURES = ['touchend', 'click', 'keydown'];

  const unmute = () =>
    player.setMuted(false)
      .then(() => player.setVolume(1))
      .then(() => {
        muted = false;
        GESTURES.forEach((ev) => window.removeEventListener(ev, onGesture));
      }, () => {});   // 거부되면 조용히 — 다음 제스처에서 다시 시도

  const onGesture = () => { if (muted) unmute(); };

  return {
    start() {
      player.setLoop(true).catch(() => {});
      player.play().catch(() => {});
      unmute();
      GESTURES.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
    },
  };
}
