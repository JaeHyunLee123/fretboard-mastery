# Fretboard Master - Technical Documentation (For Agents/Developers)

이 문서는 Fretboard Master 프로젝트의 구조와 핵심 로직을 차세대 AI 에이전트나 개발자가 빠르게 이해할 수 있도록 정리한 가이드입니다.

## 1. 프로젝트 아키텍처 (System Overview)

본 프로젝트는 Next.js (App Router) 기반의 단일 페이지 애플리케이션(SPA)입니다. 모든 오디오 처리와 연습 로직은 클라이언트 사이드에서 작동합니다.

### 핵심 레이어:

1.  **Global State (Zustand)**: 악기 설정, 연습 상태, 타겟 노트, 실시간 피치 등을 관리합니다.
2.  **Audio Engine (Web Audio API + pitchy)**: 마이크 입력을 받아 주파수를 추출하고 음정으로 변환합니다.
3.  **Notation Engine (VexFlow)**: 추출된 노트를 오선보 및 타브 악보로 렌더링합니다.
4.  **UI Components (Tailwind CSS)**: "The Digital Luthier" 테마를 적용한 프리미엄 다크 모드 UI입니다.

---

## 2. 디렉토리 구조 (Directory Structure)

```text
src/
├── app/                  # Next.js App Router (Page & Layout)
├── components/           # UI 컴포넌트
│   ├── commons/          # 공용 Atom 컴포넌트 (Button, Modal, Card 등)
│   ├── Tuner.tsx         # 전용 튜너 모션 UI
│   ├── TrainingArea.tsx  # 연습 로직 및 메인 카드
│   ├── NoteDisplay.tsx   # VexFlow 악보 렌더링 핵심 컴포넌트
│   ├── PlayingNoteCard.tsx # 사이드바 실시간 피치 알림 (Live Pitch)
│   └── GoogleAdSense.tsx # 애드센스 연동 컴포넌트
├── hooks/
│   └── useAudio.tsx      # 오디오 컨텍스트 및 피치 감지 커스텀 훅
├── libs/
│   ├── audioUtils.ts     # 주파수-음정 변환 유틸리티
│   └── utils.ts          # Tailwind CSS class merging (cn)
├── store/
│   └── usePracticeStore.ts # 핵심 상태 관리 (Zustand)
public/
└── ads.txt               # AdSense Publisher 정보
```

---

## 3. 핵심 모듈 설명 (Key Modules)

### 3.1. 상태 관리 (`src/store/usePracticeStore.ts`)

- **`instrument`**: `guitar` | `bass` 전환 로직. 전환 시 음역대와 튜닝이 변경됩니다.
- **`generateNextNote`**: 현재 악기 설정에 맞춰 무작위 음을 생성합니다.
- **`isIncorrect`**: 연습 모드에서 오답 발생 시 사이드바(PlayingNoteCard)의 색상을 변경하기 위한 플래그입니다.

### 3.2. 피치 감지 (`src/hooks/useAudio.tsx`)

- `pitchy` 라이브러리를 사용하여 오디오 버퍼에서 피치를 추출합니다.
- `CLARITY_THRESHOLD`(0.9)를 사용하여 노이즈를 필터링합니다.
- 추출된 피치는 `setCurrentPitch`를 통해 전역 스토어에 업데이트되어 모든 UI 컴포넌트가 반응합니다.

### 3.3. 악보 렌더링 (`src/components/NoteDisplay.tsx`)

- **이조 표기 (Transposition)**: 베이스 기타 모드일 때 `octave + 1`을 적용하여 표준 기보법(낮은음자리표)에 맞게 표시합니다.
- **Dynamic Render**: 알파벳, 오선보, 타브 악보를 조건부로 렌더링하며 `invert` 필터를 통해 다크 모드에 최적화된 악보를 보여줍니다.

### 3.4. 광고 및 분석 연동

- **AdSense**: `layout.tsx`에서 전역 스크립트를 로드하고, `AdsPlaceholder`를 통해 지정된 영역에 광고를 노출합니다.
- **Analytics**: Vercel Analytics가 `layout.tsx`에 포함되어 사용자 통계를 추적합니다.

---

## 4. 개발 현황 (Progress Status)

- [x] Phase 1: 디자인 시스템 및 다크 모드 UI 구축
- [x] Phase 2: Web Audio API 및 `pitchy` 기반 피치 감지 엔진 구현
- [x] Phase 3: VexFlow 연동 및 기타/베이스별 기보 로직 완성
- [x] Phase 4: 연습 로직(자동 전환, 피드백) 및 실시간 사이드바 UI 개선
- [x] Phase 5: 광고(AdSense) 및 분석(Analytics) 환경 구축

---

## 5. 미래의 에이전트를 위한 팁 (Notes for Future Maintenance)

1.  **Bass Octave**: 베이스 모드에서는 악보 상의 위치와 실제 주파수 사이의 옥타브 차이가 `+1`만큼 난다는 점을 유의하세요.
2.  **Audio Memory**: 오디오 노드는 `requestAnimationFrame`과 `AudioContext`의 수명 주기를 엄격히 따라야 메모리 누수를 방지할 수 있습니다.
3.  **Layout**: 사이드바의 `AdsPlaceholder`는 `adSlot` ID가 전달될 때만 동작하도록 설계되어 있습니다.
