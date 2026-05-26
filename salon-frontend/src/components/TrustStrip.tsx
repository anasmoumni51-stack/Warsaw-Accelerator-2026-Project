import { memo } from "react";

export default memo(function TrustStrip() {
  return (
    <div>
      <div className="bg-canvas border-[0.25px] border-hairline rounded-[14px] p-4 md:p-4 grid grid-cols-1 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-4 gap-4 md:gap-5 items-center justify-items-center">
        {/* Explore */}
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="w-10 h-10 min-[1024px]:w-16 min-[1024px]:h-16 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8385C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div>
            <h4 className="font-display text-[14px] font-semibold text-ink">
              Explore
            </h4>
            <p className="font-body text-[13px] text-muted mt-0.5">
              Discover salons by services, location and ratings.
            </p>
          </div>
        </div>

        {/* Discover on the Map */}
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="w-10 h-10 min-[1024px]:w-12 min-[1024px]:h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8385C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h4 className="font-display text-[14px] font-semibold text-ink">
              Discover on the Map
            </h4>
            <p className="font-body text-[13px] text-muted mt-0.5">
              Browse salons visually and find the closest one to you.
            </p>
          </div>
        </div>

        {/* Modify */}
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="w-10 h-10 min-[1024px]:w-12 min-[1024px]:h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8385C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
          <div>
            <h4 className="font-display text-[14px] font-semibold text-ink">
              Modify
            </h4>
            <p className="font-body text-[13px] text-muted mt-0.5">
              Edit and update your salon details at any time.
            </p>
          </div>
        </div>

        {/* Trust */}
        <div className="flex flex-row items-center gap-3 w-full">
          <div className="w-10 h-10 min-[1024px]:w-12 min-[1024px]:h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8385C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="font-display text-[14px] font-semibold text-ink">
              Trust
            </h4>
            <p className="font-body text-[13px] text-muted mt-0.5">
              Real data, real reviews, real places.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
