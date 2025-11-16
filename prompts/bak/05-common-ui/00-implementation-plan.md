# 공통 UI 컴포넌트 구현 계획

## 개요

shadcn/ui 기반 재사용 가능한 공통 UI 컴포넌트 라이브러리 구축
- shadcn/ui 컴포넌트를 프로젝트에 설치 및 커스터마이징
- 프로젝트 전체에서 일관된 디자인 시스템 제공
- Tailwind CSS v4와 완벽하게 통합
- TypeScript 타입 안정성 보장
- 접근성(a11y) 준수

---

## Task List

### 0. shadcn/ui 초기 설정
**상태:** - [ ] 미완료 / - [x] 완료

**설정 작업:**
- [ ] shadcn/ui 초기화 (이미 완료되었다면 스킵)
- [ ] `components.json` 설정 확인
- [ ] `lib/utils.ts` 유틸리티 함수 확인
- [ ] Tailwind CSS 설정 확인

**명령어:**
```bash
# shadcn/ui가 설치되지 않았다면
npx shadcn@latest init

# 설정 확인
cat components.json
```

**완료 조건:**
- [ ] `components.json` 파일 존재
- [ ] `lib/utils.ts` 파일 존재 (cn 함수 포함)
- [ ] Tailwind CSS 설정 완료

---

## 버튼 컴포넌트

### 1. Button - 기본 버튼 컴포넌트
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/button.tsx`

**요구사항:**
- [ ] shadcn/ui Button 설치
- [ ] variant 지원: default, destructive, outline, secondary, ghost, link
- [ ] size 지원: default, sm, lg, icon
- [ ] disabled 상태 지원
- [ ] asChild prop 지원 (Radix UI Slot 사용)
- [ ] TypeScript 타입 정의
- [ ] 접근성: keyboard navigation, focus states

**의존성:**
- @radix-ui/react-slot
- class-variance-authority
- clsx
- tailwind-merge

**설치 명령어:**
```bash
npx shadcn@latest add button
```

**기본 구조:**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**사용 예시:**
```typescript
import { Button } from "@/components/ui/button"

// Primary 버튼
<Button>Click me</Button>

// Danger 버튼
<Button variant="destructive">Delete</Button>

// 아이콘 버튼
<Button size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>

// Link로 사용
<Button asChild>
  <Link href="/blog/new">New Post</Link>
</Button>
```

**완료 조건:**
- [ ] shadcn/ui Button 설치 완료
- [ ] 모든 variant 정상 작동
- [ ] 모든 size 정상 작동
- [ ] disabled 상태 테스트 완료
- [ ] keyboard navigation 테스트 완료

---

### 2. IconButton - 아이콘 버튼
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** Button 컴포넌트의 `size="icon"` variant 사용

**요구사항:**
- [ ] Button의 `size="icon"` variant 활용
- [ ] lucide-react 아이콘 통합
- [ ] aria-label 필수 (접근성)
- [ ] Tooltip 통합 (선택사항)

**의존성:**
- Button 컴포넌트
- lucide-react
- (선택) Tooltip 컴포넌트

**설치 명령어:**
```bash
npm install lucide-react
# Tooltip 사용 시
npx shadcn@latest add tooltip
```

**기본 구조:**
```typescript
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

// 기본 아이콘 버튼
<Button size="icon" aria-label="Delete">
  <Trash2 className="h-4 w-4" />
</Button>

// Variant 변형
<Button size="icon" variant="destructive" aria-label="Delete">
  <Trash2 className="h-4 w-4" />
</Button>

// Tooltip과 함께
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon" variant="ghost" aria-label="Delete">
        <Trash2 className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Delete post</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**구현 세부사항:**
- IconButton 전용 래퍼 컴포넌트 생성은 선택사항
- 대부분의 경우 Button의 `size="icon"` 직접 사용 권장
- aria-label은 필수 (스크린 리더 접근성)
- Tooltip 추가 시 사용성 향상

**완료 조건:**
- [ ] lucide-react 설치 완료
- [ ] 아이콘 버튼 정상 렌더링
- [ ] aria-label 적용 확인
- [ ] (선택) Tooltip 통합 완료

---

## 카드 컴포넌트

### 3. Card - 기본 카드 컨테이너
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/card.tsx`

**요구사항:**
- [ ] shadcn/ui Card 설치
- [ ] Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent 모듈 제공
- [ ] 흰 배경, 그림자, 둥근 모서리 스타일
- [ ] 반응형 디자인 지원
- [ ] className prop으로 커스터마이징 가능

**의존성:**
- clsx
- tailwind-merge

**설치 명령어:**
```bash
npx shadcn@latest add card
```

**기본 구조:**
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**사용 예시:**
```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

<Card>
  <CardHeader>
    <CardTitle>Blog Post Title</CardTitle>
    <CardDescription>By John Doe • Oct 26, 2023</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Blog post preview content...</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Read More</Button>
  </CardFooter>
</Card>
```

**완료 조건:**
- [ ] shadcn/ui Card 설치 완료
- [ ] 모든 Card 서브컴포넌트 정상 작동
- [ ] 그림자 및 스타일 확인
- [ ] className prop 커스터마이징 테스트
- [ ] BlogCard 예시 구현 완료

---

## 입력 필드 컴포넌트

### 4. Input - 텍스트 입력 필드
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/input.tsx`

**요구사항:**
- [ ] shadcn/ui Input 설치
- [ ] type 지원: text, email, password, search, tel, url, number
- [ ] placeholder, disabled, readOnly 상태 지원
- [ ] 포커스 시 ring 효과
- [ ] 에러 상태 스타일링 지원
- [ ] react-hook-form 통합 가능

**의존성:**
- clsx
- tailwind-merge

**설치 명령어:**
```bash
npx shadcn@latest add input
```

**기본 구조:**
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

**사용 예시:**
```typescript
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="email@example.com"
  />
</div>

// 에러 상태
<Input
  type="email"
  placeholder="email@example.com"
  className="border-red-500 focus-visible:ring-red-500"
  aria-invalid="true"
/>

// react-hook-form
<Input
  {...register("email", { required: true })}
  className={errors.email ? "border-red-500" : ""}
/>
```

**완료 조건:**
- [ ] shadcn/ui Input 설치 완료
- [ ] 모든 input type 정상 작동
- [ ] 포커스 ring 효과 확인
- [ ] 에러 상태 스타일 테스트
- [ ] react-hook-form 통합 테스트

---

### 5. Textarea - 텍스트 영역 입력
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/textarea.tsx`

**요구사항:**
- [ ] shadcn/ui Textarea 설치
- [ ] 최소 높이 80px
- [ ] rows, maxLength 지원
- [ ] 포커스 시 ring 효과
- [ ] 에러 상태 스타일링 지원
- [ ] resize 제어 가능

**의존성:**
- clsx
- tailwind-merge

**설치 명령어:**
```bash
npx shadcn@latest add textarea
```

**기본 구조:**
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
```

**사용 예시:**
```typescript
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="content">Content</Label>
  <Textarea
    id="content"
    placeholder="Write your blog post..."
    rows={10}
  />
</div>

// 문자 수 제한
<Textarea
  placeholder="Write your comment (max 500 characters)"
  maxLength={500}
  rows={4}
/>

// 리사이즈 제어
<Textarea
  className="resize-none"
  rows={4}
/>
```

**완료 조건:**
- [ ] shadcn/ui Textarea 설치 완료
- [ ] rows 설정 정상 작동
- [ ] maxLength 제한 테스트
- [ ] 포커스 ring 효과 확인
- [ ] resize 제어 테스트

---

### 6. Label - 입력 필드 레이블
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/label.tsx`

**요구사항:**
- [ ] shadcn/ui Label 설치
- [ ] htmlFor prop으로 input 연결
- [ ] 클릭 시 input 포커스
- [ ] 접근성 준수

**의존성:**
- @radix-ui/react-label
- class-variance-authority

**설치 명령어:**
```bash
npx shadcn@latest add label
```

**기본 구조:**
```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

**사용 예시:**
```typescript
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// 필수 필드 표시
<Label htmlFor="password">
  Password <span className="text-red-500">*</span>
</Label>
```

**완료 조건:**
- [ ] shadcn/ui Label 설치 완료
- [ ] htmlFor 연결 정상 작동
- [ ] 클릭 시 input 포커스 확인
- [ ] disabled 상태 스타일 확인

---

## 피드백 컴포넌트

### 7. LoadingSpinner - 로딩 스피너
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/loading-spinner.tsx`

**요구사항:**
- [ ] 회전 애니메이션
- [ ] size variant: sm, default, lg
- [ ] 중앙 정렬 옵션
- [ ] 접근성: aria-label, role="status"

**의존성:**
- lucide-react (Loader2 아이콘)

**기본 구조:**
```typescript
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "default" | "lg"
  className?: string
}

export function LoadingSpinner({
  size = "default",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <Loader2
      className={cn("animate-spin", sizeClasses[size], className)}
      aria-label="Loading"
      role="status"
    />
  )
}

// 중앙 정렬 버전
export function LoadingSpinnerCentered({
  size = "default",
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size={size} />
    </div>
  )
}
```

**사용 예시:**
```typescript
import { LoadingSpinner, LoadingSpinnerCentered } from "@/components/ui/loading-spinner"

// 인라인 스피너
<Button disabled>
  <LoadingSpinner size="sm" className="mr-2" />
  Loading...
</Button>

// 중앙 정렬 스피너
<LoadingSpinnerCentered />

// 커스텀 색상
<LoadingSpinner className="text-blue-600" />
```

**완료 조건:**
- [ ] 회전 애니메이션 정상 작동
- [ ] 모든 size variant 테스트
- [ ] 중앙 정렬 버전 테스트
- [ ] 접근성 속성 확인

---

### 8. ErrorMessage - 에러 메시지 표시
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/error-message.tsx`

**요구사항:**
- [ ] 에러 아이콘 + 메시지
- [ ] 빨간색 스타일
- [ ] variant: inline, block
- [ ] aria-live="polite" (접근성)

**의존성:**
- lucide-react (AlertCircle 아이콘)

**기본 구조:**
```typescript
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  variant?: "inline" | "block"
  className?: string
}

export function ErrorMessage({
  message,
  variant = "inline",
  className,
}: ErrorMessageProps) {
  if (variant === "inline") {
    return (
      <p
        className={cn("text-sm text-red-500", className)}
        role="alert"
        aria-live="polite"
      >
        {message}
      </p>
    )
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-800",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
```

**사용 예시:**
```typescript
import { ErrorMessage } from "@/components/ui/error-message"

// 인라인 에러 (폼 필드 하단)
{errors.email && (
  <ErrorMessage message={errors.email.message} />
)}

// 블록 에러 (페이지 상단)
<ErrorMessage
  variant="block"
  message="Failed to load posts. Please try again."
/>
```

**완료 조건:**
- [ ] 인라인 variant 테스트
- [ ] 블록 variant 테스트
- [ ] 아이콘 표시 확인
- [ ] 접근성 속성 확인

---

### 9. SuccessMessage - 성공 메시지 표시
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/success-message.tsx`

**요구사항:**
- [ ] 성공 아이콘 + 메시지
- [ ] 초록색 스타일
- [ ] variant: inline, block
- [ ] aria-live="polite" (접근성)

**의존성:**
- lucide-react (CheckCircle2 아이콘)

**기본 구조:**
```typescript
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessMessageProps {
  message: string
  variant?: "inline" | "block"
  className?: string
}

export function SuccessMessage({
  message,
  variant = "inline",
  className,
}: SuccessMessageProps) {
  if (variant === "inline") {
    return (
      <p
        className={cn("text-sm text-green-600", className)}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    )
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-4 text-green-800",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
```

**사용 예시:**
```typescript
import { SuccessMessage } from "@/components/ui/success-message"

// 인라인 성공 메시지
{isSuccess && (
  <SuccessMessage message="Email sent successfully!" />
)}

// 블록 성공 메시지
<SuccessMessage
  variant="block"
  message="Your blog post has been published!"
/>
```

**완료 조건:**
- [ ] 인라인 variant 테스트
- [ ] 블록 variant 테스트
- [ ] 아이콘 표시 확인
- [ ] 접근성 속성 확인

---

### 10. Toast - 토스트 알림 (선택사항)
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/toast.tsx`, `components/ui/toaster.tsx`, `components/ui/use-toast.ts`

**요구사항:**
- [ ] shadcn/ui Toast 설치
- [ ] useToast 훅으로 토스트 호출
- [ ] variant: default, destructive
- [ ] 자동 닫힘 (기본 5초)
- [ ] 수동 닫기 버튼

**의존성:**
- @radix-ui/react-toast

**설치 명령어:**
```bash
npx shadcn@latest add toast
```

**기본 구조:**
```typescript
// components/ui/use-toast.ts
import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])

    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, props.duration || 5000)
  }

  return { toast, toasts }
}
```

**사용 예시:**
```typescript
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function MyComponent() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "Success!",
      description: "Your post has been published.",
    })
  }

  return (
    <>
      <Button onClick={handleClick}>Publish</Button>
      <Toaster />
    </>
  )
}

// 에러 토스트
toast({
  title: "Error",
  description: "Failed to save changes.",
  variant: "destructive",
})
```

**완료 조건:**
- [ ] shadcn/ui Toast 설치 완료
- [ ] useToast 훅 정상 작동
- [ ] 자동 닫힘 테스트
- [ ] 수동 닫기 테스트
- [ ] variant 스타일 확인

---

## 기타 컴포넌트

### 11. Avatar - 사용자 아바타
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/avatar.tsx`

**요구사항:**
- [ ] shadcn/ui Avatar 설치 또는 커스텀 구현
- [ ] 이미지 지원 (프로필 사진)
- [ ] Fallback: 이니셜 표시
- [ ] size variant: sm, default, lg
- [ ] 원형 디자인

**의존성:**
- (shadcn/ui Avatar) @radix-ui/react-avatar
- (커스텀) 없음

**설치 명령어:**
```bash
# shadcn/ui Avatar 사용 시
npx shadcn@latest add avatar

# 또는 커스텀 구현
```

**기본 구조 (커스텀):**
```typescript
import { cn } from "@/lib/utils"

interface AvatarProps {
  src?: string
  alt?: string
  username: string
  size?: "sm" | "default" | "lg"
  className?: string
}

export function Avatar({
  src,
  alt,
  username,
  size = "default",
  className,
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={alt || username}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
```

**사용 예시:**
```typescript
import { Avatar } from "@/components/ui/avatar"

// 이니셜 아바타
<Avatar username="John Doe" />

// 이미지 아바타
<Avatar
  username="John Doe"
  src="/avatars/john.jpg"
  alt="John Doe"
/>

// 크기 변형
<Avatar username="John Doe" size="sm" />
<Avatar username="John Doe" size="lg" />
```

**완료 조건:**
- [ ] 이니셜 표시 정상 작동
- [ ] 이미지 로드 테스트
- [ ] 모든 size variant 확인
- [ ] fallback 동작 테스트

---

### 12. Badge - 배지
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/badge.tsx`

**요구사항:**
- [ ] shadcn/ui Badge 설치
- [ ] variant: default, secondary, destructive, outline
- [ ] 작은 크기, 인라인 표시
- [ ] 숫자 또는 텍스트 표시

**의존성:**
- class-variance-authority

**설치 명령어:**
```bash
npx shadcn@latest add badge
```

**기본 구조:**
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

**사용 예시:**
```typescript
import { Badge } from "@/components/ui/badge"

// 기본 배지
<Badge>New</Badge>

// 댓글 수
<Badge variant="secondary">12 comments</Badge>

// 카테고리
<Badge variant="outline">JavaScript</Badge>

// 상태 표시
<Badge variant="destructive">Deleted</Badge>
```

**완료 조건:**
- [ ] shadcn/ui Badge 설치 완료
- [ ] 모든 variant 정상 작동
- [ ] 텍스트 및 숫자 표시 확인
- [ ] 인라인 배치 테스트

---

### 13. Divider - 구분선
**상태:** - [ ] 미완료 / - [x] 완료
**파일:** `components/ui/divider.tsx` 또는 `components/ui/separator.tsx`

**요구사항:**
- [ ] shadcn/ui Separator 설치 또는 커스텀 구현
- [ ] 수평 구분선
- [ ] 수직 구분선 (선택사항)
- [ ] 간격 조정 가능

**의존성:**
- (shadcn/ui Separator) @radix-ui/react-separator

**설치 명령어:**
```bash
# shadcn/ui Separator 사용 시
npx shadcn@latest add separator

# 또는 커스텀 구현
```

**기본 구조 (커스텀):**
```typescript
import { cn } from "@/lib/utils"

interface DividerProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "h-[1px] w-full bg-border"
          : "h-full w-[1px] bg-border",
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  )
}
```

**사용 예시:**
```typescript
import { Divider } from "@/components/ui/divider"

// 수평 구분선
<div className="space-y-4">
  <p>Section 1</p>
  <Divider />
  <p>Section 2</p>
</div>

// 간격 조정
<Divider className="my-8" />

// 수직 구분선
<div className="flex items-center gap-4 h-8">
  <span>Item 1</span>
  <Divider orientation="vertical" />
  <span>Item 2</span>
</div>
```

**완료 조건:**
- [ ] 수평 구분선 정상 렌더링
- [ ] (선택) 수직 구분선 테스트
- [ ] 간격 조정 테스트
- [ ] 접근성 속성 확인

---

## 구현 순서

### Phase 1: 필수 컴포넌트 설치 (Day 1)
1. shadcn/ui 초기 설정 확인
2. Button 설치 및 테스트
3. Card 설치 및 테스트
4. Input, Textarea, Label 설치 및 테스트
5. lucide-react 설치

### Phase 2: 커스텀 컴포넌트 구현 (Day 2)
6. LoadingSpinner 구현
7. ErrorMessage 구현
8. SuccessMessage 구현
9. Avatar 구현
10. Badge 설치
11. Divider 구현

### Phase 3: 선택 컴포넌트 및 통합 (Day 3)
12. Toast 설치 (선택사항)
13. 모든 컴포넌트 통합 테스트
14. Storybook 또는 예시 페이지 생성 (선택사항)
15. 문서화

---

## 검증 체크리스트

### Button
- [ ] 모든 variant 정상 렌더링 (default, destructive, outline, secondary, ghost, link)
- [ ] 모든 size 정상 렌더링 (default, sm, lg, icon)
- [ ] disabled 상태 테스트
- [ ] asChild prop 테스트 (Link와 함께)
- [ ] keyboard navigation (Tab, Enter)
- [ ] focus ring 표시

### IconButton
- [ ] lucide-react 아이콘 렌더링
- [ ] aria-label 적용
- [ ] 모든 variant 테스트
- [ ] Tooltip 통합 (선택사항)

### Card
- [ ] Card 기본 렌더링
- [ ] CardHeader, CardTitle, CardDescription 표시
- [ ] CardContent, CardFooter 레이아웃
- [ ] 그림자 및 테두리 확인
- [ ] BlogCard 예시 구현

### Input
- [ ] 모든 type 테스트 (text, email, password, search)
- [ ] placeholder 표시
- [ ] disabled 상태
- [ ] 포커스 ring
- [ ] 에러 상태 스타일
- [ ] react-hook-form 통합

### Textarea
- [ ] rows 설정
- [ ] maxLength 제한
- [ ] 포커스 ring
- [ ] resize 제어
- [ ] react-hook-form 통합

### Label
- [ ] htmlFor 연결
- [ ] 클릭 시 input 포커스
- [ ] disabled 상태 스타일

### LoadingSpinner
- [ ] 회전 애니메이션
- [ ] 모든 size variant
- [ ] 중앙 정렬 버전
- [ ] 접근성 속성

### ErrorMessage
- [ ] 인라인 variant
- [ ] 블록 variant
- [ ] 아이콘 표시
- [ ] 접근성 속성

### SuccessMessage
- [ ] 인라인 variant
- [ ] 블록 variant
- [ ] 아이콘 표시
- [ ] 접근성 속성

### Toast (선택사항)
- [ ] useToast 훅 작동
- [ ] 자동 닫힘
- [ ] 수동 닫기
- [ ] variant 스타일

### Avatar
- [ ] 이니셜 표시
- [ ] 이미지 로드
- [ ] 모든 size variant
- [ ] fallback 동작

### Badge
- [ ] 모든 variant
- [ ] 텍스트/숫자 표시
- [ ] 인라인 배치

### Divider
- [ ] 수평 구분선
- [ ] 수직 구분선 (선택사항)
- [ ] 간격 조정

---

## 참고사항

### shadcn/ui 설치 시 주의사항
- `components.json` 파일 설정 확인
- Tailwind CSS 설정이 올바른지 확인
- `lib/utils.ts`에 `cn` 함수 존재 확인

### TypeScript 타입 안정성
- 모든 컴포넌트에 적절한 타입 정의
- Props interface 명시
- forwardRef 사용 시 제네릭 타입 지정

### 접근성 (a11y)
- aria-label, aria-describedby 적절히 사용
- role 속성 명시
- keyboard navigation 지원
- focus states 시각화

### 재사용성
- className prop으로 커스터마이징 가능하게
- variant/size props로 다양한 스타일 제공
- 컴포넌트 간 일관성 유지

### 성능
- 불필요한 리렌더링 방지
- React.memo 사용 고려 (필요 시)
- 아이콘은 lucide-react 사용 (tree-shaking 지원)

### 문서화
- 각 컴포넌트 사용 예시 작성
- Props 설명
- Storybook 또는 예시 페이지 생성 권장

### react-hook-form 통합
- register 함수로 쉽게 통합
- 에러 상태 처리
- 유효성 검증

### 다크 모드 대응 (추후)
- Tailwind CSS 다크 모드 클래스 사용
- CSS 변수로 색상 관리
- shadcn/ui는 기본적으로 다크 모드 지원
