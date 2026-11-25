import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { getCategory, getPostsByCategory } from "@/lib/posts";

// Rendered per request: content lives in the database, which may not be reachable at build time.
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  return c ? { title: c.name, description: c.description ?? undefined } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const c = await getCategory(slug);
  if (!c) notFound();
  const posts = await getPostsByCategory(slug);
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-leaf-bright">Category</p>
      <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{c.name}</h1>
      {c.description && <p className="mt-3 max-w-2xl text-muted">{c.description}</p>}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      {posts.length === 0 && <p className="mt-10 text-muted">No articles here yet.</p>}
    </div>
  );
}
