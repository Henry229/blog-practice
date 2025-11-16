# 홈페이지 - 블로그 글 목록 구현 계획

## 개요

블로그 글 목록을 표시하는 홈페이지 구현 (Mock Data 기반)
- Mock 데이터로 블로그 글 목록 표시
- 3열 그리드 레이아웃 (반응형)
- 검색 기능 (헤더 중앙 배치)
- 페이지네이션 (선택사항)
- 빈 상태 처리

**참고**: 백엔드 연동(Supabase)은 추후 구현 예정. 현재는 프론트엔드 UI 컴포넌트만 구현합니다.

---

## Task List

### 0. 사전 준비
- [ ] shadcn/ui 컴포넌트 설치: `npx shadcn@latest add card input button`
- [ ] 타입 정의 파일 생성 (`types/blog.ts`)
- [ ] Mock 데이터 파일 생성 (`lib/data/mockBlogs.ts`)
- [ ] 유틸 함수 파일 생성 (`lib/utils/text.ts`)

### 1. 타입 정의 및 Mock 데이터
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `types/blog.ts`, `lib/data/mockBlogs.ts`

**요구사항:**
- [ ] Blog 인터페이스 정의
- [ ] Mock 데이터 생성 (10-15개 샘플 블로그 글)
- [ ] TypeScript 타입 안정성 확보

**의존성:**
- 없음 (기본 TypeScript)

**기본 구조:**
```typescript
// types/blog.ts
export interface Blog {
  id: string
  title: string
  content: string
  author_id: string
  author_name: string
  created_at: string
  updated_at: string
}

// lib/data/mockBlogs.ts
import type { Blog } from "@/types/blog"

export const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    content: "Next.js 15 introduces many exciting features including improved performance, better error handling, and more. In this post, we'll explore the key changes and how to migrate your existing projects...",
    author_id: "user1",
    author_name: "John Doe",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    title: "Understanding React Server Components",
    content: "React Server Components are a new way to write React applications. They allow you to render components on the server, reducing the amount of JavaScript sent to the client...",
    author_id: "user2",
    author_name: "Jane Smith",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    title: "Tailwind CSS Best Practices",
    content: "Tailwind CSS has become one of the most popular CSS frameworks. Here are some best practices for using Tailwind effectively in your projects...",
    author_id: "user1",
    author_name: "John Doe",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  // Add more mock blogs...
]

// Helper function to get all blogs
export function getMockBlogs(): Blog[] {
  return mockBlogs
}

// Helper function to get a blog by id
export function getMockBlogById(id: string): Blog | undefined {
  return mockBlogs.find(blog => blog.id === id)
}

// Helper function to search blogs
export function searchMockBlogs(query: string): Blog[] {
  if (!query) return mockBlogs

  const lowerQuery = query.toLowerCase()
  return mockBlogs.filter(blog =>
    blog.title.toLowerCase().includes(lowerQuery) ||
    blog.content.toLowerCase().includes(lowerQuery)
  )
}
```

**구현 세부사항:**
- Blog 인터페이스는 향후 Supabase 테이블과 일치하도록 설계
- Mock 데이터는 다양한 시간대의 created_at 값으로 생성
- 검색 함수는 제목과 내용에서 대소문자 무시 검색
- 10-15개의 샘플 데이터로 그리드 레이아웃 테스트 가능

**완료 조건:**
- [ ] 타입 정의 파일 생성 완료
- [ ] Mock 데이터 파일 생성 완료
- [ ] export/import 확인

---

### 2. 유틸 함수
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/utils/text.ts`

**요구사항:**
- [ ] truncateText - 텍스트 자르기 함수
- [ ] formatRelativeTime - 상대 시간 표시 함수

**의존성:**
- 없음 (기본 JavaScript)

**기본 구조:**
```typescript
// lib/utils/text.ts
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
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

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}
```

**완료 조건:**
- [ ] 유틸 함수 파일 생성 완료
- [ ] 함수 테스트 완료

---

### 3. BlogCard 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogCard.tsx`

**요구사항:**
- [ ] Server Component (데이터는 상위에서 props로 전달)
- [ ] shadcn/ui Card 컴포넌트 사용
- [ ] 제목 (h3, 폰트 크기 lg, 볼드)
- [ ] 작성자 이름 (작은 텍스트, 회색)
- [ ] 작성 날짜 (상대 시간 표시, 예: "2 hours ago")
- [ ] 내용 미리보기 (100자로 자르기, 말줄임표)
- [ ] 클릭 시 글 상세 페이지로 이동 (Link)
- [ ] 호버 효과 (그림자 증가, 약간 올라오는 효과)
- [ ] 선택사항: 그라데이션 배경 또는 이미지 배경

**의존성:**
- shadcn/ui: card
- Next.js: Link
- types/blog.ts: Blog 인터페이스
- lib/utils/text.ts: truncateText, formatRelativeTime

**기본 구조:**
```typescript
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { truncateText, formatRelativeTime } from "@/lib/utils/text"
import type { Blog } from "@/types/blog"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.id}`}>
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
        <CardHeader>
          <h3 className="text-lg font-bold">{blog.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{blog.author_name}</span>
            <span>•</span>
            <span>{formatRelativeTime(blog.created_at)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {truncateText(blog.content, 100)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
```

**구현 세부사항:**
- Card 컴포넌트에 hover:shadow-lg, transition-all, hover:-translate-y-1 클래스 추가
- Link 컴포넌트로 전체 카드 감싸기
- 작성자와 날짜 사이에 구분자(•) 추가
- 내용은 truncateText 유틸 함수로 100자로 제한
- 날짜는 formatRelativeTime으로 상대 시간 표시
- h-full로 카드 높이 통일 (그리드에서 일관된 높이)

**완료 조건:**
- [ ] 모든 요구사항 구현 완료
- [ ] 호버 효과 동작 확인
- [ ] 클릭 시 상세 페이지 이동 확인

---

### 4. BlogGrid 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogGrid.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 3열 그리드 레이아웃 (데스크톱)
- [ ] 2열 (태블릿)
- [ ] 1열 (모바일)
- [ ] gap-6 (그리드 간격)
- [ ] BlogCard 컴포넌트 렌더링
- [ ] 빈 상태 처리 (EmptyState 컴포넌트)

**의존성:**
- BlogCard 컴포넌트
- EmptyState 컴포넌트
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
import { BlogCard } from "./BlogCard"
import { EmptyState } from "./EmptyState"
import type { Blog } from "@/types/blog"

interface BlogGridProps {
  blogs: Blog[]
}

export function BlogGrid({ blogs }: BlogGridProps) {
  if (blogs.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
```

**구현 세부사항:**
- grid-cols-1 (모바일), md:grid-cols-2 (태블릿), lg:grid-cols-3 (데스크톱)
- gap-6으로 카드 간격 설정
- blogs가 빈 배열이면 EmptyState 표시
- key로 blog.id 사용

**완료 조건:**
- [ ] 반응형 그리드 레이아웃 동작 확인
- [ ] 빈 상태 표시 확인
- [ ] 카드 렌더링 확인

---

### 5. SearchBar 컴포넌트 (헤더용)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/SearchBar.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Input 사용
- [ ] placeholder: "Search posts..."
- [ ] 검색 아이콘 (왼쪽)
- [ ] 입력 시 debounce (500ms)
- [ ] 검색어 변경 시 콜백 호출
- [ ] 최대 너비 (max-w-md)

**의존성:**
- shadcn/ui: input
- react: useState, useEffect
- lucide-react: Search 아이콘

**기본 구조:**
```typescript
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  defaultValue?: string
}

export function SearchBar({ onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
```

**구현 세부사항:**
- useState로 query 상태 관리
- useEffect에서 500ms debounce 구현
- Search 아이콘을 absolute 포지셔닝으로 왼쪽에 배치
- Input에 pl-10 클래스로 아이콘 공간 확보
- max-w-md로 최대 너비 제한

**완료 조건:**
- [ ] 입력 시 debounce 동작 확인
- [ ] 검색 아이콘 표시 확인
- [ ] onSearch 콜백 호출 확인

---

### 6. EmptyState 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/EmptyState.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 중앙 정렬
- [ ] 아이콘 (FileText 또는 Book)
- [ ] "No blog posts found" 메시지
- [ ] 서브 메시지 (검색 결과 없음 또는 글 없음)

**의존성:**
- lucide-react: FileText 또는 Book 아이콘

**기본 구조:**
```typescript
import { FileText } from "lucide-react"

interface EmptyStateProps {
  isSearchResult?: boolean
}

export function EmptyState({ isSearchResult = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <FileText className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {isSearchResult ? "No posts found" : "No blog posts yet"}
      </h3>
      <p className="text-gray-500">
        {isSearchResult
          ? "Try adjusting your search terms"
          : "Check back later for new content"}
      </p>
    </div>
  )
}
```

**구현 세부사항:**
- flex flex-col items-center justify-center로 중앙 정렬
- py-24로 수직 여백 추가
- FileText 아이콘 크기 h-16 w-16, 회색 색상
- isSearchResult prop으로 메시지 분기

**완료 조건:**
- [ ] 중앙 정렬 확인
- [ ] 메시지 분기 확인
- [ ] 레이아웃 확인

---

### 7. Pagination 컴포넌트 (선택사항)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/Pagination.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Button 사용
- [ ] 페이지 번호 버튼 (1, 2, 3...)
- [ ] 이전/다음 버튼
- [ ] 현재 페이지 강조 (파란색 배경)
- [ ] 총 페이지 수 계산
- [ ] 페이지 변경 콜백

**의존성:**
- shadcn/ui: button
- lucide-react: ChevronLeft, ChevronRight 아이콘

**기본 구조:**
```typescript
"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

**구현 세부사항:**
- Array.from으로 페이지 번호 배열 생성
- 현재 페이지는 variant="default" (파란색)
- 다른 페이지는 variant="outline"
- 이전 버튼은 첫 페이지에서 비활성화
- 다음 버튼은 마지막 페이지에서 비활성화
- gap-2로 버튼 간격, mt-8로 상단 여백

**완료 조건:**
- [ ] 페이지 번호 버튼 렌더링 확인
- [ ] 현재 페이지 강조 확인
- [ ] 이전/다음 버튼 동작 확인
- [ ] 첫/마지막 페이지에서 버튼 비활성화 확인

---

### 8. HomePage 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/page.tsx`

**요구사항:**
- [ ] Server Component
- [ ] Mock 데이터에서 블로그 목록 가져오기
- [ ] 검색 쿼리 파라미터 처리 (searchParams)
- [ ] 페이지 쿼리 파라미터 처리 (선택사항)
- [ ] 제목 "Latest Posts"
- [ ] BlogGrid 컴포넌트 포함
- [ ] Pagination 컴포넌트 포함 (선택사항)
- [ ] 페이지 컨테이너 (max-w-7xl, mx-auto, px-4)

**참고**: 검색 바는 헤더에 위치하므로 여기서는 포함하지 않음

**의존성:**
- BlogGrid 컴포넌트
- Pagination 컴포넌트 (선택사항)
- lib/data/mockBlogs.ts: getMockBlogs, searchMockBlogs
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
import { BlogGrid } from "@/components/blog/BlogGrid"
import { getMockBlogs, searchMockBlogs } from "@/lib/data/mockBlogs"
import type { Blog } from "@/types/blog"

interface HomePageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const query = params.q || ""
  const page = parseInt(params.page || "1")
  const pageSize = 9

  // Mock 데이터 가져오기
  const allBlogs = query ? searchMockBlogs(query) : getMockBlogs()

  // 페이지네이션 (선택사항)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const blogs = allBlogs.slice(start, end)
  const totalPages = Math.ceil(allBlogs.length / pageSize)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>

      <BlogGrid blogs={blogs} />

      {/* Pagination - 선택사항 */}
      {/* {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )} */}
    </div>
  )
}
```

**구현 세부사항:**
- searchParams를 await로 받아 query와 page 추출
- query가 있으면 searchMockBlogs, 없으면 getMockBlogs 사용
- slice()로 페이지네이션 구현 (선택사항)
- BlogGrid에 blogs 배열 전달
- 검색 바는 헤더에서 처리 (Header 컴포넌트에 포함)

**완료 조건:**
- [ ] Mock 데이터 로딩 확인
- [ ] 검색 기능 동작 확인 (URL 파라미터)
- [ ] 페이지네이션 동작 확인 (선택사항)
- [ ] 레이아웃 및 스타일 확인

---

### 9. Header 컴포넌트에 SearchBar 통합
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/layout/Header.tsx`

**요구사항:**
- [ ] 검색 바를 헤더 중앙에 배치
- [ ] 로고(왼쪽) - 검색 바(중앙) - 네비게이션(오른쪽) 레이아웃
- [ ] SearchBarClient 컴포넌트 사용 (URL 업데이트)

**의존성:**
- SearchBar 컴포넌트
- Next.js: useRouter, useSearchParams

**기본 구조:**
```typescript
// app/components/layout/Header.tsx
import Link from "next/link"
import { SearchBarClient } from "@/components/blog/SearchBarClient"

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* 로고 */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SimpleBlog
          </Link>

          {/* 검색 바 (중앙) */}
          <div className="flex-1 flex justify-center max-w-2xl">
            <SearchBarClient />
          </div>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-4">
            {/* 사용자 메뉴 또는 로그인 버튼 */}
          </nav>
        </div>
      </div>
    </header>
  )
}

// app/components/blog/SearchBarClient.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SearchBar } from "./SearchBar"

export function SearchBarClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }

    // 페이지를 1로 리셋
    params.delete("page")

    router.push(`/?${params.toString()}`)
  }

  const currentQuery = searchParams.get("q") || ""

  return <SearchBar onSearch={handleSearch} defaultValue={currentQuery} />
}
```

**구현 세부사항:**
- flex items-center justify-between으로 3분할 레이아웃
- 검색 바는 flex-1 flex justify-center로 중앙 정렬
- max-w-2xl로 검색 바 최대 너비 제한
- SearchBarClient는 Client Component로 URL 업데이트 처리
- 검색 시 page 파라미터 삭제 (첫 페이지로 리셋)

**완료 조건:**
- [ ] 헤더 레이아웃 확인 (로고 - 검색 바 - 네비게이션)
- [ ] 검색 바 중앙 배치 확인
- [ ] 검색어 입력 시 URL 업데이트 확인
- [ ] 검색어 삭제 시 q 파라미터 제거 확인

---

## 구현 순서

1. **타입 및 Mock 데이터**: `types/blog.ts`, `lib/data/mockBlogs.ts` 생성
2. **유틸 함수**: `lib/utils/text.ts` 생성
3. **shadcn/ui 설치**: card, input, button 컴포넌트
4. **기본 컴포넌트**: BlogCard, EmptyState
5. **레이아웃 컴포넌트**: BlogGrid
6. **검색 컴포넌트**: SearchBar, SearchBarClient
7. **헤더 통합**: Header 컴포넌트에 SearchBarClient 추가
8. **페이지네이션**: Pagination (선택사항)
9. **홈페이지**: `app/page.tsx` 구현 및 통합

---

## 검증 체크리스트

### Mock 데이터
- [ ] Blog 타입 정의 확인
- [ ] Mock 데이터 10-15개 생성 확인
- [ ] getMockBlogs, searchMockBlogs 함수 동작 확인

### 유틸 함수
- [ ] truncateText 동작 확인
- [ ] formatRelativeTime 동작 확인

### BlogCard
- [ ] 제목, 작성자, 날짜, 미리보기 표시 확인
- [ ] 호버 효과 동작 확인
- [ ] 클릭 시 상세 페이지 이동 확인
- [ ] 반응형 레이아웃 확인

### BlogGrid
- [ ] 3열 그리드 레이아웃 확인 (데스크톱)
- [ ] 2열 레이아웃 확인 (태블릿)
- [ ] 1열 레이아웃 확인 (모바일)
- [ ] 빈 상태 표시 확인

### SearchBar
- [ ] 검색 아이콘 표시 확인
- [ ] 입력 시 debounce 동작 확인
- [ ] URL 쿼리 파라미터 업데이트 확인
- [ ] 검색 결과 필터링 확인

### EmptyState
- [ ] 빈 상태 메시지 표시 확인
- [ ] 검색 결과 없음 메시지 분기 확인

### Pagination
- [ ] 페이지 번호 버튼 렌더링 확인
- [ ] 현재 페이지 강조 확인
- [ ] 이전/다음 버튼 동작 확인
- [ ] URL 업데이트 확인

### HomePage
- [ ] Mock 데이터 로딩 확인
- [ ] 검색 기능 동작 확인
- [ ] 페이지네이션 동작 확인 (선택사항)
- [ ] 전체 레이아웃 및 스타일 확인

### Header 통합
- [ ] 검색 바 헤더 중앙 배치 확인
- [ ] 로고 - 검색 바 - 네비게이션 레이아웃 확인
- [ ] 검색 기능 동작 확인
- [ ] URL 파라미터 처리 확인

---

## 참고사항

### Mock 데이터 추가 샘플
```typescript
// lib/data/mockBlogs.ts에 추가할 더 많은 샘플
{
  id: "4",
  title: "TypeScript Advanced Types",
  content: "TypeScript's type system is incredibly powerful. Let's explore advanced types like mapped types, conditional types, and template literal types...",
  author_id: "user3",
  author_name: "Alice Johnson",
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
},
// ... 10-15개의 샘플 데이터
```

### 검색 기능 개선 (추후)
```typescript
// 대소문자 무시, 특수문자 제거, 정규식 검색 등
export function searchMockBlogs(query: string): Blog[] {
  if (!query) return mockBlogs

  const lowerQuery = query.toLowerCase().trim()
  return mockBlogs.filter(blog =>
    blog.title.toLowerCase().includes(lowerQuery) ||
    blog.content.toLowerCase().includes(lowerQuery) ||
    blog.author_name.toLowerCase().includes(lowerQuery)
  )
}
```

### 페이지네이션 클라이언트 컴포넌트
```typescript
// app/components/blog/PaginationClient.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Pagination } from "./Pagination"

interface PaginationClientProps {
  currentPage: number
  totalPages: number
}

export function PaginationClient({ currentPage, totalPages }: PaginationClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/?${params.toString()}`)
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  )
}
```

### 백엔드 연동 준비
- 현재 Mock 데이터 구조는 Supabase 테이블 구조와 일치
- 추후 `getMockBlogs()` → Supabase 쿼리로 교체
- `searchMockBlogs()` → Supabase Full-Text Search로 교체
- Server Component는 그대로 유지, 데이터 소스만 변경

### 성능 최적화
- Server Component로 초기 로드 성능 향상
- 검색 시 debounce로 불필요한 렌더링 방지
- Mock 데이터는 메모리에 상주 (실제 앱에서는 캐싱 전략 필요)

### 접근성 개선
- 검색 바에 aria-label 추가
- 페이지네이션 버튼에 aria-label 추가
- 키보드 네비게이션 지원
- 스크린 리더 지원

### UI 개선 아이디어
- 블로그 카드에 태그 표시
- 읽기 시간 추정 표시
- 좋아요 수 표시
- 최신 글 배지
- 인기 글 마크
