# NEWSCAPE 개관 초대 페이지 — 디자인 스펙

## Context

김포 NEWSCAPE(장민승 디렉터) 개관(2026-10-09) 초대용 반응형 원페이지 웹.
링크 진입 → 로고 인트로 → 모시는 글이 천천히 자동 스크롤(직접 스크롤도 가능) →
중간중간 이미지(탭하면 전체화면) → 마지막에 네이버지도 + 성함/연락처 폼 + 참석 버튼.
운영자는 참석자 명단만 확인하면 됨. 사용자 로그인 없음.

소스 자산 (리포 내):
- `text/newscape_text.rtf` — 모시는 글 전문 + 개관 정보 + 사진 캡션
- `image/main visual.jpg` (11761×5880, 11MB 파노라마), `image/4591...jpeg` (8531×11375, 27MB 세로 텍스처)
- `mockup/IMG_2918 2.JPG`, `IMG_2919.JPG`, `IMG_2920.JPG` — 3장 디자인 목업
  - 흰 배경, 검정 세리프(본명조/Noto Serif KR 계열), 좁은 단·짧은 줄바꿈, 좌측 정렬, 큰 여백
  - 로고 = N/E/W/S 블록 + CAPE 블록 (파일 없음 → 가라 SVG)
  - 이미지는 본문 사이에 풀폭, `+` 아이콘 = 전체화면 힌트. 가로모드에서 파노라마 풀뷰.

## 결정 사항 (2026-09-26 재영 확인 완료)

| 항목 | 결정 | 이유 |
|---|---|---|
| 스택 | Vite + vanilla HTML/CSS/JS, **Tailwind 안 씀** | 단일 페이지·타이포 중심. 커스텀 CSS 변수 몇 개면 충분. Tailwind는 빌드 복잡도만 늘림 |
| 부드러운 스크롤 | **Lenis** (~8KB) | 관성 스크롤 표준. 자동 스크롤도 같은 엔진으로 → 자동↔수동 전환이 끊김 없음 |
| 전체화면 이미지 | **PhotoSwipe v5** | 모바일 핀치줌·스와이프·회전 대응. 파노라마를 가로모드로 볼 때 필요 |
| 폰트 | Noto Serif KR (Google Fonts, 400/500) | 목업과 일치. 웹폰트 subset 로딩 |
| 명단 저장 | **Google Sheets + Apps Script Web App** | 서버 0, 시트가 곧 관리자 화면. 일단 재영 개인 계정으로 배포, 나중에 갤러리 대표 구글 계정으로 이관 (아래 이관 절차 참조) |
| 지도 | **지도 API 없음.** 주소 블록 + [네이버지도 열기] [카카오맵 열기] [주소 복사] 버튼 | NCP 키·도메인 등록 불필요. 폰에선 앱으로 바로 열리는 게 더 편함. 나중에 지도 스크린샷 넣을 `<figure>` 슬롯만 비워둠 |
| 호스팅 | Vercel 무료 (`*.vercel.app`) | 도메인은 나중에 붙이면 됨 (Vercel 대시보드에서 CNAME 하나) |
| 자동 스크롤 정책 | 사용자가 터치/휠 하는 순간 **영구 정지** | 읽던 곳 되돌아갔는데 다시 밀리면 짜증. 상수 하나로 "idle 후 재개"로 전환 가능 |
| reduced-motion | 자동 스크롤·인트로 페이드 생략 | 접근성 |

## 구조

```
NEWSCAPE/
├── index.html              ← 단일 페이지 (본문 텍스트 직접 마크업)
├── src/
│   ├── main.js             ← 인트로 → Lenis 초기화 → 자동 스크롤 → 폼
│   ├── intro.js            ← 로고 페이드 인/아웃 (sessionStorage로 재방문시 스킵? → 아니, 매번 보여줌. 초대장이니까)
│   ├── autoscroll.js       ← rAF 기반 Lenis.scrollTo 루프, 사용자 입력 감지시 stop
│   ├── gallery.js          ← PhotoSwipe 바인딩
│   ├── rsvp.js             ← fetch POST → Apps Script, 상태 UI
│   └── style.css           ← CSS 변수(--measure, --space), 타이포 스케일 clamp()
├── public/
│   ├── img/                ← 빌드 전 최적화된 webp (1200/2400 2종) + 원본 비율 유지
│   └── logo-placeholder.svg
├── scripts/
│   └── optimize-images.sh  ← sips/sharp로 원본 → webp 변환
├── apps-script/
│   └── Code.gs             ← doPost: 시트에 [timestamp, 성함, 연락처, UA] append
├── image/ text/ mockup/    ← 원본 자산 (그대로 유지)
└── docs/superpowers/specs/2026-09-26-invite-page-design.md
```

## 화면 흐름

```
[0s] 흰 화면 ─▶ 로고 페이드인(0.8s) ─▶ 유지(1.2s) ─▶ 페이드아웃(0.8s)
                                                        │
                                                        ▼
[~3s] "모시는 글" 페이드인 ─▶ 1.5s 후 자동 스크롤 시작 (약 40px/s)
                                                        │
      사용자 터치/휠/키 ──▶ 자동 스크롤 정지 (이후 Lenis 관성 스크롤만)
                                                        │
      본문 ─ 이미지(풀폭, tap→PhotoSwipe) ─ 본문 ─ 이미지 ─ … ─ 서명
                                                        │
      개관 정보 블록 (일시/오시는 길/프로그램/문의)
                                                        │
      오시는 길: 주소 + [네이버지도 열기] [카카오맵 열기] [주소 복사]
                                                        │
      RSVP 폼: 성함 / 연락처 / [참석합니다] ─▶ 완료 메시지
                                                        │
      크레딧 (사진 캡션: Director / Architect / Construction)
```

## 이미지 배치 (목업 기준, 추후 재영이 추가분 반영)

1. 태그라인 "Leave the noise. Find the flat." 직후 → 파노라마 (main visual)
2. "미루나무…파도소리" 문단 뒤 → 세로 텍스처 (4591)
3. 이후 추가 이미지는 `index.html`의 `<figure>` 블록 복붙으로 삽입

## RSVP 데이터 흐름

```
브라우저 ──POST(text/plain JSON)──▶ Apps Script Web App URL ──▶ Google Sheet 행 추가
   ◀──── {ok:true} ────────────────┘
```
- text/plain으로 보내서 CORS preflight 회피 (Apps Script 표준 트릭)
- 클라이언트: 이중 제출 방지(버튼 disable), 연락처 숫자 정규화, 실패시 "전화/이메일로 알려주세요" 폴백 문구
- 시트 컬럼: `제출시각 | 성함 | 연락처 | 기기`
- 관리자 = 시트 열어보기. 별도 어드민 페이지 없음.

## 지도 딥링크

```
네이버:  https://map.naver.com/p/search/뉴스케이프        (모바일 웹 → 앱 열기 유도)
카카오:  https://map.kakao.com/link/search/뉴스케이프
주소복사: navigator.clipboard.writeText("경기도 김포시 고촌읍 금포로 513") + "복사됨" 토스트
```
검색어 기반이라 장소 ID 안 물어봐도 됨 (텍스트 원문도 "뉴스케이프 검색" 이라고 안내 중).

## 갤러리 계정 이관 절차 (나중에)

Apps Script 배포는 계정에 묶이므로 "소유권 이전"이 아니라 재배포:
1. 갤러리 계정으로 로그인 → 새 시트 생성 → 확장 프로그램 > Apps Script → `apps-script/Code.gs` 붙여넣기
2. 배포 > 새 배포 > 웹 앱 (실행: 나, 액세스: 모든 사용자) → 새 URL 발급
3. `.env` 의 `VITE_RSVP_ENDPOINT` 를 새 URL로 교체 → Vercel 재배포
4. 기존 시트 행은 복사-붙여넣기로 이관
→ 이 절차를 `apps-script/README.md` 에 그대로 적어둠.

## 반응형 규칙

- 본문 measure: `min(100% - 2*var(--gutter), 34ch)` — 목업처럼 좁은 단 유지, 데스크탑에선 좌측 여백 크게
- 폰트 사이즈: `clamp(17px, 4.6vw, 22px)`, line-height 1.7
- 이미지: `width:100%; height:auto`, `<picture>`로 webp 2종 srcset
- 가로모드(landscape phone): 이미지가 화면 높이 안에 들어오도록 `max-height: 100svh`
- `100svh`/`dvh` 사용해 iOS 주소창 점프 방지

## 구현 순서

0. `git init` (현재 리포 아님) + 디자인 스펙 `docs/superpowers/specs/2026-09-26-invite-page-design.md` 커밋 (이 플랜 내용 정리본)
1. Vite 스캐폴딩 + 폰트 + 타이포/레이아웃 CSS + 본문 마크업 → 정적으로 목업과 대조
2. 이미지 최적화 스크립트 + `<picture>` + PhotoSwipe
3. 로고 인트로 + Lenis + 자동 스크롤/정지 로직
4. RSVP 폼 + Apps Script (재영이 배포 → URL 받아서 env에 넣기)
5. 오시는 길 블록 (주소 + 딥링크 3버튼)
6. Vercel 배포 + 실기기 테스트 (iPhone Safari/Chrome, Android Chrome, 데스크탑)

## 검증

- 로컬 `npm run dev` → Playwright로 375/390/430/768/1280 폭 스크린샷, 가로모드 포함
- 자동 스크롤 중 휠/터치 → 즉시 정지 확인
- PhotoSwipe: 파노라마 핀치줌, 닫기, 회전
- 딥링크 3버튼: iPhone에서 네이버/카카오 앱 열림, 주소 복사 토스트
- RSVP: 실제 시트에 행 추가 확인, 네트워크 끊고 실패 UI 확인
- Lighthouse 모바일: LCP < 2.5s (이미지 최적화 검증)
- `prefers-reduced-motion` 에뮬레이션 시 인트로/자동스크롤 스킵
