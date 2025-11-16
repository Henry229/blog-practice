# Header 구현 계획

## 개요
고정 헤더 컴포넌트로 로고, 검색바, 네비게이션을 포함합니다.

## 파일 경로
- `components/layouts/Header.tsx`

## 의존성
- Logo 컴포넌트
- SearchBar 컴포넌트
- Navigation 컴포넌트
- UserMenu 컴포넌트
- Tailwind CSS

## 구현 상세

### 1. 기본 구조
```typescript
import Logo from './Logo';
import SearchBar from '../blog/SearchBar';
import Navigation from './Navigation';
import UserMenu from './UserMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 왼쪽: 로고 */}
        <Logo />

        {/* 중앙: 검색바 */}
        <div className="flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* 오른쪽: 네비게이션 + 사용자 메뉴 */}
        <div className="flex items-center gap-4">
          <Navigation />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

### 2. 핵심 기능

#### Sticky Header
- **position**: sticky top-0
- **z-index**: z-50 (높은 우선순위)
- **배경**: 반투명 흰색 + backdrop blur

#### 레이아웃 구조
- **3단 구조**: Logo (왼쪽) | SearchBar (중앙) | Navigation + UserMenu (오른쪽)
- **Flexbox**: justify-between으로 양 끝 정렬
- **Container**: max-width 제한, 중앙 정렬

#### 반응형 디자인
- **데스크톱** (>768px): 전체 표시
- **태블릿** (768px): 검색바 작게
- **모바일** (<640px): 검색바 숨김, 햄버거 메뉴

### 3. 스타일링

#### Sticky Header 효과
```css
/* Tailwind Classes */
sticky top-0           /* 상단 고정 */
z-50                   /* 다른 요소 위에 표시 */
border-b               /* 하단 경계선 */
bg-white/95            /* 95% 불투명 흰색 */
backdrop-blur          /* 배경 블러 효과 */
```

#### Container
```css
container mx-auto      /* 중앙 정렬 컨테이너 */
h-16                   /* 높이 64px */
flex items-center      /* 수평 정렬 */
justify-between        /* 양 끝 정렬 */
px-4                   /* 좌우 패딩 */
```

#### 검색바 영역
```css
flex-1                 /* 남은 공간 차지 */
max-w-md               /* 최대 너비 448px */
mx-8                   /* 좌우 마진 */
```

### 4. 접근성
- **Semantic HTML**: `<header>` 태그 사용
- **ARIA Labels**: 검색, 네비게이션 레이블
- **Keyboard Navigation**: 탭 순서 지원

### 5. 반응형 구현
```typescript
// 모바일 버전 (추후 확장)
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        {/* 데스크톱: 검색바 표시 */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* 모바일: 햄버거 메뉴 */}
        <div className="flex items-center gap-4">
          <Navigation />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

### 6. 구현 순서
1. ✅ 기본 header 구조 생성
2. ✅ Sticky 스타일 적용
3. ✅ 3단 레이아웃 구성 (Logo | SearchBar | Navigation + UserMenu)
4. ⏳ 자식 컴포넌트 통합 (Logo, SearchBar, Navigation, UserMenu)
5. ⏳ 반응형 디자인 적용
6. ⏳ 접근성 검증

### 7. 테스트 체크리스트
- [ ] 스크롤 시 헤더가 상단에 고정되는가?
- [ ] 검색바가 중앙에 위치하는가?
- [ ] 로고, 네비게이션, 사용자 메뉴가 올바르게 정렬되는가?
- [ ] 반응형에서 레이아웃이 깨지지 않는가?
- [ ] Backdrop blur 효과가 작동하는가?

### 8. 추후 확장 사항
- **모바일 메뉴**: 햄버거 메뉴 + 드로어
- **검색 자동완성**: 검색 제안 기능
- **알림**: 사용자 알림 아이콘
- **스크롤 숨김**: 스크롤 다운 시 헤더 숨김
