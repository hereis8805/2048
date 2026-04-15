# 기술 아키텍처 (Architecture)

## 1. 기술 선택 이유

### React Native + Expo
- 웹(Vercel)과 모바일(iOS/Android) **코드 공유** 가능.
- Expo SDK가 제공하는 `expo-router`, `expo-av`, `AsyncStorage` 등으로 빠른 개발.
- `npx expo export --platform web`으로 정적 웹 번들 생성 → Vercel 배포 즉시 가능.

### TypeScript
- 보드 상태(`number[][]`), 이동 방향(`Direction` 타입) 등 게임 로직에 타입 안전성 필수.

### Zustand (상태 관리)
- Redux 대비 보일러플레이트 최소화.
- `persist` 미들웨어로 최고 점수를 AsyncStorage에 자동 저장.

### React Native Reanimated v3
- JS 스레드가 아닌 UI 스레드에서 애니메이션 실행 → 60fps 보장.
- `useSharedValue` + `withSpring` / `withTiming`으로 타일 이동/팝 구현.

---

## 2. 상태 구조

```typescript
// src/store/gameStore.ts

type Board = number[][];          // 4x4, 0 = 빈 칸

interface GameState {
  board: Board;                   // 현재 보드
  score: number;                  // 현재 점수
  bestScore: number;              // 최고 점수 (persist)
  status: 'idle' | 'playing' | 'won' | 'over';
  // Actions
  startGame: () => void;
  move: (direction: Direction) => void;
  continueAfterWin: () => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';
```

---

## 3. 게임 로직 흐름

```
사용자 입력 (스와이프 / 키보드)
        │
        ▼
   useGame.ts (훅)
        │  direction 전달
        ▼
  gameStore.move(direction)
        │
        ├─ board.ts: slideBoard(board, direction)
        │     ├─ 방향에 따라 행/열 rotate
        │     ├─ mergeRow(row): 빈칸 제거 → 병합 → 빈칸 채움
        │     └─ 역방향 rotate 복원
        │
        ├─ score.ts: 병합된 값 합산
        │
        ├─ 보드 변화 여부 확인
        │     └─ 변화 있으면 → addRandomTile(newBoard)
        │
        └─ 게임 종료 체크 (checkGameOver / checkWin)
```

---

## 4. 컴포넌트 트리

```
App (Expo Router)
└── GameScreen (app/index.tsx)
    ├── ScoreBar
    │   ├── <현재 점수>
    │   └── <최고 점수>
    ├── Board (GestureDetector 래핑)
    │   └── Tile × N  (Animated)
    ├── GameOver  (status === 'over' 일 때)
    │   └── New Game 버튼
    └── WinBanner (status === 'won' 일 때)
        ├── Continue 버튼
        └── New Game 버튼
```

---

## 5. Board 컴포넌트 설계

```
Board
├── 절대 위치(absolute) 방식으로 타일 렌더링
├── 각 타일은 row/col 인덱스 → x/y 픽셀 좌표 계산
├── key = tileId (이동 시 같은 타일 추적, 애니메이션 연속성 보장)
└── Gesture Handler로 스와이프 감지
```

### 타일 위치 계산

```typescript
const BOARD_SIZE = 320;   // px (반응형으로 조정 가능)
const GAP = 10;
const TILE_SIZE = (BOARD_SIZE - GAP * 5) / 4;  // ≈ 67.5px

const getPosition = (index: number) =>
  GAP + index * (TILE_SIZE + GAP);
```

---

## 6. 애니메이션 전략

### 타일 이동 (Slide)
```typescript
// 각 Tile이 sharedValue로 x, y를 들고 있음
const translateX = useSharedValue(getPosition(col));
const translateY = useSharedValue(getPosition(row));

// 새 위치로 이동 시
translateX.value = withTiming(getPosition(newCol), { duration: 100 });
```

### 병합 팝 (Scale Pop)
```typescript
const scale = useSharedValue(1);
// 병합 직후
scale.value = withSequence(
  withTiming(1.2, { duration: 80 }),
  withTiming(1.0, { duration: 80 })
);
```

### 새 타일 등장 (Appear)
```typescript
const opacity = useSharedValue(0);
opacity.value = withTiming(1, { duration: 150 });
```

---

## 7. 웹 / 네이티브 분기

React Native는 웹과 네이티브 모두 지원하지만 일부 API가 다르다.

| 기능 | 웹 | 네이티브 |
|------|----|----------|
| 키보드 입력 | `useEffect` + `window.addEventListener('keydown')` | 해당 없음 |
| 스와이프 | `react-native-gesture-handler` (웹도 지원) | 동일 |
| 점수 저장 | `AsyncStorage` (웹: localStorage 폴리필) | 동일 |
| 화면 크기 | `useWindowDimensions()` | 동일 |

플랫폼 분기가 필요한 경우 `Platform.OS === 'web'` 조건 사용.

---

## 8. 파일별 책임 요약

| 파일 | 역할 |
|------|------|
| `src/logic/board.ts` | 순수 함수: 슬라이드, 병합, 타일 생성, 게임오버 판정 |
| `src/logic/score.ts` | 병합 점수 계산 |
| `src/store/gameStore.ts` | Zustand 스토어, AsyncStorage persist |
| `src/hooks/useGame.ts` | 제스처/키보드 입력 → store.move() 연결 |
| `src/components/Board.tsx` | 보드 렌더링 + 제스처 감지 |
| `src/components/Tile.tsx` | 애니메이션 타일 |
| `src/constants/theme.ts` | 색상, 크기 상수 |
