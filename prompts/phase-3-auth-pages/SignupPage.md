# SignupPage

## 개요
**Phase**: Phase 3 - 인증 페이지
**파일 경로**: `app/auth/signup/page.tsx`
**UI 참조**: 컴포넌트 계획 참조 (PDF에는 미포함)
**상태**: - [x] 완료 (Supabase Server Actions 사용)

## 페이지/컴포넌트 정보

**목적**: 사용자 회원가입 페이지, 이메일, 사용자명, 비밀번호로 계정 생성
**타입**: Page Component
**위치**: `/auth/signup` 라우트

---

## 요구사항

### 기능 요구사항
- [ ] 이메일, 사용자명, 비밀번호, 비밀번호 확인 입력 폼
- [ ] 회원가입 버튼 클릭 시 Supabase Auth 호출
- [ ] 회원가입 성공 시 로그인 페이지로 리디렉션
- [ ] 회원가입 실패 시 에러 메시지 표시
- [ ] 로그인 페이지로 이동하는 링크
- [ ] 비밀번호 일치 확인

### UI 요구사항
- [ ] 중앙 정렬 카드 레이아웃
- [ ] "Sign Up" 제목
- [ ] 이메일 입력 필드 (type="email", placeholder="Email")
- [ ] 사용자명 입력 필드 (type="text", placeholder="Username")
- [ ] 비밀번호 입력 필드 (type="password", placeholder="Password")
- [ ] 비밀번호 확인 입력 필드 (type="password", placeholder="Confirm Password")
- [ ] "Sign Up" 버튼 (파란색, 전체 너비)
- [ ] "Already have an account? Login" 링크
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
- Server Action: `signup` from `@/app/actions/auth`
- Layout: `PageContainer`, `CenteredContainer` from `@/components/layout`

---

## 기본 구조

```typescript
import { PageContainer } from "@/components/layout/PageContainer"
import { CenteredContainer } from "@/components/layout/CenteredContainer"
import { SignupForm } from "@/components/auth/SignupForm"
import Link from "next/link"

export default function SignupPage() {
  return (
    <PageContainer>
      <CenteredContainer>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-gray-600 mt-2">
              Create your SimpleBlog account
            </p>
          </div>

          <SignupForm />

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
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
    <h1>Sign Up</h1>     // 제목
    <SignupForm />       // 회원가입 폼 (별도 컴포넌트)
    <Link>Login</Link>   // 로그인 링크
  </CenteredContainer>
</PageContainer>
```

### SignupForm 컴포넌트 (별도 파일)
- 폼 상태 관리 (useState)
- 유효성 검사 (이메일, 비밀번호, 비밀번호 확인)
- Server Action 호출 (signup)
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
2. [ ] Create SignupPage file (`app/auth/signup/page.tsx`)
3. [ ] Import PageContainer, CenteredContainer
4. [ ] Create page title and subtitle
5. [ ] Create SignupForm component (separate file)
6. [ ] Add login link at bottom
7. [ ] Test page rendering
8. [ ] Test form submission (after SignupForm implementation)
9. [ ] Test navigation (to login page)
10. [ ] Test responsive design

---

## 완료 조건

### Functionality
- [ ] SignupPage renders at `/auth/signup`
- [ ] SignupForm displays correctly
- [ ] Signup button triggers registration
- [ ] Successful signup redirects to login page
- [ ] Failed signup shows error message
- [ ] Login link navigates to `/auth/login`

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
- [ ] SignupForm works with Supabase Auth
- [ ] Navigation links work correctly

---

## 테스트 체크리스트

- [ ] Page load test (renders at `/auth/signup`)
- [ ] Form display test (all fields visible)
- [ ] Signup functionality test (after SignupForm implementation)
- [ ] Login link test (navigates to `/auth/login`)
- [ ] Responsive test (mobile, desktop)
- [ ] Accessibility test (keyboard navigation, screen reader)

---

## 참고사항

- SignupPage는 Server Component (기본)
- SignupForm은 Client Component (상태 관리 필요)
- Supabase Auth 통합은 Server Action (app/actions/auth.ts)에서 처리
- 회원가입 성공 시 로그인 페이지로 리디렉션 (자동 로그인은 선택사항)
- 에러 메시지는 SignupForm에서 표시
- 이메일 중복 체크는 Supabase에서 자동 처리
- 비밀번호 강도 검사는 선택사항 (추후 추가 가능)
