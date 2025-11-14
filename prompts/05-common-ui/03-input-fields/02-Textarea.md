# Textarea 구현 계획

## 개요
텍스트 영역 입력 컴포넌트로, 블로그 글 작성, 댓글 입력 등에 사용됩니다.

## 파일 경로
- `components/ui/textarea.tsx`

## 의존성
- **shadcn/ui**: Textarea 컴포넌트 사용
- **Tailwind CSS**: 스타일링

## 설치 방법

### shadcn/ui Textarea 설치
```bash
npx shadcn@latest add textarea
```

이 명령어는 다음을 자동으로 생성합니다:
- `components/ui/textarea.tsx`

## 구현 상세

### 1. 기본 구조 (shadcn/ui 기반)

설치 후 생성되는 `components/ui/textarea.tsx`:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
```

### 2. 기본 기능

#### 내장 스타일
- **최소 높이**: 80px (min-h-[80px])
- **패딩**: 좌우 12px, 상하 8px
- **테두리**: 1px solid
- **둥근 모서리**: rounded-md
- **포커스**: ring 효과
- **자동 리사이즈**: 기본적으로 수동 리사이즈 가능

#### 상태
- **기본**: 흰색 배경, 회색 테두리
- **포커스**: 파란색 ring 표시
- **비활성화**: 회색 배경, 투명도 50%

### 3. 사용 예시

#### 기본 사용
```typescript
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Enter your message..." />
```

#### rows 지정
```typescript
<Textarea
  placeholder="Write your comment..."
  rows={4}
/>
```

#### 최대 길이 제한
```typescript
<Textarea
  placeholder="Write your bio (max 500 characters)"
  maxLength={500}
/>
```

#### 비활성화
```typescript
<Textarea
  placeholder="Disabled textarea"
  disabled
/>
```

### 4. Label과 함께 사용

#### 기본 폼 필드
```typescript
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    placeholder="Write your blog post content..."
    rows={10}
  />
</div>
```

#### react-hook-form 통합
```typescript
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BlogFormData {
  title: string;
  content: string;
}

export default function BlogForm() {
  const { register, handleSubmit } = useForm<BlogFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your blog post..."
          rows={15}
          {...register('content', { required: true })}
        />
      </div>

      <Button type="submit">Publish</Button>
    </form>
  );
}
```

### 5. 에러 상태 표시

#### 에러 스타일 추가
```typescript
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    placeholder="Write your content..."
    className="border-red-500 focus-visible:ring-red-500"
    aria-invalid="true"
    aria-describedby="content-error"
  />
  <p id="content-error" className="text-sm text-red-500">
    Content is required
  </p>
</div>
```

#### react-hook-form 에러 통합
```typescript
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CommentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          placeholder="Write your comment..."
          rows={4}
          className={errors.comment ? 'border-red-500' : ''}
          {...register('comment', {
            required: 'Comment is required',
            minLength: {
              value: 10,
              message: 'Comment must be at least 10 characters',
            },
          })}
        />
        {errors.comment && (
          <p className="text-sm text-red-500">
            {errors.comment.message}
          </p>
        )}
      </div>

      <Button type="submit">Post Comment</Button>
    </form>
  );
}
```

### 6. 문자 수 표시

#### 실시간 문자 수 카운터
```typescript
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function ContentTextarea() {
  const [content, setContent] = useState('');
  const maxLength = 500;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="content">Content</Label>
        <span className="text-sm text-muted-foreground">
          {content.length} / {maxLength}
        </span>
      </div>
      <Textarea
        id="content"
        placeholder="Write your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={maxLength}
        rows={8}
      />
    </div>
  );
}
```

### 7. 자동 높이 조절 (Auto-resize)

#### 커스텀 훅 사용
```typescript
// hooks/useAutoResizeTextarea.ts
import { useEffect, useRef } from 'react';

export function useAutoResizeTextarea(value: string) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return textareaRef;
}
```

#### 사용 예시
```typescript
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';

export default function AutoResizeTextarea() {
  const [value, setValue] = useState('');
  const textareaRef = useAutoResizeTextarea(value);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Type something..."
      className="min-h-[80px] max-h-[400px] resize-none overflow-y-auto"
    />
  );
}
```

### 8. 실전 예시

#### 블로그 글 작성 폼
```typescript
// components/blog/BlogForm.tsx
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface BlogFormData {
  title: string;
  content: string;
}

export default function BlogForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BlogFormData>();

  const content = watch('content', '');

  const onSubmit = async (data: BlogFormData) => {
    // 블로그 글 생성 로직
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter blog title..."
          className={errors.title ? 'border-red-500' : ''}
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Content</Label>
          <span className="text-sm text-muted-foreground">
            {content.length} characters
          </span>
        </div>
        <Textarea
          id="content"
          placeholder="Write your blog post content..."
          rows={15}
          className={errors.content ? 'border-red-500' : ''}
          {...register('content', {
            required: 'Content is required',
            minLength: {
              value: 50,
              message: 'Content must be at least 50 characters',
            },
          })}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

#### 댓글 작성 폼
```typescript
// components/comments/CommentForm.tsx
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CommentFormData {
  content: string;
}

export default function CommentForm({ blogId }: { blogId: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CommentFormData>();

  const content = watch('content', '');

  const onSubmit = async (data: CommentFormData) => {
    // 댓글 생성 로직
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Add a comment</p>
          <span className="text-xs text-muted-foreground">
            {content.length} / 500
          </span>
        </div>
        <Textarea
          placeholder="Write your comment..."
          rows={4}
          maxLength={500}
          className={errors.content ? 'border-red-500' : ''}
          {...register('content', {
            required: 'Comment cannot be empty',
            minLength: {
              value: 10,
              message: 'Comment must be at least 10 characters',
            },
          })}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  );
}
```

### 9. 커스터마이징

#### 크기 변형
```typescript
// 작은 Textarea
<Textarea className="min-h-[60px]" rows={3} />

// 기본 Textarea
<Textarea />

// 큰 Textarea
<Textarea className="min-h-[300px]" rows={15} />
```

#### 리사이즈 제어
```typescript
// 리사이즈 불가
<Textarea className="resize-none" />

// 수직만 리사이즈
<Textarea className="resize-y" />

// 수평만 리사이즈
<Textarea className="resize-x" />
```

### 10. 접근성

#### 필수 속성
- **id**: Label의 htmlFor와 매칭
- **aria-invalid**: 에러 상태 표시
- **aria-describedby**: 에러 메시지 연결

#### 예시
```typescript
<div className="space-y-2">
  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    aria-invalid={!!errors.content}
    aria-describedby={errors.content ? "content-error" : undefined}
  />
  {errors.content && (
    <p id="content-error" className="text-sm text-red-500">
      {errors.content.message}
    </p>
  )}
</div>
```

### 11. 구현 순서
1. ✅ shadcn/ui Textarea 설치: `npx shadcn@latest add textarea`
2. ✅ 기본 Textarea 컴포넌트 확인 (`components/ui/textarea.tsx`)
3. ⏳ BlogForm에서 Textarea 사용
4. ⏳ CommentForm에서 Textarea 사용
5. ⏳ react-hook-form 통합
6. ⏳ 문자 수 카운터 추가
7. ⏳ 자동 높이 조절 구현 (선택사항)

### 12. 테스트 체크리스트
- [ ] Textarea가 올바르게 렌더링되는가?
- [ ] 포커스 시 ring이 표시되는가?
- [ ] 비활성화 상태가 작동하는가?
- [ ] 에러 상태가 올바르게 표시되는가?
- [ ] Label과 Textarea가 연결되는가?
- [ ] 문자 수 제한이 작동하는가?
- [ ] 키보드로 접근 가능한가?

### 13. 추후 확장 사항
- **마크다운 에디터**: 마크다운 미리보기
- **멘션 기능**: @사용자명 자동완성
- **이미지 삽입**: 드래그 앤 드롭
- **코드 하이라이팅**: 코드 블록 지원
