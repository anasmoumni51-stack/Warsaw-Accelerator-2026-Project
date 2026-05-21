import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ExploreIcon, SalonsIcon, AboutIcon } from './icons'
import { useClickOutside } from '../hooks/useClickOutside'

const NAV_ITEMS = [
  { label: 'Explore', icon: ExploreIcon, href: '/', clickable: true },
  { label: 'About', icon: AboutIcon, href: '/about', clickable: false },
  { label: 'Edit Salons', icon: SalonsIcon, href: '/edit-salons', clickable: false },
]

interface NavbarProps {
  activeItem?: string
}

export default function Navbar({ activeItem = 'Explore' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  useClickOutside(dropdownRef, closeMobile, mobileOpen)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-btn focus:font-body focus:text-[14px] focus:font-medium"
      >
        Skip to content
      </a>
      <nav className="sticky top-0 z-50 bg-canvas border-b border-hairline h-16 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6 pt-[env(safe-area-inset-top)]">
        <Link
        to="/"
        className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary justify-self-start"
      >
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="7" r="4.5" fill="white" />
            <path d="M12 13c-3.5 0-5.5 2-5.5 5v1h11v-1c0-3-2-5-5.5-5z" fill="white" />
            <path d="M8.5 5.5c0-2 1.5-3.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="font-display text-[20px] font-semibold text-ink">Warsaw Beauty</span>
          <span className="font-body text-[13px] font-medium text-primary">Salon Explorer</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <DesktopNavLink key={item.label} {...item} active={item.label === activeItem} />
        ))}
      </div>

      <div className="flex items-center gap-3 justify-self-end">
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-btn border border-hairline text-muted cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-16 left-0 right-0 bg-canvas border-b border-hairline shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] md:hidden overscroll-behavior-contain"
        >
          <div className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <MobileNavLink key={item.label} {...item} active={item.label === activeItem} onNavigate={() => setMobileOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </nav>
    </>
  )
}

interface NavLinkProps {
  label: string
  icon: React.ComponentType<{ size: number }>
  active: boolean
  href: string
  clickable: boolean
  onNavigate?: () => void
}

function DesktopNavLink({ label, icon: Icon, active, href, clickable }: NavLinkProps) {
  const cls = `flex items-center gap-1.5 px-3 h-16 font-body text-[16px] font-medium border-b-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    active ? 'text-primary border-primary' : 'text-muted border-transparent'
  } ${clickable ? 'hover:text-ink' : ''}`

  if (clickable) {
    return <Link to={href} className={cls}><Icon size={18} />{label}</Link>
  }

  return <span className={cls}><Icon size={18} />{label}</span>
}

function MobileNavLink({ label, icon: Icon, active, href, clickable, onNavigate }: NavLinkProps) {
  const cls = `flex items-center gap-3 px-6 py-3 font-body text-[16px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    active ? 'text-primary' : 'text-muted'
  } ${clickable ? 'hover:bg-surface-soft' : ''}`

  if (clickable) {
    return <Link to={href} className={cls} onClick={onNavigate}><Icon size={18} />{label}</Link>
  }

  return <span className={cls}><Icon size={18} />{label}</span>
}
