import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Blog } from "@/types/blog"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Get author initials for avatar fallback
  const authorInitials = blog.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Truncate content for preview (first 150 characters)
  const contentPreview =
    blog.content.length > 150
      ? blog.content.substring(0, 150) + "..."
      : blog.content

  return (
    <Link href={`/blog/${blog.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={blog.authorAvatar}
                alt={blog.authorName}
              />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {blog.authorName}
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {contentPreview}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
