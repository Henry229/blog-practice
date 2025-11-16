# BlogGrid

## 개요
**Phase**: Phase 4 - 블로그 목록 페이지
**파일 경로**: `components/blog/BlogGrid.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 블로그 카드를 그리드 레이아웃으로 표시하는 컨테이너 컴포넌트
**타입**: Layout Component
**위치**: HomePage 내부

---

## 요구사항

### 기능 요구사항
- [ ] children prop으로 BlogCard 컴포넌트 렌더링
- [ ] 반응형 그리드 레이아웃 (1열 → 2열 → 3열)
- [ ] 카드 간격 24px gap 유지
- [ ] 전체 너비 활용

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] 데스크톱 (≥1024px): 3열 그리드
- [ ] 태블릿 (768px-1023px): 2열 그리드
- [ ] 모바일 (<768px): 1열 그리드
- [ ] 카드 간격: 24px (gap-6)
- [ ] 그리드 아이템 자동 높이 조정

### 접근성 요구사항
- [ ] 시맨틱 HTML 구조 (section 또는 div)
- [ ] 명확한 레이아웃 구조

---

## 의존성

### shadcn/ui 컴포넌트
```bash
# No specific shadcn/ui components needed (pure layout)
```

### 내부 의존성
- None (순수 레이아웃 컴포넌트)

---

## 기본 구조

```typescript
import { ReactNode } from "react"

interface BlogGridProps {
  children: ReactNode
}

export function BlogGrid({ children }: BlogGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </section>
  )
}
```

---

## 구현 세부사항

### 반응형 그리드 시스템
```typescript
// Tailwind CSS 반응형 클래스
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// 브레이크포인트:
// - 모바일 (default): grid-cols-1 (1열)
// - 태블릿 (md: ≥768px): md:grid-cols-2 (2열)
// - 데스크톱 (lg: ≥1024px): lg:grid-cols-3 (3열)
// - 간격: gap-6 (24px)
```

### 그리드 동작
```typescript
// CSS Grid 자동 배치
// 각 BlogCard는 그리드 셀에 자동 배치
// 높이는 콘텐츠에 맞춰 자동 조정
// 마지막 행의 아이템이 적을 경우 왼쪽 정렬
```

### 시맨틱 HTML
```typescript
// <section> 사용으로 명확한 콘텐츠 구조
// 또는 <div>로도 가능 (역할이 순수 레이아웃인 경우)
<section className="...">
  {children}
</section>
```

---

## 구현 단계

1. [x] Create BlogGrid component file (`components/blog/BlogGrid.tsx`)
2. [x] Import ReactNode type from React
3. [x] Define BlogGridProps interface (children: ReactNode)
4. [x] Implement BlogGrid function component
5. [x] Add section element with grid classes
6. [x] Configure responsive grid columns (1 → 2 → 3)
7. [x] Add gap-6 for 24px spacing
8. [x] Render children inside grid
9. [x] Test grid layout on different screen sizes
10. [x] Verify gap consistency
11. [x] Test with varying number of cards

---

## 완료 조건

### Functionality
- [x] BlogGrid renders children correctly
- [x] Grid layout adapts to screen size
- [x] Gap spacing is consistent (24px)
- [x] Cards align properly in grid cells

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 1)
- [x] 3-column grid on desktop
- [x] 2-column grid on tablet
- [x] 1-column grid on mobile
- [x] 24px gap between cards
- [x] Cards fill grid cells properly

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Clean and simple component structure
- [x] Proper use of ReactNode for children prop

### Integration
- [x] Used in HomePage with BlogCard children
- [x] Works with any number of cards
- [x] Responsive across all breakpoints

---

## 테스트 체크리스트

- [x] Grid render test (displays children)
- [x] Responsive test - mobile (1 column)
- [x] Responsive test - tablet (2 columns)
- [x] Responsive test - desktop (3 columns)
- [x] Gap spacing test (24px verified)
- [x] Variable card count test (1, 3, 5, 9 cards)
- [x] Overflow test (last row with fewer cards)
- [x] Empty state test (no children, renders empty grid)

---

## 참고사항

- BlogGrid는 순수 레이아웃 컴포넌트 (로직 없음)
- CSS Grid 사용으로 간단하고 강력한 반응형 레이아웃
- Tailwind CSS 반응형 클래스로 브레이크포인트 관리
- children prop으로 BlogCard 컴포넌트 렌더링
- Server Component로 사용 가능 (상태 없음)
- 다른 컴포넌트 (예: ProductCard, ImageCard)에도 재사용 가능
- gap-6 = 24px (Tailwind spacing scale)
- 추후 그리드 열 개수를 props로 받도록 확장 가능 (선택사항)

### 확장 가능성 (선택사항)
```typescript
interface BlogGridProps {
  children: ReactNode
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: number
}

export function BlogGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 6,
}: BlogGridProps) {
  return (
    <section
      className={`grid grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} gap-${gap}`}
    >
      {children}
    </section>
  )
}
```
⚠️ 주의: Tailwind CSS는 동적 클래스 생성을 지원하지 않으므로, 실제로는 `clsx` 또는 `tailwind-merge`와 함께 사용하거나 SafeList에 클래스를 추가해야 함.
