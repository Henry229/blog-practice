# 홈페이지 - 블로그 글 목록 구현 계획

## 개요

블로그 글 목록을 표시하는 홈페이지 구현
- Supabase에서 블로그 글 데이터 페칭
- 3열 그리드 레이아웃 (반응형)
- 검색 기능
- 페이지네이션
- 빈 상태 처리

---

## Task List

### 0. 사전 준비
- [ ] Supabase 테이블 구조 확인 (blogs 테이블)
- [ ] shadcn/ui 컴포넌트 설치: `npx shadcn@latest add card input button`
- [ ] 타입 정의 파일 생성 (`types/blog.ts`)

### 1. BlogCard 컴포넌트
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
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <h3 className="text-lg font-bold">{blog.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{blog.authorName}</span>
            <span>•</span>
            <span>{formatRelativeTime(blog.createdAt)}</span>
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

**완료 조건:**
- [ ] 모든 요구사항 구현 완료
- [ ] 호버 효과 동작 확인
- [ ] 클릭 시 상세 페이지 이동 확인

---

### 2. BlogGrid 컴포넌트
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

### 3. SearchBar 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/SearchBar.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Input 사용
- [ ] placeholder: "Search posts..."
- [ ] 검색 아이콘 (왼쪽)
- [ ] 입력 시 debounce (500ms)
- [ ] 검색어 변경 시 콜백 호출
- [ ] 전체 너비 (max-w-2xl, 중앙 정렬)

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
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
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
- max-w-2xl로 최대 너비 제한, mx-auto로 중앙 정렬

**완료 조건:**
- [ ] 입력 시 debounce 동작 확인
- [ ] 검색 아이콘 표시 확인
- [ ] onSearch 콜백 호출 확인

---

### 4. EmptyState 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/EmptyState.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 중앙 정렬
- [ ] 아이콘 (예: FileText 또는 Book)
- [ ] "No blog posts yet" 메시지
- [ ] "Be the first to create a post!" 서브 메시지
- [ ] "Create Post" 버튼 (로그인한 경우만 표시)

**의존성:**
- shadcn/ui: button
- Next.js: Link
- lucide-react: FileText 또는 Book 아이콘
- lib/supabase/server: createClient (사용자 확인)

**기본 구조:**
```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export async function EmptyState() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <FileText className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No blog posts yet
      </h3>
      <p className="text-gray-500 mb-6">
        Be the first to create a post!
      </p>
      {user && (
        <Link href="/blog/new">
          <Button>Create Post</Button>
        </Link>
      )}
    </div>
  )
}
```

**구현 세부사항:**
- flex flex-col items-center justify-center로 중앙 정렬
- py-24로 수직 여백 추가
- FileText 아이콘 크기 h-16 w-16, 회색 색상
- 로그인한 사용자만 "Create Post" 버튼 표시
- Button을 Link로 감싸서 /blog/new로 이동

**완료 조건:**
- [ ] 중앙 정렬 확인
- [ ] 로그인 상태에 따라 버튼 표시 확인
- [ ] 버튼 클릭 시 새 글 작성 페이지 이동 확인

---

### 5. Pagination 컴포넌트
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

### 6. HomePage 구현
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/page.tsx`

**요구사항:**
- [ ] Server Component
- [ ] Supabase에서 블로그 데이터 페칭
- [ ] 검색 쿼리 파라미터 처리 (searchParams)
- [ ] 페이지 쿼리 파라미터 처리
- [ ] SearchBar 컴포넌트 포함
- [ ] BlogGrid 컴포넌트 포함
- [ ] Pagination 컴포넌트 포함 (선택사항)
- [ ] 제목 "Latest Posts"
- [ ] 페이지 컨테이너 (max-w-7xl, mx-auto, px-4)

**의존성:**
- BlogGrid 컴포넌트
- SearchBar 컴포넌트
- Pagination 컴포넌트 (선택사항)
- lib/supabase/server: createClient
- types/blog.ts: Blog 인터페이스

**기본 구조:**
```typescript
import { createClient } from "@/lib/supabase/server"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { SearchBar } from "@/components/blog/SearchBar"
import type { Blog } from "@/types/blog"

interface HomePageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const query = params.q || ""
  const page = parseInt(params.page || "1")
  const pageSize = 9

  const supabase = await createClient()

  // 검색 쿼리가 있으면 필터링
  let blogsQuery = supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  if (query) {
    blogsQuery = blogsQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
  }

  // 페이지네이션
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

      <div className="mb-8">
        <SearchBar />
      </div>

      <BlogGrid blogs={blogs || []} />

      {/* Pagination - 선택사항 */}
      {/* <Pagination currentPage={page} totalPages={totalPages} /> */}
    </div>
  )
}
```

**구현 세부사항:**
- searchParams를 await로 받아 query와 page 추출
- Supabase에서 blogs 테이블 조회, created_at 내림차순 정렬
- query가 있으면 title 또는 content에서 검색 (ilike로 대소문자 무시)
- range()로 페이지네이션 구현 (start, end)
- SearchBar는 Client Component로 별도 파일에 구현 (URL 업데이트)
- BlogGrid에 blogs 배열 전달
- 에러 발생 시 에러 메시지 표시

**완료 조건:**
- [ ] 블로그 데이터 페칭 확인
- [ ] 검색 기능 동작 확인
- [ ] 페이지네이션 동작 확인 (선택사항)
- [ ] 레이아웃 및 스타일 확인

---

### 7. SearchBar Client 로직 (URL 업데이트)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/SearchBarClient.tsx`

**요구사항:**
- [ ] Client Component
- [ ] useRouter, useSearchParams 사용
- [ ] 검색어 입력 시 URL 쿼리 파라미터 업데이트
- [ ] SearchBar 컴포넌트 재사용

**의존성:**
- SearchBar 컴포넌트
- next/navigation: useRouter, useSearchParams

**기본 구조:**
```typescript
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

  return <SearchBar onSearch={handleSearch} />
}
```

**구현 세부사항:**
- useSearchParams로 현재 쿼리 파라미터 가져오기
- URLSearchParams로 쿼리 파라미터 조작
- 검색어가 있으면 q 파라미터 설정, 없으면 삭제
- 검색 시 page 파라미터 삭제 (첫 페이지로 리셋)
- router.push로 URL 업데이트

**완료 조건:**
- [ ] 검색어 입력 시 URL 업데이트 확인
- [ ] 검색어 삭제 시 q 파라미터 제거 확인
- [ ] 페이지 파라미터 리셋 확인

---

## 구현 순서

1. **타입 정의**: `types/blog.ts` 생성 (Blog 인터페이스)
2. **유틸 함수**: `lib/utils/text.ts` 생성 (truncateText, formatRelativeTime)
3. **shadcn/ui 설치**: card, input, button 컴포넌트
4. **기본 컴포넌트**: BlogCard, EmptyState
5. **레이아웃 컴포넌트**: BlogGrid
6. **검색 컴포넌트**: SearchBar, SearchBarClient
7. **페이지네이션**: Pagination (선택사항)
8. **홈페이지**: `app/page.tsx` 구현 및 통합

---

## 검증 체크리스트

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
- [ ] 로그인 상태에 따라 버튼 표시 확인
- [ ] 버튼 클릭 시 페이지 이동 확인

### Pagination
- [ ] 페이지 번호 버튼 렌더링 확인
- [ ] 현재 페이지 강조 확인
- [ ] 이전/다음 버튼 동작 확인
- [ ] URL 업데이트 확인

### HomePage
- [ ] Supabase 데이터 페칭 확인
- [ ] 검색 기능 동작 확인
- [ ] 페이지네이션 동작 확인
- [ ] 전체 레이아웃 및 스타일 확인

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
```

### 유틸 함수 (lib/utils/text.ts)
```typescript
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
```

### Supabase 테이블 구조
```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 검색 쿼리 최적화
- Supabase에서 Full-Text Search 기능 사용 가능
- 대량의 데이터에는 인덱스 추가 고려
- 현재는 간단한 ilike 검색 사용

### 페이지네이션 고려사항
- 선택사항이지만 블로그 글이 많아지면 필수
- URL 쿼리 파라미터로 페이지 관리 (?page=2)
- Supabase range() 함수로 페이지네이션 구현
- 총 페이지 수 계산을 위해 count() 쿼리 추가 필요

### 성능 최적화
- Server Component로 구현하여 초기 로드 성능 향상
- 검색 시 debounce로 불필요한 쿼리 방지
- 이미지가 있다면 Next.js Image 컴포넌트 사용
- Suspense와 loading.tsx로 로딩 상태 처리
