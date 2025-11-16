# NewPostPage

## 개요
**Phase**: Phase 6 - 블로그 작성 페이지
**파일 경로**: `app/blog/new/page.tsx`
**UI 참조**: `blog-practice.pdf` - Page 2 (New Post)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 새 블로그 글을 작성하는 페이지
**타입**: Page Component (Protected Route)
**위치**: `/blog/new` 라우트

---

## 요구사항

### 기능 요구사항
- [ ] 로그인 확인 (비로그인 시 로그인 페이지로 리디렉션)
- [ ] BlogForm 컴포넌트 렌더링
- [ ] 글 작성 후 상세 페이지로 이동
- [ ] 취소 버튼 (홈으로 이동)

### UI 요구사항 (blog-practice.pdf - Page 2)
- [ ] 중앙 정렬 컨테이너 (최대 너비 800px)
- [ ] 페이지 제목 "New Post"
- [ ] BlogForm 컴포넌트 포함
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
- Auth: Check user session (Server Component)
- Supabase: `createClient` from `@/lib/supabase/server`
- Next.js: `redirect` from `next/navigation`

---

## 기본 구조

```typescript
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageContainer } from "@/components/layout/PageContainer"
import { CenteredContainer } from "@/components/layout/CenteredContainer"
import { BlogForm } from "@/components/blog/BlogForm"

export default async function NewPostPage() {
  // Check authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect if not logged in
  if (!user) {
    redirect("/auth/login?redirect=/blog/new")
  }

  return (
    <PageContainer className="py-8">
      <CenteredContainer>
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-bold">New Post</h1>
            <p className="text-gray-600 mt-2">
              Share your thoughts with the community
            </p>
          </div>

          {/* Blog Form */}
          <BlogForm mode="create" />
        </div>
      </CenteredContainer>
    </PageContainer>
  )
}
```

---

## 구현 세부사항

### 인증 확인 (Server Component)
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect("/auth/login?redirect=/blog/new")
}

// ?redirect=/blog/new → 로그인 후 원래 페이지로 돌아오기
```

### 페이지 구조
```typescript
<PageContainer>
  <CenteredContainer>              // 최대 너비 800px
    <h1>New Post</h1>              // 페이지 제목
    <p>Description</p>             // 설명 텍스트
    <BlogForm mode="create" />     // 블로그 작성 폼
  </CenteredContainer>
</PageContainer>
```

### BlogForm Props
```typescript
interface BlogFormProps {
  mode: "create" | "edit"
  initialData?: {
    title: string
    content: string
  }
}

// NewPostPage에서는 mode="create"만 전달
```

---

## 구현 단계

1. [x] Create NewPostPage file (`app/blog/new/page.tsx`)
2. [x] Import PageContainer, CenteredContainer
3. [x] Import BlogForm component
4. [x] Import createClient from Supabase
5. [x] Import redirect from Next.js
6. [x] Make page async (for server auth check)
7. [x] Get user session from Supabase
8. [x] Add redirect if not logged in
9. [x] Render PageContainer with py-8
10. [x] Render CenteredContainer
11. [x] Add page title and description
12. [x] Render BlogForm with mode="create"
13. [x] Test page access (logged in)
14. [x] Test redirect (not logged in)
15. [x] Test BlogForm integration
16. [x] Test responsive design

---

## 완료 조건

### Functionality
- [x] NewPostPage renders at `/blog/new`
- [x] Redirects to login if not authenticated
- [x] BlogForm displays correctly
- [x] Form submission creates new post
- [x] Success redirects to new post detail page
- [x] Cancel button navigates back

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 2)
- [x] Maximum width 800px (CenteredContainer)
- [x] Page title "New Post"
- [x] Description text below title
- [x] BlogForm displays below description
- [x] Responsive on all breakpoints

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Follows Next.js 15 App Router conventions
- [x] Server Component (async, auth check)
- [x] Clean code structure

### Integration
- [x] Integrates with PageContainer and CenteredContainer
- [x] Uses BlogForm component
- [x] Supabase auth check works
- [x] Protected route (auth required)

---

## 테스트 체크리스트

- [x] Page load test (logged in user)
- [x] Redirect test (not logged in → login page)
- [x] BlogForm display test (renders correctly)
- [x] Form submission test (creates new post)
- [x] Success redirect test (to post detail page)
- [x] Cancel button test (back to home)
- [x] Responsive test (mobile, tablet, desktop)
- [x] Accessibility test (keyboard navigation, screen reader)

---

## 참고사항

- NewPostPage는 Server Component (auth check on server)
- Protected Route: 로그인하지 않은 사용자는 접근 불가
- redirect()는 Server Component에서만 사용 가능
- ?redirect 쿼리 파라미터로 로그인 후 원래 페이지로 복귀
- BlogForm은 Client Component (상태 관리 필요)
- 폼 제출 로직은 BlogForm 컴포넌트에서 처리
- 성공 시 router.push(`/blog/${newBlogId}`)로 상세 페이지 이동

### Metadata 설정 (선택사항)
```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Post | SimpleBlog",
  description: "Create a new blog post",
}
```

### 로그인 후 리디렉션 처리 (LoginPage)
```typescript
// app/auth/login/page.tsx
export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  const redirectTo = searchParams.redirect || "/"

  return (
    <LoginForm redirectTo={redirectTo} />
  )
}

// LoginForm에서 로그인 성공 시
router.push(redirectTo)
```

### 권한 체크 강화 (선택사항)
```typescript
// 특정 역할만 글 작성 가능하도록 제한
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("user_id", user.id)
  .single()

if (profile?.role !== "admin" && profile?.role !== "author") {
  redirect("/")  // 권한 없으면 홈으로
}
```

### 드래프트 기능 추가 (선택사항)
```typescript
// 글 저장 시 published: false로 저장
// 나중에 수정 페이지에서 published: true로 변경

<BlogForm
  mode="create"
  onSaveDraft={async (data) => {
    // 드래프트로 저장
  }}
  onPublish={async (data) => {
    // 발행
  }}
/>
```
