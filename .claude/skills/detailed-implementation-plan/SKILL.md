---
name: detailed-implementation-plan
description: Generates detailed, step-by-step implementation plans for React/Next.js components based on component lists from plan-based-components and optional UI design images. Creates actionable task lists with file paths, dependencies, implementation details, and verification checklists. Use when users want specific implementation guidance for building components.
---

# Detailed Implementation Plan

Transform component lists into actionable, step-by-step implementation plans with specific file paths, code structure, dependencies, and verification steps.

## Input Requirements

1. **Component List** - Output from plan-based-components skill (required)
   - Should be a markdown file with checkboxes for each component
2. **Category Selection** - Which category to implement (e.g., "1. 인증", "2. 어드민 기능")
3. **UI Design Image** - Optional screenshot/mockup from Google Stitch or design tool

## Incremental Processing Workflow

This skill processes ONE category at a time:

1. **Read Component List**: Load the component list markdown file
2. **Select Category**: Process only the selected category
3. **Generate Plan**: Create detailed implementation plan for that category
4. **Update Component List**: After generating the plan, update the original component list file by checking off (changing `- [ ]` to `- [x]`) all components in the processed category
5. **Repeat**: Move to next category in subsequent calls

**CRITICAL**: After generating an implementation plan for a category, you MUST update the component list file to mark those components as planned by changing their checkboxes from `- [ ]` to `- [x]`.

## Output Structure

Generate implementation plans in this exact format:

```markdown
# [Category Name] 구현 계획

## 개요

[Brief overview of what will be implemented]
- [Key point 1]
- [Key point 2]

---

## Task List

### 0. [Setup Task if needed]
- [ ] Task item 1
- [ ] Task item 2

### 1. [Component 1 Name]
**상태:** - [ ] 미완료 / - [x] 완료  
**파일:** `app/path/to/Component.tsx`

**요구사항:**
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] UI requirement (if image provided)

**의존성:**
- dependency 1
- dependency 2

**기본 구조:**
\`\`\`typescript
// Code structure template
\`\`\`

**구현 세부사항:**
- Detail 1
- Detail 2

**완료 조건:**
- [ ] 모든 요구사항 구현 완료
- [ ] 테스트 통과

---

### 2. [Component 2 Name]
**상태:** - [ ] 미완료 / - [x] 완료  
**파일:** `app/path/to/Component2.tsx`
...

---

## 구현 순서

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## 검증 체크리스트

### [Component 1]
- [ ] Verification item 1
- [ ] Verification item 2

### [Component 2]
- [ ] Verification item 1

---

## 참고사항

- Note 1
- Note 2
```

## Analysis Process

1. **Parse Component List**: Extract components for selected category
2. **Identify Dependencies**: Determine installation requirements (shadcn/ui, packages)
3. **Analyze UI Design**: Extract layout, colors, spacing from image if provided
4. **Determine File Paths**: Assign appropriate Next.js App Router paths
5. **Define Implementation Order**: Order by dependency (infrastructure → features)
6. **Create Task Structure**: Break down into actionable tasks with checkboxes
7. **Add Verification Steps**: Include testing and validation checkpoints
8. **Update Component List File**: Mark processed components as `- [x]` in the original component list markdown file

## Component Organization Patterns

### File Path Conventions

```
app/
  components/
    auth/          - Authentication components
    admin/         - Admin-specific components
    learning/      - Learning-related components
    ui/            - shadcn/ui components
    layout/        - Layout components
  actions/         - Server actions
  contexts/        - React contexts/providers
  lib/             - Utilities and helpers
  (routes)/        - Page routes
```

### Component Types

**Client Components** (`"use client"`):
- Forms with user interaction
- Components using hooks (useState, useEffect)
- Event handlers (onClick, onChange)
- Contexts that manage client state

**Server Components** (default):
- Data fetching components
- Static layouts
- Components without interactivity

## Implementation Details Template

For each component, provide:

### 1. File Path
```
app/components/[category]/ComponentName.tsx
```

### 2. Requirements Checklist
- [ ] Specific feature 1
- [ ] Specific feature 2
- [ ] UI/UX requirement (from image)

### 3. Dependencies
List required packages:
- shadcn/ui components
- npm packages
- Custom hooks

### 4. Code Structure
Provide skeleton/template:
```typescript
"use client" // if needed

import statements
type definitions
component function
return JSX
```

### 5. Implementation Details
- State management approach
- Form handling strategy
- API/Server action integration
- Styling approach
- Error handling

## UI Design Integration

When image is provided:

### Extract from Design
- **Layout**: Card-based, grid, flex
- **Colors**: Primary, secondary, accent colors (hex codes)
- **Typography**: Font sizes, weights
- **Spacing**: Padding, margins, gaps
- **Components**: Buttons, inputs, cards seen in design
- **Icons**: Icon usage patterns
- **States**: Hover, focus, error states visible

### Apply to Implementation
- Reference specific colors in requirements
- Mention spacing values (e.g., "16px padding")
- Describe exact button styles from image
- Note icon placements
- Specify responsive behaviors shown

## Dependency Management

### shadcn/ui Components
List required components to install:
```bash
npx shadcn@latest add button input card form
```

### npm Packages
List with installation commands:
```bash
npm install react-hook-form zod @hookform/resolvers
```

### Custom Dependencies
- Custom hooks to create
- Utility functions needed
- Type definitions required

## Implementation Order Strategy

1. **Infrastructure First**
   - Providers/Contexts
   - Utility functions
   - Type definitions

2. **Base Components**
   - UI components (shadcn/ui)
   - Layout components

3. **Feature Components**
   - Forms
   - Data display components
   - Interactive features

4. **Integration**
   - Server actions
   - API routes
   - Page routes

## Task Breakdown Pattern

### For Forms
```
- [ ] Install dependencies (react-hook-form, zod)
- [ ] Create Zod validation schema
- [ ] Implement form with react-hook-form
- [ ] Add error handling and display
- [ ] Add loading states
- [ ] Connect to server action/API
- [ ] Test validation
- [ ] Test submission
```

### For Display Components
```
- [ ] Define TypeScript interface
- [ ] Implement static UI
- [ ] Add conditional rendering
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Add error state
- [ ] Test with mock data
- [ ] Test responsive design
```

### For Contexts/Providers
```
- [ ] Define context interface
- [ ] Implement context provider
- [ ] Add state management logic
- [ ] Add mutation functions
- [ ] Export custom hook
- [ ] Wrap app with provider
- [ ] Test context consumption
```

## Verification Checklist Categories

### Functionality
- [ ] Component renders without errors
- [ ] All features work as expected
- [ ] Forms validate correctly
- [ ] Data fetching works

### UI/UX
- [ ] Matches design mockup
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states display properly
- [ ] Error messages are clear

### Code Quality
- [ ] TypeScript types are correct
- [ ] No console errors
- [ ] Follows Next.js 15 conventions
- [ ] Proper use of server/client components

### Integration
- [ ] Server actions work
- [ ] API calls succeed
- [ ] Navigation functions properly
- [ ] State persists correctly

## Best Practices

- Use Next.js 15 App Router conventions
- Prefer Server Components when possible
- Use Server Actions for mutations
- Implement proper error boundaries
- Add loading states for async operations
- Use TypeScript strictly
- Follow shadcn/ui patterns
- Keep components focused and small
- Extract reusable logic to hooks
- Add proper accessibility (ARIA labels)

## Example Output Format

```markdown
# 인증 (Authentication) 구현 계획

## 개요

Supabase 기반 이메일/비밀번호 인증 시스템 구현
- 로그인 폼 (이메일, 비밀번호)
- 인증 상태 관리 Context
- Server Actions로 인증 처리

---

## Task List

### 0. Supabase 설정
- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 추가 (.env.local)
- [ ] Supabase 클라이언트 설정

### 1. LoginForm 컴포넌트
**상태:** - [ ] 미완료  
**파일:** `app/components/auth/LoginForm.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] shadcn/ui Form, Input, Button 사용
- [ ] react-hook-form으로 폼 관리
- [ ] Zod 유효성 검증
- [ ] 이메일 필드 (이메일 아이콘)
- [ ] 비밀번호 필드 (잠금 아이콘, 토글 표시)
- [ ] 로그인 버튼 (파란색, 전체 너비)
- [ ] "Forgot password?" 링크
- [ ] "Sign up" 버튼 (outlined 스타일)

**의존성:**
- shadcn/ui: button, input, card, form, label
- react-hook-form
- zod
- @hookform/resolvers

**기본 구조:**
\`\`\`typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  })
  
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    // Call server action
  }
  
  return (
    <Card>
      <Form {...form}>
        {/* Form fields */}
      </Form>
    </Card>
  )
}
\`\`\`

**완료 조건:**
- [ ] 모든 요구사항 구현 완료
- [ ] 유효성 검증 테스트 통과
- [ ] 실제 로그인 동작 확인

---

### 2. AuthProvider 컴포넌트
**상태:** - [ ] 미완료  
**파일:** `app/contexts/AuthContext.tsx`

**요구사항:**
- [ ] Context로 인증 상태 관리
- [ ] 로그인/로그아웃 함수 제공
- [ ] 사용자 정보 저장

**완료 조건:**
- [ ] Context 생성 및 Provider 구현 완료
- [ ] 앱 전체에서 인증 상태 접근 가능

---

## 구현 순서

1. Supabase 프로젝트 설정 및 환경 변수
2. shadcn/ui 컴포넌트 설치
3. 로그인 서버 액션 생성
4. LoginForm 컴포넌트 구현
5. AuthProvider 구현
6. 로그인 페이지 생성

---

## 검증 체크리스트

### LoginForm
- [ ] 이메일 유효성 검증 작동
- [ ] 비밀번호 유효성 검증 작동
- [ ] 로그인 버튼 클릭 시 서버 액션 호출
- [ ] 에러 메시지 표시
- [ ] 로딩 상태 표시

### AuthProvider
- [ ] 인증 상태 전역 관리
- [ ] 로그인/로그아웃 기능 동작
- [ ] 페이지 새로고침 시 상태 유지
```

## Progressive Implementation

Support incremental development by:
1. Breaking large features into small tasks
2. Prioritizing core functionality first
3. Adding enhancements later
4. Allowing parallel development of independent components

## Component List Update Process

After generating an implementation plan, you MUST update the component list file:

### Update Steps
1. **Locate Components**: Find all components mentioned in the generated plan
2. **Update Checkboxes**: In the component list markdown file, change `- [ ]` to `- [x]` for each planned component
3. **Preserve Structure**: Keep all other formatting and content intact
4. **Save File**: Write the updated component list back to the file

### Example Update

**Before (Component List):**
```markdown
1. 인증 (Authentication)

- [ ] LoginForm - 로그인 폼
- [ ] AuthProvider - 인증 상태 관리 컨텍스트

2. 어드민 기능

- [ ] CourseCard - 코스 카드
```

**After processing "1. 인증" category:**
```markdown
1. 인증 (Authentication)

- [x] LoginForm - 로그인 폼
- [x] AuthProvider - 인증 상태 관리 컨텍스트

2. 어드민 기능

- [ ] CourseCard - 코스 카드
```

### Implementation Note
When the user provides a component list file path, read it, generate the plan for the selected category, then write the updated component list with checked boxes for processed components.

## Notes on Iteration

This skill should be used multiple times for different categories:
- First call: Category 1 (인증)
  - After generating plan, mark all "인증" components as `- [x]` in component list
- Second call: Category 2 (어드민 기능 - 코스 관리)
  - After generating plan, mark all "코스 관리" components as `- [x]` in component list
- Third call: Category 3 (사용자 학습 기능 - 코스/섹션 선택)
  - After generating plan, mark all components as `- [x]` in component list
- Continue for each subcategory

Each plan should be self-contained and actionable independently.

**Workflow Summary:**
1. User provides component list file + category selection
2. Generate detailed implementation plan for that category
3. Update the component list file: change `- [ ]` to `- [x]` for processed components
4. User implements components following the plan
5. Repeat for next category
