# 개발 규칙

## 일반 규칙

- 항상 절대 경로로 import한다.

## 백엔드 규칙

- 백엔드 개발 시에는 repository, service, view 레이어를 항상 구분해서 개발한다.
  - repository와 service 레이어는 별도 폴더를 생성하고, view는 /src/app/api 아래에 라우트 핸들러로 구현한다.

## 프론트엔드 규칙

- page.tsx는 항상 서버 컴포넌트를 사용하고 CSR이 필요하면 하위 컴포넌트로 분리해서 개발한다.

# 기타/베이스 지판 암기 웹 앱 개발 계획 (Fretboard Master)

## 1. 프로젝트 개요 (Overview)

기타와 베이스 연주자들이 마이크나 오디오 인터페이스를 통해 실제 악기로 지판을 암기하고 연습할 수 있는 웹 기반 애플리케이션입니다.
Next.js 15 (App Router) 기반으로 서버 사이드 렌더링 및 SEO 최적화를 지원하며, 사용자 데이터 관리 및 통계를 위해 Supabase와 Prisma ORM을 연동합니다. 또한 구글 AdSense를 연동하여 수익 창출을 도모합니다.

## 2. 디자인 및 UI 전략 (Stitch MCP - Fretboard Trainer Web App)

Stitch MCP에 정의된 `Fretboard Trainer Web App` 디자인 테마("Digital Luthier")를 앱 전체에 적용합니다.

- **어두운 테마(Dark Mode)**: 눈의 피로를 덜어주는 어두운 배경(Obsidian)과 높은 대비의 포인트 컬러(Green/Red) 사용 (VIBRANT 컬러 변형).
- **화면 구성 (참조된 스크린)**:
  1.  **Dashboard (`e7d8...`)**: 사용자 로그인 후 진입하는 메인 대시보드 (진척도 요약, 연습 시작 버튼).
  2.  **Tuner & Setup (`0d6a...`)**: 연습 시작 전 악기 튜닝 및 입력 테스트, 목표 설정.
  3.  **Training Session (`44a2...`)**: 메인 지판 연습 화면 (음표 노출 및 정답 피드백).
  4.  **Stats & Settings (`8b19...`)**: 연습 통계, 오답률 표시 및 계정/기기 설정.

## 3. 주요 기능 (Core Features)

1. **오디오 입력 처리**: 마이크 및 오디오 인터페이스를 통한 실시간 사운드 피치 인식 (`pitchfinder` 또는 Web Audio API 활용)
2. **튜너 (Tuner)**: 정확한 주파수(Hz) 분석을 통한 악기 튜닝 및 셋업 기능 (Tuner & Setup 화면)
3. **지판 암기 훈련 (Training Session)**:
   - 3가지 악보 렌더링 모드 지원 (텍스트, 오선보, 타브 악보)
   - 앱이 대상 음 노출 -> 사용자가 악기로 대상 연주 -> 입력음 실시간 판별 -> 시각적 정답/오답 피드백
4. **사용자 통계 및 저장 (Stats & Settings)**:
   - Supabase 사용자 인증 연동
   - Prisma ORM을 이용한 DB 구성: 학습 세션 데이터, 오답 노트, 누적 플레이 시간 등 관리
5. **수익화 (Monetization)**: Google AdSense 배너 등을 위한 UI 지면 마련

## 4. 기술 스택 (Tech Stack)

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS (Stitch 디자인 토큰 적용)
- **Backend/DB**: Next.js API Routes / Server Actions, Prisma ORM, Supabase (PostgreSQL)
- **Audio**: Web Audio API, `pitchfinder` (피치/오디오 주파수 감지)
- **Score Rendering**: `vexflow` (오선보 및 타브 악보 렌더링)
- **Deployment**: Vercel

## 5. 단계별 진행 계획 / TODO 리스트

### Phase 1: 개발 환경 로컬 세팅 (프론트엔드 우선)

- [x] Next.js (TypeScript, Tailwind CSS) 프로젝트 초기화 (`npx create-next-app@latest`)

### Phase 2: 디자인 시스템 및 퍼블리싱 (Stitch 적용)

- [ ] Stitch `Fretboard Trainer Web App` 테마의 색상/폰트 토큰 Tailwind config에 적용
- [ ] 4가지 주요 페이지 기본 컴포넌트/레이아웃 구성:
  - [ ] Dashboard 레이아웃 (연습 진입로)
  - [ ] Tuner & Setup 화면
  - [ ] Training Session 메인 훈련 화면 (상/하단 정보, AdSense 슬롯)
  - [ ] Stats & Settings 사용자 설정 화면 (UI만 먼저 구성)

### Phase 3: 오디오 입력 및 튜닝 시스템 구현 (핵심 기능 1)

- [ ] 웹 브라우저 마이크/오디오 권한 요청 로직 (`getUserMedia`)
- [ ] Web Audio API를 활용한 스트림 프로세서 구현
- [ ] `pitchfinder` 연동으로 주파수(Hz) 추출 및 노트(A, C# 등) 맵핑
- [ ] Tuner & Setup 화면에 실시간 피치 튜너 게이지 연동

### Phase 4: 연습 세션 로직 및 뷰 렌더링 (핵심 기능 2)

- [ ] 연습 모드 상태 관리 (Zustand 혹은 React Context) - 현재 음, 남은 시간, 클라이언트 임시 정답률 등
- [ ] Vexflow 라이브러리 연동: 랜덤 제시음을 (텍스트 / 오선보 / 타브) 3가지 모드로 그리기 함수 구현
- [ ] 사용자가 입력한 오디오 노트가 정답인지 지속 확인하는 Game Loop 작성
- [ ] 정답/오답 발생 시 Stitch 디자인 요소를 활용한 애니메이션 및 화면 피드백 처리

### Phase 5: DB 셋업 및 백엔드 연동 (데이터 유지)

- [ ] Supabase 프로젝트 생성 및 DB 계정 정보 획득
- [ ] Prisma 초기화 (`npx prisma init`) 및 Supabase Connection String 연결
- [ ] Prisma 스키마 작성 (User, Session, Stats 등) 및 DB 마이그레이션 적용
- [ ] 연습 세션 종료 후 결과를 Supabase DB에 저장하는 route handler 작성
- [ ] Stats 화면에 유저별 누적 데이터(오답률 높은 플랫, 정확도) 차트/리스트 실제 데이터로 연결

### Phase 6: 최적화 및 마무리 배포

- [ ] 각 페이지 Metadata 설정(SEO 최적화) 및 Next.js Sitemaps 구성
- [ ] Google AdSense 컴포넌트 (`<ins>`) 삽입 및 트래픽 테스트
- [ ] 오디오 처리 최적화 (지연 시간 최소화, 잡음 제거)
- [ ] Vercel을 이용한 Production 환경 최종 배포
