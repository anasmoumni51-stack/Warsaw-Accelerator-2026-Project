# Salon Data Collection

TypeScript pipeline that collects Warsaw hair/beauty salon data from Google Places API, cleans and normalizes it, resolves public photo URLs, and seeds it into a PostgreSQL Database.

## Project Structure

```text
data-collection/
├── src/
│   ├── collect.ts              # Stage 1: Fetch from Google Places API
│   ├── validate.ts             # Stage 2: Clean, dedup, normalize
│   ├── utils/
│   │   ├── fetch-photos.ts     # Stage 3: Resolve photo URLs to public CDN
│   │   ├── types.ts            # TypeScript interfaces (RawPlace, CleanSalon)
│   │   ├── districts.ts        # Warsaw 18 districts + haversine mapping
│   │   └── queries.ts          # 17 search queries (English + Polish)
│   └── database/
│       ├── migrate.ts          # Run SQL migrations (idempotent)
│       ├── seed.ts             # Stage 4: Insert into PostgreSQL
│       └── db_migrations/
│           └── V1_inital_schema.sql
├── test/
│   ├── collect.test.ts         # Collect unit tests
│   ├── validate.test.ts        # Validate unit tests (comprehensive)
│   ├── districts.test.ts       # District mapping tests
│   └── test-db.ts              # Manual DB connection check
├── output/                     # Pipeline outputs (git-ignored)
│   ├── raw-salons.json         # ~1000 raw places (with duplicates)
│   ├── validated-salons.json   # ~618 cleaned entries
│   └── clean-salons.json       # Final data with resolved photos
├── .env.example
├── jest.config.ts
├── eslint.config.js
├── tsconfig.json
└── package.json
```

## Prerequisites

- Node.js 22+
- pnpm
- Google Places API key (with billing enabled)
- PostgreSQL database (AWS RDS or any provider)

## 1- Setup

```bash
cd data-collection
pnpm install
cp .env.example .env
```

Edit `.env` with your credentials:

```
GOOGLE_API_KEY=your_google_places_api_key
DATABASE_URL=postgresql://user:password@host:5432/salon_db
```

## 2- Running the Pipeline

## Option 1 (automated)

```bash
pnpm start    # Run the full pipeline (collect → validate → photos → migrate → seed) from Google Places API → seeding the database -> shows row count and displays seeded columns
```

## Option 2 (execute individually)

Run the four stages in order. Each stage reads the output of the previous one.

```bash
pnpm run collect    # Fetch salons from Google Places API → output/raw-salons.json
pnpm run validate   # Clean, dedup, normalize → output/validated-salons.json
pnpm run photos     # Resolve photo URLs to public CDN → output/clean-salons.json
pnpm run migrate    # Create database tables (idempotent)
pnpm run seed       # Insert into PostgreSQL (ON CONFLICT DO NOTHING)
pnpm run test-db    # shows database row count and displays seeded columns
```

### What each stage does

**1. Collect** — Runs 17 search queries (English + Polish, district-specific) against the Google Places API `searchText` endpoint. Handles pagination with `nextPageToken`. Outputs raw API responses.

**2. Validate** — Deduplicates by normalized `(name, address)`, keeping entries with more data. Cleans names (strips decorative symbols, city suffixes). Normalizes phone (`+48 XXX XXX XXX`), website (`https://`), rating (0-5). Maps Google types to service labels. Assigns district via haversine distance to 18 Warsaw district centers. Estimates price range based on district tier and service breadth (Google returns null `priceLevel` for Polish salons). Parses structured address components (street, number, city, country, postcode). Filters out entries with no name, address, services, or rating.

**3. Photos** — Resolves Google Places photo URLs to public CDN URLs by following redirects (`redirect: 'manual'`). Falls back to a default Unsplash image on failure. This avoids exposing the API key to the frontend.

**4. Seed** — Inserts clean salons into PostgreSQL with `ON CONFLICT DO NOTHING` so re-runs skip existing records. Upserts services into the `services` table and creates `salon_services` relationships.

**5. Test** — Shows Database row count and 5 current database columns

## Database Schema

```sql
-- Salons
CREATE TABLE salons (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  name_norm     VARCHAR(255) NOT NULL,       -- lowercase, trimmed
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

-- Join table
CREATE TABLE salon_services (
  salon_id   BIGINT NOT NULL REFERENCES salons(id)   ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES services(id)  ON DELETE CASCADE,
  PRIMARY KEY (salon_id, service_id)
);
```

The `UNIQUE (name_norm, address_norm)` constraint prevents duplicates. Both migration (`CREATE TABLE IF NOT EXISTS`) and seed (`ON CONFLICT DO NOTHING`) are idempotent.

## Data Pipeline Flow

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

## Search Queries

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

Queries are defined in `src/utils/queries.ts`. Add new queries there to expand coverage (e.g., other cities in Poland).

## Scripts

| Command           | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `pnpm start`      | Run the full pipeline (collect → validate → photos → migrate → seed) |
| `pnpm collect`    | Fetch raw data from Google Places API                                |
| `pnpm validate`   | Clean, deduplicate, and normalize                                    |
| `pnpm photos`     | Resolve photo URLs to public CDN                                     |
| `pnpm migrate`    | Run database migrations (idempotent)                                 |
| `pnpm seed`       | Seed database with clean data                                        |
| `pnpm test`       | Run Jest unit tests                                                  |
| `pnpm test:watch` | Run tests in watch mode                                              |
| `pnpm test-db`    | Manual database connection check                                     |
| `pnpm lint`       | Lint src and test directories                                        |
