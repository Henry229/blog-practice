# BlogCard

## 개요
**Phase**: Phase 4 - 블로그 목록 페이지
**파일 경로**: `components/blog/BlogCard.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 개별 블로그 글을 카드 형식으로 표시하는 컴포넌트
**타입**: Feature Component
**위치**: BlogGrid 내부

---

## 요구사항

### 기능 요구사항
- [ ] 블로그 데이터 표시 (제목, 내용 미리보기, 작성자, 날짜)
- [ ] 클릭 시 블로그 상세 페이지로 이동
- [ ] 작성자 아바타 표시
- [ ] 날짜 포맷팅 (예: "2 days ago", "Jan 15, 2024")
- [ ] 콘텐츠 길이 제한 (미리보기)

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] 흰색 배경 카드
- [ ] 부드러운 그림자 효과
- [ ] 호버 시 그림자 강화
- [ ] 상단: 작성자 정보 (아바타 + 이름 + 날짜)
- [ ] 중단: 제목 (최대 2줄)
- [ ] 하단: 내용 미리보기 (최대 3줄)
- [ ] 모서리 둥글게 (rounded)
- [ ] 내부 패딩: 24px (p-6)

### 접근성 요구사항
- [ ] 카드 전체가 클릭 가능한 링크
- [ ] 명확한 호버 상태
- [ ] 키보드 탐색 지원
- [ ] 제목을 링크 텍스트로 사용

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add card avatar badge
```

### 내부 의존성
- Type: `Blog` from `@/types/blog.ts`
- Utilities: `formatDate` or `formatRelativeTime` (to be created)
- Next.js: `Link` from `next/link`

---

## 기본 구조

```typescript
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Blog } from "@/types/blog"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  // Format date
  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Get author initials for avatar fallback
  const authorInitials = blog.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Truncate content for preview (first 150 characters)
  const contentPreview =
    blog.content.length > 150
      ? blog.content.substring(0, 150) + "..."
      : blog.content

  return (
    <Link href={`/blog/${blog.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={blog.author.avatar}
                alt={blog.author.name}
              />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {blog.author.name}
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {contentPreview}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
```

---

## 구현 세부사항

### 카드 구조
```typescript
<Link href={`/blog/${blog.id}`}>          // 전체 카드가 링크
  <Card>
    <CardHeader>                          // 작성자 정보
      <Avatar />                          // 아바타
      <div>
        <p>{author.name}</p>              // 작성자 이름
        <p>{formattedDate}</p>            // 날짜
      </div>
    </CardHeader>
    <CardContent>                         // 글 내용
      <h3>{title}</h3>                    // 제목 (최대 2줄)
      <p>{contentPreview}</p>             // 미리보기 (최대 3줄)
    </CardContent>
  </Card>
</Link>
```

### 날짜 포맷팅
```typescript
// Option 1: Standard date format
const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})
// Result: "Jan 15, 2024"

// Option 2: Relative time (추후 추가 가능)
// "2 days ago", "1 week ago" 등
```

### 콘텐츠 미리보기
```typescript
// 첫 150자만 표시하고 "..." 추가
const contentPreview =
  blog.content.length > 150
    ? blog.content.substring(0, 150) + "..."
    : blog.content
```

### 텍스트 라인 제한
```typescript
// Tailwind CSS line-clamp 유틸리티
className="line-clamp-2"  // 제목: 최대 2줄
className="line-clamp-3"  // 내용: 최대 3줄
```

### 호버 효과
```typescript
// 그림자 효과
className="transition-shadow hover:shadow-lg"

// 제목 색상 변화
className="group-hover:text-blue-600 transition-colors"
```

### 작성자 이니셜 (Avatar Fallback)
```typescript
const authorInitials = blog.author.name
  .split(" ")              // ["John", "Doe"]
  .map((n) => n[0])        // ["J", "D"]
  .join("")                // "JD"
  .toUpperCase()           // "JD"
```

---

## 구현 단계

1. [x] Create BlogCard component file (`components/blog/BlogCard.tsx`)
2. [x] Import required dependencies (Link, Card, Avatar, Blog type)
3. [x] Define BlogCardProps interface
4. [x] Implement date formatting logic
5. [x] Implement author initials logic
6. [x] Implement content preview truncation
7. [x] Create Link wrapper for entire card
8. [x] Add Card with hover effects
9. [x] Implement CardHeader with author info
10. [x] Add Avatar with fallback
11. [x] Implement CardContent with title and preview
12. [x] Add line-clamp for title (2 lines) and content (3 lines)
13. [x] Test card rendering with different blog data
14. [x] Test hover effects
15. [x] Test navigation to detail page
16. [x] Test responsive design

---

## 완료 조건

### Functionality
- [x] BlogCard renders blog data correctly
- [x] Card click navigates to detail page (`/blog/{id}`)
- [x] Date displays in formatted style
- [x] Avatar shows image or fallback initials
- [x] Content truncates properly for preview

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 1)
- [x] White background with shadow
- [x] Hover shadow enhancement
- [x] Author info displays at top
- [x] Title limited to 2 lines
- [x] Content preview limited to 3 lines
- [x] Rounded corners
- [x] 24px internal padding

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Clean component structure
- [x] Proper use of shadcn/ui components

### Integration
- [x] Works inside BlogGrid
- [x] Integrates with Blog type
- [x] Navigation works correctly
- [x] Responsive on all breakpoints

---

## 테스트 체크리스트

- [x] Card render test (displays all blog data)
- [x] Navigation test (click card → detail page)
- [x] Date formatting test (correct format)
- [x] Avatar test (image loads or shows initials)
- [x] Content truncation test (150 characters + "...")
- [x] Line clamp test (title 2 lines, content 3 lines)
- [x] Hover effect test (shadow enhancement)
- [x] Responsive test (mobile, tablet, desktop)
- [x] Accessibility test (keyboard navigation)
- [x] Long title test (ellipsis after 2 lines)
- [x] Long content test (ellipsis after 3 lines)

---

## 참고사항

- BlogCard는 Server Component로 사용 가능 (상태 없음)
- Next.js Link 컴포넌트로 클라이언트 사이드 라우팅
- line-clamp는 Tailwind CSS 플러그인 필요 (v3.3+에서 기본 포함)
- Avatar 컴포넌트는 이미지 로드 실패 시 자동으로 Fallback 표시
- Blog 타입은 `types/blog.ts`에 정의:
  ```typescript
  export interface Blog {
    id: string
    title: string
    content: string
    author: {
      name: string
      avatar: string
    }
    created_at: string
    updated_at: string
  }
  ```
- 추후 Supabase 연동 시 author 정보는 JOIN 또는 별도 쿼리로 가져옴
- 현재는 Mock 데이터에서 author 정보 포함
- 추후 기능 확장:
  - 태그/카테고리 표시 (Badge 컴포넌트)
  - 좋아요/조회수 표시
  - 댓글 수 표시
  - "Read more" 버튼 추가

### 날짜 포맷 유틸리티 (선택사항)
```typescript
// lib/utils/formatDate.ts
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(dateString)
}
```
