# LoginForm

## 개요
**Phase**: Phase 3 - 인증 페이지
**파일 경로**: `components/auth/LoginForm.tsx`
**UI 참조**: 컴포넌트 계획 참조
**상태**: - [x] 완료 (Supabase Server Actions 사용)

## 페이지/컴포넌트 정보

**목적**: 로그인 폼 컴포넌트, 이메일/비밀번호 입력 및 제출 처리
**타입**: Feature Component (Client Component)
**위치**: LoginPage 내부

---

## 요구사항

### 기능 요구사항
- [ ] 이메일 입력 필드 (유효성 검사)
- [ ] 비밀번호 입력 필드
- [ ] 로그인 버튼
- [ ] Server Action 호출 (login)
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] Enter 키로 폼 제출 가능

### UI 요구사항
- [ ] 이메일 필드: Label + Input
- [ ] 비밀번호 필드: Label + Input (type="password")
- [ ] 로그인 버튼: 파란색, 전체 너비, 로딩 시 disabled
- [ ] 에러 메시지: 빨간색, 폼 하단
- [ ] 로딩 상태: 버튼에 "Logging in..." 텍스트

### 접근성 요구사항
- [ ] 레이블과 입력 필드 연결 (htmlFor)
- [ ] 에러 메시지 role="alert"
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button input label
```

### 내부 의존성
- Server Action: `login` from `@/app/actions/auth`
- UI components: `Button`, `Input`, `Label` from `@/components/ui`

---

## 기본 구조

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions/auth"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/") // Redirect to homepage
        router.refresh() // Refresh to update auth state
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
```

---

## 구현 세부사항

### 상태 관리
```typescript
const [email, setEmail] = useState("")       // 이메일 입력값
const [password, setPassword] = useState("") // 비밀번호 입력값
const [error, setError] = useState("")       // 에러 메시지
const [loading, setLoading] = useState(false) // 로딩 상태
```

### 폼 제출 처리
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    const result = await login(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      router.push("/")
      router.refresh()
    }
  } catch (err) {
    setError("An unexpected error occurred")
  } finally {
    setLoading(false)
  }
}
```

### Server Action 호출
```typescript
// app/actions/auth.ts에 정의된 login 함수 호출
const result = await login(email, password)

// result 형식:
// { error?: string } - 에러가 있으면 error 필드 포함
```

### 로딩 상태 UI
```typescript
<Button disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</Button>

<Input disabled={loading} /> // 로딩 중에는 입력 비활성화
```

### 에러 표시
```typescript
{error && (
  <div className="text-sm text-red-600" role="alert">
    {error}
  </div>
)}
```

---

## 구현 단계

1. [ ] Create LoginForm component file (`components/auth/LoginForm.tsx`)
2. [ ] Add "use client" directive
3. [ ] Import React hooks (useState, useRouter)
4. [ ] Import UI components (Button, Input, Label)
5. [ ] Import login Server Action
6. [ ] Define state variables (email, password, error, loading)
7. [ ] Implement handleSubmit function
8. [ ] Create form element with onSubmit handler
9. [ ] Add Email input field with Label
10. [ ] Add Password input field with Label
11. [ ] Add error message display
12. [ ] Add Submit button with loading state
13. [ ] Test form submission (valid credentials)
14. [ ] Test error handling (invalid credentials)
15. [ ] Test loading state (button disabled during login)

---

## 완료 조건

### Functionality
- [ ] LoginForm renders correctly
- [ ] Email and password inputs work
- [ ] Form submits on button click
- [ ] Form submits on Enter key
- [ ] login Server Action is called
- [ ] Successful login redirects to homepage
- [ ] Failed login shows error message
- [ ] Loading state prevents multiple submissions

### UI/UX
- [ ] Email field with label and placeholder
- [ ] Password field with label and placeholder (masked)
- [ ] Login button: Blue, full width
- [ ] Error message: Red, below form
- [ ] Loading state: Button text changes, fields disabled

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Follows React best practices
- [ ] Proper use of Client Component ("use client")
- [ ] Clean code structure

### Integration
- [ ] Works with login Server Action
- [ ] Integrates with LoginPage
- [ ] Router navigation works
- [ ] Auth state updates after login

---

## 테스트 체크리스트

- [ ] Form render test
- [ ] Input typing test (email, password)
- [ ] Form submission test (Enter key)
- [ ] Valid login test (successful redirect)
- [ ] Invalid login test (error message displayed)
- [ ] Loading state test (button disabled, text changed)
- [ ] Error clearing test (error disappears on new submission)
- [ ] Accessibility test (keyboard navigation, screen reader)

---

## Server Action 연동

### app/actions/auth.ts (기존 파일)
```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/") // Redirect on success
}
```

### LoginForm에서 호출
```typescript
const result = await login(email, password)

if (result?.error) {
  setError(result.error)
}
```

---

## 참고사항

- LoginForm은 "use client" 컴포넌트 (useState, useRouter 사용)
- login Server Action은 Supabase Auth를 호출
- Supabase Auth는 자동으로 httpOnly 쿠키 설정
- Middleware가 세션을 자동으로 리프레시
- 로그인 성공 시 `router.refresh()`로 클라이언트 상태 업데이트
- 에러 메시지는 Supabase에서 반환된 메시지 사용
- 추후 react-hook-form과 zod로 업그레이드 가능 (Phase 8 이후)
- 현재는 간단한 useState로 폼 상태 관리
