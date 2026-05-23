import { useEffect, useRef, type ReactNode } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function Dialog({ open, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useClickOutside(dialogRef, onClose, open)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-end sm:items-center justify-center pointer-events-none">
        <div
          ref={dialogRef}
          className="pointer-events-auto bg-canvas rounded-t-[16px] sm:rounded-[16px] shadow-xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto mx-0 sm:mx-4"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

interface DialogHeaderProps {
  children: ReactNode
  onClose: () => void
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-hairline sticky top-0 bg-canvas z-10">
      {children}
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface-soft transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  )
}

interface DialogBodyProps {
  children: ReactNode
}

export function DialogBody({ children }: DialogBodyProps) {
  return <div className="p-4">{children}</div>
}
