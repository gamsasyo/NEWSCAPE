// 〈디파처스〉 영상 소리. 브라우저 정책상 소리 켠 자동재생은 불가 →
// 로고 끝나면 무음으로 재생을 시작하고, 첫 터치/클릭/키 입력에서 소리를 켠다.
// 안 켜졌으면(정책·미지원) 구석의 버튼으로 켤 수 있고, 켜진 뒤엔 같은 버튼으로 끈다.
import Player from '@vimeo/player';

export function initSound() {
  const iframe = document.getElementById('departures');
  const btn = document.getElementById('sound');
  if (!iframe || !btn) return { start() {} };

  const player = new Player(iframe);
  let muted = true;
  const render = () => {
    btn.textContent = muted ? '♪ 소리 켜기' : '♪ 소리 끄기';
    btn.hidden = false;
  };
  player.on('volumechange', ({ volume }) => { muted = volume === 0; render(); });

  const unmute = () =>
    player.setMuted(false)
      .then(() => player.setVolume(1))
      .then(() => { muted = false; render(); }, () => {});   // 거부되면 조용히 (버튼으로 켜면 됨)

  const onGesture = () => {
    if (muted) unmute();
    if (!muted) GESTURES.forEach((ev) => window.removeEventListener(ev, onGesture));
  };
  const GESTURES = ['touchend', 'click', 'keydown'];

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (muted) unmute();
    else player.setMuted(true).then(() => { muted = true; render(); });
  });

  return {
    start() {
      player.setLoop(true).catch(() => {});
      player.play().catch(() => {});
      unmute().finally(render);
      GESTURES.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }));
    },
  };
}
