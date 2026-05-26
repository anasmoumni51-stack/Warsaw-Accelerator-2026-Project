import { Link } from "react-router-dom";
import type { SalonSummary } from "../types";

interface SalonCardProps {
  salon: SalonSummary;
  onSelectSalon?: (id: number) => void;
}

export default function SalonCard({ salon, onSelectSalon }: SalonCardProps) {
  return (
    <div className="bg-canvas border-[0.10px] border-hairline rounded-[14px] hover:border-primary hover:border transition-[border-color] duration-200 flex flex-col md:flex-row">
      {/* Photo */}
      <div className="relative w-full h-[180px] md:w-[280px] md:h-[200px] flex-shrink-0 overflow-hidden rounded-t-[14px] md:rounded-l-[14px] md:rounded-tr-none">
        <img
          src={salon.imageUrl}
          alt={salon.name}
          width="280"
          height="200"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-3 md:p-3 flex flex-col justify-between">
        {/* Header row */}
        <div className="flex justify-between items-start gap-2 mb-2 md:mb-3">
          <h3 className="font-display text-[16px] md:text-[18px] font-semibold text-ink leading-tight line-clamp-1">
            {salon.name}
          </h3>
          <span className="font-body text-[12px] font-medium text-muted whitespace-nowrap">
            {salon.priceRange}
          </span>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-3 mb-2 md:mb-3">
          <div className="flex items-center gap-1">
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#E8385C"
              stroke="#E8385C"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="font-body text-[13px] font-semibold text-ink">
              {salon.rating}
            </span>
            <span className="font-body text-[13px] text-muted">
              ({salon.reviewCount})
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted">
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
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-body text-[13px]">{salon.district}</span>
          </div>
        </div>

        {/* Service tags */}
        <div className="flex flex-wrap gap-1.5 mb-3 md:mb-1.5">
          {salon.services.map((service) => (
            <span
              key={service}
              className="px-2.5 py-0.5 bg-primary-light rounded-full font-body text-[11px] font-medium text-primary"
            >
              {service}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Link
            to={`/salon/${salon.id}`}
            className="w-full md:w-auto px-4 md:px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-[8px] font-body text-[13px] font-semibold cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary whitespace-nowrap text-center"
          >
            View details
          </Link>
          <button
            onClick={() => onSelectSalon?.(salon.id)}
            className="w-full md:w-auto px-4 md:px-6 py-2 bg-canvas border border-hairline text-body rounded-[8px] font-body text-[13px] font-medium hover:border-primary cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary whitespace-nowrap"
          >
            View on Map
          </button>
        </div>
      </div>
    </div>
  );
}
