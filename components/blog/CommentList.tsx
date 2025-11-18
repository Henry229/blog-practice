"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import type { Comment } from "@/types/comment"

interface CommentListProps {
  comments: Comment[]
  currentUserId?: string
}

export function CommentList({ comments, currentUserId }: CommentListProps) {
  // Handle delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    // TODO: Implement delete logic (Server Action)
    console.log("Delete comment:", commentId)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get author initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <ul className="space-y-4 mt-6">
      {comments.map((comment) => {
        const isAuthor = currentUserId === comment.authorId
        const initials = getInitials(comment.authorName)
        const formattedDate = formatDate(comment.createdAt)

        return (
          <li key={comment.id}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">
                          {comment.authorName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formattedDate}
                        </p>
                      </div>

                      {/* Delete Button (Author only) */}
                      {isAuthor && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
