# 글 작성/수정 구현 계획

## 개요

블로그 글 작성 및 수정 폼 구현
- 통합 폼 컴포넌트 (작성/수정 모두 사용)
- 제목 및 내용 입력 필드
- 유효성 검증 (Zod)
- Server Actions로 데이터 저장
- 권한 확인 (수정 시)

---

## Task List

### 0. 사전 준비
- [ ] shadcn/ui 컴포넌트 설치: `npx shadcn@latest add form textarea label`
- [ ] react-hook-form, zod, @hookform/resolvers 설치
- [ ] Server Actions 파일 생성 (`app/actions/blog.ts`)
- [ ] Supabase RLS 정책 확인

### 1. TitleInput 컴포넌트
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

### 2. ContentTextarea 컴포넌트
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

### 3. FormActions 컴포넌트
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

### 4. BlogForm 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogForm.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] react-hook-form 사용
- [ ] Zod 유효성 검증
- [ ] TitleInput, ContentTextarea, FormActions 통합
- [ ] 작성/수정 모드 지원 (initialData prop)
- [ ] Server Action 호출
- [ ] 성공 시 상세 페이지로 이동
- [ ] 에러 처리 (toast 또는 alert)

**의존성:**
- shadcn/ui: form
- react-hook-form
- zod, @hookform/resolvers
- TitleInput, ContentTextarea, FormActions
- app/actions/blog.ts: createBlog, updateBlog

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
import { createBlog, updateBlog } from "@/app/actions/blog"
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
      if (mode === "create") {
        const result = await createBlog(data)
        if (result.success) {
          router.push(`/blog/${result.data.id}`)
        } else {
          alert(result.error)
        }
      } else {
        const result = await updateBlog(initialData!.id, data)
        if (result.success) {
          router.push(`/blog/${result.data.id}`)
        } else {
          alert(result.error)
        }
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
- Server Action 호출 후 성공 시 상세 페이지 이동
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

### 5. Server Actions 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/actions/blog.ts`

**요구사항:**
- [ ] "use server" 지시어
- [ ] createBlog: 새 글 작성
- [ ] updateBlog: 글 수정
- [ ] deleteBlog: 글 삭제
- [ ] 권한 확인 (로그인, 작성자 확인)
- [ ] Supabase 연동
- [ ] 에러 처리

**의존성:**
- lib/supabase/server: createClient
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Blog } from "@/types/blog"

interface BlogInput {
  title: string
  content: string
}

interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

export async function createBlog(input: BlogInput): Promise<ActionResult<Blog>> {
  try {
    const supabase = await createClient()

    // 로그인 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to create a post" }
    }

    // 사용자 프로필 가져오기
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .single()

    const authorName = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : user.email?.split("@")[0] || "Anonymous"

    // 블로그 생성
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title: input.title,
        content: input.content,
        author_id: user.id,
        author_name: authorName
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating blog:", error)
      return { success: false, error: "Failed to create post" }
    }

    revalidatePath("/")
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateBlog(
  id: string,
  input: BlogInput
): Promise<ActionResult<Blog>> {
  try {
    const supabase = await createClient()

    // 로그인 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to update a post" }
    }

    // 권한 확인
    const { data: blog } = await supabase
      .from("blogs")
      .select("author_id")
      .eq("id", id)
      .single()

    if (!blog || blog.author_id !== user.id) {
      return { success: false, error: "You don't have permission to update this post" }
    }

    // 블로그 수정
    const { data, error } = await supabase
      .from("blogs")
      .update({
        title: input.title,
        content: input.content,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating blog:", error)
      return { success: false, error: "Failed to update post" }
    }

    revalidatePath("/")
    revalidatePath(`/blog/${id}`)
    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    // 로그인 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "You must be logged in to delete a post" }
    }

    // 권한 확인
    const { data: blog } = await supabase
      .from("blogs")
      .select("author_id")
      .eq("id", id)
      .single()

    if (!blog || blog.author_id !== user.id) {
      return { success: false, error: "You don't have permission to delete this post" }
    }

    // 블로그 삭제
    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting blog:", error)
      return { success: false, error: "Failed to delete post" }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
```

**구현 세부사항:**
- "use server" 지시어로 Server Actions 선언
- ActionResult 인터페이스로 통일된 반환 타입
- createBlog: 로그인 확인 → 프로필 조회 → 블로그 생성
- updateBlog: 로그인 확인 → 권한 확인 → 블로그 수정
- deleteBlog: 로그인 확인 → 권한 확인 → 블로그 삭제
- revalidatePath로 캐시 무효화
- 모든 함수에서 try-catch로 에러 처리

**완료 조건:**
- [ ] createBlog 동작 확인
- [ ] updateBlog 동작 확인
- [ ] deleteBlog 동작 확인
- [ ] 권한 확인 동작 확인
- [ ] 에러 처리 확인

---

### 6. NewPostPage 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/new/page.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 로그인 확인 (미들웨어에서 처리 또는 리다이렉트)
- [ ] BlogForm 컴포넌트 렌더링 (mode="create")
- [ ] 중앙 정렬 컨테이너 (max-w-3xl)
- [ ] 페이지 제목 "Create New Post"

**의존성:**
- BlogForm 컴포넌트
- lib/supabase/server: createClient
- next/navigation: redirect

**기본 구조:**
```typescript
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogForm } from "@/components/blog/BlogForm"

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/blog/new")
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <BlogForm mode="create" />
    </div>
  )
}
```

**구현 세부사항:**
- Server Component에서 로그인 확인
- 미로그인 시 로그인 페이지로 리다이렉트 (redirect 파라미터 포함)
- max-w-3xl로 폼 너비 제한, mx-auto로 중앙 정렬
- BlogForm에 mode="create" 전달

**완료 조건:**
- [ ] 로그인 확인 동작 확인
- [ ] 폼 렌더링 확인
- [ ] 레이아웃 확인

---

### 7. EditPostPage 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/edit/page.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 로그인 및 권한 확인
- [ ] Supabase에서 블로그 데이터 페칭
- [ ] BlogForm 컴포넌트 렌더링 (mode="edit", initialData)
- [ ] 중앙 정렬 컨테이너 (max-w-3xl)
- [ ] 페이지 제목 "Edit Post"
- [ ] 권한 없음 시 403 또는 리다이렉트

**의존성:**
- BlogForm 컴포넌트
- lib/supabase/server: createClient
- next/navigation: redirect, notFound
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogForm } from "@/components/blog/BlogForm"
import type { Blog } from "@/types/blog"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 로그인 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/auth/login?redirect=/blog/${id}/edit`)
  }

  // 블로그 데이터 가져오기
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !blog) {
    notFound()
  }

  // 권한 확인
  if (blog.author_id !== user.id) {
    redirect(`/blog/${id}`)
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
- params를 await로 받아 id 추출
- 로그인 확인 → 블로그 데이터 페칭 → 권한 확인 순서
- 블로그 없음 시 notFound() 호출 (404 페이지)
- 권한 없음 시 상세 페이지로 리다이렉트
- BlogForm에 mode="edit", initialData 전달

**완료 조건:**
- [ ] 로그인 확인 동작 확인
- [ ] 권한 확인 동작 확인
- [ ] 블로그 데이터 로딩 확인
- [ ] 폼 초기값 설정 확인
- [ ] 레이아웃 확인

---

## 구현 순서

1. **shadcn/ui 설치**: form, textarea, label 컴포넌트
2. **npm 패키지 설치**: react-hook-form, zod, @hookform/resolvers
3. **기본 입력 컴포넌트**: TitleInput, ContentTextarea
4. **액션 컴포넌트**: FormActions
5. **Server Actions**: `app/actions/blog.ts` 구현
6. **통합 폼**: BlogForm 컴포넌트
7. **페이지 구현**: NewPostPage, EditPostPage

---

## 검증 체크리스트

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
- [ ] 제출 시 Server Action 호출 확인
- [ ] 성공 시 페이지 이동 확인
- [ ] 에러 처리 확인

### Server Actions
- [ ] createBlog 동작 확인
- [ ] updateBlog 동작 확인
- [ ] deleteBlog 동작 확인
- [ ] 권한 확인 동작 확인
- [ ] revalidatePath 동작 확인

### NewPostPage
- [ ] 로그인 확인 동작 확인
- [ ] 폼 렌더링 확인
- [ ] 글 작성 완료 확인

### EditPostPage
- [ ] 로그인 확인 동작 확인
- [ ] 권한 확인 동작 확인
- [ ] 초기값 설정 확인
- [ ] 글 수정 완료 확인

---

## 참고사항

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

### Supabase RLS 정책
```sql
-- blogs 테이블 RLS 정책
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read blogs"
ON blogs FOR SELECT
TO authenticated, anon
USING (true);

-- 로그인한 사용자만 생성 가능
CREATE POLICY "Authenticated users can create blogs"
ON blogs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- 작성자만 수정 가능
CREATE POLICY "Authors can update their blogs"
ON blogs FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- 작성자만 삭제 가능
CREATE POLICY "Authors can delete their blogs"
ON blogs FOR DELETE
TO authenticated
USING (auth.uid() = author_id);
```

### 에러 처리 개선 (toast 사용)
```typescript
// 추후 shadcn/ui toast 컴포넌트 사용
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
  description: result.error,
  variant: "destructive",
})
```

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
- Server Actions에서 불필요한 쿼리 최소화
- revalidatePath로 필요한 경로만 무효화
