export const ScissorsIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>
  </svg>
)

export const SparklesIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18"/><path d="m16 9 4 4-4 4"/><path d="m8 9-4 4 4 4"/><path d="M3 12h18"/>
  </svg>
)

export const NailCareIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 10h12v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z"/><path d="M10 10V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/><path d="M8 10V8"/><path d="M16 10V8"/><path d="M6 10h12"/>
  </svg>
)

export const LeafIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)

export const RazorIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h4v4H4z"/><path d="M4 16h4v4H4z"/><path d="M16 4h4v4h-4z"/><path d="M16 16h4v4h-4z"/><line x1="8" y1="8" x2="16" y2="16"/><line x1="8" y1="16" x2="16" y2="8"/>
  </svg>
)

export const LipstickIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8385C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 20h8"/><path d="M9 20v-4"/><path d="M15 20v-4"/><path d="M8 16h8l1-8-2-4H9L8 16z"/><path d="M11 8h2"/>
  </svg>
)

interface SizedIconProps {
  size?: number
}

export const ExploreIcon = ({ size = 18 }: SizedIconProps) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

export const SalonsIcon = ({ size = 18 }: SizedIconProps) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
    <path d="M9 14h.01" />
    <path d="M15 14h.01" />
  </svg>
)

export const AboutIcon = ({ size = 18 }: SizedIconProps) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)
