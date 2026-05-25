import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Slide, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from './pages/HomePage'
import SalonDetailPage from './pages/SalonDetailPage'
import { getSalons, updateSalon } from './services/api'
import { SERVICES } from './utils/constants'
import type { SalonSummary, SalonDetail, FilterState } from './types'

const PAGE_SIZE = 20

function getServiceLabel(serviceIds: string[]): string | null {
  if (!serviceIds || serviceIds.length === 0) return null
  const service = SERVICES.find(s => s.id === serviceIds[0])
  return service ? service.label : null
}

function getApiSort(sortBy: string): { sort: string; orderBy: string } {
  switch (sortBy) {
    case 'rating':
      return { sort: 'rating', orderBy: 'DESC' }
    case 'price-low':
      return { sort: 'priceRange', orderBy: 'ASC' }
    case 'price-high':
      return { sort: 'priceRange', orderBy: 'DESC' }
    case 'relevant':
    default:
      return { sort: 'reviewCount', orderBy: 'DESC' }
  }
}

function validateSalonForUpdate(salon: SalonDetail): string[] {
  const requiredFields: (keyof SalonDetail)[] = ['name', 'address', 'phone', 'website', 'district'];
  return requiredFields.filter(field => {
    const value = salon[field];
    return typeof value !== 'string' || !value.trim();
  });
}

function mapSalonToUpdateDto(salon: SalonDetail) {
  return {
    name: salon.name.trim(),
    address: salon.address.trim(),
    streetNumber: salon.streetNumber?.trim() || null,
    city: salon.city?.trim() || null,
    country: salon.country?.trim() || null,
    postcode: salon.postcode?.trim() || null,
    phone: salon.phone || '',
    website: salon.website || '',
    services: salon.services || [],
    district: salon.district.trim(),
    priceRange: salon.priceRange || null,
    rating: salon.rating ?? 0,
    reviewCount: salon.reviewCount ?? 0,
  };
}

const DEFAULT_FILTERS: FilterState = {
  services: [],
  district: 'All districts',
  priceMin: 1,
  priceMax: 3,
  minRating: 0,
  search: '',
}

function App() {
  const [salons, setSalons] = useState<SalonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState('relevant')

  // Serialize services array to a stable string for useEffect dependency
  const servicesKey = filters.services.join(',')

  useEffect(() => {
    const apiFilters: { district: string; service?: string } = {
      district: filters.district,
    }
    const serviceLabel = getServiceLabel(filters.services)
    if (serviceLabel) apiFilters.service = serviceLabel

    const apiSort = getApiSort(sortBy)

    getSalons(currentPage, PAGE_SIZE, apiSort.sort, apiSort.orderBy, apiFilters)
      .then(data => {
        setSalons(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
      })
      .catch(() => toast.error('Failed to load salons'))
      .finally(() => setLoading(false))
  }, [currentPage, filters.district, servicesKey, sortBy])

  const handlePageChange = (newPage: number) => {
    setLoading(true)
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (newSort: string) => {
    setLoading(true)
    setSortBy(newSort)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    if (newFilters.district !== filters.district ||
        JSON.stringify(newFilters.services) !== JSON.stringify(filters.services)) {
      setCurrentPage(0)
    }
  }

  const handleUpdateSalon = async (updatedSalon: SalonDetail) => {
    try {
      const missingFields = validateSalonForUpdate(updatedSalon)
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`)
        return
      }

      const updateData = mapSalonToUpdateDto(updatedSalon)
      const result = await updateSalon(updatedSalon.id, updateData)
      setSalons(prev =>
        prev.map(salon => salon.id === result.id ? result : salon)
      )
      toast.success('Salon updated successfully')
    } catch (error) {
      console.error('Update failed:', error)
      toast.error((error as Error).message || 'Failed to update salon')
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              salons={salons}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={handlePageChange}
              filters={filters}
              setFilters={handleFilterChange}
              sortBy={sortBy}
              setSortBy={handleSortChange}
            />
          }
        />
        <Route
          path="/salon/:id"
          element={
            <SalonDetailPage
              onUpdateSalon={handleUpdateSalon}
            />
          }
        />
      </Routes>
      <ToastContainer autoClose={2000} transition={Slide} />
    </BrowserRouter>
  )
}

export default App
