// 〈디파처스〉 영상 소리. 브라우저 정책상 소리 켠 자동재생은 불가 →
// 로고 끝나면 무음으로 재생만 시작하고, 첫 터치/클릭/키 입력에서 소리를 켠다. (버튼 없음 — 재영 결정 2026-09-27)
// ★ 제스처 없이 setMuted(false)를 부르면 iOS가 재생 자체를 멈춰버린다 → 시작 시엔 절대 언뮤트 시도 금지.
import Player from '@vimeo/player';

export function initSound() {
  const iframe = document.getElementById('departures');
  if (!iframe) return { start() {} };

  const player = new Player(iframe);
  let muted = true;
  const GESTURES = ['touchend', 'click', 'keydown'];

  const onGesture = () => {
    if (!muted) return;
    player.setMuted(false)
      .then(() => player.setVolume(1))
      .then(() => player.play())
      .then(() => {
        muted = false;
        GESTURES.forEach((ev) => window.removeEventListener(ev, onGesture));
      }, () => { player.play().catch(() => {}); });   // 거부되면 무음 재생은 유지, 다음 제스처에서 재시도
  };

  return {
    start() {
      player.setLoop(true).catch(() => {});
      player.play().catch(() => {});
      GESTURES.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
    },
  };
}
