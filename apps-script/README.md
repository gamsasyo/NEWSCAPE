# RSVP 명단 — Google Sheet + Apps Script

서버 없음. 참석 버튼 → Apps Script 웹 앱 → 구글 시트에 한 줄 추가.
**명단 확인 = 시트 열기.**

## 최초 배포 (5분)

1. 구글 드라이브에서 새 스프레드시트 생성 (이름 예: `NEWSCAPE RSVP`)
2. 메뉴 **확장 프로그램 > Apps Script**
3. 기본 `Code.gs` 내용을 전부 지우고 이 폴더의 `Code.gs` 붙여넣기 → 저장(⌘S)
4. 우상단 **배포 > 새 배포**
   - 유형(톱니바퀴): **웹 앱**
   - 설명: `rsvp v1`
   - 실행 주체: **나**
   - 액세스 권한: **모든 사용자**
   - **배포** → 권한 승인 팝업 (본인 계정 선택 → 고급 → "안전하지 않은 페이지로 이동" → 허용)
5. 나오는 **웹 앱 URL** (`https://script.google.com/macros/s/…/exec`) 복사
6. 프로젝트 루트 `.env` 파일에:
   ```
   VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/…/exec
   ```
   GitHub에서는 리포 Settings > Secrets and variables > Actions 에 `VITE_RSVP_ENDPOINT` 시크릿 등록 → 푸시(또는 Actions 재실행)
7. 브라우저에서 웹 앱 URL 열어보면 `{"ok":true,"service":"newscape-rsvp"}` 나오면 정상

## 코드 수정 후 재배포

**배포 > 배포 관리 > 연필 아이콘 > 버전: 새 버전 > 배포**. URL은 그대로 유지됨.
("새 배포"를 누르면 URL이 바뀌니 주의)

## 갤러리 대표 계정으로 이관

Apps Script 배포는 계정에 묶여 있어서 소유권 이전이 아니라 **재배포**로 처리:

1. 갤러리 계정으로 로그인 → 위 "최초 배포" 1–5 반복 → 새 URL
2. `.env` / GitHub 시크릿의 `VITE_RSVP_ENDPOINT` 를 새 URL로 교체 → 재배포
3. 기존 시트의 `RSVP` 탭 행들을 새 시트로 복사
4. 이전 배포는 **배포 관리 > 보관처리**

## 시트 컬럼

| 제출시각 | 성함 | 연락처 | 기기 |
|---|---|---|---|
| 2026-10-01 14:02 | 홍길동 | 01012345678 | Mozilla/5.0 (iPhone…) |

연락처는 텍스트 서식이라 앞자리 0이 안 사라짐.
