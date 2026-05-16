import * as dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ Error: DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  console.log("⏳ Testing database connection...");
  
  const sql = postgres(connectionString, { max: 1 });

  try {
    const result = await sql`SELECT 1 as connected`;
    if (result[0]?.connected === 1) {
      console.log("✅ Success! Database is reachable.");
    }
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

testConnection();
