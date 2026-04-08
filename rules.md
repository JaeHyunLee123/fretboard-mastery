# 개발 규칙

## 일반 규칙

- 항상 절대 경로로 import한다.
- 코드 작성 후 항상 린트 및 프리티어 검사를 한다.
- any 타입은 허용하지 않는다.

## 백엔드 규칙

- 백엔드 개발 시에는 repository, service, view 레이어를 항상 구분해서 개발한다.
  - repository와 service 레이어는 별도 폴더를 생성하고, view는 /src/app/api 아래에 라우트 핸들러로 구현한다.

## 프론트엔드 규칙

- page.tsx는 항상 서버 컴포넌트를 사용하고 CSR이 필요하면 하위 컴포넌트로 분리해서 개발한다.
- 컴포넌트 개발 시에는 solid 원칙을 고수한다.
- 컴포넌트 개발 시에 props을 extend 하는 경우 ComponentProps를 사용한다.
