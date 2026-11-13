"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { z } from "zod";
import { db } from "@/db";
import { post } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

const PostInput = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().max(120).optional(),
  excerpt: z.string().trim().max(400),
  content: z.string(),
  coverImage: z.string().trim().max(500).optional(),
  categorySlug: z.string().trim().optional(),
  published: z.boolean(),
});

function parse(form: FormData) {
  const raw = PostInput.parse({
    title: form.get("title"),
    slug: form.get("slug") || undefined,
    excerpt: form.get("excerpt") ?? "",
    content: form.get("content") ?? "",
    coverImage: form.get("coverImage") || undefined,
    categorySlug: form.get("categorySlug") || undefined,
    published: form.get("published") === "on",
  });
  return {
    ...raw,
    slug: slugify(raw.slug || raw.title, { lower: true, strict: true }),
    coverImage: raw.coverImage ?? null,
    categorySlug: raw.categorySlug ?? null,
  };
}

function refresh(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/${slug}`);
  revalidatePath("/category/[slug]", "page");
}

export async function savePost(id: number | null, form: FormData) {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
  const data = parse(form);
  if (id === null) {
    const [row] = await db
      .insert(post)
      .values({ ...data, publishedAt: data.published ? new Date() : null })
      .returning({ id: post.id });
    refresh(data.slug);
    redirect(`/admin/posts/${row.id}?saved=1`);
  }
  await db
    .update(post)
    .set({
      ...data,
      updatedAt: new Date(),
      publishedAt: data.published ? sql`coalesce(${post.publishedAt}, now())` : post.publishedAt,
    })
    .where(eq(post.id, id));
  refresh(data.slug);
  redirect(`/admin/posts/${id}?saved=1`);
}

export async function deletePost(id: number) {
  if (!(await requireAdmin())) throw new Error("Unauthorized");
  await db.delete(post).where(eq(post.id, id));
  refresh("");
  redirect("/admin");
}
