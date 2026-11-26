import type { MetadataRoute } from "next";
import { getCategories, getPublishedPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, cats] = await Promise.all([getPublishedPosts(), getCategories()]);
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly" },
    { url: `${SITE.url}/about` },
    ...cats.map((c) => ({ url: `${SITE.url}/category/${c.slug}` })),
    ...posts.map((p) => ({ url: `${SITE.url}/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
