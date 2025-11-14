# 댓글 표시 구현 계획

## 개요

블로그 글에 대한 댓글 목록 표시 기능 구현
- Mock Data에서 댓글 데이터 가져오기
- 댓글 목록 렌더링
- 빈 상태 처리
- 작성자 정보 표시
- 시간 표시 (상대 시간)

---

## Task List

### 0. 사전 준비
- [ ] Mock Data 확인 (`lib/data/mockComments.ts`)
- [ ] shadcn/ui 컴포넌트 설치: `npx shadcn@latest add card separator`
- [ ] 타입 정의 파일 생성 (`types/comment.ts`)
- [ ] 유틸 함수 확인 (`lib/utils/text.ts`: formatRelativeTime)

### 1. Comment 타입 정의
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `types/comment.ts`

**요구사항:**
- [ ] Comment 인터페이스 정의
- [ ] TypeScript 타입 안정성 확보
- [ ] Mock Data 구조와 일치

**의존성:**
- 없음 (기본 TypeScript)

**기본 구조:**
```typescript
export interface Comment {
  id: string
  blogId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}
```

**구현 세부사항:**
- id: UUID 문자열
- blogId: 댓글이 달린 블로그 글 ID
- authorId: 댓글 작성자 ID (현재는 Mock용, 추후 auth.users 참조)
- authorName: 작성자 이름
- content: 댓글 내용
- createdAt: ISO 타임스탬프 문자열
- 추후 Supabase 연동 시에도 동일한 구조 사용

**완료 조건:**
- [ ] 타입 정의 파일 생성 완료
- [ ] export 확인
- [ ] 다른 파일에서 import 가능 확인

---

### 2. CommentItem 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/CommentItem.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 작성자 이름 표시 (볼드)
- [ ] 작성 시간 표시 (상대 시간, 예: "2 hours ago")
- [ ] 댓글 내용 표시
- [ ] 아바타 또는 이니셜 표시
- [ ] 구분선 (마지막 아이템 제외)
- [ ] whitespace-pre-wrap으로 줄바꿈 유지

**의존성:**
- types/comment.ts: Comment 인터페이스
- lib/utils/text.ts: formatRelativeTime

**기본 구조:**
```typescript
import { formatRelativeTime } from "@/lib/utils/text"
import type { Comment } from "@/types/comment"

interface CommentItemProps {
  comment: Comment
  isLast?: boolean
}

export function CommentItem({ comment, isLast = false }: CommentItemProps) {
  return (
    <div className={`py-4 ${!isLast ? "border-b" : ""}`}>
      <div className="flex items-start gap-3">
        {/* 아바타 */}
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
          {comment.authorName.charAt(0).toUpperCase()}
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {comment.authorName}
            </span>
            <span className="text-sm text-gray-500">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  )
}
```

**구현 세부사항:**
- flex items-start gap-3로 아바타와 내용 배치
- 아바타: h-10 w-10 rounded-full, 회색 배경, 이니셜 표시
- flex-shrink-0으로 아바타 크기 고정
- 작성자 이름: font-semibold text-gray-900
- 시간: text-sm text-gray-500, formatRelativeTime 사용
- 내용: whitespace-pre-wrap으로 줄바꿈 유지, break-words로 긴 단어 처리
- 마지막 아이템이 아니면 border-b 추가

**완료 조건:**
- [ ] 아바타 표시 확인
- [ ] 작성자 이름 및 시간 표시 확인
- [ ] 댓글 내용 표시 확인
- [ ] 줄바꿈 유지 확인
- [ ] 구분선 표시 확인

---

### 3. EmptyComments 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/EmptyComments.tsx`

**요구사항:**
- [ ] Server Component
- [ ] "No comments yet" 메시지
- [ ] "Be the first to comment!" 서브 메시지
- [ ] 아이콘 (MessageSquare)
- [ ] 중앙 정렬
- [ ] 적절한 여백 (py-12)

**의존성:**
- lucide-react: MessageSquare 아이콘

**기본 구조:**
```typescript
import { MessageSquare } from "lucide-react"

export function EmptyComments() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <MessageSquare className="h-12 w-12 text-gray-400 mb-3" />
      <h3 className="text-lg font-semibold text-gray-700 mb-1">
        No comments yet
      </h3>
      <p className="text-sm text-gray-500">
        Be the first to comment!
      </p>
    </div>
  )
}
```

**구현 세부사항:**
- flex flex-col items-center justify-center로 중앙 정렬
- py-12로 수직 여백, text-center로 텍스트 중앙 정렬
- MessageSquare 아이콘: h-12 w-12, 회색 색상
- 제목: text-lg font-semibold text-gray-700
- 서브 메시지: text-sm text-gray-500

**완료 조건:**
- [ ] 빈 상태 메시지 표시 확인
- [ ] 아이콘 표시 확인
- [ ] 중앙 정렬 확인
- [ ] 레이아웃 확인

---

### 4. CommentList 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/CommentList.tsx`

**요구사항:**
- [ ] Server Component
- [ ] Mock Data에서 댓글 데이터 가져오기
- [ ] blog_id로 필터링
- [ ] created_at 오름차순 정렬 (오래된 댓글이 위로)
- [ ] CommentItem 컴포넌트 렌더링
- [ ] EmptyComments 처리

**의존성:**
- CommentItem 컴포넌트
- EmptyComments 컴포넌트
- lib/data/mockComments.ts: getMockComments
- types/comment.ts: Comment 인터페이스

**기본 구조:**
```typescript
import { getMockComments } from "@/lib/data/mockComments"
import { CommentItem } from "./CommentItem"
import { EmptyComments } from "./EmptyComments"

interface CommentListProps {
  blogId: string
}

export function CommentList({ blogId }: CommentListProps) {
  // Mock Data에서 해당 블로그의 댓글 가져오기
  const comments = getMockComments(blogId)

  if (!comments || comments.length === 0) {
    return <EmptyComments />
  }

  return (
    <div className="space-y-0">
      {comments.map((comment, index) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isLast={index === comments.length - 1}
        />
      ))}
    </div>
  )
}
```

**구현 세부사항:**
- Server Component로 구현
- getMockComments(blogId)로 해당 블로그의 댓글 가져오기
- Mock Data 함수에서 이미 blog_id 필터링 및 정렬 처리
- 댓글 없음 시 EmptyComments 표시
- space-y-0으로 간격 제거 (CommentItem 내부에서 처리)
- isLast prop으로 마지막 아이템 표시
- 추후 Supabase 연동 시 getMockComments → Supabase 쿼리로 교체

**완료 조건:**
- [ ] Mock Data 가져오기 확인
- [ ] 댓글 목록 렌더링 확인
- [ ] 빈 상태 처리 확인
- [ ] 정렬 순서 확인

---

### 5. CommentSection 컴포넌트 (통합)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/CommentSection.tsx`

**요구사항:**
- [ ] Server Component
- [ ] 섹션 제목 "Comments" (h2)
- [ ] 댓글 수 표시 (예: "Comments (3)")
- [ ] CommentList 컴포넌트 포함
- [ ] CommentForm 컴포넌트 포함 (필수 구현)
- [ ] 구분선 (상단)
- [ ] 적절한 여백 및 레이아웃

**의존성:**
- CommentList 컴포넌트
- CommentForm 컴포넌트
- lib/data/mockComments.ts: getMockComments (댓글 수 조회용)
- components/ui/separator

**기본 구조:**
```typescript
import { getMockComments } from "@/lib/data/mockComments"
import { CommentList } from "./CommentList"
import { CommentForm } from "./CommentForm"
import { Separator } from "@/components/ui/separator"

interface CommentSectionProps {
  blogId: string
}

export function CommentSection({ blogId }: CommentSectionProps) {
  // 댓글 수 조회
  const comments = getMockComments(blogId)
  const commentCount = comments.length

  return (
    <section className="mt-12">
      <Separator className="mb-8" />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Comments {commentCount > 0 && `(${commentCount})`}
        </h2>
      </div>

      {/* 댓글 폼 */}
      <CommentForm blogId={blogId} />

      {/* 댓글 목록 */}
      <CommentList blogId={blogId} />
    </section>
  )
}
```

**구현 세부사항:**
- section 태그로 시맨틱 마크업
- mt-12로 블로그 본문과 댓글 섹션 간격
- Separator 컴포넌트로 구분선 추가
- getMockComments로 댓글 수 조회 (Mock Data)
- 댓글이 있을 때만 개수 표시
- h2로 섹션 제목, text-2xl font-bold
- CommentForm 포함 (필수)
- CommentList 포함
- 추후 Supabase 연동 시 getMockComments → Supabase count 쿼리로 교체

**완료 조건:**
- [ ] 섹션 제목 표시 확인
- [ ] 댓글 수 표시 확인
- [ ] 구분선 표시 확인
- [ ] CommentList 통합 확인
- [ ] 레이아웃 확인

---

### 6. BlogPost 컴포넌트에 CommentSection 통합
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/blog/BlogPost.tsx`

**요구사항:**
- [ ] CommentSection 컴포넌트 import
- [ ] BlogContent 하단에 CommentSection 추가
- [ ] blogId prop 전달

**의존성:**
- CommentSection 컴포넌트

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
      <CommentSection blogId={blog.id} />
    </article>
  )
}
```

**구현 세부사항:**
- CommentSection import 추가
- BlogContent 하단에 CommentSection 추가
- blog.id를 blogId prop으로 전달
- BlogActions에 authorName 전달 (Mock 사용자 확인용)
- 기존 레이아웃 유지

**완료 조건:**
- [ ] CommentSection 통합 확인
- [ ] blogId 전달 확인
- [ ] 전체 레이아웃 확인

---

## 구현 순서

1. **타입 정의**: `types/comment.ts` 생성
2. **shadcn/ui 설치**: separator 컴포넌트
3. **기본 컴포넌트**: CommentItem, EmptyComments
4. **목록 컴포넌트**: CommentList
5. **통합 컴포넌트**: CommentSection
6. **BlogPost 통합**: CommentSection 추가

---

## 검증 체크리스트

### Comment 타입
- [ ] 타입 정의 파일 생성 확인
- [ ] export/import 확인
- [ ] Supabase 테이블 구조와 일치 확인

### CommentItem
- [ ] 아바타 표시 확인
- [ ] 작성자 이름 표시 확인
- [ ] 시간 표시 확인 (상대 시간)
- [ ] 댓글 내용 표시 확인
- [ ] 줄바꿈 유지 확인
- [ ] 구분선 표시 확인 (마지막 제외)

### EmptyComments
- [ ] 빈 상태 메시지 표시 확인
- [ ] 아이콘 표시 확인
- [ ] 중앙 정렬 확인
- [ ] 레이아웃 확인

### CommentList
- [ ] Mock Data 가져오기 확인
- [ ] blog_id 필터링 확인
- [ ] 정렬 순서 확인 (오래된 것부터)
- [ ] 댓글 목록 렌더링 확인
- [ ] 빈 상태 처리 확인

### CommentSection
- [ ] 섹션 제목 표시 확인
- [ ] 댓글 수 표시 확인
- [ ] 구분선 표시 확인
- [ ] CommentList 통합 확인
- [ ] 레이아웃 확인

### BlogPost 통합
- [ ] CommentSection 통합 확인
- [ ] blogId 전달 확인
- [ ] 전체 레이아웃 확인
- [ ] 블로그 상세 페이지에서 댓글 표시 확인

---

## 참고사항

### Mock Data 구조 (lib/data/mockComments.ts)
```typescript
import type { Comment } from "@/types/comment"

export const mockComments: Comment[] = [
  {
    id: "1",
    blogId: "1",
    authorId: "user2",
    authorName: "Jane Smith",
    content: "Great article! Very helpful.",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3시간 전
  },
  {
    id: "2",
    blogId: "1",
    authorId: "user3",
    authorName: "Bob Johnson",
    content: "Thanks for sharing this!",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1시간 전
  },
  // 더 많은 Mock 댓글 데이터...
]

// 특정 블로그의 댓글 가져오기 (blogId로 필터링, createdAt 오름차순)
export function getMockComments(blogId: string): Comment[] {
  return mockComments
    .filter(comment => comment.blogId === blogId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}
```

**추후 Supabase 연동 시 테이블 구조**:
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX comments_blog_id_idx ON comments(blog_id);
CREATE INDEX comments_created_at_idx ON comments(created_at);
```

### formatRelativeTime 재사용
```typescript
// lib/utils/text.ts에 이미 구현되어 있음
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

### 아바타 컴포넌트 재사용
```typescript
// 블로그 헤더에서 사용한 아바타 패턴 재사용
// 추후 공통 Avatar 컴포넌트로 분리 가능
```

### 성능 최적화
- Mock Data는 메모리 기반이므로 빠른 응답 속도
- Server Component로 초기 로드 성능 향상
- 추후 Supabase 연동 시 인덱스 및 쿼리 최적화 필요

### 접근성 개선
- section 태그로 시맨틱 마크업
- ARIA labels 추가 (필요 시)
- 키보드 네비게이션 지원
- 스크린 리더 지원

### 추가 기능 아이디어
- 댓글 수정 기능 (작성자만)
- 댓글 삭제 기능 (작성자만)
- 댓글 신고 기능
- 대댓글 (nested comments)
- 댓글 좋아요
- 댓글 페이지네이션 (많은 댓글)
- 실시간 댓글 업데이트 (Supabase Realtime - 추후)
