# 블로그 페이지 컴포넌트 구현 계획

## 개요

SimpleBlog MVP의 핵심 블로그 페이지 4개 구현 (Phase 1: Mock Data 기반)
- 홈페이지: 블로그 글 목록 표시 및 검색
- 새 글 작성: 로그인한 사용자가 새 글 작성
- 글 상세: 개별 블로그 글 전체 내용 및 댓글
- 글 수정: 작성자가 자신의 글 수정

**현재 단계 (Phase 1):**
- Mock Data 기반 UI 구현
- `lib/data/mockBlogs.ts`의 CRUD 함수 사용
- Mock 사용자: "John Doe"로 모든 작업 가능
- camelCase 데이터 모델 사용 (blogId, createdAt, authorName)

**추후 단계 (Phase 2):**
- Supabase 연동은 백엔드 구현 단계에서 진행
- Mock 함수 → Server Actions로 교체
- 실제 인증 및 권한 체크 추가

**기술 스택:**
- Next.js 15 App Router
- TypeScript
- Mock Data (메모리 기반)
- Client Components (상호작용 필요 시)
- shadcn/ui 컴포넌트

---

## Task List

### 0. 사전 준비
- [ ] Mock Data 파일 생성 (`lib/data/mockBlogs.ts`)
- [ ] 타입 정의 파일 생성 (`types/blog.ts`)
- [ ] 유틸리티 함수 생성 (`lib/utils/text.ts`, `lib/utils/date.ts`)
- [ ] 필요한 shadcn/ui 컴포넌트 설치
- [ ] 하위 컴포넌트 구현 완료 확인 (BlogCard, BlogGrid, BlogForm 등)

---

### 1. HomePage - 블로그 목록 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/page.tsx`
**라우트:** `/`

**요구사항:**
- [ ] Client Component로 구현 ("use client")
- [ ] Mock Data에서 블로그 데이터 로드 (`getMockBlogs()`)
- [ ] 검색 기능 (클라이언트 측 필터링)
- [ ] 페이지네이션 (클라이언트 측, 선택사항)
- [ ] SearchBar 컴포넌트 포함
- [ ] BlogGrid 컴포넌트로 카드 목록 표시
- [ ] EmptyState 처리 (글이 없을 때)
- [ ] 페이지 제목 "Latest Posts"
- [ ] 반응형 레이아웃 (max-w-7xl, mx-auto, px-4, py-8)
- [ ] 로딩 상태 처리 (useState)

**의존성:**
- `@/components/blog/BlogGrid` - 블로그 카드 그리드 레이아웃
- `@/components/blog/SearchBar` - 검색 바
- `@/components/blog/EmptyState` - 빈 상태 표시
- `@/lib/data/mockBlogs` - Mock 블로그 데이터
- `@/types/blog` - Blog 타입 정의

**기본 구조:**
```typescript
"use client"

import { useState, useEffect } from "react"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { SearchBar } from "@/components/blog/SearchBar"
import { EmptyState } from "@/components/blog/EmptyState"
import { getMockBlogs, searchMockBlogs } from "@/lib/data/mockBlogs"
import type { Blog } from "@/types/blog"

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock Data 로드
    const loadBlogs = async () => {
      setIsLoading(true)
      // 실제로는 동기 함수지만 비동기 패턴 유지 (추후 Server Action 전환 용이)
      const data = getMockBlogs()
      setBlogs(data)
      setIsLoading(false)
    }

    loadBlogs()
  }, [])

  // 검색 처리
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchMockBlogs(query)
      setBlogs(results)
    } else {
      setBlogs(getMockBlogs())
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Latest Posts</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {blogs.length === 0 ? (
        <EmptyState
          title="No posts found"
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Be the first to create a post!"
          }
        />
      ) : (
        <BlogGrid blogs={blogs} />
      )}
    </div>
  )
}
```

**완료 조건:**
- [ ] 블로그 목록 정상 표시
- [ ] 검색 기능 작동
- [ ] 빈 상태 처리 확인
- [ ] 반응형 레이아웃 테스트
- [ ] 로딩 상태 표시 확인

---

### 2. NewPostPage - 새 글 작성 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/new/page.tsx`
**라우트:** `/blog/new`

**요구사항:**
- [ ] Client Component로 구현 ("use client")
- [ ] CenteredContainer 레이아웃 사용
- [ ] BlogForm 컴포넌트 사용 (제목, 내용 입력)
- [ ] Mock 사용자 "John Doe"로 글 작성
- [ ] `addMockBlog()` 함수로 글 추가
- [ ] 작성 완료 후 홈페이지로 리다이렉트
- [ ] 취소 시 홈페이지로 이동
- [ ] 페이지 제목 "Create New Post"
- [ ] 로딩 상태 처리 (제출 중)
- [ ] 에러 처리 (alert 사용, 추후 toast로 개선)

**의존성:**
- `@/components/blog/BlogForm` - 블로그 폼
- `@/components/layouts/CenteredContainer` - 중앙 정렬 컨테이너
- `@/lib/data/mockBlogs` - Mock 블로그 데이터
- `next/navigation` - useRouter

**기본 구조:**
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CenteredContainer } from "@/components/layouts/CenteredContainer"
import { BlogForm } from "@/components/blog/BlogForm"
import { addMockBlog } from "@/lib/data/mockBlogs"

export default function NewPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: { title: string; content: string }) => {
    setIsSubmitting(true)

    try {
      // Mock 사용자로 글 작성
      addMockBlog(data.title, data.content, "John Doe")

      // 홈페이지로 리다이렉트
      router.push("/")
    } catch (error) {
      console.error("Failed to create post:", error)
      alert("Failed to create post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <CenteredContainer maxWidth="lg">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <BlogForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitButtonText="Publish"
        />
      </div>
    </CenteredContainer>
  )
}
```

**완료 조건:**
- [ ] 폼 렌더링 정상
- [ ] 제목/내용 입력 가능
- [ ] 글 작성 완료 후 홈 이동
- [ ] 취소 버튼 작동
- [ ] 로딩 상태 표시
- [ ] 에러 처리 확인

---

### 3. PostDetailPage - 글 상세 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/page.tsx`
**라우트:** `/blog/[id]`

**요구사항:**
- [ ] Client Component로 구현 ("use client")
- [ ] URL 파라미터에서 블로그 ID 추출
- [ ] `getMockBlogById()` 함수로 블로그 데이터 로드
- [ ] BlogPost 컴포넌트로 글 내용 표시
- [ ] BlogActions 컴포넌트 표시 (수정/삭제 버튼, Mock 사용자만)
- [ ] 댓글 섹션 포함 (CommentList, CommentForm)
- [ ] 404 처리 (블로그 없을 때)
- [ ] 페이지 제목: 블로그 제목
- [ ] 반응형 레이아웃 (max-w-4xl, mx-auto)
- [ ] 로딩 상태 처리

**의존성:**
- `@/components/blog/BlogPost` - 블로그 글 표시
- `@/components/blog/BlogActions` - 수정/삭제 버튼
- `@/components/comments/CommentList` - 댓글 목록
- `@/components/comments/CommentForm` - 댓글 작성
- `@/lib/data/mockBlogs` - Mock 블로그 데이터
- `@/lib/data/mockComments` - Mock 댓글 데이터

**기본 구조:**
```typescript
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BlogPost } from "@/components/blog/BlogPost"
import { BlogActions } from "@/components/blog/BlogActions"
import { CommentList } from "@/components/comments/CommentList"
import { CommentForm } from "@/components/comments/CommentForm"
import { getMockBlogById } from "@/lib/data/mockBlogs"
import { getMockComments } from "@/lib/data/mockComments"
import type { Blog } from "@/types/blog"
import type { Comment } from "@/types/comment"

export default function PostDetailPage() {
  const params = useParams()
  const blogId = params.id as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      // 블로그 데이터 로드
      const blogData = getMockBlogById(blogId)
      setBlog(blogData)

      // 댓글 데이터 로드
      if (blogData) {
        const commentsData = getMockComments(blogId)
        setComments(commentsData)
      }

      setIsLoading(false)
    }

    loadData()
  }, [blogId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <LoadingSpinner />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button onClick={() => router.push("/")}>
            Go back home
          </Button>
        </div>
      </div>
    )
  }

  // Mock 사용자 확인 (Phase 1에서는 모든 글을 "John Doe"가 작성)
  const isAuthor = blog.authorName === "John Doe"

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* 블로그 글 */}
        <div>
          {isAuthor && <BlogActions blogId={blog.id} />}
          <BlogPost blog={blog} />
        </div>

        {/* 구분선 */}
        <Divider />

        {/* 댓글 섹션 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Comments</h2>
          <CommentForm blogId={blog.id} />
          <CommentList comments={comments} blogId={blog.id} />
        </div>
      </div>
    </div>
  )
}
```

**완료 조건:**
- [ ] 블로그 글 정상 표시
- [ ] 작성자에게만 수정/삭제 버튼 표시
- [ ] 댓글 목록 표시
- [ ] 댓글 작성 폼 표시
- [ ] 404 처리 확인
- [ ] 반응형 레이아웃 테스트

---

### 4. EditPostPage - 글 수정 페이지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/edit/page.tsx`
**라우트:** `/blog/[id]/edit`

**요구사항:**
- [ ] Client Component로 구현 ("use client")
- [ ] URL 파라미터에서 블로그 ID 추출
- [ ] `getMockBlogById()` 함수로 기존 데이터 로드
- [ ] BlogForm 컴포넌트 사용 (초기값 설정)
- [ ] `updateMockBlog()` 함수로 글 수정
- [ ] 수정 완료 후 상세 페이지로 리다이렉트
- [ ] 취소 시 상세 페이지로 이동
- [ ] 404 처리 (블로그 없을 때)
- [ ] 권한 확인 (Mock 사용자만 수정 가능)
- [ ] CenteredContainer 레이아웃 사용
- [ ] 페이지 제목 "Edit Post"
- [ ] 로딩 상태 처리

**의존성:**
- `@/components/blog/BlogForm` - 블로그 폼
- `@/components/layouts/CenteredContainer` - 중앙 정렬 컨테이너
- `@/lib/data/mockBlogs` - Mock 블로그 데이터
- `next/navigation` - useRouter, useParams

**기본 구조:**
```typescript
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CenteredContainer } from "@/components/layouts/CenteredContainer"
import { BlogForm } from "@/components/blog/BlogForm"
import { getMockBlogById, updateMockBlog } from "@/lib/data/mockBlogs"
import type { Blog } from "@/types/blog"

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadBlog = async () => {
      setIsLoading(true)
      const data = getMockBlogById(blogId)
      setBlog(data)
      setIsLoading(false)
    }

    loadBlog()
  }, [blogId])

  const handleSubmit = async (data: { title: string; content: string }) => {
    if (!blog) return

    setIsSubmitting(true)

    try {
      updateMockBlog(blog.id, data.title, data.content)

      // 상세 페이지로 리다이렉트
      router.push(`/blog/${blog.id}`)
    } catch (error) {
      console.error("Failed to update post:", error)
      alert("Failed to update post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (blog) {
      router.push(`/blog/${blog.id}`)
    } else {
      router.push("/")
    }
  }

  if (isLoading) {
    return (
      <CenteredContainer maxWidth="lg">
        <LoadingSpinner />
      </CenteredContainer>
    )
  }

  if (!blog) {
    return (
      <CenteredContainer maxWidth="lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button onClick={() => router.push("/")}>
            Go back home
          </Button>
        </div>
      </CenteredContainer>
    )
  }

  // 권한 확인 (Phase 1에서는 모든 글을 "John Doe"가 작성)
  const isAuthor = blog.authorName === "John Doe"
  if (!isAuthor) {
    return (
      <CenteredContainer maxWidth="lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="mb-4">You don't have permission to edit this post.</p>
          <Button onClick={() => router.push(`/blog/${blog.id}`)}>
            Go back to post
          </Button>
        </div>
      </CenteredContainer>
    )
  }

  return (
    <CenteredContainer maxWidth="lg">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <BlogForm
          initialData={{
            title: blog.title,
            content: blog.content,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitButtonText="Save Changes"
        />
      </div>
    </CenteredContainer>
  )
}
```

**완료 조건:**
- [ ] 기존 데이터로 폼 초기화
- [ ] 제목/내용 수정 가능
- [ ] 수정 완료 후 상세 페이지 이동
- [ ] 취소 버튼 작동
- [ ] 404 처리 확인
- [ ] 권한 확인 동작
- [ ] 로딩 상태 표시

---

## 구현 순서

### Phase 1: Mock Data 준비 (Day 1)
1. `lib/data/mockBlogs.ts` 생성 및 CRUD 함수 구현
2. `lib/data/mockComments.ts` 생성 및 CRUD 함수 구현
3. `types/blog.ts`, `types/comment.ts` 타입 정의
4. 유틸리티 함수 생성 (`formatDate`, `truncateText`)

### Phase 2: 하위 컴포넌트 구현 (Day 2-3)
5. BlogCard, BlogGrid 구현
6. BlogForm 구현
7. BlogPost, BlogActions 구현
8. CommentList, CommentForm 구현
9. SearchBar, EmptyState 구현

### Phase 3: 페이지 구현 (Day 4-5)
10. HomePage 구현 및 테스트
11. NewPostPage 구현 및 테스트
12. PostDetailPage 구현 및 테스트
13. EditPostPage 구현 및 테스트

### Phase 4: 통합 테스트 (Day 6)
14. 전체 플로우 테스트 (작성 → 목록 → 상세 → 수정 → 삭제)
15. 검색 기능 테스트
16. 반응형 디자인 테스트
17. 에러 케이스 테스트

---

## 검증 체크리스트

### HomePage
- [ ] 블로그 목록 정상 표시 (최신순 정렬)
- [ ] 검색 기능 작동 (제목, 내용 검색)
- [ ] 빈 상태 표시 (글 없을 때)
- [ ] 검색 결과 없을 때 메시지 표시
- [ ] 3열 그리드 레이아웃 (데스크톱)
- [ ] 반응형 (모바일: 1열, 태블릿: 2열)
- [ ] 로딩 상태 표시

### NewPostPage
- [ ] 폼 정상 렌더링
- [ ] 제목/내용 입력 가능
- [ ] 유효성 검증 (제목/내용 필수)
- [ ] 글 작성 완료 후 홈 이동
- [ ] 취소 버튼으로 홈 이동
- [ ] 제출 중 로딩 표시
- [ ] 에러 시 alert 표시

### PostDetailPage
- [ ] 블로그 글 전체 내용 표시
- [ ] 제목, 작성자, 날짜 표시
- [ ] 작성자에게만 수정/삭제 버튼 표시
- [ ] 댓글 목록 표시
- [ ] 댓글 작성 폼 표시
- [ ] 댓글 없을 때 EmptyComments 표시
- [ ] 존재하지 않는 ID로 404 처리
- [ ] 로딩 상태 표시

### EditPostPage
- [ ] 기존 데이터로 폼 초기화
- [ ] 제목/내용 수정 가능
- [ ] 유효성 검증
- [ ] 수정 완료 후 상세 페이지 이동
- [ ] 취소 시 상세 페이지 이동
- [ ] 존재하지 않는 ID로 404 처리
- [ ] 권한 없을 때 Unauthorized 표시
- [ ] 제출 중 로딩 표시

---

## 참고사항

### Mock Data 구조 (camelCase)
```typescript
// types/blog.ts
export interface Blog {
  id: string              // UUID
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}

// types/comment.ts
export interface Comment {
  id: string              // UUID
  blogId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string       // ISO timestamp
}
```

### Mock 사용자
- Phase 1에서는 모든 작업을 "John Doe"로 수행
- `authorId: "mock-user-1"`
- `authorName: "John Doe"`

### 데이터 흐름
1. 컴포넌트에서 Mock 함수 호출
2. Mock 함수가 메모리 배열 조작
3. 상태 업데이트로 UI 반영

### Phase 2 마이그레이션 준비
- Mock 함수와 동일한 시그니처로 Server Actions 생성
- camelCase → snake_case 변환 로직 추가
- 컴포넌트 코드는 최소한으로 수정

### 에러 처리
- Phase 1: `alert()` 사용
- Phase 2: Toast 컴포넌트로 개선

### 라우팅
- 홈: `/`
- 새 글: `/blog/new`
- 상세: `/blog/[id]`
- 수정: `/blog/[id]/edit`

### 반응형 브레이크포인트
- **모바일** (<640px): 1열
- **태블릿** (640-1024px): 2열
- **데스크톱** (>1024px): 3열

### TypeScript 엄격 모드
- 모든 타입 명시
- `any` 사용 금지
- null/undefined 체크

### 접근성
- Semantic HTML 사용
- aria-label 적용
- Keyboard navigation 지원
