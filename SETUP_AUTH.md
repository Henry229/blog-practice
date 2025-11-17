# Next.js Supabase 인증 설정 가이드

Next.js + Supabase 인증 시스템이 성공적으로 설치되었습니다! 🎉

## 설치된 파일 목록

```
✅ 설정 파일
├── lib/env.ts                      # 환경 변수 검증
├── lib/auth.config.ts              # 인증 설정
├── .env.local.example              # 환경 변수 템플릿

✅ Supabase 클라이언트
├── lib/supabase/client.ts          # 브라우저 클라이언트
├── lib/supabase/server.ts          # 서버 클라이언트
└── lib/supabase/middleware.ts      # 미들웨어 헬퍼

✅ UI 컴포넌트
├── components/auth/LoginForm.tsx
├── components/auth/SignupForm.tsx
├── components/auth/ForgotPasswordForm.tsx
├── components/auth/ResetPasswordForm.tsx
└── components/auth/GoogleLoginButton.tsx

✅ 인증 페이지
├── app/auth/login/page.tsx
├── app/auth/signup/page.tsx
├── app/auth/forgot-password/page.tsx
├── app/auth/reset-password/page.tsx
├── app/auth/verify-email/page.tsx
└── app/auth/callback/route.ts

✅ 서버 액션 및 미들웨어
├── app/actions/auth.ts             # 서버 액션
└── middleware.ts                   # Next.js 미들웨어

✅ 데이터베이스 마이그레이션
├── supabase/migrations/20250111000001_create_profiles_table.sql
└── supabase/migrations/20250111000002_fix_function_search_path.sql
```

---

## 필수 설정 단계

### 1️⃣ Supabase 프로젝트 생성

1. [Supabase](https://app.supabase.com) 접속
2. 새 프로젝트 생성
3. 프로젝트 설정 → API 메뉴에서 다음 정보 확인:
   - Project URL
   - anon/public key

### 2️⃣ 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local` 파일 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 실제 값으로 수정:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3️⃣ 데이터베이스 마이그레이션 실행

Supabase 대시보드에서:

1. **SQL Editor** 메뉴로 이동
2. `supabase/migrations/20250111000001_create_profiles_table.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기 후 **Run** 클릭
4. `supabase/migrations/20250111000002_fix_function_search_path.sql` 파일도 동일하게 실행

또는 Supabase CLI 사용:

```bash
# Supabase CLI 설치 (없는 경우)
npm install -g supabase

# 프로젝트 초기화
supabase init

# 마이그레이션 실행
supabase db push
```

### 4️⃣ 이메일 템플릿 설정 (선택사항)

Supabase 대시보드 → Authentication → Email Templates에서:

- **Confirm signup** (회원가입 확인)
- **Reset password** (비밀번호 재설정)
- **Magic Link** (매직 링크 로그인)

템플릿 수정 후 URL을 다음과 같이 설정:

- Confirmation: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email`
- Password Reset: `{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery`

### 5️⃣ Google OAuth 설정 (선택사항)

Google OAuth를 사용하려면:

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 추가:

   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

4. Supabase 대시보드 → Authentication → Providers → Google 활성화
5. Client ID와 Client Secret 입력

---

## 인증 설정 커스터마이징

### 리디렉션 경로 변경

`lib/auth.config.ts` 파일에서 수정:

```typescript
export const authConfig = {
  redirects: {
    afterLogin: '/', // 로그인 후 이동할 경로
    afterSignup: '/auth/verify-email',
    afterLogout: '/auth/login',
    afterPasswordReset: '/auth/login',
    afterEmailVerification: '/',
  },
  // ...
};
```

### 보호된 라우트 설정

인증이 필요한 페이지 추가:

```typescript
export const authConfig = {
  // ...
  protectedRoutes: [
    '/',
    '/profile',
    '/settings',
    '/admin', // 새로 추가
  ],
  // ...
};
```

### 프로필 필드 수정

`app/actions/auth.ts`의 `signup` 함수에서 프로필 필드 수정:

```typescript
const { error: profileError } = await supabase.from('profiles').insert({
  user_id: authData.user.id,
  email: email,
  first_name: firstName,
  last_name: lastName,
  mobile: mobile || null,
  role: authConfig.profile.defaultRole,
  // 추가 필드를 여기에 넣으세요
  company: formData.get('company') as string,
});
```

데이터베이스 스키마도 함께 수정해야 합니다.

---

## 사용 예시

### 보호된 페이지 만들기

#### dashboard 페이지가 없어서 root page로 이동하는것으로 바꿈

`app/page.tsx`:

```typescript
import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/app/actions/auth';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const profile = await getUserProfile();

  return (
    <div>
      <h1>환영합니다, {profile?.first_name}님!</h1>
      <p>이메일: {user.email}</p>
    </div>
  );
}
```

### 로그아웃 버튼 추가

```typescript
'use client';

import { signOut } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  return <Button onClick={() => signOut()}>로그아웃</Button>;
}
```

### 클라이언트에서 사용자 정보 가져오기

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function UserInfo() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  if (!user) return <div>로딩 중...</div>;

  return <div>안녕하세요, {user.email}!</div>;
}
```

---

## 보안 기능

✅ **PKCE Flow**: OAuth 인증 시 보안 강화
✅ **Row Level Security (RLS)**: 데이터베이스 레벨 권한 관리
✅ **SQL Injection 방지**: search_path 설정으로 보안 강화
✅ **토큰 검증**: 자동 토큰 갱신 및 검증
✅ **환경 변수 검증**: 시작 시 필수 변수 확인

---

## 테스트

개발 서버 실행:

```bash
npm run dev
```

다음 페이지에서 테스트:

- 회원가입: http://localhost:3000/auth/signup
- 로그인: http://localhost:3000/auth/login
- 비밀번호 찾기: http://localhost:3000/auth/forgot-password

---

## 문제 해결

### 환경 변수 오류

```
Missing required environment variables
```

→ `.env.local` 파일이 올바르게 설정되었는지 확인

### 데이터베이스 오류

```
relation "public.profiles" does not exist
```

→ 마이그레이션이 실행되었는지 확인

### OAuth 리디렉션 오류

```
auth_callback_error
```

→ Google Cloud Console과 Supabase의 리디렉션 URI 설정 확인

### 이메일이 전송되지 않음

→ Supabase 대시보드 → Settings → Auth → SMTP 설정 확인

---

## 다음 단계

1. **프로필 페이지 만들기**: 사용자가 정보를 수정할 수 있는 페이지
2. **권한 관리**: role 기반 접근 제어 구현
3. **소셜 로그인 추가**: GitHub, Facebook 등
4. **2단계 인증**: TOTP 기반 2FA 구현
5. **이메일 템플릿 커스터마이징**: 브랜드에 맞는 디자인

---

## 추가 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Next.js 문서](https://nextjs.org/docs)
- [shadcn/ui 문서](https://ui.shadcn.com)

문제가 있으면 이슈를 제출하거나 문서를 참조하세요! 🚀
