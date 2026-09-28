# game-portfolio

게임 기획 포트폴리오 — NAN 2026 사전과제 **마왕 채널**, 본선 **23 (Twenty-Three)**.

**▶ https://tnghgks.github.io/game-portfolio/**

빌드 도구 없는 정적 사이트다. HTML · CSS · JS 파일이 그대로 GitHub Pages로 서빙된다.

## 구조

```
index.html              홈 — 소개 · 프로젝트 카드 · About
maou-channel.html       마왕 채널 케이스 스터디 (게임 iframe 임베드)
twenty-three.html       23 케이스 스터디 (감각 상실 데모 · 간파 확률 계산기 · 발표 PDF)
assets/css/style.css    공통 스타일 — 색은 전부 :root 토큰, 프로젝트별 강조색은 body[data-accent]
assets/js/main.js       목차 하이라이트 · 라이트박스 · iframe 지연 로드 · 차트 · 인터랙티브 데모
assets/img/maou/        마왕 채널 배경 · 스프라이트 (Project_MAOU/public/assets 에서 추출)
assets/img/twenty-three/ 23 타이틀 · 인트로 컷 · 컨셉 아트 (JPEG로 리사이즈)
assets/docs/            발표자료 · AI 활용 문서 PDF
.nojekyll               Jekyll 처리 끄기
```

모든 경로는 상대 경로라 `/game-portfolio/` 하위에서도, 로컬에서도 그대로 동작한다.

## 배포

1. `main` 에 push
2. GitHub 저장소 → **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)**
3. 1~2분 뒤 `https://tnghgks.github.io/game-portfolio/` 에서 확인

## 로컬 미리보기

`file://` 로 열면 폰트·PDF 임베드가 제한되므로 아무 정적 서버로 연다.

```bash
npx serve .            # Node 가 있으면
python -m http.server  # Python 이 있으면
```

## 직접 채워야 할 곳 (`TODO` 주석)

- [ ] 이름 표기 — 헤더 `Hosu Han.` / 푸터
- [ ] 연락처(이메일 등) — `index.html` 푸터
- [ ] 자기소개 문단 — `index.html` #about
- [ ] 마왕 채널 역할 — `maou-channel.html` 메타 그리드
- [ ] 23 공동 기획 파트의 역할 표기 — `twenty-three.html` 메타 그리드
- [ ] 두 프로젝트 회고 — 각 페이지 마지막 섹션
