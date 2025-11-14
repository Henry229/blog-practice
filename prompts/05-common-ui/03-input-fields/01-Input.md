# Input 구현 계획

## 개요
텍스트 입력 필드 컴포넌트로, 이메일, 비밀번호, 텍스트 등 다양한 타입을 지원합니다.

## 파일 경로
- `components/ui/input.tsx`

## 의존성
- **shadcn/ui**: Input 컴포넌트 사용
- **Tailwind CSS**: 스타일링

## 설치 방법

### shadcn/ui Input 설치
```bash
npx shadcn@latest add input
```

이 명령어는 다음을 자동으로 생성합니다:
- `components/ui/input.tsx`

## 구현 상세

### 1. 기본 구조 (shadcn/ui 기반)

설치 후 생성되는 `components/ui/input.tsx`:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### 2. 기본 기능

#### 내장 스타일
- **높이**: 40px (h-10)
- **패딩**: 좌우 12px, 상하 8px
- **테두리**: 1px solid
- **둥근 모서리**: rounded-md
- **포커스**: ring 효과

#### 상태
- **기본**: 흰색 배경, 회색 테두리
- **포커스**: 파란색 ring 표시
- **비활성화**: 회색 배경, 투명도 50%
- **에러**: 빨간색 테두리 (커스텀)

### 3. 사용 예시

#### 기본 사용
```typescript
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Enter your name" />
```

#### 이메일 입력
```typescript
<Input
  type="email"
  placeholder="email@example.com"
  autoComplete="email"
/>
```

#### 비밀번호 입력
```typescript
<Input
  type="password"
  placeholder="Enter password"
  autoComplete="current-password"
/>
```

#### 비활성화
```typescript
<Input
  type="text"
  placeholder="Disabled input"
  disabled
/>
```

### 4. Label과 함께 사용

#### 기본 폼 필드
```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="email@example.com"
  />
</div>
```

#### react-hook-form 통합
```typescript
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          {...register('email', { required: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          {...register('password', { required: true })}
        />
      </div>

      <Button type="submit">Log In</Button>
    </form>
  );
}
```

### 5. 에러 상태 표시

#### 에러 스타일 추가
```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="email@example.com"
    className="border-red-500 focus-visible:ring-red-500"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-red-500">
    Email is required
  </p>
</div>
```

#### react-hook-form 에러 통합
```typescript
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          className={errors.email ? 'border-red-500' : ''}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>
    </form>
  );
}
```

### 6. 아이콘과 함께 사용

#### 검색 아이콘
```typescript
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    type="search"
    placeholder="Search..."
    className="pl-10"
  />
</div>
```

#### 클리어 버튼
```typescript
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function SearchInput() {
  const [value, setValue] = useState('');

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={() => setValue('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

### 7. 실전 예시

#### 로그인 폼
```typescript
// components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    // 로그인 로직
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          className={errors.email ? 'border-red-500' : ''}
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          autoComplete="current-password"
          className={errors.password ? 'border-red-500' : ''}
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
}
```

#### 검색바
```typescript
// components/blog/SearchBar.tsx
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // 검색 로직
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
}
```

### 8. 커스터마이징

#### 크기 변형
```typescript
// 작은 Input
<Input className="h-8 text-xs" />

// 기본 Input
<Input />

// 큰 Input
<Input className="h-12 text-base" />
```

#### 전체 너비
```typescript
<Input className="w-full" />
```

### 9. 접근성

#### 필수 속성
- **id**: Label의 htmlFor와 매칭
- **type**: 입력 타입 지정
- **autoComplete**: 자동 완성 지원
- **aria-invalid**: 에러 상태 표시
- **aria-describedby**: 에러 메시지 연결

#### 예시
```typescript
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    autoComplete="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <p id="email-error" className="text-sm text-red-500">
      {errors.email.message}
    </p>
  )}
</div>
```

### 10. 구현 순서
1. ✅ shadcn/ui Input 설치: `npx shadcn@latest add input`
2. ✅ 기본 Input 컴포넌트 확인 (`components/ui/input.tsx`)
3. ⏳ Label 컴포넌트 설치: `npx shadcn@latest add label`
4. ⏳ 폼에서 Input 사용
5. ⏳ react-hook-form 통합
6. ⏳ 에러 상태 스타일링
7. ⏳ 아이콘 통합 (검색바 등)

### 11. 테스트 체크리스트
- [ ] Input이 올바르게 렌더링되는가?
- [ ] 포커스 시 ring이 표시되는가?
- [ ] 비활성화 상태가 작동하는가?
- [ ] 에러 상태가 올바르게 표시되는가?
- [ ] Label과 Input이 연결되는가?
- [ ] 자동 완성이 작동하는가?
- [ ] 키보드로 접근 가능한가?

### 12. 추후 확장 사항
- **비밀번호 표시/숨김**: 토글 버튼
- **입력 검증**: 실시간 유효성 검사
- **자동 완성**: 제안 목록 표시
- **마스킹**: 전화번호, 카드 번호 등
