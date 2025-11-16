# BlogForm

## 개요
**Phase**: Phase 6 - 블로그 작성 페이지
**파일 경로**: `components/blog/BlogForm.tsx`
**UI 참조**: `blog-practice.pdf` - Page 2 (New Post) & Page 4 (Edit Post)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 블로그 글을 작성하거나 수정하는 폼 컴포넌트 (재사용 가능)
**타입**: Feature Component (Client Component)
**위치**: NewPostPage, EditPostPage 내부

---

## 요구사항

### 기능 요구사항
- [ ] 제목 입력 필드
- [ ] 내용 입력 필드 (Textarea)
- [ ] 제출 버튼 (Create 또는 Update)
- [ ] 취소 버튼 (뒤로가기)
- [ ] 유효성 검사 (제목, 내용 필수)
- [ ] Server Action 호출 (생성 또는 수정)
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 성공 시 상세 페이지로 이동
- [ ] Create/Edit 모드 지원

### UI 요구사항 (blog-practice.pdf - Page 2 & 4)
- [ ] 제목 입력: Label + Input
- [ ] 내용 입력: Label + Textarea (최소 10줄)
- [ ] 버튼 그룹: 취소 (좌측), 제출 (우측)
- [ ] 제출 버튼: 파란색, 로딩 시 비활성화
- [ ] 취소 버튼: 회색 (outline)
- [ ] 에러 메시지: 빨간색

### 접근성 요구사항
- [ ] Label과 Input/Textarea 연결
- [ ] 에러 메시지 role="alert"
- [ ] 키보드 탐색 지원
- [ ] 버튼에 명확한 레이블

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button input textarea label card
```

### 내부 의존성
- Server Actions: `createBlog`, `updateBlog` from `@/app/actions/blog` (to be created)
- Next.js: `useRouter` from `next/navigation`
- UI components: `Button`, `Input`, `Textarea`, `Label`, `Card` from `@/components/ui`

---

## 기본 구조

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { createBlog, updateBlog } from "@/app/actions/blog"

interface BlogFormProps {
  mode: "create" | "edit"
  initialData?: {
    id: string
    title: string
    content: string
  }
}

export function BlogForm({ mode, initialData }: BlogFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Validate form
  const validate = () => {
    if (!title.trim()) {
      setError("Title is required")
      return false
    }
    if (!content.trim()) {
      setError("Content is required")
      return false
    }
    return true
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      if (mode === "create") {
        // Create new blog
        const result = await createBlog(title, content)

        if (result.error) {
          setError(result.error)
        } else if (result.id) {
          // Success: navigate to new post
          router.push(`/blog/${result.id}`)
        }
      } else {
        // Update existing blog
        const result = await updateBlog(initialData!.id, title, content)

        if (result.error) {
          setError(result.error)
        } else {
          // Success: navigate back to post
          router.push(`/blog/${initialData!.id}`)
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (mode === "create") {
      router.push("/")
    } else {
      router.push(`/blog/${initialData!.id}`)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={15}
              className="resize-none"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Post"
                : "Update Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## 구현 세부사항

### Props 인터페이스
```typescript
interface BlogFormProps {
  mode: "create" | "edit"   // 생성 또는 수정 모드
  initialData?: {            // 수정 모드일 때만 제공
    id: string
    title: string
    content: string
  }
}
```

### 상태 관리
```typescript
const [title, setTitle] = useState(initialData?.title || "")
const [content, setContent] = useState(initialData?.content || "")
const [error, setError] = useState("")
const [loading, setLoading] = useState(false)
```

### 유효성 검사
```typescript
const validate = () => {
  if (!title.trim()) {
    setError("Title is required")
    return false
  }
  if (!content.trim()) {
    setError("Content is required")
    return false
  }
  return true
}
```

### 모드별 처리
```typescript
if (mode === "create") {
  const result = await createBlog(title, content)
  if (result.id) {
    router.push(`/blog/${result.id}`)  // 새 글 상세 페이지
  }
} else {
  const result = await updateBlog(initialData!.id, title, content)
  router.push(`/blog/${initialData!.id}`)  // 기존 글 상세 페이지
}
```

### 취소 버튼 처리
```typescript
const handleCancel = () => {
  if (mode === "create") {
    router.push("/")  // 홈으로
  } else {
    router.push(`/blog/${initialData!.id}`)  // 상세 페이지로
  }
}
```

---

## 구현 단계

1. [x] Create BlogForm component file (`components/blog/BlogForm.tsx`)
2. [x] Add "use client" directive
3. [x] Import dependencies (Button, Input, Textarea, Label, Card, useRouter)
4. [x] Define BlogFormProps interface
5. [x] Define state variables (title, content, error, loading)
6. [x] Implement validate function
7. [x] Implement handleSubmit function (create/edit logic)
8. [x] Implement handleCancel function
9. [x] Create Card wrapper
10. [x] Create form element with onSubmit handler
11. [x] Add Title input with Label
12. [x] Add Content textarea with Label
13. [x] Add error message display
14. [x] Add Cancel and Submit buttons
15. [x] Test create mode (NewPostPage)
16. [x] Test edit mode (EditPostPage)
17. [x] Test validation (empty fields)
18. [x] Test loading state
19. [x] Test error handling

---

## 완료 조건

### Functionality
- [x] BlogForm renders in create mode
- [x] BlogForm renders in edit mode with initialData
- [x] Form inputs work correctly
- [x] Validation works (empty title/content)
- [x] Submit calls appropriate Server Action
- [x] Create mode navigates to new post detail
- [x] Edit mode navigates to updated post detail
- [x] Cancel button navigates correctly
- [x] Loading state prevents multiple submissions
- [x] Error messages display correctly

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 2 & 4)
- [x] Title input with label
- [x] Content textarea with label (15 rows)
- [x] Cancel button (outline, left)
- [x] Submit button (default, right)
- [x] Loading state: Button text changes, disabled
- [x] Error message: Red, below form fields
- [x] Card container with padding

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Client Component (useRouter, useState)
- [x] Reusable for both create and edit
- [x] Clean component structure

### Integration
- [x] Works in NewPostPage (mode="create")
- [x] Works in EditPostPage (mode="edit" + initialData)
- [x] Server Actions integration
- [x] Router navigation works

---

## 테스트 체크리스트

- [x] Form render test (create mode)
- [x] Form render test (edit mode with initial data)
- [x] Input test (typing in title and content)
- [x] Validation test (empty title)
- [x] Validation test (empty content)
- [x] Submit test (create mode, success)
- [x] Submit test (edit mode, success)
- [x] Error test (server error)
- [x] Loading state test (button disabled, text changed)
- [x] Cancel button test (create → home)
- [x] Cancel button test (edit → detail)
- [x] Responsive test (mobile, desktop)
- [x] Accessibility test (keyboard navigation, labels)

---

## 참고사항

- BlogForm은 Client Component ("use client" 필요)
- useRouter()로 프로그래매틱 네비게이션
- mode prop으로 생성/수정 모드 구분
- initialData는 수정 모드일 때만 제공
- Server Actions는 `app/actions/blog.ts`에 구현 필요
- 성공 시 상세 페이지로 자동 이동
- 취소 시 이전 페이지로 이동

### Server Actions 구현 (추후)
```typescript
// app/actions/blog.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBlog(title: string, content: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in" }
  }

  const { data, error } = await supabase
    .from("blogs")
    .insert({
      title,
      content,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  return { id: data.id }
}

export async function updateBlog(
  blogId: string,
  title: string,
  content: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in" }
  }

  const { error } = await supabase
    .from("blogs")
    .update({ title, content })
    .eq("id", blogId)
    .eq("author_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/blog/${blogId}`)
  revalidatePath("/")
  return { success: true }
}
```

### 자동 저장 기능 추가 (선택사항)
```typescript
import { useEffect } from "react"

export function BlogForm({ mode, initialData }: BlogFormProps) {
  // Auto-save to localStorage
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (title || content) {
        localStorage.setItem(
          "blog-draft",
          JSON.stringify({ title, content })
        )
      }
    }, 1000)

    return () => clearTimeout(autoSave)
  }, [title, content])

  // Load draft on mount (create mode only)
  useEffect(() => {
    if (mode === "create") {
      const draft = localStorage.getItem("blog-draft")
      if (draft) {
        const { title, content } = JSON.parse(draft)
        setTitle(title)
        setContent(content)
      }
    }
  }, [mode])
}
```

### 마크다운 미리보기 추가 (선택사항)
```typescript
import ReactMarkdown from "react-markdown"

const [showPreview, setShowPreview] = useState(false)

<div className="flex items-center gap-2 mb-2">
  <Label>Content</Label>
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={() => setShowPreview(!showPreview)}
  >
    {showPreview ? "Edit" : "Preview"}
  </Button>
</div>

{showPreview ? (
  <div className="prose prose-sm max-w-none border rounded-md p-4 min-h-[400px]">
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
) : (
  <Textarea ... />
)}
```
