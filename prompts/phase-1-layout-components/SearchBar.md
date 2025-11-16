# SearchBar

## 개요
**Phase**: Phase 1 - 레이아웃 컴포넌트
**파일 경로**: `components/layout/SearchBar.tsx`
**UI 참조**: `blog-practice.pdf` - Page 1 (Homepage Header)
**상태**: - [ ] 미완료

## 페이지/컴포넌트 정보

**목적**: 블로그 글을 검색할 수 있는 입력 필드, Header 중앙에 위치
**타입**: Feature Component
**위치**: Header 컴포넌트 내 중앙

---

## 요구사항

### 기능 요구사항
- [ ] 검색어 입력 기능
- [ ] Enter 키 또는 검색 아이콘 클릭 시 검색 실행
- [ ] 검색어 상태 관리 (useState)
- [ ] 홈페이지로 검색 쿼리 전달 (URL query parameter)
- [ ] 입력 필드 포커스 시 테두리 색상 변경

### UI 요구사항 (blog-practice.pdf - Page 1)
- [ ] 둥근 디자인 (rounded-full)
- [ ] "Search posts..." placeholder 텍스트
- [ ] 검색 아이콘 (왼쪽 또는 오른쪽)
- [ ] 회색 배경 (#F3F4F6 또는 gray-100)
- [ ] 포커스 시 파란색 테두리 (focus:ring-2 focus:ring-blue-500)
- [ ] 최대 너비: 500px (desktop)
- [ ] 높이: 40px
- [ ] 패딩: 좌우 16px

### 접근성 요구사항
- [ ] `aria-label="블로그 글 검색"`
- [ ] `type="search"` 속성
- [ ] 키보드 탐색 지원 (Tab, Enter)

---

## 의존성

### shadcn/ui 컴포넌트
```bash
npx shadcn@latest add input
```

### npm 패키지
```bash
npm install lucide-react
```

### 내부 의존성
- Next.js useRouter: `next/navigation`
- React useState: `react`

---

## 기본 구조

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500"
          aria-label="블로그 글 검색"
        />
      </div>
    </form>
  )
}
```

---

## 구현 세부사항

### 상태 관리
```typescript
const [query, setQuery] = useState<string>("")
```
- `query`: 현재 입력된 검색어

### 검색 로직
```typescript
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault() // 폼 기본 동작 방지
  if (query.trim()) {
    // 검색어가 비어있지 않으면
    router.push(`/?search=${encodeURIComponent(query)}`)
  }
}
```
- 홈페이지로 이동하며 `search` query parameter 전달
- `encodeURIComponent`로 특수문자 인코딩

### 반응형 디자인
- **모바일 (<768px)**:
  - SearchBar 숨김 또는 최소 너비 (선택사항)
  - 햄버거 메뉴 클릭 시 검색 모달 표시 (선택사항)
- **태블릿 (768px-1024px)**:
  - 중간 너비 (max-w-xs)
- **데스크톱 (>1024px)**:
  - 최대 너비 (max-w-md, 약 500px)

### 스타일링
```typescript
// Tailwind CSS 클래스
- Form: "flex-1 max-w-md"
- Container: "relative"
- Icon: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
- Input: "pl-10 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500"
```

### 검색 아이콘 위치
- 왼쪽에 배치 (absolute positioning)
- Input에 `pl-10` (padding-left: 40px) 추가하여 텍스트가 아이콘 위에 겹치지 않도록

---

## 구현 단계

1. [ ] Install shadcn/ui Input component
2. [ ] Install lucide-react for Search icon
3. [ ] Create SearchBar component file (`components/layout/SearchBar.tsx`)
4. [ ] Import useState, useRouter, Search icon, Input
5. [ ] Define query state with useState
6. [ ] Implement handleSearch function
7. [ ] Create form element with onSubmit handler
8. [ ] Add Search icon (absolute positioning, left side)
9. [ ] Add Input component with proper styling
10. [ ] Apply rounded-full, gray background, focus ring
11. [ ] Test search functionality (Enter key)
12. [ ] Test URL query parameter passing
13. [ ] Test responsive design (mobile, tablet, desktop)
14. [ ] Test accessibility (keyboard navigation)

---

## 완료 조건

### Functionality
- [ ] SearchBar renders in Header
- [ ] User can type search query
- [ ] Enter key triggers search
- [ ] Search navigates to homepage with query parameter
- [ ] Query parameter format: `/?search=keyword`

### UI/UX
- [ ] Matches design mockup (blog-practice.pdf - Page 1)
- [ ] Rounded design (rounded-full)
- [ ] Gray background (#F3F4F6)
- [ ] Search icon on left side
- [ ] "Search posts..." placeholder
- [ ] Blue focus ring on input focus
- [ ] Responsive on all breakpoints

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Follows Next.js 15 App Router conventions
- [ ] Proper use of Client Component ("use client")
- [ ] Clean and readable code structure

### Integration
- [ ] Integrates with Header component
- [ ] Search query passed to homepage
- [ ] Homepage can receive and use search query (Phase 4 integration)

---

## 테스트 체크리스트

- [ ] Visual regression test (compare to design)
- [ ] Input typing test
- [ ] Enter key search test
- [ ] URL query parameter test (check browser URL after search)
- [ ] Empty search handling (no navigation if empty)
- [ ] Special characters encoding test (e.g., "React & TypeScript")
- [ ] Responsive test (mobile, tablet, desktop)
- [ ] Accessibility test (keyboard navigation, screen reader)
- [ ] Focus state test (blue ring appears on focus)

---

## 참고사항

- SearchBar는 "use client" 컴포넌트 (useState, useRouter 사용)
- Phase 4 (블로그 목록 페이지)에서 검색 쿼리 파라미터를 읽어 필터링 구현 예정
- 현재는 검색어를 URL에 전달하는 기능만 구현
- 추후 검색 자동완성 기능 추가 가능 (Phase 8 이후)
- 모바일에서는 SearchBar를 숨기고 검색 버튼 클릭 시 모달로 표시하는 방식도 고려 가능
