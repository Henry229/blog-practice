import { PageContainer } from "@/components/layout/PageContainer";
import { getMockBlogs } from "@/lib/data/mockBlogs";
import { formatDate } from "@/lib/utils/date";

export default function Home() {
  const blogs = getMockBlogs();

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Latest Posts
          </h1>
          <p className="text-gray-600">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </div>

        {/* Blog Grid - Phase 2에서 BlogCard 컴포넌트로 교체 예정 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="p-6 space-y-3">
                <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                  {blog.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>By {blog.authorName}</span>
                  <span>•</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <p className="text-gray-700 line-clamp-3">
                  {blog.content.split('\n\n')[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
