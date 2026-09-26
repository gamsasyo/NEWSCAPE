const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT;
const KEY = 'newscape-rsvp';

export function initRsvp() {
  const form = document.getElementById('rsvp-form');
  const status = form.querySelector('.status');
  const btn = form.querySelector('button[type=submit]');

  const done = safeGet();
  if (done) markDone(done.name);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/[^\d]/g, '');
    if (!name) return fail('성함을 입력해 주세요.');
    if (phone.length < 9) return fail('연락처를 확인해 주세요.');
    if (!ENDPOINT) return fail('접수 준비 중입니다. 문의: 031-986-0041');

    btn.disabled = true;
    status.className = 'status';
    status.textContent = '접수 중…';
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name, phone, ua: navigator.userAgent }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'server');
      safeSet({ name, at: Date.now() });
      markDone(name);
    } catch (err) {
      btn.disabled = false;
      fail('접수에 실패했습니다. 031-986-0041 또는 newscape515@gmail.com 으로 알려주세요.');
    }
  });

  function fail(msg) { status.className = 'status err'; status.textContent = msg; }
  function markDone(name) {
    form.name.value = name;
    form.name.disabled = form.phone.disabled = btn.disabled = true;
    status.className = 'status';
    status.textContent = `${name} 님, 참석 신청이 접수되었습니다. 10월 9일에 뵙겠습니다.`;
  }
  function safeGet() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
  function safeSet(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }
}
