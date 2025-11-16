# Custom Hooks 구현 계획

## 개요

SimpleBlog MVP의 재사용 가능한 커스텀 React 훅 구현
- useAuth: 인증 상태 접근 (AuthContext 소비)
- useBlog: 블로그 CRUD 작업
- useComment: 댓글 CRUD 작업
- useLocalStorage: localStorage 래퍼 훅

**현재 단계 (Phase 1):**
- Mock Data 기반 커스텀 훅
- Client Component에서 사용
- 재사용 가능한 로직 캡슐화
- Phase 2에서 Server Actions로 전환 준비

**기술 스택:**
- React Hooks (useState, useEffect, useCallback)
- TypeScript
- localStorage API
- Mock Data

---

## Task List

### 0. 사전 준비
- [ ] 타입 정의 파일 생성
- [ ] Mock Data 함수 구현 완료 확인
- [ ] AuthContext 구현 완료 확인 (useAuth용)

---

### 1. useAuth - 인증 상태 접근
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `app/contexts/AuthContext.tsx` (AuthContext 내부에 포함)

**요구사항:**
- [ ] AuthContext 소비
- [ ] user, isLoading, isAuthenticated 반환
- [ ] login, logout, signup 함수 반환
- [ ] Provider 외부 사용 시 에러 발생
- [ ] TypeScript 타입 안정성

**의존성:**
- AuthContext (Context Providers에서 구현)

**기본 구조:**
```typescript
// app/contexts/AuthContext.tsx에 포함

import { useContext } from "react"

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
```

**사용 예시:**
```typescript
"use client"

import { useAuth } from "@/contexts/AuthContext"

export function ProfilePage() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  )
}
```

**완료 조건:**
- [ ] AuthContext 값 접근 가능
- [ ] Provider 외부 사용 시 명확한 에러 메시지
- [ ] TypeScript 타입 체크 통과

---

### 2. useBlog - 블로그 CRUD 작업
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `hooks/useBlog.ts`

**요구사항:**
- [ ] Mock Data CRUD 함수 래핑
- [ ] 로딩/에러 상태 관리
- [ ] create, update, delete, fetch 함수 제공
- [ ] 낙관적 업데이트 지원 (선택사항)
- [ ] TypeScript 제네릭 타입 사용

**의존성:**
- `lib/data/mockBlogs.ts` - Mock 블로그 CRUD 함수
- `types/blog.ts` - Blog 타입

**기본 구조:**
```typescript
import { useState, useCallback } from "react"
import {
  getMockBlogs,
  getMockBlogById,
  addMockBlog,
  updateMockBlog,
  deleteMockBlog,
  searchMockBlogs,
} from "@/lib/data/mockBlogs"
import type { Blog } from "@/types/blog"

export function useBlog() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 모든 블로그 가져오기
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const blogs = getMockBlogs()
      return { success: true, data: blogs }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch blogs"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 특정 블로그 가져오기
  const fetchBlogById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const blog = getMockBlogById(id)
      if (!blog) {
        throw new Error("Blog not found")
      }
      return { success: true, data: blog }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch blog"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 블로그 생성
  const createBlog = useCallback(
    async (title: string, content: string, authorName: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const newBlog = addMockBlog(title, content, authorName)
        return { success: true, data: newBlog }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create blog"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // 블로그 수정
  const updateBlog = useCallback(async (id: string, title: string, content: string) => {
    setIsLoading(true)
    setError(null)
    try {
      updateMockBlog(id, title, content)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update blog"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 블로그 삭제
  const deleteBlog = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      deleteMockBlog(id)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete blog"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 블로그 검색
  const searchBlogs = useCallback(async (query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const results = searchMockBlogs(query)
      return { success: true, data: results }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search blogs"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    fetchBlogs,
    fetchBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    searchBlogs,
  }
}
```

**사용 예시:**
```typescript
"use client"

import { useState, useEffect } from "react"
import { useBlog } from "@/hooks/useBlog"
import type { Blog } from "@/types/blog"

export function BlogListPage() {
  const { fetchBlogs, isLoading, error } = useBlog()
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const loadBlogs = async () => {
      const result = await fetchBlogs()
      if (result.success && result.data) {
        setBlogs(result.data)
      }
    }
    loadBlogs()
  }, [fetchBlogs])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>{blog.title}</div>
      ))}
    </div>
  )
}
```

**완료 조건:**
- [ ] 모든 CRUD 함수 작동
- [ ] 로딩/에러 상태 올바르게 관리
- [ ] useCallback으로 함수 메모이제이션
- [ ] TypeScript 타입 체크 통과

---

### 3. useComment - 댓글 CRUD 작업
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `hooks/useComment.ts`

**요구사항:**
- [ ] Mock Data CRUD 함수 래핑
- [ ] 로딩/에러 상태 관리
- [ ] create, delete, fetch 함수 제공
- [ ] blogId별 댓글 필터링
- [ ] TypeScript 타입 안정성

**의존성:**
- `lib/data/mockComments.ts` - Mock 댓글 CRUD 함수
- `types/comment.ts` - Comment 타입

**기본 구조:**
```typescript
import { useState, useCallback } from "react"
import {
  getMockComments,
  addMockComment,
  deleteMockComment,
} from "@/lib/data/mockComments"
import type { Comment } from "@/types/comment"

export function useComment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 특정 블로그의 댓글 가져오기
  const fetchComments = useCallback(async (blogId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const comments = getMockComments(blogId)
      return { success: true, data: comments }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch comments"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 댓글 생성
  const createComment = useCallback(
    async (blogId: string, content: string, authorName: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const newComment = addMockComment(blogId, content, authorName)
        return { success: true, data: newComment }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create comment"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // 댓글 삭제
  const deleteComment = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      deleteMockComment(id)
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete comment"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    fetchComments,
    createComment,
    deleteComment,
  }
}
```

**사용 예시:**
```typescript
"use client"

import { useState, useEffect } from "react"
import { useComment } from "@/hooks/useComment"
import type { Comment } from "@/types/comment"

export function CommentSection({ blogId }: { blogId: string }) {
  const { fetchComments, createComment, isLoading, error } = useComment()
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    const loadComments = async () => {
      const result = await fetchComments(blogId)
      if (result.success && result.data) {
        setComments(result.data)
      }
    }
    loadComments()
  }, [blogId, fetchComments])

  const handleSubmit = async (content: string) => {
    const result = await createComment(blogId, content, "John Doe")
    if (result.success && result.data) {
      setComments((prev) => [...prev, result.data!])
    }
  }

  return (
    <div>
      {/* 댓글 목록 및 작성 폼 */}
    </div>
  )
}
```

**완료 조건:**
- [ ] 모든 댓글 CRUD 함수 작동
- [ ] blogId별 필터링 정상 작동
- [ ] 로딩/에러 상태 올바르게 관리
- [ ] TypeScript 타입 체크 통과

---

### 4. useLocalStorage - localStorage 래퍼 훅
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `hooks/useLocalStorage.ts`

**요구사항:**
- [ ] localStorage 읽기/쓰기 자동화
- [ ] JSON 직렬화/역직렬화 자동 처리
- [ ] SSR 안전성 (window 체크)
- [ ] TypeScript 제네릭 타입 지원
- [ ] 초기값 설정 가능
- [ ] setState와 동일한 인터페이스

**의존성:**
- 없음 (순수 React Hook)

**기본 구조:**
```typescript
import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // SSR 안전성: window가 없으면 초기값 반환
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // localStorage에 저장
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // useState와 동일한 함수 업데이트 지원
        const valueToStore = value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // storage 이벤트 감지 (다른 탭에서 변경 시)
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
```

**사용 예시:**
```typescript
"use client"

import { useLocalStorage } from "@/hooks/useLocalStorage"

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light")

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}

// AuthContext에서 사용
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage<AuthUser | null>("auth-user", null)

  const login = async (email: string, password: string) => {
    const mockUser = { id: "1", email, username: "John Doe" }
    setUser(mockUser) // 자동으로 localStorage에 저장
  }

  // ...
}
```

**구현 세부사항:**

**1. SSR 안전성**
- `typeof window === "undefined"` 체크
- 서버에서 실행 시 초기값 반환

**2. JSON 직렬화**
- 자동으로 JSON.stringify/parse
- 객체, 배열, 원시값 모두 지원

**3. 함수형 업데이트**
- setState와 동일한 인터페이스
- `setValue((prev) => prev + 1)` 형태 지원

**4. Storage 이벤트**
- 다른 탭에서 변경 감지
- 자동 동기화

**5. 에러 처리**
- try-catch로 안전하게 처리
- 에러 시 초기값 반환

**완료 조건:**
- [ ] 값 읽기/쓰기 정상 작동
- [ ] SSR 환경에서 에러 없음
- [ ] JSON 직렬화 자동 처리
- [ ] 함수형 업데이트 지원
- [ ] 다른 탭에서 변경 감지
- [ ] TypeScript 제네릭 타입 체크 통과

---

## 구현 순서

### Phase 1: 기본 훅 구현 (Day 1)
1. useLocalStorage 구현
2. useLocalStorage 테스트 (단위 테스트 또는 간단한 컴포넌트)

### Phase 2: CRUD 훅 구현 (Day 2-3)
3. useBlog 구현
4. useBlog 테스트
5. useComment 구현
6. useComment 테스트

### Phase 3: useAuth 통합 (Day 4)
7. AuthContext에 useAuth 추가 (이미 구현됨)
8. 전체 앱에서 useAuth 사용 확인

---

## 검증 체크리스트

### useAuth
- [ ] AuthContext 값 접근 가능
- [ ] user, isLoading, isAuthenticated 반환
- [ ] login, logout, signup 함수 호출 가능
- [ ] Provider 외부 사용 시 명확한 에러

### useBlog
- [ ] fetchBlogs 실행 시 모든 블로그 반환
- [ ] fetchBlogById 실행 시 특정 블로그 반환
- [ ] createBlog 실행 시 새 블로그 생성
- [ ] updateBlog 실행 시 블로그 수정
- [ ] deleteBlog 실행 시 블로그 삭제
- [ ] searchBlogs 실행 시 검색 결과 반환
- [ ] isLoading 상태 올바르게 업데이트
- [ ] error 상태 에러 발생 시 업데이트

### useComment
- [ ] fetchComments 실행 시 해당 블로그 댓글 반환
- [ ] createComment 실행 시 새 댓글 생성
- [ ] deleteComment 실행 시 댓글 삭제
- [ ] isLoading 상태 올바르게 업데이트
- [ ] error 상태 에러 발생 시 업데이트

### useLocalStorage
- [ ] 초기값 설정 시 localStorage에 저장
- [ ] setValue 실행 시 localStorage 업데이트
- [ ] 페이지 새로고침 시 값 유지
- [ ] 함수형 업데이트 정상 작동
- [ ] SSR 환경에서 에러 없음
- [ ] 다른 탭에서 변경 시 동기화
- [ ] TypeScript 제네릭 타입 올바르게 추론

---

## 참고사항

### Custom Hook 규칙
- 함수명은 "use"로 시작
- React Hook 규칙 준수 (조건부 호출 금지)
- 재사용 가능한 로직만 추출
- 컴포넌트 내부에서만 호출

### useCallback 사용
- 함수 메모이제이션으로 불필요한 리렌더링 방지
- 의존성 배열 정확하게 지정
- 모든 CRUD 함수에 적용

### 에러 처리 패턴
```typescript
try {
  // 작업 수행
  return { success: true, data }
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : "Error message"
  setError(errorMessage)
  return { success: false, error: errorMessage }
} finally {
  setIsLoading(false)
}
```

### 일관된 반환 형식
모든 훅은 `{ success: boolean, data?, error? }` 형식 반환

### TypeScript 제네릭 활용
```typescript
// useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]

// 사용
const [user, setUser] = useLocalStorage<AuthUser | null>("user", null)
// user는 자동으로 AuthUser | null 타입으로 추론
```

### Phase 2 마이그레이션 준비
- useBlog, useComment 내부 로직만 Server Actions로 교체
- 인터페이스는 동일하게 유지
- 컴포넌트 코드는 수정 불필요

### 성능 최적화
- useCallback으로 함수 메모이제이션
- 필요한 경우 useMemo로 값 메모이제이션
- 불필요한 상태 업데이트 방지

### SSR 고려사항
- useLocalStorage는 클라이언트 전용
- Client Component에서만 사용
- window 객체 체크 필수

### 테스트 전략
- 단위 테스트: 각 훅 독립 테스트
- 통합 테스트: 실제 컴포넌트에서 사용
- 엣지 케이스: 에러, 빈 데이터 등
