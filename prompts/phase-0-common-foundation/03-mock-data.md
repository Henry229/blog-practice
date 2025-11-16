# Phase 0.3 - Mock Data 관리

## 개요
**Phase**: Phase 0 - 공통 기반
**목적**: Mock 데이터 및 CRUD 함수 구현으로 프론트엔드 개발 지원
**상태**: ✅ 완료

## Mock Data 구조

```
lib/data/
├── mockBlogs.ts      - 블로그 Mock 데이터 및 CRUD 함수
└── mockComments.ts   - 댓글 Mock 데이터 및 CRUD 함수
```

---

## 1. Mock 블로그 데이터 (`lib/data/mockBlogs.ts`)

### 기본 구조

```typescript
// lib/data/mockBlogs.ts
import type { Blog } from "@/types/blog"

/**
 * Mock 블로그 데이터
 * 실제 사용 시 Supabase 데이터베이스로 교체 예정
 */
let mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    content: `Next.js 15 brings many exciting new features...

In this post, we'll explore the new App Router, Server Components, and Server Actions.

## What's New in Next.js 15

1. **App Router Stability**: The App Router is now production-ready
2. **Server Actions**: Seamlessly integrate server-side logic
3. **Turbopack**: Faster development builds

Let's dive into each of these features!`,
    authorId: "user-1",
    authorName: "John Doe",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Building a Blog with Supabase",
    content: `Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, and real-time subscriptions.

## Why Supabase?

- Open source and self-hostable
- PostgreSQL-based (robust and scalable)
- Built-in authentication
- Real-time capabilities
- Row Level Security (RLS)

Let's build a blog together!`,
    authorId: "user-2",
    authorName: "Jane Smith",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    title: "TypeScript Best Practices",
    content: `TypeScript adds static typing to JavaScript, helping catch errors early and improve code quality.

## Key Best Practices

1. Use strict mode
2. Avoid 'any' type
3. Use interfaces for object shapes
4. Leverage union types
5. Write type guards

Follow these practices to write better TypeScript code!`,
    authorId: "user-1",
    authorName: "John Doe",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
]

/**
 * 모든 블로그 가져오기
 */
export function getMockBlogs(): Blog[] {
  return [...mockBlogs].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/**
 * ID로 특정 블로그 가져오기
 */
export function getMockBlogById(id: string): Blog | null {
  return mockBlogs.find((blog) => blog.id === id) || null
}

/**
 * 블로그 검색 (제목 및 내용)
 */
export function searchMockBlogs(query: string): Blog[] {
  const lowerQuery = query.toLowerCase()
  return mockBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery) ||
      blog.authorName.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 새 블로그 추가
 */
export function addMockBlog(
  title: string,
  content: string,
  authorId: string,
  authorName: string
): Blog {
  const newBlog: Blog = {
    id: Date.now().toString(),
    title,
    content,
    authorId,
    authorName,
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockBlogs.push(newBlog)
  return newBlog
}

/**
 * 블로그 수정
 */
export function updateMockBlog(
  id: string,
  title: string,
  content: string
): Blog | null {
  const blogIndex = mockBlogs.findIndex((blog) => blog.id === id)

  if (blogIndex === -1) {
    return null
  }

  mockBlogs[blogIndex] = {
    ...mockBlogs[blogIndex],
    title,
    content,
    updatedAt: new Date().toISOString(),
  }

  return mockBlogs[blogIndex]
}

/**
 * 블로그 삭제
 */
export function deleteMockBlog(id: string): boolean {
  const blogIndex = mockBlogs.findIndex((blog) => blog.id === id)

  if (blogIndex === -1) {
    return false
  }

  mockBlogs.splice(blogIndex, 1)
  return true
}

/**
 * 작성자별 블로그 가져오기
 */
export function getMockBlogsByAuthor(authorId: string): Blog[] {
  return mockBlogs.filter((blog) => blog.authorId === authorId)
}

/**
 * 블로그 총 개수
 */
export function getMockBlogsCount(): number {
  return mockBlogs.length
}
```

---

## 2. Mock 댓글 데이터 (`lib/data/mockComments.ts`)

```typescript
// lib/data/mockComments.ts
import type { Comment } from "@/types/comment"

/**
 * Mock 댓글 데이터
 * 실제 사용 시 Supabase 데이터베이스로 교체 예정
 */
let mockComments: Comment[] = [
  {
    id: "c1",
    blogId: "1",
    authorId: "user-2",
    authorName: "Jane Smith",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    content: "Great introduction to Next.js 15! Looking forward to trying it out.",
    createdAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "c2",
    blogId: "1",
    authorId: "user-3",
    authorName: "Bob Johnson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    content: "The App Router is a game changer. Thanks for the detailed explanation!",
    createdAt: "2024-01-15T12:30:00Z",
  },
  {
    id: "c3",
    blogId: "2",
    authorId: "user-1",
    authorName: "John Doe",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    content: "Supabase looks amazing! Can't wait to use it in my next project.",
    createdAt: "2024-01-14T16:00:00Z",
  },
]

/**
 * 특정 블로그의 댓글 가져오기
 */
export function getMockComments(blogId: string): Comment[] {
  return mockComments
    .filter((comment) => comment.blogId === blogId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
}

/**
 * 댓글 추가
 */
export function addMockComment(
  blogId: string,
  content: string,
  authorId: string,
  authorName: string
): Comment {
  const newComment: Comment = {
    id: `c${Date.now()}`,
    blogId,
    authorId,
    authorName,
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
    content,
    createdAt: new Date().toISOString(),
  }

  mockComments.push(newComment)
  return newComment
}

/**
 * 댓글 삭제
 */
export function deleteMockComment(id: string): boolean {
  const commentIndex = mockComments.findIndex((comment) => comment.id === id)

  if (commentIndex === -1) {
    return false
  }

  mockComments.splice(commentIndex, 1)
  return true
}

/**
 * 댓글 총 개수 (특정 블로그)
 */
export function getMockCommentsCount(blogId: string): number {
  return mockComments.filter((comment) => comment.blogId === blogId).length
}

/**
 * 모든 댓글 가져오기 (관리자용)
 */
export function getAllMockComments(): Comment[] {
  return [...mockComments]
}
```

---

## 3. Mock Data 사용 예시

### 블로그 목록 표시
```typescript
// app/page.tsx
import { getMockBlogs } from "@/lib/data/mockBlogs"

export default function HomePage() {
  const blogs = getMockBlogs()

  return (
    <div>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
```

### 블로그 검색
```typescript
// components/SearchBar.tsx
"use client"

import { useState } from "react"
import { searchMockBlogs } from "@/lib/data/mockBlogs"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])

  const handleSearch = () => {
    const blogs = searchMockBlogs(query)
    setResults(blogs)
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}
```

### 새 블로그 작성
```typescript
// app/blog/new/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addMockBlog } from "@/lib/data/mockBlogs"

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    const newBlog = addMockBlog(
      title,
      content,
      "user-1",  // Mock 사용자 ID
      "John Doe" // Mock 사용자 이름
    )

    router.push(`/blog/${newBlog.id}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### 댓글 표시 및 추가
```typescript
// app/blog/[id]/page.tsx
import { getMockBlogById } from "@/lib/data/mockBlogs"
import { getMockComments } from "@/lib/data/mockComments"

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = getMockBlogById(params.id)
  const comments = getMockComments(params.id)

  return (
    <div>
      <BlogPost blog={blog} />
      <CommentList comments={comments} />
      <CommentForm blogId={params.id} />
    </div>
  )
}
```

---

## 4. LocalStorage 영속성 추가 (선택사항)

브라우저 새로고침 시에도 데이터 유지를 위한 LocalStorage 통합:

```typescript
// lib/data/mockBlogs.ts (영속성 추가 버전)

const STORAGE_KEY = "simpleblog_mock_data"

// LocalStorage에서 데이터 로드
function loadFromStorage(): Blog[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// LocalStorage에 데이터 저장
function saveToStorage(blogs: Blog[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

// 초기 데이터 (LocalStorage 또는 기본값)
let mockBlogs: Blog[] = loadFromStorage().length > 0
  ? loadFromStorage()
  : [
      // ... 기본 Mock 데이터
    ]

// 데이터 변경 시 LocalStorage 저장
export function addMockBlog(...args): Blog {
  const newBlog = { /* ... */ }
  mockBlogs.push(newBlog)
  saveToStorage(mockBlogs)  // ← 저장
  return newBlog
}

// 다른 CRUD 함수에도 동일하게 적용
```

---

## 5. Avatar URL 생성

DiceBear API를 사용한 아바타 생성:

```typescript
// lib/utils/avatar.ts

/**
 * 사용자 이름으로 아바타 URL 생성
 */
export function generateAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
}

/**
 * 이니셜로 아바타 URL 생성
 */
export function generateInitialsAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`
}
```

---

## 구현 단계

1. [x] `lib/data/` 폴더 생성
2. [x] `mockBlogs.ts` 파일 생성
3. [x] Mock 블로그 데이터 정의 (최소 3개)
4. [x] CRUD 함수 구현 (get, getById, search, add, update, delete)
5. [x] `mockComments.ts` 파일 생성
6. [x] Mock 댓글 데이터 정의
7. [x] 댓글 CRUD 함수 구현
8. [x] Avatar URL 생성 함수 추가
9. [x] LocalStorage 영속성 추가 (선택사항)
10. [x] 사용 예시 문서화

---

## 완료 조건

### 파일 확인
- [ ] `lib/data/mockBlogs.ts` 존재
- [ ] `lib/data/mockComments.ts` 존재

### 기능 검증
- [ ] getMockBlogs() 정상 동작
- [ ] getMockBlogById() ID로 블로그 찾기
- [ ] searchMockBlogs() 검색 기능
- [ ] addMockBlog() 새 글 추가
- [ ] updateMockBlog() 글 수정
- [ ] deleteMockBlog() 글 삭제
- [ ] getMockComments() 댓글 가져오기
- [ ] addMockComment() 댓글 추가
- [ ] deleteMockComment() 댓글 삭제

### 다음 단계
- Phase 0.4: 공통 유틸리티 함수

---

## 참고사항

- **Mock 데이터 구조**: Supabase 테이블 구조와 동일하게 설계
- **ID 생성**: `Date.now().toString()` 사용 (간단한 Mock용)
- **날짜 형식**: ISO 8601 형식 (`new Date().toISOString()`)
- **Avatar URL**: DiceBear API 또는 UI Avatars API 사용
- **정렬**: 최신순 (createdAt 기준 내림차순)
- **LocalStorage**: 선택사항, 브라우저 새로고침 시 데이터 유지용

### Supabase 연동 시 (Phase 8)
Mock 함수를 Supabase 클라이언트 호출로 교체:

```typescript
// Before (Mock)
const blogs = getMockBlogs()

// After (Supabase)
const { data: blogs } = await supabase
  .from("blogs")
  .select("*")
  .order("created_at", { ascending: false })
```

### 추가 Mock 데이터 생성 도구
- **Faker.js**: 더 현실적인 Mock 데이터 생성
- **DiceBear**: 다양한 스타일의 아바타 생성
- **Lorem Ipsum**: 긴 텍스트 콘텐츠 생성
