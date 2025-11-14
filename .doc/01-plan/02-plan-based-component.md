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

- [ ] Button - 기본 버튼 컴포넌트 (primary, secondary, danger variants)
- [ ] IconButton - 아이콘 버튼

**카드**

- [ ] Card - 기본 카드 컨테이너 (흰 배경, 그림자, 둥근 모서리)

**입력 필드**

- [ ] Input - 텍스트 입력 필드
- [ ] Textarea - 텍스트 영역 입력
- [ ] Label - 입력 필드 레이블

**피드백**

- [ ] LoadingSpinner - 로딩 스피너
- [ ] ErrorMessage - 에러 메시지 표시
- [ ] SuccessMessage - 성공 메시지 표시
- [ ] Toast - 토스트 알림 (선택사항)

**기타**

- [ ] Avatar - 사용자 아바타 (이니셜 표시)
- [ ] Badge - 배지 (예: 새 글, 댓글 수)
- [ ] Divider - 구분선

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

**localStorage 관리**

- [ ] storage.ts - localStorage CRUD 유틸 함수
  - [ ] getUsers() - 모든 사용자 가져오기
  - [ ] createUser() - 사용자 생성
  - [ ] getUserByEmail() - 이메일로 사용자 찾기
  - [ ] getBlogs() - 모든 블로그 가져오기
  - [ ] getBlog() - 특정 블로그 가져오기
  - [ ] createBlog() - 블로그 생성
  - [ ] updateBlog() - 블로그 수정
  - [ ] deleteBlog() - 블로그 삭제
  - [ ] canEditBlog() - 수정 권한 확인
  - [ ] getComments() - 댓글 가져오기
  - [ ] createComment() - 댓글 생성

**인증 관리**

- [ ] auth.ts - 인증 관련 유틸 함수
  - [ ] signup() - 회원가입
  - [ ] login() - 로그인
  - [ ] logout() - 로그아웃
  - [ ] getCurrentUser() - 현재 사용자 가져오기
  - [ ] isAuthenticated() - 인증 여부 확인

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

### API/Services (localStorage 기반)

- [ ] Authentication Service - 회원가입, 로그인, 로그아웃 처리
- [ ] Blog Service - 블로그 CRUD 작업
- [ ] Comment Service - 댓글 CRUD 작업
- [ ] Session Management - 세션 유지 및 관리

### 데이터 모델 (LocalStorage Schema)

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

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Context API
- **데이터 저장**: localStorage
- **배포**: Vercel

---

## 참고사항

1. **재사용 가능한 컴포넌트 우선**: Button, Input, Card 등 기본 UI 컴포넌트를 먼저 만들고 조합
2. **권한 체크는 여러 레벨에서**:
   - UI 레벨 (버튼 표시/숨김)
   - 페이지 레벨 (ProtectedRoute)
   - 데이터 레벨 (storage 함수)
3. **검색/페이지네이션은 선택사항**: MVP에서는 제외 가능, PDF에는 있지만 PRD에는 out of scope
4. **에러 처리**: 빈 제목, 중복 이메일, 권한 없음 등 기본적인 에러만 처리
5. **반응형**: 모바일 우선 (1열 → 2열 → 3열 그리드)
