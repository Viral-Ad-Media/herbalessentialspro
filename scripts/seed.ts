/**
 * Seeds categories and posts from content/posts/*.md into the database.
 * Safe to re-run: posts are upserted by slug.
 *   npm run db:seed
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { sql } from "drizzle-orm";
import { db } from "../src/db";
import { category, post } from "../src/db/schema";

const categories = [
  { slug: "benefits", name: "Benefits", description: "What each herbal tea can (and can't) do for you." },
  { slug: "guides", name: "Guides", description: "Brewing, storing and choosing herbs." },
  { slug: "side-effects", name: "Side Effects", description: "Safety notes, interactions and who should skip what." },
  { slug: "wellness", name: "Wellness", description: "Sleep, stress, digestion and everyday routines." },
];

async function main() {
  await db.insert(category).values(categories).onConflictDoNothing();

  const dir = path.join(process.cwd(), "content/posts");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    const row = {
      slug: f.replace(/\.md$/, ""),
      title: String(data.title),
      excerpt: String(data.excerpt ?? ""),
      content: content.trim(),
      coverImage: data.cover ? String(data.cover) : null,
      categorySlug: data.category ? String(data.category) : null,
      published: data.published !== false,
      publishedAt: data.date ? new Date(data.date) : new Date(),
    };
    await db
      .insert(post)
      .values(row)
      .onConflictDoUpdate({
        target: post.slug,
        set: { ...row, updatedAt: sql`now()` },
      });
    console.log("seeded", row.slug);
  }
  console.log(`Done: ${files.length} posts.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
