import { notFound } from "next/navigation"
import { PageContainer } from "@/components/layout/PageContainer"
import { BlogPost } from "@/components/blog/BlogPost"
import { CommentList } from "@/components/blog/CommentList"
import { CommentForm } from "@/components/blog/CommentForm"
import { Separator } from "@/components/ui/separator"
import { getMockComments } from "@/lib/data/mockComments"
import { createClient } from "@/lib/supabase/server"

interface PostDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params

  // Get Supabase client
  const supabase = await createClient()

  // Get blog data from Supabase with author profile
  const { data: blogData, error } = await supabase
    .from("blogs")
    .select(`
      *,
      profiles!author_id (
        first_name,
        last_name,
        email
      )
    `)
    .eq("id", id)
    .single()

  // If blog not found, show 404
  if (error || !blogData) {
    notFound()
  }

  // Transform Supabase data to match Blog type
  const profile = blogData.profiles as { first_name?: string; last_name?: string; email?: string } | null
  const authorName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown'
    : 'Unknown'

  const blog = {
    id: blogData.id,
    title: blogData.title,
    content: blogData.content,
    authorId: blogData.author_id,
    authorName,
    authorAvatar: undefined,
    createdAt: blogData.created_at,
    updatedAt: blogData.updated_at,
  }

  // Get comments for this blog
  const comments = getMockComments(id)

  // Get current user from auth
  const { data: { user } } = await supabase.auth.getUser()

  const isLoggedIn = !!user
  const currentUserId = user?.id
  const currentUserName = user?.email || user?.user_metadata?.name || "Anonymous"
  const isAuthor = user?.id === blogData.author_id

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
