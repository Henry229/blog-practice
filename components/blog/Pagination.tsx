import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  searchQuery?: string
}

export function Pagination({
  currentPage,
  totalPages,
  searchQuery = "",
}: PaginationProps) {
  // Build URL with query params
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (page > 1) params.set("page", page.toString())
    return `/?${params.toString()}`
  }

  // Generate page numbers to display (max 5)
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show subset of pages with current page in center
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)

      // Adjust if near boundaries
      if (currentPage <= 3) {
        start = 1
        end = maxVisible
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1
        end = totalPages
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8"
      aria-label="pagination"
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        asChild={currentPage !== 1}
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
      >
        {currentPage === 1 ? (
          <span className="cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
          </span>
        ) : (
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        )}
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          asChild={page !== currentPage}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page === currentPage ? (
            <span>{page}</span>
          ) : (
            <Link href={buildUrl(page)}>{page}</Link>
          )}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        asChild={currentPage !== totalPages}
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
      >
        {currentPage === totalPages ? (
          <span className="cursor-not-allowed">
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link href={buildUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </nav>
  )
}
