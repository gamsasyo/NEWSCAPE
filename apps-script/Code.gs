// NEWSCAPE RSVP 수신용 Apps Script.
// 구글 시트에 "확장 프로그램 > Apps Script" 로 붙여넣고 웹 앱으로 배포.
// 배포 설정: 실행 주체 = 나, 액세스 권한 = 모든 사용자

const SHEET_NAME = 'RSVP';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');
    const name = String(data.name || '').trim().slice(0, 50);
    const phone = String(data.phone || '').replace(/[^\d]/g, '').slice(0, 20);
    const ua = String(data.ua || '').slice(0, 200);
    if (!name || phone.length < 9) return json({ ok: false, error: 'invalid' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(['제출시각', '성함', '연락처', '기기']);
      sh.setFrozenRows(1);
    }
    const row = sh.getLastRow() + 1;
    sh.getRange(row, 1, 1, 4).setNumberFormats([['yyyy-mm-dd hh:mm', '@', '@', '@']]);
    sh.getRange(row, 1, 1, 4).setValues([[new Date(), name, phone, ua]]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: 'newscape-rsvp' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
