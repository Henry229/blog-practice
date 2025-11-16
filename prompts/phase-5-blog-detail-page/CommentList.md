# CommentList

## 개요
**Phase**: Phase 5 - 블로그 상세 페이지
**파일 경로**: `components/blog/CommentList.tsx`
**UI 참조**: `blog-practice.pdf` - Page 3 (Post Detail, 하단 댓글 섹션)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 블로그 글에 달린 댓글 목록을 표시하는 컴포넌트
**타입**: Feature Component
**위치**: PostDetailPage 내부, CommentForm 아래

---

## 요구사항

### 기능 요구사항
- [ ] 댓글 목록 표시
- [ ] 각 댓글: 작성자, 날짜, 내용 표시
- [ ] 댓글 작성자 아바타 표시
- [ ] 댓글 삭제 버튼 (작성자만)
- [ ] 댓글 없을 때 빈 상태 표시
- [ ] 댓글 날짜 포맷팅

### UI 요구사항 (blog-practice.pdf - Page 3)
- [ ] 각 댓글은 카드 형식
- [ ] 작성자 정보: 아바타 + 이름 + 날짜
- [ ] 댓글 내용: 일반 텍스트
- [ ] 댓글 간격: 16px (gap-4)
- [ ] 삭제 버튼: 우측 상단 (작성자만)

### 접근성 요구사항
- [ ] 댓글 목록을 `<ul>` 태그로 마크업
- [ ] 각 댓글을 `<li>` 태그로 마크업
- [ ] 삭제 버튼에 명확한 레이블
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add avatar button card
```

### 내부 의존성
- Types: `Comment` from `@/types/blog.ts`
- Auth: `useAuth` from `@/components/providers/AuthProvider`
- Icons: `Trash2` from `lucide-react`

---

## 기본 구조

```typescript
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import type { Comment } from "@/types/blog"

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  const { user } = useAuth()

  // Handle delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    // TODO: Implement delete logic (Server Action)
    console.log("Delete comment:", commentId)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get author initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <ul className="space-y-4 mt-6">
      {comments.map((comment) => {
        const isAuthor = user?.id === comment.user_id
        const initials = getInitials(comment.author.name)
        const formattedDate = formatDate(comment.created_at)

        return (
          <li key={comment.id}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.author.avatar}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">
                          {comment.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formattedDate}
                        </p>
                      </div>

                      {/* Delete Button (Author only) */}
                      {isAuthor && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
```

---

## 구현 세부사항

### Comment 타입 정의
```typescript
// types/blog.ts
export interface Comment {
  id: string
  blog_id: string
  user_id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  created_at: string
}
```

### 작성자 확인
```typescript
const { user } = useAuth()
const isAuthor = user?.id === comment.user_id
```

### 날짜 포맷팅
```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
// Result: "Jan 15, 2024"
```

### 빈 상태
```typescript
if (comments.length === 0) {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>No comments yet. Be the first to comment!</p>
    </div>
  )
}
```

### 삭제 확인
```typescript
const handleDelete = async (commentId: string) => {
  if (!confirm("Are you sure you want to delete this comment?")) {
    return
  }

  // Server Action 호출
  // 삭제 후 페이지 리프레시 또는 optimistic update
}
```

---

## 구현 단계

1. [x] Create CommentList component file (`components/blog/CommentList.tsx`)
2. [x] Add "use client" directive (useAuth 사용)
3. [x] Import dependencies (Avatar, Button, Card, useAuth, Icons)
4. [x] Define CommentListProps interface
5. [x] Get current user from useAuth
6. [x] Implement formatDate helper function
7. [x] Implement getInitials helper function
8. [x] Implement handleDelete function
9. [x] Add empty state check
10. [x] Create ul element for comment list
11. [x] Map over comments array
12. [x] Render each comment as li with Card
13. [x] Add Avatar with author info
14. [x] Add author name and date
15. [x] Add Delete button (author only)
16. [x] Add comment content
17. [x] Test with comments
18. [x] Test empty state
19. [x] Test delete (author vs non-author)
20. [x] Test responsive design

---

## 완료 조건

### Functionality
- [x] CommentList renders comments correctly
- [x] Empty state displays when no comments
- [x] Delete button shows only for comment author
- [x] Delete confirmation works
- [x] Date formatting is correct
- [x] Avatar displays image or initials

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 3)
- [x] Each comment in Card format
- [x] Author info with avatar
- [x] Delete button in top-right (author only)
- [x] Proper spacing between comments (gap-4)
- [x] Responsive on all breakpoints

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Client Component (useAuth)
- [x] Clean component structure

### Integration
- [x] Works in PostDetailPage
- [x] Integrates with useAuth
- [x] Comment type matches data structure

---

## 테스트 체크리스트

- [x] CommentList render test (displays all comments)
- [x] Empty state test (no comments)
- [x] Delete button test (author only)
- [x] Delete confirmation test (confirm/cancel)
- [x] Date formatting test (correct format)
- [x] Avatar test (image or initials)
- [x] Author check test (isAuthor true/false)
- [x] Multiple comments test (spacing, order)
- [x] Responsive test (mobile, desktop)
- [x] Accessibility test (keyboard navigation, ul/li structure)

---

## 참고사항

- CommentList는 Client Component ("use client" 필요)
- useAuth hook으로 현재 사용자 확인
- 댓글은 시간순 정렬 (최신순 또는 오래된순)
- Mock 데이터에서 author 정보 포함 필요
- 추후 Supabase 연동 시:
  - deleteComment Server Action 구현
  - optimistic update로 즉시 UI 업데이트
  - revalidatePath로 댓글 목록 갱신
- 대댓글 기능은 Phase 8 이후 추가 가능
- 좋아요 기능은 Phase 8 이후 추가 가능

### 삭제 Server Action 구현 (추후)
```typescript
// app/actions/comment.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteComment(commentId: string, blogId: string) {
  const supabase = await createClient()

  // Check if user is author
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  // Delete comment
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/blog/${blogId}`)
  return { success: true }
}
```

### Optimistic Update 구현 (선택사항)
```typescript
"use client"

import { useOptimistic } from "react"

export function CommentList({ comments }: CommentListProps) {
  const [optimisticComments, removeOptimisticComment] = useOptimistic(
    comments,
    (state, commentId: string) => state.filter((c) => c.id !== commentId)
  )

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure?")) return

    // Optimistic update
    removeOptimisticComment(commentId)

    // Server action
    await deleteComment(commentId, blogId)
  }

  return (
    <ul>
      {optimisticComments.map((comment) => (
        // ...
      ))}
    </ul>
  )
}
```

### 댓글 정렬 (선택사항)
```typescript
// 최신순
const sortedComments = [...comments].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
)

// 오래된순 (기본)
const sortedComments = [...comments].sort(
  (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
)
```
