# Card 구현 계획

## 개요
기본 카드 컨테이너로, 흰 배경, 그림자, 둥근 모서리를 가진 컴포넌트입니다.

## 파일 경로
- `components/ui/card.tsx`

## 의존성
- **shadcn/ui**: Card 컴포넌트 사용
- **Tailwind CSS**: 스타일링

## 설치 방법

### shadcn/ui Card 설치
```bash
npx shadcn@latest add card
```

이 명령어는 다음을 자동으로 생성합니다:
- `components/ui/card.tsx`
- Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent 컴포넌트

## 구현 상세

### 1. 기본 구조 (shadcn/ui 기반)

설치 후 생성되는 `components/ui/card.tsx`:

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

### 2. 컴포넌트 구성

#### Card (메인 컨테이너)
- **역할**: 카드의 최상위 컨테이너
- **스타일**: 둥근 모서리, 테두리, 그림자

#### CardHeader
- **역할**: 카드 헤더 영역
- **스타일**: 상단 패딩 포함

#### CardTitle
- **역할**: 카드 제목
- **스타일**: 큰 굵은 텍스트

#### CardDescription
- **역할**: 카드 설명
- **스타일**: 작은 회색 텍스트

#### CardContent
- **역할**: 카드 본문 내용
- **스타일**: 패딩 포함

#### CardFooter
- **역할**: 카드 하단 영역 (버튼 등)
- **스타일**: Flexbox 레이아웃

### 3. 사용 예시

#### 기본 카드
```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### 블로그 카드 (BlogCard)
```typescript
// components/blog/BlogCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogCardProps {
  id: string
  title: string
  authorName: string
  createdAt: string
  content: string
}

export default function BlogCard({
  id,
  title,
  authorName,
  createdAt,
  content,
}: BlogCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription>
          By {authorName} • {new Date(createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {content}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
```

#### 인증 카드 (AuthCard)
```typescript
// components/auth/AuthCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
```

#### 사용 예시
```typescript
// app/auth/login/page.tsx
import AuthCard from "@/components/auth/AuthCard"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your account"
    >
      <LoginForm />
    </AuthCard>
  )
}
```

### 4. 커스터마이징

#### Hover 효과
```typescript
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  {/* 카드 내용 */}
</Card>
```

#### 클릭 가능한 카드
```typescript
import Link from "next/link"

<Link href={`/blog/${id}`}>
  <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{content}</p>
    </CardContent>
  </Card>
</Link>
```

#### 그라디언트 배경 카드
```typescript
<Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
  <CardHeader>
    <CardTitle className="text-white">Featured Post</CardTitle>
    <CardDescription className="text-blue-100">
      Special content
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-white">Content here</p>
  </CardContent>
</Card>
```

#### 이미지가 있는 카드
```typescript
import Image from "next/image"

<Card className="overflow-hidden">
  <div className="relative h-48 w-full">
    <Image
      src="/blog-image.jpg"
      alt="Blog post"
      fill
      className="object-cover"
    />
  </div>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>{content}</p>
  </CardContent>
</Card>
```

### 5. 반응형 그리드 레이아웃

#### 블로그 그리드 (BlogGrid)
```typescript
// components/blog/BlogGrid.tsx
import BlogCard from "./BlogCard"

interface Blog {
  id: string
  title: string
  authorName: string
  createdAt: string
  content: string
}

interface BlogGridProps {
  blogs: Blog[]
}

export default function BlogGrid({ blogs }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} {...blog} />
      ))}
    </div>
  )
}
```

#### 반응형 브레이크포인트
- **모바일**: 1열 (grid-cols-1)
- **태블릿**: 2열 (md:grid-cols-2)
- **데스크톱**: 3열 (lg:grid-cols-3)
- **간격**: gap-6 (24px)

### 6. 접근성

#### Semantic HTML
```typescript
<Card as="article">
  <CardHeader>
    <CardTitle as="h2">{title}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* 내용 */}
  </CardContent>
</Card>
```

#### Link 접근성
```typescript
<Link href={`/blog/${id}`} aria-label={`Read more about ${title}`}>
  <Card>
    {/* 카드 내용 */}
  </Card>
</Link>
```

### 7. 변형 예시

#### Compact 카드
```typescript
<Card className="p-4">
  <div className="flex items-start gap-4">
    <div className="flex-1">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Button variant="ghost" size="sm">
      View
    </Button>
  </div>
</Card>
```

#### Stats 카드
```typescript
<Card>
  <CardHeader className="pb-2">
    <CardDescription>Total Posts</CardDescription>
    <CardTitle className="text-4xl">245</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-xs text-muted-foreground">
      +12% from last month
    </div>
  </CardContent>
</Card>
```

### 8. 구현 순서
1. ✅ shadcn/ui Card 설치: `npx shadcn@latest add card`
2. ✅ 기본 Card 컴포넌트 확인 (`components/ui/card.tsx`)
3. ⏳ BlogCard 컴포넌트 생성
4. ⏳ AuthCard 컴포넌트 생성
5. ⏳ BlogGrid 레이아웃 구현
6. ⏳ Hover 효과 및 애니메이션 추가

### 9. 테스트 체크리스트
- [ ] 카드가 올바르게 렌더링되는가?
- [ ] 그림자와 테두리가 표시되는가?
- [ ] Hover 효과가 작동하는가?
- [ ] 그리드 레이아웃이 반응형으로 작동하는가?
- [ ] 카드 내부 요소가 올바르게 정렬되는가?
- [ ] 클릭 가능한 카드가 접근 가능한가?

### 10. 추후 확장 사항
- **로딩 스켈레톤**: 카드 로딩 상태
- **애니메이션**: 카드 등장 애니메이션
- **드래그 앤 드롭**: 카드 순서 변경
- **필터/정렬**: 카드 필터링 기능
