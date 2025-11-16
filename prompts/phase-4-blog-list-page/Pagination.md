# Pagination

## 개요
**Phase**: Phase 4 - 블로그 목록 페이지
**파일 경로**: `components/blog/Pagination.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage, 하단)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 블로그 목록 페이지 하단에 페이지 번호를 표시하고 탐색하는 컴포넌트
**타입**: Feature Component
**위치**: HomePage 하단, BlogGrid 아래

---

## 요구사항

### 기능 요구사항
- [ ] 현재 페이지 표시
- [ ] 전체 페이지 수 표시
- [ ] 이전/다음 페이지 버튼
- [ ] 페이지 번호 버튼 (최대 5개 표시)
- [ ] URL query parameter로 페이지 변경 (`?page=2`)
- [ ] 검색 쿼리 유지 (`?search=keyword&page=2`)
- [ ] 첫/마지막 페이지에서 비활성화 처리

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] 중앙 정렬
- [ ] 페이지 하단 배치
- [ ] 이전/다음 버튼
- [ ] 현재 페이지 강조 (파란색 배경)
- [ ] 호버 효과
- [ ] 비활성화 상태 (회색, 클릭 불가)

### 접근성 요구사항
- [ ] `<nav>` 시맨틱 태그 사용
- [ ] `aria-label="pagination"`
- [ ] 현재 페이지 `aria-current="page"`
- [ ] 키보드 탐색 지원
- [ ] 비활성화 버튼 `aria-disabled="true"`

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button
```

### 내부 의존성
- Next.js: `Link` from `next/link`
- Icons: `ChevronLeft`, `ChevronRight` from `lucide-react` (선택사항)

---

## 기본 구조

```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  searchQuery?: string
}

export function Pagination({
  currentPage,
  totalPages,
  searchQuery = "",
}: PaginationProps) {
  // Build URL with query params
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (page > 1) params.set("page", page.toString())
    return `/?${params.toString()}`
  }

  // Generate page numbers to display (max 5)
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show subset of pages with current page in center
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)

      // Adjust if near boundaries
      if (currentPage <= 3) {
        start = 1
        end = maxVisible
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1
        end = totalPages
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8"
      aria-label="pagination"
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
      >
        {currentPage === 1 ? (
          <span className="cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          asChild={page !== currentPage}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page === currentPage ? (
            <span>{page}</span>
          ) : (
            <Link href={buildUrl(page)}>{page}</Link>
          )}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
      >
        {currentPage === totalPages ? (
          <span className="cursor-not-allowed">
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={buildUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </nav>
  )
}
```

---

## 구현 세부사항

### URL 생성 로직
```typescript
const buildUrl = (page: number) => {
  const params = new URLSearchParams()
  if (searchQuery) params.set("search", searchQuery)
  if (page > 1) params.set("page", page.toString())
  return `/?${params.toString()}`
}

// Examples:
// buildUrl(1) → "/"
// buildUrl(2) → "/?page=2"
// buildUrl(2) with search → "/?search=keyword&page=2"
```

### 페이지 번호 생성 로직
```typescript
// 최대 5개 페이지 번호 표시
// 현재 페이지를 중심으로 좌우 2개씩

// 예시:
// Total: 10, Current: 1 → [1, 2, 3, 4, 5]
// Total: 10, Current: 5 → [3, 4, 5, 6, 7]
// Total: 10, Current: 10 → [6, 7, 8, 9, 10]
// Total: 3, Current: 2 → [1, 2, 3]
```

### 이전/다음 버튼 비활성화
```typescript
// 첫 페이지에서 이전 버튼 비활성화
disabled={currentPage === 1}

// 마지막 페이지에서 다음 버튼 비활성화
disabled={currentPage === totalPages}

// 비활성화 시 Link 대신 span 사용
{currentPage === 1 ? (
  <span className="cursor-not-allowed">
    <ChevronLeft />
  </span>
) : (
  <Link href={buildUrl(currentPage - 1)}>
    <ChevronLeft />
  </Link>
)}
```

### 현재 페이지 강조
```typescript
// variant="default" (파란색 배경)
<Button
  variant={page === currentPage ? "default" : "outline"}
  aria-current={page === currentPage ? "page" : undefined}
>
  {page}
</Button>
```

---

## 구현 단계

1. [x] Create Pagination component file (`components/blog/Pagination.tsx`)
2. [x] Import dependencies (Link, Button, Icons)
3. [x] Define PaginationProps interface
4. [x] Implement buildUrl function (query param generation)
5. [x] Implement getPageNumbers function (page number logic)
6. [x] Create nav element with pagination semantics
7. [x] Add Previous button with disabled state
8. [x] Add page number buttons with current page highlight
9. [x] Add Next button with disabled state
10. [x] Add accessibility attributes (aria-label, aria-current, aria-disabled)
11. [x] Test pagination navigation
12. [x] Test with search query preservation
13. [x] Test edge cases (first page, last page, single page)
14. [x] Test responsive design

---

## 완료 조건

### Functionality
- [x] Pagination displays correct page numbers
- [x] Current page is highlighted
- [x] Previous/Next buttons work correctly
- [x] First/Last page buttons are disabled appropriately
- [x] Search query is preserved in URL
- [x] Navigation updates URL correctly
- [x] Page changes trigger server component re-render

### UI/UX
- [x] Centered at bottom of page
- [x] Current page has blue background
- [x] Hover effects on buttons
- [x] Disabled buttons are visually distinct (gray, no hover)
- [x] Consistent spacing between buttons
- [x] Icons display correctly (chevron left/right)

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Clean component structure
- [x] Proper use of shadcn/ui Button component

### Integration
- [x] Works with HomePage searchParams
- [x] Integrates with search functionality
- [x] URL query parameters are correctly formatted
- [x] Responsive on all breakpoints

---

## 테스트 체크리스트

- [x] Pagination render test (displays page numbers)
- [x] Current page highlight test (page 1, 5, 10)
- [x] Previous button test (disabled on page 1)
- [x] Next button test (disabled on last page)
- [x] Page number click test (navigates correctly)
- [x] Search query preservation test (`?search=keyword&page=2`)
- [x] URL format test (correct query params)
- [x] Edge case test (1 page total, 100 pages total)
- [x] Page number subset test (max 5 visible)
- [x] Responsive test (mobile, desktop)
- [x] Accessibility test (keyboard navigation, screen reader)

---

## 참고사항

- Pagination은 Server Component로 사용 가능 (상태 없음)
- Next.js Link 컴포넌트로 클라이언트 사이드 라우팅
- URL query parameter로 상태 관리 (클라이언트 상태 불필요)
- searchParams 변경 시 HomePage가 자동으로 리렌더링
- 검색과 페이지네이션을 동시에 사용 가능
- lucide-react 아이콘 라이브러리 사용 (ChevronLeft, ChevronRight)
- 추후 기능 확장:
  - "First" / "Last" 버튼 추가
  - 페이지 입력 필드 추가 ("Go to page X")
  - 페이지당 아이템 수 선택 (10, 25, 50개)
  - 무한 스크롤로 전환 (선택사항)

### 아이콘 없이 구현 (선택사항)
```typescript
// lucide-react 없이 텍스트로 구현
<Button>Previous</Button>
<Button>Next</Button>

// 또는 HTML 엔티티 사용
<Button>&lt;</Button>  // <
<Button>&gt;</Button>  // >

// 또는 Unicode 사용
<Button>‹</Button>  // ‹
<Button>›</Button>  // ›
```

### 페이지당 아이템 수 선택 기능 추가 (선택사항)
```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  searchQuery?: string
  itemsPerPage?: number  // 추가
  onItemsPerPageChange?: (value: number) => void  // 추가
}

// UI에 Select 컴포넌트 추가
<Select value={itemsPerPage.toString()} onValueChange={...}>
  <SelectItem value="9">9 per page</SelectItem>
  <SelectItem value="18">18 per page</SelectItem>
  <SelectItem value="27">27 per page</SelectItem>
</Select>
```

### SEO 최적화 (선택사항)
```typescript
// 이전/다음 페이지에 rel 속성 추가
<Link
  href={buildUrl(currentPage - 1)}
  rel="prev"
  aria-label="Go to previous page"
>
  <ChevronLeft />
</Link>

<Link
  href={buildUrl(currentPage + 1)}
  rel="next"
  aria-label="Go to next page"
>
  <ChevronRight />
</Link>
```
