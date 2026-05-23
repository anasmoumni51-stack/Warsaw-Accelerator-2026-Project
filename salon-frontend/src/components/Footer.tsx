import { memo } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES } from '../utils/constants'

export default memo(function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      {/* Main footer content */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="7" r="4.5" fill="white" />
                  <path d="M12 13c-3.5 0-5.5 2-5.5 5v1h11v-1c0-3-2-5-5.5-5z" fill="white" />
                  <path d="M8.5 5.5c0-2 1.5-3.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-[18px] font-semibold text-ink">Warsaw Beauty</span>
                <span className="font-body text-[12px] font-medium text-primary">Salon Explorer</span>
              </div>
            </div>
            <p className="font-body text-[13px] text-muted leading-relaxed">
              Discover and explore the best beauty salons in Warsaw. Find top-rated professionals near you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-[14px] font-semibold text-ink mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="font-body text-[13px] text-muted hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Explore Salons
                </Link>
              </li>
              <li>
                <button className="font-body text-[13px] text-muted hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-[14px] font-semibold text-ink mb-4">Services</h4>
            <ul className="space-y-2.5">
              {SERVICES.map(service => (
                <li key={service.id}>
                  <Link to={`/?services=${service.id}`} className="font-body text-[13px] text-muted hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-[14px] font-semibold text-ink mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <button className="font-body text-[13px] text-muted hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="font-body text-[13px] text-muted hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="font-body text-[13px] text-muted hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal band */}
      <div className="border-t border-hairline-soft">
        <div className="px-6 py-3 max-w-[1440px] mx-auto flex items-center justify-center">
          <p className="font-body text-[12px] text-muted-soft">
            © 2026 Warsaw Beauty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
})
