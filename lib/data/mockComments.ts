// lib/data/mockComments.ts
import type { Comment } from "@/types/comment"

/**
 * Mock 댓글 데이터
 * 실제 사용 시 Supabase 데이터베이스로 교체 예정
 */
let mockComments: Comment[] = [
  {
    id: "c1",
    blogId: "1",
    authorId: "user-2",
    authorName: "Jane Doe",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    content:
      "Great article! I really appreciate the focus on readability and clean design. It's so important for a good user experience.",
    createdAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "c2",
    blogId: "1",
    authorId: "user-3",
    authorName: "John Smith",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    content:
      "Well said. Minimalism is often misunderstood as just 'less', but it's about being intentional. This post explains it perfectly.",
    createdAt: "2024-01-15T12:30:00Z",
  },
  {
    id: "c3",
    blogId: "2",
    authorId: "user-1",
    authorName: "Jane Doe",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    content:
      "I've been trying to apply minimalist principles to my designs. This article gives me some great actionable tips. Thanks!",
    createdAt: "2024-01-14T16:00:00Z",
  },
]

/**
 * 특정 블로그의 댓글 가져오기
 */
export function getMockComments(blogId: string): Comment[] {
  return mockComments
    .filter((comment) => comment.blogId === blogId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
}

/**
 * 댓글 추가
 */
export function addMockComment(
  blogId: string,
  content: string,
  authorId: string,
  authorName: string
): Comment {
  const newComment: Comment = {
    id: `c${Date.now()}`,
    blogId,
    authorId,
    authorName,
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
    content,
    createdAt: new Date().toISOString(),
  }

  mockComments.push(newComment)
  return newComment
}

/**
 * 댓글 삭제
 */
export function deleteMockComment(id: string): boolean {
  const commentIndex = mockComments.findIndex((comment) => comment.id === id)

  if (commentIndex === -1) {
    return false
  }

  mockComments.splice(commentIndex, 1)
  return true
}

/**
 * 댓글 총 개수 (특정 블로그)
 */
export function getMockCommentsCount(blogId: string): number {
  return mockComments.filter((comment) => comment.blogId === blogId).length
}

/**
 * 모든 댓글 가져오기 (관리자용)
 */
export function getAllMockComments(): Comment[] {
  return [...mockComments]
}
