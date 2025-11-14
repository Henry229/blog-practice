# Button 구현 계획

## 개요
기본 버튼 컴포넌트로, primary, secondary, danger variants를 지원합니다.

## 파일 경로
- `components/ui/button.tsx`

## 의존성
- **shadcn/ui**: Button 컴포넌트 사용
- **class-variance-authority**: Variant 관리
- **Radix UI**: 접근성 기능
- **Tailwind CSS**: 스타일링

## 설치 방법

### shadcn/ui Button 설치
```bash
npx shadcn@latest add button
```

이 명령어는 다음을 자동으로 생성합니다:
- `components/ui/button.tsx`
- 필요한 의존성 설치 (class-variance-authority, clsx, tailwind-merge)

## 구현 상세

### 1. 기본 구조 (shadcn/ui 기반)

설치 후 생성되는 `components/ui/button.tsx`:

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### 2. Variants 설명

#### variant 옵션
- **default** (primary): 파란색 배경, 흰색 텍스트 - 주요 액션용
- **destructive** (danger): 빨간색 배경 - 삭제, 위험한 작업용
- **outline**: 테두리만 있는 버튼 - 보조 액션용
- **secondary**: 회색 배경 - 보조 액션용
- **ghost**: 투명 배경, hover 시 회색 - 최소한의 강조
- **link**: 링크 스타일 - 텍스트 버튼

#### size 옵션
- **default**: 높이 40px - 일반적인 크기
- **sm**: 높이 36px - 작은 버튼
- **lg**: 높이 44px - 큰 버튼
- **icon**: 정사각형 40x40px - 아이콘 전용

### 3. 사용 예시

#### 기본 사용
```typescript
import { Button } from '@/components/ui/button';

// Primary 버튼 (기본)
<Button>Click me</Button>

// Secondary 버튼
<Button variant="secondary">Cancel</Button>

// Danger 버튼
<Button variant="destructive">Delete</Button>

// Outline 버튼
<Button variant="outline">Learn More</Button>

// Ghost 버튼
<Button variant="ghost">Skip</Button>

// Link 버튼
<Button variant="link">Read more</Button>
```

#### 크기 변형
```typescript
// 작은 버튼
<Button size="sm">Small</Button>

// 기본 크기
<Button>Default</Button>

// 큰 버튼
<Button size="lg">Large</Button>

// 아이콘 버튼
<Button size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>
```

#### 아이콘과 함께 사용
```typescript
import { Trash2, Save, Plus } from 'lucide-react';

// 아이콘 + 텍스트
<Button variant="destructive">
  <Trash2 className="mr-2 h-4 w-4" />
  Delete
</Button>

<Button>
  <Save className="mr-2 h-4 w-4" />
  Save
</Button>

// 아이콘만
<Button size="icon" variant="ghost">
  <Plus className="h-4 w-4" />
</Button>
```

#### 비활성화 상태
```typescript
<Button disabled>Disabled</Button>
```

#### 로딩 상태
```typescript
import { Loader2 } from 'lucide-react';

<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

#### Link로 사용 (asChild)
```typescript
import Link from 'next/link';

<Button asChild>
  <Link href="/blog/new">New Post</Link>
</Button>
```

### 4. 커스터마이징

#### 프로젝트 요구사항에 맞게 수정
```typescript
// components/ui/button.tsx에서 수정

const buttonVariants = cva(
  // 기본 스타일
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: 파란색 (기본)
        default: "bg-blue-600 text-white hover:bg-blue-700",

        // Secondary: 회색
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",

        // Danger: 빨간색
        destructive: "bg-red-600 text-white hover:bg-red-700",

        // Outline: 테두리만
        outline: "border-2 border-gray-300 bg-transparent hover:bg-gray-100",

        // Ghost: 투명
        ghost: "bg-transparent hover:bg-gray-100",

        // Link: 링크 스타일
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 5. 접근성

shadcn/ui Button은 기본적으로 다음을 제공합니다:

- **Keyboard Navigation**: Enter, Space로 클릭
- **Focus Visible**: 키보드 포커스 시 ring 표시
- **Disabled State**: `disabled` prop으로 비활성화
- **ARIA**: 자동으로 button role 적용

#### ARIA Label 추가 (아이콘 전용 버튼)
```typescript
<Button size="icon" aria-label="Delete post">
  <Trash2 className="h-4 w-4" />
</Button>
```

### 6. 실전 예시

#### 블로그 폼 액션
```typescript
// app/blog/new/page.tsx
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

export default function NewPostPage() {
  return (
    <form>
      {/* 폼 필드 */}

      <div className="flex gap-2">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Publish
        </Button>
        <Button type="button" variant="secondary">
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

#### 블로그 상세 액션
```typescript
// components/blog/BlogActions.tsx
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export default function BlogActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button variant="destructive" size="sm">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
```

### 7. 구현 순서
1. ✅ shadcn/ui Button 설치: `npx shadcn@latest add button`
2. ✅ 기본 Button 컴포넌트 확인 (`components/ui/button.tsx`)
3. ⏳ 프로젝트 요구사항에 맞게 variants 커스터마이징 (선택사항)
4. ⏳ 각 페이지에서 Button 사용
5. ⏳ 아이콘 통합 (lucide-react)
6. ⏳ 로딩 상태 구현

### 8. 테스트 체크리스트
- [ ] 모든 variant가 올바르게 표시되는가?
- [ ] 모든 size가 올바르게 적용되는가?
- [ ] Hover 효과가 작동하는가?
- [ ] 비활성화 상태가 올바르게 표시되는가?
- [ ] 키보드로 접근 가능한가?
- [ ] Focus ring이 표시되는가?
- [ ] 아이콘이 올바르게 정렬되는가?

### 9. 추후 확장 사항
- **로딩 버튼 래퍼**: useTransition 통합
- **토글 버튼**: 활성/비활성 상태
- **버튼 그룹**: 여러 버튼 그룹화
- **아이콘 위치**: 왼쪽/오른쪽 선택 가능
