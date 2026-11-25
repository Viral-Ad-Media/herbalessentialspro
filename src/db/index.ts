import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type DB = NeonHttpDatabase<typeof schema>;

/** True when DATABASE_URL points at a local Postgres (dev and tests). */
export function isLocalDatabase(url: string) {
  return /@(localhost|127\.0\.0\.1)[:/]/.test(url);
}

/**
 * Neon's HTTP driver in production; plain node-postgres for a local Postgres.
 * Both expose the same query-builder API, so the result is typed as the Neon one.
 */
export function createDb(url: string): DB {
  return (
    isLocalDatabase(url)
      ? drizzlePg(new Pool({ connectionString: url }), { schema })
      : drizzleNeon(neon(url), { schema })
  ) as DB;
}

let instance: DB | undefined;

function getDb(): DB {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    instance = createDb(url);
  }
  return instance;
}

/**
 * Created on first use rather than at import time, so `next build` can load
 * every module even when DATABASE_URL isn't available yet.
 */
export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
