# SimpleBlog MVP - 페이지 기반 구현 계획

> 이 문서는 컴포넌트 기반 계획을 **실제 개발 워크플로우**에 맞춰 페이지별로 재구성한 것입니다.
> 각 Phase 완료 시 브라우저에서 즉시 테스트할 수 있도록 설계되었습니다.

**참조 문서**:
- 컴포넌트 계획: `.doc/01-plan/02-plan-based-component.md`
- UI 디자인: `.doc/01-plan/blog-practice.pdf`

---

## Phase 0: 공통 기반 (Common Foundation)

**목적**: 모든 페이지에서 재사용되는 기본 컴포넌트와 유틸리티 준비

### 0.1 shadcn/ui 기본 컴포넌트
**상태**: ✅ 완료

**포함 컴포넌트**:
- Button (primary, secondary, danger variants)
- Input (텍스트 입력 필드)
- Textarea (다중 행 텍스트 입력)
- Label (폼 레이블)
- Card (카드 컨테이너)
- Avatar (사용자 아바타, 이니셜 표시)
- Badge (배지, 숫자 표시)
- Divider (구분선)
- LoadingSpinner (로딩 표시)
- ErrorMessage (에러 메시지)
- SuccessMessage (성공 메시지)

**파일 위치**: `components/ui/`

**검증**: 각 컴포넌트의 Storybook 또는 테스트 페이지에서 확인 가능

---

### 0.2 타입 정의 (TypeScript Types)
**상태**: ⏳ 미완료

**필요한 타입 파일** (Phase 4-7 구현 전 완료 필요):
- `types/blog.ts` - Blog 인터페이스 (Supabase blogs 테이블)
- `types/comment.ts` - Comment 인터페이스 (Supabase comments 테이블)
- `types/profile.ts` - Profile 인터페이스 (Supabase profiles 테이블)

**Supabase 자동 생성 타입**:
```typescript
// Supabase CLI로 자동 생성 가능
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

**필요한 주요 타입** (수동 정의 또는 Supabase 자동 생성):
```typescript
// Blog (blogs 테이블)
interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;      // Supabase: snake_case
  created_at: string;
  updated_at: string;
}

// Comment (comments 테이블)
interface Comment {
  id: string;
  blog_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

// Profile (profiles 테이블)
interface Profile {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile?: string;
  role: string;
  created_at: string;
  updated_at: string;
}
```

**비고**:
- Supabase Auth User 타입은 `@supabase/supabase-js`에서 자동 제공
- snake_case (DB) ↔ camelCase (TypeScript) 변환 필요 시 매핑 함수 작성

---

### 0.3 유틸리티 함수
**상태**: ⏳ 부분 완료

**완료된 유틸리티**:
- `lib/utils.ts` - cn() 함수 (Tailwind 클래스 병합)

**필요한 유틸리티** (Phase 4-7 구현 전 완료 필요):
- `lib/utils/date.ts` - formatDate(), formatRelativeTime()
- `lib/utils/text.ts` - truncateText(), generateId(), slugify()
- `lib/utils/validation.ts` - validateEmail(), validatePassword(), validateBlogForm()

**비고**:
- Mock Data는 사용하지 않음 (Supabase 직접 사용)
- Phase 4-7 블로그 페이지 구현 시 유틸리티 함수 필요

**검증**: 각 유틸리티 함수에 대한 단위 테스트 실행

---

## Phase 1: 레이아웃 컴포넌트

**목적**: 모든 페이지에서 공유되는 레이아웃 프레임워크 구축
**상태**: ✅ 완료

### 1.1 Header 컴포넌트
**파일**: `components/layout/Header.tsx`
**URL**: N/A (모든 페이지에서 공유)
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage Header)

**포함 컴포넌트**:
- [x] Logo - SimpleBlog 브랜딩 (왼쪽 상단)
- [x] SearchBar - 검색 바 (중앙, "Search posts..." placeholder)
- [x] Navigation - 네비게이션 버튼 (New Post, Login)
- [x] UserMenu - 사용자 메뉴 (사용자명, 로그아웃)

**UI 스펙** (PDF 기반):
- 고정 헤더 (fixed position)
- 흰색 배경, 그림자 효과
- 로고 - 검색바 - 네비게이션 순서
- 검색바: 둥근 디자인, 중앙 정렬
- 네비게이션: "New Post" (파란색), "Login" (회색)
- 사용자 메뉴: Avatar + 사용자명 표시

**필요 타입**: `AuthUser`
**필요 훅**: `useAuth` (AuthContext)
**필요 컴포넌트**: `Button`, `Input`, `Avatar`

**구현 우선순위**:
1. Logo 컴포넌트 (SimpleBlog 텍스트 + 아이콘)
2. SearchBar 컴포넌트 (입력 필드 + 검색 아이콘)
3. Navigation 컴포넌트 (버튼 그룹)
4. UserMenu 컴포넌트 (Avatar + 드롭다운, 선택사항)
5. Header 통합 (flexbox 레이아웃)

**테스트 체크포인트**:
- [ ] 로고 클릭 시 홈페이지로 이동
- [ ] 검색바 입력 및 검색 기능 (추후 연결)
- [ ] New Post 버튼 클릭 시 `/blog/new` 이동
- [ ] Login/Logout 버튼 동작 (추후 연결)
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)

---

### 1.2 PageContainer
**파일**: `components/layout/PageContainer.tsx`
**URL**: N/A (모든 페이지에서 재사용)

**포함 컴포넌트**:
- [x] PageContainer - 페이지 공통 컨테이너 (max-width, padding)
- [x] CenteredContainer - 중앙 정렬 컨테이너 (폼 페이지용)

**UI 스펙**:
- PageContainer: max-width 1200px, 좌우 padding
- CenteredContainer: max-width 600px, 중앙 정렬

**필요 컴포넌트**: 없음 (순수 레이아웃)

---

## Phase 2: Root Layout & Supabase Auth 통합

**목적**: Supabase Auth 기반 인증 시스템 구축 및 앱 루트 설정
**상태**: ✅ 완료

### 2.1 Middleware & RootLayout
**파일**:
- `middleware.ts` - Next.js 미들웨어 (세션 관리)
- `app/layout.tsx` - RootLayout (HTML 구조)
- `lib/supabase/client.ts` - Supabase 클라이언트 (브라우저용)
- `lib/supabase/server.ts` - Supabase 서버 클라이언트 (SSR용)
- `lib/supabase/middleware.ts` - Supabase 미들웨어 헬퍼
- `lib/auth.config.ts` - 인증 설정 (보호 라우트, 리디렉션)

**포함 컴포넌트**:
- [x] Middleware (세션 갱신 및 라우트 보호)
- [x] RootLayout (HTML 구조 및 메타데이터)
- [x] Supabase Client Setup (클라이언트/서버 분리)
- [x] Auth Configuration (authConfig)

**필요 타입**: Supabase Auth 타입 (자동 생성)
**필요 환경변수**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

**구현 우선순위**:
1. Supabase 클라이언트 설정 (client.ts, server.ts)
2. Middleware 구현 (세션 갱신)
3. Auth Config 설정 (보호 라우트, 리디렉션 경로)
4. RootLayout 설정 (메타데이터, 폰트)
5. 환경 변수 검증 (lib/env.ts)

**Supabase Auth 통합**:
- 인증 방식: Supabase Auth (이메일/비밀번호 + OAuth)
- 세션 관리: httpOnly 쿠키 (보안)
- 미들웨어: 모든 요청마다 세션 갱신
- 보호 라우트: middleware.ts에서 자동 리디렉션

**테스트 체크포인트**:
- [x] Supabase 클라이언트 연결 확인
- [x] Middleware 세션 갱신 동작
- [x] 보호 라우트 리디렉션 확인
- [x] 환경 변수 검증 동작

---

## Phase 3: Supabase 인증 페이지

**목적**: Supabase Auth 기반 로그인/회원가입 플로우 구현
**상태**: ✅ 완료

### 3.1 Server Actions (인증 로직)
**파일**: `app/actions/auth.ts`

**포함 함수**:
- [x] `login(formData)` - 이메일/비밀번호 로그인
- [x] `signup(formData)` - 회원가입 + 프로필 생성
- [x] `loginWithGoogle()` - Google OAuth 로그인
- [x] `resetPasswordRequest(formData)` - 비밀번호 재설정 요청
- [x] `resetPassword(formData)` - 비밀번호 재설정
- [x] `signOut()` - 로그아웃
- [x] `getUser()` - 현재 사용자 정보 조회
- [x] `getUserProfile()` - 사용자 프로필 조회

**구현 방식**:
- Server Actions (`'use server'`)
- Supabase Server Client 사용
- 자동 리디렉션 (authConfig 기반)

---

### 3.2 로그인 페이지
**파일**:
- `app/auth/login/page.tsx` - 로그인 페이지
- `components/auth/LoginForm.tsx` - 로그인 폼
- `components/auth/GoogleLoginButton.tsx` - Google 로그인 버튼

**URL**: `/auth/login`
**UI 참조**: 컴포넌트 계획 참조 (PDF에는 미포함)

**포함 컴포넌트**:
- [x] LoginPage (페이지 컴포넌트)
- [x] LoginForm (폼 컴포넌트)
- [x] GoogleLoginButton (OAuth 버튼)

**UI 스펙**:
- 중앙 정렬 카드 레이아웃
- 이메일, 비밀번호 입력 필드
- "Login" 버튼 (파란색)
- "Sign in with Google" 버튼
- "회원가입", "비밀번호 찾기" 링크

**필요 타입**: Supabase Auth 타입
**필요 Server Actions**: `login()`, `loginWithGoogle()`
**필요 컴포넌트**: `Card`, `Input`, `Label`, `Button`

**구현 우선순위**:
1. LoginForm 컴포넌트 (폼 상태 관리)
2. Server Action 호출 (login)
3. 클라이언트 사이드 검증
4. 에러 메시지 표시
5. Google OAuth 통합

**테스트 체크포인트**:
- [x] 이메일/비밀번호 입력 및 검증
- [x] 로그인 성공 시 자동 리디렉션
- [x] 로그인 실패 시 에러 메시지 표시
- [x] Google 로그인 동작
- [x] 회원가입/비밀번호 찾기 링크 동작

---

### 3.3 회원가입 페이지
**파일**:
- `app/auth/signup/page.tsx` - 회원가입 페이지
- `components/auth/SignupForm.tsx` - 회원가입 폼

**URL**: `/auth/signup`
**UI 참조**: 컴포넌트 계획 참조 (PDF에는 미포함)

**포함 컴포넌트**:
- [x] SignupPage (페이지 컴포넌트)
- [x] SignupForm (폼 컴포넌트)

**UI 스펙**:
- 중앙 정렬 카드 레이아웃
- 이메일, First Name, Last Name, 비밀번호 입력 필드
- "Sign Up" 버튼 (파란색)
- "로그인" 링크

**필요 타입**: Supabase Auth 타입
**필요 Server Actions**: `signup()`
**필요 컴포넌트**: `Card`, `Input`, `Label`, `Button`

**구현 우선순위**:
1. SignupForm 컴포넌트 (폼 상태 관리)
2. Server Action 호출 (signup)
3. 클라이언트 사이드 검증
4. 프로필 자동 생성 (profiles 테이블)
5. 에러 메시지 표시

**테스트 체크포인트**:
- [x] 모든 필드 입력 및 검증
- [x] 회원가입 성공 시 자동 리디렉션
- [x] 이메일 중복 체크
- [x] 프로필 자동 생성 확인

---

### 3.4 추가 인증 페이지
**파일**:
- `app/auth/forgot-password/page.tsx` - 비밀번호 찾기
- `app/auth/reset-password/page.tsx` - 비밀번호 재설정
- `app/auth/verify-email/page.tsx` - 이메일 인증
- `app/auth/callback/route.ts` - OAuth 콜백

**포함 컴포넌트**:
- [x] ForgotPasswordForm - 비밀번호 재설정 요청
- [x] ResetPasswordForm - 새 비밀번호 설정

**구현 상태**: ✅ 완료

---

## Phase 4: 블로그 목록 페이지 (Homepage)

**목적**: 블로그 글 목록을 카드 그리드로 표시

### 4.1 블로그 목록 페이지
**파일**: `app/page.tsx`
**URL**: `/` (홈페이지)
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage)
**상태**: ✅ 완료

**포함 컴포넌트**:
- HomePage (페이지 컴포넌트)
- BlogGrid (그리드 레이아웃 컨테이너)
- BlogCard (개별 블로그 카드)
- SearchBar (검색 바, Header에 포함)
- Pagination (페이지네이션)
- EmptyState (글이 없을 때)

**UI 스펙** (PDF 기반):
- 고정 헤더 (Phase 1에서 구현)
- 검색 바 (헤더 중앙, "Search posts..." placeholder)
- 3열 그리드 레이아웃 (데스크톱)
- 블로그 카드:
  - 그라데이션/이미지 배경 (선택사항)
  - 제목 (굵은 글씨)
  - 작성자명, 날짜
  - 내용 미리보기 (100자)
- 페이지네이션 (1, 2, 3... 페이지 번호)

**필요 타입**: `Blog`
**필요 훅**: 없음 (또는 useBlog 커스텀 훅)
**필요 유틸**: `getMockBlogs()`, `searchMockBlogs()`, `truncateText()`, `formatDate()`
**필요 컴포넌트**: `Card`, `Badge`, `Avatar`, `Button`

**구현 우선순위**:
1. BlogCard 컴포넌트 (제목, 작성자, 날짜, 미리보기)
2. BlogGrid 컴포넌트 (3열 그리드 레이아웃)
3. Mock 데이터 연결 (getMockBlogs)
4. 검색 기능 (searchMockBlogs)
5. Pagination 컴포넌트
6. EmptyState 컴포넌트

**테스트 체크포인트**:
- [ ] 블로그 카드 그리드 표시 확인
- [ ] 블로그 카드 클릭 시 상세 페이지로 이동
- [ ] 검색 기능 동작 (키워드 입력 시 필터링)
- [ ] 페이지네이션 동작 (페이지 전환)
- [ ] 반응형 디자인 (1열 → 2열 → 3열)
- [ ] EmptyState 표시 (검색 결과 없을 때)

---

## Phase 5: 블로그 상세 페이지

**목적**: 블로그 글 전체 내용 및 댓글 표시

### 5.1 블로그 상세 페이지
**파일**: `app/blog/[id]/page.tsx`
**URL**: `/blog/[id]`
**UI 참조**: `blog-practice.pdf` - Page 3 (Post Detail Page)
**상태**: ✅ 완료

**포함 컴포넌트**:
- PostDetailPage (페이지 컴포넌트)
- BlogPost (글 전체 내용 표시)
- BlogHeader (제목, 작성자, 날짜)
- BlogContent (본문, 줄바꿈 유지)
- BlogActions (Edit/Delete 버튼, 작성자만 표시)
- DeleteConfirmDialog (삭제 확인 다이얼로그)
- CommentList (댓글 목록)
- CommentItem (개별 댓글)
- CommentForm (댓글 작성 폼)
- LoginPrompt (비로그인 사용자 안내)
- EmptyComments (댓글 없을 때)

**UI 스펙** (PDF 기반):
- 상단: 제목 (큰 글씨), 작성자명, 날짜
- Edit/Delete 버튼 (작성자만 표시, 우측 상단)
- 본문 내용 (줄바꿈 유지, white-space: pre-wrap)
- Comments 섹션:
  - "Comments" 제목
  - 댓글 입력 폼 (textarea + "Post Comment" 버튼)
  - 댓글 목록 (Avatar + 작성자명 + 시간 + 내용)

**필요 타입**: `Blog`, `Comment`, `AuthUser`
**필요 훅**: `useAuth`
**필요 유틸**: `getMockBlogById()`, `getMockComments()`, `addMockComment()`, `deleteMockComment()`, `formatRelativeTime()`
**필요 컴포넌트**: `Card`, `Button`, `Avatar`, `Textarea`, `Divider`, `Badge`

**구현 우선순위**:
1. BlogHeader 컴포넌트 (제목, 작성자, 날짜)
2. BlogContent 컴포넌트 (본문)
3. BlogActions 컴포넌트 (Edit/Delete 버튼)
4. DeleteConfirmDialog (선택사항, 또는 confirm() 사용)
5. CommentItem 컴포넌트 (Avatar + 작성자 + 내용)
6. CommentList 컴포넌트 (댓글 목록)
7. CommentForm 컴포넌트 (textarea + 버튼)
8. LoginPrompt 컴포넌트 (비로그인 사용자용)
9. 전체 통합 (PostDetailPage)

**테스트 체크포인트**:
- [ ] 블로그 글 전체 내용 표시 확인
- [ ] Edit/Delete 버튼 권한 확인 (작성자만 표시)
- [ ] Edit 버튼 클릭 시 수정 페이지로 이동
- [ ] Delete 버튼 클릭 시 삭제 확인 및 삭제 처리
- [ ] 댓글 목록 표시 확인
- [ ] 댓글 작성 폼 동작 (로그인 사용자만)
- [ ] 비로그인 사용자에게 로그인 안내 표시
- [ ] EmptyComments 표시 (댓글 없을 때)

---

## Phase 6: 블로그 작성 페이지

**목적**: 새 블로그 글 작성

### 6.1 블로그 작성 페이지
**파일**: `app/blog/new/page.tsx`
**URL**: `/blog/new`
**UI 참조**: `blog-practice.pdf` - Page 2 (New Post Page)
**상태**: ✅ 완료

**포함 컴포넌트**:
- NewPostPage (페이지 컴포넌트)
- BlogForm (블로그 작성 폼)
- TitleInput (제목 입력 필드)
- ContentTextarea (내용 입력 필드, 최소 높이 300px)
- FormActions (Publish/Cancel 버튼)

**UI 스펙** (PDF 기반):
- 중앙 정렬 레이아웃
- "New Post" 제목
- Title 입력 필드 ("Enter your post title" placeholder)
- Content textarea ("Write your blog post..." placeholder)
- 버튼:
  - "Publish" (파란색, 우측)
  - "Cancel" (회색, 좌측)

**필요 타입**: `Blog`, `AuthUser`
**필요 훅**: `useAuth`
**필요 유틸**: `addMockBlog()`, `validateBlogForm()`, `generateId()`
**필요 컴포넌트**: `Card`, `Input`, `Textarea`, `Label`, `Button`, `ErrorMessage`

**구현 우선순위**:
1. TitleInput 컴포넌트
2. ContentTextarea 컴포넌트 (min-height: 300px)
3. FormActions 컴포넌트 (Publish/Cancel 버튼)
4. BlogForm 통합 (폼 상태 관리)
5. 유효성 검사 (validateBlogForm)
6. Publish 처리 (addMockBlog)
7. Cancel 처리 (이전 페이지로 이동)

**테스트 체크포인트**:
- [ ] 제목/내용 입력 및 검증
- [ ] Publish 버튼 클릭 시 블로그 생성 및 상세 페이지로 이동
- [ ] Cancel 버튼 클릭 시 이전 페이지로 이동
- [ ] 에러 메시지 표시 (빈 제목/내용)
- [ ] 로그인하지 않은 사용자는 접근 불가 (ProtectedRoute)

---

## Phase 7: 블로그 수정 페이지

**목적**: 기존 블로그 글 수정

### 7.1 블로그 수정 페이지
**파일**: `app/blog/[id]/edit/page.tsx`
**URL**: `/blog/[id]/edit`
**UI 참조**: `blog-practice.pdf` - Page 4 (Edit Post Page)
**상태**: ✅ 완료

**포함 컴포넌트**:
- EditPostPage (페이지 컴포넌트)
- BlogForm (블로그 작성 폼, 재사용)
- TitleInput (제목 입력 필드, 재사용)
- ContentTextarea (내용 입력 필드, 재사용)
- FormActions (Save/Cancel 버튼)

**UI 스펙** (PDF 기반):
- "Edit Post" 제목
- Title 입력 필드 (기존 제목으로 pre-filled)
- Content textarea (기존 내용으로 pre-filled)
- 버튼:
  - "Save Changes" (파란색, 우측)
  - "Cancel" (회색, 좌측)

**필요 타입**: `Blog`, `AuthUser`
**필요 훅**: `useAuth`
**필요 유틸**: `getMockBlogById()`, `updateMockBlog()`, `validateBlogForm()`
**필요 컴포넌트**: `Card`, `Input`, `Textarea`, `Label`, `Button`, `ErrorMessage`

**구현 우선순위**:
1. BlogForm 재사용 (edit 모드 추가)
2. 기존 블로그 데이터 로드 (getMockBlogById)
3. FormActions 수정 (Save Changes 버튼)
4. Save 처리 (updateMockBlog)
5. 권한 확인 (작성자만 수정 가능)

**테스트 체크포인트**:
- [ ] 기존 블로그 내용이 pre-filled로 표시
- [ ] 제목/내용 수정 및 검증
- [ ] Save Changes 버튼 클릭 시 업데이트 및 상세 페이지로 이동
- [ ] Cancel 버튼 클릭 시 상세 페이지로 이동
- [ ] 권한 확인 (작성자가 아닌 경우 접근 불가)

---

## 구현 순서 요약

### ✅ 완료된 Phase
- **Phase 0**: 공통 기반 (UI 컴포넌트, 타입, 유틸리티)
- **Phase 1**: 레이아웃 컴포넌트 (Header, PageContainer)
- **Phase 2**: Root Layout & Providers (AuthProvider)
- **Phase 3**: 인증 페이지 (Login, Signup)
- **Phase 4**: 블로그 목록 페이지 (Homepage)
- **Phase 5**: 블로그 상세 페이지 (Post Detail)
- **Phase 6**: 블로그 작성 페이지 (New Post)
- **Phase 7**: 블로그 수정 페이지 (Edit Post)

---

## 권장 구현 순서

```yaml
implementation_order:
  phase_1:
    name: "레이아웃 프레임워크"
    components: ["Header", "PageContainer"]
    test: "브라우저에서 Header + 빈 페이지 표시 확인"

  phase_2:
    name: "전역 상태 관리"
    components: ["AuthProvider", "RootLayout"]
    test: "useAuth 훅으로 Mock 사용자 정보 접근 확인"

  phase_3:
    name: "인증 플로우"
    components: ["LoginPage", "SignupPage"]
    test: "로그인/회원가입 폼 동작 및 리디렉션 확인"

  phase_4:
    name: "블로그 목록 (이미 완료)"
    components: ["HomePage", "BlogGrid", "BlogCard"]
    test: "블로그 카드 그리드 표시 및 검색 기능 확인"

  phase_5:
    name: "블로그 상세 (이미 완료)"
    components: ["PostDetailPage", "BlogPost", "CommentList"]
    test: "블로그 상세 내용 및 댓글 표시 확인"

  phase_6:
    name: "블로그 작성 (이미 완료)"
    components: ["NewPostPage", "BlogForm"]
    test: "새 글 작성 및 Publish 동작 확인"

  phase_7:
    name: "블로그 수정 (이미 완료)"
    components: ["EditPostPage"]
    test: "기존 글 수정 및 Save 동작 확인"
```

---

## 테스트 체크리스트

각 Phase 완료 후 다음을 확인하세요:

### Phase 1 체크리스트
- [ ] Header가 모든 페이지 상단에 고정 표시
- [ ] 로고 클릭 시 홈페이지로 이동
- [ ] 검색바 입력 가능 (기능은 Phase 4에서 연결)
- [ ] 네비게이션 버튼 표시 및 클릭 가능
- [ ] 반응형 디자인 동작 (모바일/태블릿/데스크톱)

### Phase 2 체크리스트
- [ ] AuthProvider가 전체 앱을 래핑
- [ ] useAuth 훅으로 모든 컴포넌트에서 인증 상태 접근
- [ ] Mock 사용자 정보 표시 확인
- [ ] 로그인/로그아웃 상태 전환 동작

### Phase 3 체크리스트
- [ ] 로그인 페이지 접근 및 폼 표시
- [ ] 회원가입 페이지 접근 및 폼 표시
- [ ] 로그인 성공 시 홈페이지로 리디렉션
- [ ] 회원가입 성공 시 로그인 페이지로 리디렉션
- [ ] 유효성 검사 및 에러 메시지 표시

### Phase 4-7 체크리스트 (이미 완료)
- [ ] 블로그 목록 페이지 동작 확인
- [ ] 블로그 상세 페이지 동작 확인
- [ ] 블로그 작성 페이지 동작 확인
- [ ] 블로그 수정 페이지 동작 확인
- [ ] 댓글 작성 및 표시 확인
- [ ] 검색 및 페이지네이션 동작 확인

---

## 추후 작업 (백엔드 연동)

### Phase 8: Supabase 고급 기능 (추후)

> **⚠️ 변경사항**: Phase 2-3에서 Supabase Auth를 이미 구현했으므로, Phase 8은 **고급 기능**으로 재정의합니다.

**8.1 이미지 업로드 (Supabase Storage)**
- Supabase Storage 버킷 생성 (blog-images)
- 이미지 업로드 컴포넌트 구현
- Server Action: uploadBlogImage, deleteBlogImage
- Blog 작성/수정 시 이미지 첨부 기능
- 썸네일 자동 생성 (선택사항)

**8.2 Row Level Security (RLS) 강화**
- Blogs 테이블: 작성자만 수정/삭제 가능
- Comments 테이블: 작성자만 수정/삭제 가능
- Profiles 테이블: 본인 프로필만 수정 가능
- RLS 정책 테스트 (권한 체크)

**8.3 실시간 기능 (Supabase Realtime)**
- 댓글 실시간 업데이트 (새 댓글 자동 표시)
- 블로그 게시물 실시간 업데이트 (선택사항)
- Realtime Subscription 구현

**8.4 검색 기능**
- Full-text Search (Supabase Postgres FTS)
- 제목, 내용, 태그 검색
- 검색 결과 페이지 구현
- 검색 자동완성 (선택사항)

### Phase 9: 최적화 & 배포 (최종)
- 성능 최적화 (이미지 최적화, 코드 스플리팅)
- SEO 메타데이터 추가
- 에러 처리 개선 (toast 알림)
- 이미지 업로드 (Supabase Storage, 선택사항)
- 실시간 업데이트 (Supabase Realtime, 선택사항)
- Vercel 배포

---

## 의존성 그래프

```
Phase 0 (Common Foundation)
  └─> Phase 1 (Layout)
       └─> Phase 2 (Providers)
            └─> Phase 3 (Auth)
                 ├─> Phase 4 (Blog List) ✅
                 ├─> Phase 5 (Blog Detail) ✅
                 ├─> Phase 6 (New Post) ✅
                 └─> Phase 7 (Edit Post) ✅
```

**의존성 보장**:
- 각 Phase는 이전 Phase가 완료되어야 시작 가능
- 모든 의존성은 사용 전에 구현됨
- Phase 4-7은 이미 완료되었으나, Phase 1-3 완료 후 통합 테스트 필요

---

## 프레임워크 정보

**기술 스택**:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix UI)
- React 19

**파일 경로 패턴**:
- Pages: `app/**/page.tsx`
- Layouts: `app/**/layout.tsx`
- Components: `components/**/*.tsx`
- Utils: `lib/**/*.ts`
- Types: `types/**/*.ts`

---

## 참고사항

1. **점진적 테스트**: 각 Phase 완료 시 브라우저에서 즉시 테스트 가능
2. **Supabase 기반 개발**: Phase 2부터 Supabase Auth 및 Database 사용 (Mock Data 사용하지 않음)
3. **TypeScript 타입**: Supabase CLI로 타입 자동 생성 (`supabase gen types typescript`)
4. **권한 체크**: Supabase Auth 기반 실제 사용자 인증 (middleware + RLS 정책)
5. **반응형 디자인**: 모바일 우선 (1열 → 2열 → 3열 그리드)
6. **에러 처리**: 기본 alert 사용 → 추후 toast로 개선

---

## 성공 기준

이 계획이 성공적일 때:

✅ **완성도**
- 모든 컴포넌트가 페이지에 할당됨
- 의존성 순서가 보장됨

✅ **테스트 가능성**
- 각 페이지가 독립적으로 테스트 가능
- 각 Phase 후 브라우저 테스트 가능

✅ **명확성**
- 구현 순서가 명확함
- 개발자가 다음 단계를 즉시 알 수 있음

✅ **동적 구조**
- Phase 개수가 프로젝트에 맞춰 자동 결정 (SimpleBlog: 7 Phases)
- 하드코딩된 구조 없음

---

**문서 생성 정보**:
- 생성 일자: 2025-11-15
- 기반 문서: `.doc/01-plan/02-plan-based-component.md`, `.doc/01-plan/blog-practice.pdf`
- 프레임워크: Next.js 15 (App Router)
- 총 Phase 수: 7개 (동적 생성)
