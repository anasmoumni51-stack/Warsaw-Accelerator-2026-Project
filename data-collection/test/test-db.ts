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
    console.log("Connected to salon_db");

    const tableCheck = await client.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'salons')`
    );
    const tableExists = tableCheck.rows[0].exists;

    if (tableExists) {
      const count = await client.query("SELECT COUNT(*) FROM salons");
      console.log(`Rows: ${count.rows[0].count}`);

      console.log("\nSample data:");
      const sample = await client.query(`
        SELECT *
        FROM salons s
        JOIN salon_services ss ON s.id = ss.salon_id
        JOIN services sv ON ss.service_id = sv.id
        ORDER BY s.id
        OFFSET 0 LIMIT 5
      `);

      for (const row of sample.rows) {
        console.log(row);
      }
    }

    console.log("\nDone.");
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testDb();
