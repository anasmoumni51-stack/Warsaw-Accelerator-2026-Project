import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import FilterSidebar, { hasActiveFilters } from "../components/FilterSidebar";
import SalonCard from "../components/SalonCard";
import SalonListHeader from "../components/SalonListHeader";
import Footer from "../components/Footer";
import TrustStrip from "../components/TrustStrip";
import Spinner from "../components/Spinner";
import Dialog, { DialogHeader, DialogBody } from "../components/Dialog";
import Pagination from "../components/Pagination";
import MapPanel from "../components/MapPanel";
import { useSalonFilters } from "../hooks/useSalonFilters";
import type { SalonSummary, FilterState } from "../types";

interface HomePageProps {
  salons: SalonSummary[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements: number;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function HomePage({
  salons,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  filters,
  setFilters,
  sortBy,
  setSortBy,
}: HomePageProps) {
  const { filteredSalons } = useSalonFilters(salons, filters, sortBy);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlInitialized = useRef(false);

  // Read initial state from URL on mount
  useEffect(() => {
    if (urlInitialized.current) return;
    urlInitialized.current = true;

    const p = new URLSearchParams(searchParams);
    let changed = false;
    const newFilters = { ...filters };

    const search = p.get("search");
    const district = p.get("district");
    const services = p.get("services");
    const rating = p.get("rating");
    const sort = p.get("sort");
    const page = p.get("page");
    if (search) {
      newFilters.search = search;
      changed = true;
    }
    if (district) {
      newFilters.district = district;
      changed = true;
    }
    if (services) {
      newFilters.services = services.split(",");
      changed = true;
    }
    if (rating) {
      newFilters.minRating = Number(rating);
      changed = true;
    }
    if (sort) {
      setSortBy(sort);
      changed = true;
    }
    if (page) {
      onPageChange(Number(page));
      changed = true;
    }

    if (changed) setFilters(newFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state → URL
  useEffect(() => {
    if (!urlInitialized.current) return;
    const p = new URLSearchParams();
    if (filters.search) p.set("search", filters.search);
    if (filters.district !== "All districts")
      p.set("district", filters.district);
    if (filters.services.length > 0)
      p.set("services", filters.services.join(","));
    if (filters.minRating > 0) p.set("rating", String(filters.minRating));
    if (sortBy !== "relevant") p.set("sort", sortBy);
    if (currentPage > 0) p.set("page", String(currentPage));
    setSearchParams(p, { replace: true });
  }, [filters, sortBy, currentPage, setSearchParams]);

  const handleOpenFilters = () => setMobileFiltersOpen(true);
  const handleCloseFilters = () => setMobileFiltersOpen(false);
  const handleSelectSalon = (id: number) => {
    setSelectedSalonId(id);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-[1400px]:h-screen min-[1400px]:overflow-hidden bg-canvas flex flex-col">
        <Navbar />
        <main
          id="main-content"
          className="flex-1 min-[1400px]:flex-1 min-[1400px]:min-h-0 px-4 py-4 md:px-6 md:py-6 min-[1400px]:flex min-[1400px]:flex-col min-[1400px]:gap-6"
        >
          <div className="flex flex-col min-[1400px]:flex-row gap-4 md:gap-6 min-[1400px]:flex-1 min-[1400px]:min-h-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredSalons.length}
            />
            <div className="flex-1 min-w-0 min-[1400px]:overflow-y-auto pr-0 min-[1400px]:pr-2 custom-scrollbar">
              <SalonListHeader
                salonCount={totalElements}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onOpenFilters={handleOpenFilters}
                hasActiveFilters={hasActiveFilters(filters)}
              />
              <div className="space-y-3 md:space-y-4">
                {filteredSalons.length > 0 ? (
                  <>
                    {filteredSalons.map((salon) => (
                      <SalonCard
                        key={salon.id}
                        salon={salon}
                        onSelectSalon={handleSelectSalon}
                      />
                    ))}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
                    />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="font-body text-[16px] text-muted">
                      No salons match your filters.
                    </p>
                    <p className="font-body text-[14px] text-muted-soft mt-1">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div
              ref={mapRef}
              className="relative z-0 hidden min-[100px]:block w-full min-[1400px]:flex-1 min-[1400px]:min-w-0 h-[300px] min-[1400px]:h-full"
            >
              <MapPanel
                salons={filteredSalons}
                selectedSalonId={selectedSalonId}
              />
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:-mb-4 min-[1700px]:flex-shrink-0">
            <TrustStrip />
          </div>
        </main>
      </div>

      {/* Mobile Filter Dialog */}
      <Dialog open={mobileFiltersOpen} onClose={handleCloseFilters}>
        <DialogHeader onClose={handleCloseFilters}>
          <h3 className="font-display text-[16px] font-semibold text-ink">
            Filters
          </h3>
        </DialogHeader>
        <DialogBody>
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredSalons.length}
            mobile
            onApply={handleCloseFilters}
          />
        </DialogBody>
      </Dialog>

      <div className="mt-2">
        <Footer />
      </div>
    </>
  );
}
