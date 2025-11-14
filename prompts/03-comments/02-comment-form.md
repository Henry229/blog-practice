# 댓글 작성 구현 계획

## 개요

블로그 글에 댓글을 작성하는 기능 구현
- Mock 사용자 "John Doe"만 댓글 작성 가능
- 비로그인 사용자 (현재는 없음)에게 로그인 안내 표시
- Textarea로 댓글 입력
- Mock Data 추가 함수 호출
- router.refresh()로 페이지 새로고침
- 에러 처리 및 로딩 상태

---

## Task List

### 0. 사전 준비
- [ ] shadcn/ui 컴포넌트 설치: `npx shadcn@latest add textarea button`
- [ ] Mock Data 확인 (`lib/data/mockComments.ts`)
- [ ] Mock CRUD 함수 확인 (addMockComment)
- [ ] 타입 정의 확인 (`types/comment.ts`)

### 1. CommentTextarea 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/CommentTextarea.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Textarea 사용
- [ ] placeholder: "Write a comment..."
- [ ] 최소 높이 100px
- [ ] 최대 높이 300px (자동 확장)
- [ ] 포커스 스타일
- [ ] 글자 수 제한 (500자)
- [ ] 글자 수 표시 (선택사항)

**의존성:**
- shadcn/ui: textarea

**기본 구조:**
```typescript
"use client"

import { Textarea } from "@/components/ui/textarea"
import { forwardRef } from "react"

interface CommentTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number
}

export const CommentTextarea = forwardRef<
  HTMLTextAreaElement,
  CommentTextareaProps
>(({ maxLength = 500, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      placeholder="Write a comment..."
      className="min-h-[100px] max-h-[300px] resize-y"
      maxLength={maxLength}
      {...props}
    />
  )
})

CommentTextarea.displayName = "CommentTextarea"
```

**구현 세부사항:**
- forwardRef로 ref 전달 지원 (react-hook-form 사용 시 필요)
- min-h-[100px], max-h-[300px]로 높이 제한
- resize-y로 수직 리사이즈만 허용
- maxLength로 글자 수 제한 (기본 500자)
- placeholder로 입력 안내

**완료 조건:**
- [ ] Textarea 렌더링 확인
- [ ] 최소/최대 높이 확인
- [ ] 글자 수 제한 동작 확인
- [ ] 포커스 스타일 확인

---

### 2. LoginPrompt 컴포넌트 (현재는 사용 안 함)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/LoginPrompt.tsx`

**요구사항:**
- [ ] Server Component
- [ ] "Please log in to comment" 메시지
- [ ] "Log In" 버튼 (Link to /auth/login)
- [ ] 중앙 정렬
- [ ] 카드 스타일 (배경색, 패딩, 둥근 모서리)
- [ ] 현재는 Mock 사용자 "John Doe"이므로 사용 안 함 (추후 Supabase Auth 연동 시 활성화)

**의존성:**
- shadcn/ui: button, card
- Next.js: Link

**기본 구조:**
```typescript
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface LoginPromptProps {
  blogId: string
}

export function LoginPrompt({ blogId }: LoginPromptProps) {
  return (
    <Card className="p-6 text-center bg-gray-50 border-gray-200">
      <p className="text-gray-600 mb-4">
        Please log in to comment
      </p>
      <Link href={`/auth/login?redirect=/blog/${blogId}`}>
        <Button>Log In</Button>
      </Link>
    </Card>
  )
}
```

**구현 세부사항:**
- Card 컴포넌트로 감싸기
- p-6으로 내부 패딩, text-center로 중앙 정렬
- bg-gray-50으로 배경색, border-gray-200으로 테두리
- "Log In" 버튼을 Link로 감싸서 로그인 페이지 이동
- redirect 파라미터로 블로그 상세 페이지 URL 전달
- 현재는 Mock 사용자 "John Doe"이므로 사용하지 않음
- 추후 Supabase Auth 연동 시 활성화

**완료 조건:**
- [ ] 메시지 표시 확인
- [ ] 버튼 표시 확인
- [ ] 로그인 페이지 이동 확인
- [ ] redirect 파라미터 전달 확인
- [ ] 레이아웃 확인

---

### 3. Mock Data에 댓글 추가 (addMockComment)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/data/mockComments.ts`

**요구사항:**
- [ ] addMockComment 함수 구현
- [ ] 새 댓글을 mockComments 배열에 추가
- [ ] id 자동 생성 (현재 배열 길이 + 1)
- [ ] author_id, author_name, created_at 자동 설정
- [ ] 추가된 댓글 반환

**의존성:**
- types/comment.ts: Comment 인터페이스

**기본 구조:**
```typescript
// lib/data/mockComments.ts
import type { Comment } from "@/types/comment"

export const mockComments: Comment[] = [
  // ... 기존 Mock 댓글 데이터
]

// 새 댓글 추가 함수
export function addMockComment(
  blogId: string,
  content: string,
  authorName: string = "John Doe"
): Comment {
  const newComment: Comment = {
    id: String(mockComments.length + 1),
    blogId: blogId,
    authorId: "user1", // Mock 사용자 ID
    authorName: authorName,
    content: content.trim(),
    createdAt: new Date().toISOString()
  }

  mockComments.push(newComment)
  return newComment
}

// 댓글 삭제 함수 (추후 구현)
export function deleteMockComment(id: string): boolean {
  const index = mockComments.findIndex(comment => comment.id === id)
  if (index === -1) return false
  mockComments.splice(index, 1)
  return true
}
```

**구현 세부사항:**
- addMockComment: 새 댓글을 mockComments 배열에 추가
- id는 String(mockComments.length + 1)로 자동 생성
- authorId는 "user1" (Mock 사용자)
- authorName은 기본값 "John Doe"
- content.trim()으로 앞뒤 공백 제거
- createdAt은 현재 시간 (new Date().toISOString())
- 추가된 댓글 반환
- deleteMockComment는 추후 구현 예정

**완료 조건:**
- [ ] addMockComment 함수 동작 확인
- [ ] 새 댓글이 배열에 추가되는지 확인
- [ ] id 자동 생성 확인
- [ ] authorName 설정 확인

---

### 4. CommentForm 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/CommentForm.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] CommentTextarea 사용
- [ ] "Post Comment" 버튼
- [ ] 로딩 상태 (버튼 비활성화, "Posting..." 텍스트)
- [ ] 제출 시 addMockComment 함수 호출
- [ ] router.refresh()로 페이지 새로고침
- [ ] 성공 시 폼 초기화
- [ ] 에러 시 에러 메시지 표시

**의존성:**
- shadcn/ui: button
- CommentTextarea 컴포넌트
- lib/data/mockComments.ts: addMockComment
- next/navigation: useRouter
- react: useState

**기본 구조:**
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CommentTextarea } from "./CommentTextarea"
import { addMockComment } from "@/lib/data/mockComments"

interface CommentFormProps {
  blogId: string
}

export function CommentForm({ blogId }: CommentFormProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!content.trim()) {
      setError("Comment cannot be empty")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Mock Data에 댓글 추가
      addMockComment(blogId, content, "John Doe")

      // 폼 초기화
      setContent("")

      // 페이지 새로고침으로 업데이트된 댓글 목록 표시
      router.refresh()
    } catch (error) {
      console.error("Error posting comment:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="space-y-3">
        <CommentTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  )
}
```

**구현 세부사항:**
- useState로 content, error, isSubmitting 상태 관리
- handleSubmit에서 빈 내용 검증
- addMockComment(blogId, content, "John Doe")로 댓글 추가
- 성공 시 setContent("")로 폼 초기화
- router.refresh()로 페이지 새로고침하여 업데이트된 댓글 목록 표시
- 에러 시 에러 메시지 표시 (text-red-600)
- isSubmitting 또는 빈 내용일 때 버튼 비활성화
- space-y-3으로 필드 간격
- flex justify-end로 버튼 우측 정렬
- 추후 Supabase 연동 시 addMockComment → Server Action으로 교체

**완료 조건:**
- [ ] 폼 렌더링 확인
- [ ] 댓글 입력 확인
- [ ] 제출 동작 확인
- [ ] 로딩 상태 표시 확인
- [ ] 성공 시 폼 초기화 확인
- [ ] 에러 처리 확인
- [ ] 빈 내용 검증 확인

---

### 5. CommentFormWrapper 컴포넌트 (현재는 불필요)
**상태:** - [ ] 미완료 / - [x] 완료

**요구사항:**
- [ ] 현재는 Mock 사용자 "John Doe"이므로 불필요
- [ ] CommentSection에서 CommentForm을 직접 사용
- [ ] 추후 Supabase Auth 연동 시 필요할 수 있음

**구현 세부사항:**
- 현재 단계에서는 CommentFormWrapper 컴포넌트를 생성하지 않음
- CommentSection에서 CommentForm을 직접 렌더링
- 추후 Supabase Auth 연동 시 로그인 상태 확인 로직 추가 가능

---

### 6. CommentSection에 CommentForm 통합
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/components/comments/CommentSection.tsx`

**요구사항:**
- [ ] CommentForm import
- [ ] 댓글 목록 위에 CommentForm 추가
- [ ] 적절한 간격 (mb-8)

**의존성:**
- CommentForm 컴포넌트
- CommentList 컴포넌트
- lib/data/mockComments.ts: getMockComments
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
- CommentForm import 추가
- 댓글 목록 위에 CommentForm 직접 추가
- CommentForm은 내부에서 mb-8 적용
- blogId prop 전달
- 현재는 Mock 사용자 "John Doe"만 댓글 작성 가능
- 추후 Supabase Auth 연동 시 로그인 상태 확인 로직 추가 가능

**완료 조건:**
- [ ] CommentForm 통합 확인
- [ ] 레이아웃 확인
- [ ] 폼과 목록 간격 확인

---

## 구현 순서

1. **shadcn/ui 설치**: textarea, button 컴포넌트 (이미 설치되어 있을 수 있음)
2. **Mock Data 함수**: `lib/data/mockComments.ts`에 addMockComment 추가
3. **기본 컴포넌트**: CommentTextarea
4. **폼 컴포넌트**: CommentForm (Mock Data 기반)
5. **CommentSection 통합**: CommentForm 추가
6. **LoginPrompt**: 추후 Supabase Auth 연동 시 구현

---

## 검증 체크리스트

### CommentTextarea
- [ ] Textarea 렌더링 확인
- [ ] 최소/최대 높이 확인
- [ ] 글자 수 제한 동작 확인
- [ ] 포커스 스타일 확인
- [ ] ref 전달 확인

### LoginPrompt
- [ ] 메시지 표시 확인
- [ ] 로그인 버튼 표시 확인
- [ ] 로그인 페이지 이동 확인
- [ ] redirect 파라미터 전달 확인
- [ ] 레이아웃 확인

### Mock Data 함수
- [ ] addMockComment 동작 확인
- [ ] 새 댓글이 배열에 추가되는지 확인
- [ ] id 자동 생성 확인
- [ ] authorName 설정 확인

### CommentForm
- [ ] 폼 렌더링 확인
- [ ] 댓글 입력 확인
- [ ] 제출 버튼 동작 확인
- [ ] 로딩 상태 표시 확인
- [ ] 성공 시 폼 초기화 확인
- [ ] router.refresh() 동작 확인
- [ ] 에러 메시지 표시 확인
- [ ] 빈 내용 검증 확인

### CommentSection 통합
- [ ] CommentForm 통합 확인
- [ ] 폼과 목록 레이아웃 확인
- [ ] 전체 댓글 기능 동작 확인
- [ ] Mock 사용자 "John Doe"로 댓글 작성 확인

---

## 참고사항

### Mock Data 예시 (lib/data/mockComments.ts)
```typescript
import type { Comment } from "@/types/comment"

export const mockComments: Comment[] = [
  {
    id: "1",
    blogId: "1",
    authorId: "user2",
    authorName: "Jane Smith",
    content: "Great article! Very helpful.",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  // 더 많은 Mock 댓글...
]

export function addMockComment(
  blogId: string,
  content: string,
  authorName: string = "John Doe"
): Comment {
  const newComment: Comment = {
    id: String(mockComments.length + 1),
    blogId: blogId,
    authorId: "user1",
    authorName: authorName,
    content: content.trim(),
    createdAt: new Date().toISOString()
  }
  mockComments.push(newComment)
  return newComment
}
```

**추후 Supabase 연동 시 RLS 정책**:
```sql
-- comments 테이블 INSERT 정책
CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- comments 테이블 DELETE 정책
CREATE POLICY "Authors can delete their comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = author_id);
```

### 낙관적 업데이트 (Optimistic Update)
```typescript
// CommentForm에 낙관적 업데이트 추가 (선택사항)
import { useOptimistic } from "react"

export function CommentForm({ blogId }: CommentFormProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [...state, newComment]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const optimisticComment: Comment = {
      id: crypto.randomUUID(),
      blog_id: blogId,
      author_id: "temp",
      author_name: "You",
      content: content,
      created_at: new Date().toISOString()
    }

    addOptimisticComment(optimisticComment)
    setContent("")

    startTransition(async () => {
      const result = await createComment({ blog_id: blogId, content })
      if (!result.success) {
        setError(result.error || "Failed to post comment")
      }
    })
  }
}
```

### 에러 처리 개선 (toast 사용)
```typescript
// shadcn/ui toast 사용
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

// 성공 메시지
toast({
  title: "Success",
  description: "Your comment has been posted.",
})

// 에러 메시지
toast({
  title: "Error",
  description: result.error,
  variant: "destructive",
})
```

### 폼 검증 강화
```typescript
// Zod 스키마로 유효성 검증
import { z } from "zod"

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long")
    .trim()
})
```

### 실시간 댓글 업데이트 (Supabase Realtime)
```typescript
// 실시간 구독 (선택사항)
useEffect(() => {
  const supabase = createClient()

  const channel = supabase
    .channel("comments")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `blog_id=eq.${blogId}`
      },
      (payload) => {
        console.log("New comment:", payload)
        // 댓글 목록에 새 댓글 추가
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [blogId])
```

### 성능 최적화
- Mock Data는 메모리 기반이므로 빠른 응답 속도
- router.refresh()로 페이지 새로고침 (필요한 경우만)
- 추후 Supabase 연동 시 Server Actions와 revalidatePath 활용
- 낙관적 업데이트로 사용자 경험 향상 가능

### 접근성 개선
- ARIA labels 추가
- 키보드 네비게이션 지원 (Enter로 제출)
- 포커스 관리
- 에러 메시지 스크린 리더 지원

### 추가 기능 아이디어
- 댓글 수정 기능
- 댓글 삭제 버튼 추가
- 멘션 기능 (@username)
- 이모지 선택기
- 댓글 작성 시 알림
- 댓글 미리보기
- 마크다운 지원
- 이미지 첨부
