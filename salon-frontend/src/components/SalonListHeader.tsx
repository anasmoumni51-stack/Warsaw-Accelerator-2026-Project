import { useState, useRef, useCallback } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Most relevant' },
  { value: 'rating', label: 'Highest rating' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

interface SalonListHeaderProps {
  salonCount?: number
  sortBy: string
  onSortChange: (sort: string) => void
  onOpenFilters?: () => void
  hasActiveFilters?: boolean
}

export default function SalonListHeader({ salonCount = 120, sortBy, onSortChange, onOpenFilters, hasActiveFilters = false }: SalonListHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeDropdown = useCallback(() => setShowDropdown(false), [])
  useClickOutside(dropdownRef, closeDropdown, showDropdown)

  return (
    <div className="mb-5">
      {/* Title Section */}
      <div className="mb-4">
        <h1 className="font-display text-[18px] min-[768px]:text-[28px] font-semibold text-ink leading-[1.3] tracking-[-0.3px] mb-2 min-[768px]:mb-3" style={{ textWrap: 'balance' }}>
          Discover beauty salons in Warsaw
        </h1>
        <p className="font-body text-[13px] min-[768px]:text-[16px] text-muted">
          Find and explore top-rated salons near you.
        </p>
      </div>

      {/* Results Count + Sort */}
      <div className="flex items-center justify-between">
        <span className="font-body text-[13px] min-[768px]:text-[14px] text-muted">
          {salonCount} salons found
        </span>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          {onOpenFilters && (
            <button
              onClick={onOpenFilters}
              className="min-[1800px]:hidden flex items-center gap-2 px-3 py-2 bg-canvas border-[0.25px] border-hairline rounded-[8px] font-body text-[13px] text-body cursor-pointer hover:border-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(prev => !prev)}
              aria-haspopup="true"
              aria-expanded={showDropdown}
              className="flex items-center gap-2 px-3 py-2 bg-canvas border-[0.25px] border-hairline rounded-[8px] font-body text-[13px] text-body cursor-pointer hover:border-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="hidden sm:inline">Sort by:</span>
              <span className="font-medium">
                {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
              </span>
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-canvas border-[0.25px] border-hairline rounded-[8px] shadow-lg overflow-hidden z-10" role="menu">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    role="menuitem"
                    onClick={() => {
                      onSortChange(option.value)
                      setShowDropdown(false)
                    }}
                    className={`w-full px-4 py-3 text-left font-body text-[14px] cursor-pointer transition-colors duration-200 ${
                      sortBy === option.value
                        ? 'bg-primary-light text-primary font-semibold'
                        : 'text-body hover:bg-surface-soft'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
