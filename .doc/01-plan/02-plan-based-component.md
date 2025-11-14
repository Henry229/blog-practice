# SimpleBlog MVP - 컴포넌트 기반 구현 계획

## 필요한 컴포넌트 리스트

### 1. 인증 (Authentication)

**로그인/회원가입 폼**

- [ ] LoginForm - 로그인 폼 (이메일, 비밀번호 입력)
- [ ] SignupForm - 회원가입 폼 (이메일, 사용자명, 비밀번호, 비밀번호 확인)
- [ ] AuthCard - 인증 폼을 감싸는 카드 컨테이너
- [ ] AuthProvider - 인증 상태 전역 관리 Context

**인증 관련 유틸리티**

- [ ] ProtectedRoute - 로그인 필요 페이지 보호 HOC
- [ ] useAuth - 인증 상태 접근 커스텀 훅

---

### 2. 블로그 글 관리 (Blog Posts)

**홈페이지 - 글 목록**

- [ ] BlogCard - 개별 블로그 카드 (제목, 작성자, 날짜, 미리보기)
- [ ] BlogGrid - 블로그 카드 그리드 레이아웃 컨테이너
- [ ] SearchBar - 검색 바 (헤더에 위치, "Search posts..." placeholder)
- [ ] EmptyState - 블로그 글이 없을 때 표시할 상태
- [ ] Pagination - 페이지네이션 컴포넌트 (1, 2, 3... 페이지 번호)

**글 작성/수정**

- [ ] BlogForm - 블로그 글 작성/수정 폼 (제목, 내용 textarea)
- [ ] TitleInput - 제목 입력 필드
- [ ] ContentTextarea - 내용 입력 필드 (최소 높이 300px)
- [ ] FormActions - 폼 액션 버튼 컨테이너 (Publish/Cancel, Save/Cancel)

**글 상세**

- [ ] BlogPost - 블로그 글 전체 내용 표시
- [ ] BlogHeader - 글 제목, 작성자, 날짜 표시
- [ ] BlogContent - 글 본문 내용 (줄바꿈 유지)
- [ ] BlogActions - 수정/삭제 버튼 (작성자만 표시)
- [ ] DeleteConfirmDialog - 삭제 확인 다이얼로그

---

### 3. 댓글 (Comments)

**댓글 표시**

- [ ] CommentList - 댓글 목록 컨테이너
- [ ] CommentItem - 개별 댓글 아이템 (작성자, 날짜, 내용)
- [ ] EmptyComments - 댓글이 없을 때 표시

**댓글 작성**

- [ ] CommentForm - 댓글 작성 폼
- [ ] CommentTextarea - 댓글 입력 필드
- [ ] LoginPrompt - 비로그인 사용자에게 표시할 로그인 안내

---

### 4. 레이아웃 (Layouts)

**공통 레이아웃**

- [ ] RootLayout - 전체 앱 루트 레이아웃 (AuthProvider 포함)
- [ ] Header - 고정 헤더 (로고, 검색바, 네비게이션)
- [ ] Logo - SimpleBlog 로고 컴포넌트
- [ ] Navigation - 네비게이션 버튼 그룹
- [ ] UserMenu - 사용자 메뉴 (사용자명 표시, 로그아웃)

**페이지 레이아웃**

- [ ] PageContainer - 페이지 공통 컨테이너 (max-width, padding)
- [ ] CenteredContainer - 중앙 정렬 컨테이너 (폼 페이지용)

---

### 5. 공통 UI 컴포넌트

**버튼**

- [x] Button - 기본 버튼 컴포넌트 (primary, secondary, danger variants)
- [x] IconButton - 아이콘 버튼

**카드**

- [x] Card - 기본 카드 컨테이너 (흰 배경, 그림자, 둥근 모서리)

**입력 필드**

- [x] Input - 텍스트 입력 필드
- [x] Textarea - 텍스트 영역 입력
- [x] Label - 입력 필드 레이블

**피드백**

- [x] LoadingSpinner - 로딩 스피너
- [x] ErrorMessage - 에러 메시지 표시
- [x] SuccessMessage - 성공 메시지 표시
- [x] Toast - 토스트 알림 (선택사항)

**기타**

- [x] Avatar - 사용자 아바타 (이니셜 표시)
- [x] Badge - 배지 (예: 새 글, 댓글 수)
- [x] Divider - 구분선

---

### 6. 페이지 컴포넌트

**인증 페이지**

- [ ] LoginPage - 로그인 페이지 (/auth/login)
- [ ] SignupPage - 회원가입 페이지 (/auth/signup)

**블로그 페이지**

- [ ] HomePage - 홈페이지 (블로그 목록) (/)
- [ ] NewPostPage - 새 글 작성 페이지 (/blog/new)
- [ ] PostDetailPage - 글 상세 페이지 (/blog/[id])
- [ ] EditPostPage - 글 수정 페이지 (/blog/[id]/edit)

---

### 7. 상태 관리 (State Management)

**Context Providers**

- [ ] AuthContext - 인증 상태 관리
- [ ] BlogContext - 블로그 데이터 관리 (선택사항)

**Custom Hooks**

- [ ] useAuth - 인증 상태 접근
- [ ] useBlog - 블로그 CRUD 작업
- [ ] useComment - 댓글 CRUD 작업
- [ ] useLocalStorage - localStorage 래퍼 훅

---

### 8. 유틸리티 & 라이브러리 (Utilities)

**Mock Data 관리 (프론트엔드 개발용)**

- [ ] lib/data/mockBlogs.ts - Mock 블로그 데이터 및 CRUD 함수
  - [ ] mockBlogs - 샘플 블로그 데이터 배열 (10-15개)
  - [ ] getMockBlogs() - 모든 블로그 가져오기
  - [ ] getMockBlogById(id) - 특정 블로그 가져오기
  - [ ] searchMockBlogs(query) - 블로그 검색
  - [ ] addMockBlog(title, content, authorName) - 새 글 추가
  - [ ] updateMockBlog(id, title, content) - 글 수정
  - [ ] deleteMockBlog(id) - 글 삭제

- [ ] lib/data/mockComments.ts - Mock 댓글 데이터 및 CRUD 함수
  - [ ] mockComments - 샘플 댓글 데이터 배열
  - [ ] getMockComments(blogId) - 특정 글의 댓글 가져오기
  - [ ] addMockComment(blogId, content, authorName) - 댓글 추가
  - [ ] deleteMockComment(id) - 댓글 삭제

**인증 관리 (추후 Supabase 연동 예정)**

- [ ] Supabase Auth 연동은 백엔드 구현 단계에서 진행
- [ ] 현재는 프론트엔드 UI만 구현 (Mock 사용자: "John Doe")

**날짜 포맷팅**

- [ ] formatDate() - 날짜 포맷 함수 (예: "Oct 26, 2023")
- [ ] formatRelativeTime() - 상대 시간 (예: "2 hours ago")

**텍스트 처리**

- [ ] truncateText() - 텍스트 자르기 (미리보기용, 100자)
- [ ] generateId() - UUID 생성
- [ ] slugify() - URL 슬러그 생성 (선택사항)

**검증**

- [ ] validateEmail() - 이메일 유효성 검사
- [ ] validatePassword() - 비밀번호 유효성 검사
- [ ] validateBlogForm() - 블로그 폼 검증

---

### 9. 타입 정의 (TypeScript Types)

- [ ] types/user.ts - User, AuthUser 인터페이스
- [ ] types/blog.ts - Blog 인터페이스
- [ ] types/comment.ts - Comment 인터페이스
- [ ] types/auth.ts - AuthContextType 인터페이스
- [ ] types/storage.ts - LocalStorageData 인터페이스

---

## 추가 고려사항

### API/Services (Mock Data 기반 → 추후 Supabase 연동)

**현재 구현 (MVP 프론트엔드)**
- [ ] Mock Blog Service - Mock 데이터로 블로그 CRUD 작업 (`lib/data/mockBlogs.ts`)
- [ ] Mock Comment Service - Mock 데이터로 댓글 CRUD 작업 (`lib/data/mockComments.ts`)
- [ ] Authentication Service - 추후 Supabase Auth로 구현 예정

**추후 구현 (백엔드 연동)**
- [ ] Supabase Database - blogs, comments 테이블
- [ ] Supabase Auth - 인증 및 권한 관리
- [ ] Server Actions - createBlog, updateBlog, deleteBlog, createComment 등
- [ ] Row Level Security (RLS) - 데이터 접근 권한 정책

### 데이터 모델 (Mock Data Schema → Supabase 테이블 구조와 동일)

**User**

- [ ] id (string, UUID)
- [ ] email (string)
- [ ] username (string)
- [ ] password (string, 평문)
- [ ] createdAt (string, ISO timestamp)

**AuthUser**

- [ ] id (string)
- [ ] email (string)
- [ ] username (string)

**Blog**

- [ ] id (string, UUID)
- [ ] title (string)
- [ ] content (string)
- [ ] authorId (string)
- [ ] authorName (string)
- [ ] createdAt (string, ISO timestamp)
- [ ] updatedAt (string, ISO timestamp)

**Comment**

- [ ] id (string, UUID)
- [ ] blogId (string)
- [ ] authorId (string)
- [ ] authorName (string)
- [ ] content (string)
- [ ] createdAt (string, ISO timestamp)

---

## UI 디자인 참고사항 (PDF 기반)

### 홈페이지 특징

- 검색 바가 헤더 중앙에 위치 (SimpleBlog 로고와 네비게이션 사이)
- 블로그 카드에 화려한 이미지/그라데이션 배경 (선택사항)
- 3열 그리드 레이아웃 (데스크톱)
- 페이지네이션 (1, 2, 3... 페이지 번호)

### 새 글 작성 페이지

- 심플한 중앙 정렬 폼
- Title과 Content 두 개의 입력 필드만
- Publish (파란색) + Cancel (회색) 버튼

### 글 상세 페이지

- 상단에 Edit/Delete 버튼 (작성자만)
- 본문 하단에 Comments 섹션
- 댓글 작성 폼 (textarea + "Post Comment" 버튼)
- 댓글 목록 (작성자 이름, 시간, 내용)

### 글 수정 페이지

- 새 글 작성과 동일한 레이아웃
- "Save Changes" 버튼 (파란색)

---

## 구현 우선순위

### Phase 1: 인증 & 레이아웃 (Day 1)

1. AuthProvider, AuthContext
2. LoginForm, SignupForm
3. Header, Layout 컴포넌트
4. 기본 UI 컴포넌트 (Button, Input, Card)

### Phase 2: 블로그 CRUD (Day 2-3)

1. BlogCard, BlogGrid
2. BlogForm (작성/수정)
3. BlogPost (상세 표시)
4. 권한 확인 로직

### Phase 3: 댓글 기능 (Day 4)

1. CommentForm
2. CommentList, CommentItem
3. 로그인 상태별 UI 분기

### Phase 4: 마무리 (Day 5-6)

1. 검색 기능 (선택사항)
2. 페이지네이션 (선택사항)
3. 에러 핸들링
4. 반응형 디자인 테스트

---

## 기술 스택 요약

**현재 구현 (MVP 프론트엔드)**
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: shadcn/ui (Radix UI 기반)
- **폼 관리**: react-hook-form + Zod
- **데이터**: Mock Data (메모리 기반, `lib/data/` 폴더)
- **배포**: Vercel

**추후 추가 (백엔드 연동)**
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **실시간**: Supabase Realtime (선택사항)
- **스토리지**: Supabase Storage (이미지 업로드용, 선택사항)

---

## 참고사항

1. **재사용 가능한 컴포넌트 우선**: shadcn/ui 기본 컴포넌트 (Button, Input, Card)를 먼저 설치하고 조합
2. **Mock Data 기반 개발**:
   - 프론트엔드 UI는 Mock Data로 먼저 구현
   - 백엔드(Supabase)는 별도 단계에서 구현
   - Mock Data 구조는 Supabase 테이블 구조와 동일하게 설계
   - 추후 Mock 함수 → Server Actions로 교체만 하면 연동 완료
3. **검색 바 위치**: 헤더 중앙에 배치 (로고 - 검색바 - 네비게이션)
4. **권한 체크는 추후 구현**:
   - 현재는 Mock 사용자 "John Doe"로 모든 작업 가능
   - Supabase Auth 연동 시 실제 권한 체크 추가
5. **검색/페이지네이션**: 기본 구현 포함 (Mock Data 필터링으로 구현)
6. **에러 처리**: 기본 alert 사용 → 추후 toast로 개선
7. **반응형**: 모바일 우선 (1열 → 2열 → 3열 그리드)

---

## 개발 단계 (Phase)

### Phase 1: 프론트엔드 UI (현재)
- Mock Data 기반 UI 컴포넌트 구현
- 검색, 필터링, 페이지네이션 등 클라이언트 기능
- shadcn/ui + Tailwind CSS 스타일링
- 반응형 디자인

### Phase 2: 백엔드 연동 (추후)
- Supabase 프로젝트 설정
- Database 테이블 생성 (blogs, comments, profiles)
- Supabase Auth 통합
- Server Actions 구현
- RLS 정책 설정
- Mock 함수 → Server Actions 교체

### Phase 3: 최적화 & 배포 (최종)
- 성능 최적화
- SEO 메타데이터
- 에러 처리 개선 (toast)
- 이미지 업로드 (Supabase Storage)
- 실시간 업데이트 (Supabase Realtime)
- Vercel 배포
