import Link from "next/link"
import { SearchX, FileText } from "lucide-react"

interface EmptyStateProps {
  searchQuery?: string
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      {searchQuery ? (
        <SearchX className="h-16 w-16 text-gray-300 mb-4" />
      ) : (
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
      )}

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        {searchQuery ? "No results found" : "No blog posts yet"}
      </h2>

      {/* Description */}
      <p className="text-gray-500 mb-6 max-w-md">
        {searchQuery ? (
          <>
            We couldn&apos;t find any posts matching{" "}
            <span className="font-medium text-gray-700">
              &quot;{searchQuery}&quot;
            </span>
            . Try searching with different keywords.
          </>
        ) : (
          "There are no blog posts available at the moment. Check back later!"
        )}
      </p>

      {/* Action */}
      {searchQuery && (
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          View all posts
        </Link>
      )}
    </div>
  )
}
