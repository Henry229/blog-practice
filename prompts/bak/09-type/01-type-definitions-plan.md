# TypeScript 타입 정의 구현 계획

## 개요

SimpleBlog MVP 애플리케이션의 모든 TypeScript 타입 정의
- User, AuthUser 인터페이스
- Blog, Comment 인터페이스
- AuthContext 타입
- LocalStorage 데이터 타입
- 타입 안전성 및 재사용성 보장
- camelCase 네이밍 규칙 준수

---

## Task List

### 1. types/user.ts - User, AuthUser 인터페이스
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `types/user.ts`

**요구사항:**
- [ ] User 인터페이스 - 전체 사용자 정보 (비밀번호 포함)
- [ ] AuthUser 인터페이스 - 인증된 사용자 정보 (비밀번호 제외)
- [ ] camelCase 필드명 사용
- [ ] Phase 1 Mock Data 구조와 일치
- [ ] Phase 2 Supabase 구조와 호환

**의존성:**
- 없음

**기본 구조:**
```typescript
/**
 * 전체 사용자 정보 (데이터베이스 저장용)
 * Phase 1: Mock Data 구조
 * Phase 2: Supabase auth.users + profiles 테이블
 */
export interface User {
  /** 사용자 고유 ID (UUID) */
  id: string

  /** 이메일 주소 */
  email: string

  /** 사용자 이름 (표시명) */
  username: string

  /** 비밀번호 (평문, Phase 1만 해당) */
  password: string

  /** 계정 생성 일시 (ISO 8601) */
  createdAt: string
}

/**
 * 인증된 사용자 정보 (클라이언트용, 비밀번호 제외)
 * Context, 세션 저장, UI 표시에 사용
 */
export interface AuthUser {
  /** 사용자 고유 ID (UUID) */
  id: string

  /** 이메일 주소 */
  email: string

  /** 사용자 이름 (표시명) */
  username: string
}

/**
 * 사용자 프로필 (확장 정보, Phase 2)
 * Supabase profiles 테이블 구조
 */
export interface UserProfile extends AuthUser {
  /** 성 (옵션) */
  firstName?: string

  /** 이름 (옵션) */
  lastName?: string

  /** 전화번호 (옵션) */
  mobile?: string

  /** 사용자 역할 (기본: 'user') */
  role?: "user" | "admin"

  /** 프로필 업데이트 일시 */
  updatedAt?: string
}

/**
 * Mock 사용자 상수 (Phase 1 전용)
 */
export const MOCK_USER: AuthUser = {
  id: "mock-user-1",
  email: "john@example.com",
  username: "John Doe",
}

/**
 * 사용자 역할 타입
 */
export type UserRole = "user" | "admin"

/**
 * 사용자 생성 DTO (Data Transfer Object)
 */
export interface CreateUserDto {
  email: string
  username: string
  password: string
}

/**
 * 사용자 업데이트 DTO
 */
export interface UpdateUserDto {
  username?: string
  firstName?: string
  lastName?: string
  mobile?: string
}
```

**구현 세부사항:**
- **User vs AuthUser**: User는 비밀번호 포함, AuthUser는 클라이언트 안전 정보만
- **MOCK_USER**: Phase 1에서 모든 작업에 사용할 기본 사용자
- **UserProfile**: Phase 2 Supabase profiles 테이블 구조 미리 정의
- **DTO 패턴**: API 요청/응답용 타입 분리
- **타입 재사용**: AuthUser를 UserProfile이 확장

**완료 조건:**
- [ ] User 인터페이스 정의 완료
- [ ] AuthUser 인터페이스 정의 완료
- [ ] MOCK_USER 상수 정의
- [ ] DTO 타입 정의 완료
- [ ] JSDoc 주석 작성

---

### 2. types/blog.ts - Blog 인터페이스
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `types/blog.ts`

**요구사항:**
- [ ] Blog 인터페이스 - 블로그 글 데이터 구조
- [ ] camelCase 필드명 (blogId, createdAt, authorName)
- [ ] Mock Data 및 Supabase 구조 모두 호환
- [ ] 생성/수정 DTO 타입

**의존성:**
- 없음

**기본 구조:**
```typescript
/**
 * 블로그 글 데이터 구조
 * Phase 1: mockBlogs 배열 구조
 * Phase 2: Supabase blogs 테이블
 */
export interface Blog {
  /** 블로그 글 고유 ID (UUID) */
  id: string

  /** 글 제목 (최대 200자) */
  title: string

  /** 글 내용 (최대 10,000자) */
  content: string

  /** 작성자 ID */
  authorId: string

  /** 작성자 이름 (표시용) */
  authorName: string

  /** 생성 일시 (ISO 8601) */
  createdAt: string

  /** 수정 일시 (ISO 8601) */
  updatedAt: string
}

/**
 * 블로그 글 생성 DTO
 */
export interface CreateBlogDto {
  title: string
  content: string
  authorName?: string // Phase 1: 옵션 (기본값 "John Doe")
}

/**
 * 블로그 글 수정 DTO
 */
export interface UpdateBlogDto {
  title: string
  content: string
}

/**
 * 블로그 카드 표시용 (미리보기)
 */
export interface BlogCardData {
  id: string
  title: string
  /** 내용 미리보기 (100자) */
  excerpt: string
  authorName: string
  createdAt: string
  /** 댓글 개수 */
  commentCount?: number
}

/**
 * 블로그 상세 페이지용 (댓글 포함)
 */
export interface BlogWithComments extends Blog {
  /** 댓글 목록 */
  comments: Comment[]
  /** 댓글 개수 */
  commentCount: number
}

/**
 * 블로그 검색 결과
 */
export interface BlogSearchResult {
  /** 검색된 블로그 목록 */
  blogs: Blog[]
  /** 전체 결과 개수 */
  total: number
  /** 검색 쿼리 */
  query: string
}

/**
 * 페이지네이션된 블로그 목록
 */
export interface PaginatedBlogs {
  /** 블로그 목록 */
  blogs: Blog[]
  /** 현재 페이지 */
  currentPage: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 전체 블로그 개수 */
  totalCount: number
  /** 페이지당 항목 수 */
  pageSize: number
}
```

**구현 세부사항:**
- **Blog**: 기본 블로그 데이터 구조
- **BlogCardData**: 홈페이지 카드 표시용 최적화된 타입
- **BlogWithComments**: 상세 페이지용 댓글 포함 타입
- **PaginatedBlogs**: 페이지네이션 구현용 타입 (Phase 1 선택사항)
- **DTO 분리**: 생성/수정 요청용 타입 분리로 타입 안전성 강화

**완료 조건:**
- [ ] Blog 인터페이스 정의 완료
- [ ] DTO 타입 정의 완료
- [ ] 확장 타입 정의 (BlogCardData, BlogWithComments)
- [ ] 페이지네이션 타입 정의
- [ ] JSDoc 주석 작성

---

### 3. types/comment.ts - Comment 인터페이스
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `types/comment.ts`

**요구사항:**
- [ ] Comment 인터페이스 - 댓글 데이터 구조
- [ ] camelCase 필드명 (commentId, blogId, createdAt)
- [ ] Mock Data 및 Supabase 구조 호환
- [ ] 생성 DTO 타입

**의존성:**
- 없음

**기본 구조:**
```typescript
/**
 * 댓글 데이터 구조
 * Phase 1: mockComments 배열 구조
 * Phase 2: Supabase comments 테이블
 */
export interface Comment {
  /** 댓글 고유 ID (UUID) */
  id: string

  /** 블로그 글 ID */
  blogId: string

  /** 작성자 ID */
  authorId: string

  /** 작성자 이름 (표시용) */
  authorName: string

  /** 댓글 내용 (최대 1,000자) */
  content: string

  /** 생성 일시 (ISO 8601) */
  createdAt: string
}

/**
 * 댓글 생성 DTO
 */
export interface CreateCommentDto {
  blogId: string
  content: string
  authorName?: string // Phase 1: 옵션 (기본값 "John Doe")
}

/**
 * 댓글 수정 DTO (Phase 2, 선택사항)
 */
export interface UpdateCommentDto {
  content: string
}

/**
 * 블로그별 댓글 그룹
 */
export interface CommentsByBlog {
  blogId: string
  comments: Comment[]
  count: number
}

/**
 * 댓글 아이템 표시용 (작성자 정보 포함)
 */
export interface CommentWithAuthor extends Comment {
  /** 작성자 이메일 (Phase 2) */
  authorEmail?: string
  /** 작성자 역할 (Phase 2) */
  authorRole?: "user" | "admin"
}
```

**구현 세부사항:**
- **Comment**: 기본 댓글 데이터 구조
- **CreateCommentDto**: 댓글 생성 요청용
- **CommentsByBlog**: 블로그별 댓글 그룹핑용
- **CommentWithAuthor**: 확장 정보 포함 (Phase 2)
- **수정 기능**: Phase 1에서는 미구현, Phase 2 대비 타입만 정의

**완료 조건:**
- [ ] Comment 인터페이스 정의 완료
- [ ] DTO 타입 정의 완료
- [ ] 확장 타입 정의 (CommentWithAuthor)
- [ ] JSDoc 주석 작성

---

### 4. types/auth.ts - AuthContextType 인터페이스
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `types/auth.ts`

**요구사항:**
- [ ] AuthContextType - AuthContext 타입 정의
- [ ] 로그인/로그아웃/회원가입 함수 시그니처
- [ ] 로딩 및 에러 상태 타입
- [ ] Phase 1 Mock Auth 구조

**의존성:**
- types/user.ts (AuthUser)

**기본 구조:**
```typescript
import { AuthUser } from "./user"

/**
 * 인증 결과 타입
 */
export interface AuthResult {
  /** 성공 여부 */
  success: boolean
  /** 인증된 사용자 (성공 시) */
  user?: AuthUser
  /** 에러 메시지 (실패 시) */
  error?: string
}

/**
 * 로그인 입력 데이터
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * 회원가입 입력 데이터
 */
export interface SignupCredentials {
  email: string
  username: string
  password: string
  confirmPassword: string
}

/**
 * 비밀번호 재설정 요청 데이터
 */
export interface ResetPasswordRequest {
  email: string
}

/**
 * 비밀번호 재설정 데이터
 */
export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

/**
 * AuthContext 타입 정의
 * React Context에서 제공하는 인증 관련 상태 및 함수
 */
export interface AuthContextType {
  /** 현재 로그인한 사용자 (null이면 미로그인) */
  user: AuthUser | null

  /** 인증 상태 로딩 중 여부 */
  isLoading: boolean

  /** 인증 에러 메시지 */
  error: string | null

  /**
   * 로그인
   * @param email - 이메일
   * @param password - 비밀번호
   * @returns AuthResult
   */
  login: (email: string, password: string) => Promise<AuthResult>

  /**
   * 로그아웃
   * @returns AuthResult
   */
  logout: () => Promise<AuthResult>

  /**
   * 회원가입
   * @param email - 이메일
   * @param username - 사용자 이름
   * @param password - 비밀번호
   * @returns AuthResult
   */
  signup: (
    email: string,
    username: string,
    password: string
  ) => Promise<AuthResult>

  /**
   * 비밀번호 재설정 요청 (Phase 2)
   * @param email - 이메일
   * @returns AuthResult
   */
  requestPasswordReset?: (email: string) => Promise<AuthResult>

  /**
   * 비밀번호 재설정 (Phase 2)
   * @param token - 재설정 토큰
   * @param password - 새 비밀번호
   * @returns AuthResult
   */
  resetPassword?: (token: string, password: string) => Promise<AuthResult>

  /**
   * 에러 초기화
   */
  clearError: () => void
}

/**
 * 인증 상태 타입
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

/**
 * 인증 Provider Props
 */
export interface AuthProviderProps {
  children: React.ReactNode
}
```

**구현 세부사항:**
- **AuthContextType**: Context에서 제공할 모든 값과 함수 타입
- **AuthResult**: 통일된 응답 형식으로 에러 처리 단순화
- **Credentials 타입**: 로그인/회원가입 입력 데이터 분리
- **Phase 2 함수**: 선택적 프로퍼티로 정의하여 Phase 1에서는 미구현 가능
- **clearError**: 에러 상태 초기화 함수

**완료 조건:**
- [ ] AuthContextType 인터페이스 정의 완료
- [ ] AuthResult 타입 정의
- [ ] Credentials 타입 정의
- [ ] AuthProviderProps 정의
- [ ] JSDoc 주석 작성

---

### 5. types/storage.ts - LocalStorageData 인터페이스
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `types/storage.ts`

**요구사항:**
- [ ] LocalStorageData - localStorage 저장 데이터 타입
- [ ] Phase 1 세션 지속성용
- [ ] 타입 안전한 localStorage 키
- [ ] 데이터 직렬화/역직렬화 타입

**의존성:**
- types/user.ts (AuthUser)

**기본 구조:**
```typescript
import { AuthUser } from "./user"

/**
 * localStorage 키 상수
 */
export const STORAGE_KEYS = {
  /** 인증된 사용자 정보 */
  AUTH_USER: "auth-user",
  /** 블로그 초안 */
  BLOG_DRAFT: "blog-draft",
  /** 사용자 설정 */
  USER_PREFERENCES: "user-preferences",
  /** 테마 설정 */
  THEME: "theme",
} as const

/**
 * localStorage 키 타입
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * localStorage에 저장되는 전체 데이터 구조
 */
export interface LocalStorageData {
  /** 인증된 사용자 정보 */
  "auth-user": AuthUser | null

  /** 블로그 초안 */
  "blog-draft": BlogDraft | null

  /** 사용자 설정 */
  "user-preferences": UserPreferences

  /** 테마 설정 */
  theme: Theme
}

/**
 * 블로그 초안 (자동 저장용)
 */
export interface BlogDraft {
  /** 제목 */
  title: string

  /** 내용 */
  content: string

  /** 저장 일시 */
  savedAt: string

  /** 블로그 ID (수정 시) */
  blogId?: string
}

/**
 * 사용자 설정
 */
export interface UserPreferences {
  /** 언어 설정 */
  language: "en" | "ko"

  /** 페이지당 블로그 개수 */
  blogsPerPage: number

  /** 알림 설정 */
  notifications: boolean
}

/**
 * 테마 설정
 */
export type Theme = "light" | "dark" | "system"

/**
 * localStorage 헬퍼 함수 반환 타입
 */
export interface StorageHelper<T> {
  /** 값 가져오기 */
  get: () => T | null

  /** 값 저장하기 */
  set: (value: T) => void

  /** 값 삭제하기 */
  remove: () => void

  /** 값 존재 여부 */
  exists: () => boolean
}

/**
 * localStorage 이벤트 타입
 */
export interface StorageChangeEvent<T> {
  /** 변경된 키 */
  key: StorageKey

  /** 이전 값 */
  oldValue: T | null

  /** 새 값 */
  newValue: T | null

  /** 변경 일시 */
  timestamp: number
}

/**
 * localStorage 에러 타입
 */
export type StorageError =
  | "QUOTA_EXCEEDED"
  | "PARSE_ERROR"
  | "NOT_SUPPORTED"
  | "UNKNOWN"

/**
 * localStorage 작업 결과
 */
export interface StorageResult<T> {
  /** 성공 여부 */
  success: boolean

  /** 데이터 (성공 시) */
  data?: T

  /** 에러 타입 (실패 시) */
  error?: StorageError

  /** 에러 메시지 (실패 시) */
  message?: string
}
```

**구현 세부사항:**
- **STORAGE_KEYS**: 타입 안전한 키 상수
- **LocalStorageData**: 저장할 모든 데이터 타입 매핑
- **BlogDraft**: 블로그 작성 중 자동 저장 기능용
- **UserPreferences**: 사용자별 설정 저장
- **StorageHelper**: 타입 안전한 localStorage 래퍼 함수 반환 타입
- **에러 처리**: 할당량 초과, 파싱 에러 등 처리

**완료 조건:**
- [ ] STORAGE_KEYS 상수 정의
- [ ] LocalStorageData 인터페이스 정의
- [ ] BlogDraft 타입 정의
- [ ] UserPreferences 타입 정의
- [ ] StorageHelper 타입 정의
- [ ] 에러 타입 정의
- [ ] JSDoc 주석 작성

---

## 구현 순서

1. **types/user.ts 구현**
   - User, AuthUser 인터페이스 정의
   - MOCK_USER 상수 정의
   - DTO 타입 정의

2. **types/blog.ts 구현**
   - Blog 인터페이스 정의
   - 확장 타입 정의 (BlogCardData, BlogWithComments)
   - DTO 타입 정의

3. **types/comment.ts 구현**
   - Comment 인터페이스 정의
   - DTO 타입 정의

4. **types/auth.ts 구현**
   - AuthContextType 인터페이스 정의
   - AuthResult, Credentials 타입 정의

5. **types/storage.ts 구현**
   - LocalStorageData 인터페이스 정의
   - STORAGE_KEYS 상수 정의
   - 헬퍼 타입 정의

6. **통합 테스트**
   - 모든 타입 import 확인
   - 순환 참조 없는지 검증
   - TSDoc 주석 확인

---

## 검증 체크리스트

### types/user.ts
- [ ] User 인터페이스에 모든 필드 정의
- [ ] AuthUser가 비밀번호 제외하고 정의
- [ ] MOCK_USER 상수가 AuthUser 타입 준수
- [ ] DTO 타입이 검증 스키마와 일치
- [ ] JSDoc 주석 작성 완료

### types/blog.ts
- [ ] Blog 인터페이스가 camelCase 사용
- [ ] BlogCardData에 필수 필드만 포함
- [ ] BlogWithComments가 Blog 확장
- [ ] DTO 타입이 검증 스키마와 일치
- [ ] JSDoc 주석 작성 완료

### types/comment.ts
- [ ] Comment 인터페이스가 camelCase 사용
- [ ] CreateCommentDto가 필수 필드만 포함
- [ ] CommentWithAuthor가 Comment 확장
- [ ] JSDoc 주석 작성 완료

### types/auth.ts
- [ ] AuthContextType에 모든 함수 시그니처 정의
- [ ] AuthResult가 통일된 응답 형식 제공
- [ ] Phase 2 함수가 선택적 프로퍼티로 정의
- [ ] JSDoc 주석으로 각 함수 설명
- [ ] React.ReactNode 타입 사용

### types/storage.ts
- [ ] STORAGE_KEYS가 as const로 정의
- [ ] LocalStorageData가 모든 키 매핑
- [ ] StorageHelper가 제네릭 타입 지원
- [ ] 에러 타입이 모든 케이스 커버
- [ ] JSDoc 주석 작성 완료

---

## 참고사항

### 타입 재사용 패턴

**확장 (extends):**
```typescript
// Comment를 확장하여 작성자 정보 추가
export interface CommentWithAuthor extends Comment {
  authorEmail?: string
  authorRole?: "user" | "admin"
}
```

**Pick/Omit 유틸리티 타입:**
```typescript
// User에서 비밀번호 제외
export type AuthUser = Omit<User, "password">

// Blog에서 특정 필드만 선택
export type BlogPreview = Pick<Blog, "id" | "title" | "authorName" | "createdAt">
```

**DTO 패턴:**
```typescript
// API 요청용 타입 (ID 제외)
export type CreateBlogDto = Omit<Blog, "id" | "createdAt" | "updatedAt" | "authorId">

// API 응답용 타입 (비밀번호 제외)
export type UserResponse = Omit<User, "password">
```

### 타입 Import/Export 규칙

```typescript
// types/blog.ts
export interface Blog { /* ... */ }
export type BlogCardData = { /* ... */ }

// components/BlogCard.tsx
import type { BlogCardData } from "@/types/blog"
// 또는
import { type BlogCardData } from "@/types/blog"
```

### JSDoc 주석 작성 가이드

```typescript
/**
 * 블로그 글 데이터 구조
 *
 * @example
 * ```typescript
 * const blog: Blog = {
 *   id: "blog-1",
 *   title: "My First Post",
 *   content: "Hello World",
 *   authorId: "user-1",
 *   authorName: "John Doe",
 *   createdAt: "2024-01-15T10:00:00Z",
 *   updatedAt: "2024-01-15T10:00:00Z",
 * }
 * ```
 */
export interface Blog {
  /** 블로그 글 고유 ID (UUID) */
  id: string
  // ...
}
```

### TypeScript 설정

tsconfig.json에서 권장 설정:
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "paths": {
      "@/types/*": ["./types/*"]
    }
  }
}
```

### Phase 1 vs Phase 2 타입 차이

**Phase 1 (Mock Data):**
- User.password는 평문 문자열
- authorId는 항상 "mock-user-1"
- 모든 타임스탬프는 ISO 8601 문자열

**Phase 2 (Supabase):**
- User.password는 Supabase Auth가 관리 (타입에서 제거 가능)
- authorId는 실제 UUID
- 추가 필드: role, firstName, lastName, mobile 등

타입 정의는 두 Phase를 모두 지원하도록 설계되었으며, Phase 2 전용 필드는 옵션(?)으로 표시됩니다.

### 타입 안전성 강화 팁

1. **유니온 타입 사용**:
```typescript
export type Theme = "light" | "dark" | "system" // ✅ 좋음
// 대신
export type Theme = string // ❌ 나쁨
```

2. **readonly 사용**:
```typescript
export const STORAGE_KEYS = {
  AUTH_USER: "auth-user",
} as const // ✅ readonly 보장
```

3. **제네릭 활용**:
```typescript
export interface StorageHelper<T> {
  get: () => T | null
  set: (value: T) => void
}
```

4. **타입 가드 함수**:
```typescript
export function isAuthUser(user: unknown): user is AuthUser {
  return (
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    "email" in user &&
    "username" in user
  )
}
```
