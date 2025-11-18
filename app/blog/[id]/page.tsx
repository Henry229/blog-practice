import { notFound } from "next/navigation"
import { PageContainer } from "@/components/layout/PageContainer"
import { BlogPost } from "@/components/blog/BlogPost"
import { CommentList } from "@/components/blog/CommentList"
import { CommentForm } from "@/components/blog/CommentForm"
import { Separator } from "@/components/ui/separator"
import { getMockBlogById } from "@/lib/data/mockBlogs"
import { getMockComments } from "@/lib/data/mockComments"
import { createClient } from "@/lib/supabase/server"

interface PostDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params

  // Get blog data
  const blog = getMockBlogById(id)

  // If blog not found, show 404
  if (!blog) {
    notFound()
  }

  // Get comments for this blog
  const comments = getMockComments(id)

  // Get current user from auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isLoggedIn = !!user
  const currentUserId = user?.id
  const currentUserName = user?.email || user?.user_metadata?.name || "Anonymous"
  const isAuthor = user?.id === blog.authorId

  return (
    <PageContainer className="py-8">
      <div className="max-w-3xl mx-auto">
        {/* Blog Post */}
        <BlogPost blog={blog} isAuthor={isAuthor} />

        {/* Separator */}
        <Separator className="my-8" />

        {/* Comments Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form (if logged in) */}
          <CommentForm
            blogId={blog.id}
            isLoggedIn={isLoggedIn}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />

          {/* Comment List */}
          <CommentList comments={comments} currentUserId={currentUserId} />
        </section>
      </div>
    </PageContainer>
  )
}
