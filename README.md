# Warsaw Beauty Salon Explorer

A full stack web application for discovering and exploring beauty salons in Warsaw. i collected real salon data from Google Places API, built a REST API to serve it, and created a modern frontend UI with filtering, search, and interactive mapping.

Demo : https://salon-ui.technical-task.live

## Live Deployment

**Frontend:** https://salon-ui.technical-task.live  
**API:** https://salon-api.technical-task.live/v1/  
**Swagger UI:** https://salon-api.technical-task.live/swagger  
**GitHub:** https://github.com/anasmoumni51-stack/Warsaw-Accelerator-2026-Project

**Infrastructure:**
- Amazon AWS EC2 instance m7i-flex.large (Ubuntu 22 LTS)
- Docker containers with Github Actions CI/CD pipeline
- Cloudflare CDN (HTTPS Strict, Reverse Proxy, rate limiting, DDoS protection)



### Prerequisites

- Java 21+ and Spring Boot 4.0 (for backend API )
- Node.js 20+ and pnpm/npm (for data collection and frontend )
- PostgreSQL 16+ (loca/production instance or AWS RDS)
- Docker (optional, for containerized deployment)



## Technical Solution

### Architecture Overview

This is a monorepo containing three components:

1. **Data Collection Pipeline** (TypeScript) Fetches, cleans, resolves photos to a CDN and seeds salon data from Google Places API
2. **Backend API** (Java/Spring Boot 4.0) RESTful API with filtering, sorting, and pagination
3. **Frontend** (React/TypeScript) Modern web interface with interactive map finder and responsive design

```text
warsawACC/
├── data-collection/          # TypeScript data pipeline (Google Places API → PostgreSQL)
│   ├── src/
│   │   ├── collect.ts        # Fetch raw salon data from Google Places
│   │   ├── validate.ts       # Clean, deduplicate, parse and validate data
│   │   ├── utils/
│   │   │   ├── fetch-photos.ts   # Resolve photo URLs to public CDN
│   │   │   ├── types.ts          # TypeScript interfaces
│   │   │   ├── districts.ts      # Warsaw 18 districts mapping by lat and long
│   │   │   └── queries.ts        # 17 search queries (English + Polish) modifieable
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

## Features

### Data Collection

- Fetches 600+ real salon data in warsaw from Google Places API using search queries 
( the queries mimick real user searchs and can be modified in data-collection/src/utils/queries.ts )

- Deduplicate, normalizes, parses and validates salon data collected from the API.  
( automatically extracts district using lat,lng and city / postcode / street / streetNumber) 

- Fetches and Resolves salon photos to a google public CDN URL 
(i avoided storing them server-side for bandwith and performance issues on amazon AWS EC2)

- Automated database seeding with idempotent seeding and migrations 
( pnpm run start automatically exceutes full pipeline as idempotent and can be rerun multiple times )


### Backend API

- RESTful endpoints for salon listing and detail views 
( Following REST API conventions correctly with DTO Validation enforced to meet the Database Schema constraints and all security edge case scenarios )

- Pagination with filtering (by district, service type)
( batchsize 20 to avoid N+1 while using 2 paginated queries and Entity graph used in custom derived methods for 1 query optimisation )

- Sorting (by rating, review count, name, price)
( all query parameters are DTO Validated to avoid XSS using a @Pattern RegExpression )

- Global exception handling with proper HTTP status codes
( Centralised global exception handling with a custom error string and an Error DTO )

- CORS configuration for a production domain and dev/production environements configuration
(Local Dev H2 in memory with a Database schema and pre seeding data matching full production schema )

- Unit Test Coverage and Swagger API documentation
(Mockito unit tests covering Controller and Service layers, OpenAPI 3 with annotations on all DTO's and testable endpoints at /swagger)


### Frontend

- Responsive three-column layout (filters, salon list, map)
( Tailwind flexbox with custom 1400px/1800px breakpoints and mobile dialog for sidebar )

- Client-side filtering (rating, price range)
( useSalonFilters hook filters current page array by price level and minimum rating )

- Server-side filtering (district, service type)
( API call with district/service query params, pagination resets on filter change )

- Interactive Leaflet map with custom markers
( with exact lat,lng location and custom styled pins and map.flyTo() animation )

- Salon detail view with edit functionality
( same page editing via useSalonEditor hook and SalonEditContext )




### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Data Collection** | TypeScript 6, Google Places API, pnpm |
| **Backend** | Java 21, Spring Boot 4.0.3, Spring Data JPA, Hibernate, MapStruct |
| **Frontend** | React 19.2, Vite 8, TypeScript 6, Tailwind CSS 4 |
| **Database** | PostgreSQL (Amazon AWS RDS) |
| **API Docs** | Swagger OpenAPI 3 (springdoc-openapi) |
| **Mapping** | Leaflet + react-leaflet |
| **Validation** | Jakarta Bean Validation (backend) |
| **Security** | CORS, Cloudflare CDN (Rate Limiting, Full Strict HTTPS) |
| **CI/CD** | GitHub Actions, Dokploy |
| **Deployment** | Docker, AWS EC2, Cloudflare CDN (Revese Proxy) |



### Why These Technologies?


- **Google Places API + Typescript** 
— the best API for a reliable and very comprehensive data source with real time information and typescript for reliable Type safe scripts with Node.js and pnpm with fetch/postgreSQL driver/jest.

- **PostgreSQL** 
— Production grade relational database easily upgradable by version schema migrations and usable for future client transactions, better than SQLite for concurrent access

- **Spring Boot 4.0.6 + H2 + Maven + Docker** 
— Latest stable version with Java 21 support for stable and easily scalable dockerised API's with OpenAPI documentation, dependecies, Unit Tests and Dev/Prod Environements.

- **React 19 + Tailwind CSS + TypeScript** 
— Type-safe frontend development and rapid UI development, modern React features, hooks, fetch API and trying to match pixel to pixel my UI/UX Design




## 1- How to Run the Application for Local Developpement ( without Data Collection in a live database )


The data collection pipeline requires a Google Console API Key and a PostgreSQL database for this reason we can run the API with pre loaded salons.


### Quick Start (3 minutes)

#### 1. Clone the repository

```bash
git clone https://github.com/anasmoumni51-stack/Warsaw-Accelerator-2026-Project.git
cd Warsaw-Accelerator-2026-Project
```


#### 2. Backend API (with pre-seeded database)

```bash
cd salonapi
./mvnw spring-boot:run
```

The API runs on http://localhost:8080 with an in-memory H2 database pre loaded with 5 salons.  
Swagger UI available at http://localhost:8080/swagger for live API testing Locally or using Postman.


#### 3. Frontend

```bash
cd salon-frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.


**That's it!** The frontend connects to the local backend by default and you will see 





### 2- How to Run the Application with the Full Setup for Production (with PostgreSQL)

If you want to use the data collection pipeline is usable :

#### 1. Data Collection Pipeline

```bash
cd data-collection
pnpm install
cp .env.example .env
```

Edit `.env`:
```
GOOGLE_API_KEY=your_google_places_api_key
DATABASE_URL=postgresql://user:password@host:5432/salon_db
```

Run the full pipeline ( automated migration and seeding and idempotent ( safe to run multiple times and doesn't change the database state unless new salons are found ) ):

```bash
pnpm run start
```

This fetches data from Google Places API, cleans it, resolves the photos to a CDN URL, migrates the database automatically then seeds the database with ~600 salons and the total count of rows returns 5 rows examples.


**Pipeline stages:**
1. `collect` — Fetch raw data from Google Places API (~1000 entries)
2. `validate` — Clean, deduplicate, normalize (~618 entries)
3. `photos` — Resolve photo URLs to public CDN
4. `migrate` — Create database tables if they don't exist
5. `seed` — Insert into PostgreSQL if the name and address doesn't exist
6. `test-db` — shows database row count and displays seeded columns

You can run stages individually: `pnpm run collect`, `pnpm run validate`, `pnpm run photos`, `pnpm run migrate`, `pnpm run seed`, `pnpm run test-db`


#### 2. Backend API (with PostgreSQL)

```bash
cd salonapi
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=jdbc:postgresql://localhost:5432/salondb
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
CORS_ORIGIN=http://localhost:5173
```

Run with production profile:
```bash
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

API runs on http://localhost:8080
Swagger UI available at http://localhost:8080/swagger


CORS origins are configured via the app.cors.origin property, driven by the CORS_ORIGIN environment variable in production:

Development: Defaults to * (allows all origins)
Production: Set to your frontend domain (e.g., https://salon-ui.technical-task.live)
The configuration is in Common/CorsConfig.java and reads app.cors.origin from the active Spring profile.



#### 3. Frontend

```bash
cd salon-frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8080/v1
```

Start dev server:
```bash
npm run dev
```

Frontend runs on http://localhost:5173




## 3- OPTIONAL

### Docker Deployment

#### Frontend

```bash
cd salon-frontend
docker compose -f docker-compose-prod.yml up --build
```

Frontend runs on http://localhost:3000


#### Backend

```bash
cd salonapi
docker compose -f docker-compose-prod.yml up --build
```

API runs on http://localhost:8080


**Note:** PostgreSQL is not included in the compose files. Use AWS RDS or a separate PostgreSQL instance.








## Architecture Details ( from data Collection until served on the Frontend using the REST API)



### 1- Search Queries

The collect script uses 17 search queries against Google Places API to maximize coverage across Warsaw:

```typescript
// Generic salon searches (English)
"hair salon Warsaw",
"beauty salon Warsaw",
"nail salon Warsaw",
"barber shop Warsaw",

// Generic salon searches (Polish)
"fryzjer Warszawa",
"salon fryzjerski Warszawa",
"salon urody Warszawa",
"gabinet kosmetyczny Warszawa",
"kosmetyczka Warszawa",

// Specific service searches
"manicure Warszawa",
"pedicure Warszawa",
"henna brwi Warszawa",
"przedłużanie rzęs Warszawa",

// District-specific searches
"fryzjer Mokotów",
"fryzjer Ursynów",
"fryzjer Wola",
"fryzjer Praga Warszawa",
```

Queries are defined in `data-collection/src/utils/queries.ts`. Add new queries there to expand coverage (e.g., other cities in Poland).



### 2- Data Pipeline Flow

```
Google Places API (17 queries × pagination)
        │
        ▼
   raw-salons.json     (~1000 entries with duplicates, ~13 MB)
        │
        ▼
   Dedup by normalized name+address
   Clean names, normalize phone/website/rating
   Map Google types → service labels
   Map coordinates → Warsaw district (haversine)
   Estimate price range (district tier + service breadth)
   Parse structured address components
        │
        ▼
   validated-salons.json   (~618 entries)
        │
        ▼
   Resolve Google photo URLs → public CDN URLs
        │
        ▼
   clean-salons.json
        │
        ▼
   PostgreSQL (salons + services + salon_services)
```

See [data-collection/README.md](data-collection/README.md) for detailed instructions and information.




### 3 - Database Schema

The database uses a normalized schema with a many-to-many relationship between salons and services.

```sql
-- Salons
CREATE TABLE salons (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  name_norm     VARCHAR(255) NOT NULL,       -- lowercase, trimmed for dedup
  address       VARCHAR(500) NOT NULL,
  address_norm  VARCHAR(500) NOT NULL,       -- full formatted address, normalized
  street_number VARCHAR(50),
  district      VARCHAR(100) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  country       VARCHAR(100) NOT NULL,
  postcode      VARCHAR(20)  NOT NULL,
  phone         VARCHAR(30),
  website       VARCHAR(500),
  rating        DECIMAL(2,1),
  review_count  INTEGER DEFAULT 0,
  price_range   VARCHAR(20),                 -- "zł", "zł zł", "zł zł zł"
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  image_url     VARCHAR(1000),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE (name_norm, address_norm)
);

-- Services
CREATE TABLE services (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Join table (many-to-many)
CREATE TABLE salon_services (
  salon_id   BIGINT NOT NULL REFERENCES salons(id)   ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES services(id)  ON DELETE CASCADE,
  PRIMARY KEY (salon_id, service_id)
);
```



## 4- Data Model

**Design Decision:** Many-to-many relationship, a salon can offer multiple services. ( Database schema easily extandable to multiple photos gallery table, reviews table, Client and user Profile Tables, Order table and favourites joined table  )

```
┌──────────────────┐         ┌──────────────────────┐         ┌──────────────┐
│     salons       │         │   salon_services     │         │   services   │
├──────────────────┤         ├──────────────────────┤         ├──────────────┤
│ id (PK)          │─┐       │ salon_id (FK)        │      ┌──│ id (PK)      │
│ name             │ └────→  │ service_id (FK)      │ ←────┘  │ name         │
│ name_norm (RO)   │         └──────────────────────┘         └──────────────┘
│ address          │
│ address_norm (RO)│
│ street_number    │
│ district         │
│ city             │
│ country          │
│ postcode         │
│ phone            │
│ website          │
│ rating           │
│ review_count     │
│ price_range      │
│ lat              │
│ lng              │
│ image_url        │
│ created_at       │
│ updated_at       │
└──────────────────┘

(RO) = read-only, populated by database/pipeline, not mapped for updates
```


**Key Design Decisions:**
- `UNIQUE (name_norm, address_norm)` prevents duplicate salons and keeps seed and migrate script idempotent
- `name_norm` and `address_norm` are read-only fields (populated by pipeline, not mapped for updates)
- `@EntityGraph and @BatchSize` used in Entity and repository queries to eagerly fetch services without N+1 queries and avoiding fetching all rows in java memory
- Schema managed by data collection pipeline (`migrate.ts`), not the backend



## 5- REST API Endpoints

### Salons

- **GET /v1/salons** — Retrieve all salons (paginated)
- **GET /v1/salons?district={district}** — Filter by district
- **GET /v1/salons?service={service}** — Filter by service type
- **GET /v1/salons?district={district}&service={service}** — Filter by both
- **GET /v1/salons?sort={field}&orderBy={ASC|DESC}** — Sort salons (fields: rating, priceRange, name, reviewCount)
- **GET /v1/salons/{id}** — Retrieve one salon with full details
- **PUT /v1/salons/{id}** — Update a salon with all input fields

**Query Parameters:**
- `page` (optional): Page number (0-indexed, default: 0)
- `size` (optional): Page size (default: 20, max: 100)
- `district` (optional): Filter by Warsaw district name
- `service` (optional): Filter by service type (e.g., "Hair Styling", "Nail Care")
- `sort` (optional): Sort field (rating, priceRange, name, reviewCount)
- `orderBy` (optional): Sort direction (ASC, DESC, default: DESC)


**Example Requests:**
```bash
# Get all salons
curl "http://localhost:8080/v1/salons?page=0&size=20"

# Filter by district 
curl "http://localhost:8080/v1/salons?district=Śródmieście"

# Filter by service ( exactly as seeded in the database )
curl "http://localhost:8080/v1/salons?service=Hair%20Styling"

# Sort by rating (highest first)
curl "http://localhost:8080/v1/salons?sort=rating&orderBy=DESC"

# Combine pagination, filtering, and sorting
curl "http://localhost:8080/v1/salons?district=Śródmieście&sort=rating&orderBy=DESC&page=0&size=10"
```

## Error Handling

The API uses standard HTTP status codes:

| Status | When | Response format |
|--------|------|-----------------|
| `200 OK` | Request successful | Requested resource |
| `400 Bad Request` | Validation error on request body | `Map<String, String>` with field-level errors |
| `400 Bad Request` | Invalid query parameters | `ErrorDto` with error message |
| `400 Bad Request` | Wrong parameter type (e.g. `?page=abc`) | `ErrorDto` with error message |
| `404 Not Found` | Salon not found or non-existent endpoint | `ErrorDto` with error message |
| `405 Method Not Allowed` | Wrong HTTP method (e.g. POST on GET-only endpoint) | `ErrorDto` with error message |
| `409 Conflict` | Duplicate constraint violation (name + address) | `ErrorDto` with conflict message |
| `500 Internal Server Error` | Unexpected server error | `Map<String, Object>` with status, error, path |



## Testing

### Data Collection

```bash
cd data-collection
pnpm run test-db    # Test database connection and display 5 rows
pnpm run test       # Run unit tests for validation and district mapping
```

### Backend

```bash
cd salonapi
./mvnw test         # Run unit tests with Mockito (no database required)
```

### Frontend

```bash
cd salon-frontend
npm run lint        # ESLint checks
npm run build       # Production build verification
```




## What I'd Improve With More Time

Given the 4-8 hour time constraint, I focused on core functionality and data quality and a responsive UI. With more time, I would implement the following improvements:


### Data Pipeline Improvements

  1- Adding a cron job to refresh salon data daily and expand to more data (opening hours, amenities and prices)

  2- Adding an additional collect script to fetch more useful data.

  3- Expand to other Polish cities (Kraków, Wrocław, Gdańsk) simply by adding more queries.

  4- Only fetch changed data instead of full re-collection and API request optimisation.

  5- Automated scheduled database backups to S3 easily done in Amazon AWS.

  6- Better unit test coverage of the functionality of the pipeline.


### Backend Improvements


  1- Better cache Control and Implementing a Redis in-memory cache database to return cached resources to all users instead of database queries for each resource and in-memory rate limiting (currently implemented on the Cloudflare CDN layer)

  2- Better query optimisation and if allowed expand the project to a new database schema with migrations while adding the following tables: User, Address, Profile, Photos, Reviews, Order and mapping relationships between entities to form favourites and detailed listings

  3- Implement custom logging filters, better custom exception handling, secure HTTP headers and stricter input sanitization.

  4- User authentication endpoints with a short-lived JWT token with role-based access authentication (User/Salon/Admin) and a cookie-based refresh token (HTTP only).

  5- Implement PATCH for partial update and CREATE / DELETE secure endpoints while following REST conventions.

  6- Adding Flyway migrations on the Spring level



### Frontend Improvements

  1- better filtering functionality and state management using a library like redux.

  2- Polish language support since the data is Warsaw based.

  2- Server-side text search or using PostgreSQL on salon name and address instead of client side filtering.

  3- "Near me" sorting using the browser Geolocation API with the existing lat/lng data to sort salons by distance

  6- Service worker for offline support to cache the last viewed salon list for low connection scenarios.

  8- React error boundaries for better error handling instead of a blank screen on component crashes.





## API Documentation

Interactive API documentation is available at:
- **Production:** https://salon-api.technical-task.live/swagger
- **Local:** http://localhost:8080/swagger
