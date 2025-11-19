import { PageContainer } from "@/components/layout/PageContainer"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { BlogCard } from "@/components/blog/BlogCard"
import { Pagination } from "@/components/blog/Pagination"
import { EmptyState } from "@/components/blog/EmptyState"
import { createClient } from "@/lib/supabase/server"
import type { Blog } from "@/types/blog"

interface HomePageProps {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const searchQuery = params.search || ""
  const currentPage = parseInt(params.page || "1")
  const itemsPerPage = 9

  // Get Supabase client
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  // Add search filter if provided
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
  }

  // Add pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  query = query.range(startIndex, startIndex + itemsPerPage - 1)

  // Execute query
  const { data: blogData, count, error: queryError } = await query

  if (queryError) {
    console.error("Query error:", queryError)
  }

  // Get unique author IDs
  const authorIds = [...new Set((blogData || []).map(blog => blog.author_id))]

  // Fetch profiles for all authors
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name, email")
    .in("user_id", authorIds)

  // Create a map of profiles
  const profilesMap = new Map(
    (profilesData || []).map(p => [p.user_id, p])
  )

  // Transform Supabase data to Blog type
  const blogs: Blog[] = (blogData || []).map((blog) => {
    const profile = profilesMap.get(blog.author_id)
    const authorName = profile
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown'
      : 'Unknown'

    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      authorId: blog.author_id,
      authorName,
      authorAvatar: undefined,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    }
  })

  // Calculate total pages
  const totalPages = Math.ceil((count || 0) / itemsPerPage)

  return (
    <PageContainer className="bg-gray-50 min-h-screen">
      {blogs.length === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : (
        <>
          <BlogGrid>
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </BlogGrid>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              searchQuery={searchQuery}
            />
          )}
        </>
      )}
    </PageContainer>
  )
}
