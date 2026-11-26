# Herbal Essentials Pro

A clean rebuild of herbalessentialspro.com. It replaces the compromised WordPress site with:

- **Next.js 15** (App Router) and **Tailwind CSS v4**
- **Neon Postgres** through **Drizzle ORM**
- **Better Auth** (email and password) for the admin area

## What came from the October 19, 2026 backup

- The brand palette and fonts (Poppins, Bad Script) from the Elementor kit
- The post slugs, so old URLs keep working (`/chamomile-tea-benefits`, and so on)
- About 155 images from the old posts, in `public/uploads/`, at the same paths as before. Each one was checked to be a real image with no embedded PHP or script.

Nothing executable was carried over. The database was missing, so the article text in `content/posts/` was **newly written** for the original topics.

## Local setup

```bash
cp .env.example .env    # fill in DATABASE_URL, BETTER_AUTH_SECRET, ADMIN_EMAILS
npm install
npm run db:migrate      # create/upgrade tables; loads the 20 starter posts if the DB is empty
npm run dev
```

To manage content, go to `/sign-in`, choose **Create the admin account** with an email listed in `ADMIN_EMAILS`, and then use `/admin`.
Sign-up is closed to every other email unless `ALLOW_SIGNUP=true`.

## Database

| Command | What it does |
|---|---|
| `npm run db:migrate` | Applies the SQL migrations in `drizzle/`, then loads the starter posts **only if the `post` table is empty**. It's safe to run any time. |
| `npm run db:seed` | Re-imports `content/posts/*.md` and **overwrites** posts with the same slug, including edits made in `/admin`. |
| `npm run db:generate` | After changing `src/db/schema.ts`, writes a new migration file to `drizzle/`. Commit it. |

`npm run build` runs `db:migrate` first, so every Vercel deploy migrates the database automatically. The build skips migrations, with a warning, when `DATABASE_URL` is missing, or when `SKIP_DB_MIGRATE=1` is set. Set `SKIP_DB_MIGRATE=1` for Preview builds if they share the production database and you don't want them running migrations.

Pages read from the database on every request rather than at build time, so a build never needs a populated database.

## Routing notes (`src/middleware.ts`)

- `/YYYY/MM/DD/slug` redirects with a 301 to `/slug`, which was the old WordPress date permalink.
- `/hint/*`, `/humanityinternational/*`, `/wp-*` and any `*.php` path return **410 Gone**, so search engines drop the old phishing and spam URLs.

## Deploying (Vercel)

1. Import the repo. Under **Settings → Environment Variables**, add the following for Production (and Preview if you use it):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | The Neon **pooled** connection string (`…-pooler…neon.tech/neondb?sslmode=require`) |
   | `BETTER_AUTH_SECRET` | A random 32+ character string. Generate one with `openssl rand -base64 32` |
   | `BETTER_AUTH_URL` | Your live URL, e.g. `https://herbalessentialspro.com`. If you leave it out, Vercel's production URL is used. |
   | `ADMIN_EMAILS` | Comma-separated emails allowed to create admin accounts |
   | `NEXT_PUBLIC_SITE_URL` | Same as `BETTER_AUTH_URL`; used for the sitemap and canonical links |

2. Redeploy. The build creates the tables and loads the starter posts on the first deploy.
3. Before pointing DNS at the new site, rotate any credentials from the old host (DB, FTP/cPanel, WordPress admins), because the old server was compromised.
