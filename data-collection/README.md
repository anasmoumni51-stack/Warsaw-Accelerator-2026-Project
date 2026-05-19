# Salon Data Collection

Collects, validates, and seeds Warsaw hair/beauty salon data from Google Places API into a PostgreSQL database.

## Project Structure

```
data-collection/
├── src/
│   ├── types.ts        — TypeScript interfaces (RawPlace, CleanSalon)
│   ├── districts.ts    — Warsaw 18 districts with haversine coordinate mapping
│   ├── collect.ts      — Fetches salons from Google Places API (8 queries)
│   ├── validate.ts     — Deduplicates, normalizes, and cleans raw data
│   └── seed.ts         — Inserts clean data into PostgreSQL
├── raw-salons.json     — Output from collect (git-ignored)
├── clean-salons.json   — Output from validate (git-ignored)
├── .env.example        — Environment variable template
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js 22+
- pnpm
- Google Places API key (with billing enabled)
- PostgreSQL database (AWS RDS or any provider)

## Setup

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

## Scripts

```bash
pnpm collect    # Step 1: Fetch salons from Google Places API → raw-salons.json
pnpm validate   # Step 2: Clean, dedup, normalize → clean-salons.json
pnpm seed       # Step 3: Insert into PostgreSQL (ON CONFLICT DO NOTHING)
```

Run them in order. Each script reads the output of the previous one.

## Database Schema

```sql
CREATE TABLE salons (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  address       VARCHAR(500) NOT NULL,
  district      VARCHAR(100) NOT NULL,
  phone         VARCHAR(30),
  website       VARCHAR(500),
  services      TEXT[],
  price_range   VARCHAR(20),
  rating        DECIMAL(2,1),
  review_count  INTEGER DEFAULT 0,
  lat           DECIMAL(9,6),
  lng           DECIMAL(9,6),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW(),

  UNIQUE (LOWER(TRIM(name)), LOWER(TRIM(address)))
);
```

The unique constraint on normalized `(name, address)` prevents duplicates. The seed script uses `ON CONFLICT DO NOTHING` so re-running it safely skips existing records without overwriting user edits made via the API.

## Data Pipeline

```
Google Places API (8 queries × pagination)
        │
        ▼
   raw-salons.json  (~150-200 entries)
        │
        ▼
   Dedup by name+address, merge entries with more data
   Normalize phone (+48 format), website (https), rating (0-5)
   Map Google types to service labels
   Map coordinates to Warsaw district (haversine nearest-center)
        │
        ▼
   clean-salons.json  (~120-140 entries)
        │
        ▼
   PostgreSQL (ON CONFLICT DO NOTHING)
```
