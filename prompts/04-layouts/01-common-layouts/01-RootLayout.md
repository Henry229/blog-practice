# RootLayout 구현 계획

## 개요
전체 애플리케이션의 루트 레이아웃으로, AuthProvider를 포함하고 모든 페이지의 공통 구조를 정의합니다.

## 파일 경로
- `app/layout.tsx`

## 의존성
- Next.js App Router layout
- AuthProvider (추후 구현)
- Tailwind CSS v4
- Metadata API

## 구현 상세

### 1. 기본 구조
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { AuthProvider } from '@/components/auth/AuthProvider'; // Phase 1에서 구현

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SimpleBlog',
  description: 'A simple blog application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.className}>
      <body>
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
```

### 2. 핵심 기능

#### Metadata 설정
- **title**: "SimpleBlog"
- **description**: 블로그 설명
- **viewport**: 반응형 설정
- **추후 확장**: OG 태그, favicon 등

#### Font 최적화
- **Google Font**: Inter 사용
- **Subsets**: ['latin'] - 한글 필요시 확장
- **자동 최적화**: Next.js Font Optimization

#### AuthProvider 통합
- **Phase 1**: 주석 처리 (UI 먼저 구현)
- **Phase 2**: AuthProvider 활성화
- **기능**: 전역 인증 상태 관리

### 3. 스타일링
- **Tailwind CSS**: `globals.css`에서 전역 스타일 정의
- **배경색**: 기본 흰색 또는 light gray
- **폰트**: Inter 폰트 적용

### 4. 접근성
- **lang 속성**: "ko" (한국어)
- **Semantic HTML**: html, body 태그 사용

### 5. 구현 순서
1. ✅ 기본 layout 구조 생성 (title, description)
2. ✅ Inter 폰트 설정
3. ✅ globals.css 연결
4. ⏳ AuthProvider 주석 처리로 준비 (Phase 2에서 활성화)

### 6. 테스트 체크리스트
- [ ] 페이지가 정상적으로 렌더링되는가?
- [ ] 폰트가 올바르게 적용되는가?
- [ ] 메타데이터가 표시되는가? (브라우저 탭)
- [ ] 다크 모드 대비 기본 스타일이 적용되는가?

### 7. 추후 확장 사항
- **Dark Mode**: theme provider 추가
- **SEO**: Open Graph 태그, Twitter Card
- **Analytics**: Google Analytics, Vercel Analytics
- **Toast Provider**: 전역 알림 시스템
