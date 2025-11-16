# SignupForm

## 개요
**Phase**: Phase 3 - 인증 페이지
**파일 경로**: `components/auth/SignupForm.tsx`
**UI 참조**: 컴포넌트 계획 참조
**상태**: - [x] 완료 (Supabase Server Actions 사용)

## 페이지/컴포넌트 정보

**목적**: 회원가입 폼 컴포넌트, 이메일/사용자명/비밀번호 입력 및 제출 처리
**타입**: Feature Component (Client Component)
**위치**: SignupPage 내부

---

## 요구사항

### 기능 요구사항
- [ ] 이메일 입력 필드 (유효성 검사)
- [ ] 사용자명 입력 필드
- [ ] 비밀번호 입력 필드
- [ ] 비밀번호 확인 입력 필드
- [ ] 비밀번호 일치 확인
- [ ] 회원가입 버튼
- [ ] Server Action 호출 (signup)
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] Enter 키로 폼 제출 가능

### UI 요구사항
- [ ] 이메일 필드: Label + Input
- [ ] 사용자명 필드: Label + Input
- [ ] 비밀번호 필드: Label + Input (type="password")
- [ ] 비밀번호 확인 필드: Label + Input (type="password")
- [ ] 회원가입 버튼: 파란색, 전체 너비, 로딩 시 disabled
- [ ] 에러 메시지: 빨간색, 폼 하단
- [ ] 로딩 상태: 버튼에 "Signing up..." 텍스트

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
- Server Action: `signup` from `@/app/actions/auth`
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
import { signup } from "@/app/actions/auth"

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const result = await signup(email, password, username)

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/auth/login") // Redirect to login page
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

      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  )
}
```

---

## 구현 세부사항

### 상태 관리
```typescript
const [email, setEmail] = useState("")               // 이메일 입력값
const [username, setUsername] = useState("")         // 사용자명 입력값
const [password, setPassword] = useState("")         // 비밀번호 입력값
const [confirmPassword, setConfirmPassword] = useState("") // 비밀번호 확인
const [error, setError] = useState("")               // 에러 메시지
const [loading, setLoading] = useState(false)        // 로딩 상태
```

### 비밀번호 일치 확인
```typescript
if (password !== confirmPassword) {
  setError("Passwords do not match")
  return
}
```

### 폼 제출 처리
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")

  // Validate password match
  if (password !== confirmPassword) {
    setError("Passwords do not match")
    return
  }

  setLoading(true)

  try {
    const result = await signup(email, password, username)

    if (result.error) {
      setError(result.error)
    } else {
      router.push("/auth/login")
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
// app/actions/auth.ts에 정의된 signup 함수 호출
const result = await signup(email, password, username)

// result 형식:
// { error?: string } - 에러가 있으면 error 필드 포함
```

### 로딩 상태 UI
```typescript
<Button disabled={loading}>
  {loading ? "Signing up..." : "Sign Up"}
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

1. [ ] Create SignupForm component file (`components/auth/SignupForm.tsx`)
2. [ ] Add "use client" directive
3. [ ] Import React hooks (useState, useRouter)
4. [ ] Import UI components (Button, Input, Label)
5. [ ] Import signup Server Action
6. [ ] Define state variables (email, username, password, confirmPassword, error, loading)
7. [ ] Implement handleSubmit function
8. [ ] Add password match validation
9. [ ] Create form element with onSubmit handler
10. [ ] Add Email input field with Label
11. [ ] Add Username input field with Label
12. [ ] Add Password input field with Label
13. [ ] Add Confirm Password input field with Label
14. [ ] Add error message display
15. [ ] Add Submit button with loading state
16. [ ] Test form submission (valid data)
17. [ ] Test password mismatch error
18. [ ] Test error handling (invalid data)
19. [ ] Test loading state (button disabled during signup)

---

## 완료 조건

### Functionality
- [ ] SignupForm renders correctly
- [ ] All input fields work
- [ ] Password match validation works
- [ ] Form submits on button click
- [ ] Form submits on Enter key
- [ ] signup Server Action is called
- [ ] Successful signup redirects to login page
- [ ] Failed signup shows error message
- [ ] Loading state prevents multiple submissions

### UI/UX
- [ ] Email field with label and placeholder
- [ ] Username field with label and placeholder
- [ ] Password fields with labels and placeholders (masked)
- [ ] Signup button: Blue, full width
- [ ] Error message: Red, below form
- [ ] Loading state: Button text changes, fields disabled

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Follows React best practices
- [ ] Proper use of Client Component ("use client")
- [ ] Clean code structure

### Integration
- [ ] Works with signup Server Action
- [ ] Integrates with SignupPage
- [ ] Router navigation works
- [ ] Profile creation happens automatically (Server Action)

---

## 테스트 체크리스트

- [ ] Form render test
- [ ] Input typing test (email, username, password, confirmPassword)
- [ ] Password match validation test
- [ ] Password mismatch error test
- [ ] Form submission test (Enter key)
- [ ] Valid signup test (successful redirect)
- [ ] Invalid signup test (error message displayed)
- [ ] Duplicate email test (error from Supabase)
- [ ] Loading state test (button disabled, text changed)
- [ ] Error clearing test (error disappears on new submission)
- [ ] Accessibility test (keyboard navigation, screen reader)

---

## Server Action 연동

### app/actions/auth.ts (기존 파일)
```typescript
"use server"

import { createClient } from "@/lib/supabase/server"

export async function signup(
  email: string,
  password: string,
  username: string
) {
  const supabase = await createClient()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Create profile
  if (authData.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: authData.user.id,
        email: authData.user.email,
        first_name: username,
        role: "user",
      })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  return { success: true }
}
```

### SignupForm에서 호출
```typescript
const result = await signup(email, password, username)

if (result?.error) {
  setError(result.error)
} else {
  router.push("/auth/login")
}
```

---

## 참고사항

- SignupForm은 "use client" 컴포넌트 (useState, useRouter 사용)
- signup Server Action은 Supabase Auth + Profile 생성 처리
- Supabase Auth는 자동으로 이메일 중복 체크
- Profile은 signup Server Action에서 자동 생성
- 회원가입 성공 시 로그인 페이지로 리디렉션 (자동 로그인은 안 함)
- 비밀번호 강도 검사는 선택사항 (추후 추가 가능)
- 추후 react-hook-form과 zod로 업그레이드 가능 (Phase 8 이후)
- 현재는 간단한 useState로 폼 상태 관리
