# PostDetailPage

## 개요
**Phase**: Phase 5 - 블로그 상세 페이지
**파일 경로**: `app/blog/[id]/page.tsx`
**UI 참조**: `blog-practice.pdf` - Page 3 (Post Detail)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 개별 블로그 글의 상세 내용과 댓글을 표시하는 페이지
**타입**: Page Component (Dynamic Route)
**위치**: `/blog/[id]` 라우트

---

## 요구사항

### 기능 요구사항
- [ ] Dynamic route parameter로 블로그 ID 받기
- [ ] Mock 블로그 데이터 로드 (ID 기반)
- [ ] 블로그 상세 정보 표시 (제목, 작성자, 날짜, 내용)
- [ ] 댓글 목록 표시
- [ ] 댓글 작성 폼 표시 (로그인한 경우)
- [ ] 작성자인 경우 수정/삭제 버튼 표시
- [ ] 존재하지 않는 ID인 경우 404 처리

### UI 요구사항 (blog-practice.pdf - Page 3)
- [ ] 중앙 정렬 컨테이너 (최대 너비 800px)
- [ ] 상단: 블로그 제목 및 메타 정보
- [ ] 중단: 블로그 본문 (마크다운 렌더링)
- [ ] 하단: 댓글 섹션
- [ ] 수정/삭제 버튼 (작성자만)
- [ ] 뒤로가기 링크

### 접근성 요구사항
- [ ] `<main>` 시맨틱 태그 사용
- [ ] `<article>` 태그로 블로그 컨텐츠 래핑
- [ ] 명확한 heading 구조 (h1 → h2)
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button separator
```

### 내부 의존성
- Layout: `PageContainer` from `@/components/layout`
- Components: `BlogPost`, `CommentList`, `CommentForm`
- Mock Data: `getMockBlogById`, `getMockComments` from `@/lib/data/mockBlogs`
- Types: `Blog`, `Comment` from `@/types/blog.ts`
- Next.js: `notFound` from `next/navigation`

---

## 기본 구조

```typescript
import { notFound } from "next/navigation"
import { PageContainer } from "@/components/layout/PageContainer"
import { BlogPost } from "@/components/blog/BlogPost"
import { CommentList } from "@/components/blog/CommentList"
import { CommentForm } from "@/components/blog/CommentForm"
import { Separator } from "@/components/ui/separator"
import { getMockBlogById, getMockComments } from "@/lib/data/mockBlogs"

interface PostDetailPageProps {
  params: {
    id: string
  }
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = params

  // Get blog data
  const blog = getMockBlogById(id)

  // If blog not found, show 404
  if (!blog) {
    notFound()
  }

  // Get comments for this blog
  const comments = getMockComments(id)

  return (
    <PageContainer className="py-8">
      <div className="max-w-3xl mx-auto">
        {/* Blog Post */}
        <BlogPost blog={blog} />

        {/* Separator */}
        <Separator className="my-8" />

        {/* Comments Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form (if logged in) */}
          <CommentForm blogId={blog.id} />

          {/* Comment List */}
          <CommentList comments={comments} />
        </section>
      </div>
    </PageContainer>
  )
}
```

---

## 구현 세부사항

### Dynamic Route Parameter
```typescript
interface PostDetailPageProps {
  params: {
    id: string  // URL에서 자동으로 추출
  }
}

// 사용 예:
// /blog/123 → params.id = "123"
// /blog/abc-def → params.id = "abc-def"
```

### 블로그 데이터 로드
```typescript
const blog = getMockBlogById(id)

// blog가 없으면 404 표시
if (!blog) {
  notFound()  // Next.js built-in 404 페이지
}
```

### 댓글 데이터 로드
```typescript
// 해당 블로그의 댓글만 가져오기
const comments = getMockComments(id)
```

### 페이지 구조
```typescript
<PageContainer>
  <div className="max-w-3xl mx-auto">    // 800px 최대 너비
    <BlogPost blog={blog} />             // 블로그 상세 내용
    <Separator />                        // 구분선
    <section>
      <h2>Comments</h2>                  // 댓글 섹션 제목
      <CommentForm />                    // 댓글 작성 폼
      <CommentList />                    // 댓글 목록
    </section>
  </div>
</PageContainer>
```

---

## 구현 단계

1. [x] Create PostDetailPage file (`app/blog/[id]/page.tsx`)
2. [x] Import PageContainer, BlogPost, CommentList, CommentForm
3. [x] Import getMockBlogById, getMockComments
4. [x] Import notFound from Next.js
5. [x] Define PostDetailPageProps interface
6. [x] Get blog ID from params
7. [x] Load blog data using getMockBlogById
8. [x] Add 404 handling (if blog not found)
9. [x] Load comments using getMockComments
10. [x] Render PageContainer with max-width container
11. [x] Render BlogPost component
12. [x] Add Separator
13. [x] Render Comments section with heading
14. [x] Render CommentForm (conditional on login)
15. [x] Render CommentList
16. [x] Test page with valid blog ID
17. [x] Test page with invalid blog ID (404)
18. [x] Test responsive design

---

## 완료 조건

### Functionality
- [x] PostDetailPage renders at `/blog/[id]`
- [x] Dynamic route parameter works correctly
- [x] Blog data loads based on ID
- [x] 404 page displays for invalid IDs
- [x] Comments load for the blog
- [x] CommentForm displays (if logged in)
- [x] CommentList displays all comments

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 3)
- [x] Maximum width 800px (3xl)
- [x] BlogPost displays at top
- [x] Separator between blog and comments
- [x] Comments section below
- [x] Comment count displays
- [x] Responsive on all breakpoints

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Follows Next.js 15 App Router conventions
- [x] Server Component (async, params)
- [x] Clean code structure

### Integration
- [x] Integrates with PageContainer
- [x] Uses BlogPost, CommentList, CommentForm components
- [x] Mock data functions work correctly
- [x] notFound() triggers 404 page

---

## 테스트 체크리스트

- [x] Page load test (valid blog ID)
- [x] 404 test (invalid blog ID)
- [x] Blog data display test (title, content, author, date)
- [x] Comments display test (all comments for blog)
- [x] CommentForm display test (logged in user)
- [x] CommentForm hidden test (not logged in)
- [x] Navigation test (from homepage to detail)
- [x] Responsive test (mobile, tablet, desktop)
- [x] Accessibility test (keyboard navigation, screen reader)

---

## 참고사항

- PostDetailPage는 Server Component (기본)
- Dynamic Route: `[id]` 폴더 구조로 구현
- params는 Next.js 15 App Router에서 자동 제공
- notFound()는 Next.js built-in 함수 (app/not-found.tsx 렌더링)
- Mock 데이터는 `lib/data/mockBlogs.ts`에서 관리
- 추후 Supabase 연동 시 getMockBlogById → Supabase query로 교체
- 댓글 기능은 Client Component (CommentForm, CommentList)
- 작성자 확인 로직은 BlogPost 컴포넌트에서 처리 (수정/삭제 버튼)

### generateStaticParams (선택사항)
```typescript
// Static Site Generation (SSG)를 위한 함수
// 빌드 타임에 모든 블로그 ID 페이지 생성
export async function generateStaticParams() {
  const blogs = getMockBlogs()

  return blogs.map((blog) => ({
    id: blog.id,
  }))
}
```

### generateMetadata (선택사항)
```typescript
// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const blog = getMockBlogById(params.id)

  if (!blog) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: blog.title,
    description: blog.content.substring(0, 150),
  }
}
```

### 404 커스터마이징
```typescript
// app/blog/[id]/not-found.tsx 생성
export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold">Post Not Found</h2>
      <p className="text-gray-600 mt-2">
        The blog post you're looking for doesn't exist.
      </p>
      <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
        Back to Home
      </Link>
    </div>
  )
}
```
