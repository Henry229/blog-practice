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
