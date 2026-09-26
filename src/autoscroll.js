// 천천히 자동 스크롤.
// 사용자가 손대면(휠/터치/키) 멈추고, IDLE_MS 동안 가만히 있으면 다시 내려간다.
// 입력창에 포커스가 있거나 Lenis가 멈춘 상태(전체화면 이미지)에서는 움직이지 않는다.
const SPEED_PX_PER_S = 38;
const IDLE_MS = 3000;
const USER_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

export function armAutoScroll(lenis, delayMs = 1500) {
  let running = false;
  let raf = 0;
  let last = 0;
  let timer = 0;
  let pos = 0; // 우리가 누적하는 소수점 위치. lenis.scroll 을 매 프레임 다시 읽으면
               // iOS(정수 scrollY)에서 반올림돼 제자리걸음이 되므로 여기서만 관리한다.

  const typing = () => /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');

  const tick = (now) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (lenis.isStopped || typing()) { pos = lenis.scroll; raf = requestAnimationFrame(tick); return; }
    pos += SPEED_PX_PER_S * dt;
    if (pos >= lenis.limit) { pause(); return; }           // 바닥: 멈추고 다음 입력 대기
    lenis.scrollTo(pos, { immediate: true, force: true });
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    pos = lenis.scroll;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(timer);
  };
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(start, IDLE_MS);
  };
  const onUser = () => { pause(); schedule(); };

  USER_EVENTS.forEach((ev) => window.addEventListener(ev, onUser, { passive: true }));
  lenis.on('scroll', () => { if (!running) schedule(); });  // 관성으로 아직 움직이는 동안은 대기 연장
  timer = setTimeout(start, delayMs);

  return () => { pause(); USER_EVENTS.forEach((ev) => window.removeEventListener(ev, onUser)); };
}
