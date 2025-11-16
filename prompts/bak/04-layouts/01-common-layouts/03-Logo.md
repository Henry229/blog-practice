# Logo 구현 계획

## 개요
SimpleBlog 로고 컴포넌트로, 클릭 시 홈페이지로 이동합니다.

## 파일 경로
- `components/layouts/Logo.tsx`

## 의존성
- Next.js Link
- Tailwind CSS

## 구현 상세

### 1. 기본 구조
```typescript
import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
        S
      </div>
      <span className="hidden sm:inline">SimpleBlog</span>
    </Link>
  );
}
```

### 2. 핵심 기능

#### 로고 디자인
- **아이콘**: "S" 문자 + 그라디언트 배경
- **텍스트**: "SimpleBlog" (모바일에서 숨김)
- **색상**: 파란색-보라색 그라디언트

#### 네비게이션
- **Link 컴포넌트**: Next.js prefetching 지원
- **href**: "/" (홈페이지)
- **Hover 효과**: opacity 변화

#### 반응형
- **모바일** (<640px): 아이콘만 표시
- **데스크톱** (≥640px): 아이콘 + 텍스트

### 3. 스타일링

#### Container
```css
flex items-center gap-2    /* 아이콘과 텍스트 정렬 */
font-bold text-xl          /* 굵은 폰트, 큰 텍스트 */
hover:opacity-80           /* Hover 효과 */
transition-opacity         /* 부드러운 전환 */
```

#### 아이콘
```css
w-8 h-8                         /* 크기 32x32px */
bg-gradient-to-br               /* 대각선 그라디언트 */
from-blue-500 to-purple-600     /* 파란색→보라색 */
rounded-lg                      /* 둥근 모서리 */
flex items-center justify-center /* 중앙 정렬 */
text-white font-bold            /* 흰색 굵은 글자 */
```

#### 텍스트
```css
hidden sm:inline           /* 모바일에서 숨김 */
```

### 4. 접근성
- **Semantic Link**: Next.js Link 사용
- **Keyboard Navigation**: 키보드로 접근 가능
- **Focus State**: 기본 focus ring 표시

### 5. 대안 디자인 옵션

#### 옵션 1: 텍스트 로고만
```typescript
<Link href="/" className="font-bold text-2xl">
  SimpleBlog
</Link>
```

#### 옵션 2: 이미지 로고
```typescript
<Link href="/" className="flex items-center">
  <Image
    src="/logo.svg"
    alt="SimpleBlog"
    width={120}
    height={40}
  />
</Link>
```

#### 옵션 3: 아이콘 라이브러리 사용
```typescript
import { BookOpen } from 'lucide-react';

<Link href="/" className="flex items-center gap-2">
  <BookOpen className="w-8 h-8 text-blue-600" />
  <span className="font-bold text-xl">SimpleBlog</span>
</Link>
```

### 6. 구현 순서
1. ✅ 기본 Link 구조 생성
2. ✅ 아이콘 디자인 (그라디언트 "S")
3. ✅ 텍스트 추가
4. ✅ Hover 효과 추가
5. ✅ 반응형 처리 (모바일에서 텍스트 숨김)

### 7. 테스트 체크리스트
- [ ] 로고 클릭 시 홈페이지로 이동하는가?
- [ ] Hover 효과가 작동하는가?
- [ ] 모바일에서 텍스트가 숨겨지는가?
- [ ] 키보드로 접근 가능한가?
- [ ] 그라디언트가 올바르게 표시되는가?

### 8. 추후 확장 사항
- **애니메이션**: 로고 hover 시 회전 효과
- **다크 모드**: 다크 모드 색상 변형
- **SVG 로고**: 커스텀 SVG 로고 디자인
- **브랜드 색상**: 프로젝트 브랜드 컬러 적용
