import type { SalonSummary, FilterState } from '../types'

function priceToLevel(price: string): number {
  return price.split(' ').length
}

// Only handle client-side filters (search, price, rating) and sorting
// District and service filters are handled server-side via API
export function useSalonFilters(salons: SalonSummary[], filters: FilterState, _sortBy: string) {
  const filteredSalons = salons.filter(salon => {
    if (filters.search) {
      const query = filters.search.toLowerCase()
      const matchesSearch =
        salon.name.toLowerCase().includes(query) ||
        salon.district.toLowerCase().includes(query) ||
        salon.services?.some(s => s.toLowerCase().includes(query))
      if (!matchesSearch) return false
    }

    if (salon.priceRange) {
      const salonPriceLevel = priceToLevel(salon.priceRange)
      if (salonPriceLevel < filters.priceMin || salonPriceLevel > filters.priceMax) {
        return false
      }
    }

    if (filters.minRating > 0 && salon.rating < filters.minRating) {
      return false
    }

    return true
  })

  return { filteredSalons }
}
