# Warsaw Beauty Salon Explorer

Full-stack application for discovering and exploring beauty salons in Warsaw. Built as a take-home task for the SumUp Warsaw Accelerator 2026 Software Engineer Intern position.

This monorepo contains a data collection pipeline (TypeScript), REST API (Spring Boot), and React frontend, all deployed with Docker on AWS EC2.

## Live Deployment URLs

**Environment:** AWS EC2 instance & Docker containers  
**Deployment server:** Amazon EC2 m7i-flex.large Ubuntu 22 LTS 64  
**CI/CD:** Github Actions & Dokploy  
**Frontend:** https://salon-ui.technical-task.live  
**API:** https://salon-api.technical-task.live/v1/  
**Swagger UI:** https://salon-api.technical-task.live/swagger  
**HTTPS:** enabled + Cloudflare CDN Full Strict + Reverse Proxy for 2 subdomains
**Rate limiting:** enabled at the Cloudflare CDN layer

## Project Structure

```text
warsawACC/
├── data-collection/          # TypeScript data pipeline (Google Places API → PostgreSQL)
│   ├── src/
│   │   ├── collect.ts        # Fetch raw salon data from Google Places
│   │   ├── validate.ts       # Clean, deduplicate, and validate data
│   │   ├── utils/
│   │   │   ├── fetch-photos.ts   # Resolve photo URLs to public CDN
│   │   │   ├── types.ts          # TypeScript interfaces
│   │   │   ├── districts.ts      # Warsaw 18 districts + haversine mapping
│   │   │   └── queries.ts        # 17 search queries (English + Polish)
│   │   └── database/
│   │       ├── seed.ts       # Seed database with validated data
│   │       └── migrate.ts    # Create database tables
│   ├── output/               # Pipeline outputs (git-ignored)
│   │   ├── raw-salons.json       # Raw data from Google Places
│   │   ├── validated-salons.json # Cleaned and validated data
│   │   └── clean-salons.json     # Final data with photo URLs
│   └── README.md
│
├── salonapi/                 # Spring Boot REST API
│   ├── src/main/java/com/sumup/moumni/salonapi/
│   │   ├── Controller/       # REST endpoints (GET, PUT)
│   │   ├── Dto/              # Request/Response DTOs
│   │   ├── Entity/           # JPA entities (Salon, Services)
│   │   ├── Repository/       # Data access layer
│   │   ├── Service/          # Business logic
│   │   └── Common/           # Global exception handling, CORS config
│   ├── src/main/resources/
│   │   ├── application.properties      # Dev profile (H2)
│   │   └── application-prod.yaml       # Prod profile (PostgreSQL)
│   ├── Dockerfile            # Multi-stage Docker build
│   ├── docker-compose-prod.yml
│   └── README.md
│
├── salon-frontend/           # React Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Home, Detail)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client layer
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Constants, map icons
│   ├── public/               # Static assets (logo, favicon)
│   ├── Dockerfile            # Production Docker build
│   ├── docker-compose-prod.yml
│   └── README.md
│
└── README.md                 # This file
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Data Collection** | TypeScript 5, Google Places API, pnpm |
| **Backend** | Java 21, Spring Boot 4.0.6, Spring Data JPA, Hibernate, MapStruct |
| **Frontend** | React 19.2, Vite 8, TypeScript 6, Tailwind CSS 4 |
| **Database** | PostgreSQL (AWS RDS) |
| **API Docs** | Swagger OpenAPI 3 (springdoc-openapi) |
| **Mapping** | Leaflet + react-leaflet |
| **Validation** | Jakarta Bean Validation (backend) |
| **Security** | CORS, Cloudflare CDN (Rate Limiting, Full Strict HTTPS) |
| **CI/CD** | GitHub Actions |
| **Deployment** | Docker, AWS EC2, Cloudflare CDN |

## Features

### Data Collection
- Fetches 600+ real salons from Google Places API
- Deduplicates and validates salon data
- Fetches and caches salon photos
- Automated database seeding with idempotent migrations

### Backend API
- RESTful endpoints for salon listing and detail views
- Pagination with filtering (by district, service type)
- Sorting (by rating, review count, name, price)
- PUT endpoint for updating salon details
- Global exception handling with proper HTTP status codes
- CORS configuration for production domain
- Swagger API documentation

### Frontend
- Responsive three-column layout (filters, salon list, map)
- Client-side filtering (rating, price range)
- Server-side filtering (district, service type)
- Interactive Leaflet map with custom markers
- Salon detail view with edit functionality
- URL state sync (filters persist across navigation)
- Optimistic UI updates
- Accessibility features (keyboard navigation)

## Quick Start

### Prerequisites

- Java 21+ (for backend)
- Node.js 20+ (for frontend and data collection)
- pnpm (for data collection)
- npm (for frontend)
- PostgreSQL 16+ (local or AWS RDS)
- Docker (optional, for containerized deployment)

### 1. Clone the repository

```bash
git clone https://github.com/anasmoumni51-stack/Warsaw-Accelerator-2026-Project.git
cd Warsaw-Accelerator-2026-Project
```

### 2. Data Collection (Optional - database already seeded)

```bash
cd data-collection
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your Google Places API key and database credentials

# Run the full pipeline (collect → validate → photos → migrate → seed)
pnpm start

# Or run each stage individually
# pnpm collect, pnpm validate, pnpm photos, pnpm migrate, pnpm seed
```

See [data-collection/README.md](data-collection/README.md) for detailed instructions.

### 3. Backend API

```bash
cd salonapi

# Run locally (dev mode with H2 database, no config needed)
./mvnw spring-boot:run

# Run with PostgreSQL (prod profile)
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

API will be available at http://localhost:8080
Swagger UI at http://localhost:8080/swagger

See [salonapi/README.md](salonapi/README.md) for detailed instructions.

### 4. Frontend

```bash
cd salon-frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL

# Start dev server
npm run dev

# Build for production
npm run build
npm run preview
```

Frontend will be available at http://localhost:5173

See [salon-frontend/README.md](salon-frontend/README.md) for detailed instructions.

## Docker Deployment

### Frontend

```bash
cd salon-frontend
docker compose -f docker-compose-prod.yml up --build
```

Frontend runs on http://localhost:3000

### Backend

```bash
cd salonapi
docker compose -f docker-compose-prod.yml up --build
```

API runs on http://localhost:8080

**Note:** PostgreSQL is not included in the compose files for security and performance reasons. Use AWS RDS or a separate PostgreSQL instance.

## Environment Variables

### Data Collection (.env)
- `GOOGLE_API_KEY` - Google Places API key
- `DATABASE_URL` - PostgreSQL connection string

### Backend (.env)
- `DATABASE_URL` - PostgreSQL JDBC URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `CORS_ORIGIN` - Allowed CORS origin (e.g., https://salon-ui.technical-task.live)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (e.g., https://salon-api.technical-task.live)

## Development & Deployment Notes

- The data collection pipeline uses Google Places API, which has rate limits and costs. The `clean-salons.json` file contains 600+ pre-validated salons with photo URLs.
- Backend uses H2 in-memory database for local development and PostgreSQL for production.
- Frontend uses Vite for fast development with hot module replacement.
- Production deployments use Dokploy for zero-downtime deployments with automatic SSL.
- Cloudflare CDN provides DDoS protection, rate limiting, and global edge caching.
- All services are containerized with Docker for consistent environments.
- Database schema is managed by the data collection pipeline (`migrate.ts`), not the backend.
- Rate limiting is configured at the Cloudflare layer to protect against abuse.

## Testing

### Data Collection
```bash
pnpm run test-db
pnpm run test
```
runs database test and displays 5 rows
unit tests for the scripts.

### Backend

```bash
cd salonapi
./mvnw test
```

Runs unit tests with Mockito (no database required).

### Frontend

```bash
cd salon-frontend
npm run lint
npm run build
```

ESLint checks and production build verification.

## API Documentation

Interactive API documentation is available at:
- **Production:** https://salon-api.technical-task.live/swagger
- **Local:** http://localhost:8080/swagger
