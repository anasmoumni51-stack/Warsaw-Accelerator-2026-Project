import "dotenv/config";
import { readFileSync } from "node:fs";
import pg from "pg";
import type { CleanSalon } from "./types.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS salons (
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
`;

const INSERT_SALON = `
INSERT INTO salons (name, address, district, phone, website, services, price_range, rating, review_count, lat, lng)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
ON CONFLICT (LOWER(TRIM(name)), LOWER(TRIM(address)))
DO NOTHING;
`;

async function seed() {
  console.log("Reading clean-salons.json...");
  const salons: CleanSalon[] = JSON.parse(
    readFileSync("clean-salons.json", "utf-8")
  );
  console.log(`Found ${salons.length} salons to seed.\n`);

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  // Create table if not exists
  await client.query(CREATE_TABLE);
  console.log("Table 'salons' ready.\n");

  let inserted = 0;
  let skipped = 0;

  for (const salon of salons) {
    const result = await client.query(INSERT_SALON, [
      salon.name,
      salon.address,
      salon.district,
      salon.phone,
      salon.website,
      salon.services,
      salon.priceRange,
      salon.rating,
      salon.reviewCount,
      salon.lat,
      salon.lng,
    ]);
    if (result.rowCount && result.rowCount > 0) {
      inserted++;
    } else {
      skipped++;
    }
  }

  const total = await client.query("SELECT COUNT(*) FROM salons");
  await client.end();

  console.log("Seed complete:");
  console.log(`  Inserted: ${inserted} new salons`);
  console.log(`  Skipped:  ${skipped} (already in database)`);
  console.log(`  Total:    ${total.rows[0].count} salons in database`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
