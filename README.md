# 2048 Game — React Native + Vercel

## 프로젝트 개요

React Native (Expo)로 제작하는 2048 퍼즐 게임.  
웹(Vercel)과 모바일(iOS/Android) 동시 배포를 목표로 한다.

---

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (Expo)
npx expo start

# 웹 빌드 후 Vercel 배포
npx expo export --platform web
vercel deploy ./dist
```

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | React Native (Expo SDK) |
| 언어 | TypeScript |
| 상태 관리 | Zustand (또는 useReducer) |
| 애니메이션 | React Native Reanimated v3 |
| 웹 배포 | Vercel |
| 모바일 배포 | Expo Go / EAS Build |
| 스타일 | StyleSheet (+ NativeWind 선택적) |

---

## 디렉토리 구조

> Expo Router 없이 `App.tsx` 단일 화면으로 구성 (단일 게임 화면에 더 적합)

```
2048/                     # 문서 루트
├── docs/
│   ├── GAME_SPEC.md
│   ├── ARCHITECTURE.md
│   └── DEPLOY.md
├── README.md
└── 2048/                 # Expo 앱 루트
    ├── App.tsx           # 게임 메인 화면 + 오버레이
    ├── app.json          # Expo 설정 (Reanimated 플러그인 포함)
    ├── src/
    │   ├── components/
    │   │   ├── Board.tsx     # 4x4 보드 + 제스처 감지
    │   │   ├── Tile.tsx      # 애니메이션 타일
    │   │   └── ScoreBar.tsx  # 점수 + New Game 버튼
    │   ├── hooks/
    │   │   └── useKeyboard.ts  # 웹 키보드 입력 (방향키)
    │   ├── logic/
    │   │   └── board.ts      # 게임 로직 순수 함수 전체
    │   ├── store/
    │   │   └── gameStore.ts  # Zustand 전역 상태
    │   └── constants/
    │       └── theme.ts      # 타일 색상, 크기 상수
    ├── assets/
    └── package.json
```

---

## 문서 목록

- [`docs/GAME_SPEC.md`](docs/GAME_SPEC.md) — 게임 규칙, 타일 동작, 점수 계산 방식
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — 컴포넌트 설계, 상태 흐름, 애니메이션 전략
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — Vercel 웹 배포 + Expo EAS 모바일 배포 절차

---

## 현재 진행 상황

- [x] 프로젝트 기획 및 문서 작성
- [x] Expo 프로젝트 초기화 (`blank-typescript` 템플릿, Expo SDK 54)
- [x] 패키지 설치 (zustand, react-native-gesture-handler, react-native-reanimated)
- [x] 게임 로직 구현 (`src/logic/board.ts` — 이동/병합/점수/승패 판정)
- [x] UI 컴포넌트 개발 (Board, Tile, ScoreBar, App.tsx 오버레이)
- [x] 애니메이션 적용 (Reanimated v3 — 팝인, 병합 펄스)
- [x] 웹 키보드 입력 (`useKeyboard.ts` — 방향키 지원)
- [x] 로컬 스토리지 (최고 점수 세션 간 유지 — localStorage/AsyncStorage)
- [x] 글로벌 랭킹 (Supabase PostgreSQL + 닉네임 등록 + 순위표)
- [x] .env 설정 및 Supabase 연동 확인 (DNS 변경 + Singapore 리전으로 해결)
- [ ] 실기기 테스트 (Expo Go QR 스캔)
- [ ] 웹 빌드 최적화 및 Vercel 배포
- [ ] EAS Build로 APK/IPA 생성

## 다음 작업

```bash
# 개발 서버 실행 (2048/ 디렉토리 안에서)
npx expo start

# 웹으로 바로 확인
npx expo start --web
```
