# UserMenu

## 개요
**Phase**: Phase 1 - 레이아웃 컴포넌트
**파일 경로**: `components/layout/UserMenu.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage Header)
**상태**: - [ ] 미완료

## 페이지/컴포넌트 정보

**목적**: 로그인한 사용자의 정보를 표시하고 로그아웃 기능 제공
**타입**: Feature Component
**위치**: Header 컴포넌트 내 최우측

---

## 요구사항

### 기능 요구사항
- [ ] 로그인한 사용자의 이름 표시
- [ ] 사용자 Avatar 표시 (이니셜 또는 프로필 이미지)
- [ ] 로그아웃 버튼 클릭 시 로그아웃 처리
- [ ] 드롭다운 메뉴 표시 (선택사항, 간단한 버전에서는 생략 가능)
- [ ] 비로그인 시 컴포넌트 숨김

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] Avatar + 사용자명 horizontal layout
- [ ] Avatar: 원형, 32px x 32px
- [ ] 사용자명: 14px, 중간 굵기 (font-medium)
- [ ] "Logout" 버튼 또는 드롭다운 메뉴
- [ ] 간격: Avatar와 사용자명 사이 8px (gap-2)
- [ ] 호버 효과: 배경 색상 변화 (선택사항)

### 접근성 요구사항
- [ ] Avatar에 `alt` 속성 또는 `aria-label`
- [ ] 키보드 탐색 지원
- [ ] 드롭다운 메뉴 접근성 (선택사항)

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add avatar button
```

### 내부 의존성
- Avatar component: `@/components/ui/avatar`
- Button component: `@/components/ui/button`
- Auth actions: `@/app/actions/auth`
- Type: `AuthUser` from `types/auth.ts`

---

## 기본 구조 (간단한 버전)

```typescript
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"

interface UserMenuProps {
  user: AuthUser | null
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) return null

  const handleLogout = async () => {
    await signOut()
  }

  const initials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-2">
      {/* Avatar + Username */}
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{user.username}</span>
      </div>

      {/* Logout Button */}
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
```

## 고급 구조 (드롭다운 메뉴 버전, 선택사항)

```typescript
"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/actions/auth"

interface UserMenuProps {
  user: AuthUser | null
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) return null

  const initials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user.username}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 구현 세부사항

### Props 인터페이스
```typescript
interface UserMenuProps {
  user: AuthUser | null
}
```

### 사용자 이니셜 생성
```typescript
const initials = user.username
  .split(" ")                    // "Jane Doe" → ["Jane", "Doe"]
  .map((n) => n[0])              // ["J", "D"]
  .join("")                      // "JD"
  .toUpperCase()                 // "JD"
```

### 로그아웃 처리
```typescript
const handleLogout = async () => {
  await signOut()  // Server Action 호출
}
```

### 조건부 렌더링
```typescript
if (!user) return null  // 비로그인 시 아무것도 표시하지 않음
```

### 스타일링
```typescript
// Tailwind CSS 클래스
- Container: "flex items-center gap-2"
- Avatar: "w-8 h-8"
- Username: "text-sm font-medium"
- Button: variant="ghost" size="sm"
```

---

## 구현 단계

1. [ ] Install shadcn/ui Avatar and Button components
2. [ ] (선택사항) Install shadcn/ui DropdownMenu
3. [ ] Create UserMenu component file (`components/layout/UserMenu.tsx`)
4. [ ] Define UserMenuProps interface
5. [ ] Import Avatar, Button (and DropdownMenu if using)
6. [ ] Implement conditional rendering (return null if no user)
7. [ ] Generate user initials from username
8. [ ] Create Avatar with initials as fallback
9. [ ] Display username next to Avatar
10. [ ] Add Logout button with handleLogout function
11. [ ] (선택사항) Implement DropdownMenu version
12. [ ] Test logout functionality
13. [ ] Test with different usernames (initials generation)
14. [ ] Test responsive design

---

## 완료 조건

### Functionality
- [ ] UserMenu renders for logged-in users
- [ ] UserMenu hidden for logged-out users
- [ ] Avatar displays user initials
- [ ] Username displays correctly
- [ ] Logout button triggers signOut action
- [ ] User redirected after logout

### UI/UX
- [ ] Matches design mockup (blog-practice.pdf - Page 1)
- [ ] Avatar: Circular, 32px x 32px
- [ ] Username: Readable font size (14px)
- [ ] Proper spacing (8px gap)
- [ ] Hover effects (if applicable)

### Code Quality
- [ ] TypeScript types are correct (UserMenuProps)
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Proper use of Client Component ("use client")
- [ ] Clean code structure

### Integration
- [ ] Integrates with Header component
- [ ] Receives user prop from Header
- [ ] signOut action works correctly
- [ ] User state updates after logout

---

## 테스트 체크리스트

- [ ] Visual regression test (compare to design)
- [ ] User initials generation test (e.g., "Jane Doe" → "JD")
- [ ] Username display test
- [ ] Logout button click test
- [ ] Logout action test (user state cleared, redirected to login)
- [ ] Conditional rendering test (shown for logged-in, hidden for logged-out)
- [ ] Responsive test (mobile, desktop)
- [ ] Accessibility test (keyboard navigation if dropdown)

---

## 참고사항

- UserMenu는 "use client" 컴포넌트 (onClick 이벤트 핸들러 사용)
- Props로 `user`를 받아 Header에서 useAuth 결과를 전달받음
- 간단한 버전: Logout 버튼 직접 표시
- 고급 버전: 드롭다운 메뉴로 추가 옵션 (Profile, Settings 등) 제공 가능
- Avatar는 이니셜 표시, 추후 프로필 이미지 업로드 기능 추가 가능 (Phase 8 이후)
- shadcn/ui Avatar 컴포넌트는 이미지 로딩 실패 시 AvatarFallback 표시
