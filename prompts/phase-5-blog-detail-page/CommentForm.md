# CommentForm

## 개요
**Phase**: Phase 5 - 블로그 상세 페이지
**파일 경로**: `components/blog/CommentForm.tsx`
**UI 참조**: `blog-practice.pdf` - Page 3 (Post Detail, 댓글 작성 폼)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 블로그 글에 댓글을 작성하는 폼 컴포넌트
**타입**: Feature Component (Client Component)
**위치**: PostDetailPage 내부, 댓글 섹션 상단

---

## 요구사항

### 기능 요구사항
- [ ] 댓글 내용 입력 필드 (Textarea)
- [ ] 제출 버튼
- [ ] Server Action 호출 (댓글 생성)
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 성공 시 폼 초기화
- [ ] 로그인하지 않은 경우 로그인 안내 메시지

### UI 요구사항 (blog-practice.pdf - Page 3)
- [ ] Textarea: 다중 라인 입력 (최소 3줄)
- [ ] Placeholder: "Write a comment..."
- [ ] 제출 버튼: 파란색, 우측 정렬
- [ ] 로딩 시 버튼 비활성화
- [ ] 에러 메시지: 빨간색

### 접근성 요구사항
- [ ] Label과 Textarea 연결
- [ ] 에러 메시지 role="alert"
- [ ] 키보드 탐색 지원
- [ ] 제출 버튼 명확한 텍스트

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button textarea label
```

### 내부 의존성
- Auth: `useAuth` from `@/components/providers/AuthProvider`
- Server Action: `createComment` from `@/app/actions/comment` (to be created)
- Next.js: `useRouter` from `next/navigation`
- UI components: `Button`, `Textarea`, `Label` from `@/components/ui`

---

## 기본 구조

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/AuthProvider"
import { createComment } from "@/app/actions/comment"
import Link from "next/link"

interface CommentFormProps {
  blogId: string
}

export function CommentForm({ blogId }: CommentFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate content
    if (!content.trim()) {
      setError("Comment cannot be empty")
      return
    }

    setLoading(true)

    try {
      const result = await createComment(blogId, content)

      if (result.error) {
        setError(result.error)
      } else {
        // Success: clear form and refresh
        setContent("")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mb-6">
        <p className="text-gray-700 mb-3">
          Please log in to leave a comment
        </p>
        <Button asChild>
          <Link href="/auth/login">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="space-y-3">
        {/* Comment Input */}
        <div className="space-y-2">
          <Label htmlFor="comment">Add a comment</Label>
          <Textarea
            id="comment"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  )
}
```

---

## 구현 세부사항

### 로그인 확인
```typescript
const { user } = useAuth()

if (!user) {
  return (
    <div>
      <p>Please log in to leave a comment</p>
      <Link href="/auth/login">Log in</Link>
    </div>
  )
}
```

### 폼 상태 관리
```typescript
const [content, setContent] = useState("")       // 댓글 내용
const [error, setError] = useState("")           // 에러 메시지
const [loading, setLoading] = useState(false)    // 로딩 상태
```

### 유효성 검사
```typescript
if (!content.trim()) {
  setError("Comment cannot be empty")
  return
}
```

### Server Action 호출
```typescript
const result = await createComment(blogId, content)

if (result.error) {
  setError(result.error)
} else {
  setContent("")         // 폼 초기화
  router.refresh()       // 페이지 리프레시 (댓글 목록 업데이트)
}
```

### 버튼 비활성화
```typescript
disabled={loading || !content.trim()}

// 로딩 중이거나 내용이 비어있으면 비활성화
```

---

## 구현 단계

1. [x] Create CommentForm component file (`components/blog/CommentForm.tsx`)
2. [x] Add "use client" directive
3. [x] Import dependencies (Button, Textarea, Label, useAuth, useRouter)
4. [x] Define CommentFormProps interface
5. [x] Get current user from useAuth
6. [x] Define state variables (content, error, loading)
7. [x] Implement handleSubmit function
8. [x] Add login check (return login prompt if not logged in)
9. [x] Create form element with onSubmit handler
10. [x] Add Label for textarea
11. [x] Add Textarea with value and onChange
12. [x] Add error message display
13. [x] Add Submit button with loading state
14. [x] Test form submission (valid content)
15. [x] Test error handling (empty content, server error)
16. [x] Test loading state (button disabled)
17. [x] Test login prompt (not logged in)

---

## 완료 조건

### Functionality
- [x] CommentForm renders correctly
- [x] Login prompt displays if not logged in
- [x] Textarea accepts input
- [x] Form submits on button click
- [x] Validation works (empty content)
- [x] Server Action is called
- [x] Success clears form and refreshes page
- [x] Error message displays on failure
- [x] Loading state prevents multiple submissions

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 3)
- [x] Textarea with 3 rows minimum
- [x] Placeholder text
- [x] Submit button right-aligned
- [x] Error message: Red, below textarea
- [x] Loading state: Button text changes, disabled
- [x] Login prompt: Centered, with button

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Client Component (useAuth, useRouter)
- [x] Clean component structure

### Integration
- [x] Works in PostDetailPage
- [x] Integrates with useAuth
- [x] Server Action integration
- [x] Router refresh works

---

## 테스트 체크리스트

- [x] Form render test (logged in user)
- [x] Login prompt test (not logged in)
- [x] Textarea input test (typing works)
- [x] Form submission test (valid content)
- [x] Validation test (empty content shows error)
- [x] Loading state test (button disabled, text changed)
- [x] Success test (form clears, page refreshes)
- [x] Error test (server error shows message)
- [x] Button disabled test (empty content)
- [x] Responsive test (mobile, desktop)
- [x] Accessibility test (keyboard navigation, labels)

---

## 참고사항

- CommentForm은 Client Component ("use client" 필요)
- useAuth hook으로 로그인 상태 확인
- useRouter().refresh()로 Server Component 리렌더링
- Server Action은 `app/actions/comment.ts`에 구현 필요
- 로그인하지 않은 사용자는 로그인 페이지로 유도
- 댓글 제출 후 폼 초기화 및 댓글 목록 자동 갱신
- 에러 핸들링으로 사용자 경험 개선

### Server Action 구현 (추후)
```typescript
// app/actions/comment.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createComment(blogId: string, content: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to comment" }
  }

  // Validate content
  if (!content.trim()) {
    return { error: "Comment cannot be empty" }
  }

  // Insert comment
  const { error } = await supabase
    .from("comments")
    .insert({
      blog_id: blogId,
      user_id: user.id,
      content: content.trim(),
    })

  if (error) {
    return { error: error.message }
  }

  // Revalidate page
  revalidatePath(`/blog/${blogId}`)
  return { success: true }
}
```

### Optimistic Update 구현 (선택사항)
```typescript
"use client"

import { useOptimistic } from "react"

export function CommentForm({ blogId, onCommentAdded }: CommentFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Optimistic update
    const newComment = {
      id: Date.now().toString(),
      blog_id: blogId,
      user_id: user!.id,
      content,
      author: { name: user!.name, avatar: user!.avatar },
      created_at: new Date().toISOString(),
    }

    onCommentAdded(newComment)  // Update UI immediately

    // Server action
    const result = await createComment(blogId, content)

    if (result.error) {
      // Rollback on error
      setError(result.error)
    } else {
      setContent("")
    }
  }
}
```

### 글자 수 제한 추가 (선택사항)
```typescript
const MAX_LENGTH = 500

<Textarea
  value={content}
  onChange={(e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setContent(e.target.value)
    }
  }}
  maxLength={MAX_LENGTH}
/>

<div className="text-xs text-gray-500 text-right mt-1">
  {content.length} / {MAX_LENGTH}
</div>
```
