import "dotenv/config";
import { readFileSync } from "node:fs";
import pg from "pg";
import type { CleanSalon } from "../utils/types.js";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const INSERT_SALON = `
INSERT INTO salons (
  name, name_norm, address, address_norm, street_number, district, city, country, postcode,
  phone, website, rating, review_count, price_range,
  lat, lng, image_url
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
ON CONFLICT (name_norm, address_norm)
DO NOTHING
RETURNING id;
`;

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const SERVICES = [
  'Hair Styling',
  'Beauty Treatment',
  'Nail Care',
  'Skin Care',
  'Barber',
  'Makeup'
];

const INSERT_SALON_SERVICE = `
INSERT INTO salon_services (salon_id, service_id)
VALUES ($1, (SELECT id FROM services WHERE name = $2))
ON CONFLICT DO NOTHING;
`;

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
  console.log("Connected to database.\n");

  // Check if tables exist
  const tableCheck = await client.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'salons')`
  );
  if (!tableCheck.rows[0].exists) {
    console.error("Tables not found. Run 'pnpm migrate' first.");
    await client.end();
    process.exit(1);
  }

  // Pre-seed all service types
  const valuesClause = SERVICES.map((_, i) => `($${i + 1})`).join(', ');
  await client.query(
    `INSERT INTO services (name) VALUES ${valuesClause}
     ON CONFLICT (name) DO NOTHING;`,
    SERVICES
  );
  console.log(`Pre-seeded ${SERVICES.length} services.\n`);

  let inserted = 0;
  let skipped = 0;

  for (const salon of salons) {
    const result = await client.query(INSERT_SALON, [
      salon.name,
      salon.nameNorm,
      salon.address,
      salon.addressNorm,
      salon.streetNumber,
      salon.district,
      salon.city,
      salon.country,
      salon.postcode,
      salon.phone,
      salon.website,
      salon.rating,
      salon.reviewCount,
      salon.priceRange,
      salon.lat,
      salon.lng,
      salon.imageUrl ?? DEFAULT_IMAGE_URL,
    ]);

    if (!result.rowCount || result.rowCount === 0) {
      skipped++;
      continue;
    }

    inserted++;
    const salonId = result.rows[0].id;

    // Link salon to its services
    for (const serviceName of salon.services) {
      console.log(`adding row to the table...\n`);
      await client.query(INSERT_SALON_SERVICE, [salonId, serviceName]);
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
