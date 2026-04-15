# 배포 가이드 (Deploy Guide)

## 1. 사전 준비

```bash
# Node.js 18+ 확인
node -v

# Expo CLI
npm install -g expo-cli

# EAS CLI (모바일 빌드용)
npm install -g eas-cli

# Vercel CLI
npm install -g vercel

# Vercel 로그인
vercel login

# Expo/EAS 로그인
eas login
```

---

## 2. 웹 배포 (Vercel)

### 2-1. 웹 번들 생성

```bash
# Expo 웹 정적 파일 빌드
npx expo export --platform web
# 결과물: ./dist 폴더
```

### 2-2. Vercel 최초 배포

```bash
vercel deploy ./dist
# 프롬프트 안내에 따라 프로젝트 설정
# - Project name: 2048-game (원하는 이름)
# - Framework: Other
```

### 2-3. 프로덕션 배포

```bash
vercel --prod ./dist
```

### 2-4. vercel.json 설정 (SPA 라우팅)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
> 이 파일을 프로젝트 루트에 두면 Expo Router의 클라이언트 사이드 라우팅이 정상 동작한다.

### 2-5. 자동 배포 (GitHub 연동)

1. GitHub 레포 생성 후 push.
2. Vercel 대시보드 → Import Project → GitHub 레포 선택.
3. Build Command: `npx expo export --platform web`
4. Output Directory: `dist`
5. 이후 `main` 브랜치 push 시 자동 배포.

---

## 3. 모바일 테스트 — Expo Go

개발 중 가장 빠른 테스트 방법.

```bash
# 개발 서버 시작
npx expo start

# 터미널에 QR코드 출력됨
# → 스마트폰에서 Expo Go 앱(iOS/Android) 설치 후 QR 스캔
```

> **주의**: Expo Go는 Expo SDK가 지원하는 네이티브 모듈만 사용 가능.  
> 커스텀 네이티브 코드가 없는 이 프로젝트는 Expo Go로 충분하다.

---

## 4. 모바일 빌드 — EAS Build

앱스토어 제출 또는 APK 직접 설치가 필요할 때 사용.

### 4-1. eas.json 설정

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "ios": { "simulator": true }
    },
    "production": {
      "android": { "buildType": "aab" },
      "ios": {}
    }
  }
}
```

### 4-2. Android APK 빌드 (테스트용)

```bash
eas build --platform android --profile preview
# 완료 후 APK 다운로드 링크 제공
# 안드로이드 기기에 직접 설치 가능
```

### 4-3. iOS 시뮬레이터 빌드

```bash
eas build --platform ios --profile preview
```

### 4-4. 프로덕션 빌드 (스토어 제출)

```bash
eas build --platform all --profile production
```

---

## 5. 환경 변수

현재 이 프로젝트는 외부 API를 사용하지 않으므로 환경 변수가 필요 없다.  
추후 필요 시:

```bash
# .env.local (로컬)
EXPO_PUBLIC_API_URL=https://...

# Vercel 대시보드 → Settings → Environment Variables 에서 추가
```

---

## 6. 배포 체크리스트

### 웹 배포 전
- [ ] `npx expo export --platform web` 빌드 성공 확인
- [ ] `dist/index.html` 파일 존재 확인
- [ ] `vercel.json` SPA 리라이트 규칙 포함 여부
- [ ] 최고 점수 localStorage 동작 확인 (웹)

### 모바일 배포 전
- [ ] Expo Go에서 스와이프 동작 확인
- [ ] 다양한 화면 크기 테스트 (iPhone SE ~ Pro Max, Android 소형 ~ 대형)
- [ ] 가로 모드 잠금 또는 대응 여부 결정
- [ ] `app.json`의 `name`, `slug`, `version`, `icon`, `splash` 설정

---

## 7. 주요 URL

| 항목 | 내용 |
|------|------|
| Vercel 대시보드 | https://vercel.com/dashboard |
| Expo 대시보드 | https://expo.dev |
| EAS 빌드 현황 | https://expo.dev/accounts/[username]/builds |
