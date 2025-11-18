import { PageContainer } from "@/components/layout/PageContainer"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { BlogCard } from "@/components/blog/BlogCard"
import { Pagination } from "@/components/blog/Pagination"
import { EmptyState } from "@/components/blog/EmptyState"
import { getMockBlogs, searchMockBlogs } from "@/lib/data/mockBlogs"

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

  // Get blogs (search or all)
  const allBlogs = searchQuery
    ? searchMockBlogs(searchQuery)
    : getMockBlogs()

  // Pagination
  const totalPages = Math.ceil(allBlogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const blogs = allBlogs.slice(startIndex, startIndex + itemsPerPage)

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
