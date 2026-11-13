import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 300;
export const metadata: Metadata = { title: "Blog", description: "All articles on herbal teas and natural wellness." };

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-semibold md:text-4xl">The Herbal Essentials blog</h1>
      <p className="mt-3 max-w-2xl text-muted">Guides to herbal teas, essential oils and gentle everyday wellness.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  );
}
