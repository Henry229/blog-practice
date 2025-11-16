# Navigation

## 개요
**Phase**: Phase 1 - 레이아웃 컴포넌트
**파일 경로**: `components/layout/Navigation.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage Header)
**상태**: - [ ] 미완료

## 페이지/컴포넌트 정보

**목적**: Header 우측에 위치한 네비게이션 버튼 그룹 (New Post, Login 등)
**타입**: Feature Component
**위치**: Header 컴포넌트 내 우측 (UserMenu 왼쪽)

---

## 요구사항

### 기능 요구사항
- [ ] "New Post" 버튼 클릭 시 `/blog/new` 이동 (로그인 필수)
- [ ] "Login" 버튼 클릭 시 `/auth/login` 이동 (비로그인 시만 표시)
- [ ] 로그인 상태에 따라 버튼 표시/숨김
- [ ] 현재 페이지에 따라 활성 상태 표시 (선택사항)

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] "New Post" 버튼: 파란색 배경 (#2563EB), 흰색 텍스트
- [ ] "Login" 버튼: 회색 텍스트, 배경 없음 (ghost variant)
- [ ] 버튼 간격: 8px (gap-2)
- [ ] 버튼 크기: medium (default)
- [ ] 호버 효과: 색상 변화 (hover:bg-blue-700 for New Post)

### 접근성 요구사항
- [ ] `<nav>` 시맨틱 태그 사용
- [ ] 키보드 탐색 지원 (Tab 키)
- [ ] 각 버튼에 명확한 레이블

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button
```

### 내부 의존성
- Next.js Link: `next/link`
- Button component: `@/components/ui/button`
- useAuth hook: `@/components/providers/AuthProvider`

---

## 기본 구조

```typescript
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/AuthProvider"

export function Navigation() {
  const { user } = useAuth()

  return (
    <nav className="flex items-center gap-2">
      {/* New Post 버튼 (로그인 시만 표시) */}
      {user && (
        <Link href="/blog/new">
          <Button>New Post</Button>
        </Link>
      )}

      {/* Login 버튼 (비로그인 시만 표시) */}
      {!user && (
        <Link href="/auth/login">
          <Button variant="ghost">Login</Button>
        </Link>
      )}
    </nav>
  )
}
```

---

## 구현 세부사항

### 조건부 렌더링
```typescript
{user && (
  // 로그인 사용자만 볼 수 있는 버튼
  <Link href="/blog/new">
    <Button>New Post</Button>
  </Link>
)}

{!user && (
  // 비로그인 사용자만 볼 수 있는 버튼
  <Link href="/auth/login">
    <Button variant="ghost">Login</Button>
  </Link>
)}
```

### 버튼 Variants
- **New Post**: `<Button>` (기본 variant = primary, 파란색 배경)
- **Login**: `<Button variant="ghost">` (배경 없음, 회색 텍스트)

### 반응형 디자인
- **모바일 (<768px)**:
  - 텍스트 대신 아이콘으로 표시 (선택사항)
  - 또는 햄버거 메뉴로 전환 (선택사항)
- **태블릿/데스크톱**:
  - 버튼 텍스트 전체 표시

### 스타일링
```typescript
// Tailwind CSS 클래스
- Navigation: "flex items-center gap-2"
- Button: shadcn/ui Button 컴포넌트 기본 스타일 사용
```

---

## 구현 단계

1. [ ] Install shadcn/ui Button component
2. [ ] Create Navigation component file (`components/layout/Navigation.tsx`)
3. [ ] Import Link, Button, useAuth
4. [ ] Get current user from useAuth hook
5. [ ] Create nav element with flex layout
6. [ ] Add "New Post" button (conditional, user only)
7. [ ] Add "Login" button (conditional, no user only)
8. [ ] Apply proper Button variants
9. [ ] Test navigation (New Post, Login)
10. [ ] Test conditional rendering (login/logout state)
11. [ ] Test responsive design (mobile, desktop)
12. [ ] Test accessibility (keyboard navigation)

---

## 완료 조건

### Functionality
- [ ] Navigation renders in Header
- [ ] "New Post" button appears for logged-in users
- [ ] "New Post" navigates to `/blog/new`
- [ ] "Login" button appears for logged-out users
- [ ] "Login" navigates to `/auth/login`
- [ ] Buttons toggle based on user state

### UI/UX
- [ ] Matches design mockup (blog-practice.pdf - Page 1)
- [ ] "New Post" button: Blue background, white text
- [ ] "Login" button: Gray text, no background
- [ ] Proper spacing between buttons (8px gap)
- [ ] Hover effects work smoothly

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Proper use of Client Component ("use client")
- [ ] Clean conditional rendering logic

### Integration
- [ ] Integrates with Header component
- [ ] useAuth hook works correctly
- [ ] Buttons respond to authentication state changes

---

## 테스트 체크리스트

- [ ] Visual regression test (compare to design)
- [ ] "New Post" button click test (navigate to /blog/new)
- [ ] "Login" button click test (navigate to /auth/login)
- [ ] Conditional rendering test (login/logout state)
- [ ] User state change test (login → "New Post" appears, logout → "Login" appears)
- [ ] Responsive test (mobile, tablet, desktop)
- [ ] Accessibility test (keyboard navigation, Tab → Enter)
- [ ] Hover effect test (color changes on hover)

---

## 참고사항

- Navigation은 "use client" 컴포넌트 (useAuth 훅 사용)
- shadcn/ui Button 컴포넌트는 variant prop으로 다양한 스타일 지원
- 추후 추가 네비게이션 항목 (e.g., "My Posts", "Settings") 추가 가능
- 현재 페이지 활성 상태 표시는 선택사항 (추후 개선)
- 모바일 햄버거 메뉴는 Phase 1에서는 구현하지 않음 (추후 추가 가능)
