# Phase 0.1 - shadcn/ui 기본 컴포넌트 설치

## 개요
**Phase**: Phase 0 - 공통 기반
**목적**: 프로젝트 전반에서 사용할 shadcn/ui 컴포넌트 설치 및 설정
**상태**: ✅ 완료

## 필요한 shadcn/ui 컴포넌트

SimpleBlog MVP에서 사용되는 모든 shadcn/ui 컴포넌트:

### 기본 UI 컴포넌트
- **Button** - 모든 버튼 (primary, secondary, danger variants)
- **Input** - 텍스트 입력 필드 (검색, 로그인, 회원가입)
- **Textarea** - 다중 행 텍스트 입력 (댓글, 블로그 내용)
- **Label** - 폼 레이블
- **Card** - 카드 컨테이너 (블로그 카드, 폼 카드)
- **Avatar** - 사용자 아바타 (이니셜 표시 지원)
- **Badge** - 배지, 숫자 표시
- **Separator** - 구분선 (Divider)

### 추가 컴포넌트 (선택사항)
- **Dialog** - 삭제 확인 다이얼로그 (선택사항, confirm() 사용 가능)
- **Dropdown Menu** - UserMenu 드롭다운 (선택사항)
- **Toast** - 알림 메시지 (선택사항, Phase 8 이후)

---

## 설치 방법

### 1. shadcn/ui 초기 설정 (이미 완료된 경우 스킵)

```bash
# shadcn/ui 초기화 (이미 완료되었을 가능성 높음)
npx shadcn@latest init
```

**설정 옵션** (Next.js 15 + Tailwind CSS v4 기준):
```
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Would you like to use CSS variables for colors? › yes
```

---

### 2. 필수 컴포넌트 일괄 설치

```bash
# 모든 필수 컴포넌트 한 번에 설치
npx shadcn@latest add button input textarea label card avatar badge separator
```

**개별 설치** (필요한 경우):
```bash
# Button
npx shadcn@latest add button

# Input
npx shadcn@latest add input

# Textarea
npx shadcn@latest add textarea

# Label
npx shadcn@latest add label

# Card
npx shadcn@latest add card

# Avatar
npx shadcn@latest add avatar

# Badge
npx shadcn@latest add badge

# Separator
npx shadcn@latest add separator
```

---

### 3. 선택적 컴포넌트 설치 (필요 시)

```bash
# Dialog (삭제 확인 다이얼로그용)
npx shadcn@latest add dialog

# Dropdown Menu (UserMenu용)
npx shadcn@latest add dropdown-menu

# Toast (알림 메시지용, Phase 8 이후)
npx shadcn@latest add toast
```

---

## 설치 확인

설치 후 다음 파일들이 생성되었는지 확인:

```
components/ui/
├── button.tsx          ✅ Button 컴포넌트
├── input.tsx           ✅ Input 컴포넌트
├── textarea.tsx        ✅ Textarea 컴포넌트
├── label.tsx           ✅ Label 컴포넌트
├── card.tsx            ✅ Card 컴포넌트
├── avatar.tsx          ✅ Avatar 컴포넌트
├── badge.tsx           ✅ Badge 컴포넌트
├── separator.tsx       ✅ Separator 컴포넌트
├── dialog.tsx          ⚪ Dialog 컴포넌트 (선택사항)
├── dropdown-menu.tsx   ⚪ Dropdown Menu (선택사항)
└── toast.tsx           ⚪ Toast (선택사항)
```

---

## 컴포넌트 사용 예시

### Button
```typescript
import { Button } from "@/components/ui/button"

// Primary button (기본)
<Button>Click me</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Outline button
<Button variant="outline">Edit</Button>

// Destructive button (삭제)
<Button variant="destructive">Delete</Button>

// Small button
<Button size="sm">Small</Button>

// Icon button
<Button size="icon">
  <Icon />
</Button>

// Disabled button
<Button disabled>Disabled</Button>

// As Link
<Button asChild>
  <Link href="/blog/new">New Post</Link>
</Button>
```

### Input
```typescript
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="your@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

### Textarea
```typescript
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    placeholder="Write your content..."
    value={content}
    onChange={(e) => setContent(e.target.value)}
    rows={10}
  />
</div>
```

### Card
```typescript
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Avatar
```typescript
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Badge
```typescript
import { Badge } from "@/components/ui/badge"

<Badge>New</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Separator
```typescript
import { Separator } from "@/components/ui/separator"

<div>
  <p>Section 1</p>
  <Separator className="my-4" />
  <p>Section 2</p>
</div>
```

---

## 테스트 페이지 생성 (선택사항)

shadcn/ui 컴포넌트가 제대로 설치되었는지 확인하기 위한 테스트 페이지:

```typescript
// app/test-ui/page.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function TestUIPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">shadcn/ui Component Test</h1>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-input">Input</Label>
            <Input id="test-input" placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="test-textarea">Textarea</Label>
            <Textarea id="test-textarea" placeholder="Enter content..." rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Avatar & Badge */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar & Badge</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <Badge>New</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="destructive">Error</Badge>
        </CardContent>
      </Card>

      {/* Separator */}
      <div>
        <p>Section 1</p>
        <Separator className="my-4" />
        <p>Section 2</p>
      </div>
    </div>
  )
}
```

**테스트 URL**: `http://localhost:3000/test-ui`

---

## Tailwind CSS v4 설정 확인

Tailwind CSS v4는 **CSS-first configuration** 방식을 사용합니다. 별도의 `tailwind.config.ts` 파일이 필요 없으며, 모든 설정을 CSS 파일 내에서 직접 작성합니다.

### `app/globals.css` 확인
```css
@import "tailwindcss";

@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  --color-border: 214.3 31.8% 91.4%;
  --color-input: 214.3 31.8% 91.4%;
  --color-ring: 222.2 84% 4.9%;

  /* Primary colors */
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;

  /* Secondary colors */
  --color-secondary: 210 40% 96.1%;
  --color-secondary-foreground: 222.2 47.4% 11.2%;

  /* Destructive colors */
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;

  /* Muted colors */
  --color-muted: 210 40% 96.1%;
  --color-muted-foreground: 215.4 16.3% 46.9%;

  /* Accent colors */
  --color-accent: 210 40% 96.1%;
  --color-accent-foreground: 222.2 47.4% 11.2%;

  /* Card colors */
  --color-card: 0 0% 100%;
  --color-card-foreground: 222.2 84% 4.9%;

  /* Popover colors */
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 222.2 84% 4.9%;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 222.2 84% 4.9%;
    --color-foreground: 210 40% 98%;
    --color-border: 217.2 32.6% 17.5%;
    --color-input: 217.2 32.6% 17.5%;
    --color-ring: 212.7 26.8% 83.9%;

    --color-primary: 210 40% 98%;
    --color-primary-foreground: 222.2 47.4% 11.2%;

    --color-secondary: 217.2 32.6% 17.5%;
    --color-secondary-foreground: 210 40% 98%;

    --color-destructive: 0 62.8% 30.6%;
    --color-destructive-foreground: 210 40% 98%;

    --color-muted: 217.2 32.6% 17.5%;
    --color-muted-foreground: 215 20.2% 65.1%;

    --color-accent: 217.2 32.6% 17.5%;
    --color-accent-foreground: 210 40% 98%;

    --color-card: 222.2 84% 4.9%;
    --color-card-foreground: 210 40% 98%;

    --color-popover: 222.2 84% 4.9%;
    --color-popover-foreground: 210 40% 98%;
  }
}
```

### Tailwind CSS v4 주요 변경사항

**CSS-First Configuration**:
- `tailwind.config.ts` 파일이 기본적으로 필요 없음
- 모든 설정을 CSS 파일 내에서 `@theme` 디렉티브로 작성
- `@import "tailwindcss"` 한 줄로 Tailwind 전체 임포트

**Plugin 설정** (필요한 경우):
만약 `tailwindcss-animate` 같은 플러그인이 필요한 경우, `tailwind.config.ts` 파일을 생성할 수 있습니다:

```typescript
// tailwind.config.ts (선택사항 - 플러그인 사용 시에만)
import type { Config } from "tailwindcss"

const config: Config = {
  plugins: [require("tailwindcss-animate")],
}

export default config
```

**호환성 참고**:
- Tailwind CSS v4는 PostCSS 설정도 단순화되어 별도의 `postcss.config.js` 파일이 필요 없을 수 있습니다
- Next.js 16은 Tailwind CSS v4를 기본 지원하며 자동으로 설정을 처리합니다
- shadcn/ui는 Tailwind v4 CSS 변수 방식과 완전히 호환됩니다

---

## 완료 조건

### 설치 확인
- [ ] `components/ui/` 폴더에 모든 필수 컴포넌트 파일 존재
- [ ] `app/globals.css`에 Tailwind CSS v4 설정 및 CSS 변수 정의
- [ ] `@import "tailwindcss"` 및 `@theme` 디렉티브 포함

### 동작 확인
- [ ] 테스트 페이지에서 모든 컴포넌트 렌더링
- [ ] Button variants 모두 표시
- [ ] Input/Textarea 입력 가능
- [ ] Avatar 이미지 및 Fallback 표시
- [ ] Card 레이아웃 정상 동작

### 다음 단계
- Phase 0.2: TypeScript 타입 정의
- Phase 0.3: Mock Data 및 유틸리티 함수

---

## 참고사항

### 프로젝트 특성
- shadcn/ui는 Radix UI 기반으로 접근성이 내장되어 있음
- 모든 컴포넌트는 복사 가능하며 커스터마이징 가능
- CSS Variables 사용으로 다크 모드 지원 가능
- 추가 컴포넌트는 필요 시 언제든지 설치 가능

### Tailwind CSS v4 + Next.js 16 환경
- **CSS-First Configuration**: `tailwind.config.ts` 파일이 기본적으로 필요 없음
- **설정 위치**: 모든 Tailwind 설정은 `app/globals.css` 파일 내에서 `@theme` 디렉티브로 관리
- **PostCSS 자동화**: Next.js 16이 Tailwind v4를 자동으로 처리하므로 별도 PostCSS 설정 불필요
- **플러그인 사용 시**: `tailwindcss-animate` 같은 플러그인이 필요한 경우에만 선택적으로 `tailwind.config.ts` 파일 생성

### shadcn/ui 공식 문서
- 공식 사이트: https://ui.shadcn.com
- 컴포넌트 목록: https://ui.shadcn.com/docs/components
- 설치 가이드: https://ui.shadcn.com/docs/installation
- Tailwind v4 문서: https://tailwindcss.com/docs/v4-beta

### 문제 해결
- **컴포넌트가 표시되지 않는 경우**: `app/globals.css`에 `@import "tailwindcss"` 확인
- **스타일이 적용되지 않는 경우**: `@theme` 디렉티브 내 CSS 변수 정의 확인
- **다크 모드가 작동하지 않는 경우**: `@media (prefers-color-scheme: dark)` 블록 확인
- **타입 에러**: `@types/node`, `@types/react` 설치 확인
