import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

/**
 * Neon's HTTP driver in production; plain node-postgres when pointing at a
 * local Postgres (localhost / 127.0.0.1) for development and tests.
 */
const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);

// Both drivers expose the same query-builder API; type as the production one.
export const db = (
  isLocal
    ? drizzlePg(new Pool({ connectionString: url }), { schema })
    : drizzleNeon(neon(url), { schema })
) as NeonHttpDatabase<typeof schema>;
