"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { addMockComment } from "@/lib/data/mockComments"

interface CommentFormProps {
  blogId: string
  isLoggedIn: boolean
  currentUserId?: string
  currentUserName?: string
}

export function CommentForm({
  blogId,
  isLoggedIn,
  currentUserId,
  currentUserName
}: CommentFormProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate content
    if (!content.trim()) {
      setError("Comment cannot be empty")
      return
    }

    // Validate user info
    if (!currentUserId || !currentUserName) {
      setError("User information is missing")
      return
    }

    setLoading(true)

    try {
      // Add comment using mock data function
      addMockComment(blogId, content, currentUserId, currentUserName)

      // Success: clear form and refresh
      setContent("")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mb-6">
        <p className="text-gray-700 mb-3">
          Please log in to leave a comment
        </p>
        <Button asChild>
          <Link href="/auth/login">Log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="space-y-3">
        {/* Comment Input */}
        <div className="space-y-2">
          <Label htmlFor="comment">Add a comment</Label>
          <Textarea
            id="comment"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  )
}
