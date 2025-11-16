# Phase 0.2 - TypeScript 타입 정의

## 개요
**Phase**: Phase 0 - 공통 기반
**목적**: 프로젝트 전반에서 사용할 TypeScript 타입 및 인터페이스 정의
**상태**: ✅ 완료

## 타입 파일 구조

```
types/
├── user.ts        - User, AuthUser 인터페이스
├── blog.ts        - Blog 인터페이스
├── comment.ts     - Comment 인터페이스
├── auth.ts        - AuthContextType 인터페이스
└── index.ts       - 모든 타입 re-export
```

---

## 1. User 타입 (`types/user.ts`)

```typescript
// types/user.ts

/**
 * User 인터페이스
 * 데이터베이스의 users 테이블 구조와 동일
 */
export interface User {
  id: string
  email: string
  username: string
  password: string  // Mock 데이터용 (실제 DB에는 해시됨)
  createdAt: string  // ISO 8601 형식
}

/**
 * AuthUser 인터페이스
 * 현재 로그인한 사용자 정보 (password 제외)
 */
export interface AuthUser {
  id: string
  email: string
  username: string
}

/**
 * 회원가입 폼 데이터
 */
export interface SignupFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
}

/**
 * 로그인 폼 데이터
 */
export interface LoginFormData {
  email: string
  password: string
}
```

---

## 2. Blog 타입 (`types/blog.ts`)

```typescript
// types/blog.ts

/**
 * Blog 인터페이스
 * 데이터베이스의 blogs 테이블 구조와 동일
 */
export interface Blog {
  id: string
  title: string
  content: string
  authorId: string        // User.id 참조
  authorName: string      // 작성자 이름 (JOIN 결과)
  authorAvatar?: string   // 작성자 아바타 URL (선택사항)
  createdAt: string       // ISO 8601 형식
  updatedAt: string       // ISO 8601 형식
}

/**
 * 블로그 작성/수정 폼 데이터
 */
export interface BlogFormData {
  title: string
  content: string
}

/**
 * 블로그 목록 조회 파라미터
 */
export interface BlogListParams {
  page?: number
  limit?: number
  search?: string
  authorId?: string
}

/**
 * 블로그 목록 응답
 */
export interface BlogListResponse {
  blogs: Blog[]
  total: number
  page: number
  totalPages: number
}
```

---

## 3. Comment 타입 (`types/comment.ts`)

```typescript
// types/comment.ts

/**
 * Comment 인터페이스
 * 데이터베이스의 comments 테이블 구조와 동일
 */
export interface Comment {
  id: string
  blogId: string          // Blog.id 참조
  authorId: string        // User.id 참조
  authorName: string      // 작성자 이름 (JOIN 결과)
  authorAvatar?: string   // 작성자 아바타 URL (선택사항)
  content: string
  createdAt: string       // ISO 8601 형식
}

/**
 * 댓글 작성 폼 데이터
 */
export interface CommentFormData {
  content: string
}
```

---

## 4. Auth 타입 (`types/auth.ts`)

```typescript
// types/auth.ts
import { AuthUser } from "./user"

/**
 * AuthContext 타입
 * React Context에서 제공하는 인증 상태 및 함수
 */
export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

/**
 * 인증 상태
 */
export type AuthState =
  | "unauthenticated"  // 로그인하지 않음
  | "authenticated"    // 로그인함
  | "loading"          // 인증 상태 확인 중
```

---

## 5. 공통 타입 (`types/index.ts`)

```typescript
// types/index.ts

// Re-export all types for easy import
export type { User, AuthUser, SignupFormData, LoginFormData } from "./user"
export type { Blog, BlogFormData, BlogListParams, BlogListResponse } from "./blog"
export type { Comment, CommentFormData } from "./comment"
export type { AuthContextType, AuthState } from "./auth"

/**
 * API 응답 공통 타입
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * 정렬 옵션
 */
export type SortOrder = "asc" | "desc"

export interface SortOptions {
  field: string
  order: SortOrder
}
```

---

## 타입 사용 예시

### 컴포넌트에서 타입 import
```typescript
// 개별 import
import type { Blog } from "@/types/blog"
import type { Comment } from "@/types/comment"
import type { AuthUser } from "@/types/user"

// 또는 index.ts에서 일괄 import
import type { Blog, Comment, AuthUser } from "@/types"
```

### 함수 파라미터 타입 지정
```typescript
import type { Blog, BlogFormData } from "@/types"

function createBlog(data: BlogFormData): Blog {
  // ...
}

function formatBlog(blog: Blog): string {
  return `${blog.title} by ${blog.authorName}`
}
```

### React 컴포넌트 Props 타입
```typescript
import type { Blog } from "@/types"

interface BlogCardProps {
  blog: Blog
  onClick?: (id: string) => void
}

export function BlogCard({ blog, onClick }: BlogCardProps) {
  // ...
}
```

### State 타입 지정
```typescript
import { useState } from "react"
import type { Blog, Comment } from "@/types"

export function BlogDetail() {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])

  // ...
}
```

### API 응답 타입
```typescript
import type { ApiResponse, Blog } from "@/types"

async function fetchBlog(id: string): Promise<Blog> {
  const response = await fetch(`/api/blogs/${id}`)
  const data: ApiResponse<Blog> = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || "Failed to fetch blog")
  }

  return data.data
}
```

---

## Supabase 타입 통합 (Phase 8 이후)

Supabase 연동 시 데이터베이스 스키마에서 타입을 자동 생성할 수 있습니다:

```bash
# Supabase 타입 생성
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

생성된 타입 사용:
```typescript
// types/supabase.ts (자동 생성됨)
export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      // ... 다른 테이블들
    }
  }
}

// 사용 예시
import type { Database } from "@/types/supabase"

type Blog = Database["public"]["Tables"]["blogs"]["Row"]
```

---

## 타입 가드 함수 (선택사항)

타입 안전성을 높이기 위한 타입 가드 함수:

```typescript
// types/guards.ts

import type { Blog, Comment, AuthUser } from "@/types"

export function isBlog(obj: any): obj is Blog {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.content === "string" &&
    typeof obj.authorId === "string" &&
    typeof obj.authorName === "string"
  )
}

export function isComment(obj: any): obj is Comment {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.blogId === "string" &&
    typeof obj.authorId === "string" &&
    typeof obj.content === "string"
  )
}

export function isAuthUser(obj: any): obj is AuthUser {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.username === "string"
  )
}
```

사용 예시:
```typescript
import { isBlog } from "@/types/guards"

const data = await fetchData()

if (isBlog(data)) {
  // data는 Blog 타입으로 추론됨
  console.log(data.title)
}
```

---

## 구현 단계

1. [x] `types/` 폴더 생성
2. [x] `types/user.ts` 파일 생성 (User, AuthUser 인터페이스)
3. [x] `types/blog.ts` 파일 생성 (Blog 인터페이스)
4. [x] `types/comment.ts` 파일 생성 (Comment 인터페이스)
5. [x] `types/auth.ts` 파일 생성 (AuthContextType 인터페이스)
6. [x] `types/index.ts` 파일 생성 (모든 타입 re-export)
7. [x] 타입 가드 함수 추가 (선택사항)
8. [x] 타입 사용 예시 문서화

---

## 완료 조건

### 파일 확인
- [ ] `types/user.ts` 존재
- [ ] `types/blog.ts` 존재
- [ ] `types/comment.ts` 존재
- [ ] `types/auth.ts` 존재
- [ ] `types/index.ts` 존재

### 타입 검증
- [ ] 모든 인터페이스가 올바르게 정의됨
- [ ] Mock 데이터 구조와 일치
- [ ] Supabase 테이블 구조와 호환 가능
- [ ] TypeScript 컴파일 에러 없음

### 다음 단계
- Phase 0.3: Mock Data 및 유틸리티 함수

---

## 참고사항

- **camelCase vs snake_case**: TypeScript는 camelCase, Supabase는 snake_case 사용
  - 현재: camelCase (TypeScript 컨벤션)
  - Phase 8 (Supabase 연동): snake_case로 변환 또는 매핑 함수 사용

- **날짜 형식**: ISO 8601 형식 문자열 사용 (`2024-01-15T10:30:00Z`)
  - `new Date().toISOString()` 사용
  - Supabase는 자동으로 timestamp 타입을 ISO 문자열로 변환

- **선택적 필드**: `?` 사용 (예: `authorAvatar?: string`)
  - Mock 데이터에서는 undefined 가능
  - Supabase에서는 nullable 컬럼에 해당

- **타입 vs 인터페이스**:
  - 인터페이스 사용 권장 (확장 가능, 명확한 의도)
  - 유니온 타입이나 단순 타입은 type 사용

### TypeScript 공식 문서
- Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Utility Types: https://www.typescriptlang.org/docs/handbook/utility-types.html
