import { useState, type ReactNode } from 'react'
import { SERVICES, DISTRICTS_WITH_ALL } from '../utils/constants'
import type { FilterState } from '../types'

interface FilterSectionProps {
  title: string
  id: string
  defaultOpen?: boolean
  children: ReactNode
}

function FilterSection({ title, id, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls={id}
        className="w-full flex items-center justify-between mb-4 cursor-pointer"
      >
        <span className="font-display text-[14px] font-semibold text-ink">{title}</span>
        <svg
          aria-hidden="true"
          className={`w-4 h-4 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && <div id={id}>{children}</div>}
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function hasActiveFilters(filters: FilterState) {
  return (
    filters.services.length > 0 ||
    filters.district !== 'All districts' ||
    filters.minRating > 0 ||
    filters.priceMin > 1 ||
    filters.priceMax < 3
  )
}

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  resultCount?: number
  mobile?: boolean
  onApply?: () => void
}

export default function FilterSidebar({ filters, onFilterChange, resultCount = 0, mobile = false, onApply }: FilterSidebarProps) {
  const priceStyle = (() => {
    const min = filters.priceMin || 1
    const max = filters.priceMax || 3
    const rangeMin = 1
    const rangeMax = 3
    const pctMin = ((min - rangeMin) / (rangeMax - rangeMin)) * 100
    const pctMax = ((max - rangeMin) / (rangeMax - rangeMin)) * 100
    return {
      left: `${pctMin}%`,
      width: `${pctMax - pctMin}%`
    }
  })()

  const handleServiceChange = (serviceId: string) => {
    const newServices = filters.services.includes(serviceId) ? [] : [serviceId]
    onFilterChange({ ...filters, services: newServices })
  }

  const handleDistrictChange = (district: string) => {
    onFilterChange({ ...filters, district })
  }

  const handleRatingChange = (minRating: number) => {
    onFilterChange({ ...filters, minRating })
  }

  const clearAllFilters = () => {
    onFilterChange({
      services: [],
      district: 'All districts',
      priceMin: 1,
      priceMax: 3,
      minRating: 0,
      search: '',
    })
  }

  const content = (
    <>
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="font-display text-[16px] font-semibold text-ink">Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-[13px] font-medium font-body text-primary hover:underline cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Clear all
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <h3 className="font-display text-[14px] font-semibold text-ink mb-2">Search</h3>
          <div className="relative">
            <input
              type="text"
              name="search"
              aria-label="Search salons"
              autoComplete="off"
              placeholder="Salon name, service, district…"
              spellCheck={false}
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full h-[40px] px-3 pr-9 border border-hairline rounded-[8px] font-body text-[13px] text-ink placeholder-muted-soft focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors duration-200"
            />
            <svg
              aria-hidden="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* Services */}
        <FilterSection title="Services" id="services-list">
          <div className="space-y-1">
            {SERVICES.map(service => {
              const Icon = service.icon
              return (
                <label
                  key={service.id}
                  className="flex items-center gap-3 py-1 px-3 rounded-[6px] hover:bg-surface-soft cursor-pointer transition-colors duration-200 mb-2"
                >
                  <input
                    type="radio"
                    name="service"
                    checked={filters.services.includes(service.id)}
                    onChange={() => handleServiceChange(service.id)}
                    className="w-4 h-4 rounded-full border-hairline text-primary focus-visible:ring-primary cursor-pointer"
                  />
                  <Icon />
                  <span className="font-body text-[13px] text-body">{service.label}</span>
                </label>
              )
            })}
          </div>
        </FilterSection>

        {/* District */}
        <FilterSection title="District" id="district-select" defaultOpen={true}>
          <select
            value={filters.district}
            aria-label="Filter by district"
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full h-[40px] px-3 border border-hairline rounded-[8px] font-body text-[13px] text-ink bg-canvas focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer transition-colors duration-200"
          >
            {DISTRICTS_WITH_ALL.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price range" id="price-range" defaultOpen={true}>
          <div className="px-1">
            <div className="relative h-[20px] w-full">
              <div className="absolute top-[8px] left-0 right-0 h-[4px] bg-hairline rounded-full" />
              <div
                className="absolute top-[8px] h-[4px] bg-primary rounded-full"
                style={{ left: priceStyle.left, width: priceStyle.width }}
              />
              <input
                type="range"
                name="priceMin"
                aria-label="Minimum price level"
                min="1"
                max="3"
                step="1"
                value={filters.priceMin}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  onFilterChange({ ...filters, priceMin: Math.min(val, filters.priceMax) })
                }}
                className="absolute top-0 left-0 w-full h-[20px] appearance-none bg-transparent pointer-events-none z-[2] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[3]"
              />
              <input
                type="range"
                name="priceMax"
                aria-label="Maximum price level"
                min="1"
                max="3"
                step="1"
                value={filters.priceMax}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  onFilterChange({ ...filters, priceMax: Math.max(val, filters.priceMin) })
                }}
                className="absolute top-0 left-0 w-full h-[20px] appearance-none bg-transparent pointer-events-none z-[2] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[3]"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-body text-[12px] font-medium text-muted">zł</span>
              <span className="font-body text-[12px] font-medium text-muted">zł zł</span>
              <span className="font-body text-[12px] font-medium text-muted">zł zł zł</span>
            </div>
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating" id="rating-options" defaultOpen={true}>
          <div className="flex gap-2" role="radiogroup" aria-label="Minimum rating">
            {[0, 3, 4, 4.5].map(rating => (
              <button
                key={rating}
                role="radio"
                aria-checked={filters.minRating === rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex-1 h-[40px] border rounded-[8px] font-body text-[13px] font-medium cursor-pointer transition-colors duration-200 flex items-center justify-center gap-1 ${
                  filters.minRating === rating
                    ? 'bg-primary-light border-primary text-primary'
                    : 'bg-canvas border-hairline text-body hover:border-primary'
                }`}
              >
                {rating === 0 ? (
                  'Any'
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={filters.minRating === rating ? '#E8385C' : 'none'}
                      stroke={filters.minRating === rating ? '#E8385C' : 'currentColor'}
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {`${rating}+`}
                  </>
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        <button
          onClick={onApply}
          className="w-full h-[44px] bg-primary hover:bg-primary-hover text-white rounded-[8px] font-display text-[14px] font-semibold cursor-pointer transition-colors duration-200 mt-6"
        >
          Show {resultCount} salons
        </button>
    </>
  )

  if (mobile) {
    return content
  }

  return (
    <div className="hidden min-[1800px]:block w-[380px] flex-shrink-0 h-full max-h-[calc(100vh-112px)]">
      <div className="bg-canvas border-[0.01px] border-hairline rounded-[14px] p-4 h-full flex flex-col">
        {content}
      </div>
    </div>
  )
}
