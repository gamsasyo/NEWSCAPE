// 천천히 자동 스크롤.
// - 사용자가 손대면(휠/터치/키) 즉시 넘겨주고,
// - 아래로 던진 관성이 SPEED까지 감속하는 순간 그 속도를 그대로 이어받아 계속 간다 (속도 불연속 없음).
// - 위로 올렸거나 손가락으로 딱 멈춘 경우엔 정지 → IDLE_MS 대기 → 0에서 RAMP_MS 동안 부드럽게 가속.
// - 입력창에 포커스가 있거나 Lenis가 멈춘 상태(전체화면 이미지)에서는 움직이지 않는다.
const SPEED_PX_PER_S = 30; // 2026-09-27 재영: 프레임당 0.5px = 2프레임마다 1px, iOS 정수 스크롤에서 리듬 규칙적 (45는 4프레임마다 멈칫)
const IDLE_MS = 3000;      // 완전 정지 후 다시 출발까지
const RAMP_MS = 2000;      // 정지 상태에서 SPEED까지 가속 시간
const TAKEOVER_MAX = SPEED_PX_PER_S * 1.3; // 아래 관성이 이 속도 아래로 떨어지면 이어받음
const STILL = 8;           // 이 속도(px/s) 아래면 정지로 간주
const USER_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

export function armAutoScroll(lenis, delayMs = 1500) {
  let mode = 'wait';   // 'wait' 사용자 관찰 중 | 'drive' 우리가 밀는 중 | 'end' 바닥 도달
  let raf = 0;
  let last = 0;
  let pos = 0;         // 우리가 누적하는 소수점 위치. lenis.scroll 을 매 프레임 다시 읽으면
                       // iOS(정수 scrollY)에서 반올림돼 제자리걸음이 되므로 여기서만 관리한다.
  let vel = 0;         // 현재 밀고 있는 속도(px/s)
  let rampFrom = 0;    // 가속 시작 속도
  let rampAt = 0;      // 가속 시작 시각
  let prevY = 0;       // 속도 측정용
  let vUser = 0;       // 사용자 스크롤 속도(px/s, EMA)
  let stillSince = 0;  // 정지 시작 시각 (0 = 움직이는 중)
  let held = false;    // 손가락/포인터가 화면에 닿아 있는 동안
  let armedAt = 0;     // 첫 출발 허용 시각

  const typing = () => /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');
  const easeInOut = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const startDrive = (now, fromVel) => {
    mode = 'drive';
    pos = window.scrollY;
    vel = rampFrom = fromVel;
    rampAt = now;
  };

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
    last = now;
    const y = window.scrollY;
    const vInst = (y - prevY) / dt;
    prevY = y;

    if (mode === 'wait') {
      vUser += (vInst - vUser) * 0.3;
      const canGo = !held && !typing() && !lenis.isStopped && now >= armedAt;
      if (canGo && vUser > STILL && vUser <= TAKEOVER_MAX) {
        startDrive(now, vUser);                          // 관성 꼬리를 이어받음
      } else if (Math.abs(vUser) <= STILL) {
        if (!stillSince) stillSince = now;
        if (canGo && now - stillSince >= IDLE_MS) startDrive(now, 0);   // 정지 → 0에서 가속
      } else {
        stillSince = 0;
      }
    } else if (mode === 'drive') {
      if (lenis.isStopped || typing()) { pos = window.scrollY; }
      else {
        const t = Math.min((now - rampAt) / RAMP_MS, 1);
        vel = rampFrom + (SPEED_PX_PER_S - rampFrom) * easeInOut(t);
        pos += vel * dt;
        if (pos >= lenis.limit) { mode = 'end'; }        // 바닥: 멈추고 다음 입력 대기
        else lenis.scrollTo(pos, { immediate: true, force: true });
      }
    }
    raf = requestAnimationFrame(tick);
  };

  const onUser = () => {
    mode = 'wait';
    vUser = 0;
    stillSince = 0;
  };
  const onDown = () => { held = true; onUser(); };
  const onUp = () => { held = false; };

  USER_EVENTS.forEach((ev) => window.addEventListener(ev, onUser, { passive: true }));
  ['pointerdown', 'touchstart'].forEach((ev) => window.addEventListener(ev, onDown, { passive: true }));
  ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach((ev) => window.addEventListener(ev, onUp, { passive: true }));

  // 첫 출발: delayMs 뒤 0에서 가속 (IDLE_MS 안 기다림)
  armedAt = performance.now() + delayMs;
  stillSince = armedAt - IDLE_MS;
  prevY = window.scrollY;
  last = performance.now();
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    USER_EVENTS.forEach((ev) => window.removeEventListener(ev, onUser));
    ['pointerdown', 'touchstart'].forEach((ev) => window.removeEventListener(ev, onDown));
    ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach((ev) => window.removeEventListener(ev, onUp));
  };
}
