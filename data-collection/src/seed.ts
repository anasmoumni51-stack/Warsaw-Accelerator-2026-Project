import "dotenv/config";
import { readFileSync } from "node:fs";
import pg from "pg";
import type { CleanSalon } from "./types.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

// Read schema from V1_Schema.sql and add IF NOT EXISTS for idempotency
const schema = readFileSync("src/db_migrations/V1_Schema.sql", "utf-8");
const CREATE_TABLES = schema.replace(/CREATE TABLE/g, "CREATE TABLE IF NOT EXISTS");

const INSERT_SALON = `
INSERT INTO salons (name, name_norm, address, address_norm, district, phone, website, rating, review_count)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (name_norm, address_norm)
DO NOTHING
RETURNING id;
`;

const UPSERT_SERVICE = `
INSERT INTO services (name)
VALUES ($1)
ON CONFLICT (name)
DO UPDATE SET name = EXCLUDED.name
RETURNING id;
`;

const INSERT_SALON_SERVICE = `
INSERT INTO salon_services (salon_id, service_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;
`;

function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

async function seed() {
  console.log("Reading output/clean-salons.json...");
  const salons: CleanSalon[] = JSON.parse(
    readFileSync("output/clean-salons.json", "utf-8")
  );
  console.log(`Found ${salons.length} salons to seed.\n`);

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  // Create tables if not exist (idempotent)
  await client.query(CREATE_TABLES);
  console.log("Tables ready.\n");

  // Cache service name → id to avoid repeated lookups
  const serviceCache = new Map<string, number>();

  let inserted = 0;
  let skipped = 0;

  for (const salon of salons) {
    const result = await client.query(INSERT_SALON, [
      salon.name,
      normalize(salon.name),
      salon.address,
      normalize(salon.address),
      salon.district,
      salon.phone,
      salon.website,
      salon.rating,
      salon.reviewCount,
    ]);

    if (!result.rowCount || result.rowCount === 0) {
      skipped++;
      continue;
    }

    inserted++;
    const salonId = result.rows[0].id;

    // Insert services and create relationships
    for (const serviceName of salon.services) {
      let serviceId: number;

      if (serviceCache.has(serviceName)) {
        serviceId = serviceCache.get(serviceName)!;
      } else {
        const serviceResult = await client.query(UPSERT_SERVICE, [serviceName]);
        serviceId = serviceResult.rows[0].id;
        serviceCache.set(serviceName, serviceId);
      }

      await client.query(INSERT_SALON_SERVICE, [salonId, serviceId]);
    }
  }

  const totalSalons = await client.query("SELECT COUNT(*) FROM salons");
  const totalServices = await client.query("SELECT COUNT(*) FROM services");
  const totalRelations = await client.query("SELECT COUNT(*) FROM salon_services");
  await client.end();

  console.log("Seed complete:");
  console.log(`  Inserted:    ${inserted} new salons`);
  console.log(`  Skipped:     ${skipped} (already in database)`);
  console.log(`  Total:       ${totalSalons.rows[0].count} salons`);
  console.log(`  Services:    ${totalServices.rows[0].count} unique services`);
  console.log(`  Relations:   ${totalRelations.rows[0].count} salon-service links`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
