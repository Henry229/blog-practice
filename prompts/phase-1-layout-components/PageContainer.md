# PageContainer

## 개요
**Phase**: Phase 1 - 레이아웃 컴포넌트
**파일 경로**: `components/layout/PageContainer.tsx`
**UI 참조**: 모든 페이지에서 재사용
**상태**: - [ ] 미완료

## 페이지/컴포넌트 정보

**목적**: 모든 페이지의 공통 컨테이너로, 최대 너비와 패딩을 제공
**타입**: Layout Component
**위치**: 각 페이지의 최상위 래퍼 컴포넌트

---

## 요구사항

### 기능 요구사항
- [ ] children을 렌더링하는 래퍼 컴포넌트
- [ ] 최대 너비 제한 (max-width: 1200px)
- [ ] 중앙 정렬 (margin: 0 auto)
- [ ] 좌우 패딩 (16px on mobile, 24px on desktop)
- [ ] 상단 패딩 (헤더 높이만큼, 64px)

### UI 요구사항
- [ ] 최대 너비: 1200px
- [ ] 중앙 정렬: margin-auto
- [ ] 패딩:
  - 상단: 64px (고정 헤더 높이)
  - 좌우: 16px (모바일), 24px (데스크톱)
  - 하단: 24px
- [ ] 배경: 투명 (부모 요소의 배경 상속)

### 접근성 요구사항
- [ ] `<main>` 시맨틱 태그 사용 (페이지 메인 컨텐츠)
- [ ] `role="main"` 속성 (선택사항)

---

## 의존성

### 내부 의존성
- 없음 (독립적인 레이아웃 컴포넌트)

---

## 기본 구조

```typescript
import { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-6 ${className}`}>
      {children}
    </main>
  )
}
```

---

## 구현 세부사항

### Props 인터페이스
```typescript
interface PageContainerProps {
  children: ReactNode       // 페이지 컨텐츠
  className?: string        // 추가 Tailwind 클래스 (선택사항)
}
```

### 스타일링
```typescript
// Tailwind CSS 클래스
- max-w-[1200px]: 최대 너비 1200px
- mx-auto: 중앙 정렬 (margin-left: auto, margin-right: auto)
- px-4: 좌우 패딩 16px (모바일)
- md:px-6: 좌우 패딩 24px (데스크톱, ≥768px)
- pt-16: 상단 패딩 64px (고정 헤더 높이)
- pb-6: 하단 패딩 24px
```

### className Prop
- 추가 스타일링이 필요한 경우 `className` prop으로 전달
- 기본 스타일과 병합되어 적용

### 반응형 디자인
- **모바일 (<768px)**: px-4 (16px 패딩)
- **데스크톱 (≥768px)**: md:px-6 (24px 패딩)

---

## 구현 단계

1. [ ] Create PageContainer component file (`components/layout/PageContainer.tsx`)
2. [ ] Import ReactNode type from react
3. [ ] Define PageContainerProps interface
4. [ ] Implement PageContainer function component
5. [ ] Add `<main>` element with Tailwind classes
6. [ ] Render children inside main element
7. [ ] Support optional className prop
8. [ ] Test with sample content
9. [ ] Test responsive padding (mobile vs desktop)
10. [ ] Test max-width constraint (view on wide screens)

---

## 완료 조건

### Functionality
- [ ] PageContainer renders children correctly
- [ ] Accepts optional className prop
- [ ] className merges with default styles

### UI/UX
- [ ] Maximum width: 1200px
- [ ] Centered on page
- [ ] Proper padding: top (64px), sides (16px/24px), bottom (24px)
- [ ] Responsive padding (mobile vs desktop)
- [ ] Content doesn't touch edges on mobile

### Code Quality
- [ ] TypeScript types are correct (PageContainerProps)
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Can be Server or Client Component (no state)
- [ ] Clean and simple code structure

### Integration
- [ ] Can be used in any page component
- [ ] Works with different content heights
- [ ] Doesn't interfere with child component styles

---

## 테스트 체크리스트

- [ ] Visual test with different content (short, long, wide)
- [ ] Maximum width test (1200px constraint on wide screens)
- [ ] Centering test (container is centered on page)
- [ ] Padding test (content has proper spacing)
- [ ] Responsive test (mobile: 16px, desktop: 24px padding)
- [ ] Header clearance test (content doesn't hide under fixed header)
- [ ] className prop test (additional classes apply correctly)

---

## 사용 예시

### Homepage
```typescript
import { PageContainer } from "@/components/layout/PageContainer"

export default function HomePage() {
  return (
    <PageContainer>
      {/* Homepage content */}
    </PageContainer>
  )
}
```

### Blog Detail Page
```typescript
import { PageContainer } from "@/components/layout/PageContainer"

export default function BlogDetailPage() {
  return (
    <PageContainer className="bg-white">
      {/* Blog content */}
    </PageContainer>
  )
}
```

---

## 참고사항

- PageContainer는 Server Component로 구현 가능 (상태 관리 불필요)
- 모든 페이지의 기본 래퍼로 사용
- `<main>` 태그 사용으로 시맨틱 HTML 준수
- pt-16 (64px)은 고정 헤더 높이와 일치해야 함
- className prop으로 페이지별 추가 스타일링 가능 (예: 배경색)
- CenteredContainer와 차이점: PageContainer는 전체 페이지 레이아웃, CenteredContainer는 폼 페이지 중앙 정렬
