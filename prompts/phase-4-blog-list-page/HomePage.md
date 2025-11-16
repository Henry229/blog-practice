# HomePage

## 개요
**Phase**: Phase 4 - 블로그 목록 페이지
**파일 경로**: `app/page.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 블로그 글 목록을 카드 그리드로 표시하는 홈페이지
**타입**: Page Component
**위치**: `/` (루트 라우트)

---

## 요구사항

### 기능 요구사항
- [ ] Mock 블로그 데이터 로드
- [ ] 블로그 카드 그리드 표시 (3열)
- [ ] 검색 기능 (query parameter 기반)
- [ ] 페이지네이션 (페이지당 9개 글)
- [ ] 빈 상태 표시 (검색 결과 없음)
- [ ] 블로그 카드 클릭 시 상세 페이지 이동

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] 고정 헤더 (Phase 1에서 구현됨)
- [ ] 검색 바 (Header에 포함)
- [ ] Light gray 배경 (#F5F5F5)
- [ ] 3열 그리드 레이아웃 (데스크톱)
- [ ] 2열 그리드 (태블릿)
- [ ] 1열 그리드 (모바일)
- [ ] 카드 간격: 24px gap
- [ ] 페이지네이션 (하단, 중앙 정렬)

### 접근성 요구사항
- [ ] `<main>` 시맨틱 태그 사용
- [ ] 카드 링크에 명확한 텍스트
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add card avatar badge
```

### 내부 의존성
- Layout: `PageContainer` from `@/components/layout`
- Components: `BlogGrid`, `BlogCard`, `Pagination`, `EmptyState`
- Mock Data: `getMockBlogs`, `searchMockBlogs` from `@/lib/data/mockBlogs`
- Type: `Blog` from `types/blog.ts`

---

## 기본 구조

```typescript
import { PageContainer } from "@/components/layout/PageContainer"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { BlogCard } from "@/components/blog/BlogCard"
import { Pagination } from "@/components/blog/Pagination"
import { EmptyState } from "@/components/blog/EmptyState"
import { getMockBlogs, searchMockBlogs } from "@/lib/data/mockBlogs"

interface HomePageProps {
  searchParams: {
    search?: string
    page?: string
  }
}

export default function HomePage({ searchParams }: HomePageProps) {
  const searchQuery = searchParams.search || ""
  const currentPage = parseInt(searchParams.page || "1")
  const itemsPerPage = 9

  // Get blogs (search or all)
  const allBlogs = searchQuery
    ? searchMockBlogs(searchQuery)
    : getMockBlogs()

  // Pagination
  const totalPages = Math.ceil(allBlogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const blogs = allBlogs.slice(startIndex, startIndex + itemsPerPage)

  return (
    <PageContainer className="bg-gray-50 min-h-screen">
      {blogs.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : (
        <>
          <BlogGrid>
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </BlogGrid>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              searchQuery={searchQuery}
            />
          )}
        </>
      )}
    </PageContainer>
  )
}
```

---

## 구현 세부사항

### searchParams 처리
```typescript
interface HomePageProps {
  searchParams: {
    search?: string    // 검색 쿼리
    page?: string      // 현재 페이지 번호
  }
}
```

### 블로그 데이터 로드
```typescript
const searchQuery = searchParams.search || ""
const allBlogs = searchQuery
  ? searchMockBlogs(searchQuery)  // 검색 모드
  : getMockBlogs()                // 전체 목록
```

### 페이지네이션 계산
```typescript
const currentPage = parseInt(searchParams.page || "1")
const itemsPerPage = 9
const totalPages = Math.ceil(allBlogs.length / itemsPerPage)
const startIndex = (currentPage - 1) * itemsPerPage
const blogs = allBlogs.slice(startIndex, startIndex + itemsPerPage)
```

### 조건부 렌더링
```typescript
{blogs.length === 0 ? (
  <EmptyState searchQuery={searchQuery} />
) : (
  <>
    <BlogGrid>...</BlogGrid>
    {totalPages > 1 && <Pagination ... />}
  </>
)}
```

---

## 구현 단계

1. [x] Create HomePage file (`app/page.tsx`)
2. [x] Import PageContainer, BlogGrid, BlogCard, Pagination, EmptyState
3. [x] Import getMockBlogs, searchMockBlogs
4. [x] Define HomePageProps interface (searchParams)
5. [x] Implement blog data loading (search + pagination)
6. [x] Calculate pagination (totalPages, startIndex, slice)
7. [x] Render BlogGrid with BlogCard components
8. [x] Render Pagination (if totalPages > 1)
9. [x] Render EmptyState (if no blogs)
10. [x] Test page rendering
11. [x] Test search functionality
12. [x] Test pagination
13. [x] Test responsive design

---

## 완료 조건

### Functionality
- [x] HomePage renders at `/`
- [x] Blogs display in grid
- [x] Search works (via SearchBar in Header)
- [x] Pagination works (page numbers)
- [x] BlogCard click navigates to detail page
- [x] EmptyState shows when no results

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 1)
- [x] Light gray background (#F5F5F5)
- [x] 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- [x] 24px gap between cards
- [x] Pagination centered at bottom
- [x] Responsive on all breakpoints

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Follows Next.js 15 App Router conventions
- [x] Server Component (async, searchParams)
- [x] Clean code structure

### Integration
- [x] Integrates with PageContainer
- [x] Uses BlogGrid, BlogCard, Pagination, EmptyState
- [x] Mock data functions work correctly
- [x] SearchBar in Header passes query params

---

## 테스트 체크리스트

- [x] Page load test (renders at `/`)
- [x] Blog grid display test (9 blogs per page)
- [x] Search test (query parameter `?search=keyword`)
- [x] Pagination test (page parameter `?page=2`)
- [x] Combined test (`?search=keyword&page=2`)
- [x] Empty state test (no search results)
- [x] Card click test (navigate to detail)
- [x] Responsive test (mobile, tablet, desktop)
- [x] Accessibility test (keyboard navigation)

---

## 참고사항

- HomePage는 Server Component (searchParams 사용)
- searchParams는 Next.js 15 App Router에서 자동 제공
- Mock 데이터는 `lib/data/mockBlogs.ts`에서 관리
- 검색 기능은 Header의 SearchBar에서 URL query parameter로 전달
- 페이지네이션은 URL query parameter 기반 (클라이언트 사이드 상태 없음)
- 추후 Supabase 연동 시 getMockBlogs → Supabase query로 교체
- 실시간 검색은 Phase 8 이후 추가 가능 (debounce + client component)
