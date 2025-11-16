# Phase 0.4 - 공통 유틸리티 함수

## 개요
**Phase**: Phase 0 - 공통 기반
**목적**: 프로젝트 전반에서 재사용 가능한 유틸리티 함수 구현
**상태**: ✅ 완료

## 유틸리티 파일 구조

```
lib/utils/
├── date.ts         - 날짜 포맷팅 함수
├── text.ts         - 텍스트 처리 함수
├── validation.ts   - 폼 유효성 검사 함수
└── cn.ts           - Tailwind className 유틸리티
```

---

## 1. 날짜 유틸리티 (`lib/utils/date.ts`)

```typescript
// lib/utils/date.ts

/**
 * ISO 날짜를 포맷팅
 * @param dateString - ISO 8601 날짜 문자열
 * @returns "Jan 15, 2024" 형식
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * 상대적 시간 표시 ("2 hours ago")
 * @param dateString - ISO 8601 날짜 문자열
 * @returns "just now", "5 minutes ago", "2 days ago" 등
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  // Just now (< 1분)
  if (diffInSeconds < 60) {
    return "just now"
  }

  // Minutes ago (< 1시간)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  // Hours ago (< 1일)
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  // Days ago (< 1주)
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  // Weeks ago (< 1달)
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`
  }

  // 그 이상은 날짜 표시
  return formatDate(dateString)
}

/**
 * 한국어 날짜 포맷 (선택사항)
 * @param dateString - ISO 8601 날짜 문자열
 * @returns "2024년 1월 15일" 형식
 */
export function formatDateKo(dateString: string): string {
  const date = new Date(dateString)

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 현재 시간 ISO 문자열 생성
 */
export function getCurrentISOString(): string {
  return new Date().toISOString()
}
```

### 사용 예시
```typescript
import { formatDate, formatRelativeTime } from "@/lib/utils/date"

const blog = {
  createdAt: "2024-01-15T10:00:00Z",
}

console.log(formatDate(blog.createdAt))
// "Jan 15, 2024"

console.log(formatRelativeTime(blog.createdAt))
// "2 days ago"
```

---

## 2. 텍스트 유틸리티 (`lib/utils/text.ts`)

```typescript
// lib/utils/text.ts

/**
 * 텍스트 길이 제한 (말줄임표 추가)
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 잘린 텍스트 + "..."
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength).trim() + "..."
}

/**
 * 고유 ID 생성 (간단한 버전)
 * @returns 고유 ID 문자열
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * UUID v4 생성 (더 안전한 버전)
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 문자열을 슬러그로 변환
 * @param text - 원본 텍스트
 * @returns URL-safe 슬러그
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 특수문자 제거
    .replace(/[\s_-]+/g, "-") // 공백을 하이픈으로
    .replace(/^-+|-+$/g, "") // 앞뒤 하이픈 제거
}

/**
 * 첫 글자 대문자로 변환
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * 단어 개수 세기
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

/**
 * 읽기 시간 계산 (분)
 * @param text - 텍스트 내용
 * @param wordsPerMinute - 분당 단어 수 (기본 200)
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const words = countWords(text)
  return Math.ceil(words / wordsPerMinute)
}

/**
 * 이니셜 생성
 * @param name - 사용자 이름 ("John Doe")
 * @returns 이니셜 ("JD")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) // 최대 2글자
}
```

### 사용 예시
```typescript
import { truncateText, slugify, calculateReadingTime, getInitials } from "@/lib/utils/text"

const content = "This is a very long blog post content..."
console.log(truncateText(content, 20))
// "This is a very lon..."

console.log(slugify("Hello World! 123"))
// "hello-world-123"

console.log(calculateReadingTime(content))
// 1 (분)

console.log(getInitials("John Doe"))
// "JD"
```

---

## 3. 유효성 검사 유틸리티 (`lib/utils/validation.ts`)

```typescript
// lib/utils/validation.ts

/**
 * 이메일 유효성 검사
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 유효성 검사
 * @param password - 비밀번호
 * @param minLength - 최소 길이 (기본 6)
 * @returns 유효성 검사 결과
 */
export function validatePassword(
  password: string,
  minLength: number = 6
): boolean {
  return password.length >= minLength
}

/**
 * 비밀번호 강도 검사 (선택사항)
 * @returns "weak" | "medium" | "strong"
 */
export function checkPasswordStrength(
  password: string
): "weak" | "medium" | "strong" {
  let strength = 0

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return "weak"
  if (strength <= 4) return "medium"
  return "strong"
}

/**
 * 사용자명 유효성 검사
 * @param username - 사용자명
 * @returns 유효성 검사 결과
 */
export function validateUsername(username: string): boolean {
  // 3-20자, 영문자와 숫자만
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 블로그 폼 유효성 검사
 */
export interface BlogFormValidation {
  isValid: boolean
  errors: {
    title?: string
    content?: string
  }
}

export function validateBlogForm(
  title: string,
  content: string
): BlogFormValidation {
  const errors: { title?: string; content?: string } = {}

  // 제목 검사
  if (!title.trim()) {
    errors.title = "Title is required"
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters"
  } else if (title.length > 200) {
    errors.title = "Title must be less than 200 characters"
  }

  // 내용 검사
  if (!content.trim()) {
    errors.content = "Content is required"
  } else if (content.length < 10) {
    errors.content = "Content must be at least 10 characters"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * 댓글 유효성 검사
 */
export function validateComment(content: string): string | null {
  if (!content.trim()) {
    return "Comment cannot be empty"
  }

  if (content.length > 500) {
    return "Comment must be less than 500 characters"
  }

  return null
}
```

### 사용 예시
```typescript
import { validateEmail, validateBlogForm } from "@/lib/utils/validation"

console.log(validateEmail("test@example.com"))
// true

const result = validateBlogForm("My Title", "Content here")
if (result.isValid) {
  // 폼 제출
} else {
  console.log(result.errors)
  // { title: "Title is required" }
}
```

---

## 4. Tailwind className 유틸리티 (`lib/utils/cn.ts`)

```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * shadcn/ui에서 사용하는 표준 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 사용 예시
```typescript
import { cn } from "@/lib/utils/cn"

// 조건부 클래스
const buttonClass = cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500 text-white",
  !isActive && "bg-gray-200 text-gray-700"
)

// 클래스 병합 (중복 제거)
const mergedClass = cn("px-4 py-2", "px-6")
// "py-2 px-6" (마지막 px-6이 px-4를 덮어씀)
```

---

## 5. 통합 유틸리티 index (`lib/utils/index.ts`)

```typescript
// lib/utils/index.ts

// Re-export all utilities
export {
  formatDate,
  formatRelativeTime,
  formatDateKo,
  getCurrentISOString,
} from "./date"

export {
  truncateText,
  generateId,
  generateUUID,
  slugify,
  capitalize,
  countWords,
  calculateReadingTime,
  getInitials,
} from "./text"

export {
  validateEmail,
  validatePassword,
  checkPasswordStrength,
  validateUsername,
  validateBlogForm,
  validateComment,
} from "./validation"

export { cn } from "./cn"
```

---

## 구현 단계

1. [x] `lib/utils/` 폴더 생성
2. [x] `date.ts` 파일 생성 (날짜 포맷팅 함수)
3. [x] `text.ts` 파일 생성 (텍스트 처리 함수)
4. [x] `validation.ts` 파일 생성 (유효성 검사 함수)
5. [x] `cn.ts` 파일 생성 (Tailwind 유틸리티)
6. [x] `index.ts` 파일 생성 (모든 함수 re-export)
7. [x] 단위 테스트 작성 (선택사항)

---

## 완료 조건

### 파일 확인
- [ ] `lib/utils/date.ts` 존재
- [ ] `lib/utils/text.ts` 존재
- [ ] `lib/utils/validation.ts` 존재
- [ ] `lib/utils/cn.ts` 존재
- [ ] `lib/utils/index.ts` 존재

### 기능 검증
- [ ] 날짜 포맷팅 함수 동작
- [ ] 텍스트 처리 함수 동작
- [ ] 유효성 검사 함수 동작
- [ ] cn 유틸리티 동작

### 다음 단계
- Phase 1: 레이아웃 컴포넌트 구현

---

## 단위 테스트 예시 (선택사항)

```typescript
// __tests__/utils/text.test.ts
import { describe, it, expect } from "vitest"
import { truncateText, slugify, getInitials } from "@/lib/utils/text"

describe("Text Utilities", () => {
  it("should truncate text correctly", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...")
    expect(truncateText("Hi", 10)).toBe("Hi")
  })

  it("should create slug from text", () => {
    expect(slugify("Hello World!")).toBe("hello-world")
    expect(slugify("  Test  123  ")).toBe("test-123")
  })

  it("should generate initials", () => {
    expect(getInitials("John Doe")).toBe("JD")
    expect(getInitials("Alice")).toBe("A")
  })
})
```

---

## 참고사항

- **날짜 라이브러리**: 복잡한 날짜 처리가 필요한 경우 `date-fns` 또는 `dayjs` 사용 고려
- **UUID**: 프로덕션에서는 `uuid` npm 패키지 사용 권장
- **유효성 검사**: 더 강력한 검사가 필요한 경우 `zod` 또는 `yup` 사용 고려
- **Tailwind 병합**: `clsx`와 `tailwind-merge`는 shadcn/ui 표준 의존성

### 추가 유틸리티 (필요 시)
- **storage.ts**: LocalStorage/SessionStorage 래퍼
- **format.ts**: 숫자, 통화, 파일 크기 포맷팅
- **array.ts**: 배열 정렬, 필터링, 그룹화
- **debounce.ts**: Debounce, Throttle 함수

### 의존성 설치
```bash
# cn 유틸리티에 필요
npm install clsx tailwind-merge

# 테스트에 필요 (선택사항)
npm install -D vitest @testing-library/react
```
