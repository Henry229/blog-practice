# AuthProvider

## 개요
**Phase**: Phase 2 - Root Layout & Providers
**파일 경로**: `components/providers/AuthProvider.tsx`
**UI 참조**: N/A (전역 상태 관리)
**상태**: - [x] 구현하지 않음 (Supabase Middleware 사용)

> **⚠️ 변경사항**: 이 컴포넌트는 Supabase 기반 구현에서 **사용하지 않습니다**.
>
> **대신 사용하는 방식**:
> - `middleware.ts` - Supabase Auth 세션 관리
> - `lib/supabase/server.ts` - Server Component에서 사용자 정보 접근
> - `lib/supabase/client.ts` - Client Component에서 사용자 정보 접근
>
> React Context 대신 **Supabase Middleware 기반 인증**을 사용합니다.

## 페이지/컴포넌트 정보

**목적**: React Context를 사용한 인증 상태 전역 관리 및 useAuth 훅 제공
**타입**: Provider Component (Context Provider)
**위치**: RootLayout에서 전체 앱을 래핑

---

## 요구사항

### 기능 요구사항
- [ ] React Context로 인증 상태 관리
- [ ] 현재 로그인 사용자 정보 제공
- [ ] useAuth 커스텀 훅 제공
- [ ] Supabase Auth 통합 (getUser 호출)
- [ ] 클라이언트 사이드에서 사용자 정보 접근 가능
- [ ] 인증 상태 변경 시 자동 업데이트

### 기술 요구사항
- [ ] React Context API 사용
- [ ] Supabase Client (client-side) 사용
- [ ] TypeScript 타입 정의
- [ ] useEffect로 초기 사용자 정보 로드
- [ ] Loading 상태 관리

### 접근성 요구사항
- N/A (UI 컴포넌트 아님)

---

## 의존성

### Supabase 클라이언트
```typescript
import { createClient } from "@/lib/supabase/client"
```

### React
```typescript
import { createContext, useContext, useEffect, useState } from "react"
```

### 내부 의존성
- Type: `AuthUser` from `types/auth.ts`

---

## 기본 구조

```typescript
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
```

---

## 구현 세부사항

### AuthContextType 인터페이스
```typescript
interface AuthContextType {
  user: User | null        // 현재 로그인 사용자 (Supabase User 타입)
  loading: boolean         // 초기 로딩 상태
}
```

### 상태 관리
```typescript
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(true)
```

### 초기 사용자 정보 로드
```typescript
useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  getUser()
}, [supabase])
```

### 인증 상태 변경 감지
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (_event, session) => {
    setUser(session?.user ?? null)
    setLoading(false)
  }
)

// Cleanup
return () => {
  subscription.unsubscribe()
}
```

### useAuth 커스텀 훅
```typescript
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
```

### 에러 처리
- AuthProvider 외부에서 useAuth 사용 시 에러 발생
- 명확한 에러 메시지 제공

---

## 구현 단계

1. [ ] Create AuthProvider component file (`components/providers/AuthProvider.tsx`)
2. [ ] Import React (createContext, useContext, useEffect, useState)
3. [ ] Import Supabase client
4. [ ] Define AuthContextType interface
5. [ ] Create AuthContext with createContext
6. [ ] Implement AuthProvider component
7. [ ] Add user and loading state (useState)
8. [ ] Create Supabase client instance
9. [ ] Implement useEffect for initial user load
10. [ ] Add onAuthStateChange listener
11. [ ] Implement subscription cleanup
12. [ ] Create AuthContext.Provider with value
13. [ ] Implement useAuth custom hook
14. [ ] Add error handling for useAuth
15. [ ] Test AuthProvider integration in RootLayout
16. [ ] Test useAuth hook in child components

---

## 완료 조건

### Functionality
- [ ] AuthProvider wraps entire app in RootLayout
- [ ] useAuth hook accessible in all child components
- [ ] user state updates on login/logout
- [ ] loading state shows true during initial load
- [ ] onAuthStateChange updates user automatically

### Code Quality
- [ ] TypeScript types are correct (AuthContextType)
- [ ] No console errors or warnings
- [ ] Follows React Context best practices
- [ ] Proper cleanup (subscription unsubscribe)
- [ ] Error handling for useAuth misuse

### Integration
- [ ] Integrates with RootLayout
- [ ] Works with Supabase Auth
- [ ] Header components can use useAuth
- [ ] Protected routes can check user state

---

## 테스트 체크리스트

- [ ] Initial user load test (page refresh)
- [ ] Login state change test (user updates after login)
- [ ] Logout state change test (user clears after logout)
- [ ] Loading state test (true initially, false after load)
- [ ] useAuth hook test (returns user and loading)
- [ ] useAuth error test (throws error if used outside provider)
- [ ] onAuthStateChange test (listens to auth events)
- [ ] Subscription cleanup test (no memory leaks)

---

## 사용 예시

### RootLayout Integration
```typescript
// app/layout.tsx
import { AuthProvider } from "@/components/providers/AuthProvider"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Using useAuth Hook
```typescript
// components/layout/Header.tsx
"use client"

import { useAuth } from "@/components/providers/AuthProvider"

export function Header() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <header>
      {user ? (
        <span>Welcome, {user.email}</span>
      ) : (
        <span>Please login</span>
      )}
    </header>
  )
}
```

---

## 참고사항

- AuthProvider는 "use client" 컴포넌트 (React Context 사용)
- Supabase의 onAuthStateChange로 실시간 인증 상태 감지
- User 타입은 Supabase의 User 타입 사용 (`@supabase/supabase-js`)
- loading 상태로 초기 로딩 화면 표시 가능
- RootLayout에서 전체 앱을 래핑하여 모든 컴포넌트에서 useAuth 사용 가능
- 추후 Mock 인증에서 Supabase Auth로 전환 시 이 파일만 수정
- Server Components에서는 useAuth 사용 불가 (Server-side는 `lib/supabase/server.ts` 사용)
