// types/index.ts

// Re-export all types for easy import
export type { User, AuthUser, SignupFormData, LoginFormData } from "./user"
export type { Blog, BlogFormData, BlogListParams, BlogListResponse } from "./blog"
export type { Comment, CommentFormData } from "./comment"
export type { AuthContextType, AuthState } from "./auth"

/**
 * API 응답 공통 타입
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * 정렬 옵션
 */
export type SortOrder = "asc" | "desc"

export interface SortOptions {
  field: string
  order: SortOrder
}
