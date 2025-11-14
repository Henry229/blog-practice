# Navigation 구현 계획

## 개요
네비게이션 버튼 그룹으로, 홈, 새 글 작성 등의 링크를 제공합니다.

## 파일 경로
- `components/layouts/Navigation.tsx`

## 의존성
- Next.js Link
- Button 컴포넌트 (shadcn/ui)
- Tailwind CSS
- usePathname (활성 링크 표시용)

## 구현 상세

### 1. 기본 구조
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PenSquare, Home } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/blog/new',
      label: 'New Post',
      icon: PenSquare,
    },
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
```

### 2. 핵심 기능

#### 네비게이션 아이템
- **Home**: "/" - 블로그 목록
- **New Post**: "/blog/new" - 새 글 작성 (로그인 필요)

#### 활성 링크 표시
- **usePathname**: 현재 경로 감지
- **variant**: active = "default", inactive = "ghost"
- **시각적 피드백**: 현재 페이지를 명확히 표시

#### 아이콘 통합
- **lucide-react**: 경량 아이콘 라이브러리
- **Home**: 홈 아이콘
- **PenSquare**: 글쓰기 아이콘

#### 반응형
- **모바일**: 아이콘만 표시
- **데스크톱**: 아이콘 + 텍스트

### 3. 스타일링

#### Container
```css
flex items-center gap-2    /* 수평 정렬, 간격 */
```

#### Button 상태
```typescript
// Active 상태
variant="default"          // 파란색 배경
size="sm"                  // 작은 크기
className="gap-2"          // 아이콘-텍스트 간격

// Inactive 상태
variant="ghost"            // 투명 배경, hover 시 회색
size="sm"
className="gap-2"
```

#### 반응형
```css
hidden md:inline           /* 텍스트는 데스크톱에서만 */
```

### 4. 접근성
- **Semantic Nav**: `<nav>` 태그 사용
- **ARIA Labels**: 버튼에 명확한 레이블
- **Keyboard Navigation**: 탭으로 이동 가능
- **Focus State**: 기본 focus ring

### 5. 확장 가능한 구조

#### 네비게이션 아이템 추가
```typescript
const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/blog/new', label: 'New Post', icon: PenSquare },
  { href: '/about', label: 'About', icon: Info },          // 추가
  { href: '/contact', label: 'Contact', icon: Mail },     // 추가
];
```

#### 조건부 렌더링 (로그인 상태)
```typescript
'use client';

import { useAuth } from '@/components/auth/AuthProvider';

export default function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    // 로그인 시만 표시
    ...(user ? [{ href: '/blog/new', label: 'New Post', icon: PenSquare }] : []),
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <Button variant={isActive ? 'default' : 'ghost'} size="sm" className="gap-2">
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
```

### 6. 구현 순서
1. ✅ 기본 nav 구조 생성
2. ✅ navItems 배열 정의 (Home, New Post)
3. ✅ usePathname으로 활성 링크 감지
4. ✅ Button variant로 활성 상태 표시
5. ✅ lucide-react 아이콘 추가
6. ⏳ 반응형 처리 (모바일에서 텍스트 숨김)
7. ⏳ AuthProvider 연동 (Phase 2)

### 7. 테스트 체크리스트
- [ ] 링크 클릭 시 올바른 페이지로 이동하는가?
- [ ] 현재 페이지가 시각적으로 강조되는가?
- [ ] 모바일에서 아이콘만 표시되는가?
- [ ] Hover 효과가 작동하는가?
- [ ] 키보드 네비게이션이 가능한가?

### 8. 추후 확장 사항
- **드롭다운 메뉴**: 카테고리별 필터
- **알림 배지**: 새 댓글 알림
- **다크 모드 토글**: 테마 전환 버튼
- **모바일 메뉴**: 햄버거 메뉴 통합
