# IconButton 구현 계획

## 개요
아이콘 전용 버튼 컴포넌트로, Button 컴포넌트의 `size="icon"` variant를 래핑합니다.

## 파일 경로
- `components/ui/icon-button.tsx` (선택사항)
- 또는 `Button` 컴포넌트 직접 사용

## 의존성
- Button 컴포넌트 (shadcn/ui)
- lucide-react (아이콘)
- Tailwind CSS

## 구현 상세

### 방법 1: Button 컴포넌트 직접 사용 (권장)

shadcn/ui Button은 이미 `size="icon"` variant를 제공하므로, 별도의 IconButton 컴포넌트 없이 사용 가능합니다.

#### 사용 예시
```typescript
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, X, Menu } from 'lucide-react';

// 기본 아이콘 버튼
<Button size="icon" aria-label="Delete">
  <Trash2 className="h-4 w-4" />
</Button>

// Variant 변형
<Button size="icon" variant="outline" aria-label="Edit">
  <Edit className="h-4 w-4" />
</Button>

<Button size="icon" variant="destructive" aria-label="Delete">
  <Trash2 className="h-4 w-4" />
</Button>

<Button size="icon" variant="ghost" aria-label="Menu">
  <Menu className="h-4 w-4" />
</Button>
```

### 방법 2: IconButton 래퍼 컴포넌트 생성 (선택사항)

더 명시적인 사용을 원할 경우 래퍼 컴포넌트를 생성할 수 있습니다.

```typescript
// components/ui/icon-button.tsx
import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  icon: React.ReactNode
  'aria-label': string // 접근성을 위해 필수
  size?: 'sm' | 'default' | 'lg'
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, variant = "ghost", size = "default", ...props }, ref) => {
    const sizeMap = {
      sm: "h-8 w-8",
      default: "h-10 w-10",
      lg: "h-12 w-12",
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(sizeMap[size], "p-0", className)}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton }
```

#### 사용 예시
```typescript
import { IconButton } from '@/components/ui/icon-button';
import { Trash2, Edit, Plus } from 'lucide-react';

<IconButton
  icon={<Trash2 className="h-4 w-4" />}
  aria-label="Delete post"
  variant="destructive"
/>

<IconButton
  icon={<Edit className="h-4 w-4" />}
  aria-label="Edit post"
  variant="outline"
/>

<IconButton
  icon={<Plus className="h-4 w-4" />}
  aria-label="Add new"
  size="lg"
/>
```

### 3. 실전 사용 사례

#### 헤더 네비게이션 (모바일 메뉴)
```typescript
// components/layouts/Header.tsx
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      {/* 모바일 햄버거 메뉴 */}
      <Button
        size="icon"
        variant="ghost"
        className="md:hidden"
        aria-label="Toggle menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
    </header>
  );
}
```

#### 블로그 카드 액션
```typescript
// components/blog/BlogCard.tsx
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, MoreVertical } from 'lucide-react';

export default function BlogCard() {
  return (
    <div className="card">
      {/* 카드 내용 */}

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" aria-label="Bookmark">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Share">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="More options">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

#### 댓글 삭제 버튼
```typescript
// components/comments/CommentItem.tsx
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function CommentItem({ comment, isAuthor }) {
  if (!isAuthor) return null;

  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label="Delete comment"
      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
```

#### 검색바 클리어 버튼
```typescript
// components/blog/SearchBar.tsx
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {query && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
          aria-label="Clear search"
          onClick={() => setQuery('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

### 4. 크기 변형

#### 작은 아이콘 버튼
```typescript
<Button
  size="icon"
  className="h-8 w-8"
  aria-label="Small icon"
>
  <Plus className="h-3 w-3" />
</Button>
```

#### 큰 아이콘 버튼
```typescript
<Button
  size="icon"
  className="h-12 w-12"
  aria-label="Large icon"
>
  <Plus className="h-6 w-6" />
</Button>
```

### 5. 접근성 고려사항

#### 필수: aria-label
아이콘 전용 버튼은 반드시 `aria-label`을 포함해야 합니다.

```typescript
// ❌ 나쁜 예
<Button size="icon">
  <Trash2 className="h-4 w-4" />
</Button>

// ✅ 좋은 예
<Button size="icon" aria-label="Delete post">
  <Trash2 className="h-4 w-4" />
</Button>
```

#### Tooltip 추가 (선택사항)
```typescript
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon" variant="ghost" aria-label="Delete">
        <Trash2 className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Delete post</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### 6. 스타일링 팁

#### 원형 버튼
```typescript
<Button
  size="icon"
  className="rounded-full"
  aria-label="Add"
>
  <Plus className="h-4 w-4" />
</Button>
```

#### 커스텀 색상
```typescript
<Button
  size="icon"
  variant="ghost"
  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
  aria-label="Like"
>
  <Heart className="h-4 w-4" />
</Button>
```

### 7. 구현 순서
1. ✅ Button 컴포넌트의 `size="icon"` 사용 (기본 방법)
2. ⏳ IconButton 래퍼 컴포넌트 생성 (선택사항)
3. ⏳ 각 페이지에서 아이콘 버튼 사용
4. ⏳ aria-label 추가 (접근성)
5. ⏳ Tooltip 통합 (선택사항)

### 8. 테스트 체크리스트
- [ ] 아이콘이 중앙 정렬되는가?
- [ ] 모든 variant가 올바르게 표시되는가?
- [ ] Hover 효과가 작동하는가?
- [ ] aria-label이 스크린 리더에 읽히는가?
- [ ] 키보드로 접근 가능한가?
- [ ] Focus ring이 표시되는가?

### 9. 권장 사항

**추천: Button의 size="icon" 직접 사용**

별도의 IconButton 컴포넌트를 만들기보다는, shadcn/ui Button의 `size="icon"` variant를 직접 사용하는 것을 권장합니다.

**이유:**
- shadcn/ui는 이미 완성도 높은 icon variant 제공
- 추가 컴포넌트 없이 일관성 유지
- 더 적은 코드 유지보수

**IconButton 래퍼가 유용한 경우:**
- aria-label을 강제하고 싶을 때
- 프로젝트 전체에서 일관된 아이콘 크기 적용
- 추가 기본 스타일 적용 필요

### 10. 추후 확장 사항
- **Badge 통합**: 알림 카운트 표시
- **로딩 상태**: 스피너 표시
- **Toggle 상태**: 북마크, 좋아요 등
- **애니메이션**: 클릭 시 확대 효과
