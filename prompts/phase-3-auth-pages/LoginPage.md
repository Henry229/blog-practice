# LoginPage

## 개요
**Phase**: Phase 3 - 인증 페이지
**파일 경로**: `app/auth/login/page.tsx`
**UI 참조**: 컴포넌트 계획 참조 (PDF에는 미포함)
**상태**: - [x] 완료 (Supabase Server Actions 사용)

## 페이지/컴포넌트 정보

**목적**: 사용자 로그인 페이지, 이메일과 비밀번호로 인증
**타입**: Page Component
**위치**: `/auth/login` 라우트

---

## 요구사항

### 기능 요구사항
- [ ] 이메일과 비밀번호 입력 폼
- [ ] 로그인 버튼 클릭 시 Supabase Auth 호출
- [ ] 로그인 성공 시 홈페이지로 리디렉션
- [ ] 로그인 실패 시 에러 메시지 표시
- [ ] 회원가입 페이지로 이동하는 링크
- [ ] "Forgot Password?" 링크 (선택사항)

### UI 요구사항
- [ ] 중앙 정렬 카드 레이아웃
- [ ] "Login" 제목
- [ ] 이메일 입력 필드 (type="email", placeholder="Email")
- [ ] 비밀번호 입력 필드 (type="password", placeholder="Password")
- [ ] "Login" 버튼 (파란색, 전체 너비)
- [ ] "Don't have an account? Sign up" 링크
- [ ] 에러 메시지 표시 영역

### 접근성 요구사항
- [ ] 폼 레이블 명확성
- [ ] 에러 메시지 스크린 리더 지원
- [ ] 키보드 탐색 지원

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add button input label card
```

### 내부 의존성
- Server Action: `login` from `@/app/actions/auth`
- Layout: `PageContainer`, `CenteredContainer` from `@/components/layout`
- Type: Supabase User type

---

## 기본 구조

```typescript
import { PageContainer } from "@/components/layout/PageContainer"
import { CenteredContainer } from "@/components/layout/CenteredContainer"
import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <PageContainer>
      <CenteredContainer>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-600 mt-2">
              Welcome back to SimpleBlog
            </p>
          </div>

          <LoginForm />

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </CenteredContainer>
    </PageContainer>
  )
}
```

---

## 구현 세부사항

### 페이지 구조
```typescript
<PageContainer>          // 전체 페이지 레이아웃
  <CenteredContainer>    // 중앙 정렬 카드
    <h1>Login</h1>       // 제목
    <LoginForm />        // 로그인 폼 (별도 컴포넌트)
    <Link>Sign up</Link> // 회원가입 링크
  </CenteredContainer>
</PageContainer>
```

### LoginForm 컴포넌트 (별도 파일)
- 폼 상태 관리 (useState)
- 유효성 검사 (이메일, 비밀번호)
- Server Action 호출 (login)
- 에러 메시지 표시

### 스타일링
```typescript
// Tailwind CSS 클래스
- Container: "space-y-6" (수직 간격 24px)
- Title: "text-3xl font-bold" (제목 크기 및 굵기)
- Subtitle: "text-gray-600 mt-2" (설명 텍스트)
- Link: "text-blue-600 hover:underline font-medium" (링크 스타일)
```

---

## 구현 단계

1. [ ] Install shadcn/ui components (button, input, label, card)
2. [ ] Create LoginPage file (`app/auth/login/page.tsx`)
3. [ ] Import PageContainer, CenteredContainer
4. [ ] Create page title and subtitle
5. [ ] Create LoginForm component (separate file)
6. [ ] Add signup link at bottom
7. [ ] Test page rendering
8. [ ] Test form submission (after LoginForm implementation)
9. [ ] Test navigation (to signup page)
10. [ ] Test responsive design

---

## 완료 조건

### Functionality
- [ ] LoginPage renders at `/auth/login`
- [ ] LoginForm displays correctly
- [ ] Login button triggers authentication
- [ ] Successful login redirects to homepage
- [ ] Failed login shows error message
- [ ] Signup link navigates to `/auth/signup`

### UI/UX
- [ ] Centered card layout
- [ ] Clear title and description
- [ ] Form fields are accessible
- [ ] Error messages are visible and clear
- [ ] Responsive on mobile and desktop

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Server Component (page itself)
- [ ] Clean code structure

### Integration
- [ ] Integrates with PageContainer and CenteredContainer
- [ ] LoginForm works with Supabase Auth
- [ ] Navigation links work correctly

---

## 테스트 체크리스트

- [ ] Page load test (renders at `/auth/login`)
- [ ] Form display test (all fields visible)
- [ ] Login functionality test (after LoginForm implementation)
- [ ] Signup link test (navigates to `/auth/signup`)
- [ ] Responsive test (mobile, desktop)
- [ ] Accessibility test (keyboard navigation, screen reader)

---

## 참고사항

- LoginPage는 Server Component (기본)
- LoginForm은 Client Component (상태 관리 필요)
- Supabase Auth 통합은 Server Action (app/actions/auth.ts)에서 처리
- 로그인 성공 시 middleware가 자동으로 세션 관리
- 에러 메시지는 LoginForm에서 표시
- "Forgot Password?" 기능은 Phase 3에서는 선택사항, 추후 추가 가능
