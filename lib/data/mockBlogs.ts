// lib/data/mockBlogs.ts
import type { Blog } from "@/types/blog"

/**
 * Mock 블로그 데이터
 * 실제 사용 시 Supabase 데이터베이스로 교체 예정
 */
let mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Designing for Simplicity",
    content: `Discover the core principles of creating clean, intuitive, and effective designs by focusing on what truly matters to the user.

Modern design is about clarity and purpose. When we strip away the unnecessary, we create space for what matters most - the user experience.

## The Power of Simplicity

Simplicity isn't about removing features; it's about clarity of purpose. Every element should serve a clear function and contribute to the overall user experience.

## Key Principles

1. **Focus on the essentials** - Remove anything that doesn't serve a purpose
2. **Use white space effectively** - Let your content breathe
3. **Create visual hierarchy** - Guide users through your interface
4. **Maintain consistency** - Use patterns users recognize

By embracing simplicity, we create designs that are not only beautiful but also highly functional and user-friendly.`,
    authorId: "user-1",
    authorName: "Jane Doe",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    createdAt: "2024-10-26T00:00:00Z",
    updatedAt: "2024-10-26T00:00:00Z",
  },
  {
    id: "2",
    title: "The Art of Minimalist UI",
    content: `Learn how stripping back the interface to its essential components can improve usability and aesthetic appeal in modern web design.

Minimalism in UI design is about intentionality. Every pixel, every color, every element serves a purpose.

## Less is More

The minimalist approach forces us to make deliberate choices about what we include. This constraint often leads to better, more focused designs.

## Benefits of Minimalist Design

- **Faster load times** - Less code, fewer assets
- **Better mobile experience** - Simplified interfaces work better on small screens
- **Improved accessibility** - Clear, simple interfaces are easier to navigate
- **Timeless aesthetics** - Minimalist designs age well

Remember, minimalism isn't about being boring - it's about being intentional.`,
    authorId: "user-2",
    authorName: "John Smith",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: "2024-10-26T00:00:00Z",
    updatedAt: "2024-10-26T00:00:00Z",
  },
  {
    id: "3",
    title: "Mastering Whitespace",
    content: `Whitespace is more than just empty space. This article explores how to effectively use it to guide the user's eye and improve clarity.

Whitespace, or negative space, is one of the most powerful tools in a designer's toolkit. It's not empty - it's full of potential.

## Understanding Whitespace

Whitespace gives elements room to breathe, creates visual hierarchy, and improves readability. It's an active design element, not just the absence of content.

## Types of Whitespace

1. **Macro whitespace** - Large spaces between major layout elements
2. **Micro whitespace** - Small spaces between text lines, letters, and UI elements

## Best Practices

- Use whitespace to create visual groups
- Don't be afraid of empty space
- Consider the relationship between elements
- Test your designs at different screen sizes

Strategic use of whitespace can transform a cluttered interface into an elegant, usable design.`,
    authorId: "user-3",
    authorName: "Emily White",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    createdAt: "2024-10-27T00:00:00Z",
    updatedAt: "2024-10-27T00:00:00Z",
  },
  {
    id: "4",
    title: "A Guide to Modern Typography",
    content: `Typography is the cornerstone of good design. We'll dive into the best practices for choosing and pairing fonts for web projects.

Typography can make or break your design. It's not just about choosing a pretty font - it's about communication and hierarchy.

## Choosing the Right Typeface

Consider your project's personality, readability requirements, and technical constraints when selecting fonts.

## Font Pairing Principles

- **Contrast is key** - Pair serif with sans-serif
- **Limit your choices** - 2-3 fonts maximum
- **Establish hierarchy** - Use size, weight, and spacing
- **Consider readability** - Test at different sizes

## Web Font Best Practices

1. Use system fonts when possible for performance
2. Subset fonts to reduce file size
3. Use font-display: swap for better loading
4. Test across different browsers and devices

Good typography is invisible - it simply makes reading a pleasure.`,
    authorId: "user-1",
    authorName: "Alex Johnson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    createdAt: "2024-10-20T00:00:00Z",
    updatedAt: "2024-10-20T00:00:00Z",
  },
  {
    id: "5",
    title: "Building a Responsive Layout",
    content: `Follow our step-by-step tutorial on using modern CSS techniques to create a flexible and beautiful layout that works on any device.

Responsive design is no longer optional - it's essential. Let's explore modern techniques for building layouts that adapt seamlessly.

## Mobile-First Approach

Start with the mobile layout and progressively enhance for larger screens. This ensures a solid foundation for all devices.

## Modern CSS Tools

- **Flexbox** - Perfect for one-dimensional layouts
- **Grid** - Ideal for two-dimensional layouts
- **Container Queries** - Component-level responsiveness
- **CSS Custom Properties** - Dynamic, maintainable styling

## Responsive Design Principles

1. Use relative units (rem, em, %)
2. Implement fluid typography
3. Design for touch and mouse
4. Test on real devices
5. Consider accessibility

## Code Example

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

With modern CSS, creating responsive layouts has never been easier.`,
    authorId: "user-4",
    authorName: "Sarah Lee",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    createdAt: "2024-10-16T00:00:00Z",
    updatedAt: "2024-10-16T00:00:00Z",
  },
  {
    id: "6",
    title: "The Psychology of Color",
    content: `Understand how different colors evoke specific emotions and how you can leverage this knowledge to build a stronger brand identity.

Color is one of the most powerful tools in design. It can influence emotions, drive actions, and communicate brand values.

## Color Theory Basics

Understanding the color wheel, complementary colors, and color harmony is essential for effective design.

## Emotional Impact of Colors

- **Red** - Energy, passion, urgency
- **Blue** - Trust, calm, professionalism
- **Green** - Growth, health, nature
- **Yellow** - Optimism, warmth, caution
- **Purple** - Luxury, creativity, wisdom

## Choosing a Color Palette

1. Start with brand values
2. Consider your audience
3. Think about accessibility (WCAG contrast ratios)
4. Test in context
5. Create variations for different states

## Cultural Considerations

Remember that color meanings can vary across cultures. Research your target audience's cultural context.

## Practical Tips

- Use color to create visual hierarchy
- Limit your palette (3-5 colors)
- Use neutral colors for balance
- Test for color blindness accessibility

Color choices should be intentional, meaningful, and accessible to all users.`,
    authorId: "user-5",
    authorName: "Michael Brown",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    createdAt: "2024-10-18T00:00:00Z",
    updatedAt: "2024-10-18T00:00:00Z",
  },
]

/**
 * 모든 블로그 가져오기
 */
export function getMockBlogs(): Blog[] {
  return [...mockBlogs].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/**
 * ID로 특정 블로그 가져오기
 */
export function getMockBlogById(id: string): Blog | null {
  return mockBlogs.find((blog) => blog.id === id) || null
}

/**
 * 블로그 검색 (제목 및 내용)
 */
export function searchMockBlogs(query: string): Blog[] {
  const lowerQuery = query.toLowerCase()
  return mockBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery) ||
      blog.authorName.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 새 블로그 추가
 */
export function addMockBlog(
  title: string,
  content: string,
  authorId: string,
  authorName: string
): Blog {
  const newBlog: Blog = {
    id: Date.now().toString(),
    title,
    content,
    authorId,
    authorName,
    authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockBlogs.push(newBlog)
  return newBlog
}

/**
 * 블로그 수정
 */
export function updateMockBlog(
  id: string,
  title: string,
  content: string
): Blog | null {
  const blogIndex = mockBlogs.findIndex((blog) => blog.id === id)

  if (blogIndex === -1) {
    return null
  }

  mockBlogs[blogIndex] = {
    ...mockBlogs[blogIndex],
    title,
    content,
    updatedAt: new Date().toISOString(),
  }

  return mockBlogs[blogIndex]
}

/**
 * 블로그 삭제
 */
export function deleteMockBlog(id: string): boolean {
  const blogIndex = mockBlogs.findIndex((blog) => blog.id === id)

  if (blogIndex === -1) {
    return false
  }

  mockBlogs.splice(blogIndex, 1)
  return true
}

/**
 * 작성자별 블로그 가져오기
 */
export function getMockBlogsByAuthor(authorId: string): Blog[] {
  return mockBlogs.filter((blog) => blog.authorId === authorId)
}

/**
 * 블로그 총 개수
 */
export function getMockBlogsCount(): number {
  return mockBlogs.length
}
