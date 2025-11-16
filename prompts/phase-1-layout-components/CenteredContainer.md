# CenteredContainer

## 개요
**Phase**: Phase 1 - 레이아웃 컴포넌트
**파일 경로**: `components/layout/CenteredContainer.tsx`
**UI 참조**: New Post Page, Edit Post Page, Login/Signup Pages
**상태**: - [ ] 미완료

## 페이지/컴포넌트 정보

**목적**: 폼 페이지를 위한 중앙 정렬 컨테이너 (좁은 최대 너비)
**타입**: Layout Component
**위치**: 폼 페이지의 컨텐츠 래퍼 (PageContainer 내부)

---

## 요구사항

### 기능 요구사항
- [ ] children을 렌더링하는 래퍼 컴포넌트
- [ ] 최대 너비 제한 (max-width: 600px)
- [ ] 중앙 정렬 (margin: 0 auto)
- [ ] 수직 패딩 추가 (상하 여백)
- [ ] Card 스타일 적용 (배경, 그림자, 둥근 모서리)

### UI 요구사항
- [ ] 최대 너비: 600px (폼 페이지용)
- [ ] 중앙 정렬: margin-auto
- [ ] 배경: 흰색 (#FFFFFF)
- [ ] 그림자: shadow-md (미묘한 그림자)
- [ ] 둥근 모서리: rounded-lg (8px)
- [ ] 패딩: 32px (모든 방향)

### 접근성 요구사항
- [ ] 시맨틱 태그 사용 (`<div>` 또는 `<section>`)
- [ ] 적절한 컨트라스트 (흰색 배경, 검은색 텍스트)

---

## 의존성

### 내부 의존성
- 없음 (독립적인 레이아웃 컴포넌트)

---

## 기본 구조

```typescript
import { ReactNode } from "react"

interface CenteredContainerProps {
  children: ReactNode
  className?: string
}

export function CenteredContainer({
  children,
  className = "",
}: CenteredContainerProps) {
  return (
    <div
      className={`max-w-[600px] mx-auto p-8 bg-white rounded-lg shadow-md ${className}`}
    >
      {children}
    </div>
  )
}
```

---

## 구현 세부사항

### Props 인터페이스
```typescript
interface CenteredContainerProps {
  children: ReactNode       // 폼 컨텐츠
  className?: string        // 추가 Tailwind 클래스 (선택사항)
}
```

### 스타일링
```typescript
// Tailwind CSS 클래스
- max-w-[600px]: 최대 너비 600px
- mx-auto: 중앙 정렬 (margin-left: auto, margin-right: auto)
- p-8: 패딩 32px (모든 방향)
- bg-white: 흰색 배경
- rounded-lg: 둥근 모서리 8px
- shadow-md: 미묘한 그림자
```

### className Prop
- 추가 스타일링이 필요한 경우 `className` prop으로 전달
- 기본 스타일과 병합되어 적용

### PageContainer와의 차이점
- **PageContainer**: 전체 페이지 레이아웃 (max-width: 1200px)
- **CenteredContainer**: 폼 페이지 중앙 정렬 (max-width: 600px, 카드 스타일)

---

## 구현 단계

1. [ ] Create CenteredContainer component file (`components/layout/CenteredContainer.tsx`)
2. [ ] Import ReactNode type from react
3. [ ] Define CenteredContainerProps interface
4. [ ] Implement CenteredContainer function component
5. [ ] Add `<div>` element with Tailwind classes
6. [ ] Render children inside div element
7. [ ] Support optional className prop
8. [ ] Test with form content (Login, Signup, New Post)
9. [ ] Test centering on different screen sizes
10. [ ] Test background and shadow styling

---

## 완료 조건

### Functionality
- [ ] CenteredContainer renders children correctly
- [ ] Accepts optional className prop
- [ ] className merges with default styles

### UI/UX
- [ ] Maximum width: 600px
- [ ] Centered on page
- [ ] White background (#FFFFFF)
- [ ] Subtle shadow (shadow-md)
- [ ] Rounded corners (8px)
- [ ] Proper padding: 32px all sides
- [ ] Works on mobile and desktop

### Code Quality
- [ ] TypeScript types are correct (CenteredContainerProps)
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Can be Server or Client Component (no state)
- [ ] Clean and simple code structure

### Integration
- [ ] Used in Login, Signup, New Post, Edit Post pages
- [ ] Works inside PageContainer
- [ ] Doesn't interfere with child component styles

---

## 테스트 체크리스트

- [ ] Visual test with form content (Login, Signup, New Post)
- [ ] Maximum width test (600px constraint)
- [ ] Centering test (container is centered on page)
- [ ] Background test (white background visible)
- [ ] Shadow test (shadow appears around container)
- [ ] Padding test (content has 32px spacing from edges)
- [ ] Responsive test (works on mobile and desktop)
- [ ] className prop test (additional classes apply correctly)

---

## 사용 예시

### Login Page
```typescript
import { PageContainer } from "@/components/layout/PageContainer"
import { CenteredContainer } from "@/components/layout/CenteredContainer"

export default function LoginPage() {
  return (
    <PageContainer>
      <CenteredContainer>
        <h1>Login</h1>
        <LoginForm />
      </CenteredContainer>
    </PageContainer>
  )
}
```

### New Post Page
```typescript
import { PageContainer } from "@/components/layout/PageContainer"
import { CenteredContainer } from "@/components/layout/CenteredContainer"

export default function NewPostPage() {
  return (
    <PageContainer>
      <CenteredContainer>
        <h1>New Post</h1>
        <BlogForm />
      </CenteredContainer>
    </PageContainer>
  )
}
```

---

## 참고사항

- CenteredContainer는 Server Component로 구현 가능 (상태 관리 불필요)
- 폼 페이지 전용 레이아웃 컴포넌트
- PageContainer 내부에서 사용 (이중 래퍼)
- 카드 스타일 (배경, 그림자, 둥근 모서리)로 폼을 강조
- 600px 최대 너비로 폼을 읽기 쉽게 유지
- className prop으로 페이지별 추가 스타일링 가능
- 반응형: 모바일에서는 PageContainer의 패딩이 적용되어 화면 전체 너비 사용
