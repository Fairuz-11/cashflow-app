"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  // Show max 5 page buttons
  let visiblePages = pages
  if (totalPages > 5) {
    if (currentPage <= 3) {
      visiblePages = [...pages.slice(0, 4), -1, totalPages]
    } else if (currentPage >= totalPages - 2) {
      visiblePages = [1, -1, ...pages.slice(totalPages - 4)]
    } else {
      visiblePages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages]
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, idx) => {
          if (page === -1) {
            return <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  )
}
