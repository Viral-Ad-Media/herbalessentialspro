import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { category, post } from "@/db/schema";

export async function getPublishedPosts(limit?: number) {
  const q = db
    .select()
    .from(post)
    .where(eq(post.published, true))
    .orderBy(desc(post.publishedAt));
  return limit ? q.limit(limit) : q;
}

export async function getPostsByCategory(slug: string) {
  return db
    .select()
    .from(post)
    .where(and(eq(post.published, true), eq(post.categorySlug, slug)))
    .orderBy(desc(post.publishedAt));
}

export async function getPostBySlug(slug: string) {
  const rows = await db
    .select()
    .from(post)
    .where(and(eq(post.slug, slug), eq(post.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getCategories() {
  return db.select().from(category).orderBy(category.name);
}

export async function getCategory(slug: string) {
  const rows = await db.select().from(category).where(eq(category.slug, slug)).limit(1);
  return rows[0] ?? null;
}
