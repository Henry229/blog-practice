# EditPostPage

## 개요
**Phase**: Phase 7 - 블로그 수정 페이지
**파일 경로**: `app/blog/[id]/edit/page.tsx`
**UI 참조**: `blog-practice.pdf` - Page 4 (Edit Post)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 기존 블로그 글을 수정하는 페이지
**타입**: Page Component (Protected Route, Dynamic Route)
**위치**: `/blog/[id]/edit` 라우트

---

## 요구사항

### 기능 요구사항
- [ ] Dynamic route parameter로 블로그 ID 받기
- [ ] 로그인 확인 (비로그인 시 로그인 페이지로 리디렉션)
- [ ] 작성자 확인 (작성자가 아니면 접근 불가)
- [ ] 블로그 데이터 로드 (ID 기반)
- [ ] BlogForm 컴포넌트에 초기 데이터 전달
- [ ] 수정 후 상세 페이지로 이동
- [ ] 존재하지 않는 ID인 경우 404 처리

### UI 요구사항 (blog-practice.pdf - Page 4)
- [ ] 중앙 정렬 컨테이너 (최대 너비 800px)
- [ ] 페이지 제목 "Edit Post"
- [ ] BlogForm 컴포넌트 포함 (초기 데이터 포함)
- [ ] 충분한 여백 (py-8)

### 접근성 요구사항
- [ ] `<main>` 시맨틱 태그 사용
- [ ] `<h1>` 태그로 페이지 제목
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
# No specific shadcn/ui components needed (handled by BlogForm)
```

### 내부 의존성
- Layout: `PageContainer` from `@/components/layout`
- Layout: `CenteredContainer` from `@/components/layout`
- Component: `BlogForm` from `@/components/blog/BlogForm`
- Mock Data: `getMockBlogById` from `@/lib/data/mockBlogs`
- Types: `Blog` from `@/types/blog.ts`
- Supabase: `createClient` from `@/lib/supabase/server`
- Next.js: `notFound`, `redirect` from `next/navigation`

---

## 기본 구조

```typescript
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageContainer } from "@/components/layout/PageContainer"
import { CenteredContainer } from "@/components/layout/CenteredContainer"
import { BlogForm } from "@/components/blog/BlogForm"
import { getMockBlogById } from "@/lib/data/mockBlogs"

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = params

  // Check authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect if not logged in
  if (!user) {
    redirect(`/auth/login?redirect=/blog/${id}/edit`)
  }

  // Get blog data
  const blog = getMockBlogById(id)

  // If blog not found, show 404
  if (!blog) {
    notFound()
  }

  // Check if current user is the author
  if (blog.author_id !== user.id) {
    redirect(`/blog/${id}`)  // Redirect to detail page (not author)
  }

  return (
    <PageContainer className="py-8">
      <CenteredContainer>
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p className="text-gray-600 mt-2">
              Update your blog post
            </p>
          </div>

          {/* Blog Form */}
          <BlogForm
            mode="edit"
            initialData={{
              id: blog.id,
              title: blog.title,
              content: blog.content,
            }}
          />
        </div>
      </CenteredContainer>
    </PageContainer>
  )
}
```

---

## 구현 세부사항

### Dynamic Route Parameter
```typescript
interface EditPostPageProps {
  params: {
    id: string  // URL에서 자동으로 추출
  }
}

// 사용 예:
// /blog/123/edit → params.id = "123"
```

### 인증 확인
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect(`/auth/login?redirect=/blog/${id}/edit`)
}
```

### 블로그 데이터 로드
```typescript
const blog = getMockBlogById(id)

if (!blog) {
  notFound()  // 404 페이지
}
```

### 작성자 확인
```typescript
if (blog.author_id !== user.id) {
  redirect(`/blog/${id}`)  // 작성자가 아니면 상세 페이지로
}
```

### BlogForm Props
```typescript
<BlogForm
  mode="edit"
  initialData={{
    id: blog.id,
    title: blog.title,
    content: blog.content,
  }}
/>
```

---

## 구현 단계

1. [x] Create EditPostPage file (`app/blog/[id]/edit/page.tsx`)
2. [x] Import PageContainer, CenteredContainer
3. [x] Import BlogForm component
4. [x] Import createClient from Supabase
5. [x] Import getMockBlogById
6. [x] Import notFound, redirect from Next.js
7. [x] Define EditPostPageProps interface
8. [x] Make page async (for server auth and data loading)
9. [x] Get blog ID from params
10. [x] Check authentication (redirect if not logged in)
11. [x] Load blog data
12. [x] Add 404 handling (if blog not found)
13. [x] Check if user is author (redirect if not)
14. [x] Render PageContainer with py-8
15. [x] Render CenteredContainer
16. [x] Add page title and description
17. [x] Render BlogForm with mode="edit" and initialData
18. [x] Test page access (author)
19. [x] Test redirect (not logged in)
20. [x] Test redirect (not author)
21. [x] Test 404 (invalid blog ID)
22. [x] Test BlogForm integration

---

## 완료 조건

### Functionality
- [x] EditPostPage renders at `/blog/[id]/edit`
- [x] Redirects to login if not authenticated
- [x] Redirects to detail page if not author
- [x] 404 page displays for invalid IDs
- [x] Blog data loads correctly
- [x] BlogForm displays with initial data
- [x] Form submission updates blog
- [x] Success redirects to updated post detail page

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 4)
- [x] Maximum width 800px (CenteredContainer)
- [x] Page title "Edit Post"
- [x] Description text below title
- [x] BlogForm displays with existing data
- [x] Responsive on all breakpoints

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Follows Next.js 15 App Router conventions
- [x] Server Component (async, auth check, data loading)
- [x] Clean code structure

### Integration
- [x] Integrates with PageContainer and CenteredContainer
- [x] Uses BlogForm component
- [x] Supabase auth check works
- [x] Author verification works
- [x] Protected route (auth + ownership required)

---

## 테스트 체크리스트

- [x] Page load test (author, valid blog ID)
- [x] Redirect test (not logged in → login page)
- [x] Redirect test (not author → detail page)
- [x] 404 test (invalid blog ID)
- [x] BlogForm display test (initial data populated)
- [x] Form submission test (updates blog)
- [x] Success redirect test (to updated post detail)
- [x] Cancel button test (back to detail page)
- [x] Responsive test (mobile, tablet, desktop)
- [x] Accessibility test (keyboard navigation, screen reader)

---

## 참고사항

- EditPostPage는 Server Component (auth check + data loading on server)
- Protected Route: 로그인하지 않았거나 작성자가 아니면 접근 불가
- Dynamic Route: `[id]/edit` 폴더 구조로 구현
- params는 Next.js 15 App Router에서 자동 제공
- redirect()는 Server Component에서만 사용 가능
- BlogForm은 Client Component (상태 관리 필요)
- 폼 제출 로직은 BlogForm 컴포넌트에서 처리
- 성공 시 router.push(`/blog/${id}`)로 상세 페이지 이동
- author_id 필드가 Blog 타입에 필요

### Metadata 설정 (선택사항)
```typescript
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  const blog = getMockBlogById(params.id)

  return {
    title: blog ? `Edit: ${blog.title}` : "Edit Post",
    description: "Edit your blog post",
  }
}
```

### Supabase 연동 시 (추후)
```typescript
// Mock 데이터 대신 Supabase 쿼리 사용
const { data: blog } = await supabase
  .from("blogs")
  .select("*")
  .eq("id", id)
  .single()

if (!blog) {
  notFound()
}

// 작성자 확인
if (blog.author_id !== user.id) {
  redirect(`/blog/${id}`)
}
```

### 삭제 확인 기능 추가 (선택사항)
```typescript
// EditPostPage에 삭제 버튼 추가
import { Button } from "@/components/ui/button"
import { deleteBlog } from "@/app/actions/blog"

<div className="flex items-center justify-between">
  <h1>Edit Post</h1>
  <form action={deleteBlog}>
    <input type="hidden" name="blogId" value={blog.id} />
    <Button variant="destructive" size="sm">
      Delete Post
    </Button>
  </form>
</div>
```

### 수정 이력 추적 (선택사항)
```typescript
// Database에 updated_at 필드 자동 업데이트
// Supabase에서 trigger 설정 가능

// 또는 Server Action에서 수동 업데이트
const { error } = await supabase
  .from("blogs")
  .update({
    title,
    content,
    updated_at: new Date().toISOString(),
  })
  .eq("id", blogId)
```
