# SimpleBlog MVP - Product Requirements Document

## 1. One-Liner

SimpleBlog는 사용자가 자신의 블로그 글을 작성하고 관리하며, 누구나 읽을 수 있는 간단한 블로그 플랫폼입니다.

## 2. The Problem

- **Who**: 블로그를 테스트하고 싶은 개발자 및 일반 사용자
- **Pain**: 기존 블로그 플랫폼(Tistory, Velog, Medium)은 회원가입, 설정, 복잡한 에디터 등 시작하기까지 장벽이 높음
- **Current solution**: 로컬에서 markdown 파일로 관리하거나 기존 블로그 서비스 이용
- **Inadequacy**: 간단한 인증으로 자신의 글을 관리할 수 있는 테스트용 블로그가 필요

## 3. The Solution

- **Core loop**: 로그인 → 글 작성 → 카드로 표시 → 클릭해서 읽기 → 댓글 달기 (본인 글만 수정/삭제 가능)
- **One thing**: 간단한 인증으로 자신의 글을 관리하고, 모든 사람이 읽을 수 있는 블로그
- **Different**: 복잡한 설정 없음, 순수하게 글 쓰기와 소유권 관리에만 집중

## 4. Success Metric

- 사용자가 회원가입/로그인 후 첫 글을 5분 안에 작성하고 발행
- 작성자가 자신의 글을 수정/삭제할 수 있음
- 로그인하지 않은 사용자도 모든 글을 읽을 수 있음
- 작성된 글에 최소 1개 이상의 댓글 작성 (로그인한 사용자만)
- 다른 사용자의 글에는 수정/삭제 버튼이 표시되지 않음

## 5. MVP Scope

### ✅ In Scope (Core User Loop Only)

**인증 시스템:**

- **회원가입/로그인**: Custom skill로 구현한 인증 기능 사용
  - 이유: 작성자를 식별하여 소유권 관리가 필요함
- **세션 관리**: 로그인 상태 유지 (localStorage 또는 쿠키)
  - 이유: 페이지 이동 시에도 로그인 상태 유지
- **로그아웃**: 간단한 로그아웃 기능
  - 이유: 다른 계정으로 전환 가능해야 함

**글 관리 (CRUD with Authorization):**

- **글 작성**: 로그인한 사용자만 제목 + 내용(textarea) 입력 가능
  - 이유: 작성자를 기록해야 소유권 관리 가능
- **글 목록**: 홈에서 카드 UI로 모든 글 표시 (제목, 미리보기, 작성자, 날짜)
  - 이유: 작성한 글을 확인하고, 누가 썼는지 알 수 있어야 함
- **글 상세**: /blog/[id] 경로로 전체 내용 보기 (모든 사용자 접근 가능)
  - 이유: 글을 읽을 수 있어야 함
- **글 수정**: 작성자만 상세 페이지에서 수정 버튼 표시 → 수정 폼
  - 이유: 본인이 작성한 글만 수정 가능해야 함
- **글 삭제**: 작성자만 상세 페이지에서 삭제 버튼 표시
  - 이유: 본인이 작성한 글만 삭제 가능해야 함

**권한 관리:**

- **작성자 확인**: 현재 로그인한 사용자와 글 작성자 비교
  - 이유: 수정/삭제 버튼을 조건부로 표시
- **읽기 권한**: 모든 사용자(비로그인 포함) 글 읽기 가능
  - 이유: 블로그는 공개되어야 함

**댓글 기능:**

- **댓글 작성**: 로그인한 사용자만 글 상세 페이지 하단에 댓글 작성 가능
  - 이유: 작성자를 기록하기 위해 로그인 필요
- **댓글 목록**: 해당 글의 댓글들을 시간순으로 표시 (작성자명 포함)
  - 이유: 작성된 댓글과 작성자를 볼 수 있어야 함

**UI/UX:**

- Tailwind CSS로 모바일 반응형 카드 UI
- 간단한 레이아웃 (헤더 + 로그인 상태 표시 + 컨텐츠)
- 로그인/로그아웃 버튼

### ❌ Explicitly Out of Scope for v1

- **프로필 페이지**: 사용자별 글 목록 페이지 없음
  - 이유: 홈에서 전체 글을 볼 수 있으면 충분
- **작성자 필터**: 특정 작성자의 글만 보기 기능 없음
  - 이유: 검색/필터는 나중에 추가
- **비밀번호 찾기/변경**: 기본 인증만 제공
  - 이유: 테스트 목적, 복잡도 증가
- **이메일 인증**: 간단한 회원가입만
  - 이유: 추가 인프라 필요
- **프로필 사진**: 작성자명만 표시
  - 이유: 이미지 관리 복잡도 증가
- **마크다운 에디터**: plain textarea만 사용
  - 이유: 외부 라이브러리 추가, 학습 곡선 증가
- **이미지 업로드**: 텍스트만 지원
  - 이유: 파일 저장소 필요, 복잡도 증가
- **카테고리/태그**: 분류 기능 없음
  - 이유: 글이 적을 때는 불필요
- **검색 기능**: 브라우저 Ctrl+F로 충분
  - 이유: 추가 구현 시간 소요
- **좋아요/조회수**: 소셜 기능 제외
  - 이유: 핵심 가치와 무관
- **댓글 수정/삭제**: 작성만 가능
  - 이유: 테스트 목적에서 우선순위 낮음
- **댓글 답글**: flat 구조만 지원
  - 이유: nested 댓글은 복잡도 증가
- **페이지네이션**: 모든 글을 한 페이지에 표시
  - 이유: 초기에는 글이 많지 않음
- **정렬/필터**: 최신순 고정
  - 이유: 단순함 유지

## 6. Tech Stack (Frontend Only)

```
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: React useState + useEffect + Context API (for auth state)
- Authentication: Custom skill implementation (회원가입/로그인)
- Data Storage: localStorage (브라우저 로컬 저장)
- Deployment: Vercel
- Additional dependencies: NONE (순수 Next.js + Tailwind + Custom Auth만)
```

**백엔드 없이 localStorage를 사용하는 이유:**

- 서버 설정 불필요
- API 엔드포인트 구현 불필요
- 즉시 테스트 가능
- 인증 정보도 localStorage에 저장 (테스트 목적)
- 나중에 Supabase 등으로 쉽게 마이그레이션 가능

**Custom Auth Skill 사용:**

- Henry가 만든 인증 skill을 통해 회원가입/로그인 구현
- 프론트엔드에서 인증 상태를 Context로 관리
- localStorage에 사용자 정보와 세션 저장

## 7. Data Model (LocalStorage Schema)

```typescript
// LocalStorage Keys: 'simpleBlog', 'authUser', 'users'

interface User {
  id: string; // UUID
  email: string;
  username: string;
  password: string; // 테스트용이므로 평문 저장 (실제 프로덕션에서는 절대 안됨!)
  createdAt: string; // ISO timestamp
}

interface AuthUser {
  id: string;
  email: string;
  username: string;
  // 현재 로그인한 사용자 정보
}

interface Blog {
  id: string; // UUID
  title: string;
  content: string;
  authorId: string; // 작성자 User ID
  authorName: string; // 작성자 이름 (빠른 표시용)
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

interface Comment {
  id: string; // UUID
  blogId: string; // 어느 글의 댓글인지
  authorId: string; // 작성자 User ID
  authorName: string; // 작성자 이름
  content: string;
  createdAt: string; // ISO timestamp
}

interface LocalStorageData {
  blogs: Blog[];
  comments: Comment[];
}

// localStorage 구조
// 'users': User[]                    // 모든 사용자 목록
// 'authUser': AuthUser | null        // 현재 로그인한 사용자
// 'simpleBlog': LocalStorageData     // 블로그 데이터
```

**주요 권한 로직:**

- 글 작성: `authUser`가 있어야 함
- 글 수정/삭제: `blog.authorId === authUser.id`
- 댓글 작성: `authUser`가 있어야 함
- 글 읽기: 모든 사용자 가능 (authUser 불필요)

## 8. User Flow

### 회원가입/로그인 플로우

1. 사용자가 홈페이지(/) 접속
2. 로그인되지 않은 경우 "로그인" 버튼 표시
3. 로그인 페이지(/auth/login) 또는 회원가입 페이지(/auth/signup) 이동
4. Custom skill의 인증 로직 실행
5. 인증 성공 → authUser를 localStorage에 저장
6. 홈으로 리다이렉트 → "새 글 쓰기" 버튼 활성화

### 글 작성 플로우 (로그인 필요)

1. 로그인한 사용자가 홈페이지(/) 접속
2. "새 글 쓰기" 버튼 클릭 → /blog/new 이동
3. 제목과 내용 입력
4. "발행" 버튼 클릭 → localStorage에 저장 (authorId와 authorName 포함)
5. 홈으로 리다이렉트 → 새 글이 카드로 표시됨

### 글 읽기 플로우 (모든 사용자 가능)

1. 홈페이지에서 카드 클릭
2. /blog/[id] 페이지로 이동 → 전체 내용 표시
3. 로그인 여부와 작성자 확인:
   - 본인 글이면: 수정/삭제 버튼 표시
   - 다른 사람 글이거나 비로그인: 수정/삭제 버튼 숨김

### 댓글 작성 플로우 (로그인 필요)

1. 글 상세 페이지 하단의 댓글 섹션
2. 로그인한 경우: 댓글 입력 폼 표시
3. 로그인하지 않은 경우: "댓글을 작성하려면 로그인하세요" 메시지
4. 댓글 내용 작성 → "댓글 작성" 버튼 클릭
5. localStorage에 저장 (authorId와 authorName 포함)
6. 페이지 새로고침 없이 댓글 목록에 즉시 표시

### 글 수정/삭제 플로우 (작성자만 가능)

1. 본인이 작성한 글의 상세 페이지에서 "수정" 버튼 클릭
2. /blog/[id]/edit 이동 → 기존 내용이 폼에 채워진 상태
3. 수정 후 "저장" 클릭 → localStorage 업데이트 → 상세 페이지로 돌아가기
4. "삭제" 버튼 클릭 → 확인 다이얼로그 → localStorage에서 삭제 → 홈으로 이동

### 로그아웃 플로우

1. 헤더의 "로그아웃" 버튼 클릭
2. localStorage에서 authUser 제거
3. 홈으로 리다이렉트 → "로그인" 버튼 표시

## 9. Page Structure

```
app/
├── page.tsx                    # 홈 (블로그 목록 - 카드 UI)
├── layout.tsx                  # 공통 레이아웃 (헤더 + AuthProvider)
├── auth/
│   ├── login/
│   │   └── page.tsx           # 로그인 페이지
│   └── signup/
│       └── page.tsx           # 회원가입 페이지
└── blog/
    ├── new/
    │   └── page.tsx           # 새 글 작성 페이지 (로그인 필요)
    ├── [id]/
    │   ├── page.tsx           # 글 상세 페이지 (모든 사용자)
    │   └── edit/
    │       └── page.tsx       # 글 수정 페이지 (작성자만)

components/
├── Header.tsx                 # 헤더 (로그인 상태, 로그인/로그아웃 버튼)
├── BlogCard.tsx               # 홈의 카드 컴포넌트
├── BlogForm.tsx               # 글 작성/수정 폼
├── CommentList.tsx            # 댓글 목록
├── CommentForm.tsx            # 댓글 작성 폼 (로그인 필요)
└── ProtectedRoute.tsx         # 로그인 확인 래퍼

contexts/
└── AuthContext.tsx            # 인증 상태 관리 (Context API)

lib/
├── storage.ts                 # localStorage CRUD 유틸 함수
└── auth.ts                    # 인증 관련 유틸 (custom skill 로직)
```

## 10. Key Implementation Details

### 인증 관련 (lib/auth.ts)

```typescript
// Custom skill을 활용한 인증 함수들
- signup(email: string, username: string, password: string): User
- login(email: string, password: string): User | null
- logout(): void
- getCurrentUser(): AuthUser | null
- isAuthenticated(): boolean
```

### AuthContext (contexts/AuthContext.tsx)

```typescript
// 전역 인증 상태 관리
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (
    email: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  isAuthenticated: boolean;
}
```

### localStorage 유틸 함수 (lib/storage.ts)

```typescript
// 사용자 관리
- getUsers(): User[]
- createUser(user: Omit<User, 'id'>): User
- getUserByEmail(email: string): User | null

// 블로그 CRUD (권한 체크 포함)
- getBlogs(): Blog[]
- getBlog(id: string): Blog | null
- createBlog(blog: Omit<Blog, 'id'>, authorId: string): Blog
- updateBlog(id: string, updates: Partial<Blog>, userId: string): boolean
- deleteBlog(id: string, userId: string): boolean
- canEditBlog(blogId: string, userId: string): boolean

// 댓글 CRUD
- getComments(blogId: string): Comment[]
- createComment(comment: Omit<Comment, 'id'>, authorId: string): Comment
```

### 권한 확인 로직

```typescript
// 글 상세 페이지에서
const currentUser = getCurrentUser();
const isAuthor = currentUser?.id === blog.authorId;

// 수정/삭제 버튼 조건부 렌더링
{
  isAuthor && (
    <>
      <button>수정</button>
      <button>삭제</button>
    </>
  );
}
```

### 카드 UI (홈페이지)

- Grid layout (responsive: 1열 → 2열 → 3열)
- 각 카드에 표시: 제목, 내용 미리보기 (100자), 작성자명, 날짜
- 최신 글이 맨 위

### 상세 페이지

- 제목 (큰 텍스트)
- 작성자명 + 날짜 (작은 텍스트)
- 전체 내용 (줄바꿈 유지)
- 수정/삭제 버튼 (작성자만 표시)
- 댓글 섹션 (하단)
  - 로그인한 경우: 댓글 작성 폼
  - 비로그인: "댓글을 작성하려면 로그인하세요"

## 11. Development Plan

### Day 1: 인증 시스템 구축

- [ ] Next.js 프로젝트 세팅 (TypeScript + Tailwind)
- [ ] Custom auth skill 통합 (lib/auth.ts)
- [ ] AuthContext 구현 (전역 상태 관리)
- [ ] 회원가입/로그인 페이지 UI
- [ ] localStorage에 사용자 저장 및 세션 관리
- [ ] Header 컴포넌트 (로그인 상태 표시)

### Day 2: 블로그 CRUD (권한 포함)

- [ ] localStorage 유틸 함수 구현 (권한 체크 로직 포함)
- [ ] 홈페이지 - 블로그 목록 카드 UI (작성자명 표시)
- [ ] 새 글 작성 페이지 (로그인 확인)
- [ ] 글 상세 페이지 (모든 사용자 접근)

### Day 3: 수정/삭제 기능 (작성자 확인)

- [ ] 작성자 확인 로직 구현
- [ ] 글 수정 페이지 (작성자만 접근)
- [ ] 삭제 기능 (확인 다이얼로그, 작성자만)
- [ ] ProtectedRoute 컴포넌트 구현

### Day 4: 댓글 기능 (로그인 필요)

- [ ] 댓글 작성 폼 (로그인 확인)
- [ ] 댓글 목록 표시 (작성자명 포함)
- [ ] 댓글 데이터 localStorage 연동
- [ ] 비로그인 시 안내 메시지

### Day 5-6: 마무리 및 테스트

- [ ] 반응형 디자인 체크
- [ ] 권한 관련 버그 테스트
  - 다른 사용자의 글 수정/삭제 시도
  - 비로그인 상태에서 글 작성/댓글 시도
- [ ] 간단한 에러 핸들링 (빈 제목, 중복 이메일 등)
- [ ] Vercel 배포
- [ ] 여러 계정으로 실제 사용 테스트

## 12. Launch Readiness Check

배포 전 체크리스트:

- [ ] 회원가입 → 로그인 → 로그아웃 정상 작동
- [ ] 로그인한 상태에서만 글 작성 가능
- [ ] 홈에서 모든 블로그가 카드로 표시됨 (작성자명 포함)
- [ ] 새 글 작성 → 발행 → 홈에서 확인 가능
- [ ] 글 클릭 → 상세 페이지 표시 (비로그인도 가능)
- [ ] **본인 글만** 수정/삭제 버튼 표시
- [ ] 다른 사용자의 글에서는 수정/삭제 버튼 숨김
- [ ] 글 수정 → 변경사항 저장 확인 (작성자만)
- [ ] 글 삭제 → 목록에서 사라짐 확인 (작성자만)
- [ ] 로그인한 사용자만 댓글 작성 가능
- [ ] 댓글 작성 → 상세 페이지에 표시 확인 (작성자명 포함)
- [ ] 비로그인 시 댓글 작성 폼 대신 안내 메시지 표시
- [ ] 모바일 화면에서 UI 깨지지 않음
- [ ] 여러 계정으로 테스트 (A가 쓴 글을 B가 수정/삭제 시도 → 실패)

## 13. Known Limitations (명시적으로 인정)

이 MVP는 의도적으로 다음 제약사항을 가집니다:

**데이터 저장:**

- **데이터는 브라우저에만 저장**: 브라우저를 바꾸면 데이터 사라짐
- **공유 제한**: URL 공유해도 각 브라우저마다 다른 데이터를 가짐
- **동기화 없음**: 여러 기기에서 동일한 데이터 볼 수 없음

**인증 보안:**

- **비밀번호 평문 저장**: localStorage에 비밀번호가 평문으로 저장됨 (실제 프로덕션에서는 절대 안됨!)
- **세션 보안 없음**: 브라우저 localStorage에 접근 가능하면 인증 우회 가능
- **비밀번호 찾기 없음**: 비밀번호를 잊으면 복구 불가
- **이메일 인증 없음**: 가짜 이메일로도 가입 가능

**기능 제한:**

- **댓글 수정/삭제 불가**: 작성 후 수정 불가
- **프로필 페이지 없음**: 특정 사용자의 글만 모아보기 불가
- **알림 없음**: 내 글에 댓글이 달려도 알 수 없음

→ 이것은 "테스트용 블로그"이며 **custom auth skill을 테스트하는 목적**에 적합합니다.
→ 나중에 Supabase Auth로 업그레이드하면 보안 문제 해결 가능합니다.

## 14. Post-Launch Next Steps

사용자가 실제로 요청하면 추가할 기능들:

1. **백엔드 + 실제 인증**: Supabase Auth로 안전한 사용자 관리
2. **프로필 페이지**: 특정 사용자의 글 목록 보기
3. **마크다운 지원**: 더 나은 글 작성 경험
4. **실제 공유 기능**: URL로 다른 사람에게 글 공유 (백엔드 필요)
5. **댓글 수정/삭제**: 댓글 관리 기능
6. **비밀번호 재설정**: 이메일 인증 기반 비밀번호 찾기
7. **알림 시스템**: 내 글에 댓글이 달리면 알림

하지만 위 기능들은 **사용자가 명시적으로 요청하기 전까지는 절대 추가하지 않습니다.**

## 15. Success Criteria

이 MVP가 성공했다고 판단하는 기준:

- ✅ Custom auth skill로 회원가입/로그인이 정상 작동한다
- ✅ 로그인 후 5분 안에 첫 글을 작성하고 발행할 수 있다
- ✅ 작성한 글이 카드 형태로 예쁘게 표시되고, 작성자명이 보인다
- ✅ 본인이 작성한 글만 수정/삭제할 수 있다
- ✅ 다른 사용자가 작성한 글은 읽을 수 있지만 수정/삭제 버튼이 보이지 않는다
- ✅ 로그인한 사용자만 댓글을 달 수 있다
- ✅ 모바일에서도 잘 작동한다
- ✅ 버그 없이 기본 CRUD와 권한 관리가 모두 동작한다

---

**핵심 원칙: Custom auth skill을 테스트하고, 빠르게 만들고, 필요하면 확장하기**

이 블로그는 "완벽한 블로그"가 아닌 "Custom auth skill + localStorage를 테스트하는 블로그"입니다.
인증 기능의 보안 한계를 명확히 이해하고, 필요하면 나중에 Supabase Auth로 전환하면 됩니다.
