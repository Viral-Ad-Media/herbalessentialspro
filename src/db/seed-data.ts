import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { sql } from "drizzle-orm";
import type { DB } from "./index";
import { category, post } from "./schema";

export const CATEGORIES = [
  { slug: "benefits", name: "Benefits", description: "What each herbal tea can (and can't) do for you." },
  { slug: "guides", name: "Guides", description: "Brewing, storing and choosing herbs." },
  { slug: "side-effects", name: "Side Effects", description: "Safety notes, interactions and who should skip what." },
  { slug: "wellness", name: "Wellness", description: "Sleep, stress, digestion and everyday routines." },
];

function readPosts() {
  const dir = path.join(process.cwd(), "content/posts");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        title: String(data.title),
        excerpt: String(data.excerpt ?? ""),
        content: content.trim(),
        coverImage: data.cover ? String(data.cover) : null,
        categorySlug: data.category ? String(data.category) : null,
        published: data.published !== false,
        publishedAt: data.date ? new Date(data.date) : new Date(),
      };
    });
}

/**
 * Loads categories and the posts in content/posts.
 * `overwrite: true` replaces posts with the same slug (manual `npm run db:seed`);
 * `false` only inserts missing ones, so edits made in /admin are kept.
 */
export async function seed(db: DB, { overwrite }: { overwrite: boolean }) {
  await db.insert(category).values(CATEGORIES).onConflictDoNothing();
  const rows = readPosts();
  for (const row of rows) {
    const q = db.insert(post).values(row);
    await (overwrite
      ? q.onConflictDoUpdate({ target: post.slug, set: { ...row, updatedAt: sql`now()` } })
      : q.onConflictDoNothing());
  }
  return rows.length;
}
