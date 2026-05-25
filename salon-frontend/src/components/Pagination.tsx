interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Sliding window of 5 pages centered on current page
  const WINDOW = 5
  const half = Math.floor(WINDOW / 2)
  let start = Math.max(0, currentPage - half)
  const end = Math.min(totalPages, start + WINDOW)
  start = Math.max(0, end - WINDOW)

  const pageNumbers = []
  for (let i = start; i < end; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 bg-canvas border border-hairline rounded-[8px] font-body text-[13px] font-medium text-body hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← Previous
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum) => {
          const isCurrent = pageNum === currentPage
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-[6px] font-body text-[13px] transition-colors ${
                isCurrent
                  ? 'bg-primary text-white'
                  : 'bg-canvas border border-hairline text-body hover:border-primary'
              }`}
            >
              {pageNum + 1}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 bg-canvas border border-hairline rounded-[8px] font-body text-[13px] font-medium text-body hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>

      <span className="ml-4 font-body text-[12px] text-muted">
        Page {currentPage + 1} of {totalPages}
      </span>
    </div>
  )
}
