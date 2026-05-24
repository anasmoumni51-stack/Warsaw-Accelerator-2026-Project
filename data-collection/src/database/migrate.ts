import "dotenv/config";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const MIGRATIONS_DIR = join(__dirname, "db_migrations");

async function migrate() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log("Connected to database.\n");

  // Read and sort all migration files
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found.");
    await client.end();
    return;
  }

  console.log(`Found ${files.length} migration(s).\n`);

  for (const file of files) {
    const path = join(MIGRATIONS_DIR, file);
    let sql = readFileSync(path, "utf-8");

    // Make CREATE TABLE idempotent
    sql = sql.replace(/CREATE TABLE(?!\s+IF\s+NOT\s+EXISTS)/gi, "CREATE TABLE IF NOT EXISTS");

    console.log(`Running ${file}...`);
    await client.query(sql);
    console.log(`  ✓ Done`);
  }

  console.log("\nMigration complete.");
  await client.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
