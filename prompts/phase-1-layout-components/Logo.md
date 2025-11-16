# Logo

## 개요
**Phase**: Phase 1 - 레이아웃 컴포넌트
**파일 경로**: `components/layout/Logo.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage Header)
**상태**: - [ ] 미완료

## 페이지/컴포넌트 정보

**목적**: "SimpleBlog" 브랜딩을 표시하고 홈페이지로 이동하는 클릭 가능한 로고
**타입**: UI Component
**위치**: Header 컴포넌트 내 왼쪽 상단

---

## 요구사항

### 기능 요구사항
- [ ] 클릭 시 홈페이지('/') 이동
- [ ] Next.js Link 컴포넌트 사용
- [ ] 호버 효과 (opacity 변화)
- [ ] 접근성 지원 (aria-label)

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] "SimpleBlog" 텍스트 표시
- [ ] 파란색 문서 아이콘 (📋 또는 SVG)
- [ ] 아이콘 + 텍스트 horizontal layout
- [ ] 폰트: 굵은 글씨 (font-bold), 18px (text-lg)
- [ ] 색상: 파란색 (#2563EB 또는 blue-600)
- [ ] 간격: 아이콘과 텍스트 사이 8px (gap-2)
- [ ] 호버 시: opacity 80%

### 접근성 요구사항
- [ ] `aria-label="SimpleBlog 홈으로 이동"`
- [ ] 키보드 탐색 지원 (Tab 키로 포커스)
- [ ] 포커스 시 outline 표시

---

## 의존성

### Next.js 컴포넌트
```typescript
import Link from "next/link"
```

### 내부 의존성
- 없음 (독립적인 컴포넌트)

---

## 기본 구조

```typescript
import Link from "next/link"
import { FileText } from "lucide-react" // 또는 다른 아이콘 라이브러리

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-blue-600 hover:opacity-80 transition-opacity"
      aria-label="SimpleBlog 홈으로 이동"
    >
      <FileText className="w-6 h-6" />
      <span className="text-lg font-bold">SimpleBlog</span>
    </Link>
  )
}
```

---

## 구현 세부사항

### 아이콘 선택
**Option 1: Lucide Icons** (권장)
```bash
npm install lucide-react
```
```typescript
import { FileText } from "lucide-react"
<FileText className="w-6 h-6" />
```

**Option 2: Unicode Emoji**
```typescript
<span className="text-2xl">📋</span>
```

**Option 3: Custom SVG**
```typescript
<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
  {/* SVG path */}
</svg>
```

### 스타일링
```typescript
// Tailwind CSS 클래스
- Container: "flex items-center gap-2 text-blue-600 hover:opacity-80 transition-opacity"
- Icon: "w-6 h-6"
- Text: "text-lg font-bold"
```

### 반응형 디자인
- 모바일: 로고 크기 유지 (항상 표시)
- 태블릿/데스크톱: 동일한 크기

---

## 구현 단계

1. [ ] Install lucide-react (if using Lucide icons)
2. [ ] Create Logo component file (`components/layout/Logo.tsx`)
3. [ ] Import Next.js Link component
4. [ ] Import icon (FileText from lucide-react)
5. [ ] Implement Link wrapper with href="/"
6. [ ] Add icon and "SimpleBlog" text
7. [ ] Apply Tailwind CSS styling
8. [ ] Add hover effect (opacity transition)
9. [ ] Add accessibility attributes (aria-label)
10. [ ] Test click navigation to homepage
11. [ ] Test hover effect
12. [ ] Test keyboard navigation (Tab, Enter)

---

## 완료 조건

### Functionality
- [ ] Logo renders correctly in Header
- [ ] Click navigates to homepage ('/')
- [ ] Hover effect works smoothly
- [ ] Keyboard navigation (Tab, Enter) works

### UI/UX
- [ ] Matches design mockup (blog-practice.pdf - Page 1)
- [ ] Icon and text aligned horizontally
- [ ] Proper spacing between icon and text
- [ ] Blue color (#2563EB or blue-600)
- [ ] Smooth opacity transition on hover

### Code Quality
- [ ] TypeScript types are correct (no props needed)
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Clean and simple code structure

### Integration
- [ ] Integrates with Header component
- [ ] No layout shift or flicker
- [ ] Works across all pages

---

## 테스트 체크리스트

- [ ] Visual regression test (compare to design)
- [ ] Click navigation test (homepage redirect)
- [ ] Hover effect test (opacity change)
- [ ] Keyboard navigation test (Tab to focus, Enter to click)
- [ ] Accessibility test (screen reader announces "SimpleBlog 홈으로 이동")
- [ ] Cross-browser test (Chrome, Firefox, Safari)

---

## 참고사항

- Logo는 Server Component로 구현 가능 (상태 관리 불필요)
- Next.js Link 컴포넌트는 클라이언트 사이드 네비게이션 제공 (빠른 페이지 전환)
- 아이콘은 Lucide React 사용 권장 (일관된 아이콘 스타일)
- 간단한 컴포넌트이므로 테스트가 쉬움
