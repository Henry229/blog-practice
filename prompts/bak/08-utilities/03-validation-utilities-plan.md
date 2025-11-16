# 검증 유틸리티 구현 계획

## 개요

블로그 애플리케이션의 데이터 검증 함수 구현
- 이메일 유효성 검사
- 비밀번호 유효성 검사
- 블로그 폼 검증
- Zod 스키마 정의로 타입 안전성 보장
- 명확한 에러 메시지 제공

---

## Task List

### 1. lib/validations/auth.ts - 인증 관련 검증
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/validations/auth.ts`

**요구사항:**
- [ ] validateEmail(email) - 이메일 유효성 검사
- [ ] validatePassword(password) - 비밀번호 유효성 검사
- [ ] Zod 스키마로 타입 안전성 보장
- [ ] 명확한 에러 메시지
- [ ] 비밀번호 강도 검증 (최소 6자, 영문+숫자 조합)

**의존성:**
- zod (검증 스키마)

**기본 구조:**
```typescript
import { z } from "zod"

// 이메일 검증 스키마
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")

// 비밀번호 검증 스키마
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)/,
    "Password must contain at least one letter and one number"
  )

// 로그인 폼 스키마
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

// 회원가입 폼 스키마
export const signupSchema = z
  .object({
    email: emailSchema,
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// 비밀번호 재설정 요청 스키마
export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
})

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// 타입 추출
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

/**
 * 이메일 유효성 검사
 * @param email - 검증할 이메일
 * @returns { valid: boolean, error?: string }
 */
export function validateEmail(email: string): {
  valid: boolean
  error?: string
} {
  try {
    emailSchema.parse(email)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message }
    }
    return { valid: false, error: "Invalid email" }
  }
}

/**
 * 비밀번호 유효성 검사
 * @param password - 검증할 비밀번호
 * @returns { valid: boolean, error?: string }
 */
export function validatePassword(password: string): {
  valid: boolean
  error?: string
} {
  try {
    passwordSchema.parse(password)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message }
    }
    return { valid: false, error: "Invalid password" }
  }
}

/**
 * 비밀번호 강도 계산
 * @param password - 비밀번호
 * @returns 강도 레벨 (0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0

  if (password.length >= 6) strength++
  if (password.length >= 10) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  return Math.min(strength, 4)
}

/**
 * 비밀번호 강도 레이블
 * @param strength - 강도 레벨 (0-4)
 * @returns 강도 레이블
 */
export function getPasswordStrengthLabel(strength: number): string {
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  return labels[strength] || "Very Weak"
}
```

**구현 세부사항:**
- **Zod 스키마**: 선언적 검증 규칙 정의
- **타입 추출**: z.infer로 TypeScript 타입 자동 생성
- **에러 메시지**: 사용자 친화적 메시지
- **비밀번호 강도**: 5단계 강도 측정
- **재사용성**: 개별 함수와 스키마 모두 제공

**완료 조건:**
- [ ] 모든 검증 스키마 정의 완료
- [ ] validateEmail() 구현 및 테스트
- [ ] validatePassword() 구현 및 테스트
- [ ] 비밀번호 강도 함수 구현
- [ ] TypeScript 타입 추출 완료

---

### 2. lib/validations/blog.ts - 블로그 관련 검증
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/validations/blog.ts`

**요구사항:**
- [ ] validateBlogForm(title, content) - 블로그 폼 검증
- [ ] Zod 스키마로 제목 및 내용 검증
- [ ] 제목 길이 제한 (1-200자)
- [ ] 내용 최소 길이 (10자 이상)
- [ ] 댓글 검증 스키마

**의존성:**
- zod

**기본 구조:**
```typescript
import { z } from "zod"

// 블로그 제목 검증 스키마
export const blogTitleSchema = z
  .string()
  .min(1, "Title is required")
  .max(200, "Title must be less than 200 characters")
  .trim()

// 블로그 내용 검증 스키마
export const blogContentSchema = z
  .string()
  .min(10, "Content must be at least 10 characters")
  .max(10000, "Content must be less than 10,000 characters")
  .trim()

// 블로그 작성/수정 폼 스키마
export const blogFormSchema = z.object({
  title: blogTitleSchema,
  content: blogContentSchema,
})

// 댓글 검증 스키마
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1,000 characters")
    .trim(),
})

// 검색 쿼리 스키마
export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query is too long"),
})

// 타입 추출
export type BlogFormInput = z.infer<typeof blogFormSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type SearchQueryInput = z.infer<typeof searchQuerySchema>

/**
 * 블로그 폼 검증
 * @param data - { title: string, content: string }
 * @returns { valid: boolean, errors?: Record<string, string> }
 */
export function validateBlogForm(data: {
  title: string
  content: string
}): {
  valid: boolean
  errors?: Record<string, string>
} {
  try {
    blogFormSchema.parse(data)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message
        }
      })
      return { valid: false, errors }
    }
    return { valid: false, errors: { general: "Validation failed" } }
  }
}

/**
 * 댓글 검증
 * @param content - 댓글 내용
 * @returns { valid: boolean, error?: string }
 */
export function validateComment(content: string): {
  valid: boolean
  error?: string
} {
  try {
    commentSchema.parse({ content })
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message }
    }
    return { valid: false, error: "Invalid comment" }
  }
}

/**
 * 제목 유효성 검사
 * @param title - 블로그 제목
 * @returns { valid: boolean, error?: string }
 */
export function validateTitle(title: string): {
  valid: boolean
  error?: string
} {
  try {
    blogTitleSchema.parse(title)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message }
    }
    return { valid: false, error: "Invalid title" }
  }
}

/**
 * 내용 유효성 검사
 * @param content - 블로그 내용
 * @returns { valid: boolean, error?: string }
 */
export function validateContent(content: string): {
  valid: boolean
  error?: string
} {
  try {
    blogContentSchema.parse(content)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message }
    }
    return { valid: false, error: "Invalid content" }
  }
}

/**
 * XSS 공격 방지를 위한 HTML 이스케이프
 * @param text - 원본 텍스트
 * @returns 이스케이프된 텍스트
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * 금지어 필터링
 * @param text - 검사할 텍스트
 * @returns { valid: boolean, error?: string }
 */
export function checkProfanity(text: string): {
  valid: boolean
  error?: string
} {
  // 간단한 금지어 리스트 (실제로는 더 포괄적인 리스트 사용)
  const profanityList = ["spam", "prohibited"]

  const lowerText = text.toLowerCase()
  const foundProfanity = profanityList.find((word) =>
    lowerText.includes(word)
  )

  if (foundProfanity) {
    return {
      valid: false,
      error: "Content contains prohibited words",
    }
  }

  return { valid: true }
}
```

**구현 세부사항:**
- **제목 검증**: 1-200자 제한, trim 처리
- **내용 검증**: 10-10,000자 제한
- **댓글 검증**: 1-1,000자 제한
- **XSS 방지**: HTML 특수문자 이스케이프
- **금지어 필터**: 스팸 및 부적절한 내용 차단
- **에러 처리**: 필드별 에러 메시지 반환

**완료 조건:**
- [ ] 블로그 폼 스키마 정의 완료
- [ ] validateBlogForm() 구현 및 테스트
- [ ] validateComment() 구현 및 테스트
- [ ] XSS 방지 함수 구현
- [ ] 금지어 필터 구현
- [ ] TypeScript 타입 추출 완료

---

## 구현 순서

1. **Zod 설치**
   ```bash
   npm install zod
   ```

2. **lib/validations/auth.ts 구현**
   - 이메일 및 비밀번호 스키마 정의
   - 로그인/회원가입 스키마 정의
   - validateEmail(), validatePassword() 함수 구현
   - 비밀번호 강도 함수 구현

3. **lib/validations/blog.ts 구현**
   - 블로그 제목/내용 스키마 정의
   - 댓글 스키마 정의
   - validateBlogForm() 함수 구현
   - XSS 방지 및 금지어 필터 구현

4. **테스트 및 검증**
   - 각 검증 함수 테스트
   - 엣지 케이스 테스트 (빈 문자열, 너무 긴 문자열)
   - 에러 메시지 확인

---

## 검증 체크리스트

### lib/validations/auth.ts
- [ ] emailSchema가 유효한 이메일 형식 검증
- [ ] passwordSchema가 최소 6자 및 영문+숫자 조합 검증
- [ ] loginSchema가 이메일과 비밀번호 모두 검증
- [ ] signupSchema가 비밀번호 확인 일치 검증
- [ ] validateEmail()이 올바른 에러 메시지 반환
- [ ] validatePassword()가 올바른 에러 메시지 반환
- [ ] getPasswordStrength()가 0-4 범위 강도 반환
- [ ] getPasswordStrengthLabel()이 적절한 레이블 반환
- [ ] TypeScript 타입이 자동 추출됨

### lib/validations/blog.ts
- [ ] blogTitleSchema가 1-200자 제한 검증
- [ ] blogContentSchema가 10-10,000자 제한 검증
- [ ] commentSchema가 1-1,000자 제한 검증
- [ ] validateBlogForm()이 필드별 에러 반환
- [ ] validateComment()가 올바른 에러 메시지 반환
- [ ] escapeHtml()이 HTML 특수문자 이스케이프
- [ ] checkProfanity()가 금지어 감지
- [ ] trim()이 공백 제거
- [ ] TypeScript 타입이 자동 추출됨

---

## 참고사항

### 사용 예시

**인증 폼 검증:**
```typescript
import { validateEmail, validatePassword, loginSchema } from "@/lib/validations/auth"

// 개별 필드 검증
const emailResult = validateEmail("test@example.com")
if (!emailResult.valid) {
  console.error(emailResult.error)
}

// 전체 폼 검증 (react-hook-form과 함께)
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const form = useForm({
  resolver: zodResolver(loginSchema),
})
```

**블로그 폼 검증:**
```typescript
import { validateBlogForm } from "@/lib/validations/blog"

const result = validateBlogForm({
  title: "My Blog Post",
  content: "This is the content...",
})

if (!result.valid) {
  console.error(result.errors)
  // { title: "Title is required", content: "Content must be at least 10 characters" }
}
```

### Zod와 react-hook-form 통합
```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { blogFormSchema, type BlogFormInput } from "@/lib/validations/blog"

const form = useForm<BlogFormInput>({
  resolver: zodResolver(blogFormSchema),
  defaultValues: {
    title: "",
    content: "",
  },
})

async function onSubmit(data: BlogFormInput) {
  // 이미 검증된 데이터
  console.log(data)
}
```

### 보안 고려사항
- **클라이언트 검증**: 사용자 경험 개선용
- **서버 검증**: 필수! 클라이언트 검증은 우회 가능
- **XSS 방지**: 사용자 입력을 HTML로 렌더링하기 전 이스케이프
- **SQL 인젝션**: Supabase ORM 사용으로 자동 방지
- **비밀번호 저장**: 절대 평문 저장 금지, Supabase Auth가 자동 해싱

### 에러 메시지 다국어 지원
```typescript
// 추후 i18n 라이브러리 통합 시
const emailSchema = z
  .string()
  .min(1, t("validation.email.required"))
  .email(t("validation.email.invalid"))
```

### Phase 2 마이그레이션
Phase 1에서는 클라이언트 검증만 사용하지만, Phase 2에서 Server Actions에도 동일한 스키마를 재사용:

```typescript
// Server Action
"use server"
import { blogFormSchema } from "@/lib/validations/blog"

export async function createBlog(data: unknown) {
  const parsed = blogFormSchema.parse(data) // 서버에서도 검증!
  // ... Supabase 저장
}
```
