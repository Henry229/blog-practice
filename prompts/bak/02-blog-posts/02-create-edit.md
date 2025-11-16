# 글 작성/수정 구현 계획

## 개요

블로그 글 작성 및 수정 폼 구현 (Mock Data 기반)
- 통합 폼 컴포넌트 (작성/수정 모두 사용)
- 제목 및 내용 입력 필드
- 유효성 검증 (Zod)
- Mock Data 조작으로 데이터 저장 (로컬 상태 관리)
- 권한 확인 (수정 시)

**참고**: 백엔드 연동(Supabase, Server Actions)은 추후 구현 예정. 현재는 프론트엔드 UI와 로컬 상태 관리만 구현합니다.

---

## Task List

### 0. 사전 준비
- [ ] shadcn/ui 컴포넌트 설치: `npx shadcn@latest add form textarea label button`
- [ ] react-hook-form, zod, @hookform/resolvers 설치
- [ ] Mock Data 함수 확장 (`lib/data/mockBlogs.ts`)
- [ ] 로컬 상태 관리 (Context API 또는 useState)

### 1. Mock Data 함수 확장
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/data/mockBlogs.ts`

**요구사항:**
- [ ] addMockBlog - 새 글 추가 함수
- [ ] updateMockBlog - 글 수정 함수
- [ ] deleteMockBlog - 글 삭제 함수
- [ ] 클라이언트 사이드에서 호출 가능하도록 설계

**의존성:**
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
// lib/data/mockBlogs.ts
import type { Blog } from "@/types/blog"

// 기존 mockBlogs 배열...

// 새 글 추가 (로컬 배열 조작)
export function addMockBlog(title: string, content: string, authorName: string): Blog {
  const newBlog: Blog = {
    id: String(mockBlogs.length + 1),
    title,
    content,
    author_id: "current_user", // 임시 사용자 ID
    author_name: authorName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  mockBlogs.unshift(newBlog) // 배열 앞에 추가
  return newBlog
}

// 글 수정
export function updateMockBlog(id: string, title: string, content: string): Blog | null {
  const index = mockBlogs.findIndex(blog => blog.id === id)
  if (index === -1) return null

  mockBlogs[index] = {
    ...mockBlogs[index],
    title,
    content,
    updated_at: new Date().toISOString()
  }

  return mockBlogs[index]
}

// 글 삭제
export function deleteMockBlog(id: string): boolean {
  const index = mockBlogs.findIndex(blog => blog.id === id)
  if (index === -1) return false

  mockBlogs.splice(index, 1)
  return true
}
```

**구현 세부사항:**
- 실제 앱에서는 배열 조작이 아닌 API 호출로 대체
- ID는 간단히 숫자 증가로 생성 (실제로는 UUID 사용)
- author_id는 임시로 "current_user" 사용
- unshift()로 새 글을 배열 맨 앞에 추가

**완료 조건:**
- [ ] 함수 3개 추가 완료
- [ ] export 확인
- [ ] 타입 안정성 확인

---

### 2. TitleInput 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/TitleInput.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Input 사용
- [ ] Label: "Title"
- [ ] placeholder: "Enter post title..."
- [ ] 필수 입력 (required)
- [ ] react-hook-form 통합
- [ ] 에러 메시지 표시

**의존성:**
- shadcn/ui: input, label, form
- react-hook-form

**기본 구조:**
```typescript
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"

interface TitleInputProps {
  form: UseFormReturn<any>
}

export function TitleInput({ form }: TitleInputProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter post title..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
```

**구현 세부사항:**
- FormField로 감싸서 react-hook-form과 통합
- FormMessage로 자동 에러 메시지 표시
- field를 Input에 스프레드하여 연결

**완료 조건:**
- [ ] 입력 필드 렌더링 확인
- [ ] 유효성 검증 에러 표시 확인
- [ ] form 상태와 동기화 확인

---

### 3. ContentTextarea 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/ContentTextarea.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Textarea 사용
- [ ] Label: "Content"
- [ ] placeholder: "Write your post content..."
- [ ] 최소 높이 300px
- [ ] 필수 입력 (required)
- [ ] react-hook-form 통합
- [ ] 에러 메시지 표시

**의존성:**
- shadcn/ui: textarea, label, form
- react-hook-form

**기본 구조:**
```typescript
"use client"

import { Textarea } from "@/components/ui/textarea"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"

interface ContentTextareaProps {
  form: UseFormReturn<any>
}

export function ContentTextarea({ form }: ContentTextareaProps) {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Write your post content..."
              className="min-h-[300px] resize-y"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
```

**구현 세부사항:**
- min-h-[300px]로 최소 높이 설정
- resize-y로 수직 리사이즈만 허용
- FormField로 감싸서 react-hook-form과 통합
- FormMessage로 자동 에러 메시지 표시

**완료 조건:**
- [ ] 최소 높이 300px 확인
- [ ] 유효성 검증 에러 표시 확인
- [ ] form 상태와 동기화 확인

---

### 4. FormActions 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/FormActions.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Button 사용
- [ ] 제출 버튼 (파란색, variant="default")
- [ ] 취소 버튼 (회색, variant="outline")
- [ ] 제출 중 로딩 상태 (버튼 비활성화, "Saving..." 텍스트)
- [ ] 버튼 간격 (gap-4)
- [ ] 우측 정렬 (justify-end)

**의존성:**
- shadcn/ui: button
- next/navigation: useRouter

**기본 구조:**
```typescript
"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface FormActionsProps {
  isSubmitting: boolean
  submitLabel?: string
  cancelLabel?: string
}

export function FormActions({
  isSubmitting,
  submitLabel = "Publish",
  cancelLabel = "Cancel"
}: FormActionsProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </div>
  )
}
```

**구현 세부사항:**
- flex items-center justify-end gap-4로 우측 정렬 및 간격
- 취소 버튼은 router.back()으로 이전 페이지 이동
- 제출 중일 때 모든 버튼 비활성화
- submitLabel로 "Publish" 또는 "Save Changes" 표시

**완료 조건:**
- [ ] 버튼 레이아웃 확인
- [ ] 로딩 상태 표시 확인
- [ ] 취소 버튼 동작 확인

---

### 5. BlogForm 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogForm.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] react-hook-form 사용
- [ ] Zod 유효성 검증
- [ ] TitleInput, ContentTextarea, FormActions 통합
- [ ] 작성/수정 모드 지원 (initialData prop)
- [ ] Mock Data 조작 함수 호출
- [ ] 성공 시 상세 페이지로 이동
- [ ] 에러 처리 (toast 또는 alert)

**의존성:**
- shadcn/ui: form
- react-hook-form
- zod, @hookform/resolvers
- TitleInput, ContentTextarea, FormActions
- lib/data/mockBlogs.ts: addMockBlog, updateMockBlog

**기본 구조:**
```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Form } from "@/components/ui/form"
import { TitleInput } from "./TitleInput"
import { ContentTextarea } from "./ContentTextarea"
import { FormActions } from "./FormActions"
import { addMockBlog, updateMockBlog } from "@/lib/data/mockBlogs"
import type { Blog } from "@/types/blog"

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Content is required")
})

type BlogFormData = z.infer<typeof blogSchema>

interface BlogFormProps {
  initialData?: Blog
  mode: "create" | "edit"
}

export function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter()

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || ""
    }
  })

  async function onSubmit(data: BlogFormData) {
    try {
      let blog: Blog | null

      if (mode === "create") {
        // Mock 데이터에 새 글 추가
        blog = addMockBlog(data.title, data.content, "John Doe")
      } else {
        // Mock 데이터 수정
        blog = updateMockBlog(initialData!.id, data.title, data.content)
      }

      if (blog) {
        // 성공 시 상세 페이지로 이동
        router.push(`/blog/${blog.id}`)
        router.refresh() // 페이지 새로고침
      } else {
        alert("Failed to save post")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TitleInput form={form} />
        <ContentTextarea form={form} />
        <FormActions
          isSubmitting={form.formState.isSubmitting}
          submitLabel={mode === "create" ? "Publish" : "Save Changes"}
        />
      </form>
    </Form>
  )
}
```

**구현 세부사항:**
- Zod 스키마로 유효성 검증 (title: 1-200자, content: 필수)
- defaultValues로 초기값 설정 (수정 모드)
- mode prop으로 작성/수정 모드 구분
- Mock Data 조작 함수 호출 후 성공 시 상세 페이지 이동
- router.refresh()로 페이지 새로고침 (Mock 데이터 반영)
- 에러 시 alert 표시 (추후 toast로 개선 가능)
- space-y-6으로 필드 간격

**완료 조건:**
- [ ] 폼 렌더링 확인
- [ ] 유효성 검증 동작 확인
- [ ] 작성 모드 동작 확인
- [ ] 수정 모드 동작 확인
- [ ] 성공 시 페이지 이동 확인
- [ ] 에러 처리 확인

---

### 6. NewPostPage 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/new/page.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] BlogForm 컴포넌트 렌더링 (mode="create")
- [ ] 중앙 정렬 컨테이너 (max-w-3xl)
- [ ] 페이지 제목 "Create New Post"

**참고**: 로그인 확인은 추후 Supabase 연동 시 추가

**의존성:**
- BlogForm 컴포넌트

**기본 구조:**
```typescript
"use client"

import { BlogForm } from "@/components/blog/BlogForm"

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <BlogForm mode="create" />
    </div>
  )
}
```

**구현 세부사항:**
- Client Component로 구현 (BlogForm이 Client Component이므로)
- max-w-3xl로 폼 너비 제한, mx-auto로 중앙 정렬
- BlogForm에 mode="create" 전달

**완료 조건:**
- [ ] 폼 렌더링 확인
- [ ] 레이아웃 확인

---

### 7. EditPostPage 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/edit/page.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] Mock 데이터에서 블로그 가져오기
- [ ] BlogForm 컴포넌트 렌더링 (mode="edit", initialData)
- [ ] 중앙 정렬 컨테이너 (max-w-3xl)
- [ ] 페이지 제목 "Edit Post"
- [ ] 블로그 없음 시 404 또는 에러 메시지

**의존성:**
- BlogForm 컴포넌트
- lib/data/mockBlogs.ts: getMockBlogById

**기본 구조:**
```typescript
"use client"

import { useParams } from "next/navigation"
import { BlogForm } from "@/components/blog/BlogForm"
import { getMockBlogById } from "@/lib/data/mockBlogs"

export default function EditPostPage() {
  const params = useParams()
  const id = params.id as string

  // Mock 데이터에서 블로그 가져오기
  const blog = getMockBlogById(id)

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-600">The post you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
      <BlogForm mode="edit" initialData={blog} />
    </div>
  )
}
```

**구현 세부사항:**
- useParams()로 id 추출
- getMockBlogById()로 블로그 데이터 가져오기
- 블로그 없음 시 에러 메시지 표시
- BlogForm에 mode="edit", initialData 전달

**완료 조건:**
- [ ] 블로그 데이터 로딩 확인
- [ ] 폼 초기값 설정 확인
- [ ] 404 처리 확인
- [ ] 레이아웃 확인

---

## 구현 순서

1. **Mock Data 함수 확장**: `lib/data/mockBlogs.ts`에 CRUD 함수 추가
2. **shadcn/ui 설치**: form, textarea, label 컴포넌트
3. **npm 패키지 설치**: react-hook-form, zod, @hookform/resolvers
4. **기본 입력 컴포넌트**: TitleInput, ContentTextarea
5. **액션 컴포넌트**: FormActions
6. **통합 폼**: BlogForm 컴포넌트
7. **페이지 구현**: NewPostPage, EditPostPage

---

## 검증 체크리스트

### Mock Data 함수
- [ ] addMockBlog 동작 확인
- [ ] updateMockBlog 동작 확인
- [ ] deleteMockBlog 동작 확인
- [ ] 배열 조작 확인

### TitleInput
- [ ] 입력 필드 렌더링 확인
- [ ] Label 표시 확인
- [ ] 유효성 검증 에러 표시 확인

### ContentTextarea
- [ ] 최소 높이 300px 확인
- [ ] Label 표시 확인
- [ ] 유효성 검증 에러 표시 확인

### FormActions
- [ ] 버튼 레이아웃 (우측 정렬) 확인
- [ ] 로딩 상태 표시 확인
- [ ] 취소 버튼 동작 확인

### BlogForm
- [ ] 작성 모드 동작 확인
- [ ] 수정 모드 동작 확인
- [ ] 유효성 검증 동작 확인
- [ ] 제출 시 Mock 데이터 조작 확인
- [ ] 성공 시 페이지 이동 확인
- [ ] 에러 처리 확인

### NewPostPage
- [ ] 폼 렌더링 확인
- [ ] 글 작성 완료 확인

### EditPostPage
- [ ] 초기값 설정 확인
- [ ] 글 수정 완료 확인
- [ ] 404 처리 확인

---

## 참고사항

### Mock Data 영속성 문제
```typescript
// 현재 구현은 페이지 새로고침 시 데이터가 사라짐
// 해결 방법 1: localStorage 사용
// 해결 방법 2: Context API로 전역 상태 관리
// 해결 방법 3: Zustand 같은 상태 관리 라이브러리 사용

// 예시: localStorage 사용
export function addMockBlog(title: string, content: string, authorName: string): Blog {
  const newBlog: Blog = { /* ... */ }
  mockBlogs.unshift(newBlog)

  // localStorage에 저장
  if (typeof window !== "undefined") {
    localStorage.setItem("mockBlogs", JSON.stringify(mockBlogs))
  }

  return newBlog
}

// 초기 로드 시 localStorage에서 복원
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("mockBlogs")
  if (saved) {
    mockBlogs.splice(0, mockBlogs.length, ...JSON.parse(saved))
  }
}
```

### Zod 스키마 확장
```typescript
const blogSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content is too long")
})
```

### 에러 처리 개선 (toast 사용)
```typescript
// shadcn/ui toast 컴포넌트 사용
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

// 성공 메시지
toast({
  title: "Success",
  description: "Your post has been published.",
})

// 에러 메시지
toast({
  title: "Error",
  description: "Failed to save post.",
  variant: "destructive",
})
```

### 백엔드 연동 준비
- Mock Data 함수는 추후 Server Actions로 교체
- `addMockBlog()` → `createBlog()` Server Action
- `updateMockBlog()` → `updateBlog()` Server Action
- `deleteMockBlog()` → `deleteBlog()` Server Action
- BlogForm은 그대로 유지, 데이터 소스만 변경

### 폼 상태 개선
- 제출 중 로딩 스피너 추가
- 제출 성공 시 toast 알림
- 제목 자동 저장 (localStorage)
- 내용 자동 저장 (draft 기능)

### 접근성 개선
- ARIA labels 추가
- 키보드 네비게이션 지원
- 포커스 관리
- 스크린 리더 지원

### 성능 최적화
- react-hook-form의 uncontrolled inputs 사용
- Zod 스키마 캐싱
- Mock Data 조작 시 불필요한 렌더링 최소화
