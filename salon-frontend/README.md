# Warsaw Beauty Salon Explorer — Frontend

React + TypeScript + Tailwind CSS frontend for browsing, filtering, and editing beauty salons in Warsaw. Consumes a Spring Boot REST API backend with pagination, search, and an interactive map.

Built for the **SumUp Warsaw Accelerator 2026** technical assessment.

## Project Structure

```text
salon-frontend/
├── public/
│   ├── favicon.svg                                  # App favicon
│   └── icons.svg                                    # SVG sprite sheet
├── src/
│   ├── main.tsx                                     # React entry point
│   ├── App.tsx                                      # Root component, routing, API integration
│   ├── index.css                                    # Tailwind imports, design tokens, custom fonts
│   ├── vite-env.d.ts                                # Vite type declarations
│   ├── components/
│   │   ├── Navbar.tsx                               # Top navigation bar with logo and links
│   │   ├── FilterSidebar.tsx                        # Search, services, district, price, rating filters
│   │   ├── SalonCard.tsx                            # Salon listing card with photo, rating, services
│   │   ├── SalonListHeader.tsx                      # Page title, result count, sort dropdown
│   │   ├── Pagination.tsx                           # Page navigation with sliding window
│   │   ├── MapPanel.tsx                             # Leaflet map with pink pin markers
│   │   ├── Dialog.tsx                               # Reusable modal dialog
│   │   ├── Footer.tsx                               # Site footer with services links and legal
│   │   ├── TrustStrip.tsx                           # Feature highlights strip
│   │   ├── Spinner.tsx                              # Loading spinner
│   │   ├── SalonEditContext.tsx                      # Context provider for salon edit state
│   │   └── icons/
│   │       └── index.tsx                            # Custom SVG icon components
│   ├── pages/
│   │   ├── HomePage.tsx                             # Main listing page with URL state sync
│   │   └── SalonDetailPage.tsx                      # Salon detail view with inline edit mode
│   ├── hooks/
│   │   ├── useSalonFilters.ts                       # Client-side filtering (search, price, rating)
│   │   ├── useSalonEditor.ts                        # Edit/save/cancel state management hook
│   │   └── useClickOutside.ts                       # Click-outside detection for dropdowns
│   ├── services/
│   │   └── api.ts                                   # API client (getSalons, getSalonById, updateSalon)
│   ├── types/
│   │   └── index.ts                                 # TypeScript interfaces (Salon, SalonDetail, etc.)
│   └── utils/
│       ├── constants.ts                             # Services list, Warsaw districts, service names
│       └── mapIcons.ts                              # Custom Leaflet pink pin icon
├── index.html                                       # HTML entry with font preconnect and preload
├── vite.config.js                                   # Vite configuration
├── tsconfig.json                                    # TypeScript configuration (strict mode)
├── eslint.config.js                                 # ESLint configuration
├── package.json                                     # Dependencies and scripts
└── .env.example                                     # Environment variable template
```

## Stack & Overview

- Framework: React 19 + TypeScript 6
- Build tool: Vite 8
- Styling: Tailwind CSS 4
- Routing: React Router DOM 7
- Map: Leaflet 1.9 + react-leaflet 5
- Toasts: react-toastify 11
- Icons: lucide-react + custom SVG components
- Fonts: Plus Jakarta Sans (headings) + DM Sans (body) via Google Fonts

## Features

- Browse salons with photo, name, district, rating, price range, and services
- Filter by district (server-side), service type (server-side), search text, price range, and rating (client-side)
- Sort by relevance, rating, or price
- Server-side pagination (20 per page)
- URL state sync — filters, sort, and page persist in query params across refresh
- Interactive Leaflet map with custom pink pin markers and fly-to animation
- Salon detail page with full address, contact info, services, and location map
- Inline edit mode — modify salon details and save changes to backend via PUT API
- Responsive layout (mobile, tablet, desktop with three-column view at 1400px+)
- Mobile filter dialog with click-outside-to-close
- Custom design system with Tailwind theme tokens
- Accessibility: skip link, aria-labels, focus-visible rings, semantic HTML

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Edit `VITE_API_URL` to point to your running backend API. Default:

```
VITE_API_URL=http://localhost:8080/v1
```

### 3) Start dev server

```bash
npm run dev
```

Default local URL: http://localhost:5173

### 4) Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the build:

```bash
npm run preview
```

### 5) Lint

```bash
npm run lint
```

## API Contract

The frontend expects these endpoints from the backend:

### GET /v1/salons

Returns paginated salon list.

- Query params: `page`, `size`, `sort`, `orderBy`, `district` (optional), `service` (optional)
- Response: `PaginatedResponse<SalonSummary>`

```json
{
  "content": [
    {
      "id": 1,
      "name": "Salon Name",
      "district": "Mokotów",
      "rating": 4.5,
      "priceRange": "zł zł",
      "imageUrl": "https://...",
      "lat": 52.2297,
      "lng": 21.0122,
      "services": ["Hair Styling", "Nail Care"],
      "reviewCount": 42
    }
  ],
  "totalPages": 10,
  "totalElements": 200,
  "size": 20,
  "number": 0,
  "first": true,
  "last": false,
  "empty": false
}
```

### GET /v1/salons/:id

Returns full salon details.

- Response: `SalonDetail`

### PUT /v1/salons/:id

Updates a salon.

- Body: `SalonUpdate` DTO
- Response: updated `SalonDetail`

## Environment Variables

Use `.env.example` as a baseline.

- `VITE_API_URL` — Backend API base URL (default: `http://localhost:8080/v1`)

## Development Notes

- The frontend uses **strict TypeScript** with `noUnusedLocals` and `noUnusedParameters` enabled.
- District and service filters are handled **server-side** via API query params. Search, price range, and rating filters are handled **client-side** on the already-fetched page of 20 salons.
- URL state sync uses two `useEffect` hooks — one reads URL params on mount, the other writes state back when filters change.
- Salon edit state is shared across sub-components via React Context (`SalonEditContext`), not prop drilling.
- The Leaflet map uses a custom pink pin icon (`mapIcons.ts`) styled to match the design system.
- Font preconnect and preload are configured in `index.html` for faster Google Fonts loading.
- The `services` URL param uses service IDs (e.g., `hair`), while the API `service` param uses service labels (e.g., `Hair Styling`). The conversion happens in `App.tsx` via `getServiceLabel()`.
