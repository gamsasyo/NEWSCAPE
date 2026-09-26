// 천천히 자동 스크롤. 사용자가 손대는 순간 멈춘다.
// armAutoScroll: 리스너는 즉시 붙이고, delayMs 뒤에 시작. 그 사이 사용자가 손대면 시작 안 함.
// RESUME_AFTER_IDLE_MS 를 숫자로 바꾸면 "idle 후 재개" 모드.
const SPEED_PX_PER_S = 38;
const RESUME_AFTER_IDLE_MS = null;
const USER_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

export function armAutoScroll(lenis, delayMs = 1500) {
  let running = false;
  let armed = true;
  let raf = 0;
  let last = 0;
  let resumeTimer = 0;

  const tick = (now) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const next = lenis.scroll + SPEED_PX_PER_S * dt;
    if (next >= lenis.limit) { stop(true); return; }
    lenis.scrollTo(next, { immediate: true, force: true });
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (!armed) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const stop = (final = false) => {
    running = false;
    armed = false;
    cancelAnimationFrame(raf);
    clearTimeout(startTimer);
    if (!final && RESUME_AFTER_IDLE_MS != null) {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { armed = true; start(); }, RESUME_AFTER_IDLE_MS);
    } else {
      USER_EVENTS.forEach((ev) => window.removeEventListener(ev, onUser));
    }
  };

  const onUser = () => stop();
  USER_EVENTS.forEach((ev) => window.addEventListener(ev, onUser, { passive: true }));
  const startTimer = setTimeout(start, delayMs);
  return () => stop(true);
}
