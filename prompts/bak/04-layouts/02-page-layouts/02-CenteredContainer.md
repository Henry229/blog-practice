# CenteredContainer 구현 계획

## 개요
중앙 정렬 컨테이너로, 폼 페이지(로그인, 회원가입, 글 작성)에서 사용됩니다.

## 파일 경로
- `components/layouts/CenteredContainer.tsx`

## 의존성
- Tailwind CSS
- React (children prop)

## 구현 상세

### 1. 기본 구조
```typescript
import { ReactNode } from 'react';

interface CenteredContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function CenteredContainer({
  children,
  className = '',
  maxWidth = 'md',
}: CenteredContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',   // 384px
    md: 'max-w-md',   // 448px
    lg: 'max-w-lg',   // 512px
    xl: 'max-w-xl',   // 576px
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className={`w-full ${maxWidthClasses[maxWidth]} ${className}`}>
        {children}
      </div>
    </div>
  );
}
```

### 2. 핵심 기능

#### 수직/수평 중앙 정렬
- **min-h**: 헤더 제외 전체 화면 높이 (100vh - 4rem)
- **flex**: Flexbox 레이아웃
- **items-center**: 수직 중앙 정렬
- **justify-center**: 수평 중앙 정렬

#### 최대 너비 제한
- **sm**: 384px (좁은 폼)
- **md**: 448px (기본 - 로그인, 회원가입)
- **lg**: 512px (글 작성 폼)
- **xl**: 576px (넓은 폼)

#### 패딩 & 반응형
- **px-4**: 좌우 패딩 (모바일 여백)
- **py-8**: 상하 패딩

### 3. 스타일링

#### Outer Container
```css
min-h-[calc(100vh-4rem)]   /* 전체 화면 - 헤더 높이 */
flex                        /* Flexbox 활성화 */
items-center                /* 수직 중앙 */
justify-center              /* 수평 중앙 */
px-4                        /* 좌우 패딩 */
py-8                        /* 상하 패딩 */
```

#### Inner Container
```css
w-full                      /* 부모 너비 100% */
max-w-md                    /* 최대 너비 448px (기본) */
```

### 4. 사용 예시

#### 로그인 페이지
```typescript
// app/auth/login/page.tsx
import CenteredContainer from '@/components/layouts/CenteredContainer';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <CenteredContainer maxWidth="sm">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </CenteredContainer>
  );
}
```

#### 회원가입 페이지
```typescript
// app/auth/signup/page.tsx
import CenteredContainer from '@/components/layouts/CenteredContainer';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <CenteredContainer maxWidth="md">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join SimpleBlog today
          </p>
        </div>
        <SignupForm />
      </div>
    </CenteredContainer>
  );
}
```

#### 새 글 작성 페이지
```typescript
// app/blog/new/page.tsx
import CenteredContainer from '@/components/layouts/CenteredContainer';
import BlogForm from '@/components/blog/BlogForm';

export default function NewPostPage() {
  return (
    <CenteredContainer maxWidth="lg">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <BlogForm />
      </div>
    </CenteredContainer>
  );
}
```

### 5. 변형 옵션

#### 배경색 추가
```typescript
interface CenteredContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  withBackground?: boolean;
}

export default function CenteredContainer({
  children,
  className = '',
  maxWidth = 'md',
  withBackground = false,
}: CenteredContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 ${
        withBackground ? 'bg-gray-50' : ''
      }`}
    >
      <div className={`w-full ${maxWidthClasses[maxWidth]} ${className}`}>
        {children}
      </div>
    </div>
  );
}
```

#### 카드 스타일 추가
```typescript
interface CenteredContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  asCard?: boolean;
}

export default function CenteredContainer({
  children,
  className = '',
  maxWidth = 'md',
  asCard = false,
}: CenteredContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} ${
          asCard ? 'bg-white rounded-lg shadow-lg p-8' : ''
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
```

#### 사용 예시
```typescript
// 배경색이 있는 페이지
<CenteredContainer maxWidth="sm" withBackground>
  <LoginForm />
</CenteredContainer>

// 카드 스타일 폼
<CenteredContainer maxWidth="md" asCard>
  <SignupForm />
</CenteredContainer>
```

### 6. 접근성
- **Semantic HTML**: main 태그 사용 고려
- **Focus Management**: 폼 자동 포커스
- **Skip Link**: 메인 콘텐츠로 건너뛰기

### 7. 반응형 디자인
```typescript
export default function CenteredContainer({
  children,
  className = '',
  maxWidth = 'md',
}: CenteredContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className={`w-full ${maxWidthClasses[maxWidth]} ${className}`}>
        {children}
      </div>
    </div>
  );
}
```

#### 브레이크포인트별 패딩
- **모바일**: px-4, py-8
- **태블릿**: px-6, py-12

### 8. 헤더 높이 계산

현재 `min-h-[calc(100vh-4rem)]`은 헤더 높이를 64px (4rem)로 가정합니다.

#### 동적 높이 계산 (선택사항)
```typescript
export default function CenteredContainer({
  children,
  className = '',
  maxWidth = 'md',
  headerHeight = 64, // px
}: CenteredContainerProps & { headerHeight?: number }) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="flex items-center justify-center px-4 py-8"
      style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
    >
      <div className={`w-full ${maxWidthClasses[maxWidth]} ${className}`}>
        {children}
      </div>
    </div>
  );
}
```

### 9. 구현 순서
1. ✅ 기본 중앙 정렬 컨테이너 생성
2. ✅ maxWidth prop 추가 (sm, md, lg, xl)
3. ✅ 최소 높이 설정 (전체 화면 - 헤더)
4. ⏳ withBackground prop 추가 (선택사항)
5. ⏳ asCard prop 추가 (선택사항)
6. ⏳ 반응형 패딩 적용

### 10. 테스트 체크리스트
- [ ] 컨테이너가 수직/수평 중앙에 정렬되는가?
- [ ] maxWidth prop이 올바르게 작동하는가?
- [ ] 모바일에서 레이아웃이 깨지지 않는가?
- [ ] 전체 화면 높이에서 헤더 높이가 제외되는가?
- [ ] 폼이 화면 중앙에 위치하는가?

### 11. 추후 확장 사항
- **애니메이션**: 페이지 로드 시 fade-in 효과
- **로딩 상태**: 스켈레톤 UI
- **에러 처리**: 에러 메시지 표시 영역
- **다크 모드**: 배경색 자동 조정
