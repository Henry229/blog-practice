# 블로그 페이지 컴포넌트 구현 계획

## 개요

SimpleBlog MVP의 핵심 블로그 페이지 4개 구현
- 홈페이지: 블로그 글 목록 표시 및 검색
- 새 글 작성: 로그인한 사용자가 새 글 작성
- 글 상세: 개별 블로그 글 전체 내용 및 댓글
- 글 수정: 작성자가 자신의 글 수정

**기술 스택:**
- Next.js 16 App Router
- Supabase (데이터 저장 및 인증)
- Server Components (기본)
- Client Components (상호작용 필요 시)
- Server Actions (데이터 변경)

---

## Task List

### 0. 사전 준비
- [ ] Supabase blogs 테이블 생성 및 마이그레이션
- [ ] 타입 정의 파일 생성 (`types/blog.ts`)
- [ ] Server Actions 파일 생성 (`app/actions/blog.ts`)
- [ ] 필요한 shadcn/ui 컴포넌트 설치
- [ ] 유틸리티 함수 생성 (`lib/utils/text.ts`)
- [ ] 하위 컴포넌트 구현 완료 확인 (BlogCard, BlogGrid, BlogForm 등)

---

### 1. HomePage - 블로그 목록 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/page.tsx`
**라우트:** `/`

**요구사항:**
- [ ] Server Component로 구현
- [ ] Supabase에서 블로그 데이터 페칭 (최신순 정렬)
- [ ] 검색 기능 (URL 쿼리 파라미터 `?q=검색어`)
- [ ] 페이지네이션 (URL 쿼리 파라미터 `?page=2`, 선택사항)
- [ ] SearchBar 컴포넌트 포함 (Client Component)
- [ ] BlogGrid 컴포넌트로 카드 목록 표시
- [ ] EmptyState 처리 (글이 없을 때)
- [ ] 페이지 제목 "Latest Posts"
- [ ] 반응형 레이아웃 (max-w-7xl, mx-auto, px-4, py-8)
- [ ] 로딩 상태 처리 (loading.tsx)
- [ ] 에러 처리 (error.tsx)

**의존성:**
- `@/components/blog/BlogGrid` - 블로그 카드 그리드 레이아웃
- `@/components/blog/SearchBarClient` - 검색 바 (Client Component)
- `@/components/blog/Pagination` - 페이지네이션 (선택사항)
- `@/lib/supabase/server` - Supabase 서버 클라이언트
- `@/types/blog` - Blog 타입 정의

**기본 구조:**
```typescript
import { createClient } from "@/lib/supabase/server"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { SearchBarClient } from "@/components/blog/SearchBarClient"
import type { Blog } from "@/types/blog"

interface HomePageProps {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const query = params.q || ""
  const page = parseInt(params.page || "1")
  const pageSize = 9 // 3x3 그리드

  const supabase = await createClient()

  // 블로그 데이터 페칭
  let blogsQuery = supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  // 검색 필터링
  if (query) {
    blogsQuery = blogsQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  // 페이지네이션 (선택사항)
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  blogsQuery = blogsQuery.range(start, end)

  const { data: blogs, error } = await blogsQuery

  if (error) {
    console.error("Error fetching blogs:", error)
    return <div>Error loading blogs</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>

      {/* 검색 바 */}
      <div className="mb-8">
        <SearchBarClient />
      </div>

      {/* 블로그 그리드 */}
      <BlogGrid blogs={blogs || []} />

      {/* 페이지네이션 - 선택사항 */}
      {/* <Pagination currentPage={page} totalPages={totalPages} /> */}
    </div>
  )
}
```

**구현 세부사항:**
1. **데이터 페칭:**
   - Supabase `blogs` 테이블에서 모든 컬럼 조회
   - `created_at` 기준 내림차순 정렬 (최신 글이 먼저)
   - 검색어가 있으면 `title` 또는 `content`에서 검색 (대소문자 무시)

2. **검색 기능:**
   - `searchParams.q`로 검색어 받기
   - `ilike` 연산자로 부분 일치 검색
   - SearchBarClient는 Client Component로 URL 업데이트 처리

3. **페이지네이션 (선택사항):**
   - `searchParams.page`로 현재 페이지 받기
   - `range(start, end)`로 페이지네이션 구현
   - 기본 페이지 크기: 9개 (3x3 그리드)

4. **에러 처리:**
   - Supabase 쿼리 에러 시 에러 메시지 표시
   - 추후 error.tsx로 개선 가능

5. **레이아웃:**
   - `max-w-7xl`로 최대 너비 제한
   - `mx-auto`로 중앙 정렬
   - `px-4 py-8`로 여백 추가

**완료 조건:**
- [ ] 블로그 목록이 최신순으로 표시됨
- [ ] 검색 기능이 정상 작동함 (URL 업데이트 포함)
- [ ] 빈 상태가 올바르게 표시됨
- [ ] 반응형 그리드가 정상 작동함 (모바일 1열, 태블릿 2열, 데스크톱 3열)
- [ ] 페이지네이션이 작동함 (선택사항)
- [ ] 로딩 및 에러 상태가 처리됨

---

### 2. NewPostPage - 새 글 작성 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/new/page.tsx`
**라우트:** `/blog/new`

**요구사항:**
- [ ] Server Component로 구현
- [ ] 로그인 확인 (미들웨어 또는 페이지 내부)
- [ ] 미로그인 시 로그인 페이지로 리다이렉트
- [ ] BlogForm 컴포넌트 렌더링 (mode="create")
- [ ] 페이지 제목 "Create New Post"
- [ ] 중앙 정렬 컨테이너 (max-w-3xl)
- [ ] 폼 제출 시 Server Action 호출
- [ ] 성공 시 생성된 글 상세 페이지로 리다이렉트

**의존성:**
- `@/components/blog/BlogForm` - 통합 블로그 폼 (Client Component)
- `@/lib/supabase/server` - Supabase 서버 클라이언트
- `next/navigation` - redirect

**기본 구조:**
```typescript
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogForm } from "@/components/blog/BlogForm"

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 로그인 확인
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
1. **인증 확인:**
   - Server Component에서 `supabase.auth.getUser()` 호출
   - 사용자가 없으면 로그인 페이지로 리다이렉트
   - `redirect` 쿼리 파라미터로 로그인 후 원래 페이지로 돌아오기

2. **폼 렌더링:**
   - BlogForm 컴포넌트에 `mode="create"` 전달
   - BlogForm은 Client Component로 구현 (react-hook-form 사용)

3. **레이아웃:**
   - `max-w-3xl`로 폼 너비 제한 (가독성)
   - `mx-auto`로 중앙 정렬
   - `px-4 py-8`로 여백 추가

4. **데이터 흐름:**
   - BlogForm → Server Action (createBlog) → 성공 시 `/blog/[id]`로 리다이렉트

**완료 조건:**
- [ ] 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트됨
- [ ] 로그인한 사용자는 폼을 볼 수 있음
- [ ] 폼 제출 시 새 글이 생성됨
- [ ] 생성 성공 시 해당 글 상세 페이지로 이동함
- [ ] 유효성 검증 에러가 표시됨
- [ ] 제출 중 로딩 상태가 표시됨

---

### 3. PostDetailPage - 글 상세 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/page.tsx`
**라우트:** `/blog/[id]`

**요구사항:**
- [ ] Server Component로 구현
- [ ] Supabase에서 블로그 데이터 페칭 (ID 기반)
- [ ] BlogPost 컴포넌트 렌더링 (Header, Content, Actions)
- [ ] 댓글 섹션 포함 (CommentSection 컴포넌트)
- [ ] 404 처리 (블로그 없음 시 not-found.tsx)
- [ ] 동적 메타데이터 생성 (SEO)
- [ ] 수정/삭제 버튼 (작성자만 표시)
- [ ] 페이지 컨테이너 (max-w-7xl)

**의존성:**
- `@/components/blog/BlogPost` - 블로그 전체 컨텐츠
- `@/components/comments/CommentSection` - 댓글 섹션
- `@/lib/supabase/server` - Supabase 서버 클라이언트
- `@/types/blog` - Blog 타입 정의
- `next/navigation` - notFound

**기본 구조:**
```typescript
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogPost } from "@/components/blog/BlogPost"
import { CommentSection } from "@/components/comments/CommentSection"
import type { Metadata } from "next"
import type { Blog } from "@/types/blog"

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

// 동적 메타데이터 생성
export async function generateMetadata(
  { params }: PostDetailPageProps
): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: blog } = await supabase
    .from("blogs")
    .select("title, content, author_name, created_at")
    .eq("id", id)
    .single()

  if (!blog) {
    return {
      title: "Post Not Found"
    }
  }

  return {
    title: blog.title,
    description: blog.content.slice(0, 160),
    openGraph: {
      title: blog.title,
      description: blog.content.slice(0, 160),
      type: "article",
      publishedTime: blog.created_at,
      authors: [blog.author_name],
    },
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 블로그 데이터 페칭
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single()

  // 404 처리
  if (error || !blog) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 블로그 포스트 */}
      <BlogPost blog={blog} />

      {/* 댓글 섹션 */}
      <div className="mt-12 border-t pt-8">
        <CommentSection blogId={id} />
      </div>
    </div>
  )
}
```

**구현 세부사항:**
1. **데이터 페칭:**
   - URL params에서 블로그 ID 추출 (await params 필요)
   - Supabase에서 해당 ID의 블로그 조회
   - 블로그가 없으면 `notFound()` 호출 → `not-found.tsx` 렌더링

2. **메타데이터 생성:**
   - `generateMetadata` 함수로 동적 메타데이터
   - 제목, 설명, OpenGraph, Twitter Card 설정
   - SEO 최적화 및 소셜 미디어 공유

3. **컴포넌트 구성:**
   - BlogPost: 제목, 작성자, 날짜, 본문, 수정/삭제 버튼
   - CommentSection: 댓글 목록 및 작성 폼
   - 구분선(border-t)으로 섹션 구분

4. **권한 처리:**
   - BlogPost 내부에서 작성자 확인
   - 작성자만 수정/삭제 버튼 표시

5. **404 페이지:**
   - `app/blog/[id]/not-found.tsx` 생성
   - "Post not found" 메시지 및 홈으로 돌아가기 버튼

**완료 조건:**
- [ ] 블로그 데이터가 올바르게 표시됨
- [ ] 메타데이터가 올바르게 생성됨
- [ ] 존재하지 않는 ID는 404 페이지 표시
- [ ] 작성자만 수정/삭제 버튼을 볼 수 있음
- [ ] 댓글 섹션이 표시됨
- [ ] 줄바꿈이 유지됨 (whitespace-pre-wrap)
- [ ] 반응형 레이아웃이 작동함

---

### 4. EditPostPage - 글 수정 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/edit/page.tsx`
**라우트:** `/blog/[id]/edit`

**요구사항:**
- [ ] Server Component로 구현
- [ ] 로그인 확인 및 권한 확인 (작성자만)
- [ ] 미로그인 시 로그인 페이지로 리다이렉트
- [ ] 권한 없음 시 상세 페이지로 리다이렉트
- [ ] Supabase에서 블로그 데이터 페칭
- [ ] BlogForm 컴포넌트 렌더링 (mode="edit", initialData)
- [ ] 페이지 제목 "Edit Post"
- [ ] 중앙 정렬 컨테이너 (max-w-3xl)
- [ ] 폼 제출 시 Server Action 호출 (updateBlog)
- [ ] 성공 시 글 상세 페이지로 리다이렉트

**의존성:**
- `@/components/blog/BlogForm` - 통합 블로그 폼 (Client Component)
- `@/lib/supabase/server` - Supabase 서버 클라이언트
- `@/types/blog` - Blog 타입 정의
- `next/navigation` - redirect, notFound

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

  // 1. 로그인 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/auth/login?redirect=/blog/${id}/edit`)
  }

  // 2. 블로그 데이터 가져오기
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single()

  // 3. 블로그 존재 확인
  if (error || !blog) {
    notFound()
  }

  // 4. 권한 확인 (작성자만 수정 가능)
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
1. **인증 확인:**
   - `supabase.auth.getUser()`로 로그인 확인
   - 미로그인 시 로그인 페이지로 리다이렉트 (redirect 파라미터 포함)

2. **데이터 페칭:**
   - URL params에서 블로그 ID 추출
   - Supabase에서 해당 ID의 블로그 조회
   - 블로그가 없으면 `notFound()` 호출

3. **권한 확인:**
   - `blog.author_id`와 `user.id` 비교
   - 작성자가 아니면 상세 페이지로 리다이렉트 (403 대신)
   - RLS 정책과 이중 확인

4. **폼 렌더링:**
   - BlogForm에 `mode="edit"` 및 `initialData={blog}` 전달
   - BlogForm은 initialData로 기본값 설정 (defaultValues)

5. **데이터 흐름:**
   - BlogForm → Server Action (updateBlog) → 성공 시 `/blog/[id]`로 리다이렉트

**완료 조건:**
- [ ] 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트됨
- [ ] 작성자가 아닌 사용자는 상세 페이지로 리다이렉트됨
- [ ] 작성자는 수정 폼을 볼 수 있음
- [ ] 폼에 기존 데이터가 미리 채워져 있음
- [ ] 폼 제출 시 글이 수정됨
- [ ] 수정 성공 시 해당 글 상세 페이지로 이동함
- [ ] 유효성 검증 에러가 표시됨
- [ ] 제출 중 로딩 상태가 표시됨

---

## 구현 순서

### Phase 1: 데이터 및 인프라 (Day 1)
1. **Supabase 테이블 생성**
   - `blogs` 테이블 마이그레이션
   - RLS 정책 설정
2. **타입 정의**
   - `types/blog.ts` 생성 (Blog 인터페이스)
3. **Server Actions**
   - `app/actions/blog.ts` 생성
   - createBlog, updateBlog, deleteBlog 함수
4. **유틸리티 함수**
   - `lib/utils/text.ts` 생성
   - truncateText, formatDate, formatRelativeTime

### Phase 2: 하위 컴포넌트 (Day 2-3)
5. **기본 UI 컴포넌트**
   - shadcn/ui 설치 (card, input, button, form, textarea, alert-dialog)
6. **블로그 컴포넌트**
   - BlogCard, BlogGrid, EmptyState
   - SearchBar, SearchBarClient
   - Pagination (선택사항)
7. **폼 컴포넌트**
   - TitleInput, ContentTextarea, FormActions
   - BlogForm (통합 폼)
8. **상세 컴포넌트**
   - BlogHeader, BlogContent, BlogActions
   - DeleteConfirmDialog
   - BlogPost (통합)

### Phase 3: 페이지 구현 (Day 4)
9. **HomePage 구현**
   - `app/page.tsx`
   - 검색 및 페이지네이션 통합
10. **NewPostPage 구현**
    - `app/blog/new/page.tsx`
    - 인증 확인 및 폼 렌더링
11. **PostDetailPage 구현**
    - `app/blog/[id]/page.tsx`
    - 메타데이터 및 404 처리
12. **EditPostPage 구현**
    - `app/blog/[id]/edit/page.tsx`
    - 권한 확인 및 폼 렌더링

### Phase 4: 테스트 및 최적화 (Day 5)
13. **테스트**
    - 모든 페이지 기능 검증
    - 권한 확인 테스트
    - 에러 처리 테스트
14. **최적화**
    - loading.tsx 추가
    - error.tsx 추가
    - 반응형 디자인 검증
15. **문서화**
    - README 업데이트
    - 주석 추가

---

## 검증 체크리스트

### HomePage (`/`)
- [ ] 블로그 목록이 최신순으로 표시됨
- [ ] 검색 기능이 작동함 (제목 및 내용 검색)
- [ ] 검색어 입력 시 URL이 업데이트됨
- [ ] 검색어 삭제 시 전체 목록으로 돌아감
- [ ] 빈 상태가 올바르게 표시됨
- [ ] 반응형 그리드가 작동함 (1열 → 2열 → 3열)
- [ ] 페이지네이션이 작동함 (선택사항)
- [ ] 카드 클릭 시 상세 페이지로 이동함
- [ ] 로딩 상태가 표시됨 (loading.tsx)
- [ ] 에러 발생 시 에러 페이지가 표시됨

### NewPostPage (`/blog/new`)
- [ ] 미로그인 사용자는 로그인 페이지로 리다이렉트됨
- [ ] 로그인 후 원래 페이지로 돌아옴
- [ ] 로그인한 사용자는 폼을 볼 수 있음
- [ ] 제목 유효성 검증이 작동함 (필수, 최대 길이)
- [ ] 내용 유효성 검증이 작동함 (필수)
- [ ] 빈 제목 제출 시 에러 메시지 표시
- [ ] 제출 중 버튼이 비활성화됨
- [ ] 제출 중 "Saving..." 텍스트 표시
- [ ] 생성 성공 시 상세 페이지로 이동함
- [ ] 에러 발생 시 에러 메시지 표시
- [ ] 취소 버튼 클릭 시 이전 페이지로 이동

### PostDetailPage (`/blog/[id]`)
- [ ] 블로그 제목, 작성자, 날짜가 표시됨
- [ ] 블로그 본문이 표시됨
- [ ] 줄바꿈이 유지됨
- [ ] 작성자만 수정/삭제 버튼을 볼 수 있음
- [ ] 비작성자는 수정/삭제 버튼이 표시되지 않음
- [ ] 수정 버튼 클릭 시 수정 페이지로 이동함
- [ ] 삭제 버튼 클릭 시 확인 다이얼로그 표시
- [ ] 다이얼로그 취소 버튼 작동함
- [ ] 다이얼로그 삭제 버튼 작동함
- [ ] 삭제 성공 시 홈페이지로 이동함
- [ ] 댓글 섹션이 표시됨
- [ ] 존재하지 않는 ID는 404 페이지 표시
- [ ] 메타데이터가 올바르게 생성됨 (SEO)
- [ ] OpenGraph 태그가 올바르게 생성됨

### EditPostPage (`/blog/[id]/edit`)
- [ ] 미로그인 사용자는 로그인 페이지로 리다이렉트됨
- [ ] 작성자가 아닌 사용자는 상세 페이지로 리다이렉트됨
- [ ] 작성자는 수정 폼을 볼 수 있음
- [ ] 기존 제목이 미리 채워져 있음
- [ ] 기존 내용이 미리 채워져 있음
- [ ] 제목 유효성 검증이 작동함
- [ ] 내용 유효성 검증이 작동함
- [ ] 제출 중 버튼이 비활성화됨
- [ ] 제출 중 "Saving..." 텍스트 표시
- [ ] 수정 성공 시 상세 페이지로 이동함
- [ ] 에러 발생 시 에러 메시지 표시
- [ ] 취소 버튼 클릭 시 상세 페이지로 이동
- [ ] 존재하지 않는 ID는 404 페이지 표시

---

## 참고사항

### 타입 정의 (types/blog.ts)
```typescript
export interface Blog {
  id: string
  title: string
  content: string
  author_id: string
  author_name: string
  created_at: string
  updated_at: string
}

export interface BlogInput {
  title: string
  content: string
}

export interface BlogCardProps {
  blog: Blog
}
```

### Server Actions (app/actions/blog.ts)
```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Blog, BlogInput } from "@/types/blog"

interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

export async function createBlog(input: BlogInput): Promise<ActionResult<Blog>> {
  const supabase = await createClient()

  // 로그인 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "You must be logged in" }
  }

  // 프로필 조회
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
    return { success: false, error: "Failed to create post" }
  }

  revalidatePath("/")
  return { success: true, data }
}

export async function updateBlog(
  id: string,
  input: BlogInput
): Promise<ActionResult<Blog>> {
  const supabase = await createClient()

  // 로그인 및 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "You must be logged in" }
  }

  // 권한 확인
  const { data: blog } = await supabase
    .from("blogs")
    .select("author_id")
    .eq("id", id)
    .single()

  if (!blog || blog.author_id !== user.id) {
    return { success: false, error: "Permission denied" }
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
    return { success: false, error: "Failed to update post" }
  }

  revalidatePath("/")
  revalidatePath(`/blog/${id}`)
  return { success: true, data }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  // 로그인 및 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "You must be logged in" }
  }

  const { data: blog } = await supabase
    .from("blogs")
    .select("author_id")
    .eq("id", id)
    .single()

  if (!blog || blog.author_id !== user.id) {
    return { success: false, error: "Permission denied" }
  }

  // 블로그 삭제
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id)

  if (error) {
    return { success: false, error: "Failed to delete post" }
  }

  revalidatePath("/")
  return { success: true }
}
```

### Supabase 테이블 구조
```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX idx_blogs_author_id ON blogs(author_id);

-- RLS 정책
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

### 유틸리티 함수 (lib/utils/text.ts)
```typescript
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "just now"
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`

  return formatDate(dateString)
}
```

### 로딩 및 에러 페이지

**app/loading.tsx:**
```typescript
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}
```

**app/blog/[id]/not-found.tsx:**
```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <FileX className="h-16 w-16 text-gray-400 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-8">Post not found</p>
      <Link href="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  )
}
```

### 성능 최적화
- **Server Components**: 기본으로 사용하여 초기 로드 성능 향상
- **Suspense**: loading.tsx로 로딩 상태 처리
- **revalidatePath**: 필요한 경로만 캐시 무효화
- **인덱스**: created_at, author_id에 인덱스 추가
- **Full-Text Search**: 대량 데이터 시 Supabase Full-Text Search 사용

### SEO 최적화
- **generateMetadata**: 동적 메타데이터 생성
- **OpenGraph**: 소셜 미디어 공유 최적화
- **시맨틱 HTML**: article, header, section 태그 사용
- **구조화된 데이터**: JSON-LD 추가 (선택사항)

### 접근성
- **ARIA labels**: 버튼 및 입력 필드에 레이블 추가
- **키보드 네비게이션**: 모든 인터랙티브 요소 접근 가능
- **포커스 관리**: 다이얼로그 및 폼에서 포커스 관리
- **색상 대비**: WCAG AA 기준 준수
