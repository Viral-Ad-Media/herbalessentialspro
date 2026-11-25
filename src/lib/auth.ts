import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { db } from "@/db";
import * as schema from "@/db/schema";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// On Vercel, fall back to the URLs it provides when BETTER_AUTH_URL isn't set.
const vercelUrl = (host?: string) => (host ? `https://${host}` : undefined);
const baseURL =
  process.env.BETTER_AUTH_URL ?? vercelUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  vercelUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  vercelUrl(process.env.VERCEL_URL),
  vercelUrl(process.env.VERCEL_BRANCH_URL),
].filter((o): o is string => Boolean(o));

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    // Public sign-up is off by default; only emails in ADMIN_EMAILS may register.
    disableSignUp: process.env.ALLOW_SIGNUP !== "true" && adminEmails.length === 0,
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "reader", input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (u) => {
          const isAdmin = adminEmails.includes(u.email.toLowerCase());
          if (!isAdmin && process.env.ALLOW_SIGNUP !== "true") {
            throw new Error("Sign-up is restricted");
          }
          return { data: { ...u, role: isAdmin ? "admin" : "reader" } };
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s || (s.user as { role?: string }).role !== "admin") return null;
  return s;
}
