/**
 * Applies the SQL migrations in ./drizzle, then loads the starter posts if the
 * database has none yet. Runs automatically before `next build` (see the
 * "build" script), and can be run on its own with `npm run db:migrate`.
 *
 * - No DATABASE_URL: skipped with a warning, so a build without a database
 *   still succeeds (pages are rendered per request).
 * - SKIP_DB_MIGRATE=1: skipped, e.g. for preview builds sharing a database.
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { migrate as migrateNeon } from "drizzle-orm/neon-http/migrator";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { createDb, isLocalDatabase } from "../src/db";
import { post } from "../src/db/schema";
import { seed } from "../src/db/seed-data";

const migrationsFolder = "./drizzle";

async function main() {
  const url = process.env.DATABASE_URL;
  if (process.env.SKIP_DB_MIGRATE === "1") {
    console.log("[db] SKIP_DB_MIGRATE=1, skipping migrations.");
    return;
  }
  if (!url) {
    console.warn("[db] DATABASE_URL is not set, skipping migrations.");
    return;
  }

  console.log("[db] Applying migrations…");
  if (isLocalDatabase(url)) {
    const pool = new Pool({ connectionString: url });
    await migratePg(drizzlePg(pool), { migrationsFolder });
    await pool.end();
  } else {
    await migrateNeon(drizzleNeon(neon(url)), { migrationsFolder });
  }

  const db = createDb(url);
  const [{ n }] = await db.select({ n: count() }).from(post);
  if (n === 0) {
    const seeded = await seed(db, { overwrite: false });
    console.log(`[db] Empty database: loaded ${seeded} starter posts.`);
  } else {
    console.log(`[db] Up to date (${n} posts).`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[db] Migration failed:", e);
    process.exit(1);
  });
