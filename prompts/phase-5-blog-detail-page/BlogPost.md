# BlogPost

## 개요
**Phase**: Phase 5 - 블로그 상세 페이지
**파일 경로**: `components/blog/BlogPost.tsx`
**UI 참조**: `blog-practice.pdf` - Page 3 (Post Detail, 상단 부분)
**상태**: ✅ 완료

## 페이지/컴포넌트 정보

**목적**: 블로그 글의 상세 내용을 표시하는 컴포넌트 (제목, 작성자, 날짜, 본문, 수정/삭제 버튼)
**타입**: Feature Component
**위치**: PostDetailPage 내부

---

## 요구사항

### 기능 요구사항
- [ ] 블로그 제목 표시
- [ ] 작성자 정보 표시 (아바타, 이름)
- [ ] 작성 날짜 표시
- [ ] 블로그 본문 표시 (마크다운 또는 일반 텍스트)
- [ ] 수정/삭제 버튼 표시 (작성자만)
- [ ] 뒤로가기 버튼
- [ ] 수정 버튼 클릭 시 수정 페이지로 이동
- [ ] 삭제 버튼 클릭 시 삭제 확인 후 홈으로 이동

### UI 요구사항 (blog-practice.pdf - Page 3)
- [ ] 상단: 뒤로가기 버튼
- [ ] 제목: 큰 글씨 (text-3xl 또는 text-4xl)
- [ ] 작성자 정보: 아바타 + 이름 + 날짜 (작은 글씨)
- [ ] 본문: 일반 텍스트 또는 마크다운
- [ ] 수정/삭제 버튼: 우측 상단 (작성자만)
- [ ] 충분한 여백 (py-8, px-4)

### 접근성 요구사항
- [ ] `<article>` 시맨틱 태그 사용
- [ ] `<h1>` 태그로 제목 마크업
- [ ] 버튼에 명확한 레이블
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button avatar
```

### 내부 의존성
- Types: `Blog` from `@/types/blog.ts`
- Next.js: `Link`, `useRouter` from `next/navigation`
- Icons: `ArrowLeft`, `Edit`, `Trash2` from `lucide-react`
- Auth: `useAuth` from `@/components/providers/AuthProvider`

---

## 기본 구조

```typescript
"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import type { Blog } from "@/types/blog"

interface BlogPostProps {
  blog: Blog
}

export function BlogPost({ blog }: BlogPostProps) {
  const router = useRouter()
  const { user } = useAuth()

  // Check if current user is the author
  const isAuthor = user?.id === blog.author_id

  // Format date
  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Get author initials
  const authorInitials = blog.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    // TODO: Implement delete logic (Server Action)
    // For now, just redirect to home
    router.push("/")
  }

  return (
    <article className="space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to posts</span>
      </Link>

      {/* Header: Title and Actions */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold flex-1">{blog.title}</h1>

        {/* Edit/Delete Buttons (Author only) */}
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/blog/${blog.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{blog.author.name}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {blog.content}
        </p>
      </div>
    </article>
  )
}
```

---

## 구현 세부사항

### 작성자 확인
```typescript
const { user } = useAuth()
const isAuthor = user?.id === blog.author_id

// author_id는 Blog 타입에 추가 필요
// types/blog.ts에서 author_id: string 필드 추가
```

### 날짜 포맷팅
```typescript
const formattedDate = new Date(blog.created_at).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})
// Result: "January 15, 2024"
```

### 삭제 확인
```typescript
const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this post?")) {
    return  // 사용자가 취소한 경우
  }

  // Server Action 호출 또는 API 요청
  // 삭제 후 홈페이지로 리디렉션
  router.push("/")
}
```

### 마크다운 렌더링 (선택사항)
```typescript
// 추후 마크다운 지원 시
import ReactMarkdown from "react-markdown"

<ReactMarkdown className="prose prose-lg max-w-none">
  {blog.content}
</ReactMarkdown>
```

### 컨텐츠 스타일링
```typescript
// Tailwind Typography 플러그인 사용
className="prose prose-lg max-w-none"

// prose: Typography 스타일 적용
// prose-lg: 큰 글씨 크기
// max-w-none: 최대 너비 제한 해제

// 일반 텍스트는 whitespace-pre-wrap으로 줄바꿈 유지
className="whitespace-pre-wrap text-gray-700 leading-relaxed"
```

---

## 구현 단계

1. [x] Create BlogPost component file (`components/blog/BlogPost.tsx`)
2. [x] Add "use client" directive (useRouter, useAuth 사용)
3. [x] Import dependencies (Button, Avatar, Icons, useRouter, useAuth)
4. [x] Define BlogPostProps interface
5. [x] Get current user from useAuth
6. [x] Check if current user is author
7. [x] Format date for display
8. [x] Calculate author initials
9. [x] Implement handleDelete function
10. [x] Create Back button (Link to /)
11. [x] Render title with Edit/Delete buttons (author only)
12. [x] Render author info (Avatar + name + date)
13. [x] Render content (with prose styling or whitespace-pre-wrap)
14. [x] Test as author (Edit/Delete visible)
15. [x] Test as non-author (Edit/Delete hidden)
16. [x] Test delete confirmation
17. [x] Test responsive design

---

## 완료 조건

### Functionality
- [x] BlogPost renders blog data correctly
- [x] Back button navigates to home
- [x] Edit button navigates to edit page (author only)
- [x] Delete button shows confirmation (author only)
- [x] Delete redirects to home after confirmation
- [x] Author check works correctly
- [x] Date displays in formatted style

### UI/UX
- [x] Matches design mockup (blog-practice.pdf - Page 3)
- [x] Title is large and prominent (text-4xl)
- [x] Author info displays with avatar
- [x] Edit/Delete buttons in top-right (author only)
- [x] Back button at top-left
- [x] Content is readable with proper spacing
- [x] Responsive on all breakpoints

### Code Quality
- [x] TypeScript types are correct
- [x] No console errors or warnings
- [x] Client Component (useRouter, useAuth)
- [x] Clean component structure

### Integration
- [x] Works in PostDetailPage
- [x] Integrates with useAuth
- [x] Navigation works correctly
- [x] Author check uses correct user ID

---

## 테스트 체크리스트

- [x] BlogPost render test (displays all blog data)
- [x] Back button test (navigates to /)
- [x] Edit button test (author only, navigates to edit page)
- [x] Delete button test (author only, shows confirmation)
- [x] Delete confirmation test (confirm → redirect, cancel → stay)
- [x] Author check test (isAuthor true/false)
- [x] Date formatting test (correct format)
- [x] Avatar test (image or initials)
- [x] Content display test (whitespace preserved)
- [x] Responsive test (mobile, desktop)
- [x] Accessibility test (keyboard navigation)

---

## 참고사항

- BlogPost는 Client Component ("use client" 필요)
- useAuth hook으로 현재 사용자 정보 가져오기
- useRouter hook으로 프로그래매틱 네비게이션
- author_id 필드가 Blog 타입에 필요:
  ```typescript
  export interface Blog {
    id: string
    title: string
    content: string
    author: {
      name: string
      avatar: string
    }
    author_id: string  // ← 추가 필요
    created_at: string
    updated_at: string
  }
  ```
- 추후 Supabase 연동 시:
  - deleteBlog Server Action 구현
  - 삭제 후 revalidatePath("/") 호출
- 마크다운 지원 추가 가능 (react-markdown 라이브러리)
- Tailwind Typography 플러그인으로 prose 스타일 사용 가능

### Tailwind Typography 설정 (선택사항)
```bash
npm install -D @tailwindcss/typography
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
```

### 삭제 Server Action 구현 (추후)
```typescript
// app/actions/blog.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteBlog(blogId: string) {
  const supabase = await createClient()

  // Check if user is author
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  // Delete blog
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", blogId)
    .eq("author_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}
```
