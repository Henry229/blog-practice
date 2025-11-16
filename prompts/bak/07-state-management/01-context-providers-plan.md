# Context Providers 구현 계획

## 개요

SimpleBlog MVP의 전역 상태 관리를 위한 React Context Providers 구현 (Phase 1: Mock Data 기반)
- AuthContext: 인증 상태 전역 관리 (Mock 사용자 기반)
- BlogContext: 블로그 데이터 전역 관리 (선택사항)

**현재 단계 (Phase 1):**
- Mock 사용자 기반 인증 상태 관리
- Context API를 사용한 전역 상태 공유
- localStorage로 세션 유지 (Mock 데이터)
- Phase 2에서 실제 Supabase Auth로 전환 준비

**기술 스택:**
- React Context API
- TypeScript
- localStorage (세션 유지)
- Next.js 15 App Router

---

## Task List

### 0. 사전 준비
- [ ] 타입 정의 파일 생성 (`types/auth.ts`)
- [ ] useLocalStorage 훅 구현 (의존성)
- [ ] Mock 사용자 데이터 정의

---

### 1. AuthContext - 인증 상태 관리
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/contexts/AuthContext.tsx`

**요구사항:**
- [ ] Client Component로 구현 ("use client")
- [ ] Context 생성 및 Provider 구현
- [ ] Mock 사용자 상태 관리
- [ ] 로그인/로그아웃 함수 제공
- [ ] localStorage로 세션 유지
- [ ] useAuth 커스텀 훅 export
- [ ] TypeScript 타입 안정성
- [ ] 초기 로딩 상태 처리

**의존성:**
- `types/auth.ts` - AuthUser, AuthContextType 인터페이스
- `hooks/useLocalStorage.ts` - localStorage 래퍼 훅
- React Context API

**기본 구조:**
```typescript
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { AuthUser, AuthContextType } from "@/types/auth"

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock 사용자 데이터
const MOCK_USER: AuthUser = {
  id: "mock-user-1",
  email: "john@example.com",
  username: "John Doe",
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<AuthUser | null>("auth-user", null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로딩 (세션 복원)
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // 로그인 함수 (Mock)
  const login = async (email: string, password: string) => {
    // Phase 1: Mock 로그인 (항상 성공)
    // 실제 검증 없이 Mock 사용자 반환
    setUser(MOCK_USER)
    return { success: true, user: MOCK_USER }
  }

  // 로그아웃 함수
  const logout = async () => {
    setUser(null)
    return { success: true }
  }

  // 회원가입 함수 (Mock)
  const signup = async (email: string, username: string, password: string) => {
    // Phase 1: Mock 회원가입 (항상 성공)
    const newUser: AuthUser = {
      id: "mock-user-1",
      email,
      username,
    }
    setUser(newUser)
    return { success: true, user: newUser }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
```

**구현 세부사항:**

**1. Context 생성**
- `createContext<AuthContextType | undefined>(undefined)` 사용
- undefined로 초기화하여 Provider 외부 사용 방지

**2. 상태 관리**
- `user`: 현재 로그인한 사용자 (AuthUser | null)
- `isLoading`: 초기 로딩 상태 (boolean)
- `isAuthenticated`: 로그인 여부 (computed)

**3. 로그인 로직 (Mock)**
- Phase 1: 어떤 이메일/비밀번호든 Mock 사용자 반환
- localStorage에 사용자 정보 저장
- Phase 2: 실제 Supabase Auth로 교체

**4. 로그아웃 로직**
- localStorage에서 사용자 정보 제거
- user 상태를 null로 설정

**5. 회원가입 로직 (Mock)**
- Phase 1: 입력받은 정보로 Mock 사용자 생성
- Phase 2: 실제 Supabase Auth로 교체

**6. useAuth 훅**
- Context 값에 쉽게 접근
- Provider 외부 사용 시 에러 발생

**7. localStorage 통합**
- useLocalStorage 훅으로 자동 저장/로드
- 페이지 새로고침 시 세션 유지

**완료 조건:**
- [ ] AuthContext 생성 및 Provider 구현
- [ ] login, logout, signup 함수 작동
- [ ] useAuth 훅으로 상태 접근 가능
- [ ] localStorage 세션 유지 확인
- [ ] 초기 로딩 상태 처리
- [ ] TypeScript 타입 체크 통과

---

### 2. BlogContext - 블로그 데이터 관리 (선택사항)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/contexts/BlogContext.tsx`

**요구사항:**
- [ ] Client Component로 구현 ("use client")
- [ ] Context 생성 및 Provider 구현
- [ ] 블로그 목록 전역 상태 관리
- [ ] CRUD 함수 제공 (create, update, delete)
- [ ] Mock Data 통합 (`lib/data/mockBlogs.ts`)
- [ ] useBlog 커스텀 훅 export
- [ ] 로딩/에러 상태 관리
- [ ] 낙관적 업데이트 (Optimistic Updates)

**의존성:**
- `types/blog.ts` - Blog, BlogContextType 인터페이스
- `lib/data/mockBlogs.ts` - Mock 블로그 CRUD 함수
- React Context API

**기본 구조:**
```typescript
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  getMockBlogs,
  getMockBlogById,
  addMockBlog,
  updateMockBlog,
  deleteMockBlog,
  searchMockBlogs,
} from "@/lib/data/mockBlogs"
import type { Blog, BlogContextType } from "@/types/blog"

const BlogContext = createContext<BlogContextType | undefined>(undefined)

interface BlogProviderProps {
  children: ReactNode
}

export function BlogProvider({ children }: BlogProviderProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 블로그 목록 로드
  const fetchBlogs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = getMockBlogs()
      setBlogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs")
    } finally {
      setIsLoading(false)
    }
  }

  // 초기 로드
  useEffect(() => {
    fetchBlogs()
  }, [])

  // 블로그 생성
  const createBlog = async (title: string, content: string, authorName: string) => {
    try {
      const newBlog = addMockBlog(title, content, authorName)
      setBlogs((prev) => [newBlog, ...prev]) // 낙관적 업데이트
      return { success: true, blog: newBlog }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog")
      return { success: false, error: error }
    }
  }

  // 블로그 수정
  const updateBlog = async (id: string, title: string, content: string) => {
    try {
      updateMockBlog(id, title, content)
      // 낙관적 업데이트
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === id
            ? { ...blog, title, content, updatedAt: new Date().toISOString() }
            : blog
        )
      )
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update blog")
      return { success: false, error: error }
    }
  }

  // 블로그 삭제
  const deleteBlog = async (id: string) => {
    try {
      deleteMockBlog(id)
      // 낙관적 업데이트
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog")
      return { success: false, error: error }
    }
  }

  // 블로그 검색
  const searchBlogs = async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const results = searchMockBlogs(query)
      setBlogs(results)
      return { success: true, results }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search blogs")
      return { success: false, error: error }
    } finally {
      setIsLoading(false)
    }
  }

  const value: BlogContextType = {
    blogs,
    isLoading,
    error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    searchBlogs,
  }

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
}

// Custom Hook
export function useBlog() {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider")
  }
  return context
}
```

**구현 세부사항:**

**1. 상태 관리**
- `blogs`: 블로그 목록 배열
- `isLoading`: 로딩 상태
- `error`: 에러 메시지

**2. CRUD 함수**
- `createBlog`: 새 글 작성
- `updateBlog`: 글 수정
- `deleteBlog`: 글 삭제
- `searchBlogs`: 검색

**3. 낙관적 업데이트**
- UI 즉시 업데이트 후 백엔드 동기화
- 사용자 경험 향상
- Phase 2에서 rollback 로직 추가

**4. 에러 처리**
- try-catch로 에러 캐치
- error 상태에 메시지 저장
- UI에서 에러 표시

**5. 초기 로드**
- useEffect로 컴포넌트 마운트 시 데이터 로드
- Phase 2에서 Server Component로 전환 가능

**선택사항 고려:**
- BlogContext는 선택사항
- 페이지에서 직접 Mock 함수 호출해도 됨
- 전역 상태 공유가 필요한 경우만 사용

**완료 조건:**
- [ ] BlogContext 생성 및 Provider 구현
- [ ] CRUD 함수 모두 작동
- [ ] useBlog 훅으로 상태 접근 가능
- [ ] 낙관적 업데이트 확인
- [ ] 로딩/에러 상태 처리
- [ ] TypeScript 타입 체크 통과

---

## 구현 순서

### Phase 1: 타입 및 의존성 (Day 1)
1. `types/auth.ts` 타입 정의 생성
2. `types/blog.ts` 타입 정의 생성
3. `hooks/useLocalStorage.ts` 구현
4. Mock 사용자 데이터 정의

### Phase 2: AuthContext 구현 (Day 2)
5. AuthContext 기본 구조 생성
6. login, logout, signup 함수 구현
7. useAuth 훅 구현
8. localStorage 통합
9. 초기 로딩 상태 처리

### Phase 3: RootLayout 통합 (Day 3)
10. `app/layout.tsx`에 AuthProvider 래핑
11. 전체 앱에서 useAuth 접근 가능 확인

### Phase 4: BlogContext 구현 (Day 4, 선택사항)
12. BlogContext 기본 구조 생성
13. CRUD 함수 구현
14. useBlog 훅 구현
15. 낙관적 업데이트 구현
16. (선택) `app/layout.tsx`에 BlogProvider 래핑

---

## 검증 체크리스트

### AuthContext
- [ ] AuthProvider로 앱 래핑
- [ ] useAuth 훅으로 user 상태 접근 가능
- [ ] login 함수 실행 시 user 상태 업데이트
- [ ] logout 함수 실행 시 user null로 설정
- [ ] signup 함수 실행 시 새 사용자 생성
- [ ] localStorage에 사용자 정보 저장
- [ ] 페이지 새로고침 시 세션 유지
- [ ] isLoading 상태 올바르게 표시
- [ ] Provider 외부에서 useAuth 사용 시 에러

### BlogContext (선택사항)
- [ ] BlogProvider로 앱 래핑
- [ ] useBlog 훅으로 blogs 상태 접근 가능
- [ ] createBlog 함수 실행 시 목록 업데이트
- [ ] updateBlog 함수 실행 시 해당 블로그 수정
- [ ] deleteBlog 함수 실행 시 목록에서 제거
- [ ] searchBlogs 함수로 검색 결과 필터링
- [ ] 낙관적 업데이트 즉시 반영
- [ ] 로딩 상태 올바르게 표시
- [ ] 에러 발생 시 error 상태 업데이트

---

## 참고사항

### AuthContext vs 페이지별 상태
**AuthContext 사용:**
- ✅ 전역에서 인증 상태 접근 필요
- ✅ 여러 컴포넌트에서 user 정보 사용
- ✅ 로그인/로그아웃 함수 재사용
- ✅ 세션 유지 필요

**페이지별 상태 사용:**
- ✅ 단순한 폼 제출
- ✅ 일회성 인증 체크

### BlogContext vs 직접 호출
**BlogContext 사용 (선택사항):**
- ✅ 여러 페이지에서 블로그 목록 공유
- ✅ 낙관적 업데이트 필요
- ✅ 전역 검색 상태 유지
- ✅ 실시간 업데이트 필요

**직접 Mock 함수 호출 (기본):**
- ✅ 페이지별 독립적인 데이터
- ✅ 간단한 구현
- ✅ Phase 2 전환 용이

**권장:** Phase 1에서는 BlogContext 없이 직접 호출 방식 사용

### Provider 래핑 순서
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {/* BlogProvider는 선택사항 */}
          {/* <BlogProvider> */}
            {children}
          {/* </BlogProvider> */}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### TypeScript 타입 정의

**types/auth.ts:**
```typescript
export interface AuthUser {
  id: string
  email: string
  username: string
}

export interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{
    success: boolean
    user?: AuthUser
    error?: string
  }>
  logout: () => Promise<{ success: boolean }>
  signup: (email: string, username: string, password: string) => Promise<{
    success: boolean
    user?: AuthUser
    error?: string
  }>
}
```

**types/blog.ts (BlogContext용):**
```typescript
export interface BlogContextType {
  blogs: Blog[]
  isLoading: boolean
  error: string | null
  fetchBlogs: () => Promise<void>
  createBlog: (title: string, content: string, authorName: string) => Promise<{
    success: boolean
    blog?: Blog
    error?: string
  }>
  updateBlog: (id: string, title: string, content: string) => Promise<{
    success: boolean
    error?: string
  }>
  deleteBlog: (id: string) => Promise<{
    success: boolean
    error?: string
  }>
  searchBlogs: (query: string) => Promise<{
    success: boolean
    results?: Blog[]
    error?: string
  }>
}
```

### Phase 2 마이그레이션 준비
- Mock 함수 시그니처를 Supabase Auth API와 유사하게 유지
- Context 구조는 유지하고 내부 로직만 교체
- localStorage → Supabase Session으로 전환
- 컴포넌트 코드는 최소한으로 수정

### 에러 처리
- Phase 1: console.error + error 상태
- Phase 2: Toast 알림 추가

### 세션 유지
- useLocalStorage 훅으로 자동 저장/로드
- 키: "auth-user"
- Phase 2: Supabase 세션 쿠키로 전환

### 보안 고려사항
- Phase 1: Mock 데이터로 보안 불필요
- Phase 2: 비밀번호 해싱, JWT 토큰, XSS/CSRF 방지

### 성능 최적화
- Context 값 memoization (useMemo, useCallback)
- 불필요한 리렌더링 방지
- Phase 2: React Query로 전환 고려
