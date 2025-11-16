# Mock Data 관리 (프론트엔드 개발용) 구현 계획

## 개요

Phase 1 프론트엔드 개발을 위한 Mock 블로그 및 댓글 데이터 시스템 구현
- mockBlogs.ts: 샘플 블로그 데이터 (10-15개) 및 CRUD 함수
- mockComments.ts: 샘플 댓글 데이터 및 CRUD 함수
- 메모리 기반 데이터 관리 (추후 Supabase로 전환 예정)
- camelCase 데이터 모델 (blogId, createdAt, authorName)

---

## Task List

### 1. lib/data/mockBlogs.ts - Mock 블로그 데이터 및 CRUD 함수
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/data/mockBlogs.ts`

**요구사항:**
- [ ] mockBlogs 배열 - 샘플 블로그 데이터 10-15개
- [ ] getMockBlogs() - 모든 블로그 가져오기
- [ ] getMockBlogById(id) - 특정 블로그 가져오기
- [ ] searchMockBlogs(query) - 블로그 검색 (제목, 내용)
- [ ] addMockBlog(title, content, authorName) - 새 글 추가
- [ ] updateMockBlog(id, title, content) - 글 수정
- [ ] deleteMockBlog(id) - 글 삭제
- [ ] camelCase 필드 사용 (blogId, createdAt, authorName)
- [ ] TypeScript 타입 정의 (Blog 인터페이스)

**의존성:**
- uuid 라이브러리 (ID 생성용)

**기본 구조:**
```typescript
import { v4 as uuidv4 } from "uuid"

export interface Blog {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
}

// 샘플 블로그 데이터 (10-15개)
let mockBlogs: Blog[] = [
  {
    id: "blog-1",
    title: "Getting Started with Next.js 15",
    content: "Next.js 15 brings exciting new features...",
    authorId: "mock-user-1",
    authorName: "John Doe",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  // ... 9-14개 더
]

// CRUD 함수들
export function getMockBlogs(): Blog[] {
  return [...mockBlogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getMockBlogById(id: string): Blog | undefined {
  return mockBlogs.find((blog) => blog.id === id)
}

export function searchMockBlogs(query: string): Blog[] {
  const lowerQuery = query.toLowerCase()
  return mockBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery)
  )
}

export function addMockBlog(
  title: string,
  content: string,
  authorName: string = "John Doe"
): Blog {
  const newBlog: Blog = {
    id: uuidv4(),
    title,
    content,
    authorId: "mock-user-1",
    authorName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockBlogs = [newBlog, ...mockBlogs]
  return newBlog
}

export function updateMockBlog(
  id: string,
  title: string,
  content: string
): Blog | null {
  const index = mockBlogs.findIndex((blog) => blog.id === id)
  if (index === -1) return null

  mockBlogs[index] = {
    ...mockBlogs[index],
    title,
    content,
    updatedAt: new Date().toISOString(),
  }
  return mockBlogs[index]
}

export function deleteMockBlog(id: string): boolean {
  const initialLength = mockBlogs.length
  mockBlogs = mockBlogs.filter((blog) => blog.id !== id)
  return mockBlogs.length < initialLength
}
```

**구현 세부사항:**
- **mockBlogs 배열**: 다양한 주제의 샘플 블로그 10-15개 포함 (Next.js, React, TypeScript, Web Development 등)
- **정렬**: getMockBlogs()는 최신 글이 먼저 오도록 createdAt 기준 내림차순 정렬
- **검색**: 제목과 내용에서 대소문자 구분 없이 검색
- **불변성**: 원본 배열 수정 시 새 배열 생성 (spread 연산자 사용)
- **타임스탬프**: ISO 8601 형식 사용 (YYYY-MM-DDTHH:mm:ssZ)
- **에러 처리**: 존재하지 않는 블로그 조회 시 undefined 반환

**완료 조건:**
- [ ] 모든 CRUD 함수 구현 완료
- [ ] 샘플 데이터 10-15개 작성
- [ ] TypeScript 타입 정의 완료
- [ ] 검색 기능 테스트 통과

---

### 2. lib/data/mockComments.ts - Mock 댓글 데이터 및 CRUD 함수
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `lib/data/mockComments.ts`

**요구사항:**
- [ ] mockComments 배열 - 샘플 댓글 데이터
- [ ] getMockComments(blogId) - 특정 글의 댓글 가져오기
- [ ] addMockComment(blogId, content, authorName) - 댓글 추가
- [ ] deleteMockComment(id) - 댓글 삭제
- [ ] camelCase 필드 사용 (commentId, blogId, createdAt)
- [ ] TypeScript 타입 정의 (Comment 인터페이스)

**의존성:**
- uuid 라이브러리 (ID 생성용)

**기본 구조:**
```typescript
import { v4 as uuidv4 } from "uuid"

export interface Comment {
  id: string
  blogId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

// 샘플 댓글 데이터
let mockComments: Comment[] = [
  {
    id: "comment-1",
    blogId: "blog-1",
    authorId: "mock-user-1",
    authorName: "John Doe",
    content: "Great article! Very helpful.",
    createdAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "comment-2",
    blogId: "blog-1",
    authorId: "mock-user-2",
    authorName: "Jane Smith",
    content: "Thanks for sharing this!",
    createdAt: "2024-01-15T12:00:00Z",
  },
  // ... 더 많은 샘플 댓글
]

export function getMockComments(blogId: string): Comment[] {
  return mockComments
    .filter((comment) => comment.blogId === blogId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
}

export function addMockComment(
  blogId: string,
  content: string,
  authorName: string = "John Doe"
): Comment {
  const newComment: Comment = {
    id: uuidv4(),
    blogId,
    authorId: "mock-user-1",
    authorName,
    content,
    createdAt: new Date().toISOString(),
  }
  mockComments = [...mockComments, newComment]
  return newComment
}

export function deleteMockComment(id: string): boolean {
  const initialLength = mockComments.length
  mockComments = mockComments.filter((comment) => comment.id !== id)
  return mockComments.length < initialLength
}

export function getCommentCountByBlogId(blogId: string): number {
  return mockComments.filter((comment) => comment.blogId === blogId).length
}
```

**구현 세부사항:**
- **mockComments 배열**: 여러 블로그에 대한 다양한 샘플 댓글 포함
- **정렬**: 댓글은 오래된 것부터 표시 (createdAt 기준 오름차순)
- **필터링**: blogId로 특정 블로그의 댓글만 가져오기
- **카운팅**: getCommentCountByBlogId() 헬퍼 함수로 댓글 수 조회
- **불변성**: 배열 수정 시 새 배열 생성
- **에러 처리**: 존재하지 않는 댓글 삭제 시 false 반환

**완료 조건:**
- [ ] 모든 CRUD 함수 구현 완료
- [ ] 샘플 댓글 데이터 작성
- [ ] TypeScript 타입 정의 완료
- [ ] blogId 필터링 테스트 통과

---

## 구현 순서

1. **uuid 라이브러리 설치**
   ```bash
   npm install uuid
   npm install --save-dev @types/uuid
   ```

2. **mockBlogs.ts 구현**
   - Blog 인터페이스 정의
   - 샘플 블로그 데이터 10-15개 작성
   - CRUD 함수 구현 (getMockBlogs, getMockBlogById, searchMockBlogs, addMockBlog, updateMockBlog, deleteMockBlog)
   - 정렬 및 검색 로직 구현

3. **mockComments.ts 구현**
   - Comment 인터페이스 정의
   - 샘플 댓글 데이터 작성
   - CRUD 함수 구현 (getMockComments, addMockComment, deleteMockComment)
   - blogId 필터링 로직 구현

4. **테스트**
   - 각 함수 동작 확인
   - 검색 기능 테스트
   - 정렬 순서 확인

---

## 검증 체크리스트

### mockBlogs.ts
- [ ] Blog 인터페이스가 camelCase 사용
- [ ] 샘플 블로그 10-15개 작성 완료
- [ ] getMockBlogs()가 최신순으로 정렬된 블로그 반환
- [ ] getMockBlogById()가 올바른 블로그 반환
- [ ] searchMockBlogs()가 제목과 내용에서 검색
- [ ] addMockBlog()가 새 블로그를 배열 맨 앞에 추가
- [ ] updateMockBlog()가 제목과 내용 수정 및 updatedAt 갱신
- [ ] deleteMockBlog()가 블로그 삭제 성공 여부 반환
- [ ] 모든 함수가 TypeScript 타입 안전

### mockComments.ts
- [ ] Comment 인터페이스가 camelCase 사용
- [ ] 샘플 댓글 데이터 작성 완료
- [ ] getMockComments()가 특정 블로그의 댓글만 반환
- [ ] getMockComments()가 오래된 순으로 정렬
- [ ] addMockComment()가 새 댓글 추가
- [ ] deleteMockComment()가 댓글 삭제 성공 여부 반환
- [ ] getCommentCountByBlogId()가 정확한 댓글 수 반환
- [ ] 모든 함수가 TypeScript 타입 안전

---

## 참고사항

### Phase 1 vs Phase 2
- **현재 단계 (Phase 1)**: Mock Data 기반 UI 구현
  - 메모리에 데이터 저장 (페이지 새로고침 시 초기화)
  - 빠른 프론트엔드 개발 및 테스트
  - Supabase 없이 독립적으로 개발 가능

- **추후 단계 (Phase 2)**: Supabase 백엔드 연동
  - Mock 함수들을 Server Actions으로 교체
  - 실제 PostgreSQL 데이터베이스 사용
  - 영구 데이터 저장
  - 인증 및 권한 관리 추가

### 데이터 모델 일관성
- **camelCase 필수**: blogId, createdAt, authorName (NOT blog_id, created_at, author_name)
- **Mock 사용자**: authorId는 항상 "mock-user-1", authorName은 "John Doe"
- **타임스탬프 형식**: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- **ID 형식**: UUID v4 (예: "550e8400-e29b-41d4-a716-446655440000")

### 샘플 데이터 주제 예시
- Next.js 15 새 기능
- React Server Components
- TypeScript 고급 패턴
- Tailwind CSS 팁
- 웹 성능 최적화
- Supabase 활용법
- 풀스택 개발 가이드
- 반응형 디자인 베스트 프랙티스

### Phase 2 마이그레이션 가이드
```typescript
// Phase 1: Mock Data
import { getMockBlogs } from "@/lib/data/mockBlogs"
const blogs = getMockBlogs()

// Phase 2: Supabase
import { getBlogs } from "@/app/actions/blog"
const blogs = await getBlogs()
```

함수 시그니처를 동일하게 유지하면 Phase 2 전환 시 import 경로만 변경하면 됩니다.
