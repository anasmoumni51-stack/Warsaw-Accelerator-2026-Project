import "dotenv/config";
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

async function testDb() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 5000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Check if salons table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'salons'
      );
    `);
    const tableExists = tableCheck.rows[0].exists;
    console.log(`Table 'salons' exists: ${tableExists}`);

    if (tableExists) {
      // Count rows
      const count = await client.query("SELECT COUNT(*) FROM salons");
      console.log(`Rows in salons: ${count.rows[0].count}`);

      // Show columns
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'salons'
        ORDER BY ordinal_position;
      `);
      console.log("\nColumns:");
      for (const col of columns.rows) {
        console.log(`  ${col.column_name} — ${col.data_type} (nullable: ${col.is_nullable})`);
      }

      // Show sample row if any exist
      if (parseInt(count.rows[0].count) > 0) {
        const sample = await client.query("SELECT * FROM salons LIMIT 2");
        console.log("\nSample rows:");
        for (const row of sample.rows) {
          console.log(row);
        }
      }
    }

    console.log("\nDatabase test passed.");
  } catch (err) {
    console.error("Database test failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testDb();
