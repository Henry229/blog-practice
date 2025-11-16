# EmptyState

## 개요
**Phase**: Phase 4 - 블로그 목록 페이지
**파일 경로**: `components/blog/EmptyState.tsx`
**UI 참조**: 컴포넌트 계획 참조 (PDF에는 미포함)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 검색 결과가 없거나 블로그 글이 없을 때 표시하는 빈 상태 컴포넌트
**타입**: Feature Component
**위치**: HomePage 내부 (조건부 렌더링)

---

## 요구사항

### 기능 요구사항
- [ ] 검색 결과 없음 메시지 표시
- [ ] 검색 쿼리 표시 (검색한 경우)
- [ ] 검색 초기화 링크 (모든 글 보기)
- [ ] 빈 상태 아이콘 표시 (선택사항)
- [ ] 도움 텍스트 제공

### UI 요구사항
- [ ] 중앙 정렬
- [ ] 큰 아이콘 또는 이미지
- [ ] 명확한 메시지
- [ ] 회색 텍스트 (secondary color)
- [ ] "모든 글 보기" 링크 (파란색)
- [ ] 충분한 수직 여백 (py-12 이상)

### 접근성 요구사항
- [ ] 명확한 메시지 텍스트
- [ ] 링크에 명확한 설명
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
# No specific shadcn/ui components needed
```

### 내부 의존성
- Next.js: `Link` from `next/link`
- Icons: `SearchX`, `FileText` from `lucide-react` (선택사항)

---

## 기본 구조

```typescript
import Link from "next/link"
import { SearchX, FileText } from "lucide-react"

interface EmptyStateProps {
  searchQuery?: string
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      {searchQuery ? (
        <SearchX className="h-16 w-16 text-gray-300 mb-4" />
      ) : (
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
      )}

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        {searchQuery ? "No results found" : "No blog posts yet"}
      </h2>

      {/* Description */}
      <p className="text-gray-500 mb-6 max-w-md">
        {searchQuery ? (
          <>
            We couldn't find any posts matching{" "}
            <span className="font-medium text-gray-700">
              "{searchQuery}"
            </span>
            . Try searching with different keywords.
          </>
        ) : (
          "There are no blog posts available at the moment. Check back later!"
        )}
      </p>

      {/* Action */}
      {searchQuery && (
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          View all posts
        </Link>
      )}
    </div>
  )
}
```

---

## 구현 세부사항

### 조건부 메시지
```typescript
// 검색 결과 없음
{searchQuery ? (
  <>
    <SearchX />
    <h2>No results found</h2>
    <p>We couldn't find any posts matching "{searchQuery}"</p>
    <Link href="/">View all posts</Link>
  </>
) : (
  // 전체 글 없음
  <>
    <FileText />
    <h2>No blog posts yet</h2>
    <p>There are no blog posts available at the moment.</p>
  </>
)}
```

### 검색 쿼리 표시
```typescript
// 검색어를 강조하여 표시
<span className="font-medium text-gray-700">
  "{searchQuery}"
</span>
```

### 검색 초기화 링크
```typescript
// 검색 결과가 없을 때만 표시
{searchQuery && (
  <Link href="/" className="...">
    View all posts
  </Link>
)}
```

### 아이콘 선택
```typescript
// SearchX: 검색 결과 없음
// FileText: 전체 글 없음
// 기타 옵션: Inbox, AlertCircle, Search
```

---

## 구현 단계

1. [x] Create EmptyState component file (`components/blog/EmptyState.tsx`)
2. [x] Import dependencies (Link, Icons)
3. [x] Define EmptyStateProps interface (searchQuery optional)
4. [x] Create container div with centering classes
5. [x] Add icon (conditional based on searchQuery)
6. [x] Add title (conditional text)
7. [x] Add description (conditional text with searchQuery highlight)
8. [x] Add "View all posts" link (conditional on searchQuery)
9. [x] Test with searchQuery prop
10. [x] Test without searchQuery prop
11. [x] Test responsive design
12. [x] Verify accessibility (keyboard navigation)

---

## 완료 조건

### Functionality
- [x] EmptyState renders correctly
- [x] Displays appropriate message based on searchQuery
- [x] Search query is highlighted in message
- [x] "View all posts" link works (navigates to `/`)
- [x] Icon changes based on context

### UI/UX
- [x] Centered vertically and horizontally
- [x] Large icon (64px)
- [x] Clear, readable text
- [x] Proper spacing (py-16)
- [x] Gray color scheme for secondary content
- [x] Blue link for action
- [x] Responsive on all breakpoints

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Clean component structure
- [x] Conditional rendering is clear

### Integration
- [x] Works in HomePage when blogs.length === 0
- [x] Receives searchQuery prop correctly
- [x] Link navigation works

---

## 테스트 체크리스트

- [x] Empty state render test (with searchQuery)
- [x] Empty state render test (without searchQuery)
- [x] Search query highlight test (displays correctly)
- [x] "View all posts" link test (navigates to `/`)
- [x] Icon test (SearchX for search, FileText for no posts)
- [x] Responsive test (mobile, desktop)
- [x] Accessibility test (keyboard navigation, text clarity)
- [x] Edge case test (empty searchQuery string)

---

## 참고사항

- EmptyState는 Server Component로 사용 가능 (상태 없음)
- lucide-react 아이콘 라이브러리 사용
- 검색 결과가 없을 때와 전체 글이 없을 때 다른 메시지 표시
- searchQuery prop이 있으면 "검색 결과 없음" 상태
- searchQuery prop이 없으면 "전체 글 없음" 상태
- 추후 기능 확장:
  - "Create new post" 버튼 추가 (로그인된 사용자)
  - 추천 검색어 표시
  - 최근 인기 글 표시 (대안 제안)
  - 애니메이션 추가 (fade-in)

### 아이콘 없이 구현 (선택사항)
```typescript
// lucide-react 없이 이모지 사용
<div className="text-6xl mb-4">
  {searchQuery ? "🔍" : "📝"}
</div>

// 또는 텍스트만 사용
<h2 className="text-3xl font-bold text-gray-700 mb-4">
  {searchQuery ? "🔍 No results found" : "📝 No blog posts yet"}
</h2>
```

### 애니메이션 추가 (선택사항)
```typescript
// Framer Motion 사용
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="flex flex-col items-center..."
>
  {/* content */}
</motion.div>
```

### 다국어 지원 (선택사항)
```typescript
interface EmptyStateProps {
  searchQuery?: string
  locale?: "en" | "ko"
}

const messages = {
  en: {
    noResults: "No results found",
    noResultsDesc: "We couldn't find any posts matching",
    noPosts: "No blog posts yet",
    noPostsDesc: "There are no blog posts available at the moment.",
    viewAll: "View all posts",
  },
  ko: {
    noResults: "검색 결과 없음",
    noResultsDesc: "다음 검색어와 일치하는 글을 찾을 수 없습니다:",
    noPosts: "아직 블로그 글이 없습니다",
    noPostsDesc: "현재 이용 가능한 블로그 글이 없습니다. 나중에 다시 확인해주세요!",
    viewAll: "모든 글 보기",
  },
}
```
