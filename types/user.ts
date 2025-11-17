// types/user.ts

/**
 * User 인터페이스
 * 데이터베이스의 users 테이블 구조와 동일
 */
export interface User {
  id: string
  email: string
  username: string
  password: string // Mock 데이터용 (실제 DB에는 해시됨)
  createdAt: string // ISO 8601 형식
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
