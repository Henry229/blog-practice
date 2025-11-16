# RootLayout

## 개요
**Phase**: Phase 2 - Root Layout & Providers
**파일 경로**: `app/layout.tsx`
**UI 참조**: N/A (루트 레이아웃)
**상태**: - [x] 완료 (Supabase 기반)

> **⚠️ 변경사항**: 이 컴포넌트는 **AuthProvider 없이** 구현되었습니다.
>
> **실제 구현**:
> - ✅ `app/layout.tsx` - 기본 HTML 구조, metadata, globals.css
> - ❌ AuthProvider 래핑 - **사용하지 않음**
> - ✅ Supabase Auth - `middleware.ts`에서 세션 관리
>
> **이유**: Supabase는 httpOnly 쿠키 + Middleware 방식으로 인증 상태를 관리하므로, React Context Provider가 필요하지 않습니다.

## 페이지/컴포넌트 정보

**목적**: 전체 애플리케이션의 루트 레이아웃, HTML 구조와 전역 Provider 설정
**타입**: Root Layout Component
**위치**: `app/layout.tsx` (Next.js App Router 루트)

---

## 요구사항

### 기능 요구사항
- [ ] HTML 기본 구조 제공 (`<html>`, `<body>`)
- [ ] Metadata 설정 (title, description)
- [ ] AuthProvider로 전체 앱 래핑
- [ ] Header 컴포넌트 포함 (모든 페이지에서 표시)
- [ ] Tailwind CSS 글로벌 스타일 import
- [ ] 폰트 설정 (Inter 또는 기본 sans-serif)

### 기술 요구사항
- [ ] Next.js 15 App Router 레이아웃 규칙 준수
- [ ] Metadata API 사용
- [ ] Server Component (기본)
- [ ] children prop으로 페이지 렌더링

### 접근성 요구사항
- [ ] `lang="ko"` 속성 (한국어 웹사이트)
- [ ] 시맨틱 HTML 구조

---

## 의존성

### Next.js
```typescript
import type { Metadata } from "next"
```

### 글로벌 스타일
```typescript
import "./globals.css"
```

### 내부 의존성
- AuthProvider: `@/components/providers/AuthProvider`
- Header: `@/components/layout/Header`

### 폰트 (선택사항)
```typescript
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
```

---

## 기본 구조

```typescript
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { Header } from "@/components/layout/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SimpleBlog",
  description: "A simple blog built with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## 구현 세부사항

### Metadata 설정
```typescript
export const metadata: Metadata = {
  title: "SimpleBlog",
  description: "A simple blog built with Next.js and Supabase",
}
```
- Next.js 15 Metadata API 사용
- SEO 최적화 (title, description)

### 폰트 설정
```typescript
const inter = Inter({ subsets: ["latin"] })

<body className={inter.className}>
```
- Google Fonts에서 Inter 폰트 사용
- `subsets: ["latin"]`로 라틴 문자만 로드 (최적화)

### Provider 구조
```typescript
<AuthProvider>
  <Header />
  {children}
</AuthProvider>
```
- AuthProvider가 Header와 children을 래핑
- Header는 모든 페이지에서 표시
- children은 각 페이지의 컨텐츠

### HTML 구조
```typescript
<html lang="ko">
  <body className={inter.className}>
    {/* Providers and content */}
  </body>
</html>
```
- `lang="ko"`: 한국어 웹사이트 명시
- `className={inter.className}`: Inter 폰트 적용

---

## 구현 단계

1. [ ] Open existing `app/layout.tsx` file
2. [ ] Import Metadata type from Next.js
3. [ ] Import Inter font from next/font/google
4. [ ] Import globals.css
5. [ ] Import AuthProvider component
6. [ ] Import Header component
7. [ ] Create Inter font instance
8. [ ] Export metadata object (title, description)
9. [ ] Implement RootLayout function
10. [ ] Add html element with lang="ko"
11. [ ] Add body element with Inter font className
12. [ ] Wrap content with AuthProvider
13. [ ] Add Header component inside AuthProvider
14. [ ] Render children below Header
15. [ ] Test layout on multiple pages
16. [ ] Verify Header appears on all pages
17. [ ] Verify AuthProvider works (useAuth accessible)

---

## 완료 조건

### Functionality
- [ ] RootLayout renders on all pages
- [ ] Metadata appears in browser tab and SEO
- [ ] AuthProvider wraps entire app
- [ ] Header displays on all pages
- [ ] children (page content) renders correctly
- [ ] Global styles apply (Tailwind CSS)

### UI/UX
- [ ] Inter font loads and applies
- [ ] Header fixed at top
- [ ] Page content appears below Header
- [ ] No layout shift or flicker
- [ ] Smooth page transitions

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Proper use of Server Component (no "use client")
- [ ] Clean and organized structure

### Integration
- [ ] AuthProvider accessible via useAuth in child components
- [ ] Header integrates with AuthProvider
- [ ] All pages inherit this layout
- [ ] Global styles apply to all pages

---

## 테스트 체크리스트

- [ ] Metadata test (check browser tab title)
- [ ] Font test (Inter font applies to text)
- [ ] Header test (appears on all pages)
- [ ] AuthProvider test (useAuth works in components)
- [ ] Page navigation test (layout persists across pages)
- [ ] Global styles test (Tailwind classes work)
- [ ] Responsive test (layout works on mobile, desktop)
- [ ] No layout shift test (Header doesn't cause layout shift)

---

## 폴더 구조

```
app/
├── layout.tsx          # ← This file (RootLayout)
├── globals.css         # Tailwind CSS globals
├── page.tsx            # Homepage
├── blog/
│   ├── [id]/
│   │   ├── page.tsx    # Blog detail
│   │   └── edit/
│   │       └── page.tsx  # Blog edit
│   └── new/
│       └── page.tsx    # New blog post
└── auth/
    ├── login/
    │   └── page.tsx    # Login page
    └── signup/
        └── page.tsx    # Signup page
```

---

## 참고사항

- RootLayout은 Server Component (기본)
- AuthProvider는 Client Component이지만 RootLayout에서 사용 가능
- Header는 Client Component (useAuth 사용)
- Next.js는 Server/Client Component를 자동으로 처리
- 모든 페이지는 이 RootLayout을 상속받음
- globals.css에 Tailwind CSS directives 포함:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Inter 폰트 대신 시스템 폰트 사용 가능 (className 제거)
- Metadata는 각 페이지에서 override 가능
- Header 아래 페이지 컨텐츠에 `pt-16` 패딩 필요 (PageContainer에서 처리)
