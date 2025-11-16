# 글 상세 페이지 구현 계획

## 개요

블로그 글 상세 페이지 구현
- 글 전체 내용 표시
- 작성자 정보 (이름, 날짜)
- 수정/삭제 버튼 (작성자만)
- 삭제 확인 다이얼로그
- 댓글 섹션 통합 (필수 구현)

---

## Task List

### 0. 사전 준비
- [ ] shadcn/ui 컴포넌트 설치: `npx shadcn@latest add button alert-dialog`
- [ ] Mock Data 확인 (`lib/data/mockBlogs.ts`)
- [ ] Mock CRUD 함수 확인 (getMockBlogById, updateMockBlog, deleteMockBlog)

### 1. BlogHeader 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogHeader.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 제목 (h1, 폰트 크기 4xl, 볼드)
- [ ] 작성자 이름 (아바타 또는 이니셜)
- [ ] 작성 날짜 (포맷: "Oct 26, 2023")
- [ ] 수정 날짜 (작성일과 다른 경우 표시)
- [ ] 작성자와 날짜를 같은 줄에 표시 (flex)

**의존성:**
- types/blog.ts: Blog 인터페이스
- lib/utils/text.ts: formatDate

**기본 구조:**
```typescript
import { formatDate } from "@/lib/utils/text"
import type { Blog } from "@/types/blog"

interface BlogHeaderProps {
  blog: Blog
}

export function BlogHeader({ blog }: BlogHeaderProps) {
  const wasUpdated = blog.updated_at !== blog.created_at

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center gap-2 text-gray-600">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {blog.author_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{blog.author_name}</p>
          <p className="text-sm">
            {formatDate(blog.created_at)}
            {wasUpdated && (
              <span className="text-gray-500"> (edited)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
```

**구현 세부사항:**
- h1으로 제목 표시, text-4xl font-bold
- 아바타는 작성자 이름 첫 글자로 표시 (원형, 파란 배경)
- flex items-center gap-2로 아바타와 정보 나란히 배치
- 수정된 경우 "(edited)" 표시
- formatDate로 날짜 포맷 ("Oct 26, 2023")

**완료 조건:**
- [ ] 제목 표시 확인
- [ ] 작성자 아바타 표시 확인
- [ ] 날짜 포맷 확인
- [ ] 수정 표시 확인

---

### 2. BlogContent 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogContent.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 글 본문 내용 표시
- [ ] 줄바꿈 유지 (whitespace-pre-wrap)
- [ ] 가독성 좋은 폰트 크기 및 줄 간격
- [ ] 최대 너비 (prose)

**의존성:**
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
import type { Blog } from "@/types/blog"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {content}
      </p>
    </div>
  )
}
```

**구현 세부사항:**
- prose prose-lg로 타이포그래피 스타일 적용
- whitespace-pre-wrap으로 줄바꿈 유지
- leading-relaxed로 줄 간격 증가
- text-gray-800로 가독성 향상
- max-w-none으로 prose의 최대 너비 제한 해제

**완료 조건:**
- [ ] 본문 내용 표시 확인
- [ ] 줄바꿈 유지 확인
- [ ] 타이포그래피 스타일 확인

---

### 3. BlogActions 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogActions.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 수정 버튼 (Edit, 파란색, Link)
- [ ] 삭제 버튼 (Delete, 빨간색, 다이얼로그 트리거)
- [ ] Mock 사용자 "John Doe"인 경우만 표시 (현재는 모든 글에 표시)
- [ ] 버튼 간격 (gap-2)
- [ ] 우측 정렬

**의존성:**
- shadcn/ui: button
- Next.js: Link
- DeleteConfirmDialog 컴포넌트

**기본 구조:**
```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"

interface BlogActionsProps {
  blogId: string
  authorName: string
}

export function BlogActions({ blogId, authorName }: BlogActionsProps) {
  // 현재는 Mock 사용자 "John Doe"만 수정/삭제 가능
  // 추후 Supabase Auth 연동 시 실제 사용자 확인으로 변경
  const currentUser = "John Doe"

  // 작성자가 아니면 아무것도 표시하지 않음
  if (currentUser !== authorName) {
    return null
  }

  return (
    <div className="flex items-center justify-end gap-2 mb-8">
      <Link href={`/blog/${blogId}/edit`}>
        <Button variant="default">Edit</Button>
      </Link>
      <DeleteConfirmDialog blogId={blogId} />
    </div>
  )
}
```

**구현 세부사항:**
- Server Component로 구현 (추후 인증 확인 용이)
- 현재는 Mock 사용자 "John Doe"만 버튼 표시
- authorName === "John Doe"인 경우만 버튼 표시
- Edit 버튼은 Link로 수정 페이지 이동
- DeleteConfirmDialog는 Client Component로 별도 구현
- flex items-center justify-end gap-2로 우측 정렬
- 추후 Supabase Auth 연동 시 실제 사용자 확인 로직으로 교체

**완료 조건:**
- [ ] 작성자만 버튼 표시 확인
- [ ] Edit 버튼 클릭 시 수정 페이지 이동 확인
- [ ] Delete 버튼 표시 확인

---

### 4. DeleteConfirmDialog 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/DeleteConfirmDialog.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui AlertDialog 사용
- [ ] 삭제 버튼 (빨간색, variant="destructive")
- [ ] 확인 다이얼로그
- [ ] "Are you sure?" 메시지
- [ ] "This action cannot be undone." 경고
- [ ] 취소/삭제 버튼
- [ ] Mock Data 삭제 함수 호출
- [ ] 성공 시 홈페이지로 이동

**의존성:**
- shadcn/ui: alert-dialog, button
- next/navigation: useRouter
- lib/data/mockBlogs.ts: deleteMockBlog

**기본 구조:**
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteMockBlog } from "@/lib/data/mockBlogs"

interface DeleteConfirmDialogProps {
  blogId: string
}

export function DeleteConfirmDialog({ blogId }: DeleteConfirmDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const success = deleteMockBlog(blogId)
      if (success) {
        // Mock Data 삭제 성공
        router.push("/")
        router.refresh() // 페이지 새로고침으로 업데이트된 목록 표시
      } else {
        alert("Blog post not found")
        setIsDeleting(false)
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      alert("An error occurred. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your blog post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

**구현 세부사항:**
- AlertDialog로 확인 다이얼로그 구현
- useState로 삭제 중 상태 관리
- handleDelete에서 deleteMockBlog 함수 호출 (Mock Data)
- 성공 시 router.push("/")로 홈페이지 이동
- router.refresh()로 페이지 새로고침하여 업데이트된 목록 표시
- 에러 시 alert 표시 및 상태 복원
- 삭제 중일 때 버튼 비활성화 및 텍스트 변경
- AlertDialogAction에 bg-red-600으로 빨간색 적용
- 추후 Supabase 연동 시 deleteMockBlog → Server Action으로 교체

**완료 조건:**
- [ ] 삭제 버튼 클릭 시 다이얼로그 표시 확인
- [ ] 확인 메시지 표시 확인
- [ ] 취소 버튼 동작 확인
- [ ] 삭제 버튼 동작 확인
- [ ] 삭제 성공 시 홈페이지 이동 확인
- [ ] 에러 처리 확인

---

### 5. BlogPost 컴포넌트 (통합)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogPost.tsx`

**요구사항:**
- [ ] Server Component
- [ ] BlogHeader, BlogActions, BlogContent 통합
- [ ] 댓글 섹션 포함 (필수 구현)
- [ ] 적절한 간격 및 레이아웃

**의존성:**
- BlogHeader 컴포넌트
- BlogActions 컴포넌트
- BlogContent 컴포넌트
- CommentSection 컴포넌트 (댓글 표시 + 작성 폼)
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
import { BlogHeader } from "./BlogHeader"
import { BlogActions } from "./BlogActions"
import { BlogContent } from "./BlogContent"
import { CommentSection } from "@/components/comments/CommentSection"
import type { Blog } from "@/types/blog"

interface BlogPostProps {
  blog: Blog
}

export function BlogPost({ blog }: BlogPostProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <BlogActions blogId={blog.id} authorName={blog.author_name} />
      <BlogHeader blog={blog} />
      <BlogContent content={blog.content} />

      {/* 댓글 섹션 */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <CommentSection blogId={blog.id} />
      </div>
    </article>
  )
}
```

**구현 세부사항:**
- article 태그로 시맨틱 마크업
- max-w-4xl로 최대 너비 제한, mx-auto로 중앙 정렬
- BlogActions를 최상단에 배치 (authorName 전달)
- BlogHeader, BlogContent 순서로 배치
- 댓글 섹션 통합 (CommentSection 컴포넌트)
- mt-12, border-t로 댓글 섹션 구분
- CommentSection에 blogId 전달하여 해당 글의 댓글 표시

**완료 조건:**
- [ ] 전체 레이아웃 확인
- [ ] 컴포넌트 통합 확인
- [ ] 간격 및 스타일 확인

---

### 6. PostDetailPage 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/page.tsx`

**요구사항:**
- [ ] Server Component
- [ ] Mock Data에서 블로그 데이터 가져오기
- [ ] BlogPost 컴포넌트 렌더링
- [ ] 404 처리 (블로그 없음)
- [ ] 메타데이터 설정 (제목, 설명)
- [ ] 페이지 컨테이너 (max-w-7xl, px-4, py-8)

**의존성:**
- BlogPost 컴포넌트
- lib/data/mockBlogs.ts: getMockBlogById
- next/navigation: notFound
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
import { notFound } from "next/navigation"
import { getMockBlogById } from "@/lib/data/mockBlogs"
import { BlogPost } from "@/components/blog/BlogPost"
import type { Metadata } from "next"

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: PostDetailPageProps
): Promise<Metadata> {
  const { id } = await params
  const blog = getMockBlogById(id)

  if (!blog) {
    return {
      title: "Post Not Found"
    }
  }

  return {
    title: blog.title,
    description: blog.content.slice(0, 160)
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params
  const blog = getMockBlogById(id)

  if (!blog) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BlogPost blog={blog} />
    </div>
  )
}
```

**구현 세부사항:**
- params를 await로 받아 id 추출
- generateMetadata로 동적 메타데이터 생성
- getMockBlogById로 Mock Data에서 블로그 조회
- 블로그 없음 시 notFound() 호출 (404 페이지)
- BlogPost 컴포넌트에 blog 데이터 전달
- max-w-7xl mx-auto px-4 py-8로 페이지 컨테이너
- 추후 Supabase 연동 시 getMockBlogById → Supabase 쿼리로 교체

**완료 조건:**
- [ ] 블로그 데이터 페칭 확인
- [ ] 페이지 렌더링 확인
- [ ] 404 처리 확인
- [ ] 메타데이터 설정 확인

---

### 7. 404 페이지 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/blog/[id]/not-found.tsx`

**요구사항:**
- [ ] Server Component
- [ ] "Post not found" 메시지
- [ ] "Go back home" 링크
- [ ] 중앙 정렬
- [ ] 아이콘 (FileX 또는 AlertCircle)

**의존성:**
- shadcn/ui: button
- Next.js: Link
- lucide-react: FileX 또는 AlertCircle 아이콘

**기본 구조:**
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

**구현 세부사항:**
- flex flex-col items-center justify-center로 중앙 정렬
- min-h-[60vh]로 최소 높이 설정
- FileX 아이콘 크기 h-16 w-16, 회색 색상
- "404" 큰 제목, "Post not found" 메시지
- "Go back home" 버튼으로 홈페이지 이동

**완료 조건:**
- [ ] 404 페이지 표시 확인
- [ ] 중앙 정렬 확인
- [ ] 홈 버튼 동작 확인

---

## 구현 순서

1. **shadcn/ui 설치**: button, alert-dialog 컴포넌트
2. **유틸 함수**: `lib/utils/text.ts`에 formatDate 추가
3. **기본 컴포넌트**: BlogHeader, BlogContent
4. **액션 컴포넌트**: BlogActions, DeleteConfirmDialog
5. **통합 컴포넌트**: BlogPost
6. **페이지 구현**: PostDetailPage, not-found.tsx

---

## 검증 체크리스트

### BlogHeader
- [ ] 제목 표시 확인
- [ ] 작성자 아바타 표시 확인
- [ ] 날짜 포맷 확인
- [ ] 수정 표시 확인 (updated_at ≠ created_at)

### BlogContent
- [ ] 본문 내용 표시 확인
- [ ] 줄바꿈 유지 확인
- [ ] 가독성 확인 (폰트 크기, 줄 간격)

### BlogActions
- [ ] 작성자만 버튼 표시 확인
- [ ] 비작성자는 버튼 숨김 확인
- [ ] Edit 버튼 클릭 시 수정 페이지 이동 확인

### DeleteConfirmDialog
- [ ] 삭제 버튼 클릭 시 다이얼로그 표시 확인
- [ ] 확인 메시지 표시 확인
- [ ] 취소 버튼 동작 확인
- [ ] 삭제 버튼 동작 확인
- [ ] 삭제 성공 시 홈페이지 이동 확인
- [ ] 로딩 상태 표시 확인

### BlogPost
- [ ] 전체 레이아웃 확인
- [ ] 모든 컴포넌트 통합 확인
- [ ] 간격 및 스타일 확인

### PostDetailPage
- [ ] 블로그 데이터 페칭 확인
- [ ] 페이지 렌더링 확인
- [ ] 404 처리 확인
- [ ] 메타데이터 설정 확인
- [ ] SEO 최적화 확인

### not-found.tsx
- [ ] 404 페이지 표시 확인
- [ ] 레이아웃 및 스타일 확인
- [ ] 홈 버튼 동작 확인

---

## 참고사항

### formatDate 유틸 함수 (lib/utils/text.ts)
```typescript
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

// 예시: "Oct 26, 2023"
```

### 메타데이터 최적화
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const blog = getMockBlogById(id)

  if (!blog) {
    return { title: "Post Not Found" }
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
    twitter: {
      card: "summary",
      title: blog.title,
      description: blog.content.slice(0, 160),
    },
  }
}
```

### 아바타 컴포넌트 분리
```typescript
// app/components/ui/Avatar.tsx
interface AvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg"
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
```

### 삭제 에러 처리 개선
```typescript
// toast 사용
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

async function handleDelete() {
  setIsDeleting(true)
  try {
    const result = await deleteBlog(blogId)
    if (result.success) {
      toast({
        title: "Success",
        description: "Your post has been deleted.",
      })
      router.push("/")
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "An unexpected error occurred.",
      variant: "destructive",
    })
    setIsDeleting(false)
  }
}
```

### 접근성 개선
- article 태그로 시맨틱 마크업
- heading 계층 구조 (h1 → h2 → h3)
- ARIA labels 추가
- 키보드 네비게이션 지원
- 포커스 관리 (다이얼로그)

### 성능 최적화
- generateMetadata로 SEO 최적화
- Server Component로 초기 로드 성능 향상
- Suspense와 loading.tsx로 로딩 상태 처리
- 이미지가 있다면 Next.js Image 컴포넌트 사용

### 추가 기능 아이디어
- 공유 버튼 (Twitter, Facebook, 링크 복사)
- 조회수 카운터
- 좋아요 기능
- 북마크 기능
- 관련 글 추천
- 목차 (Table of Contents)
- 읽기 시간 추정
