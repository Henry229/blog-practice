# Header

## 개요
**Phase**: Phase 1 - 레이아웃 컴포넌트
**파일 경로**: `components/layout/Header.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage Header)
**상태**: - [ ] 미완료

## 페이지/컴포넌트 정보

**목적**: 모든 페이지에서 공유되는 고정 헤더로, 로고, 검색바, 네비게이션, 사용자 메뉴를 포함
**타입**: Layout Component
**위치**: 모든 페이지 최상단에 고정 위치 (fixed position)

---

## 요구사항

### 기능 요구사항
- [ ] Logo 클릭 시 홈페이지('/') 이동
- [ ] SearchBar를 통한 블로그 글 검색 기능
- [ ] Navigation 버튼을 통한 페이지 이동
- [ ] 로그인 상태에 따라 UserMenu 또는 Login 버튼 표시
- [ ] 반응형 레이아웃 (모바일/태블릿/데스크톱)

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] 고정 헤더 (fixed position, top: 0, z-index: 50)
- [ ] 흰색 배경 (#FFFFFF)
- [ ] 미묘한 그림자 효과 (shadow-sm)
- [ ] 레이아웃 구조: Logo - SearchBar - Navigation
- [ ] 최대 너비 제한 (max-width: 1200px) 및 중앙 정렬
- [ ] 좌우 padding: 16px (모바일), 24px (데스크톱)
- [ ] 높이: 64px

### 접근성 요구사항
- [ ] `<header>` 시맨틱 태그 사용
- [ ] `role="banner"` 속성 추가
- [ ] 네비게이션 영역에 `<nav>` 태그 사용
- [ ] 키보드 탐색 지원 (Tab 키)

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button input avatar
```

### 내부 의존성
- Logo 컴포넌트: `components/layout/Logo.tsx`
- SearchBar 컴포넌트: `components/layout/SearchBar.tsx`
- Navigation 컴포넌트: `components/layout/Navigation.tsx`
- UserMenu 컴포넌트: `components/layout/UserMenu.tsx`
- Auth hook: `useAuth` (from AuthContext)
- Type: `AuthUser` from `types/auth.ts`

---

## 기본 구조

```typescript
"use client"

import { Logo } from "@/components/layout/Logo"
import { SearchBar } from "@/components/layout/SearchBar"
import { Navigation } from "@/components/layout/Navigation"
import { UserMenu } from "@/components/layout/UserMenu"
import { useAuth } from "@/components/providers/AuthProvider"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* SearchBar */}
        <SearchBar />

        {/* Navigation & UserMenu */}
        <div className="flex items-center gap-4">
          <Navigation />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
```

---

## 구현 세부사항

### 상태 관리
- useAuth 훅을 통해 현재 로그인 사용자 정보 가져오기
- 사용자 정보를 UserMenu에 전달

### 레이아웃 구조
- **Flexbox 레이아웃**: `flex items-center justify-between`
- **Logo**: 왼쪽 정렬, 고정 너비
- **SearchBar**: 중앙, 가변 너비 (flex-1)
- **Navigation + UserMenu**: 오른쪽 정렬, 고정 너비

### 반응형 디자인
- **모바일 (<768px)**:
  - SearchBar 숨김 또는 축소
  - Navigation 햄버거 메뉴로 전환 (선택사항)
- **태블릿 (768px-1024px)**:
  - SearchBar 축소 너비
  - Navigation 버튼 텍스트 유지
- **데스크톱 (>1024px)**:
  - 모든 요소 전체 표시
  - SearchBar 최대 너비 적용

### 스타일링
```typescript
// Tailwind CSS 클래스
- Header: "fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
- Container: "max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4"
```

### 고정 헤더 처리
- 페이지 상단에 고정되므로, 본문 컨텐츠에 `padding-top: 64px` 추가 필요
- 스크롤 시에도 헤더가 보이도록 `z-index: 50` 설정

---

## 구현 단계

1. [ ] Install shadcn/ui dependencies (button, input, avatar)
2. [ ] Create Header component file (`components/layout/Header.tsx`)
3. [ ] Import child components (Logo, SearchBar, Navigation, UserMenu)
4. [ ] Implement basic flexbox layout structure
5. [ ] Add useAuth hook to get current user
6. [ ] Integrate Logo component (left side)
7. [ ] Integrate SearchBar component (center)
8. [ ] Integrate Navigation component (right side)
9. [ ] Integrate UserMenu component (right side, conditional rendering)
10. [ ] Apply responsive design (mobile, tablet, desktop)
11. [ ] Add accessibility attributes (role, semantic tags)
12. [ ] Test header across all pages
13. [ ] Test responsive breakpoints
14. [ ] Test user authentication state changes

---

## 완료 조건

### Functionality
- [ ] Header renders on all pages
- [ ] Logo navigation works correctly
- [ ] SearchBar functionality works (search query handling)
- [ ] Navigation buttons navigate to correct routes
- [ ] UserMenu displays for logged-in users
- [ ] Login button displays for logged-out users

### UI/UX
- [ ] Matches design mockup (blog-practice.pdf - Page 1)
- [ ] Fixed position at top of page
- [ ] Proper shadow and spacing
- [ ] Responsive on mobile, tablet, desktop
- [ ] Smooth transitions and hover effects

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Proper use of Client Component ("use client")
- [ ] Clean and readable code structure

### Integration
- [ ] Integrates with all child components
- [ ] useAuth hook works correctly
- [ ] Conditional rendering based on user state
- [ ] No layout shift or flicker on load

---

## 테스트 체크리스트

- [ ] Visual regression test (compare to design)
- [ ] Logo click navigation test
- [ ] SearchBar input and search functionality
- [ ] Navigation button clicks
- [ ] UserMenu display for logged-in users
- [ ] Login button display for logged-out users
- [ ] Responsive test (mobile, tablet, desktop)
- [ ] Accessibility test (keyboard navigation, screen reader)
- [ ] Header appears on all pages consistently

---

## 참고사항

- Header는 "use client" 컴포넌트로 구현 (useAuth 훅 사용)
- 모든 페이지에서 사용되므로 `app/layout.tsx`에서 RootLayout에 포함
- 고정 헤더이므로 본문 컨텐츠는 `pt-16` (padding-top: 64px) 추가 필요
- SearchBar는 Phase 4에서 구현된 검색 기능과 연동
- UserMenu는 드롭다운 메뉴 또는 간단한 사용자명 표시로 시작 가능
