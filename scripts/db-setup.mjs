// Creates the tables and loads the launch catalogue into Neon.
// Usage: node --env-file=.env.local scripts/db-setup.mjs
import { readFile } from "node:fs/promises";
import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run with --env-file=.env.local");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  for (const file of ["db/schema.sql", "db/seed.sql"]) {
    await pool.query(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
    console.log(`✓ ${file}`);
  }
  const { rows } = await pool.query("select count(*)::int as n from products");
  console.log(`products in database: ${rows[0].n}`);
} finally {
  await pool.end();
}
