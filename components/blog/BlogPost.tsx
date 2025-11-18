"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import type { Blog } from "@/types/blog"

interface BlogPostProps {
  blog: Blog
  isAuthor?: boolean
}

export function BlogPost({ blog, isAuthor = false }: BlogPostProps) {
  const router = useRouter()

  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Get author initials
  const authorInitials = blog.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    // TODO: Implement delete logic (Server Action)
    // For now, just redirect to home
    router.push("/")
  }

  return (
    <article className="space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to posts</span>
      </Link>

      {/* Header: Title and Actions */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold flex-1">{blog.title}</h1>

        {/* Edit/Delete Buttons (Author only) */}
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/blog/${blog.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={blog.authorAvatar} alt={blog.authorName} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{blog.authorName}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {blog.content}
        </p>
      </div>
    </article>
  )
}
