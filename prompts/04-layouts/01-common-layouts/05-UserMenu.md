# UserMenu 구현 계획

## 개요
사용자 메뉴 컴포넌트로, 사용자명 표시 및 로그아웃 기능을 제공합니다.

## 파일 경로
- `components/layouts/UserMenu.tsx`

## 의존성
- AuthProvider (인증 상태)
- Button 컴포넌트 (shadcn/ui)
- DropdownMenu 컴포넌트 (shadcn/ui)
- Avatar 컴포넌트
- Next.js Link
- Tailwind CSS

## 구현 상세

### 1. 기본 구조
```typescript
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { User, LogOut, Settings } from 'lucide-react';
// import { useAuth } from '@/components/auth/AuthProvider'; // Phase 2

export default function UserMenu() {
  const router = useRouter();
  // const { user, logout } = useAuth(); // Phase 2

  // Phase 1: Mock 사용자
  const user = { username: 'John Doe', email: 'john@example.com' };

  const handleLogout = async () => {
    // await logout(); // Phase 2
    router.push('/auth/login');
  };

  // 비로그인 상태
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  // 로그인 상태
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar username={user.username} />
          <span className="hidden md:inline">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 2. 핵심 기능

#### 인증 상태 분기
- **비로그인**: "Log In" + "Sign Up" 버튼
- **로그인**: Avatar + Username + 드롭다운

#### 드롭다운 메뉴
- **Trigger**: Avatar + 사용자명 버튼
- **Content**: 사용자 정보 + 메뉴 아이템
- **Actions**: Profile, Settings, Log Out

#### Avatar 컴포넌트
- **기본**: 사용자 이니셜 표시
- **추후**: 프로필 이미지 지원

#### 로그아웃
- **handleLogout**: AuthProvider의 logout 호출
- **Redirect**: 로그인 페이지로 이동

### 3. 스타일링

#### 비로그인 버튼
```css
flex items-center gap-2    /* 수평 정렬 */
```

#### Trigger 버튼
```css
variant="ghost"            /* 투명 배경 */
gap-2                      /* Avatar-텍스트 간격 */
```

#### Dropdown Content
```css
align="end"                /* 오른쪽 정렬 */
w-56                       /* 너비 224px */
```

#### Username (반응형)
```css
hidden md:inline           /* 모바일에서 숨김 */
```

### 4. 접근성
- **ARIA Labels**: 드롭다운 트리거에 명확한 레이블
- **Keyboard Navigation**: 탭, 엔터, Esc 지원
- **Focus Management**: 드롭다운 열릴 때 포커스 이동

### 5. shadcn/ui DropdownMenu 설치
```bash
npx shadcn@latest add dropdown-menu
```

### 6. Avatar 컴포넌트 (간단한 구현)
```typescript
// components/ui/avatar.tsx
interface AvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ username, size = 'sm' }: AvatarProps) {
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}
    >
      {initials}
    </div>
  );
}
```

### 7. 구현 순서
1. ✅ 기본 구조 생성 (비로그인 / 로그인 분기)
2. ✅ DropdownMenu 컴포넌트 통합
3. ✅ Avatar 컴포넌트 생성
4. ✅ Mock 사용자 데이터 사용 (Phase 1)
5. ✅ 로그아웃 핸들러 구현
6. ⏳ AuthProvider 연동 (Phase 2)
7. ⏳ 반응형 처리

### 8. 테스트 체크리스트
- [ ] 비로그인 상태에서 "Log In", "Sign Up" 버튼이 표시되는가?
- [ ] 로그인 상태에서 Avatar와 사용자명이 표시되는가?
- [ ] 드롭다운 클릭 시 메뉴가 열리는가?
- [ ] 로그아웃 버튼 클릭 시 로그인 페이지로 이동하는가?
- [ ] 모바일에서 사용자명이 숨겨지는가?
- [ ] 키보드로 드롭다운을 탐색할 수 있는가?

### 9. 추후 확장 사항
- **프로필 이미지**: Supabase Storage 연동
- **알림**: 읽지 않은 알림 표시
- **테마 설정**: 다크 모드 토글
- **다국어**: 언어 선택 메뉴
