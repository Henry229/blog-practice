# PageContainer 구현 계획

## 개요
페이지 공통 컨테이너로, 최대 너비 제한과 패딩을 제공합니다.

## 파일 경로
- `components/layouts/PageContainer.tsx`

## 의존성
- Tailwind CSS
- React (children prop)

## 구현 상세

### 1. 기본 구조
```typescript
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}
```

### 2. 핵심 기능

#### Container 설정
- **max-width**: Tailwind의 `container` 클래스 사용
- **중앙 정렬**: `mx-auto`
- **패딩**: 좌우 `px-4`, 상하 `py-8`

#### 유연한 스타일링
- **className prop**: 추가 스타일 적용 가능
- **기본 스타일**: 일관된 레이아웃 제공

### 3. 스타일링

#### Container 클래스
```css
container              /* Tailwind container (반응형 max-width) */
mx-auto                /* 중앙 정렬 */
px-4                   /* 좌우 패딩 16px */
py-8                   /* 상하 패딩 32px */
```

#### Tailwind Container 브레이크포인트
```css
/* 기본 Tailwind container 너비 */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### 4. 사용 예시

#### 홈페이지
```typescript
// app/page.tsx
import PageContainer from '@/components/layouts/PageContainer';
import BlogGrid from '@/components/blog/BlogGrid';

export default function HomePage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <BlogGrid />
    </PageContainer>
  );
}
```

#### 블로그 상세 페이지
```typescript
// app/blog/[id]/page.tsx
import PageContainer from '@/components/layouts/PageContainer';
import BlogPost from '@/components/blog/BlogPost';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <PageContainer className="max-w-3xl">
      <BlogPost id={params.id} />
    </PageContainer>
  );
}
```

### 5. 변형 옵션

#### 좁은 컨테이너 (글 읽기 최적화)
```typescript
interface PageContainerProps {
  children: ReactNode;
  variant?: 'default' | 'narrow' | 'wide';
  className?: string;
}

export default function PageContainer({
  children,
  variant = 'default',
  className = '',
}: PageContainerProps) {
  const variantClasses = {
    default: 'container',
    narrow: 'max-w-3xl',
    wide: 'max-w-7xl',
  };

  return (
    <div className={`${variantClasses[variant]} mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}
```

#### 사용 예시
```typescript
// 기본 컨테이너
<PageContainer>...</PageContainer>

// 좁은 컨테이너 (블로그 글)
<PageContainer variant="narrow">...</PageContainer>

// 넓은 컨테이너 (대시보드)
<PageContainer variant="wide">...</PageContainer>
```

### 6. 접근성
- **Semantic HTML**: div 대신 main 태그 고려
- **Skip Link**: 메인 콘텐츠로 건너뛰기 지원

#### 개선된 구조
```typescript
export default function PageContainer({
  children,
  className = '',
  as: Component = 'div',
}: PageContainerProps & { as?: 'div' | 'main' | 'section' }) {
  return (
    <Component className={`container mx-auto px-4 py-8 ${className}`}>
      {children}
    </Component>
  );
}
```

#### 사용 예시
```typescript
<PageContainer as="main">
  {/* 페이지 메인 콘텐츠 */}
</PageContainer>
```

### 7. 반응형 패딩 옵션
```typescript
export default function PageContainer({
  children,
  className = '',
}: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 ${className}`}>
      {children}
    </div>
  );
}
```

#### 브레이크포인트별 패딩
- **모바일**: px-4, py-6
- **태블릿**: px-6, py-8
- **데스크톱**: px-8, py-12

### 8. 구현 순서
1. ✅ 기본 컨테이너 컴포넌트 생성
2. ✅ className prop 추가 (유연한 스타일링)
3. ⏳ variant prop 추가 (선택사항)
4. ⏳ 반응형 패딩 적용
5. ⏳ as prop 추가 (semantic HTML)

### 9. 테스트 체크리스트
- [ ] 컨테이너가 중앙 정렬되는가?
- [ ] 최대 너비 제한이 작동하는가?
- [ ] 좌우, 상하 패딩이 올바르게 적용되는가?
- [ ] className prop으로 스타일을 추가할 수 있는가?
- [ ] 반응형 레이아웃이 깨지지 않는가?

### 10. 추후 확장 사항
- **애니메이션**: 페이지 전환 애니메이션
- **레이아웃 전환**: 풀 너비 ↔ 컨테이너 전환
- **그리드 시스템**: 내부 그리드 레이아웃 옵션
- **여백 조정**: 상하 여백 커스터마이징
