// types/blog.ts

/**
 * Blog 인터페이스
 * 데이터베이스의 blogs 테이블 구조와 동일
 */
export interface Blog {
  id: string
  title: string
  content: string
  authorId: string // User.id 참조
  authorName: string // 작성자 이름 (JOIN 결과)
  authorAvatar?: string // 작성자 아바타 URL (선택사항)
  createdAt: string // ISO 8601 형식
  updatedAt: string // ISO 8601 형식
}

/**
 * 블로그 작성/수정 폼 데이터
 */
export interface BlogFormData {
  title: string
  content: string
}

/**
 * 블로그 목록 조회 파라미터
 */
export interface BlogListParams {
  page?: number
  limit?: number
  search?: string
  authorId?: string
}

/**
 * 블로그 목록 응답
 */
export interface BlogListResponse {
  blogs: Blog[]
  total: number
  page: number
  totalPages: number
}
