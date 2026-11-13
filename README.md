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
npm run db:push         # create tables in Neon
npm run db:seed         # load categories + the 20 posts from content/posts
npm run dev
```

To manage content, go to `/sign-in`, choose **Create the admin account** with an email listed in `ADMIN_EMAILS`, and then use `/admin`.
Sign-up is closed to every other email unless `ALLOW_SIGNUP=true`.

## Routing notes (`src/middleware.ts`)

- `/YYYY/MM/DD/slug` redirects with a 301 to `/slug`, which was the old WordPress date permalink.
- `/hint/*`, `/humanityinternational/*`, `/wp-*` and any `*.php` path return **410 Gone**, so search engines drop the old phishing and spam URLs.

## Deploying (Vercel)

1. Import the repo and set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your domain), `ADMIN_EMAILS` and `NEXT_PUBLIC_SITE_URL`.
2. Run `npm run db:push && npm run db:seed` once against the Neon database.
3. Before pointing DNS at the new site, rotate any credentials from the old host (DB, FTP/cPanel, WordPress admins), because the old server was compromised.
