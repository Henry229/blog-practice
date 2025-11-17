// types/comment.ts

/**
 * Comment 인터페이스
 * 데이터베이스의 comments 테이블 구조와 동일
 */
export interface Comment {
  id: string
  blogId: string // Blog.id 참조
  authorId: string // User.id 참조
  authorName: string // 작성자 이름 (JOIN 결과)
  authorAvatar?: string // 작성자 아바타 URL (선택사항)
  content: string
  createdAt: string // ISO 8601 형식
}

/**
 * 댓글 작성 폼 데이터
 */
export interface CommentFormData {
  content: string
}
